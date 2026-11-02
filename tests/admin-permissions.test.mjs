import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const rules=JSON.parse(readFileSync(new URL('../database.rules.json',import.meta.url),'utf8')).rules;
const source=readFileSync(new URL('../assets/app.js',import.meta.url),'utf8');
function snap(value){return {child:path=>snap(String(path).split('/').reduce((v,k)=>v?.[k],value)),val:()=>value??null,exists:()=>value!=null,isString:()=>typeof value==='string',isNumber:()=>typeof value==='number'};}
function evaluate(expression,{profile,auth={uid:'secondary',token:{}},before=null,after=null,root={}}={}){
 return Function('auth','root','data','newData','$uid','$serverId',`return (${expression})`)(auth,snap({...root,admin_access:{secondary:profile}}),snap(before),snap(after),'secondary','s2');
}
function scoped(scope,level){return {active:true,permissions:{bosses:'none',attendance:'none',servers:'view',discord:'none',[scope]:level}};}

test('only explicitly granted modules can be changed by a restricted secondary admin',()=>{
 const writes={bosses:rules.boss_timeline_state['.write'],attendance:rules.boss_timeline_attendance_global['.write'],servers:rules.boss_timeline_servers_list['.write'],discord:rules.boss_timeline_discord_config['.write']};
 const data=v=>({version:v,data:{version:v,syncEpoch:'same',syncProtocol:2}});
 for(const [scope,rule] of Object.entries(writes)){
  const args={before:data(1),after:data(2)};
  assert.equal(evaluate(rule,{...args,profile:scoped(scope,'edit')}),true,scope);
  assert.equal(evaluate(rule,{...args,profile:scoped(scope,'view')}),false,scope);
  assert.equal(evaluate(rule,{...args,profile:scoped(scope,'none')}),false,scope);
  assert.equal(evaluate(rule,{...args,profile:{active:false,permissions:{[scope]:'edit'}}}),false,scope);
  assert.equal(evaluate(rule,{...args,auth:null}),false,scope);
 }
});

test('members keep read-only access while restricted admin sessions respect view permissions',()=>{
 for(const [scope,node] of [['bosses',rules.boss_timeline_state.data],['attendance',rules.boss_timeline_attendance_global]]){
  assert.equal(evaluate(node['.read'],{auth:null}),true);
  assert.equal(evaluate(node['.read'],{profile:scoped(scope,'none')}),false);
  assert.equal(evaluate(node['.read'],{profile:scoped(scope,'view')}),true);
  assert.equal(evaluate(node['.read'],{profile:scoped(scope,'edit')}),true);
 }
});

test('a secondary admin cannot grant permissions to self or others',()=>{
 assert.equal(evaluate(rules.admin_access.$uid['.write'],{profile:scoped('bosses','edit')}),false);
 assert.equal(evaluate(rules.admin_access.$uid['.write'],{auth:{uid:'owner',token:{admin:true}}}),true);
 assert.equal(evaluate(rules.admin_access.$uid.permissions.bosses['.validate'],{after:'owner'}),false);
 assert.equal(evaluate(rules.admin_access.$uid.permissions['$other']['.validate']),false);
});

test('server management can initialize a registered new server without granting Boss editing',()=>{
 const rule=rules.boss_timeline_servers.$serverId.state['.write'];
 const args={profile:scoped('servers','edit'),after:{data:{version:1,syncEpoch:'new',syncProtocol:2}},
  root:{boss_timeline_servers_list:{items:{s2:{id:'s2',name:'New'}}}}};
 assert.equal(evaluate(rule,args),true);
 assert.equal(evaluate(rule,{...args,root:{}}),false);
 assert.equal(evaluate(rule,{...args,before:args.after,after:{data:{version:2,syncEpoch:'new',syncProtocol:2}}}),false);
});

test('frontend separates identity, module edit permissions and member viewing',()=>{
 const ctx=vm.createContext({currentRole:'admin',currentUserIsAdmin:true,currentUserIsSuperAdmin:false,
  firebaseAuth:{currentUser:{uid:'secondary'}},currentAdminPermissions:scoped('attendance','edit').permissions});
 for(const name of ['isAdmin','canViewAdminArea','normalizeAdminPermissions']){
  const match=new RegExp(`^    function ${name}\\(`,'m').exec(source);
  vm.runInContext(source.slice(match.index,source.indexOf('\n    }',match.index)+6),ctx);
 }
 assert.equal(ctx.isAdmin(),true);
 assert.equal(ctx.isAdmin('bosses'),false);
 assert.equal(ctx.isAdmin('attendance'),true);
 assert.equal(ctx.canViewAdminArea('bosses'),false);
 ctx.currentRole='member';
 assert.equal(ctx.isAdmin('attendance'),false);
 assert.equal(ctx.canViewAdminArea('bosses'),true);
 ctx.currentRole='admin';ctx.currentUserIsSuperAdmin=true;
 assert.equal(ctx.isAdmin('bosses'),true);
 assert.equal(ctx.canViewAdminArea('bosses'),true);
 ctx.currentUserIsSuperAdmin=false;ctx.currentAdminPermissions=null;
 assert.equal(ctx.isAdmin('bosses'),true,'existing approved accounts remain compatible');
});

function permissionSaver(globals) {
 const ctx=vm.createContext({Date,setTimeout,clearTimeout,...globals});
 for(const name of ['normalizeAdminPermissions','saveAdminPermissions']){
  const match=new RegExp(`^    (?:async )?function ${name}\\(`,'m').exec(source);
  vm.runInContext(source.slice(match.index,source.indexOf('\n    }',match.index)+6),ctx);
 }
 return ctx;
}

test('permission save patches an existing account without depending on transaction cache',async()=>{
 const profile={active:true,email:'admin@example.invalid',name:'Admin',approvedAt:1,approvedBy:'owner'};
 const ctx=permissionSaver({isSuperAdmin:()=>true,firebaseAuth:{currentUser:{uid:'owner'}},
  firebaseDb:{ref:path=>{
   assert.equal(path,'admin_access/secondary');
   return {once:async()=>({val:()=>profile}),
    transaction:()=>{throw Error('Cold transaction cache must not be used');},
    update:async patch=>Object.assign(profile,patch)};
  }}});
 await ctx.saveAdminPermissions('secondary',{bosses:'edit',attendance:'view',servers:'view',discord:'none'});
 assert.equal(profile.permissions.bosses,'edit');
 assert.equal(profile.permissions.attendance,'view');
 assert.equal(profile.email,'admin@example.invalid');
 assert.equal(profile.active,true);
 assert.equal(profile.approvedAt,1);
 assert.equal(profile.permissionsUpdatedBy,'owner');
});

test('permission save refuses revoked accounts and propagates write failures',async()=>{
 let written=false;
 const revoked=permissionSaver({isSuperAdmin:()=>true,firebaseDb:{ref:()=>({
  once:async()=>({val:()=>null}),update:async()=>{written=true;}
 })}});
 await assert.rejects(revoked.saveAdminPermissions('revoked',{}),{code:'admin/revoked'});
 assert.equal(written,false);
 const failed=permissionSaver({isSuperAdmin:()=>true,firebaseAuth:{currentUser:{uid:'owner'}},firebaseDb:{ref:()=>({
  once:async()=>({val:()=>({active:true})}),update:async()=>{throw Object.assign(new Error('Denied'),{code:'PERMISSION_DENIED'});}
 })}});
 await assert.rejects(failed.saveAdminPermissions('secondary',{}),{code:'PERMISSION_DENIED'});
});

test('secondary admins cannot invoke permission saver directly',async()=>{
 const ctx=permissionSaver({isSuperAdmin:()=>false});
 await assert.rejects(ctx.saveAdminPermissions('secondary',{}));
});

test('saving permissions repairs approval metadata on older admin records',async()=>{
 const profile={active:true,email:'older@example.invalid',name:'Older Admin'};
 const ctx=permissionSaver({isSuperAdmin:()=>true,firebaseAuth:{currentUser:{uid:'owner'}},firebaseDb:{ref:()=>({
  once:async()=>({val:()=>profile}),update:async patch=>Object.assign(profile,patch)
 })}});
 await ctx.saveAdminPermissions('older',{bosses:'view',attendance:'edit',servers:'view',discord:'none'});
 assert.equal(typeof profile.approvedAt,'number');
 assert.equal(profile.approvedBy,'owner');
 assert.equal(profile.email,'older@example.invalid');
 assert.equal(profile.permissions.attendance,'edit');
});
