const DEFAULT_DATABASE_URL = "https://time-boss-chill-default-rtdb.asia-southeast1.firebasedatabase.app";

function getVnNow() {
  // Trả về thời gian hiện tại theo UTC
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
  // Xác định khoảng thời gian đầu ngày và cuối ngày theo UTC+7
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

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  const databaseUrl = process.env.FIREBASE_DATABASE_URL || DEFAULT_DATABASE_URL;
  const webhookUrl = (process.env.DISCORD_WEBHOOK_S1 || process.env.DISCORD_WEBHOOK_URL || "").trim();

  if (!webhookUrl || !/^https:\/\/(?:discord|discordapp)\.com\/api\/webhooks\/\d+\/[A-Za-z0-9_-]+(?:\?.*)?$/.test(webhookUrl)) {
    return res.status(500).json({ error: "Missing or invalid DISCORD_WEBHOOK_URL on server." });
  }

  try {
    // 1. Đọc dữ liệu state từ Firebase
    const stateRes = await fetch(`${databaseUrl}/boss_timeline_state/data.json`, { signal: AbortSignal.timeout(15000) });
    if (!stateRes.ok) {
      return res.status(502).json({ error: "Failed to fetch boss state from Firebase." });
    }
    const stateData = await stateRes.json();
    const bosses = Array.isArray(stateData?.bosses) ? stateData.bosses : [];
    const history = Array.isArray(stateData?.history) ? stateData.history : [];

    const now = getVnNow();
    const vnNow = getVnDateParts(now);

    const dayNames = ["Chủ Nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
    const dayStr = dayNames[vnNow.day];
    const dd = String(vnNow.date).padStart(2, "0");
    const mm = String(vnNow.month + 1).padStart(2, "0");
    const yyyy = vnNow.year;
    const dateDisplay = `${dayStr}, ${dd}/${mm}/${yyyy}`;

    // 2. Tính toán danh sách boss xuất hiện trong ngày
    const items = [];
    bosses.forEach((boss, idx) => {
      const times = calculateBossEventTimesForToday(boss, history, now);
      times.forEach(eventTime => {
        items.push({ boss, eventTime, order: idx });
      });
    });

    items.sort((a, b) => (a.eventTime - b.eventTime) || (a.order - b.order));

    // 3. Xây dựng nội dung gửi Discord
    let description = `📅 **BÁO CÁO LỊCH BOSS HÔM NAY — ${dateDisplay}**\n`;
    description += `Tổng số: **${items.length} lượt boss** xuất hiện trong ngày hôm nay (00:00 - 24:00).\n\n`;

    if (items.length === 0) {
      description += `*Hôm nay không có boss cố định hoặc đếm ngược nào được lên lịch.*`;
    } else {
      description += `**Chi tiết các mốc boss trong ngày:**\n`;
      // Chia danh sách các mốc boss ngắn gọn
      const lines = items.map((it, i) => {
        const timeStr = new Date(it.eventTime + 7 * 3600 * 1000).toISOString().slice(11, 16);
        const lvStr = it.boss.level ? ` (Lv.${it.boss.level})` : "";
        const mapStr = it.boss.map ? ` · *${it.boss.map}*` : "";
        return `\`${timeStr}\` **${it.boss.name}**${lvStr}${mapStr}`;
      });

      // Nếu danh sách quá dài, cắt bớt để không vượt quá giới hạn 4096 ký tự của Discord embed description
      const maxLines = 35;
      if (lines.length > maxLines) {
        description += lines.slice(0, maxLines).join("\n") + `\n*...và ${lines.length - maxLines} lượt boss khác.*`;
      } else {
        description += lines.join("\n");
      }
    }

    const payload = {
      username: "Boss Tracker Alert",
      avatar_url: "https://cdn-icons-png.flaticon.com/512/10329/10329997.png",
      content: "@everyone 📢 **BÁO CÁO LỊCH BOSS HÔM NAY (00:00 - 24:00)**",
      embeds: [
        {
          title: `📅 BÁO CÁO LỊCH BOSS HÔM NAY — ${dateDisplay}`,
          description: description,
          color: 3447003, // Blue
          footer: { text: "Boss Timeline Pro • Tự động gửi lúc 00:00 hàng ngày (Vercel Cron)" },
          timestamp: new Date().toISOString()
        }
      ],
      allowed_mentions: { parse: ["everyone"] }
    };

    // 4. Gửi lên Discord
    const discordRes = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15000)
    });

    if (!discordRes.ok) {
      const errText = await discordRes.text().catch(() => "");
      return res.status(502).json({ error: "Discord webhook rejected payload", status: discordRes.status, details: errText });
    }

    return res.status(200).json({
      success: true,
      message: `Sent daily schedule for ${dateDisplay} with ${items.length} boss events.`,
      date: dateDisplay,
      bossCount: items.length
    });
  } catch (error) {
    console.error("Cron daily schedule error:", error);
    return res.status(500).json({ error: error.message });
  }
}
