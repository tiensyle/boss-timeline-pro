// Deterministic Firebase fixture for UI smoke tests. No requests reach a live project.
export const offlineFirebaseScript = `(() => {
 const stored=new Map();const copy=value=>JSON.parse(JSON.stringify(value));
 function value(path){
  if(path==='.info/connected')return true;
  if(path==='.info/serverTimeOffset')return 0;
  if(path==='boss_timeline_servers_list')return {version:typeof lastServerListVersion==='number'?lastServerListVersion:0,items:Object.fromEntries((serverList.length?serverList:[{id:'s1',name:'One'}]).map(s=>[s.id,s]))};
  const currentPath=typeof currentServerId==='string'?(currentServerId==='s1'?'boss_timeline_state':'boss_timeline_servers/'+currentServerId+'/state'):'';
  if(path===currentPath||path===currentPath+'/data'){
   if(stored.has(currentPath))return path===currentPath?copy(stored.get(currentPath)):copy(stored.get(currentPath).data);
   const data={...copy(bossSyncBase),version:lastAppliedBossVersion||1,syncProtocol:2,...(bossRemoteEpoch?{syncEpoch:bossRemoteEpoch}:{})};
   return path===currentPath?{data,version:data.version}:data;
  }
  return stored.get(path)??null;
 }
 function snapshot(data){return {val:()=>data,exists:()=>data!==null};}
 function ref(path=''){return {child:key=>ref(path+'/'+key),off(){},
  on(event,callback){queueMicrotask(()=>callback(snapshot(value(path))));},
  once:async()=>snapshot(value(path)),set:async data=>{stored.set(path,copy(data));},
  transaction:async update=>{const current=value(path);const next=update(current);if(next===undefined)return {committed:false,snapshot:snapshot(current)};stored.set(path,copy(next));return {committed:true,snapshot:snapshot(next)};}
 };}
 const auth={currentUser:null,onAuthStateChanged:callback=>queueMicrotask(()=>callback(null))};
 window.firebase={apps:[],initializeApp:()=>({}),app:()=>({}),auth:()=>auth,database:()=>({ref})};
})();`;
