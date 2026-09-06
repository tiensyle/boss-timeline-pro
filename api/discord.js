// Vercel Serverless Function: Secure Discord Webhook Relay
// API Endpoint: /api/discord

export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  // 1. Get Secret Webhook URL from Environment Variables (or fallback to payload webhookUrl if provided)
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL || req.body?.webhookUrl;

  if (!webhookUrl || !/^https:\/\/(?:discord|discordapp)\.com\/api\/webhooks\//i.test(webhookUrl.trim())) {
    return res.status(400).json({ error: "Invalid or missing Discord Webhook URL." });
  }

  const payload = req.body?.payload;
  if (!payload || typeof payload !== "object") {
    return res.status(400).json({ error: "Invalid payload provided." });
  }

  try {
    const discordResponse = await fetch(webhookUrl.trim(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

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
      details: err.message
    });
  }
}
