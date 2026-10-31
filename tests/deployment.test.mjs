import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const configSource = readFileSync(new URL("../firebase-config.js", import.meta.url), "utf8");
const appSource = readFileSync(new URL("../assets/app.js", import.meta.url), "utf8");
function loadConfig(origin) {
  const window = { location: { origin } };
  vm.runInNewContext(configSource, { window });
  return window;
}

test("GitHub Pages uses the existing HTTPS Discord relay and unchanged Firebase project", () => {
  const config = loadConfig("https://tiensyle.github.io");
  assert.equal(config.BOSS_TIMELINE_DISCORD_API, "https://bosschill.vercel.app/api/discord");
  assert.equal(config.BOSS_TIMELINE_FIREBASE.projectId, "time-boss-chill");
});

test("Vercel and local development keep their same-origin Discord API", () => {
  for (const origin of ["https://bosschill.vercel.app", "http://127.0.0.1:8137", "https://preview.vercel.app"]) {
    assert.equal(loadConfig(origin).BOSS_TIMELINE_DISCORD_API, "/api/discord");
  }
});

test("server creation waits for Firebase state initialization before reporting success", () => {
  const start = appSource.indexOf("async function createNewServer");
  const end = appSource.indexOf("async function renameServer", start);
  const createServerSource = appSource.slice(start, end);
  assert.match(createServerSource, /await firebaseDb\.ref\(paths\.statePath\)\.transaction\(/);
  assert.match(createServerSource, /Không thể khởi tạo dữ liệu Server/);
});
