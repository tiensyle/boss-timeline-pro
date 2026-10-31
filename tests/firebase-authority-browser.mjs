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
let writes=0;
const pages=[];
const notify=async paths=>{await Promise.all(pages.map(page=>page.evaluate(paths=>window.__emitDatabase?.(paths),paths).catch(()=>{})))};
const mockSdk=`(() => {
 const listeners=new Map();
 const snapshot=value=>({val:()=>structuredClone(value),exists:()=>value!==null});
 function ref(path='') {path=path.replace(/^\\/+|\\/+$/g,'');return {
  child:key=>ref(path+'/'+key),
  on(event,callback){if(!listeners.has(path))listeners.set(path,new Set());listeners.get(path).add(callback);window.__dbRead(path).then(value=>{if(listeners.get(path)?.has(callback))callback(snapshot(value))});},
  off(){listeners.delete(path)},
  once:async()=>snapshot(await window.__dbRead(path)),
  async transaction(update,_completion,applyLocally){
   if(applyLocally!==false) throw Error('Transactions must disable optimistic Firebase listener events');
   for(let attempt=0;attempt<20;attempt++){
    const current=await window.__dbRead(path);const next=update(structuredClone(current));
    if(next===undefined)return {committed:false,snapshot:snapshot(current)};
    const result=await window.__dbCAS({path,expected:JSON.stringify(current),next});
    if(result.ok)return {committed:true,snapshot:snapshot(result.value)};
   } throw Error('Mock transaction retries exceeded');
  },
  async set(value){await window.__dbSet({path,value})},remove:async()=>{throw Error('Unexpected automatic deletion')}
 }}
 window.__emitDatabase=async paths=>{for(const [path,callbacks] of [...listeners])if(paths.some(changed=>!changed||path===changed||path.startsWith(changed+'/')||changed.startsWith(path+'/'))){const value=await window.__dbRead(path);for(const callback of [...callbacks])if(listeners.get(path)?.has(callback))await callback(snapshot(value));}};
 const user={uid:'test-admin',email:'admin@example.invalid',displayName:'Test Admin',getIdTokenResult:async()=>({claims:{admin:true}}),getIdToken:async()=> 'offline-test-token'};
 const auth={currentUser:user,onAuthStateChanged(callback){window.__repeatAuth=()=>callback(user);queueMicrotask(()=>callback(user));}};
 window.firebase={apps:[],initializeApp:()=>({}),app:()=>({}),auth:()=>auth,database:()=>({ref})};
})();`;
const server=createDevServer({offline:false});await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
try {
 browser=await chromium.launch({headless:true});
 const checks=[];const errors=[];
 for(const timezoneId of ['Asia/Bangkok','America/New_York']){
  const context=await browser.newContext({timezoneId});
  const page=await context.newPage();pages.push(page);page.on('pageerror',e=>errors.push(e.message));
  await page.exposeFunction('__dbRead',path=>copy(read(path)));
  await page.exposeFunction('__dbCAS',async({path,expected,next})=>{
   if(JSON.stringify(read(path))!==expected)return {ok:false};put(path,next);writes++;await notify([path]);return {ok:true,value:copy(next)};
  });
  await page.exposeFunction('__dbSet',async({path,value})=>{put(path,value);writes++;await notify([path]);});
  await page.addInitScript(()=>{
   localStorage.setItem('bossTimelinePro.v1_s1',JSON.stringify({bosses:[{id:'stale',name:'STALE CHROME DATA',diedAt:null}],history:[{id:'stale-event'}]}));
   localStorage.setItem('bossTimelinePro.v1_s1.syncBase',localStorage.getItem('bossTimelinePro.v1_s1'));
   localStorage.setItem('bossTimelinePro.servers',JSON.stringify([{id:'ghost',name:'Cached-only server'}]));
  });
  await context.route('**/*',route=>{
   const url=route.request().url();
   if(url.includes('firebase-app-compat.js'))return route.fulfill({contentType:'application/javascript',body:mockSdk});
   if(url.includes('gstatic.com/firebasejs'))return route.fulfill({contentType:'application/javascript',body:''});
   if(url.endsWith('/firebase-config.js'))return route.fulfill({contentType:'application/javascript',body:'window.BOSS_TIMELINE_FIREBASE={databaseURL:"https://firebase.invalid"};'});
   if(/firebaseio|firebasedatabase|identitytoolkit|securetoken|discord\.com|\/api\/discord/.test(url))return route.abort();
   return route.continue();
  });
  await page.goto(`http://127.0.0.1:${server.address().port}/?sv=s1`,{waitUntil:'networkidle'});
  await page.waitForFunction(()=>bossSnapshotApplied&&serverListReady&&isAdmin());
  assert.deepEqual(await page.evaluate(()=>state.bosses.map(b=>b.id)),['a','b']);
  assert.deepEqual(await page.evaluate(()=>serverList.map(s=>s.id)),['s1']);
 }
 assert.equal(writes,0);checks.push('Two Admins adopt Firebase instead of their different Chrome caches, without startup writes');
 const [a,b]=pages;
 const death=now-600000;
 assert.equal(await a.evaluate(time=>killBoss('a',time),death),undefined);
 await b.waitForFunction(time=>state.bosses.find(b=>b.id==='a').diedAt===time,death);
 assert.deepEqual(await a.evaluate(()=>state.history),await b.evaluate(()=>state.history));
 checks.push('Death timer and event history propagate between independent Admin sessions');
 await Promise.all([a.evaluate(async()=>{state.bosses.find(b=>b.id==='a').notes='Edited A';touchBossRevision(state.bosses.find(b=>b.id==='a'));return saveState();}),b.evaluate(async()=>{state.bosses.find(b=>b.id==='b').notes='Edited B';touchBossRevision(state.bosses.find(b=>b.id==='b'));return saveState();})]);
 for(const page of pages)await page.waitForFunction(()=>state.bosses.find(b=>b.id==='a').notes==='Edited A'&&state.bosses.find(b=>b.id==='b').notes==='Edited B');
 checks.push('Concurrent edits of different bosses are both preserved');
 assert.equal(await a.evaluate(()=>renameServer('s1','Renamed shared server')),true);
 await b.waitForFunction(()=>serverList[0].name==='Renamed shared server');checks.push('Server renames propagate and registry migration preserves all items');
 assert.equal(await a.evaluate(()=>createNewServer('New shared server',true)),true);
 const newId=await a.evaluate(()=>currentServerId);
 await b.waitForFunction(id=>serverList.some(s=>s.id===id),newId);
 await b.evaluate(id=>switchServer(id),newId);
 await b.waitForFunction(()=>bossSnapshotApplied&&state.bosses.length===2);
 assert.equal(await a.evaluate(id=>deleteServer(id),newId),true);
 await b.waitForFunction(()=>currentServerId==='s1'&&bossSnapshotApplied);
 checks.push('Server creation, switching and deletion synchronize without ghost cached servers');
 database={};const before=writes;await notify(['']);
 for(const page of pages)await page.waitForFunction(()=>serverList.length===0&&state.bosses.length===0&&!bossSnapshotApplied);
 for(const page of pages){await page.evaluate(()=>window.__repeatAuth());await page.reload({waitUntil:'networkidle'});await page.waitForFunction(()=>serverListReady&&serverList.length===0&&!bossSnapshotApplied);}
 assert.equal(writes,before);assert.deepEqual(database,{});
 checks.push('Deleting the database, restoring Admin auth and reopening both browsers produce zero automatic writes');
 for(const page of pages)assert.equal(await page.evaluate(()=>document.getElementById('bossDataNotice').hidden),false);
 assert.deepEqual(errors,[]);console.log(JSON.stringify({passed:checks.length,checks,writes,errors},null,2));
} finally {await browser?.close();await new Promise(r=>server.close(r));}
