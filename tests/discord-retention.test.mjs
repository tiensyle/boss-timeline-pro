import test from 'node:test';
import assert from 'node:assert/strict';
import {retainAlert,createCleanupHandler} from '../api/discord-retention.js';
test('retention encrypts token, waits 24h, deletes expired only and retains failed deletes', async () => {
 const env={CRON_SECRET:'test-secret',FIREBASE_DATABASE_AUTH:'test-auth',FIREBASE_DATABASE_URL:'https://example.invalid'};
 let clock=100000, queue={}, deleted=[], fail=false;
 const mock=async(url,opts={})=>{
  const u=new URL(url);
  if(u.hostname==='discord.com') { deleted.push(u.pathname); return new Response(null,{status:fail?500:204}); }
  const id=u.pathname.match(/\/(\d+)\.json$/)?.[1];
  if(opts.method==='PUT'){queue[id]=JSON.parse(opts.body);return new Response('{}');}
  if(opts.method==='DELETE'){delete queue[id];return new Response('{}');}
  return new Response(JSON.stringify(queue));
 };
 const response=()=>({code:0,setHeader(){},status(n){this.code=n;return this;},json(v){this.value=v;return this;}});
 const webhook='https://discord.com/api/webhooks/123/private-token';
 await retainAlert(mock,env,webhook,'456',clock);
 assert.ok(!JSON.stringify(queue).includes('private-token'));
 const handler=createCleanupHandler({fetchImpl:mock,env,now:()=>clock});
 let res=response();await handler({method:'GET',headers:{}},res);assert.equal(res.code,401);
 const req={method:'GET',headers:{authorization:'Bearer test-secret'}};
 res=response();await handler(req,res);assert.equal(deleted.length,0);
 clock+=86400000;fail=true;res=response();await handler(req,res);assert.ok(queue['456']);assert.equal(res.code,502);
 fail=false;res=response();await handler(req,res);assert.equal(res.value.deleted,1);assert.equal(queue['456'],undefined);
 assert.equal(deleted.at(-1),'/api/webhooks/123/private-token/messages/456');
});

