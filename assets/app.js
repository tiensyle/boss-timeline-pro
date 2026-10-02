    // Multi-Server Configuration
    const STORAGE_SERVERS_KEY = "bossTimelinePro.servers";
    const STORAGE_CURRENT_SERVER_KEY = "bossTimelinePro.currentServerId";
    const DEFAULT_SERVERS = [
      { id: "s1", name: "Server 1", icon: "🌐" }
    ];

    function getQueryParam(param) {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
      } catch (e) {
        return null;
      }
    }

    function loadServerList() {
      try {
        const raw = localStorage.getItem(STORAGE_SERVERS_KEY);
        if (!raw) return [...DEFAULT_SERVERS];
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        return [...DEFAULT_SERVERS];
      } catch (e) {
        return [...DEFAULT_SERVERS];
      }
    }

    let serverList = loadServerList();
    const urlServerId = getQueryParam("sv") || getQueryParam("server");
    let currentServerId = urlServerId && serverList.some(s => s.id === urlServerId)
      ? urlServerId
      : (localStorage.getItem(STORAGE_CURRENT_SERVER_KEY) || "s1");

    // Neu urlServerId hop le nhung chua co trong serverList -> tu them vao
    if (urlServerId && !serverList.some(s => s.id === urlServerId)) {
      serverList.push({ id: urlServerId, name: "Server " + urlServerId.toUpperCase(), icon: "🌐" });
      currentServerId = urlServerId;
      try { localStorage.setItem(STORAGE_SERVERS_KEY, JSON.stringify(serverList)); } catch (e) {}
    }

    let STORAGE_KEY = `bossTimelinePro.v1_${currentServerId}`;
    const SOON_LIMIT_MS = 5 * 60 * 1000;
    let currentLang = localStorage.getItem("bossTimelinePro.lang") || "vi";

    const TRANSLATIONS = {
      vi: {
        sidebarSubtitle: "Respawn Control",
        navDashboard: "Dashboard",
        navTodaySchedule: "Lịch boss hôm nay",
        navWeeklySchedule: "Boss Tiêu Biểu",
        navBossList: "Boss List",
        navTimeline: "Timeline",
        resetMaintenance: "Reset sau bảo trì",
        realtimeCountdown: "Realtime countdown",
        realtimeConnected: "Realtime",
        realtimeConnecting: "Đang kết nối…",
        dashboardTitle: "Dashboard theo dõi boss chết và hồi sinh",
        dashboardSub: "Theo dõi nhiều boss cùng lúc, ghi nhận thời điểm chết, xem countdown hồi sinh, lọc trạng thái và lưu dữ liệu ngay trên trình duyệt.",
        adminRole: "Admin",
        memberRole: "Thành viên",
        soundOn: "Âm thanh: Bật",
        soundOff: "Âm thanh: Tắt",
        systemClock: "Giờ hệ thống",
        addBoss: "Thêm boss",
        metricTotal: "Tổng boss",
        metricTotalDesc: "Đang theo dõi",
        metricAlive: "Đang sống",
        metricAliveDesc: "Boss sẵn sàng",
        metricRespawning: "Đang hồi sinh",
        metricRespawningDesc: "Đang hồi sinh",
        metricSoon: "Sắp hồi sinh",
        metricSoonDesc: "Cần chuẩn bị",
        nextRespawnTitle: "NEXT RESPAWN",
        noNextBossTitle: "Không có boss nào đang chờ hồi sinh",
        noNextBossSub: "Tất cả boss hiện đang ở trạng thái sống. Khi có boss chết, khu vực này sẽ tự động hiển thị countdown ưu tiên gần nhất.",
        readyStatus: "READY",
        readyHint: "Bấm \"Ghi nhận chết\" trên card boss để bắt đầu đếm ngược hồi sinh.",
        nextWillRespawn: "sẽ hồi sinh tiếp theo",
        estimatedRespawnAt: "Dự kiến hồi sinh lúc",
        prepareBeforeZero: "Chuẩn bị trước khi timer về 0.",
        diedAtLabel: "Chết lúc",
        schedulePanelTitle: "Lịch Hồi Sinh & Dự Báo Boss (7 Ngày)",
        scheduleSubAll: "Đầy đủ lịch đếm ngược các ngày trong tuần & chu kỳ multi-day (30h, 48h...)",
        exportPdf: "Xuất PDF",
        colTimeDate: "GIỜ & NGÀY HỒI SINH",
        colLevel: "LEVEL",
        colBoss: "BOSS",
        colCycle: "CHU KỲ",
        colMap: "ĐỊA ĐIỂM",
        colNotes: "GHI CHÚ",
        tabAll7Days: "Tất cả (7 Ngày)",
        tabToday: "Hôm nay",
        tabMon: "Thứ 2",
        tabTue: "Thứ 3",
        tabWed: "Thứ 4",
        tabThu: "Thứ 5",
        tabFri: "Thứ 6",
        tabSat: "Thứ 7",
        tabSun: "Chủ Nhật",
        weeklyPanelTitle: "Lịch Boss Tiêu Biểu",
        weeklyPanelSub: "Boss cố định theo ngày trong tuần · Thứ 2 → Chủ Nhật",
        weeklyNoDataTitle: "Chưa có boss tiêu biểu",
        weeklyNoDataSub: "Thêm boss và chọn ngày xuất hiện trong tuần để hiển thị lịch boss cố định T2–CN.",
        searchPlaceholder: "Tìm theo tên boss, map hoặc ghi chú",
        filterAll: "Tất cả",
        filterAlive: "Đang sống",
        filterRespawning: "Đang hồi sinh",
        filterSoon: "Sắp hồi sinh",
        recordDeathBtn: "Ghi nhận chết",
        reviveBtn: "Hồi sinh ngay",
        editBossBtn: "Sửa boss",
        aliveBadge: "• ĐANG SỐNG",
        soonBadge: "• SẮP HỒI SINH",
        respawningBadge: "• ĐANG HỒI SINH",
        historyTitle: "Timeline gần đây",
        historySub: "Lịch sử chết và hồi sinh mới nhất",
        clearHistoryBtn: "Xóa lịch sử",
        offsetModalTitle: "Ghi nhận boss chết lùi giờ",
        offsetModalSub: "Chọn thời điểm boss đã bị tiêu diệt trong quá khứ",
        offsetQuickPresetLabel: "Chọn nhanh thời điểm chết:",
        offsetDateLabel: "Chọn ngày boss chết:",
        offsetDateToday: "📅 Hôm nay",
        offsetDateYesterday: "📅 Hôm qua (-1 ngày)",
        offsetDate2DaysAgo: "📅 2 ngày trước (-2 ngày)",
        offsetDate3DaysAgo: "📅 3 ngày trước (-3 ngày)",
        offsetCustomLabel: "Hoặc nhập chính xác giờ chết:",
        offsetNowBtn: "Giờ hiện tại",
        offsetConfirmBtn: "✓ Xác nhận ghi nhận",
        offsetCancelBtn: "Hủy bỏ",
        offsetNow: "⚡ Vừa chết (0p)",
        offset2m: "⏱️ 2 phút trước",
        offset5m: "⏱️ 5 phút trước",
        offset10m: "⏱️ 10 phút trước",
        offset15m: "⏱️ 15 phút trước",
        offset20m: "⏱️ 20 phút trước",
        offset30m: "⏱️ 30 phút trước",
        offset45m: "⏱️ 45 phút trước",
        offset60m: "⏱️ 1 giờ trước"
      },
      en: {
        sidebarSubtitle: "Respawn Control",
        navDashboard: "Dashboard",
        navTodaySchedule: "Today's Schedule",
        navWeeklySchedule: "Featured Bosses",
        navBossList: "Boss List",
        navTimeline: "Timeline",
        resetMaintenance: "Reset Post-Maintenance",
        realtimeCountdown: "Realtime countdown",
        realtimeConnected: "Realtime",
        realtimeConnecting: "Connecting…",
        dashboardTitle: "Boss Death & Respawn Tracker Dashboard",
        dashboardSub: "Track multiple bosses simultaneously, record death times, view respawn countdowns, filter status, and sync data across devices.",
        adminRole: "Admin",
        memberRole: "Member",
        soundOn: "Sound: On",
        soundOff: "Sound: Off",
        systemClock: "System Clock",
        addBoss: "Add Boss",
        metricTotal: "Total Bosses",
        metricTotalDesc: "Tracked",
        metricAlive: "Alive",
        metricAliveDesc: "Ready to spawn",
        metricRespawning: "Respawning",
        metricRespawningDesc: "Counting down",
        metricSoon: "Spawning Soon",
        metricSoonDesc: "Get ready",
        nextRespawnTitle: "NEXT RESPAWN",
        noNextBossTitle: "No bosses currently counting down",
        noNextBossSub: "All bosses are currently ALIVE. When a boss dies, the nearest upcoming respawn countdown will automatically appear here.",
        readyStatus: "READY",
        readyHint: "Click \"Record Death\" on a boss card to start its respawn countdown.",
        nextWillRespawn: "will respawn next",
        estimatedRespawnAt: "Estimated respawn at",
        prepareBeforeZero: "Prepare before timer hits 0.",
        diedAtLabel: "Died at",
        schedulePanelTitle: "Respawn & Forecast Schedule (7 Days)",
        scheduleSubAll: "Full weekly countdown schedule & multi-day respawn cycles (30h, 48h...)",
        exportPdf: "Export PDF",
        colTimeDate: "TIME & DATE",
        colLevel: "LEVEL",
        colBoss: "BOSS",
        colCycle: "CYCLE",
        colMap: "LOCATION / MAP",
        colNotes: "NOTES",
        tabAll7Days: "All (7 Days)",
        tabToday: "Today",
        tabMon: "Mon",
        tabTue: "Tue",
        tabWed: "Wed",
        tabThu: "Thu",
        tabFri: "Fri",
        tabSat: "Sat",
        tabSun: "Sun",
        weeklyPanelTitle: "Featured Boss Schedule",
        weeklyPanelSub: "Fixed schedule bosses by day of week · Monday → Sunday",
        weeklyNoDataTitle: "No featured bosses configured",
        weeklyNoDataSub: "Add a boss and select recurring days of the week to show fixed Mon–Sun schedule.",
        searchPlaceholder: "Search by boss name, map or notes",
        filterAll: "All",
        filterAlive: "Alive",
        filterRespawning: "Respawning",
        filterSoon: "Soon",
        recordDeathBtn: "Record Death",
        reviveBtn: "Revive Now",
        editBossBtn: "Edit Boss",
        aliveBadge: "• ALIVE",
        soonBadge: "• SPAWNING SOON",
        respawningBadge: "• COUNTING DOWN",
        historyTitle: "Recent Timeline",
        historySub: "Latest death and respawn events log",
        clearHistoryBtn: "Clear History",
        offsetModalTitle: "Record Past Boss Death",
        offsetModalSub: "Choose when the boss was killed in the past",
        offsetQuickPresetLabel: "Quick death presets:",
        offsetDateLabel: "Select death date:",
        offsetDateToday: "📅 Today",
        offsetDateYesterday: "📅 Yesterday (-1d)",
        offsetDate2DaysAgo: "📅 2 days ago (-2d)",
        offsetDate3DaysAgo: "📅 3 days ago (-3d)",
        offsetCustomLabel: "Or enter exact death time:",
        offsetNowBtn: "Current Time",
        offsetConfirmBtn: "✓ Confirm Death Record",
        offsetCancelBtn: "Cancel",
        offsetNow: "⚡ Just died (0m)",
        offset2m: "⏱️ 2 mins ago",
        offset5m: "⏱️ 5 mins ago",
        offset10m: "⏱️ 10 mins ago",
        offset15m: "⏱️ 15 mins ago",
        offset20m: "⏱️ 20 mins ago",
        offset30m: "⏱️ 30 mins ago",
        offset45m: "⏱️ 45 mins ago",
        offset60m: "⏱️ 1 hour ago"
      }
    };

    function setLanguage(lang) {
      if (lang !== "vi" && lang !== "en") return;
      currentLang = lang;
      localStorage.setItem("bossTimelinePro.lang", lang);

      document.querySelectorAll(".lang-btn").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.lang === lang);
      });

      updateTranslationsUI();
      render();
      showToast(lang === "en" ? "Switched language to English 🇬🇧" : "Đã chuyển sang Tiếng Việt 🇻🇳");
    }

    function updateTranslationsUI() {
      const t = TRANSLATIONS[currentLang];
      document.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.dataset.i18n;
        if (t[key]) el.textContent = t[key];
      });
      document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
        const key = el.dataset.i18nPlaceholder;
        if (t[key]) el.placeholder = t[key];
      });
      if (typeof updateScheduleDayTabs === "function") {
        updateScheduleDayTabs(new Date());
      }
    }


    // ── Google Firebase Realtime Database ──────────────────────────────
    // Cấu hình trong file firebase-config.js để bật đồng bộ team.
    const FIREBASE_CONFIG = window.BOSS_TIMELINE_FIREBASE || null;
    const REALTIME_ENABLED = Boolean(FIREBASE_CONFIG && (FIREBASE_CONFIG.databaseURL || FIREBASE_CONFIG.projectId) && window.firebase);
    let firebaseApp = null;
    let firebaseAuth = null;
    let firebaseDb = null;
    let stateDbRef = null;
    let discordConfigDbRef = null;
    let alertsDbRef = null;
    let attendanceDbRef = null;
    let remoteStateReady = false;
    let remoteSaveInFlight = false;
    let pendingRemoteSave = false;
    let lastRemoteUpdatedAt = 0;
    const CLIENT_ID = "client_" + Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);

    function cloneRealtimeValue(value) {
      return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
    }

    // Apply only the local difference to the latest server value, including deletion by ID.
    function mergeRealtimeChanges(base, local, remote) {
      if (JSON.stringify(base) === JSON.stringify(local)) return cloneRealtimeValue(remote);
      if (local === null || typeof local !== "object") return cloneRealtimeValue(local);
      if (Array.isArray(local)) {
        const baseList = Array.isArray(base) ? base : [];
        const remoteList = Array.isArray(remote) ? remote : [];
        if (![...baseList, ...local, ...remoteList].every(item => item && typeof item === "object" && item.id)) {
          return cloneRealtimeValue(local);
        }
        const baseMap = new Map(baseList.map(item => [item.id, item]));
        const localMap = new Map(local.map(item => [item.id, item]));
        const remoteIds = new Set(remoteList.map(item => item.id));
        const merged = remoteList.filter(item => !baseMap.has(item.id) || localMap.has(item.id)).map(item => {
          if (!localMap.has(item.id)) return cloneRealtimeValue(item);
          return mergeRealtimeChanges(baseMap.get(item.id), localMap.get(item.id), item);
        });
        // A remotely deleted item is not recreated by a stale local edit.
        const added = local.filter(item => !baseMap.has(item.id) && !remoteIds.has(item.id)).map(cloneRealtimeValue);
        return local[0] && !baseMap.has(local[0].id) ? [...added, ...merged] : [...merged, ...added];
      }
      const before = base && typeof base === "object" && !Array.isArray(base) ? base : {};
      const merged = remote && typeof remote === "object" && !Array.isArray(remote) ? cloneRealtimeValue(remote) : {};
      for (const key of new Set([...Object.keys(before), ...Object.keys(local)])) {
        if (!Object.prototype.hasOwnProperty.call(local, key)) delete merged[key];
        else merged[key] = mergeRealtimeChanges(before[key], local[key], merged[key]);
        if (merged[key] === undefined) delete merged[key];
      }
      return merged;
    }

    function getFirebaseServerPaths(svId) {
      if (svId === "s1") {
        return {
          statePath: "boss_timeline_state",
          discordPath: "boss_timeline_discord_config",
          alertsPath: "boss_timeline_discord_alerts",
          // Keep Attendance under the existing rules-approved state tree.
          // The database rejects writes to new root-level attendance nodes.
          attendancePath: "boss_timeline_state/attendance_global"
        };
      }
      return {
        statePath: `boss_timeline_servers/${svId}/state`,
        discordPath: `boss_timeline_servers/${svId}/discord_config`,
        alertsPath: `boss_timeline_servers/${svId}/discord_alerts`,
        attendancePath: "boss_timeline_state/attendance_global"
      };
    }

    function getLegacyFirebaseAttendancePath(svId) {
      return svId === "s1" ? "boss_timeline_attendance" : `boss_timeline_servers/${svId}/attendance`;
    }

    function updateServerDatabaseRefs(svId) {
      if (!firebaseDb) return;
      const paths = getFirebaseServerPaths(svId);
      stateDbRef = firebaseDb.ref(paths.statePath);
      discordConfigDbRef = firebaseDb.ref(paths.discordPath);
      alertsDbRef = firebaseDb.ref(paths.alertsPath);
      attendanceDbRef = firebaseDb.ref(paths.attendancePath);
    }

    if (REALTIME_ENABLED) {
      try {
        if (!firebase.apps.length) {
          firebaseApp = firebase.initializeApp(FIREBASE_CONFIG);
        } else {
          firebaseApp = firebase.app();
        }
        firebaseAuth = firebase.auth();
        firebaseDb = firebase.database();
        updateServerDatabaseRefs(currentServerId);
      } catch (e) {
        console.error("Firebase init error:", e);
      }
    }


    const elements = {
      metrics: document.getElementById("metrics"),
      nextPanel: null,
      bossGrid: document.getElementById("bossGrid"),
      historyList: document.getElementById("historyList"),
      searchBoss: document.getElementById("searchBoss"),
      filterTabs: document.querySelector(".filter-tabs"),
      headerClock: document.getElementById("headerClock"),
      sidebarClock: document.getElementById("sidebarClock"),
      todaySchedulePanel: document.getElementById("boss-schedule"),
      todayScheduleToggle: document.getElementById("todayScheduleToggle"),
      todayHeaderBadge: document.getElementById("todayHeaderBadge"),
      todayScheduleBody: document.getElementById("todayScheduleBody"),
      todayScheduleSubtitle: document.getElementById("todayScheduleSubtitle"),
      todayBossCount: document.getElementById("todayBossCount"),
      exportPdfBtn: document.getElementById("exportPdfBtn"),
      todayToggleIconBtn: document.getElementById("todayToggleIconBtn"),
      weeklySchedulePanel: document.getElementById("weeklySchedulePanel"),
      weeklyScheduleToggle: document.getElementById("weeklyScheduleToggle"),
      weeklyGrid: document.getElementById("weeklyGrid"),
      weeklyHeaderBadge: document.getElementById("weeklyHeaderBadge"),
      fixedScheduleContainer: document.getElementById("fixedScheduleContainer"),
      fixedSlotsList: document.getElementById("fixedSlotsList"),
      addFixedSlotBtn: document.getElementById("addFixedSlotBtn"),
      addBossBtn: document.getElementById("addBossBtn"),
      resetAllTimersBtn: document.getElementById("resetAllTimersBtn"),
      clearHistoryBtn: document.getElementById("clearHistoryBtn"),

      modal: document.getElementById("bossModal"),
      bossForm: document.getElementById("bossForm"),
      modalTitle: document.getElementById("modalTitle"),
      modalHint: document.getElementById("modalHint"),
      deleteBossBtn: document.getElementById("deleteBossBtn"),
      spawnModeSelector: document.getElementById("spawnModeSelector"),
      respawnMinutesField: document.getElementById("respawnMinutesField"),
      fixedTimeField: null,
      authModal: document.getElementById("authModal"),
      authStepChoose: document.getElementById("authStepChoose"),
      authStepAdminLogin: document.getElementById("authStepAdminLogin"),
      chooseAdminBtn: document.getElementById("chooseAdminBtn"),
      chooseMemberBtn: document.getElementById("chooseMemberBtn"),
      adminLoginForm: document.getElementById("adminLoginForm"),
      adminEmailInput: document.getElementById("adminEmailInput"),
      adminPasswordInput: document.getElementById("adminPasswordInput"),
      adminLoginError: document.getElementById("adminLoginError"),
      adminLoginBackBtn: document.getElementById("adminLoginBackBtn"),
      togglePasswordVisBtn: document.getElementById("togglePasswordVisBtn"),
      soundToggleBtn: document.getElementById("soundToggleBtn"),
      soundToggleText: document.getElementById("soundToggleText"),
      soundTestBtn: document.getElementById("soundTestBtn"),
      toast: document.getElementById("toast"),
      serverSwitcher: document.getElementById("serverSwitcher"),
      serverSelectBtn: document.getElementById("serverSelectBtn"),
      currentServerIcon: document.getElementById("currentServerIcon"),
      currentServerName: document.getElementById("currentServerName"),
      serverDropdown: document.getElementById("serverDropdown"),
      serverListContainer: document.getElementById("serverListContainer"),
      addServerBtn: document.getElementById("addServerBtn"),
      manageServersBtn: document.getElementById("manageServersBtn"),
      serverModal: document.getElementById("serverModal"),
      closeServerModal: document.getElementById("closeServerModal"),
      modalServerList: document.getElementById("modalServerList"),
      newServerName: document.getElementById("newServerName"),
      cloneBossTemplate: document.getElementById("cloneBossTemplate"),
      newServerError: document.getElementById("newServerError"),
      confirmAddServerBtn: document.getElementById("confirmAddServerBtn"),
      modalAddServerSection: document.getElementById("modalAddServerSection")
    };

    const iconSvg = {
      skull: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 19v2m6-2v2M8 16h8M12 3c4.4 0 7 2.7 7 6.5 0 2.5-1.1 4.5-3 5.5v2H8v-2c-1.9-1-3-3-3-5.5C5 5.7 7.6 3 12 3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 10h.01M15 10h.01" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>',
      edit: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M13 7l4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
      check: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12l4 4L19 6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      bell: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      clock: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><path d="M12 7v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    };

    const statusCopy = {
      alive: {
        label: "Đang sống",
        metric: "Boss sẵn sàng",
        color: "var(--green)",
        soft: "var(--green-soft)"
      },
      respawning: {
        label: "Đang hồi sinh",
        metric: "Đang hồi sinh",
        color: "var(--cyan)",
        soft: "var(--cyan-soft)"
      },
      soon: {
        label: "Sắp hồi sinh",
        metric: "Cần chuẩn bị",
        color: "var(--amber)",
        soft: "var(--amber-soft)"
      }
    };

    const STORAGE_ROLE_KEY = "bossTimelinePro.role";
    // Admin identity is provided exclusively by Firebase Authentication.
    // Remove legacy plaintext credentials without touching any application data.
    try {
      localStorage.removeItem("bossTimelinePro.adminAccounts");
      localStorage.removeItem("bossTimelinePro.currentAdminName");
      if (localStorage.getItem(STORAGE_ROLE_KEY) === "admin") localStorage.setItem(STORAGE_ROLE_KEY, "member");
    } catch (e) {}

    let currentRole = "member";
    let currentAdminName = "";
    let currentUserIsAdmin = false;
    let currentUserIsSuperAdmin = false;
    let currentAdminAccessRef = null;
    const SUPER_ADMIN_NAME = "Firebase Admin";

    function isAdmin() {
      return currentRole === "admin" && currentUserIsAdmin && Boolean(firebaseAuth?.currentUser);
    }

    async function getFirebaseAdminAccess(user, forceRefresh = false) {
      if (!user || !firebaseDb) return { allowed: false, superAdmin: false, profile: null };
      const token = await user.getIdTokenResult(forceRefresh);
      if (token.claims.admin === true) {
        return { allowed: true, superAdmin: true, profile: { name: user.displayName || user.email || "Firebase Admin" } };
      }
      const snapshot = await firebaseDb.ref(`admin_access/${user.uid}`).once("value");
      const profile = snapshot.val();
      return { allowed: profile?.active === true, superAdmin: false, profile };
    }

    async function submitAdminAccessRequest(user) {
      if (!user || !firebaseDb) return;
      await firebaseDb.ref(`admin_requests/${user.uid}`).set({
        email: user.email || "",
        name: user.displayName || (user.email ? user.email.split("@")[0] : "Admin mới"),
        requestedAt: firebase.database.ServerValue.TIMESTAMP
      });
    }

    function stopWatchingCurrentAdminAccess() {
      if (!currentAdminAccessRef) return;
      try { currentAdminAccessRef.off(); } catch (error) {}
      currentAdminAccessRef = null;
    }

    function watchCurrentAdminAccess(user, superAdmin) {
      stopWatchingCurrentAdminAccess();
      if (!user || superAdmin || !firebaseDb) return;
      currentAdminAccessRef = firebaseDb.ref(`admin_access/${user.uid}`);
      currentAdminAccessRef.on("value", async (snapshot) => {
        const profile = snapshot.val();
        if (profile?.active === true || firebaseAuth?.currentUser?.uid !== user.uid) return;
        stopWatchingCurrentAdminAccess();
        currentUserIsAdmin = false;
        currentUserIsSuperAdmin = false;
        setRole("member");
        try { await firebaseAuth.signOut(); } catch (error) {}
        showToast("🔒 Quyền Admin của tài khoản này vừa bị thu hồi. Đã chuyển về chế độ Thành viên.");
      }, (error) => console.error("Admin access listener error:", error));
    }

    function setRole(newRole, adminName = null) {
      if (newRole !== "admin" && newRole !== "member") return;
      currentRole = newRole === "admin" && currentUserIsAdmin && firebaseAuth?.currentUser ? "admin" : "member";
      currentAdminName = currentRole === "admin"
        ? (adminName || firebaseAuth.currentUser.displayName || firebaseAuth.currentUser.email || "Admin")
        : "";
      try {
        localStorage.setItem(STORAGE_ROLE_KEY, currentRole);
      } catch (e) {}
      updateRoleUI();
      render();
      const isEn = currentLang === "en";
      if (isAdmin()) {
        showToast(isEn ? `👑 Logged in as ${currentAdminName}. Full boss control enabled.` : `👑 Đăng nhập với quyền Admin: ${currentAdminName}`);
      } else {
        showToast(isEn ? "👤 Member Mode: Read-only access." : "👤 Đã chuyển sang quyền Thành viên: Chế độ chỉ xem.");
      }
    }

    if (firebaseAuth) {
      firebaseAuth.onAuthStateChanged(async (user) => {
        if (user) {
          try {
            const access = await getFirebaseAdminAccess(user);
            currentUserIsAdmin = access.allowed;
            currentUserIsSuperAdmin = access.superAdmin;
          } catch (error) {
            currentUserIsAdmin = false;
            console.error("Firebase token verification error:", error);
          }
          if (!currentUserIsAdmin) {
            stopWatchingCurrentAdminAccess();
            setRole("member");
            return;
          }
          watchCurrentAdminAccess(user, currentUserIsSuperAdmin);
          setRole("admin", user.displayName || user.email || "Admin");
          closeAuthModal();
          // Writes that were queued while Auth restored can now be retried safely.
          if (typeof saveState === "function" && remoteStateReady) saveState();
          if (typeof pushAttendanceToFirebase === "function" && attendanceRemoteStateReady) {
            attendanceRemotePermissionDenied = false;
            pushAttendanceToFirebase();
          }
        } else {
          stopWatchingCurrentAdminAccess();
          currentUserIsAdmin = false;
          currentUserIsSuperAdmin = false;
          setRole("member");
        }
      });
    }

    function updateRoleUI() {
      document.querySelectorAll(".role-btn").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.role === currentRole);
      });
      if (elements.addBossBtn) {
        elements.addBossBtn.style.display = isAdmin() ? "inline-flex" : "none";
      }
      if (elements.clearHistoryBtn) {
        elements.clearHistoryBtn.style.display = isAdmin() ? "inline-flex" : "none";
      }
      if (elements.resetAllTimersBtn) {
        elements.resetAllTimersBtn.style.display = isAdmin() ? "inline-flex" : "none";
      }
      if (elements.addServerBtn) {
        elements.addServerBtn.style.display = isAdmin() ? "flex" : "none";
      }
      if (elements.manageServersBtn) {
        elements.manageServersBtn.style.display = isAdmin() ? "flex" : "none";
      }
      const svDivider = document.querySelector(".server-dropdown-divider");
      if (svDivider) {
        svDivider.style.display = isAdmin() ? "block" : "none";
      }
      if (elements.modalAddServerSection) {
        elements.modalAddServerSection.style.display = isAdmin() ? "block" : "none";
      }
      if (typeof renderServerListUI === "function") {
        renderServerListUI();
      }
      if (typeof updateAttendanceRoleUI === "function") {
        updateAttendanceRoleUI();
      }
    }

    /* ── Sound & Voice Notification Engine ── */
    const STORAGE_SOUND_KEY = "bossTimelinePro.soundEnabled";
    let isSoundEnabled = localStorage.getItem(STORAGE_SOUND_KEY) !== "false";
    let audioCtx = null;
    const activeSoundNotified = {};

    function getAudioContext() {
      if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) audioCtx = new AudioContextClass();
      }
      if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
      return audioCtx;
    }

    function playChime(type = "alert") {
      if (!isSoundEnabled) return;
      try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        const now = ctx.currentTime;
        if (type === "spawn") {
          osc.type = "sine";
          osc.frequency.setValueAtTime(880, now);
          osc.frequency.setValueAtTime(1760, now + 0.15);
          gain.gain.setValueAtTime(0.3, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
          osc.start(now); osc.stop(now + 0.45);
        } else if (type === "5m") {
          osc.type = "triangle";
          osc.frequency.setValueAtTime(659.25, now);
          osc.frequency.setValueAtTime(783.99, now + 0.12);
          gain.gain.setValueAtTime(0.3, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
          osc.start(now); osc.stop(now + 0.4);
        } else {
          osc.type = "sine";
          osc.frequency.setValueAtTime(523.25, now);
          osc.frequency.setValueAtTime(659.25, now + 0.12);
          gain.gain.setValueAtTime(0.25, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
          osc.start(now); osc.stop(now + 0.35);
        }
      } catch (e) { console.warn("AudioContext error:", e); }
    }

    // ── Web Speech API (giọng nữ trình duyệt) ──
    function speakText(text) {
      if (!isSoundEnabled) return;
      if (!("speechSynthesis" in window)) return;
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.25;
        utterance.volume = 1.0;
        const voices = window.speechSynthesis.getVoices();
        let femaleVoice = voices.find((v) => {
          const name = (v.name || "").toLowerCase();
          return (v.lang.startsWith("vi") || v.lang.startsWith("en")) &&
                 (name.includes("female") || name.includes("hoaimy") || name.includes("zira") ||
                  name.includes("google") || name.includes("aria") || name.includes("jenny") ||
                  name.includes("natural") || name.includes("nhien") || name.includes("linh"));
        });
        if (!femaleVoice) {
          femaleVoice = voices.find((v) => v.lang && (v.lang === "vi-VN" || v.lang.startsWith("vi"))) ||
                        voices.find((v) => (v.name || "").toLowerCase().includes("female"));
        }
        if (femaleVoice) utterance.voice = femaleVoice;
        window.speechSynthesis.speak(utterance);
      } catch (e) { console.warn("SpeechSynthesis error:", e); }
    }

    let STORAGE_DISCORD_KEY = `bossTimelinePro.discordConfig_${currentServerId}`;
    const defaultDiscordConfig = {
      enabled: false,
      webhookUrl: "",
      logoUrl: "",
      notify10m: true,
      notify5m: true,
      notify1m: true,
      notify0m: true,
      notifyKill: false,
      tagEveryone: true,
      notifyDailySchedule: true
    };

    function loadDiscordConfig() {
      try {
        const raw = localStorage.getItem(STORAGE_DISCORD_KEY);
        if (!raw) {
          // Fallback doc tu storage cu neu la server 1
          if (currentServerId === "s1") {
            const oldRaw = localStorage.getItem("bossTimelinePro.discordConfig");
            if (oldRaw) return { ...defaultDiscordConfig, ...JSON.parse(oldRaw) };
          }
          return { ...defaultDiscordConfig };
        }
        const parsed = JSON.parse(raw);
        return { ...defaultDiscordConfig, ...parsed };
      } catch (e) {
        return { ...defaultDiscordConfig };
      }
    }

    let discordConfig = loadDiscordConfig();
    let activeDiscordNotified = {};

    function saveDiscordConfigLocal(cfg) {
      discordConfig = { ...defaultDiscordConfig, ...cfg };
      try {
        localStorage.setItem(STORAGE_DISCORD_KEY, JSON.stringify(discordConfig));
      } catch (e) {}
      if (firebaseDb && isAdmin()) {
        try {
          const path = currentServerId === "s1"
            ? "boss_timeline_discord_config"
            : `boss_timeline_servers/${currentServerId}/discord_config`;
          firebaseDb.ref(path).set(discordConfig);
        } catch (e) {
          console.warn("Firebase save discord config error:", e);
        }
      }
      updateDiscordButtonUI();
    }

    function updateDiscordButtonUI() {
      const btn = document.getElementById("discordSettingsBtn");
      const text = document.getElementById("discordBtnText");
      if (!btn) return;
      const isConnected = Boolean(discordConfig.enabled && discordConfig.webhookUrl);
      btn.classList.toggle("connected", isConnected);
      if (text) {
        text.textContent = isConnected ? "Discord: Bat" : "Discord Bot";
      }
    }

    async function sendDiscordWebhook(payload, fileBlob = null, fileName = "image.png") {
      if (!discordConfig.enabled) {
        console.warn("[Discord Bot] Bỏ qua gửi: bot chưa bật trong cài đặt", discordConfig);
        return false;
      }
      const url = (discordConfig.webhookUrl || "").trim();

      // Neu co fileBlob thi gui truc tiep (FormData)
      if (fileBlob) {
        if (!url) return false;
        try {
          const fd = new FormData();
          fd.append("payload_json", JSON.stringify(payload));
          fd.append("file", fileBlob, fileName);
          const res = await fetch(url, { method: "POST", body: fd });
          return res.ok || res.status === 204;
        } catch (e) {
          console.warn("[Discord Bot] Webhook attachment fetch error:", e);
          return false;
        }
      }

      // 1. Uu tien gui qua Backend Serverless Proxy (/api/discord) de bao mat Webhook
      try {
        const proxyRes = await fetch("/api/discord", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ payload, webhookUrl: url })
        });
        if (proxyRes.ok || proxyRes.status === 204) {
          console.log("[Discord Bot] Gửi webhook thành công qua /api/discord!");
          return true;
        }
      } catch (proxyErr) {
        // Neu chay offline / localhost khong co serverless function thi fallback gui truc tiep
      }

      // 2. Fallback gui truc tiep bang client neu /api/discord khong kha dung
      if (!url || !/^https:\/\/(?:discord|discordapp)\.com\/api\/webhooks\//i.test(url)) {
        return false;
      }
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (res.status === 429) {
          console.warn("[Discord Bot] Bị Discord giới hạn tần suất (Rate limit 429)");
          return false;
        }

        const success = res.ok || res.status === 204;
        if (success) {
          console.log("[Discord Bot] Gửi webhook thành công (Direct)!", payload?.embeds?.[0]?.title || "");
        }
        return success;
      } catch (e) {
        console.warn("[Discord Bot] Webhook direct fetch error:", e);
        return false;
      }
    }

    async function sendDiscordBossAlert(boss, milestoneType, explicitEventTime = null) {
      if (!discordConfig.enabled || !discordConfig.webhookUrl) return;

      try {
        let eventKey = explicitEventTime;
        if (!eventKey) {
          if (boss.spawnMode === "fixed") {
            eventKey = boss.diedAt ? getNextFixedSpawnTime(boss, boss.diedAt) : getNextFixedSpawnTime(boss, getNow());
          } else {
            eventKey = boss.respawnsAt || boss.lastRespawnAt || getNow();
          }
        }
        if (!eventKey) return;

        const alertId = boss.id + "_" + milestoneType + "_" + eventKey;
        if (activeDiscordNotified[alertId]) return;
        activeDiscordNotified[alertId] = true;

        const safeKey = alertId.replace(/[.#$\[\]\/]/g, "_");
        const alertsPath = getFirebaseServerPaths(currentServerId).alertsPath;

        // Kiem tra xem alert nay da duoc gui thanh cong trong 5 phut qua chua (tranh 2 tab gui trung)
        if (firebaseDb) {
          try {
            const alertRef = firebaseDb.ref(alertsPath + "/" + safeKey);
            const snap = await alertRef.once("value");
            if (snap.exists() && (Date.now() - Number(snap.val()) < 5 * 60 * 1000)) {
              console.log("[Discord Bot] Alert nay da duoc tab khac gui:", alertId);
              return;
            }
          } catch (e) {
            console.warn("[Discord Bot] Firebase check error:", e);
          }
        }

        const baseUrl = (window.location && window.location.origin && window.location.origin.startsWith("http"))
          ? window.location.origin
          : "https://bosschill.vercel.app";
        const soonLogoUrl = `${baseUrl}/assets/boss-logo-soon.png`;
        const spawnedLogoUrl = `${baseUrl}/assets/boss-logo-spawned.png`;

        const spawnTimeStr = new Date(eventKey).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
        const remainMs = Number(eventKey) - Date.now();
        const remainMinutes = Math.max(1, Math.round(remainMs / 60000));

        let title = "";
        let color = 16007006; // Pink / Red (#f43f5e)
        let contentText = discordConfig.tagEveryone ? "@everyone" : "";
        let logoToUse = soonLogoUrl;

        if (milestoneType === "10m") {
          if (discordConfig.notify10m === false) return;
          title = `⚠️ [CẢNH BÁO] BOSS SẮP RA (còn ${remainMinutes} PHÚT)`;
          color = 16007006; // Pink / Red
          logoToUse = soonLogoUrl;
        } else if (milestoneType === "5m") {
          if (discordConfig.notify5m === false) return;
          title = `⚠️ [CẢNH BÁO] BOSS SẮP RA (còn ${remainMinutes} PHÚT)`;
          color = 16007006; // Pink / Red
          logoToUse = soonLogoUrl;
        } else if (milestoneType === "1m") {
          if (discordConfig.notify1m === false) return;
          title = `⚠️ [CẢNH BÁO] BOSS SẮP RA (còn 1 PHÚT)`;
          color = 16007006; // Pink / Red
          logoToUse = soonLogoUrl;
        } else if (milestoneType === "0m") {
          if (discordConfig.notify0m === false) return;
          title = "⚠️ [CẢNH BÁO] BOSS ĐÃ RA";
          color = 16107019; // Gold / Amber (#f59e0b)
          logoToUse = spawnedLogoUrl;
        } else {
          return;
        }

        const thumbnailUrl = (discordConfig.logoUrl && discordConfig.logoUrl.trim())
          ? discordConfig.logoUrl.trim()
          : logoToUse;

        let desc = `👑 **BOSS:** **${boss.name || "Boss"}** **(Lv:${boss.level || 80})**\n\n📍 **MAP:** **${boss.map || "Chưa rõ"}**\n\n🕒 **TIME:** **${spawnTimeStr}**`;
        if (boss.notes && boss.notes.trim()) {
          desc += `\n\n📝 **Ghi chú:** ${boss.notes.trim()}`;
        }

        const payload = {
          username: "Boss Tracker Alert",
          avatar_url: thumbnailUrl,
          content: contentText,
          embeds: [
            {
              title: title,
              description: desc,
              color: color,
              thumbnail: { url: thumbnailUrl },
              footer: { text: "Boss Timeline Pro • Live Alert System" },
              timestamp: new Date().toISOString()
            }
          ]
        };

        const sentOk = await sendDiscordWebhook(payload);
        // Chi danh dau da gui KHI Discord thuc su nhan thanh cong (tranh chan oan)
        if (sentOk && firebaseDb) {
          try {
            firebaseDb.ref(alertsPath + "/" + safeKey).set(Date.now()).catch(function() {});
          } catch (e) {}
        }
      } catch (err) {
        console.error("[Discord Bot] sendDiscordBossAlert error:", err);
      }
    }

    async function generateScheduleImageBlob(items, dateDisplay, now) {
      return new Promise((resolve) => {
        try {
          const rowHeight = 44;
          const headerHeight = 110;
          const tableHeadHeight = 42;
          const footerHeight = 40;
          const width = 1150;
          const height = headerHeight + tableHeadHeight + (items.length * rowHeight) + footerHeight;

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) return resolve(null);

          // Background
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, width, height);

          // Top Header Bar
          ctx.fillStyle = "#0c2461";
          ctx.font = "bold 22px -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif";
          ctx.fillText("BÁO CÁO LỊCH BOSS HÔM NAY (00:00 - 24:00)", 24, 45);

          ctx.fillStyle = "#64748b";
          ctx.font = "14px -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif";
          ctx.fillText(dateDisplay + " · 00:00 → 24:00 · UTC+7", 24, 75);

          // Total badge
          ctx.fillStyle = "#0c2461";
          ctx.font = "bold 16px -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif";
          const countStr = "Tổng số Boss: " + items.length;
          const countWidth = ctx.measureText(countStr).width;
          ctx.fillText(countStr, width - 24 - countWidth, 55);

          // Table Header
          const tableY = headerHeight;
          ctx.fillStyle = "#0c2461";
          ctx.fillRect(16, tableY, width - 32, tableHeadHeight);

          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 12.5px -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif";
          ctx.fillText("STT", 32, tableY + 26);
          ctx.fillText("GIỜ & NGÀY HỒI SINH", 85, tableY + 26);
          ctx.fillText("LEVEL", 285, tableY + 26);
          ctx.fillText("TÊN BOSS", 370, tableY + 26);
          ctx.fillText("CHU KỲ", 560, tableY + 26);
          ctx.fillText("TRẠNG THÁI", 750, tableY + 26);
          ctx.fillText("ĐỊA ĐIỂM", 895, tableY + 26);

          // Table Rows
          let y = tableY + tableHeadHeight;
          items.forEach((item, idx) => {
            const isEven = idx % 2 === 1;
            if (isEven) {
              ctx.fillStyle = "#f8fafc";
              ctx.fillRect(16, y, width - 32, rowHeight);
            }

            // Bottom border
            ctx.fillStyle = "#e2e8f0";
            ctx.fillRect(16, y + rowHeight - 1, width - 32, 1);

            // STT
            ctx.fillStyle = "#64748b";
            ctx.font = "600 13px Consolas, monospace";
            ctx.fillText(String(idx + 1), 36, y + 27);

            // Time & Date
            const timeObj = new Date(item.eventTime);
            const timeStr = timeObj.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
            ctx.fillStyle = "#0c2461";
            ctx.font = "bold 13px Consolas, monospace";
            ctx.fillText(timeStr, 85, y + 27);
            ctx.fillStyle = "#64748b";
            ctx.font = "12px -apple-system, BlinkMacSystemFont, sans-serif";
            ctx.fillText("(Hôm nay)", 165, y + 27);

            // Level Pill
            ctx.fillStyle = "#e0f2fe";
            ctx.beginPath();
            ctx.roundRect(280, y + 11, 58, 22, 4);
            ctx.fill();
            ctx.strokeStyle = "#bae6fd";
            ctx.stroke();
            ctx.fillStyle = "#0369a1";
            ctx.font = "bold 11px -apple-system, BlinkMacSystemFont, sans-serif";
            ctx.fillText("Lv. " + (item.boss.level || 80), 290, y + 26);

            // Boss Name
            const isFixed = item.boss.spawnMode === "fixed";
            ctx.fillStyle = isFixed ? "#d97706" : "#0c2461";
            ctx.font = "bold 13px -apple-system, BlinkMacSystemFont, sans-serif";
            const nameStr = (isFixed ? "⭐ " : "") + item.boss.name;
            ctx.fillText(nameStr, 370, y + 27);

            // Cycle
            ctx.fillStyle = "#475569";
            ctx.font = "500 12.5px -apple-system, BlinkMacSystemFont, sans-serif";
            const cycleStr = formatSpawnLabel(item.boss);
            ctx.fillText(cycleStr, 560, y + 27);

            // Status Badge
            const st = getBossStatus(item.boss, now);
            let badgeBg = "#dcfce7";
            let badgeBorder = "#bbf7d0";
            let badgeText = "#15803d";
            let badgeLabel = "• ĐANG SỐNG";
            if (st === "respawning") {
              badgeBg = "#fef2f2";
              badgeBorder = "#fecaca";
              badgeText = "#b91c1c";
              badgeLabel = "• ĐANG HỒI SINH";
            } else if (st === "soon") {
              badgeBg = "#fef3c7";
              badgeBorder = "#fde68a";
              badgeText = "#b45309";
              badgeLabel = "• SẮP HỒI SINH";
            }

            ctx.fillStyle = badgeBg;
            ctx.beginPath();
            ctx.roundRect(740, y + 10, 115, 24, 12);
            ctx.fill();
            ctx.strokeStyle = badgeBorder;
            ctx.stroke();
            ctx.fillStyle = badgeText;
            ctx.font = "bold 11px -apple-system, BlinkMacSystemFont, sans-serif";
            ctx.fillText(badgeLabel, 752, y + 26);

            // Map / Location
            ctx.fillStyle = "#334155";
            ctx.font = "500 12.5px -apple-system, BlinkMacSystemFont, sans-serif";
            ctx.fillText(item.boss.map || "—", 895, y + 27);

            y += rowHeight;
          });

          // Footer
          ctx.fillStyle = "#94a3b8";
          ctx.font = "11.5px -apple-system, BlinkMacSystemFont, sans-serif";
          ctx.fillText("Xuất tự động từ hệ thống Boss Timeline Pro", 24, height - 16);
          const rightFoot = "Cập nhật lúc: " + new Date(now).toLocaleTimeString("vi-VN");
          const rfWidth = ctx.measureText(rightFoot).width;
          ctx.fillText(rightFoot, width - 24 - rfWidth, height - 16);

          canvas.toBlob((blob) => resolve(blob), "image/png");
        } catch (err) {
          console.warn("Canvas generateScheduleImageBlob error:", err);
          resolve(null);
        }
      });
    }

    async function sendDiscordDailySchedule(forced = false) {
      if (!discordConfig.enabled || !discordConfig.webhookUrl) return false;
      if (!forced && discordConfig.notifyDailySchedule === false) return false;

      const now = getNow();
      const nowDate = new Date(now);
      const dateKey = `${nowDate.getFullYear()}-${String(nowDate.getMonth() + 1).padStart(2, "0")}-${String(nowDate.getDate()).padStart(2, "0")}`;
      const alertId = `daily_schedule_${dateKey}`;

      if (!forced) {
        if (activeDiscordNotified[alertId]) return false;
        activeDiscordNotified[alertId] = true;

        if (firebaseDb) {
          try {
            const alertsPath = getFirebaseServerPaths(currentServerId).alertsPath;
            const alertRef = firebaseDb.ref(alertsPath + "/" + alertId);
            const snap = await alertRef.once("value");
            if (snap.exists() && (Date.now() - Number(snap.val()) < 20 * 60 * 60 * 1000)) {
              return false;
            }
            await alertRef.set(Date.now());
          } catch (e) {
            console.warn("Firebase daily schedule dedup error:", e);
          }
        } else if (!isAdmin()) {
          return false;
        }
      }

      // Thu thập danh sách boss ngày hôm nay
      const items = [];
      state.bosses.forEach((boss) => {
        const eventTime = getBossScheduleEventTime(boss, now, "today");
        if (eventTime !== null) {
          items.push({ boss, eventTime });
        }
      });

      items.sort((a, b) => {
        if (a.eventTime && b.eventTime) return a.eventTime - b.eventTime;
        return a.boss.name.localeCompare(b.boss.name, "vi");
      });

      const dayNames = ["Chủ Nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
      const dayStr = dayNames[nowDate.getDay()];
      const dd = String(nowDate.getDate()).padStart(2, "0");
      const mm = String(nowDate.getMonth() + 1).padStart(2, "0");
      const yyyy = nowDate.getFullYear();
      const dateDisplay = `${dayStr}, ${dd}/${mm}/${yyyy}`;

      if (items.length === 0) {
        const emptyPayload = {
          username: "Boss Tracker Alert",
          avatar_url: "https://cdn-icons-png.flaticon.com/512/10329/10329997.png",
          embeds: [
            {
              title: `📅 BÁO CÁO LỊCH BOSS HÔM NAY (${dateDisplay})`,
              description: "Hôm nay không có boss cố định nào theo lịch được thiết lập.",
              color: 3447003,
              footer: { text: "Boss Timeline Pro • Daily Schedule" },
              timestamp: new Date().toISOString()
            }
          ]
        };
        return await sendDiscordWebhook(emptyPayload);
      }

      // Tạo file ảnh bảng lịch boss trực tiếp từ Canvas
      const imgBlob = await generateScheduleImageBlob(items, dateDisplay, now);

      const fileName = `lich_boss_${dateKey}.png`;
      const payload = {
        username: "Boss Tracker Alert",
        avatar_url: "https://cdn-icons-png.flaticon.com/512/10329/10329997.png",
        content: (forced || discordConfig.tagEveryone) ? "@everyone 📢 **BÁO CÁO LỊCH BOSS HÔM NAY (00:00 - 24:00)**" : "📢 **BÁO CÁO LỊCH BOSS HÔM NAY (00:00 - 24:00)**",
        embeds: [
          {
            title: `📅 BÁO CÁO LỊCH BOSS HÔM NAY — ${dateDisplay}`,
            description: `Tổng số: **${items.length} lượt boss** xuất hiện trong ngày hôm nay.\nXem chi tiết trong bảng tổng hợp đính kèm bên dưới 👇`,
            color: 3447003, // Blue #3498db
            image: imgBlob ? { url: `attachment://${fileName}` } : undefined,
            footer: { text: "Boss Timeline Pro • Tự động gửi lúc 00:00 hàng ngày" },
            timestamp: new Date().toISOString()
          }
        ]
      };

      if (imgBlob) {
        return await sendDiscordWebhook(payload, imgBlob, fileName);
      } else {
        return await sendDiscordWebhook(payload);
      }
    }

    function checkDailyScheduleAlert(now) {
      if (!discordConfig.enabled || !discordConfig.webhookUrl || discordConfig.notifyDailySchedule === false) return;
      const d = new Date(now);
      // Kích hoạt trong khung 00:00:00 - 00:05:00 hàng ngày
      if (d.getHours() === 0 && d.getMinutes() < 5) {
        sendDiscordDailySchedule(false);
      }
    }

    async function sendDiscordKillAlert(boss, diedAt, nextRespawn) {
      // Đã tắt hoàn toàn: chỉ gửi 2 loại thông báo (báo cáo 00h và đếm ngược giờ boss sắp ra)
      return;
    }

    function notifyBossAlert(boss, milestoneType, eventTime = null) {
      if (isSoundEnabled) {
        let toastMsg = "";
        if (milestoneType === "10m") {
          playChime("10m");
          toastMsg = `⏳ [10 PHÚT] ${boss.name} sắp xuất hiện tại ${boss.map}`;
        } else if (milestoneType === "5m") {
          playChime("5m");
          toastMsg = `⏳ [5 PHÚT] ${boss.name} sắp xuất hiện tại ${boss.map}`;
        } else if (milestoneType === "1m") {
          playChime("5m");
          toastMsg = `🚨 [1 PHÚT] ${boss.name} sắp xuất hiện tại ${boss.map}`;
        } else if (milestoneType === "0m") {
          playChime("spawn");
          toastMsg = `⚔️ [BOSS XUẤT HIỆN] ${boss.name} đã ra tại ${boss.map}`;
        }
        if (toastMsg) showToast(toastMsg);
        window.setTimeout(() => speakText("BOSS BOSS"), 300);
      }
      sendDiscordBossAlert(boss, milestoneType, eventTime);
    }

    function checkBossSoundAlerts(now) {
      if (!isSoundEnabled && !discordConfig.enabled) return;
      state.bosses.forEach((boss) => {
        let eventTime = null;
        let eventKey = "";

        if (boss.spawnMode === "fixed") {
          if (!boss.diedAt) return; // Chưa chết thì đang sống, không có đếm ngược
          eventTime = getNextFixedSpawnTime(boss, boss.diedAt);
          if (!eventTime) return;
          eventKey = boss.id + "_" + eventTime;
        } else {
          if (!boss.diedAt || !boss.respawnsAt) return;
          eventTime = boss.respawnsAt;
          eventKey = boss.id + "_" + boss.respawnsAt;
        }

        const remaining = eventTime - now;
        if (remaining <= 0) return; // Mốc 0m được autoResolveRespawns kích hoạt tự động

        // Mốc 10 phút (kích hoạt trong khoảng 7.5 phút - 10.5 phút)
        if (remaining <= 10.5 * 60 * 1000 && remaining > 7.5 * 60 * 1000) {
          if (!activeSoundNotified[eventKey + "_10m"]) {
            activeSoundNotified[eventKey + "_10m"] = true;
            notifyBossAlert(boss, "10m", eventTime);
          }
        }
        // Mốc 5 phút (kích hoạt trong khoảng 2.5 phút - 5.5 phút)
        else if (remaining <= 5.5 * 60 * 1000 && remaining > 2.5 * 60 * 1000) {
          if (!activeSoundNotified[eventKey + "_5m"]) {
            activeSoundNotified[eventKey + "_5m"] = true;
            notifyBossAlert(boss, "5m", eventTime);
          }
        }
        // Mốc 1 phút (kích hoạt trong khoảng 5 giây - 90 giây)
        else if (remaining <= 90 * 1000 && remaining > 5000) {
          if (!activeSoundNotified[eventKey + "_1m"]) {
            activeSoundNotified[eventKey + "_1m"] = true;
            notifyBossAlert(boss, "1m", eventTime);
          }
        }
      });
    }

    function updateSoundUI() {
      if (!elements.soundToggleBtn) return;
      const onIcon = elements.soundToggleBtn.querySelector(".sound-icon-on");
      const offIcon = elements.soundToggleBtn.querySelector(".sound-icon-off");
      if (isSoundEnabled) {
        elements.soundToggleBtn.classList.remove("muted");
        elements.soundToggleBtn.classList.add("active");
        if (onIcon) onIcon.style.display = "inline-block";
        if (offIcon) offIcon.style.display = "none";
        if (elements.soundToggleText) elements.soundToggleText.textContent = "Âm thanh: Bật";
      } else {
        elements.soundToggleBtn.classList.remove("active");
        elements.soundToggleBtn.classList.add("muted");
        if (onIcon) onIcon.style.display = "none";
        if (offIcon) offIcon.style.display = "inline-block";
        if (elements.soundToggleText) elements.soundToggleText.textContent = "Âm thanh: Tắt";
      }
    }

    function toggleSound() {
      isSoundEnabled = !isSoundEnabled;
      try { localStorage.setItem(STORAGE_SOUND_KEY, isSoundEnabled ? "true" : "false"); } catch (e) {}
      updateSoundUI();
      if (isSoundEnabled) {
        getAudioContext();
        speakText("Đã bật âm thanh thông báo.");
        showToast("🔊 Đã BẬT âm thanh và giọng đọc thông báo.");
      } else {
        if ("speechSynthesis" in window) window.speechSynthesis.cancel();
        showToast("🔇 Đã TẮT âm thanh thông báo.");
      }
    }

    function testVoiceAlert() {
      getAudioContext();
      if (!isSoundEnabled) {
        isSoundEnabled = true;
        try { localStorage.setItem(STORAGE_SOUND_KEY, "true"); } catch (e) {}
        updateSoundUI();
      }
      playChime("5m");
      window.setTimeout(() => speakText("BOSS BOSS"), 350);
      showToast("📢 Đang thử giọng nữ thông báo: BOSS BOSS");
    }

    function syncModalScrollLock() {
      const hasOpenModal = Boolean(document.querySelector(".modal-backdrop.open"));
      document.body.classList.toggle("modal-open", hasOpenModal);
    }

    function populateAdminNameDropdown() {
      const input = elements.adminEmailInput;
      if (input && firebaseAuth?.currentUser?.email) input.value = firebaseAuth.currentUser.email;
    }

    function showAuthStep(step) {
      const stepChoose = document.getElementById("authStepChoose");
      const stepLogin = document.getElementById("authStepAdminLogin");
      const stepReg = document.getElementById("authStepRegister");

      if (stepChoose) stepChoose.style.display = step === "choose" ? "" : "none";
      if (stepLogin) stepLogin.style.display = step === "admin" ? "" : "none";
      if (stepReg) stepReg.style.display = step === "register" ? "" : "none";

      if (elements.adminLoginError) elements.adminLoginError.style.display = "none";
      if (elements.adminPasswordInput) {
        elements.adminPasswordInput.value = "";
        elements.adminPasswordInput.type = "password";
      }
      if (elements.togglePasswordVisBtn) {
        elements.togglePasswordVisBtn.setAttribute("aria-label", "Hiện mật khẩu");
      }
      if (step === "admin") {
        populateAdminNameDropdown();
      }
    }

    function openAuthModal(step = "choose") {
      showAuthStep(step);
      elements.authModal.classList.add("open");
      syncModalScrollLock();
      window.setTimeout(() => {
        if (step === "admin") {
          elements.adminPasswordInput.focus();
          return;
        }
        elements.chooseAdminBtn.focus();
      }, 40);
    }

    function closeAuthModal() {
      elements.authModal.classList.remove("open");
      syncModalScrollLock();
    }

    async function enterMemberMode() {
      if (firebaseAuth?.currentUser) {
        try {
          await firebaseAuth.signOut();
        } catch (error) {
          console.error("Firebase sign-out error:", error);
        }
      }
      setRole("member");
      closeAuthModal();
    }

    function requestAdminLogin() {
      if (firebaseAuth?.currentUser) {
        if (currentUserIsAdmin) {
          if (currentUserIsSuperAdmin) {
            openAdminAccModal();
            return;
          }
          setRole("admin", firebaseAuth.currentUser.displayName || firebaseAuth.currentUser.email || "Admin");
        } else {
          showToast("Tài khoản Firebase này chưa được cấp quyền Admin.");
        }
        return;
      }
      openAuthModal("admin");
    }

    let state = loadState();
    let bossSyncBase = loadBossSyncBase();
    let bossDeferredRemoteData = null;
    let bossSyncGeneration = 0;
    let bossFirebaseSeedAttempted = false;
    let activeFilter = "all";
    let activeLevelFilter = "all";
    const STORAGE_VIEW_KEY = "bossTimelinePro.viewMode";
    let activeView = localStorage.getItem(STORAGE_VIEW_KEY) === "compact" ? "compact" : "grid";

    function setViewMode(mode) {
      if (mode !== "grid" && mode !== "compact") return;
      activeView = mode;
      try {
        localStorage.setItem(STORAGE_VIEW_KEY, mode);
      } catch (e) {}
      updateViewModeUI();
      render();
    }

    function updateViewModeUI() {
      document.querySelectorAll(".view-mode-btn").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.view === activeView);
      });
    }

    let editingBossId = null;
    let toastTimer = null;

    function createDefaultState() {
      const now = Date.now();
      const bosses = [
        {
          id: makeId(),
          name: "VIOLET",
          map: "Hồ bán nguyệt",
          level: 80,
          respawnMinutes: 30,
          diedAt: null,
          respawnsAt: null,
          lastRespawnAt: now - 15 * 60 * 1000,
          avatar: "void",
          notes: "Khu vực hồ bán nguyệt, ưu tiên săn đồ hiếm."
        },
        {
          id: makeId(),
          name: "VENATUS",
          map: "Khu vực ô nhiễm · Kanturu Desert",
          level: 85,
          respawnMinutes: 45,
          diedAt: now - 35 * 60 * 1000,
          respawnsAt: now + 10 * 60 * 1000,
          lastRespawnAt: null,
          avatar: "ember",
          notes: "Boss khu vực sa mạc Kanturu, cần tập trung trước 5 phút."
        },
        {
          id: makeId(),
          name: "Rồng Lửa Ignar",
          map: "Hỏa Vực tầng 3",
          level: 90,
          respawnMinutes: 30,
          diedAt: now - 12 * 60 * 1000,
          respawnsAt: now + 18 * 60 * 1000,
          lastRespawnAt: null,
          avatar: "ember",
          notes: "Canh cổng phía Đông, ưu tiên team damage chính."
        },
        {
          id: makeId(),
          name: "Nữ Hoàng Băng",
          map: "Băng Điện",
          level: 75,
          respawnMinutes: 45,
          diedAt: now - 41 * 60 * 1000,
          respawnsAt: now + 4 * 60 * 1000,
          lastRespawnAt: null,
          avatar: "frost",
          notes: "Sắp hồi sinh, cần tập trung trước 2 phút."
        },
        {
          id: makeId(),
          name: "Thạch Vệ Cổ",
          map: "Cổ Thành",
          level: 60,
          respawnMinutes: 20,
          diedAt: null,
          respawnsAt: null,
          lastRespawnAt: now - 38 * 60 * 1000,
          avatar: "stone",
          notes: "Boss phụ, respawn nhanh."
        },
        {
          id: makeId(),
          name: "Lôi Chủ Varan",
          map: "Đỉnh Sấm",
          level: 95,
          respawnMinutes: 90,
          diedAt: now - 22 * 60 * 1000,
          respawnsAt: now + 68 * 60 * 1000,
          lastRespawnAt: null,
          avatar: "storm",
          notes: "Cần ghi chú kênh nếu đổi server."
        },
        {
          id: makeId(),
          name: "Rồng Vàng Kanturu",
          map: "Cổng Vàng Kanturu",
          level: 95,
          spawnMode: "fixed",
          respawnMinutes: 30,
          fixedSchedules: [
            { day: 2, time: "08:00" },
            { day: 4, time: "22:00" }
          ],
          weekDays: [2, 4],
          fixedTime: "08:00",
          diedAt: null,
          respawnsAt: null,
          lastRespawnAt: null,
          avatar: "storm",
          notes: "Boss cố định 2 lần/tuần: Thứ 3 (08:00) và Thứ 5 (22:00)."
        }
      ];

      return {
        bosses,
        history: [
          historyItem("death", bosses[1], now - 41 * 60 * 1000),
          historyItem("death", bosses[4], now - 22 * 60 * 1000),
          historyItem("death", bosses[0], now - 12 * 60 * 1000),
          historyItem("respawn", bosses[3], now - 38 * 60 * 1000),
          historyItem("respawn", bosses[2], now - 2 * 60 * 60 * 1000)
        ]
      };
    }

    function loadState() {
      try {
        let raw = localStorage.getItem(STORAGE_KEY);
        // Fallback backward-compat neu la server s1 va chua co key s1 moi
        if (!raw && currentServerId === "s1") {
          raw = localStorage.getItem("bossTimelinePro.v1");
          if (raw) {
            try { localStorage.setItem(STORAGE_KEY, raw); } catch (e) {}
          }
        }
        if (!raw) return createDefaultState();
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed.bosses)) return createDefaultState();
        return {
          bosses: parsed.bosses.map(normalizeBoss),
          history: Array.isArray(parsed.history) ? parsed.history.slice(0, 30) : []
        };
      } catch (error) {
        console.warn("Không thể đọc localStorage, dùng dữ liệu mẫu.", error);
        return createDefaultState();
      }
    }

    const broadcastChannel = typeof BroadcastChannel !== "undefined"
      ? new BroadcastChannel("boss_timeline_local_channel")
      : null;

    if (broadcastChannel) {
      broadcastChannel.onmessage = (event) => {
        if (!event.data || !Array.isArray(event.data.bosses)) return;
        if (event.data._clientId === CLIENT_ID) return;
        if (event.data.serverId && event.data.serverId !== currentServerId) return;
        applyRemoteState(event.data.bosses, event.data.history || [], getNow());
        showToast("🔄 Đã đồng bộ từ cửa sổ/tab khác trên máy.");
      };
    }

    function saveStateLocal(broadcast = true) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        if (bossSyncBase) localStorage.setItem(STORAGE_KEY + ".syncBase", JSON.stringify(bossSyncBase));
        if (broadcast && broadcastChannel) {
          broadcastChannel.postMessage({
            _clientId: CLIENT_ID,
            serverId: currentServerId,
            bosses: state.bosses.map(normalizeBoss),
            history: state.history.slice(0, 30)
          });
        }
      } catch (error) {
        console.warn("Không thể ghi localStorage.", error);
      }
    }


    var serverTimeOffset = 0;

    function updateServerTimeOffset(serverIsoString) {
      if (!serverIsoString) return;
      const serverMs = new Date(serverIsoString).getTime();
      if (!isNaN(serverMs) && serverMs > 0) {
        const ageMs = Date.now() - serverMs;
        // Chi cap nhat offset neu timestamp Firebase moi (trong vong 5 phut)
        // Neu data Firebase cu hon 5 phut -> reset offset ve 0, dung gio may
        if (Math.abs(ageMs) < 5 * 60 * 1000) {
          serverTimeOffset = serverMs - Date.now();
        } else {
          serverTimeOffset = 0;
        }
      }
    }

    function getNow() {
      return Date.now() + serverTimeOffset;
    }

    let lastLocalEditTime = 0;

    function loadBossSyncBase() {
      try {
        const cached = JSON.parse(localStorage.getItem(STORAGE_KEY + ".syncBase"));
        if (cached && Array.isArray(cached.bosses)) return cached;
      } catch (e) {}
      return cloneRealtimeValue(state);
    }

    function getBossRemoteData(value) {
      return {
        bosses: (value.bosses_map && typeof value.bosses_map === "object"
          ? Object.values(value.bosses_map) : (value.data?.bosses || [])).map(normalizeBoss),
        history: Array.isArray(value.data?.history) ? value.data.history.slice(0, 30) : []
      };
    }

    function mergeBossStateChanges(base, local, remote) {
      const merged = mergeRealtimeChanges(base, local, remote);
      const timerFields = ["diedAt", "respawnsAt", "lastRespawnAt"];
      const before = new Map((base?.bosses || []).map(boss => [boss.id, boss]));
      for (const boss of local.bosses) {
        const previous = before.get(boss.id);
        const target = merged.bosses.find(item => item.id === boss.id);
        if (previous && target && timerFields.some(key => previous[key] !== boss[key])) {
          // A death/respawn is one state transition, not three independent field edits.
          timerFields.forEach(key => { target[key] = boss[key] ?? null; });
        }
      }
      return merged;
    }

    async function saveState(seedOnly = false) {
      // Luon giu local cache de app van mo duoc khi mat mang.
      lastLocalEditTime = Date.now();
      saveStateLocal(true);
      if (!isAdmin() || !REALTIME_ENABLED || !stateDbRef) return;

      if (remoteSaveInFlight || !remoteStateReady) {
        pendingRemoteSave = true;
        return;
      }

      const local = { bosses: state.bosses.map(normalizeBoss), history: cloneRealtimeValue(state.history.slice(0, 30)) };
      const base = cloneRealtimeValue(bossSyncBase);
      if (!seedOnly && JSON.stringify(base) === JSON.stringify(local)) return;
      const saveRef = stateDbRef;
      const generation = bossSyncGeneration;
      remoteSaveInFlight = true;
      pendingRemoteSave = false;
      bossDeferredRemoteData = null;
      let saved = false;
      try {
        const result = await saveRef.transaction(current => {
          if (seedOnly && current) return;
          const merged = current ? mergeBossStateChanges(base, local, getBossRemoteData(current)) : cloneRealtimeValue(local);
          merged.history = merged.history.sort((a, b) => b.time - a.time).slice(0, 30);
          return {
            ...current,
            data: { ...current?.data, _clientId: CLIENT_ID, bosses: merged.bosses, history: merged.history },
            bosses_map: Object.fromEntries(merged.bosses.map(boss => [boss.id, boss])),
            last_editor: CLIENT_ID,
            updated_at: new Date(getNow()).toISOString(),
            version: (Number(current?.version) || 0) + 1
          };
        }, undefined, false);
        if (generation !== bossSyncGeneration) return;
        const confirmed = result.snapshot.val();
        if (confirmed) {
          const remote = getBossRemoteData(confirmed);
          applyRemoteState(remote.bosses, remote.history, confirmed.updated_at, CLIENT_ID, local);
          if (bossDeferredRemoteData && Number(bossDeferredRemoteData.version) > Number(confirmed.version)) {
            const deferred = getBossRemoteData(bossDeferredRemoteData);
            applyRemoteState(deferred.bosses, deferred.history, bossDeferredRemoteData.updated_at);
          }
        }
        saved = true;
      } catch (error) {
        console.error("Firebase save error:", error);
        setRealtimeStatus("offline", "Không thể đồng bộ — đang dùng dữ liệu cục bộ");
      } finally {
        if (generation === bossSyncGeneration) {
          remoteSaveInFlight = false;
          bossDeferredRemoteData = null;
          const savePending = pendingRemoteSave;
          pendingRemoteSave = false;
          if (saved && savePending) saveState();
        }
      }
    }

    function setRealtimeStatus(type, title) {
      const el = document.getElementById("realtimeStatus");
      if (!el) return;
      el.dataset.status = type;
      el.title = title || "";
      el.querySelector(".realtime-status-text").textContent =
        type === "online" ? "Realtime" : type === "connecting" ? "Đang kết nối…" : "Offline";
    }

    function applyRemoteState(incomingBosses, incomingHistory, updatedAt, senderId, localBase = bossSyncBase) {
      if (!Array.isArray(incomingBosses)) return;

      if (updatedAt) {
        updateServerTimeOffset(updatedAt);
        const remoteTime = new Date(updatedAt).getTime();
        lastRemoteUpdatedAt = remoteTime || getNow();
      }

      const remote = {
        bosses: incomingBosses.map(normalizeBoss),
        history: Array.isArray(incomingHistory) ? incomingHistory.slice(0, 30) : []
      };
      state = isAdmin() ? mergeBossStateChanges(localBase || state, state, remote) : remote;
      bossSyncBase = cloneRealtimeValue(remote);
      lastRenderedGridKey = ""; // Bat buoc render lai giao dien moi
      saveStateLocal(false); // Luu vao cache nhung KHONG broadcast nguoc lai de triet tieu loop
      render();
    }

    let activeStateRef = null;
    let activeDiscordConfigRef = null;
    let connectedRefBound = false;

    function initRealtimeSync() {
      if (!REALTIME_ENABLED || !stateDbRef) {
        setRealtimeStatus("offline", "Chưa cấu hình Firebase — kiểm tra firebase-config.js");
        return;
      }

      if (activeStateRef) {
        try { activeStateRef.off(); } catch (e) {}
        activeStateRef = null;
      }
      if (activeDiscordConfigRef) {
        try { activeDiscordConfigRef.off(); } catch (e) {}
        activeDiscordConfigRef = null;
      }

      setRealtimeStatus("connecting", "Đang kết nối Google Firebase Realtime…");

      // Giam sat ket noi Firebase connection state (chi can gan 1 lan)
      if (!connectedRefBound && firebaseDb) {
        firebaseDb.ref(".info/connected").on("value", (snap) => {
          if (snap.val() === true) {
            setRealtimeStatus("online", "Đã kết nối Firebase Realtime — đồng bộ tức thì cho cả team");
          } else {
            setRealtimeStatus("connecting", "Đang kết nối lại Firebase Realtime…");
          }
        });
        connectedRefBound = true;
      }

      // Lang nghe thay doi truc tiep tu Firebase Realtime Database cua server hien tai
      activeStateRef = stateDbRef;
      const subscribedRef = stateDbRef;
      const generation = bossSyncGeneration;
      activeStateRef.on("value", (snapshot) => {
        if (generation !== bossSyncGeneration || subscribedRef !== activeStateRef) return;
        const val = snapshot.val();
        remoteStateReady = true;
        if (remoteSaveInFlight) {
          bossDeferredRemoteData = cloneRealtimeValue(val);
          return;
        }
        if (val) {
          const senderId = val.last_editor || val.data?._clientId;
          const remote = getBossRemoteData(val);
          applyRemoteState(remote.bosses, remote.history, val.updated_at, senderId);
          if (senderId !== CLIENT_ID) showToast("🔄 Team vừa cập nhật Boss Timeline.");
          if (isAdmin()) saveState();
        } else if (!val) {
          if (isAdmin() && !bossFirebaseSeedAttempted) {
            bossFirebaseSeedAttempted = true;
            saveState(true);
          }
        }
        remoteStateReady = true;
      }, (error) => {
        console.error("Firebase Realtime listener error:", error);
        setRealtimeStatus("offline", "Lỗi kết nối Firebase — đang dùng localStorage");
      });

      // Lang nghe cau hinh Discord Webhook tu Firebase cua server hien tai
      if (discordConfigDbRef) {
        activeDiscordConfigRef = discordConfigDbRef;
        activeDiscordConfigRef.on("value", (snapshot) => {
          const remoteCfg = snapshot.val();
          if (remoteCfg && typeof remoteCfg === "object" && remoteCfg.webhookUrl) {
            discordConfig = { ...defaultDiscordConfig, ...remoteCfg };
            try {
              localStorage.setItem(STORAGE_DISCORD_KEY, JSON.stringify(discordConfig));
            } catch (e) {}
            updateDiscordButtonUI();
          }
        });
      }
    }


    function normalizeBoss(boss) {
      const isFixed = boss.spawnMode === "fixed";
      let fixedSchedules = Array.isArray(boss.fixedSchedules) ? boss.fixedSchedules : [];

      if (isFixed) {
        if (!fixedSchedules.length && (boss.fixedTime || (Array.isArray(boss.weekDays) && boss.weekDays.length))) {
          const time = typeof boss.fixedTime === "string" && /^\d{2}:\d{2}$/.test(boss.fixedTime) ? boss.fixedTime : "18:00";
          if (Array.isArray(boss.weekDays) && boss.weekDays.length) {
            fixedSchedules = boss.weekDays.map(d => ({ day: Number(d), time }));
          } else {
            fixedSchedules = [{ day: "all", time }];
          }
        }

        fixedSchedules = fixedSchedules.map(s => {
          let time = typeof s.time === "string" && /^\d{2}:\d{2}$/.test(s.time) ? s.time : "18:00";
          let [hStr, mStr] = time.split(":");
          let hNum = Number(hStr);
          let mNum = Number(mStr);
          if (hNum >= 24) hStr = String(hNum === 24 ? 0 : Math.min(23, hNum)).padStart(2, "0");
          if (mNum > 59) mStr = "59";
          time = `${hStr}:${mStr}`;
          const day = s.day === "all" ? "all" : (Number(s.day) >= 0 && Number(s.day) <= 6 ? Number(s.day) : "all");
          return { day, time };
        });

        if (!fixedSchedules.length) {
          fixedSchedules = [{ day: "all", time: "18:00" }];
        }
      } else {
        fixedSchedules = [];
      }

      let weekDays = [];
      if (isFixed && fixedSchedules.length) {
        if (fixedSchedules.some(s => s.day === "all")) {
          weekDays = [0, 1, 2, 3, 4, 5, 6];
        } else {
          weekDays = Array.from(new Set(fixedSchedules.map(s => Number(s.day)).filter(d => !isNaN(d) && d >= 0 && d <= 6)));
        }
      }

      const primaryFixedTime = fixedSchedules[0]?.time || boss.fixedTime || "18:00";

      let diedAtVal = typeof boss.diedAt === "number" && boss.diedAt > 0 ? boss.diedAt : null;
      let respawnsAtVal = typeof boss.respawnsAt === "number" && boss.respawnsAt > 0 ? boss.respawnsAt : null;

      return {
        id: boss.id || makeId(),
        name: String(boss.name || "Boss mới").slice(0, 44),
        map: String(boss.map || "Chưa đặt map").slice(0, 44),
        level: clamp(Number(boss.level) || 80, 1, 999),
        spawnMode: isFixed ? "fixed" : "interval",
        respawnMinutes: clamp(Number(boss.respawnMinutes) || 30, 1, 10080),
        fixedTime: primaryFixedTime,
        fixedSchedules: fixedSchedules,
        weekDays: weekDays,
        diedAt: diedAtVal,
        respawnsAt: respawnsAtVal,
        lastRespawnAt: Number(boss.lastRespawnAt) || null,
        avatar: ["ember", "frost", "void", "stone", "storm"].includes(boss.avatar) ? boss.avatar : "ember",
        notes: String(boss.notes || "").slice(0, 160)
      };
    }

    function getNextFixedSpawnTime(boss, now = getNow()) {
      if (boss.spawnMode !== "fixed") return null;
      const schedules = Array.isArray(boss.fixedSchedules) && boss.fixedSchedules.length > 0
        ? boss.fixedSchedules
        : [{ day: "all", time: boss.fixedTime || "18:00" }];

      const candidates = [];
      const nowDate = new Date(now);

      schedules.forEach(slot => {
        const parts = (slot.time || "18:00").split(":").map(Number);
        if (parts.length < 2 || isNaN(parts[0]) || isNaN(parts[1])) return;
        const [h, m] = parts;

        const targetDays = slot.day === "all" ? [0, 1, 2, 3, 4, 5, 6] : [Number(slot.day)];

        for (let dayOffset = 0; dayOffset < 14; dayOffset++) {
          const d = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate() + dayOffset, h, m, 0, 0);
          if (targetDays.includes(d.getDay()) && d.getTime() > now) {
            candidates.push(d.getTime());
            break;
          }
        }
      });

      if (!candidates.length) return null;
      return Math.min(...candidates);
    }

    function getPreviousFixedSpawnTime(boss, now = getNow()) {
      if (boss.spawnMode !== "fixed") return null;
      const schedules = Array.isArray(boss.fixedSchedules) && boss.fixedSchedules.length > 0
        ? boss.fixedSchedules
        : [{ day: "all", time: boss.fixedTime || "18:00" }];

      const candidates = [];
      const nowDate = new Date(now);

      schedules.forEach(slot => {
        const parts = (slot.time || "18:00").split(":").map(Number);
        if (parts.length < 2 || isNaN(parts[0]) || isNaN(parts[1])) return;
        const [h, m] = parts;

        const targetDays = slot.day === "all" ? [0, 1, 2, 3, 4, 5, 6] : [Number(slot.day)];

        for (let dayOffset = 0; dayOffset < 14; dayOffset++) {
          const d = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate() - dayOffset, h, m, 0, 0);
          if (targetDays.includes(d.getDay()) && d.getTime() <= now) {
            candidates.push(d.getTime());
            break;
          }
        }
      });

      if (!candidates.length) return null;
      return Math.max(...candidates);
    }

    function makeId() {
      return "boss_" + Math.random().toString(36).slice(2, 9) + getNow().toString(36).slice(-5);
    }

    function clamp(value, min, max) {
      return Math.min(max, Math.max(min, value));
    }

    function escapeHtml(value) {
      return String(value ?? "").replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&#039;"
      }[char]));
    }

    function getBossStatus(boss, now = getNow()) {
      const nextTime = getNextBossEventTime(boss, now);
      if (!nextTime || now >= nextTime) return "alive";
      const remaining = nextTime - now;
      if (remaining <= SOON_LIMIT_MS) return "soon";
      return "respawning";
    }

    function getProgress(boss, now = getNow()) {
      const nextTime = getNextBossEventTime(boss, now);
      if (!nextTime || now >= nextTime) return 100;
      const intervalMs = boss.spawnMode === "fixed" ? 24 * 60 * 60 * 1000 : (boss.respawnMinutes || 30) * 60 * 1000;
      const remaining = nextTime - now;
      const elapsed = Math.max(0, intervalMs - remaining);
      return clamp(Math.round((elapsed / intervalMs) * 100), 0, 100);
    }

    function getRemaining(boss, now = getNow()) {
      const nextTime = getNextBossEventTime(boss, now);
      if (!nextTime || now >= nextTime) return 0;
      return Math.max(0, nextTime - now);
    }

    function getNextBossEventTime(boss, now = getNow()) {
      if (boss.spawnMode === "fixed") {
        // Chưa ghi nhận chết lần nào → boss đang SỐNG (READY)
        if (!boss.diedAt) return null;

        const prevSlot = getPreviousFixedSpawnTime(boss, now);

        // Nếu boss chết TRƯỚC mốc hồi sinh cố định gần nhất → mốc đó đã qua → boss đang SỐNG
        if (prevSlot && boss.diedAt < prevSlot) {
          return null;
        }

        // Boss chết SAU hoặc ĐÚNG mốc hồi sinh gần nhất → đang đếm ngược đến mốc kế tiếp
        return getNextFixedSpawnTime(boss, boss.diedAt);
      }

      // Boss theo chu kỳ: chỉ countdown nếu có diedAt và respawnsAt trong tương lai
      if (boss.diedAt && boss.respawnsAt && boss.respawnsAt > now) {
        return boss.respawnsAt;
      }
      return null;
    }

    function formatSpawnLabel(boss) {
      if (boss.spawnMode === "fixed") {
        const schedules = Array.isArray(boss.fixedSchedules) && boss.fixedSchedules.length > 0
          ? boss.fixedSchedules
          : [{ day: "all", time: boss.fixedTime || "18:00" }];

        const isEn = currentLang === "en";
        const dayNames = isEn
          ? { "all": "Daily", 0: "Sun", 1: "Mon", 2: "Tue", 3: "Wed", 4: "Thu", 5: "Fri", 6: "Sat" }
          : { "all": "Mỗi ngày", 0: "CN", 1: "T2", 2: "T3", 3: "T4", 4: "T5", 5: "T6", 6: "T7" };

        if (schedules.length === 1) {
          const s = schedules[0];
          return isEn ? `Fixed ${dayNames[s.day]} ${s.time}` : `Cố định ${dayNames[s.day]} ${s.time}`;
        }

        const formattedSlots = schedules.map(s => `${dayNames[s.day]} ${s.time}`).join(", ");
        return isEn ? `Fixed (${formattedSlots})` : `Cố định (${formattedSlots})`;
      }
      return formatRespawnMinutes(boss.respawnMinutes);
    }

    function formatCountdown(ms) {
      const totalSeconds = Math.max(0, Math.floor(ms / 1000));
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      const pad = (value) => String(value).padStart(2, "0");
      if (days > 0) {
        return `${days}d ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
      }
      return hours > 0 ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}` : `${pad(minutes)}:${pad(seconds)}`;
    }

    function formatClock(time) {
      return new Date(time).toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });
    }

    function formatShortDate(time) {
      if (!time) return currentLang === "en" ? "None" : "Chưa có";
      return new Date(time).toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      });
    }

    function formatTimeOnly(time) {
      if (!time) return "--:--";
      return new Date(time).toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit"
      });
    }

    function formatRespawnMinutes(minutes) {
      const isEn = currentLang === "en";
      if (minutes >= 1440 && minutes % 1440 === 0) {
        const days = minutes / 1440;
        return isEn ? `${days} ${days > 1 ? 'days' : 'day'} (${minutes}m)` : `${days} ngày (${minutes}m)`;
      }
      if (minutes >= 1440) {
        const days = (minutes / 1440).toFixed(1).replace(".0", "");
        const hours = Math.floor((minutes % 1440) / 60);
        return isEn ? `${days} days${hours > 0 ? ' ' + hours + 'h' : ''} (${minutes}m)` : `${days} ngày${hours > 0 ? ' ' + hours + 'h' : ''} (${minutes}m)`;
      }
      if (minutes >= 60) {
        const hours = Math.floor(minutes / 60);
        const rest = minutes % 60;
        return rest ? `${hours}h ${rest}m` : `${hours}h`;
      }
      return isEn ? `${minutes} mins` : `${minutes} phút`;
    }

    function formatSmartRespawnDate(time, now = getNow()) {
      if (!time) return "--:--";
      const target = new Date(time);
      const nowDate = new Date(now);

      const targetDateOnly = new Date(target.getFullYear(), target.getMonth(), target.getDate());
      const nowDateOnly = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate());

      const diffDays = Math.round((targetDateOnly - nowDateOnly) / (24 * 60 * 60 * 1000));
      const timeStr = target.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

      const isEn = currentLang === "en";
      const daysOfWeek = isEn
        ? ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        : ["Chủ Nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
      const dd = String(target.getDate()).padStart(2, "0");
      const mm = String(target.getMonth() + 1).padStart(2, "0");

      if (diffDays === 0) {
        const tag = isEn ? "(Today)" : "(Hôm nay)";
        return `<strong style="color:var(--cyan);">${timeStr}</strong> <span style="font-size:11px;color:var(--text-2);">${tag}</span>`;
      } else if (diffDays === 1) {
        const tag = isEn ? `(Tomorrow ${dd}/${mm})` : `(Ngày mai ${dd}/${mm})`;
        return `<strong style="color:var(--amber);">${timeStr}</strong> <span style="font-size:11.5px;color:var(--amber); font-weight:600;">${tag}</span>`;
      } else if (diffDays === 2) {
        const tag = isEn ? `(In 2 Days ${dd}/${mm})` : `(Ngày kia ${dd}/${mm})`;
        return `<strong style="color:var(--smart-date-future-color);">${timeStr}</strong> <span style="font-size:11.5px;color:var(--smart-date-future-color); font-weight:600;">${tag}</span>`;
      } else {
        return `<strong>${timeStr}</strong> <span style="font-size:11.5px;color:var(--muted);">(${daysOfWeek[target.getDay()]} ${dd}/${mm})</span>`;
      }
    }



    function historyItem(type, boss, time = getNow(), source = null) {
      return {
        id: "history_" + Math.random().toString(36).slice(2, 9),
        type,
        bossId: boss.id,
        bossName: boss.name,
        map: boss.map,
        time,
        source,
        adminName: isAdmin() ? currentAdminName : null
      };
    }

    function pushHistory(type, boss, time = getNow(), source = null) {
      state.history.unshift(historyItem(type, boss, time, source));
      state.history = state.history.slice(0, 30);
    }

    // Một luồng hồi sinh dùng chung cho cả Admin và countdown tự động.
    // Không chặn Admin hồi sinh theo countdown: Admin có thể chủ động xác nhận
    // theo giờ thực tế đã được note.
    function performRespawn(boss, time = getNow(), source = "manual") {
      if (!boss) return false;

      boss.lastRespawnAt = time;
      boss.diedAt = null;
      boss.respawnsAt = null;
      pushHistory("respawn", boss, time, source);
      return true;
    }

    function autoResolveRespawns() {
      const now = getNow();
      let changed = false;

      state.bosses.forEach((boss) => {
        if (boss.spawnMode === "fixed") {
          if (boss.diedAt) {
            const nextTime = getNextFixedSpawnTime(boss, boss.diedAt);
            if (nextTime && nextTime <= now) {
              const targetKey = boss.id + "_" + nextTime;
              if (!activeSoundNotified[targetKey + "_0m"]) {
                activeSoundNotified[targetKey + "_0m"] = true;
                notifyBossAlert(boss, "0m", nextTime);
              }
              performRespawn(boss, nextTime, "automatic");
              changed = true;
            }
          }
        } else {
          if (boss.diedAt && boss.respawnsAt && boss.respawnsAt <= now) {
            const cycleKey = boss.id + "_" + boss.respawnsAt;
            const respawnTime = boss.respawnsAt;
            if (!activeSoundNotified[cycleKey + "_0m"]) {
              activeSoundNotified[cycleKey + "_0m"] = true;
              notifyBossAlert(boss, "0m", respawnTime);
            }
            performRespawn(boss, boss.respawnsAt, "automatic");
            changed = true;
          }
        }
      });

      if (changed) {
        if (isAdmin()) {
          saveState();
        } else {
          saveStateLocal();
        }
        const isEn = currentLang === "en";
        showToast(isEn ? "A boss has respawned. Timeline updated." : "Có boss vừa hồi sinh. Timeline đã được cập nhật.");
      }
    }

    function render() {
      autoResolveRespawns();
      const now = getNow();
      updateRoleUI();
      updateSoundUI();
      checkBossSoundAlerts(now);
      checkDailyScheduleAlert(now);
      renderClocks(now);
      renderMetrics(now);
      renderTodayScheduleTable(now);
      renderWeeklySchedule();
      renderBossGrid(now);
      renderHistory();
      updateFilterState();
    }

    function renderClocks(now) {
      elements.headerClock.textContent = formatClock(now);
      elements.sidebarClock.textContent = formatClock(now);
    }

    function renderMetrics(now) {
      const counts = state.bosses.reduce((acc, boss) => {
        const status = getBossStatus(boss, now);
        acc.total += 1;
        acc[status] += 1;
        return acc;
      }, { total: 0, alive: 0, respawning: 0, soon: 0 });

      const t = TRANSLATIONS[currentLang];
      elements.metrics.innerHTML = [
        metricCard(t.metricTotal, counts.total, t.metricTotalDesc, "var(--cyan)", "var(--cyan-soft)"),
        metricCard(t.metricAlive, counts.alive, t.metricAliveDesc, "var(--green)", "var(--green-soft)"),
        metricCard(t.metricRespawning, counts.respawning, t.metricRespawningDesc, "var(--cyan)", "var(--cyan-soft)"),
        metricCard(t.metricSoon, counts.soon, t.metricSoonDesc, "var(--amber)", "var(--amber-soft)")
      ].join("");
    }


    function metricCard(label, value, sub, color, soft) {
      return `
        <article class="metric-card" style="--metric-color:${color};--metric-soft:${soft}">
          <div>
            <div class="metric-label">
              <span>${escapeHtml(label)}</span>
              <span class="metric-dot" aria-hidden="true"></span>
            </div>
            <strong class="metric-value">${value}</strong>
          </div>
          <span class="metric-sub">${escapeHtml(sub)}</span>
        </article>
      `;
    }

    function renderNextPanel(now) {
      if (!elements.nextPanel) return;
    }

    function getVisibleBosses(now) {
      const query = elements.searchBoss.value.trim().toLowerCase();
      const filtered = state.bosses.filter((boss) => {
        const status = getBossStatus(boss, now);
        const matchesFilter = activeFilter === "all" || status === activeFilter;
        
        let matchesLevel = true;
        if (activeLevelFilter === "fixed") {
          matchesLevel = boss.spawnMode === "fixed";
        }

        const text = `${boss.name} ${boss.map} ${boss.notes} lv${boss.level || ""}`.toLowerCase();
        return matchesFilter && matchesLevel && (!query || text.includes(query));
      });

      if (activeLevelFilter === "level-asc") {
        return filtered.sort((a, b) => (a.level || 80) - (b.level || 80));
      }
      if (activeLevelFilter === "level-desc") {
        return filtered.sort((a, b) => (b.level || 80) - (a.level || 80));
      }

      return filtered.sort((a, b) => {
        const aTime = getNextBossEventTime(a, now);
        const bTime = getNextBossEventTime(b, now);

        // 1. Cả 2 đều đang đếm ngược hồi sinh: sắp xếp theo timeline (gần ra nhất lên đầu)
        if (aTime && bTime) {
          if (aTime !== bTime) return aTime - bTime;
          return a.name.localeCompare(b.name, "vi");
        }

        // 2. Boss đang đếm ngược (sắp ra) luôn đứng TRƯỚC boss đang sống (READY)
        if (aTime && !bTime) return -1;
        if (!aTime && bTime) return 1;

        // 3. Cả 2 boss đều đang sống (READY): xếp theo tên A-Z
        return a.name.localeCompare(b.name, "vi");
      });
    }

    let lastRenderedGridKey = "";

    function renderCompactBossTable(bosses, now) {
      const isEn = currentLang === "en";

      const rowsHtml = bosses.map((boss) => {
        const status = getBossStatus(boss, now);
        const remaining = getRemaining(boss, now);
        const progress = getProgress(boss, now);
        const isAlive = status === "alive";
        const isFixed = boss.spawnMode === "fixed";

        const eventTime = getNextBossEventTime(boss, now);
        const timeFormatted = formatSmartRespawnDate(eventTime, now);
        const cycleText = formatSpawnLabel(boss);

        const statusClass = `status-${status}`;
        const statusBadgeText = isEn
          ? (status === "alive" ? "ALIVE" : (status === "soon" ? "SPAWNING SOON" : "COUNTING DOWN"))
          : (status === "alive" ? "Đang sống" : (status === "soon" ? "Sắp hồi sinh" : "Đang hồi sinh"));

        const timerLabel = isAlive ? (isEn ? "Status" : "Trạng thái") : (isEn ? "Remaining" : "Còn lại");
        const timerValue = isAlive ? "READY" : formatCountdown(remaining);
        const actionIcon = isAlive ? iconSvg.skull : iconSvg.check;
        const actionLabel = isAlive
          ? (isEn ? "Record Death" : "Ghi nhận chết")
          : (isEn ? "Revive Now" : "Cho hồi sinh");

        const actionBoxHtml = isAdmin()
          ? `
            <div class="compact-action-panel">
              <div class="compact-timer-row">
                <span style="font-size:11px; color:var(--muted); font-weight:700;">${timerLabel}</span>
                <strong class="compact-timer-val" style="color:${isAlive ? "var(--green)" : "var(--cyan)"}">${timerValue}</strong>
              </div>
              <div class="progress-track" style="height:5px;" aria-label="Tiến độ hồi sinh"><span style="width:${progress}%"></span></div>
              <div style="display:flex; gap:6px; margin-top:4px;">
                ${isAlive ? `
                  <div class="split-btn-group" style="flex:1;">
                    <button class="button-danger action-main" type="button" data-action="kill" data-id="${escapeHtml(boss.id)}" style="padding:5px 10px; font-size:12px;" title="${isEn ? 'Record death right now' : 'Ghi nhận chết ngay bây giờ'}">
                      ${actionIcon}
                      <span>${actionLabel}</span>
                    </button>
                    <button class="split-arrow-btn" type="button" data-action="offset-menu" data-id="${escapeHtml(boss.id)}" style="padding:5px 8px;" title="${isEn ? 'Record past death time' : 'Ghi nhận chết lùi giờ'}">
                      <svg viewBox="0 0 24 24" fill="none" width="12" height="12"><path d="m6 9 6 6 6-6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </button>
                  </div>
                ` : `
                  <button class="button-primary action-main" type="button" data-action="revive" data-id="${escapeHtml(boss.id)}" style="flex:1; padding:5px 10px; font-size:12px;">
                    ${actionIcon}
                    <span>${actionLabel}</span>
                  </button>
                `}
                <button class="icon-button" type="button" data-action="edit" data-id="${escapeHtml(boss.id)}" style="padding:5px 8px;" title="${isEn ? 'Edit' : 'Chỉnh sửa'}">
                  ${iconSvg.edit}
                </button>
              </div>
            </div>
          `
          : `
            <div class="compact-action-panel">
              <div class="compact-timer-row">
                <span style="font-size:11px; color:var(--muted); font-weight:700;">${timerLabel}</span>
                <strong class="compact-timer-val" style="color:${isAlive ? "var(--green)" : "var(--cyan)"}">${timerValue}</strong>
              </div>
              <div class="progress-track" style="height:5px;" aria-label="Tiến độ hồi sinh"><span style="width:${progress}%"></span></div>
              <span style="font-size:11px; color:var(--muted-2); margin-top:2px;">${isEn ? "Member Mode (Read Only)" : "Chế độ chỉ xem"}</span>
            </div>
          `;

        const notesContent = boss.notes ? escapeHtml(boss.notes) : '<span class="notes-empty">—</span>';

        return `
          <tr class="compact-boss-row ${isFixed ? 'fixed-boss-row' : ''}" data-id="${escapeHtml(boss.id)}">
            <td style="white-space:nowrap;">
              ${isFixed ? `<div class="fixed-boss-badge">⭐ CỐ ĐỊNH</div>` : ''}
              <div class="${isFixed ? 'fixed-time-highlight' : ''}">${timeFormatted}</div>
              <div style="font-size:11px; color:${isFixed ? 'var(--amber)' : 'var(--muted-2)'}; margin-top:3px; font-weight:${isFixed ? '600' : '400'};">${escapeHtml(cycleText)}</div>
            </td>
            <td>
              <div style="display:flex; align-items:center; gap:5px;">
                ${isFixed ? `<span style="color:var(--fixed-boss-color); font-size:14px;" title="Boss cố định">⭐</span>` : ''}
                <div style="font-weight:800; color:${isFixed ? 'var(--fixed-boss-color)' : 'var(--text)'}; font-size:15px; line-height:1.25;">${escapeHtml(boss.name)}</div>
              </div>
              <div style="margin-top:3px;"><span class="status-pill ${statusClass}">${statusBadgeText}</span></div>
            </td>
            <td style="text-align:center;"><span class="level-badge">Lv. ${boss.level || 80}</span></td>
            <td><strong style="color:var(--text-2); font-weight:600;">${escapeHtml(boss.map)}</strong></td>
            <td>${actionBoxHtml}</td>
            <td style="font-size:12.5px; color:var(--text); line-height:1.5; word-break:break-word; text-align:center; vertical-align:middle;">${notesContent}</td>
          </tr>
        `;
      }).join("");

      return `
        <div class="compact-table-wrap" style="grid-column: 1 / -1;">
          <table class="compact-boss-table">
            <thead>
              <tr>
                <th scope="col" style="width:16%; min-width:140px;">${isEn ? "SPAWN TIME & DATE" : "GIỜ & NGÀY HỒI SINH"}</th>
                <th scope="col" style="width:14%; min-width:120px;">${isEn ? "BOSS NAME" : "TÊN BOSS"}</th>
                <th scope="col" style="width:10%; min-width:90px; text-align:center;">
                  <div class="level-header-wrap">
                    <span>LEVEL</span>
                    <select id="levelFilterSelect" class="level-select-header" title="Lọc theo Level">
                      <option value="all" ${activeLevelFilter === "all" ? "selected" : ""}>Tất cả</option>
                      <option value="fixed" ${activeLevelFilter === "fixed" ? "selected" : ""}>⭐ Cố định</option>
                      <option value="level-asc" ${activeLevelFilter === "level-asc" ? "selected" : ""}>⬆️ Thấp ➔ Cao</option>
                      <option value="level-desc" ${activeLevelFilter === "level-desc" ? "selected" : ""}>⬇️ Cao ➔ Thấp</option>
                    </select>
                  </div>
                </th>
                <th scope="col" style="width:16%; min-width:130px;">${isEn ? "LOCATION / MAP" : "ĐỊA ĐIỂM"}</th>
                <th scope="col" style="width:23%; min-width:220px;">${isEn ? "ACTION / TIMER" : "GHI NHẬN CHẾT / HỒI SINH"}</th>
                <th scope="col" style="width:21%; min-width:170px;">${isEn ? "NOTES" : "GHI CHÚ"}</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </div>
      `;
    }

    function updateCompactRowInPlace(row, boss, now) {
      const isEn = currentLang === "en";
      const status = getBossStatus(boss, now);
      const remaining = getRemaining(boss, now);
      const progress = getProgress(boss, now);
      const isAlive = status === "alive";

      const eventTime = getNextBossEventTime(boss, now);
      const timeFormatted = formatSmartRespawnDate(eventTime, now);
      const cycleText = formatSpawnLabel(boss);

      const statusClass = `status-${status}`;
      const statusBadgeText = isEn
        ? (status === "alive" ? "ALIVE" : (status === "soon" ? "SPAWNING SOON" : "COUNTING DOWN"))
        : (status === "alive" ? "Đang sống" : (status === "soon" ? "Sắp hồi sinh" : "Đang hồi sinh"));

      const timerLabel = isAlive ? (isEn ? "Status" : "Trạng thái") : (isEn ? "Remaining" : "Còn lại");
      const timerValue = isAlive ? "READY" : formatCountdown(remaining);

      // Update Column 1 (Spawn Time)
      if (row.children[0]) {
        const timeDiv = row.children[0].children[0];
        const cycleDiv = row.children[0].children[1];
        if (timeDiv && timeDiv.innerHTML !== timeFormatted) timeDiv.innerHTML = timeFormatted;
        if (cycleDiv && cycleDiv.textContent !== cycleText) cycleDiv.textContent = cycleText;
      }

      // Update Column 2 (Status Pill)
      const pill = row.querySelector(".status-pill");
      if (pill) {
        if (pill.className !== `status-pill ${statusClass}`) pill.className = `status-pill ${statusClass}`;
        if (pill.textContent !== statusBadgeText) pill.textContent = statusBadgeText;
      }

      // Update Column 5 (Action / Timer)
      const timerLabelEl = row.querySelector(".compact-timer-row span");
      if (timerLabelEl && timerLabelEl.textContent !== timerLabel) timerLabelEl.textContent = timerLabel;

      const timerValEl = row.querySelector(".compact-timer-val");
      if (timerValEl) {
        if (timerValEl.textContent !== timerValue) timerValEl.textContent = timerValue;
        const targetColor = isAlive ? "var(--green)" : "var(--cyan)";
        if (timerValEl.style.color !== targetColor) timerValEl.style.color = targetColor;
      }

      const progressSpan = row.querySelector(".progress-track span");
      if (progressSpan) {
        progressSpan.style.width = `${progress}%`;
      }

      // Luôn đảm bảo nút bấm khớp 100% với trạng thái sống/chết (chống nhấp nháy hoặc kẹt nút)
      if (isAdmin()) {
        const actionPanel = row.querySelector(".compact-action-panel");
        if (actionPanel) {
          const btnGroup = actionPanel.querySelector("div[style*='display:flex']");
          if (btnGroup) {
            const hasSplitGroup = Boolean(btnGroup.querySelector(".split-btn-group"));
            if (isAlive && !hasSplitGroup) {
              const actionIcon = iconSvg.skull;
              const actionLabel = isEn ? "Record Death" : "Ghi nhận chết";
              btnGroup.innerHTML = `
                <div class="split-btn-group" style="flex:1;">
                  <button class="button-danger action-main" type="button" data-action="kill" data-id="${escapeHtml(boss.id)}" style="padding:5px 10px; font-size:12px;" title="${isEn ? 'Record death right now' : 'Ghi nhận chết ngay bây giờ'}">
                    ${actionIcon}
                    <span>${actionLabel}</span>
                  </button>
                  <button class="split-arrow-btn" type="button" data-action="offset-menu" data-id="${escapeHtml(boss.id)}" style="padding:5px 8px;" title="${isEn ? 'Record past death time' : 'Ghi nhận chết lùi giờ'}">
                    <svg viewBox="0 0 24 24" fill="none" width="12" height="12"><path d="m6 9 6 6 6-6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  </button>
                </div>
                <button class="icon-button" type="button" data-action="edit" data-id="${escapeHtml(boss.id)}" style="padding:5px 8px;" title="${isEn ? 'Edit' : 'Chỉnh sửa'}">
                  ${iconSvg.edit}
                </button>
              `;
            } else if (!isAlive && hasSplitGroup) {
              const actionIcon = iconSvg.check;
              const actionLabel = isEn ? "Revive Now" : "Cho hồi sinh";
              btnGroup.innerHTML = `
                <button class="button-primary action-main" type="button" data-action="revive" data-id="${escapeHtml(boss.id)}" style="flex:1; padding:5px 10px; font-size:12px;">
                  ${actionIcon}
                  <span>${actionLabel}</span>
                </button>
                <button class="icon-button" type="button" data-action="edit" data-id="${escapeHtml(boss.id)}" style="padding:5px 8px;" title="${isEn ? 'Edit' : 'Chỉnh sửa'}">
                  ${iconSvg.edit}
                </button>
              `;
            }
          }
        }
      }
    }

    function renderBossGrid(now) {
      const bosses = getVisibleBosses(now);
      const isEn = currentLang === "en";
      updateViewModeUI();
      if (!bosses.length) {
        lastRenderedGridKey = "";
        elements.bossGrid.innerHTML = `
          <div class="empty-state" style="grid-column:1 / -1">
            <strong>${isEn ? "No matching bosses found" : "Không tìm thấy boss phù hợp"}</strong>
            ${isEn ? "Try changing search keywords or selecting a different status filter." : "Thử đổi từ khóa tìm kiếm hoặc chọn lại bộ lọc trạng thái."}
          </div>
        `;
        return;
      }

      // Structural key: thay đổi khi trạng thái chết/sống thay đổi hoặc thay đổi filter/role/view
      const structKey = bosses.map((b) => `${b.id}:${b.diedAt || 0}:${b.respawnsAt || 0}:${getBossStatus(b, now)}`).join(",")
        + "|" + currentRole + "|" + currentLang + "|" + activeFilter + "|" + (activeLevelFilter || "all") + "|" + activeView;

      if (structKey !== lastRenderedGridKey) {
        lastRenderedGridKey = structKey;
        if (activeView === "compact") {
          elements.bossGrid.style.display = "block";
          elements.bossGrid.innerHTML = renderCompactBossTable(bosses, now);
        } else {
          elements.bossGrid.style.display = "grid";
          elements.bossGrid.innerHTML = bosses.map((boss) => renderBossCard(boss, now)).join("");
        }
      } else {
        if (activeView === "compact") {
          elements.bossGrid.style.display = "block";
          bosses.forEach((boss) => {
            const row = elements.bossGrid.querySelector(`.compact-boss-row[data-id="${CSS.escape(boss.id)}"]`);
            if (row) updateCompactRowInPlace(row, boss, now);
          });
        } else {
          elements.bossGrid.style.display = "grid";
          bosses.forEach((boss) => {
            const card = elements.bossGrid.querySelector(`.boss-card[data-id="${CSS.escape(boss.id)}"]`);
            if (card) updateBossCardInPlace(card, boss, now);
          });
        }
      }
    }

    function updateBossCardInPlace(card, boss, now) {
      const isEn = currentLang === "en";
      const status = getBossStatus(boss, now);
      const remaining = getRemaining(boss, now);
      const progress = getProgress(boss, now);
      const isAlive = status === "alive";
      const timerLabel = isAlive ? (isEn ? "Status" : "Trạng thái") : (isEn ? "Remaining" : "Còn lại");
      const timerValue = isAlive ? "READY" : formatCountdown(remaining);
      const statusClass = `status-${status}`;
      const statusBadgeText = isEn
        ? (status === "alive" ? "• ALIVE" : (status === "soon" ? "• SPAWNING SOON" : "• COUNTING DOWN"))
        : statusCopy[status].label;

      const respawnText = boss.spawnMode === "fixed"
        ? (isEn ? `Fixed ${boss.fixedTime}` : `Cố định ${boss.fixedTime}`)
        : `Respawn ${formatRespawnMinutes(boss.respawnMinutes)}`;
      const eventTime = getNextBossEventTime(boss, now);
      const respawnTimeText = isAlive
        ? respawnText
        : (isEn ? "Respawn " : "Hồi sinh ") + formatTimeOnly(eventTime);

      const timerLabelEl = card.querySelector(".timer-label");
      if (timerLabelEl && timerLabelEl.textContent !== timerLabel) timerLabelEl.textContent = timerLabel;

      const timerValEl = card.querySelector(".timer-value");
      if (timerValEl && timerValEl.textContent !== timerValue) timerValEl.textContent = timerValue;

      const pill = card.querySelector(".status-pill");
      if (pill) {
        if (pill.className !== `status-pill ${statusClass}`) pill.className = `status-pill ${statusClass}`;
        if (pill.textContent !== statusBadgeText) pill.textContent = statusBadgeText;
      }

      const progressSpan = card.querySelector(".progress-track span");
      if (progressSpan) progressSpan.style.width = `${progress}%`;

      const metaSpans = card.querySelectorAll(".boss-meta span");
      if (metaSpans[0] && metaSpans[0].textContent !== respawnTimeText) metaSpans[0].textContent = respawnTimeText;
      if (metaSpans[1] && metaSpans[1].textContent !== `${progress}%`) metaSpans[1].textContent = `${progress}%`;

      // Đồng bộ nút bấm tương ứng ngay lập tức khi boss chết/sống
      if (isAdmin()) {
        const actionsEl = card.querySelector(".card-actions");
        if (actionsEl) {
          const hasSplitGroup = Boolean(actionsEl.querySelector(".split-btn-group"));
          if (isAlive && !hasSplitGroup) {
            const actionIcon = iconSvg.skull;
            const actionLabel = isEn ? "Record Death" : "Ghi nhận chết";
            actionsEl.innerHTML = `
              <div class="split-btn-group">
                <button class="button-danger action-main" type="button" data-action="kill" data-id="${escapeHtml(boss.id)}" title="${isEn ? 'Record death right now' : 'Ghi nhận chết ngay bây giờ'}">
                  ${actionIcon}
                  <span>${actionLabel}</span>
                </button>
                <button class="split-arrow-btn" type="button" data-action="offset-menu" data-id="${escapeHtml(boss.id)}" aria-label="${isEn ? 'Record past death time' : 'Ghi nhận chết lùi giờ'}" title="${isEn ? 'Record past death time' : 'Ghi nhận chết lùi giờ'}">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 9 6 6 6-6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
              </div>
              <button class="icon-button" type="button" data-action="edit" data-id="${escapeHtml(boss.id)}" aria-label="${isEn ? 'Edit' : 'Chỉnh sửa'} ${escapeHtml(boss.name)}" title="${isEn ? 'Edit' : 'Chỉnh sửa'}">
                ${iconSvg.edit}
              </button>
            `;
          } else if (!isAlive && hasSplitGroup) {
            const actionIcon = iconSvg.check;
            const actionLabel = isEn ? "Revive Now" : "Cho hồi sinh";
            actionsEl.innerHTML = `
              <button class="button-primary action-main" type="button" data-action="revive" data-id="${escapeHtml(boss.id)}">
                ${actionIcon}
                <span>${actionLabel}</span>
              </button>
              <button class="icon-button" type="button" data-action="edit" data-id="${escapeHtml(boss.id)}" aria-label="${isEn ? 'Edit' : 'Chỉnh sửa'} ${escapeHtml(boss.name)}" title="${isEn ? 'Edit' : 'Chỉnh sửa'}">
                ${iconSvg.edit}
              </button>
            `;
          }
        }
      }
    }

    function renderBossCard(boss, now) {
      const isEn = currentLang === "en";
      const status = getBossStatus(boss, now);
      const remaining = getRemaining(boss, now);
      const progress = getProgress(boss, now);
      const isAlive = status === "alive";
      const timerLabel = isAlive ? (isEn ? "Status" : "Trạng thái") : (isEn ? "Remaining" : "Còn lại");
      const timerValue = isAlive ? "READY" : formatCountdown(remaining);
      const statusClass = `status-${status}`;
      const actionIcon = isAlive ? iconSvg.skull : iconSvg.check;
      const actionLabel = isAlive
        ? (isEn ? "Record Death" : "Ghi nhận chết")
        : (isEn ? "Revive Now" : "Cho hồi sinh");

      const statusBadgeText = isEn
        ? (status === "alive" ? "• ALIVE" : (status === "soon" ? "• SPAWNING SOON" : "• COUNTING DOWN"))
        : statusCopy[status].label;

      const actionsHtml = isAdmin()
        ? `
          <div class="card-actions">
            ${isAlive ? `
              <div class="split-btn-group">
                <button class="button-danger action-main" type="button" data-action="kill" data-id="${escapeHtml(boss.id)}" title="${isEn ? 'Record death right now' : 'Ghi nhận chết ngay bây giờ'}">
                  ${actionIcon}
                  <span>${actionLabel}</span>
                </button>
                <button class="split-arrow-btn" type="button" data-action="offset-menu" data-id="${escapeHtml(boss.id)}" aria-label="${isEn ? 'Record past death time' : 'Ghi nhận chết lùi giờ'}" title="${isEn ? 'Record past death time' : 'Ghi nhận chết lùi giờ'}">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 9 6 6 6-6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
              </div>
            ` : `
              <button class="button-primary action-main" type="button" data-action="revive" data-id="${escapeHtml(boss.id)}">
                ${actionIcon}
                <span>${actionLabel}</span>
              </button>
            `}
            <button class="icon-button" type="button" data-action="edit" data-id="${escapeHtml(boss.id)}" aria-label="${isEn ? 'Edit' : 'Chỉnh sửa'} ${escapeHtml(boss.name)}" title="${isEn ? 'Edit' : 'Chỉnh sửa'}">
              ${iconSvg.edit}
            </button>
          </div>
        `
        : `
          <div class="member-readonly-badge">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/></svg>
            ${isEn ? "Member Mode · Read Only" : "Chế độ thành viên · Chỉ xem"}
          </div>
        `;

      const respawnText = boss.spawnMode === "fixed" ? (isEn ? `Fixed ${boss.fixedTime}` : `Cố định ${boss.fixedTime}`) : `Respawn ${formatRespawnMinutes(boss.respawnMinutes)}`;
      const eventTime = getNextBossEventTime(boss, now);
      const respawnTimeText = isAlive ? respawnText : (isEn ? "Respawn " : "Hồi sinh ") + formatTimeOnly(eventTime);

      return `
        <article class="boss-card" data-id="${escapeHtml(boss.id)}">
          <div class="boss-head">
            <img class="boss-avatar" src="${getAvatarPath(boss.avatar)}" alt="">
            <div>
              <div class="boss-map">${escapeHtml(boss.map)} · <span class="level-badge">Lv. ${boss.level || 80}</span></div>
              <h3 class="boss-name" style="${boss.spawnMode === 'fixed' ? 'color: var(--fixed-boss-color);' : ''}">${boss.spawnMode === 'fixed' ? '⭐ ' : ''}${escapeHtml(boss.name)}</h3>
            </div>
            <span class="status-pill ${statusClass}">${statusBadgeText}</span>
          </div>

          <div class="timer-panel">
            <div class="timer-row">
              <span class="timer-label">${timerLabel}</span>
              <strong class="timer-value">${timerValue}</strong>
            </div>
            <div class="progress-track" aria-label="Tiến độ hồi sinh"><span style="width:${progress}%"></span></div>
            <div class="boss-meta">
              <span>${respawnTimeText}</span>
              <span>${progress}%</span>
            </div>
          </div>

          ${actionsHtml}
        </article>
      `;
    }

    function getAvatarPath(avatar) {
      const safe = ["ember", "frost", "void", "stone", "storm"].includes(avatar) ? avatar : "ember";
      return `assets/boss-${safe}.svg`;
    }

    let lastHistoryKey = "";

    function renderHistory() {
      const history = state.history.slice(0, 25);
      const isEn = currentLang === "en";
      if (!history.length) {
        if (lastHistoryKey !== "empty") {
          lastHistoryKey = "empty";
          elements.historyList.innerHTML = `
            <div class="empty-state">
              <strong>${isEn ? "No history recorded" : "Chưa có lịch sử"}</strong>
              ${isEn ? "When you record boss death or revive a boss, timeline events will appear here." : "Khi bạn ghi nhận boss chết hoặc cho hồi sinh, timeline sẽ xuất hiện ở đây."}
            </div>
          `;
        }
        return;
      }

      const historyKey = history.map((item) => `${item.id || item.time}:${item.type}:${item.bossId}:${item.time}`).join(",") + "_" + currentLang;
      if (historyKey === lastHistoryKey) return;
      lastHistoryKey = historyKey;

      elements.historyList.innerHTML = history.map((item) => {
        const isDeath = item.type === "death";
        const isAll = item.bossId === "all";
        const icon = isDeath ? iconSvg.skull : iconSvg.check;
        const displayName = isAll ? (isEn ? "⚡ ALL BOSSES" : "⚡ TẤT CẢ BOSS") : item.bossName;
        const title = isDeath
          ? (isEn ? `${displayName} died` : `${displayName} đã chết`)
          : (isEn ? `${displayName} respawned` : `${displayName} đã hồi sinh`);
        const mapName = isAll ? (isEn ? "Server Maintenance Complete" : "Bảo trì Server xong") : (item.map || (isEn ? "No map set" : "Chưa đặt map"));
        const respawnSource = item.source === "manual"
          ? (isEn ? "Admin manual revive" : "Admin cho hồi sinh")
          : item.source === "automatic"
            ? (isEn ? "Automatic respawn" : "Tự động hồi sinh")
            : (isEn ? "Ready to spawn" : "Sẵn sàng xuất hiện lại");
        const detail = `${mapName} · ${isDeath ? (isEn ? "Countdown started" : "Bắt đầu countdown") : respawnSource}`;
        const adminBadge = item.adminName
          ? `<span style="display:inline-flex;align-items:center;gap:4px;margin-top:3px;font-size:11px;color:var(--violet);font-weight:700;">
               <svg viewBox="0 0 24 24" fill="none" width="11" height="11"><path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
               ${escapeHtml(item.adminName)}
             </span>`
          : "";
        return `
          <article class="history-item">
            <div class="history-icon" style="color:${isDeath ? "var(--red)" : "var(--green)"}">${icon}</div>
            <div style="min-width:0;flex:1;">
              <div class="history-title">${escapeHtml(title)}</div>
              <div class="history-detail">${escapeHtml(detail)}</div>
              ${adminBadge}
            </div>
            <div class="history-time">${formatShortDate(item.time)}</div>
          </article>
        `;
      }).join("");
    }

    function getTargetDateForFilter(nowDate = new Date(), dayFilter = scheduleDayFilter) {
      const targetDate = new Date(nowDate);
      if (dayFilter === "all" || dayFilter === "today") {
        return targetDate;
      }
      const targetDow = Number(dayFilter);
      const todayDow = nowDate.getDay();
      const diffDays = (targetDow - todayDow + 7) % 7;
      targetDate.setDate(nowDate.getDate() + diffDays);
      return targetDate;
    }

    function updateScheduleDayTabs(now = new Date()) {
      const isEn = currentLang === "en";
      const dayNames = isEn
        ? { "all": "All (7 Days)", "today": "Today", 1: "Mon", 2: "Tue", 3: "Wed", 4: "Thu", 5: "Fri", 6: "Sat", 0: "Sun" }
        : { "all": "Tất cả (7 Ngày)", "today": "Hôm nay", 1: "Thứ 2", 2: "Thứ 3", 3: "Thứ 4", 4: "Thứ 5", 5: "Thứ 6", 6: "Thứ 7", 0: "Chủ Nhật" };

      document.querySelectorAll(".schedule-day-tab").forEach(tab => {
        const filter = tab.dataset.dayFilter;
        if (filter === "all") {
          tab.textContent = dayNames["all"];
        } else if (filter === "today") {
          const dd = String(now.getDate()).padStart(2, "0");
          const mm = String(now.getMonth() + 1).padStart(2, "0");
          tab.textContent = `${dayNames["today"]} (${dd}/${mm})`;
        } else {
          const targetDow = Number(filter);
          const targetDate = getTargetDateForFilter(now, filter);
          const dd = String(targetDate.getDate()).padStart(2, "0");
          const mm = String(targetDate.getMonth() + 1).padStart(2, "0");
          tab.textContent = `${dayNames[targetDow]} (${dd}/${mm})`;
        }
      });
    }

    function getTodayScheduleSubtitle(now = new Date(), dayFilter = scheduleDayFilter) {
      const isEn = currentLang === "en";
      const days = isEn
        ? ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        : ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];

      if (dayFilter === "all") {
        const startD = new Date(now);
        const endD = new Date(now);
        endD.setDate(now.getDate() + 6);
        const startStr = `${String(startD.getDate()).padStart(2, "0")}/${String(startD.getMonth() + 1).padStart(2, "0")}`;
        const endStr = `${String(endD.getDate()).padStart(2, "0")}/${String(endD.getMonth() + 1).padStart(2, "0")}`;
        return isEn
          ? `Full weekly countdown schedule & multi-day respawn cycles · ${startStr} → ${endStr} · UTC+7`
          : `Đầy đủ lịch đếm ngược 7 ngày tới & chu kỳ multi-day · ${startStr} → ${endStr} · UTC+7`;
      }

      const targetDate = getTargetDateForFilter(now, dayFilter);
      const dayName = days[targetDate.getDay()];
      const dd = String(targetDate.getDate()).padStart(2, "0");
      const mm = String(targetDate.getMonth() + 1).padStart(2, "0");
      const yyyy = targetDate.getFullYear();
      return `${dayName}, ${dd}/${mm}/${yyyy} · 00:00 → 24:00 · UTC+7`;
    }

    let scheduleDayFilter = "all";

    function getBossScheduleEventTime(boss, now, dayFilter) {
      const isFixed = boss.spawnMode === "fixed";
      const nowDate = new Date(now);

      if (dayFilter === "all") {
        if (isFixed) {
          return boss.respawnsAt || getNextFixedSpawnTime(boss, now);
        } else {
          const intervalMs = (boss.respawnMinutes || 30) * 60 * 1000;
          let nextRespawn = boss.respawnsAt;
          if (!nextRespawn && boss.lastRespawnAt) nextRespawn = boss.lastRespawnAt + intervalMs;
          if (!nextRespawn && boss.diedAt) nextRespawn = boss.diedAt + intervalMs;
          if (!nextRespawn) nextRespawn = now;
          if (nextRespawn < now) {
            const diff = now - nextRespawn;
            const steps = Math.ceil(diff / intervalMs);
            nextRespawn += steps * intervalMs;
          }
          return nextRespawn;
        }
      }

      // Specific day filter: today, 1 (T2), 2 (T3), 3 (T4), 4 (T5), 5 (T6), 6 (T7), 0 (CN)
      const targetDate = getTargetDateForFilter(nowDate, dayFilter);
      const startDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 0, 0, 0, 0).getTime();
      const endDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 23, 59, 59, 999).getTime();
      const targetDow = targetDate.getDay();

      if (isFixed) {
        const schedules = Array.isArray(boss.fixedSchedules) && boss.fixedSchedules.length > 0
          ? boss.fixedSchedules
          : [{ day: "all", time: boss.fixedTime || "18:00" }];

        const matchingSlots = schedules.filter(s => s.day === "all" || Number(s.day) === targetDow);
        if (!matchingSlots.length) return null;
        
        const slotTimes = matchingSlots.map(s => {
          const [h, m] = (s.time || "18:00").split(":").map(Number);
          return new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), h || 0, m || 0, 0, 0).getTime();
        }).sort((a, b) => a - b);

        if (dayFilter === "today" || Number(dayFilter) === nowDate.getDay()) {
          const upcoming = slotTimes.find(t => t >= now);
          if (upcoming) return upcoming;
        }
        return slotTimes[0];
      } else {
        const intervalMs = (boss.respawnMinutes || 30) * 60 * 1000;
        let baseTime = boss.respawnsAt;
        if (!baseTime && boss.diedAt) baseTime = boss.diedAt + intervalMs;
        if (!baseTime && boss.lastRespawnAt) baseTime = boss.lastRespawnAt + intervalMs;
        if (!baseTime) baseTime = now;

        let cur = baseTime;
        if (cur < startDay) {
          const diff = startDay - cur;
          const steps = Math.ceil(diff / intervalMs);
          cur += steps * intervalMs;
        } else if (cur > endDay) {
          const diff = cur - endDay;
          const steps = Math.ceil(diff / intervalMs);
          cur -= steps * intervalMs;
        }
        return (cur >= startDay && cur <= endDay) ? cur : null;
      }
    }

    let lastTodayScheduleKey = "";

    function renderTodayScheduleTable(now = getNow()) {
      if (!elements.todayScheduleBody) return;
      updateScheduleDayTabs(new Date(now));
      if (elements.todayScheduleSubtitle) {
        elements.todayScheduleSubtitle.textContent = getTodayScheduleSubtitle(new Date(now));
      }

      const items = [];
      state.bosses.forEach((boss) => {
        const eventTime = getBossScheduleEventTime(boss, now, scheduleDayFilter);
        if (eventTime !== null) {
          items.push({ boss, eventTime });
        }
      });

      const totalBoss = items.length;
      const isEn = currentLang === "en";
      if (elements.todayHeaderBadge) {
        elements.todayHeaderBadge.textContent = `${totalBoss} ${isEn ? 'bosses' : 'boss'}`;
      }
      if (elements.todayBossCount) {
        elements.todayBossCount.textContent = `${totalBoss} ${isEn ? 'bosses' : 'boss'}`;
      }

      if (!totalBoss) {
        if (lastTodayScheduleKey !== "empty") {
          lastTodayScheduleKey = "empty";
          elements.todayScheduleBody.innerHTML = `
            <tr>
              <td colspan="6" style="text-align:center; padding: 28px; color: var(--muted);">
                ${isEn ? "No bosses matching the selected day filter." : "Không có boss nào phù hợp với bộ lọc ngày được chọn."}
              </td>
            </tr>
          `;
        }
        return;
      }

      items.sort((a, b) => {
        if (a.eventTime && b.eventTime) return a.eventTime - b.eventTime;
        return a.boss.name.localeCompare(b.boss.name, "vi");
      });

      const tableKey = items.map(i => `${i.boss.id}:${i.eventTime}:${getBossStatus(i.boss, now)}:${i.boss.notes || ""}`).join(",") + "_" + currentLang + "_" + scheduleDayFilter;

      if (tableKey !== lastTodayScheduleKey) {
        lastTodayScheduleKey = tableKey;
        elements.todayScheduleBody.innerHTML = items.map(({ boss, eventTime }) => {
          const status = getBossStatus(boss, now);
          const remaining = getRemaining(boss, now);
          const timeFormatted = formatSmartRespawnDate(eventTime, now);
          const cycleText = formatSpawnLabel(boss);

          let badgeClass = "badge-alive";
          let badgeText = isEn ? "• ALIVE" : "• ĐANG SỐNG";
          if (status === "respawning") {
            badgeClass = "badge-waiting";
            badgeText = isEn ? "• COUNTING DOWN" : "• ĐANG HỒI SINH";
          } else if (status === "soon") {
            badgeClass = "badge-soon";
            badgeText = isEn ? "• SPAWNING SOON" : "• SẮP HỒI SINH";
          }

          const notesContent = boss.notes ? escapeHtml(boss.notes) : '<span class="notes-empty">—</span>';

          return `
            <tr data-boss-id="${escapeHtml(boss.id)}" style="cursor:pointer;" title="${isEn ? 'Click to view' : 'Bấm để xem'} ${escapeHtml(boss.name)}">
              <td class="today-time-cell">${timeFormatted}</td>
              <td><span class="level-badge">Lv. ${boss.level || 80}</span></td>
              <td>
                <div class="today-boss-cell">
                  <span class="today-boss-name" style="${boss.spawnMode === 'fixed' ? 'color: var(--fixed-boss-color); font-weight: 800;' : ''}">${boss.spawnMode === 'fixed' ? '⭐ ' : ''}${escapeHtml(boss.name)}</span>
                  <span class="today-boss-badge ${badgeClass}">${badgeText}</span>
                </div>
              </td>
              <td style="font-size:12.5px; font-weight:600; color:var(--text-2);">${escapeHtml(cycleText)}</td>
              <td class="today-map-cell">${escapeHtml(boss.map)}</td>
              <td class="today-notes-cell">${notesContent}</td>
            </tr>
          `;
        }).join("");
      } else {
        const rows = elements.todayScheduleBody.querySelectorAll("tr[data-boss-id]");
        items.forEach(({ boss, eventTime }, idx) => {
          const row = rows[idx];
          if (row) {
            const timeCell = row.querySelector(".today-time-cell");
            const timeFormatted = formatSmartRespawnDate(eventTime, now);
            if (timeCell && timeCell.innerHTML !== timeFormatted) timeCell.innerHTML = timeFormatted;
          }
        });
      }
    }


    function toggleWeeklySchedule(forceOpen = null) {
      if (!elements.weeklySchedulePanel) return;
      const isOpen = elements.weeklySchedulePanel.classList.contains("open");
      const shouldOpen = forceOpen !== null ? forceOpen : !isOpen;
      elements.weeklySchedulePanel.classList.toggle("open", shouldOpen);
      if (elements.weeklyScheduleToggle) {
        elements.weeklyScheduleToggle.setAttribute("aria-expanded", shouldOpen);
      }
    }

    let lastWeeklyScheduleKey = "";

    function renderWeeklySchedule() {
      if (!elements.weeklyGrid) return;

      const isEn = currentLang === "en";
      const weeklyBosses = state.bosses.filter((b) => b.spawnMode === "fixed" && Array.isArray(b.weekDays) && b.weekDays.length > 0);

      if (elements.weeklyHeaderBadge) {
        elements.weeklyHeaderBadge.textContent = `${weeklyBosses.length} ${isEn ? 'bosses' : 'boss'}`;
      }

      if (!weeklyBosses.length) {
        if (lastWeeklyScheduleKey !== "empty") {
          lastWeeklyScheduleKey = "empty";
          elements.weeklyGrid.innerHTML = `
            <div class="weekly-no-data" style="grid-column:1/-1">
              <strong>${isEn ? "No featured bosses configured" : "Chưa có boss tiêu biểu"}</strong>
              ${isEn ? "Add a boss and select recurring days of the week to show fixed Mon–Sun schedule." : "Thêm boss và chọn ngày xuất hiện trong tuần để hiển thị lịch boss cố định T2–CN."}
            </div>
          `;
        }
        return;
      }

      const today = new Date();
      const todayDow = today.getDay(); // 0=Sun, 1=Mon, ...
      const weeklyKey = weeklyBosses.map(b => `${b.id}:${(b.weekDays||[]).join(",")}:${b.fixedTime}:${b.name}`).join(";") + "_" + currentLang + "_" + todayDow;
      if (weeklyKey === lastWeeklyScheduleKey) return;
      lastWeeklyScheduleKey = weeklyKey;

      // Days order: T2(1), T3(2), T4(3), T5(4), T6(5), T7(6), CN(0)
      const dayOrder = [1, 2, 3, 4, 5, 6, 0];
      const dayLabels = isEn
        ? { 0: "Sun", 1: "Mon", 2: "Tue", 3: "Wed", 4: "Thu", 5: "Fri", 6: "Sat" }
        : { 0: "CN", 1: "T2", 2: "T3", 3: "T4", 4: "T5", 5: "T6", 6: "T7" };
      const dayFullName = isEn
        ? { 0: "Sunday", 1: "Monday", 2: "Tuesday", 3: "Wednesday", 4: "Thursday", 5: "Friday", 6: "Saturday" }
        : { 0: "Chủ Nhật", 1: "Thứ 2", 2: "Thứ 3", 3: "Thứ 4", 4: "Thứ 5", 5: "Thứ 6", 6: "Thứ 7" };

      const dateForDow = {};
      dayOrder.forEach((dow) => {
        const diff = (dow - todayDow + 7) % 7;
        const d = new Date(today);
        d.setDate(today.getDate() + diff);
        dateForDow[dow] = d;
      });

      elements.weeklyGrid.innerHTML = dayOrder.map((dow) => {
        const isToday = dow === todayDow;
        const dayDate = dateForDow[dow];
        const dd = String(dayDate.getDate()).padStart(2, "0");
        const mm = String(dayDate.getMonth() + 1).padStart(2, "0");
        const dayBosses = weeklyBosses.filter((b) => b.weekDays.includes(dow));

        const bossesHtml = dayBosses.length
          ? dayBosses.map((boss) => {
              const slotsForDay = (boss.fixedSchedules || []).filter(s => s.day === "all" || Number(s.day) === dow);
              const timesStr = slotsForDay.map(s => s.time).join(", ");
              const timeBadge = timesStr ? `<span class="weekly-boss-time">⏰ ${timesStr}</span>` : "";

              return `
                <div class="weekly-boss-pill" data-boss-id="${escapeHtml(boss.id)}" title="Bấm để xem ${escapeHtml(boss.name)}">
                  <div class="weekly-boss-name" style="color: var(--fixed-boss-color); font-weight: 800;">⭐ ${escapeHtml(boss.name)}</div>
                  <div class="weekly-boss-map">${escapeHtml(boss.map)}</div>
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-top:3px; flex-wrap:wrap; gap:2px;">
                    <span class="weekly-boss-lv">Lv. ${boss.level || 80}</span>
                    ${timeBadge}
                  </div>
                </div>
              `;
            }).join("")
          : `<div class="weekly-empty-day">—</div>`;

        return `
          <div class="weekly-day-col${isToday ? " is-today" : ""}">
            <div class="weekly-day-header">
              <div class="weekly-day-label">${dayLabels[dow]}</div>
              <span class="weekly-day-date">${dd}/${mm}</span>
            </div>
            ${bossesHtml}
          </div>
        `;
      }).join("");

      // Click on boss pill → scroll to boss card
      elements.weeklyGrid.querySelectorAll("[data-boss-id]").forEach((pill) => {
        pill.addEventListener("click", () => {
          const bossId = pill.dataset.bossId;
          const card = document.querySelector(`[data-id="${bossId}"]`);
          if (card) {
            card.scrollIntoView({ behavior: "smooth", block: "center" });
            card.classList.remove("highlighted");
            void card.offsetWidth;
            card.classList.add("highlighted");
            window.setTimeout(() => card.classList.remove("highlighted"), 1600);
          }
        });
      });
    }

    function exportTodaySchedulePDF() {
      const now = getNow();
      const nowDate = new Date(now);
      const isEn = currentLang === "en";
      const clockStr = formatClock(now);

      let filterTitle = isEn ? "BOSS SCHEDULE & FORECAST REPORT (7 DAYS)" : "BÁO CÁO LỊCH BOSS & DỰ BÁO (7 NGÀY)";
      let filterSubDate = getTodayScheduleSubtitle(nowDate, scheduleDayFilter);

      let targetDate = new Date(nowDate);
      let isSingleDay = false;

      if (scheduleDayFilter === "today") {
        filterTitle = isEn ? "TODAY'S BOSS SCHEDULE REPORT (00:00 - 24:00)" : "BÁO CÁO LỊCH BOSS HÔM NAY (00:00 - 24:00)";
        isSingleDay = true;
      } else if (scheduleDayFilter !== "all") {
        const dayNamesVi = { 1: "THỨ 2", 2: "THỨ 3", 3: "THỨ 4", 4: "THỨ 5", 5: "THỨ 6", 6: "THỨ 7", 0: "CHỦ NHẬT" };
        const dayNamesEn = { 1: "MONDAY", 2: "TUESDAY", 3: "WEDNESDAY", 4: "THURSDAY", 5: "FRIDAY", 6: "SATURDAY", 0: "SUNDAY" };
        const dayDow = Number(scheduleDayFilter);
        const dayName = isEn ? (dayNamesEn[dayDow] || "") : (dayNamesVi[dayDow] || "");
        
        targetDate = getTargetDateForFilter(nowDate, scheduleDayFilter);

        const dd = String(targetDate.getDate()).padStart(2, "0");
        const mm = String(targetDate.getMonth() + 1).padStart(2, "0");
        filterTitle = isEn
          ? `BOSS SCHEDULE REPORT - ${dayName} (${dd}/${mm}) (00:00 - 24:00)`
          : `BÁO CÁO LỊCH BOSS - ${dayName} (${dd}/${mm}) (00:00 - 24:00)`;
        filterSubDate = isEn
          ? `List of boss spawns and respawns on ${dayName} (${dd}/${mm}) from 00:00 to 24:00 UTC+7`
          : `Danh sách lượt xuất hiện / hồi sinh trong ${dayName} (${dd}/${mm}) từ 00h00 đến 24h00 UTC+7`;
        isSingleDay = true;
      }

      const items = [];
      state.bosses.forEach((boss) => {
        const eventTime = getBossScheduleEventTime(boss, now, scheduleDayFilter);
        if (eventTime !== null) {
          items.push({ boss, eventTime });
        }
      });

      items.sort((a, b) => {
        if (a.eventTime && b.eventTime) return a.eventTime - b.eventTime;
        return a.boss.name.localeCompare(b.boss.name, "vi");
      });

      const rowsHtml = items.map(({ boss, eventTime }, idx) => {
        const status = getBossStatus(boss, now);
        const isFixed = boss.spawnMode === "fixed";
        const cycleText = formatSpawnLabel(boss);
        const cleanTimeStr = formatSmartRespawnDate(eventTime, now).replace(/<[^>]*>/g, " ");

        let statusText = isEn ? "• ALIVE" : "• ĐANG SỐNG";
        let statusBadgeClass = "status-alive";
        if (status === "respawning") {
          statusText = isEn ? "• COUNTING DOWN" : "• ĐANG HỒI SINH";
          statusBadgeClass = "status-respawning";
        } else if (status === "soon") {
          statusText = isEn ? "• SPAWNING SOON" : "• SẮP HỒI SINH";
          statusBadgeClass = "status-soon";
        }

        const notes = escapeHtml(boss.notes || "—");
        const bossNameHtml = isFixed ? `<strong style="color: #d97706;">⭐ ${escapeHtml(boss.name)}</strong>` : `<strong>${escapeHtml(boss.name)}</strong>`;

        return `
          <tr>
            <td style="text-align:center; font-weight:600; color:#64748b;">${idx + 1}</td>
            <td class="time-col"><strong>${cleanTimeStr}</strong></td>
            <td style="text-align:center;"><span class="level-tag">Lv. ${boss.level || 80}</span></td>
            <td>${bossNameHtml}</td>
            <td style="font-weight:600; color:#475569;">${escapeHtml(cycleText)}</td>
            <td style="text-align:center;"><span class="badge ${statusBadgeClass}">${statusText}</span></td>
            <td>${escapeHtml(boss.map)}</td>
            <td style="color:#334155;">${notes}</td>
          </tr>
        `;
      }).join("");

      const counts = {
        total: items.length,
        fixed: items.filter(o => o.boss.spawnMode === "fixed").length,
        interval: items.filter(o => o.boss.spawnMode !== "fixed").length
      };

      const reportHtml = `<!DOCTYPE html>
<html lang="${isEn ? 'en' : 'vi'}">
<head>
  <meta charset="UTF-8">
  <title>${filterTitle} - Boss Timeline Pro</title>
  <style>
    @page {
      size: A4 landscape;
      margin: 10mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    body {
      background: #ffffff;
      color: #0c2461;
      padding: 24px;
      font-size: 12.5px;
      line-height: 1.45;
    }
    .print-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 16px;
      background: #0c2461;
      color: #ffffff;
      border-radius: 6px;
      margin-bottom: 20px;
    }
    .print-btn {
      padding: 8px 16px;
      background: #2563eb;
      color: #ffffff;
      border: none;
      border-radius: 4px;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
    }
    .print-btn:hover { background: #1d4ed8; }
    .close-btn {
      padding: 8px 16px;
      background: #334155;
      color: #ffffff;
      border: none;
      border-radius: 4px;
      font-weight: 600;
      cursor: pointer;
      font-size: 13px;
    }
    .close-btn:hover { background: #475569; }
    .report-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #0c2461;
      padding-bottom: 12px;
      margin-bottom: 14px;
    }
    .report-title-box {
      margin-bottom: 14px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 10px 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 14px;
      font-size: 11.5px;
    }
    th {
      background: #0c2461;
      color: #ffffff;
      padding: 8px 10px;
      text-align: left;
      font-size: 11px;
      text-transform: uppercase;
      font-weight: 700;
      letter-spacing: 0.3px;
    }
    td {
      padding: 7px 10px;
      border-bottom: 1px solid #e2e8f0;
      color: #0c2461;
      vertical-align: middle;
    }
    tr:nth-child(even) td { background: #f8fafc; }
    .time-col { font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-weight: 700; color: #0c2461; }
    .level-tag { display: inline-block; padding: 1px 6px; border-radius: 4px; font-size: 10px; font-weight: 700; background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; }
    .badge { display: inline-block; padding: 2px 7px; border-radius: 999px; font-size: 10px; font-weight: 700; text-transform: uppercase; }
    .status-alive { background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; }
    .status-soon { background: #fef3c7; color: #b45309; border: 1px solid #fde68a; }
    .status-respawning { background: #cffafe; color: #0e7490; border: 1px solid #a5f3fc; }
    .report-footer {
      border-top: 1px solid #e2e8f0;
      padding-top: 10px;
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      color: #94a3b8;
    }
    @media print {
      .print-bar { display: none !important; }
      body { padding: 0; }
    }
  </style>
</head>
<body>
  <div class="print-bar">
    <div><strong>📄 ${isEn ? "BOSS TIMELINE PRO REPORT" : "BÁO CÁO LỊCH BOSS TIMELINE PRO"}</strong></div>
    <div style="display:flex; gap:10px;">
      <button class="print-btn" onclick="window.print()">🖨️ ${isEn ? "Print / Save PDF" : "In / Lưu file PDF"}</button>
      <button class="close-btn" onclick="window.close()">❌ ${isEn ? "Close" : "Đóng cửa sổ"}</button>
    </div>
  </div>

  <div class="report-header">
    <div>
      <div style="font-size:20px; font-weight:800; color:#0c2461; letter-spacing:-0.4px;">BOSS TIMELINE PRO</div>
      <div style="font-size:11px; color:#64748b; margin-top:2px;">${isEn ? "Real-time Boss Spawn & Respawn Management System" : "Hệ thống theo dõi & quản lý lịch xuất hiện Boss"}</div>
    </div>
    <div style="text-align:right; font-size:11px; color:#475569; line-height:1.6;">
      <div><strong>${isEn ? "Exported at:" : "Giờ xuất báo cáo:"}</strong> ${clockStr}</div>
      <div><strong>${isEn ? "Scope:" : "Phạm vi dữ liệu:"}</strong> ${isSingleDay ? (isEn ? "Daily Schedule (00:00 - 24:00)" : "Lịch theo ngày (00h-24h)") : (isEn ? "Full 7-Day Forecast" : "Toàn bộ lịch boss (7 Ngày)")}</div>
    </div>
  </div>

  <div class="report-title-box">
    <div>
      <div style="font-size:15px; font-weight:800; color:#0c2461;">${filterTitle}</div>
      <div style="font-size:11.5px; color:#64748b; margin-top:2px;">${filterSubDate}</div>
    </div>
    <div style="font-weight:800; font-size:13px; color:#0c2461;">${isEn ? "Total Bosses:" : "Tổng số Boss:"} ${counts.total}</div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width:5%; text-align:center;">STT</th>
        <th style="width:18%;">${isEn ? "SPAWN TIME & DATE" : "GIỜ & NGÀY HỒI SINH"}</th>
        <th style="width:8%; text-align:center;">LEVEL</th>
        <th style="width:20%;">${isEn ? "BOSS NAME" : "TÊN BOSS"}</th>
        <th style="width:15%;">${isEn ? "CYCLE" : "CHU KỲ"}</th>
        <th style="width:14%; text-align:center;">${isEn ? "STATUS" : "TRẠNG THÁI"}</th>
        <th style="width:20%;">${isEn ? "LOCATION / MAP" : "ĐỊA ĐIỂM"}</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml || `<tr><td colspan="7" style="text-align:center; padding:20px; color:#94a3b8;">${isEn ? "No bosses scheduled in the selected time range." : "Không có boss nào xuất hiện trong khoảng thời gian được chọn."}</td></tr>`}
    </tbody>
  </table>

  <div class="report-footer">
    <div>${isEn ? "Generated automatically from Boss Timeline Pro" : "Xuất tự động từ hệ thống Boss Timeline Pro"}</div>
    <div>${isEn ? "Detailed Data Report · A4 Landscape" : "Báo cáo dữ liệu chi tiết 1 trang A4 Landscape"}</div>
  </div>
</body>
</html>`;

      const reportWin = window.open("", "_blank");
      if (reportWin) {
        reportWin.document.write(reportHtml);
        reportWin.document.close();
        showToast(isEn ? "📄 Boss schedule report opened." : "📄 Đã mở trang báo cáo lịch boss.");
      } else {
        showToast(isEn ? "⚠️ Please allow popups to view the report." : "⚠️ Vui lòng cho phép trình duyệt mở tab mới để xem báo cáo.");
      }
    }

    function exportTodayScheduleCSV() {
      const now = getNow();
      const isEn = currentLang === "en";
      const rows = [
        isEn
          ? ["SPAWN TIME & DATE", "LEVEL", "BOSS", "CYCLE", "STATUS", "LOCATION", "NOTES"]
          : ["GIỜ & NGÀY HỒI SINH", "LEVEL", "BOSS", "CHU KỲ", "TRẠNG THÁI", "ĐỊA ĐIỂM", "GHI CHÚ"]
      ];

      const items = [];
      state.bosses.forEach((boss) => {
        const eventTime = getBossScheduleEventTime(boss, now, scheduleDayFilter);
        if (eventTime !== null) {
          items.push({ boss, eventTime });
        }
      });

      items.sort((a, b) => {
        if (a.eventTime && b.eventTime) return a.eventTime - b.eventTime;
        return a.boss.name.localeCompare(b.boss.name, "vi");
      });

      items.forEach(({ boss, eventTime }) => {
        const status = getBossStatus(boss, now);
        const timeFormatted = formatSmartRespawnDate(eventTime, now).replace(/<[^>]*>/g, " ");
        const cycleText = formatSpawnLabel(boss);
        let statusText = isEn ? "ALIVE" : "Đang sống";
        if (status === "respawning") statusText = isEn ? "COUNTING DOWN" : "Đang hồi sinh";
        else if (status === "soon") statusText = isEn ? "SPAWNING SOON" : "Sắp hồi sinh";

        rows.push([
          `"${timeFormatted}"`,
          `"Lv. ${boss.level || 80}"`,
          `"${boss.spawnMode === 'fixed' ? '⭐ ' : ''}${boss.name}"`,
          `"${cycleText}"`,
          `"${statusText}"`,
          `"${boss.map}"`,
          `"${(boss.notes || "").replace(/"/g, '""')}"`
        ]);
      });

      const csvContent = "\uFEFF" + rows.map((e) => e.join(",")).join("\r\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const dateIso = new Date(now).toISOString().slice(0, 10);
      link.setAttribute("href", url);
      link.setAttribute("download", `lich_boss_${scheduleDayFilter}_${dateIso}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast(isEn ? "Exported CSV schedule successfully." : "Đã xuất file CSV lịch boss thành công.");
    }

    function updateFilterState() {
      document.querySelectorAll(".filter-tab").forEach((button) => {
        button.classList.toggle("active", button.dataset.filter === activeFilter);
      });
    }

    function killBoss(id) {
      const isEn = currentLang === "en";
      if (!isAdmin()) {
        showToast(isEn ? "Only Admin can record boss deaths." : "Chỉ Admin mới có quyền ghi nhận boss chết.");
        return;
      }
      const boss = state.bosses.find((item) => item.id === id);
      if (!boss) return;

      const now = getNow();
      boss.diedAt = now;
      if (boss.spawnMode === "fixed") {
        boss.respawnsAt = getNextFixedSpawnTime(boss, now);
      } else {
        boss.respawnsAt = now + (boss.respawnMinutes || 30) * 60 * 1000;
      }
      pushHistory("death", boss, now);
      lastLocalEditTime = Date.now();
      lastRenderedGridKey = ""; // Bắt buộc render cập nhật nút và countdown tức thì
      saveState();
      render();
      sendDiscordKillAlert(boss, now, boss.respawnsAt);
      showToast(isEn ? `💀 ${boss.name} death recorded. Respawn countdown started.` : `💀 Đã ghi nhận ${boss.name} chết! Bắt đầu đếm ngược hồi sinh.`);
    }

    function reviveBoss(id) {
      const isEn = currentLang === "en";
      if (!isAdmin()) {
        showToast(isEn ? "Only Admin can revive bosses." : "Chỉ Admin mới có quyền cho hồi sinh boss.");
        return;
      }
      const boss = state.bosses.find((item) => item.id === id);
      if (!boss) return;

      const now = getNow();
      performRespawn(boss, now, "manual");
      lastLocalEditTime = Date.now();
      lastRenderedGridKey = ""; // Bắt buộc render cập nhật nút tức thì
      saveState();
      render();
      showToast(isEn ? `✨ ${boss.name} revived (READY 100%).` : `✨ Đã cho ${boss.name} hồi sinh (READY 100%)!`);
    }

    // ── OFFSET DEATH MODAL ────────────────────────────────────────
    let _offsetBossId = null;
    let _offsetMinutes = 0;

    function dateToYMD(d) {
      const date = new Date(d);
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    }

    function format24hTime(d) {
      const date = new Date(d);
      const h = String(date.getHours()).padStart(2, "0");
      const m = String(date.getMinutes()).padStart(2, "0");
      const s = String(date.getSeconds()).padStart(2, "0");
      return `${h}:${m}:${s}`;
    }

    function formatFullDateTime(d, isEn = currentLang === "en") {
      const date = new Date(d);
      if (isNaN(date.getTime())) return "--";
      const daysVi = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
      const daysEn = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const dayName = isEn ? daysEn[date.getDay()] : daysVi[date.getDay()];
      const dd = String(date.getDate()).padStart(2, "0");
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const yyyy = date.getFullYear();
      const timeStr = format24hTime(date);
      return `${dayName}, ${dd}/${mm}/${yyyy} ${timeStr}`;
    }

    function syncOffsetDateChipState(selectedYmd) {
      const today = new Date();
      document.querySelectorAll("#offsetDateGrid .offset-date-chip").forEach(chip => {
        const offsetDays = Number(chip.dataset.dayOffset || 0);
        const targetDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - offsetDays);
        const ymd = dateToYMD(targetDate);
        chip.classList.toggle("active-chip", ymd === selectedYmd);
      });
    }

    function openOffsetModal(id) {
      const isEn = currentLang === "en";
      if (!isAdmin()) {
        showToast(isEn ? "Only Admin can record boss deaths." : "Chỉ Admin mới có quyền ghi nhận boss chết.");
        requestAdminLogin();
        return;
      }
      const boss = state.bosses.find((b) => b.id === id);
      if (!boss) return;
      _offsetBossId = id;
      _offsetMinutes = 0;
      const t = TRANSLATIONS[currentLang];

      document.getElementById("offsetModalTitle").textContent = t.offsetModalTitle;
      document.getElementById("offsetModalSub").textContent = t.offsetModalSub;
      document.querySelectorAll("[data-i18n='offsetQuickPresetLabel']").forEach(el => el.textContent = t.offsetQuickPresetLabel);
      document.querySelectorAll("[data-i18n='offsetDateLabel']").forEach(el => el.textContent = t.offsetDateLabel);
      document.querySelectorAll("[data-i18n='offsetCustomLabel']").forEach(el => el.textContent = t.offsetCustomLabel);
      document.getElementById("offsetSetNowBtn").textContent = t.offsetNowBtn;
      document.getElementById("offsetCancelBtn").textContent = t.offsetCancelBtn;
      document.getElementById("offsetConfirmBtn").textContent = t.offsetConfirmBtn;

      const timeChipKeys = ["offsetNow","offset2m","offset5m","offset10m","offset15m","offset20m","offset30m","offset45m","offset60m"];
      document.querySelectorAll("#offsetPresetGrid .offset-preset-chip").forEach((chip, i) => {
        if (t[timeChipKeys[i]]) chip.textContent = t[timeChipKeys[i]];
      });

      const dateChipKeys = ["offsetDateToday", "offsetDateYesterday", "offsetDate2DaysAgo", "offsetDate3DaysAgo"];
      document.querySelectorAll("#offsetDateGrid .offset-date-chip").forEach((chip, i) => {
        if (t[dateChipKeys[i]]) chip.textContent = t[dateChipKeys[i]];
      });

      const respawnText = boss.spawnMode === "fixed"
        ? (isEn ? `Fixed ${boss.fixedTime}` : `Cố định ${boss.fixedTime}`)
        : `Respawn ${formatRespawnMinutes(boss.respawnMinutes)}`;
      document.getElementById("offsetBossInfo").innerHTML = `
        <span style="font-weight:700; color:var(--text);">${escapeHtml(boss.name)}</span>
        <span style="color:var(--muted); margin:0 6px;">·</span>
        <span style="color:var(--muted);">${escapeHtml(boss.map)}</span>
        <span style="color:var(--muted); margin:0 6px;">·</span>
        <span style="color:var(--cyan);">${respawnText}</span>
      `;

      document.querySelectorAll("#offsetPresetGrid .offset-preset-chip").forEach(chip => {
        chip.classList.toggle("active-chip", Number(chip.dataset.offset) === 0);
      });
      document.querySelectorAll("#offsetDateGrid .offset-date-chip").forEach(chip => {
        chip.classList.toggle("active-chip", Number(chip.dataset.dayOffset) === 0);
      });

      const now = new Date();
      const dateInput = document.getElementById("offsetCustomDateInput");
      if (dateInput) dateInput.value = dateToYMD(now);

      const timeInput = document.getElementById("offsetCustomTimeInput");
      if (timeInput) timeInput.value = format24hTime(now);

      updateOffsetPreview();
      document.getElementById("offsetDeathModal").classList.add("open");
    }

    function closeOffsetModal() {
      document.getElementById("offsetDeathModal").classList.remove("open");
      _offsetBossId = null;
      _offsetMinutes = 0;
    }

    function getOffsetDiedAt() {
      const dateInput = document.getElementById("offsetCustomDateInput");
      const timeInput = document.getElementById("offsetCustomTimeInput");

      const now = new Date();
      let yyyy = now.getFullYear();
      let mm = now.getMonth();
      let dd = now.getDate();

      if (dateInput && dateInput.value.trim()) {
        const dParts = dateInput.value.trim().split("-").map(Number);
        if (dParts.length === 3 && !isNaN(dParts[0]) && !isNaN(dParts[1]) && !isNaN(dParts[2])) {
          yyyy = dParts[0];
          mm = dParts[1] - 1;
          dd = dParts[2];
        }
      }

      let h = now.getHours();
      let m = now.getMinutes();
      let s = now.getSeconds();

      if (timeInput && timeInput.value.trim()) {
        const tParts = timeInput.value.trim().split(":").map(Number);
        if (tParts.length >= 2 && !isNaN(tParts[0]) && !isNaN(tParts[1])) {
          h = Math.min(23, Math.max(0, tParts[0]));
          m = Math.min(59, Math.max(0, tParts[1]));
          s = Math.min(59, Math.max(0, tParts[2] || 0));
        }
      }

      const target = new Date(yyyy, mm, dd, h, m, s, 0);
      return target.getTime();
    }

    function updateOffsetPreview() {
      const boss = state.bosses.find((b) => b.id === _offsetBossId);
      if (!boss) return;
      const isEn = currentLang === "en";
      const diedAt = getOffsetDiedAt();
      let respawnsAt;
      if (boss.spawnMode === "fixed") {
        respawnsAt = getNextFixedSpawnTime(boss, diedAt);
      } else {
        respawnsAt = diedAt + boss.respawnMinutes * 60 * 1000;
      }
      const remainingMs = respawnsAt - getNow();
      const diedFullStr = formatFullDateTime(diedAt, isEn);
      const respawnFullStr = formatFullDateTime(respawnsAt, isEn);
      const remainingStr = remainingMs <= 0
        ? (isEn ? "⚠️ Already respawned!" : "⚠️ Đã hồi sinh rồi!")
        : formatCountdown(remainingMs);

      const previewBox = document.getElementById("offsetPreviewBox");
      if (previewBox) {
        previewBox.innerHTML = isEn
          ? `<div style="display:flex; flex-direction:column; gap:5px;">
              <div>🕐 Died at: <strong>${diedFullStr}</strong></div>
              <div>⏱️ Respawn at: <strong>${respawnFullStr}</strong></div>
              <div>⌛ Remaining: <strong>${remainingStr}</strong></div>
             </div>`
          : `<div style="display:flex; flex-direction:column; gap:5px;">
              <div>🕐 Thời điểm chết: <strong>${diedFullStr}</strong></div>
              <div>⏱️ Hồi sinh lúc: <strong>${respawnFullStr}</strong></div>
              <div>⌛ Còn lại: <strong>${remainingStr}</strong></div>
             </div>`;
      }
    }

    function confirmOffsetDeath() {
      const isEn = currentLang === "en";
      if (!isAdmin()) {
        showToast(isEn ? "Only Admin can record boss deaths." : "Chỉ Admin mới có quyền ghi nhận boss chết.");
        return;
      }
      const boss = state.bosses.find((b) => b.id === _offsetBossId);
      if (!boss) return;
      const diedAt = getOffsetDiedAt();
      boss.diedAt = diedAt;
      if (boss.spawnMode === "fixed") {
        boss.respawnsAt = getNextFixedSpawnTime(boss, diedAt);
      } else {
        boss.respawnsAt = diedAt + boss.respawnMinutes * 60 * 1000;
      }
      pushHistory("death", boss, diedAt);
      lastLocalEditTime = Date.now();
      saveState();
      closeOffsetModal();
      render();
      sendDiscordKillAlert(boss, diedAt, boss.respawnsAt);
      const diedFullStr = formatFullDateTime(diedAt, isEn);
      showToast(isEn
        ? `${boss.name} recorded as dead on ${diedFullStr}. Countdown started!`
        : `${boss.name} đã ghi nhận chết vào ${diedFullStr}. Bắt đầu đếm ngược!`);
    }

    function attachTimeInputMask(input, includeSeconds = false) {
      if (!input || input.dataset.maskAttached) return;
      input.dataset.maskAttached = "true";

      input.addEventListener("input", (e) => {
        if (e.inputType === "deleteContentBackward") return;

        let val = input.value;
        let digits = val.replace(/\D/g, "");

        let maxDigits = includeSeconds ? 6 : 4;
        if (digits.length > maxDigits) digits = digits.slice(0, maxDigits);

        let h = digits.slice(0, 2);
        let m = digits.slice(2, 4);
        let s = digits.slice(4, 6);

        if (h.length === 2) {
          let numH = Number(h);
          if (numH === 24) h = "00";
          else if (numH > 23) h = "23";
        }

        if (m.length === 2 && Number(m) > 59) m = "59";
        if (s.length === 2 && Number(s) > 59) s = "59";

        let formatted = "";
        if (digits.length === 0) {
          formatted = "";
        } else if (digits.length < 2) {
          formatted = h;
        } else if (digits.length === 2) {
          formatted = h + ":";
        } else if (digits.length < 4) {
          formatted = `${h}:${m}`;
        } else if (digits.length === 4) {
          formatted = `${h}:${m}` + (includeSeconds ? ":" : "");
        } else {
          formatted = `${h}:${m}:${s}`;
        }

        input.value = formatted;
      });

      input.addEventListener("blur", () => {
        let val = input.value.trim();
        if (!val) return;
        let parts = val.split(":").filter(Boolean);
        let numH = Number(parts[0]) || 0;
        let h = String(numH === 24 ? 0 : Math.min(23, Math.max(0, numH))).padStart(2, "0");
        let m = String(Math.min(59, Math.max(0, Number(parts[1]) || 0))).padStart(2, "0");
        if (includeSeconds) {
          let s = String(Math.min(59, Math.max(0, Number(parts[2]) || 0))).padStart(2, "0");
          input.value = `${h}:${m}:${s}`;
        } else {
          input.value = `${h}:${m}`;
        }
      });
    }

    function initOffsetModal() {
      const offsetDateInput = document.getElementById("offsetCustomDateInput");
      const offsetTimeInput = document.getElementById("offsetCustomTimeInput");
      attachTimeInputMask(offsetTimeInput, true);

      // Quick time offsets
      document.getElementById("offsetPresetGrid")?.addEventListener("click", (e) => {
        const chip = e.target.closest(".offset-preset-chip");
        if (!chip) return;
        _offsetMinutes = Number(chip.dataset.offset);
        const targetD = new Date(getNow() - _offsetMinutes * 60 * 1000);
        
        if (offsetDateInput) {
          offsetDateInput.value = dateToYMD(targetD);
          syncOffsetDateChipState(offsetDateInput.value);
        }
        if (offsetTimeInput) {
          offsetTimeInput.value = format24hTime(targetD);
        }
        document.querySelectorAll("#offsetPresetGrid .offset-preset-chip").forEach(c => c.classList.toggle("active-chip", c === chip));
        updateOffsetPreview();
      });

      // Quick date chips
      document.getElementById("offsetDateGrid")?.addEventListener("click", (e) => {
        const chip = e.target.closest(".offset-date-chip");
        if (!chip) return;
        const offsetDays = Number(chip.dataset.dayOffset || 0);
        const today = new Date();
        const targetDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - offsetDays);
        if (offsetDateInput) {
          offsetDateInput.value = dateToYMD(targetDate);
        }
        document.querySelectorAll("#offsetDateGrid .offset-date-chip").forEach(c => c.classList.toggle("active-chip", c === chip));
        document.querySelectorAll("#offsetPresetGrid .offset-preset-chip").forEach(c => c.classList.remove("active-chip"));
        updateOffsetPreview();
      });

      // Date input change
      offsetDateInput?.addEventListener("change", () => {
        syncOffsetDateChipState(offsetDateInput.value);
        document.querySelectorAll("#offsetPresetGrid .offset-preset-chip").forEach(c => c.classList.remove("active-chip"));
        updateOffsetPreview();
      });

      // Time input input/change
      offsetTimeInput?.addEventListener("input", () => {
        document.querySelectorAll("#offsetPresetGrid .offset-preset-chip").forEach(c => c.classList.remove("active-chip"));
        updateOffsetPreview();
      });

      // Set now button
      document.getElementById("offsetSetNowBtn")?.addEventListener("click", () => {
        const now = new Date();
        if (offsetDateInput) {
          offsetDateInput.value = dateToYMD(now);
          syncOffsetDateChipState(offsetDateInput.value);
        }
        if (offsetTimeInput) {
          offsetTimeInput.value = format24hTime(now);
        }
        document.querySelectorAll("#offsetPresetGrid .offset-preset-chip").forEach(c => c.classList.toggle("active-chip", Number(c.dataset.offset) === 0));
        _offsetMinutes = 0;
        updateOffsetPreview();
      });

      document.getElementById("offsetConfirmBtn")?.addEventListener("click", confirmOffsetDeath);
      document.getElementById("offsetCancelBtn")?.addEventListener("click", closeOffsetModal);
      document.getElementById("closeOffsetModalBtn")?.addEventListener("click", closeOffsetModal);

      document.getElementById("offsetDeathModal")?.addEventListener("click", (e) => {
        if (e.target === document.getElementById("offsetDeathModal")) closeOffsetModal();
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && document.getElementById("offsetDeathModal")?.classList.contains("open")) closeOffsetModal();
      });
    }

    function createFixedSlotRowHtml(slot = { day: "all", time: "18:00" }) {
      const isEn = currentLang === "en";
      const selDay = String(slot.day ?? "all");
      const timeVal = slot.time || "18:00";

      return `
        <div class="fixed-slot-row">
          <select class="fixed-day-select">
            <option value="all" ${selDay === "all" ? "selected" : ""}>${isEn ? "Every Day (All Days)" : "Hàng ngày (Tất cả các ngày)"}</option>
            <option value="1" ${selDay === "1" ? "selected" : ""}>${isEn ? "Monday (Mon)" : "Thứ 2 (Thứ Hai)"}</option>
            <option value="2" ${selDay === "2" ? "selected" : ""}>${isEn ? "Tuesday (Tue)" : "Thứ 3 (Thứ Ba)"}</option>
            <option value="3" ${selDay === "3" ? "selected" : ""}>${isEn ? "Wednesday (Wed)" : "Thứ 4 (Thứ Tư)"}</option>
            <option value="4" ${selDay === "4" ? "selected" : ""}>${isEn ? "Thursday (Thu)" : "Thứ 5 (Thứ Năm)"}</option>
            <option value="5" ${selDay === "5" ? "selected" : ""}>${isEn ? "Friday (Fri)" : "Thứ 6 (Thứ Sáu)"}</option>
            <option value="6" ${selDay === "6" ? "selected" : ""}>${isEn ? "Saturday (Sat)" : "Thứ 7 (Thứ Bảy)"}</option>
            <option value="0" ${selDay === "0" ? "selected" : ""}>${isEn ? "Sunday (Sun)" : "Chủ Nhật (CN)"}</option>
          </select>
          <input type="text" class="fixed-time-input" value="${timeVal}" placeholder="18:00 (24h)" maxlength="5" style="width:110px; font-weight:700; font-family:monospace; text-align:center;">
          <button type="button" class="btn-remove-slot" title="${isEn ? "Delete slot" : "Xóa mốc giờ"}">
            <svg viewBox="0 0 24 24" fill="none" width="14" height="14" style="margin-right:2px;"><path d="M3 6h18M8 6V4h8v2m-1 4v8M9 10v8M5 6l1 15h12l1-15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            ${isEn ? "Delete" : "Xóa"}
          </button>
        </div>
      `;
    }

    function populateFixedSlotsInModal(schedules = []) {
      const container = document.getElementById("fixedSlotsList");
      if (!container) return;
      const list = schedules.length ? schedules : [{ day: "all", time: "18:00" }];
      container.innerHTML = list.map(s => createFixedSlotRowHtml(s)).join("");
      container.querySelectorAll(".fixed-time-input").forEach(inp => attachTimeInputMask(inp, false));
    }

    function addFixedSlotRow(day = "all", time = "18:00") {
      const container = document.getElementById("fixedSlotsList");
      if (!container) return;
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = createFixedSlotRowHtml({ day, time });
      const newRow = tempDiv.firstElementChild;
      container.appendChild(newRow);
      const inp = newRow.querySelector(".fixed-time-input");
      if (inp) attachTimeInputMask(inp, false);
    }

    function openModal(id = null) {
      if (!isAdmin()) {
        showToast("Chỉ Admin mới có quyền thêm hoặc chỉnh sửa boss.");
        return;
      }
      editingBossId = id;
      const boss = id ? state.bosses.find((item) => item.id === id) : null;
      elements.modalTitle.textContent = boss ? "Chỉnh sửa boss" : "Thêm boss";
      elements.modalHint.textContent = boss ? "Cập nhật thông tin boss và thời gian hồi sinh." : "Nhập thông tin boss và chọn loại thời gian xuất hiện.";
      elements.deleteBossBtn.hidden = !boss;
      elements.bossForm.reset();

      elements.bossForm.elements.name.value = boss?.name || "";
      elements.bossForm.elements.map.value = boss?.map || "";
      elements.bossForm.elements.level.value = boss ? (boss.level || 80) : 80;
      elements.bossForm.elements.respawnMinutes.value = boss?.respawnMinutes || 30;
      if (elements.bossForm.elements.avatar) elements.bossForm.elements.avatar.value = boss?.avatar || "ember";
      elements.bossForm.elements.notes.value = boss?.notes || "";

      setSpawnModeInModal(boss?.spawnMode || "interval");
      populateFixedSlotsInModal(boss?.fixedSchedules || []);

      elements.modal.classList.add("open");
      syncModalScrollLock();
      window.setTimeout(() => elements.bossForm.elements.name.focus(), 40);
    }

    function setSpawnModeInModal(mode) {
      document.querySelectorAll(".spawn-mode-option").forEach((opt) => {
        const isMatch = opt.dataset.mode === mode;
        const radio = opt.querySelector("input[type=radio]");
        if (radio) radio.checked = isMatch;
        opt.classList.toggle("selected", isMatch);
      });
      if (elements.respawnMinutesField) {
        elements.respawnMinutesField.style.display = mode === "interval" ? "" : "none";
      }
      if (elements.fixedScheduleContainer) {
        elements.fixedScheduleContainer.style.display = mode === "fixed" ? "" : "none";
      }
    }

    function closeModal() {
      elements.modal.classList.remove("open");
      syncModalScrollLock();
      editingBossId = null;
    }

    function handleFormSubmit(event) {
      event.preventDefault();
      if (!isAdmin()) {
        showToast("Chỉ Admin mới có quyền lưu thông tin boss.");
        return;
      }
      const form = elements.bossForm;
      const selectedModeRadio = form.querySelector('input[name="spawnMode"]:checked');
      const spawnMode = selectedModeRadio ? selectedModeRadio.value : "interval";

      const fixedSchedules = [];
      document.querySelectorAll("#fixedSlotsList .fixed-slot-row").forEach((row) => {
        const dayVal = row.querySelector(".fixed-day-select")?.value || "all";
        const timeVal = row.querySelector(".fixed-time-input")?.value || "18:00";
        fixedSchedules.push({
          day: dayVal === "all" ? "all" : Number(dayVal),
          time: timeVal
        });
      });

      const payload = {
        name: form.elements.name.value.trim(),
        map: form.elements.map.value.trim(),
        level: clamp(Number(form.elements.level.value) || 80, 1, 999),
        spawnMode: spawnMode,
        respawnMinutes: clamp(Number(form.elements.respawnMinutes.value) || 30, 1, 10080),
        fixedSchedules: fixedSchedules.length ? fixedSchedules : [{ day: "all", time: "18:00" }],
        avatar: form.elements.avatar ? form.elements.avatar.value : (editingBossId ? (state.bosses.find((b) => b.id === editingBossId)?.avatar || "ember") : "ember"),
        notes: form.elements.notes.value.trim()
      };

      if (!payload.name || !payload.map) {
        showToast("Vui lòng nhập đủ tên boss và khu vực/map.");
        return;
      }

      if (editingBossId) {
        const boss = state.bosses.find((item) => item.id === editingBossId);
        if (boss) {
          Object.assign(boss, normalizeBoss({ ...boss, ...payload }));
          showToast("Đã cập nhật thông tin boss.");
        }
      } else {
        const newBoss = normalizeBoss({
          id: makeId(),
          ...payload,
          diedAt: null,
          respawnsAt: null,
          lastRespawnAt: null
        });
        state.bosses.unshift(newBoss);
        showToast("Đã thêm boss mới.");
      }

      saveState();
      closeModal();
      render();
    }

    function showConfirmModal({ title, subtitle, message, confirmText = "Đồng ý", cancelText = "Hủy bỏ", isDanger = true }) {
      return new Promise((resolve) => {
        const modal = document.getElementById("customConfirmModal");
        const titleEl = document.getElementById("confirmModalTitle");
        const subEl = document.getElementById("confirmModalSub");
        const msgEl = document.getElementById("confirmModalMessage");
        const okBtn = document.getElementById("confirmModalOkBtn");
        const cancelBtn = document.getElementById("confirmModalCancelBtn");
        const iconBadge = document.getElementById("confirmModalIcon");

        titleEl.textContent = title || "Xác nhận thao tác";
        subEl.textContent = subtitle || "";
        msgEl.innerHTML = message || "";
        okBtn.textContent = confirmText;
        cancelBtn.textContent = cancelText;

        if (isDanger) {
          okBtn.className = "button-danger";
          iconBadge.className = "confirm-icon-badge danger";
        } else {
          okBtn.className = "button-primary";
          iconBadge.className = "confirm-icon-badge primary";
        }

        modal.classList.add("open");
        syncModalScrollLock();

        const cleanup = (result) => {
          modal.classList.remove("open");
          syncModalScrollLock();
          okBtn.removeEventListener("click", onOk);
          cancelBtn.removeEventListener("click", onCancel);
          modal.removeEventListener("click", onBackdrop);
          resolve(result);
        };

        const onOk = () => cleanup(true);
        const onCancel = () => cleanup(false);
        const onBackdrop = (e) => {
          if (e.target === modal) cleanup(false);
        };

        okBtn.addEventListener("click", onOk);
        cancelBtn.addEventListener("click", onCancel);
        modal.addEventListener("click", onBackdrop);
      });
    }

    async function deleteActiveBoss() {
      const isEn = currentLang === "en";
      if (!isAdmin()) {
        showToast(isEn ? "Only Admin can delete bosses." : "Chỉ Admin mới có quyền xóa boss.");
        return;
      }
      if (!editingBossId) return;
      const boss = state.bosses.find((item) => item.id === editingBossId);
      if (!boss) return;

      const confirmed = await showConfirmModal({
        title: isEn ? `Delete boss ${boss.name}?` : `Xóa boss ${boss.name}?`,
        subtitle: isEn ? `This action will permanently remove ${boss.name}.` : `Hành động này sẽ xóa vĩnh viễn ${boss.name} khỏi hệ thống.`,
        message: isEn
          ? `Are you sure you want to delete <strong>${escapeHtml(boss.name)}</strong> (Lv.${boss.level || 80} - ${escapeHtml(boss.map)}) from the tracker?`
          : `Bạn có chắc chắn muốn xóa <strong>${escapeHtml(boss.name)}</strong> (Lv.${boss.level || 80} - ${escapeHtml(boss.map)}) khỏi danh sách theo dõi của team?`,
        confirmText: isEn ? "🗑️ Delete Boss" : "🗑️ Xóa boss",
        cancelText: isEn ? "Cancel" : "Hủy bỏ",
        isDanger: true
      });
      if (!confirmed) return;

      state.bosses = state.bosses.filter((item) => item.id !== editingBossId);
      saveState();
      closeModal();
      render();
      showToast(isEn ? "Deleted boss from tracker." : "Đã xóa boss khỏi danh sách.");
    }

    async function resetAllTimers() {
      const isEn = currentLang === "en";
      if (!isAdmin()) {
        showToast(isEn ? "Only Admin can reset boss timers after maintenance." : "Chỉ Admin mới có quyền reset thời gian boss sau bảo trì.");
        return;
      }

      const confirmed = await showConfirmModal({
        title: isEn ? "💥 SERVER MAINTENANCE FINISHED?" : "💥 BẢO TRÌ SERVER GAME XONG?",
        subtitle: isEn ? "Reset all bosses to ALIVE state (Ready to spawn)." : "Đặt lại toàn bộ boss về trạng thái SỐNG (Sẵn sàng xuất hiện).",
        message: isEn
          ? "This action will set <strong>ALL BOSSES</strong> to <strong>ALIVE</strong> state and clear all countdowns.<br><br><span style='color:var(--green); font-weight:600;'>✓ Boss list, level, map and notes remain 100% intact.</span>"
          : "Thao tác này sẽ chuyển <strong>TOÀN BỘ BOSS</strong> hiện tại về trạng thái <strong>SỐNG</strong> và xóa đếm ngược của tất cả boss.<br><br><span style='color:var(--green); font-weight:600;'>✓ Danh sách boss, level, map và ghi chú của bạn vẫn giữ nguyên 100%.</span>",
        confirmText: isEn ? "💥 Reset All Bosses" : "💥 Reset tất cả Boss",
        cancelText: isEn ? "Cancel" : "Hủy bỏ",
        isDanger: true
      });
      if (!confirmed) return;

      const now = getNow();
      state.bosses.forEach((boss) => {
        boss.diedAt = null;
        boss.respawnsAt = null;
        boss.lastRespawnAt = now;
      });

      state.history.unshift({
        id: "history_" + Math.random().toString(36).slice(2, 9),
        type: "respawn",
        bossId: "all",
        bossName: isEn ? "⚡ ALL BOSSES" : "⚡ TẤT CẢ BOSS",
        map: isEn ? "Server Maintenance Complete" : "Bảo trì Server xong",
        time: now
      });
      state.history = state.history.slice(0, 30);

      saveState();
      render();
      showToast(isEn ? "⚡ Reset all Bosses to ALIVE state after maintenance!" : "⚡ Đã reset tất cả Boss về trạng thái SỐNG sau bảo trì!");
    }

    async function clearHistory() {
      const isEn = currentLang === "en";
      if (!isAdmin()) {
        showToast(isEn ? "Only Admin can clear timeline history." : "Chỉ Admin mới có quyền xóa lịch sử timeline.");
        return;
      }
      if (!state.history.length) return;

      const confirmed = await showConfirmModal({
        title: isEn ? "Clear all timeline history?" : "Xóa toàn bộ lịch sử timeline?",
        subtitle: isEn ? "Death and respawn event logs will be wiped." : "Lịch sử chết và hồi sinh của boss sẽ bị dọn dẹp.",
        message: isEn
          ? "Are you sure you want to completely wipe the <strong>recent timeline history log</strong>?"
          : "Bạn có chắc chắn muốn xóa sạch <strong>toàn bộ nhật ký lịch sử</strong> timeline gần đây không?",
        confirmText: isEn ? "🧹 Clear History" : "🧹 Xóa lịch sử",
        cancelText: isEn ? "Cancel" : "Hủy bỏ",
        isDanger: true
      });
      if (!confirmed) return;

      state.history = [];
      saveState();
      render();
      showToast(isEn ? "Timeline history cleared." : "Đã xóa lịch sử timeline.");
    }


    function showToast(message) {
      window.clearTimeout(toastTimer);
      elements.toast.textContent = message;
      elements.toast.classList.add("show");
      toastTimer = window.setTimeout(() => {
        elements.toast.classList.remove("show");
      }, 2600);
    }

    function toggleTodaySchedule(open = null) {
      if (!elements.todaySchedulePanel) return;
      const isOpen = open !== null ? open : !elements.todaySchedulePanel.classList.contains("open");
      elements.todaySchedulePanel.classList.toggle("open", isOpen);
      if (elements.todayScheduleToggle) {
        elements.todayScheduleToggle.setAttribute("aria-expanded", String(isOpen));
      }
    }

    const realtimeStatusEl = document.getElementById("realtimeStatus");
    if (realtimeStatusEl) {
      realtimeStatusEl.style.cursor = "pointer";
      realtimeStatusEl.addEventListener("click", () => {
        if (!REALTIME_ENABLED) {
          alert("⚡ HƯỚNG DẪN BẬT ĐỒNG BỘ TEAM (GOOGLE FIREBASE REALTIME):\n\n1. Tạo dự án miễn phí tại https://console.firebase.google.com\n2. Bật Realtime Database trong mục Build -> Realtime Database (chọn chế độ test mode).\n3. Mở file 'firebase-config.js' trong thư mục web app và dán cấu hình Firebase của bạn vào.\n4. Mở trang web này trên các máy để bắt đầu tự động đồng bộ Realtime!");
        } else if (remoteStateReady) {
          showToast("🟢 Google Firebase Realtime đang hoạt động. Mọi thay đổi sẽ đồng bộ tức thì cho cả team.");
        } else {
          showToast("🔄 Đang kết nối lại Google Firebase Realtime...");
          initRealtimeSync();
        }
      });
    }

    document.querySelectorAll(".role-btn").forEach((btn) => {

      btn.addEventListener("click", () => {
        if (btn.dataset.role === currentRole) {
          if (btn.dataset.role === "admin" && currentUserIsSuperAdmin) openAdminAccModal();
          return;
        }
        if (btn.dataset.role === "admin") {
          requestAdminLogin();
          return;
        }
        enterMemberMode();
      });
    });

    elements.chooseAdminBtn.addEventListener("click", requestAdminLogin);
    elements.chooseMemberBtn.addEventListener("click", enterMemberMode);
    [elements.chooseAdminBtn, elements.chooseMemberBtn].forEach((card) => {
      card.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        card.click();
      });
    });

    elements.adminLoginBackBtn.addEventListener("click", () => openAuthModal("choose"));
    elements.togglePasswordVisBtn.addEventListener("click", () => {
      const isHidden = elements.adminPasswordInput.type === "password";
      elements.adminPasswordInput.type = isHidden ? "text" : "password";
      elements.togglePasswordVisBtn.setAttribute("aria-label", isHidden ? "Ẩn mật khẩu" : "Hiện mật khẩu");
      elements.adminPasswordInput.focus();
    });
    elements.adminPasswordInput.addEventListener("input", () => {
      elements.adminLoginError.style.display = "none";
    });
    document.getElementById("forgotAdminPasswordBtn")?.addEventListener("click", async () => {
      const email = elements.adminEmailInput?.value.trim();
      const errEl = elements.adminLoginError;
      const button = document.getElementById("forgotAdminPasswordBtn");
      if (!email) {
        if (errEl) {
          errEl.querySelector("span").textContent = "Vui lòng nhập email Admin trước.";
          errEl.style.display = "flex";
        }
        elements.adminEmailInput?.focus();
        return;
      }
      if (!firebaseAuth) return;
      if (button) button.disabled = true;
      try {
        await firebaseAuth.sendPasswordResetEmail(email);
        if (errEl) errEl.style.display = "none";
        showToast("📧 Đã gửi email đặt lại mật khẩu. Hãy kiểm tra Hộp thư đến hoặc Spam.");
      } catch (error) {
        console.error("Firebase password reset error:", error?.code || error);
        if (errEl) {
          const resetMessages = {
            "auth/invalid-email": "Email không hợp lệ.",
            "auth/user-not-found": "Không tìm thấy tài khoản với email này.",
            "auth/too-many-requests": "Đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau."
          };
          errEl.querySelector("span").textContent = resetMessages[error?.code] || "Không thể gửi email đặt lại mật khẩu.";
          errEl.style.display = "flex";
        }
      } finally {
        if (button) button.disabled = false;
      }
    });
    elements.adminLoginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const email = elements.adminEmailInput?.value.trim();
      const enteredPass = elements.adminPasswordInput.value;
      const submitBtn = elements.adminLoginForm.querySelector('button[type="submit"]');
      const errEl = elements.adminLoginError;

      if (!firebaseAuth) {
        if (errEl) {
          errEl.querySelector("span").textContent = "Firebase Authentication chưa được tải.";
          errEl.style.display = "flex";
        }
        return;
      }

      if (submitBtn) submitBtn.disabled = true;
      try {
        const credential = await firebaseAuth.signInWithEmailAndPassword(email, enteredPass);
        const access = await getFirebaseAdminAccess(credential.user, true);
        if (!access.allowed) {
          currentUserIsAdmin = false;
          currentUserIsSuperAdmin = false;
          await submitAdminAccessRequest(credential.user);
          await firebaseAuth.signOut();
          throw Object.assign(new Error("Admin approval requested"), { code: "auth/admin-requested" });
        }
        currentUserIsAdmin = true;
        currentUserIsSuperAdmin = access.superAdmin;
        setRole("admin", credential.user.displayName || credential.user.email || "Admin");
        elements.adminPasswordInput.value = "";
        closeAuthModal();
      } catch (error) {
        console.error("Firebase admin sign-in error:", error?.code || error);
        if (errEl) {
          const messages = {
            "auth/invalid-email": "Email Admin không hợp lệ.",
            "auth/user-disabled": "Tài khoản Admin đã bị vô hiệu hóa.",
            "auth/too-many-requests": "Đăng nhập sai quá nhiều lần. Vui lòng thử lại sau.",
            "auth/operation-not-allowed": "Chưa bật Email/Password trong Firebase Authentication.",
            "auth/admin-requested": "Đã gửi yêu cầu quyền Admin. Hãy nhờ Admin chính phê duyệt rồi đăng nhập lại.",
            "auth/not-admin": "Tài khoản này chưa được cấp quyền Admin.",
            "auth/invalid-login-credentials": "Email hoặc mật khẩu không chính xác.",
            "auth/wrong-password": "Email hoặc mật khẩu không chính xác.",
            "auth/user-not-found": "Email hoặc mật khẩu không chính xác."
          };
          errEl.querySelector("span").textContent = messages[error?.code] || "Không thể đăng nhập Firebase. Vui lòng thử lại.";
          errEl.style.display = "flex";
        }
        elements.adminPasswordInput.select();
        elements.adminPasswordInput.focus();
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });

    document.getElementById("gotoRegisterBtn")?.addEventListener("click", () => {
      showAuthStep("register");
    });

    document.getElementById("regBackBtn")?.addEventListener("click", () => {
      showAuthStep("admin");
    });

    document.getElementById("adminRegForm")?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const form = e.currentTarget;
      const emailInput = document.getElementById("regAdminEmail");
      const nameInput = document.getElementById("regAdminName");
      const passInput = document.getElementById("regAdminPass");
      const confirmInput = document.getElementById("regAdminPassConfirm");
      const errEl = document.getElementById("regAdminError");
      const submitBtn = form.querySelector('button[type="submit"]');
      const email = emailInput?.value.trim();
      const name = nameInput?.value.trim();
      const pass = passInput?.value || "";
      const confirmPass = confirmInput?.value || "";

      if (!email || !name || !pass || !confirmPass) {
        errEl.textContent = "Vui lòng nhập đầy đủ thông tin.";
        errEl.style.display = "block";
        return;
      }
      if (pass.length < 6) {
        errEl.textContent = "Mật khẩu phải có ít nhất 6 ký tự.";
        errEl.style.display = "block";
        return;
      }
      if (pass !== confirmPass) {
        errEl.textContent = "Hai mật khẩu không giống nhau.";
        errEl.style.display = "block";
        return;
      }
      if (!firebaseAuth) return;
      if (submitBtn) submitBtn.disabled = true;
      try {
        const credential = await firebaseAuth.createUserWithEmailAndPassword(email, pass);
        await credential.user.updateProfile({ displayName: name });
        await credential.user.getIdToken(true);
        await submitAdminAccessRequest(credential.user);
        await firebaseAuth.signOut();
        form.reset();
        errEl.style.display = "none";
        elements.adminEmailInput.value = email;
        showAuthStep("admin");
        showToast("⏳ Đã tạo tài khoản và gửi yêu cầu. Hãy chờ Admin chính phê duyệt.");
      } catch (error) {
        console.error("Firebase secondary admin registration error:", error?.code || error);
        const messages = {
          "auth/email-already-in-use": "Email này đã có tài khoản. Hãy đăng nhập để gửi yêu cầu.",
          "auth/invalid-email": "Email không hợp lệ.",
          "auth/weak-password": "Mật khẩu quá yếu, cần ít nhất 6 ký tự.",
          "auth/operation-not-allowed": "Firebase chưa cho phép đăng ký bằng Email/Password."
        };
        errEl.textContent = messages[error?.code] || "Không thể tạo tài khoản. Vui lòng thử lại.";
        errEl.style.display = "block";
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });

    // ── Kill Confirm Modal Listeners ──
    document.getElementById("killConfirmOkBtn")?.addEventListener("click", () => {
      killBossConfirmed();
    });
    document.getElementById("killConfirmCancelBtn")?.addEventListener("click", () => {
      const modal = document.getElementById("killConfirmModal");
      if (modal) modal.classList.remove("open");
      syncModalScrollLock();
      _pendingKillBossId = null;
    });

    // ── Revive Confirm Modal Listeners ──
    document.getElementById("reviveConfirmOkBtn")?.addEventListener("click", () => {
      reviveBossConfirmed();
    });
    document.getElementById("reviveConfirmCancelBtn")?.addEventListener("click", () => {
      const modal = document.getElementById("reviveConfirmModal");
      if (modal) modal.classList.remove("open");
      syncModalScrollLock();
      _pendingReviveBossId = null;
    });

    // ── Admin Account Manager Logic ──
    async function renderAdminAccList() {
      const containerActive = document.getElementById("adminAccList");
      const containerPending = document.getElementById("adminPendingList");
      const pendingSection = document.getElementById("adminPendingSection");
      const badgeCount = document.getElementById("pendingBadgeCount");
      if (!containerActive || !containerPending) return;
      if (!currentUserIsSuperAdmin || !firebaseDb) return;

      containerActive.innerHTML = `<div style="padding:12px;text-align:center;color:var(--muted);">Đang tải...</div>`;
      const [pendingSnapshot, approvedSnapshot] = await Promise.all([
        firebaseDb.ref("admin_requests").once("value"),
        firebaseDb.ref("admin_access").once("value")
      ]);
      const pendingAccs = Object.entries(pendingSnapshot.val() || {}).map(([uid, value]) => ({ uid, ...value }));
      const approvedAccs = Object.entries(approvedSnapshot.val() || {}).map(([uid, value]) => ({ uid, ...value })).filter(a => a.active === true);

      // Pending Section
      if (pendingAccs.length > 0) {
        if (pendingSection) pendingSection.style.display = "block";
        if (badgeCount) badgeCount.textContent = pendingAccs.length;

        containerPending.innerHTML = pendingAccs.map((acc) => `
          <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 14px;background:var(--amber-soft);border:1px solid rgba(245,158,11,0.4);border-radius:6px;margin-bottom:8px;gap:10px;">
            <div style="min-width:0;flex:1;">
              <strong style="font-size:14px;color:var(--amber);">${escapeHtml(acc.name || acc.email || "Admin mới")}</strong>
              <span style="display:block;font-size:12px;color:var(--text-2);margin-top:2px;">${escapeHtml(acc.email || "")}</span>
              <span style="display:block;font-size:11px;color:var(--muted);margin-top:2px;">⏱️ Gửi lúc ${formatShortDate(acc.requestedAt || Date.now())}</span>
            </div>
            <div style="display:flex;gap:6px;flex:0 0 auto;">
              <button type="button" class="button-primary" data-approve-uid="${escapeHtml(acc.uid)}" style="padding:5px 12px;font-size:12px;background:var(--green);border-color:var(--green);display:inline-flex;align-items:center;gap:4px;">
                <svg viewBox="0 0 24 24" fill="none" width="13" height="13"><path d="M5 12l4 4L19 6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>
                Phê duyệt
              </button>
              <button type="button" class="button-danger" data-reject-uid="${escapeHtml(acc.uid)}" style="padding:5px 10px;font-size:12px;display:inline-flex;align-items:center;gap:4px;">
                Xóa
              </button>
            </div>
          </div>
        `).join("");
      } else {
        if (pendingSection) pendingSection.style.display = "none";
        containerPending.innerHTML = "";
      }

      // Active Section
      let activeHtml = `
        <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:var(--surface-2);border:1px solid var(--line-soft);border-radius:6px;margin-bottom:8px;">
          <div style="display:flex;align-items:center;gap:10px;">
            <span style="font-size:16px;">👑</span>
            <div>
              <strong style="font-size:14px;color:var(--text);">${escapeHtml(SUPER_ADMIN_NAME)}</strong>
              <span style="display:block;font-size:11px;color:var(--muted);">Tài khoản Quản trị tối cao (Mặc định)</span>
            </div>
          </div>
          <span style="font-size:11px;font-weight:700;color:var(--cyan);background:var(--cyan-soft);padding:3px 8px;border-radius:4px;">Cố định</span>
        </div>
      `;

      if (!approvedAccs.length) {
        activeHtml += `<div style="font-size:13px;color:var(--muted);text-align:center;padding:12px;">Chưa có tài khoản Admin phụ nào được phê duyệt.</div>`;
      } else {
        activeHtml += approvedAccs.map((acc) => `
          <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:var(--surface-2);border:1px solid var(--line-soft);border-radius:6px;margin-bottom:8px;">
            <div style="display:flex;align-items:center;gap:10px;">
              <span style="font-size:16px;">👤</span>
              <div>
                <strong style="font-size:14px;color:var(--text);">${escapeHtml(acc.name || acc.email || "Admin phụ")}</strong>
                <span style="display:block;font-size:11px;color:var(--muted);">${escapeHtml(acc.email || "")}</span>
                <span style="display:block;font-size:11px;color:var(--green);font-weight:600;">✓ Đã phê duyệt</span>
              </div>
            </div>
            <button type="button" class="button-danger" data-revoke-uid="${escapeHtml(acc.uid)}" style="padding:4px 10px;font-size:12px;display:inline-flex;align-items:center;gap:4px;">
              <svg viewBox="0 0 24 24" fill="none" width="13" height="13"><path d="M3 6h18M8 6V4h8v2m-1 4v8M9 10v8M5 6l1 15h12l1-15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              Thu hồi / Xóa
            </button>
          </div>
        `).join("");
      }

      containerActive.innerHTML = activeHtml;
    }

    function isSuperAdmin() {
      return isAdmin() && currentUserIsSuperAdmin;
    }

    function openAdminAccModal() {
      renderAdminAccList().catch(error => {
        console.error("Admin list load error:", error);
        showToast("Không thể tải danh sách Admin từ Firebase.");
      });
      const modal = document.getElementById("adminAccountModal");
      if (modal) modal.classList.add("open");
      syncModalScrollLock();
    }

    document.getElementById("closeAdminAccModal")?.addEventListener("click", () => {
      const modal = document.getElementById("adminAccountModal");
      if (modal) modal.classList.remove("open");
      syncModalScrollLock();
      populateAdminNameDropdown();
    });

    let pendingAdminRevoke = null;

    function closeAdminRevokeConfirm() {
      document.getElementById("adminRevokeConfirmModal")?.classList.remove("open");
      pendingAdminRevoke = null;
      syncModalScrollLock();
    }

    document.getElementById("adminAccountModal")?.addEventListener("click", async (e) => {
      const approveBtn = e.target.closest("[data-approve-uid]");
      const rejectBtn = e.target.closest("[data-reject-uid]");
      const revokeBtn = e.target.closest("[data-revoke-uid]");
      if (!approveBtn && !rejectBtn && !revokeBtn) return;
      if (!isSuperAdmin() || !firebaseDb) return;

      try {
        if (approveBtn) {
          const uid = approveBtn.dataset.approveUid;
          const requestSnapshot = await firebaseDb.ref(`admin_requests/${uid}`).once("value");
          const request = requestSnapshot.val();
          if (!request) return;
          await firebaseDb.ref().update({
            [`admin_access/${uid}`]: {
              active: true,
              email: request.email || "",
              name: request.name || request.email || "Admin phụ",
              approvedAt: firebase.database.ServerValue.TIMESTAMP,
              approvedBy: firebaseAuth.currentUser.uid
            },
            [`admin_requests/${uid}`]: null
          });
          showToast(`🟢 Đã phê duyệt Admin: ${request.email || request.name}`);
        } else if (rejectBtn) {
          await firebaseDb.ref(`admin_requests/${rejectBtn.dataset.rejectUid}`).remove();
          showToast("🗑️ Đã từ chối yêu cầu Admin.");
        } else {
          const row = revokeBtn.closest("div[style*='justify-content:space-between']");
          const label = row?.querySelector("strong")?.textContent?.trim() || "Admin phụ này";
          pendingAdminRevoke = { uid: revokeBtn.dataset.revokeUid, label };
          const target = document.getElementById("adminRevokeTarget");
          if (target) target.textContent = label;
          document.getElementById("adminRevokeConfirmModal")?.classList.add("open");
          syncModalScrollLock();
          return;
        }
        await renderAdminAccList();
      } catch (error) {
        console.error("Admin approval error:", error);
        showToast("Không thể cập nhật quyền Admin. Hãy kiểm tra Firebase Rules.");
      }
    });

    document.getElementById("adminRevokeCancelBtn")?.addEventListener("click", closeAdminRevokeConfirm);
    document.getElementById("adminRevokeConfirmModal")?.addEventListener("click", (event) => {
      if (event.target === event.currentTarget) closeAdminRevokeConfirm();
    });
    document.getElementById("adminRevokeConfirmBtn")?.addEventListener("click", async () => {
      if (!pendingAdminRevoke || !isSuperAdmin() || !firebaseDb) return;
      const { uid, label } = pendingAdminRevoke;
      const confirmBtn = document.getElementById("adminRevokeConfirmBtn");
      if (confirmBtn) confirmBtn.disabled = true;
      try {
        await firebaseDb.ref(`admin_access/${uid}`).remove();
        closeAdminRevokeConfirm();
        await renderAdminAccList();
        showToast(`🔒 Đã thu hồi quyền Admin của ${label}.`);
      } catch (error) {
        console.error("Admin revoke error:", error);
        showToast("Không thể thu hồi quyền Admin. Vui lòng thử lại.");
      } finally {
        if (confirmBtn) confirmBtn.disabled = false;
      }
    });

    document.querySelectorAll(".spawn-mode-option").forEach((opt) => {
      opt.addEventListener("click", () => {
        setSpawnModeInModal(opt.dataset.mode);
      });
    });

    // Preset chip click → fill respawn minutes input
    document.getElementById("presetRespawnChips")?.addEventListener("click", (e) => {
      const chip = e.target.closest(".preset-chip");
      if (!chip) return;
      e.preventDefault();
      const mins = chip.dataset.mins;
      const respawnInput = document.getElementById("bossRespawn");
      if (mins && respawnInput) {
        respawnInput.value = mins;
        respawnInput.focus();
        respawnInput.dispatchEvent(new Event("input", { bubbles: true }));
        document.querySelectorAll(".preset-chip").forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        showToast(`Đã chọn mốc ${chip.textContent.trim()} (${mins} phút)`);
      }
    });

    // Schedule Day Tabs filter (Tất cả, Hôm nay, T2 -> CN)
    document.getElementById("scheduleDayTabs")?.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-day-filter]");
      if (!btn) return;
      scheduleDayFilter = btn.dataset.dayFilter;
      document.querySelectorAll(".schedule-day-tab").forEach(t => t.classList.remove("active"));
      btn.classList.add("active");
      renderTodayScheduleTable(getNow());
    });

    if (elements.soundToggleBtn) {
      elements.soundToggleBtn.addEventListener("click", toggleSound);
    }
    if (elements.soundTestBtn) {
      elements.soundTestBtn.addEventListener("click", testVoiceAlert);
    }

    elements.addBossBtn.addEventListener("click", () => openModal());
    if (elements.resetAllTimersBtn) {
      elements.resetAllTimersBtn.addEventListener("click", resetAllTimers);
    }

    elements.clearHistoryBtn.addEventListener("click", clearHistory);
    elements.searchBoss.addEventListener("input", render);

    document.getElementById("viewModeTabs")?.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-view]");
      if (!btn) return;
      setViewMode(btn.dataset.view);
    });
    elements.filterTabs.addEventListener("click", (event) => {
      const button = event.target.closest("[data-filter]");
      if (!button) return;
      activeFilter = button.dataset.filter;
      render();
    });

    document.addEventListener("change", (event) => {
      const target = event.target;
      if (target && (target.id === "levelFilterSelect" || target.id === "toolbarLevelFilter")) {
        activeLevelFilter = target.value;
        const headerSelect = document.getElementById("levelFilterSelect");
        const toolbarSelect = document.getElementById("toolbarLevelFilter");
        if (headerSelect) headerSelect.value = activeLevelFilter;
        if (toolbarSelect) toolbarSelect.value = activeLevelFilter;
        render();
      }
    });

    elements.bossGrid.addEventListener("click", (event) => {
      const button = event.target.closest("[data-action]");
      if (!button) return;
      const id = button.dataset.id;
      const action = button.dataset.action;
      if (action === "kill") {
        killBoss(id);
      } else if (action === "revive") {
        reviveBoss(id);
      } else if (action === "edit") {
        openModal(id);
      } else if (action === "offset-menu") {
        openOffsetModal(id);
      }
    });

    initOffsetModal();

    if (elements.todayScheduleToggle) {
      elements.todayScheduleToggle.addEventListener("click", (event) => {
        if (event.target.closest("#exportCsvBtn") || event.target.closest("#exportPdfBtn")) return;
        toggleTodaySchedule();
      });
      elements.todayScheduleToggle.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          toggleTodaySchedule();
        }
      });
    }

    if (elements.todayScheduleBody) {
      elements.todayScheduleBody.addEventListener("click", (event) => {
        const row = event.target.closest("[data-boss-id]");
        if (!row) return;
        const bossId = row.dataset.bossId;
        const card = document.querySelector(`[data-id="${bossId}"]`);
        if (card) {
          card.scrollIntoView({ behavior: "smooth", block: "center" });
          card.classList.remove("highlighted");
          void card.offsetWidth;
          card.classList.add("highlighted");
          window.setTimeout(() => card.classList.remove("highlighted"), 1600);
        }
      });
    }

    if (elements.exportPdfBtn) {
      elements.exportPdfBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        exportTodaySchedulePDF();
      });
    }

    // Weekly schedule toggle
    if (elements.weeklyScheduleToggle) {
      elements.weeklyScheduleToggle.addEventListener("click", () => toggleWeeklySchedule());
      elements.weeklyScheduleToggle.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          toggleWeeklySchedule();
        }
      });
    }

    document.getElementById("addFixedSlotBtn")?.addEventListener("click", () => {
      addFixedSlotRow("all", "18:00");
    });

    document.getElementById("fixedSlotsList")?.addEventListener("click", (e) => {
      const removeBtn = e.target.closest(".btn-remove-slot");
      if (!removeBtn) return;
      const rows = document.querySelectorAll("#fixedSlotsList .fixed-slot-row");
      if (rows.length <= 1) {
        showToast("Cần giữ ít nhất 1 mốc thời gian xuất hiện.");
        return;
      }
      removeBtn.closest(".fixed-slot-row")?.remove();
    });

    document.getElementById("fixedQuickPresets")?.addEventListener("click", (e) => {
      const chip = e.target.closest(".preset-chip");
      if (!chip) return;
      const day = chip.dataset.quickDay;
      const time = chip.dataset.quickTime;
      if (day && time) {
        addFixedSlotRow(day, time);
        showToast(`Đã thêm mốc ${chip.textContent.trim()}`);
      }
    });

    document.querySelectorAll(".nav-item").forEach((link) => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        if (href === "#attendance-salary" || href === "#attendance") {
          e.preventDefault();
          if (typeof switchPageView === "function") switchPageView("attendance");
          return;
        }
        if (typeof switchPageView === "function") switchPageView("boss");
        document.querySelectorAll(".nav-item").forEach((item) => item.classList.remove("active"));
        link.classList.add("active");
        if (href === "#boss-schedule") {
          toggleTodaySchedule(true);
        }
        if (href === "#weekly-boss-schedule") {
          toggleWeeklySchedule(true);
        }
      });
    });

    elements.bossForm.addEventListener("submit", handleFormSubmit);
    elements.deleteBossBtn.addEventListener("click", deleteActiveBoss);
    elements.modal.addEventListener("click", (event) => {
      if (event.target === elements.modal || event.target.closest("[data-close-modal]")) {
        closeModal();
      }
    });
    elements.authModal.addEventListener("click", (event) => {
      if (event.target === elements.authModal) {
        enterMemberMode();
      }
    });
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        const customConfirmModal = document.getElementById("customConfirmModal");
        if (customConfirmModal && customConfirmModal.classList.contains("open")) {
          document.getElementById("confirmModalCancelBtn")?.click();
          return;
        }
        if (elements.modal.classList.contains("open")) closeModal();
        if (elements.authModal.classList.contains("open")) enterMemberMode();
      }
    });


    const STORAGE_SIDEBAR_KEY = "bossTimelinePro.sidebarCollapsed";
    let isSidebarCollapsed = localStorage.getItem(STORAGE_SIDEBAR_KEY) === "true";

    function updateSidebarState() {
      const appShell = document.querySelector(".app-shell");
      if (appShell) {
        appShell.classList.toggle("sidebar-collapsed", isSidebarCollapsed);
      }
    }

    document.getElementById("sidebarToggleBtn")?.addEventListener("click", () => {
      isSidebarCollapsed = !isSidebarCollapsed;
      try {
        localStorage.setItem(STORAGE_SIDEBAR_KEY, isSidebarCollapsed ? "true" : "false");
      } catch (e) {}
      updateSidebarState();
    });

    updateSidebarState();

    const STORAGE_THEME_KEY = "bossTimelinePro.theme";
    let currentTheme = localStorage.getItem(STORAGE_THEME_KEY) || "dark";

    function applyTheme(theme) {
      currentTheme = theme;
      document.documentElement.setAttribute("data-theme", theme);
      try {
        localStorage.setItem(STORAGE_THEME_KEY, theme);
      } catch (e) {}

      const iconEl = document.getElementById("themeToggleIcon");
      const textEl = document.getElementById("themeToggleText");
      if (iconEl && textEl) {
        if (theme === "light") {
          iconEl.textContent = "☀️";
          textEl.textContent = "Sáng";
        } else {
          iconEl.textContent = "🌙";
          textEl.textContent = "Tối";
        }
      }
    }

    document.getElementById("themeToggleBtn")?.addEventListener("click", () => {
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      applyTheme(nextTheme);
      showToast(nextTheme === "light" ? "☀️ Đã chuyển sang Chế độ Sáng." : "🌙 Đã chuyển sang Chế độ Tối.");
    });

    applyTheme(currentTheme);

    document.getElementById("langSwitcher")?.addEventListener("click", (e) => {
      const btn = e.target.closest(".lang-btn");
      if (!btn) return;
      setLanguage(btn.dataset.lang);
    });

    // ── Discord Settings Modal Event Handlers ──
    function openDiscordModal() {
      const isEn = currentLang === "en";
      if (!isAdmin()) {
        showToast(isEn ? "Only Admin can configure Discord Webhook." : "Chỉ Admin mới có quyền cài đặt Discord Webhook.");
        requestAdminLogin();
        return;
      }

      const urlInput = document.getElementById("discordWebhookUrl");
      const logoInput = document.getElementById("discordLogoUrl");
      const enableMaster = document.getElementById("discordEnableMaster");
      const n10m = document.getElementById("discordNotify10m");
      const n5m = document.getElementById("discordNotify5m");
      const n1m = document.getElementById("discordNotify1m");
      const n0m = document.getElementById("discordNotify0m");
      const nKill = document.getElementById("discordNotifyKill");
      const tagEv = document.getElementById("discordTagEveryone");
      const nDaily = document.getElementById("discordNotifyDailySchedule");
      const resEl = document.getElementById("discordTestResult");

      if (urlInput) urlInput.value = discordConfig.webhookUrl || "";
      if (logoInput) logoInput.value = discordConfig.logoUrl || "";
      if (enableMaster) enableMaster.checked = Boolean(discordConfig.enabled);
      if (n10m) n10m.checked = discordConfig.notify10m !== false;
      if (n5m) n5m.checked = discordConfig.notify5m !== false;
      if (n1m) n1m.checked = discordConfig.notify1m !== false;
      if (n0m) n0m.checked = discordConfig.notify0m !== false;
      if (nKill) nKill.checked = discordConfig.notifyKill !== false;
      if (tagEv) tagEv.checked = discordConfig.tagEveryone !== false;
      if (nDaily) nDaily.checked = discordConfig.notifyDailySchedule !== false;
      if (resEl) resEl.style.display = "none";

      const modal = document.getElementById("discordSettingsModal");
      if (modal) modal.classList.add("open");
      syncModalScrollLock();
      if (urlInput) urlInput.focus();
    }

    function closeDiscordModal() {
      const modal = document.getElementById("discordSettingsModal");
      if (modal) modal.classList.remove("open");
      syncModalScrollLock();
    }

    document.getElementById("discordSettingsBtn")?.addEventListener("click", openDiscordModal);
    document.getElementById("closeDiscordModal")?.addEventListener("click", closeDiscordModal);
    document.getElementById("discordCancelBtn")?.addEventListener("click", closeDiscordModal);

    document.getElementById("discordSaveBtn")?.addEventListener("click", () => {
      const isEn = currentLang === "en";
      if (!isAdmin()) {
        showToast(isEn ? "Only Admin can configure Discord Webhook." : "Chỉ Admin mới có quyền cài đặt Discord Webhook.");
        return;
      }

      const urlInput = document.getElementById("discordWebhookUrl");
      const logoInput = document.getElementById("discordLogoUrl");
      const enableMaster = document.getElementById("discordEnableMaster");
      const n10m = document.getElementById("discordNotify10m");
      const n5m = document.getElementById("discordNotify5m");
      const n1m = document.getElementById("discordNotify1m");
      const n0m = document.getElementById("discordNotify0m");
      const nKill = document.getElementById("discordNotifyKill");
      const tagEv = document.getElementById("discordTagEveryone");
      const nDaily = document.getElementById("discordNotifyDailySchedule");

      const newConfig = {
        enabled: enableMaster ? enableMaster.checked : false,
        webhookUrl: urlInput ? urlInput.value.trim() : "",
        logoUrl: logoInput ? logoInput.value.trim() : "",
        notify10m: n10m ? n10m.checked : true,
        notify5m: n5m ? n5m.checked : true,
        notify1m: n1m ? n1m.checked : true,
        notify0m: n0m ? n0m.checked : true,
        notifyKill: nKill ? nKill.checked : true,
        tagEveryone: tagEv ? tagEv.checked : true,
        notifyDailySchedule: nDaily ? nDaily.checked : true
      };

      if (newConfig.enabled && !/^https:\/\/(?:discord|discordapp)\.com\/api\/webhooks\//i.test(newConfig.webhookUrl)) {
        alert("⚠️ Vui lòng nhập đúng đường dẫn Discord Webhook (bắt đầu bằng https://discord.com/api/webhooks/ hoặc https://discordapp.com/api/webhooks/)");
        if (urlInput) urlInput.focus();
        return;
      }

      saveDiscordConfigLocal(newConfig);
      closeDiscordModal();
      showToast(newConfig.enabled ? "🤖 Đã lưu & kích hoạt Discord Bot thành công!" : "🤖 Đã lưu cấu hình Discord.");
    });

    document.getElementById("discordTestScheduleBtn")?.addEventListener("click", async () => {
      const isEn = currentLang === "en";
      if (!isAdmin()) {
        showToast(isEn ? "Only Admin can configure Discord Webhook." : "Chỉ Admin mới có quyền cài đặt Discord Webhook.");
        return;
      }
      const resEl = document.getElementById("discordTestResult");
      if (resEl) {
        resEl.style.display = "block";
        resEl.style.background = "var(--surface-3)";
        resEl.style.color = "var(--text)";
        resEl.style.border = "1px solid var(--line)";
        resEl.textContent = "⏳ Đang gửi Lịch Boss hôm nay sang Discord...";
      }
      try {
        const ok = await sendDiscordDailySchedule(true);
        if (ok) {
          if (resEl) {
            resEl.style.display = "block";
            resEl.style.background = "var(--green-soft)";
            resEl.style.color = "var(--green)";
            resEl.style.border = "1px solid var(--green)";
            resEl.textContent = "✅ Đã gửi Lịch Boss hôm nay sang Discord thành công!";
          }
          showToast("✅ Đã gửi Lịch Boss hôm nay sang Discord!");
        } else {
          throw new Error("Không thể gửi webhook, vui lòng kiểm tra URL!");
        }
      } catch (err) {
        if (resEl) {
          resEl.style.display = "block";
          resEl.style.background = "var(--red-soft)";
          resEl.style.color = "var(--red)";
          resEl.style.border = "1px solid var(--red)";
          resEl.textContent = "❌ Gửi thất bại: " + err.message;
        }
      }
    });

    document.getElementById("discordTestBtn")?.addEventListener("click", async () => {
      const isEn = currentLang === "en";
      if (!isAdmin()) {
        showToast(isEn ? "Only Admin can configure Discord Webhook." : "Chỉ Admin mới có quyền cài đặt Discord Webhook.");
        return;
      }

      const urlInput = document.getElementById("discordWebhookUrl");
      const tagEv = document.getElementById("discordTagEveryone");
      const resEl = document.getElementById("discordTestResult");
      const url = urlInput ? urlInput.value.trim() : "";

      if (!/^https:\/\/(?:discord|discordapp)\.com\/api\/webhooks\//i.test(url)) {
        if (resEl) {
          resEl.style.display = "block";
          resEl.style.background = "var(--red-soft)";
          resEl.style.color = "var(--red)";
          resEl.style.border = "1px solid var(--red)";
          resEl.textContent = "❌ Đường dẫn Webhook không hợp lệ (phải bắt đầu bằng https://discord.com/api/webhooks/ hoặc discordapp.com)";
        }
        return;
      }

      if (resEl) {
        resEl.style.display = "block";
        resEl.style.background = "var(--surface-3)";
        resEl.style.color = "var(--text)";
        resEl.style.border = "1px solid var(--line)";
        resEl.textContent = "⏳ Đang gửi tin nhắn thử nghiệm sang Discord...";
      }

      const testPayload = {
        username: "Boss Tracker Alert",
        avatar_url: "https://cdn-icons-png.flaticon.com/512/10329/10329997.png",
        content: tagEv?.checked ? "@everyone [Test Bot]" : "",
        embeds: [
          {
            title: "🎉 KẾT NỐI DISCORD WEBHOOK THÀNH CÔNG!",
            description: "Hệ thống **Boss Timeline Pro** đã kết nối thành công với kênh Discord của Bang hội!",
            color: 5793266, // #5865F2
            fields: [
              { name: "👑 Trạng thái", value: "🟢 Đang hoạt động", inline: true },
              { name: "⚡ Tự động thông báo", value: "10m, 5m, 0m & Ghi nhận chết", inline: true },
              { name: "🕒 Thời gian", value: new Date().toLocaleTimeString("vi-VN") + " - " + new Date().toLocaleDateString("vi-VN"), inline: false }
            ],
            footer: { text: "Boss Timeline Pro • Discord Integration" },
            timestamp: new Date().toISOString()
          }
        ]
      };

      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(testPayload)
        });

        if (res.ok || res.status === 204) {
          if (resEl) {
            resEl.style.display = "block";
            resEl.style.background = "var(--green-soft)";
            resEl.style.color = "var(--green)";
            resEl.style.border = "1px solid var(--green)";
            resEl.textContent = "✅ Gửi tin nhắn Test thành công! Hãy kiểm tra kênh Discord của bạn.";
          }
          showToast("✅ Gửi tin nhắn Test Discord thành công!");
        } else {
          throw new Error("Discord API trả về mã lỗi: " + res.status);
        }
      } catch (err) {
        if (resEl) {
          resEl.style.display = "block";
          resEl.style.background = "var(--red-soft)";
          resEl.style.color = "var(--red)";
          resEl.style.border = "1px solid var(--red)";
          resEl.textContent = "❌ Gửi thất bại: " + err.message;
        }
      }
    });

    // ==========================================
    // MULTI-SERVER MANAGEMENT & SWITCHER LOGIC
    // ==========================================

    function updateServerSwitcherButton() {
      const activeServer = serverList.find(s => s.id === currentServerId) || { id: currentServerId, name: "Server " + currentServerId, icon: "⚔️" };
      if (elements.currentServerName) elements.currentServerName.textContent = activeServer.name;
      if (elements.currentServerIcon) elements.currentServerIcon.textContent = activeServer.icon || "⚔️";
      if (elements.serverSelectBtn) elements.serverSelectBtn.title = `Máy chủ hiện tại: ${activeServer.name} (sv=${activeServer.id})`;
    }

    function renderServerListUI() {
      // 1. Dropdown items
      if (elements.serverListContainer) {
        elements.serverListContainer.innerHTML = serverList.map(sv => {
          const isActive = sv.id === currentServerId;
          return `
            <div class="server-item ${isActive ? "active" : ""}" data-server-id="${escapeHtml(sv.id)}" style="display:flex; align-items:center; justify-content:space-between; padding:8px 12px; gap:8px;">
              <div class="sv-select-target" data-server-id="${escapeHtml(sv.id)}" style="display:flex; align-items:center; gap:8px; flex:1; min-width:0; cursor:pointer;" title="Bấm để chuyển sang ${escapeHtml(sv.name)}">
                <span style="font-size:16px;">${sv.icon || "⚔️"}</span>
                <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-weight:${isActive ? "700" : "500"};">${escapeHtml(sv.name)}</span>
              </div>
              <div style="display:flex; align-items:center; gap:4px; flex-shrink:0;">
                ${isActive ? '<span style="font-size:10.5px; font-weight:700; padding:2px 6px; border-radius:4px; background:rgba(34, 211, 238, 0.15); color:var(--cyan);">Đang xem</span>' : ""}
                ${isAdmin() ? `
                  <button type="button" class="rename-sv-quick-btn" data-sv-id="${escapeHtml(sv.id)}" data-sv-name="${escapeHtml(sv.name)}" title="Đổi tên ${escapeHtml(sv.name)}" style="background:transparent; border:none; color:var(--muted); cursor:pointer; padding:3px 5px; border-radius:4px; font-size:12px; display:inline-flex; align-items:center;" onmouseover="this.style.color='var(--cyan)'" onmouseout="this.style.color='var(--muted)'">
                    ✏️
                  </button>
                ` : ""}
              </div>
            </div>
          `;
        }).join("");

        elements.serverListContainer.querySelectorAll(".sv-select-target").forEach(item => {
          item.addEventListener("click", () => {
            const svId = item.dataset.serverId;
            if (svId && svId !== currentServerId) {
              switchServer(svId);
            }
            if (elements.serverDropdown) elements.serverDropdown.classList.remove("open");
          });
        });

        elements.serverListContainer.querySelectorAll(".rename-sv-quick-btn").forEach(btn => {
          btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const svId = btn.dataset.svId;
            const svName = btn.dataset.svName;
            promptRenameServer(svId, svName);
          });
        });
      }

      // 2. Modal server list
      if (elements.modalServerList) {
        elements.modalServerList.innerHTML = serverList.map(sv => {
          const isActive = sv.id === currentServerId;
          const isDefault = sv.id === "s1";
          return `
            <div style="display:flex; align-items:center; justify-content:space-between; padding:12px 14px; border:1px solid ${isActive ? "var(--cyan)" : "var(--line-soft)"}; border-radius:10px; margin-bottom:8px; background:${isActive ? "rgba(34, 211, 238, 0.05)" : "var(--surface-2)"}; gap:8px;">
              <div style="display:flex; align-items:center; gap:10px; flex:1; min-width:0;">
                <span style="font-size:20px;">${sv.icon || "⚔️"}</span>
                <div style="flex:1; min-width:0;">
                  <div style="font-weight:700; color:var(--text); font-size:14px; display:flex; align-items:center; gap:6px;">
                    <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${escapeHtml(sv.name)}</span>
                    ${isDefault ? '<span style="font-size:10px; padding:1px 5px; border-radius:3px; background:rgba(245, 158, 11, 0.15); color:var(--amber); font-weight:700; flex-shrink:0;">Mặc định</span>' : ""}
                  </div>
                  <div style="font-size:11px; color:var(--muted); font-family:monospace; margin-top:2px;">URL: ?sv=${escapeHtml(sv.id)}</div>
                </div>
              </div>
              <div style="display:flex; align-items:center; gap:6px; flex-shrink:0;">
                ${isAdmin() ? `
                  <button type="button" class="btn btn-secondary rename-sv-modal-btn" data-sv-id="${escapeHtml(sv.id)}" data-sv-name="${escapeHtml(sv.name)}" style="padding:5px 10px; font-size:12px; cursor:pointer; display:inline-flex; align-items:center; gap:4px;" title="Đổi tên máy chủ này">
                    ✏️ Đổi tên
                  </button>
                ` : ""}
                ${isActive
                  ? '<span style="font-size:12px; font-weight:700; padding:4px 10px; border-radius:6px; background:rgba(34, 211, 238, 0.15); color:var(--cyan);">Đang chọn</span>'
                  : `<button type="button" class="btn btn-secondary switch-to-sv-btn" data-sv-id="${escapeHtml(sv.id)}" style="padding:5px 12px; font-size:12px; cursor:pointer;">Chuyển tới</button>`
                }
                ${!isDefault && isAdmin() ? `
                  <button type="button" class="btn delete-sv-btn" data-sv-id="${escapeHtml(sv.id)}" data-sv-name="${escapeHtml(sv.name)}" style="padding:5px 8px; font-size:12px; color:var(--red); background:rgba(239, 68, 68, 0.1); border:1px solid rgba(239, 68, 68, 0.2); border-radius:6px; cursor:pointer;" title="Xóa máy chủ này">
                    🗑️
                  </button>
                ` : ""}
              </div>
            </div>
          `;
        }).join("");

        elements.modalServerList.querySelectorAll(".rename-sv-modal-btn").forEach(btn => {
          btn.addEventListener("click", () => {
            const svId = btn.dataset.svId;
            const svName = btn.dataset.svName;
            promptRenameServer(svId, svName);
          });
        });

        elements.modalServerList.querySelectorAll(".switch-to-sv-btn").forEach(btn => {
          btn.addEventListener("click", () => {
            const svId = btn.dataset.svId;
            if (svId) {
              switchServer(svId);
              closeServerModal();
            }
          });
        });

        elements.modalServerList.querySelectorAll(".delete-sv-btn").forEach(btn => {
          btn.addEventListener("click", () => {
            const svId = btn.dataset.svId;
            const svName = btn.dataset.svName;
            if (svId && svId !== "s1") {
              if (confirm(`Bạn có chắc chắn muốn xóa máy chủ "${svName}" (sv=${svId}) không? Dữ liệu boss của server này sẽ bị xóa khỏi danh sách.`)) {
                deleteServer(svId);
              }
            }
          });
        });
      }
    }

    async function switchServer(newServerId) {
      if (!newServerId) return;
      if (!serverList.some(s => s.id === newServerId)) {
          showToast("❌ Server không tồn tại trong danh sách.");
        return;
      }
      currentServerId = newServerId;
      bossSyncGeneration++;
      remoteStateReady = false;
      remoteSaveInFlight = false;
      pendingRemoteSave = false;
      bossDeferredRemoteData = null;
      bossFirebaseSeedAttempted = false;
      try {
        localStorage.setItem(STORAGE_CURRENT_SERVER_KEY, currentServerId);
      } catch (e) {}

        // Cập nhật tham số ?sv= trên URL mà không tải lại trang.
      try {
        const url = new URL(window.location.href);
        url.searchParams.set("sv", currentServerId);
        window.history.pushState({}, "", url.toString());
      } catch (e) {}

      STORAGE_KEY = "bossTimelinePro.v1_" + currentServerId;
      STORAGE_DISCORD_KEY = "bossTimelinePro.discordConfig_" + currentServerId;

      updateServerDatabaseRefs(currentServerId);

        // Nạp dữ liệu của Server mới.
      state = loadState();
      bossSyncBase = loadBossSyncBase();
      discordConfig = loadDiscordConfig();
      activeDiscordNotified = {};
      if (typeof initAttendanceRealtimeSync === "function") initAttendanceRealtimeSync();
      if (typeof renderAttendanceTable === "function") renderAttendanceTable();

      updateServerSwitcherButton();
      renderServerListUI();
      updateDiscordButtonUI();

      initRealtimeSync();
      render();

      const svObj = serverList.find(s => s.id === currentServerId);
        showToast("🌐 Đã chuyển sang: " + (svObj ? svObj.name : currentServerId));
    }

    async function createNewServer(name, cloneTemplate = true) {
      if (!isAdmin()) {
        showToast("Chỉ Quản trị viên (Admin) mới có quyền tạo máy chủ mới.");
        requestAdminLogin();
        return;
      }

      const trimmed = (name || "").trim();
      if (!trimmed) {
        if (elements.newServerError) {
          elements.newServerError.textContent = "Vui lòng nhập tên máy chủ!";
          elements.newServerError.style.display = "block";
        }
        return;
      }

      if (serverList.some(s => s.name.toLowerCase() === trimmed.toLowerCase())) {
        if (elements.newServerError) {
          elements.newServerError.textContent = "Tên máy chủ này đã tồn tại!";
          elements.newServerError.style.display = "block";
        }
        return;
      }

      // Tạo ID duy nhất (s2, s3, ...)
      let nextNum = serverList.length + 1;
      let newId = "s" + nextNum;
      while (serverList.some(s => s.id === newId)) {
        nextNum++;
        newId = "s" + nextNum;
      }

      const icons = ["⚔️", "🛡️", "🔥", "⚡", "🌟", "👑", "🏹", "🔮", "🏰", "🐉"];
      const randomIcon = icons[(serverList.length) % icons.length];

      const newServerObj = {
        id: newId,
        name: trimmed,
        icon: randomIcon
      };

      serverList.push(newServerObj);
      try {
        localStorage.setItem(STORAGE_SERVERS_KEY, JSON.stringify(serverList));
      } catch (e) {}

      // Đồng bộ danh sách server lên Firebase
      if (firebaseDb) {
        try {
          firebaseDb.ref("boss_timeline_servers_list").set(serverList).catch(e => console.warn(e));
        } catch (e) {}
      }

      // Khởi tạo state cho server mới
      let newBosses = [];
      if (cloneTemplate) {
        const baseBosses = (state.bosses && state.bosses.length > 0) ? state.bosses : createDefaultState().bosses;
        newBosses = baseBosses.map(b => {
          const copy = JSON.parse(JSON.stringify(b));
          copy.diedAt = null;
          copy.respawnsAt = null;
          copy.lastRespawnAt = null;
          copy.respawnHistory = [];
          return normalizeBoss(copy);
        });
      } else {
        newBosses = createDefaultState().bosses.map(normalizeBoss);
      }

      const newState = {
        bosses: newBosses,
        history: []
      };

      const newStorageKey = `bossTimelinePro.v1_${newId}`;
      try {
        localStorage.setItem(newStorageKey, JSON.stringify(newState));
      } catch (e) {}

      // Đẩy state lên Firebase node của server mới
      if (firebaseDb) {
        try {
          const paths = getFirebaseServerPaths(newId);
          const bMap = {};
          newBosses.forEach(b => { bMap[b.id] = b; });
          const seed = {
            data: { _clientId: CLIENT_ID, bosses: newBosses, history: [] },
            bosses_map: bMap,
            last_editor: CLIENT_ID,
            updated_at: new Date(getNow()).toISOString()
          };
          firebaseDb.ref(paths.statePath).set(seed).catch(e => console.warn(e));
        } catch (e) {}
      }

      // Đóng modal và chuyển ngay sang server mới
      closeServerModal();
      await switchServer(newId);
      showToast(`🎉 Đã tạo thành công máy chủ: ${trimmed}`);
    }

    async function renameServer(serverId, newName) {
      if (!isAdmin()) {
        showToast("Chỉ Quản trị viên (Admin) mới có quyền đổi tên máy chủ.");
        requestAdminLogin();
        return;
      }

      const sv = serverList.find(s => s.id === serverId);
      if (!sv) return;
      const trimmed = (newName || "").trim();
      if (!trimmed) {
        showToast("❌ Tên máy chủ không được để trống!");
        return;
      }
      if (serverList.some(s => s.id !== serverId && s.name.toLowerCase() === trimmed.toLowerCase())) {
        showToast("❌ Tên máy chủ này đã bị trùng lặp với một server khác!");
        return;
      }

      const oldName = sv.name;
      sv.name = trimmed;
      try {
        localStorage.setItem(STORAGE_SERVERS_KEY, JSON.stringify(serverList));
      } catch (e) {}

      if (firebaseDb) {
        try {
          firebaseDb.ref("boss_timeline_servers_list").set(serverList).catch(e => console.warn(e));
        } catch (e) {}
      }

      renderServerListUI();
      showToast(`✅ Đã đổi tên máy chủ thành: "${trimmed}"`);
    }

    function promptRenameServer(serverId, currentName) {
      if (!isAdmin()) {
        showToast("Chỉ Quản trị viên (Admin) mới có quyền đổi tên máy chủ.");
        requestAdminLogin();
        return;
      }

      const newName = prompt(`Nhập tên mới cho máy chủ (${currentName}):`, currentName);
      if (newName !== null) {
        const trimmed = newName.trim();
        if (trimmed && trimmed !== currentName) {
          renameServer(serverId, trimmed);
        }
      }
    }

    async function deleteServer(serverId) {
      if (!isAdmin()) {
        showToast("Chỉ Quản trị viên (Admin) mới có quyền xóa máy chủ.");
        requestAdminLogin();
        return;
      }

      if (serverId === "s1") {
        showToast("❌ Không thể xóa máy chủ mặc định (Server 1)!");
        return;
      }
      serverList = serverList.filter(s => s.id !== serverId);
      try {
        localStorage.setItem(STORAGE_SERVERS_KEY, JSON.stringify(serverList));
      } catch (e) {}

      if (firebaseDb) {
        try {
          firebaseDb.ref("boss_timeline_servers_list").set(serverList).catch(e => console.warn(e));
        } catch (e) {}
      }

      if (currentServerId === serverId) {
        await switchServer("s1");
      } else {
        renderServerListUI();
      }
      showToast("🗑️ Đã xóa máy chủ thành công.");
    }

    function initServerListSync() {
      if (!REALTIME_ENABLED || !firebaseDb) return;
      try {
        firebaseDb.ref("boss_timeline_servers_list").on("value", (snap) => {
          const remoteList = snap.val();
          if (Array.isArray(remoteList) && remoteList.length > 0) {
            const validList = remoteList.filter(server => server && server.id);
            if (validList.length && JSON.stringify(serverList) !== JSON.stringify(validList)) {
              serverList = cloneRealtimeValue(validList);
              try {
                localStorage.setItem(STORAGE_SERVERS_KEY, JSON.stringify(serverList));
              } catch (e) {}
              renderServerListUI();
              updateServerSwitcherButton();
              renderAttendanceTable();
              if (!serverList.some(server => server.id === currentServerId)) switchServer(serverList[0].id);
            }
          }
        });
      } catch (e) {}
    }

    function openServerModal() {
      if (elements.serverModal) {
        elements.serverModal.classList.add("open");
        syncModalScrollLock();
        renderServerListUI();
        if (elements.modalAddServerSection) {
          elements.modalAddServerSection.style.display = isAdmin() ? "block" : "none";
        }
        if (elements.newServerName) {
          elements.newServerName.value = "";
          if (isAdmin()) {
            setTimeout(() => elements.newServerName.focus(), 100);
          }
        }
        if (elements.newServerError) {
          elements.newServerError.style.display = "none";
        }
      }
    }

    function closeServerModal() {
      if (elements.serverModal) {
        elements.serverModal.classList.remove("open");
        syncModalScrollLock();
      }
    }

    // Modal & Dropdown Event Listeners
    if (elements.serverSelectBtn) {
      elements.serverSelectBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (elements.serverDropdown) {
          elements.serverDropdown.classList.toggle("open");
        }
      });
    }

    document.addEventListener("click", (e) => {
      if (elements.serverDropdown && elements.serverSwitcher && !elements.serverSwitcher.contains(e.target)) {
        elements.serverDropdown.classList.remove("open");
      }
    });

    if (elements.addServerBtn) {
      elements.addServerBtn.addEventListener("click", () => {
        if (!isAdmin()) {
          showToast("Chỉ Quản trị viên (Admin) mới có quyền thêm máy chủ.");
          requestAdminLogin();
          return;
        }
        if (elements.serverDropdown) elements.serverDropdown.classList.remove("open");
        openServerModal();
      });
    }

    if (elements.manageServersBtn) {
      elements.manageServersBtn.addEventListener("click", () => {
        if (!isAdmin()) {
          showToast("Chỉ Quản trị viên (Admin) mới có quyền quản lý & đổi tên máy chủ.");
          requestAdminLogin();
          return;
        }
        if (elements.serverDropdown) elements.serverDropdown.classList.remove("open");
        openServerModal();
      });
    }

    if (elements.closeServerModal) {
      elements.closeServerModal.addEventListener("click", closeServerModal);
    }

    if (elements.serverModal) {
      elements.serverModal.addEventListener("click", (e) => {
        if (e.target === elements.serverModal) closeServerModal();
      });
    }

    if (elements.confirmAddServerBtn) {
      elements.confirmAddServerBtn.addEventListener("click", () => {
        if (!isAdmin()) {
          showToast("Chỉ Quản trị viên (Admin) mới có quyền thêm máy chủ.");
          requestAdminLogin();
          return;
        }
        const name = elements.newServerName ? elements.newServerName.value : "";
        const clone = elements.cloneBossTemplate ? elements.cloneBossTemplate.checked : true;
        createNewServer(name, clone);
      });
    }

    if (elements.newServerName) {
      elements.newServerName.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          if (!isAdmin()) {
            showToast("Chỉ Quản trị viên (Admin) mới có quyền thêm máy chủ.");
            requestAdminLogin();
            return;
          }
          const name = elements.newServerName.value;
          const clone = elements.cloneBossTemplate ? elements.cloneBossTemplate.checked : true;
          createNewServer(name, clone);
        }
      });
    }

    /* ==========================================================================
       BẢNG CHẤM CÔNG & TỰ ĐỘNG TÍNH LƯƠNG HOẠT ĐỘNG / BOSS
       ========================================================================== */
    const STORAGE_ATTENDANCE_KEY = "bossTimelinePro.attendance_global";
    const STORAGE_ATTENDANCE_SYNC_BASE_KEY = STORAGE_ATTENDANCE_KEY + ".syncBase";
    const LEGACY_ATTENDANCE_PREFIX = "bossTimelinePro.attendance_";
    const ATTENDANCE_SCHEMA_VERSION = 2;
    const ATTENDANCE_MIGRATION_VERSION = 1;

    const DEFAULT_ATT_ACTIVITIES = [
      { id: "act_1", date: "T2 22/09", name: "Amentis 19h", points: 3 },
      { id: "act_2", date: "T2 22/09", name: "Kataphron 21h", points: 2 },
      { id: "act_3", date: "T3 23/09", name: "Boss Bang", points: 1 },
      { id: "act_4", date: "T3 23/09", name: "Thần Điện", points: 2 },
      { id: "act_5", date: "T4 24/09", name: "Amentis 19h", points: 3 },
      { id: "act_6", date: "T5 25/09", name: "Kataphron 21h", points: 2 },
      { id: "act_7", date: "T6 26/09", name: "Boss Bang", points: 1 },
      { id: "act_8", date: "T7 27/09", name: "Công Thành Chiến", points: 5 },
      { id: "act_9", date: "CN 28/09", name: "Thần Điện", points: 2 }
    ];

    const DEFAULT_ATT_MEMBERS = [
      { id: "m_1", name: "Venarius", color: "#fbbf24", role: "👑 Chủ Bang", roleColor: "#f59e0b", multiplier: 3, records: { act_1: true, act_2: true, act_3: true, act_4: true, act_5: true, act_6: true, act_7: true, act_8: true, act_9: true } },
      { id: "m_2", name: "Ông3Bi", color: "#f87171", role: "⚔️ Core DPS", roleColor: "#ef4444", multiplier: 3, records: { act_1: true, act_2: true, act_3: true, act_4: true, act_5: true, act_6: true, act_7: true, act_8: true, act_9: true } },
      { id: "m_3", name: "VoiLười", color: "#c084fc", role: "🛡️ Tanker", roleColor: "#06b6d4", multiplier: 2.5, records: { act_1: true, act_2: true, act_3: true, act_4: true, act_5: true, act_6: true, act_7: true, act_8: true } },
      { id: "m_4", name: "TraiBao", color: "#38bdf8", role: "🔮 Call Boss", roleColor: "#8b5cf6", multiplier: 2.5, records: { act_1: true, act_2: true, act_3: true, act_4: true, act_5: true, act_6: true, act_7: true, act_8: true } },
      { id: "m_5", name: "LongThần", color: "#34d399", role: "💎 VIP", roleColor: "#f59e0b", multiplier: 2.5, records: { act_1: true, act_2: true, act_3: true, act_4: true, act_5: true, act_6: true, act_8: true } },
      { id: "m_6", name: "KhắcTiệp", multiplier: 2.5, role: "Core", records: { act_1: true, act_2: true, act_3: true, act_4: true, act_5: true, act_8: true } },
      { id: "m_7", name: "BạchLong", multiplier: 2.5, role: "Core", records: { act_1: true, act_2: true, act_3: true, act_4: true, act_5: true, act_6: true, act_7: true, act_8: true } },
      { id: "m_8", name: "Ken", multiplier: 2, role: "Member", records: { act_1: true, act_2: true, act_3: true, act_4: true, act_5: true, act_6: true, act_7: true, act_8: true } },
      { id: "m_9", name: "MèoBéo", multiplier: 2, role: "Member", records: { act_1: true, act_2: true, act_3: true, act_4: true, act_5: true, act_6: true, act_7: true, act_8: true } },
      { id: "m_10", name: "KẻHủyDiệt", multiplier: 2, role: "Member", records: { act_1: true, act_2: true, act_3: true, act_4: true, act_5: true, act_6: true, act_7: true, act_8: true } },
      { id: "m_11", name: "Bự", multiplier: 2, role: "Member", records: { act_1: true, act_2: true, act_3: true, act_4: true, act_5: true, act_6: true, act_7: true, act_8: true } },
      { id: "m_12", name: "HùngHổ", multiplier: 2, role: "Member", records: { act_1: true, act_2: true, act_3: true, act_4: true, act_5: true, act_6: true, act_7: true, act_8: true } },
      { id: "m_13", name: "Zeref", multiplier: 2, role: "Member", records: { act_1: true, act_2: true, act_3: true, act_4: true, act_5: true, act_6: true, act_7: true, act_8: true, act_9: true } },
      { id: "m_14", name: "TuấnKhang", multiplier: 2, role: "Member", records: { act_1: true, act_2: true, act_3: true, act_4: true, act_5: true, act_6: true, act_7: true, act_8: true } },
      { id: "m_15", name: "SơnTùng", multiplier: 2, role: "Member", records: { act_1: true, act_2: true, act_3: true, act_4: true, act_5: true, act_6: true, act_7: true } },
      { id: "m_16", name: "HắcBạch", multiplier: 2, role: "Member", records: { act_1: true, act_2: true, act_3: true, act_4: true, act_5: true, act_7: true } },
      { id: "m_17", name: "BéNa", multiplier: 2, role: "Member", records: { act_1: true, act_2: true, act_3: true, act_4: true, act_5: true, act_6: true, act_7: true } },
      { id: "m_18", name: "TrùmCuối", multiplier: 1.5, role: "Member", records: { act_1: true, act_2: true, act_3: true, act_4: true, act_5: true, act_6: true, act_7: true, act_8: true } },
      { id: "m_19", name: "BéBự", multiplier: 1.5, role: "Member", records: { act_1: true, act_2: true, act_3: true, act_4: true, act_5: true, act_6: true, act_7: true, act_8: true } },
      { id: "m_20", name: "HổBáo", multiplier: 1.5, role: "Member", records: { act_1: true, act_2: true, act_3: true, act_4: true, act_5: true, act_6: true, act_7: true } },
      { id: "m_21", name: "ThầnGió", multiplier: 1.5, role: "Member", records: { act_1: true, act_2: true, act_3: true, act_4: true, act_5: true, act_6: true, act_7: true, act_8: true } },
      { id: "m_22", name: "SátThủ", multiplier: 1.5, role: "Member", records: { act_1: true, act_2: true, act_3: true, act_4: true, act_5: true, act_7: true } },
      { id: "m_23", name: "ĐộcCô", multiplier: 1, role: "Newbie", records: { act_1: true, act_2: true, act_3: true, act_4: true, act_5: true, act_6: true } },
      { id: "m_24", name: "VôDanh", multiplier: 1, role: "Newbie", records: { act_1: true, act_2: true, act_3: true, act_4: true } },
      { id: "m_25", name: "TânThủ", multiplier: 1, role: "Newbie", records: { act_1: true, act_3: true } }
    ];

    const DEFAULT_ATTENDANCE_STATE = {
      schemaVersion: ATTENDANCE_SCHEMA_VERSION,
      migrationVersion: ATTENDANCE_MIGRATION_VERSION,
      activeWeekId: "week_1",
      updatedAt: Date.now(),
      updatedBy: "system",
      weeks: [
        {
          id: "week_1",
          name: "Tuần 1",
          dateRange: "22/09 - 28/09",
          diasPool: 52500,
          usdtPool: 867,
          minimumParticipationPercent: 0,
          activities: DEFAULT_ATT_ACTIVITIES,
          members: DEFAULT_ATT_MEMBERS
        }
      ]
    };

    let attendanceState = null;
    let attendanceSearchTerm = "";
    let attendanceServerFilter = "all";
    let attendanceMultiplierFilter = "all";
    let attendanceRoleUIMode = null;
    let attendanceRemoteSaveInFlight = false;
    let attendancePendingRemoteSave = false;
    let attendanceRemotePermissionDenied = false;
    let attendanceFirebaseSeedAttempted = false;
    let attendanceFirebaseMigrationInFlight = false;
    let attendanceSyncBase = null;
    let attendanceDeferredRemoteData = null;
    let attendanceRemoteStateReady = false;
    let attendanceRemoteDataExists = false;
    let activeAttendanceRef = null;

    function getAttendanceSyncData(value) {
      const { diasPool, usdtPool, activities, members, updatedAt, updatedBy, version, ...data } = value;
      return cloneRealtimeValue(data);
    }

    function cacheAttendanceSyncState() {
      try {
        localStorage.setItem(STORAGE_ATTENDANCE_KEY, JSON.stringify(attendanceState));
        if (attendanceSyncBase) localStorage.setItem(STORAGE_ATTENDANCE_SYNC_BASE_KEY, JSON.stringify(attendanceSyncBase));
      } catch (e) { console.error("Error caching attendance sync state:", e); }
    }

    function applyAttendanceRemoteData(remoteData, localBase = attendanceSyncBase) {
      const confirmed = normalizeAttendanceState(cloneRealtimeValue(remoteData), getDefaultAttendanceServerId());
      const remote = getAttendanceSyncData(confirmed);
      const local = attendanceState ? getAttendanceSyncData(attendanceState) : remote;
      const merged = isAdmin() ? mergeRealtimeChanges(localBase || local, local, remote) : remote;
      attendanceSyncBase = remote;
      attendanceState = normalizeAttendanceState({ ...confirmed, ...merged }, getDefaultAttendanceServerId());
      cacheAttendanceSyncState();
      renderAttendanceTable();
    }

    function getDefaultAttendanceServerId() {
      if (serverList.some(s => s.id === currentServerId)) return currentServerId;
      return serverList[0]?.id || "s1";
    }

    function getServerNameById(serverId) {
      const resolvedId = serverId || getDefaultAttendanceServerId();
      const server = serverList.find(s => s.id === resolvedId);
      return server?.name || resolvedId || "Chưa gán";
    }

    function cloneDefaultAttendanceState() {
      return normalizeAttendanceState(JSON.parse(JSON.stringify(DEFAULT_ATTENDANCE_STATE)), getDefaultAttendanceServerId());
    }

    function normalizeAttendanceMember(member, fallbackServerId, usedIds = null) {
      const source = member && typeof member === "object" ? member : {};
      const serverId = source.serverId || fallbackServerId || getDefaultAttendanceServerId();
      const baseId = String(source.id || ("m_" + Date.now().toString(36))).trim();
      let finalId = baseId;

      if (usedIds) {
        if (usedIds.has(finalId)) {
          finalId = `${serverId}_${baseId}`;
          let suffix = 2;
          while (usedIds.has(finalId)) {
            finalId = `${serverId}_${baseId}_${suffix}`;
            suffix += 1;
          }
        }
        usedIds.add(finalId);
      }

      return {
        ...source,
        id: finalId,
        name: String(source.name || "Thành viên").trim() || "Thành viên",
        serverId,
        multiplier: parseFloat(source.multiplier) || 1,
        role: source.role || "Member",
        color: source.color || "",
        roleColor: source.roleColor || "",
        records: source.records && typeof source.records === "object" ? { ...source.records } : {}
      };
    }

    function normalizeMinimumParticipationPercent(value) {
      return Math.min(100, Math.max(0, Number(value) || 0));
    }

    function normalizeAttendanceState(parsed, fallbackServerId) {
      let stateObj = parsed && typeof parsed === "object" ? parsed : JSON.parse(JSON.stringify(DEFAULT_ATTENDANCE_STATE));
      const persistedWeeks = Array.isArray(stateObj.weeks);

      if (!stateObj.weeks || !Array.isArray(stateObj.weeks) || stateObj.weeks.length === 0) {
        const legacyWeek = {
          id: "week_1",
          name: stateObj.name || "Tuần 1",
          dateRange: stateObj.dateRange || "22/09 - 28/09",
          diasPool: typeof stateObj.diasPool === "number" ? stateObj.diasPool : 52500,
          usdtPool: typeof stateObj.usdtPool === "number" ? stateObj.usdtPool : 867,
          minimumParticipationPercent: normalizeMinimumParticipationPercent(stateObj.minimumParticipationPercent),
          activities: Array.isArray(stateObj.activities) ? stateObj.activities : JSON.parse(JSON.stringify(DEFAULT_ATT_ACTIVITIES)),
          members: Array.isArray(stateObj.members) ? stateObj.members : JSON.parse(JSON.stringify(DEFAULT_ATT_MEMBERS))
        };
        stateObj = {
          schemaVersion: ATTENDANCE_SCHEMA_VERSION,
          migrationVersion: ATTENDANCE_MIGRATION_VERSION,
          activeWeekId: "week_1",
          updatedAt: stateObj.updatedAt || Date.now(),
          updatedBy: stateObj.updatedBy || "migration",
          weeks: [legacyWeek]
        };
      }

      stateObj.schemaVersion = ATTENDANCE_SCHEMA_VERSION;
      stateObj.migrationVersion = Math.max(Number(stateObj.migrationVersion) || 0, ATTENDANCE_MIGRATION_VERSION);
      stateObj.updatedAt = stateObj.updatedAt || Date.now();
      stateObj.updatedBy = stateObj.updatedBy || "system";

      stateObj.weeks.forEach((w, idx) => {
        if (!w.id) w.id = `week_${idx + 1}`;
        if (!w.name) w.name = `Tuần ${idx + 1}`;
        if (!w.dateRange) w.dateRange = idx === 0 ? "22/09 - 28/09" : `Tuần ${idx + 1}`;
        if (!Array.isArray(w.activities)) w.activities = persistedWeeks ? [] : JSON.parse(JSON.stringify(DEFAULT_ATT_ACTIVITIES));
        if (!Array.isArray(w.members)) w.members = persistedWeeks ? [] : JSON.parse(JSON.stringify(DEFAULT_ATT_MEMBERS));
        w.diasPool = Math.max(0, Math.round(Number(w.diasPool) || 0));
        w.usdtPool = Math.max(0, parseFloat(w.usdtPool) || 0);
        w.minimumParticipationPercent = normalizeMinimumParticipationPercent(w.minimumParticipationPercent);

        const usedIds = new Set();
        w.members = w.members.map(m => normalizeAttendanceMember(m, fallbackServerId, usedIds));
      });

      if (!stateObj.activeWeekId || !stateObj.weeks.some(w => w.id === stateObj.activeWeekId)) {
        stateObj.activeWeekId = stateObj.weeks[0]?.id || "week_1";
      }

      const activeWeek = stateObj.weeks.find(w => w.id === stateObj.activeWeekId) || stateObj.weeks[0];
      if (activeWeek) {
        stateObj.diasPool = activeWeek.diasPool;
        stateObj.usdtPool = activeWeek.usdtPool;
        stateObj.activities = activeWeek.activities;
        stateObj.members = activeWeek.members;
      }

      return stateObj;
    }

    function collectLegacyLocalAttendance() {
      const seenKeys = new Set();
      const items = [];
      const orderedServers = serverList.map(s => s.id);

      orderedServers.forEach(serverId => {
        const key = `${LEGACY_ATTENDANCE_PREFIX}${serverId}`;
        if (key === STORAGE_ATTENDANCE_KEY || seenKeys.has(key)) return;
        seenKeys.add(key);
        try {
          const raw = localStorage.getItem(key);
          if (raw) items.push({ serverId, key, state: JSON.parse(raw) });
        } catch (e) {
          console.warn("Legacy attendance parse error:", key, e);
        }
      });

      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (!key || key === STORAGE_ATTENDANCE_KEY || key === STORAGE_ATTENDANCE_SYNC_BASE_KEY || seenKeys.has(key)) continue;
          if (!key.startsWith(LEGACY_ATTENDANCE_PREFIX)) continue;
          const serverId = key.slice(LEGACY_ATTENDANCE_PREFIX.length) || getDefaultAttendanceServerId();
          seenKeys.add(key);
          const raw = localStorage.getItem(key);
          if (raw) items.push({ serverId, key, state: JSON.parse(raw) });
        }
      } catch (e) {
        console.warn("Legacy attendance scan error:", e);
      }

      return items;
    }

    function activitiesMatch(a, b) {
      return String(a?.date || "") === String(b?.date || "")
        && String(a?.name || "") === String(b?.name || "")
        && Number(a?.points || 0) === Number(b?.points || 0);
    }

    function getUniqueActivityId(baseId, serverId, usedIds) {
      const cleanBase = String(baseId || "act").trim() || "act";
      let candidate = `${serverId}_${cleanBase}`;
      let suffix = 2;
      while (usedIds.has(candidate)) {
        candidate = `${serverId}_${cleanBase}_${suffix}`;
        suffix += 1;
      }
      usedIds.add(candidate);
      return candidate;
    }

    function mergeAttendanceStatesForMigration(legacyItems) {
      if (!legacyItems || legacyItems.length === 0) return null;
      const merged = {
        schemaVersion: ATTENDANCE_SCHEMA_VERSION,
        migrationVersion: ATTENDANCE_MIGRATION_VERSION,
        activeWeekId: "",
        updatedAt: Date.now(),
        updatedBy: "local-migration",
        migratedFrom: legacyItems.map(item => item.key || item.serverId),
        weeks: []
      };

      legacyItems.forEach(item => {
        const sourceState = normalizeAttendanceState(item.state, item.serverId);
        (sourceState.weeks || []).forEach((sourceWeek, idx) => {
          const weekId = sourceWeek.id || `week_${idx + 1}`;
          let targetWeek = merged.weeks.find(w => w.id === weekId);
          if (!targetWeek) {
            targetWeek = {
              id: weekId,
              name: sourceWeek.name || `Tuần ${idx + 1}`,
              dateRange: sourceWeek.dateRange || "",
              diasPool: sourceWeek.diasPool || 0,
              usdtPool: sourceWeek.usdtPool || 0,
              minimumParticipationPercent: sourceWeek.minimumParticipationPercent,
              activities: [],
              members: []
            };
            merged.weeks.push(targetWeek);
            if (!merged.activeWeekId) merged.activeWeekId = weekId;
          }

          const activityIds = new Set(targetWeek.activities.map(a => a.id));
          const activityIdMap = {};
          (sourceWeek.activities || []).forEach(act => {
            const existing = targetWeek.activities.find(a => a.id === act.id);
            if (!existing) {
              activityIds.add(act.id);
              targetWeek.activities.push({ ...act });
              activityIdMap[act.id] = act.id;
            } else if (activitiesMatch(existing, act)) {
              activityIdMap[act.id] = existing.id;
            } else {
              const newActId = getUniqueActivityId(act.id, item.serverId, activityIds);
              targetWeek.activities.push({ ...act, id: newActId });
              activityIdMap[act.id] = newActId;
            }
          });

          const usedMemberIds = new Set(targetWeek.members.map(m => m.id));
          (sourceWeek.members || []).forEach(member => {
            const remappedRecords = {};
            Object.keys(member.records || {}).forEach(oldActId => {
              const newActId = activityIdMap[oldActId] || oldActId;
              remappedRecords[newActId] = member.records[oldActId];
            });
            targetWeek.members.push(normalizeAttendanceMember({
              ...member,
              serverId: member.serverId || item.serverId,
              records: remappedRecords
            }, item.serverId, usedMemberIds));
          });
        });
      });

      return normalizeAttendanceState(merged, getDefaultAttendanceServerId());
    }

    function migrateLegacyLocalAttendanceIfNeeded() {
      try {
        if (localStorage.getItem(STORAGE_ATTENDANCE_KEY)) return null;
        const legacyItems = collectLegacyLocalAttendance();
        const migrated = mergeAttendanceStatesForMigration(legacyItems);
        if (!migrated) return null;
        localStorage.setItem(STORAGE_ATTENDANCE_KEY, JSON.stringify(migrated));
        return migrated;
      } catch (e) {
        console.warn("Legacy attendance migration error:", e);
        return null;
      }
    }

    function getSuggestedWeekRange(offsetWeeks = 0) {
      const now = new Date();
      const day = now.getDay();
      const diffToMon = (day === 0 ? -6 : 1) - day + (offsetWeeks * 7);
      const mon = new Date(now);
      mon.setDate(now.getDate() + diffToMon);
      const sun = new Date(mon);
      sun.setDate(mon.getDate() + 6);
      
      const pad = n => String(n).padStart(2, '0');
      const d1 = `${pad(mon.getDate())}/${pad(mon.getMonth() + 1)}`;
      const d2 = `${pad(sun.getDate())}/${pad(sun.getMonth() + 1)}/${sun.getFullYear()}`;
      return `${d1} - ${d2}`;
    }

    function getActiveWeek() {
      if (!attendanceState) attendanceState = loadAttendanceState();
      if (!attendanceSyncBase) {
        try { attendanceSyncBase = JSON.parse(localStorage.getItem(STORAGE_ATTENDANCE_SYNC_BASE_KEY)); } catch (e) {}
        if (!attendanceSyncBase) attendanceSyncBase = getAttendanceSyncData(attendanceState);
      }
      if (!attendanceState.weeks || !Array.isArray(attendanceState.weeks) || attendanceState.weeks.length === 0) {
        attendanceState = cloneDefaultAttendanceState();
      }
      let week = attendanceState.weeks.find(w => w.id === attendanceState.activeWeekId);
      if (!week) {
        week = attendanceState.weeks[attendanceState.weeks.length - 1] || attendanceState.weeks[0];
        attendanceState.activeWeekId = week.id;
      }
      return week;
    }

    function loadAttendanceState() {
      try {
        const raw = localStorage.getItem(STORAGE_ATTENDANCE_KEY);
        let parsed = null;
        if (raw) {
          parsed = JSON.parse(raw);
        }
        if (!parsed) {
          parsed = migrateLegacyLocalAttendanceIfNeeded() || cloneDefaultAttendanceState();
          parsed.updatedAt = Date.now();
          try {
            localStorage.setItem(STORAGE_ATTENDANCE_KEY, JSON.stringify(parsed));
          } catch (e) {}
          return parsed;
        }
        return normalizeAttendanceState(parsed, getDefaultAttendanceServerId());
      } catch (e) {
        console.error("Error loading attendance state:", e);
        return cloneDefaultAttendanceState();
      }
    }

    function saveAttendanceState(newState, syncRemote = true) {
      if (!newState) return;
      attendanceState = normalizeAttendanceState(newState, getDefaultAttendanceServerId());

      // Sync active week properties to root level for backward compatibility
      const cur = getActiveWeek();
      if (cur) {
        attendanceState.diasPool = cur.diasPool;
        attendanceState.usdtPool = cur.usdtPool;
        attendanceState.activities = cur.activities;
        attendanceState.members = cur.members;
      }

      attendanceState.updatedAt = Date.now();
      attendanceState.updatedBy = CLIENT_ID;
      if (syncRemote && attendanceDbRef && isAdmin()) {
        attendanceState.version = (Number(attendanceState.version) || 0) + 1;
      }

      try {
        localStorage.setItem(STORAGE_ATTENDANCE_KEY, JSON.stringify(attendanceState));
        if (attendanceSyncBase) localStorage.setItem(STORAGE_ATTENDANCE_SYNC_BASE_KEY, JSON.stringify(attendanceSyncBase));
      } catch (e) {
        console.error("Error saving attendance to localStorage:", e);
      }

      if (syncRemote && attendanceDbRef && isAdmin()) {
        pushAttendanceToFirebase();
      }
    }

    function openAttendanceWeekModal(weekId = null) {
      if (!isAdmin()) {
        showToast("Chỉ Quản trị viên (Admin) mới có quyền quản lý tuần.");
        requestAdminLogin();
        return;
      }
      const modal = document.getElementById("attWeekModal");
      if (!modal) return;
      const titleEl = document.getElementById("attWeekModalTitle");
      const subEl = document.getElementById("attWeekModalSub");
      const editIdInput = document.getElementById("attWeekEditId");
      const nameInput = document.getElementById("attWeekNameInput");
      const dateInput = document.getElementById("attWeekDateRangeInput");
      const diasInput = document.getElementById("attWeekDiasPoolInput");
      const usdtInput = document.getElementById("attWeekUsdtPoolInput");
      const thresholdInput = document.getElementById("attWeekMinimumParticipationInput");
      const cloneWrap = document.getElementById("attWeekCloneWrap");
      const clearBossesOpt = document.getElementById("attWeekClearBossesOption");
      const delBtn = document.getElementById("attWeekModalDelBtn");
      const errEl = document.getElementById("attWeekModalError");

      if (errEl) errEl.style.display = "none";

      if (weekId) {
        const target = (attendanceState.weeks || []).find(w => w.id === weekId);
        if (!target) return;
        if (titleEl) titleEl.textContent = "Chỉnh Sửa Tuần Chấm Công";
        if (subEl) subEl.textContent = "Thay đổi tiêu đề, ghi chú ngày tháng và quỹ thưởng";
        if (editIdInput) editIdInput.value = target.id;
        if (nameInput) nameInput.value = target.name || "";
        if (dateInput) dateInput.value = target.dateRange || "";
        if (diasInput) diasInput.value = target.diasPool || 0;
        if (usdtInput) usdtInput.value = target.usdtPool || 0;
        if (thresholdInput) thresholdInput.value = normalizeMinimumParticipationPercent(target.minimumParticipationPercent);
        if (cloneWrap) cloneWrap.style.display = "none";
        if (delBtn) delBtn.style.display = (attendanceState.weeks && attendanceState.weeks.length > 1) ? "inline-flex" : "none";
      } else {
        const nextNum = (attendanceState.weeks ? attendanceState.weeks.length : 0) + 1;
        const currWeek = getActiveWeek();
        if (titleEl) titleEl.textContent = "Thêm Tuần Chấm Công Mới";
        if (subEl) subEl.textContent = "Thiết lập tiêu đề tuần, khoảng ngày diễn ra và sao chép dữ liệu";
        if (editIdInput) editIdInput.value = "";
        if (nameInput) nameInput.value = "Tuần " + nextNum;
        if (dateInput) dateInput.value = getSuggestedWeekRange(0);
        if (diasInput) diasInput.value = currWeek?.diasPool || 52500;
        if (usdtInput) usdtInput.value = currWeek?.usdtPool || 867;
        if (thresholdInput) thresholdInput.value = normalizeMinimumParticipationPercent(currWeek?.minimumParticipationPercent);
        if (cloneWrap) cloneWrap.style.display = "block";
        if (clearBossesOpt) clearBossesOpt.checked = true;
        if (delBtn) delBtn.style.display = "none";
      }

      modal.classList.add("open");
      syncModalScrollLock();
      setTimeout(() => nameInput?.focus(), 50);
    }

    function closeAttendanceWeekModal() {
      const modal = document.getElementById("attWeekModal");
      if (modal) modal.classList.remove("open");
      syncModalScrollLock();
    }

    function saveAttendanceWeek() {
      if (!isAdmin()) return;
      const editIdInput = document.getElementById("attWeekEditId");
      const nameInput = document.getElementById("attWeekNameInput");
      const dateInput = document.getElementById("attWeekDateRangeInput");
      const diasInput = document.getElementById("attWeekDiasPoolInput");
      const usdtInput = document.getElementById("attWeekUsdtPoolInput");
      const thresholdInput = document.getElementById("attWeekMinimumParticipationInput");
      const clearBossesOpt = document.getElementById("attWeekClearBossesOption");
      const errEl = document.getElementById("attWeekModalError");

      const name = (nameInput?.value || "").trim();
      const dateRange = (dateInput?.value || "").trim();
      const diasPool = Math.max(0, parseInt(diasInput?.value, 10) || 0);
      const usdtPool = Math.max(0, parseFloat(usdtInput?.value) || 0);
      const minimumParticipationPercent = normalizeMinimumParticipationPercent(thresholdInput?.value);
      const editId = (editIdInput?.value || "").trim();

      if (!name) {
        if (errEl) {
          errEl.textContent = "Vui lòng nhập tên hoặc tiêu đề tuần.";
          errEl.style.display = "block";
        }
        return;
      }

      if (editId) {
        const target = (attendanceState.weeks || []).find(w => w.id === editId);
        if (target) {
          target.name = name;
          target.dateRange = dateRange;
          target.diasPool = diasPool;
          target.usdtPool = usdtPool;
          target.minimumParticipationPercent = minimumParticipationPercent;
          showToast(`✅ Đã cập nhật "${name}"!`);
        }
      } else {
        const currWeek = getActiveWeek();
        const newWeekId = "week_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);

        let copiedActivities = [];
        let copiedMembers = [];

        const shouldClearBosses = clearBossesOpt ? clearBossesOpt.checked : true;
        if (currWeek && !shouldClearBosses) {
          copiedActivities = JSON.parse(JSON.stringify(currWeek.activities || []));
        }
        if (currWeek) {
          copiedMembers = (currWeek.members || []).map(m => ({
            id: m.id,
            name: m.name,
            serverId: m.serverId || getDefaultAttendanceServerId(),
            color: m.color || "",
            roleColor: m.roleColor || "",
            multiplier: m.multiplier,
            role: m.role || "Member",
            records: {} // Reset to unchecked
          }));
        }

        const newWeek = {
          id: newWeekId,
          name,
          dateRange,
          diasPool,
          usdtPool,
          minimumParticipationPercent,
          activities: copiedActivities,
          members: copiedMembers,
          createdAt: Date.now()
        };

        if (!attendanceState.weeks) attendanceState.weeks = [currWeek];
        attendanceState.weeks.push(newWeek);
        attendanceState.activeWeekId = newWeekId;

        showToast(`✨ Đã thêm "${name}"! Giữ ${copiedMembers.length} thành viên${shouldClearBosses ? " và đã xóa toàn bộ cột Boss" : `, sao chép ${copiedActivities.length} Boss`}.`);
      }

      saveAttendanceState(attendanceState, true);
      closeAttendanceWeekModal();
      renderAttendanceTable();
    }

    function addNewAttendanceWeek() {
      openAttendanceWeekModal();
    }

    function switchAttendanceWeek(weekId) {
      if (!attendanceState || !attendanceState.weeks) return;
      const target = attendanceState.weeks.find(w => w.id === weekId);
      if (!target) return;
      attendanceState.activeWeekId = weekId;
      if (attendanceSyncBase) attendanceSyncBase.activeWeekId = weekId;
      saveAttendanceState(attendanceState, false);
      cacheAttendanceSyncState();
      renderAttendanceTable();
      showToast(`📅 Đang xem: ${target.name}${target.dateRange ? ` (${target.dateRange})` : ''}`);
    }

    async function deleteAttendanceWeek(weekId) {
      if (!isAdmin()) return;
      if (!attendanceState || !attendanceState.weeks || attendanceState.weeks.length <= 1) {
        showToast("Phải giữ lại ít nhất 1 tuần chấm công.");
        return;
      }
      const target = attendanceState.weeks.find(w => w.id === weekId);
      if (!target) return;

      const confirmed = await showConfirmModal({
        title: `Xóa ${target.name}?`,
        subtitle: "Dữ liệu chấm công của tuần này sẽ bị xóa hoàn toàn",
        message: `Bạn có chắc muốn xóa "${target.name}"? Hành động này không thể hoàn tác.`,
        confirmText: "Xóa tuần này",
        cancelText: "Hủy bỏ",
        isDanger: true
      });
      if (!confirmed) return;

      attendanceState.weeks = attendanceState.weeks.filter(w => w.id !== weekId);
      if (attendanceState.activeWeekId === weekId) {
        attendanceState.activeWeekId = attendanceState.weeks[attendanceState.weeks.length - 1].id;
      }
      closeAttendanceWeekModal();
      saveAttendanceState(attendanceState, true);
      renderAttendanceTable();
      showToast(`🗑️ Đã xóa ${target.name}.`);
    }

    function renderWeekTabs() {
      const tabsWrap = document.getElementById("attWeekTabs");
      if (!tabsWrap) return;
      if (!attendanceState) attendanceState = loadAttendanceState();
      if (!attendanceState.weeks || !Array.isArray(attendanceState.weeks) || attendanceState.weeks.length === 0) {
        getActiveWeek();
      }

      const adminMode = isAdmin();
      let tabsHtml = "";

      attendanceState.weeks.forEach(w => {
        const isActive = w.id === attendanceState.activeWeekId;
        tabsHtml += `<button type="button" class="att-week-tab ${isActive ? 'active' : ''}" data-week-id="${escapeHtml(w.id)}" title="${escapeHtml(w.name)}">
          <div class="att-week-tab-info">
            <span class="att-week-tab-title">${escapeHtml(w.name)}</span>
            ${w.dateRange ? `<span class="att-week-tab-date">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              <span>${escapeHtml(w.dateRange)}</span>
            </span>` : ""}
          </div>
          ${adminMode ? `
            <div class="att-week-tab-actions">
              <span class="att-week-micro-btn att-week-edit-btn" data-week-id="${escapeHtml(w.id)}" title="Sửa tên & ngày tháng">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              </span>
              ${attendanceState.weeks.length > 1 ? `
                <span class="att-week-micro-btn att-week-del-btn" data-week-id="${escapeHtml(w.id)}" title="Xóa tuần này">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </span>` : ""
              }
            </div>` : ""
          }
        </button>`;
      });

      if (adminMode) {
        tabsHtml += `<button type="button" class="att-add-week-tab-btn" id="attAddWeekTabBtn" title="Thêm tuần mới">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          <span>Thêm Tuần</span>
        </button>`;
      }

      tabsWrap.innerHTML = tabsHtml;

      tabsWrap.querySelectorAll(".att-week-tab").forEach(tab => {
        tab.addEventListener("click", (e) => {
          const editBtn = e.target.closest(".att-week-edit-btn");
          if (editBtn) {
            e.stopPropagation();
            openAttendanceWeekModal(editBtn.dataset.weekId);
            return;
          }
          const delBtn = e.target.closest(".att-week-del-btn");
          if (delBtn) {
            e.stopPropagation();
            deleteAttendanceWeek(delBtn.dataset.weekId);
            return;
          }
          const weekId = tab.dataset.weekId;
          if (weekId && weekId !== attendanceState.activeWeekId) {
            switchAttendanceWeek(weekId);
          }
        });
      });

      const addTabBtn = document.getElementById("attAddWeekTabBtn");
      if (addTabBtn) {
        addTabBtn.addEventListener("click", () => {
          openAttendanceWeekModal();
        });
      }
    }

    async function migrateLegacyFirebaseAttendanceIfNeeded() {
      if (!firebaseDb || attendanceFirebaseMigrationInFlight) return null;
      attendanceFirebaseMigrationInFlight = true;
      try {
        const legacyItems = [];
        for (const sv of serverList) {
          const serverId = sv.id || getDefaultAttendanceServerId();
          const legacyPath = getLegacyFirebaseAttendancePath(serverId);
          try {
            const snapshot = await firebaseDb.ref(legacyPath).once("value");
            const legacyState = snapshot.val();
            if (legacyState) {
              legacyItems.push({ serverId, key: legacyPath, state: legacyState });
            }
          } catch (err) {
            const permissionDenied = /permission[_ -]denied/i.test(String(err?.code || err?.message || ""));
            if (!permissionDenied) throw err;
            // Legacy nodes may no longer be covered by current Firebase rules.
            // Skipping them must not prevent the current localStorage state from
            // being seeded into the new rules-approved Attendance path.
            console.warn("Skipping inaccessible legacy Firebase attendance path:", legacyPath);
          }
        }
        return mergeAttendanceStatesForMigration(legacyItems);
      } catch (err) {
        console.warn("Firebase legacy attendance migration error:", err);
        throw err;
      } finally {
        attendanceFirebaseMigrationInFlight = false;
      }
    }

    function handleAttendanceSyncError(err) {
      const permissionDenied = /permission[_ -]denied/i.test(String(err?.code || err?.message || ""));
      if (permissionDenied && attendanceRemotePermissionDenied) return;
      if (permissionDenied) attendanceRemotePermissionDenied = true;
      attendancePendingRemoteSave = false;
      console.error("Firebase attendance sync error:", err);
      showToast(permissionDenied
        ? "Attendance chưa đồng bộ: Firebase từ chối quyền truy cập. Dữ liệu vẫn được lưu trên trình duyệt này."
        : "Attendance chưa đồng bộ lên Firebase. Dữ liệu vẫn được lưu trên trình duyệt này.");
    }

    async function pushAttendanceToFirebase(seedOnly = false, seedBase = null) {
      if (!attendanceDbRef || !isAdmin() || attendanceRemotePermissionDenied) return;
      if (attendanceRemoteSaveInFlight || !attendanceRemoteStateReady || attendanceFirebaseMigrationInFlight) {
        attendancePendingRemoteSave = true;
        return;
      }
      const local = getAttendanceSyncData(attendanceState);
      const base = cloneRealtimeValue(attendanceSyncBase || local);
      if (!seedOnly && JSON.stringify(base) === JSON.stringify(local)) return;
      const saveRef = attendanceDbRef;
      attendanceRemoteSaveInFlight = true;
      attendancePendingRemoteSave = false;
      attendanceDeferredRemoteData = null;
      let saved = false;
      try {
        const result = await saveRef.transaction(current => {
          if (seedOnly && current) return;
          const remote = current ? getAttendanceSyncData(normalizeAttendanceState(cloneRealtimeValue(current), getDefaultAttendanceServerId())) : null;
          const merged = remote ? mergeRealtimeChanges(base, local, remote) : cloneRealtimeValue(local);
          return normalizeAttendanceState({
            ...merged,
            updatedAt: Date.now(),
            updatedBy: CLIENT_ID,
            version: (Number(current?.version) || 0) + 1
          }, getDefaultAttendanceServerId());
        }, undefined, false);
        const confirmed = result.snapshot.val();
        if (confirmed) {
          applyAttendanceRemoteData(confirmed, result.committed ? local : (seedBase || local));
          if (attendanceDeferredRemoteData && Number(attendanceDeferredRemoteData.version) > Number(confirmed.version)) {
            applyAttendanceRemoteData(attendanceDeferredRemoteData);
          }
        }
        saved = true;
      } catch (err) {
        handleAttendanceSyncError(err);
      } finally {
        attendanceRemoteSaveInFlight = false;
        attendanceDeferredRemoteData = null;
        const savePending = attendancePendingRemoteSave;
        attendancePendingRemoteSave = false;
        if (saved && (savePending || JSON.stringify(attendanceSyncBase) !== JSON.stringify(getAttendanceSyncData(attendanceState)))) {
          pushAttendanceToFirebase();
        }
      }
    }

    function initAttendanceRealtimeSync() {
      if (!attendanceDbRef) return;
      if (activeAttendanceRef === attendanceDbRef) return;
      try {
        if (activeAttendanceRef) activeAttendanceRef.off();
      } catch (e) {}
      activeAttendanceRef = attendanceDbRef;
      const subscribedRef = attendanceDbRef;

      subscribedRef.on("value", (snapshot) => {
        if (subscribedRef !== activeAttendanceRef || attendanceRemotePermissionDenied) return;
        const remoteData = snapshot.val();
        attendanceRemoteStateReady = true;
        if (remoteData) attendanceRemoteDataExists = true;
        if (attendanceRemoteSaveInFlight) {
          attendanceDeferredRemoteData = cloneRealtimeValue(remoteData);
          return;
        }
        if (!remoteData) {
          if (isAdmin() && attendanceState && !attendanceFirebaseSeedAttempted) {
            // A rejected Firebase write emits the empty value again; seed only once per page load.
            attendanceFirebaseSeedAttempted = true;
            const beforeMigration = getAttendanceSyncData(attendanceState);
            migrateLegacyFirebaseAttendanceIfNeeded().then(migrated => {
              if (attendanceRemotePermissionDenied) return;
              if (attendanceRemoteDataExists) {
                pushAttendanceToFirebase();
                return;
              }
              const seedBase = migrated ? getAttendanceSyncData(migrated) : beforeMigration;
              if (migrated) {
                const merged = mergeRealtimeChanges(beforeMigration, getAttendanceSyncData(attendanceState), seedBase);
                attendanceState = normalizeAttendanceState({ ...migrated, ...merged }, getDefaultAttendanceServerId());
                cacheAttendanceSyncState();
                renderAttendanceTable();
              }
              pushAttendanceToFirebase(true, seedBase);
            }).catch(handleAttendanceSyncError);
          }
          return;
        }

        applyAttendanceRemoteData(remoteData);
        if (isAdmin()) pushAttendanceToFirebase();
      }, handleAttendanceSyncError);
    }

    function formatPoints(val) {
      if (val == null || isNaN(val)) return "0";
      const num = Number(val);
      return Number.isInteger(num) ? String(num) : Number(num.toFixed(2)).toString();
    }

    function formatParticipationPercent(value) {
      return Number(Number(value).toPrecision(15)).toString();
    }

    function allocateLargestRemainder(weights, totalUnits) {
      if (!weights || weights.length === 0 || totalUnits <= 0) {
        return (weights || []).map(() => 0);
      }
      const totalWeight = weights.reduce((sum, w) => sum + (Number(w) || 0), 0);
      if (totalWeight <= 0) {
        return weights.map(() => 0);
      }
      const items = weights.map((w, idx) => {
        const val = Number(w) || 0;
        if (val <= 0) {
          return { idx, base: 0, fraction: -1, val: 0 };
        }
        const theoretical = (val / totalWeight) * totalUnits;
        const base = Math.floor(theoretical);
        return {
          idx,
          base,
          fraction: theoretical - base,
          val
        };
      });

      let currentSum = items.reduce((s, it) => s + it.base, 0);
      let remainder = Math.round(totalUnits - currentSum);

      // Sort descending by fraction, tie-break by original index ascending
      items.sort((a, b) => (b.fraction - a.fraction) || (a.idx - b.idx));

      for (let i = 0; i < remainder; i++) {
        const target = items[i % items.length];
        if (target.val > 0) {
          target.base += 1;
        }
      }

      // Restore original member order
      items.sort((a, b) => a.idx - b.idx);
      return items.map(it => it.base);
    }

    function getMemberServerId(member) {
      return member?.serverId || getDefaultAttendanceServerId();
    }

    function getMemberServerName(member) {
      return getServerNameById(getMemberServerId(member));
    }

    function renderAttendanceServerFilterOptions() {
      const filter = document.getElementById("attFilterServer");
      if (!filter) return;
      const previousValue = attendanceServerFilter || "all";
      const options = [`<option value="all">Tất cả Server</option>`]
        .concat(serverList.map(s => `<option value="${escapeHtml(s.id)}">${escapeHtml(s.name || s.id)}</option>`));
      filter.innerHTML = options.join("");
      attendanceServerFilter = previousValue === "all" || serverList.some(s => s.id === previousValue)
        ? previousValue
        : "all";
      filter.value = attendanceServerFilter;
    }

    function populateAttendanceMemberServerSelect(selectedServerId) {
      const select = document.getElementById("attMemberServerSelect");
      if (!select) return;
      const fallbackServerId = selectedServerId || getDefaultAttendanceServerId();
      const options = serverList.map(s => `<option value="${escapeHtml(s.id)}">${escapeHtml(s.name || s.id)}</option>`);
      if (!serverList.some(s => s.id === fallbackServerId)) {
        options.unshift(`<option value="${escapeHtml(fallbackServerId)}">${escapeHtml(getServerNameById(fallbackServerId))}</option>`);
      }
      select.innerHTML = options.join("");
      select.value = fallbackServerId;
    }

    function calculateAttendanceData(stateObj) {
      if (!stateObj) return { membersCalc: [], serverSummaries: [], totalGuildRawPoints: 0, totalGuildPPoints: 0, totalEligiblePPoints: 0, minimumParticipationPercent: 0, eligibleMembersCount: 0, ineligibleMembersCount: 0, maxPossiblePoints: 0, diasPool: 0, usdtPool: 0, diasRate: 0, usdtRate: 0, activitiesCount: 0, membersCount: 0 };

      let week = stateObj;
      if (stateObj.weeks && Array.isArray(stateObj.weeks) && stateObj.weeks.length > 0) {
        week = stateObj.weeks.find(w => w.id === stateObj.activeWeekId) || stateObj.weeks[0];
      }

      const activities = week?.activities || [];
      const members = week?.members || [];
      const diasPool = Math.max(0, Math.round(Number(week?.diasPool) || 0));
      const usdtPool = Math.max(0, parseFloat(week?.usdtPool) || 0);
      const minimumParticipationPercent = normalizeMinimumParticipationPercent(week?.minimumParticipationPercent);

      const maxPossiblePoints = activities.reduce((sum, act) => sum + (Number(act.points) || 0), 0);

      let totalGuildRawPoints = 0;
      let totalGuildPPoints = 0;
      let totalEligiblePPoints = 0;
      const serverSummaryMap = new Map();

      const membersCalc = members.map(m => {
        const records = m.records || {};
        const serverId = getMemberServerId(m);
        const serverName = getServerNameById(serverId);
        let rawPoints = 0;
        activities.forEach(act => {
          if (records[act.id]) {
            rawPoints += (Number(act.points) || 0);
          }
        });

        const multiplier = Number(m.multiplier) || 1.0;
        const pPoints = rawPoints * multiplier;
        // Multiply first so exact boundaries such as 58% do not drift below the threshold.
        const percent = maxPossiblePoints > 0
          ? (rawPoints === maxPossiblePoints ? 100 : (rawPoints * 100) / maxPossiblePoints)
          : 0;
        const eligible = percent >= minimumParticipationPercent;
        const eligiblePPoints = eligible ? pPoints : 0;

        totalGuildRawPoints += rawPoints;
        totalGuildPPoints += pPoints;
        totalEligiblePPoints += eligiblePPoints;

        if (!serverSummaryMap.has(serverId)) {
          serverSummaryMap.set(serverId, { serverId, serverName, members: 0, rawPoints: 0, pPoints: 0 });
        }
        const summary = serverSummaryMap.get(serverId);
        summary.members += 1;
        summary.rawPoints += rawPoints;
        summary.pPoints += pPoints;

        return {
          ...m,
          serverId,
          serverName,
          rawPoints,
          multiplier,
          pPoints,
          percent,
          eligible,
          eligiblePPoints,
          dias: 0,
          usdt: 0
        };
      });

      const diasRate = totalEligiblePPoints > 0 ? (diasPool / totalEligiblePPoints) : 0;
      const usdtRate = totalEligiblePPoints > 0 ? (usdtPool / totalEligiblePPoints) : 0;

      // Final rewards using Largest Remainder Method (Hamilton method)
      if (totalEligiblePPoints > 0) {
        const rewardedMembers = membersCalc.filter(m => m.eligible && m.eligiblePPoints > 0);
        const rawPtsList = rewardedMembers.map(m => m.eligiblePPoints);
        const diasAlloc = allocateLargestRemainder(rawPtsList, diasPool);
        const usdtCentsAlloc = allocateLargestRemainder(rawPtsList, Math.round(usdtPool * 100));

        rewardedMembers.forEach((m, idx) => {
          m.dias = diasAlloc[idx];
          m.usdt = usdtCentsAlloc[idx] / 100;
        });
      }

      const serverOrder = new Map(serverList.map((s, idx) => [s.id, idx]));
      const serverSummaries = Array.from(serverSummaryMap.values()).sort((a, b) => {
        const aOrder = serverOrder.has(a.serverId) ? serverOrder.get(a.serverId) : 9999;
        const bOrder = serverOrder.has(b.serverId) ? serverOrder.get(b.serverId) : 9999;
        return (aOrder - bOrder) || a.serverName.localeCompare(b.serverName);
      }).map(item => ({
        ...item,
        share: totalGuildPPoints > 0 ? (item.pPoints / totalGuildPPoints) * 100 : 0
      }));

      return {
        membersCalc,
        serverSummaries,
        totalGuildRawPoints,
        totalGuildPPoints,
        totalEligiblePPoints,
        minimumParticipationPercent,
        eligibleMembersCount: membersCalc.filter(m => m.eligible).length,
        ineligibleMembersCount: membersCalc.filter(m => !m.eligible).length,
        maxPossiblePoints,
        diasPool,
        usdtPool,
        diasRate,
        usdtRate,
        activitiesCount: activities.length,
        membersCount: members.length
      };
    }

    function renderAttendanceTable() {
      if (!attendanceState) attendanceState = loadAttendanceState();

      renderWeekTabs();

      const currWeek = getActiveWeek();
      const calc = calculateAttendanceData(attendanceState);
      renderAttendanceServerFilterOptions();

      // 1. Update Top Stat Cards
      const diasInput = document.getElementById("attDiasPoolInput");
      if (diasInput && document.activeElement !== diasInput) {
        diasInput.value = calc.diasPool;
        diasInput.readOnly = !isAdmin();
      }
      const diasRateEl = document.getElementById("attDiasRateText");
      if (diasRateEl) diasRateEl.textContent = calc.diasRate.toFixed(2);

      const usdtInput = document.getElementById("attUsdtPoolInput");
      if (usdtInput && document.activeElement !== usdtInput) {
        usdtInput.value = calc.usdtPool;
        usdtInput.readOnly = !isAdmin();
      }
      const usdtRateEl = document.getElementById("attUsdtRateText");
      if (usdtRateEl) usdtRateEl.textContent = calc.usdtRate.toFixed(4);

      const membersCountEl = document.getElementById("attTotalMembersCount");
      if (membersCountEl) membersCountEl.textContent = calc.membersCount;

      const actCountEl = document.getElementById("attTotalActivitiesCount");
      if (actCountEl) actCountEl.textContent = calc.activitiesCount;

      const maxPtsEl = document.getElementById("attMaxPossiblePoints");
      if (maxPtsEl) maxPtsEl.textContent = calc.maxPossiblePoints;

      const guildPPointsEl = document.getElementById("attTotalGuildPPoints");
      if (guildPPointsEl) guildPPointsEl.textContent = formatPoints(calc.totalGuildPPoints);

      const guildRawPointsEl = document.getElementById("attTotalGuildRawPoints");
      if (guildRawPointsEl) guildRawPointsEl.textContent = calc.totalGuildRawPoints.toLocaleString("vi-VN");

      const thresholdInput = document.getElementById("attMinimumParticipationInput");
      if (thresholdInput) {
        if (document.activeElement !== thresholdInput || normalizeMinimumParticipationPercent(thresholdInput.value) !== calc.minimumParticipationPercent) {
          thresholdInput.value = calc.minimumParticipationPercent;
        }
        thresholdInput.readOnly = !isAdmin();
      }
      const thresholdText = document.getElementById("attThresholdText");
      if (thresholdText) thresholdText.textContent = `Ngưỡng nhận thưởng: ≥ ${calc.minimumParticipationPercent}%`;
      const eligiblePPointsEl = document.getElementById("attTotalEligiblePPoints");
      if (eligiblePPointsEl) eligiblePPointsEl.textContent = formatPoints(calc.totalEligiblePPoints);
      const eligibilitySummary = document.getElementById("attEligibilitySummary");
      if (eligibilitySummary) eligibilitySummary.textContent = `${calc.eligibleMembersCount} đủ điều kiện · ${calc.ineligibleMembersCount} không đạt`;

      const weekLabel = document.getElementById("attWeekLabel");
      if (weekLabel) {
        weekLabel.textContent = currWeek?.name || "Tuần Này";
      }

      const serverBadge = document.getElementById("attServerBadge");
      if (serverBadge) {
        serverBadge.textContent = attendanceServerFilter === "all"
          ? "Toàn Guild • Tất cả Server"
          : `Toàn Guild • Lọc: ${getServerNameById(attendanceServerFilter)}`;
      }

      const serverSummaryEl = document.getElementById("attServerSummary");
      if (serverSummaryEl) {
        const summaryHtml = calc.serverSummaries.map(item => `
          <div class="att-server-summary-pill">
            <strong>${escapeHtml(item.serverName)}</strong>
            <span>${item.members} thành viên • ${formatPoints(item.pPoints)} P.Point • ${item.share.toFixed(2)}%</span>
          </div>
        `).join("");
        serverSummaryEl.innerHTML = summaryHtml + `
          <div class="att-server-summary-pill">
            <strong>TOÀN GUILD</strong>
            <span>${calc.membersCount} thành viên • ${formatPoints(calc.totalGuildPPoints)} P.Point • 100%</span>
          </div>
        `;
      }

      // Update Role permissions on top cards
      const diasTag = document.getElementById("attDiasAdminTag");
      if (diasTag) diasTag.style.display = isAdmin() ? "inline-block" : "none";
      const usdtTag = document.getElementById("attUsdtAdminTag");
      if (usdtTag) usdtTag.style.display = isAdmin() ? "inline-block" : "none";

      // 2. Render Table Header
      const headEl = document.getElementById("attTableHead");
      if (!headEl) return;

      const activities = currWeek.activities || [];
      const adminMode = isAdmin();

      let headHtml = `<tr>
        <th class="col-sticky col-stt">#</th>
        <th class="col-sticky col-name">Thành Viên</th>
        <th class="col-sticky col-server">Server</th>
        <th class="col-sticky col-mult">Hệ Số</th>
        <th class="col-sticky col-usdt">💵 USDT</th>
        <th class="col-sticky col-dias">💎 DIAS</th>
        <th class="col-sticky col-ppoints">P.Point<br>thực tế</th>
        <th class="col-sticky col-raw">📊 Điểm Thô</th>
        <th class="col-sticky col-percent">🎯 % Tham Gia</th>
        <th class="col-reward-points">Reward<br>P.Point</th>
        <th class="col-eligibility">Điều kiện thưởng</th>`;

      activities.forEach((act) => {
        headHtml += `<th class="col-act" data-act-id="${escapeHtml(act.id)}">
          <div class="act-card-header">
            <div class="act-header-date">${escapeHtml(act.date || "Tự do")}</div>
            <div class="act-header-name" title="${escapeHtml(act.name)}">${escapeHtml(act.name)}</div>
            <div class="act-header-points">⭐ ${act.points} Điểm</div>
            ${adminMode ? `
              <div class="act-header-bottom">
                <label class="act-check-all-label" title="Tích chọn tất cả thành viên cột này">
                  <input type="checkbox" class="att-check-all-box" data-act-id="${escapeHtml(act.id)}">
                  <span>Tất cả</span>
                </label>
                <div class="act-btn-row">
                  <button type="button" class="att-btn-micro att-edit-act-btn" data-act-id="${escapeHtml(act.id)}" title="Sửa tên / điểm">✏️</button>
                  <button type="button" class="att-btn-micro att-del-act-btn" data-act-id="${escapeHtml(act.id)}" title="Xóa cột này">🗑️</button>
                </div>
              </div>` : ""
            }
          </div>
        </th>`;
      });

      if (adminMode) {
        headHtml += `<th class="col-actions">Thao tác</th>`;
      }
      headHtml += `</tr>`;
      headEl.innerHTML = headHtml;

      // 3. Filter Members
      let filteredMembers = calc.membersCalc;
      if (attendanceSearchTerm.trim()) {
        const q = attendanceSearchTerm.trim().toLowerCase();
        filteredMembers = filteredMembers.filter(m => {
          const haystack = [
            m.name,
            m.role,
            m.serverName,
            m.serverId
          ].filter(Boolean).join(" ").toLowerCase();
          return haystack.includes(q);
        });
      }
      if (attendanceServerFilter !== "all") {
        filteredMembers = filteredMembers.filter(m => m.serverId === attendanceServerFilter);
      }
      if (attendanceMultiplierFilter !== "all") {
        const targetMult = Number(attendanceMultiplierFilter);
        filteredMembers = filteredMembers.filter(m => Math.abs(m.multiplier - targetMult) < 0.05);
      }

      // 4. Render Table Body
      const bodyEl = document.getElementById("attTableBody");
      if (!bodyEl) return;

      if (filteredMembers.length === 0) {
        const colSpanTotal = 11 + activities.length + (adminMode ? 1 : 0);
        bodyEl.innerHTML = `<tr><td colspan="${colSpanTotal}" style="text-align:center; padding:30px; color:var(--muted);">
          Không tìm thấy thành viên nào phù hợp.
        </td></tr>`;
        return;
      }

      let bodyHtml = "";
      filteredMembers.forEach((m, idx) => {
        const badgeClass = m.eligible ? "att-badge-high" : "att-badge-low";

        bodyHtml += `<tr data-member-id="${escapeHtml(m.id)}">
          <td class="col-sticky col-stt">${idx + 1}</td>
          <td class="col-sticky col-name">
            <div style="display:flex; flex-direction:column; align-items:flex-start; gap:2px;">
              <span class="member-display-name" style="${m.color ? `color: ${escapeHtml(m.color)} !important; text-shadow: 0 0 10px ${escapeHtml(m.color)}55;` : ''}">${escapeHtml(m.name)}</span>
              ${m.role ? `<span class="member-role-badge" style="${m.roleColor ? `color: ${escapeHtml(m.roleColor)} !important; background: ${escapeHtml(m.roleColor)}22 !important; border-color: ${escapeHtml(m.roleColor)}55 !important;` : ''}">${escapeHtml(m.role)}</span>` : ""}
            </div>
          </td>
          <td class="col-sticky col-server">
            <span class="att-server-tag" title="${escapeHtml(m.serverName)}">${escapeHtml(m.serverName)}</span>
          </td>
          <td class="col-sticky col-mult">
            <span class="att-mult-tag">x${m.multiplier}</span>
          </td>
          <td class="col-sticky col-usdt">
            <span class="val-usdt">${m.usdt.toLocaleString("vi-VN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</span>
          </td>
          <td class="col-sticky col-dias">
            <span class="val-dias">${m.dias.toLocaleString("vi-VN")}</span>
          </td>
          <td class="col-sticky col-ppoints">
            <span class="val-ppoints">${formatPoints(m.pPoints)}</span>
          </td>
          <td class="col-sticky col-raw">
            <span class="val-raw">${m.rawPoints}</span>
          </td>
          <td class="col-sticky col-percent">
            <span class="att-badge ${badgeClass}" title="${m.percent}%">${formatParticipationPercent(m.percent)}%</span>
          </td>
          <td class="col-reward-points">
            <span class="val-reward-ppoints">${formatPoints(m.eligiblePPoints)}</span>
          </td>
          <td class="col-eligibility">
            <span class="att-eligibility ${m.eligible ? "eligible" : "ineligible"}">${m.eligible ? "✅ Đủ điều kiện" : "❌ Không đạt"}</span>
          </td>`;

        const records = m.records || {};
        activities.forEach(act => {
          const isChecked = Boolean(records[act.id]);
          bodyHtml += `<td class="col-act-cell ${isChecked ? "checked" : ""}">
            <input type="checkbox" class="att-checkbox"
              data-member-id="${escapeHtml(m.id)}"
              data-act-id="${escapeHtml(act.id)}"
              ${isChecked ? "checked" : ""}
              ${adminMode ? "" : "disabled"}
              title="${escapeHtml(m.name)} - ${escapeHtml(act.name)} (${act.points}đ)">
          </td>`;
        });

        if (adminMode) {
          bodyHtml += `<td class="col-actions">
            <div class="row-actions-wrap">
              <button type="button" class="att-btn-micro att-edit-member-btn" data-member-id="${escapeHtml(m.id)}" title="Sửa tên & hệ số">✏️</button>
              <button type="button" class="att-btn-micro att-del-member-btn" data-member-id="${escapeHtml(m.id)}" title="Xóa thành viên này">🗑️</button>
            </div>
          </td>`;
        }

        bodyHtml += `</tr>`;
      });

      bodyEl.innerHTML = bodyHtml;
      bindAttendanceTableEvents();
    }

    function bindAttendanceTableEvents() {
      const adminMode = isAdmin();

      // Checkbox click
      document.querySelectorAll(".att-table .att-checkbox").forEach(chk => {
        chk.addEventListener("change", (e) => {
          if (!adminMode) {
            e.preventDefault();
            showToast("Chỉ Quản trị viên (Admin) mới có quyền tích chấm công.");
            requestAdminLogin();
            return;
          }
          const memberId = chk.dataset.memberId;
          const actId = chk.dataset.actId;
          toggleAttendanceCheck(memberId, actId, chk.checked);
        });
      });

      // Check All column
      document.querySelectorAll(".att-check-all-box").forEach(chkAll => {
        chkAll.addEventListener("change", (e) => {
          if (!adminMode) {
            e.preventDefault();
            return;
          }
          const actId = chkAll.dataset.actId;
          toggleAllAttendanceForActivity(actId, chkAll.checked);
        });
      });

      // Edit Member buttons
      document.querySelectorAll(".att-edit-member-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          if (!adminMode) return;
          const memberId = btn.dataset.memberId;
          openAttendanceMemberModal(memberId);
        });
      });

      // Delete Member buttons
      document.querySelectorAll(".att-del-member-btn").forEach(btn => {
        btn.addEventListener("click", async () => {
          if (!adminMode) return;
          const memberId = btn.dataset.memberId;
          const currWeek = getActiveWeek();
          const member = currWeek.members.find(m => m.id === memberId);
          if (!member) return;
          const confirmed = await showConfirmModal({
            title: "Xóa thành viên?",
            subtitle: "Hành động này sẽ xóa thành viên khỏi bảng chấm công",
            message: `Bạn có chắc muốn xóa thành viên "${member.name}"? Dữ liệu điểm của thành viên này trong tuần sẽ bị mất.`,
            confirmText: "Xóa thành viên",
            cancelText: "Hủy bỏ",
            isDanger: true
          });
          if (confirmed) {
            deleteAttendanceMember(memberId);
          }
        });
      });

      // Edit Activity buttons
      document.querySelectorAll(".att-edit-act-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          if (!adminMode) return;
          const actId = btn.dataset.actId;
          openAttendanceActivityModal(actId);
        });
      });

      // Delete Activity buttons
      document.querySelectorAll(".att-del-act-btn").forEach(btn => {
        btn.addEventListener("click", async () => {
          if (!adminMode) return;
          const actId = btn.dataset.actId;
          const currWeek = getActiveWeek();
          const act = currWeek.activities.find(a => a.id === actId);
          if (!act) return;
          const confirmed = await showConfirmModal({
            title: "Xóa hoạt động / boss?",
            subtitle: "Cột điểm sẽ bị xóa khỏi bảng",
            message: `Bạn có chắc muốn xóa cột "${act.name} (${act.points}đ)"? Điểm đã chấm ở cột này của tất cả thành viên sẽ bị xóa.`,
            confirmText: "Xóa cột",
            cancelText: "Hủy bỏ",
            isDanger: true
          });
          if (confirmed) {
            deleteAttendanceActivity(actId);
          }
        });
      });
    }

    function toggleAttendanceCheck(memberId, actId, isChecked) {
      if (!attendanceState) return;
      const currWeek = getActiveWeek();
      const member = currWeek.members.find(m => m.id === memberId);
      if (!member) return;
      if (!member.records) member.records = {};
      if (isChecked) {
        member.records[actId] = true;
      } else {
        delete member.records[actId];
      }
      saveAttendanceState(attendanceState, true);
      renderAttendanceTable();
    }

    function toggleAllAttendanceForActivity(actId, isChecked) {
      if (!attendanceState) return;
      const currWeek = getActiveWeek();
      currWeek.members.forEach(m => {
        if (!m.records) m.records = {};
        if (isChecked) {
          m.records[actId] = true;
        } else {
          delete m.records[actId];
        }
      });
      saveAttendanceState(attendanceState, true);
      renderAttendanceTable();
      showToast(isChecked ? "✅ Đã tích chọn tất cả cho hoạt động này" : "Đã bỏ chọn tất cả");
    }

    function updateMemberModalPreview() {
      const nameInput = document.getElementById("attMemberNameInput");
      const roleInput = document.getElementById("attMemberRoleInput");
      const colorVal = document.getElementById("attMemberColorVal")?.value || "";
      const roleColorVal = document.getElementById("attMemberRoleColorVal")?.value || "#f59e0b";
      const namePreview = document.getElementById("attMemberColorPreview");
      const roleBadgePreview = document.getElementById("attMemberRoleBadgePreview");

      if (namePreview) {
        namePreview.textContent = (nameInput?.value || "").trim() || "Xem trước tên";
        namePreview.style.color = colorVal || "var(--text)";
        if (colorVal) {
          namePreview.style.textShadow = `0 0 8px ${colorVal}66`;
        } else {
          namePreview.style.textShadow = "none";
        }
      }

      if (roleBadgePreview) {
        const roleText = (roleInput?.value || "").trim();
        if (roleText) {
          roleBadgePreview.style.display = "inline-flex";
          roleBadgePreview.textContent = roleText;
          roleBadgePreview.style.color = roleColorVal;
          roleBadgePreview.style.background = `${roleColorVal}22`;
          roleBadgePreview.style.borderColor = `${roleColorVal}55`;
        } else {
          roleBadgePreview.style.display = "none";
        }
      }
    }

    function selectMemberColor(colorHex) {
      const colorValInput = document.getElementById("attMemberColorVal");
      const customInput = document.getElementById("attMemberCustomColor");
      if (colorValInput) colorValInput.value = colorHex || "";
      
      const chips = document.querySelectorAll("#attMemberColorRow .att-color-chip");
      let matched = false;
      chips.forEach(chip => {
        const c = chip.dataset.color || "";
        if (c.toLowerCase() === (colorHex || "").toLowerCase()) {
          chip.classList.add("active");
          matched = true;
        } else {
          chip.classList.remove("active");
        }
      });
      if (!matched && colorHex && customInput) {
        customInput.value = colorHex;
      }
      updateMemberModalPreview();
    }

    function selectMemberRoleColor(colorHex) {
      const roleColorValInput = document.getElementById("attMemberRoleColorVal");
      const customRoleInput = document.getElementById("attMemberCustomRoleColor");
      const color = colorHex || "#f59e0b";
      if (roleColorValInput) roleColorValInput.value = color;

      const chips = document.querySelectorAll("#attMemberRoleColorRow .att-color-chip");
      let matched = false;
      chips.forEach(chip => {
        const c = chip.dataset.roleColor || "";
        if (c.toLowerCase() === color.toLowerCase()) {
          chip.classList.add("active");
          matched = true;
        } else {
          chip.classList.remove("active");
        }
      });
      if (!matched && customRoleInput) {
        customRoleInput.value = color;
      }
      updateMemberModalPreview();
    }

    // Modal Member Functions
    function openAttendanceMemberModal(memberId = null) {
      const modal = document.getElementById("attMemberModal");
      if (!modal) return;
      const titleEl = document.getElementById("attMemberModalTitle");
      const nameInput = document.getElementById("attMemberNameInput");
      const multInput = document.getElementById("attMemberMultiplierInput");
      const roleInput = document.getElementById("attMemberRoleInput");
      const editIdInput = document.getElementById("attMemberEditId");
      const delBtn = document.getElementById("attDeleteMemberBtn");
      const errEl = document.getElementById("attMemberModalError");

      if (errEl) errEl.style.display = "none";

      if (memberId) {
        const currWeek = getActiveWeek();
        const member = currWeek.members.find(m => m.id === memberId);
        if (!member) return;
        if (titleEl) titleEl.textContent = "Chỉnh Sửa Thành Viên";
        if (editIdInput) editIdInput.value = member.id;
        if (nameInput) nameInput.value = member.name || "";
        populateAttendanceMemberServerSelect(member.serverId || getDefaultAttendanceServerId());
        if (multInput) multInput.value = member.multiplier || 1.0;
        if (roleInput) roleInput.value = member.role || "";
        if (delBtn) delBtn.style.display = "inline-flex";

        selectMemberColor(member.color || "");
        selectMemberRoleColor(member.roleColor || "#f59e0b");
      } else {
        if (titleEl) titleEl.textContent = "Thêm Thành Viên Mới";
        if (editIdInput) editIdInput.value = "";
        if (nameInput) nameInput.value = "";
        populateAttendanceMemberServerSelect(attendanceServerFilter !== "all" ? attendanceServerFilter : getDefaultAttendanceServerId());
        if (multInput) multInput.value = "1.0";
        if (roleInput) roleInput.value = "";
        if (delBtn) delBtn.style.display = "none";

        selectMemberColor("");
        selectMemberRoleColor("#f59e0b");
      }

      updateMemberModalPreview();
      modal.classList.add("open");
      syncModalScrollLock();
      setTimeout(() => nameInput?.focus(), 50);
    }

    function closeAttendanceMemberModal() {
      const modal = document.getElementById("attMemberModal");
      if (modal) modal.classList.remove("open");
      syncModalScrollLock();
    }

    function saveAttendanceMember() {
      if (!isAdmin()) return;
      const nameInput = document.getElementById("attMemberNameInput");
      const serverSelect = document.getElementById("attMemberServerSelect");
      const multInput = document.getElementById("attMemberMultiplierInput");
      const roleInput = document.getElementById("attMemberRoleInput");
      const colorValInput = document.getElementById("attMemberColorVal");
      const roleColorValInput = document.getElementById("attMemberRoleColorVal");
      const editIdInput = document.getElementById("attMemberEditId");
      const errEl = document.getElementById("attMemberModalError");

      const name = (nameInput?.value || "").trim();
      const serverId = (serverSelect?.value || getDefaultAttendanceServerId()).trim();
      const mult = parseFloat(multInput?.value) || 1.0;
      const role = (roleInput?.value || "").trim();
      const color = (colorValInput?.value || "").trim();
      const roleColor = (roleColorValInput?.value || "").trim();
      const editId = (editIdInput?.value || "").trim();

      if (!name) {
        if (errEl) {
          errEl.textContent = "Vui lòng nhập tên thành viên.";
          errEl.style.display = "block";
        }
        return;
      }

      if (!serverId) {
        if (errEl) {
          errEl.textContent = "Vui lòng chọn Server cho thành viên.";
          errEl.style.display = "block";
        }
        return;
      }

      const currWeek = getActiveWeek();
      if (editId) {
        const member = currWeek.members.find(m => m.id === editId);
        if (member) {
          member.name = name;
          member.serverId = serverId;
          member.multiplier = mult;
          member.role = role;
          member.color = color;
          member.roleColor = roleColor;
          showToast(`✅ Đã cập nhật thành viên: ${name}`);
        }
      } else {
        const newId = "m_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
        currWeek.members.push({
          id: newId,
          name,
          serverId,
          multiplier: mult,
          role,
          color,
          roleColor,
          records: {}
        });
        showToast(`✅ Đã thêm thành viên mới: ${name}`);
      }

      saveAttendanceState(attendanceState, true);
      closeAttendanceMemberModal();
      renderAttendanceTable();
    }

    function deleteAttendanceMember(memberId) {
      if (!isAdmin() || !attendanceState) return;
      const currWeek = getActiveWeek();
      currWeek.members = currWeek.members.filter(m => m.id !== memberId);
      saveAttendanceState(attendanceState, true);
      closeAttendanceMemberModal();
      renderAttendanceTable();
      showToast("🗑️ Đã xóa thành viên.");
    }

    // Modal Activity Functions
    function openAttendanceActivityModal(actId = null) {
      const modal = document.getElementById("attActivityModal");
      if (!modal) return;
      const titleEl = document.getElementById("attActivityModalTitle");
      const dateInput = document.getElementById("attActivityDateInput");
      const nameInput = document.getElementById("attActivityNameInput");
      const ptsInput = document.getElementById("attActivityPointsInput");
      const editIdInput = document.getElementById("attActivityEditId");
      const delBtn = document.getElementById("attDeleteActivityBtn");
      const errEl = document.getElementById("attActivityModalError");

      if (errEl) errEl.style.display = "none";

      if (actId) {
        const currWeek = getActiveWeek();
        const act = currWeek.activities.find(a => a.id === actId);
        if (!act) return;
        if (titleEl) titleEl.textContent = "Sửa Boss / Hoạt Động";
        if (editIdInput) editIdInput.value = act.id;
        if (dateInput) dateInput.value = act.date || "";
        if (nameInput) nameInput.value = act.name || "";
        if (ptsInput) ptsInput.value = act.points || 1;
        if (delBtn) delBtn.style.display = "inline-flex";
      } else {
        if (titleEl) titleEl.textContent = "Thêm Boss / Hoạt Động Mới";
        if (editIdInput) editIdInput.value = "";
        // Pre-fill current day
        const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
        const d = new Date();
        const dateStr = `${days[d.getDay()]} ${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
        if (dateInput) dateInput.value = dateStr;
        if (nameInput) nameInput.value = "";
        if (ptsInput) ptsInput.value = "2";
        if (delBtn) delBtn.style.display = "none";
      }

      modal.classList.add("open");
      syncModalScrollLock();
      setTimeout(() => nameInput?.focus(), 50);
    }

    function closeAttendanceActivityModal() {
      const modal = document.getElementById("attActivityModal");
      if (modal) modal.classList.remove("open");
      syncModalScrollLock();
    }

    function saveAttendanceActivity() {
      if (!isAdmin()) return;
      const dateInput = document.getElementById("attActivityDateInput");
      const nameInput = document.getElementById("attActivityNameInput");
      const ptsInput = document.getElementById("attActivityPointsInput");
      const editIdInput = document.getElementById("attActivityEditId");
      const errEl = document.getElementById("attActivityModalError");

      const dateStr = (dateInput?.value || "").trim();
      const name = (nameInput?.value || "").trim();
      const points = parseInt(ptsInput?.value, 10) || 1;
      const editId = (editIdInput?.value || "").trim();

      if (!name) {
        if (errEl) {
          errEl.textContent = "Vui lòng nhập tên boss hoặc hoạt động.";
          errEl.style.display = "block";
        }
        return;
      }

      const currWeek = getActiveWeek();
      if (editId) {
        const act = currWeek.activities.find(a => a.id === editId);
        if (act) {
          act.date = dateStr;
          act.name = name;
          act.points = points;
          showToast(`✅ Đã cập nhật: ${name} (${points}đ)`);
        }
      } else {
        const newId = "act_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
        currWeek.activities.push({
          id: newId,
          date: dateStr,
          name,
          points
        });
        showToast(`✅ Đã thêm hoạt động: ${name} (${points}đ)`);
      }

      saveAttendanceState(attendanceState, true);
      closeAttendanceActivityModal();
      renderAttendanceTable();
    }

    function deleteAttendanceActivity(actId) {
      if (!isAdmin() || !attendanceState) return;
      const currWeek = getActiveWeek();
      currWeek.activities = currWeek.activities.filter(a => a.id !== actId);
      // Clean up records for this activity
      currWeek.members.forEach(m => {
        if (m.records && m.records[actId]) delete m.records[actId];
      });
      saveAttendanceState(attendanceState, true);
      closeAttendanceActivityModal();
      renderAttendanceTable();
      showToast("🗑️ Đã xóa cột hoạt động.");
    }

    // Export Discord
    function exportAttendanceToDiscord() {
      if (!attendanceState) attendanceState = loadAttendanceState();
      const calc = calculateAttendanceData(attendanceState);
      const currWeek = getActiveWeek();

      let md = `📊 **BẢNG TỔNG KẾT CHẤM CÔNG & LƯƠNG GUILD**\n`;
      md += `🌐 **Phạm vi:** Toàn Guild / Tất cả Server\n`;
      md += `📅 **Tuần:** ${currWeek?.name || "Tuần hiện tại"}${currWeek?.dateRange ? ` (${currWeek.dateRange})` : ""}\n`;
      md += `🎯 Điều kiện nhận thưởng: ≥ ${calc.minimumParticipationPercent}%\n`;
      md += `💎 **Quỹ Kim Cương (DIAS):** ${calc.diasPool.toLocaleString("vi-VN")} DIAS (Hệ số: ${calc.diasRate.toFixed(2)})\n`;
      md += `💵 **Quỹ USDT:** ${calc.usdtPool.toLocaleString("vi-VN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT (Hệ số: ${calc.usdtRate.toFixed(4)})\n`;
      md += `⭐ **Tổng P.Point Guild:** ${formatPoints(calc.totalGuildPPoints)} P.Point\n`;
      md += `⭐ **Tổng Reward P.Point:** ${formatPoints(calc.totalEligiblePPoints)} P.Point\n`;
      md += `👥 **Tổng thành viên:** ${calc.membersCount} | **Hoạt động:** ${calc.activitiesCount} mục\n`;
      md += `─────────────────────────────────────────\n`;
      md += `\`\`\`\n`;
      md += `STT | Tên Thành Viên | Server | Hệ Số | % Tham Gia | P.Point thực tế | Reward P.Point | Điều kiện | DIAS | USDT\n`;
      md += `----+----------------+--------+-------+------------+----------------+----------------+-----------+------+------\n`;

      calc.membersCalc.forEach((m, idx) => {
        const stt = String(idx + 1).padEnd(3, " ");
        const name = String(m.name).padEnd(14, " ");
        const server = String(m.serverName || m.serverId || "").padEnd(6, " ");
        const mult = (`x${m.multiplier}`).padEnd(5, " ");
        const pct = (`${formatParticipationPercent(m.percent)}%`).padEnd(10, " ");
        const pPts = formatPoints(m.pPoints).padEnd(7, " ");
        const rewardPts = formatPoints(m.eligiblePPoints).padEnd(7, " ");
        const eligibility = m.eligible ? "✅ Đủ điều kiện" : "❌ Không đạt";
        const dias = String(m.dias).padEnd(5, " ");
        const usdt = m.usdt.toFixed(2).padEnd(5, " ");
        md += `${stt} | ${name} | ${server} | ${mult} | ${pct} | ${pPts} | ${rewardPts} | ${eligibility} | ${dias} | ${usdt}\n`;
      });
      md += `\`\`\`\n`;
      md += `*Thành viên tham gia dưới ${calc.minimumParticipationPercent}% không nhận DIAS/USDT; P.Point thực tế vẫn được giữ nguyên.*`;

      const textarea = document.getElementById("attExportTextarea");
      if (textarea) textarea.value = md;

      const modal = document.getElementById("attExportModal");
      if (modal) {
        modal.classList.add("open");
        syncModalScrollLock();
      }
    }

    function updateAttendanceRoleUI() {
      const adminMode = isAdmin();
      // The Boss timer calls this every second; refresh Attendance only when permissions change.
      if (attendanceRoleUIMode === adminMode) return;
      attendanceRoleUIMode = adminMode;

      const addMemBtn = document.getElementById("attAddMemberBtn");
      if (addMemBtn) addMemBtn.style.display = adminMode ? "inline-flex" : "none";

      const addActBtn = document.getElementById("attAddActivityBtn");
      if (addActBtn) addActBtn.style.display = adminMode ? "inline-flex" : "none";

      const addWeekBtn = document.getElementById("attAddNewWeekBtn");
      if (addWeekBtn) addWeekBtn.style.display = adminMode ? "inline-flex" : "none";

      const backupBtn = document.getElementById("attBackupDataBtn");
      if (backupBtn) backupBtn.style.display = adminMode ? "inline-flex" : "none";

      const diasTag = document.getElementById("attDiasAdminTag");
      if (diasTag) diasTag.style.display = adminMode ? "inline-block" : "none";

      const usdtTag = document.getElementById("attUsdtAdminTag");
      if (usdtTag) usdtTag.style.display = adminMode ? "inline-block" : "none";

      const diasInput = document.getElementById("attDiasPoolInput");
      if (diasInput) diasInput.readOnly = !adminMode;

      const usdtInput = document.getElementById("attUsdtPoolInput");
      if (usdtInput) usdtInput.readOnly = !adminMode;

      const thresholdInput = document.getElementById("attMinimumParticipationInput");
      if (thresholdInput) thresholdInput.readOnly = !adminMode;

      // Re-render table to toggle disabled states on checkboxes and show/hide admin columns
      renderAttendanceTable();
    }

    async function downloadFullDataBackup() {
      if (!isAdmin()) {
        showToast("Chỉ Admin mới có quyền sao lưu dữ liệu.");
        return;
      }
      const backupBtn = document.getElementById("attBackupDataBtn");
      if (backupBtn) backupBtn.disabled = true;
      try {
        const bossStates = {};
        if (firebaseDb) {
          await Promise.all((serverList || []).map(async server => {
            const paths = getFirebaseServerPaths(server.id);
            try {
              const snapshot = await firebaseDb.ref(paths.statePath).once("value");
              bossStates[server.id] = snapshot.val();
            } catch (error) {
              bossStates[server.id] = null;
            }
          }));
        }
        if (!bossStates[currentServerId]) {
          bossStates[currentServerId] = { data: cloneRealtimeValue(state) };
        }
        let attendanceBackup = cloneRealtimeValue(attendanceState);
        if (attendanceDbRef) {
          try {
            const snapshot = await attendanceDbRef.once("value");
            if (snapshot.exists()) attendanceBackup = snapshot.val();
          } catch (error) {}
        }
        const backup = {
          format: "boss-timeline-pro-backup",
          schemaVersion: 1,
          appVersion: CURRENT_APP_VERSION,
          exportedAt: new Date().toISOString(),
          servers: cloneRealtimeValue(serverList || []),
          bossStates,
          attendance: attendanceBackup
        };
        const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        const stamp = new Date().toISOString().replace(/[:.]/g, "-");
        link.href = url;
        link.download = `boss-timeline-backup-${stamp}.json`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
        showToast("💾 Đã tải bản sao dữ liệu Boss và Attendance về máy.");
      } catch (error) {
        console.error("Backup export error:", error);
        showToast("Không thể tạo bản sao dữ liệu. Vui lòng thử lại.");
      } finally {
        if (backupBtn) backupBtn.disabled = false;
      }
    }

    function switchPageView(view) {
      const isAtt = (view === "attendance" || view === "salary" || view === "attendance-salary");
      const dashboardTitle = document.querySelector("#dashboard h1");
      const dashboardEyebrow = document.querySelector("#dashboard .eyebrow");
      const realtimeStatus = document.getElementById("realtimeStatus");
      const addBossBtn = document.getElementById("addBossBtn");
      const navItems = document.querySelectorAll(".nav .nav-item");
      const attNav = document.getElementById("navAttendanceBtn");

      if (isAtt) {
        document.body.classList.add("view-mode-attendance");
        navItems.forEach(item => item.classList.remove("active"));
        if (attNav) attNav.classList.add("active");

        if (dashboardTitle) dashboardTitle.textContent = "Global Guild Attendance";
        if (dashboardEyebrow) dashboardEyebrow.innerHTML = `<span class="server-pulse" aria-hidden="true"></span> Guild Management & Rewards`;
        if (realtimeStatus) realtimeStatus.style.display = "none";
        if (addBossBtn) addBossBtn.style.display = "none";

        if (window.location.hash !== "#attendance") {
          try {
            history.pushState(null, "", "#attendance");
          } catch (e) {
            window.location.hash = "attendance";
          }
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
        if (typeof renderAttendanceTable === "function") {
          renderAttendanceTable();
        }
      } else {
        document.body.classList.remove("view-mode-attendance");
        navItems.forEach(item => {
          const href = item.getAttribute("href") || "";
          if (href === "#" + (view || "dashboard") || (view === "boss" && href === "#dashboard")) {
            item.classList.add("active");
          } else {
            item.classList.remove("active");
          }
        });
        if (attNav) attNav.classList.remove("active");

        if (dashboardTitle) dashboardTitle.setAttribute("data-i18n", "dashboardTitle");
        if (dashboardTitle && typeof TRANSLATIONS !== "undefined" && TRANSLATIONS[currentLang]) {
          dashboardTitle.textContent = TRANSLATIONS[currentLang].dashboardTitle || "Dashboard theo dõi boss chết và hồi sinh";
        }
        if (dashboardEyebrow) dashboardEyebrow.innerHTML = `<span class="server-pulse" aria-hidden="true"></span> Realtime countdown`;
        if (realtimeStatus) realtimeStatus.style.display = "inline-flex";
        if (addBossBtn) addBossBtn.style.display = isAdmin() ? "inline-flex" : "none";

        if (window.location.hash === "#attendance" || window.location.hash === "#salary" || window.location.hash === "#attendance-salary") {
          try {
            history.pushState(null, "", "#" + (view === "boss" ? "dashboard" : (view || "dashboard")));
          } catch (e) {
            window.location.hash = (view === "boss" ? "dashboard" : (view || "dashboard"));
          }
        }
      }
    }

    function initAttendanceEvents() {
      // Back to Boss Tracker
      const backBtn = document.getElementById("attBackToBossBtn");
      if (backBtn) {
        backBtn.addEventListener("click", () => {
          switchPageView("boss");
        });
      }

      // Hash change listener for browser back/forward and direct links
      window.addEventListener("hashchange", () => {
        const hash = window.location.hash.replace("#", "");
        if (hash === "attendance" || hash === "salary" || hash === "attendance-salary") {
          switchPageView("attendance");
        } else {
          switchPageView(hash || "boss");
        }
      });

      // Sidebar link
      const navBtn = document.getElementById("navAttendanceBtn");
      if (navBtn) {
        navBtn.addEventListener("click", (e) => {
          e.preventDefault();
          switchPageView("attendance");
        });
      }

      // Pool Inputs
      const diasInput = document.getElementById("attDiasPoolInput");
      if (diasInput) {
        diasInput.addEventListener("change", () => {
          if (!isAdmin()) {
            showToast("Chỉ Quản trị viên (Admin) mới có quyền chỉnh sửa Quỹ.");
            requestAdminLogin();
            diasInput.value = getActiveWeek().diasPool;
            return;
          }
          const val = Math.max(0, parseInt(diasInput.value, 10) || 0);
          const currWeek = getActiveWeek();
          currWeek.diasPool = val;
          saveAttendanceState(attendanceState, true);
          renderAttendanceTable();
          showToast(`💎 Đã cập nhật Quỹ DIAS: ${val.toLocaleString("vi-VN")}`);
        });
      }

      const usdtInput = document.getElementById("attUsdtPoolInput");
      if (usdtInput) {
        usdtInput.addEventListener("change", () => {
          if (!isAdmin()) {
            showToast("Chỉ Quản trị viên (Admin) mới có quyền chỉnh sửa Quỹ.");
            requestAdminLogin();
            usdtInput.value = getActiveWeek().usdtPool;
            return;
          }
          const val = Math.max(0, parseFloat(usdtInput.value) || 0);
          const currWeek = getActiveWeek();
          currWeek.usdtPool = val;
          saveAttendanceState(attendanceState, true);
          renderAttendanceTable();
          showToast(`💵 Đã cập nhật Quỹ USDT: ${val.toLocaleString("vi-VN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`);
        });
      }

      const thresholdInput = document.getElementById("attMinimumParticipationInput");
      if (thresholdInput) {
        const updateThreshold = (event) => {
          const currWeek = getActiveWeek();
          if (!isAdmin()) {
            thresholdInput.value = normalizeMinimumParticipationPercent(currWeek.minimumParticipationPercent);
            return;
          }
          const threshold = normalizeMinimumParticipationPercent(thresholdInput.value);
          if (event.type === "change" || Number(thresholdInput.value) < 0 || Number(thresholdInput.value) > 100) {
            thresholdInput.value = threshold;
          }
          if (currWeek.minimumParticipationPercent === threshold) return;
          currWeek.minimumParticipationPercent = threshold;
          saveAttendanceState(attendanceState, true);
          renderAttendanceTable();
        };
        thresholdInput.addEventListener("input", updateThreshold);
        thresholdInput.addEventListener("change", updateThreshold);
      }

      // Search & Filter
      const searchInput = document.getElementById("attSearchInput");
      if (searchInput) {
        searchInput.addEventListener("input", (e) => {
          attendanceSearchTerm = e.target.value;
          renderAttendanceTable();
        });
      }

      const multFilter = document.getElementById("attFilterMultiplier");
      if (multFilter) {
        multFilter.addEventListener("change", (e) => {
          attendanceMultiplierFilter = e.target.value;
          renderAttendanceTable();
        });
      }

      const serverFilter = document.getElementById("attFilterServer");
      if (serverFilter) {
        serverFilter.addEventListener("change", (e) => {
          attendanceServerFilter = e.target.value || "all";
          renderAttendanceTable();
        });
      }

      // Toolbar Buttons
      const addMemBtn = document.getElementById("attAddMemberBtn");
      if (addMemBtn) addMemBtn.addEventListener("click", () => openAttendanceMemberModal());

      const addActBtn = document.getElementById("attAddActivityBtn");
      if (addActBtn) addActBtn.addEventListener("click", () => openAttendanceActivityModal());

      const addNewWeekBtn = document.getElementById("attAddNewWeekBtn");
      if (addNewWeekBtn) addNewWeekBtn.addEventListener("click", () => openAttendanceWeekModal());

      const backupDataBtn = document.getElementById("attBackupDataBtn");
      if (backupDataBtn) backupDataBtn.addEventListener("click", downloadFullDataBackup);

      // Member Modal Events
      document.getElementById("closeAttMemberModal")?.addEventListener("click", closeAttendanceMemberModal);
      document.getElementById("attCancelMemberBtn")?.addEventListener("click", closeAttendanceMemberModal);
      document.getElementById("attSaveMemberBtn")?.addEventListener("click", saveAttendanceMember);
      document.getElementById("attDeleteMemberBtn")?.addEventListener("click", () => {
        const editId = document.getElementById("attMemberEditId")?.value;
        if (editId) deleteAttendanceMember(editId);
      });
      document.querySelectorAll(".att-quick-mult-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const val = btn.dataset.val;
          const input = document.getElementById("attMemberMultiplierInput");
          if (input) input.value = val;
        });
      });

      // Member Live Preview & Color Picker events
      document.getElementById("attMemberNameInput")?.addEventListener("input", updateMemberModalPreview);
      document.getElementById("attMemberRoleInput")?.addEventListener("input", updateMemberModalPreview);

      document.querySelectorAll("#attMemberColorRow .att-color-chip").forEach(chip => {
        chip.addEventListener("click", () => {
          selectMemberColor(chip.dataset.color || "");
        });
      });

      document.getElementById("attMemberCustomColor")?.addEventListener("input", (e) => {
        selectMemberColor(e.target.value);
      });

      document.querySelectorAll("#attMemberRoleColorRow .att-color-chip").forEach(chip => {
        chip.addEventListener("click", () => {
          selectMemberRoleColor(chip.dataset.roleColor || "#f59e0b");
        });
      });

      document.getElementById("attMemberCustomRoleColor")?.addEventListener("input", (e) => {
        selectMemberRoleColor(e.target.value);
      });

      document.querySelectorAll("#attMemberModal .att-tag-preset-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const role = btn.dataset.role || "";
          const color = btn.dataset.color || "#f59e0b";
          const roleInput = document.getElementById("attMemberRoleInput");
          if (roleInput) roleInput.value = role;
          selectMemberRoleColor(color);
        });
      });

      // Week Modal Events
      document.getElementById("closeAttWeekModal")?.addEventListener("click", closeAttendanceWeekModal);
      document.getElementById("attCancelWeekBtn")?.addEventListener("click", closeAttendanceWeekModal);
      document.getElementById("attSaveWeekBtn")?.addEventListener("click", saveAttendanceWeek);
      document.getElementById("attWeekModalDelBtn")?.addEventListener("click", () => {
        const editId = document.getElementById("attWeekEditId")?.value;
        if (editId) deleteAttendanceWeek(editId);
      });
      document.getElementById("attWeekQuickCurrentBtn")?.addEventListener("click", () => {
        const input = document.getElementById("attWeekDateRangeInput");
        if (input) input.value = getSuggestedWeekRange(0);
      });
      document.getElementById("attWeekQuickNextBtn")?.addEventListener("click", () => {
        const input = document.getElementById("attWeekDateRangeInput");
        if (input) input.value = getSuggestedWeekRange(1);
      });

      // Activity Modal Events
      document.getElementById("closeAttActivityModal")?.addEventListener("click", closeAttendanceActivityModal);
      document.getElementById("attCancelActivityBtn")?.addEventListener("click", closeAttendanceActivityModal);
      document.getElementById("attSaveActivityBtn")?.addEventListener("click", saveAttendanceActivity);
      document.getElementById("attDeleteActivityBtn")?.addEventListener("click", () => {
        const editId = document.getElementById("attActivityEditId")?.value;
        if (editId) deleteAttendanceActivity(editId);
      });
      document.querySelectorAll(".att-quick-pt-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const val = btn.dataset.val;
          const input = document.getElementById("attActivityPointsInput");
          if (input) input.value = val;
        });
      });

      // Export Modal Events
      document.getElementById("closeAttExportModal")?.addEventListener("click", () => {
        document.getElementById("attExportModal")?.classList.remove("open");
        syncModalScrollLock();
      });
      document.getElementById("attCloseExportBtn")?.addEventListener("click", () => {
        document.getElementById("attExportModal")?.classList.remove("open");
        syncModalScrollLock();
      });
      document.getElementById("attCopyExportBtn")?.addEventListener("click", async () => {
        const textarea = document.getElementById("attExportTextarea");
        if (textarea) {
          try {
            await navigator.clipboard.writeText(textarea.value);
            showToast("📋 Đã sao chép bảng lương vào Clipboard!");
          } catch (e) {
            textarea.select();
            document.execCommand("copy");
            showToast("📋 Đã sao chép bảng lương vào Clipboard!");
          }
        }
      });

      // Backdrop dismiss
      ["attMemberModal", "attActivityModal", "attWeekModal", "attExportModal"].forEach(modalId => {
        const modalEl = document.getElementById(modalId);
        if (modalEl) {
          modalEl.addEventListener("click", (e) => {
            if (e.target === modalEl) {
              modalEl.classList.remove("open");
              syncModalScrollLock();
            }
          });
        }
      });
    }


    updateServerSwitcherButton();
    renderServerListUI();
    initServerListSync();
    updateDiscordButtonUI();
    setLanguage(currentLang);
    updateRoleUI();
    render();
    initAttendanceEvents();
    renderAttendanceTable();
    initAttendanceRealtimeSync();
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get("tab") || urlParams.get("page") || urlParams.get("view");
    const initialHash = window.location.hash.replace("#", "");
    if (tabParam === "attendance" || tabParam === "salary" || initialHash === "attendance" || initialHash === "salary" || initialHash === "attendance-salary") {
      switchPageView("attendance");
    } else {
      switchPageView("boss");
    }

    if (!localStorage.getItem(STORAGE_ROLE_KEY)) {
      openAuthModal("choose");
    }
    initRealtimeSync();
    window.setInterval(render, 1000);

    // Tu dong kiem tra va refresh neu co phien ban web moi (tranh treo tab chay code cu)
    const CURRENT_APP_VERSION = "2026.10.03.v17-backup-modular-cleanup";
    window.setInterval(async () => {
      try {
        const res = await fetch("/?v=" + Date.now(), { cache: "no-store", method: "HEAD" });
        const etag = res.headers.get("etag") || res.headers.get("last-modified");
        const storedEtag = sessionStorage.getItem("boss_app_etag");
        if (etag) {
          if (storedEtag && storedEtag !== etag) {
            console.log("[App Updater] Phat hien phien ban moi, dang tu reload...");
            sessionStorage.setItem("boss_app_etag", etag);
            window.location.reload();
          } else if (!storedEtag) {
            sessionStorage.setItem("boss_app_etag", etag);
          }
        }
      } catch (e) {}
    }, 60000);
