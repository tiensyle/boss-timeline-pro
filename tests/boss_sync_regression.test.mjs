// Place this file in boss-timeline-pro-main/tests/boss_sync_regression.test.mjs
// Run: node --test tests/boss_sync_regression.test.mjs
// All four tests are EXPECTED TO FAIL on the uploaded (4) release.
import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
const source = readFileSync(new URL('../assets/app.js', import.meta.url), 'utf8');
const copy = value => JSON.parse(JSON.stringify(value));
function load(names, globals = {}) {
  const ctx = vm.createContext({ console, Date, ...globals });
  for (const name of names) {
    const match = new RegExp(`^    (?:async )?function ${name}\\(`, 'm').exec(source);
    assert.ok(match, `Missing ${name}`);
    const end = source.indexOf('\n    }', match.index) + 6;
    vm.runInContext(source.slice(match.index, end), ctx);
  }
  return ctx;
}

test('reset-all is atomic when another admin ADDS a boss concurrently', () => {
  const base = { bosses: [{id:'a',revision:1,diedAt:100,respawnsAt:200}],history:[] };
  const local = copy(base);
  Object.assign(local.bosses[0], {revision:2,diedAt:null,respawnsAt:null,lastRespawnAt:300});
  local.history = [{id:'reset',bossId:'all',type:'respawn',time:300}];
  const remote = copy(base);
  remote.bosses.push({id:'b',revision:1,diedAt:150,respawnsAt:250});
  const ctx = load(['cloneRealtimeValue','mergeRealtimeChanges','mergeBossStateChanges'], {lastBossConflictIds:[]});
  const merged = copy(ctx.mergeBossStateChanges(base,local,remote));
  // Must abort the reset, or otherwise reset every boss (including B) atomically.
  assert.equal(merged.history.some(ev=>ev.bossId==='all' && ev.type==='respawn'), false,
    'ALL BOSSES history was written while a newly added boss remains dead');
});

test('offline deletion conflict is included in rejected-operations report', () => {
  const base = {bosses:[{id:'a',name:'Boss A',revision:1,notes:'old'}],history:[]};
  const local = {bosses:[],history:[]}; // deleted while offline
  const remote = {bosses:[{id:'a',name:'Boss A',revision:2,notes:'updated elsewhere'}],history:[]};
  const saved = [];
  const ctx=load(['cloneRealtimeValue','mergeRealtimeChanges','mergeBossStateChanges','reportRejectedBossOperations'], {
    lastBossConflictIds:[], STORAGE_KEY:'test',currentServerId:'s1',getNow:()=>999,
    localStorage:{setItem:(k,v)=>saved.push([k,v])}, showToast:()=>{},showConfirmModal:()=>{},
    escapeHtml:String,formatFullDateTime:String
  });
  ctx.mergeBossStateChanges(base,local,remote);
  assert.deepEqual(copy(ctx.lastBossConflictIds), ['a']);
  ctx.reportRejectedBossOperations(copy(ctx.lastBossConflictIds),local);
  assert.ok(saved.some(([k])=>k.endsWith('.rejectedOperations')),
    'A rejected delete has no Boss object in attemptedState, so it is silently omitted');
});

test('10-minute Discord alert cannot be triggered by an unconfirmed local death', () => {
  const now=10_000_000;
  const alerts=[];
  const ctx=load(['checkBossSoundAlerts'],{
    isSoundEnabled:false,discordConfig:{enabled:true},activeSoundNotified:{},
    state:{bosses:[{id:'a',name:'Boss',spawnMode:'interval',diedAt:now,respawnsAt:now+9*60_000,revision:2}]},
    notifyBossAlert:(_,kind)=>alerts.push(kind)
  });
  // This check runs during render() before killBoss/confirmOffsetDeath await saveState().
  ctx.checkBossSoundAlerts(now);
  assert.deepEqual(alerts, [], 'Discord alert can be sent before Firebase acknowledges this edit');
});

test('mixed boss conflicts produce per-boss delivery results, not false failure for saved B', async () => {
  const base={bosses:[{id:'a',revision:1,notes:'A'},{id:'b',revision:1,notes:'B'}],history:[]};
  const local=copy(base);
  Object.assign(local.bosses[0],{revision:2,notes:'local A'});
  Object.assign(local.bosses[1],{revision:2,notes:'local B'});
  let remote={version:4,data:{bosses:[{id:'a',revision:2,notes:'remote A'},copy(base.bosses[1])],history:[],version:4}};
  const ctx=load(['cloneRealtimeValue','mergeRealtimeChanges','mergeBossStateChanges','getBossRemoteData','getChangedBossIds','enqueueBossSaveWaiter','discardConflictedQueuedBossChanges','applyRemoteState','saveState'],{
    state:local,bossSyncBase:copy(base),isAdmin:()=>true,REALTIME_ENABLED:true,firebaseAuthReady:true,
    stateDbRef:{transaction:update=>{remote=update(remote);return Promise.resolve({committed:true,snapshot:{val:()=>remote}})}},
    normalizeBoss:copy,getNow:()=>1000,saveStateLocal:()=>{},render:()=>{},setRealtimeStatus:()=>{},showToast:()=>{},
    lastLocalEditTime:0,lastRemoteUpdatedAt:0,lastRenderedGridKey:'',remoteStateReady:true,remoteSaveInFlight:false,pendingRemoteSave:false,
    bossSyncGeneration:1,bossDeferredRemoteData:null,CLIENT_ID:'test',lastBossConflictIds:[],
    pendingBossSaveWaiters:[],activeBossSaveWaiters:new Set(),broadcastConfirmedBossState:()=>{},
    reportRejectedBossOperations:()=>{},lastAppliedBossVersion:0,activeBossTransactionLocal:null,lastReportedBossConflictKey:''
  });
  const result=await ctx.saveState();
  assert.equal(remote.data.bosses.find(b=>b.id==='b').notes,'local B');
  assert.notEqual(result,'conflict', 'The combined result hides successful persistence of Boss B; return per-Boss results');
});

test('renaming one server must not remove a server added by another admin', async () => {
  const localList=[{id:'s1',name:'One'},{id:'s2',name:'Two'}];
  let remoteList=[{id:'s1',name:'One'},{id:'s2',name:'Two'},{id:'s3',name:'New from admin B'}];
  const ctx=load(['renameServer'],{
    isAdmin:()=>true,serverList:localList,STORAGE_SERVERS_KEY:'servers',
    localStorage:{setItem(){}},firebaseDb:{ref:()=>({set:value=>{remoteList=copy(value);return Promise.resolve();}})},
    renderServerListUI:()=>{},showToast:()=>{}
  });
  await ctx.renameServer('s2','Renamed by admin A');
  assert.ok(remoteList.some(server=>server.id==='s3'), 'Full-array .set(serverList) deletes remote-only server s3');
});

