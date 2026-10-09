import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const rules = JSON.parse(readFileSync(new URL("../database.rules.json", import.meta.url))).rules;
const approved = new Set(["approved"]);
const root = {
  child(name) { return { child(uid) { return { child(field) { return { val: () => name === "admin_access" && field === "active" && approved.has(uid) }; } }; } }; }
};

// Evaluate the actual read/write grant expressions and ancestor cascading.
// This is a focused regression check, not a replacement for the Firebase Emulator.
function permitted(path, action, auth) {
  let node = rules;
  for (const segment of [null, ...path.split("/")]) {
    if (segment !== null) node = node?.[segment] || node?.[Object.keys(node || {}).find(key => key.startsWith("$"))];
    const grant = node?.[action];
    if (grant === true || (typeof grant === "string" && Function("auth", "root", `return (${grant});`)(auth, root))) return true;
  }
  return false;
}

test("public boss and attendance data are readable while legacy attendance stays protected", () => {
  const privatePaths = ["boss_timeline_state", "boss_timeline_state/attendance_global", "boss_timeline_attendance", "boss_timeline_servers/s2/attendance"];
  for (const path of privatePaths) {
    assert.equal(permitted(path, ".read", null), false, path);
    assert.equal(permitted(path, ".read", { uid: "unapproved", token: {} }), false, path);
    assert.equal(permitted(path, ".read", { uid: "approved", token: {} }), true, path);
    assert.equal(permitted(path, ".read", { uid: "super", token: { admin: true } }), true, path);
  }
  for (const path of ["boss_timeline_state/data", "boss_timeline_state/bosses_map", "boss_timeline_servers/s2/state/data"]) {
    assert.equal(permitted(path, ".read", null), true, path);
    assert.equal(permitted(path, ".write", null), false, path);
  }

  const publicAttendancePath = "boss_timeline_attendance_global/weeks/0/members";
  assert.equal(permitted(publicAttendancePath, ".read", null), true);
  assert.equal(permitted(publicAttendancePath, ".read", { uid: "unapproved", token: {} }), true);
  assert.equal(permitted(publicAttendancePath, ".write", null), false);
  assert.equal(permitted(publicAttendancePath, ".write", { uid: "unapproved", token: {} }), false);
  assert.equal(permitted(publicAttendancePath, ".write", { uid: "approved", token: {} }), true);
  assert.equal(permitted(publicAttendancePath, ".write", { uid: "super", token: { admin: true } }), true);
});

test("only approved admins can write attendance and approval removal takes effect", () => {
  const path = "boss_timeline_attendance_global/weeks/0/members";
  assert.equal(permitted(path, ".write", { uid: "approved", token: {} }), true);
  assert.equal(permitted(path, ".write", { uid: "revoked", token: {} }), false);
  assert.equal(permitted(path, ".write", null), false);
  assert.equal(rules.boss_timeline_state.data.$other[".validate"], false);
});
