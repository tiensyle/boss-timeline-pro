/* Change-based recovery. Archives are separate from editable business data. */
var BossRecovery = (() => {
  const DAY = 86400000;
  let settings = null;
  let started = false;
  let ready;
  let resolveReady;
  let preview = null;
  let busy = false;
  let reloadPending = false;
  const copy = value => JSON.parse(JSON.stringify(value));
  const sourcePath = (scope, key) => scope === "bosses" ? getFirebaseServerPaths(key).statePath
    : scope === "attendance" ? "boss_timeline_attendance_global" : "boss_timeline_servers_list";
  const archivePath = (scope, key) => `recovery_snapshots/${scope}/${key}`;
  const versionOf = (scope, value) => Number(scope === "bosses" ? value?.data?.version : value?.version) || 0;
  async function bounded(promise) {
    let timer;
    try {
      return await Promise.race([promise,new Promise((_,reject) => {
        timer = setTimeout(()=>reject(new Error("Chưa nhận được xác nhận sao lưu từ Firebase. Kiểm tra kết nối rồi thử lại.")),20000);
      })]);
    } finally { clearTimeout(timer); }
  }
  const stampOf = (scope, value) => {
    const raw = scope === "bosses" ? value?.data?.updated_at : value?.updatedAt;
    const stamp = typeof raw === "number" ? raw : Date.parse(raw || "");
    return Number.isFinite(stamp) && stamp > 0 ? Math.min(stamp,getNow()) : getNow();
  };

  function selectSnapshot(records, target, startedAt) {
    if (target < startedAt) return null;
    return Object.entries(records || {}).map(([id, value]) => ({id, ...value}))
      .filter(value => Number.isFinite(value.effectiveAt) && value.effectiveAt <= target && typeof value.payload === "string")
      .sort((a, b) => b.effectiveAt - a.effectiveAt || b.sourceVersion - a.sourceVersion)[0] || null;
  }

  function obsoleteSnapshots(records, now) {
    const old = Object.entries(records || {}).filter(([,record]) => record.effectiveAt < now - 8*DAY)
      .sort((a,b) => b[1].effectiveAt-a[1].effectiveAt || b[1].sourceVersion-a[1].sourceVersion);
    // Keep an anchor preceding the retention window, even if the data stayed unchanged.
    return old.slice(1).map(([id])=>id);
  }

  function finish() {
    busy = false;
    const findButton = document.getElementById("recoveryPreviewBtn");
    if (findButton) findButton.disabled = !settings?.enabled;
    if (reloadPending) { clearUnsavedCaches(); window.location.reload(); }
  }

  function restoredValue(scope, payload, current, maxVersion, epoch, uid, now) {
    let value = copy(payload);
    const version = Math.max(versionOf(scope, current), maxVersion) + 1;
    if (scope === "servers") {
      value = {items:Object.fromEntries(normalizeServerList(value).map(server=>[server.id,server]))};
    }
    if (scope === "bosses") {
      value = {...copy(current || {}), ...value};
      const currentById = new Map((current?.data?.bosses || []).map(boss => [boss.id, boss]));
      value.data.bosses = (value.data.bosses || []).map(boss => ({...boss,
        revision: Math.max(Number(boss.revision) || 0, Number(currentById.get(boss.id)?.revision) || 0) + 1,
        updatedAt: now, updatedBy: uid}));
      Object.assign(value.data, {version, syncEpoch: current?.data?.syncEpoch || value.data.syncEpoch || epoch,
        syncProtocol: 2, recoveryEpoch: epoch, restoreBaseVersion:versionOf(scope,current), updated_at: new Date(now).toISOString(), _clientId: uid});
      value.bosses_map = Object.fromEntries(value.data.bosses.map(boss => [boss.id, boss]));
      Object.assign(value, {version, updated_at: value.data.updated_at, last_editor: uid});
    } else Object.assign(value, {version, recoveryEpoch: epoch, restoreBaseVersion:versionOf(scope,current), updatedAt: now, updatedBy: uid});
    return value;
  }

  async function archive(scope, key, value) {
    if (!value) return;
    const version = versionOf(scope, value);
    // Boss archives exclude legacy attendance and backend/Discord configuration.
    const payload = scope === "bosses" ? {data: value.data || {bosses: Object.values(value.bosses_map || {}), history: []}} : value;
    const record = {sourceVersion: version, effectiveAt: stampOf(scope, value),
      capturedAt: firebase.database.ServerValue.TIMESTAMP, capturedBy: firebaseAuth.currentUser.uid,
      payload: JSON.stringify(payload)};
    await bounded(firebaseDb.ref(`${archivePath(scope,key)}/${version}`).transaction(existing => existing ? undefined : record, undefined, false));
  }

  async function prepare(scope, key) {
    if (!started) return;
    await bounded(ready);
    if (!settings?.enabled) return;
    if (typeof firebaseRealtimeConnected !== "undefined" && !firebaseRealtimeConnected) throw new Error("Chưa kết nối Firebase để sao lưu. Thay đổi được giữ trên máy.");
    const snapshot = await bounded(firebaseDb.ref(sourcePath(scope,key)).once("value"));
    await archive(scope, key, snapshot.val());
  }

  function confirmed(scope, key, value) {
    if (!settings?.enabled || !firebaseAuth?.currentUser) return;
    archive(scope, key, value).catch(error => {
      console.error("Recovery archive error:", error);
      showToast("Dữ liệu đã lưu; bản lịch sử mới chưa được xác nhận. Thay đổi tiếp theo cần sao lưu thành công.");
    });
  }

  function clearUnsavedCaches() {
    const remove = [];
    for (let i=0;i<localStorage.length;i++) {
      const key = localStorage.key(i);
      if (/^bossTimelinePro\.v1(?:_|$)/.test(key) || /attendance/i.test(key) && key.startsWith("bossTimelinePro")) remove.push(key);
    }
    remove.forEach(key => localStorage.removeItem(key));
  }

  function init() {
    if (started || !firebaseDb) return;
    started = true;
    ready = new Promise(resolve => { resolveReady = resolve; });
    firebaseDb.ref("recovery_settings").on("value", snapshot => {
      const next = snapshot.val() || {enabled:false};
      if (settings && settings.epoch !== next.epoch && next.epoch) {
        // Keep this session's old epoch until navigation; in-flight writes then fail Rules.
        if (busy) { reloadPending = true; return; }
        clearUnsavedCaches();
        window.location.reload();
        return;
      }
      settings = next;
      resolveReady();
      updateUI();
    }, error => { settings = {enabled:false}; resolveReady(); console.error(error); });
    document.getElementById("recoveryOpenBtn")?.addEventListener("click", open);
    document.getElementById("recoveryCloseBtn")?.addEventListener("click", close);
    document.getElementById("recoveryEnableBtn")?.addEventListener("click", enable);
    document.getElementById("recoveryPreviewBtn")?.addEventListener("click", loadPreview);
    document.getElementById("recoveryRestoreBtn")?.addEventListener("click", restore);
    for (const id of ["recoveryScope","recoveryAge"]) document.getElementById(id)?.addEventListener("change", () => {
      preview = null;
      document.getElementById("recoveryRestoreBtn").disabled = true;
      message("Bấm Tìm bản sao để xem thời điểm và dữ liệu sẽ khôi phục.");
    });
  }

  function updateUI() {
    const button = document.getElementById("recoveryOpenBtn");
    if (button) button.hidden = !isSuperAdmin();
  }
  function message(text) { document.getElementById("recoveryStatus").textContent = text; }
  function open() {
    if (!isSuperAdmin()) return;
    const modal = document.getElementById("recoveryModal");
    modal.classList.add("open"); syncModalScrollLock();
    document.getElementById("recoveryEnableBtn").hidden = Boolean(settings?.enabled);
    document.getElementById("recoveryPreviewBtn").disabled = !settings?.enabled;
    document.getElementById("recoveryRestoreBtn").disabled = true;
    preview = null;
    message(settings?.enabled ? `Đã bật từ ${formatFullDateTime(settings.startedAt)}. Chọn phần dữ liệu và mốc cần tìm.`
      : "Chưa bật lịch sử. Chỉ dữ liệu từ lúc bật mới có thể khôi phục; không cần mở web khi không có thay đổi.");
  }
  function close() { if (busy) return; document.getElementById("recoveryModal").classList.remove("open"); syncModalScrollLock(); }

  async function scopesForSelection(target) {
    const selected = document.getElementById("recoveryScope").value;
    if (selected === "bosses") return [["bosses",currentServerId]];
    if (selected === "attendance") return [["attendance","global"]];
    if (selected === "servers") return [["servers","global"]];
    const registry = (await firebaseDb.ref(archivePath("servers","global")).once("value")).val();
    const selectedRegistry = selectSnapshot(registry,target,settings.startedAt);
    if (!selectedRegistry) throw new Error("Chưa có bản danh sách Server ở mốc này.");
    const list = normalizeServerList(JSON.parse(selectedRegistry.payload));
    return [["servers","global"],["attendance","global"], ...list.map(server=>["bosses",server.id])];
  }

  async function enable() {
    if (!isSuperAdmin() || busy) return;
    busy = true;
    try {
      message("Đang lưu bản đầu tiên…");
      const current = (await firebaseDb.ref("recovery_settings").once("value")).val();
      if (current?.enabled) { message("Lịch sử đã được bật. Hãy mở lại cửa sổ."); return; }
      const listValue = (await firebaseDb.ref("boss_timeline_servers_list").once("value")).val();
      const list = normalizeServerList(listValue);
      await archive("servers","global",listValue);
      await archive("attendance","global",(await attendanceDbRef.once("value")).val());
      for (const server of list) await archive("bosses",server.id,(await firebaseDb.ref(sourcePath("bosses",server.id)).once("value")).val());
      await firebaseDb.ref("recovery_settings").set({enabled:true,startedAt:getNow(),previousEpoch:current?.epoch || null,epoch:makeBossSyncEpoch(),enabledBy:firebaseAuth.currentUser.uid});
      // Capture changes that may have committed while the initial baseline was being read.
      await archive("servers","global",(await firebaseDb.ref(sourcePath("servers","global")).once("value")).val());
      await archive("attendance","global",(await attendanceDbRef.once("value")).val());
      for (const server of list) await archive("bosses",server.id,(await firebaseDb.ref(sourcePath("bosses",server.id)).once("value")).val());
      message("Đã bật lịch sử. Trang sẽ tải lại để áp dụng.");
    } catch(error) { message(`Chưa bật được. Cần Publish Firebase Rules mới. ${error.code || error.message}`); }
    finally { finish(); }
  }

  async function loadPreview() {
    if (!isSuperAdmin() || busy || !settings?.enabled) return;
    busy = true; preview = null;
    document.getElementById("recoveryPreviewBtn").disabled = true;
    message("Đang tìm bản sao…");
    document.getElementById("recoveryRestoreBtn").disabled = true;
    try {
      const target = getNow() - Number(document.getElementById("recoveryAge").value);
      const entries = [];
      for (const [scope,key] of await scopesForSelection(target)) {
        await prepare(scope,key);
        const records = (await firebaseDb.ref(archivePath(scope,key)).once("value")).val();
        const obsolete = obsoleteSnapshots(records,getNow());
        if (obsolete.length) await firebaseDb.ref(archivePath(scope,key)).update(Object.fromEntries(obsolete.map(id=>[id,null])));
        const found = selectSnapshot(records,target,settings.startedAt);
        if (!found) throw new Error(`Chưa có bản sao đủ cũ cho ${scope === "bosses" ? "Boss " + key : scope === "servers" ? "Server" : "chấm công"}. Không thay đổi dữ liệu.`);
        const current = (await firebaseDb.ref(sourcePath(scope,key)).once("value")).val();
        entries.push({scope,key,found,currentVersion:versionOf(scope,current),
          maxVersion:Math.max(0,...Object.values(records || {}).map(value=>Number(value.sourceVersion)||0))});
      }
      preview = {entries, epoch:settings.epoch, target};
      message(entries.map(({scope,key,found})=>`${scope === "bosses" ? "Boss " + key : scope === "servers" ? "Danh sách Server" : "Chấm công/lương"}: ${formatFullDateTime(found.effectiveAt)}`).join("\n")
        + "\nĐây là bản gần nhất trước mốc đã chọn. Khôi phục sẽ thay thế phần dữ liệu này; tài khoản và phân quyền không thay đổi.");
      document.getElementById("recoveryRestoreBtn").disabled = false;
    } catch(error) { message(error.message); }
    finally { finish(); }
  }

  async function restore() {
    if (!isSuperAdmin() || busy || !preview) return;
    const choice = preview;
    const approved = await showConfirmModal({title:"Khôi phục dữ liệu?",subtitle:"Chỉ những phần đã chọn được thay thế.",
      message:document.getElementById("recoveryStatus").textContent,confirmText:"Khôi phục bản này"});
    if (!approved || busy || choice !== preview) return;
    busy = true;
    document.getElementById("recoveryRestoreBtn").disabled = true;
    try {
      const latestSettings = (await firebaseDb.ref("recovery_settings").once("value")).val();
      if (latestSettings?.epoch !== choice.epoch) throw new Error("Đã có lần khôi phục khác. Hãy tìm bản sao lại.");
      const epoch = makeBossSyncEpoch();
      const updates = {};
      for (const entry of choice.entries) {
        const {scope,key,found,maxVersion} = entry;
        const current = (await firebaseDb.ref(sourcePath(scope,key)).once("value")).val();
        if (versionOf(scope,current) !== entry.currentVersion) throw new Error("Dữ liệu vừa được Admin khác cập nhật. Hãy tìm bản sao lại trước khi khôi phục.");
        await archive(scope,key,current);
        const restored = restoredValue(scope,JSON.parse(found.payload),current,maxVersion,epoch,firebaseAuth.currentUser.uid,getNow());
        updates[sourcePath(scope,key)] = restored;
      }
      updates.recovery_settings = {...latestSettings,previousEpoch:choice.epoch,epoch,lastRestoredAt:getNow(),lastRestoredBy:firebaseAuth.currentUser.uid};
      // One atomic multipath update; advancing versions makes concurrent edits fail Rules.
      await firebaseDb.ref().update(updates);
      message("Đã khôi phục. Các máy sẽ tải lại dữ liệu mới.");
    } catch(error) { message(`Chưa khôi phục: ${error.code || error.message}`); preview = null; }
    finally { finish(); }
  }

  return {init,updateUI,prepare,confirmed,epoch:()=>settings?.epoch || "",selectSnapshot,restoredValue,obsoleteSnapshots};
})();
