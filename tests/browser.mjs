import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createDevServer } from "../tools/dev-server.mjs";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || "playwright");
const server = createDevServer({ offline: true });
await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
const url = `http://127.0.0.1:${server.address().port}`;
const output = process.env.BOSS_TIMELINE_TEST_OUTPUT;
if (output) await mkdir(output, { recursive: true });
let browser;
const errors = [];
const checks = [];
try {
  browser = await chromium.launch({ headless: true, ...(process.env.CHROMIUM_EXECUTABLE ? { executablePath: process.env.CHROMIUM_EXECUTABLE } : {}) });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, timezoneId: "Asia/Bangkok", acceptDownloads: true });
  const page = await context.newPage();
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  // No test can write to a real Firebase project or send a real Discord message.
  await context.route("**/*", route => {
    const request = route.request();
    if (/firebaseio|firebasedatabase|identitytoolkit|securetoken|discord\.com/.test(request.url())) return route.abort();
    if (request.url().includes("/api/discord")) return route.fulfill({ status: 200, contentType: "application/json", body: '{"success":true}' });
    return route.continue();
  });
  await page.goto(url, { waitUntil: "networkidle" });
  if (await page.locator("#authModal.open").count()) await page.locator("#chooseMemberBtn").click();
  assert.equal(await page.locator("#attendanceContent").isVisible(), false);
  await page.evaluate(() => switchPageView("attendance"));
  assert.equal(await page.locator("#attendanceAccessNotice").isVisible(), true);
  assert.equal(await page.locator("#attTableBody").textContent(), "");
  checks.push("Guest attendance access is blocked");

  await page.evaluate(() => {
    firebaseAuth = { currentUser: { uid: "offline-test-only", displayName: "Test admin", getIdToken: async () => "offline-test-token" } };
    currentUserIsAdmin = true;
    const now = Date.now();
    const midnight = new Date(); midnight.setHours(0, 0, 0, 0);
    state = { bosses: [
      normalizeBoss({ id: "interval", name: '=SUM(A1), "Boss"', map: 'Map,"Quoted"', respawnMinutes: 360, lastRespawnAt: midnight.getTime() - 3600000, notes: "=HYPERLINK()\nquoted" }),
      normalizeBoss({ id: "fixed", name: "Fixed Boss", spawnMode: "fixed", fixedSchedules: [{ day: "all", time: "00:00" }, { day: "all", time: "18:00" }] })
    ], history: [] };
    bossSyncBase = cloneRealtimeValue(state);
    serverList = [{ id: "s1", name: "One" }, { id: "s2", name: "Two" }];
    attendanceState = normalizeAttendanceState({ activeWeekId: "w1", weeks: [{ id: "w1", name: "Original Week", dateRange: "05/10 - 11/10", diasPool: 101, usdtPool: 10.01, minimumParticipationPercent: 50,
      activities: [{ id: "a", name: "First Boss", points: 0.1 }, { id: "b", name: "Second Boss", points: 0.1 }],
      members: [
        { id: "m1", name: "Decimal Member", serverId: "s1", multiplier: 1.25, records: { a: true } },
        { id: "m2", name: '<img src=x onerror="window.__xss=1">', serverId: "s2", multiplier: 2.5, records: { a: true, b: true } }
      ] }] }, "s1");
    attendanceSyncBase = getAttendanceSyncData(attendanceState);
    setRole("admin", "Test admin");
    saveStateLocal(false);
    renderAttendanceTable();
    switchPageView("boss");
  });
  await page.locator('#bossGrid [data-action="kill"][data-id="interval"]').click();
  assert.equal(await page.locator("#killConfirmModal").isVisible(), true);
  await page.locator("#killConfirmCancelBtn").click();
  assert.equal(await page.evaluate(() => state.bosses[0].diedAt), null);
  await page.locator('#bossGrid [data-action="kill"][data-id="interval"]').click();
  await page.locator("#killConfirmOkBtn").click();
  assert.ok(await page.evaluate(() => state.bosses[0].diedAt));
  await page.locator('#bossGrid [data-action="revive"][data-id="interval"]').click();
  await page.locator("#reviveConfirmOkBtn").click();
  assert.equal(await page.evaluate(() => state.bosses[0].respawnsAt), null);
  checks.push("Kill/revive confirmation, cancellation and state transitions");

  await page.locator("#discordSettingsBtn").click();
  assert.equal(await page.locator("#discordSettingsModal").isVisible(), true);
  assert.equal(await page.locator("#discordLogoUrl").evaluate(element => element === document.activeElement), true);
  await page.locator("#discordCancelBtn").click();
  checks.push("Discord settings open without a reference error");

  await page.locator("#exportCsvBtn").scrollIntoViewIfNeeded();
  const csvDownload = page.waitForEvent("download");
  await page.locator("#exportCsvBtn").click();
  const csv = await csvDownload;
  const text = await readFile(await csv.path(), "utf8");
  assert.ok(text.includes('"\'=SUM(A1), ""Boss"""'));
  assert.ok(text.includes('"Map,""Quoted"""'));
  assert.ok(text.includes('"\'=HYPERLINK()'));
  assert.equal(await page.locator("#boss-schedule").evaluate(element => element.classList.contains("open")), true);
  checks.push("CSV download quotes and formula protection; export leaves the schedule open");
  const reportPromise = page.waitForEvent("popup");
  await page.locator("#exportPdfBtn").click();
  const report = await reportPromise;
  await report.waitForLoadState();
  assert.equal(await report.locator("tbody tr").count(), await page.locator("#todayScheduleBody tr").count());
  assert.equal(await report.locator("tbody img").count(), 0);
  const pdf = await report.pdf({ landscape: true, format: "A4" });
  assert.equal(pdf.subarray(0, 4).toString(), "%PDF");
  await report.close();
  checks.push("Printable PDF report contains the same complete schedule");

  await page.locator("#addBossBtn").click();
  await page.locator("#bossName").fill("Temporary Boss");
  await page.locator("#bossMap").fill("Test Map");
  await page.locator("#bossLevel").fill("90");
  await page.locator("#bossRespawn").fill("1800");
  await page.locator('#bossForm button[type="submit"]').click();
  await page.waitForFunction(() => state.bosses.some(b => b.name === "Temporary Boss"));
  const addEvidence = await page.evaluate(() => ({ bosses: state.bosses, invalid: [...document.querySelectorAll("#bossForm :invalid")].map(input => ({ id: input.id, message: input.validationMessage })), name: document.getElementById("bossName").value, modal: document.getElementById("bossModal").className }));
  assert.ok(addEvidence.bosses.some(b => b.name === "Temporary Boss" && b.respawnMinutes === 1800), JSON.stringify({ addEvidence, errors }));
  await page.locator("#searchBoss").fill("Temporary Boss");
  await page.locator('#bossGrid [data-action="edit"]').click();
  await page.locator("#deleteBossBtn").click();
  await page.locator("#confirmModalOkBtn").click();
  assert.equal(await page.evaluate(() => state.bosses.some(b => b.name === "Temporary Boss")), false);
  await page.locator("#searchBoss").fill("");
  await page.locator("#resetAllTimersBtn").click();
  await page.locator("#confirmModalOkBtn").click();
  assert.equal(await page.evaluate(() => state.bosses.every(b => b.diedAt === null && b.respawnsAt === null)), true);
  await page.evaluate(async () => { await switchServer("s2"); await switchServer("s1"); });
  assert.equal(await page.evaluate(() => state.bosses.length), 2);
  checks.push("Boss add/delete/reset/search and server-specific localStorage");

  await page.evaluate(() => switchPageView("attendance"));
  const scopeTotals = await page.evaluate(() => {
    const calculation = calculateAttendanceData(attendanceState);
    const all = getAttendanceScopeData(calculation, "all");
    const s1 = getAttendanceScopeData(calculation, "s1");
    const s2 = getAttendanceScopeData(calculation, "s2");
    return { allMembers: all.membersCount, allDias: all.diasPool, allUsdt: all.usdtPool,
      serverDias: s1.diasPool + s2.diasPool, serverUsdt: s1.usdtPool + s2.usdtPool };
  });
  assert.equal(scopeTotals.allMembers, 2);
  assert.equal(scopeTotals.serverDias, scopeTotals.allDias);
  assert.equal(scopeTotals.serverUsdt, scopeTotals.allUsdt);
  await page.evaluate(() => {
    attendanceState.weeks[0].members.forEach(member => { if (member.records) delete member.records.a; });
    renderAttendanceTable();
  });
  await page.locator('#attServerSummary [data-server-scope="s1"]').click();
  assert.equal(await page.locator("#attFilterServer").inputValue(), "s1");
  assert.equal(await page.locator("#attTotalMembersCount").textContent(), "1");
  await page.locator('.att-check-all-box[data-act-id="a"]').check();
  const scopedChecks = await page.evaluate(() => Object.fromEntries(attendanceState.weeks[0].members.map(member => [member.id, Boolean(member.records?.a)])));
  assert.equal(scopedChecks.m1, true);
  assert.equal(scopedChecks.m2, false);
  await page.locator('#attServerSummary [data-server-scope="all"]').click();
  assert.equal(await page.locator("#attTotalMembersCount").textContent(), "2");
  await page.locator("#attFilterServer").selectOption("s1");
  assert.equal(await page.locator('#attTableBody tr[data-member-id]').count(), 1);
  await page.locator("#attFilterServer").selectOption("all");
  await page.locator("#attSearchInput").fill("Decimal Member");
  assert.equal(await page.locator('#attTableBody tr[data-member-id]').count(), 1);
  await page.locator("#attSearchInput").fill("");
  await page.locator('.att-del-member-btn[data-member-id="m2"]').click();
  assert.equal(await page.locator("#confirmModalMessage img").count(), 0);
  assert.ok((await page.locator("#confirmModalMessage").textContent()).includes("<img"));
  assert.equal(await page.evaluate(() => window.__xss), undefined);
  await page.locator("#confirmModalCancelBtn").click();
  checks.push("Attendance server scopes, shared-pool allocation, filters and XSS-safe deletion popup");

  const originalWeek = await page.evaluate(() => JSON.stringify(attendanceState.weeks[0]));
  await page.locator("#attAddNewWeekBtn").click();
  await page.locator("#attWeekNameInput").fill("New Week");
  await page.locator("#attWeekClearBossesOption").uncheck();
  await page.evaluate(() => saveAttendanceWeek());
  const newWeek = await page.evaluate(() => ({ original: JSON.stringify(attendanceState.weeks[0]), current: getActiveWeek() }));
  assert.equal(newWeek.original, originalWeek);
  assert.equal(newWeek.current.activities.length, 2);
  assert.equal(newWeek.current.members[0].multiplier, 1.25);
  assert.equal(newWeek.current.members[1].serverId, "s2");
  assert.deepEqual(newWeek.current.members[0].records, {});
  checks.push("New week preserves the prior week, members, decimal multipliers and assignments");

  for (const width of [1440, 768, 390, 360]) {
    await page.setViewportSize({ width, height: width > 1000 ? 1000 : 844 });
    await page.evaluate(() => switchPageView("boss"));
    await page.locator("#boss-schedule").scrollIntoViewIfNeeded();
    const geometry = await page.evaluate(() => ({ width: innerWidth, body: document.body.scrollWidth, document: document.documentElement.scrollWidth }));
    const overflow = await page.evaluate(() => [...document.querySelectorAll("body *")].filter(element => { const box = element.getBoundingClientRect(); return box.width && (box.right > innerWidth + 1 || box.left < -1) && getComputedStyle(element).position !== "fixed"; }).slice(0, 18).map(element => ({ tag: element.tagName, id: element.id, class: element.className, right: element.getBoundingClientRect().right, width: element.getBoundingClientRect().width })));
    if (output) await page.screenshot({ path: resolve(output, `boss-${width}.png`) });
    assert.ok(geometry.body <= width && geometry.document <= width, `Overflow at ${width}: ${JSON.stringify({ geometry, overflow })}`);
    await page.evaluate(() => switchPageView("attendance"));
    const attendance = await page.evaluate(() => ({ body: document.body.scrollWidth, document: document.documentElement.scrollWidth }));
    assert.ok(attendance.body <= width && attendance.document <= width, `Attendance overflow at ${width}`);
    if (output) await page.screenshot({ path: resolve(output, `attendance-${width}.png`) });
  }
  await page.locator("#themeToggleBtn").click();
  await page.waitForFunction(() => getComputedStyle(document.getElementById("dashboard")).backgroundColor === "rgba(255, 255, 255, 0.95)"
    && getComputedStyle(document.getElementById("headerClock")).color === "rgb(12, 36, 97)");
  assert.equal(await page.locator("html").getAttribute("data-theme"), "light");
  if (output) await page.screenshot({ path: resolve(output, "attendance-theme.png") });
  checks.push("Desktop/tablet/mobile layout and theme switching");
  await page.evaluate(() => { currentUserIsAdmin = false; setRole("member"); });
  assert.equal(await page.locator("#attendanceContent").isVisible(), false);
  assert.equal(await page.locator("#attTableBody").textContent(), "");
  checks.push("Logout hides and removes rendered payroll rows");
  assert.deepEqual(errors, [], "Browser runtime/console errors");
  console.log(JSON.stringify({ passed: checks.length, checks, errors }, null, 2));
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
