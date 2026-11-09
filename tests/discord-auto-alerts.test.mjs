import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../assets/app.js',import.meta.url),'utf8');
const a=source.indexOf('    const discordMilestoneRetryAt =');
const end=source.indexOf('\n    function ',source.indexOf('    function checkBossDiscordAlerts(',a)+10);
function setup(){
 let clock=1000000,admin=false,success=false,calls=[];
 const ctx=vm.createContext({Date:{now:()=>clock},Map,discordConfig:{enabled:true},currentServerId:'s1',discordBossMilestones:{},isAdmin:()=>admin,
 sendDiscordBossAlert:async(...args)=>{calls.push(args);return success;},state:{bosses:[],history:[]},getPreviousFixedSpawnTime:()=>clock-1000,getNextFixedSpawnTime:()=>clock+3600000});
 vm.runInContext(source.slice(a,end),ctx);
 return {ctx,calls,setAdmin:v=>admin=v,setSuccess:v=>success=v,advance:()=>clock+=31000,now:()=>clock};
}
test('member does not consume milestone; failed delivery retries and success stops duplicates',async()=>{
 const s=setup(),boss={id:'b'};
 s.ctx.deliverBossDiscordMilestone(boss,'0m',123);assert.equal(s.calls.length,0);
 s.setAdmin(true);s.ctx.deliverBossDiscordMilestone(boss,'0m',123);await new Promise(setImmediate);
 assert.equal(s.ctx.discordBossMilestones.b_123_0m,undefined);
 s.ctx.deliverBossDiscordMilestone(boss,'0m',123);assert.equal(s.calls.length,1);
 s.advance();s.setSuccess(true);s.ctx.deliverBossDiscordMilestone(boss,'0m',123);await new Promise(setImmediate);
 s.ctx.deliverBossDiscordMilestone(boss,'0m',123);assert.equal(s.calls.length,2);
});
test('fixed boss without death and remotely resolved interval boss both notify on spawn',async()=>{
 const s=setup();s.setAdmin(true);s.setSuccess(true);
 s.ctx.state.bosses=[{id:'fixed',spawnMode:'fixed'},{id:'interval',lastRespawnAt:s.now()-2000}];
 s.ctx.state.history=[{bossId:'interval',type:'respawn',source:'automatic',time:s.now()-2000}];
 s.ctx.checkBossDiscordAlerts(s.now());await new Promise(setImmediate);
 assert.equal(s.calls.length,2);assert.ok(s.calls.every(call=>call[1]==='0m'));
});

