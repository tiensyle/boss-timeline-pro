// Quick smoke test for multi-server cron-daily.js

// Mock fetch
global.fetch = async (url) => {
  if (url.includes("boss_timeline_servers_list")) {
    return {
      ok: true, json: async () => [
        { id: "s1", name: "Server 10", icon: "🌐" },
        { id: "s2", name: "Sven 9", icon: "🛡️" },
        { id: "s3", name: "Sven 7", icon: "🔥" }
      ]
    };
  }
  if (url.includes("/boss_timeline_state/data")) {
    return {
      ok: true, json: async () => ({
        bosses: [
          { id: "b1", name: "Dragon", spawnMode: "fixed", fixedSchedules: [{ day: "all", time: "20:00" }] },
          { id: "b2", name: "Titan", spawnMode: "interval", respawnMinutes: 60, lastRespawnAt: Date.now() - 60 * 60000 }
        ],
        history: []
      })
    };
  }
  if (url.includes("boss_timeline_servers/s2/state")) {
    return {
      ok: true, json: async () => ({
        bosses: [{ id: "b3", name: "Phoenix", spawnMode: "fixed", fixedSchedules: [{ day: "all", time: "21:00" }] }],
        history: []
      })
    };
  }
  if (url.includes("boss_timeline_servers/s3/state")) {
    return { ok: true, json: async () => ({ bosses: [], history: [] }) };
  }
  // Discord webhooks
  if (url.includes("discord.com")) {
    console.log("  → Sending Discord to:", url.slice(0, 60) + "...");
    return { ok: true };
  }
  console.warn("  [WARN] Unexpected fetch:", url);
  return { ok: false, status: 404, text: async () => "not found" };
};

process.env.DISCORD_WEBHOOK_S1 = "https://discord.com/api/webhooks/111/aaaaaa";
process.env.DISCORD_WEBHOOK_S2 = "https://discord.com/api/webhooks/222/bbbbbb";
// s3 không có webhook → phải bị skip

const { default: handler } = await import("../api/cron-daily.js");

let responseBody = null;
const res = {
  setHeader: () => {},
  status: (code) => ({
    json: (body) => {
      responseBody = { code, body };
    }
  })
};

await handler({}, res);
console.log("HTTP Status:", responseBody.code);
console.log(JSON.stringify(responseBody.body, null, 2));

// Assertions
const { results, summary } = responseBody.body;
console.assert(responseBody.code === 200, "Should return 200");
console.assert(results.find(r => r.serverId === "s1")?.status === "sent", "s1 should be sent");
console.assert(results.find(r => r.serverId === "s2")?.status === "sent", "s2 should be sent");
console.assert(results.find(r => r.serverId === "s3")?.status === "skipped", "s3 should be skipped (no webhook)");
console.assert(results.find(r => r.serverId === "s1")?.bossCount >= 1, "s1 should have boss events");
console.assert(results.find(r => r.serverId === "s2")?.bossCount >= 1, "s2 should have boss events");

console.log("\n✅ All assertions passed!");
