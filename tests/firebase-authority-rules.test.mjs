import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
const rules=JSON.parse(readFileSync(new URL('../database.rules.json',import.meta.url),'utf8')).rules;
const snap=value=>({child:path=>snap(String(path).split('/').reduce((v,key)=>v?.[key],value)),exists:()=>value!=null,isNumber:()=>typeof value==='number',isString:()=>typeof value==='string',val:()=>value??null});
const auth={uid:'admin',token:{admin:true}};
function grant(expression,before,after,root={},id='s2'){return Function('auth','data','newData','root','$serverId',`return (${expression})`)(auth,snap(before),snap(after),snap(root),id);}
const state=(version,epoch='one',protocol=2)=>({data:{version,syncEpoch:epoch,syncProtocol:protocol}});
test('state Rules require a strictly newer version and preserve the restoration epoch',()=>{
 const write=rules.boss_timeline_state['.write'];
 assert.equal(grant(write,state(4),state(5)),true);
 assert.equal(grant(write,state(4),state(4)),false);
 assert.equal(grant(write,state(4),state(3)),false);
 assert.equal(grant(write,state(4),state(5,'other')),false);
 assert.equal(grant(write,state(4),{data:{version:5}}),false);
});
test('state Rules deny cache seeding into an empty default database',()=>{
 assert.equal(grant(rules.boss_timeline_state['.write'],null,state(1)),false);
});
test('new servers can initialize only after their explicit registration',()=>{
 const write=rules.boss_timeline_servers.$serverId.state['.write'];
 assert.equal(grant(write,null,state(1),{}),false);
 assert.equal(grant(write,null,state(1),{boss_timeline_servers_list:{version:1,items:{s2:{id:'s2',name:'New'}}}}),true);
});
test('registry Rules reject legacy array writes and require advancing the version',()=>{
 const write=rules.boss_timeline_servers_list['.write'];
 assert.equal(grant(write,[{id:'s1'}],[{id:'s1'},{id:'cached'}]),false);
 assert.equal(grant(write,[{id:'s1'}],{version:1,items:{s1:{id:'s1'}}}),true);
 assert.equal(grant(write,{version:3},{version:3}),false);
 assert.equal(grant(write,{version:3},{version:4}),true);
});
