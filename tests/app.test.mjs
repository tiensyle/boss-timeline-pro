import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";
import { setImmediate } from "node:timers/promises";

const source = readFileSync(new URL("../assets/app.js", import.meta.url), "utf8");
const copy = value => JSON.parse(JSON.stringify(value));

function load(names, globals = {}) {
  const context = vm.createContext({ console, Date, ...globals });
  for (const name of names) {
    const match = new RegExp(`^    (?:async )?function ${name}\\(`, "m").exec(source);
    assert.ok(match, `Missing function ${name}`);
    const end = source.indexOf("\n    }", match.index) + 6;
    vm.runInContext(source.slice(match.index, end), context);
  }
  return context;
}

test("concurrent field edits, attendance checkboxes and additions are preserved", () => {
  const ctx = load(["cloneRealtimeValue", "mergeRealtimeChanges"]);
  const base = { weeks: [{ id: "w1", members: [{ id: "m1", name: "A", records: { a: false, b: false } }] }] };
  const local = copy(base);
  local.weeks[0].members[0].name = "Edited";
  local.weeks[0].members[0].records.a = true;
  local.weeks.push({ id: "w2", members: [] });
  const remote = copy(base);
  remote.weeks[0].members[0].records.b = true;
  remote.weeks[0].members.push({ id: "m2", name: "B", records: {} });
  remote.weeks.push({ id: "w3", members: [] });
  const merged = copy(ctx.mergeRealtimeChanges(base, local, remote));
  assert.deepEqual(merged.weeks[0].members[0], { id: "m1", name: "Edited", records: { a: true, b: true } });
  assert.deepEqual(merged.weeks.map(w => w.id).sort(), ["w1", "w2", "w3"]);
  assert.equal(merged.weeks[0].members[1].id, "m2");
});

test("intentional array reorders survive realtime merges with remote-only additions", () => {
  const ctx = load(["cloneRealtimeValue", "mergeRealtimeChanges"]);
  const base = [{ id: "a" }, { id: "b" }, { id: "c" }];
  const local = [{ id: "c" }, { id: "a" }, { id: "b" }];
  const remote = [{ id: "a", note: "remote edit" }, { id: "b" }, { id: "c" }, { id: "d" }];
  const merged = copy(ctx.mergeRealtimeChanges(base, local, remote));

  assert.deepEqual(merged.map(item => item.id), ["c", "a", "b", "d"]);
  assert.equal(merged[1].note, "remote edit");
});

test("attendance server scopes preserve guild totals and allocated payroll", () => {
  const ctx = load(["getAttendanceScopeData"]);
  const membersCalc = [
    { serverId: "s1", rawPoints: 8, pPoints: 12, eligible: true, eligiblePPoints: 12, dias: 70, usdt: 7.01 },
    { serverId: "s1", rawPoints: 3, pPoints: 3, eligible: false, eligiblePPoints: 0, dias: 0, usdt: 0 },
    { serverId: "s2", rawPoints: 4, pPoints: 8, eligible: true, eligiblePPoints: 8, dias: 31, usdt: 3.00 }
  ];
  const calc = { membersCalc, membersCount: 3, totalGuildRawPoints: 15, totalGuildPPoints: 23, totalEligiblePPoints: 20,
    eligibleMembersCount: 2, ineligibleMembersCount: 1, diasPool: 101, usdtPool: 10.01, diasRate: 5.05, usdtRate: 0.5005 };
  const all = ctx.getAttendanceScopeData(calc, "all");
  const s1 = ctx.getAttendanceScopeData(calc, "s1");
  const s2 = ctx.getAttendanceScopeData(calc, "s2");

  assert.equal(s1.membersCount, 2);
  assert.equal(s1.totalGuildPPoints, 15);
  assert.equal(s1.eligibleMembersCount, 1);
  assert.equal(s1.ineligibleMembersCount, 1);
  assert.equal(s1.diasPool + s2.diasPool, all.diasPool);
  assert.equal(s1.usdtPool + s2.usdtPool, all.usdtPool);
  assert.equal(all.membersCount, 3);
  assert.equal(ctx.getAttendanceScopeData(calc, "missing").membersCount, 0);
});

test("Firebase reads preserve the ordered boss array instead of map key order", () => {
  const ordered = [{ id: "dalia", name: "Quý bà Dalia" }, { id: "aquileus", name: "Tướng Aquileus" }];
  const map = { z: ordered[0], a: ordered[1] };
  const ctx = load(["getBossRemoteData"], { normalizeBoss: boss => boss });

  assert.deepEqual(copy(ctx.getBossRemoteData({ data: { bosses: ordered, history: [] }, bosses_map: map }).bosses), ordered);
  assert.deepEqual(copy(ctx.getBossRemoteData({ bosses_map: map, data: { history: [] } }).bosses), [ordered[0], ordered[1]]);
  assert.deepEqual(copy(ctx.getBossRemoteData({ data: { bosses: [], history: [] }, bosses_map: map }).bosses), []);
});

test("maintenance reset uses the requested boss order and keeps unknown bosses stable", async () => {
  const requestedOrder = [
    "Quý bà Dalia", "Tướng Aquileus", "Amentis", "Wannitas", "Duplican", "Metus",
    "Nam Tước Bradmore", "Gareth", "Titore", "Catena", "Shuliar", "Larba",
    "Secreta", "Ordo", "Asta", "Supore"
  ];
  const state = {
    bosses: [
      { id: "other-a", name: "Unlisted boss A", diedAt: 10, respawnsAt: 20 },
      ...requestedOrder.slice().reverse().map((name, index) => ({
        id: `rank-${requestedOrder.length - index - 1}`,
        name: index % 2 ? `${80 + index} ${name}` : name,
        diedAt: 10,
        respawnsAt: 20
      })),
      { id: "other-b", name: "Unlisted boss B", diedAt: 10, respawnsAt: 20 }
    ],
    history: []
  };
  const baseBosses = copy(state.bosses);
  const remoteBosses = [...copy(baseBosses), { id: "remote-add", name: "Remote addition" }];
  const ctx = load(["cloneRealtimeValue", "mergeRealtimeChanges", "sortBossesForMaintenance", "resetAllTimers"], {
    state,
    currentLang: "vi",
    bossSyncGeneration: 0,
    isAdmin: () => true,
    showConfirmModal: async () => true,
    getNow: () => 1000,
    saveState: () => {},
    render: () => {},
    showToast: () => {}
  });

  await ctx.resetAllTimers();

  assert.deepEqual(copy(state.bosses.map(boss => boss.id)), [
    ...requestedOrder.map((_, index) => `rank-${index}`), "other-a", "other-b"
  ]);
  const syncedBosses = copy(ctx.mergeRealtimeChanges(baseBosses, state.bosses, remoteBosses));
  assert.deepEqual(syncedBosses.map(boss => boss.id), [
    ...requestedOrder.map((_, index) => `rank-${index}`), "other-a", "other-b", "remote-add"
  ]);
  assert.ok(state.bosses.every(boss => boss.diedAt === null && boss.respawnsAt === null && boss.lastRespawnAt === 1000));
});

test("ready bosses stay above bosses recorded dead while respawns remain time-ordered", () => {
  const now = 1000;
  const ctx = load(["sortBossesForDisplay"], {
    activeLevelFilter: "all",
    getNextBossEventTime: boss => boss.nextAt
  });
  const bosses = [
    { id: "respawn-later", nextAt: 4000 },
    { id: "ready-first", nextAt: null },
    { id: "respawn-soon", nextAt: 2000 },
    { id: "ready-second", nextAt: null }
  ];

  assert.deepEqual(ctx.sortBossesForDisplay(bosses, now).map(boss => boss.id), [
    "ready-first", "ready-second", "respawn-soon", "respawn-later"
  ]);
});

test("level sorting applies within ready and respawning groups", () => {
  const now = 1000;
  const ctx = load(["sortBossesForDisplay"], {
    activeLevelFilter: "level-asc",
    getNextBossEventTime: boss => boss.nextAt
  });
  const bosses = [
    { id: "respawn-low", nextAt: 5000, level: 50 },
    { id: "ready-high", nextAt: null, level: 100 },
    { id: "respawn-high", nextAt: 3000, level: 90 },
    { id: "ready-low", nextAt: null, level: 60 }
  ];

  assert.deepEqual(ctx.sortBossesForDisplay(bosses, now).map(boss => boss.id), [
    "ready-low", "ready-high", "respawn-low", "respawn-high"
  ]);
});

test("suggested attendance weeks run from Saturday through the following Friday", () => {
  const ctx = load(["getSuggestedWeekRange"]);
  assert.equal(ctx.getSuggestedWeekRange(0, new Date(2026, 9, 9, 12)), "10/10 - 16/10/2026");
  assert.equal(ctx.getSuggestedWeekRange(1, new Date(2026, 9, 9, 12)), "17/10 - 23/10/2026");
  assert.equal(ctx.getSuggestedWeekRange(0, new Date(2027, 0, 3, 12)), "09/01 - 15/01/2027");
});

test("checking attendance in a historical week keeps that week selected after sync merge", () => {
  const state = {
    activeWeekId: "w2",
    weeks: [
      { id: "w1", members: [{ id: "m1", records: {} }], activities: [{ id: "a" }] },
      { id: "w2", members: [{ id: "m1", records: {} }], activities: [{ id: "a" }] }
    ]
  };
  const remote = copy(state);
  const ctx = load(["cloneRealtimeValue", "switchAttendanceWeek", "toggleAttendanceCheck", "mergeRealtimeChanges"], {
    attendanceState: state,
    attendanceSyncBase: copy(state),
    getActiveWeek: () => state.weeks.find(week => week.id === state.activeWeekId),
    saveAttendanceState: () => {},
    cacheAttendanceSyncState: () => {},
    renderAttendanceTable: () => {},
    showToast: () => {}
  });

  ctx.switchAttendanceWeek("w1");
  ctx.toggleAttendanceCheck("m1", "a", true);
  const merged = copy(ctx.mergeRealtimeChanges(ctx.attendanceSyncBase, ctx.attendanceState, remote));

  assert.equal(ctx.attendanceState.activeWeekId, "w1");
  assert.equal(ctx.attendanceSyncBase.activeWeekId, "w2");
  assert.equal(merged.activeWeekId, "w1");
  assert.equal(merged.weeks[0].members[0].records.a, true);
  assert.equal(merged.weeks[1].members[0].records.a, undefined);
});

test("attendance bulk selection follows the active server and visible filters", () => {
  const ctx = load(["filterAttendanceMembers"], {
    attendanceSearchTerm: "",
    attendanceServerFilter: "s1",
    attendanceMultiplierFilter: "all",
    getMemberServerId: member => member.serverId || "s1",
    getServerNameById: serverId => serverId === "s1" ? "One" : "Two"
  });
  const members = [
    { id: "m1", name: "Alice", serverId: "s1", multiplier: 1 },
    { id: "m2", name: "Bob", serverId: "s2", multiplier: 2 }
  ];

  assert.deepEqual(copy(ctx.filterAttendanceMembers(members)).map(member => member.id), ["m1"]);
  ctx.attendanceServerFilter = "all";
  ctx.attendanceSearchTerm = "bob";
  assert.deepEqual(copy(ctx.filterAttendanceMembers(members)).map(member => member.id), ["m2"]);
  ctx.attendanceSearchTerm = "";
  ctx.attendanceMultiplierFilter = "2";
  assert.deepEqual(copy(ctx.filterAttendanceMembers(members)).map(member => member.id), ["m2"]);
});

test("stale edits do not resurrect deleted bosses, weeks or members", () => {
  const ctx = load(["cloneRealtimeValue", "mergeRealtimeChanges"]);
  const base = [{ id: "a", name: "old" }, { id: "b", name: "keep" }];
  const local = [{ id: "a", name: "edit" }, base[1]];
  assert.deepEqual(copy(ctx.mergeRealtimeChanges(base, local, [base[1]])), [base[1]]);
  assert.deepEqual(copy(ctx.mergeRealtimeChanges(base, [base[1]], [...base, { id: "c" }])), [base[1], { id: "c" }]);
});

test("editing boss metadata preserves a concurrent timer and timer transitions stay atomic", () => {
  const ctx = load(["cloneRealtimeValue", "mergeRealtimeChanges", "mergeBossStateChanges"]);
  const base = { bosses: [{ id: "a", notes: "", diedAt: null, respawnsAt: null, lastRespawnAt: 100 }], history: [] };
  const local = copy(base);
  local.bosses[0].notes = "new note";
  const remote = copy(base);
  Object.assign(remote.bosses[0], { diedAt: 200, respawnsAt: 500 });
  assert.deepEqual(copy(ctx.mergeBossStateChanges(base, local, remote)).bosses[0], { ...remote.bosses[0], notes: "new note" });
  Object.assign(local.bosses[0], { diedAt: null, respawnsAt: null, lastRespawnAt: 300 });
  const merged = ctx.mergeBossStateChanges(base, local, remote);
  assert.equal(merged.bosses[0].diedAt, null);
  assert.equal(merged.bosses[0].respawnsAt, null);
  assert.equal(merged.bosses[0].lastRespawnAt, 300);
});

function bossSyncContext(transaction) {
  const state = { bosses: [{ id: "a", name: "A", notes: "", diedAt: null, respawnsAt: null, lastRespawnAt: null }], history: [] };
  return load(["cloneRealtimeValue", "mergeRealtimeChanges", "mergeBossStateChanges", "getBossRemoteData", "applyRemoteState", "saveState"], {
    state, bossSyncBase: copy(state), isAdmin: () => true, REALTIME_ENABLED: true,
    firebaseAuthReady: true,
    stateDbRef: { transaction }, normalizeBoss: copy, getNow: () => 1000000,
    saveStateLocal: () => {}, render: () => {}, setRealtimeStatus: () => {},
    lastLocalEditTime: 0, lastRemoteUpdatedAt: 0, lastRenderedGridKey: "",
    remoteStateReady: true, remoteSaveInFlight: false, pendingRemoteSave: false,
    bossSyncGeneration: 1, bossDeferredRemoteData: null, CLIENT_ID: "test-client"
  });
}

test("role and server changes retain the current Firebase connection status", () => {
  const callbacks = new Map();
  const statuses = [];
  const ctx = load(["initRealtimeSync"], {
    REALTIME_ENABLED: true,
    stateDbRef: { child: () => ({ on() {}, off() {} }) },
    firebaseDb: { ref: path => ({ on: (_event, callback) => callbacks.set(path, callback) }) },
    activeStateRef: null, activeDiscordConfigRef: null, discordConfigDbRef: null,
    connectedRefBound: false, firebaseRealtimeConnected: false, bossSyncGeneration: 1,
    isAdmin: () => false, setRealtimeStatus: type => statuses.push(type)
  });
  ctx.initRealtimeSync();
  assert.equal(statuses.at(-1), "connecting");
  callbacks.get(".info/connected")({ val: () => true });
  assert.equal(statuses.at(-1), "online");
  ctx.initRealtimeSync();
  ctx.bossSyncGeneration++;
  ctx.initRealtimeSync();
  assert.equal(statuses.at(-1), "online");
  assert.equal(callbacks.size, 2);
  callbacks.get(".info/connected")({ val: () => false });
  ctx.initRealtimeSync();
  assert.equal(statuses.at(-1), "connecting");
  callbacks.get(".info/connected")({ val: () => true });
  assert.equal(statuses.at(-1), "online");
});

test("edits made while a Firebase save is pending survive the acknowledgement", async () => {
  let resolveFirst;
  let remote;
  let calls = 0;
  const ctx = bossSyncContext(update => {
    remote = update(remote);
    calls++;
    if (calls === 1) return new Promise(resolve => { resolveFirst = () => resolve({ committed: true, snapshot: { val: () => remote } }); });
    return Promise.resolve({ committed: true, snapshot: { val: () => remote } });
  });
  remote = { data: copy(ctx.state), version: 1 };
  ctx.state.bosses[0].name = "First edit";
  const save = ctx.saveState();
  ctx.state.bosses[0].notes = "Second edit";
  await ctx.saveState();
  resolveFirst();
  await save;
  await setImmediate();
  assert.equal(calls, 2);
  assert.equal(ctx.state.bosses[0].notes, "Second edit");
  assert.equal(remote.bosses_map.a.notes, "Second edit");
  assert.deepEqual(Object.keys(remote.data).sort(), ["_clientId", "bosses", "history", "updated_at", "version"]);
});

test("failed boss save keeps the retry flag and server switches ignore stale acknowledgements", async () => {
  const ctx = bossSyncContext(() => Promise.reject(new Error("offline")));
  ctx.console = { error() {} };
  ctx.state.bosses[0].notes = "unsent";
  await ctx.saveState();
  assert.equal(ctx.pendingRemoteSave, true);
  assert.equal(ctx.state.bosses[0].notes, "unsent");
  let finish;
  ctx.stateDbRef.transaction = update => new Promise(resolve => { finish = () => resolve({ committed: true, snapshot: { val: () => update(null) } }); });
  const pending = ctx.saveState();
  ctx.bossSyncGeneration++;
  ctx.state = { bosses: [{ id: "other", name: "Other server" }], history: [] };
  finish();
  await pending;
  assert.equal(ctx.state.bosses[0].id, "other");
});

test("auth restoration cannot discard offline admin edits before permissions are known", () => {
  const ctx = bossSyncContext(() => {});
  ctx.state.bosses[0].notes = "Offline note";
  const remote = copy(ctx.bossSyncBase);
  remote.bosses[0].diedAt = 100;
  remote.bosses[0].respawnsAt = 200;
  ctx.firebaseAuthReady = false;
  ctx.applyRemoteState(remote.bosses, remote.history);
  assert.equal(ctx.state.bosses[0].notes, "Offline note");
  assert.equal(ctx.bossSyncBase.bosses[0].respawnsAt, null);
  ctx.firebaseAuthReady = true;
  ctx.applyRemoteState(remote.bosses, remote.history);
  assert.equal(ctx.state.bosses[0].notes, "Offline note");
  assert.equal(ctx.state.bosses[0].respawnsAt, 200);
});

const scheduleContext = () => load(["getTargetDateForFilter", "getBossScheduleEventTimes", "getBossScheduleItems"], { state: { bosses: [], history: [] }, scheduleDayFilter: "all" });

test("fixed schedule includes all daily slots, removes duplicates and excludes next midnight", () => {
  const ctx = scheduleContext();
  const now = new Date(2026, 9, 9, 12).getTime();
  const boss = { spawnMode: "fixed", fixedSchedules: [{ day: "all", time: "00:00" }, { day: "all", time: "18:00" }, { day: 5, time: "18:00" }] };
  const today = ctx.getBossScheduleEventTimes(boss, now, "today");
  assert.equal(today.length, 2);
  assert.equal(new Date(today[0]).getHours(), 0);
  assert.equal(ctx.getBossScheduleEventTimes(boss, now, "all").length, 14);
});

test("maintenance reset spawns appear in today's schedule before fixed boss times", () => {
  const now = new Date(2026, 9, 9, 14, 52).getTime();
  const fixedAt = time => new Date(2026, 9, 9, time, 0).getTime();
  const state = {
    bosses: [
      { id: "dalia", name: "Quý bà Dalia", spawnMode: "interval", respawnMinutes: 1080, lastRespawnAt: now },
      { id: "aquileus", name: "Tướng Aquileus", spawnMode: "interval", respawnMinutes: 1740, lastRespawnAt: now },
      { id: "roderick", name: "Roderick", spawnMode: "fixed", fixedSchedules: [{ day: 5, time: "18:00" }], lastRespawnAt: now },
      { id: "auraq", name: "Auraq", spawnMode: "fixed", fixedSchedules: [{ day: 5, time: "21:00" }], lastRespawnAt: now }
    ],
    history: [{ id: "maintenance", type: "respawn", bossId: "all", time: now }]
  };
  const ctx = load(["getTargetDateForFilter", "getBossScheduleEventTimes", "getBossScheduleItems"], { state });
  const today = copy(ctx.getBossScheduleItems(now, "today"));

  assert.deepEqual(today.map(item => item.boss.id), ["dalia", "aquileus", "roderick", "auraq"]);
  assert.deepEqual(today.map(item => item.eventTime), [now, now, fixedAt(18), fixedAt(21)]);
});

test("interval forecasts cover all 7 days, long cycles, boundaries and unknown anchors", () => {
  const ctx = scheduleContext();
  const midnight = new Date(2026, 9, 9).getTime();
  const boss = { spawnMode: "interval", respawnMinutes: 360, respawnsAt: midnight };
  assert.equal(ctx.getBossScheduleEventTimes(boss, midnight + 12 * 3600000, "today").length, 4);
  assert.equal(ctx.getBossScheduleEventTimes(boss, midnight, "all").length, 28);
  assert.equal(ctx.getBossScheduleEventTimes({ ...boss, respawnMinutes: 2880 }, midnight, "all").length, 4);
  assert.equal(ctx.getBossScheduleEventTimes({ ...boss, respawnMinutes: 1800 }, midnight, "all").length, 6);
  assert.equal(ctx.getBossScheduleEventTimes({ ...boss, respawnsAt: midnight + 86400000 }, midnight, "today").length, 0);
  assert.equal(ctx.getBossScheduleEventTimes({ spawnMode: "interval" }, midnight, "all").length, 0);
});

test("CSV cells escape quotes, comma/newline text and spreadsheet formulas", () => {
  const { escapeCsvCell } = load(["escapeCsvCell"]);
  assert.equal(escapeCsvCell('A,"B"\nC'), '"A,""B""\nC"');
  for (const value of ["=1+1", "+SUM(A1)", "-1+2", "@SUM(A1)", "  =HYPERLINK()", "\tname"]) {
    assert.ok(escapeCsvCell(value).startsWith('"\''), value);
  }
  assert.equal(escapeCsvCell("Normal"), '"Normal"');
});

function attendanceContext(globals = {}) {
  return load(["normalizeMinimumParticipationPercent", "allocateLargestRemainder", "getMemberServerId", "calculateAttendanceData"], {
    serverList: [{ id: "s1", name: "One" }, { id: "s2", name: "Two" }],
    getDefaultAttendanceServerId: () => "s1", getServerNameById: id => id, ...globals
  });
}

test("P.Point decimals and exact participation thresholds allocate complete DIAS/USDT pools", () => {
  const ctx = attendanceContext();
  const week = { diasPool: 101, usdtPool: 10.01, minimumParticipationPercent: 58,
    activities: [{ id: "a", points: 58 }, { id: "b", points: 42 }],
    members: [
      { id: "m1", serverId: "s1", multiplier: 1.25, records: { a: true } },
      { id: "m2", serverId: "s2", multiplier: 2.5, records: { a: true, b: true } },
      { id: "m3", serverId: "s2", multiplier: 1, records: { b: true } }
    ] };
  const calc = ctx.calculateAttendanceData(week);
  assert.equal(calc.membersCalc[0].pPoints, 72.5);
  assert.equal(calc.membersCalc[0].percent, 58);
  assert.equal(calc.membersCalc[0].eligible, true);
  assert.equal(calc.membersCalc[2].dias, 0);
  assert.equal(calc.membersCalc[2].usdt, 0);
  assert.equal(calc.membersCalc.reduce((sum, m) => sum + m.dias, 0), 101);
  assert.equal(calc.membersCalc.reduce((sum, m) => sum + Math.round(m.usdt * 100), 0), 1001);
  assert.equal(calc.serverSummaries.length, 2);
  const ineligible = ctx.calculateAttendanceData({ ...week, minimumParticipationPercent: 100, members: [week.members[0], week.members[2]] });
  assert.equal(ineligible.totalEligiblePPoints, 0);
  assert.ok(ineligible.membersCalc.every(m => m.dias === 0 && m.usdt === 0));
  const empty = ctx.calculateAttendanceData({ ...week, activities: [], members: [] });
  assert.equal(empty.diasRate, 0);
  assert.equal(empty.usdtRate, 0);
});

test("fractional point participation accepts an exact boundary", () => {
  const ctx = attendanceContext();
  const calc = ctx.calculateAttendanceData({ diasPool: 1, usdtPool: 0.01, minimumParticipationPercent: 50,
    activities: [{ id: "a", points: 0.1 }, { id: "b", points: 0.1 }],
    members: [{ id: "m", multiplier: 1.5, records: { a: true } }] });
  assert.equal(calc.membersCalc[0].percent, 50);
  assert.equal(calc.membersCalc[0].dias, 1);
});

test("legacy global attendance migration preserves all weeks and server assignments", async () => {
  const legacy = { weeks: [{ id: "old-week", members: [{ id: "m1", serverId: "s2", multiplier: 1.25 }], activities: [] }] };
  const paths = [];
  const ctx = load(["cloneRealtimeValue", "migrateLegacyFirebaseAttendanceIfNeeded"], {
    attendanceFirebaseMigrationInFlight: false, getDefaultAttendanceServerId: () => "s1",
    normalizeAttendanceState: value => value,
    firebaseDb: { ref(path) { paths.push(path); return { once: async () => ({ exists: () => true, val: () => legacy }) }; } }
  });
  assert.deepEqual(copy(await ctx.migrateLegacyFirebaseAttendanceIfNeeded()), legacy);
  assert.deepEqual(paths, ["boss_timeline_state/attendance_global"]);
  assert.equal(ctx.attendanceFirebaseMigrationInFlight, false);
});

test("attendance acknowledgement cannot restore sensitive data after logout", async () => {
  let finish;
  let applied = false;
  const ctx = load(["cloneRealtimeValue", "mergeRealtimeChanges", "getAttendanceSyncData", "pushAttendanceToFirebase"], {
    attendanceState: { weeks: [{ id: "w", name: "Edited" }] }, attendanceSyncBase: { weeks: [{ id: "w", name: "Old" }] },
    attendanceDbRef: { transaction: update => new Promise(resolve => { finish = () => resolve({ committed: true, snapshot: { val: () => update(null) } }); }) },
    isAdmin: () => true, attendanceRemotePermissionDenied: false, attendanceRemoteSaveInFlight: false,
    attendanceRemoteStateReady: true, attendanceFirebaseMigrationInFlight: false, attendanceSyncGeneration: 1,
    attendancePendingRemoteSave: false, attendanceDeferredRemoteData: null, CLIENT_ID: "test",
    normalizeAttendanceState: value => value, getDefaultAttendanceServerId: () => "s1",
    applyAttendanceRemoteData: () => { applied = true; }, handleAttendanceSyncError: () => {}
  });
  const pending = ctx.pushAttendanceToFirebase();
  ctx.attendanceSyncGeneration++;
  ctx.isAdmin = () => false;
  finish();
  await pending;
  assert.equal(applied, false);
});

test("two admin tabs claim a Discord alert atomically and a failed send can retry", async () => {
  const storage = new Map();
  const globals = {
    isAdmin: () => true, discordConfig: { enabled: true }, currentServerId: "s1",
    firebaseDb: { ref: path => ({ async transaction(update) {
      const next = update(storage.get(path) || null);
      if (next === undefined) return { committed: false, snapshot: { val: () => storage.get(path) || null } };
      storage.set(path, next);
      return { committed: true, snapshot: { val: () => next } };
    } }) }, getFirebaseServerPaths: () => ({ alertsPath: "alerts" })
  };
  const first = load(["sendDiscordAlertOnce"], { ...globals, CLIENT_ID: "first", activeDiscordNotified: {} });
  const second = load(["sendDiscordAlertOnce"], { ...globals, CLIENT_ID: "second", activeDiscordNotified: {} });
  let sends = 0;
  const results = await Promise.all([
    first.sendDiscordAlertOnce("same-event", 60000, async () => { sends++; return true; }),
    second.sendDiscordAlertOnce("same-event", 60000, async () => { sends++; return true; })
  ]);
  assert.equal(sends, 1);
  assert.equal(results.filter(Boolean).length, 1);
  assert.equal(storage.get("alerts/same-event").state, "sent");
  assert.equal(await first.sendDiscordAlertOnce("failed-event", 60000, async () => false), false);
  assert.equal(storage.get("alerts/failed-event"), null);
  assert.equal(await first.sendDiscordAlertOnce("failed-event", 60000, async () => true), true);
  assert.equal(await first.sendDiscordAlertOnce("failed-event", 60000, async () => true, true), true);
});

test("manual Discord schedule can bypass the automatic-notifications master switch", async () => {
  let sentForced;
  const ctx = load(["sendDiscordDailySchedule"], {
    discordConfig: { enabled: false, notifyDailySchedule: true },
    getNow: () => new Date("2026-10-09T00:00:00"),
    dateToYMD: () => "2026-10-09",
    sendDiscordAlertOnce: async (_id, _ttl, _deliver, forced) => { sentForced = forced; return true; }
  });

  assert.equal(await ctx.sendDiscordDailySchedule(true), true);
  assert.equal(sentForced, true);
  assert.equal(await ctx.sendDiscordDailySchedule(false), false);

  let deliveries = 0;
  const alertCtx = load(["sendDiscordAlertOnce"], {
    isAdmin: () => true,
    discordConfig: { enabled: false },
    activeDiscordNotified: {},
    firebaseDb: null,
    CLIENT_ID: "manual-test",
    currentServerId: "s1"
  });
  assert.equal(await alertCtx.sendDiscordAlertOnce("automatic", 60000, async () => { deliveries++; return true; }), false);
  assert.equal(await alertCtx.sendDiscordAlertOnce("manual", 60000, async () => { deliveries++; return true; }, true), true);
  assert.equal(deliveries, 1);
});

test("manual webhook delivery bypasses the automatic master switch only when explicitly allowed", async () => {
  const requests = [];
  const ctx = load(["deliverDiscordWebhook"], {
    discordConfig: { enabled: false },
    firebaseAuth: { currentUser: { getIdToken: async () => "admin-token" } },
    isAdmin: () => true,
    window: { location: { href: "https://site.example/", origin: "https://site.example" } },
    URL,
    AbortSignal,
    fetch: async (...args) => { requests.push(args); return { ok: true }; }
  });

  assert.equal(await ctx.deliverDiscordWebhook({}, null, "image.png", "s1"), false);
  assert.equal(await ctx.deliverDiscordWebhook({}, null, "image.png", "s1", true), true);
  assert.equal(requests.length, 1);
});

test("guest Discord alerts make no Firebase requests", async () => {
  let requests = 0;
  const ctx = load(["sendDiscordAlertOnce"], { isAdmin: () => false, discordConfig: { enabled: true }, firebaseDb: { ref() { requests++; } } });
  assert.equal(await ctx.sendDiscordAlertOnce("event", 60000, async () => true), false);
  assert.equal(requests, 0);
});

test("member mode reads shared attendance data without sending writes", () => {
  let valueListener;
  let errorListener;
  let appliedData = null;
  let writes = 0;
  const ref = {
    off() {},
    on(event, onValue, onError) {
      assert.equal(event, "value");
      valueListener = onValue;
      errorListener = onError;
    }
  };
  const ctx = load(["initAttendanceRealtimeSync"], {
    attendanceDbRef: ref,
    activeAttendanceRef: null,
    attendanceSyncGeneration: 0,
    attendanceRemoteStateReady: false,
    attendanceRemoteSaveInFlight: false,
    attendanceRemotePermissionDenied: false,
    attendanceDeferredRemoteData: null,
    attendanceFirebaseSeedAttempted: false,
    attendanceRemoteDataExists: false,
    isAdmin: () => false,
    applyAttendanceRemoteData: data => { appliedData = data; },
    pushAttendanceToFirebase: () => { writes += 1; },
    handleAttendanceSyncError: error => { throw error; }
  });

  ctx.initAttendanceRealtimeSync();
  assert.equal(typeof valueListener, "function");
  const sharedData = { weeks: [{ id: "week-1", members: [{ id: "m1", name: "Member" }] }] };
  valueListener({ val: () => sharedData });

  assert.equal(appliedData, sharedData);
  assert.equal(ctx.attendanceRemoteStateReady, true);
  assert.equal(ctx.attendanceRemoteDataExists, true);
  assert.equal(writes, 0);
  assert.equal(typeof errorListener, "function");
});

test("attendance deletion stays in the week that was confirmed even if the active week changes", () => {
  const state = { activeWeekId: "w2", weeks: ["w1", "w2"].map(id => ({ id, members: [{ id: "m", records: { a: true } }], activities: [{ id: "a" }] })) };
  const ctx = load(["deleteAttendanceMember", "deleteAttendanceActivity"], {
    attendanceState: state, isAdmin: () => true, saveAttendanceState: () => {}, renderAttendanceTable: () => {}, showToast: () => {},
    closeAttendanceActivityModal: () => {}, closeAttendanceMemberModal: () => {}
  });
  ctx.deleteAttendanceActivity("a", "w1");
  assert.equal(state.weeks[0].activities.length, 0);
  assert.equal(state.weeks[0].members[0].records.a, undefined);
  assert.equal(state.weeks[1].activities.length, 1);
  ctx.deleteAttendanceMember("m", "w1");
  assert.equal(state.weeks[0].members.length, 0);
  assert.equal(state.weeks[1].members.length, 1);
});

test("boss-only legacy data can initialize the public data branch without overwriting it with samples", async () => {
  let remote = { bosses_map: { real: { id: "real", name: "Real boss", diedAt: null, respawnsAt: null, lastRespawnAt: null } }, version: 1 };
  const ctx = bossSyncContext(update => {
    const next = update(remote);
    if (next !== undefined) remote = next;
    return Promise.resolve({ committed: next !== undefined, snapshot: { val: () => remote } });
  });
  await ctx.saveState(true);
  assert.equal(remote.data.bosses.length, 1);
  assert.equal(remote.data.bosses[0].id, "real");
});

test("large daily schedules use a complete CSV attachment instead of an oversized canvas", async () => {
  let attachment;
  const items = Array.from({ length: 151 }, (_, i) => ({ boss: { name: `Boss ${i}` }, eventTime: i }));
  const ctx = load(["deliverDiscordDailySchedule"], {
    Blob, getBossScheduleItems: () => items, discordConfig: { tagEveryone: false },
    buildScheduleCsv: received => received.map(item => item.boss.name).join("\n"),
    generateScheduleImageBlob: () => { throw new Error("Oversized canvas must not be used"); },
    sendDiscordWebhook: async (payload, blob, name, serverId, allowWhenDisabled) => { attachment = { payload, blob, name, serverId, allowWhenDisabled }; return true; }
  });
  assert.equal(await ctx.deliverDiscordDailySchedule(Date.now(), true, "s2"), true);
  assert.ok(attachment.name.endsWith(".csv"));
  assert.ok((await attachment.blob.text()).includes("Boss 150"));
  assert.equal(attachment.serverId, "s2");
  assert.equal(attachment.allowWhenDisabled, true);
  assert.ok(!attachment.payload.content.includes("@everyone"));
});
