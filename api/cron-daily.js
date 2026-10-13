const DEFAULT_DATABASE_URL = "https://time-boss-chill-default-rtdb.asia-southeast1.firebasedatabase.app";

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
function buildDiscordPayload(serverName, serverIcon, items, dateDisplay) {
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
    content: `@everyone 📢 **[${iconStr}${serverName}] BÁO CÁO LỊCH BOSS HÔM NAY (00:00 - 24:00)**`,
    embeds: [
      {
        title: `📅 [${iconStr}${serverName}] LỊCH BOSS HÔM NAY — ${dateDisplay}`,
        description: description,
        color: 3447003,
        footer: { text: "Boss Timeline Pro • Tự động gửi lúc 00:00 hàng ngày (Vercel Cron)" },
        timestamp: new Date().toISOString()
      }
    ],
    allowed_mentions: { parse: ["everyone"] }
  };
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  const databaseUrl = (process.env.FIREBASE_DATABASE_URL || DEFAULT_DATABASE_URL).trim();
  const now = getVnNow();
  const vnNow = getVnDateParts(now);

  const dayNames = ["Chủ Nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
  const dayStr = dayNames[vnNow.day];
  const dd = String(vnNow.date).padStart(2, "0");
  const mm = String(vnNow.month + 1).padStart(2, "0");
  const yyyy = vnNow.year;
  const dateDisplay = `${dayStr}, ${dd}/${mm}/${yyyy}`;

  // ─── Bước 1: Lấy danh sách servers từ Firebase ───────────────────────────
  let serversList = [];
  try {
    const svListRes = await fetch(`${databaseUrl}/boss_timeline_servers_list.json`, {
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

    // Chọn đúng webhook cho server này: ưu tiên env var, fallback Firebase
    const suffix = serverId.toUpperCase().replace(/-/g, "_");
    let webhookUrl = (process.env[`DISCORD_WEBHOOK_${suffix}`] || "").trim();

    // Fallback: đọc từ Firebase boss_timeline_webhook_urls/{serverId}/url
    if (!webhookUrl) {
      try {
        const fbWebhookRes = await fetch(`${databaseUrl}/boss_timeline_webhook_urls/${serverId}.json`, {
          signal: AbortSignal.timeout(8000)
        });
        if (fbWebhookRes.ok) {
          const fbWebhookData = await fbWebhookRes.json();
          if (fbWebhookData && typeof fbWebhookData.url === "string") {
            webhookUrl = fbWebhookData.url.trim();
          }
        }
      } catch (_) {}
    }

    if (!webhookUrl || !/^https:\/\/(?:discord|discordapp)\.com\/api\/webhooks\/\d+\/[A-Za-z0-9_-]+(?:\?.*)?$/.test(webhookUrl)) {
      results.push({ serverId, serverName, status: "skipped", reason: `No valid webhook: DISCORD_WEBHOOK_${suffix}` });
      continue;
    }

    // Path Firebase: s1 dùng root path, các server khác dùng path riêng
    const statePath = serverId === "s1"
      ? `${databaseUrl}/boss_timeline_state/data.json`
      : `${databaseUrl}/boss_timeline_servers/${serverId}/state/data.json`;

    let bosses = [];
    let history = [];
    try {
      const stateRes = await fetch(statePath, { signal: AbortSignal.timeout(15000) });
      if (stateRes.ok) {
        const stateData = await stateRes.json();
        bosses = Array.isArray(stateData?.bosses) ? stateData.bosses : [];
        history = Array.isArray(stateData?.history) ? stateData.history : [];
      } else {
        results.push({ serverId, serverName, status: "error", reason: `Firebase fetch failed: HTTP ${stateRes.status}` });
        continue;
      }
    } catch (err) {
      results.push({ serverId, serverName, status: "error", reason: `Firebase fetch error: ${err.message}` });
      continue;
    }

    // Tính toán các mốc boss trong ngày
    const items = [];
    bosses.forEach((boss, idx) => {
      const times = calculateBossEventTimesForToday(boss, history, now);
      times.forEach(eventTime => {
        items.push({ boss, eventTime, order: idx });
      });
    });
    items.sort((a, b) => (a.eventTime - b.eventTime) || (a.order - b.order));

    // Build payload và gửi Discord
    const payload = buildDiscordPayload(serverName, serverIcon, items, dateDisplay);
    try {
      const discordRes = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(15000)
      });

      if (discordRes.ok) {
        results.push({ serverId, serverName, status: "sent", bossCount: items.length });
      } else {
        const errText = await discordRes.text().catch(() => "");
        results.push({ serverId, serverName, status: "discord_error", httpStatus: discordRes.status, details: errText });
      }
    } catch (err) {
      results.push({ serverId, serverName, status: "error", reason: `Discord send error: ${err.message}` });
    }
  }

  const sentCount = results.filter(r => r.status === "sent").length;
  return res.status(200).json({
    success: true,
    date: dateDisplay,
    summary: `Sent to ${sentCount}/${serversList.length} servers`,
    results
  });
}
