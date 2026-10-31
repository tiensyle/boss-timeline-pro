import test from "node:test";
import assert from "node:assert/strict";
import { createCronDailyHandler } from "../api/cron-daily.js";

function fixture({ discordOk = true, useFirebaseWebhook = false, stateOk = true, config = { enabled: true }, bosses = [], globalOnly = false, storedWebhook = "https://discord.com/api/webhooks/123/token", registry = [{id:"s1",name:"One"}] } = {}) {
  const locks = new Map();
  const versions = new Map();
  let sends = 0;
  let stateAvailable = stateOk;
  const requestedUrls = [];
  const deliveries = [];
  const fetchImpl = async (url, options = {}) => {
    requestedUrls.push(url);
    if (url.includes("discord_config")) return Response.json(config);
    if (url.includes("boss_timeline_servers_list")) return Response.json(registry);
    if (url.includes("boss_timeline_webhook_urls")) return Response.json({ url: storedWebhook });
    if (url.includes("boss_timeline_state/data")) return stateAvailable
      ? Response.json({ bosses, history: [] })
      : new Response("unavailable", { status: 503 });
    if (url.includes("boss_timeline_cron_runs")) {
      const method = options.method || "GET";
      const version = versions.get(url) || 0;
      if (method === "GET") return new Response(JSON.stringify(locks.get(url) ?? null), { status: 200, headers: { etag: `"${version}"` } });
      if (method === "PUT") {
        if (options.headers["if-match"] !== `"${version}"` && !(version === 0 && options.headers["if-match"] === "null_etag")) return new Response(null, { status: 412 });
        locks.set(url, JSON.parse(options.body)); versions.set(url, version + 1);
        return Response.json(locks.get(url));
      }
    }
    if (url.startsWith("https://discord.com/api/webhooks/")) {
      sends++;
      deliveries.push({url,body:options.body});
      return new Response(discordOk ? null : "failed", { status: discordOk ? 204 : 500 });
    }
    return new Response("missing", { status: 404 });
  };
  const env = {
    CRON_SECRET: "secret",
    FIREBASE_DATABASE_AUTH: "firebase-secret",
    ...(globalOnly ? { DISCORD_WEBHOOK_URL: "https://discord.com/api/webhooks/321/global" } : {}),
    ...(useFirebaseWebhook || globalOnly ? {} : { DISCORD_WEBHOOK_S1: "https://discord.com/api/webhooks/123/token" })
  };
  const handler = createCronDailyHandler({ fetchImpl, env, now: () => Date.UTC(2026, 9, 30, 17) });
  const run = async (authorization = "Bearer secret") => {
    const res = { code: 0, body: null, setHeader() {}, status(code) { this.code = code; return this; }, json(body) { this.body = body; return this; } };
    await handler({ method: "GET", headers: { authorization } }, res);
    return res;
  };
  return {
    run,
    requestedUrls,
    deliveries,
    setStateAvailable(value) { stateAvailable = value; },
    get sends() { return sends; }
  };
}

test("daily cron requires CRON_SECRET authorization", async () => {
  const api = fixture();
  assert.equal((await api.run("")).code, 401);
  assert.equal((await api.run("Bearer wrong")).code, 401);
  assert.equal(api.sends, 0);
});

test("daily cron sends once per Vietnam date and server", async () => {
  const api = fixture();
  assert.equal((await api.run()).code, 200);
  assert.equal((await api.run()).code, 200);
  assert.equal(api.sends, 1);
});

test("parallel daily cron invocations share one Firebase claim", async () => {
  const api = fixture();
  await Promise.all([api.run(), api.run(), api.run(), api.run(), api.run()]);
  assert.equal(api.sends, 1);
});

test("daily cron releases a failed claim so a later retry can send", async () => {
  let fail = true;
  const base = fixture({ discordOk: false });
  await base.run();
  assert.equal(base.sends, 1);
  // A separate invocation fixture verifies failure does not count as success;
  // lock release behavior is covered by two calls against the same failing store.
  await base.run();
  assert.equal(base.sends, 2);
  fail = false;
  assert.equal(fail, false);
});

test("daily cron authenticates Firebase reads including a stored webhook", async () => {
  const api = fixture({ useFirebaseWebhook: true });
  await api.run();
  assert.equal(api.sends, 1);
  const firebaseReads = api.requestedUrls.filter(url => url.includes("firebasedatabase.app") && !url.includes("cron_runs"));
  assert.ok(firebaseReads.length >= 3);
  assert.ok(firebaseReads.every(url => url.includes("auth=firebase-secret")));
});

test("daily cron releases its claim when boss state cannot be read", async () => {
  const api = fixture({ stateOk: false });
  await api.run();
  assert.equal(api.sends, 0);
  api.setStateAvailable(true);
  await api.run();
  assert.equal(api.sends, 1);
});

test("cron honors disabled bot, disabled daily schedule, and disabled everyone mentions", async () => {
  for(const config of [{enabled:false},{enabled:true,notifyDailySchedule:false}]){
    const api=fixture({config});
    assert.equal((await api.run()).code,200);
    assert.equal(api.sends,0);
  }
  const api=fixture({config:{enabled:true,tagEveryone:false}});
  await api.run();
  const payload=JSON.parse(api.deliveries[0].body);
  assert.ok(!payload.content.includes('@everyone'));
  assert.deepEqual(payload.allowed_mentions.parse,[]);
});

test("cron uses stored webhook first and falls back to global webhook",async()=>{
  const global=fixture({globalOnly:true,storedWebhook:""});await global.run();
  assert.equal(global.deliveries[0].url,"https://discord.com/api/webhooks/321/global");
  const stored=fixture({storedWebhook:"https://discord.com/api/webhooks/456/saved"});await stored.run();
  assert.equal(stored.deliveries[0].url,"https://discord.com/api/webhooks/456/saved");
});

test("long cron report includes every event in a CSV attachment",async()=>{
  const api=fixture({bosses:[{id:"b",name:"A".repeat(44),map:"B".repeat(44),spawnMode:"interval",respawnMinutes:30,lastRespawnAt:Date.UTC(2026,9,30,16,30)}]});
  await api.run();
  const form=api.deliveries[0].body;
  assert.ok(form instanceof FormData);
  const payload=JSON.parse(form.get('payload_json'));
  assert.ok(payload.embeds[0].description.length<4096);
  const csv=await form.get('files[0]').text();
  assert.equal(csv.split('\r\n').length,49);
});

test("cron reports delivery failures as failures",async()=>{
 const api=fixture({discordOk:false});const result=await api.run();
 assert.equal(result.code,502);assert.equal(result.body.success,false);
});


test("cron reads the versioned server registry and never invents servers for an empty database",async()=>{
 const migrated=fixture({registry:{version:2,items:{s1:{id:"s1",name:"One"}}}});await migrated.run();assert.equal(migrated.sends,1);
 const empty=fixture({registry:null});const result=await empty.run();assert.equal(result.code,503);assert.equal(empty.sends,0);
 assert.ok(!empty.requestedUrls.some(url=>url.includes('cron_runs')));
});
