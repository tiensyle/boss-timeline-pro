import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const rules=JSON.parse(readFileSync(new URL('../database.rules.json',import.meta.url),'utf8')).rules;
function snap(value){return {hasChildren:keys=>keys.every(k=>value?.[k]!=null),child:key=>snap(value?.[key]),isNumber:()=>typeof value==='number',isString:()=>typeof value==='string',val:()=>value};}
test('boss validation rejects legacy writers dropping concurrency metadata on both server paths',()=>{
 for(const state of [rules.boss_timeline_state,rules.boss_timeline_servers.$serverId.state]){
  const expression=state.data.bosses.$index['.validate'];
  assert.equal(vm.runInNewContext(expression,{newData:snap({id:'b',diedAt:100})}),false);
  assert.equal(vm.runInNewContext(expression,{newData:snap({id:'b',revision:0,updatedAt:0,updatedBy:''})}),true);
  assert.equal(vm.runInNewContext(expression,{newData:snap({id:'b',revision:-1,updatedAt:0,updatedBy:''})}),false);
 }
});
