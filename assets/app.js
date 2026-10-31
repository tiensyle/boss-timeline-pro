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
        sidebarSubtitle: "Quản lý hồi sinh",
        navDashboard: "Tổng quan",
        navTodaySchedule: "Lịch boss hôm nay",
        navWeeklySchedule: "Boss Tiêu Biểu",
        navBossList: "Danh sách boss",
        navTimeline: "Dòng thời gian",
        navAttendance: "Chấm Công & Lương",
        resetMaintenance: "Reset sau bảo trì",
        realtimeCountdown: "Đếm ngược thời gian thực",
        realtimeConnected: "Thời gian thực",
        realtimeConnecting: "Đang kết nối…",
        dashboardTitle: "Bảng theo dõi boss chết và hồi sinh",
        dashboardSub: "Theo dõi nhiều boss cùng lúc, ghi nhận thời điểm chết, xem đếm ngược hồi sinh, lọc trạng thái và lưu dữ liệu ngay trên trình duyệt.",
        adminRole: "Quản trị viên",
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
        nextRespawnTitle: "BOSS HỒI SINH TIẾP THEO",
        noNextBossTitle: "Không có boss nào đang chờ hồi sinh",
        noNextBossSub: "Tất cả boss hiện đang ở trạng thái sống. Khi có boss chết, khu vực này sẽ tự động hiển thị thời gian đếm ngược gần nhất.",
        readyStatus: "SẴN SÀNG",
        readyHint: "Bấm \"Ghi nhận chết\" trên thẻ boss để bắt đầu đếm ngược hồi sinh.",
        nextWillRespawn: "sẽ hồi sinh tiếp theo",
        estimatedRespawnAt: "Dự kiến hồi sinh lúc",
        prepareBeforeZero: "Chuẩn bị trước khi timer về 0.",
        diedAtLabel: "Chết lúc",
        schedulePanelTitle: "Lịch Hồi Sinh & Dự Báo Boss (7 Ngày)",
        scheduleSubAll: "Đầy đủ lịch đếm ngược các ngày trong tuần và chu kỳ nhiều ngày (30h, 48h...)",
        exportPdf: "Xuất PDF",
        colTimeDate: "GIỜ & NGÀY HỒI SINH",
        colLevel: "CẤP",
        colBoss: "TÊN BOSS",
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
        historyTitle: "Dòng thời gian gần đây",
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
        navAttendance: "Attendance & Payroll",
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
    let lastRemoteSaveStartTime = 0;
    let pendingRemoteSave = false;
    let pendingBossSaveWaiters = [];
    const activeBossSaveWaiters = new Set();
    let activeBossTransactionLocal = null;
    let lastReportedBossConflictKey = "";
    let lastRemoteUpdatedAt = 0;
    let lastAppliedBossVersion = 0;
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
        const combined = local[0] && !baseMap.has(local[0].id) ? [...added, ...merged] : [...merged, ...added];
        const baseOrder = baseList.filter(item => localMap.has(item.id)).map(item => item.id);
        const localOrder = local.filter(item => baseMap.has(item.id)).map(item => item.id);
        const localReorderedItems = baseOrder.some((id, index) => id !== localOrder[index]);
        if (!localReorderedItems) return combined;

        const mergedById = new Map(combined.map(item => [item.id, item]));
        const localOrdered = local.map(item => mergedById.get(item.id)).filter(Boolean);
        const remoteOnly = combined.filter(item => !localMap.has(item.id));
        return [...localOrdered, ...remoteOnly];
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
          attendancePath: "boss_timeline_attendance_global"
        };
      }
      return {
        statePath: `boss_timeline_servers/${svId}/state`,
        discordPath: `boss_timeline_servers/${svId}/discord_config`,
        alertsPath: `boss_timeline_servers/${svId}/discord_alerts`,
        attendancePath: "boss_timeline_attendance_global"
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
      if (!attendanceDbRef) attendanceDbRef = firebaseDb.ref(paths.attendancePath);
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


    let firebaseAuthReady = !firebaseAuth;

    const elements = {
      metrics: document.getElementById("metrics"),
      nextPanel: null,
      bossGrid: document.getElementById("bossGrid"),
      historyList: document.getElementById("historyList"),
      filterTabs: document.querySelector(".filter-tabs"),
      headerClock: document.getElementById("headerClock"),
      sidebarClock: document.getElementById("sidebarClock"),
      todaySchedulePanel: document.getElementById("boss-schedule"),
      todayScheduleToggle: document.getElementById("todayScheduleToggle"),
      todayHeaderBadge: document.getElementById("todayHeaderBadge"),
      todayScheduleBody: document.getElementById("todayScheduleBody"),
      todayScheduleSubtitle: document.getElementById("todayScheduleSubtitle"),
      todayBossCount: document.getElementById("todayBossCount"),
      exportCsvBtn: document.getElementById("exportCsvBtn"),
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
      if (typeof attendanceState !== "undefined") {
        initAttendanceRealtimeSync();
        initRealtimeSync();
      }
      const isEn = currentLang === "en";
      if (isAdmin()) {
        showToast(isEn ? `👑 Logged in as ${currentAdminName}. Full boss control enabled.` : `👑 Đăng nhập với quyền Admin: ${currentAdminName}`);
      } else {
        showToast(isEn ? "👤 Member Mode: Read-only access." : "👤 Đã chuyển sang quyền Thành viên: Chế độ chỉ xem.");
      }
    }

    if (firebaseAuth) {
      firebaseAuth.onAuthStateChanged(async (user) => {
        firebaseAuthReady = false;
        if (user) {
          try {
            const access = await getFirebaseAdminAccess(user);
            if (firebaseAuth.currentUser?.uid !== user.uid) return;
            currentUserIsAdmin = access.allowed;
            currentUserIsSuperAdmin = access.superAdmin;
          } catch (error) {
            if (firebaseAuth.currentUser?.uid !== user.uid) return;
            currentUserIsAdmin = false;
            console.error("Firebase token verification error:", error);
          }
          if (!currentUserIsAdmin) {
            stopWatchingCurrentAdminAccess();
            firebaseAuthReady = true;
            setRole("member");
            return;
          }
          watchCurrentAdminAccess(user, currentUserIsSuperAdmin);
          firebaseAuthReady = true;
          setRole("admin", user.displayName || user.email || "Admin");
          closeAuthModal();
          // Luôn áp dụng bản Firebase đã nhận trong lúc khôi phục đăng nhập trước khi
          // cho phép lưu, tránh dữ liệu cũ trên máy mới ghi đè ghi chú/giờ của máy khác.
          if (typeof applyDeferredBossRemoteAfterAuth === "function") applyDeferredBossRemoteAfterAuth();
          // Writes that were queued while Auth restored can now be retried safely.
          const hasUnsyncedAuthBosses = isAdmin() && bossSyncBase && state.bosses.some(b => {
            const rb = (bossSyncBase.bosses || []).find(item => item.id === b.id);
            return !rb || (Number(b.revision) || 0) > (Number(rb.revision) || 0) || b.notes !== rb.notes || b.name !== rb.name;
          });
          if (typeof saveState === "function" && (pendingRemoteSave || hasUnsyncedAuthBosses)) saveState();
          if (typeof pushAttendanceToFirebase === "function" && attendanceRemoteStateReady && attendancePendingRemoteSave) {
            attendanceRemotePermissionDenied = false;
            pushAttendanceToFirebase();
          }
        } else {
          stopWatchingCurrentAdminAccess();
          currentUserIsAdmin = false;
          currentUserIsSuperAdmin = false;
          firebaseAuthReady = true;
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
            if (oldRaw) {
              const legacy = JSON.parse(oldRaw);
              delete legacy.webhookUrl;
              localStorage.removeItem("bossTimelinePro.discordConfig");
              return { ...defaultDiscordConfig, ...legacy };
            }
          }
          return { ...defaultDiscordConfig };
        }
        const parsed = JSON.parse(raw);
        delete parsed.webhookUrl;
        return { ...defaultDiscordConfig, ...parsed };
      } catch (e) {
        return { ...defaultDiscordConfig };
      }
    }

    let discordConfig = loadDiscordConfig();
    let activeDiscordNotified = {};
    // Cache webhook URL theo server (không lưu localStorage, chỉ Firebase)
    const webhookUrlCache = {}; // { [serverId]: url }


    function saveDiscordConfigLocal(cfg) {
      const safeConfig = { ...cfg };
      delete safeConfig.webhookUrl;
      discordConfig = { ...defaultDiscordConfig, ...safeConfig };
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

    /**
     * Lưu webhook URL lên Firebase (chỉ admin đọc/ghi).
     * Không lưu vào localStorage để tránh lộ qua devtools.
     */
    async function saveWebhookUrl(svId, url) {
      if (!firebaseDb || !isAdmin()) return false;
      try {
        await firebaseDb.ref(`boss_timeline_webhook_urls/${svId}`).set({ url: url || "" });
        webhookUrlCache[svId] = url || "";
        return true;
      } catch (e) {
        console.warn("Firebase save webhook URL error:", e);
        return false;
      }
    }

    /**
     * Đọc webhook URL từ Firebase về cache
     */
    async function loadWebhookUrl(svId) {
      if (webhookUrlCache[svId] !== undefined) return webhookUrlCache[svId];
      if (!firebaseDb) return "";
      try {
        const snap = await firebaseDb.ref(`boss_timeline_webhook_urls/${svId}`).once("value");
        const val = snap.val();
        const url = (val && typeof val.url === "string") ? val.url : "";
        webhookUrlCache[svId] = url;
        return url;
      } catch (e) {
        return "";
      }
    }



    function updateDiscordButtonUI() {
      const btn = document.getElementById("discordSettingsBtn");
      const text = document.getElementById("discordBtnText");
      if (!btn) return;
      const isConnected = Boolean(discordConfig.enabled);
      btn.classList.toggle("connected", isConnected);
      if (text) {
        text.textContent = isConnected ? (currentLang === "en" ? "Discord: On" : "Discord: Bật") : "Discord Bot";
      }
    }

    let discordSendQueue = Promise.resolve();
    let lastDiscordError = "";

    function sendDiscordWebhook(payload, fileBlob = null, fileName = "image.png", serverId = currentServerId, allowWhenDisabled = false) {
      const task = discordSendQueue.then(() => deliverDiscordWebhook(payload, fileBlob, fileName, serverId, allowWhenDisabled));
      discordSendQueue = task.catch(() => false);
      return task;
    }

    async function deliverDiscordWebhook(payload, fileBlob, fileName, serverId, allowWhenDisabled = false) {
      lastDiscordError = "";
      if (!discordConfig.enabled && !allowWhenDisabled) {
        lastDiscordError = "Thông báo tự động Discord đang tắt.";
        console.warn("[Discord Bot] Bỏ qua gửi: bot chưa bật trong cài đặt", discordConfig);
        return false;
      }
      try {
        const user = firebaseAuth?.currentUser;
        if (!user || !isAdmin()) {
          lastDiscordError = "Phiên Admin không hợp lệ. Vui lòng đăng nhập Admin lại.";
          return false;
        }
        // Làm mới token trước thao tác gửi thủ công để Vercel nhận đúng quyền
        // vừa được cấp và tránh dùng phiên xác thực đã cũ.
        const idToken = await user.getIdToken(true);
        let file = null;
        if (fileBlob) {
          const bytes = new Uint8Array(await fileBlob.arrayBuffer());
          let binary = "";
          const chunkSize = 0x8000;
          for (let index = 0; index < bytes.length; index += chunkSize) {
            binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
          }
          file = { base64: btoa(binary), name: fileName, type: fileBlob.type || "image/png" };
        }
        const relayUrl = new URL(window.BOSS_TIMELINE_DISCORD_API || "/api/discord", window.location.href);
        if (relayUrl.protocol !== "https:" && !(relayUrl.origin === window.location.origin && relayUrl.protocol === "http:")) return false;
        if (relayUrl.username || relayUrl.password) return false;
        // Webhook được cấu hình trong giao diện phải được gửi cùng đúng server.
        // API vẫn giữ webhook môi trường làm phương án dự phòng cho cấu hình cũ.
        const webhookUrl = await loadWebhookUrl(serverId);
        for (let attempt = 0; attempt < 3; attempt++) {
          const proxyRes = await fetch(relayUrl.href, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${idToken}` },
            body: JSON.stringify({ payload, serverId, webhookUrl, file }),
            signal: AbortSignal.timeout(45000)
          });
          if (proxyRes.ok) return true;
          const errorData = await proxyRes.json().catch(() => ({}));
          const retryMs = Number(errorData.retryAfterMs) || 1200;
          if (proxyRes.status === 429 && attempt < 2 && retryMs <= 30000) {
            await new Promise(resolve => window.setTimeout(resolve, Math.max(100, retryMs)));
            continue;
          }
          const apiMessage = typeof errorData.error === "string" ? errorData.error : "";
          const errorMessages = {
            "Authentication required.": "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập Admin lại.",
            "Admin permission required.": "API không xác nhận được quyền Admin của tài khoản này.",
            "Invalid or missing Discord Webhook URL.": "Webhook của server này đang thiếu hoặc không hợp lệ.",
            "Discord webhook no longer exists.": "Webhook Discord đã bị xóa hoặc không còn tồn tại.",
            "Discord rejected this webhook.": "Discord từ chối webhook. Hãy kiểm tra quyền gửi tin của webhook trong kênh.",
            "Discord API rejected the message.": "Discord từ chối tin nhắn hoặc webhook không còn hoạt động.",
            "Origin is not allowed.": "Tên miền website chưa được API Discord cho phép.",
            "Discord Rate Limit": "Discord đang giới hạn gửi quá nhanh. Vui lòng đợi rồi thử lại."
          };
          lastDiscordError = errorMessages[apiMessage] || apiMessage || `API Discord trả lỗi ${proxyRes.status}.`;
          console.warn("[Discord Bot] API từ chối yêu cầu:", proxyRes.status, errorData.error || "");
          return false;
        }
        return false;
      } catch (e) {
        lastDiscordError = e?.name === "TimeoutError"
          ? "API Discord phản hồi quá lâu. Vui lòng thử lại."
          : "Không kết nối được API Discord. Vui lòng kiểm tra Vercel hoặc kết nối mạng.";
        console.warn("[Discord Bot] Discord API relay error:", e);
        return false;
      }
    }

    async function sendDiscordAlertOnce(alertId, ttlMs, deliver, forced = false) {
      if (!isAdmin() || (!discordConfig.enabled && !forced)) return false;
      const notified = activeDiscordNotified;
      if (notified[alertId] === "pending" || (!forced && notified[alertId] === "sent")) return false;
      notified[alertId] = "pending";
      const serverId = currentServerId;
      const owner = CLIENT_ID + "_" + Math.random().toString(36).slice(2);
      let alertRef = null;
      let claimed = false;
      let sent = false;
      let alreadySent = false;
      try {
        if (firebaseDb && !forced) {
          const safeKey = alertId.replace(/[.#$\[\]\/]/g, "_");
          alertRef = firebaseDb.ref(getFirebaseServerPaths(serverId).alertsPath + "/" + safeKey);
          const claimTime = Date.now();
          const result = await alertRef.transaction(current => {
            const sentAt = typeof current === "number" ? current : current?.sentAt;
            if (sentAt && claimTime - sentAt < ttlMs) return;
            if (current?.state === "pending" && claimTime - current.claimedAt < 600000) return;
            return { owner, state: "pending", claimedAt: claimTime };
          });
          if (!result.committed) {
            const current = result.snapshot.val();
            alreadySent = typeof current === "number" || current?.state === "sent";
            return false;
          }
          claimed = true;
        }
        sent = await deliver(serverId);
        if (sent && alertRef) {
          await alertRef.transaction(current => current?.owner === owner
            ? { ...current, state: "sent", sentAt: Date.now() } : undefined, undefined, false);
        }
        return sent;
      } catch (error) {
        console.warn("[Discord Bot] Alert delivery error:", error);
        return sent;
      } finally {
        if (sent || alreadySent) notified[alertId] = "sent";
        else {
          delete notified[alertId];
          if (claimed && alertRef) {
            await alertRef.transaction(current => current?.owner === owner && current.state === "pending" ? null : undefined, undefined, false).catch(() => {});
          }
        }
      }
    }

    async function sendDiscordBossAlert(boss, milestoneType, explicitEventTime = null) {
      if (!discordConfig.enabled) return;

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

        const baseUrl = (window.location && window.location.origin && window.location.origin.startsWith("http"))
          ? window.location.origin
          : "https://bosschill.vercel.app";
        const soonLogoUrl = `${baseUrl}/assets/boss-logo-soon.png`;
        const spawnedLogoUrl = `${baseUrl}/assets/boss-logo-spawned.png`;

        const spawnTimeStr = new Date(eventKey).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
        const remainMs = Number(eventKey) - getNow();
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

        await sendDiscordAlertOnce(alertId, 5 * 60 * 1000,
          serverId => sendDiscordWebhook(payload, null, "image.png", serverId));
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
          const countStr = "Tổng số lượt: " + items.length;
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
      if (!discordConfig.enabled && !forced) return false;
      if (!forced && discordConfig.notifyDailySchedule === false) return false;
      const now = getNow();
      const alertId = `daily_schedule_${dateToYMD(now)}`;
      return sendDiscordAlertOnce(alertId, 20 * 60 * 60 * 1000,
        serverId => deliverDiscordDailySchedule(now, forced, serverId), forced);
    }

    async function deliverDiscordDailySchedule(now, forced, serverId) {
      const nowDate = new Date(now);
      const dateKey = `${nowDate.getFullYear()}-${String(nowDate.getMonth() + 1).padStart(2, "0")}-${String(nowDate.getDate()).padStart(2, "0")}`;

      // Thu thập danh sách boss ngày hôm nay
      const items = getBossScheduleItems(now, "today");


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
        return await sendDiscordWebhook(emptyPayload, null, "image.png", serverId, forced);
      }

      // Tạo ảnh bằng Canvas khi trình duyệt hỗ trợ. Một số trình duyệt di động
      // có thể từ chối Canvas lớn; khi đó tự động gửi CSV thay vì hủy cả lần gửi.
      let imgBlob = null;
      if (items.length <= 150) {
        try {
          imgBlob = await generateScheduleImageBlob(items, dateDisplay, now);
        } catch (error) {
          console.warn("[Discord Bot] Không tạo được ảnh lịch, chuyển sang CSV:", error);
        }
      }
      const reportBlob = imgBlob || new Blob([buildScheduleCsv(items, now, false)], { type: "text/csv;charset=utf-8" });

      const fileName = `lich_boss_${dateKey}.${imgBlob ? "png" : "csv"}`;
      const payload = {
        username: "Boss Tracker Alert",
        avatar_url: "https://cdn-icons-png.flaticon.com/512/10329/10329997.png",
        content: discordConfig.tagEveryone ? "@everyone 📢 **BÁO CÁO LỊCH BOSS HÔM NAY (00:00 - 24:00)**" : "📢 **BÁO CÁO LỊCH BOSS HÔM NAY (00:00 - 24:00)**",
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

      return await sendDiscordWebhook(payload, reportBlob, fileName, serverId, forced);
    }

    function checkDailyScheduleAlert(now) {
      // Đã tắt: lịch boss 00:00 hàng ngày được gửi tự động bởi Vercel Cron (api/cron-daily.js)
      // Không gửi từ browser nữa để tránh sai giờ theo múi giờ máy client và phụ thuộc người mở web.
      return;
    }



    async function sendDiscordKillAlert(boss, diedAt, nextRespawn) {
      // Đã tắt hoàn toàn: chỉ gửi 2 loại thông báo (báo cáo 00h và đếm ngược giờ boss sắp ra)
      return;
    }

    function notifyBossAlert(boss, milestoneType, eventTime = null, sendDiscord = true, playLocal = true) {
      if (isSoundEnabled && playLocal) {
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
      if (sendDiscord) sendDiscordBossAlert(boss, milestoneType, eventTime);
    }

    function checkBossSoundAlerts(now) {
      if (!isSoundEnabled && !discordConfig.enabled) return;
      state.bosses.forEach((boss) => {
        let eventTime = null;
        let eventKey = "";
        let timerConfirmed = true;

        if (boss.spawnMode === "fixed") {
          eventTime = getNextFixedSpawnTime(boss, now);
          if (!eventTime) return;
          eventKey = boss.id + "_" + eventTime;
        } else {

          if (!boss.diedAt || !boss.respawnsAt) return;
          const confirmedBoss = typeof bossSyncBase !== "undefined"
            ? (bossSyncBase?.bosses || []).find(item => item.id === boss.id)
            : null;
          timerConfirmed = !!confirmedBoss
            && Number(confirmedBoss.revision || 0) === Number(boss.revision || 0)
            && confirmedBoss.diedAt === boss.diedAt
            && confirmedBoss.respawnsAt === boss.respawnsAt;
          // Keep local sound available for an optimistic timer, but never publish
          // Discord alerts until this exact timer cycle exists in a Firebase snapshot.
          if (!timerConfirmed && !isSoundEnabled) return;
          eventTime = boss.respawnsAt;
          eventKey = boss.id + "_" + boss.respawnsAt;
        }

        const remaining = eventTime - now;
        if (remaining <= 0) return; // Mốc 0m được autoResolveRespawns kích hoạt tự động

        const deliverMilestone = milestoneType => {
          const confirmedKey = `${eventKey}_${milestoneType}`;
          const localKey = `${confirmedKey}_local`;
          if (!timerConfirmed) {
            if (isSoundEnabled && !activeSoundNotified[localKey]) {
              activeSoundNotified[localKey] = true;
              notifyBossAlert(boss, milestoneType, eventTime, false, true);
            }
            return;
          }
          if (activeSoundNotified[confirmedKey]) return;
          activeSoundNotified[confirmedKey] = true;
          notifyBossAlert(boss, milestoneType, eventTime, true, !activeSoundNotified[localKey]);
        };

        // Mốc 10 phút (kích hoạt trong khoảng 7.5 phút - 10.5 phút)
        if (remaining <= 10.5 * 60 * 1000 && remaining > 7.5 * 60 * 1000) {
          deliverMilestone("10m");
        }
        // Mốc 5 phút (kích hoạt trong khoảng 2.5 phút - 5.5 phút)
        else if (remaining <= 5.5 * 60 * 1000 && remaining > 2.5 * 60 * 1000) {
          deliverMilestone("5m");
        }
        // Mốc 1 phút (kích hoạt trong khoảng 5 giây - 90 giây)
        else if (remaining <= 90 * 1000 && remaining > 5000) {
          deliverMilestone("1m");
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
    let editingBossRevision = null;
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

    function handleBossBroadcastMessage(data) {
      if (!data || !Array.isArray(data.bosses)) return false;
      if (data._clientId === CLIENT_ID) return false;
      if (data.serverId && data.serverId !== currentServerId) return false;
      // Local/member-only state is never authoritative. Every accepted message
      // must identify the Firebase snapshot that confirmed it.
      if (!(Number(data.version) > 0)) return false;
      const applied = applyRemoteState(data.bosses, data.history || [], data.updated_at, data._clientId, bossSyncBase, data.version);
      if (applied) showToast("🔄 Đã đồng bộ từ cửa sổ/tab khác trên máy.");
      return applied;
    }

    if (broadcastChannel) {
      broadcastChannel.onmessage = (event) => {
        handleBossBroadcastMessage(event.data);
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

    function getNow() {
      return Date.now() + serverTimeOffset;
    }

    let lastLocalEditTime = 0;
    let lastBossConflictIds = [];

    function loadBossSyncBase() {
      try {
        const cached = JSON.parse(localStorage.getItem(STORAGE_KEY + ".syncBase"));
        if (cached && Array.isArray(cached.bosses)) return cached;
      } catch (e) {}
      return cloneRealtimeValue(state);
    }

    function getBossRemoteData(value) {
      const bosses = Array.isArray(value.data?.bosses)
        ? value.data.bosses
        : (value.bosses_map && typeof value.bosses_map === "object" ? Object.values(value.bosses_map) : []);
      return {
        bosses: bosses.map(normalizeBoss),
        history: Array.isArray(value.data?.history) ? value.data.history.slice(0, 30) : []
      };
    }

    function mergeBossStateChanges(base, local, remote) {
      const merged = mergeRealtimeChanges(base, local, remote);
      const timerFields = ["diedAt", "respawnsAt", "lastRespawnAt"];
      const before = new Map((base?.bosses || []).map(boss => [boss.id, boss]));
      const remoteById = new Map((remote?.bosses || []).map(boss => [boss.id, boss]));
      const localIds = new Set((local?.bosses || []).map(boss => boss.id));
      const conflictIds = new Set();

      // A stale delete must not remove a boss that was edited after the deleting
      // client last received it.
      for (const previous of base?.bosses || []) {
        const remoteBoss = remoteById.get(previous.id);
        if (localIds.has(previous.id) || !remoteBoss) continue;
        if ((Number(remoteBoss.revision) || 0) > (Number(previous.revision) || 0)) {
          if (!merged.bosses.some(item => item.id === previous.id)) merged.bosses.push(cloneRealtimeValue(remoteBoss));
          conflictIds.add(previous.id);
        }
      }
      for (const boss of local.bosses) {
        const previous = before.get(boss.id);
        const target = merged.bosses.find(item => item.id === boss.id);
        const remoteBoss = remoteById.get(boss.id);
        const baseRevision = Number(previous?.revision);
        const localRevision = Number(boss?.revision);
        const remoteRevision = Number(remoteBoss?.revision);

        // The remote deletion wins, but a locally edited deleted boss is still a
        // rejected operation: flag it and remove its unconfirmed history below.
        if (previous && !remoteBoss && JSON.stringify(previous) !== JSON.stringify(boss)) {
          conflictIds.add(boss.id);
          continue;
        }

        // Optimistic concurrency per boss: a client may only apply an edit based on
        // the revision it last received. If both sides advanced, keep Firebase and
        // reject the stale local operation instead of silently overwriting it.
        if (previous && target && remoteBoss && Number.isFinite(baseRevision)
          && localRevision > baseRevision && remoteRevision > baseRevision) {
          Object.keys(target).forEach(key => delete target[key]);
          Object.assign(target, cloneRealtimeValue(remoteBoss));
          conflictIds.add(boss.id);
          continue;
        }
        if (previous && target && timerFields.some(key => previous[key] !== boss[key])) {
          // A death/respawn is one state transition, not three independent field edits.
          timerFields.forEach(key => { target[key] = boss[key] ?? null; });
        }
      }
      if (conflictIds.size) {
        const baseHistoryIds = new Set((base?.history || []).map(item => item.id));
        const remoteHistoryIds = new Set((remote?.history || []).map(item => item.id));
        merged.history = merged.history.filter(item => !conflictIds.has(item.bossId)
          || baseHistoryIds.has(item.id) || remoteHistoryIds.has(item.id));
      }
      const baseHistoryIds = new Set((base?.history || []).map(item => item.id));
      const hasNewResetAll = (local?.history || []).some(item => item.bossId === "all" && !baseHistoryIds.has(item.id));
      const baseBossIds = new Set((base?.bosses || []).map(boss => boss.id));
      const remoteBossIds = new Set((remote?.bosses || []).map(boss => boss.id));
      const bossSetChanged = baseBossIds.size !== remoteBossIds.size
        || [...baseBossIds].some(id => !remoteBossIds.has(id));
      if (hasNewResetAll && (conflictIds.size || bossSetChanged)) {
        // Maintenance reset is all-or-nothing. A partial reset would make both
        // current state and the "ALL BOSSES" history entry untrue.
        for (const boss of local.bosses || []) {
          const previous = before.get(boss.id);
          if (previous && JSON.stringify(previous) !== JSON.stringify(boss)) conflictIds.add(boss.id);
        }
        merged.bosses = cloneRealtimeValue(remote?.bosses || []);
        merged.history = cloneRealtimeValue(remote?.history || []);
      }
      if (typeof lastBossConflictIds !== "undefined") lastBossConflictIds = [...conflictIds];
      return merged;
    }

    function broadcastConfirmedBossState(confirmedState) {
      if (!broadcastChannel || !confirmedState || !Array.isArray(confirmedState.bosses)) return;
      broadcastChannel.postMessage({
        _clientId: CLIENT_ID,
        serverId: currentServerId,
        bosses: confirmedState.bosses.map(normalizeBoss),
        history: Array.isArray(confirmedState.history) ? confirmedState.history.slice(0, 30) : [],
        updated_at: confirmedState.updated_at || null,
        version: Number(confirmedState.version) || 0
      });
    }

    function discardConflictedQueuedBossChanges(conflictIds, confirmedState) {
      if (!conflictIds?.length || !confirmedState) return;
      const rejected = new Set(conflictIds);
      const confirmedById = new Map((confirmedState.bosses || []).map(boss => [boss.id, boss]));
      state.bosses = state.bosses.map(boss => rejected.has(boss.id) && confirmedById.has(boss.id)
        ? cloneRealtimeValue(confirmedById.get(boss.id)) : boss);
      const confirmedHistoryIds = new Set((confirmedState.history || []).map(item => item.id));
      state.history = state.history.filter(item => !rejected.has(item.bossId) || confirmedHistoryIds.has(item.id));
      lastRenderedGridKey = "";
      saveStateLocal(false);
      render();
    }

    function reportRejectedBossOperations(conflictIds, attemptedState) {
      const attemptedById = new Map((attemptedState?.bosses || []).map(boss => [boss.id, boss]));
      const operations = (conflictIds || []).map(bossId => {
        const boss = attemptedById.get(bossId);
        return {
        operation: boss ? "update" : "delete",
        bossId,
        bossName: boss?.name || bossId,
        revision: Number(boss?.revision) || 0,
        diedAt: boss?.diedAt || null,
        respawnsAt: boss?.respawnsAt || null,
        notes: boss?.notes || "",
        rejectedAt: getNow(),
        serverId: currentServerId
      }; });
      if (!operations.length) return;
      try {
        localStorage.setItem(STORAGE_KEY + ".rejectedOperations", JSON.stringify(operations));
      } catch (error) {}
      console.warn("[Boss Sync] Firebase rejected stale operations:", operations);
      showToast("⚠️ Thao tác offline đã bị từ chối vì Boss có dữ liệu mới hơn. Chi tiết đã được lưu để kiểm tra.");
      if (typeof showConfirmModal === "function") {
        const lines = operations.map(item => item.operation === "delete"
          ? `${escapeHtml(item.bossName || item.bossId)} — thao tác xóa Boss`
          : `${escapeHtml(item.bossName || item.bossId)} — giờ chết: ${item.diedAt ? escapeHtml(formatFullDateTime(item.diedAt)) : "không có"}`);
        showConfirmModal({
          title: "Thao tác không được Firebase chấp nhận",
          subtitle: "Một Admin khác đã cập nhật Boss trước khi máy này kết nối lại.",
          message: `Dữ liệu máy chủ được giữ nguyên. Thao tác bị từ chối:<br><br>${lines.join("<br>")}`,
          html: true,
          confirmText: "Đã hiểu",
          cancelText: "Đóng",
          isDanger: false
        });
      }
    }

    function getChangedBossIds(beforeState, afterState) {
      const beforeMap = new Map((beforeState?.bosses || []).map(boss => [boss.id, boss]));
      const afterMap = new Map((afterState?.bosses || []).map(boss => [boss.id, boss]));
      const ids = new Set([...beforeMap.keys(), ...afterMap.keys()]);
      return [...ids].filter(id => JSON.stringify(beforeMap.get(id)) !== JSON.stringify(afterMap.get(id)));
    }

    function enqueueBossSaveWaiter(bossIds = []) {
      return new Promise(resolve => {
        const finish = outcome => {
          activeBossSaveWaiters.delete(finish);
          resolve(outcome);
        };
        finish.bossIds = new Set(bossIds);
        activeBossSaveWaiters.add(finish);
        pendingBossSaveWaiters.push(finish);
      });
    }

    async function saveState(seedOnly = false) {
      // Luon giu local cache de app van mo duoc khi mat mang.
      lastLocalEditTime = Date.now();
      // Do not broadcast optimistic data to sibling tabs before Firebase accepts it.
      saveStateLocal(false);
      if (!isAdmin() || !REALTIME_ENABLED || !stateDbRef) return false;

      if (remoteSaveInFlight && Date.now() - lastRemoteSaveStartTime > 8000) {
        console.warn("[saveState] Clearing stuck remoteSaveInFlight lock (> 8s)");
        remoteSaveInFlight = false;
      }
      if (remoteSaveInFlight || !remoteStateReady) {
        pendingRemoteSave = true;
        return enqueueBossSaveWaiter(getChangedBossIds(activeBossTransactionLocal || bossSyncBase, state));
      }

      // Waiters created while Firebase was not ready belong to this transaction.
      // Waiters added after remoteSaveInFlight becomes true belong to the next one.
      const currentSaveWaiters = pendingBossSaveWaiters.splice(0);
      const local = { bosses: state.bosses.map(normalizeBoss), history: cloneRealtimeValue(state.history.slice(0, 30)) };
      activeBossTransactionLocal = cloneRealtimeValue(local);
      const base = cloneRealtimeValue(bossSyncBase);
      if (!seedOnly && JSON.stringify(base) === JSON.stringify(local)) {
        pendingRemoteSave = false;
        currentSaveWaiters.forEach(resolve => resolve(true));
        return true;
      }
      const saveRef = stateDbRef;
      const generation = bossSyncGeneration;
      lastRemoteSaveStartTime = Date.now();
      remoteSaveInFlight = true;
      pendingRemoteSave = false;
      bossDeferredRemoteData = null;
      if (typeof lastBossConflictIds !== "undefined") lastBossConflictIds = [];
      setRealtimeStatus("saving", "Đang lưu thay đổi lên Firebase…");
      let saved = false;
      let transactionConflictIds = [];
      let confirmedRemote = null;
      try {
        const txPromise = saveRef.transaction(current => {
          if (seedOnly && current?.data) return;
          const merged = current ? mergeBossStateChanges(base, local, getBossRemoteData(current)) : cloneRealtimeValue(local);
          transactionConflictIds = typeof lastBossConflictIds !== "undefined" ? [...lastBossConflictIds] : [];
          merged.history = merged.history.sort((a, b) => b.time - a.time).slice(0, 30);
          const updatedAt = new Date(getNow()).toISOString();
          const version = (Number(current?.version) || 0) + 1;
          return {
            ...current,
            data: { _clientId: CLIENT_ID, bosses: merged.bosses, history: merged.history, updated_at: updatedAt, version },
            bosses_map: Object.fromEntries(merged.bosses.map(boss => [boss.id, boss])),
            last_editor: CLIENT_ID,
            updated_at: updatedAt,
            version
          };
        }, undefined, false);
        const timerFn = typeof setTimeout !== "undefined" ? setTimeout : (typeof globalThis !== "undefined" && globalThis.setTimeout ? globalThis.setTimeout : null);
        const result = timerFn
          ? await Promise.race([txPromise, new Promise((_, reject) => timerFn(() => reject(new Error("Timeout khi kết nối Firebase (15s)")), 15000))])
          : await txPromise;
        if (generation !== bossSyncGeneration) return false;
        const confirmed = result.snapshot.val();
        if (confirmed) {
          const remote = getBossRemoteData(confirmed);
          confirmedRemote = { ...cloneRealtimeValue(remote), updated_at: confirmed.updated_at, version: Number(confirmed.version) || 0 };
          applyRemoteState(remote.bosses, remote.history, confirmed.updated_at, CLIENT_ID, result.committed ? local : base, confirmed.version);
          if (transactionConflictIds.length) discardConflictedQueuedBossChanges(transactionConflictIds, confirmedRemote);
          if (bossDeferredRemoteData && Number(bossDeferredRemoteData.version) > Number(confirmed.version)) {
            const deferred = getBossRemoteData(bossDeferredRemoteData);
            applyRemoteState(deferred.bosses, deferred.history, bossDeferredRemoteData.updated_at, undefined, bossSyncBase, bossDeferredRemoteData.version);
          }
        }
        saved = true;
        const conflictIds = transactionConflictIds;
        setRealtimeStatus("online", conflictIds.length
          ? "Có xung đột — dữ liệu mới nhất trên Firebase được giữ lại"
          : "Đã đồng bộ thay đổi lên Firebase");
        if (conflictIds.length && typeof showToast === "function") {
          showToast("⚠️ Boss vừa được Admin khác cập nhật. Thao tác cũ của bạn không được ghi đè.");
          reportRejectedBossOperations(conflictIds, local);
        }
        // Broadcast the exact server snapshot, never state that may already contain
        // another local edit waiting for its own transaction.
        broadcastConfirmedBossState(confirmedRemote);
      } catch (error) {
        console.error("Firebase save error:", error);
        const errMsg = error?.message || "Không thể đồng bộ";
        // A live Firebase socket only means the browser is connected. It does not
        // mean this write was accepted. Keep the UI visibly unsynced until a later
        // transaction confirms the local changes.
        setRealtimeStatus("unsynced", firebaseRealtimeConnected
          ? "Có thay đổi chưa được Firebase chấp nhận: " + errMsg
          : "Không thể đồng bộ — thay đổi đang được giữ trên trình duyệt");
        if (typeof showToast === "function") {
          showToast("⚠️ Chưa thể lưu lên Firebase: " + errMsg);
        }
      } finally {
        if (generation === bossSyncGeneration) {
          remoteSaveInFlight = false;
          bossDeferredRemoteData = null;
          activeBossTransactionLocal = null;
          const savePending = pendingRemoteSave;
          pendingRemoteSave = !saved || savePending;
          const completedOutcome = !saved ? false : (transactionConflictIds.length ? "conflict" : true);
          currentSaveWaiters.forEach(resolve => resolve(completedOutcome));
          if (saved && savePending) {
            const waiters = pendingBossSaveWaiters.splice(0);
            pendingRemoteSave = false;
            if (transactionConflictIds.length) {
              const rejected = new Set(transactionConflictIds);
              const safeWaiters = [];
              waiters.forEach(waiter => {
                if ([...waiter.bossIds].some(id => rejected.has(id))) waiter("conflict");
                else safeWaiters.push(waiter);
              });
              const hasRemaining = JSON.stringify(bossSyncBase) !== JSON.stringify({ bosses: state.bosses.map(normalizeBoss), history: state.history.slice(0, 30) });
              if (hasRemaining) saveState().then(outcome => safeWaiters.forEach(resolve => resolve(outcome)));
              else safeWaiters.forEach(resolve => resolve(true));
            } else {
              saveState().then(outcome => waiters.forEach(resolve => resolve(outcome)));
            }
          } else if (!saved && pendingBossSaveWaiters.length) {
            const waiters = pendingBossSaveWaiters.splice(0);
            waiters.forEach(resolve => resolve(false));
          }
        }
      }
      if (!saved) return false;
      if (!transactionConflictIds.length) return true;
      const rejected = [...transactionConflictIds];
      const changed = getChangedBossIds(base, local);
      const accepted = changed.filter(id => !rejected.includes(id));
      return accepted.length ? { acceptedBossIds: accepted, rejectedBossIds: rejected } : "conflict";
    }

    function setRealtimeStatus(type, title) {
      const el = document.getElementById("realtimeStatus");
      if (!el) return;
      el.dataset.status = type;
      el.title = title || "";
      el.querySelector(".realtime-status-text").textContent =
        type === "online" ? "Đã đồng bộ"
          : type === "saving" ? "Đang lưu…"
          : type === "unsynced" ? "Chưa đồng bộ"
          : type === "connecting" ? "Đang kết nối…"
          : "Offline";
    }

    function hasUnsyncedBossChanges() {
      if (pendingRemoteSave || remoteSaveInFlight) return true;
      if (!bossSyncBase || !state || !Array.isArray(state.bosses)) return false;
      const local = { bosses: state.bosses.map(normalizeBoss), history: state.history.slice(0, 30) };
      return JSON.stringify(bossSyncBase) !== JSON.stringify(local);
    }

    function applyRemoteState(incomingBosses, incomingHistory, updatedAt, senderId, localBase = bossSyncBase, remoteVersion = 0) {
      if (!Array.isArray(incomingBosses)) return false;
      // Auth restoration must finish before choosing whether to preserve unsent admin edits.
      if (!firebaseAuthReady) return false;
      const numericVersion = Number(remoteVersion) || 0;
      if (numericVersion && numericVersion < lastAppliedBossVersion) return false;
      if (numericVersion) lastAppliedBossVersion = numericVersion;

      if (updatedAt) {
        const remoteTime = new Date(updatedAt).getTime();
        lastRemoteUpdatedAt = remoteTime || getNow();
      }

      const remote = {
        bosses: incomingBosses.map(normalizeBoss),
        history: Array.isArray(incomingHistory) ? incomingHistory.slice(0, 30) : []
      };
      const attemptedState = cloneRealtimeValue(state);
      state = isAdmin() ? mergeBossStateChanges(localBase, state, remote) : remote;
      const snapshotConflictIds = typeof lastBossConflictIds !== "undefined" ? [...lastBossConflictIds] : [];
      bossSyncBase = cloneRealtimeValue(remote);
      lastRenderedGridKey = ""; // Bat buoc render lai giao dien moi
      saveStateLocal(false); // Luu vao cache nhung KHONG broadcast nguoc lai de triet tieu loop
      render();
      if (snapshotConflictIds.length) {
        const conflictKey = `${numericVersion}:${snapshotConflictIds.sort().join(",")}:${snapshotConflictIds.map(id => attemptedState.bosses.find(b => b.id === id)?.revision || 0).join(",")}`;
        if (conflictKey !== lastReportedBossConflictKey) {
          lastReportedBossConflictKey = conflictKey;
          reportRejectedBossOperations(snapshotConflictIds, attemptedState);
        }
      }
      return true;
    }

    function applyDeferredBossRemoteAfterAuth() {
      if (!firebaseAuthReady || !bossDeferredRemoteData) return false;
      const queued = bossDeferredRemoteData;
      bossDeferredRemoteData = null;
      const remote = getBossRemoteData(queued);
      applyRemoteState(remote.bosses, remote.history, queued.updated_at, queued.last_editor || queued.data?._clientId, bossSyncBase, queued.version || queued.data?.version);
      return true;
    }

    let activeStateRef = null;
    let activeDiscordConfigRef = null;
    let connectedRefBound = false;
    let firebaseRealtimeConnected = false;

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

      setRealtimeStatus(firebaseRealtimeConnected ? (hasUnsyncedBossChanges() ? "unsynced" : "online") : "connecting", firebaseRealtimeConnected
        ? (hasUnsyncedBossChanges() ? "Đã kết nối Firebase nhưng còn thay đổi chưa đồng bộ" : "Đã kết nối Firebase Realtime — dữ liệu đã đồng bộ")
        : "Đang kết nối Google Firebase Realtime…");

      // Giam sat ket noi Firebase connection state (chi can gan 1 lan)
      if (!connectedRefBound && firebaseDb) {
        firebaseDb.ref(".info/serverTimeOffset").on("value", (snap) => {
          serverTimeOffset = Number(snap.val()) || 0;
        });
        firebaseDb.ref(".info/connected").on("value", (snap) => {
          firebaseRealtimeConnected = snap.val() === true;
          if (firebaseRealtimeConnected) {
            const unsynced = hasUnsyncedBossChanges();
            setRealtimeStatus(unsynced ? "unsynced" : "online", unsynced
              ? "Đã kết nối Firebase nhưng còn thay đổi chưa đồng bộ"
              : "Đã kết nối Firebase Realtime — dữ liệu đã đồng bộ");
            if (isAdmin() && remoteStateReady && pendingRemoteSave) saveState();
            if (isAdmin() && attendanceRemoteStateReady && attendancePendingRemoteSave) pushAttendanceToFirebase();
          } else {
            setRealtimeStatus("connecting", "Đang kết nối lại Firebase Realtime…");
          }
        });
        connectedRefBound = true;
      }

      // Lang nghe thay doi truc tiep tu Firebase Realtime Database cua server hien tai
      // Subscribe only to public boss data; the parent also contains legacy payroll.
      activeStateRef = stateDbRef.child("data");
      const subscribedRef = activeStateRef;
      const generation = bossSyncGeneration;
      activeStateRef.on("value", (snapshot) => {
        if (generation !== bossSyncGeneration || subscribedRef !== activeStateRef) return;
        const data = snapshot.val();
        const val = data ? { data, last_editor: data._clientId, updated_at: data.updated_at, version: data.version } : null;
        remoteStateReady = true;
        if (!firebaseAuthReady) {
          // Snapshot đầu tiên thường đến trước khi Firebase Auth xác nhận quyền Admin.
          // Giữ lại để áp dụng ngay sau đăng nhập thay vì âm thầm bỏ qua.
          bossDeferredRemoteData = cloneRealtimeValue(val);
          return;
        }
        if (remoteSaveInFlight) {
          bossDeferredRemoteData = cloneRealtimeValue(val);
          return;
        }
        if (val) {
          const senderId = val.last_editor || val.data?._clientId;
          const remote = getBossRemoteData(val);
          const hasUnsyncedBossesBefore = isAdmin() && state.bosses.some(b => {
            const rb = remote.bosses.find(item => item.id === b.id);
            return !rb || (Number(b.revision) || 0) > (Number(rb.revision) || 0) || b.notes !== rb.notes || b.name !== rb.name;
          });
          applyRemoteState(remote.bosses, remote.history, val.updated_at, senderId, bossSyncBase, val.version || val.data?.version);
          if (senderId !== CLIENT_ID) showToast("🔄 Team vừa cập nhật Boss Timeline.");
          const hasUnsyncedBosses = hasUnsyncedBossesBefore || (isAdmin() && state.bosses.some(b => {
            const rb = remote.bosses.find(item => item.id === b.id);
            return !rb || (Number(b.revision) || 0) > (Number(rb.revision) || 0) || b.notes !== rb.notes || b.name !== rb.name;
          }));
          if (isAdmin() && (pendingRemoteSave || hasUnsyncedBosses)) saveState();
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
      if (discordConfigDbRef && isAdmin()) {
        activeDiscordConfigRef = discordConfigDbRef;
        activeDiscordConfigRef.on("value", (snapshot) => {
          const remoteCfg = snapshot.val();
          if (remoteCfg && typeof remoteCfg === "object") {
            const safeRemoteCfg = { ...remoteCfg };
            const hadLegacyWebhook = Boolean(safeRemoteCfg.webhookUrl);
            delete safeRemoteCfg.webhookUrl;
            discordConfig = { ...defaultDiscordConfig, ...safeRemoteCfg };
            try {
              localStorage.setItem(STORAGE_DISCORD_KEY, JSON.stringify(discordConfig));
            } catch (e) {}
            if (hadLegacyWebhook && isAdmin()) {
              discordConfigDbRef.child("webhookUrl").remove().catch(() => {});
            }
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
        name: String(boss.name || "Boss mới").trim().toLocaleUpperCase("vi-VN").slice(0, 44),
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
        revision: Math.max(0, Number(boss.revision) || 0),
        updatedAt: Math.max(0, Number(boss.updatedAt) || 0),
        updatedBy: String(boss.updatedBy || "").slice(0, 120),
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
      const eventTime = Number(time) || getNow();
      return {
        // A stable ID makes the same automatic transition idempotent across clients.
        id: `history_${type}_${String(boss.id).replace(/[^a-zA-Z0-9_-]/g, "_")}_${eventTime}`,
        type,
        bossId: boss.id,
        bossName: boss.name,
        map: boss.map,
        time: eventTime,
        source,
        adminName: isAdmin() ? currentAdminName : null
      };
    }

    function pushHistory(type, boss, time = getNow(), source = null) {
      const item = historyItem(type, boss, time, source);
      if (!state.history.some(existing => existing.id === item.id)) state.history.unshift(item);
      state.history = state.history.slice(0, 30);
    }

    function touchBossRevision(boss, time = getNow()) {
      boss.revision = Math.max(0, Number(boss.revision) || 0) + 1;
      boss.updatedAt = Number(time) || getNow();
      boss.updatedBy = CLIENT_ID;
    }

    function isBossRevisionCurrent(bossId, revision) {
      const current = state.bosses.find(item => item.id === bossId);
      return Boolean(current) && (Number(current.revision) || 0) === revision;
    }

    // Một luồng hồi sinh dùng chung cho cả Admin và countdown tự động.
    // Không chặn Admin hồi sinh theo countdown: Admin có thể chủ động xác nhận
    // theo giờ thực tế đã được note.
    function performRespawn(boss, time = getNow(), source = "manual") {
      if (!boss) return false;

      boss.lastRespawnAt = time;
      boss.diedAt = null;
      boss.respawnsAt = null;
      touchBossRevision(boss, time);
      pushHistory("respawn", boss, time, source);
      return true;
    }

    let autoRespawnSaveInFlight = false;

    async function autoResolveRespawns() {
      // Members render countdown/status from confirmed Firebase timers only. They
      // must never create transitions, revisions, history, or broadcasts locally.
      if (!isAdmin() || autoRespawnSaveInFlight) return;
      const now = getNow();
      let changed = false;
      const confirmedCandidates = [];

      state.bosses.forEach((boss) => {
        if (boss.spawnMode === "fixed") {
          if (boss.diedAt) {
            const nextTime = getNextFixedSpawnTime(boss, boss.diedAt);
            if (nextTime && nextTime <= now) {
              const targetKey = boss.id + "_" + nextTime;
              performRespawn(boss, nextTime, "automatic");
              confirmedCandidates.push({ bossId: boss.id, revision: boss.revision, eventTime: nextTime, targetKey });
              changed = true;
            }
          }
        } else {
          if (boss.diedAt && boss.respawnsAt && boss.respawnsAt <= now) {
            const cycleKey = boss.id + "_" + boss.respawnsAt;
            const respawnTime = boss.respawnsAt;
            performRespawn(boss, boss.respawnsAt, "automatic");
            confirmedCandidates.push({ bossId: boss.id, revision: boss.revision, eventTime: respawnTime, targetKey: cycleKey });
            changed = true;
          }
        }
      });

      if (changed) {
        autoRespawnSaveInFlight = true;
        try {
          const outcome = await saveState();
          if (outcome === true) {
            confirmedCandidates.forEach(candidate => {
              const boss = state.bosses.find(item => item.id === candidate.bossId);
              if (!boss || (Number(boss.revision) || 0) !== candidate.revision) return;
              if (!activeSoundNotified[candidate.targetKey + "_0m"]) {
                activeSoundNotified[candidate.targetKey + "_0m"] = true;
                notifyBossAlert(boss, "0m", candidate.eventTime);
              }
            });
            const isEn = currentLang === "en";
            showToast(isEn ? "A boss respawn was confirmed and synchronized." : "Boss hồi sinh đã được Firebase xác nhận và đồng bộ.");
          }
        } finally {
          autoRespawnSaveInFlight = false;
        }
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

    function sortBossesForDisplay(bosses, now, levelMode = activeLevelFilter) {
      const isLevelSort = levelMode === "level-asc" || levelMode === "level-desc";
      const priorityLevels = new Set([60, 65, 70, 75, 80]);

      return bosses.sort((a, b) => {
        const aTime = getNextBossEventTime(a, now);
        const bTime = getNextBossEventTime(b, now);
        const aRespawning = Number.isFinite(aTime) && aTime > now;
        const bRespawning = Number.isFinite(bTime) && bTime > now;

        // Trạng thái luôn là tiêu chí đầu tiên: Boss chưa chết/sẵn sàng phải
        // nằm trên toàn bộ Boss đang chờ hồi sinh, bất kể cấp độ.
        if (aRespawning !== bRespawning) return aRespawning ? 1 : -1;

        // Khi người dùng chọn sắp xếp theo cấp, cấp độ là tiêu chí chính trong mỗi nhóm trạng thái.
        if (levelMode === "level-asc") return (a.level || 80) - (b.level || 80);
        if (levelMode === "level-desc") return (b.level || 80) - (a.level || 80);

        // Boss đang hồi sinh luôn xếp theo giờ ra gần nhất, không xen cấp độ.
        if (aRespawning && aTime !== bTime) return aTime - bTime;

        // Trong nhóm Boss sẵn sàng, giữ ưu tiên cấp phổ biến 60–80 như trước.
        if (!isLevelSort) {
          const aPriority = priorityLevels.has(Number(a.level));
          const bPriority = priorityLevels.has(Number(b.level));
          if (aPriority !== bPriority) return aPriority ? -1 : 1;
        }
        return 0;
      });
    }

    function getVisibleBosses(now) {
      const filtered = state.bosses.filter((boss) => {
        const status = getBossStatus(boss, now);
        const matchesFilter = activeFilter === "all" || status === activeFilter;
        
        let matchesLevel = true;
        if (activeLevelFilter === "fixed") {
          matchesLevel = boss.spawnMode === "fixed";
        }

        return matchesFilter && matchesLevel;
      });

      return sortBossesForDisplay(filtered, now);
    }

    function sortBossesForMaintenance(bosses) {
      const preferredNames = [
        "Quý bà Dalia", "Tướng Aquileus", "Amentis", "Wannitas", "Duplican", "Metus",
        "Nam Tước Bradmore", "Gareth", "Titore", "Catena", "Shuliar", "Larba",
        "Secreta", "Ordo", "Asta", "Supore"
      ];
      const normalizeName = value => String(value || "")
        .replace(/^\s*(?:lv\.?\s*)?\d{1,3}\s*[-–:]?\s*/i, "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[đĐ]/g, "d")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .trim();
      const rankByName = new Map(preferredNames.map((name, index) => [normalizeName(name), index]));

      return bosses
        .map((boss, index) => ({ boss, index, rank: rankByName.get(normalizeName(boss.name)) }))
        .sort((a, b) => {
          if (a.rank !== undefined && b.rank !== undefined) return a.rank - b.rank;
          if (a.rank !== undefined) return -1;
          if (b.rank !== undefined) return 1;
          return a.index - b.index;
        })
        .map(item => item.boss);
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
        const timerValue = isAlive ? (isEn ? "READY" : "SẴN SÀNG") : formatCountdown(remaining);
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
      const timerValue = isAlive ? (isEn ? "READY" : "SẴN SÀNG") : formatCountdown(remaining);

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

      // Update Column 2 (Boss Name)
      if (row.children[1]) {
        const nameDiv = row.children[1].querySelector("div[style*='font-weight:800']");
        if (nameDiv && nameDiv.textContent !== boss.name) nameDiv.textContent = boss.name;
      }

      // Update Column 3 (Level)
      if (row.children[2]) {
        const levelBadge = row.children[2].querySelector(".level-badge");
        const expLevel = `Lv. ${boss.level || 80}`;
        if (levelBadge && levelBadge.textContent !== expLevel) levelBadge.textContent = expLevel;
      }

      // Update Column 4 (Map)
      if (row.children[3]) {
        const mapStrong = row.children[3].querySelector("strong");
        if (mapStrong && mapStrong.textContent !== boss.map) mapStrong.textContent = boss.map;
      }

      // Update Column 6 (Notes)
      if (row.children[5]) {
        const notesContent = boss.notes ? escapeHtml(boss.notes) : '<span class="notes-empty">—</span>';
        if (row.children[5].innerHTML !== notesContent) row.children[5].innerHTML = notesContent;
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

      // Structural key: thay đổi khi trạng thái chết/sống thay đổi hoặc thay đổi filter/role/view/dữ liệu boss/ghi chú
      const structKey = bosses.map((b) => `${b.id}:${b.revision || 0}:${b.diedAt || 0}:${b.respawnsAt || 0}:${getBossStatus(b, now)}:${b.notes || ''}:${b.name || ''}:${b.level || 0}`).join(",")
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
      const timerValue = isAlive ? (isEn ? "READY" : "SẴN SÀNG") : formatCountdown(remaining);
      const statusClass = `status-${status}`;
      const statusBadgeText = isEn
        ? (status === "alive" ? "• ALIVE" : (status === "soon" ? "• SPAWNING SOON" : "• COUNTING DOWN"))
        : statusCopy[status].label;

      const respawnText = boss.spawnMode === "fixed"
        ? (isEn ? `Fixed ${boss.fixedTime}` : `Cố định ${boss.fixedTime}`)
        : (isEn ? "Respawn " : "Hồi sinh sau ") + formatRespawnMinutes(boss.respawnMinutes);
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

      const nameEl = card.querySelector(".boss-name");
      if (nameEl) {
        const expectedName = `${boss.spawnMode === 'fixed' ? '⭐ ' : ''}${escapeHtml(boss.name)}`;
        if (nameEl.innerHTML !== expectedName) nameEl.innerHTML = expectedName;
      }

      const mapEl = card.querySelector(".boss-map");
      if (mapEl) {
        const expectedMap = `${escapeHtml(boss.map)} · <span class="level-badge">Lv. ${boss.level || 80}</span>`;
        if (mapEl.innerHTML !== expectedMap) mapEl.innerHTML = expectedMap;
      }

      let notesEl = card.querySelector(".boss-card-notes");
      if (boss.notes) {
        const expectedNotesHtml = `<span style="font-weight:700; color:var(--text);">📝 Ghi chú:</span> ${escapeHtml(boss.notes)}`;
        if (notesEl) {
          if (notesEl.innerHTML !== expectedNotesHtml) notesEl.innerHTML = expectedNotesHtml;
        } else {
          const timerPanel = card.querySelector(".timer-panel");
          if (timerPanel) {
            notesEl = document.createElement("div");
            notesEl.className = "boss-card-notes";
            notesEl.style.cssText = "margin-top:8px; padding:6px 10px; background:var(--surface-2); border-radius:6px; font-size:12px; color:var(--text-2); border-left:3px solid var(--cyan); word-break:break-word; line-height:1.4;";
            notesEl.innerHTML = expectedNotesHtml;
            timerPanel.insertAdjacentElement("afterend", notesEl);
          }
        }
      } else if (notesEl) {
        notesEl.remove();
      }

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
      const timerValue = isAlive ? (isEn ? "READY" : "SẴN SÀNG") : formatCountdown(remaining);
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

      const respawnText = boss.spawnMode === "fixed" ? (isEn ? `Fixed ${boss.fixedTime}` : `Cố định ${boss.fixedTime}`) : (isEn ? "Respawn " : "Hồi sinh sau ") + formatRespawnMinutes(boss.respawnMinutes);
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

          ${boss.notes ? `
            <div class="boss-card-notes" style="margin-top:8px; padding:6px 10px; background:var(--surface-2); border-radius:6px; font-size:12px; color:var(--text-2); border-left:3px solid var(--cyan); word-break:break-word; line-height:1.4;">
              <span style="font-weight:700; color:var(--text);">📝 Ghi chú:</span> ${escapeHtml(boss.notes)}
            </div>
          ` : ''}

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
        tab.classList.toggle("active", filter === String(scheduleDayFilter));
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

    function getBossScheduleEventTimes(boss, now, dayFilter) {
      const nowDate = new Date(now);
      const targetDate = dayFilter === "all" ? nowDate : getTargetDateForFilter(nowDate, dayFilter);
      const start = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
      const end = new Date(start);
      end.setDate(end.getDate() + (dayFilter === "all" ? 7 : 1));
      const times = new Set();

      if (boss.spawnMode === "fixed") {
        const schedules = Array.isArray(boss.fixedSchedules) && boss.fixedSchedules.length > 0
          ? boss.fixedSchedules
          : [{ day: "all", time: boss.fixedTime || "18:00" }];
        for (const date = new Date(start); date < end; date.setDate(date.getDate() + 1)) {
          for (const slot of schedules) {
            if (slot.day !== "all" && Number(slot.day) !== date.getDay()) continue;
            const [h, m] = (slot.time || "18:00").split(":").map(Number);
            if (!Number.isInteger(h) || !Number.isInteger(m) || h < 0 || h > 23 || m < 0 || m > 59) continue;
            times.add(new Date(date.getFullYear(), date.getMonth(), date.getDate(), h, m).getTime());
          }
        }
      } else {
        const intervalMs = Math.max(1, Number(boss.respawnMinutes) || 30) * 60000;
        const lastRespawnAt = boss.lastRespawnAt == null ? NaN : Number(boss.lastRespawnAt);
        const hasRecordedSpawn = Number.isFinite(lastRespawnAt) && Array.isArray(state.history)
          && state.history.some(event => event.type === "respawn"
            && (event.bossId === "all" || event.bossId === boss.id)
            && Number(event.time) === lastRespawnAt);
        if (hasRecordedSpawn && lastRespawnAt >= start.getTime() && lastRespawnAt < end.getTime()) {
          times.add(lastRespawnAt);
        }
        const baseTime = boss.diedAt ? boss.diedAt + intervalMs
          : (boss.respawnsAt || (boss.lastRespawnAt ? boss.lastRespawnAt + intervalMs : null));
        // An untracked interval boss has no reliable anchor for a forecast.
        if (!Number.isFinite(baseTime) || !Number.isFinite(intervalMs)) return [];
        const first = baseTime + Math.max(0, Math.ceil((start.getTime() - baseTime) / intervalMs)) * intervalMs;
        for (let time = first; time < end.getTime(); time += intervalMs) {
          times.add(time);
        }
      }
      return [...times].sort((a, b) => a - b);
    }

    function getBossScheduleItems(now, dayFilter) {
      return state.bosses.flatMap((boss, bossOrder) => getBossScheduleEventTimes(boss, now, dayFilter)
        .map(eventTime => ({ boss, eventTime, bossOrder })))
        .sort((a, b) => (a.eventTime - b.eventTime) || (a.bossOrder - b.bossOrder))
        .map(({ boss, eventTime }) => ({ boss, eventTime }));
    }

    let lastTodayScheduleKey = "";

    function renderTodayScheduleTable(now = getNow()) {
      if (!elements.todayScheduleBody) return;
      updateScheduleDayTabs(new Date(now));
      if (elements.todayScheduleSubtitle) {
        elements.todayScheduleSubtitle.textContent = getTodayScheduleSubtitle(new Date(now));
      }

      const items = getBossScheduleItems(now, scheduleDayFilter);

      const totalBoss = items.length;
      const isEn = currentLang === "en";
      if (elements.todayHeaderBadge) {
        elements.todayHeaderBadge.textContent = `${totalBoss} ${isEn ? 'spawns' : 'lượt'}`;
      }
      if (elements.todayBossCount) {
        elements.todayBossCount.textContent = `${totalBoss} ${isEn ? 'spawns' : 'lượt'}`;
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

      const tableKey = JSON.stringify(items) + items.map(({ boss }) => getBossStatus(boss, now)).join(",") + "_" + currentLang + "_" + scheduleDayFilter;

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

      const items = getBossScheduleItems(now, scheduleDayFilter);

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
    <div style="font-weight:800; font-size:13px; color:#0c2461;">${isEn ? "Total Spawns:" : "Tổng số lượt:"} ${counts.total}</div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width:4%; text-align:center;">STT</th>
        <th style="width:17%;">${isEn ? "SPAWN TIME & DATE" : "GIỜ & NGÀY HỒI SINH"}</th>
        <th style="width:7%; text-align:center;">LEVEL</th>
        <th style="width:18%;">${isEn ? "BOSS NAME" : "TÊN BOSS"}</th>
        <th style="width:13%;">${isEn ? "CYCLE" : "CHU KỲ"}</th>
        <th style="width:12%; text-align:center;">${isEn ? "STATUS" : "TRẠNG THÁI"}</th>
        <th style="width:15%;">${isEn ? "LOCATION / MAP" : "ĐỊA ĐIỂM"}</th>
        <th style="width:14%;">${isEn ? "NOTES" : "GHI CHÚ"}</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml || `<tr><td colspan="8" style="text-align:center; padding:20px; color:#94a3b8;">${isEn ? "No bosses scheduled in the selected time range." : "Không có boss nào xuất hiện trong khoảng thời gian được chọn."}</td></tr>`}
    </tbody>
  </table>

  <div class="report-footer">
    <div>${isEn ? "Generated automatically from Boss Timeline Pro" : "Xuất tự động từ hệ thống Boss Timeline Pro"}</div>
    <div>${isEn ? "Detailed Data Report · A4 Landscape" : "Báo cáo dữ liệu chi tiết · A4 Landscape"}</div>
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

    function escapeCsvCell(value) {
      let text = String(value ?? "");
      if (/^[\s\u0000-\u001f]*[=+@-]/.test(text) || /^[\t\r\n]/.test(text)) text = "'" + text;
      return '"' + text.replace(/"/g, '""') + '"';
    }

    function buildScheduleCsv(items, now, isEn) {
      const rows = [
        isEn
          ? ["SPAWN TIME & DATE", "LEVEL", "BOSS", "CYCLE", "STATUS", "LOCATION", "NOTES"]
          : ["GIỜ & NGÀY HỒI SINH", "LEVEL", "BOSS", "CHU KỲ", "TRẠNG THÁI", "ĐỊA ĐIỂM", "GHI CHÚ"]
      ];

      items.forEach(({ boss, eventTime }) => {
        const status = getBossStatus(boss, now);
        const timeFormatted = formatSmartRespawnDate(eventTime, now).replace(/<[^>]*>/g, " ");
        const cycleText = formatSpawnLabel(boss);
        let statusText = isEn ? "ALIVE" : "Đang sống";
        if (status === "respawning") statusText = isEn ? "COUNTING DOWN" : "Đang hồi sinh";
        else if (status === "soon") statusText = isEn ? "SPAWNING SOON" : "Sắp hồi sinh";

        rows.push([
          timeFormatted,
          `Lv. ${boss.level || 80}`,
          `${boss.spawnMode === 'fixed' ? '⭐ ' : ''}${boss.name}`,
          cycleText,
          statusText,
          boss.map,
          boss.notes || ""
        ]);
      });

      return "\uFEFF" + rows.map(row => row.map(escapeCsvCell).join(",")).join("\r\n");
    }

    function exportTodayScheduleCSV() {
      const now = getNow();
      const isEn = currentLang === "en";
      const csvContent = buildScheduleCsv(getBossScheduleItems(now, scheduleDayFilter), now, isEn);
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const dateIso = dateToYMD(scheduleDayFilter === "all" ? now : getTargetDateForFilter(new Date(now), scheduleDayFilter));
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

    let pendingBossAction = null;

    function closeBossActionConfirmation() {
      document.getElementById("killConfirmModal")?.classList.remove("open");
      document.getElementById("reviveConfirmModal")?.classList.remove("open");
      pendingBossAction = null;
      syncModalScrollLock();
    }

    function openBossActionConfirmation(action, id) {
      if (!isAdmin()) return;
      const boss = state.bosses.find(item => item.id === id);
      if (!boss || !["kill", "revive"].includes(action)) return;
      closeBossActionConfirmation();
      const time = getNow();
      pendingBossAction = { action, id, time, revision: Number(boss.revision) || 0, serverId: currentServerId, generation: bossSyncGeneration };
      document.getElementById(`${action}ConfirmBossName`).textContent = boss.name;
      document.getElementById(`${action}ConfirmAdmin`).textContent = currentAdminName;
      if (action === "kill") {
        document.getElementById("killConfirmTime").textContent = format24hTime(time);
        document.getElementById("killConfirmRespawn").textContent = formatSpawnLabel(boss);
      }
      document.getElementById(`${action}ConfirmModal`).classList.add("open");
      syncModalScrollLock();
      document.getElementById(`${action}ConfirmCancelBtn`).focus();
    }

    function confirmBossAction(action) {
      const pending = pendingBossAction;
      closeBossActionConfirmation();
      if (!pending || pending.action !== action || pending.serverId !== currentServerId || pending.generation !== bossSyncGeneration || !isAdmin()) return;
      const latestBoss = state.bosses.find(item => item.id === pending.id);
      if (!latestBoss || (Number(latestBoss.revision) || 0) !== pending.revision) {
        showToast("⚠️ Boss vừa được Admin khác cập nhật. Hãy kiểm tra lại trước khi thao tác.");
        return;
      }
      if (action === "kill") killBoss(pending.id, pending.time);
      else reviveBoss(pending.id);
    }

    async function killBoss(id, diedAt = getNow()) {
      const isEn = currentLang === "en";
      if (!isAdmin()) {
        showToast(isEn ? "Only Admin can record boss deaths." : "Chỉ Admin mới có quyền ghi nhận boss chết.");
        return;
      }
      const boss = state.bosses.find((item) => item.id === id);
      if (!boss) return;

      const now = diedAt;
      boss.diedAt = now;
      if (boss.spawnMode === "fixed") {
        boss.respawnsAt = getNextFixedSpawnTime(boss, now);
      } else {
        boss.respawnsAt = now + (boss.respawnMinutes || 30) * 60 * 1000;
      }
      touchBossRevision(boss, now);
      const actionRevision = boss.revision;
      pushHistory("death", boss, now);
      lastLocalEditTime = Date.now();
      lastRenderedGridKey = ""; // Bắt buộc render cập nhật nút và countdown tức thì
      render();
      showToast(isEn ? `⏳ Saving ${boss.name}'s death record…` : `⏳ Đang lưu giờ chết của ${boss.name}…`);
      const saved = await saveState();
      if (saved === true && isBossRevisionCurrent(id, actionRevision)) {
        sendDiscordKillAlert(boss, now, boss.respawnsAt);
        showToast(isEn ? `💀 ${boss.name} synchronized. Respawn countdown started.` : `💀 Đã đồng bộ ${boss.name} chết! Bắt đầu đếm ngược hồi sinh.`);
      } else if (saved === true) {
        showToast(isEn ? "A newer death record is being synchronized." : "⏳ Có giờ chết mới hơn đang được đồng bộ.");
      } else if (saved === "conflict") {
        showToast(isEn ? "Another Admin updated this boss first. Your death record was not saved." : "⚠️ Admin khác đã cập nhật Boss trước. Giờ chết của bạn không được lưu.");
      } else if (saved === false) {
        showToast(isEn ? "Save failed. The change remains on this device for retry." : "⚠️ Chưa lưu được Firebase. Thay đổi được giữ trên máy để thử lại.");
      }
    }

    async function reviveBoss(id) {
      const isEn = currentLang === "en";
      if (!isAdmin()) {
        showToast(isEn ? "Only Admin can revive bosses." : "Chỉ Admin mới có quyền cho hồi sinh boss.");
        return;
      }
      const boss = state.bosses.find((item) => item.id === id);
      if (!boss) return;

      const now = getNow();
      performRespawn(boss, now, "manual");
      const actionRevision = boss.revision;
      lastLocalEditTime = Date.now();
      lastRenderedGridKey = ""; // Bắt buộc render cập nhật nút tức thì
      render();
      showToast(isEn ? `⏳ Saving ${boss.name}'s respawn…` : `⏳ Đang lưu trạng thái hồi sinh của ${boss.name}…`);
      const saved = await saveState();
      if (saved === true && isBossRevisionCurrent(id, actionRevision)) showToast(isEn ? `✨ ${boss.name} respawn synchronized (READY 100%).` : `✨ Đã đồng bộ ${boss.name} hồi sinh (READY 100%)!`);
      else if (saved === true) showToast(isEn ? "A newer boss operation is being synchronized." : "⏳ Có thao tác Boss mới hơn đang được đồng bộ.");
      else if (saved === "conflict") showToast(isEn ? "Another Admin updated this boss first. Your respawn was not saved." : "⚠️ Admin khác đã cập nhật Boss trước. Lệnh hồi sinh của bạn không được lưu.");
      else if (saved === false) showToast(isEn ? "Save failed. The change remains on this device for retry." : "⚠️ Chưa lưu được Firebase. Thay đổi được giữ trên máy để thử lại.");
    }

    // ── OFFSET DEATH MODAL ────────────────────────────────────────
    let _offsetBossId = null;
    let _offsetMinutes = 0;
    let _offsetBossRevision = null;

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
      return `${h}:${m}`;
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
      _offsetBossRevision = Number(boss.revision) || 0;
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
        : (isEn ? "Respawn " : "Hồi sinh sau ") + formatRespawnMinutes(boss.respawnMinutes);
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
      _offsetBossRevision = null;
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

    async function confirmOffsetDeath() {
      const isEn = currentLang === "en";
      if (!isAdmin()) {
        showToast(isEn ? "Only Admin can record boss deaths." : "Chỉ Admin mới có quyền ghi nhận boss chết.");
        return;
      }
      const boss = state.bosses.find((b) => b.id === _offsetBossId);
      if (!boss) return;
      if ((Number(boss.revision) || 0) !== _offsetBossRevision) {
        closeOffsetModal();
        render();
        showToast(isEn
          ? "This boss was updated by another Admin. Review the latest time before trying again."
          : "⚠️ Boss vừa được Admin khác cập nhật. Hãy kiểm tra giờ mới nhất rồi thao tác lại.");
        return;
      }
      const diedAt = getOffsetDiedAt();
      boss.diedAt = diedAt;
      if (boss.spawnMode === "fixed") {
        boss.respawnsAt = getNextFixedSpawnTime(boss, diedAt);
      } else {
        boss.respawnsAt = diedAt + boss.respawnMinutes * 60 * 1000;
      }
      touchBossRevision(boss);
      const actionRevision = boss.revision;
      pushHistory("death", boss, diedAt);
      lastLocalEditTime = Date.now();
      closeOffsetModal();
      render();
      const diedFullStr = formatFullDateTime(diedAt, isEn);
      showToast(isEn ? `Saving ${boss.name}'s custom death time…` : `⏳ Đang lưu giờ chết tùy chỉnh của ${boss.name}…`);
      const saveResult = await saveState();
      if (saveResult === true && isBossRevisionCurrent(boss.id, actionRevision)) {
        sendDiscordKillAlert(boss, diedAt, boss.respawnsAt);
        showToast(isEn
          ? `${boss.name} synchronized as dead on ${diedFullStr}. Countdown started!`
          : `${boss.name} đã đồng bộ giờ chết ${diedFullStr}. Bắt đầu đếm ngược!`);
      } else if (saveResult === true) {
        showToast(isEn ? "A newer custom death time is being synchronized." : "⏳ Có giờ chết tùy chỉnh mới hơn đang được đồng bộ.");
      } else if (saveResult === "conflict") {
        showToast(isEn
          ? "Another Admin updated this boss first. Your custom time was not saved."
          : "⚠️ Admin khác đã cập nhật Boss trước. Giờ tùy chỉnh của bạn không được lưu.");
      } else if (saveResult === false) {
        showToast(isEn ? "Save failed. The change remains on this device for retry." : "⚠️ Chưa lưu được Firebase. Thay đổi được giữ trên máy để thử lại.");
      }
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

      // Chỉ chuẩn hóa sau khi rời ô để việc bôi đen và sửa số không làm con trỏ nhảy về cuối.
      offsetTimeInput?.addEventListener("blur", () => {
        const rawTime = offsetTimeInput.value.trim();
        const digits = rawTime.replace(/\D/g, "").slice(0, 4);
        const parts = rawTime.includes(":")
          ? rawTime.split(":")
          : [digits.slice(0, Math.max(1, digits.length - 2)), digits.slice(-2)];
        if (!parts[0] && !parts[1]) return;
        const hours = Math.min(23, Math.max(0, Number(parts[0]) || 0));
        const minutes = Math.min(59, Math.max(0, Number(parts[1]) || 0));
        offsetTimeInput.value = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
        updateOffsetPreview();
      });

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
      editingBossRevision = boss ? (Number(boss.revision) || 0) : null;
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
      editingBossRevision = null;
    }

    async function handleFormSubmit(event) {
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

      const wasEditing = Boolean(editingBossId);
      if (editingBossId) {
        const boss = state.bosses.find((item) => item.id === editingBossId);
        if (boss) {
          if ((Number(boss.revision) || 0) !== editingBossRevision) {
            showToast("⚠️ Boss vừa được Admin khác chỉnh sửa. Biểu mẫu đã được đóng để tránh ghi đè dữ liệu mới.");
            closeModal();
            render();
            return;
          }
          Object.assign(boss, normalizeBoss({ ...boss, ...payload }));
          touchBossRevision(boss);
        }
      } else {
        const newBoss = normalizeBoss({
          id: makeId(),
          ...payload,
          diedAt: null,
          respawnsAt: null,
          lastRespawnAt: null
        });
        touchBossRevision(newBoss);
        state.bosses.unshift(newBoss);
      }

      closeModal();
      render();
      showToast("⏳ Đang lưu thông tin Boss…");
      const saved = await saveState();
      if (saved === true) showToast(wasEditing ? "Đã đồng bộ thông tin Boss." : "Đã đồng bộ Boss mới.");
      else if (saved === "conflict") showToast("⚠️ Admin khác đã cập nhật Boss trước. Thay đổi của bạn không được lưu.");
      else if (saved === false) showToast("⚠️ Chưa lưu được Firebase. Thay đổi được giữ trên máy để thử lại.");
    }

    function showConfirmModal({ title, subtitle, message, html = false, confirmText = "Đồng ý", cancelText = "Hủy bỏ", isDanger = true }) {
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
        if (html) msgEl.innerHTML = message || "";
        else msgEl.textContent = message || "";
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
      const bossId = boss.id;
      const bossRevision = Number(boss.revision) || 0;
      const generation = bossSyncGeneration;

      const confirmed = await showConfirmModal({
        title: isEn ? `Delete boss ${boss.name}?` : `Xóa boss ${boss.name}?`,
        html: true,
        subtitle: isEn ? `This action will permanently remove ${boss.name}.` : `Hành động này sẽ xóa vĩnh viễn ${boss.name} khỏi hệ thống.`,
        message: isEn
          ? `Are you sure you want to delete <strong>${escapeHtml(boss.name)}</strong> (Lv.${boss.level || 80} - ${escapeHtml(boss.map)}) from the tracker?`
          : `Bạn có chắc chắn muốn xóa <strong>${escapeHtml(boss.name)}</strong> (Lv.${boss.level || 80} - ${escapeHtml(boss.map)}) khỏi danh sách theo dõi của team?`,
        confirmText: isEn ? "🗑️ Delete Boss" : "🗑️ Xóa boss",
        cancelText: isEn ? "Cancel" : "Hủy bỏ",
        isDanger: true
      });
      if (!confirmed || !isAdmin() || generation !== bossSyncGeneration) return;

      const latestBoss = state.bosses.find(item => item.id === bossId);
      if (!latestBoss || (Number(latestBoss.revision) || 0) !== bossRevision) {
        closeModal();
        render();
        showToast(isEn ? "This boss changed before deletion. Review it and try again." : "⚠️ Boss vừa được Admin khác cập nhật. Hãy kiểm tra lại trước khi xóa.");
        return;
      }

      state.bosses = state.bosses.filter((item) => item.id !== bossId);
      closeModal();
      render();
      showToast(isEn ? "Deleting boss…" : "⏳ Đang xóa Boss…");
      const saveResult = await saveState();
      if (saveResult === true) showToast(isEn ? "Boss deletion synchronized." : "Đã đồng bộ việc xóa Boss.");
      else if (saveResult === "conflict") showToast(isEn ? "The boss changed before deletion. It was not deleted." : "⚠️ Boss đã được cập nhật trước khi xóa nên không bị xóa.");
      else if (saveResult === false) showToast(isEn ? "Delete failed. It remains queued on this device." : "⚠️ Chưa xóa được trên Firebase. Thao tác đang được giữ để thử lại.");
    }

    async function resetAllTimers() {
      const isEn = currentLang === "en";
      const generation = bossSyncGeneration;
      if (!isAdmin()) {
        showToast(isEn ? "Only Admin can reset boss timers after maintenance." : "Chỉ Admin mới có quyền reset thời gian boss sau bảo trì.");
        return;
      }

      const revisionsAtOpen = new Map(state.bosses.map(boss => [boss.id, Number(boss.revision) || 0]));

      const confirmed = await showConfirmModal({
        title: isEn ? "💥 SERVER MAINTENANCE FINISHED?" : "💥 BẢO TRÌ SERVER GAME XONG?",
        html: true,
        subtitle: isEn ? "Reset all bosses to ALIVE state (Ready to spawn)." : "Đặt lại toàn bộ boss về trạng thái SỐNG (Sẵn sàng xuất hiện).",
        message: isEn
          ? "This action will set <strong>ALL BOSSES</strong> to <strong>ALIVE</strong> state and clear all countdowns.<br><br><span style='color:var(--green); font-weight:600;'>✓ Boss list, level, map and notes remain 100% intact.</span>"
          : "Thao tác này sẽ chuyển <strong>TOÀN BỘ BOSS</strong> hiện tại về trạng thái <strong>SỐNG</strong> và xóa đếm ngược của tất cả boss.<br><br><span style='color:var(--green); font-weight:600;'>✓ Danh sách boss, level, map và ghi chú của bạn vẫn giữ nguyên 100%.</span>",
        confirmText: isEn ? "💥 Reset All Bosses" : "💥 Reset tất cả Boss",
        cancelText: isEn ? "Cancel" : "Hủy bỏ",
        isDanger: true
      });
      if (!confirmed || !isAdmin() || generation !== bossSyncGeneration) return;
      const confirmationIsStale = state.bosses.length !== revisionsAtOpen.size
        || state.bosses.some(boss => revisionsAtOpen.get(boss.id) !== (Number(boss.revision) || 0));
      if (confirmationIsStale) {
        showToast(isEn
          ? "The boss list changed while confirmation was open. Review it and reset again."
          : "⚠️ Danh sách Boss đã thay đổi khi hộp xác nhận đang mở. Hãy kiểm tra và reset lại.");
        return;
      }

      const now = getNow();
      state.bosses = sortBossesForMaintenance(state.bosses);
      state.bosses.forEach((boss) => {
        boss.diedAt = null;
        boss.respawnsAt = null;
        boss.lastRespawnAt = now;
        touchBossRevision(boss, now);
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

      render();
      showToast(isEn ? "Resetting and synchronizing all bosses…" : "⏳ Đang reset và đồng bộ tất cả Boss…");
      const saveResult = await saveState();
      if (saveResult === true) showToast(isEn ? "⚡ All Bosses synchronized as ALIVE after maintenance!" : "⚡ Đã đồng bộ tất cả Boss về trạng thái SỐNG sau bảo trì!");
      else if (saveResult === "conflict") showToast(isEn ? "Some bosses changed during reset and kept their newer state." : "⚠️ Một số Boss vừa được cập nhật nên được giữ trạng thái mới hơn.");
      else if (saveResult === false) showToast(isEn ? "Reset could not reach Firebase and remains queued locally." : "⚠️ Chưa reset được trên Firebase. Thao tác đang được giữ trên máy.");
    }

    async function clearHistory() {
      const isEn = currentLang === "en";
      const generation = bossSyncGeneration;
      if (!isAdmin()) {
        showToast(isEn ? "Only Admin can clear timeline history." : "Chỉ Admin mới có quyền xóa lịch sử timeline.");
        return;
      }
      if (!state.history.length) return;

      const confirmed = await showConfirmModal({
        title: isEn ? "Clear all timeline history?" : "Xóa toàn bộ lịch sử timeline?",
        html: true,
        subtitle: isEn ? "Death and respawn event logs will be wiped." : "Lịch sử chết và hồi sinh của boss sẽ bị dọn dẹp.",
        message: isEn
          ? "Are you sure you want to completely wipe the <strong>recent timeline history log</strong>?"
          : "Bạn có chắc chắn muốn xóa sạch <strong>toàn bộ nhật ký lịch sử</strong> timeline gần đây không?",
        confirmText: isEn ? "🧹 Clear History" : "🧹 Xóa lịch sử",
        cancelText: isEn ? "Cancel" : "Hủy bỏ",
        isDanger: true
      });
      if (!confirmed || !isAdmin() || generation !== bossSyncGeneration) return;

      state.history = [];
      render();
      showToast(isEn ? "Clearing timeline history…" : "⏳ Đang xóa lịch sử timeline…");
      const saveResult = await saveState();
      if (saveResult === true) showToast(isEn ? "Timeline history deletion synchronized." : "Đã đồng bộ việc xóa lịch sử timeline.");
      else if (saveResult === "conflict") showToast(isEn ? "New team events were preserved while older history was cleared." : "Lịch sử cũ đã xóa; sự kiện mới của team vẫn được giữ lại.");
      else if (saveResult === false) showToast(isEn ? "Clear failed and remains queued locally." : "⚠️ Chưa xóa được trên Firebase. Thao tác đang được giữ trên máy.");
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

    function openTodayScheduleFromNavigation(updateHash = true) {
      scheduleDayFilter = "today";
      toggleTodaySchedule(true);
      renderTodayScheduleTable(getNow());
      if (updateHash && window.location.hash !== "#boss-schedule") {
        try {
          history.pushState(null, "", "#boss-schedule");
        } catch (error) {
          window.location.hash = "boss-schedule";
        }
      }
      window.requestAnimationFrame(() => {
        elements.todaySchedulePanel?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
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
      confirmBossAction("kill");
    });
    document.getElementById("killConfirmCancelBtn")?.addEventListener("click", () => {
      closeBossActionConfirmation();
    });

    // ── Revive Confirm Modal Listeners ──
    document.getElementById("reviveConfirmOkBtn")?.addEventListener("click", () => {
      confirmBossAction("revive");
    });
    document.getElementById("reviveConfirmCancelBtn")?.addEventListener("click", () => {
      closeBossActionConfirmation();
    });
    ["killConfirmModal", "reviveConfirmModal"].forEach(id => {
      const modal = document.getElementById(id);
      modal?.addEventListener("click", event => {
        if (event.target === modal) closeBossActionConfirmation();
      });
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
        openBossActionConfirmation("kill", id);
      } else if (action === "revive") {
        openBossActionConfirmation("revive", id);
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
        if (event.target !== elements.todayScheduleToggle) return;
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

    if (elements.exportCsvBtn) {
      elements.exportCsvBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        exportTodayScheduleCSV();
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
          e.preventDefault();
          openTodayScheduleFromNavigation(true);
          return;
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
        if (pendingBossAction) {
          closeBossActionConfirmation();
          return;
        }
        const customConfirmModal = document.getElementById("customConfirmModal");
        if (customConfirmModal && customConfirmModal.classList.contains("open")) {
          document.getElementById("confirmModalCancelBtn")?.click();
          return;
        }
        if (elements.modal.classList.contains("open")) closeModal();
        if (elements.authModal.classList.contains("open")) enterMemberMode();
        if (document.getElementById("discordSettingsModal")?.classList.contains("open")) closeDiscordModal();
        if (document.getElementById("attWeekModal")?.classList.contains("open")) closeAttendanceWeekModal();
        if (document.getElementById("attMemberModal")?.classList.contains("open")) closeAttendanceMemberModal();
        if (document.getElementById("attActivityModal")?.classList.contains("open")) closeAttendanceActivityModal();
        if (document.getElementById("attRoleBonusModal")?.classList.contains("open")) closeAttendanceRoleBonusModal();
        if (document.getElementById("attCombatPowerModal")?.classList.contains("open")) closeAttendanceCombatPowerModal();
        if (document.getElementById("attExportModal")?.classList.contains("open")) {
          document.getElementById("attExportModal")?.classList.remove("open");
          syncModalScrollLock();
        }
        if (document.getElementById("attOcrModal")?.classList.contains("open")) closeAttendanceOcrModal();
        if (document.getElementById("attEvidenceModal")?.classList.contains("open")) closeAttendanceEvidenceModal();
        if (document.getElementById("adminAccountModal")?.classList.contains("open")) {
          document.getElementById("adminAccountModal")?.classList.remove("open");
          syncModalScrollLock();
        }
        if (elements.serverModal?.classList.contains("open")) closeServerModal();
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
      const webhookInput = document.getElementById("discordWebhookInput");
      const webhookStatus = document.getElementById("discordWebhookStatus");

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

      // Load webhook URL hiện tại từ cache/Firebase
      if (webhookInput) {
        webhookInput.value = "";
        if (webhookStatus) { webhookStatus.style.display = "none"; }
        loadWebhookUrl(currentServerId).then(url => {
          if (url) {
            webhookInput.value = url;
            if (webhookStatus) {
              webhookStatus.style.display = "block";
              webhookStatus.innerHTML = `<span style="color:var(--green);">✅ Đã có Webhook — Bot sẽ gửi vào kênh Discord đã cấu hình.</span>`;
            }
          } else {
            if (webhookStatus) {
              webhookStatus.style.display = "block";
              webhookStatus.innerHTML = `<span style="color:var(--amber);">⚠️ Chưa có Webhook URL — Dán URL vào ô trên để kích hoạt.</span>`;
            }
          }
        });
      }

      // Toggle hiện/ẩn webhook URL
      const toggleBtn = document.getElementById("discordWebhookToggleBtn");
      if (toggleBtn && webhookInput) {
        toggleBtn.onclick = () => {
          webhookInput.type = webhookInput.type === "password" ? "text" : "password";
          toggleBtn.textContent = webhookInput.type === "password" ? "👁️" : "🙈";
        };
      }

      const modal = document.getElementById("discordSettingsModal");
      if (modal) modal.classList.add("open");
      syncModalScrollLock();
      webhookInput?.focus();
    }

    function closeDiscordModal() {
      const modal = document.getElementById("discordSettingsModal");
      if (modal) modal.classList.remove("open");
      syncModalScrollLock();
    }

    document.getElementById("discordSettingsBtn")?.addEventListener("click", openDiscordModal);
    document.getElementById("closeDiscordModal")?.addEventListener("click", closeDiscordModal);
    document.getElementById("discordCancelBtn")?.addEventListener("click", closeDiscordModal);

    document.getElementById("discordSaveBtn")?.addEventListener("click", async () => {
      const isEn = currentLang === "en";
      if (!isAdmin()) {
        showToast(isEn ? "Only Admin can configure Discord Webhook." : "Chỉ Admin mới có quyền cài đặt Discord Webhook.");
        return;
      }

      const logoInput = document.getElementById("discordLogoUrl");
      const enableMaster = document.getElementById("discordEnableMaster");
      const n10m = document.getElementById("discordNotify10m");
      const n5m = document.getElementById("discordNotify5m");
      const n1m = document.getElementById("discordNotify1m");
      const n0m = document.getElementById("discordNotify0m");
      const nKill = document.getElementById("discordNotifyKill");
      const tagEv = document.getElementById("discordTagEveryone");
      const nDaily = document.getElementById("discordNotifyDailySchedule");
      const webhookInput = document.getElementById("discordWebhookInput");

      // Validate và lưu webhook URL nếu có nhập
      const webhookUrl = webhookInput ? webhookInput.value.trim() : "";
      const webhookPattern = /^https:\/\/(?:discord|discordapp)\.com\/api\/webhooks\/\d+\/[A-Za-z0-9_-]+(?:\?.*)?$/;
      if (webhookUrl && !webhookPattern.test(webhookUrl)) {
        showToast("❌ Webhook URL không hợp lệ. Phải có dạng https://discord.com/api/webhooks/...");
        webhookInput?.focus();
        return;
      }

      // Lưu webhook URL lên Firebase (kể cả khi rỗng = xóa webhook)
      if (webhookUrl !== (webhookUrlCache[currentServerId] || "")) {
        const saved = await saveWebhookUrl(currentServerId, webhookUrl);
        if (!saved) {
          showToast("❌ Không thể lưu Webhook URL lên Firebase. Kiểm tra quyền Admin.");
          return;
        }
      }

      const newConfig = {
        enabled: enableMaster ? enableMaster.checked : false,
        logoUrl: logoInput ? logoInput.value.trim() : "",
        notify10m: n10m ? n10m.checked : true,
        notify5m: n5m ? n5m.checked : true,
        notify1m: n1m ? n1m.checked : true,
        notify0m: n0m ? n0m.checked : true,
        notifyKill: nKill ? nKill.checked : true,
        tagEveryone: tagEv ? tagEv.checked : true,
        notifyDailySchedule: nDaily ? nDaily.checked : true
      };

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
          throw new Error(lastDiscordError || "Không thể gửi lịch Discord. Vui lòng kiểm tra quyền Admin, API hoặc webhook.");
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

      const tagEv = document.getElementById("discordTagEveryone");
      const resEl = document.getElementById("discordTestResult");

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
        // Đây là thao tác gửi thủ công để kiểm tra kết nối, nên vẫn phải hoạt
        // động khi công tắc thông báo tự động đang tắt.
        const ok = await sendDiscordWebhook(testPayload, null, "image.png", currentServerId, true);
        if (ok) {
          if (resEl) {
            resEl.style.display = "block";
            resEl.style.background = "var(--green-soft)";
            resEl.style.color = "var(--green)";
            resEl.style.border = "1px solid var(--green)";
            resEl.textContent = "✅ Gửi tin nhắn Test thành công! Hãy kiểm tra kênh Discord của bạn.";
          }
          showToast("✅ Gửi tin nhắn Test Discord thành công!");
        } else {
          throw new Error(lastDiscordError || "API Discord chưa được cấu hình hoặc tài khoản không có quyền.");
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
            <div style="border:1px solid ${isActive ? "var(--cyan)" : "var(--line-soft)"}; border-radius:10px; margin-bottom:8px; background:${isActive ? "rgba(34, 211, 238, 0.05)" : "var(--surface-2)"}; overflow:hidden;">
              <div style="display:flex; align-items:center; gap:10px; padding:12px 14px 8px;">
                <span style="font-size:20px; flex-shrink:0;">${sv.icon || "⚔️"}</span>
                <div style="flex:1; min-width:0;">
                  <div style="font-weight:700; color:var(--text); font-size:14px; display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
                    <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${escapeHtml(sv.name)}</span>
                    ${isDefault ? '<span style="font-size:10px; padding:1px 5px; border-radius:3px; background:rgba(245, 158, 11, 0.15); color:var(--amber); font-weight:700; flex-shrink:0;">Mặc định</span>' : ""}
                    ${isActive ? '<span style="font-size:10px; padding:1px 6px; border-radius:3px; background:rgba(34, 211, 238, 0.15); color:var(--cyan); font-weight:700; flex-shrink:0;">● Đang chọn</span>' : ""}
                  </div>
                  <div style="font-size:11px; color:var(--muted); font-family:monospace; margin-top:2px;">?sv=${escapeHtml(sv.id)}</div>
                </div>
              </div>
              <div style="display:flex; align-items:center; gap:6px; padding:0 14px 12px; flex-wrap:wrap;">
                ${isAdmin() ? `
                  <button type="button" class="btn btn-secondary rename-sv-modal-btn" data-sv-id="${escapeHtml(sv.id)}" data-sv-name="${escapeHtml(sv.name)}" style="padding:5px 10px; font-size:12px; cursor:pointer; display:inline-flex; align-items:center; gap:4px;" title="Đổi tên máy chủ này">
                    ✏️ Đổi tên
                  </button>
                  <button type="button" class="btn discord-sv-btn" data-sv-id="${escapeHtml(sv.id)}" style="padding:5px 10px; font-size:12px; cursor:pointer; display:inline-flex; align-items:center; gap:4px; background:rgba(88,101,242,0.12); border:1px solid rgba(88,101,242,0.35); color:#7289da; border-radius:6px;" title="Cài đặt Discord Webhook cho ${escapeHtml(sv.name)}">
                    🔔 Discord
                  </button>
                ` : ""}
                ${!isActive
                  ? `<button type="button" class="btn btn-secondary switch-to-sv-btn" data-sv-id="${escapeHtml(sv.id)}" style="padding:5px 12px; font-size:12px; cursor:pointer;">Chuyển tới</button>`
                  : ""
                }
                ${!isDefault && isAdmin() ? `
                  <button type="button" class="btn delete-sv-btn" data-sv-id="${escapeHtml(sv.id)}" data-sv-name="${escapeHtml(sv.name)}" style="padding:5px 8px; font-size:12px; color:var(--red); background:rgba(239, 68, 68, 0.1); border:1px solid rgba(239, 68, 68, 0.2); border-radius:6px; cursor:pointer; margin-left:auto;" title="Xóa máy chủ này">
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

        // Nút 🔔 Discord: switch sang server đó rồi mở cài đặt Discord
        elements.modalServerList.querySelectorAll(".discord-sv-btn").forEach(btn => {
          btn.addEventListener("click", async () => {
            const svId = btn.dataset.svId;
            if (!svId) return;
            closeServerModal();
            if (svId !== currentServerId) {
              await switchServer(svId);
              await new Promise(r => setTimeout(r, 350));
            }
            openDiscordModal();
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
      closeBossActionConfirmation();
      bossSyncGeneration++;
      lastAppliedBossVersion = 0;
      remoteStateReady = false;
      remoteSaveInFlight = false;
      pendingRemoteSave = false;
      activeBossSaveWaiters.forEach(resolve => resolve(false));
      activeBossSaveWaiters.clear();
      pendingBossSaveWaiters = [];
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

      // Update the shared list inside one Firebase transaction so a concurrent
      // create/rename/delete from another Admin is preserved.
      if (firebaseDb) {
        try {
          const listRef = firebaseDb.ref("boss_timeline_servers_list");
          if (typeof listRef.transaction === "function") {
            const result = await listRef.transaction(current => {
              const parsedCurrent = normalizeServerList(current);
              const latest = parsedCurrent.length ? parsedCurrent : serverList.slice();
              let candidate = newId;
              let candidateNumber = nextNum;
              while (latest.some(item => item.id === candidate)) candidate = "s" + (++candidateNumber);
              newServerObj.id = candidate;
              if (latest.some(item => String(item.name || "").toLowerCase() === trimmed.toLowerCase())) return;
              return [...latest, { ...newServerObj }];
            });
            if (!result.committed) {
              showToast("❌ Không thể tạo Server vì tên vừa được Admin khác sử dụng.");
              return;
            }
            serverList = normalizeServerList(result.snapshot.val());
            if (!serverList.length) serverList = [...DEFAULT_SERVERS];
            newId = newServerObj.id;
          } else {
            serverList.push(newServerObj);
          }
        } catch (e) {
          console.warn(e);
          showToast("❌ Không thể đồng bộ danh sách Server.");
          return;
        }
      } else {
        serverList.push(newServerObj);
      }
      try { localStorage.setItem(STORAGE_SERVERS_KEY, JSON.stringify(serverList)); } catch (e) {}

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
            data: { _clientId: CLIENT_ID, bosses: newBosses, history: [], updated_at: new Date(getNow()).toISOString(), version: 1 },
            bosses_map: bMap,
            last_editor: CLIENT_ID,
            updated_at: new Date(getNow()).toISOString(),
            version: 1
          };
          await firebaseDb.ref(paths.statePath).set(seed);
        } catch (e) {
          console.warn("Firebase server initialization error:", e);
          try {
            const rollback = await firebaseDb.ref("boss_timeline_servers_list").transaction(current => {
              const latest = Array.isArray(current) ? current : [];
              return latest.filter(item => !(item?.id === newId && item?.name === newServerObj.name));
            });
            if (rollback.committed) serverList = rollback.snapshot.val() || [];
          } catch (rollbackError) {
            console.warn("Firebase server list rollback error:", rollbackError);
          }
          try {
            localStorage.removeItem(newStorageKey);
            localStorage.setItem(STORAGE_SERVERS_KEY, JSON.stringify(serverList));
          } catch (storageError) {}
          renderServerListUI();
          showToast("❌ Không thể khởi tạo dữ liệu Server. Server chưa được tạo hoàn tất.");
          return false;
        }
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

      if (firebaseDb) {
        try {
          const listRef = firebaseDb.ref("boss_timeline_servers_list");
          if (typeof listRef.transaction === "function") {
            const result = await listRef.transaction(current => {
              const parsedCurrent = normalizeServerList(current);
              const latest = parsedCurrent.length ? parsedCurrent : serverList.slice();
              if (latest.some(item => item.id !== serverId && String(item.name || "").toLowerCase() === trimmed.toLowerCase())) return;
              return latest.map(item => item.id === serverId ? { ...item, name: trimmed } : item);
            });
            if (!result.committed) {
              showToast("❌ Tên Server vừa được Admin khác sử dụng.");
              return false;
            }
            serverList = normalizeServerList(result.snapshot.val());
            if (!serverList.length) serverList = [...DEFAULT_SERVERS];
          } else {
            sv.name = trimmed;
          }
        } catch (e) {
          console.warn(e);
          showToast("❌ Không thể đồng bộ tên Server.");
          return false;
        }
      } else {
        sv.name = trimmed;
      }
      try { localStorage.setItem(STORAGE_SERVERS_KEY, JSON.stringify(serverList)); } catch (e) {}

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
      if (firebaseDb) {
        try {
          const listRef = firebaseDb.ref("boss_timeline_servers_list");
          if (typeof listRef.transaction === "function") {
            const result = await listRef.transaction(current => {
              const currentList = normalizeServerList(current);
              return (currentList.length ? currentList : serverList).filter(item => item.id !== serverId);
            });
            if (!result.committed) return false;
            serverList = normalizeServerList(result.snapshot.val());
            if (!serverList.length) serverList = [...DEFAULT_SERVERS];
          } else {
            serverList = serverList.filter(s => s.id !== serverId);
          }
        } catch (e) {
          console.warn(e);
          showToast("❌ Không thể đồng bộ việc xóa Server.");
          return false;
        }
      } else {
        serverList = serverList.filter(s => s.id !== serverId);
      }
      try { localStorage.setItem(STORAGE_SERVERS_KEY, JSON.stringify(serverList)); } catch (e) {}

      if (currentServerId === serverId) {
        await switchServer("s1");
      } else {
        renderServerListUI();
      }
      showToast("🗑️ Đã xóa máy chủ thành công.");
    }

    function normalizeServerList(val) {
      if (!val) return [];
      if (Array.isArray(val)) return val.filter(item => item && item.id);
      if (typeof val === "object") {
        if (Array.isArray(val.items)) return val.items.filter(item => item && item.id);
        if (val.items && typeof val.items === "object") return Object.values(val.items).filter(item => item && item.id);
        return Object.values(val).filter(item => item && typeof item === "object" && item.id);
      }
      return [];
    }

    function initServerListSync() {
      if (!REALTIME_ENABLED || !firebaseDb) return;
      try {
        firebaseDb.ref("boss_timeline_servers_list").on("value", (snap) => {
          const remoteRaw = snap.val();
          const validList = normalizeServerList(remoteRaw);
          if (validList.length > 0) {
            if (JSON.stringify(serverList) !== JSON.stringify(validList)) {
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
    let attendanceColumnFilters = {};
    let attendanceColumnSort = null;
    let attendanceOcrReview = null;
    let attendanceOcrSession = 0;
    let attendanceOcrLoaderPromise = null;
    let attendanceOcrFiles = [];
    let attendanceOcrPreviewUrls = [];
    let attendanceOcrAnalysisQueue = Promise.resolve();
    let attendanceCpImageReview = null;
    let attendanceCpOcrSession = 0;
    let closeAttendanceColumnFilter = () => {};
    const attendanceFilterColumns = [
      ["name", "Thành viên", "text"], ["combatPower", "Lực chiến", "number"],
      ["multiplier", "Hệ số", "number"], ["bonusPercent", "Thưởng vị trí (%)", "number"],
      ["usdt", "USDT", "number"], ["dias", "DIAS", "number"],
      ["pPoints", "P.Point thực tế", "number"], ["rawPoints", "Điểm thô", "number"],
      ["percent", "% tham gia", "number"], ["eligiblePPoints", "Reward P.Point", "number"],
      ["eligible", "Điều kiện thưởng", "boolean"]
    ];

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
    let attendanceSyncGeneration = 0;

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
      const base = localBase ? cloneRealtimeValue(localBase) : local;
      const merged = isAdmin() ? mergeRealtimeChanges(base, local, remote) : cloneRealtimeValue(remote);
      attendanceSyncBase = cloneRealtimeValue(remote);
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

    const DEFAULT_ROLE_BONUSES = [
      { role: "Bang Chủ", percent: 4 },
      { role: "Chủ Bang", percent: 4 },
      { role: "Phó Bang", percent: 3 },
      { role: "Thư Ký", percent: 3 },
      { role: "Call Boss", percent: 2 },
      { role: "Core DPS", percent: 2 },
      { role: "Tanker", percent: 1.5 }
    ];

    const DEFAULT_CP_TIERS = [
      { upToRank: 5, multiplier: 2.0, label: "Top 1 - 5" },
      { upToRank: 10, multiplier: 1.5, label: "Top 6 - 10" },
      { upToRank: null, multiplier: 1.0, label: "Còn lại" }
    ];

    const DEFAULT_MANAGEMENT_ROLE_MULTIPLIERS = [
      { role: "Chủ Guild, Bang Chủ, Chủ Bang", multiplier: 2.5 },
      { role: "Thư Ký", multiplier: 2.0 },
      { role: "Call Boss", multiplier: 1.5 },
      { role: "Note Boss", multiplier: 1.5 }
    ];

    function parseCombatPowerInput(input) {
      if (input === null || input === undefined) return 0;
      let str = String(input).trim().toUpperCase();
      if (!str) return 0;
      str = str.replace(/[, ]/g, "");
      if (str.endsWith("M") || str.endsWith("TR")) {
        const val = parseFloat(str.replace(/M|TR/g, ""));
        return isNaN(val) ? 0 : Math.max(0, Math.round(val * 1000000));
      }
      if (str.endsWith("K")) {
        const val = parseFloat(str.replace(/K/g, ""));
        return isNaN(val) ? 0 : Math.max(0, Math.round(val * 1000));
      }
      const val = parseFloat(str);
      return isNaN(val) ? 0 : Math.max(0, Math.round(val));
    }

    function formatCombatPowerDisplay(cp) {
      const num = Number(cp) || 0;
      if (num <= 0) return `<span class="val-cp-empty">—</span>`;
      if (num >= 1000000) {
        const m = (num / 1000000).toFixed(2).replace(/\.?0+$/, "") + "M";
        return `<span class="val-cp" title="${num.toLocaleString('vi-VN')} CP">${m}</span>`;
      }
      if (num >= 1000) {
        const k = (num / 1000).toFixed(1).replace(/\.?0+$/, "") + "k";
        return `<span class="val-cp" title="${num.toLocaleString('vi-VN')} CP">${k}</span>`;
      }
      return `<span class="val-cp" title="${num.toLocaleString('vi-VN')} CP">${num.toLocaleString('vi-VN')}</span>`;
    }

    function formatCombatPowerInput(cp) {
      const num = Number(cp) || 0;
      if (num <= 0) return "";
      if (num >= 1000000 && num % 10000 === 0) {
        return (num / 1000000).toFixed(2).replace(/\.?0+$/, "") + "M";
      }
      return String(num);
    }

    function getManagementRoleMultiplier(member, roleMultipliers) {
      const memberRole = normalizeRoleText(member?.role);
      if (!memberRole) return null;
      let best = null;
      (Array.isArray(roleMultipliers) ? roleMultipliers : []).forEach(item => {
        const multiplier = Number(item?.multiplier);
        if (!Number.isFinite(multiplier) || multiplier <= 0) return;
        const aliases = String(item?.role || "").split(/[,/;|]+/).map(normalizeRoleText).filter(Boolean);
        if (!aliases.some(alias => memberRole === alias || memberRole.includes(alias) || alias.includes(memberRole))) return;
        if (!best || multiplier > best.multiplier) best = { role: String(item.role || "").trim(), multiplier };
      });
      return best;
    }

    function applyCombatPowerTiersToWeek(week, scope, tiers, roleMultipliers = week?.managementRoleMultipliers) {
      if (!week || !Array.isArray(week.members) || week.members.length === 0) return;
      const normalizedTiers = Array.isArray(tiers) && tiers.length > 0 ? tiers : DEFAULT_CP_TIERS;
      const normalizedRoleMultipliers = Array.isArray(roleMultipliers) && roleMultipliers.length > 0
        ? roleMultipliers
        : DEFAULT_MANAGEMENT_ROLE_MULTIPLIERS;

      const applyMemberMultiplier = (member, tier) => {
        const cpMultiplier = tier && typeof tier.multiplier === "number" ? tier.multiplier : 1;
        const management = getManagementRoleMultiplier(member, normalizedRoleMultipliers);
        member.cpRankMultiplier = cpMultiplier;
        if (management) {
          member.managementRoleMultiplier = management.multiplier;
          member.managementRoleMatched = management.role;
        } else {
          delete member.managementRoleMultiplier;
          delete member.managementRoleMatched;
        }
        member.multiplier = Math.max(cpMultiplier, management?.multiplier || 1);
      };

      if (scope === "server") {
        const byServer = new Map();
        week.members.forEach(m => {
          const sId = getMemberServerId(m);
          if (!byServer.has(sId)) byServer.set(sId, []);
          byServer.get(sId).push(m);
        });
        byServer.forEach(mList => {
          mList.sort((a, b) => ((Number(b.combatPower) || 0) - (Number(a.combatPower) || 0)) || (a.name || "").localeCompare(b.name || ""));
          mList.forEach((m, idx) => {
            const rank = idx + 1;
            const tier = normalizedTiers.find(t => t.upToRank === null || rank <= t.upToRank);
            applyMemberMultiplier(m, tier);
          });
        });
        week.members.sort((a, b) => {
          const sComp = getMemberServerId(a).localeCompare(getMemberServerId(b));
          if (sComp !== 0) return sComp;
          return ((Number(b.combatPower) || 0) - (Number(a.combatPower) || 0)) || (a.name || "").localeCompare(b.name || "");
        });
      } else {
        week.members.sort((a, b) => ((Number(b.combatPower) || 0) - (Number(a.combatPower) || 0)) || (a.name || "").localeCompare(b.name || ""));
        week.members.forEach((m, idx) => {
          const rank = idx + 1;
          const tier = normalizedTiers.find(t => t.upToRank === null || rank <= t.upToRank);
          applyMemberMultiplier(m, tier);
        });
      }
      week.cpTiers = JSON.parse(JSON.stringify(normalizedTiers));
      week.cpScope = scope;
      week.managementRoleMultipliers = JSON.parse(JSON.stringify(normalizedRoleMultipliers));
    }

    function normalizeRoleText(role) {
      if (!role || typeof role !== "string") return "";
      return role.replace(/^[^\p{L}\p{N}]+/u, "").trim().toLowerCase();
    }

    function getMemberRoleBonusPercent(member, week) {
      if (!member) return 0;
      if (member.roleBonusPercent !== undefined && member.roleBonusPercent !== null && member.roleBonusPercent !== "") {
        const num = Number(member.roleBonusPercent);
        if (!isNaN(num)) return Math.max(0, Math.min(100, num));
      }
      const roleText = normalizeRoleText(member.role);
      if (!roleText) return 0;

      const roleBonuses = (week && Array.isArray(week.roleBonuses) && week.roleBonuses.length > 0)
        ? week.roleBonuses
        : (attendanceState?.roleBonuses && Array.isArray(attendanceState.roleBonuses) && attendanceState.roleBonuses.length > 0
          ? attendanceState.roleBonuses
          : DEFAULT_ROLE_BONUSES);

      for (const item of roleBonuses) {
        if (!item || !item.role) continue;
        const target = normalizeRoleText(item.role);
        if (target && (roleText === target || roleText.includes(target) || target.includes(roleText))) {
          return Math.max(0, Math.min(100, Number(item.percent) || 0));
        }
      }
      return 0;
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

      const res = {
        ...source,
        id: finalId,
        name: String(source.name || "Thành viên").trim() || "Thành viên",
        serverId,
        multiplier: parseFloat(source.multiplier) || 1,
        combatPower: parseCombatPowerInput(source.combatPower),
        role: source.role || "Member",
        color: source.color || "",
        roleColor: source.roleColor || "",
        records: source.records && typeof source.records === "object" ? { ...source.records } : {}
      };

      if (source.roleBonusPercent !== undefined && source.roleBonusPercent !== null && source.roleBonusPercent !== "") {
        const p = Number(source.roleBonusPercent);
        if (!isNaN(p)) res.roleBonusPercent = Math.max(0, Math.min(100, p));
      }

      return res;
    }

    function normalizeMinimumParticipationPercent(value) {
      return Math.min(100, Math.max(0, Number(value) || 0));
    }

    function normalizeAttendanceState(parsed, fallbackServerId) {
      let stateObj = parsed && typeof parsed === "object" ? cloneRealtimeValue(parsed) : cloneDefaultAttendanceState();
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
        if (Array.isArray(w.cpTiers) && w.cpTiers.length > 0) {
          w.cpTiers = JSON.parse(JSON.stringify(w.cpTiers));
        } else {
          w.cpTiers = JSON.parse(JSON.stringify(DEFAULT_CP_TIERS));
        }
        w.managementRoleMultipliers = Array.isArray(w.managementRoleMultipliers) && w.managementRoleMultipliers.length > 0
          ? JSON.parse(JSON.stringify(w.managementRoleMultipliers))
          : JSON.parse(JSON.stringify(DEFAULT_MANAGEMENT_ROLE_MULTIPLIERS));
        w.cpScope = w.cpScope === "guild" ? "guild" : "server";

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

    function getSuggestedWeekRange(offsetWeeks = 0, referenceDate = new Date()) {
      const daysUntilSaturday = (6 - referenceDate.getDay() + 7) % 7;
      const saturday = new Date(referenceDate);
      saturday.setDate(referenceDate.getDate() + daysUntilSaturday + (offsetWeeks * 7));
      const friday = new Date(saturday);
      friday.setDate(saturday.getDate() + 6);
      
      const pad = n => String(n).padStart(2, '0');
      const d1 = `${pad(saturday.getDate())}/${pad(saturday.getMonth() + 1)}`;
      const d2 = `${pad(friday.getDate())}/${pad(friday.getMonth() + 1)}/${friday.getFullYear()}`;
      return `${d1} - ${d2}`;
    }

    function getActiveWeek() {
      if (!attendanceState) attendanceState = loadAttendanceState();
      if (!attendanceSyncBase) {
        try { attendanceSyncBase = JSON.parse(localStorage.getItem(STORAGE_ATTENDANCE_SYNC_BASE_KEY)); } catch (e) {}
        if (!attendanceSyncBase) attendanceSyncBase = cloneRealtimeValue(getAttendanceSyncData(attendanceState));
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
      const cloneSourceInput = document.getElementById("attWeekCloneSourceId");
      const cloneSourceLabel = document.getElementById("attWeekCloneSourceLabel");
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
        if (cloneSourceInput) cloneSourceInput.value = "";
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
        if (cloneSourceInput) cloneSourceInput.value = currWeek?.id || "";
        if (cloneSourceLabel) cloneSourceLabel.textContent = `Nguồn sao chép: ${currWeek?.name || "Tuần đang mở"}${currWeek?.dateRange ? ` (${currWeek.dateRange})` : ""}`;
        if (nameInput) nameInput.value = "Tuần " + nextNum;
        if (dateInput) dateInput.value = getSuggestedWeekRange(0);
        if (diasInput) diasInput.value = currWeek?.diasPool ?? 52500;
        if (usdtInput) usdtInput.value = currWeek?.usdtPool ?? 867;
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
      const cloneSourceInput = document.getElementById("attWeekCloneSourceId");
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
        const cloneSourceId = (cloneSourceInput?.value || "").trim();
        const currWeek = (attendanceState.weeks || []).find(week => week.id === cloneSourceId) || getActiveWeek();
        const newWeekId = "week_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);

        let copiedActivities = [];
        let copiedMembers = [];

        const shouldClearBosses = clearBossesOpt ? clearBossesOpt.checked : true;
        if (currWeek && !shouldClearBosses) {
          copiedActivities = cloneRealtimeValue(currWeek.activities || []).map(activity => {
            const copy = { ...activity };
            delete copy.attendanceImage;
            delete copy.attendanceImages;
            delete copy.attendanceReview;
            return copy;
          });
        }
        if (currWeek) {
          copiedMembers = (currWeek.members || []).map(m => ({
            ...cloneRealtimeValue(m),
            serverId: m.serverId || getDefaultAttendanceServerId(),
            records: {} // New week starts with no attendance checks.
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
          roleBonuses: cloneRealtimeValue(currWeek?.roleBonuses ?? attendanceState.roleBonuses ?? DEFAULT_ROLE_BONUSES),
          cpTiers: cloneRealtimeValue(currWeek?.cpTiers ?? DEFAULT_CP_TIERS),
          managementRoleMultipliers: cloneRealtimeValue(currWeek?.managementRoleMultipliers ?? DEFAULT_MANAGEMENT_ROLE_MULTIPLIERS),
          cpScope: currWeek?.cpScope || "server",
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
      if (!confirmed || !isAdmin()) return;

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
          <span>Thêm Tuần Mới</span>
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
        const globalSnapshot = await firebaseDb.ref("boss_timeline_state/attendance_global").once("value");
        if (globalSnapshot.exists()) {
          return normalizeAttendanceState(cloneRealtimeValue(globalSnapshot.val()), getDefaultAttendanceServerId());
        }
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
      const generation = attendanceSyncGeneration;
      const fallbackServerId = getDefaultAttendanceServerId();
      attendanceRemoteSaveInFlight = true;
      attendancePendingRemoteSave = false;
      attendanceDeferredRemoteData = null;
      let saved = false;
      try {
        const result = await saveRef.transaction(current => {
          if (seedOnly && current) return;
          const remote = current ? getAttendanceSyncData(normalizeAttendanceState(cloneRealtimeValue(current), fallbackServerId)) : null;
          const merged = remote ? mergeRealtimeChanges(base, local, remote) : cloneRealtimeValue(local);
          return normalizeAttendanceState({
            ...merged,
            updatedAt: Date.now(),
            updatedBy: CLIENT_ID,
            version: (Number(current?.version) || 0) + 1
          }, fallbackServerId);
        }, undefined, false);
        if (generation !== attendanceSyncGeneration || !isAdmin()) return;
        const confirmed = result.snapshot.val();
        if (confirmed) {
          applyAttendanceRemoteData(confirmed, result.committed ? local : (seedBase || local));
          if (attendanceDeferredRemoteData && Number(attendanceDeferredRemoteData.version) > Number(confirmed.version)) {
            applyAttendanceRemoteData(attendanceDeferredRemoteData);
          }
        }
        saved = true;
      } catch (err) {
        if (generation === attendanceSyncGeneration && isAdmin()) handleAttendanceSyncError(err);
      } finally {


        if (generation === attendanceSyncGeneration) {
          attendanceRemoteSaveInFlight = false;
          attendanceDeferredRemoteData = null;
          const savePending = attendancePendingRemoteSave;
          attendancePendingRemoteSave = !saved || savePending;
          if (saved && (savePending || JSON.stringify(attendanceSyncBase) !== JSON.stringify(getAttendanceSyncData(attendanceState)))) {
            pushAttendanceToFirebase();
          }
        }
      }
    }

    function initAttendanceRealtimeSync() {
      if (!attendanceDbRef) return;
      if (activeAttendanceRef === attendanceDbRef) return;
      try {
        if (activeAttendanceRef) activeAttendanceRef.off();
      } catch (e) {}
      attendanceSyncGeneration++;
      attendanceRemoteStateReady = false;
      attendanceRemoteSaveInFlight = false;
      attendanceRemotePermissionDenied = false;
      attendanceDeferredRemoteData = null;
      attendanceFirebaseSeedAttempted = false;
      attendanceRemoteDataExists = false;
      activeAttendanceRef = null;
      activeAttendanceRef = attendanceDbRef;
      const subscribedRef = attendanceDbRef;
      const generation = attendanceSyncGeneration;

      subscribedRef.on("value", (snapshot) => {
        if (generation !== attendanceSyncGeneration || subscribedRef !== activeAttendanceRef || attendanceRemotePermissionDenied) return;
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
              if (generation !== attendanceSyncGeneration || !isAdmin() || attendanceRemotePermissionDenied) return;
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
            }).catch(err => {
              if (generation === attendanceSyncGeneration && isAdmin()) handleAttendanceSyncError(err);
            });
          }
          return;
        }

        applyAttendanceRemoteData(remoteData);
        if (isAdmin()) pushAttendanceToFirebase();
      }, err => {
        if (generation === attendanceSyncGeneration) handleAttendanceSyncError(err);
      });
    }

    function formatPoints(val) {
      if (val == null || isNaN(val)) return "0";
      const num = Number(val);
      return Number.isInteger(num) ? String(num) : Number(num.toFixed(2)).toString();
    }

    function formatParticipationPercent(value) {
      if (value == null || isNaN(value)) return "0";
      const num = Number(value);
      return Number.isInteger(num) ? String(num) : Number(num.toFixed(1)).toString();
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

    function setAttendanceServerFilter(newVal) {
      attendanceServerFilter = newVal || "all";
      const mainFilter = document.getElementById("attFilterServer");
      if (mainFilter && mainFilter.value !== attendanceServerFilter) {
        mainFilter.value = attendanceServerFilter;
      }
      const headFilter = document.getElementById("attHeaderServerSelect");
      if (headFilter && headFilter.value !== attendanceServerFilter) {
        headFilter.value = attendanceServerFilter;
      }
      renderAttendanceTable();
    }

    function renderAttendanceServerFilterOptions() {
      const filter = document.getElementById("attFilterServer");
      const previousValue = attendanceServerFilter || "all";
      const options = [`<option value="all">Tất cả Server</option>`]
        .concat(serverList.map(s => `<option value="${escapeHtml(s.id)}">${escapeHtml(s.name || s.id)}</option>`));
      if (filter) {
        filter.innerHTML = options.join("");
        attendanceServerFilter = previousValue === "all" || serverList.some(s => s.id === previousValue)
          ? previousValue
          : "all";
        filter.value = attendanceServerFilter;
      }
      const headFilter = document.getElementById("attHeaderServerSelect");
      if (headFilter) {
        const headOptions = [`<option value="all">Tất cả Server</option>`]
          .concat(serverList.map(s => `<option value="${escapeHtml(s.id)}">${escapeHtml(s.name || s.id)}</option>`));
        headFilter.innerHTML = headOptions.join("");
        headFilter.value = attendanceServerFilter;
      }
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

        const bonusPercent = getMemberRoleBonusPercent(m, week);
        const roleBonusDias = diasPool > 0 && bonusPercent > 0 ? Math.round(diasPool * (bonusPercent / 100)) : 0;
        const roleBonusUsdtCents = usdtPool > 0 && bonusPercent > 0 ? Math.round(Math.round(usdtPool * 100) * (bonusPercent / 100)) : 0;
        const roleBonusUsdt = roleBonusUsdtCents / 100;

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
          bonusPercent,
          roleBonusDias,
          roleBonusUsdt,
          attendanceDias: 0,
          attendanceUsdt: 0,
          dias: roleBonusDias,
          usdt: roleBonusUsdt
        };
      });

      let totalRoleBonusDias = 0;
      let totalRoleBonusUsdtCents = 0;
      membersCalc.forEach(m => {
        totalRoleBonusDias += m.roleBonusDias;
        totalRoleBonusUsdtCents += Math.round(m.roleBonusUsdt * 100);
      });

      const remainingDiasPool = Math.max(0, diasPool - totalRoleBonusDias);
      const remainingUsdtCents = Math.max(0, Math.round(usdtPool * 100) - totalRoleBonusUsdtCents);

      const diasRate = totalEligiblePPoints > 0 ? (remainingDiasPool / totalEligiblePPoints) : 0;
      const usdtRate = totalEligiblePPoints > 0 ? (remainingUsdtCents / 100 / totalEligiblePPoints) : 0;

      // Final rewards using Largest Remainder Method (Hamilton method) on remaining pool
      if (totalEligiblePPoints > 0 && (remainingDiasPool > 0 || remainingUsdtCents > 0)) {
        const rewardedMembers = membersCalc.filter(m => m.eligible && m.eligiblePPoints > 0);
        const rawPtsList = rewardedMembers.map(m => m.eligiblePPoints);
        const diasAlloc = allocateLargestRemainder(rawPtsList, remainingDiasPool);
        const usdtCentsAlloc = allocateLargestRemainder(rawPtsList, remainingUsdtCents);

        rewardedMembers.forEach((m, idx) => {
          m.attendanceDias = diasAlloc[idx] || 0;
          m.attendanceUsdt = (usdtCentsAlloc[idx] || 0) / 100;
          m.dias = m.roleBonusDias + m.attendanceDias;
          m.usdt = Number((m.roleBonusUsdt + m.attendanceUsdt).toFixed(2));
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
        totalRoleBonusDias,
        totalRoleBonusUsdt: totalRoleBonusUsdtCents / 100,
        diasRate,
        usdtRate,
        activitiesCount: activities.length,
        membersCount: members.length
      };
    }

    function getAttendanceScopeData(calc, serverId = "all") {
      const membersCalc = serverId === "all"
        ? calc.membersCalc
        : calc.membersCalc.filter(member => member.serverId === serverId);
      const totalGuildRawPoints = membersCalc.reduce((sum, member) => sum + member.rawPoints, 0);
      const totalGuildPPoints = membersCalc.reduce((sum, member) => sum + member.pPoints, 0);
      const totalEligiblePPoints = membersCalc.reduce((sum, member) => sum + member.eligiblePPoints, 0);
      const diasPool = membersCalc.reduce((sum, member) => sum + member.dias, 0);
      const usdtPool = membersCalc.reduce((sum, member) => sum + member.usdt, 0);

      return {
        ...calc,
        membersCalc,
        membersCount: membersCalc.length,
        totalGuildRawPoints,
        totalGuildPPoints,
        totalEligiblePPoints,
        eligibleMembersCount: membersCalc.filter(member => member.eligible).length,
        ineligibleMembersCount: membersCalc.filter(member => !member.eligible).length,
        diasPool,
        usdtPool,
        diasRate: totalEligiblePPoints > 0 ? diasPool / totalEligiblePPoints : 0,
        usdtRate: totalEligiblePPoints > 0 ? usdtPool / totalEligiblePPoints : 0
      };
    }

    function applyAttendanceColumnFilters(members) {
      const folded = value => String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase();
      const filtered = members.filter(member => Object.entries(attendanceColumnFilters).every(([key, filter]) => {
        if (filter.query && !folded(`${member.name} ${member.role || ""}`).includes(folded(filter.query))) return false;
        if (filter.value !== "" && filter.value !== undefined && String(member[key]) !== filter.value) return false;
        if (filter.min !== "" && filter.min !== undefined && Number(member[key] || 0) < Number(filter.min)) return false;
        if (filter.max !== "" && filter.max !== undefined && Number(member[key] || 0) > Number(filter.max)) return false;
        return true;
      }));
      if (attendanceColumnSort) {
        const { key, direction } = attendanceColumnSort;
        filtered.sort((a, b) => direction * (typeof a[key] === "string"
          ? String(a[key]).localeCompare(String(b[key]), "vi", { numeric: true })
          : Number(a[key] || 0) - Number(b[key] || 0)));
      }
      return filtered;
    }

    function openAttendanceColumnFilter(button, column) {
      closeAttendanceColumnFilter();
      const [key, label, type] = column;
      const current = attendanceColumnFilters[key] || {};
      const popup = document.createElement("form");
      popup.className = "att-column-filter-popup";
      popup.setAttribute("aria-label", `Lọc ${label}`);
      popup.innerHTML = `<strong>${escapeHtml(label)}</strong>
        ${type === "text" ? `<label>Tìm tên / vai trò<input name="query" placeholder="Nhập để tìm…" value="${escapeHtml(current.query || "")}"></label>` : type === "boolean" ? `<label>Điều kiện<select name="value"><option value="">Tất cả</option><option value="true">Đủ điều kiện</option><option value="false">Không đạt</option></select></label>` : `<label>Từ<input name="min" type="number" step="any" value="${escapeHtml(current.min ?? "")}"></label><label>Đến<input name="max" type="number" step="any" value="${escapeHtml(current.max ?? "")}"></label>`}
        <label>Sắp xếp<select name="sort"><option value="">Mặc định</option><option value="1">${type === "text" ? "Tên A → Z" : "Tăng dần"}</option><option value="-1">${type === "text" ? "Tên Z → A" : "Giảm dần"}</option></select></label>
        <div class="att-filter-buttons"><button type="button" data-clear>Bỏ lọc</button><button type="submit">Áp dụng</button></div>`;
      document.body.appendChild(popup);
      if (type === "boolean") popup.elements.value.value = current.value || "";
      popup.elements.sort.value = attendanceColumnSort?.key === key ? String(attendanceColumnSort.direction) : "";
      const rect = button.getBoundingClientRect();
      popup.style.left = `${Math.max(8, Math.min(rect.left, innerWidth - popup.offsetWidth - 8))}px`;
      popup.style.top = `${Math.max(8, Math.min(rect.bottom + 6, innerHeight - popup.offsetHeight - 8))}px`;
      const controller = new AbortController();
      closeAttendanceColumnFilter = () => { controller.abort(); popup.remove(); };
      document.addEventListener("pointerdown", e => { if (!popup.contains(e.target) && e.target !== button) closeAttendanceColumnFilter(); }, { signal: controller.signal });
      window.addEventListener("resize", closeAttendanceColumnFilter, { signal: controller.signal });
      document.addEventListener("scroll", e => { if (!popup.contains(e.target)) closeAttendanceColumnFilter(); }, { signal: controller.signal, capture: true });
      popup.addEventListener("keydown", e => { if (e.key === "Escape") { e.preventDefault(); closeAttendanceColumnFilter(); button.focus(); } });
      popup.onsubmit = e => {
        e.preventDefault();
        const values = Object.fromEntries(new FormData(popup));
        if (values.min !== "" && values.max !== "" && values.min !== undefined && Number(values.min) > Number(values.max)) {
          popup.elements.max.setCustomValidity("Giá trị đến phải lớn hơn hoặc bằng giá trị từ."); popup.elements.max.reportValidity(); return;
        }
        const sort = values.sort; delete values.sort;
        attendanceColumnFilters[key] = values;
        if (sort) attendanceColumnSort = { key, direction: Number(sort) };
        else if (attendanceColumnSort?.key === key) attendanceColumnSort = null;
        renderAttendanceTable();
      };
      popup.oninput = () => popup.elements.max?.setCustomValidity("");
      popup.querySelector("[data-clear]").onclick = () => {
        delete attendanceColumnFilters[key];
        if (attendanceColumnSort?.key === key) attendanceColumnSort = null;
        renderAttendanceTable();
      };
      popup.querySelector("input, select").focus();
    }

    function filterAttendanceMembers(members) {
      let filtered = members;
      if (attendanceSearchTerm.trim()) {
        const query = attendanceSearchTerm.trim().toLowerCase();
        filtered = filtered.filter(member => {
          const serverId = getMemberServerId(member);
          const haystack = [member.name, member.role, member.serverName || getServerNameById(serverId), serverId]
            .filter(Boolean).join(" ").toLowerCase();
          return haystack.includes(query);
        });
      }
      if (attendanceServerFilter !== "all") {
        filtered = filtered.filter(member => getMemberServerId(member) === attendanceServerFilter);
      }
      if (attendanceMultiplierFilter !== "all") {
        const targetMultiplier = Number(attendanceMultiplierFilter);
        filtered = filtered.filter(member => Math.abs((Number(member.multiplier) || 1) - targetMultiplier) < 0.05);
      }
      return applyAttendanceColumnFilters(filtered);
    }

    function renderAttendanceTable() {
      closeAttendanceMemberMenu();
      closeAttendanceColumnFilter();
      const content = document.getElementById("attendanceContent");
      const notice = document.getElementById("attendanceAccessNotice");
      if (content) content.hidden = false;
      if (notice) notice.hidden = isAdmin();
      if (!attendanceState) attendanceState = loadAttendanceState();

      renderWeekTabs();

      const currWeek = getActiveWeek();
      const guildCalc = calculateAttendanceData(attendanceState);
      renderAttendanceServerFilterOptions();
      const calc = getAttendanceScopeData(guildCalc, attendanceServerFilter);
      const scopeName = attendanceServerFilter === "all" ? "Toàn Guild" : getServerNameById(attendanceServerFilter);

      // 1. Update Top Stat Cards
      const diasInput = document.getElementById("attDiasPoolInput");
      if (diasInput && document.activeElement !== diasInput) {
        diasInput.value = guildCalc.diasPool;
        diasInput.readOnly = !isAdmin();
      }
      const diasRateEl = document.getElementById("attDiasRateText");
      if (diasRateEl) diasRateEl.textContent = calc.diasRate.toFixed(2);
      const diasAllocationEl = document.getElementById("attDiasAllocationText");
      if (diasAllocationEl) diasAllocationEl.textContent = `${scopeName}: ${calc.diasPool.toLocaleString("vi-VN")} DIAS được phân bổ`;

      const usdtInput = document.getElementById("attUsdtPoolInput");
      if (usdtInput && document.activeElement !== usdtInput) {
        usdtInput.value = guildCalc.usdtPool;
        usdtInput.readOnly = !isAdmin();
      }
      const usdtRateEl = document.getElementById("attUsdtRateText");
      if (usdtRateEl) usdtRateEl.textContent = calc.usdtRate.toFixed(4);
      const usdtAllocationEl = document.getElementById("attUsdtAllocationText");
      if (usdtAllocationEl) usdtAllocationEl.textContent = `${scopeName}: ${calc.usdtPool.toLocaleString("vi-VN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })} USDT được phân bổ`;

      const membersCountEl = document.getElementById("attTotalMembersCount");
      if (membersCountEl) membersCountEl.textContent = calc.membersCount;
      const membersLabel = document.getElementById("attMembersStatLabel");
      if (membersLabel) membersLabel.textContent = `👥 Thành Viên Tham Gia (${scopeName})`;

      const actCountEl = document.getElementById("attTotalActivitiesCount");
      if (actCountEl) actCountEl.textContent = calc.activitiesCount;

      const maxPtsEl = document.getElementById("attMaxPossiblePoints");
      if (maxPtsEl) maxPtsEl.textContent = calc.maxPossiblePoints;

      const guildPPointsEl = document.getElementById("attTotalGuildPPoints");
      if (guildPPointsEl) guildPPointsEl.textContent = formatPoints(calc.totalGuildPPoints);
      const pointsLabel = document.getElementById("attPointsStatLabel");
      if (pointsLabel) pointsLabel.textContent = `⭐ Tổng P.Point (${scopeName})`;

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
          : `Chấm công & lương • ${scopeName}`;
      }
      const subtitle = document.getElementById("attSubtitle");
      if (subtitle) {
        subtitle.textContent = attendanceServerFilter === "all"
          ? "Chấm công và xem lương tổng hợp của tất cả Server. Quỹ tuần được chia chung theo Reward P.Point."
          : `Chấm công và xem phần lương được phân bổ cho ${scopeName}. Quỹ DIAS và USDT vẫn dùng chung toàn Guild.`;
      }

      const serverSummaryEl = document.getElementById("attServerSummary");
      if (serverSummaryEl) {
        const summaryHtml = guildCalc.serverSummaries.map(item => `
          <button type="button" class="att-server-summary-pill${attendanceServerFilter === item.serverId ? " is-active" : ""}" data-server-scope="${escapeHtml(item.serverId)}" aria-pressed="${attendanceServerFilter === item.serverId}">
            <strong>${escapeHtml(item.serverName)}</strong>
            <span>${item.members} thành viên • ${formatPoints(item.pPoints)} P.Point • ${item.share.toFixed(2)}%</span>
          </button>
        `).join("");
        serverSummaryEl.innerHTML = summaryHtml + `
          <button type="button" class="att-server-summary-pill${attendanceServerFilter === "all" ? " is-active" : ""}" data-server-scope="all" aria-pressed="${attendanceServerFilter === "all"}">
            <strong>Tổng Các Guild</strong>
            <span>${guildCalc.membersCount} thành viên • ${formatPoints(guildCalc.totalGuildPPoints)} P.Point • 100%</span>
          </button>
        `;
      }

      // Update Role permissions on top cards
      const diasTag = document.getElementById("attDiasAdminTag");
      if (diasTag) diasTag.style.display = isAdmin() ? "inline-block" : "none";
      const usdtTag = document.getElementById("attUsdtAdminTag");
      if (usdtTag) usdtTag.style.display = isAdmin() ? "inline-block" : "none";

      // 2. Filter Members
      const filteredMembers = filterAttendanceMembers(calc.membersCalc);

      // 3. Render Table Header
      const headEl = document.getElementById("attTableHead");
      if (!headEl) return;

      const activities = currWeek.activities || [];
      const adminMode = isAdmin();

      let headHtml = `<tr>
        <th class="col-sticky col-stt">#</th>
        <th class="col-sticky col-name">Thành viên</th>
        <th class="col-sticky col-server" title="Lọc theo Server">
          <div class="att-header-server-wrap">
            <select class="att-header-server-select" id="attHeaderServerSelect" title="Chọn Server để lọc">
              <option value="all">Tất cả Server</option>
              ${serverList.map(s => `<option value="${escapeHtml(s.id)}"${attendanceServerFilter === s.id ? " selected" : ""}>${escapeHtml(s.name || s.id)}</option>`).join("")}
            </select>
          </div>
        </th>
        <th class="col-sticky col-cp" title="Lực chiến thành viên (dùng để xếp hạng phân bổ hệ số lương)">Lực chiến</th>
        <th class="col-sticky col-mult">Hệ số</th>
        <th class="col-sticky col-bonus" title="Tỷ lệ % trích thưởng chức danh / vị trí từ tổng quỹ">Thưởng vị trí</th>
        <th class="col-sticky col-usdt">USDT</th>
        <th class="col-sticky col-dias">DIAS</th>
        <th class="col-sticky col-ppoints">P.Point<br>thực tế</th>
        <th class="col-sticky col-raw">Điểm thô</th>
        <th class="col-sticky col-percent">% tham gia</th>
        <th class="col-reward-points">P.Point<br>nhận thưởng</th>
        <th class="col-eligibility">Điều kiện thưởng</th>`;

      activities.forEach((act) => {
        const allChecked = filteredMembers.length > 0 && filteredMembers.every(m => m.records && m.records[act.id]);
        headHtml += `<th class="col-act" data-act-id="${escapeHtml(act.id)}">
          <div class="act-card-header">
            <div class="act-card-row act-card-meta-row">
              <button type="button" class="att-btn-micro att-ocr-btn" data-act-id="${escapeHtml(act.id)}" title="${adminMode ? 'Chấm công / xem ảnh đội hình' : 'Xem ảnh và danh sách chấm công'}" aria-label="Mở ảnh chấm công"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 5.5 10 3.5h4l1.5 2H19a2 2 0 0 1 2 2v10A2 2 0 0 1 19 19H5a2 2 0 0 1-2-2v-9.5a2 2 0 0 1 2-2h3.5Z" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12.5" r="3.5" fill="none" stroke="currentColor" stroke-width="1.8"/></svg></button>
              <div class="act-header-date">${escapeHtml(act.date || "Tự do")}</div>
              <div class="act-period-badge ${act.timePeriod === "night" ? "is-night" : "is-day"}" title="${act.timePeriod === "night" ? "Ban đêm 00h–7h · X2 điểm" : "Ban ngày · điểm cơ bản"}" aria-label="${act.timePeriod === "night" ? "Ban đêm 00h–7h · X2 điểm" : "Ban ngày · điểm cơ bản"}">${act.timePeriod === "night" ? "🌙" : "☀️"}</div>
            </div>
            <div class="act-card-row act-card-name-row">
              <div class="act-header-name" title="${escapeHtml(act.name)}">${escapeHtml(act.name)}</div>
            </div>
            <div class="act-card-row act-card-points-row">
              <div class="act-header-points">⭐ ${act.points} Điểm</div>
            </div>
            <div class="act-card-row act-header-bottom">
              ${adminMode ? `
                <label class="act-check-all-label" title="Tích chọn tất cả thành viên đang hiển thị">
                  <input type="checkbox" class="att-check-all-box" data-act-id="${escapeHtml(act.id)}"${allChecked ? " checked" : ""}>
                  <span>Tất cả</span>
                </label>
                <div class="act-btn-row">
                  <button type="button" class="att-btn-micro att-edit-act-btn" data-act-id="${escapeHtml(act.id)}" title="Sửa tên / điểm">✏️</button>
                  <button type="button" class="att-btn-micro att-del-act-btn" data-act-id="${escapeHtml(act.id)}" title="Xóa cột này">🗑️</button>
                </div>
              ` : '<span class="act-readonly-label">Chỉ xem</span>'}
            </div>
          </div>
        </th>`;
      });

      headHtml += `</tr>`;
      headEl.innerHTML = headHtml;
      const filterHeaders = [1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
      attendanceFilterColumns.forEach((column, index) => {
        const th = headEl.querySelectorAll("th")[filterHeaders[index]];
        const button = document.createElement("button");
        const values = attendanceColumnFilters[column[0]] || {};
        const active = Object.values(values).some(value => value !== "") || attendanceColumnSort?.key === column[0];
        button.type = "button";
        button.className = `att-column-filter-btn${active ? " is-active" : ""}`;
        button.textContent = "▾";
        button.title = `Lọc / sắp xếp ${column[1]}`;
        button.setAttribute("aria-label", button.title);
        button.setAttribute("aria-haspopup", "dialog");
        button.onclick = () => openAttendanceColumnFilter(button, column);
        const layout = document.createElement("div");
        layout.className = "att-filter-heading";
        const label = document.createElement("div");
        label.className = "att-filter-heading-label";
        while (th.firstChild) label.appendChild(th.firstChild);
        layout.append(label, button);
        th.appendChild(layout);
      });
      const serverHeader = headEl.querySelector(".col-server");
      const serverControl = serverHeader.querySelector(".att-header-server-wrap");
      const serverLayout = document.createElement("div");
      serverLayout.className = "att-filter-heading";
      const serverLabel = document.createElement("div");
      serverLabel.className = "att-filter-heading-label";
      serverLabel.textContent = "Server";
      serverLayout.append(serverLabel, serverControl);
      serverHeader.appendChild(serverLayout);

      // 4. Render Table Body
      const bodyEl = document.getElementById("attTableBody");
      if (!bodyEl) return;

      if (filteredMembers.length === 0) {
        const colSpanTotal = 13 + activities.length;
        bodyEl.innerHTML = `<tr><td colspan="${colSpanTotal}" style="text-align:center; padding:30px; color:var(--muted);">
          Không tìm thấy thành viên nào phù hợp.
        </td></tr>`;
        return;
      }

      let bodyHtml = "";
      filteredMembers.forEach((m, idx) => {
        const badgeClass = m.eligible ? "att-badge-high" : "att-badge-low";
        const bonusPct = m.bonusPercent || 0;

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
          <td class="col-sticky col-cp">
            ${formatCombatPowerDisplay(m.combatPower)}
          </td>
          <td class="col-sticky col-mult">
            <span class="att-mult-tag">x${m.multiplier}</span>
          </td>
          <td class="col-sticky col-bonus">
            <span class="att-bonus-badge${bonusPct > 0 ? '' : ' zero'}" title="${bonusPct > 0 ? `Thưởng vị trí: +${bonusPct}% quỹ (${(m.roleBonusDias || 0).toLocaleString('vi-VN')} DIAS / ${(m.roleBonusUsdt || 0).toFixed(2)} USDT)` : 'Không có thưởng vị trí'}">
              ${bonusPct > 0 ? `+${bonusPct}%` : '—'}
            </span>
          </td>
          <td class="col-sticky col-usdt">
            <span class="val-usdt" title="${bonusPct > 0 ? `Điểm danh: ${(m.attendanceUsdt || 0).toFixed(2)} + Thưởng VT: ${(m.roleBonusUsdt || 0).toFixed(2)}` : ''}">${m.usdt.toLocaleString("vi-VN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</span>
          </td>
          <td class="col-sticky col-dias">
            <span class="val-dias" title="${bonusPct > 0 ? `Điểm danh: ${(m.attendanceDias || 0).toLocaleString('vi-VN')} + Thưởng VT: ${(m.roleBonusDias || 0).toLocaleString('vi-VN')}` : ''}">${m.dias.toLocaleString("vi-VN")}</span>
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
            <span title="${m.eligible ? "Đủ điều kiện" : "Không đạt"}" aria-label="${m.eligible ? "Đủ điều kiện" : "Không đạt"}" class="att-eligibility ${m.eligible ? "eligible" : "ineligible"}">${m.eligible ? "✓" : "✕"}</span>
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


        bodyHtml += `</tr>`;
      });

      bodyEl.innerHTML = bodyHtml;
      bindAttendanceTableEvents();
      applyAttendanceColumnVisibility();
    }

    function applyAttendanceColumnVisibility() {
      const columns = [['col-stt','#'],['col-name','Thành viên'],['col-server','Server'],['col-cp','Lực chiến'],['col-mult','Hệ số'],['col-bonus','Thưởng vị trí'],['col-usdt','USDT'],['col-dias','DIAS'],['col-ppoints','P.Point thực tế'],['col-raw','Điểm thô'],['col-percent','% tham gia'],['col-reward-points','P.Point nhận thưởng'],['col-eligibility','Điều kiện thưởng']];
      let hidden;
      try { hidden = JSON.parse(localStorage.getItem('attendanceHiddenColumns') || '[]'); } catch { hidden = []; }
      if (!Array.isArray(hidden)) hidden = [];
      let menu = document.getElementById('attColumnVisibility');
      if (!menu) {
        menu = document.createElement('details'); menu.id = 'attColumnVisibility';
        menu.innerHTML = '<summary><span class="att-column-icon">▦</span><span><strong>Tùy chỉnh cột</strong><small>Ẩn hoặc hiện thông tin trên bảng</small></span><span class="att-column-chevron">⌄</span></summary><div class="att-column-options"><div class="att-column-options-head"><strong>Cột đang hiển thị</strong><small>Thiết lập được ghi nhớ trên thiết bị này</small></div><div class="att-column-options-list"></div></div>';
        document.querySelector('.att-toolbar-left').append(menu);
        menu.querySelector('.att-column-options-list').innerHTML = columns.filter(([key]) => key !== 'col-name').map(([key,label]) => `<label><span>${label}</span><input type="checkbox" data-column="${key}"><i></i></label>`).join('') + '<button type="button" class="button-secondary">Khôi phục tất cả cột</button>';
        menu.onchange = () => {
          const next = [...menu.querySelectorAll('input:not(:checked)')].map(input => input.dataset.column);
          localStorage.setItem('attendanceHiddenColumns', JSON.stringify(next)); applyAttendanceColumnVisibility();
        };
        menu.querySelector('.att-column-options-list button').onclick = () => { localStorage.removeItem('attendanceHiddenColumns'); applyAttendanceColumnVisibility(); };
      }
      menu.querySelectorAll('input').forEach(input => { input.checked = !hidden.includes(input.dataset.column); });
      let left = 0;
      columns.forEach(([key]) => {
        const cells = document.querySelectorAll(`.att-table .${key}`);
        const invisible = key !== 'col-name' && hidden.includes(key);
        cells.forEach(cell => { cell.style.display = invisible ? 'none' : ''; if (cell.classList.contains('col-sticky')) cell.style.left = `${left}px`; });
        const header = document.querySelector(`.att-table th.${key}`);
        if (header && !invisible && header.classList.contains('col-sticky')) left += header.getBoundingClientRect().width;
      });
    }

    let closeAttendanceMemberMenu = () => {};

    function openAttendanceMemberMenu(memberId, x, y, row) {
      closeAttendanceMemberMenu();
      if (!isAdmin()) return;
      const week = getActiveWeek();
      const member = week?.members.find(item => item.id === memberId);
      if (!member) return;
      const menu = document.createElement("div");
      menu.className = "att-member-context-menu";
      menu.setAttribute("role", "menu");
      menu.setAttribute("aria-label", "Thao tác thành viên");
      menu.innerHTML = `<div class="att-context-name">${escapeHtml(member.name)}</div>
        <button type="button" role="menuitem" class="att-edit-member-btn">✏️ Chỉnh sửa thành viên</button>
        <button type="button" role="menuitem" class="att-del-member-btn">🗑️ Xóa thành viên</button>`;
      document.body.appendChild(menu);
      const rect = menu.getBoundingClientRect();
      menu.style.left = `${Math.max(8, Math.min(x, window.innerWidth - rect.width - 8))}px`;
      menu.style.top = `${Math.max(8, Math.min(y, window.innerHeight - rect.height - 8))}px`;
      const controller = new AbortController();
      const options = { signal: controller.signal };
      closeAttendanceMemberMenu = () => {
        controller.abort();
        menu.remove();
      };
      document.addEventListener("pointerdown", event => {
        if (!menu.contains(event.target)) closeAttendanceMemberMenu();
      }, options);
      window.addEventListener("resize", closeAttendanceMemberMenu, options);
      document.addEventListener("scroll", closeAttendanceMemberMenu, { ...options, capture: true });
      menu.addEventListener("keydown", event => {
        const buttons = [...menu.querySelectorAll("button")];
        if (event.key === "Escape" || event.key === "Tab") {
          closeAttendanceMemberMenu();
          if (event.key === "Escape") { event.preventDefault(); row.focus({ preventScroll: true }); }
        } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
          event.preventDefault();
          buttons[(buttons.indexOf(document.activeElement) + (event.key === "ArrowDown" ? 1 : -1) + buttons.length) % buttons.length].focus();
        }
      });
      menu.querySelector(".att-edit-member-btn").addEventListener("click", () => {
        closeAttendanceMemberMenu();
        if (isAdmin()) openAttendanceMemberModal(memberId);
      });
      menu.querySelector(".att-del-member-btn").addEventListener("click", async () => {
        closeAttendanceMemberMenu();
        if (!isAdmin()) return;
        const confirmed = await showConfirmModal({
          title: "Xóa thành viên?",
          subtitle: "Hành động này sẽ xóa thành viên khỏi bảng chấm công",
          message: `Bạn có chắc muốn xóa thành viên "${member.name}"? Dữ liệu điểm của thành viên này trong tuần sẽ bị mất.`,
          confirmText: "Xóa thành viên", cancelText: "Hủy bỏ", isDanger: true
        });
        if (confirmed && isAdmin()) deleteAttendanceMember(memberId, week.id);
      });
      menu.querySelector("button").focus({ preventScroll: true });
    }

    function bindAttendanceTableEvents() {
      const adminMode = isAdmin();

      // Header Server select
      const headServerSelect = document.getElementById("attHeaderServerSelect");
      if (headServerSelect) {
        headServerSelect.addEventListener("change", (e) => {
          setAttendanceServerFilter(e.target.value);
        });
      }

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

      // Every cell in a member row exposes the same member actions.
      document.querySelectorAll("#attTableBody tr[data-member-id]").forEach(row => {
        if (!adminMode) return;
        row.tabIndex = 0;
        row.title = "Bấm chuột phải để chỉnh sửa hoặc xóa thành viên";
        row.addEventListener("contextmenu", event => {
          event.preventDefault();
          openAttendanceMemberMenu(row.dataset.memberId, event.clientX, event.clientY, row);
        });
        row.addEventListener("keydown", event => {
          if (event.key === "ContextMenu" || (event.shiftKey && event.key === "F10")) {
            event.preventDefault();
            const rect = row.getBoundingClientRect();
            openAttendanceMemberMenu(row.dataset.memberId, Math.max(8, rect.left), Math.max(8, rect.top), row);
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

      document.querySelectorAll(".att-ocr-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          openAttendanceOcrModal(btn.dataset.actId);
        });
      });

      document.querySelectorAll(".att-evidence-thumb").forEach(btn => {
        btn.addEventListener("click", () => openAttendanceEvidenceModal(btn.dataset.actId));
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
            deleteAttendanceActivity(actId, currWeek.id);
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
      filterAttendanceMembers(currWeek.members).forEach(m => {
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

    function normalizeAttendanceOcrName(value) {
      return String(value || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/gi, "d")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");
    }

    function attendanceOcrSimilarity(left, right) {
      const a = normalizeAttendanceOcrName(left);
      const b = normalizeAttendanceOcrName(right);
      if (!a || !b) return 0;
      if (a === b) return 1;
      const row = Array.from({ length: b.length + 1 }, (_, index) => index);
      for (let i = 1; i <= a.length; i++) {
        let previous = row[0];
        row[0] = i;
        for (let j = 1; j <= b.length; j++) {
          const saved = row[j];
          row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (a[i - 1] === b[j - 1] ? 0 : 1));
          previous = saved;
        }
      }
      return 1 - row[b.length] / Math.max(a.length, b.length);
    }

    function collectAttendanceOcrWords(data) {
      const found = [];
      const seen = new Set();
      const visit = value => {
        if (!value || typeof value !== "object") return;
        const childKeys = ["blocks", "paragraphs", "lines", "words"];
        const hasTextChildren = childKeys.some(key => Array.isArray(value[key]) && value[key].length);
        if (!hasTextChildren && typeof value.text === "string" && value.bbox && Number.isFinite(value.bbox.x0) && Number.isFinite(value.bbox.y0)) {
          const key = `${value.text}|${value.bbox.x0}|${value.bbox.y0}|${value.bbox.x1}|${value.bbox.y1}`;
          if (!seen.has(key)) {
            seen.add(key);
            found.push({ text: value.text, bbox: value.bbox, confidence: Number(value.confidence ?? value.conf ?? 0) });
          }
        }
        childKeys.forEach(key => {
          if (Array.isArray(value[key])) value[key].forEach(visit);
        });
      };
      if (Array.isArray(data?.words)) data.words.forEach(visit);
      if (Array.isArray(data?.blocks)) data.blocks.forEach(visit);
      return found;
    }

    function getAttendanceOcrWordBrightness(context, bbox, canvasWidth, canvasHeight) {
      const x0 = Math.max(0, Math.floor(bbox.x0));
      const y0 = Math.max(0, Math.floor(bbox.y0));
      const x1 = Math.min(canvasWidth, Math.ceil(bbox.x1));
      const y1 = Math.min(canvasHeight, Math.ceil(bbox.y1));
      if (x1 <= x0 || y1 <= y0) return 0;
      const pixels = context.getImageData(x0, y0, x1 - x0, y1 - y0).data;
      const neutralLuminance = [];
      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const chroma = Math.max(r, g, b) - Math.min(r, g, b);
        if (chroma <= 58) neutralLuminance.push(0.2126 * r + 0.7152 * g + 0.0722 * b);
      }
      if (!neutralLuminance.length) return 0;
      neutralLuminance.sort((a, b) => a - b);
      const start = Math.floor(neutralLuminance.length * 0.95);
      const highlights = neutralLuminance.slice(start);
      return highlights.reduce((sum, value) => sum + value, 0) / Math.max(1, highlights.length);
    }

    function matchAttendanceOcrWord(rawText, members) {
      const token = normalizeAttendanceOcrName(rawText);
      if (token.length < 2) return null;
      const ranked = members.map(member => ({ member, score: attendanceOcrSimilarity(token, member.name) }))
        .sort((a, b) => b.score - a.score);
      // OCR often confuses narrow letters and digits in small game fonts.
      const visual = value => normalizeAttendanceOcrName(value).replace(/[il1]/g, "l").replace(/[o0]/g, "o");
      ranked.forEach(item => {
        if (visual(token) === visual(item.member.name)) item.score = Math.max(item.score, 0.97);
      });
      ranked.sort((a, b) => b.score - a.score);
      const best = ranked[0];
      const secondScore = ranked[1]?.score || 0;
      const threshold = token.length <= 4 ? 0.86 : token.length <= 6 ? 0.78 : 0.72;
      if (!best || best.score < threshold || (best.score < 1 && best.score - secondScore < 0.08)) return null;
      return best;
    }

    function loadAttendanceOcrLibrary() {
      if (window.Tesseract) return Promise.resolve(window.Tesseract);
      if (attendanceOcrLoaderPromise) return attendanceOcrLoaderPromise;
      attendanceOcrLoaderPromise = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js";
        script.async = true;
        script.onload = () => window.Tesseract ? resolve(window.Tesseract) : reject(new Error("Không khởi tạo được bộ nhận diện chữ."));
        script.onerror = () => reject(new Error("Không tải được bộ nhận diện chữ. Hãy kiểm tra mạng và thử lại."));
        document.head.appendChild(script);
      }).catch(error => {
        attendanceOcrLoaderPromise = null;
        throw error;
      });
      return attendanceOcrLoaderPromise;
    }

    function loadAttendanceOcrImage(file) {
      return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const image = new Image();
        image.onload = () => { URL.revokeObjectURL(url); resolve(image); };
        image.onerror = () => { URL.revokeObjectURL(url); reject(new Error(`Không đọc được ảnh ${file.name}.`)); };
        image.src = url;
      });
    }

    async function prepareAttendanceOcrCanvas(file) {
      const image = await loadAttendanceOcrImage(file);
      const scale = Math.min(3, 3000 / Math.max(1, image.naturalWidth));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      const context = canvas.getContext("2d", { willReadFrequently: true });
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      return { canvas, context };
    }

    async function createAttendanceEvidenceImage(files) {
      const images = await Promise.all([...(files || [])].slice(0, 4).map(loadAttendanceOcrImage));
      if (!images.length) return "";
      let width = Math.min(900, Math.max(...images.map(image => image.naturalWidth || 1)));
      let heights = images.map(image => Math.round((image.naturalHeight || 1) * width / Math.max(1, image.naturalWidth)));
      const totalHeight = heights.reduce((sum, height) => sum + height, 0);
      if (totalHeight > 2800) {
        const scale = 2800 / totalHeight;
        width = Math.max(360, Math.round(width * scale));
        heights = images.map(image => Math.round((image.naturalHeight || 1) * width / Math.max(1, image.naturalWidth)));
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = heights.reduce((sum, height) => sum + height, 0);
      const context = canvas.getContext("2d");
      context.fillStyle = "#090b0f";
      context.fillRect(0, 0, canvas.width, canvas.height);
      let y = 0;
      images.forEach((image, index) => {
        context.drawImage(image, 0, y, width, heights[index]);
        y += heights[index];
      });
      const webp = canvas.toDataURL("image/webp", 0.62);
      return webp.startsWith("data:image/webp") ? webp : canvas.toDataURL("image/jpeg", 0.62);
    }

    function getAttendanceEvidenceImages(activity) {
      if (Array.isArray(activity?.attendanceImages)) return activity.attendanceImages.filter(item => getAttendanceEvidenceImage({ attendanceImage: item.src }));
      const src = getAttendanceEvidenceImage(activity);
      return src ? [{ id: 'legacy', name: 'Ảnh đã lưu', src }] : [];
    }

    function renderAttendanceOcrGallery() {
      let gallery = document.getElementById('attOcrGallery');
      if (!gallery) {
        gallery = document.createElement('div'); gallery.id = 'attOcrGallery';
        document.querySelector('.att-ocr-body').prepend(gallery);
      }
      const images = attendanceOcrReview?.images || [];
      gallery.innerHTML = images.map((item, index) => `<figure class="att-gallery-item"><img ${index === 0 ? 'id="attOcrSavedImage"' : ''} src="${escapeHtml(item.src)}" alt="Ảnh đội hình ${index + 1}"><figcaption>Ảnh ${index + 1} · ${escapeHtml(item.name)} ${isAdmin() ? `<button type="button" class="button-secondary" data-remove-image="${index}">Xóa ảnh</button>` : ''}</figcaption></figure>`).join('');
      gallery.querySelectorAll('[data-remove-image]').forEach(button => button.onclick = () => {
        if (!isAdmin()) return;
        const [removed] = attendanceOcrReview.images.splice(Number(button.dataset.removeImage), 1);
        attendanceOcrFiles = attendanceOcrFiles.filter(file => `${file.name}|${file.size}|${file.lastModified}` !== removed.id);
        attendanceOcrSession++;
        attendanceOcrReview.evidenceImage = attendanceOcrReview.images[0]?.src || '';
        renderAttendanceOcrGallery(); renderAttendanceOcrFilePreviews(); refreshAttendanceOcrApplyButton();
      });
      let retry = document.getElementById('attOcrRetry');
      if (!retry) {
        retry = document.createElement('button'); retry.id = 'attOcrRetry'; retry.type = 'button'; retry.className = 'button-secondary';
        retry.textContent = 'Nhận diện lại tất cả ảnh'; gallery.after(retry);
        retry.onclick = async () => {
          if (!isAdmin() || retry.disabled) return;
          const session = attendanceOcrSession;
          retry.disabled = true;
          try {
            const files = await Promise.all((attendanceOcrReview.images || []).map(async (item, index) => new File([await (await fetch(item.src)).blob()], `saved-${index}.webp`, { type: 'image/webp' })));
            if (session !== attendanceOcrSession) return;
            if (files.length) await analyzeAttendanceOcrFiles(files, true);
          } finally { retry.disabled = false; }
        };
      }
      retry.style.display = isAdmin() && images.length ? '' : 'none';
    }

    function renderAttendanceManualPicker() {
      let wrap = document.getElementById('attOcrManualPicker');
      if (!wrap) {
        wrap = document.createElement('section'); wrap.id = 'attOcrManualPicker';
        wrap.innerHTML = '<label>Thêm người tham gia (khi ảnh chưa nhận diện được)<input type="search" autocomplete="off" placeholder="Tìm tên thành viên"></label><div class="att-ocr-chip-list"></div>';
        document.getElementById('attOcrResults').after(wrap);
        wrap.querySelector('input').oninput = () => renderAttendanceManualPicker();
      }
      wrap.style.display = isAdmin() ? '' : 'none';
      const query = normalizeAttendanceOcrName(wrap.querySelector('input').value);
      const chosen = new Set((attendanceOcrReview?.matched || []).map(item => item.member.id));
      const week = attendanceState.weeks.find(item => item.id === attendanceOcrReview?.weekId) || getActiveWeek();
      const members = (week?.members || []).filter(member => !chosen.has(member.id) && normalizeAttendanceOcrName(member.name).includes(query));
      const list = wrap.querySelector('div');
      list.innerHTML = members.map(member => `<button type="button" class="att-ocr-chip" data-add-member="${escapeHtml(member.id)}">+ ${escapeHtml(member.name)}</button>`).join('') || '<span>Không có thành viên phù hợp</span>';
      list.querySelectorAll('button').forEach(button => button.onclick = () => {
        if (!isAdmin()) return;
        const member = week.members.find(item => item.id === button.dataset.addMember);
        if (!member) return;
        attendanceOcrReview.matched.push({ member, manualFaded: true });
        attendanceOcrReview.faded = attendanceOcrReview.faded.filter(item => item.member.id !== member.id);
        renderAttendanceOcrReview(); renderAttendanceManualPicker();
      });
    }

    function getAttendanceEvidenceImage(activity) {
      const value = String(activity?.attendanceImage || activity?.evidenceImage || "");
      return /^data:image\/(?:jpeg|png|webp);base64,[a-z0-9+/=]+$/i.test(value) ? value : "";
    }

    function setAttendanceOcrProgress(percent, text) {
      const wrap = document.getElementById("attOcrProgress");
      const bar = document.getElementById("attOcrProgressBar");
      const label = document.getElementById("attOcrProgressText");
      if (wrap) wrap.hidden = false;
      if (bar) bar.style.width = `${Math.max(0, Math.min(100, percent))}%`;
      if (label) label.textContent = text;
    }

    function renderAttendanceOcrReview() {
      const results = document.getElementById("attOcrResults");
      if (!results || !attendanceOcrReview) return;
      results.hidden = false;
      const renderChips = (targetId, items, className, selectable = false, checkedByDefault = false) => {
        const target = document.getElementById(targetId);
        if (!target) return;
        target.innerHTML = items.length ? items.map(item => selectable
          ? `<label class="att-ocr-chip ${className}"><input type="checkbox" data-ocr-member-id="${escapeHtml(item.member.id)}" data-ocr-source="${item.manualFaded || !checkedByDefault ? "faded" : "bright"}"${checkedByDefault ? " checked" : ""}${!isAdmin() ? " disabled" : ""}><span>${escapeHtml(item.member.name)}</span></label>`
          : `<span class="att-ocr-chip ${className}">${escapeHtml(item.member?.name || item.text)}</span>`).join("")
          : '<span class="att-ocr-empty">Không có</span>';
      };
      renderChips("attOcrMatchedList", attendanceOcrReview.matched, "", true, true);
      renderChips("attOcrFadedList", attendanceOcrReview.faded, "is-faded", true, false);
      renderChips("attOcrUnmatchedList", attendanceOcrReview.unmatched, "is-unmatched");
      document.getElementById("attOcrMatchedCount").textContent = attendanceOcrReview.matched.length;
      document.getElementById("attOcrFadedCount").textContent = attendanceOcrReview.faded.length;
      document.getElementById("attOcrUnmatchedCount").textContent = attendanceOcrReview.unmatched.length;
      document.querySelectorAll("[data-ocr-member-id]").forEach(input => input.addEventListener("change", () => {
        const id = input.dataset.ocrMemberId;
        const source = input.checked ? attendanceOcrReview.faded : attendanceOcrReview.matched;
        const target = input.checked ? attendanceOcrReview.matched : attendanceOcrReview.faded;
        const index = source.findIndex(item => item.member.id === id);
        if (index >= 0) {
          const [item] = source.splice(index, 1);
          if (input.checked) item.manualFaded = true;
          target.push(item);
        }
        renderAttendanceOcrReview();
        renderAttendanceManualPicker();
      }));
      refreshAttendanceOcrApplyButton();
    }

    function refreshAttendanceOcrApplyButton() {
      const button = document.getElementById("attOcrApplyBtn");

      if (button) button.disabled = !isAdmin();
    }

    function clearAttendanceOcrFilePreviews() {
      attendanceOcrPreviewUrls.forEach(url => URL.revokeObjectURL(url));
      attendanceOcrPreviewUrls = [];
      const preview = document.getElementById("attOcrPreview");
      const list = document.getElementById("attOcrPreviewList");
      const drop = document.querySelector(".att-ocr-drop");
      if (preview) preview.hidden = true;
      if (list) list.innerHTML = "";
      if (drop) drop.classList.remove("has-preview");
    }

    function renderAttendanceOcrFilePreviews() {
      clearAttendanceOcrFilePreviews();
      if (!attendanceOcrFiles.length) return;
      const preview = document.getElementById("attOcrPreview");
      const list = document.getElementById("attOcrPreviewList");
      const count = document.getElementById("attOcrPreviewCount");
      const drop = document.querySelector(".att-ocr-drop");
      if (!preview || !list) return;
      attendanceOcrPreviewUrls = attendanceOcrFiles.map(file => URL.createObjectURL(file));
      list.innerHTML = attendanceOcrFiles.map((file, index) => `
        <div class="att-ocr-preview-item">
          <img src="${escapeHtml(attendanceOcrPreviewUrls[index])}" alt="Ảnh đội hình ${index + 1}">
          <span title="${escapeHtml(file.name || `Ảnh ${index + 1}`)}">${escapeHtml(file.name || `Ảnh ${index + 1}`)}</span>
        </div>`).join("");
      list.querySelectorAll('.att-ocr-preview-item').forEach((item, index) => {
        const remove = document.createElement('button');
        remove.type = 'button'; remove.textContent = '✕ Xóa'; remove.className = 'att-image-remove';
        remove.onclick = event => {
          event.preventDefault(); event.stopPropagation();
          if (!isAdmin()) return;
          attendanceOcrFiles.splice(index, 1);
          attendanceOcrSession++;
          renderAttendanceOcrFilePreviews();
          renderAttendanceOcrGallery();
          if (attendanceOcrFiles.length) queueAttendanceOcrFiles([]);
        };
        item.append(remove);
      });
      if (count) count.textContent = `Đã chọn ${attendanceOcrFiles.length} ảnh · Bấm vào khung để chọn thêm`;
      preview.hidden = false;
      if (drop) drop.classList.add("has-preview");
    }

    function queueAttendanceOcrFiles(files) {
      if (!isAdmin()) return;
      const imageFiles = [...(files || [])].filter(file => file && String(file.type || "").startsWith("image/"));
      if (!imageFiles.length && !attendanceOcrFiles.length) {
        showToast("Clipboard không có ảnh. Hãy sao chép ảnh rồi nhấn Ctrl+V.");
        return;
      }
      imageFiles.forEach(file => {
        const signature = `${file.name}|${file.size}|${file.lastModified}`;
        if (!attendanceOcrFiles.some(item => `${item.name}|${item.size}|${item.lastModified}` === signature)) attendanceOcrFiles.push(file);
      });
      renderAttendanceOcrFilePreviews();
      const snapshot = attendanceOcrFiles.slice();
      const session = attendanceOcrSession;
      attendanceOcrAnalysisQueue = attendanceOcrAnalysisQueue
        .catch(() => {})
        .then(() => session === attendanceOcrSession && analyzeAttendanceOcrFiles(snapshot));
    }

    function openAttendanceOcrModal(actId) {
      const currWeek = getActiveWeek();
      const activity = currWeek?.activities?.find(item => item.id === actId);
      if (!activity) return;
      attendanceOcrSession++;
      attendanceOcrReview = {
        activityId: actId, weekId: currWeek.id,
        matched: (currWeek.members || []).filter(member => member.records?.[actId]).map(member => ({ member })),
        faded: (activity.attendanceReview?.faded || []).map(id => currWeek.members.find(member => member.id === id)).filter(Boolean).map(member => ({ member })),
        unmatched: activity.attendanceReview?.unmatched || [],
        evidenceImage: getAttendanceEvidenceImage(activity),
        images: getAttendanceEvidenceImages(activity)
      };
      attendanceOcrFiles = [];
      clearAttendanceOcrFilePreviews();
      attendanceOcrAnalysisQueue = Promise.resolve();
      document.getElementById("attOcrActivityId").value = actId;
      document.getElementById("attOcrModalTitle").textContent = `Chấm công: ${activity.name}`;
      document.getElementById("attOcrModalSub").textContent = `${activity.date || ""} · Chỉ nhận tên sáng/trắng`;
      document.getElementById("attOcrFileInput").value = "";
      document.getElementById("attOcrProgress").hidden = true;
      document.getElementById("attOcrResults").hidden = true;
      document.getElementById("attOcrError").hidden = true;
      document.getElementById("attOcrApplyBtn").disabled = true;
      const admin = isAdmin();
      document.querySelector('.att-ocr-drop').style.display = admin ? '' : 'none';
      document.getElementById('attOcrFileInput').disabled = !admin;
      document.querySelector('.att-ocr-safe-option').style.display = admin ? '' : 'none';
      document.getElementById('attOcrApplyBtn').style.display = admin ? '' : 'none';
      renderAttendanceOcrGallery();
      renderAttendanceManualPicker();
      renderAttendanceOcrReview();
      document.getElementById("attOcrModal").classList.add("open");
      syncModalScrollLock();
    }

    function closeAttendanceOcrModal() {
      attendanceOcrSession++;
      document.getElementById("attOcrModal")?.classList.remove("open");
      clearAttendanceOcrFilePreviews();
      syncModalScrollLock();
    }

    function openAttendanceEvidenceModal(activityId) {
      const activity = getActiveWeek()?.activities?.find(item => item.id === activityId);
      const image = getAttendanceEvidenceImage(activity);
      if (!activity || !image) return;
      document.getElementById("attEvidenceTitle").textContent = `Ảnh chấm công: ${activity.name}`;
      document.getElementById("attEvidenceSub").textContent = `${activity.date || ""} · Ảnh đội hình do Admin dùng để chấm công`;
      document.getElementById("attEvidenceImage").src = image;
      document.getElementById("attEvidenceModal").classList.add("open");
      syncModalScrollLock();
    }

    function closeAttendanceEvidenceModal() {
      const modal = document.getElementById("attEvidenceModal");
      if (modal) modal.classList.remove("open");
      const image = document.getElementById("attEvidenceImage");
      if (image) image.removeAttribute("src");
      syncModalScrollLock();
    }

    async function analyzeAttendanceOcrFiles(files, refreshOnly = false) {
      if (!isAdmin()) return;
      const session = attendanceOcrSession;
      const previousReview = attendanceOcrReview;
      const errorEl = document.getElementById("attOcrError");
      const applyBtn = document.getElementById("attOcrApplyBtn");
      if (errorEl) errorEl.hidden = true;
      if (applyBtn) applyBtn.disabled = true;
      document.getElementById("attOcrResults").hidden = true;
      const currWeek = attendanceState.weeks.find(week => week.id === previousReview.weekId) || getActiveWeek();
      const members = currWeek?.members || [];
      const detected = new Map();
      const unmatched = new Set();
      try {
        const Tesseract = await loadAttendanceOcrLibrary();
        for (let index = 0; index < files.length; index++) {
          const file = files[index];
          setAttendanceOcrProgress(index / files.length * 100, `Đang đọc ảnh ${index + 1}/${files.length}: ${file.name}`);
          const { canvas, context } = await prepareAttendanceOcrCanvas(file);
          const result = await Tesseract.recognize(canvas, "eng", {
            tessedit_pageseg_mode: "11",
            logger: message => {
              if (message.status === "recognizing text") {
                const total = ((index + (message.progress || 0)) / files.length) * 100;
                setAttendanceOcrProgress(total, `Đang nhận diện ảnh ${index + 1}/${files.length}… ${Math.round((message.progress || 0) * 100)}%`);
              }
            }
          });
          if (session !== attendanceOcrSession || !isAdmin()) return;
          const words = collectAttendanceOcrWords(result?.data);
          // A second contrast pass reveals dim names. Always classify brightness on the original image.
          const contrast = document.createElement('canvas');
          contrast.width = canvas.width; contrast.height = canvas.height;
          const contrastContext = contrast.getContext('2d');
          const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
          for (let pixel = 0; pixel < pixels.data.length; pixel += 4) {
            const luminance = pixels.data[pixel] * 0.2126 + pixels.data[pixel + 1] * 0.7152 + pixels.data[pixel + 2] * 0.0722;
            const value = 255 - Math.max(0, Math.min(255, (luminance - 45) * 5));
            pixels.data[pixel] = pixels.data[pixel + 1] = pixels.data[pixel + 2] = value;
          }
          contrastContext.putImageData(pixels, 0, 0);
          const enhanced = await Tesseract.recognize(contrast, 'eng', { tessedit_pageseg_mode: '11' });
          if (session !== attendanceOcrSession || !isAdmin()) return;
          words.push(...collectAttendanceOcrWords(enhanced?.data));
          // Join adjacent OCR fragments only inside the same name row/card.
          const fragments = words.slice();
          fragments.forEach((left, i) => {
            const right = fragments[i + 1];
            if (!right) return;
            const height = Math.max(1, left.bbox.y1 - left.bbox.y0);
            if (Math.abs(left.bbox.y0 - right.bbox.y0) > height * 0.5 || right.bbox.x0 < left.bbox.x1 || right.bbox.x0 - left.bbox.x1 > height) return;
            words.push({ text: left.text + right.text, confidence: Math.min(left.confidence, right.confidence), bbox: { x0: left.bbox.x0, y0: Math.min(left.bbox.y0, right.bbox.y0), x1: right.bbox.x1, y1: Math.max(left.bbox.y1, right.bbox.y1) } });
          });
          words.forEach(word => {
            const cleaned = String(word.text || "").replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "");
            if (normalizeAttendanceOcrName(cleaned).length < 2) return;

            const match = matchAttendanceOcrWord(cleaned, members);
            if (!match) {
              if (word.confidence >= 22 && normalizeAttendanceOcrName(cleaned).length >= 3) unmatched.add(cleaned);
              return;
            }
            const brightness = getAttendanceOcrWordBrightness(context, word.bbox, canvas.width, canvas.height);
            const bright = brightness >= 130 && (word.confidence >= 22 || match.score >= 0.97);
            const previous = detected.get(match.member.id);
            if (!previous || bright || (!previous.bright && brightness > previous.brightness)) {
              detected.set(match.member.id, { member: match.member, bright, brightness, score: match.score });
            }
          });
        }
        const newImages = await Promise.all(files.map(async file => ({ id: `${file.name}|${file.size}|${file.lastModified}`, name: file.name || 'Ảnh đội hình', src: await createAttendanceEvidenceImage([file]) })));
        const images = [...(previousReview.images || [])];
        if (!refreshOnly) newImages.forEach(image => { if (!images.some(item => item.id === image.id)) images.push(image); });
        const evidenceImage = images[0]?.src || '';
        if (session !== attendanceOcrSession || !isAdmin()) return;
        attendanceOcrReview = {
          activityId: previousReview.activityId, weekId: currWeek.id,
          matched: [...new Map([...(previousReview.matched || []).map(item => [item.member.id, item]), ...[...detected.values()].filter(item => item.bright).map(item => [item.member.id, item])]).values()].sort((a, b) => a.member.name.localeCompare(b.member.name, "vi")),
          faded: [...detected.values()].filter(item => !item.bright && !previousReview.matched.some(selected => selected.member.id === item.member.id)).sort((a, b) => a.member.name.localeCompare(b.member.name, "vi")),
          unmatched: [...unmatched].sort((a, b) => a.localeCompare(b, "vi")).slice(0, 80).map(text => ({ text })),
          evidenceImage, images
        };
        setAttendanceOcrProgress(100, `Đã xử lý ${files.length} ảnh. Hãy kiểm tra danh sách trước khi áp dụng.`);
        renderAttendanceOcrReview();
        renderAttendanceOcrGallery();
        renderAttendanceManualPicker();
        if (!detected.size) {
          errorEl.textContent = unmatched.size ? 'Đã đọc được chữ nhưng chưa khớp tên thành viên. Kiểm tra tên trong bảng hoặc chọn thành viên bên dưới.' : 'Chưa đọc được tên từ ảnh. Hãy dùng ảnh gốc rõ nét hoặc chọn thành viên bên dưới.';
          errorEl.hidden = false;
        }
      } catch (error) {
        console.error("Attendance OCR failed", error);
        if (errorEl) {
          errorEl.textContent = error?.message || "Không thể nhận diện ảnh. Vui lòng thử lại với ảnh rõ hơn.";
          errorEl.hidden = false;
        }
        setAttendanceOcrProgress(0, "Nhận diện chưa hoàn tất.");
      }
    }

    function applyAttendanceOcrReview() {
      if (!isAdmin() || !attendanceOcrReview) return;
      const currWeek = attendanceState.weeks.find(week => week.id === attendanceOcrReview.weekId) || getActiveWeek();
      const activityId = attendanceOcrReview.activityId;
      const selectedIds = new Set([...document.querySelectorAll("[data-ocr-member-id]:checked")].map(input => input.dataset.ocrMemberId));
      const manuallySelectedFaded = document.querySelectorAll('[data-ocr-source="faded"]:checked').length;
      const keepExisting = document.getElementById("attOcrKeepExisting")?.checked !== false;
      const activity = currWeek.activities.find(item => item.id === activityId);
      if (!activity) return;
      activity.attendanceReview = {
        faded: attendanceOcrReview.faded.map(item => item.member.id),
        unmatched: attendanceOcrReview.unmatched
      };
      activity.attendanceImages = attendanceOcrReview.images || [];
      // Compatibility with older clients; an empty gallery explicitly removes legacy evidence.
      activity.attendanceImage = activity.attendanceImages[0]?.src || '';
      delete activity.evidenceImage;
      activity.attendanceImageUpdatedAt = Date.now();
      if (!keepExisting) {
        currWeek.members.forEach(member => {
          if (member.records) delete member.records[activityId];
        });
      }
      currWeek.members.forEach(member => {
        if (!selectedIds.has(member.id)) return;
        if (!member.records) member.records = {};
        member.records[activityId] = true;
      });
      saveAttendanceState(attendanceState, true);
      closeAttendanceOcrModal();
      renderAttendanceTable();
      showToast(`✅ Đã chấm công ${selectedIds.size} thành viên${manuallySelectedFaded ? `, gồm ${manuallySelectedFaded} tên mờ chọn tay` : ""}.`);
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

      const roleBonusHint = document.getElementById("attMemberRoleBonusHint");
      const roleBonusInput = document.getElementById("attMemberRoleBonusInput");
      if (roleBonusHint) {
        const customVal = roleBonusInput?.value?.trim();
        if (customVal !== "" && !isNaN(Number(customVal))) {
          roleBonusHint.textContent = `Tùy chỉnh: +${Number(customVal)}%`;
        } else {
          const simulated = { role: roleInput?.value || "" };
          const defaultPct = getMemberRoleBonusPercent(simulated, getActiveWeek());
          roleBonusHint.textContent = defaultPct > 0 ? `Tự động: +${defaultPct}% theo vai trò` : "Mặc định (0%)";
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
      const bonusInput = document.getElementById("attMemberRoleBonusInput");
      const cpInput = document.getElementById("attMemberCpInput");
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
        if (cpInput) cpInput.value = member.combatPower ? formatCombatPowerInput(member.combatPower) : "";
        if (multInput) multInput.value = member.multiplier || 1.0;
        if (roleInput) roleInput.value = member.role || "";
        if (bonusInput) bonusInput.value = (member.roleBonusPercent !== undefined && member.roleBonusPercent !== null) ? member.roleBonusPercent : "";
        if (delBtn) delBtn.style.display = "inline-flex";

        selectMemberColor(member.color || "");
        selectMemberRoleColor(member.roleColor || "#f59e0b");
      } else {
        if (titleEl) titleEl.textContent = "Thêm Thành Viên Mới";
        if (editIdInput) editIdInput.value = "";
        if (nameInput) nameInput.value = "";
        populateAttendanceMemberServerSelect(attendanceServerFilter !== "all" ? attendanceServerFilter : getDefaultAttendanceServerId());
        if (cpInput) cpInput.value = "";
        if (multInput) multInput.value = "1.0";
        if (roleInput) roleInput.value = "";
        if (bonusInput) bonusInput.value = "";
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
      const bonusInput = document.getElementById("attMemberRoleBonusInput");
      const cpInput = document.getElementById("attMemberCpInput");
      const colorValInput = document.getElementById("attMemberColorVal");
      const roleColorValInput = document.getElementById("attMemberRoleColorVal");
      const editIdInput = document.getElementById("attMemberEditId");
      const errEl = document.getElementById("attMemberModalError");

      const name = (nameInput?.value || "").trim();
      const serverId = (serverSelect?.value || getDefaultAttendanceServerId()).trim();
      const mult = parseFloat(multInput?.value) || 1.0;
      const combatPower = cpInput ? parseCombatPowerInput(cpInput.value) : 0;
      const role = (roleInput?.value || "").trim();
      const color = (colorValInput?.value || "").trim();
      const roleColor = (roleColorValInput?.value || "").trim();
      const editId = (editIdInput?.value || "").trim();
      const bonusRaw = (bonusInput?.value || "").trim();
      const customBonus = bonusRaw !== "" && !isNaN(Number(bonusRaw)) ? Math.max(0, Math.min(100, Number(bonusRaw))) : null;

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
          member.combatPower = combatPower;
          member.role = role;
          member.color = color;
          member.roleColor = roleColor;
          if (customBonus !== null) {
            member.roleBonusPercent = customBonus;
          } else {
            delete member.roleBonusPercent;
          }
          showToast(`✅ Đã cập nhật thành viên: ${name}`);
        }
      } else {
        const newId = "m_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
        const newMem = {
          id: newId,
          name,
          serverId,
          multiplier: mult,
          combatPower,
          role,
          color,
          roleColor,
          records: {}
        };
        if (customBonus !== null) {
          newMem.roleBonusPercent = customBonus;
        }
        currWeek.members.push(newMem);
        showToast(`✅ Đã thêm thành viên mới: ${name}`);
      }

      saveAttendanceState(attendanceState, true);
      closeAttendanceMemberModal();
      renderAttendanceTable();
    }

    function deleteAttendanceMember(memberId, weekId = attendanceState?.activeWeekId) {
      if (!isAdmin() || !attendanceState) return;
      const currWeek = attendanceState.weeks.find(week => week.id === weekId);
      if (!currWeek) return;
      currWeek.members = currWeek.members.filter(m => m.id !== memberId);
      saveAttendanceState(attendanceState, true);
      closeAttendanceMemberModal();
      renderAttendanceTable();
      showToast("🗑️ Đã xóa thành viên.");
    }

    // Modal Role Bonus Functions
    function openAttendanceRoleBonusModal() {
      if (!isAdmin()) {
        showToast("Chỉ Quản trị viên (Admin) mới có quyền cài đặt Thưởng Vị Trí.");
        requestAdminLogin();
        return;
      }
      const modal = document.getElementById("attRoleBonusModal");
      if (!modal) return;
      const errEl = document.getElementById("attRoleBonusModalError");
      if (errEl) errEl.style.display = "none";

      const currWeek = getActiveWeek();
      const currentBonuses = (currWeek && Array.isArray(currWeek.roleBonuses) && currWeek.roleBonuses.length > 0)
        ? currWeek.roleBonuses
        : (attendanceState?.roleBonuses && Array.isArray(attendanceState.roleBonuses) && attendanceState.roleBonuses.length > 0
          ? attendanceState.roleBonuses
          : DEFAULT_ROLE_BONUSES);

      renderRoleBonusRows(currentBonuses);
      modal.classList.add("open");
      syncModalScrollLock();
    }

    function closeAttendanceRoleBonusModal() {
      const modal = document.getElementById("attRoleBonusModal");
      if (modal) modal.classList.remove("open");
      syncModalScrollLock();
    }

    function renderRoleBonusRows(bonuses) {
      const container = document.getElementById("attRoleBonusListContainer");
      if (!container) return;
      if (!bonuses || bonuses.length === 0) {
        container.innerHTML = `<p style="text-align:center; color:var(--muted); font-size:12.5px; padding:12px;">Chưa có chức danh nào. Bấm nút "+ Thêm chức danh" ở trên.</p>`;
        return;
      }

      container.innerHTML = bonuses.map((item, idx) => `
        <div class="att-role-bonus-row" data-index="${idx}">
          <input type="text" class="att-role-name-input" placeholder="Tên Chức Danh / Vai Trò" value="${escapeHtml(item.role || "")}" maxlength="30">
          <div style="display:flex; align-items:center; gap:4px;">
            <input type="number" class="att-role-pct-input" placeholder="%" min="0" max="100" step="0.5" value="${item.percent ?? 0}" style="width:70px;">
            <span style="font-size:12px; font-weight:700; color:var(--amber);">%</span>
          </div>
          <button type="button" class="att-btn-micro att-del-role-bonus-btn" title="Xóa dòng này" style="color:var(--red);">🗑️</button>
        </div>
      `).join("");

      container.querySelectorAll(".att-del-role-bonus-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
          const row = e.target.closest(".att-role-bonus-row");
          if (row) row.remove();
        });
      });
    }

    function addRoleBonusRow(role = "", percent = 2) {
      const container = document.getElementById("attRoleBonusListContainer");
      if (!container) return;
      if (container.querySelector("p")) container.innerHTML = "";
      const div = document.createElement("div");
      div.className = "att-role-bonus-row";
      div.innerHTML = `
        <input type="text" class="att-role-name-input" placeholder="Tên Chức Danh / Vai Trò" value="${escapeHtml(role)}" maxlength="30">
        <div style="display:flex; align-items:center; gap:4px;">
          <input type="number" class="att-role-pct-input" placeholder="%" min="0" max="100" step="0.5" value="${percent}" style="width:70px;">
          <span style="font-size:12px; font-weight:700; color:var(--amber);">%</span>
        </div>
        <button type="button" class="att-btn-micro att-del-role-bonus-btn" title="Xóa dòng này" style="color:var(--red);">🗑️</button>
      `;
      div.querySelector(".att-del-role-bonus-btn")?.addEventListener("click", () => div.remove());
      container.appendChild(div);
      div.querySelector(".att-role-name-input")?.focus();
    }

    function saveAttendanceRoleBonuses() {
      if (!isAdmin()) return;
      const rows = document.querySelectorAll("#attRoleBonusListContainer .att-role-bonus-row");
      const errEl = document.getElementById("attRoleBonusModalError");
      if (errEl) errEl.style.display = "none";

      const updated = [];
      let hasError = false;
      rows.forEach(row => {
        const role = (row.querySelector(".att-role-name-input")?.value || "").trim();
        const pctRaw = row.querySelector(".att-role-pct-input")?.value;
        const percent = parseFloat(pctRaw);
        if (!role) return;
        if (isNaN(percent) || percent < 0 || percent > 100) {
          hasError = true;
          return;
        }
        updated.push({ role, percent });
      });

      if (hasError) {
        if (errEl) {
          errEl.textContent = "Tỷ lệ % thưởng phải từ 0% đến 100%.";
          errEl.style.display = "block";
        }
        return;
      }

      const currWeek = getActiveWeek();
      currWeek.roleBonuses = updated;
      if (attendanceState) {
        attendanceState.roleBonuses = updated;
      }

      saveAttendanceState(attendanceState, true);
      closeAttendanceRoleBonusModal();
      renderAttendanceTable();
      showToast("🎖️ Đã lưu cấu hình Thưởng Vị Trí!");
    }

    // Modal Combat Power & Ranking Functions
    function openAttendanceCombatPowerModal() {
      if (!isAdmin()) {
        showToast("Chỉ Quản trị viên (Admin) mới có quyền quản lý Lực Chiến.");
        requestAdminLogin();
        return;
      }
      const modal = document.getElementById("attCombatPowerModal");
      if (!modal) return;
      const currWeek = getActiveWeek();
      const tiers = (currWeek && Array.isArray(currWeek.cpTiers) && currWeek.cpTiers.length > 0)
        ? currWeek.cpTiers
        : DEFAULT_CP_TIERS;
      const scope = currWeek?.cpScope || "server";

      const serverRadio = document.getElementById("attCpScopeServer");
      const guildRadio = document.getElementById("attCpScopeGuild");
      if (serverRadio && guildRadio) {
        serverRadio.checked = scope !== "guild";
        guildRadio.checked = scope === "guild";
      }

      const serverSelect = document.getElementById("attCpModalServerSelect");
      if (serverSelect) {
        const options = [`<option value="all">Tất cả Server</option>`]
          .concat(serverList.map(s => `<option value="${escapeHtml(s.id)}">${escapeHtml(s.name || s.id)}</option>`));
        serverSelect.innerHTML = options.join("");
        serverSelect.value = attendanceServerFilter || "all";
      }

      renderCpTiersBody(tiers);
      renderManagementRoleMultipliers(currWeek?.managementRoleMultipliers || DEFAULT_MANAGEMENT_ROLE_MULTIPLIERS);
      renderCpMembersTableBody(serverSelect ? serverSelect.value : "all");

      const errEl = document.getElementById("attCpModalError");
      if (errEl) errEl.style.display = "none";

      const pasteWrap = document.getElementById("attCpPasteWrap");
      if (pasteWrap) pasteWrap.style.display = "none";
      attendanceCpOcrSession++;
      attendanceCpImageReview = null;
      const imageInput = document.getElementById("attCpImageInput");
      if (imageInput) imageInput.value = "";
      const imageProgress = document.getElementById("attCpImageProgress");
      const imageResults = document.getElementById("attCpImageResults");
      if (imageProgress) imageProgress.hidden = true;
      if (imageResults) imageResults.hidden = true;

      modal.classList.add("open");
      syncModalScrollLock();
    }

    function closeAttendanceCombatPowerModal() {
      attendanceCpOcrSession++;
      const modal = document.getElementById("attCombatPowerModal");
      if (modal) modal.classList.remove("open");
      syncModalScrollLock();
    }

    function renderCpTiersBody(tiers) {
      const tbody = document.getElementById("attCpTiersBody");
      if (!tbody) return;
      const list = (Array.isArray(tiers) && tiers.length > 0) ? tiers : DEFAULT_CP_TIERS;
      let html = "";
      list.forEach((tier, idx) => {
        const isLast = tier.upToRank === null || tier.upToRank === undefined;
        const prevRank = idx === 0 ? 0 : (list[idx - 1]?.upToRank || 0);
        const fromRank = prevRank + 1;
        html += `<tr data-tier-idx="${idx}">
          <td style="padding:6px 10px;">
            ${isLast
              ? `<span style="font-weight:600; color:var(--text);">Còn lại (từ Top ${fromRank} trở đi)</span>`
              : `<div style="display:flex; align-items:center; gap:6px;">
                  <span class="att-cp-badge-top">Top ${fromRank} đến</span>
                  <input type="number" class="att-cp-tier-input att-tier-rank-input" value="${tier.upToRank || 5}" min="${fromRank}" step="1" style="width:55px;">
                </div>`
            }
          </td>
          <td style="padding:6px 10px; text-align:center;">
            <div style="display:inline-flex; align-items:center; gap:4px;">
              <span style="font-weight:700; color:var(--amber);">x</span>
              <input type="number" class="att-cp-tier-input att-tier-mult-input" value="${tier.multiplier ?? 1}" min="0.1" max="10" step="any" style="width:60px;">
            </div>
          </td>
          <td style="padding:6px 10px; text-align:right;">
            ${!isLast
              ? `<button type="button" class="btn-ghost icon-button att-del-cp-tier-btn" data-tier-idx="${idx}" title="Xóa mốc này" style="color:var(--red); padding:2px 5px; font-size:12px;">🗑️</button>`
              : `—`
            }
          </td>
        </tr>`;
      });
      tbody.innerHTML = html;

      tbody.querySelectorAll(".att-del-cp-tier-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const idx = parseInt(btn.dataset.tierIdx, 10);
          const currentTiers = collectCpTiersFromModal();
          currentTiers.splice(idx, 1);
          renderCpTiersBody(currentTiers);
        });
      });
    }

    function collectCpTiersFromModal() {
      const rows = document.querySelectorAll("#attCpTiersBody tr");
      const tiers = [];
      rows.forEach((row, idx) => {
        const rankInput = row.querySelector(".att-tier-rank-input");
        const multInput = row.querySelector(".att-tier-mult-input");
        const mult = parseFloat(multInput?.value) || 1.0;
        if (rankInput) {
          const rank = parseInt(rankInput.value, 10) || (idx + 1) * 5;
          tiers.push({ upToRank: rank, multiplier: mult, label: `Top ${rank}` });
        } else {
          tiers.push({ upToRank: null, multiplier: mult, label: "Còn lại" });
        }
      });
      if (tiers.length === 0) {
        return JSON.parse(JSON.stringify(DEFAULT_CP_TIERS));
      }
      return tiers;
    }

    function renderManagementRoleMultipliers(items) {
      const container = document.getElementById("attManagementRoleList");
      if (!container) return;
      const list = Array.isArray(items) && items.length ? items : DEFAULT_MANAGEMENT_ROLE_MULTIPLIERS;
      container.innerHTML = list.map(item => `
        <div class="att-management-role-row">
          <input type="text" class="att-management-role-name" maxlength="80" value="${escapeHtml(item.role || "")}" placeholder="Ví dụ: Chủ Guild">
          <span class="att-management-role-arrow">tối thiểu</span>
          <span class="att-management-role-x">x</span>
          <input type="number" class="att-management-role-multiplier" min="1" max="10" step="0.1" value="${Number(item.multiplier) || 1}">
          <button type="button" class="att-btn-micro att-remove-management-role" title="Xóa chức danh">🗑️</button>
        </div>`).join("");
      container.querySelectorAll(".att-remove-management-role").forEach(button => {
        button.addEventListener("click", () => button.closest(".att-management-role-row")?.remove());
      });
    }

    function addManagementRoleMultiplier(role = "", multiplier = 1.5) {
      const items = collectManagementRoleMultipliers();
      items.push({ role, multiplier });
      renderManagementRoleMultipliers(items);
      document.querySelector("#attManagementRoleList .att-management-role-row:last-child .att-management-role-name")?.focus();
    }

    function collectManagementRoleMultipliers() {
      return [...document.querySelectorAll("#attManagementRoleList .att-management-role-row")].map(row => ({
        role: (row.querySelector(".att-management-role-name")?.value || "").trim(),
        multiplier: Math.max(1, Math.min(10, Number(row.querySelector(".att-management-role-multiplier")?.value) || 1))
      })).filter(item => item.role);
    }

    function matchAttendanceCpOcrName(rawText, members) {
      const token = normalizeAttendanceOcrName(rawText);
      if (token.length < 2) return null;
      const ranked = members.map(member => ({ member, score: attendanceOcrSimilarity(token, member.name) }))
        .sort((a, b) => b.score - a.score);
      const best = ranked[0];
      const second = ranked[1]?.score || 0;
      const threshold = token.length <= 4 ? 0.6 : token.length <= 7 ? 0.66 : 0.7;
      if (!best || best.score < threshold || (best.score < 0.95 && best.score - second < 0.08)) return null;
      return best;
    }

    function buildAttendanceCpOcrRows(words) {
      const rows = [];
      [...(words || [])].filter(word => word?.bbox && String(word.text || "").trim()).sort((a, b) => {
        const ay = (a.bbox.y0 + a.bbox.y1) / 2;
        const by = (b.bbox.y0 + b.bbox.y1) / 2;
        return ay - by || a.bbox.x0 - b.bbox.x0;
      }).forEach(word => {
        const centerY = (word.bbox.y0 + word.bbox.y1) / 2;
        const height = Math.max(1, word.bbox.y1 - word.bbox.y0);
        let row = rows.find(item => Math.abs(item.centerY - centerY) <= Math.max(10, Math.min(item.height, height) * 0.7));
        if (!row) {
          row = { centerY, height, words: [] };
          rows.push(row);
        }
        row.words.push(word);
        row.centerY = row.words.reduce((sum, item) => sum + (item.bbox.y0 + item.bbox.y1) / 2, 0) / row.words.length;
        row.height = Math.max(row.height, height);
      });
      return rows.map(row => ({ ...row, words: row.words.sort((a, b) => a.bbox.x0 - b.bbox.x0) }));
    }

    function extractAttendanceCpOcrEntries(words, members) {
      const matched = new Map();
      const unmatched = [];
      buildAttendanceCpOcrRows(words).forEach(row => {
        const numberWords = row.words.filter(word => /\d/.test(word.text || ""));
        if (!numberWords.length) return;
        const numberWord = numberWords[numberWords.length - 1];
        const combatPower = Number(String(numberWord.text || "").replace(/[^0-9]/g, ""));
        if (!Number.isFinite(combatPower) || combatPower < 100) return;
        const name = row.words
          .filter(word => word.bbox.x1 < numberWord.bbox.x0 && /[\p{L}\p{N}]/u.test(word.text || ""))
          .map(word => String(word.text || "").replace(/[^\p{L}\p{N}]/gu, ""))
          .filter(Boolean).join(" ").trim();
        if (!name) return;
        const match = matchAttendanceCpOcrName(name, members);
        if (!match) {
          unmatched.push({ name, combatPower });
          return;
        }
        const previous = matched.get(match.member.id);
        if (!previous || match.score > previous.score) matched.set(match.member.id, { member: match.member, sourceName: name, combatPower, score: match.score });
      });
      return { matched: [...matched.values()], unmatched };
    }

    function setAttendanceCpImageProgress(percent, text) {
      const wrap = document.getElementById("attCpImageProgress");
      const bar = document.getElementById("attCpImageProgressBar");
      const label = document.getElementById("attCpImageProgressText");
      if (wrap) wrap.hidden = false;
      if (bar) bar.style.width = `${Math.max(0, Math.min(100, percent))}%`;
      if (label) label.textContent = text;
    }

    function renderAttendanceCpImageReview() {
      const results = document.getElementById("attCpImageResults");
      const list = document.getElementById("attCpImageMatchedList");
      const unmatchedWrap = document.getElementById("attCpImageUnmatchedWrap");
      const unmatchedList = document.getElementById("attCpImageUnmatchedList");
      if (!results || !list || !attendanceCpImageReview) return;
      const matched = attendanceCpImageReview.matched || [];
      const unmatched = attendanceCpImageReview.unmatched || [];
      list.innerHTML = matched.length ? matched.map(item => `
        <label class="att-cp-image-match-row">
          <input type="checkbox" data-cp-image-member-id="${escapeHtml(item.member.id)}"${item.checked === false ? "" : " checked"}>
          <span><strong>${escapeHtml(item.member.name)}</strong><small>Ảnh đọc: ${escapeHtml(item.sourceName)}</small></span>
          <input type="text" class="att-cp-image-value" data-cp-image-value-for="${escapeHtml(item.member.id)}" value="${escapeHtml(formatCombatPowerInput(item.combatPower))}">
        </label>`).join("") : '<div class="att-cp-image-empty">Chưa tìm thấy tên thành viên phù hợp.</div>';
      document.getElementById("attCpImageResultCount").textContent = `${matched.length} thành viên`;
      if (unmatchedWrap) unmatchedWrap.hidden = unmatched.length === 0;
      document.getElementById("attCpImageUnmatchedCount").textContent = unmatched.length;
      if (unmatchedList) unmatchedList.innerHTML = unmatched.map(item => `<span>${escapeHtml(item.name)} · ${item.combatPower.toLocaleString("vi-VN")}</span>`).join("");
      const apply = document.getElementById("attCpApplyImageResultsBtn");
      if (apply) apply.disabled = matched.length === 0;
      results.hidden = false;
    }

    async function analyzeAttendanceCpImages(files) {
      if (!isAdmin()) return;
      const imageFiles = [...(files || [])].filter(file => String(file?.type || "").startsWith("image/"));
      if (!imageFiles.length) return;
      const session = ++attendanceCpOcrSession;
      const members = getActiveWeek()?.members || [];
      const allMatched = new Map();
      const previousReview = attendanceCpImageReview;
      const previousSelected = new Map();
      document.querySelectorAll("[data-cp-image-member-id]").forEach(checkbox => {
        const memberId = checkbox.dataset.cpImageMemberId;
        const valueInput = document.querySelector(`[data-cp-image-value-for="${CSS.escape(memberId)}"]`);
        previousSelected.set(memberId, {
          checked: checkbox.checked,
          combatPower: parseCombatPowerInput(valueInput?.value)
        });
      });
      (previousReview?.matched || []).forEach(item => {
        const edited = previousSelected.get(item.member.id);
        allMatched.set(item.member.id, {
          ...item,
          combatPower: edited?.combatPower || item.combatPower,
          checked: edited?.checked ?? item.checked ?? true
        });
      });
      const allUnmatched = [...(previousReview?.unmatched || [])];
      const totalImageCount = (previousReview?.imageCount || 0) + imageFiles.length;
      try {
        const Tesseract = await loadAttendanceOcrLibrary();
        for (let index = 0; index < imageFiles.length; index++) {
          setAttendanceCpImageProgress(index / imageFiles.length * 100, `Đang đọc ảnh ${index + 1}/${imageFiles.length}…`);
          const { canvas, context } = await prepareAttendanceOcrCanvas(imageFiles[index]);
          const contrast = document.createElement("canvas");
          contrast.width = canvas.width;
          contrast.height = canvas.height;
          const contrastContext = contrast.getContext("2d");
          const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
          for (let pixel = 0; pixel < pixels.data.length; pixel += 4) {
            const luminance = pixels.data[pixel] * 0.2126 + pixels.data[pixel + 1] * 0.7152 + pixels.data[pixel + 2] * 0.0722;
            const value = 255 - Math.max(0, Math.min(255, (luminance - 45) * 5));
            pixels.data[pixel] = pixels.data[pixel + 1] = pixels.data[pixel + 2] = value;
          }
          contrastContext.putImageData(pixels, 0, 0);
          const result = await Tesseract.recognize(contrast, "eng", {
            tessedit_pageseg_mode: "11",
            logger: message => {
              if (message.status !== "recognizing text") return;
              const percent = ((index + (message.progress || 0)) / imageFiles.length) * 100;
              setAttendanceCpImageProgress(percent, `Đang đối chiếu ảnh ${index + 1}/${imageFiles.length} · ${Math.round((message.progress || 0) * 100)}%`);
            }
          });
          if (session !== attendanceCpOcrSession) return;
          const extracted = extractAttendanceCpOcrEntries(collectAttendanceOcrWords(result?.data), members);
          extracted.matched.forEach(item => {
            // Ảnh nhập sau được ưu tiên để có thể cập nhật Lực Chiến mới của cùng thành viên.
            allMatched.set(item.member.id, { ...item, checked: true });
          });
          allUnmatched.push(...extracted.unmatched);
        }
        const uniqueUnmatched = [...new Map(allUnmatched.map(item => [
          `${normalizeAttendanceOcrName(item.name)}:${item.combatPower}`,
          item
        ])).values()];
        attendanceCpImageReview = { matched: [...allMatched.values()], unmatched: uniqueUnmatched, imageCount: totalImageCount };
        setAttendanceCpImageProgress(100, `Đã đọc tổng ${totalImageCount} ảnh · Khớp ${allMatched.size} thành viên. Hãy kiểm tra trước khi điền.`);
        renderAttendanceCpImageReview();
      } catch (error) {
        console.error("Combat power image OCR failed", error);
        setAttendanceCpImageProgress(0, error?.message || "Không thể nhận diện ảnh. Hãy thử lại bằng ảnh rõ hơn.");
      }
    }

    function applyAttendanceCpImageReview() {
      if (!isAdmin() || !attendanceCpImageReview) return;
      const selected = new Map();
      document.querySelectorAll("[data-cp-image-member-id]:checked").forEach(checkbox => {
        const memberId = checkbox.dataset.cpImageMemberId;
        const valueInput = document.querySelector(`[data-cp-image-value-for="${CSS.escape(memberId)}"]`);
        selected.set(memberId, parseCombatPowerInput(valueInput?.value));
      });
      const serverSelect = document.getElementById("attCpModalServerSelect");
      if (serverSelect) serverSelect.value = "all";
      renderCpMembersTableBody("all");
      selected.forEach((value, memberId) => {
        const input = document.querySelector(`#attCpMembersTableBody .att-cp-member-input[data-member-id="${CSS.escape(memberId)}"]`);
        if (input) input.value = formatCombatPowerInput(value);
      });
      showToast(`📷 Đã điền Lực Chiến cho ${selected.size} thành viên. Kiểm tra rồi bấm Lưu hoặc Áp Hệ Số.`);
    }

    function renderCpMembersTableBody(serverFilter = "all") {
      const tbody = document.getElementById("attCpMembersTableBody");
      if (!tbody) return;
      const currWeek = getActiveWeek();
      let members = (currWeek?.members || []).slice();
      if (serverFilter && serverFilter !== "all") {
        members = members.filter(m => getMemberServerId(m) === serverFilter);
      }
      if (members.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:20px; color:var(--muted);">Không có thành viên nào phù hợp.</td></tr>`;
        return;
      }
      let html = "";
      members.forEach((m, idx) => {
        const cpFormatted = formatCombatPowerInput(m.combatPower);
        html += `<tr data-member-id="${escapeHtml(m.id)}">
          <td style="padding:6px 8px; color:var(--muted);">${idx + 1}</td>
          <td style="padding:6px 8px; font-weight:600; color:var(--text);">${escapeHtml(m.name)}</td>
          <td style="padding:6px 8px;"><span class="att-management-role-badge${m.role ? "" : " is-empty"}">${escapeHtml(m.role || "Thành viên")}</span></td>
          <td style="padding:6px 8px;"><span class="att-server-tag">${escapeHtml(getMemberServerName(m))}</span></td>
          <td style="padding:6px 8px;">
            <input type="text" class="att-cp-member-input" data-member-id="${escapeHtml(m.id)}" value="${escapeHtml(cpFormatted)}" placeholder="VD: 18.5M">
          </td>
          <td style="padding:6px 8px; text-align:center; font-weight:700; color:var(--amber);"><span title="${m.managementRoleMultiplier ? `Top x${m.cpRankMultiplier || 1} · Chức danh x${m.managementRoleMultiplier}` : `Theo Top lực chiến`}">x${m.multiplier}${m.managementRoleMultiplier && m.managementRoleMultiplier >= (m.cpRankMultiplier || 1) ? " 👑" : ""}</span></td>
        </tr>`;
      });
      tbody.innerHTML = html;
    }

    function saveCombatPowerModalData(applyTiers = false) {
      if (!isAdmin()) return;
      const currWeek = getActiveWeek();
      if (!currWeek) return;

      const cpInputs = document.querySelectorAll("#attCpMembersTableBody .att-cp-member-input");
      cpInputs.forEach(input => {
        const mId = input.dataset.memberId;
        const member = currWeek.members.find(m => m.id === mId);
        if (member) {
          member.combatPower = parseCombatPowerInput(input.value);
        }
      });



      const tiers = collectCpTiersFromModal();
      const roleMultipliers = collectManagementRoleMultipliers();
      const scope = document.getElementById("attCpScopeGuild")?.checked ? "guild" : "server";

      if (applyTiers) {
        applyCombatPowerTiersToWeek(currWeek, scope, tiers, roleMultipliers);
        showToast("⚡ Đã áp hệ số theo Top Lực Chiến và Chức Danh quản lý!");
      } else {
        currWeek.cpTiers = tiers;
        currWeek.managementRoleMultipliers = roleMultipliers;
        currWeek.cpScope = scope;
        showToast("💾 Đã lưu Lực Chiến thành công!");
      }

      saveAttendanceState(attendanceState, true);
      closeAttendanceCombatPowerModal();
      renderAttendanceTable();
    }

    function applyCombatPowerPaste() {
      const textarea = document.getElementById("attCpPasteInput");
      const text = textarea?.value?.trim() || "";
      if (!text) {
        showToast("Vui lòng nhập hoặc dán danh sách Lực Chiến.");
        return;
      }
      const lines = text.split(/\r?\n/);
      let matchCount = 0;
      const currWeek = getActiveWeek();
      if (!currWeek) return;

      lines.forEach(line => {
        const trimmed = line.trim();
        if (!trimmed) return;
        const sepMatch = trimmed.match(/^([^:\t|,]+)[:\t|,]\s*(.+)$/);
        if (!sepMatch) return;
        const rawName = sepMatch[1].trim().toLowerCase();
        const cpStr = sepMatch[2].trim();
        const cpVal = parseCombatPowerInput(cpStr);

        const member = currWeek.members.find(m => (m.name || "").trim().toLowerCase() === rawName);
        if (member) {
          member.combatPower = cpVal;
          matchCount++;
          const input = document.querySelector(`#attCpMembersTableBody .att-cp-member-input[data-member-id="${member.id}"]`);
          if (input) input.value = formatCombatPowerInput(cpVal);
        }
      });

      if (matchCount > 0) {
        showToast(`✅ Đã cập nhật Lực Chiến cho ${matchCount} thành viên từ nội dung dán!`);
        textarea.value = "";
        const wrap = document.getElementById("attCpPasteWrap");
        if (wrap) wrap.style.display = "none";
      } else {
        showToast("⚠️ Không tìm thấy thành viên nào khớp tên trong danh sách.");
      }
    }

    // Modal Activity Functions
    function refreshAttendanceBossNames() {
      const names = new Map();
      const addName = value => {
        const name = String(value || "").trim();
        if (name && !names.has(name.toLocaleLowerCase("vi"))) names.set(name.toLocaleLowerCase("vi"), name);
      };
      (state?.bosses || []).forEach(boss => addName(boss.name));
      (attendanceState?.weeks || []).forEach(week => (week.activities || []).forEach(act => addName(act.name)));
      const bindPicker = (selectId, inputId, buttonId, placeholder) => {
        const select = document.getElementById(selectId);
        const input = document.getElementById(inputId);
        const button = document.getElementById(buttonId);
        if (!select || !input || !button) return;
        addName(input.value);
        select.innerHTML = `<option value="">${placeholder}</option>` +
          [...names.values()].sort((a, b) => a.localeCompare(b, "vi")).map(name => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`).join("");
        select.value = names.get(input.value.trim().toLocaleLowerCase("vi")) || "";
        input.hidden = Boolean(select.value) || !input.value;
        select.onchange = () => { input.value = select.value; input.hidden = true; };
        button.onclick = () => {
          select.value = "";
          input.hidden = false;
          input.value = "";
          input.focus();
        };
      };
      bindPicker("attActivityNameSelect", "attActivityNameInput", "attNewActivityNameBtn", "Chọn Boss / hoạt động ban ngày…");
      bindPicker("attActivityNightNameSelect", "attActivityNightNameInput", "attNewActivityNightNameBtn", "Chọn Boss / hoạt động ban đêm…");
    }

    function updateAttendanceActivityPointPreview() {
      const basePoints = Math.max(1, parseInt(document.getElementById("attActivityPointsInput")?.value, 10) || 1);
      const day = document.getElementById("attDayPointsPreview");
      const night = document.getElementById("attNightPointsPreview");
      if (day) day.textContent = `${basePoints} điểm`;
      if (night) night.textContent = `${basePoints * 2} điểm (X2)`;
    }

    function setAttendanceActivityPeriodMode(period = "both") {
      const daySection = document.getElementById("attActivityDaySection");
      const nightSection = document.getElementById("attActivityNightSection");
      if (daySection) daySection.hidden = period === "night";
      if (nightSection) nightSection.hidden = period === "day";
    }

    function openAttendanceActivityModal(actId = null) {
      const modal = document.getElementById("attActivityModal");
      if (!modal) return;
      const titleEl = document.getElementById("attActivityModalTitle");
      const dateInput = document.getElementById("attActivityDateInput");
      const nameInput = document.getElementById("attActivityNameInput");
      const nightNameInput = document.getElementById("attActivityNightNameInput");
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
        const period = act.timePeriod === "night" ? "night" : "day";
        if (nameInput) nameInput.value = period === "day" ? (act.name || "") : "";
        if (nightNameInput) nightNameInput.value = period === "night" ? (act.name || "") : "";
        if (ptsInput) ptsInput.value = act.basePoints || (period === "night" ? Math.max(1, Number(act.points || 2) / 2) : act.points) || 1;
        setAttendanceActivityPeriodMode(period);
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
        if (nightNameInput) nightNameInput.value = "";
        if (ptsInput) ptsInput.value = "2";
        setAttendanceActivityPeriodMode("both");
        if (delBtn) delBtn.style.display = "none";
      }

      refreshAttendanceBossNames();
      updateAttendanceActivityPointPreview();
      modal.classList.add("open");
      syncModalScrollLock();
      setTimeout(() => document.getElementById("attActivityNameSelect")?.focus(), 50);
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
      const nightNameInput = document.getElementById("attActivityNightNameInput");
      const ptsInput = document.getElementById("attActivityPointsInput");
      const editIdInput = document.getElementById("attActivityEditId");
      const errEl = document.getElementById("attActivityModalError");

      const dateStr = (dateInput?.value || "").trim();
      const name = (nameInput?.value || "").trim();
      const nightName = (nightNameInput?.value || "").trim();
      const basePoints = Math.max(1, parseInt(ptsInput?.value, 10) || 1);
      const editId = (editIdInput?.value || "").trim();

      if (!name && !nightName) {
        if (errEl) {
          errEl.textContent = "Vui lòng chọn ít nhất một Boss ban ngày hoặc Boss ban đêm.";
          errEl.style.display = "block";
        }
        return;
      }

      const currWeek = getActiveWeek();
      if (editId) {
        const act = currWeek.activities.find(a => a.id === editId);
        if (act) {
          const period = act.timePeriod === "night" ? "night" : "day";
          const updatedName = period === "night" ? nightName : name;
          act.date = dateStr;
          act.name = updatedName;
          act.timePeriod = period;
          act.basePoints = basePoints;
          act.points = period === "night" ? basePoints * 2 : basePoints;
          showToast(`✅ Đã cập nhật: ${updatedName} (${act.points}đ${period === "night" ? " · X2 ban đêm" : ""})`);
        }
      } else {
        const created = [];
        const makeActivity = (activityName, period) => ({
          id: "act_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
          date: dateStr,
          name: activityName,
          timePeriod: period,
          basePoints,
          points: period === "night" ? basePoints * 2 : basePoints
        });
        if (name) created.push(makeActivity(name, "day"));
        if (nightName) created.push(makeActivity(nightName, "night"));
        currWeek.activities.push(...created);
        showToast(`✅ Đã thêm ${created.length} hoạt động${nightName ? ` · Boss ban đêm ${basePoints * 2} điểm (X2)` : ""}`);
      }

      saveAttendanceState(attendanceState, true);
      closeAttendanceActivityModal();
      renderAttendanceTable();
    }

    function deleteAttendanceActivity(actId, weekId = attendanceState?.activeWeekId) {
      if (!isAdmin() || !attendanceState) return;
      const currWeek = attendanceState.weeks.find(week => week.id === weekId);
      if (!currWeek) return;
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
      const calc = getAttendanceScopeData(calculateAttendanceData(attendanceState), attendanceServerFilter);
      const currWeek = getActiveWeek();
      const scopeName = attendanceServerFilter === "all" ? "Toàn Guild / Tất cả Server" : getServerNameById(attendanceServerFilter);

      let md = `📊 **BẢNG TỔNG KẾT CHẤM CÔNG & LƯƠNG • ${scopeName}**\n`;
      md += `🌐 **Phạm vi:** ${scopeName}\n`;
      md += `📅 **Tuần:** ${currWeek?.name || "Tuần hiện tại"}${currWeek?.dateRange ? ` (${currWeek.dateRange})` : ""}\n`;
      md += `🎯 Điều kiện nhận thưởng: ≥ ${calc.minimumParticipationPercent}%\n`;
      md += `💎 **Quỹ Kim Cương (DIAS):** ${calc.diasPool.toLocaleString("vi-VN")} DIAS (Hệ số: ${calc.diasRate.toFixed(2)})\n`;
      md += `💵 **Quỹ USDT:** ${calc.usdtPool.toLocaleString("vi-VN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT (Hệ số: ${calc.usdtRate.toFixed(4)})\n`;
      md += `⭐ **Tổng P.Point ${scopeName}:** ${formatPoints(calc.totalGuildPPoints)} P.Point\n`;
      md += `⭐ **Tổng Reward P.Point:** ${formatPoints(calc.totalEligiblePPoints)} P.Point\n`;
      md += `👥 **Tổng thành viên:** ${calc.membersCount} | **Hoạt động:** ${calc.activitiesCount} mục\n`;
      md += `─────────────────────────────────────────\n`;
      md += `\`\`\`\n`;
      md += `STT | Tên Thành Viên | Server | Lực Chiến | Hệ Số | Thưởng VT | % Tham Gia | P.Point thực tế | Reward P.Point | Điều kiện | DIAS | USDT\n`;
      md += `----+----------------+--------+-----------+-------+-----------+------------+----------------+----------------+-----------+------+------\n`;

      calc.membersCalc.forEach((m, idx) => {
        const stt = String(idx + 1).padEnd(3, " ");
        const name = String(m.name).padEnd(14, " ");
        const server = String(m.serverName || m.serverId || "").padEnd(6, " ");
        const cp = (formatCombatPowerInput(m.combatPower) || "—").padEnd(9, " ");
        const mult = (`x${m.multiplier}`).padEnd(5, " ");
        const bonus = ((m.bonusPercent || 0) > 0 ? `+${m.bonusPercent}%` : "—").padEnd(9, " ");
        const pct = (`${formatParticipationPercent(m.percent)}%`).padEnd(10, " ");
        const pPts = formatPoints(m.pPoints).padEnd(7, " ");
        const rewardPts = formatPoints(m.eligiblePPoints).padEnd(7, " ");
        const eligibility = m.eligible ? "✅ Đủ điều kiện" : "❌ Không đạt";
        const dias = String(m.dias).padEnd(5, " ");
        const usdt = m.usdt.toFixed(2).padEnd(5, " ");
        md += `${stt} | ${name} | ${server} | ${cp} | ${mult} | ${bonus} | ${pct} | ${pPts} | ${rewardPts} | ${eligibility} | ${dias} | ${usdt}\n`;
      });
      md += `\`\`\`\n`;
      md += `*Thành viên tham gia dưới ${calc.minimumParticipationPercent}% không nhận DIAS/USDT; P.Point thực tế vẫn được giữ nguyên.*`;
      if (md.length > 1900) {
        md += `\n\n⚠️ *Lưu ý: Bảng hiện có độ dài ${md.length} ký tự (vượt ngưỡng 2000 ký tự Discord). Nếu không gửi được, hãy chia nhỏ thành 2 tin nhắn khi dán.*`;
      }

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

      const cpBtn = document.getElementById("attCombatPowerBtn");
      if (cpBtn) cpBtn.style.display = adminMode ? "inline-flex" : "none";

      const roleBonusBtn = document.getElementById("attRoleBonusBtn");
      if (roleBonusBtn) roleBonusBtn.style.display = adminMode ? "inline-flex" : "none";

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
          if (hash === "boss-schedule") openTodayScheduleFromNavigation(false);
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
          setAttendanceServerFilter(e.target.value || "all");
        });
      }
      const serverSummary = document.getElementById("attServerSummary");
      if (serverSummary) {
        serverSummary.addEventListener("click", (event) => {
          const button = event.target.closest("button[data-server-scope]");
          if (!button) return;
          setAttendanceServerFilter(button.dataset.serverScope || "all");
        });
      }

      // Toolbar Buttons
      const addMemBtn = document.getElementById("attAddMemberBtn");
      if (addMemBtn) addMemBtn.addEventListener("click", () => openAttendanceMemberModal());

      const addActBtn = document.getElementById("attAddActivityBtn");
      if (addActBtn) addActBtn.addEventListener("click", () => openAttendanceActivityModal());

      const cpBtn = document.getElementById("attCombatPowerBtn");
      if (cpBtn) cpBtn.addEventListener("click", () => openAttendanceCombatPowerModal());

      const roleBonusBtn = document.getElementById("attRoleBonusBtn");
      if (roleBonusBtn) roleBonusBtn.addEventListener("click", () => openAttendanceRoleBonusModal());

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

      // Role Bonus Modal Events
      document.getElementById("closeAttRoleBonusModal")?.addEventListener("click", closeAttendanceRoleBonusModal);
      document.getElementById("attCancelRoleBonusBtn")?.addEventListener("click", closeAttendanceRoleBonusModal);
      document.getElementById("attSaveRoleBonusBtn")?.addEventListener("click", saveAttendanceRoleBonuses);
      document.getElementById("attAddRoleBonusRowBtn")?.addEventListener("click", () => addRoleBonusRow());
      document.getElementById("attResetRoleBonusBtn")?.addEventListener("click", () => {
        renderRoleBonusRows(DEFAULT_ROLE_BONUSES);
        showToast("Đã khôi phục danh sách vai trò mặc định.");
      });

      // Member Live Preview & Color Picker events
      document.getElementById("attMemberNameInput")?.addEventListener("input", updateMemberModalPreview);
      document.getElementById("attMemberRoleInput")?.addEventListener("input", updateMemberModalPreview);
      document.getElementById("attMemberRoleBonusInput")?.addEventListener("input", updateMemberModalPreview);

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
          updateAttendanceActivityPointPreview();
        });
      });
      document.getElementById("attActivityPointsInput")?.addEventListener("input", updateAttendanceActivityPointPreview);

      // Image OCR attendance modal
      document.getElementById("closeAttOcrModal")?.addEventListener("click", closeAttendanceOcrModal);
      document.getElementById("attOcrCancelBtn")?.addEventListener("click", closeAttendanceOcrModal);
      document.getElementById("attOcrApplyBtn")?.addEventListener("click", applyAttendanceOcrReview);
      document.getElementById("closeAttEvidenceModal")?.addEventListener("click", closeAttendanceEvidenceModal);
      document.getElementById("attEvidenceCloseBtn")?.addEventListener("click", closeAttendanceEvidenceModal);
      document.getElementById("attOcrFileInput")?.addEventListener("change", event => {
        const files = [...(event.target.files || [])];
        if (files.length) queueAttendanceOcrFiles(files);
      });
      document.addEventListener("paste", event => {
        const files = [...(event.clipboardData?.items || [])]
          .filter(item => item.kind === "file" && String(item.type || "").startsWith("image/"))
          .map(item => item.getAsFile())
          .filter(Boolean);
        if (!files.length) return;
        if (document.getElementById("attOcrModal")?.classList.contains("open")) {
          event.preventDefault();
          queueAttendanceOcrFiles(files);
          showToast(`📋 Đã dán ${files.length} ảnh chấm công từ Clipboard.`);
          return;
        }
        if (document.getElementById("attCombatPowerModal")?.classList.contains("open")) {
          event.preventDefault();
          analyzeAttendanceCpImages(files);
          showToast(`📋 Đã dán ${files.length} ảnh Lực Chiến từ Clipboard.`);
        }
      });
      const ocrDrop = document.querySelector(".att-ocr-drop");
      if (ocrDrop) {
        ["dragenter", "dragover"].forEach(type => ocrDrop.addEventListener(type, event => {
          event.preventDefault();
          ocrDrop.classList.add("is-dragging");
        }));
        ["dragleave", "drop"].forEach(type => ocrDrop.addEventListener(type, event => {
          event.preventDefault();
          ocrDrop.classList.remove("is-dragging");
          if (type === "drop") queueAttendanceOcrFiles(event.dataTransfer?.files || []);
        }));
      }

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

      // Combat Power Modal Events
      document.getElementById("closeAttCombatPowerModal")?.addEventListener("click", closeAttendanceCombatPowerModal);
      document.getElementById("attCancelCombatPowerBtn")?.addEventListener("click", closeAttendanceCombatPowerModal);
      document.getElementById("attCpSaveOnlyBtn")?.addEventListener("click", () => saveCombatPowerModalData(false));
      document.getElementById("attCpApplyTiersBtn")?.addEventListener("click", () => saveCombatPowerModalData(true));
      document.getElementById("attAddCpTierBtn")?.addEventListener("click", () => {
        const currentTiers = collectCpTiersFromModal();
        const prevRank = currentTiers.length > 1 ? (currentTiers[currentTiers.length - 2]?.upToRank || 5) : 5;
        const newRank = prevRank + 5;
        currentTiers.splice(currentTiers.length - 1, 0, { upToRank: newRank, multiplier: 1.5, label: `Top ${newRank}` });
        renderCpTiersBody(currentTiers);
      });
      document.getElementById("attResetCpTiersBtn")?.addEventListener("click", () => {
        renderCpTiersBody(JSON.parse(JSON.stringify(DEFAULT_CP_TIERS)));
        showToast("Đã khôi phục mốc mẫu Lực Chiến.");
      });
      document.getElementById("attAddManagementRoleBtn")?.addEventListener("click", () => addManagementRoleMultiplier());
      document.getElementById("attResetManagementRolesBtn")?.addEventListener("click", () => {
        renderManagementRoleMultipliers(JSON.parse(JSON.stringify(DEFAULT_MANAGEMENT_ROLE_MULTIPLIERS)));
        showToast("Đã khôi phục hệ số chức danh quản lý mặc định.");
      });
      document.getElementById("attCpModalServerSelect")?.addEventListener("change", (e) => {
        renderCpMembersTableBody(e.target.value);
      });
      document.getElementById("attCpTogglePasteBtn")?.addEventListener("click", () => {
        const wrap = document.getElementById("attCpPasteWrap");
        if (wrap) wrap.style.display = wrap.style.display === "none" ? "block" : "none";
      });
      document.getElementById("attCpApplyPasteBtn")?.addEventListener("click", applyCombatPowerPaste);
      document.getElementById("attCpImageInput")?.addEventListener("change", event => {
        const files = [...(event.target.files || [])];
        if (files.length) analyzeAttendanceCpImages(files);
        event.target.value = "";
      });
      document.getElementById("attCpApplyImageResultsBtn")?.addEventListener("click", applyAttendanceCpImageReview);
      const cpImageDrop = document.querySelector(".att-cp-image-drop");
      if (cpImageDrop) {
        ["dragenter", "dragover"].forEach(type => cpImageDrop.addEventListener(type, event => {
          event.preventDefault();
          cpImageDrop.classList.add("is-dragging");
        }));
        ["dragleave", "drop"].forEach(type => cpImageDrop.addEventListener(type, event => {
          event.preventDefault();
          cpImageDrop.classList.remove("is-dragging");
          if (type === "drop") analyzeAttendanceCpImages(event.dataTransfer?.files || []);
        }));
      }

      // Backdrop dismiss
      ["attMemberModal", "attActivityModal", "attOcrModal", "attEvidenceModal", "attWeekModal", "attExportModal", "attRoleBonusModal", "attCombatPowerModal"].forEach(modalId => {
        const modalEl = document.getElementById(modalId);
        if (modalEl) {
          modalEl.addEventListener("click", (e) => {
            if (e.target === modalEl) {
              if (modalId === "attEvidenceModal") closeAttendanceEvidenceModal();
              else {
                modalEl.classList.remove("open");
                syncModalScrollLock();
              }
            }
          });
        }
      });
    }


    function suppressBusinessAutofill(root = document) {
      root.querySelectorAll('input:not([type="password"]), textarea, form').forEach(field => {
        if (field.closest('#authModal')) return;
        field.setAttribute('autocomplete', 'off');
        field.setAttribute('data-lpignore', 'true');
        field.setAttribute('data-1p-ignore', 'true');
        field.setAttribute('data-bwignore', 'true');
        if (field.tagName === 'INPUT') field.setAttribute('autocorrect', 'off');
      });
    }
    suppressBusinessAutofill();
    new MutationObserver(() => suppressBusinessAutofill()).observe(document.body, { childList: true, subtree: true });

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
      if (initialHash === "boss-schedule") openTodayScheduleFromNavigation(false);
    }

    if (!localStorage.getItem(STORAGE_ROLE_KEY)) {
      openAuthModal("choose");
    }
    initRealtimeSync();
    window.setInterval(render, 1000);

    // Tu dong kiem tra va refresh neu co phien ban web moi (tranh treo tab chay code cu)
    const CURRENT_APP_VERSION = "2026.10.31.v20-unsynced-write-status";
    window.setInterval(async () => {
      try {
        const updateUrl = (window.location?.pathname || "/") + "?v=" + Date.now();
        const res = await fetch(updateUrl, { cache: "no-store", method: "HEAD" });
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
