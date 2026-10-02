const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY || "AIzaSyCfVwcvXqDeurizrqEbHmGopNIPHFa-D7Q";
const FIREBASE_DATABASE_URL = process.env.FIREBASE_DATABASE_URL || "https://time-boss-chill-default-rtdb.asia-southeast1.firebasedatabase.app";
const requestTimes = new Map();

async function verifyFirebaseAdmin(idToken) {
  const lookup = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(FIREBASE_API_KEY)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken })
  });
  if (!lookup.ok) return null;
  const account = (await lookup.json())?.users?.[0];
  if (!account?.localId) return null;

  let claims = {};
  try { claims = JSON.parse(account.customAttributes || "{}"); } catch (error) {}
  if (claims.admin === true) return { uid: account.localId, superAdmin: true };

  const accessResponse = await fetch(
    `${FIREBASE_DATABASE_URL}/admin_access/${encodeURIComponent(account.localId)}.json?auth=${encodeURIComponent(idToken)}`
  );
  if (!accessResponse.ok) return null;
  const access = await accessResponse.json();
  return access?.active === true ? { uid: account.localId, superAdmin: false } : null;
}

function resolveWebhook(serverId) {
  const suffix = String(serverId || "s1").toUpperCase().replace(/[^A-Z0-9_]/g, "_");
  return process.env[`DISCORD_WEBHOOK_${suffix}`] || process.env.DISCORD_WEBHOOK_URL || "";
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const authorization = req.headers.authorization || "";
  const idToken = authorization.startsWith("Bearer ") ? authorization.slice(7).trim() : "";
  if (!idToken) return res.status(401).json({ error: "Authentication required." });

  const admin = await verifyFirebaseAdmin(idToken).catch(() => null);
  if (!admin) return res.status(403).json({ error: "Admin permission required." });

  const now = Date.now();
  const previous = requestTimes.get(admin.uid) || 0;
  if (now - previous < 1200) return res.status(429).json({ error: "Please wait before sending again." });
  requestTimes.set(admin.uid, now);

  const webhookUrl = resolveWebhook(req.body?.serverId);

  if (!webhookUrl || !/^https:\/\/(?:discord|discordapp)\.com\/api\/webhooks\//i.test(webhookUrl.trim())) {
    return res.status(400).json({ error: "Invalid or missing Discord Webhook URL." });
  }

  const payload = req.body?.payload;
  if (!payload || typeof payload !== "object") {
    return res.status(400).json({ error: "Invalid payload provided." });
  }

  try {
    const file = req.body?.file;
    let discordResponse;
    if (file?.base64) {
      if (file.base64.length > 5_500_000) return res.status(413).json({ error: "Attachment is too large." });
      const form = new FormData();
      form.append("payload_json", JSON.stringify(payload));
      form.append("file", new Blob([Buffer.from(file.base64, "base64")], { type: file.type || "image/png" }), file.name || "image.png");
      discordResponse = await fetch(webhookUrl.trim(), { method: "POST", body: form });
    } else {
      discordResponse = await fetch(webhookUrl.trim(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    }

    if (discordResponse.status === 429) {
      const rateLimitData = await discordResponse.json().catch(() => ({}));
      return res.status(429).json({
        error: "Discord Rate Limit",
        details: rateLimitData
      });
    }

    if (!discordResponse.ok && discordResponse.status !== 204) {
      const errText = await discordResponse.text().catch(() => "");
      return res.status(discordResponse.status).json({
        error: "Discord API Error",
        details: errText
      });
    }

    return res.status(200).json({ success: true, message: "Webhook delivered successfully." });
  } catch (err) {
    return res.status(500).json({
      error: "Internal Server Error",
      details: "Discord relay failed."
    });
  }
}
