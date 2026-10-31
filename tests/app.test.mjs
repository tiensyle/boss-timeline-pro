import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";
import { setImmediate } from "node:timers/promises";

const source = readFileSync(new URL("../assets/app.js", import.meta.url), "utf8");
const copy = value => JSON.parse(JSON.stringify(value));

function load(names, globals = {}) {
  const dateStart = source.indexOf("    function createBossDateClass() {");
  const dateSource = source.slice(dateStart, source.indexOf("\n    }", dateStart) + 6);
  const dateContext = vm.createContext({ Date });
  vm.runInContext(dateSource, dateContext);
  globals = { BossDate: dateContext.createBossDateClass(), bossSnapshotApplied: true, firebaseRealtimeConnected: true, firebaseAuthReady: true, remoteSaveInFlight: false, ...globals };
  globals = { bossRemoteEpoch: null, deferredBossSnapshotPending: false, serverListReady: true, remoteStateReady: true,
    lastAppliedBossVersion: 0, crypto: { randomUUID: () => "test-epoch" },
    serverList: [{id:"s1",name:"One"}], currentServerId:"s1", REALTIME_ENABLED:true, ...globals };
  const context = vm.createContext({ console, Date, ...globals });
  for (const helper of ["cloneRealtimeValue", "mergeBossHistory", "readServerListSnapshot", "makeServerListSnapshot", "canEditBossState", "canEditServerList", "handleMissingBossData"]) {
    const match = new RegExp("^    (?:async )?function " + helper + "\\(", "m").exec(source);
    vm.runInContext(source.slice(match.index, source.indexOf("\n    }", match.index) + 6), context);
  }
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
  assert.deepEqual(copy(ctx.getBossRemoteData({ bosses_map: map, data: { history: [] } }).bosses), []);
  assert.deepEqual(copy(ctx.getBossRemoteData({ data: { bosses: [], history: [] }, bosses_map: map }).bosses), []);
});

test("attendance screenshot OCR matches exact and slightly misread character names", () => {
  const ctx = load(["normalizeAttendanceOcrName", "attendanceOcrSimilarity", "matchAttendanceOcrWord"]);
  const members = [{ id: "m1", name: "UmbraKnight" }, { id: "m2", name: "LuckyMimi" }, { id: "m3", name: "NiErIKa" }];
  assert.equal(ctx.normalizeAttendanceOcrName(" Ni-ErÍKa "), "nierika");
  assert.equal(ctx.matchAttendanceOcrWord("UmbraKnight", members).member.id, "m1");
  assert.equal(ctx.matchAttendanceOcrWord("LuckyMim1", members).member.id, "m2");
  assert.equal(ctx.matchAttendanceOcrWord("Manage", members), null);
});

test("boss names are normalized to uppercase Vietnamese text", () => {
  const ctx = load(["clamp", "makeId", "normalizeBoss"], {
    crypto: { randomUUID: () => "generated-id" }
  });
  const boss = ctx.normalizeBoss({ id: "dalia", name: "  Quý bà Dalia  ", map: "Bóng Ma Huyết Sắc", level: 85 });
  assert.equal(boss.name, "QUÝ BÀ DALIA");
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
  const ctx = load(["cloneRealtimeValue", "mergeRealtimeChanges", "sortBossesForMaintenance", "touchBossRevision", "resetAllTimers"], {
    state,
    currentLang: "vi",
    bossSyncGeneration: 0,
    isAdmin: () => true,
    showConfirmModal: async () => true,
    getNow: () => 1000,
    saveState: async () => true,
    CLIENT_ID: "test-client",
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
  assert.ok(state.bosses.every(boss => boss.revision === 1 && boss.updatedBy === "test-client"));
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

test("default boss order keeps every ready boss above respawning bosses", () => {
  const now = 1000;
  const ctx = load(["sortBossesForDisplay"], {
    activeLevelFilter: "all",
    getNextBossEventTime: boss => boss.nextAt
  });
  const bosses = [
    { id: "level-85-ready", level: 85, nextAt: null },
    { id: "level-75-respawning", level: 75, nextAt: 5000 },
    { id: "level-90-ready", level: 90, nextAt: null },
    { id: "level-60-ready", level: 60, nextAt: null },
    { id: "level-80-respawning", level: 80, nextAt: 3000 }
  ];

  assert.deepEqual(ctx.sortBossesForDisplay(bosses, now).map(boss => boss.id), [
    "level-60-ready", "level-85-ready", "level-90-ready", "level-80-respawning", "level-75-respawning"
  ]);
});

test("default respawning order ignores level and uses nearest spawn time", () => {
  const now = 1000;
  const ctx = load(["sortBossesForDisplay"], {
    activeLevelFilter: "all",
    getNextBossEventTime: boss => boss.nextAt
  });
  const bosses = [
    { id: "level-60-late", level: 60, nextAt: 9000 },
    { id: "level-90-soon", level: 90, nextAt: 2000 },
    { id: "level-75-middle", level: 75, nextAt: 5000 }
  ];

  assert.deepEqual(ctx.sortBossesForDisplay(bosses, now).map(boss => boss.id), [
    "level-90-soon", "level-75-middle", "level-60-late"
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
  const ctx = load(["applyAttendanceColumnFilters", "filterAttendanceMembers"], {
    attendanceColumnFilters: {}, attendanceColumnSort: null,
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

test("concurrent edits of the same boss preserve the complete Firebase boss", () => {
  const ctx = load(["cloneRealtimeValue", "mergeRealtimeChanges", "mergeBossStateChanges"]);
  const base = { bosses: [{ id: "a", notes: "", diedAt: null, respawnsAt: null, lastRespawnAt: 100 }], history: [] };
  const local = copy(base);
  local.bosses[0].notes = "new note";
  const remote = copy(base);
  Object.assign(remote.bosses[0], { diedAt: 200, respawnsAt: 500 });
  assert.deepEqual(copy(ctx.mergeBossStateChanges(base, local, remote)).bosses[0], remote.bosses[0]);
  Object.assign(local.bosses[0], { diedAt: null, respawnsAt: null, lastRespawnAt: 300 });
  const merged = ctx.mergeBossStateChanges(base, local, remote);
  assert.equal(merged.bosses[0].diedAt, 200);
  assert.equal(merged.bosses[0].respawnsAt, 500);
  assert.equal(merged.bosses[0].lastRespawnAt, 100);
});

test("per-boss revisions reject stale death, respawn and metadata overwrites", () => {
  const ctx = load(["cloneRealtimeValue", "mergeRealtimeChanges", "mergeBossStateChanges"]);
  const base = {
    bosses: [{ id: "a", notes: "old", diedAt: 100, respawnsAt: 200, lastRespawnAt: null, revision: 4 }],
    history: [{ id: "old", bossId: "a", type: "death", time: 100 }]
  };
  const staleLocal = copy(base);
  Object.assign(staleLocal.bosses[0], { notes: "offline edit", diedAt: 150, respawnsAt: 250, revision: 5 });
  staleLocal.history.unshift({ id: "stale-death", bossId: "a", type: "death", time: 150 });
  const remote = copy(base);
  Object.assign(remote.bosses[0], { notes: "team edit", diedAt: null, respawnsAt: null, lastRespawnAt: 200, revision: 5 });
  remote.history.unshift({ id: "confirmed-respawn", bossId: "a", type: "respawn", time: 200 });

  const merged = copy(ctx.mergeBossStateChanges(base, staleLocal, remote));
  assert.deepEqual(merged.bosses[0], remote.bosses[0]);
  assert.deepEqual(merged.history.map(item => item.id).sort(), ["confirmed-respawn", "old"]);
});

test("history event IDs make the same automatic respawn idempotent across clients", () => {
  const state = { history: [] };
  const ctx = load(["historyItem", "pushHistory"], {
    state, getNow: () => 500, isAdmin: () => true, currentAdminName: "Admin"
  });
  const boss = { id: "boss-a", name: "A", map: "Map" };
  ctx.pushHistory("respawn", boss, 1000, "automatic");
  ctx.pushHistory("respawn", boss, 1000, "automatic");
  assert.equal(state.history.length, 1);
  assert.equal(state.history[0].id, "history_respawn_boss-a_1000");
});

test("stale boss deletion is rejected when Firebase has a newer revision", () => {
  const ctx = load(["cloneRealtimeValue", "mergeRealtimeChanges", "mergeBossStateChanges"]);
  const base = { bosses: [{ id: "a", revision: 2, notes: "old" }], history: [] };
  const local = { bosses: [], history: [] };
  const remote = { bosses: [{ id: "a", revision: 3, notes: "new" }], history: [] };
  assert.deepEqual(copy(ctx.mergeBossStateChanges(base, local, remote)).bosses, remote.bosses);
});

test("editing a remotely deleted boss drops its unconfirmed history and reports conflict", () => {
  const ctx = load(["cloneRealtimeValue", "mergeRealtimeChanges", "mergeBossStateChanges"], { lastBossConflictIds: [] });
  const base = { bosses: [{ id: "a", revision: 1, notes: "old" }], history: [{ id: "confirmed", bossId: "a" }] };
  const local = { bosses: [{ id: "a", revision: 2, notes: "offline" }], history: [...base.history, { id: "draft", bossId: "a", type: "death" }] };
  const merged = copy(ctx.mergeBossStateChanges(base, local, { bosses: [], history: base.history }));
  assert.deepEqual(merged.bosses, []);
  assert.deepEqual(merged.history.map(item => item.id), ["confirmed"]);
  assert.deepEqual(copy(ctx.lastBossConflictIds), ["a"]);
});

test("Firebase listener replaces offline cached drafts without uploading them", () => {
  let reports = 0;
  const state = { bosses: [{ id: "a", revision: 2, diedAt: 111 }], history: [{ id: "draft", bossId: "a" }] };
  const base = { bosses: [{ id: "a", revision: 1, diedAt: null }], history: [] };
  const ctx = load(["cloneRealtimeValue", "mergeRealtimeChanges", "mergeBossStateChanges", "applyRemoteState"], {
    state, bossSyncBase: base, firebaseAuthReady: true, isAdmin: () => true, normalizeBoss: copy,
    saveStateLocal: () => {}, render: () => {}, lastRemoteUpdatedAt: 0, lastRenderedGridKey: "",
    lastAppliedBossVersion: 0, lastBossConflictIds: [], lastReportedBossConflictKey: "",
    reportRejectedBossOperations: () => { reports++; }
  });
  const remote = [{ id: "a", revision: 2, diedAt: 777 }];
  ctx.applyRemoteState(remote, [], null, "other", base, 2);
  ctx.applyRemoteState(remote, [], null, "other", ctx.bossSyncBase, 2);
  assert.equal(ctx.state.bosses[0].diedAt, 777);
  assert.equal(reports, 0);
});

test("custom death waits for Firebase before success or Discord delivery", async () => {
  let finishSave;
  let discordCalls = 0;
  const boss = { id: "a", name: "A", spawnMode: "interval", respawnMinutes: 30, revision: 4 };
  const state = { bosses: [boss], history: [] };
  const toasts = [];
  const ctx = load(["confirmOffsetDeath"], {
    state, currentLang: "vi", _offsetBossId: "a", _offsetBossRevision: 4,
    isAdmin: () => true, getOffsetDiedAt: () => 1000,
    touchBossRevision: item => { item.revision++; },
    pushHistory: () => {}, lastLocalEditTime: 0,
    closeOffsetModal: () => {}, render: () => {},
    formatFullDateTime: () => "time", showToast: message => toasts.push(message),
    saveState: () => new Promise(resolve => { finishSave = resolve; }),
    sendDiscordKillAlert: () => { discordCalls++; },
    isBossRevisionCurrent: (id, revision) => state.bosses.some(item => item.id === id && item.revision === revision)
  });

  const pending = ctx.confirmOffsetDeath();
  assert.equal(boss.revision, 5);
  assert.equal(discordCalls, 0);
  assert.match(toasts.at(-1), /Đang lưu/);
  finishSave(true);
  await pending;
  assert.equal(discordCalls, 1);
  assert.match(toasts.at(-1), /đồng bộ/);
});

test("stale custom death form is stopped before changing state", async () => {
  let saves = 0;
  const boss = { id: "a", name: "A", revision: 5, diedAt: null, respawnsAt: null };
  const ctx = load(["confirmOffsetDeath"], {
    state: { bosses: [boss], history: [] }, currentLang: "vi",
    _offsetBossId: "a", _offsetBossRevision: 4,
    isAdmin: () => true, closeOffsetModal: () => {}, render: () => {}, showToast: () => {},
    saveState: () => { saves++; }
  });
  await ctx.confirmOffsetDeath();
  assert.equal(saves, 0);
  assert.equal(boss.diedAt, null);
  assert.equal(boss.revision, 5);
});

test("consecutive death notes notify Discord only for the latest confirmed revision", async () => {
  const boss = { id: "a", name: "A", spawnMode: "interval", respawnMinutes: 30, revision: 0 };
  const state = { bosses: [boss], history: [] };
  const resolvers = [];
  const discordTimes = [];
  const ctx = load(["killBoss"], {
    state, currentLang: "vi", isAdmin: () => true,
    getNow: () => 0, touchBossRevision: item => { item.revision++; }, pushHistory: () => {},
    lastLocalEditTime: 0, lastRenderedGridKey: "", render: () => {}, showToast: () => {},
    saveState: () => new Promise(resolve => resolvers.push(resolve)),
    isBossRevisionCurrent: (id, revision) => state.bosses.some(item => item.id === id && item.revision === revision),
    sendDiscordKillAlert: (_boss, diedAt) => discordTimes.push(diedAt)
  });
  const first = ctx.killBoss("a", 1000);
  const second = ctx.killBoss("a", 2000);
  resolvers[0](true);
  await first;
  assert.deepEqual(discordTimes, []);
  resolvers[1](true);
  await second;
  assert.deepEqual(discordTimes, [2000]);
});

test("maintenance reset aborts when revisions change while confirmation is open", async () => {
  let confirm;
  let saves = 0;
  const state = { bosses: [{ id: "a", revision: 1, diedAt: 100, respawnsAt: 200 }], history: [] };
  const ctx = load(["resetAllTimers"], {
    state, currentLang: "vi", bossSyncGeneration: 1, isAdmin: () => true,
    showConfirmModal: () => new Promise(resolve => { confirm = resolve; }),
    showToast: () => {}, saveState: () => { saves++; }, render: () => {}
  });
  const reset = ctx.resetAllTimers();
  state.bosses[0].revision = 2;
  state.bosses[0].diedAt = 150;
  confirm(true);
  await reset;
  assert.equal(saves, 0);
  assert.equal(state.bosses[0].diedAt, 150);
});

function bossSyncContext(transaction) {
  const state = { bosses: [{ id: "a", name: "A", notes: "", diedAt: null, respawnsAt: null, lastRespawnAt: null }], history: [] };
  return load(["cloneRealtimeValue", "mergeRealtimeChanges", "mergeBossStateChanges", "getBossRemoteData", "discardConflictedQueuedBossChanges", "getChangedBossIds", "enqueueBossSaveWaiter", "applyRemoteState", "saveState"], {
    state, bossSyncBase: copy(state), isAdmin: () => true, REALTIME_ENABLED: true,
    firebaseAuthReady: true,
    stateDbRef: { transaction }, normalizeBoss: copy, getNow: () => 1000000,
    saveStateLocal: () => {}, render: () => {}, setRealtimeStatus: () => {},
    lastLocalEditTime: 0, lastRemoteUpdatedAt: 0, lastRenderedGridKey: "",
    remoteStateReady: true, remoteSaveInFlight: false, pendingRemoteSave: false,
    bossSyncGeneration: 1, bossDeferredRemoteData: null, CLIENT_ID: "test-client", lastBossConflictIds: [],
    pendingBossSaveWaiters: [], activeBossSaveWaiters: new Set(), broadcastConfirmedBossState: () => {},
    reportRejectedBossOperations: () => {}, lastAppliedBossVersion: 0,
    activeBossTransactionLocal: null, lastReportedBossConflictKey: ""
  });
}

test("saveState reports a rejected stale boss operation as conflict", async () => {
  let remote;
  const ctx = bossSyncContext(update => {
    remote = update(remote);
    return Promise.resolve({ committed: true, snapshot: { val: () => remote } });
  });
  ctx.bossSyncBase.bosses[0].revision = 1;
  ctx.state.bosses[0].revision = 2;
  ctx.state.bosses[0].diedAt = 100;
  remote = {
    data: { bosses: [{ ...copy(ctx.bossSyncBase.bosses[0]), revision: 2, lastRespawnAt: 200 }], history: [], version: 2 },
    version: 2
  };
  assert.equal(await ctx.saveState(), "conflict");
  assert.equal(ctx.state.bosses[0].diedAt, null);
  assert.equal(ctx.state.bosses[0].lastRespawnAt, 200);
});

test("a conflict cancels later queued edits created from the same stale boss", async () => {
  let finish;
  let calls = 0;
  const ctx = bossSyncContext(update => {
    calls++;
    const next = update(remote);
    remote = next;
    return new Promise(resolve => { finish = () => resolve({ committed: true, snapshot: { val: () => remote } }); });
  });
  ctx.bossSyncBase.bosses[0].revision = 1;
  ctx.state.bosses[0].revision = 2;
  ctx.state.bosses[0].diedAt = 111;
  let remote = {
    data: { bosses: [{ ...copy(ctx.bossSyncBase.bosses[0]), revision: 2, diedAt: 777 }], history: [], version: 2 },
    version: 2
  };
  const first = ctx.saveState();
  ctx.state.bosses[0].revision = 3;
  ctx.state.bosses[0].diedAt = 222;
  const second = ctx.saveState();
  finish();
  assert.equal(await first, "conflict");
  assert.equal(await second, "conflict");
  assert.equal(calls, 1);
  assert.equal(ctx.state.bosses[0].diedAt, 777);
  assert.equal(ctx.state.bosses[0].revision, 2);
});

test("a queued edit for boss B succeeds independently when boss A conflicts", async () => {
  let finish;
  let calls = 0;
  const ctx = bossSyncContext(update => {
    calls++;
    remote = update(remote);
    if (calls === 1) return new Promise(resolve => { finish = () => resolve({ committed: true, snapshot: { val: () => remote } }); });
    return Promise.resolve({ committed: true, snapshot: { val: () => remote } });
  });
  const base = { bosses: [{ id: "a", revision: 1 }, { id: "b", revision: 1, notes: "base" }], history: [] };
  ctx.state = copy(base); ctx.bossSyncBase = copy(base);
  let remote = { data: { bosses: [{ id: "a", revision: 2, diedAt: 777 }, copy(base.bosses[1])], history: [], version: 2 }, version: 2 };
  Object.assign(ctx.state.bosses[0], { revision: 2, diedAt: 111 });
  const saveA = ctx.saveState();
  Object.assign(ctx.state.bosses[1], { revision: 2, notes: "my B" });
  const saveB = ctx.saveState();
  finish();
  assert.equal(await saveA, "conflict");
  assert.equal(await saveB, true);
  assert.equal(remote.data.bosses.find(b => b.id === "b").notes, "my B");
});

test("partial maintenance conflict aborts reset and removes ALL BOSSES history", () => {
  const ctx = load(["cloneRealtimeValue", "mergeRealtimeChanges", "mergeBossStateChanges"], { lastBossConflictIds: [] });
  const base = { bosses: [{ id: "a", revision: 1, diedAt: 1 }, { id: "b", revision: 1, diedAt: 1 }], history: [] };
  const local = copy(base);
  local.bosses.forEach(b => Object.assign(b, { revision: 2, diedAt: null, lastRespawnAt: 3 }));
  local.history.push({ id: "reset", bossId: "all", type: "respawn", time: 3 });
  const remote = copy(base); remote.bosses[1] = { id: "b", revision: 2, diedAt: 7 };
  const merged = copy(ctx.mergeBossStateChanges(base, local, remote));
  assert.deepEqual(merged, remote);
  assert.deepEqual(copy(ctx.lastBossConflictIds).sort(), ["a", "b"]);
});

test("automatic respawn notifies only after Firebase accepts the transition", async () => {
  const make = outcome => {
    const order = [];
    const boss = { id: "a", spawnMode: "interval", diedAt: 100, respawnsAt: 200, revision: 1 };
    const ctx = load(["autoResolveRespawns"], {
      isAdmin: () => true, autoRespawnSaveInFlight: false, getNow: () => 500,
      state: { bosses: [boss] }, activeSoundNotified: {}, notifyBossAlert: () => order.push("notify"),
      performRespawn: item => { item.diedAt = null; item.respawnsAt = null; item.revision++; },
      saveState: async () => { order.push("save"); return outcome; }, currentLang: "vi", showToast: () => order.push("toast")
    });
    return { ctx, order };
  };
  const conflict = make("conflict"); await conflict.ctx.autoResolveRespawns();
  assert.deepEqual(conflict.order, ["save"]);
  const success = make(true); await success.ctx.autoResolveRespawns();
  assert.deepEqual(success.order, ["save", "notify", "toast"]);
});

test("older BroadcastChannel snapshots cannot roll back a newer Firebase version", () => {
  const state = { bosses: [], history: [] };
  const ctx = load(["cloneRealtimeValue", "mergeRealtimeChanges", "mergeBossStateChanges", "applyRemoteState"], {
    state, bossSyncBase: { bosses: [], history: [] }, firebaseAuthReady: true,
    isAdmin: () => false, normalizeBoss: copy, saveStateLocal: () => {}, render: () => {},
    lastRemoteUpdatedAt: 0, lastRenderedGridKey: "", lastAppliedBossVersion: 0
  });
  assert.equal(ctx.applyRemoteState([{ id: "a", revision: 6, diedAt: 600 }], [], null, "tab", ctx.bossSyncBase, 6), true);
  assert.equal(ctx.applyRemoteState([{ id: "a", revision: 5, diedAt: 500 }], [], null, "tab", ctx.bossSyncBase, 5), false);
  assert.equal(ctx.state.bosses[0].revision, 6);
  assert.equal(ctx.state.bosses[0].diedAt, 600);
});

test("edits attempted before Firebase readiness are rejected without queuing", async () => {
  let transactions = 0;
  const ctx = bossSyncContext(() => { transactions++; });
  ctx.remoteStateReady = false;
  const waiting = ctx.saveState();
  ctx.remoteStateReady = true;
  assert.equal(await ctx.saveState(), true);
  assert.equal(await waiting, false);
  assert.equal(transactions, 0);
  assert.equal(ctx.pendingBossSaveWaiters.length, 0);
  assert.equal(ctx.pendingRemoteSave, false);
});

test("member tabs neither auto-respawn bosses nor broadcast unconfirmed revisions", () => {
  const boss = { id: "a", spawnMode: "interval", diedAt: 100, respawnsAt: 200, revision: 4 };
  let saves = 0;
  const ctx = load(["autoResolveRespawns"], {
    state: { bosses: [boss], history: [] }, isAdmin: () => false,
    getNow: () => 1000, saveState: () => { saves++; }, saveStateLocal: () => { saves++; }
  });
  ctx.autoResolveRespawns();
  assert.equal(boss.diedAt, 100);
  assert.equal(boss.respawnsAt, 200);
  assert.equal(boss.revision, 4);
  assert.equal(saves, 0);
});

test("BroadcastChannel cannot supply authority even when it claims a Firebase version", () => {
  let applied = 0;
  const ctx = load(["handleBossBroadcastMessage"], {
    CLIENT_ID: "this", currentServerId: "s1", bossSyncBase: {},
    applyRemoteState: () => { applied++; return true; }, showToast: () => {}
  });
  assert.equal(ctx.handleBossBroadcastMessage({ _clientId: "member", serverId: "s1", bosses: [{ id: "a" }] }), false);
  assert.equal(ctx.handleBossBroadcastMessage({ _clientId: "member", serverId: "s1", version: 0, bosses: [{ id: "a" }] }), false);
  assert.equal(ctx.handleBossBroadcastMessage({ _clientId: "admin", serverId: "s1", version: 7, bosses: [{ id: "a" }] }), false);
  assert.equal(applied, 0);
});

test("rejected offline operations are retained for review and shown to the admin", () => {
  const saved = new Map();
  const dialogs = [];
  const ctx = load(["reportRejectedBossOperations"], {
    getNow: () => 9000, currentServerId: "s1", STORAGE_KEY: "state",
    localStorage: { setItem: (key, value) => saved.set(key, value) },
    console: { warn() {} }, showToast: () => {}, escapeHtml: String,
    formatFullDateTime: value => String(value), showConfirmModal: options => dialogs.push(options)
  });
  ctx.reportRejectedBossOperations(["a"], { bosses: [{ id: "a", name: "Boss A", revision: 3, diedAt: 4500 }] });
  const stored = JSON.parse(saved.get("state.rejectedOperations"));
  assert.equal(stored[0].diedAt, 4500);
  assert.equal(stored[0].rejectedAt, 9000);
  assert.match(dialogs[0].message, /4500/);
});

test("connection alone must not claim boss data is synchronized", () => {
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
  assert.equal(statuses.at(-1), "connecting");
  ctx.initRealtimeSync();
  ctx.bossSyncGeneration++;
  ctx.initRealtimeSync();
  assert.equal(statuses.at(-1), "connecting");
  assert.equal(callbacks.size, 2);
  callbacks.get(".info/connected")({ val: () => false });
  ctx.initRealtimeSync();
  assert.equal(statuses.at(-1), "connecting");
  callbacks.get(".info/connected")({ val: () => true });
  assert.equal(statuses.at(-1), "connecting");
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
  const broadcasts = [];
  ctx.broadcastConfirmedBossState = value => broadcasts.push(copy(value));
  ctx.state.bosses[0].name = "First edit";
  const save = ctx.saveState();
  ctx.state.bosses[0].notes = "Second edit";
  const secondSave = ctx.saveState();
  resolveFirst();
  await save;
  await secondSave;
  await setImmediate();
  assert.equal(calls, 2);
  assert.equal(ctx.state.bosses[0].notes, "Second edit");
  assert.equal(remote.bosses_map.a.notes, "Second edit");
  assert.equal(broadcasts[0].bosses[0].name, "First edit");
  assert.equal(broadcasts[0].bosses[0].notes, "");
  assert.equal(broadcasts[1].bosses[0].notes, "Second edit");
  assert.deepEqual(Object.keys(remote.data).sort(), ["_clientId", "bosses", "history", "syncEpoch", "syncProtocol", "updated_at", "version"]);
});

test("failed saves roll back without retry and server switches ignore stale acknowledgements", async () => {
  const ctx = bossSyncContext(() => Promise.reject(new Error("offline")));
  ctx.console = { error() {} };
  ctx.state.bosses[0].notes = "unsent";
  await ctx.saveState();
  assert.equal(ctx.pendingRemoteSave, false);
  assert.equal(ctx.state.bosses[0].notes, "");
  let finish;
  ctx.stateDbRef.transaction = update => new Promise(resolve => { finish = () => resolve({ committed: true, snapshot: { val: () => update(null) } }); });
  ctx.state.bosses[0].notes = "new explicit attempt";
  const pending = ctx.saveState();
  ctx.bossSyncGeneration++;
  ctx.state = { bosses: [{ id: "other", name: "Other server" }], history: [] };
  finish();
  assert.equal(await pending, false);
  assert.equal(ctx.state.bosses[0].id, "other");
});

test("auth completion adopts Firebase and does not merge offline admin edits", () => {
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
  assert.equal(ctx.state.bosses[0].notes, "");
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

test("schedule keeps a confirmed earlier spawn and also forecasts the actual next respawn", () => {
  const now = new Date(2026, 9, 30, 20, 0).getTime();
  const oldSpawn = new Date(2026, 9, 30, 13, 52).getTime();
  const diedAt = new Date(2026, 9, 30, 19, 55).getTime();
  const respawnsAt = new Date(2026, 9, 31, 1, 55).getTime();
  const boss = { id: "dalia", spawnMode: "interval", respawnMinutes: 360, lastRespawnAt: oldSpawn, diedAt, respawnsAt };
  const state = { bosses: [boss], history: [{ type: "respawn", bossId: boss.id, time: oldSpawn }] };
  const ctx = load(["getTargetDateForFilter", "getBossScheduleEventTimes"], { state });

  assert.deepEqual(copy(ctx.getBossScheduleEventTimes(boss, now, "today")), [oldSpawn]);
  const week = copy(ctx.getBossScheduleEventTimes(boss, now, "all"));
  assert.equal(week[0], oldSpawn);
  assert.equal(week.includes(respawnsAt), true);
});

test("a fixed boss schedule retains a confirmed slot that already occurred today", () => {
  const now = new Date(2026, 9, 30, 20, 0).getTime();
  const diedAt = new Date(2026, 9, 30, 19, 55).getTime();
  const respawnsAt = new Date(2026, 9, 31, 18, 0).getTime();
  const boss = { id: "roderick", spawnMode: "fixed", fixedSchedules: [{ day: 5, time: "18:00" }], diedAt, respawnsAt };
  const ctx = load(["getTargetDateForFilter", "getBossScheduleEventTimes"], { state: { bosses: [boss], history: [] } });

  const elapsedSlot = new Date(2026, 9, 30, 18, 0).getTime();
  assert.deepEqual(copy(ctx.getBossScheduleEventTimes(boss, now, "today")), [elapsedSlot]);
  assert.deepEqual(copy(ctx.getBossScheduleEventTimes(boss, now, "all")), [elapsedSlot]);
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
  return load(["normalizeRoleText", "getMemberRoleBonusPercent", "normalizeMinimumParticipationPercent", "allocateLargestRemainder", "getMemberServerId", "calculateAttendanceData"], {
    DEFAULT_ROLE_BONUSES: [
      { role: "Bang Chủ", percent: 4 },
      { role: "Chủ Bang", percent: 4 },
      { role: "Phó Bang", percent: 3 },
      { role: "Thư Ký", percent: 3 },
      { role: "Call Boss", percent: 2 },
      { role: "Core DPS", percent: 2 },
      { role: "Tanker", percent: 1.5 }
    ],
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

test("role position bonus allocates deducted pool first and preserves 100% total funds", () => {
  const ctx = attendanceContext();
  const week = {
    diasPool: 50000,
    usdtPool: 1000,
    minimumParticipationPercent: 50,
    roleBonuses: [
      { role: "👑 Chủ Bang", percent: 4 },
      { role: "Thư Ký", percent: 3 }
    ],
    activities: [{ id: "act1", points: 10 }],
    members: [
      { id: "m_leader", name: "Bang Chủ", role: "👑 Chủ Bang", multiplier: 2, records: { act1: true } },
      { id: "m_sec", name: "Thư Ký", role: "Thư Ký", multiplier: 1.5, records: { act1: true } },
      { id: "m_custom", name: "Top Cống Hiến", role: "Member", roleBonusPercent: 2, multiplier: 1, records: { act1: true } },
      { id: "m_normal", name: "Thành Viên Thường", role: "Member", multiplier: 1, records: { act1: true } }
    ]
  };

  const calc = ctx.calculateAttendanceData(week);
  assert.equal(calc.membersCalc[0].bonusPercent, 4);
  assert.equal(calc.membersCalc[0].roleBonusDias, 2000); // 4% of 50,000
  assert.equal(calc.membersCalc[0].roleBonusUsdt, 40); // 4% of 1,000

  assert.equal(calc.membersCalc[1].bonusPercent, 3);
  assert.equal(calc.membersCalc[1].roleBonusDias, 1500); // 3% of 50,000
  assert.equal(calc.membersCalc[1].roleBonusUsdt, 30); // 3% of 1,000

  assert.equal(calc.membersCalc[2].bonusPercent, 2);
  assert.equal(calc.membersCalc[2].roleBonusDias, 1000); // 2% of 50,000
  assert.equal(calc.membersCalc[2].roleBonusUsdt, 20); // 2% of 1,000

  assert.equal(calc.membersCalc[3].bonusPercent, 0);
  assert.equal(calc.membersCalc[3].roleBonusDias, 0);
  assert.equal(calc.membersCalc[3].roleBonusUsdt, 0);

  // Remaining pool for points: 50,000 - 4,500 = 45,500 DIAS, 1,000 - 90 = 910 USDT
  const totalDias = calc.membersCalc.reduce((sum, m) => sum + m.dias, 0);
  const totalUsdtCents = calc.membersCalc.reduce((sum, m) => sum + Math.round(m.usdt * 100), 0);
  assert.equal(totalDias, 50000);
  assert.equal(totalUsdtCents, 100000);
});

test("combat power rankings automatically assign multipliers by tier and sort members", () => {
  const ctx = load(["parseCombatPowerInput", "formatCombatPowerInput", "formatCombatPowerDisplay", "normalizeRoleText", "getManagementRoleMultiplier", "applyCombatPowerTiersToWeek", "getMemberServerId"], {
    DEFAULT_CP_TIERS: [
      { upToRank: 2, multiplier: 3.0, label: "Top 1 - 2" },
      { upToRank: 5, multiplier: 2.5, label: "Top 3 - 5" },
      { upToRank: null, multiplier: 1.0, label: "Còn lại" }
    ],
    DEFAULT_MANAGEMENT_ROLE_MULTIPLIERS: [],
    getMemberServerId: m => m.serverId || "s1",
    getDefaultAttendanceServerId: () => "s1"
  });

  assert.equal(ctx.parseCombatPowerInput("18.5M"), 18500000);
  assert.equal(ctx.parseCombatPowerInput("900k"), 900000);
  assert.equal(ctx.parseCombatPowerInput("15,000,000"), 15000000);
  assert.equal(ctx.formatCombatPowerInput(18500000), "18.5M");

  const week = {
    members: [
      { id: "m6", name: "MemberNew", serverId: "s1", combatPower: 5000000, multiplier: 1 },
      { id: "m1", name: "Venarius", serverId: "s1", combatPower: 25000000, multiplier: 1 },
      { id: "m3", name: "LongThần", serverId: "s1", combatPower: 15000000, multiplier: 1 },
      { id: "m2", name: "Ông3Bi", serverId: "s1", combatPower: 20000000, multiplier: 1 },
      { id: "m5", name: "BạchLong", serverId: "s1", combatPower: 10000000, multiplier: 1 },
      { id: "m4", name: "TraiBao", serverId: "s1", combatPower: 12000000, multiplier: 1 }
    ]
  };

  const tiers = [
    { upToRank: 2, multiplier: 3.0 },
    { upToRank: 5, multiplier: 2.5 },
    { upToRank: null, multiplier: 1.0 }
  ];

  ctx.applyCombatPowerTiersToWeek(week, "server", tiers);

  // Members should be sorted by CP descending: Venarius (25M), Ông3Bi (20M), LongThần (15M), TraiBao (12M), BạchLong (10M), MemberNew (5M)
  assert.equal(week.members[0].name, "Venarius");
  assert.equal(week.members[0].multiplier, 3.0);

  assert.equal(week.members[1].name, "Ông3Bi");
  assert.equal(week.members[1].multiplier, 3.0);

  assert.equal(week.members[2].name, "LongThần");
  assert.equal(week.members[2].multiplier, 2.5);

  assert.equal(week.members[3].name, "TraiBao");
  assert.equal(week.members[3].multiplier, 2.5);

  assert.equal(week.members[4].name, "BạchLong");
  assert.equal(week.members[4].multiplier, 2.5);

  assert.equal(week.members[5].name, "MemberNew");
  assert.equal(week.members[5].multiplier, 1.0);
});

test("management roles provide a configurable minimum salary multiplier", () => {
  const ctx = load(["normalizeRoleText", "getManagementRoleMultiplier", "applyCombatPowerTiersToWeek", "getMemberServerId"], {
    DEFAULT_CP_TIERS: [{ upToRank: null, multiplier: 1 }],
    DEFAULT_MANAGEMENT_ROLE_MULTIPLIERS: [
      { role: "Chủ Guild, Bang Chủ, Chủ Bang", multiplier: 2.5 },
      { role: "Thư Ký", multiplier: 2 },
      { role: "Call Boss", multiplier: 1.5 },
      { role: "Note Boss", multiplier: 1.5 }
    ],
    getMemberServerId: member => member.serverId || "s1"
  });
  const week = { members: [
    { id: "owner", name: "Owner", role: "👑 Chủ Bang", combatPower: 1 },
    { id: "secretary", name: "Secretary", role: "Thư Ký", combatPower: 4 },
    { id: "caller", name: "Caller", role: "Call Boss", combatPower: 3 },
    { id: "noter", name: "Noter", role: "Note Boss", combatPower: 2 },
    { id: "member", name: "Member", role: "Thành viên", combatPower: 5 }
  ] };
  const tiers = [{ upToRank: 1, multiplier: 3 }, { upToRank: null, multiplier: 1 }];
  ctx.applyCombatPowerTiersToWeek(week, "guild", tiers);
  const byId = Object.fromEntries(week.members.map(member => [member.id, member]));
  assert.equal(byId.member.multiplier, 3, "Top multiplier remains higher than role minimums");
  assert.equal(byId.owner.multiplier, 2.5);
  assert.equal(byId.secretary.multiplier, 2);
  assert.equal(byId.caller.multiplier, 1.5);
  assert.equal(byId.noter.multiplier, 1.5);
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
    loadWebhookUrl: async serverId => `https://discord.com/api/webhooks/123/${serverId}-token`,
    fetch: async (...args) => { requests.push(args); return { ok: true }; }
  });

  assert.equal(await ctx.deliverDiscordWebhook({}, null, "image.png", "s1"), false);
  assert.equal(await ctx.deliverDiscordWebhook({}, null, "image.png", "s1", true), true);
  assert.equal(requests.length, 1);
  assert.equal(JSON.parse(requests[0][1].body).webhookUrl, "https://discord.com/api/webhooks/123/s1-token");
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

test("legacy map-only data cannot auto-initialize the public data branch", async () => {
  let remote = { bosses_map: { real: { id: "real", name: "Real boss", diedAt: null, respawnsAt: null, lastRespawnAt: null } }, version: 1 };
  const ctx = bossSyncContext(update => {
    const next = update(remote);
    if (next !== undefined) remote = next;
    return Promise.resolve({ committed: next !== undefined, snapshot: { val: () => remote } });
  });
  await ctx.saveState(true);
  assert.equal(remote.data, undefined);
  assert.equal(remote.bosses_map.real.id, "real");
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

test("daily schedule falls back to CSV when browser canvas image generation fails", async () => {
  let attachment;
  const items = [{ boss: { name: "Boss Dalia" }, eventTime: Date.now() }];
  const ctx = load(["deliverDiscordDailySchedule"], {
    Blob, getBossScheduleItems: () => items, discordConfig: { tagEveryone: true },
    buildScheduleCsv: () => "Boss Dalia,18:00",
    generateScheduleImageBlob: async () => { throw new Error("Canvas unavailable"); },
    sendDiscordWebhook: async (payload, blob, name) => { attachment = { payload, blob, name }; return true; }
  });
  assert.equal(await ctx.deliverDiscordDailySchedule(Date.now(), true, "s1"), true);
  assert.ok(attachment.name.endsWith(".csv"));
  assert.equal(attachment.blob.type, "text/csv;charset=utf-8");
  assert.ok((await attachment.blob.text()).includes("Boss Dalia"));
  assert.equal(attachment.payload.embeds[0].image, undefined);
});


test("new attendance week preserves full member profiles and bonus/ranking settings without checks", () => {
  const previous = { id: "old", members: [
    { id: "m1", name: "Leader", serverId: "s8", combatPower: 165000, multiplier: 2.5, role: "Leader", color: "#ff0", roleColor: "#f80", roleBonusPercent: 0, records: { boss: true } },
    { id: "m2", name: "Core", serverId: "s10", combatPower: 135000, multiplier: 1.5, role: "Core", roleBonusPercent: 4, records: { boss: true } }
  ], activities: [{ id: "boss", name: "Boss", points: 2 }], roleBonuses: [{ role: "Leader", percent: 4 }], cpTiers: [{ upToRank: null, multiplier: 2.5 }], managementRoleMultipliers: [{ role: "Leader", multiplier: 2 }], cpScope: "guild" };
  const elements = Object.fromEntries(Object.entries({
    attWeekEditId: "", attWeekNameInput: "Next", attWeekDateRangeInput: "01/11 - 07/11", attWeekDiasPoolInput: "0", attWeekUsdtPoolInput: "0", attWeekMinimumParticipationInput: "50"
  }).map(([id, value]) => [id, { value }]));
  elements.attWeekClearBossesOption = { checked: true };
  const state = { activeWeekId: "old", weeks: [previous] };
  const ctx = load(["cloneRealtimeValue", "normalizeMinimumParticipationPercent", "saveAttendanceWeek"], {
    document: { getElementById: id => elements[id] }, attendanceState: state, DEFAULT_MANAGEMENT_ROLE_MULTIPLIERS: [],
    isAdmin: () => true, getActiveWeek: () => previous, getDefaultAttendanceServerId: () => "fallback",
    showToast: () => {}, saveAttendanceState: () => {}, closeAttendanceWeekModal: () => {}, renderAttendanceTable: () => {}
  });
  ctx.saveAttendanceWeek();
  const next = state.weeks[1];
  assert.deepEqual(copy(next.members), previous.members.map(m => ({ ...m, records: {} })));
  assert.deepEqual(copy(next.roleBonuses), previous.roleBonuses);
  assert.deepEqual(copy(next.cpTiers), previous.cpTiers);
  assert.deepEqual(copy(next.managementRoleMultipliers), previous.managementRoleMultipliers);
  assert.equal(next.cpScope, "guild");
  assert.equal(next.activities.length, 0);
  next.roleBonuses[0].percent = 9;
  next.members[0].combatPower = 1;
  assert.equal(previous.roleBonuses[0].percent, 4);
  assert.equal(previous.members[0].combatPower, 165000);
  assert.equal(previous.members[0].records.boss, true);
});


test("column filters combine name search, numeric range, eligibility and sorting without changing source", () => {
  const ctx = load(["applyAttendanceColumnFilters"], { attendanceColumnFilters: { name: { query: "tien" }, combatPower: { min: "100", max: "200" }, eligible: { value: "true" } }, attendanceColumnSort: { key: "combatPower", direction: -1 } });
  const rows = [{ name: "Tiến A", combatPower: 120, eligible: true }, { name: "Tiến B", combatPower: 180, eligible: true }, { name: "Tiến C", combatPower: 150, eligible: false }, { name: "Other", combatPower: 160, eligible: true }];
  assert.deepEqual(copy(ctx.applyAttendanceColumnFilters(rows)).map(m => m.name), ["Tiến B", "Tiến A"]);
  assert.equal(rows[0].name, "Tiến A");
});

test("startup cannot auto-respawn stale cache before the confirmed snapshot", async () => {
  let writes = 0;
  const boss = { id: "b", spawnMode: "interval", diedAt: 1000, respawnsAt: 2000, revision: 0 };
  const ctx = load(["autoResolveRespawns"], {
    isAdmin: () => true, bossSnapshotApplied: false, autoRespawnSaveInFlight: false,
    getNow: () => 10000, state: { bosses: [boss] }, saveState: () => { writes++; },
    performRespawn: () => { throw Error("Stale cache must not mutate"); }
  });
  await ctx.autoResolveRespawns();
  assert.equal(writes, 0);
  assert.equal(boss.diedAt, 1000);
  ctx.bossSnapshotApplied = true;
  ctx.firebaseRealtimeConnected = false;
  await ctx.autoResolveRespawns();
  assert.equal(writes, 0);
});

test("legacy remote death cannot be overwritten by cached automatic revival", () => {
  const ctx = load(["cloneRealtimeValue", "mergeRealtimeChanges", "mergeBossStateChanges"], { lastBossConflictIds: [] });
  const base = { bosses: [{ id: "b", revision: 0, diedAt: 1000, respawnsAt: 2000 }], history: [] };
  const local = { bosses: [{ id: "b", revision: 1, diedAt: null, respawnsAt: null }], history: [] };
  const remote = { bosses: [{ id: "b", revision: 0, diedAt: 9000, respawnsAt: 20000 }], history: [] };
  const result = ctx.mergeBossStateChanges(base, local, remote);
  assert.equal(result.bosses[0].diedAt, 9000);
  assert.equal(result.bosses[0].respawnsAt, 20000);
  assert.deepEqual(copy(ctx.lastBossConflictIds), ["b"]);
});

test("bonus payouts never exceed either pool even above 100% or at rounding boundaries", () => {
  const ctx = attendanceContext();
  for (const [pool, percentages] of [[100, [60,60]], [1, [50,50]], [3,[33.33,33.33,33.34]]]) {
    const result = ctx.calculateAttendanceData({ diasPool: pool, usdtPool: pool / 100,
      activities: [{ id: "a", points: 1 }], members: percentages.map((p,i) => ({id:String(i),roleBonusPercent:p,multiplier:1,records:{a:true}})) });
    assert.equal(result.membersCalc.reduce((sum,m)=>sum+m.dias,0),pool);
    assert.equal(result.membersCalc.reduce((sum,m)=>sum+Math.round(m.usdt*100),0),pool);
  }
});

test("empty weekly role bonuses disable defaults", () => {
  const ctx = attendanceContext({ attendanceState: { roleBonuses: [{role:"Bang Chủ",percent:20}] } });
  assert.equal(ctx.getMemberRoleBonusPercent({role:"Bang Chủ"},{roleBonuses:[]}),0);
});

test("Discord config rejection preserves the previous confirmed local configuration", async () => {
  const cached=[];
  const ctx=load(["saveDiscordConfigLocal"],{currentServerId:"s1",defaultDiscordConfig:{enabled:false},
    discordConfig:{enabled:false},firebaseDb:{ref:()=>({set:async()=>{throw Error("denied")}})},
    isAdmin:()=>true,localStorage:{setItem:(...args)=>cached.push(args)},updateDiscordButtonUI:()=>{}});
  await assert.rejects(ctx.saveDiscordConfigLocal({enabled:true}),/denied/);
  assert.equal(ctx.discordConfig.enabled,false);
  assert.equal(cached.length,0);
});

test("boss schedule and displayed times are identical across computer timezones", () => {
  const old=process.env.TZ;
  try {
    const results=[];
    for(const zone of ["Asia/Bangkok","Asia/Singapore","UTC","America/New_York"]){
      process.env.TZ=zone;
      const ctx=load(["getNextFixedSpawnTime","formatTimeOnly","getTargetDateForFilter","getBossScheduleEventTimes"],{state:{history:[]}});
      const boss={spawnMode:"fixed",fixedSchedules:[{day:"all",time:"18:00"}]};
      const now=Date.parse("2026-10-31T10:00:00Z");
      results.push(JSON.stringify([ctx.getNextFixedSpawnTime(boss,now),ctx.formatTimeOnly(now+3600000),copy(ctx.getBossScheduleEventTimes(boss,now,"today"))]));
    }
    assert.equal(new Set(results).size,1);
    assert.ok(results[0].includes("18:00"));
  } finally { if(old===undefined) delete process.env.TZ; else process.env.TZ=old; }
});

test("Chrome state and syncBase are never used as the starting Firebase write base",()=>{
  const values=new Map([["boss.s1",JSON.stringify({bosses:[{id:"old",diedAt:100}],history:[]})]]);
  const ctx=load(["loadState","loadBossSyncBase"],{STORAGE_KEY:"boss.s1",currentServerId:"s1",
    localStorage:{getItem:key=>values.get(key),setItem:(key,value)=>values.set(key,value)}});
  assert.deepEqual(copy(ctx.loadState()),{bosses:[],history:[]});
  assert.deepEqual(copy(ctx.loadBossSyncBase()),{bosses:[],history:[]});
  assert.equal(JSON.parse(values.get("boss.s1.recovery")).bosses[0].id,"old");
});

test("empty Firebase blocks both normal saves and all legacy seed requests",async()=>{
  let writes=0;
  const ctx=bossSyncContext(update=>{writes++;const value=update(null);assert.equal(value,undefined);return Promise.resolve({committed:false,snapshot:{val:()=>null}});});
  ctx.state.bosses[0].notes="stale cached edit";
  assert.equal(await ctx.saveState(true),false);
  assert.equal(writes,0);
  assert.equal(await ctx.saveState(),false);
  assert.equal(writes,1);
  assert.deepEqual(copy(ctx.state),{bosses:[],history:[]});
  assert.equal(ctx.pendingRemoteSave,false);
  assert.equal(ctx.bossSnapshotApplied,false);
});

test("a deletion deferred during a save remains authoritative after acknowledgement",async()=>{
  let finish;
  const ctx=bossSyncContext(update=>{
    const confirmed=update({data:copy(ctx.bossSyncBase),version:0});
    return new Promise(resolve=>{finish=()=>resolve({committed:true,snapshot:{val:()=>confirmed}});});
  });
  ctx.state.bosses[0].notes="edit";
  const saving=ctx.saveState();
  ctx.deferredBossSnapshotPending=true;ctx.bossDeferredRemoteData=null;
  finish();
  assert.equal(await saving,false);
  assert.equal(ctx.bossSnapshotApplied,false);
  assert.deepEqual(copy(ctx.state.bosses),[]);
});

test("a restore epoch change rejects an older machine write even if versions coincide",async()=>{
  const remote={data:{bosses:[{id:"a",name:"Restored"}],history:[],version:5,syncEpoch:"restored"},version:5};
  let writeAttempt;
  const ctx=bossSyncContext(update=>{writeAttempt=update(copy(remote));return Promise.resolve({committed:false,snapshot:{val:()=>remote}});});
  ctx.bossRemoteEpoch="before-restore";ctx.lastAppliedBossVersion=5;
  ctx.state.bosses[0].notes="outdated";
  assert.equal(await ctx.saveState(),false);
  assert.equal(writeAttempt,undefined);
  assert.equal(ctx.state.bosses[0].name,"Restored");
  assert.equal(ctx.bossRemoteEpoch,"restored");
});

test("legacy history without IDs merges concurrent additions and clear preserves new events",()=>{
  const ctx=load(["mergeBossHistory"]);
  const old={bossId:"a",type:"death",time:1};
  const mine={id:"mine",bossId:"b",type:"death",time:2};
  const theirs={id:"theirs",bossId:"c",type:"death",time:3};
  const result=copy(ctx.mergeBossHistory([old],[mine,old],[theirs,old]));
  assert.deepEqual(result.map(event=>event.time),[3,2,1]);
  assert.equal(new Set(result.map(event=>event.id)).size,3);
  assert.deepEqual(copy(ctx.mergeBossHistory([old],[],[theirs,old])).map(event=>event.id),["theirs"]);
});

test("a stale legacy delete cannot remove a boss edited without a revision increment",()=>{
  const ctx=load(["mergeRealtimeChanges","mergeBossStateChanges"],{lastBossConflictIds:[]});
  const base={bosses:[{id:"a",revision:0,notes:"old"}],history:[]};
  const remote={bosses:[{id:"a",revision:0,notes:"new"}],history:[]};
  const result=ctx.mergeBossStateChanges(base,{bosses:[],history:[]},remote);
  assert.equal(result.bosses[0].notes,"new");assert.deepEqual(copy(ctx.lastBossConflictIds),["a"]);
});

test("server list deletion clears cached servers and does not seed anything",()=>{
  let callback;let writes=0;let detached=0;
  const ctx=load(["initServerListSync"],{
    firebaseDb:{ref:()=>({on:(_event,fn)=>{callback=fn},set:()=>{writes++},transaction:()=>{writes++}})},
    serverList:[{id:"s1",name:"Old"}],localStorage:{setItem(){}},STORAGE_SERVERS_KEY:"servers",
    renderServerListUI(){},updateServerSwitcherButton(){},renderAttendanceTable(){},bossSyncGeneration:1,
    activeStateRef:{off:()=>{detached++}},activeBossSaveWaiters:new Set(),pendingBossSaveWaiters:[],render(){},setRealtimeStatus(){}
  });
  ctx.initServerListSync();callback({val:()=>null});
  assert.deepEqual(copy(ctx.serverList),[]);assert.equal(writes,0);assert.equal(detached,1);
  assert.equal(ctx.serverListReady,true);
});

test("empty snapshots before auth complete remain queued as an explicit deletion",()=>{
  const ctx=load(["applyDeferredBossRemoteAfterAuth"],{
    firebaseAuthReady:true,deferredBossSnapshotPending:true,bossDeferredRemoteData:null,
    state:{bosses:[{id:"old"}],history:[]},bossSyncBase:{bosses:[{id:"old"}],history:[]},
    activeBossSaveWaiters:new Set(),pendingBossSaveWaiters:[],setRealtimeStatus(){},render(){},lastRenderedGridKey:""
  });
  assert.equal(ctx.applyDeferredBossRemoteAfterAuth(),true);
  assert.deepEqual(copy(ctx.state.bosses),[]);assert.equal(ctx.remoteStateReady,false);
});

test("server rename uses the live registry, preserves other admins additions, and rejects stale renames",async()=>{
  let registry={version:3,items:{s1:{id:"s1",name:"One"},s2:{id:"s2",name:"Two"},s3:{id:"s3",name:"New"}}};
  const ctx=load(["renameServer"],{isAdmin:()=>true,serverList:[{id:"s1",name:"One"},{id:"s2",name:"Two"}],
    firebaseDb:{ref:()=>({transaction:async update=>{const next=update(registry);if(next)registry=copy(next);return {committed:Boolean(next),snapshot:{val:()=>copy(registry)}};}})},
    renderServerListUI(){},updateServerSwitcherButton(){},renderAttendanceTable(){},showToast(){}
  });
  assert.equal(await ctx.renameServer("s2","Renamed"),true);
  assert.equal(registry.items.s3.name,"New");assert.equal(registry.version,4);
  registry.items.s2.name="Changed elsewhere";
  assert.equal(await ctx.renameServer("s2","Old request"),false);
  assert.equal(registry.items.s2.name,"Changed elsewhere");
});

test("today report retains the Firebase morning spawn when the rolling history no longer contains it",()=>{
 const now=Date.parse('2026-10-31T09:00:00Z');
 const morning=Date.parse('2026-10-30T18:54:24Z');
 const next=Date.parse('2026-10-31T14:56:00Z');
 const boss={id:'a',spawnMode:'interval',respawnMinutes:600,lastRespawnAt:morning,diedAt:next-600*60000,respawnsAt:next};
 const ctx=load(["getTargetDateForFilter","getBossScheduleEventTimes"],{state:{history:[]}});
 assert.deepEqual(copy(ctx.getBossScheduleEventTimes(boss,now,'today')),[morning,next]);
});

test("today report keeps all retained actual spawns and does not backfill replaced forecasts",()=>{
 const morning=Date.parse('2026-10-30T18:54:24Z'),actual=Date.parse('2026-10-31T01:53:15Z');
 const next=Date.parse('2026-10-31T14:56:00Z');
 const boss={id:'a',spawnMode:'interval',respawnMinutes:600,lastRespawnAt:morning,diedAt:next-600*60000,respawnsAt:next};
 const ctx=load(["getTargetDateForFilter","getBossScheduleEventTimes"],{state:{history:[
  {bossId:'a',type:'respawn',time:actual},{bossId:'a',type:'respawn',time:actual},
  {bossId:'other',type:'respawn',time:actual+1},{bossId:'a',type:'death',time:actual+2}
 ]}});
 const times=copy(ctx.getBossScheduleEventTimes(boss,Date.parse('2026-10-31T09:00:00Z'),'today'));
 assert.deepEqual(times,[morning,actual,next]);
 assert.ok(!times.includes(morning+600*60000),'Do not invent the obsolete 11:54 forecast as an actual spawn');
});

test("an actual spawn is retained without a forecast anchor and next midnight is excluded",()=>{
 const start=Date.parse('2026-10-30T17:00:00Z'),end=start+86400000;
 const ctx=load(["getTargetDateForFilter","getBossScheduleEventTimes"],{state:{history:[
  {bossId:'a',type:'respawn',time:start},{bossId:'a',type:'respawn',time:end}
 ]}});
 assert.deepEqual(copy(ctx.getBossScheduleEventTimes({id:'a',spawnMode:'interval',respawnMinutes:60},start+1000,'today')),[start]);
});
