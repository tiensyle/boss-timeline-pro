import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../assets/app.js', import.meta.url), 'utf8');
const copy = value => JSON.parse(JSON.stringify(value));
function load(names, globals = {}) {
  const ctx = vm.createContext({ console, Date, canViewAdminArea: () => true, currentAdminPermissions: null, ...globals });
  for (const name of names) {
    const match = new RegExp(`^    (?:async )?function ${name}\\(`, 'm').exec(source);
    assert.ok(match, name);
    vm.runInContext(source.slice(match.index, source.indexOf('\n    }', match.index) + 6), ctx);
  }
  return ctx;
}
const mergeFunctions = ['cloneRealtimeValue', 'mergeRealtimeChanges', 'mergeBossStateChanges'];
const initial = () => ({ bosses: [{ id: 'a', name: 'ALPHA', map: 'Map', points: 0, notes: '', level: 80,
  revision: 1, diedAt: null, respawnsAt: null, lastRespawnAt: null }], history: [] });

test('four admins editing independent fields of one boss converge without losing updates', () => {
  const base = initial();
  const edits = [{ points: 4 }, { notes: 'shared note' }, { level: 100 }, { diedAt: 100, respawnsAt: 200 }];
  let confirmed = copy(base);
  for (const edit of edits) {
    const local = copy(base);
    Object.assign(local.bosses[0], edit, { revision: 2 });
    const ctx = load(mergeFunctions, { lastBossConflictIds: [] });
    confirmed = copy(ctx.mergeBossStateChanges(base, local, confirmed));
    assert.deepEqual(copy(ctx.lastBossConflictIds), []);
  }
  assert.equal(confirmed.bosses[0].points, 4);
  assert.equal(confirmed.bosses[0].notes, 'shared note');
  assert.equal(confirmed.bosses[0].level, 100);
  assert.equal(confirmed.bosses[0].diedAt, 100);
  assert.equal(confirmed.bosses[0].respawnsAt, 200);
  for (let i = 0; i < 4; i++) {
    const ctx = load(mergeFunctions);
    assert.deepEqual(copy(ctx.mergeBossStateChanges(base, base, confirmed)), confirmed);
  }
});

test('conflicting timers remain atomic and identical concurrent edits do not conflict', () => {
  const base = initial();
  const local = copy(base), remote = copy(base);
  Object.assign(local.bosses[0], { revision: 2, diedAt: 100, respawnsAt: 200 });
  Object.assign(remote.bosses[0], { revision: 2, lastRespawnAt: 300 });
  const ctx = load(mergeFunctions, { lastBossConflictIds: [] });
  assert.deepEqual(copy(ctx.mergeBossStateChanges(base, local, remote)), remote);
  assert.deepEqual(copy(ctx.lastBossConflictIds), ['a']);
  assert.deepEqual(copy(ctx.mergeBossStateChanges(base, local, local)), local);
  assert.deepEqual(copy(ctx.lastBossConflictIds), []);
});

test('every boss field and deletion reaches four receiving admin sessions', () => {
  const base = initial();
  const remote = copy(base);
  Object.assign(remote.bosses[0], { points: 5, notes: 'new', name: 'RENAMED', map: 'New map', level: 99,
    spawnMode: 'fixed', fixedSchedules: [{ day: 'all', time: '18:00' }], revision: 2 });
  for (let i = 0; i < 4; i++) {
    const ctx = load([...mergeFunctions, 'applyRemoteState'], {
      state: copy(base), bossSyncBase: copy(base), firebaseAuthReady: true, lastAppliedBossVersion: 0,
      lastRemoteUpdatedAt: 0, isAdmin: () => true, normalizeBoss: copy, lastBossConflictIds: [],
      saveStateLocal() {}, render() {}, lastRenderedGridKey: ''
    });
    ctx.applyRemoteState(remote.bosses, [], null, 'other-admin', ctx.bossSyncBase, 2);
    assert.deepEqual(copy(ctx.state), remote);
    ctx.applyRemoteState([], [], null, 'other-admin', ctx.bossSyncBase, 3);
    assert.deepEqual(copy(ctx.state.bosses), []);
  }
});

test('attendance merges four independent admins and propagates deleted members', () => {
  const base = { weeks: [{ id: 'w', diasPool: 0, usdtPool: 0, members: [{ id: 'm', name: 'Member', records: {} }], activities: [] }] };
  let confirmed = copy(base);
  for (const edit of [s => s.weeks[0].diasPool = 100, s => s.weeks[0].usdtPool = 20,
    s => s.weeks[0].members[0].records.boss = true, s => s.weeks[0].activities.push({ id: 'boss', points: 4 })]) {
    const local = copy(base); edit(local);
    const ctx = load(['cloneRealtimeValue', 'mergeRealtimeChanges']);
    confirmed = copy(ctx.mergeRealtimeChanges(base, local, confirmed));
  }
  assert.equal(confirmed.weeks[0].diasPool, 100);
  assert.equal(confirmed.weeks[0].usdtPool, 20);
  assert.equal(confirmed.weeks[0].members[0].records.boss, true);
  assert.equal(confirmed.weeks[0].activities[0].points, 4);
  const deleted = copy(confirmed); deleted.weeks[0].members = [];
  const stale = copy(confirmed); stale.weeks[0].members[0].name = 'Stale';
  const ctx = load(['cloneRealtimeValue', 'mergeRealtimeChanges']);
  assert.deepEqual(copy(ctx.mergeRealtimeChanges(confirmed, stale, deleted)).weeks[0].members, []);
});

test('rejected boss changes retain the full attempted data for recovery', () => {
  const saved = [];
  const ctx = load(['cloneRealtimeValue', 'reportRejectedBossOperations'], {
    localStorage: { setItem: (k, v) => saved.push(JSON.parse(v)) }, STORAGE_KEY: 'test', currentServerId: 's1',
    getNow: () => 100, showToast() {}
  });
  const state = initial(); state.bosses[0].points = 7;
  ctx.reportRejectedBossOperations(['a'], state);
  assert.equal(saved[0][0].attemptedBoss.points, 7);
});

test('attendance snapshot waits for authentication before choosing to merge offline edits', () => {
  let listener;
  let applied = false;
  const ref = { on: (_, callback) => { listener = callback; } };
  const ctx = load(['cloneRealtimeValue', 'initAttendanceRealtimeSync'], {
    firebaseAuthReady: false, attendanceDbRef: ref, activeAttendanceRef: null,
    attendanceSyncGeneration: 0, attendanceRemoteStateReady: false, attendanceRemoteSaveInFlight: false,
    attendanceRemotePermissionDenied: false, attendanceDeferredRemoteData: null,
    attendanceFirebaseSeedAttempted: false, attendanceRemoteDataExists: false,
    applyAttendanceRemoteData: () => { applied = true; }
  });
  ctx.initAttendanceRealtimeSync();
  const remote = { version: 2, weeks: [{ id: 'w', diasPool: 100 }] };
  listener({ val: () => remote });
  assert.equal(applied, false);
  assert.deepEqual(copy(ctx.attendanceDeferredRemoteData), remote);
});
