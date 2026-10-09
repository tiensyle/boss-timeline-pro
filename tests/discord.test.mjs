import test from "node:test";
import assert from "node:assert/strict";
import { createDiscordHandler } from "../api/discord.js";

const webhook = "https://discord.com/api/webhooks/123456789/test-token";
function fixture({ superAdmin = true, active = true, discordStatus = 204, env = {} } = {}) {
  const requests = [];
  let timestamp = 1000;
  const fetchImpl = async (url, options) => {
    requests.push({ url, options });
    if (url.includes("accounts:lookup")) return Response.json({ users: [{ localId: "uid", customAttributes: JSON.stringify({ admin: superAdmin }) }] });
    if (url.includes("admin_access")) return Response.json({ active });
    if (discordStatus === 204) return new Response(null, { status: 204 });
    return Response.json({ retry_after: 2.5 }, { status: discordStatus });
  };
  const handler = createDiscordHandler({ fetchImpl, env: { DISCORD_WEBHOOK_URL: webhook, ...env }, now: () => timestamp });
  async function send(overrides = {}) {
    const req = { method: "POST", headers: { authorization: "Bearer fake-test-token", host: "relay.example" }, body: { serverId: "s1", payload: { content: "Hello", embeds: [] } }, ...overrides };
    const res = { code: 200, headers: {}, body: null,
      setHeader(name, value) { this.headers[name] = value; },
      status(code) { this.code = code; return this; },
      json(body) { this.body = body; return this; }, end() { return this; }
    };
    await handler(req, res);
    return res;
  }
  return { requests, send, advance(ms) { timestamp += ms; } };
}

test("Discord rejects missing login, unapproved/revoked admins and unsafe origins", async () => {
  const noLogin = fixture();
  assert.equal((await noLogin.send({ headers: {} })).code, 401);
  assert.equal(noLogin.requests.length, 0);
  const revoked = fixture({ superAdmin: false, active: false });
  assert.equal((await revoked.send()).code, 403);
  assert.equal(revoked.requests.length, 2);
  const origin = fixture();
  assert.equal((await origin.send({ headers: { origin: "https://unknown.example", host: "relay.example" } })).code, 403);
  assert.equal(origin.requests.length, 0);
});

test("approved secondary admins and super admins can send; server webhook overrides global", async () => {
  const secondary = fixture({ superAdmin: false });
  assert.equal((await secondary.send()).code, 200);
  assert.equal(secondary.requests.length, 3);
  const otherWebhook = webhook.replace("test-token", "server-two");
  const override = fixture({ env: { DISCORD_WEBHOOK_S2: otherWebhook } });
  assert.equal((await override.send({ body: { serverId: "s2", payload: { content: "Hi" } } })).code, 200);
  assert.equal(override.requests.at(-1).url, otherWebhook);
  assert.deepEqual(JSON.parse(override.requests.at(-1).options.body).allowed_mentions, { parse: [] });
});

test("CORS preflight is supported only for explicitly allowed origins", async () => {
  const api = fixture({ env: { DISCORD_ALLOWED_ORIGINS: "https://site.example" } });
  const res = await api.send({ method: "OPTIONS", headers: { origin: "https://site.example", host: "relay.example" } });
  assert.equal(res.code, 204);
  assert.equal(res.headers["Access-Control-Allow-Origin"], "https://site.example");
  assert.equal(api.requests.length, 0);
  assert.equal((await api.send({ method: "GET" })).code, 405);
});

test("the existing GitHub Pages origin can use the relay without exposing it to other Pages sites", async () => {
  const api = fixture();
  const headers = { origin: "https://tiensyle.github.io", host: "bosschill.vercel.app" };
  const preflight = await api.send({ method: "OPTIONS", headers });
  assert.equal(preflight.code, 204);
  assert.equal(preflight.headers["Access-Control-Allow-Origin"], headers.origin);
  assert.equal(api.requests.length, 0);
  const missingLogin = await api.send({ headers });
  assert.equal(missingLogin.code, 401);
  assert.equal(api.requests.length, 0);
  assert.equal((await api.send({ headers: { ...headers, authorization: "Bearer fake-test-token" } })).code, 200);
  assert.equal((await api.send({ method: "OPTIONS", headers: { ...headers, origin: "https://other-user.github.io" } })).code, 403);
});

test("invalid payloads, attachment sizes and unsafe webhook destinations are rejected", async () => {
  const api = fixture();
  assert.equal((await api.send({ body: { payload: [] } })).code, 400);
  assert.equal((await api.send({ body: { payload: {}, serverId: "../../s1" } })).code, 400);
  assert.equal((await api.send({ body: { payload: {}, file: { name: "bad.html", type: "text/html", base64: "test" } } })).code, 400);
  assert.equal((await api.send({ body: { payload: {}, file: { name: "report.png", type: "image/png", base64: "a".repeat(4000001) } } })).code, 413);
  const invalid = fixture({ env: { DISCORD_WEBHOOK_URL: "https://example.com/not-discord" } });
  assert.equal((await invalid.send()).code, 400);
  assert.equal(api.requests.filter(r => r.url === webhook).length, 0);
});

test("rate limit responses include retry timing and Discord failures do not expose its URL", async () => {
  const api = fixture();
  assert.equal((await api.send()).code, 200);
  const limited = await api.send();
  assert.equal(limited.code, 429);
  assert.equal(limited.body.retryAfterMs, 1200);
  api.advance(1200);
  assert.equal((await api.send()).code, 200);
  const discordLimit = await fixture({ discordStatus: 429 }).send();
  assert.equal(discordLimit.body.retryAfterMs, 2500);
  const failure = await fixture({ discordStatus: 400 }).send();
  assert.equal(failure.code, 502);
  assert.ok(!JSON.stringify(failure).includes(webhook));
});

test("PNG reports are sent as multipart attachments with safe mention handling", async () => {
  const api = fixture();
  const result = await api.send({ body: { payload: { content: "@everyone report", allowed_mentions: { parse: ["users", "roles"] } }, file: { base64: "aGVsbG8=", type: "image/png", name: "report.png" } } });
  assert.equal(result.code, 200);
  const body = api.requests.at(-1).options.body;
  assert.ok(body instanceof FormData);
  assert.deepEqual(JSON.parse(body.get("payload_json")).allowed_mentions, { parse: ["everyone"] });
  assert.equal(body.get("files[0]").name, "report.png");
});

test("CSV fallback reports are accepted as CSV rather than executable attachment types", async () => {
  const api = fixture();
  const result = await api.send({ body: { payload: { content: "Daily schedule" }, file: { base64: "YSxiCg==", type: "text/csv;charset=utf-8", name: "report.csv" } } });
  assert.equal(result.code, 200);
  assert.equal(api.requests.at(-1).options.body.get("files[0]").type, "text/csv;charset=utf-8");
});
