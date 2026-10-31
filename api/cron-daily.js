import { timingSafeEqual, randomUUID } from "node:crypto";

const DEFAULT_DATABASE_URL = "https://time-boss-chill-default-rtdb.asia-southeast1.firebasedatabase.app";

function secretsEqual(actual, expected) {
  const a = Buffer.from(String(actual || ""));
  const b = Buffer.from(String(expected || ""));
  return a.length === b.length && timingSafeEqual(a, b);
}

function firebaseUrl(databaseUrl, path, env) {
  const token = String(env.FIREBASE_DATABASE_AUTH || "").trim();
  return `${databaseUrl}/${path}.json${token ? `?auth=${encodeURIComponent(token)}` : ""}`;
}

async function mutateCronLock(fetchImpl, url, mutate) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const read = await fetchImpl(url, { headers: { "X-Firebase-ETag": "true" }, signal: AbortSignal.timeout(8000) });
    if (!read.ok) throw new Error(`Cron lock read failed: HTTP ${read.status}`);
    const current = await read.json();
    const next = mutate(current);
    if (next === undefined) return { committed: false, current };
    const etag = read.headers?.get?.("etag") || "null_etag";
    const write = await fetchImpl(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "if-match": etag },
      body: JSON.stringify(next),
      signal: AbortSignal.timeout(8000)
    });
    if (write.ok) return { committed: true, value: next };
    if (write.status !== 412) throw new Error(`Cron lock write failed: HTTP ${write.status}`);
  }
  return { committed: false, current: null };
}

function getVnNow() {
  return Date.now();
}

function getVnDateParts(timestamp) {
  // Chuyển timestamp sang ngày tháng múi giờ Việt Nam (UTC+7)
  const d = new Date(timestamp + 7 * 3600 * 1000);
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth(),
    date: d.getUTCDate(),
    day: d.getUTCDay(),
    hours: d.getUTCHours(),
    minutes: d.getUTCMinutes()
  };
}

function calculateBossEventTimesForToday(boss, history, nowTimestamp) {
  const vnNow = getVnDateParts(nowTimestamp);
  const startOfDayUtc = Date.UTC(vnNow.year, vnNow.month, vnNow.date) - 7 * 3600 * 1000;
  const endOfDayUtc = startOfDayUtc + 24 * 3600 * 1000;

  const times = new Set();

  if (boss.spawnMode === "fixed") {
    const schedules = Array.isArray(boss.fixedSchedules) && boss.fixedSchedules.length > 0
      ? boss.fixedSchedules
      : [{ day: "all", time: boss.fixedTime || "18:00" }];

    for (const slot of schedules) {
      if (slot.day !== "all" && Number(slot.day) !== vnNow.day) continue;
      const parts = (slot.time || "18:00").split(":").map(Number);
      if (parts.length < 2 || isNaN(parts[0]) || isNaN(parts[1])) continue;
      const [h, m] = parts;
      const slotUtc = Date.UTC(vnNow.year, vnNow.month, vnNow.date, h, m) - 7 * 3600 * 1000;
      if (slotUtc >= startOfDayUtc && slotUtc < endOfDayUtc) {
        times.add(slotUtc);
      }
    }
  } else {
    const intervalMs = Math.max(1, Number(boss.respawnMinutes) || 30) * 60000;
    const lastRespawnAt = Number(boss.lastRespawnAt);
    const hasRecordedSpawn = Number.isFinite(lastRespawnAt) && Array.isArray(history)
      && history.some(ev => ev.type === "respawn" && (ev.bossId === "all" || ev.bossId === boss.id) && Number(ev.time) === lastRespawnAt);

    if (hasRecordedSpawn && lastRespawnAt >= startOfDayUtc && lastRespawnAt < endOfDayUtc) {
      times.add(lastRespawnAt);
    }

    const baseTime = boss.diedAt ? boss.diedAt + intervalMs
      : (boss.respawnsAt || (boss.lastRespawnAt ? boss.lastRespawnAt + intervalMs : null));

    if (Number.isFinite(baseTime) && Number.isFinite(intervalMs)) {
      const first = baseTime + Math.max(0, Math.ceil((startOfDayUtc - baseTime) / intervalMs)) * intervalMs;
      for (let time = first; time < endOfDayUtc; time += intervalMs) {
        times.add(time);
      }
    }
  }

  return [...times].sort((a, b) => a - b);
}

/**
 * Xây dựng Discord payload cho 1 server
 */
function buildDiscordPayload(serverName, serverIcon, items, dateDisplay, tagEveryone) {
  const iconStr = serverIcon ? `${serverIcon} ` : "";
  let description = `📅 **BÁO CÁO LỊCH BOSS HÔM NAY — ${dateDisplay}**\n`;
  description += `🖥️ Server: **${iconStr}${serverName}**\n`;
  description += `Tổng số: **${items.length} lượt boss** xuất hiện trong ngày hôm nay (00:00 - 24:00).\n\n`;

  if (items.length === 0) {
    description += `*Hôm nay không có boss cố định hoặc đếm ngược nào được lên lịch.*`;
  } else {
    description += `**Chi tiết các mốc boss trong ngày:**\n`;
    const lines = items.map(it => {
      const timeStr = new Date(it.eventTime + 7 * 3600 * 1000).toISOString().slice(11, 16);
      const lvStr = it.boss.level ? ` (Lv.${it.boss.level})` : "";
      const mapStr = it.boss.map ? ` · *${it.boss.map}*` : "";
      return `\`${timeStr}\` **${it.boss.name}**${lvStr}${mapStr}`;
    });

    const maxLines = 35;
    if (lines.length > maxLines) {
      description += lines.slice(0, maxLines).join("\n") + `\n*...và ${lines.length - maxLines} lượt boss khác.*`;
    } else {
      description += lines.join("\n");
    }
  }

  return {
    username: "Boss Tracker Alert",
    avatar_url: "https://cdn-icons-png.flaticon.com/512/10329/10329997.png",
    content: `${tagEveryone ? "@everyone " : ""}📢 **[${iconStr}${serverName}] BÁO CÁO LỊCH BOSS HÔM NAY (00:00 - 24:00)**`,
    embeds: [
      {
        title: `📅 [${iconStr}${serverName}] LỊCH BOSS HÔM NAY — ${dateDisplay}`,
        description: description,
        color: 3447003,
        footer: { text: "Boss Timeline Pro • Tự động gửi lúc 00:00 hàng ngày (Vercel Cron)" },
        timestamp: new Date().toISOString()
      }
    ],
    allowed_mentions: { parse: tagEveryone ? ["everyone"] : [] }
  };
}

export function createCronDailyHandler({ fetchImpl = globalThis.fetch, env = process.env, now = () => getVnNow() } = {}) {
  return async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method && req.method !== "GET") return res.status(405).json({ success: false, error: "Method Not Allowed" });
  const cronSecret = String(env.CRON_SECRET || "").trim();
  if (!cronSecret) return res.status(503).json({ success: false, error: "Cron is not configured" });
  const authorization = String(req.headers?.authorization || req.headers?.Authorization || "");
  if (!authorization.startsWith("Bearer ") || !secretsEqual(authorization.slice(7), cronSecret)) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }

  const databaseUrl = (env.FIREBASE_DATABASE_URL || DEFAULT_DATABASE_URL).trim().replace(/\/$/, "");
  const nowTimestamp = now();
  const vnNow = getVnDateParts(nowTimestamp);

  const dayNames = ["Chủ Nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
  const dayStr = dayNames[vnNow.day];
  const dd = String(vnNow.date).padStart(2, "0");
  const mm = String(vnNow.month + 1).padStart(2, "0");
  const yyyy = vnNow.year;
  const dateDisplay = `${dayStr}, ${dd}/${mm}/${yyyy}`;

  // ─── Bước 1: Lấy danh sách servers từ Firebase ───────────────────────────
  let serversList = [];
  try {
    const svListRes = await fetchImpl(firebaseUrl(databaseUrl, "boss_timeline_servers_list", env), {
      signal: AbortSignal.timeout(10000)
    });
    if (svListRes.ok) {
      const raw = await svListRes.json();
      // raw có thể là array hoặc object {0: {...}, 1: {...}}
      if (Array.isArray(raw)) {
        serversList = raw.filter(Boolean);
      } else if (raw && typeof raw === "object") {
        serversList = Object.values(raw).filter(Boolean);
      }
    }
  } catch (_) {
    // ignore — fallback về s1 mặc định bên dưới
  }

  // Nếu Firebase không có danh sách → chỉ xử lý s1 mặc định
  if (serversList.length === 0) {
    serversList = [{ id: "s1", name: "Server 10", icon: "🌐" }];
  }

  // ─── Bước 2: Với mỗi server, đọc boss state → gửi Discord ────────────────
  const results = [];

  for (const server of serversList) {
    const serverId = server.id || "s1";
    const serverName = server.name || serverId;
    const serverIcon = server.icon || "";
    if (!/^[a-zA-Z0-9_-]{1,64}$/.test(serverId)) {
      results.push({ serverId, serverName, status: "skipped", reason: "Invalid server ID" });
      continue;
    }

    const suffix = serverId.toUpperCase().replace(/-/g, "_");
    let webhookUrl = "";
    let config;
    try {
      const configPath = serverId === "s1" ? "boss_timeline_discord_config" : `boss_timeline_servers/${serverId}/discord_config`;
      const configRes = await fetchImpl(firebaseUrl(databaseUrl, configPath, env), { signal: AbortSignal.timeout(8000) });
      if (!configRes.ok) throw new Error("Cannot read Discord settings");
      config = await configRes.json();
      if (!config?.enabled || config.notifyDailySchedule === false) {
        results.push({ serverId, serverName, status: "disabled" });
        continue;
      }
      const webhookRes = await fetchImpl(firebaseUrl(databaseUrl, `boss_timeline_webhook_urls/${serverId}`, env), { signal: AbortSignal.timeout(8000) });
      if (!webhookRes.ok) throw new Error("Cannot read Discord webhook settings");
      const stored = await webhookRes.json();
      webhookUrl = (stored?.url || env[`DISCORD_WEBHOOK_${suffix}`] || env.DISCORD_WEBHOOK_URL || "").trim();
    } catch (error) {
      results.push({ serverId, serverName, status: "error", reason: error.message });
      continue;
    }

    if (!webhookUrl || !/^https:\/\/(?:discord|discordapp)\.com\/api\/webhooks\/\d+\/[A-Za-z0-9_-]+(?:\?.*)?$/.test(webhookUrl)) {
      results.push({ serverId, serverName, status: "skipped", reason: `No valid webhook: DISCORD_WEBHOOK_${suffix}` });
      continue;
    }

    const dateKey = `${yyyy}-${mm}-${dd}`;
    const lockUrl = firebaseUrl(databaseUrl, `boss_timeline_cron_runs/${dateKey}/${serverId}`, env);
    const owner = randomUUID();
    let claimed = false;
    try {
      const claim = await mutateCronLock(fetchImpl, lockUrl, current => {
        if (current?.state === "sent") return undefined;
        if (current?.state === "pending" && nowTimestamp - Number(current.claimedAt || 0) < 10 * 60 * 1000) return undefined;
        return { state: "pending", owner, claimedAt: nowTimestamp };
      });
      if (!claim.committed) {
        results.push({ serverId, serverName, status: claim.current?.state === "sent" ? "already_sent" : "busy" });
        continue;
      }
      claimed = true;
    } catch (error) {
      results.push({ serverId, serverName, status: "error", reason: error.message });
      continue;
    }

    // Path Firebase: s1 dùng root path, các server khác dùng path riêng
    const statePath = serverId === "s1"
      ? firebaseUrl(databaseUrl, "boss_timeline_state/data", env)
      : firebaseUrl(databaseUrl, `boss_timeline_servers/${serverId}/state/data`, env);

    let bosses = [];
    let history = [];
    try {
      const stateRes = await fetchImpl(statePath, { signal: AbortSignal.timeout(15000) });
      if (stateRes.ok) {
        const stateData = await stateRes.json();
        bosses = Array.isArray(stateData?.bosses) ? stateData.bosses : [];
        history = Array.isArray(stateData?.history) ? stateData.history : [];
      } else {
        if (claimed) await mutateCronLock(fetchImpl, lockUrl, current => current?.owner === owner ? null : undefined).catch(() => {});
        results.push({ serverId, serverName, status: "error", reason: `Firebase fetch failed: HTTP ${stateRes.status}` });
        continue;
      }
    } catch (err) {
      if (claimed) await mutateCronLock(fetchImpl, lockUrl, current => current?.owner === owner ? null : undefined).catch(() => {});
      results.push({ serverId, serverName, status: "error", reason: `Firebase fetch error: ${err.message}` });
      continue;
    }

    // Tính toán các mốc boss trong ngày
    const items = [];
    bosses.forEach((boss, idx) => {
      const times = calculateBossEventTimesForToday(boss, history, nowTimestamp);
      times.forEach(eventTime => {
        items.push({ boss, eventTime, order: idx });
      });
    });
    items.sort((a, b) => (a.eventTime - b.eventTime) || (a.order - b.order));

    // Build payload và gửi Discord
    const payload = buildDiscordPayload(serverName, serverIcon, items, dateDisplay, config.tagEveryone !== false);
    let body = JSON.stringify(payload);
    let headers = { "Content-Type": "application/json" };
    if (items.length > 35 || payload.embeds[0].description.length > 4096) {
      payload.embeds[0].description = `Tổng số: **${items.length} lượt boss**. Toàn bộ lịch nằm trong tệp CSV đính kèm (UTC+7).`;
      const cell = value => {
        let text = String(value ?? "");
        if (/^[\s]*[=+@-]/.test(text)) text = "'" + text;
        return '"' + text.replaceAll('"', '""') + '"';
      };
      const csv = "\uFEFF" + [["Giờ (UTC+7)", "Boss", "Level", "Map"], ...items.map(item => [
        new Date(item.eventTime + 7 * 3600000).toISOString().slice(11, 19), item.boss.name, item.boss.level || "", item.boss.map || ""
      ])].map(row => row.map(cell).join(",")).join("\r\n");
      const form = new FormData();
      form.append("payload_json", JSON.stringify(payload));
      form.append("files[0]", new Blob([csv], { type: "text/csv;charset=utf-8" }), `lich_boss_${dateKey}.csv`);
      body = form;
      headers = undefined;
    }
    let discordAccepted = false;
    try {
      const discordRes = await fetchImpl(webhookUrl, {
        method: "POST",
        headers,
        body,
        signal: AbortSignal.timeout(15000)
      });

      if (discordRes.ok) {
        discordAccepted = true;
        await mutateCronLock(fetchImpl, lockUrl, current => current?.owner === owner
          ? { ...current, state: "sent", sentAt: nowTimestamp } : undefined);
        results.push({ serverId, serverName, status: "sent", bossCount: items.length });
      } else {
        if (claimed) await mutateCronLock(fetchImpl, lockUrl, current => current?.owner === owner ? null : undefined).catch(() => {});
        const errText = await discordRes.text().catch(() => "");
        results.push({ serverId, serverName, status: "discord_error", httpStatus: discordRes.status, details: errText });
      }
    } catch (err) {
      // Release only when delivery definitely failed. If Discord accepted the
      // request but recording "sent" failed, preserve the pending claim to avoid
      // an immediate duplicate on retry.
      if (claimed && !discordAccepted) await mutateCronLock(fetchImpl, lockUrl, current => current?.owner === owner ? null : undefined).catch(() => {});
      results.push({ serverId, serverName, status: "error", reason: `Discord send error: ${err.message}` });
    }
  }

  const sentCount = results.filter(r => r.status === "sent").length;
  const failed = results.some(result => ["error", "discord_error", "skipped"].includes(result.status));
  return res.status(failed ? 502 : 200).json({
    success: !failed,
    date: dateDisplay,
    summary: `Sent to ${sentCount}/${serversList.length} servers`,
    results
  });
  };
}

export default createCronDailyHandler();
