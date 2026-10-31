import { offlineFirebaseScript } from "./offline-firebase.mjs";
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {createDevServer} from '../tools/dev-server.mjs';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
const server=createDevServer({offline:true});await new Promise(r=>server.listen(0,'127.0.0.1',r));
let browser;
try {
 browser=await chromium.launch({headless:true});
 const results=[];
 for(const timezoneId of ['Asia/Bangkok','Asia/Singapore','America/New_York']){
  const context=await browser.newContext({timezoneId});
  await context.addInitScript(offlineFirebaseScript);
  await context.route('**/*',route=> {
   const url=route.request().url();
   if(url.endsWith('/firebase-config.js'))return route.fulfill({contentType:'application/javascript',body:'window.BOSS_TIMELINE_FIREBASE={databaseURL:"https://firebase.invalid"};'});
   if(url.includes('gstatic.com/firebasejs'))return route.fulfill({contentType:'application/javascript',body:''});
   return /firebaseio|firebasedatabase|identitytoolkit|securetoken|discord\.com/.test(url)?route.abort():route.continue();
  });
  const page=await context.newPage();await page.goto(`http://127.0.0.1:${server.address().port}`,{waitUntil:'networkidle'});
  const result=await page.evaluate(async()=>{
   const now=Date.now();
   const stale=normalizeBoss({id:'cross-device',name:'Cross device',spawnMode:'interval',diedAt:now-7200000,respawnsAt:now-3600000,revision:0});
   state={bosses:[stale],history:[]};bossSyncBase=cloneRealtimeValue(state);
   firebaseAuth={currentUser:{uid:'test',displayName:'Test'}};currentUserIsAdmin=true;firebaseAuthReady=true;
   bossSnapshotApplied=false;firebaseRealtimeConnected=true;
   currentRole='admin';
   await autoResolveRespawns();
   const unchanged=state.bosses[0].diedAt===stale.diedAt&&state.bosses[0].respawnsAt===stale.respawnsAt;
   const remote=normalizeBoss({...stale,diedAt:now-60000,respawnsAt:now+3600000});
   applyRemoteState([remote],[],new Date(now).toISOString(),'company',bossSyncBase,500);
   return {unchanged,received:state.bosses[0].diedAt===remote.diedAt&&state.bosses[0].respawnsAt===remote.respawnsAt,
    status:getBossStatus(state.bosses[0],now),fixed:getNextFixedSpawnTime({spawnMode:'fixed',fixedSchedules:[{day:'all',time:'18:00'}]},Date.parse('2026-10-31T10:00:00Z')),
    displayed:formatTimeOnly(Date.parse('2026-10-31T11:00:00Z'))};
  });
  assert.equal(result.unchanged,true);assert.equal(result.received,true);assert.equal(result.status,'respawning');
  assert.equal(result.fixed,Date.parse('2026-10-31T11:00:00Z'));assert.equal(result.displayed,'18:00');
  const ids = await page.evaluate(async()=>{
    await createNewServer('Temporary A',true);const first=currentServerId;
    await deleteServer(first);
    await createNewServer('Temporary B',true);return [first,currentServerId];
  });
  assert.notEqual(ids[0],ids[1]);
  results.push({timezoneId,...result,serverIdsNeverReused:true});await context.close();
 }
 console.log(JSON.stringify({passed:results.length,results},null,2));
} finally {await browser?.close();await new Promise(r=>server.close(r));}
