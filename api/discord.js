const DEFAULT_FIREBASE_API_KEY = "AIzaSyCfVwcvXqDeurizrqEbHmGopNIPHFa-D7Q";
const DEFAULT_DATABASE_URL = "https://time-boss-chill-default-rtdb.asia-southeast1.firebasedatabase.app";
const DEFAULT_ALLOWED_ORIGINS = ["https://tiensyle.github.io"];

async function verifyFirebaseAdmin(idToken, fetchImpl, env) {
  const apiKey = env.FIREBASE_API_KEY || DEFAULT_FIREBASE_API_KEY;
  const databaseUrl = env.FIREBASE_DATABASE_URL || DEFAULT_DATABASE_URL;
  const lookup = await fetchImpl(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(apiKey)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
    signal: AbortSignal.timeout(10000)
  });
  if (!lookup.ok) return null;
  const account = (await lookup.json())?.users?.[0];
  if (!account?.localId) return null;
  let claims = {};
  try { claims = JSON.parse(account.customAttributes || "{}"); } catch {}
  if (claims.admin === true) return { uid: account.localId };
  const accessResponse = await fetchImpl(
    `${databaseUrl}/admin_access/${encodeURIComponent(account.localId)}.json?auth=${encodeURIComponent(idToken)}`,
    { signal: AbortSignal.timeout(10000) }
  );
  if (!accessResponse.ok) return null;
  return (await accessResponse.json())?.active === true ? { uid: account.localId } : null;
}

export function createDiscordHandler({ fetchImpl = fetch, env = process.env, now = Date.now } = {}) {
  const requestTimes = new Map();
  return async function handler(req, res) {
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Allow", "POST, OPTIONS");
    const origin = req.headers.origin;
    const allowedOrigins = [...DEFAULT_ALLOWED_ORIGINS, ...(env.DISCORD_ALLOWED_ORIGINS || "").split(",").map(value => value.trim()).filter(Boolean)];
    if (origin) {
      let sameOrigin = false;
      try {
        const parsed = new URL(origin);
        sameOrigin = ["http:", "https:"].includes(parsed.protocol) && parsed.host === req.headers.host;
      } catch {}
      if (!sameOrigin && !allowedOrigins.includes(origin)) return res.status(403).json({ error: "Origin is not allowed." });
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Vary", "Origin");
      res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
    }
    if (req.method === "OPTIONS") return res.status(204).end();
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed. Use POST." });

    const authorization = req.headers.authorization || "";
    const idToken = authorization.startsWith("Bearer ") ? authorization.slice(7).trim() : "";
    if (!idToken) return res.status(401).json({ error: "Authentication required." });
    const admin = await verifyFirebaseAdmin(idToken, fetchImpl, env).catch(() => null);
    if (!admin) return res.status(403).json({ error: "Admin permission required." });

    const payload = req.body?.payload;
    if (!payload || typeof payload !== "object" || Array.isArray(payload) || JSON.stringify(payload).length > 64000) {
      return res.status(400).json({ error: "Invalid payload provided." });
    }
    const serverId = String(req.body.serverId || "s1");
    if (!/^[a-zA-Z0-9_-]{1,64}$/.test(serverId)) return res.status(400).json({ error: "Invalid server ID." });
    const suffix = serverId.toUpperCase().replace(/-/g, "_");
    const webhookUrl = (env[`DISCORD_WEBHOOK_${suffix}`] || env.DISCORD_WEBHOOK_URL || "").trim();
    if (!/^https:\/\/(?:discord|discordapp)\.com\/api\/webhooks\/\d+\/[A-Za-z0-9_-]+(?:\?.*)?$/.test(webhookUrl)) {
      return res.status(400).json({ error: "Invalid or missing Discord Webhook URL." });
    }

    const file = req.body.file;
    const attachmentExtension = file?.type === "image/png" ? "png" : (file?.type === "text/csv;charset=utf-8" ? "csv" : null);
    if (file && (typeof file.base64 !== "string" || !file.base64 || !attachmentExtension || !new RegExp(`^[\\w.-]+\\.${attachmentExtension}$`, "i").test(file.name || ""))) {
      return res.status(400).json({ error: "Invalid attachment." });
    }
    if (file?.base64.length > 4000000) return res.status(413).json({ error: "Attachment is too large." });

    const timestamp = now();
    for (const [uid, time] of requestTimes) if (timestamp - time > 60000) requestTimes.delete(uid);
    const previous = requestTimes.get(admin.uid);
    if (previous !== undefined && timestamp - previous < 1200) {
      return res.status(429).json({ error: "Please wait before sending again.", retryAfterMs: 1200 - (timestamp - previous) });
    }
    requestTimes.set(admin.uid, timestamp);

    try {
      const safePayload = { ...payload, allowed_mentions: { parse: /@everyone\b/.test(payload.content || "") ? ["everyone"] : [] } };
      let body = JSON.stringify(safePayload);
      let headers = { "Content-Type": "application/json" };
      if (file) {
        const form = new FormData();
        form.append("payload_json", body);
        form.append("files[0]", new Blob([Buffer.from(file.base64, "base64")], { type: file.type }), file.name);
        body = form;
        headers = undefined;
      }
      const response = await fetchImpl(webhookUrl, { method: "POST", headers, body, signal: AbortSignal.timeout(15000) });
      if (response.status === 429) {
        const details = await response.json().catch(() => ({}));
        return res.status(429).json({ error: "Discord Rate Limit", retryAfterMs: Math.ceil((Number(details.retry_after) || 1.2) * 1000) });
      }
      if (!response.ok) return res.status(502).json({ error: "Discord API rejected the message." });
      return res.status(200).json({ success: true, message: "Webhook delivered successfully." });
    } catch {
      return res.status(502).json({ error: "Discord relay failed." });
    }
  };
}

export default createDiscordHandler();
