import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {createDevServer} from '../tools/dev-server.mjs';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
const copy=v=>v===undefined?null:JSON.parse(JSON.stringify(v));
const now=Date.now();
let database={boss_timeline_servers_list:[{id:'s1',name:'Shared server',icon:'🌐'}],boss_timeline_state:{version:1,data:{version:1,syncProtocol:2,syncEpoch:'shared-test-epoch',bosses:[
 {id:'a',name:'ALPHA',map:'Test',respawnMinutes:60,spawnMode:'interval',revision:1,diedAt:now-60000,respawnsAt:now+3540000,updatedAt:now,updatedBy:'test'},
 {id:'b',name:'BETA',map:'Test',respawnMinutes:60,spawnMode:'interval',revision:1,diedAt:now-60000,respawnsAt:now+3540000,updatedAt:now,updatedBy:'test'}],history:[]}},boss_timeline_discord_config:{enabled:false}};
const read=path=>path==='.info/connected'?true:path==='.info/serverTimeOffset'?0:path.split('/').filter(Boolean).reduce((v,k)=>v?.[k],database)??null;
const put=(path,value)=>{const keys=path.split('/').filter(Boolean);let node=database;for(const key of keys.slice(0,-1))node=node[key]??={};node[keys.at(-1)]=copy(value)};
database.boss_timeline_attendance_global={version:1,activeWeekId:'w',weeks:[{id:'w',name:'Shared',activities:[],members:[],diasPool:0,usdtPool:0}]};
let writes=0;
const pages=[];
const notify=async paths=>{await Promise.all(pages.map(page=>page.evaluate(paths=>window.__emitDatabase?.(paths),paths).catch(()=>{})))};
const mockSdk=`(() => {
 const listeners=new Map();
 const completePaths=new Set();
 const snapshot=value=>({val:()=>structuredClone(value),exists:()=>value!==null});
 function ref(path='') {path=path.replace(/^\\/+|\\/+$/g,'');return {
  child:key=>ref(path+'/'+key),
  on(event,callback){if(!listeners.has(path))listeners.set(path,new Set());listeners.get(path).add(callback);window.__dbRead(path).then(value=>{if(listeners.get(path)?.has(callback))callback(snapshot(value))});},
  off(){listeners.delete(path)},
  once:async()=>{const value=await window.__dbRead(path);completePaths.add(path);return snapshot(value)},
  async transaction(update,_completion,applyLocally){
   for(let attempt=0;attempt<20;attempt++){
    const current=await window.__dbRead(path);const next=update(structuredClone(current));
    if(next===undefined)return {committed:false,snapshot:snapshot(current)};
    const result=await window.__dbCAS({path,expected:JSON.stringify(current),next});
    if(result.ok)return {committed:true,snapshot:snapshot(result.value)};
   } throw Error('Mock transaction retries exceeded');
  },
  async update(patch){await window.__dbSet({path,value:{...await window.__dbRead(path),...patch}})},async set(value){await window.__dbSet({path,value})},remove:async()=>{throw Error('Unexpected automatic deletion')}
 }}
 window.__emitDatabase=async paths=>{for(const [path,callbacks] of [...listeners])if(paths.some(changed=>!changed||path===changed||path.startsWith(changed+'/')||changed.startsWith(path+'/'))){const value=await window.__dbRead(path);for(const callback of [...callbacks])if(listeners.get(path)?.has(callback))await callback(snapshot(value));}};
 const user={uid:'test-admin',email:'admin@example.invalid',displayName:'Test Admin',getIdTokenResult:async()=>({claims:{admin:true}}),getIdToken:async()=> 'offline-test-token'};
 const auth={currentUser:user,onAuthStateChanged(callback){window.__repeatAuth=()=>callback(user);queueMicrotask(()=>callback(user));}};
 window.firebase={apps:[],initializeApp:()=>({}),app:()=>({}),auth:()=>auth,database:()=>({ref})};
})();`;
const server=createDevServer({offline:false});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
let browser;
const errors=[];
try {
 browser=await chromium.launch({headless:true});
 for(let i=0;i<4;i++) {
  const context=await browser.newContext({timezoneId:i%2?'America/New_York':'Asia/Bangkok'});
  const page=await context.newPage();pages.push(page);
  page.on('pageerror',error=>errors.push(error.message));
  await page.exposeFunction('__dbRead',path=>copy(read(path)));
  await page.exposeFunction('__dbCAS',async({path,expected,next})=>{
   if(JSON.stringify(read(path))!==expected)return {ok:false};
   put(path,next);writes++;await notify([path]);return {ok:true,value:copy(next)};
  });
  await page.exposeFunction('__dbSet',async({path,value})=>{put(path,value);writes++;await notify([path]);});
  await context.route('**/*',route=>{
   const url=route.request().url();
   if(url.includes('firebase-app-compat.js'))return route.fulfill({contentType:'application/javascript',body:mockSdk.replace("uid:'test-admin'",`uid:'admin-${i}'`)});
   if(url.includes('gstatic.com/firebasejs'))return route.fulfill({contentType:'application/javascript',body:''});
   if(url.endsWith('/firebase-config.js'))return route.fulfill({contentType:'application/javascript',body:'window.BOSS_TIMELINE_FIREBASE={databaseURL:"https://firebase.invalid"};'});
   if(/firebaseio|firebasedatabase|identitytoolkit|securetoken|discord\.com|\/api\/discord/.test(url))return route.abort();
   return route.continue();
  });
  await page.goto(`http://127.0.0.1:${server.address().port}/?sv=s1`,{waitUntil:'networkidle'});
  await page.waitForFunction(()=>remoteStateReady&&isAdmin()&&state.bosses.some(b=>b.id==='a')&&attendanceRemoteStateReady);
 }
 const checks=[];
 await pages[0].evaluate(async()=>{
  const boss=state.bosses.find(b=>b.id==='a');
  Object.assign(boss,{points:8,notes:'Shared note',map:'Shared map',level:99});
  touchBossRevision(boss);return saveState();
 });
 for(const page of pages)await page.waitForFunction(()=>{
  const b=state.bosses.find(b=>b.id==='a');
  return b.points===8&&b.notes==='Shared note'&&b.map==='Shared map'&&b.level===99;
 });
 checks.push('Points, notes, level and map propagate to four independent admin browsers');
 await Promise.all(pages.slice(0,2).map((page,i)=>page.evaluate(async i=>{
  const boss=state.bosses.find(b=>b.id==='a');
  if(i===0)boss.points=12;else boss.notes='Concurrent note';
  touchBossRevision(boss);return saveState();
 },i)));
 for(const page of pages)await page.waitForFunction(()=>state.bosses.find(b=>b.id==='a').points===12&&state.bosses.find(b=>b.id==='a').notes==='Concurrent note');
 checks.push('Simultaneous independent edits of one boss converge');
 await pages[1].evaluate(async()=>{await killBoss('a',Date.now()-120000)});
 for(const page of pages)await page.waitForFunction(()=>state.history.some(h=>h.bossId==='a'));
 assert.deepEqual(await pages[0].evaluate(()=>state.history),await pages[3].evaluate(()=>state.history));
 checks.push('Timer transitions and history propagate');
 await pages[2].evaluate(()=>renameServer('s1','Guild shared'));
 for(const page of pages)await page.waitForFunction(()=>serverList.find(s=>s.id==='s1').name==='Guild shared');
 checks.push('Server rename propagates');
 await pages[0].evaluate(()=>saveDiscordConfigLocal({...discordConfig,tagEveryone:true}));
 for(const page of pages)await page.waitForFunction(()=>discordConfig.tagEveryone===true);
 checks.push('Shared Discord settings propagate');
 await pages[0].evaluate(async()=>{getActiveWeek().diasPool=12345;saveAttendanceState(attendanceState);});
 for(const page of pages)await page.waitForFunction(()=>getActiveWeek().diasPool===12345);
 await pages[3].evaluate(async()=>{getActiveWeek().usdtPool=456;saveAttendanceState(attendanceState);});
 for(const page of pages)await page.waitForFunction(()=>getActiveWeek().diasPool===12345&&getActiveWeek().usdtPool===456);
 checks.push('Attendance changes from different admins propagate');
 await pages[0].evaluate(async()=>{state.bosses=state.bosses.filter(b=>b.id!=='b');return saveState();});
 for(const page of pages)await page.waitForFunction(()=>!state.bosses.some(b=>b.id==='b'));
 await pages[3].reload({waitUntil:'networkidle'});
 await pages[3].waitForFunction(()=>remoteStateReady&&isAdmin()&&state.bosses.find(b=>b.id==='a')?.points===12&&!state.bosses.some(b=>b.id==='b'));
 checks.push('Deletion and persisted changes survive reopening a browser');
 await pages[0].evaluate(()=>createNewServer('Shared new server',true));
 const newId=await pages[0].evaluate(()=>currentServerId);
 assert.notEqual(newId,'s1');
 for(const page of pages)await page.waitForFunction(id=>serverList.some(s=>s.id===id),newId);
 await pages[0].evaluate(id=>deleteServer(id),newId);
 for(const page of pages)await page.waitForFunction(id=>!serverList.some(s=>s.id===id),newId);
 checks.push('Server creation and deletion propagate');
 // Switch one independent session from owner to an approved secondary account.
 put('admin_access/admin-1',{active:true,email:'secondary@example.invalid',name:'Admin phụ thử nghiệm',
  approvedAt:now,approvedBy:'admin-0',permissions:{bosses:'view',attendance:'view',servers:'view',discord:'none'}});
 await pages[1].evaluate(async()=>{
  firebaseAuth.currentUser.getIdTokenResult=async()=>({claims:{}});
  await window.__repeatAuth();
 });
 await pages[1].waitForFunction(()=>isAdmin()&&!currentUserIsSuperAdmin&&!isAdmin('bosses'));
 assert.equal(await pages[1].locator('#addBossBtn').isVisible(),false);
 const beforeWrites=writes;
 await pages[1].evaluate(async()=>{await killBoss('a');await renameServer('s1','Unauthorized rename');saveDiscordConfigLocal({...discordConfig,tagEveryone:false});});
 assert.equal(writes,beforeWrites,'read-only admin cannot use direct action handlers to write');
 checks.push('Read-only secondary admin has no edit controls or direct-handler writes');
 await pages[0].evaluate(()=>openAdminAccModal());
 const form=pages[0].locator('form[data-permissions-uid="admin-1"]');
 await form.locator('..').locator('summary').click();
 await form.locator('[name=bosses]').selectOption('none');
 await form.locator('[name=attendance]').selectOption('edit');
 await form.locator('button[type=submit]').click();
 await pages[1].waitForFunction(()=>!canViewAdminArea('bosses')&&isAdmin('attendance'));
 assert.equal(await pages[1].locator('#bossGrid').isVisible(),false);
 assert.equal(await pages[1].evaluate(()=>state.bosses.length),0);
 await pages[1].evaluate(()=>{getActiveWeek().diasPool=999;saveAttendanceState(attendanceState);});
 await pages[2].waitForFunction(()=>getActiveWeek().diasPool===999);
 checks.push('Owner permission form saves and changes another active session immediately');
 await form.locator('[name=attendance]').selectOption('none');
 await form.locator('[name=bosses]').selectOption('view');
 await form.locator('button[type=submit]').click();
 await pages[1].waitForFunction(()=>canViewAdminArea('bosses')&&!canViewAdminArea('attendance'));
 await pages[1].waitForFunction(()=>state.bosses.some(b=>b.id==='a'));
 await pages[1].evaluate(()=>switchPageView('attendance'));
 assert.equal(await pages[1].locator('#attendanceContent').isVisible(),false);
 checks.push('Restored Boss viewing reconnects while denied attendance stays hidden');
 if(process.env.BOSS_TIMELINE_TEST_OUTPUT) {
  const {mkdir}=await import('node:fs/promises');
  await mkdir(process.env.BOSS_TIMELINE_TEST_OUTPUT,{recursive:true});
  await pages[0].locator('#adminAccountModal .modal').screenshot({path:process.env.BOSS_TIMELINE_TEST_OUTPUT+'/admin-permissions.png'});
 }
 assert.deepEqual(errors,[]);
 console.log(JSON.stringify({passed:checks.length,checks,writes,errors},null,2));
} finally {await browser?.close();await new Promise(r=>server.close(r));}
