import { createCipheriv, createDecipheriv, createHash, randomBytes, timingSafeEqual } from 'node:crypto';

const DAY = 86400000;
const DEFAULT_DB = 'https://time-boss-chill-default-rtdb.asia-southeast1.firebasedatabase.app';
function dbUrl(env, path = '') {
  if (!env.FIREBASE_DATABASE_AUTH || !env.CRON_SECRET) throw new Error('Retention requires server credentials');
  return `${(env.FIREBASE_DATABASE_URL || DEFAULT_DB).replace(/\/$/, '')}/discord_alert_retention${path}.json?auth=${encodeURIComponent(env.FIREBASE_DATABASE_AUTH)}`;
}
function key(env) { return createHash('sha256').update(env.CRON_SECRET).digest(); }
export async function retainAlert(fetchImpl, env, webhookUrl, messageId, now) {
  if (!/^\d+$/.test(messageId)) throw new Error('Missing Discord message ID');
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key(env), iv);
  const encrypted = Buffer.concat([cipher.update(webhookUrl, 'utf8'), cipher.final()]);
  const entry = { expiresAt: now + DAY, iv: iv.toString('base64'), tag: cipher.getAuthTag().toString('base64'), encrypted: encrypted.toString('base64') };
  const response = await fetchImpl(dbUrl(env, `/${messageId}`), { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(entry), signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error('Retention save failed');
}
export function createCleanupHandler({ fetchImpl = fetch, env = process.env, now = Date.now } = {}) {
  return async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    const actual = Buffer.from(req.headers.authorization || '');
    const expected = Buffer.from(`Bearer ${env.CRON_SECRET || ''}`);
    if (!env.CRON_SECRET || actual.length !== expected.length || !timingSafeEqual(actual, expected)) return res.status(401).json({ error: 'Unauthorized' });
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
    try {
      const url = dbUrl(env) + '&orderBy=%22expiresAt%22&endAt=' + now() + '&limitToFirst=100';
      const read = await fetchImpl(url, { signal: AbortSignal.timeout(8000) });
      if (!read.ok) throw new Error('Queue read failed');
      const rows = await read.json() || {};
      let deleted = 0, failed = 0;
      const started = Date.now();
      for (const [id, entry] of Object.entries(rows)) {
        if (Date.now() - started > 40000) break;
        if (!/^\d+$/.test(id) || !Number.isFinite(entry.expiresAt) || entry.expiresAt > now()) continue;
        try {
          const decipher = createDecipheriv('aes-256-gcm', key(env), Buffer.from(entry.iv, 'base64'));
          decipher.setAuthTag(Buffer.from(entry.tag, 'base64'));
          const webhook = Buffer.concat([decipher.update(Buffer.from(entry.encrypted, 'base64')), decipher.final()]).toString('utf8');
          if (!/^https:\/\/(?:discord|discordapp)\.com\/api\/webhooks\/\d+\/[A-Za-z0-9_-]+(?:\?.*)?$/.test(webhook)) throw new Error('Invalid webhook');
          const target = new URL(webhook); target.pathname += `/messages/${id}`;
          target.searchParams.delete('wait');
          const result = await fetchImpl(target.href, { method: 'DELETE', signal: AbortSignal.timeout(8000) });
          if (result.status === 429) break;
          if (!result.ok && result.status !== 404) { failed++; continue; }
          const removed = await fetchImpl(dbUrl(env, `/${id}`), { method: 'DELETE', signal: AbortSignal.timeout(8000) });
          if (!removed.ok) { failed++; continue; }
          deleted++;
        } catch { failed++; }
      }
      return res.status(failed ? 502 : 200).json({ deleted, failed });
    } catch { return res.status(502).json({ error: 'Alert cleanup failed; check server configuration' }); }
  };
}
