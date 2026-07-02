const config = window.SUPABASE_CONFIG || {};
const supabaseClient = window.supabase?.createClient(config.url, config.anonKey);

const lineStatus = document.querySelector("#lineStatus");
const messageCard = document.querySelector("#messageCard");
const registerView = document.querySelector("#registerView");
const pendingView = document.querySelector("#pendingView");
const dashboardView = document.querySelector("#dashboardView");
const teacherRegisterForm = document.querySelector("#teacherRegisterForm");
const teacherNameInput = document.querySelector("#teacherNameInput");
const teacherPhoneInput = document.querySelector("#teacherPhoneInput");
const branchSelect = document.querySelector("#branchSelect");
const registerButton = document.querySelector("#registerButton");
const refreshButton = document.querySelector("#refreshButton");
const reloadDashboardButton = document.querySelector("#reloadDashboardButton");
const pendingEyebrow = document.querySelector("#pendingEyebrow");
const pendingTitle = document.querySelector("#pendingTitle");
const pendingText = document.querySelector("#pendingText");
const teacherBranchLabel = document.querySelector("#teacherBranchLabel");
const teacherNameLabel = document.querySelector("#teacherNameLabel");
const teacherMetaLabel = document.querySelector("#teacherMetaLabel");
const todayDateLabel = document.querySelector("#todayDateLabel");
const todayClassTotal = document.querySelector("#todayClassTotal");
const todayRecordPending = document.querySelector("#todayRecordPending");
const todayReminderPending = document.querySelector("#todayReminderPending");
const todayClassList = document.querySelector("#todayClassList");
const todayActionList = document.querySelector("#todayActionList");
const reminderDateLabel = document.querySelector("#reminderDateLabel");
const reminderTotal = document.querySelector("#reminderTotal");
const reminderPending = document.querySelector("#reminderPending");
const reminderSent = document.querySelector("#reminderSent");
const reminderList = document.querySelector("#reminderList");
const sessionList = document.querySelector("#sessionList");
const shareSheet = document.querySelector("#shareSheet");
const shareEyebrow = document.querySelector("#shareEyebrow");
const shareTitle = document.querySelector("#shareTitle");
const shareSubtitle = document.querySelector("#shareSubtitle");
const shareCanvas = document.querySelector("#shareCanvas");
const shareImagePreview = document.querySelector("#shareImagePreview");
const saveCardHint = document.querySelector("#saveCardHint");
const shareText = document.querySelector("#shareText");
const copyShareTextButton = document.querySelector("#copyShareTextButton");
const downloadShareCardButton = document.querySelector("#downloadShareCardButton");
const markReminderSentButton = document.querySelector("#markReminderSentButton");
const confirmSessionSaveButton = document.querySelector("#confirmSessionSaveButton");
const shareSaveStatus = document.querySelector("#shareSaveStatus");
const recordSheet = document.querySelector("#recordSheet");
const recordForm = document.querySelector("#recordForm");
const recordTitle = document.querySelector("#recordTitle");
const recordSubtitle = document.querySelector("#recordSubtitle");
const sessionNumberInput = document.querySelector("#sessionNumberInput");
const sessionDateInput = document.querySelector("#sessionDateInput");
const lessonTitleInput = document.querySelector("#lessonTitleInput");
const teacherCommentInput = document.querySelector("#teacherCommentInput");
const sessionPhotoInput = document.querySelector("#sessionPhotoInput");
const photoPreview = document.querySelector("#photoPreview");
const lessonTitleCounter = document.querySelector("#lessonTitleCounter");
const teacherCommentCounter = document.querySelector("#teacherCommentCounter");
const strengthChoiceCounter = document.querySelector("#strengthChoiceCounter");
const strengthChoiceGroup = document.querySelector("#strengthChoiceGroup");
const recordConfirmActions = document.querySelector("#recordConfirmActions");
const copySessionDraftButton = document.querySelector("#copySessionDraftButton");
const saveSessionButton = document.querySelector("#saveSessionButton");
const photoCropModal = document.querySelector("#photoCropModal");
const cropStage = document.querySelector("#cropStage");
const cropImage = document.querySelector("#cropImage");
const cropZoomInput = document.querySelector("#cropZoomInput");
const resetCropButton = document.querySelector("#resetCropButton");
const confirmCropButton = document.querySelector("#confirmCropButton");

let lineProfile = null;
let lineContext = {};
let lineUserId = "";
let branches = [];
let portalData = null;
let activeReminder = null;
let activeSessionEnrollment = null;
let activeShareData = null;
let activeShareCardUrl = "";
let activeShareCardBlob = null;
let activePhotoObjectUrl = "";
let activeCroppedPhotoUrl = "";
let activeCroppedPhotoBlob = null;
let activeCroppedPhotoName = "";
let pendingSessionInput = null;
let cropState = null;
let selectedStrengthChoices = [];

const weekdayLabels = ["วันอาทิตย์", "วันจันทร์", "วันอังคาร", "วันพุธ", "วันพฤหัสบดี", "วันศุกร์", "วันเสาร์"];
const sessionFieldLimits = {
  lessonTitle: 64,
  teacherComment: 115,
  strengthChoices: 5
};
const courseMeta = {
  robot: { label: "โรบอท + โค้ดดิ้ง", icon: "🤖", color: "#eaf7fa" },
  art: { label: "Creative Art", icon: "🎨", color: "#fff0e5" },
  creative_art: { label: "Creative Art", icon: "🎨", color: "#fff0e5" },
  water_color: { label: "Water Color", icon: "💧", color: "#eaf7fa" },
  clay: { label: "ปั้นดินเบา (CLAY)", icon: "🧱", color: "#fff1df" }
};

const afterClassAssets = {
  logo: "assets/after-class/11_logo2.svg?v=20260630-after-class-web-card",
  palette: "assets/after-class/01_icon_palette.svg?v=20260630-after-class-web-card",
  pencil: "assets/after-class/02_icon_pencil_cute.svg?v=20260630-after-class-web-card",
  flower: "assets/after-class/03_icon_flower_small.svg?v=20260630-after-class-web-card",
  star: "assets/after-class/04_deco_star_yellow.svg?v=20260630-after-class-web-card",
  heartOutline: "assets/after-class/05_deco_heart_green_outline.svg?v=20260630-after-class-web-card",
  heartFill: "assets/after-class/06_deco_heart_orange_fill.svg?v=20260630-after-class-web-card",
  squiggle: "assets/after-class/07_deco_squiggle_green.svg?v=20260630-after-class-web-card",
  spark: "assets/after-class/08_deco_spark_green.svg?v=20260630-after-class-web-card",
  leaf: "assets/after-class/09_deco_leaf_pair.svg?v=20260630-after-class-web-card",
  placeholder: "assets/after-class/10_photo_placeholder_square.svg?v=20260630-after-class-web-card"
};

const sessionSummaryAssets = {
  logo: "assets/card/logo-card.svg?v=20260630-logo-split",
  sun: "assets/card/deco_sun_rays_yellow.png",
  location: "assets/card/icon_location.png",
  star: "assets/card/doodle_sparkle_yellow.png",
  teacherHeart: "assets/card/icon_teacher_note_heart.png",
  heart: "assets/card/icon_heart.png",
  trophy: "assets/card/icon_trophy.png",
  book: "assets/card/icon_book.png",
  course: {
    robot: "assets/card/icon_robot.png",
    art: "assets/card/3.png",
    creative_art: "assets/card/3.png",
    water_color: "assets/card/icon_watercolor_set.png",
    clay: "assets/card/icon_clay.png"
  }
};

const afterClassWowAssets = {
  version: "20260701-parent-wow-card",
  logoWord: "assets/after-class-wow/logo%20word.svg?v=20260701-parent-wow-card",
  toko: "assets/after-class-wow/toko.png?v=20260701-parent-wow-card",
  poppy: "assets/after-class-wow/poppy.png?v=20260701-parent-wow-card",
  pair: "assets/after-class-wow/pair.png?v=20260701-parent-wow-card",
  icons: {
    basket: "assets/after-class-wow/basket.svg?v=20260701-parent-wow-card",
    blink: "assets/after-class-wow/blink.svg?v=20260701-parent-wow-card",
    clay: "assets/after-class-wow/clay.svg?v=20260701-parent-wow-card",
    creativeArt: "assets/after-class-wow/creative%20art.svg?v=20260701-parent-wow-card",
    ear: "assets/after-class-wow/ear.svg?v=20260701-parent-wow-card",
    happy: "assets/after-class-wow/happy.svg?v=20260701-parent-wow-card",
    heart: "assets/after-class-wow/heart.svg?v=20260701-parent-wow-card",
    jigsaw: "assets/after-class-wow/jigsaw.svg?v=20260701-parent-wow-card",
    light: "assets/after-class-wow/light.svg?v=20260701-parent-wow-card",
    robot: "assets/after-class-wow/robot.svg?v=20260701-parent-wow-card",
    star: "assets/after-class-wow/star.svg?v=20260701-parent-wow-card",
    tape: "assets/after-class-wow/tape.svg?v=20260701-parent-wow-card",
    trophy: "assets/after-class-wow/trophy.svg?v=20260701-parent-wow-card",
    waterColor: "assets/after-class-wow/water%20color.svg?v=20260701-parent-wow-card"
  }
};

const strengthChoiceConfigs = {
  robot: [
    { icon: "👂", text: "ตั้งใจฟังอธิบาย" },
    { icon: "🧩", text: "ต่อชิ้นส่วนได้ถูกต้อง" },
    { icon: "💡", text: "คิดลองเอง" },
    { icon: "🤖", text: "แก้ปัญหาเป็นขั้นตอน" },
    { icon: "📦", text: "เก็บของเรียบร้อย" },
    { icon: "😊", text: "มีความสุขในการเรียน" },
    { icon: "🔍", text: "สังเกตดี" },
    { icon: "🛠️", text: "ประกอบอย่างตั้งใจ" },
    { icon: "🗣️", text: "กล้าเล่าเหตุผล" },
    { icon: "🤝", text: "ทำงานร่วมกับครูดี" }
  ],
  creative_art: [
    { icon: "👂", text: "ตั้งใจฟังอธิบาย" },
    { icon: "🎨", text: "เลือกสีได้มั่นใจ" },
    { icon: "💡", text: "เล่าไอเดียเอง" },
    { icon: "🧩", text: "ทำตามขั้นตอนได้ดี" },
    { icon: "📦", text: "เก็บของเรียบร้อย" },
    { icon: "😊", text: "มีความสุขในการเรียน" },
    { icon: "✏️", text: "จับดินสอดีขึ้น" },
    { icon: "🌈", text: "กล้าลองสีใหม่" },
    { icon: "🔎", text: "สังเกตรายละเอียด" },
    { icon: "⭐", text: "ตั้งใจจนเสร็จ" }
  ],
  art: [
    { icon: "👂", text: "ตั้งใจฟังอธิบาย" },
    { icon: "🎨", text: "เลือกสีได้มั่นใจ" },
    { icon: "💡", text: "เล่าไอเดียเอง" },
    { icon: "🧩", text: "ทำตามขั้นตอนได้ดี" },
    { icon: "📦", text: "เก็บของเรียบร้อย" },
    { icon: "😊", text: "มีความสุขในการเรียน" },
    { icon: "✏️", text: "จับดินสอดีขึ้น" },
    { icon: "🌈", text: "กล้าลองสีใหม่" },
    { icon: "🔎", text: "สังเกตรายละเอียด" },
    { icon: "⭐", text: "ตั้งใจจนเสร็จ" }
  ],
  water_color: [
    { icon: "👂", text: "ตั้งใจฟังอธิบาย" },
    { icon: "🎨", text: "คุมน้ำหนักสีได้ดี" },
    { icon: "💡", text: "ลองผสมสีเอง" },
    { icon: "🧩", text: "สังเกตรายละเอียดเก่ง" },
    { icon: "📦", text: "เก็บของเรียบร้อย" },
    { icon: "😊", text: "มีความสุขในการเรียน" },
    { icon: "💧", text: "ควบคุมน้ำดี" },
    { icon: "🖌️", text: "ใช้พู่กันดีขึ้น" },
    { icon: "🌈", text: "ไล่สีสวย" },
    { icon: "⭐", text: "ตั้งใจจนเสร็จ" }
  ],
  clay: [
    { icon: "👂", text: "ตั้งใจฟังอธิบาย" },
    { icon: "🧱", text: "ควบคุมรูปทรงได้ดี" },
    { icon: "💡", text: "ลองแก้งานเอง" },
    { icon: "🧩", text: "เก็บรายละเอียดตั้งใจ" },
    { icon: "📦", text: "เก็บของเรียบร้อย" },
    { icon: "😊", text: "มีความสุขในการเรียน" },
    { icon: "🤲", text: "ใช้มือคล่องขึ้น" },
    { icon: "🔎", text: "สังเกตรูปทรงดี" },
    { icon: "🌟", text: "ตกแต่งได้น่ารัก" },
    { icon: "⭐", text: "ตั้งใจจนเสร็จ" }
  ]
};

function normalizeText(value) {
  return String(value || "").trim();
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setMessage(message, isError = false) {
  if (!messageCard) return;
  messageCard.hidden = !message;
  messageCard.textContent = message || "";
  messageCard.classList.toggle("error", isError);
}

function setSheetStatus(message, isError = false) {
  if (!shareSaveStatus) return;
  shareSaveStatus.hidden = !message;
  shareSaveStatus.textContent = message || "";
  shareSaveStatus.classList.toggle("error", isError);
}

function showOnly(view) {
  [registerView, pendingView, dashboardView].forEach((element) => {
    if (element) element.hidden = element !== view;
  });
}

function toLocalDateInputValue(date = new Date()) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function addDays(date, days) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function formatThaiDate(dateInput) {
  const date = new Date(`${dateInput}T00:00:00`);
  return date.toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

function normalizeTimeLabel(value) {
  if (!value) return "";
  return String(value).slice(0, 5);
}

function getCourseMeta(type) {
  return courseMeta[type] || courseMeta.creative_art;
}

function getCourseLabel(item = {}) {
  const meta = getCourseMeta(item.course_type);
  const levelLabel = normalizeText(item.level_label);
  if (levelLabel && levelLabel.toLowerCase() !== meta.label.toLowerCase()) return `${meta.label} · ${levelLabel}`;
  return meta.label;
}

function getStudentName(item = {}) {
  return normalizeText(item.student_nickname) ||
    normalizeText(item.student_name) ||
    "น้อง";
}

function getChildLabel(item = {}) {
  const name = getStudentName(item);
  return name.startsWith("น้อง") ? name : `น้อง${name}`;
}

function getScheduleLabel(item = {}) {
  const time = [normalizeTimeLabel(item.class_start_time), normalizeTimeLabel(item.class_end_time)]
    .filter(Boolean)
    .join("-");
  if (!time) return "ยังไม่ระบุเวลา";
  return time;
}

function getNextSessionText(item = {}) {
  const completed = Number(item.completed_sessions || 0);
  const total = Number(item.total_sessions || 0);
  const next = total ? Math.min(completed + 1, total) : completed + 1;
  return total ? `ครั้งที่ ${next}/${total}` : `ครั้งที่ ${next}`;
}

function getCompletedText(item = {}) {
  const completed = Number(item.completed_sessions || 0);
  const total = Number(item.total_sessions || 0);
  return total ? `${completed}/${total} ครั้ง` : `${completed} ครั้ง`;
}

function getTodayDateValue() {
  return portalData?.today_date || toLocalDateInputValue(new Date());
}

function getTodayWeekday() {
  return new Date(`${getTodayDateValue()}T00:00:00`).getDay();
}

function getTodayScheduledEnrollments() {
  const todayWeekday = getTodayWeekday();
  return (portalData?.today_enrollments || [])
    .filter((item) => Number(item.class_weekday) === todayWeekday);
}

function hasRecordedToday(item = {}) {
  if (typeof item.today_session_recorded === "boolean") return item.today_session_recorded;
  if (item.last_session_date) return item.last_session_date === getTodayDateValue();
  return false;
}

function isCourseDone(item = {}) {
  const completed = Number(item.completed_sessions || 0);
  const total = Number(item.total_sessions || 0);
  return Boolean(total && completed >= total);
}

async function initLine() {
  const params = new URLSearchParams(window.location.search);
  const testLineUserId = normalizeText(params.get("line_user_id"));
  const liffId = normalizeText(config.liffTeacherId);

  if (testLineUserId) {
    lineUserId = testLineUserId;
    lineStatus.textContent = "โหมดทดสอบด้วย line_user_id";
    return;
  }

  if (!liffId) {
    lineStatus.textContent = "ยังไม่ได้ตั้งค่า LIFF ID สำหรับครู";
    setMessage("เพิ่ม liffTeacherId ใน supabase-config.js ก่อนใช้งานจริง หรือทดสอบด้วย ?line_user_id=...", true);
    return;
  }

  if (!window.liff) {
    lineStatus.textContent = "ไม่พบ LINE LIFF SDK";
    setMessage("กรุณาเปิดผ่าน LINE OA หรือเช็คการโหลด LIFF SDK", true);
    return;
  }

  await window.liff.init({ liffId });
  if (!window.liff.isLoggedIn()) {
    window.liff.login({ redirectUri: window.location.href });
    return;
  }

  lineProfile = await window.liff.getProfile();
  lineContext = window.liff.getContext?.() || {};
  lineUserId = lineProfile.userId;
  lineStatus.textContent = `เชื่อมต่อ LINE: ${lineProfile.displayName || "LINE user"}`;
  teacherNameInput.value = teacherNameInput.value || lineProfile.displayName || "";
}

async function loadBranches() {
  const { data, error } = await supabaseClient
    .from("branches")
    .select("id,name,code,province,is_active")
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) {
    branchSelect.innerHTML = '<option value="">โหลดสาขาไม่สำเร็จ</option>';
    throw error;
  }

  branches = data || [];
  branchSelect.innerHTML = [
    '<option value="">เลือกสาขาที่สอน</option>',
    ...branches.map((branch) => `
      <option value="${branch.id}">
        ${escapeHtml(branch.name)}${branch.code ? ` (${escapeHtml(branch.code)})` : ""}
      </option>
    `)
  ].join("");
}

async function loadPortal() {
  if (!lineUserId) {
    showOnly(registerView);
    return;
  }

  const tomorrow = toLocalDateInputValue(addDays(new Date(), 1));
  const { data, error } = await supabaseClient.rpc("get_teacher_liff_portal", {
    p_line_user_id: lineUserId,
    p_target_date: tomorrow
  });

  if (error) {
    setMessage(`โหลดข้อมูลครูไม่สำเร็จ: ${error.message} กรุณารัน supabase-teacher-liff-portal.sql`, true);
    showOnly(registerView);
    return;
  }

  portalData = data || {};
  if (portalData.status === "not_registered") {
    showOnly(registerView);
    return;
  }

  if (portalData.status !== "approved") {
    renderPending(portalData);
    showOnly(pendingView);
    return;
  }

  renderDashboard();
  showOnly(dashboardView);
}

function renderPending(data = {}) {
  const profile = data.profile || {};
  const branch = data.branch || {};
  pendingEyebrow.textContent = profile.status === "rejected"
    ? "ไม่อนุมัติ"
    : profile.status === "suspended"
      ? "พักสิทธิ์"
      : "รออนุมัติ";
  pendingTitle.textContent = profile.status === "rejected"
    ? "คำขอถูกปฏิเสธ"
    : profile.status === "suspended"
      ? "บัญชีถูกพักสิทธิ์"
      : "ส่งคำขอแล้ว";
  pendingText.textContent = profile.status === "rejected"
    ? (profile.rejection_reason || "กรุณาติดต่อแอดมินสาขาเพื่อสมัครใหม่")
    : `สาขา ${branch.name || "-"} กำลังรอแอดมินอนุมัติ`;
}

function renderDashboard() {
  const profile = portalData.profile || {};
  const branch = portalData.branch || {};
  const reminders = portalData.reminders || [];
  const todayItems = getTodayScheduledEnrollments();
  const pendingRecords = todayItems.filter((item) => !hasRecordedToday(item) && !isCourseDone(item));
  const targetDate = portalData.target_date || toLocalDateInputValue(addDays(new Date(), 1));
  const weekday = Number(portalData.target_weekday ?? new Date(`${targetDate}T00:00:00`).getDay());
  const sent = reminders.filter((item) => item.reminder_sent).length;
  const reminderPendingCount = Math.max(reminders.length - sent, 0);

  teacherBranchLabel.textContent = `สาขา ${branch.name || "-"}`;
  teacherNameLabel.textContent = profile.teacher_name || profile.line_display_name || "คุณครู";
  teacherMetaLabel.textContent = `${todayItems.length} คิววันนี้ · ${pendingRecords.length} รอบันทึก · ${reminderPendingCount} ต้องแจ้งพรุ่งนี้`;
  todayDateLabel.textContent = `${weekdayLabels[getTodayWeekday()]} ${formatThaiDate(getTodayDateValue())}`;
  todayClassTotal.textContent = todayItems.length;
  todayRecordPending.textContent = pendingRecords.length;
  todayReminderPending.textContent = reminderPendingCount;
  reminderDateLabel.textContent = `${weekdayLabels[weekday]} ${formatThaiDate(targetDate)}`;
  reminderTotal.textContent = reminders.length;
  reminderSent.textContent = sent;
  reminderPending.textContent = reminderPendingCount;

  renderTodayCenter(todayItems, reminders);
  renderReminderList(reminders);
  renderSessionList(portalData.today_enrollments || []);
}

function renderTodayCenter(todayItems = [], reminders = []) {
  renderTodayClassList(todayItems);
  renderTodayActionList(todayItems, reminders);
}

function renderTodayClassList(items = []) {
  if (!todayClassList) return;
  if (!items.length) {
    todayClassList.innerHTML = '<div class="empty-box">วันนี้ยังไม่มีคิวเรียนตามตารางประจำ</div>';
    return;
  }

  todayClassList.innerHTML = items.map((item) => {
    const meta = getCourseMeta(item.course_type);
    const recorded = hasRecordedToday(item);
    const done = isCourseDone(item);
    return `
      <article class="mobile-card today-card ${recorded ? "is-sent" : ""}">
        <div class="card-top">
          <span class="course-icon" style="background:${meta.color}">${meta.icon}</span>
          <div>
            <h3>${escapeHtml(getChildLabel(item))}</h3>
            <p>${escapeHtml(getCourseLabel(item))}</p>
          </div>
        </div>
        <div class="meta-row">
          <span class="pill green">${escapeHtml(getScheduleLabel(item))}</span>
          <span class="pill">${escapeHtml(getNextSessionText(item))}</span>
          <span class="pill ${recorded ? "green" : "orange"}">${recorded ? "บันทึกแล้ววันนี้" : "รอบันทึก"}</span>
        </div>
        <div class="card-actions">
          <button class="primary-button full" type="button" data-open-session="${item.id}" ${recorded || done ? "disabled" : ""}>
            ${done ? "จบคอร์สแล้ว" : recorded ? "บันทึกแล้ว" : "บันทึกหลังเรียน"}
          </button>
        </div>
      </article>
    `;
  }).join("");
}

function renderTodayActionList(todayItems = [], reminders = []) {
  if (!todayActionList) return;
  const pendingRecords = todayItems.filter((item) => !hasRecordedToday(item) && !isCourseDone(item));
  const pendingReminders = reminders.filter((item) => !item.reminder_sent);
  const actions = [];

  pendingRecords.slice(0, 4).forEach((item) => {
    const meta = getCourseMeta(item.course_type);
    actions.push(`
      <article class="task-card">
        <span class="task-icon" style="background:${meta.color}">${meta.icon}</span>
        <div>
          <strong>บันทึกหลังเรียน ${escapeHtml(getChildLabel(item))}</strong>
          <p>${escapeHtml(getCourseLabel(item))} · ${escapeHtml(getScheduleLabel(item))}</p>
        </div>
        <button type="button" data-open-session="${item.id}">บันทึก</button>
      </article>
    `);
  });

  pendingReminders.slice(0, Math.max(0, 4 - actions.length)).forEach((item) => {
    const meta = getCourseMeta(item.course_type);
    actions.push(`
      <article class="task-card reminder-task">
        <span class="task-icon" style="background:${meta.color}">${meta.icon}</span>
        <div>
          <strong>แจ้งเตือนพรุ่งนี้ ${escapeHtml(getChildLabel(item))}</strong>
          <p>${escapeHtml(getCourseLabel(item))} · ${escapeHtml(getScheduleLabel(item))}</p>
        </div>
        <button type="button" data-open-reminder="${item.id}">การ์ด</button>
      </article>
    `);
  });

  if (!actions.length) {
    todayActionList.innerHTML = '<div class="empty-box">งานสำคัญวันนี้เรียบร้อยแล้ว</div>';
    return;
  }
  todayActionList.innerHTML = actions.join("");
}

function renderReminderList(items = []) {
  if (!items.length) {
    reminderList.innerHTML = '<div class="empty-box">พรุ่งนี้ยังไม่มีคิวที่ต้องแจ้งเตือน</div>';
    return;
  }

  reminderList.innerHTML = items.map((item) => {
    const meta = getCourseMeta(item.course_type);
    const sent = Boolean(item.reminder_sent);
    return `
      <article class="mobile-card ${sent ? "is-sent" : ""}">
        <div class="card-top">
          <span class="course-icon" style="background:${meta.color}">${meta.icon}</span>
          <div>
            <h3>${escapeHtml(getChildLabel(item))}</h3>
            <p>${escapeHtml(getCourseLabel(item))}</p>
          </div>
        </div>
        <div class="meta-row">
          <span class="pill green">${escapeHtml(getScheduleLabel(item))}</span>
          <span class="pill">${escapeHtml(getNextSessionText(item))}</span>
          <span class="pill ${sent ? "green" : "orange"}">${sent ? "แจ้งแล้ว" : "รอแจ้ง"}</span>
        </div>
        <div class="meta-row">
          <span class="pill">ผู้ปกครอง ${escapeHtml(item.parent_name || "-")}</span>
          ${item.parent_phone ? `<span class="pill">${escapeHtml(item.parent_phone)}</span>` : ""}
          ${item.line_display_name ? `<span class="pill">LINE ${escapeHtml(item.line_display_name)}</span>` : ""}
        </div>
        <div class="card-actions">
          <button class="ghost-button" type="button" data-open-reminder="${item.id}">สร้างการ์ด</button>
          <button class="primary-button" type="button" data-mark-reminder="${item.id}" ${sent ? "disabled" : ""}>แจ้งแล้ว</button>
        </div>
      </article>
    `;
  }).join("");
}

function renderSessionList(items = []) {
  if (!items.length) {
    sessionList.innerHTML = '<div class="empty-box">ยังไม่มีคอร์สที่เปิดสิทธิ์ในสาขานี้</div>';
    return;
  }

  sessionList.innerHTML = items.map((item) => {
    const meta = getCourseMeta(item.course_type);
    const completed = Number(item.completed_sessions || 0);
    const total = Number(item.total_sessions || 0);
    const isDone = total && completed >= total;
    return `
      <article class="mobile-card">
        <div class="card-top">
          <span class="course-icon" style="background:${meta.color}">${meta.icon}</span>
          <div>
            <h3>${escapeHtml(getChildLabel(item))}</h3>
            <p>${escapeHtml(getCourseLabel(item))}</p>
          </div>
        </div>
        <div class="meta-row">
          <span class="pill green">${escapeHtml(getCompletedText(item))}</span>
          <span class="pill">${escapeHtml(getScheduleLabel(item))}</span>
          <span class="pill">${escapeHtml(item.branch_name || "")}</span>
        </div>
        <div class="card-actions">
          <button class="primary-button full" type="button" data-open-session="${item.id}" ${isDone ? "disabled" : ""}>
            ${isDone ? "จบคอร์สแล้ว" : "บันทึกหลังเรียน"}
          </button>
        </div>
      </article>
    `;
  }).join("");
}

function buildReminderText(item) {
  const targetDate = portalData?.target_date || toLocalDateInputValue(addDays(new Date(), 1));
  const weekday = Number(portalData?.target_weekday ?? new Date(`${targetDate}T00:00:00`).getDay());
  return [
    `แจ้งเตือนคอร์สเรียนของ${getChildLabel(item)}`,
    "",
    `พรุ่งนี้ (${weekdayLabels[weekday]} ${formatThaiDate(targetDate)}) มีเรียน ${getCourseLabel(item)} ${getNextSessionText(item)}`,
    `เวลา ${getScheduleLabel(item)}${item.branch_name ? ` ที่สาขา ${item.branch_name}` : ""}`,
    "",
    "หากไม่สะดวกหรือต้องการเปลี่ยนวันและเวลา แจ้งได้เลยนะคะ",
    "",
    "Toko & Poppy"
  ].join("\n");
}

function buildSessionText(data) {
  const sessionText = data.totalSessions
    ? `ครั้งที่ ${data.sessionNumber}/${data.totalSessions}`
    : `ครั้งที่ ${data.sessionNumber}`;
  return [
    `สรุปวันนี้ของ${data.childLabel}`,
    `${data.courseIcon} ${data.courseName}`,
    `วันที่ ${formatThaiDate(data.sessionDate)} · ${sessionText}`,
    data.lessonTitle ? `บทเรียนวันนี้: ${data.lessonTitle}` : "",
    data.teacherComment ? `คอมเมนต์คุณครู: ${data.teacherComment}` : "",
    data.strengthText ? `สิ่งที่ทำได้ดี: ${data.strengthText}` : "",
    data.totalSessions ? `คงเหลือ ${data.remainingAfter} ครั้ง` : "",
    "ขอบคุณค่ะ/ครับ"
  ].filter(Boolean).join("\n");
}

function getSessionStrengthText(data = {}) {
  const courseType = data.courseType || data.course_type || "creative_art";
  const choices = Array.isArray(data.strengthChoices) && data.strengthChoices.length
    ? data.strengthChoices
    : getDefaultStrengthChoices(courseType);
  return choices.map((choice) => choice.text || choice).filter(Boolean).join(" · ");
}

function getStrengthOptions(courseType = "creative_art") {
  return strengthChoiceConfigs[courseType] || strengthChoiceConfigs.creative_art;
}

function getDefaultStrengthChoices(courseType = "creative_art") {
  return getStrengthOptions(courseType).slice(0, sessionFieldLimits.strengthChoices);
}

function getSelectedStrengthText() {
  return selectedStrengthChoices.map((choice) => choice.text).filter(Boolean).join(" · ");
}

function updateCharacterCounters() {
  if (lessonTitleCounter && lessonTitleInput) {
    lessonTitleCounter.textContent = `${Array.from(lessonTitleInput.value || "").length}/${sessionFieldLimits.lessonTitle}`;
  }
  if (teacherCommentCounter && teacherCommentInput) {
    teacherCommentCounter.textContent = `${Array.from(teacherCommentInput.value || "").length}/${sessionFieldLimits.teacherComment}`;
  }
}

function renderStrengthChoices(courseType = "creative_art") {
  if (!strengthChoiceGroup) return;
  const options = getStrengthOptions(courseType);
  if (!selectedStrengthChoices.length) selectedStrengthChoices = getDefaultStrengthChoices(courseType);
  const selectedTexts = new Set(selectedStrengthChoices.map((choice) => choice.text));
  strengthChoiceGroup.innerHTML = options.map((choice) => {
    const selected = selectedTexts.has(choice.text);
    return `
      <button class="strength-chip ${selected ? "is-selected" : ""}" type="button" data-strength-choice="${escapeHtml(choice.text)}">
        <span>${escapeHtml(choice.icon)}</span>
        <span>${escapeHtml(choice.text)}</span>
      </button>
    `;
  }).join("");
  updateStrengthChoiceCounter();
}

function updateStrengthChoiceCounter() {
  if (!strengthChoiceCounter) return;
  strengthChoiceCounter.textContent = `เลือกไว้ ${selectedStrengthChoices.length}/${sessionFieldLimits.strengthChoices}`;
}

function toggleStrengthChoice(text) {
  const courseType = activeSessionEnrollment?.course_type || "creative_art";
  const option = getStrengthOptions(courseType).find((choice) => choice.text === text);
  if (!option) return;
  const exists = selectedStrengthChoices.some((choice) => choice.text === text);
  if (exists) {
    selectedStrengthChoices = selectedStrengthChoices.filter((choice) => choice.text !== text);
  } else if (selectedStrengthChoices.length < sessionFieldLimits.strengthChoices) {
    selectedStrengthChoices = [...selectedStrengthChoices, option];
  } else {
    setMessage(`เลือกสิ่งที่น้องทำได้ดีได้สูงสุด ${sessionFieldLimits.strengthChoices} ข้อ`, true);
  }
  renderStrengthChoices(courseType);
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 4) {
  const words = String(text || "").replace(/\s+/g, " ").trim().split(" ");
  const lines = [];
  let line = "";
  words.forEach((word) => {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width <= maxWidth || !line) {
      line = next;
      return;
    }
    lines.push(line);
    line = word;
  });
  if (line) lines.push(line);
  lines.slice(0, maxLines).forEach((item, index) => {
    const clipped = index === maxLines - 1 && lines.length > maxLines ? `${item.slice(0, -2)}...` : item;
    ctx.fillText(clipped, x, y + index * lineHeight);
  });
  return y + Math.min(lines.length, maxLines) * lineHeight;
}

function truncateCanvasText(ctx, text, maxWidth) {
  const source = String(text || "").replace(/\s+/g, " ").trim();
  if (!source || ctx.measureText(source).width <= maxWidth) return source;
  let clipped = source;
  while (clipped.length > 1 && ctx.measureText(`${clipped}...`).width > maxWidth) {
    clipped = clipped.slice(0, -1);
  }
  return `${clipped}...`;
}

function roundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawPanel(ctx, x, y, width, height, fill = "#ffffff", stroke = "#eadccb") {
  ctx.save();
  ctx.shadowColor = "rgba(74,55,46,.08)";
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 8;
  ctx.fillStyle = fill;
  roundedRect(ctx, x, y, width, height, 30);
  ctx.fill();
  ctx.restore();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 2;
  roundedRect(ctx, x, y, width, height, 30);
  ctx.stroke();
}

function drawCardBadge(ctx, x, y, width, height, text) {
  ctx.save();
  ctx.fillStyle = "#FFF0EA";
  ctx.strokeStyle = "rgba(244, 126, 95, .42)";
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 8]);
  roundedRect(ctx, x, y, width, height, 24);
  ctx.fill();
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = "#F47E5F";
  ctx.font = "900 30px Kanit, 'Noto Sans Thai', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(truncateCanvasText(ctx, text, width - 28), x + width / 2, y + height / 2 + 1);
  ctx.restore();
}

function drawRoundImage(ctx, image, x, y, width, height, radius, fit = "cover") {
  if (!image) return;
  ctx.save();
  roundedRect(ctx, x, y, width, height, radius);
  ctx.clip();
  if (fit === "contain") {
    drawContainImage(ctx, image, x, y, width, height);
  } else {
    drawCoverImage(ctx, image, x, y, width, height);
  }
  ctx.restore();
}

function drawCoverImage(ctx, image, x, y, width, height) {
  const imageRatio = image.width / image.height;
  const targetRatio = width / height;
  let sourceWidth = image.width;
  let sourceHeight = image.height;
  let sourceX = 0;
  let sourceY = 0;

  if (imageRatio > targetRatio) {
    sourceWidth = image.height * targetRatio;
    sourceX = (image.width - sourceWidth) / 2;
  } else {
    sourceHeight = image.width / targetRatio;
    sourceY = (image.height - sourceHeight) / 2;
  }

  ctx.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height);
}

function drawContainImage(ctx, image, x, y, width, height) {
  if (!image) return;
  const ratio = Math.min(width / image.width, height / image.height);
  const drawWidth = image.width * ratio;
  const drawHeight = image.height * ratio;
  ctx.drawImage(image, x + (width - drawWidth) / 2, y + (height - drawHeight) / 2, drawWidth, drawHeight);
}

function drawCardImage(ctx, image, x, y, width, height, alpha = 1, fit = "stretch") {
  if (!image) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  if (fit === "contain") {
    drawContainImage(ctx, image, x, y, width, height);
  } else if (fit === "cover") {
    drawCoverImage(ctx, image, x, y, width, height);
  } else {
    ctx.drawImage(image, x, y, width, height);
  }
  ctx.restore();
}

function drawCardShadow(ctx, x, y, width, height, radius, fill = "#ffffff", stroke = "#E9DCCB") {
  ctx.save();
  ctx.shadowColor = "rgba(74, 55, 46, 0.08)";
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 8;
  ctx.fillStyle = fill;
  roundedRect(ctx, x, y, width, height, radius);
  ctx.fill();
  ctx.restore();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 2;
  roundedRect(ctx, x, y, width, height, radius);
  ctx.stroke();
}

function wrapCanvasTextByChar(ctx, text, x, y, maxWidth, lineHeight, maxLines = 4) {
  const normalized = String(text || "").replace(/\s+/g, " ").trim();
  if (!normalized) return y;
  const segments = normalized.split(" ").flatMap((word) => {
    if (ctx.measureText(word).width <= maxWidth) return [word];
    const chunks = [];
    let chunk = "";
    Array.from(word).forEach((char) => {
      const testChunk = `${chunk}${char}`;
      if (!chunk || ctx.measureText(testChunk).width <= maxWidth) {
        chunk = testChunk;
        return;
      }
      chunks.push(chunk);
      chunk = char;
    });
    if (chunk) chunks.push(chunk);
    return chunks;
  });
  const lines = [];
  let currentLine = "";
  segments.forEach((segment) => {
    const testLine = currentLine ? `${currentLine} ${segment}` : segment;
    if (ctx.measureText(testLine).width <= maxWidth || !currentLine) {
      currentLine = testLine;
      return;
    }
    lines.push(currentLine);
    currentLine = segment;
  });
  if (currentLine) lines.push(currentLine);
  lines.slice(0, maxLines).forEach((line, index) => {
    const clipped = index === maxLines - 1 && lines.length > maxLines
      ? `${Array.from(line).slice(0, -2).join("")}...`
      : line;
    ctx.fillText(clipped, x, y + index * lineHeight);
  });
  return y + Math.min(lines.length, maxLines) * lineHeight;
}

function drawCardText(ctx, text, x, y, maxWidth, lineHeight, maxLines, options = {}) {
  ctx.save();
  ctx.fillStyle = options.color || "#4A372E";
  ctx.font = options.font || "600 32px Kanit, 'Noto Sans Thai', sans-serif";
  ctx.textAlign = options.align || "start";
  ctx.textBaseline = "alphabetic";
  const finalY = wrapCanvasTextByChar(ctx, text, x, y, maxWidth, lineHeight, maxLines);
  ctx.restore();
  return finalY;
}

function drawSessionSummaryTitle(ctx, childLabel) {
  const startX = 124;
  const y = 210;
  const safeChild = `น้อง${String(childLabel || "น้อง").replace(/^น้อง/, "")}`.slice(0, 18);
  let fontSize = 58;
  const getWidth = () => {
    ctx.font = `900 ${fontSize}px Kanit, 'Noto Sans Thai', sans-serif`;
    return ctx.measureText("วันนี้ ").width +
      ctx.measureText(safeChild).width +
      ctx.measureText(" เรียนอะไรบ้าง?").width;
  };
  while (fontSize > 44 && getWidth() > 890) fontSize -= 2;
  ctx.font = `900 ${fontSize}px Kanit, 'Noto Sans Thai', sans-serif`;
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#4A372E";
  ctx.fillText("วันนี้ ", startX, y);
  const firstWidth = ctx.measureText("วันนี้ ").width;
  ctx.fillStyle = "#F05B3E";
  ctx.fillText(safeChild, startX + firstWidth, y);
  const childWidth = ctx.measureText(safeChild).width;
  ctx.fillStyle = "#4A372E";
  ctx.fillText(" เรียนอะไรบ้าง?", startX + firstWidth + childWidth, y);
}

function drawSessionInfoColumn(ctx, { icon, title, subtitle, accent, big, iconSize = 46, titleFont, subtitleFont }, x, y, width, height) {
  const safeIconSize = big ? 0 : iconSize;
  if (icon) drawCardImage(ctx, icon, x + 24, y + (height - safeIconSize) / 2, safeIconSize, safeIconSize, 1, "contain");
  const textX = icon ? x + safeIconSize + 40 : x + 24;
  const textWidth = width - (icon ? safeIconSize + 54 : 44);
  if (big) {
    ctx.fillStyle = "#4A372E";
    ctx.font = "800 22px Kanit, 'Noto Sans Thai', sans-serif";
    ctx.fillText(title, x + 30, y + 42);
    ctx.fillStyle = "#F05B3E";
    ctx.font = "900 45px Kanit, 'Noto Sans Thai', sans-serif";
    ctx.fillText(subtitle, x + 30, y + 88);
    return;
  }
  ctx.fillStyle = accent || "#4A372E";
  ctx.font = titleFont || "800 24px Kanit, 'Noto Sans Thai', sans-serif";
  if (!subtitle) {
    wrapCanvasTextByChar(ctx, title, textX, y + 73, textWidth, 28, 1);
    return;
  }
  wrapCanvasTextByChar(ctx, title, textX, y + 50, textWidth, 28, 1);
  ctx.fillStyle = "#4A372E";
  ctx.font = subtitleFont || "700 21px Kanit, 'Noto Sans Thai', sans-serif";
  wrapCanvasTextByChar(ctx, subtitle, textX, y + 82, textWidth, 25, 1);
}

function drawProgressBar(ctx, completed, total, x, y, width, height) {
  const safeTotal = Math.max(Number(total || 0), 1);
  const safeCompleted = Math.max(Math.min(Number(completed || 0), safeTotal), 0);
  const ratio = safeCompleted / safeTotal;
  roundedRect(ctx, x, y, width, height, height / 2);
  ctx.fillStyle = "#DDEED2";
  ctx.fill();
  ctx.strokeStyle = "#9BBE86";
  ctx.lineWidth = 2;
  ctx.stroke();
  if (ratio > 0) {
    roundedRect(ctx, x, y, Math.max(width * ratio, height), height, height / 2);
    ctx.fillStyle = "#6EA154";
    ctx.fill();
  }
  ctx.fillStyle = "#4A372E";
  ctx.font = "800 18px Kanit, 'Noto Sans Thai', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`${safeCompleted}/${safeTotal}`, x + width / 2, y + height + 24);
  ctx.textAlign = "start";
}

function drawWowBackground(ctx, width, height) {
  ctx.fillStyle = "#FFF8EF";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "rgba(147, 198, 126, 0.22)";
  ctx.beginPath();
  ctx.arc(80, 40, 190, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255, 191, 112, 0.26)";
  ctx.beginPath();
  ctx.arc(1030, 210, 250, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(244, 126, 95, 0.12)";
  ctx.beginPath();
  ctx.arc(135, 1268, 230, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(223, 191, 159, 0.55)";
  ctx.lineWidth = 2;
  for (let x = -80; x < width + 120; x += 86) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + 420, height);
    ctx.stroke();
  }
}

function drawWowPill(ctx, x, y, width, height, text, options = {}) {
  ctx.save();
  ctx.save();
  ctx.shadowColor = "rgba(74, 55, 46, 0.08)";
  ctx.shadowBlur = 14;
  ctx.shadowOffsetY = 6;
  ctx.fillStyle = options.fill || "#FFFFFF";
  roundedRect(ctx, x, y, width, height, height / 2);
  ctx.fill();
  ctx.restore();
  ctx.strokeStyle = options.stroke || "#E8D8C7";
  ctx.lineWidth = 2;
  roundedRect(ctx, x, y, width, height, height / 2);
  ctx.stroke();
  ctx.fillStyle = options.color || "#5E4A3E";
  ctx.font = options.font || "800 25px Kanit, 'Noto Sans Thai', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(truncateCanvasText(ctx, text, width - 34), x + width / 2, y + height / 2 + 1);
  ctx.restore();
}

function drawWowInfoPill(ctx, x, y, width, height, icon, text, options = {}) {
  ctx.save();
  ctx.save();
  ctx.shadowColor = "rgba(74, 55, 46, 0.08)";
  ctx.shadowBlur = 14;
  ctx.shadowOffsetY = 6;
  ctx.fillStyle = options.fill || "#FFFFFF";
  roundedRect(ctx, x, y, width, height, height / 2);
  ctx.fill();
  ctx.restore();
  ctx.strokeStyle = options.stroke || "#DFBF9F";
  ctx.lineWidth = 2;
  roundedRect(ctx, x, y, width, height, height / 2);
  ctx.stroke();
  ctx.textBaseline = "middle";
  ctx.textAlign = "start";
  ctx.fillStyle = options.iconColor || options.color || "#5E4A3E";
  ctx.font = options.iconFont || "900 32px 'Apple Color Emoji', Kanit, 'Noto Sans Thai', sans-serif";
  ctx.fillText(icon, x + 34, y + height / 2 + 1);
  ctx.fillStyle = options.color || "#5E4A3E";
  ctx.font = options.font || "900 26px Kanit, 'Noto Sans Thai', sans-serif";
  ctx.fillText(truncateCanvasText(ctx, text, width - 100), x + 78, y + height / 2 + 1);
  ctx.restore();
}

function drawWowPhoto(ctx, photo, placeholder, x, y, width, height) {
  ctx.save();
  ctx.translate(x + width / 2, y + height / 2);
  ctx.rotate(-0.035);
  ctx.translate(-width / 2, -height / 2);
  ctx.shadowColor = "rgba(74, 55, 46, 0.16)";
  ctx.shadowBlur = 22;
  ctx.shadowOffsetY = 12;
  ctx.fillStyle = "#FFFFFF";
  roundedRect(ctx, 0, 0, width, height, 26);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.translate(x + width / 2, y + height / 2);
  ctx.rotate(-0.035);
  ctx.translate(-width / 2, -height / 2);
  ctx.strokeStyle = "#E7D8C7";
  ctx.lineWidth = 2;
  roundedRect(ctx, 0, 0, width, height, 26);
  ctx.stroke();

  const photoX = 28;
  const photoY = 34;
  const photoW = width - 56;
  const photoH = Math.min(Math.round(photoW * 0.66), height - 132);
  ctx.fillStyle = "#F5EFE4";
  roundedRect(ctx, photoX, photoY, photoW, photoH, 20);
  ctx.fill();
  if (photo) {
    drawRoundImage(ctx, photo, photoX, photoY, photoW, photoH, 20, "cover");
  } else if (placeholder) {
    drawCardImage(ctx, placeholder, photoX + 92, photoY + 18, photoW - 184, photoH - 36, 0.82, "contain");
  } else {
    ctx.fillStyle = "#8B7668";
    ctx.font = "800 30px Kanit, 'Noto Sans Thai', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("รูปผลงานวันนี้", width / 2, photoY + photoH / 2 + 10);
    ctx.textAlign = "start";
  }

  ctx.fillStyle = "#F47E5F";
  roundedRect(ctx, 48, photoY + photoH + 24, width - 96, 56, 14);
  ctx.fill();
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "900 29px Kanit, 'Noto Sans Thai', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("ผลงานวันนี้", width / 2, photoY + photoH + 53);
  ctx.restore();
  ctx.textAlign = "start";
  ctx.textBaseline = "alphabetic";
}

function drawWowTitle(ctx, childLabel, x, y, maxWidth) {
  const safeChild = `น้อง${String(childLabel || "น้อง").replace(/^น้อง/, "")}`.slice(0, 18);
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#4A372E";
  ctx.font = "900 54px Kanit, 'Noto Sans Thai', sans-serif";
  ctx.fillText("วันนี้", x, y);
  ctx.fillStyle = "#F05B3E";
  let childFontSize = 60;
  do {
    ctx.font = `900 ${childFontSize}px Kanit, 'Noto Sans Thai', sans-serif`;
    if (ctx.measureText(safeChild).width <= maxWidth) break;
    childFontSize -= 2;
  } while (childFontSize > 42);
  ctx.fillText(safeChild, x, y + 68);
  ctx.fillStyle = "#4A372E";
  ctx.font = "900 50px Kanit, 'Noto Sans Thai', sans-serif";
  wrapCanvasTextByChar(ctx, "เรียนอะไรบ้าง?", x, y + 132, maxWidth, 55, 2);
}

function drawWowBox(ctx, x, y, width, height, options = {}) {
  const fill = options.fill || "#FFFFFF";
  const stroke = options.stroke || "#E8D8C7";
  const iconSize = options.iconSize || 64;
  drawCardShadow(ctx, x, y, width, height, 24, fill, stroke);
  if (options.icon) drawCardImage(ctx, options.icon, x + 22, y + 20, iconSize, iconSize, 1, "contain");
  const textX = options.icon ? x + iconSize + 36 : x + 28;
  const textWidth = width - (options.icon ? iconSize + 68 : 56);
  ctx.fillStyle = options.accent || "#F05B3E";
  ctx.font = options.titleFont || "900 32px Kanit, 'Noto Sans Thai', sans-serif";
  ctx.fillText(options.title || "", textX, y + 48);
  ctx.fillStyle = options.color || "#4A372E";
  ctx.font = options.bodyFont || "700 27px Kanit, 'Noto Sans Thai', sans-serif";
  wrapCanvasTextByChar(ctx, options.text || "", textX, y + 90, textWidth, options.lineHeight || 36, options.maxLines || 3);
}

function drawWowStrengthPanel(ctx, choices = [], trophyIcon, x, y, width, height) {
  drawCardShadow(ctx, x, y, width, height, 26, "#F6FBF1", "#AED09F");
  ctx.fillStyle = "#4A372E";
  ctx.font = "900 36px Kanit, 'Noto Sans Thai', sans-serif";
  ctx.fillText("สิ่งที่น้องทำได้ดี", x + 38, y + 58);
  ctx.font = "900 34px Kanit, 'Noto Sans Thai', sans-serif";
  ctx.fillStyle = "#F3BE38";
  ctx.fillText("✦", x + 268, y + 58);

  const chipLayout = [
    { x: x + 38, y: y + 86, w: 278 },
    { x: x + 340, y: y + 86, w: 308 },
    { x: x + 38, y: y + 142, w: 278 },
    { x: x + 340, y: y + 142, w: 308 },
    { x: x + 38, y: y + 198, w: 340 }
  ];
  choices.slice(0, 5).forEach((choice, index) => {
    const chip = chipLayout[index];
    if (!chip) return;
    ctx.save();
    ctx.shadowColor = "rgba(74, 55, 46, 0.08)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 5;
    ctx.fillStyle = "#FFFFFF";
    roundedRect(ctx, chip.x, chip.y, chip.w, 44, 14);
    ctx.fill();
    ctx.restore();
    ctx.strokeStyle = "#DDEBCF";
    ctx.lineWidth = 2;
    roundedRect(ctx, chip.x, chip.y, chip.w, 44, 14);
    ctx.stroke();
    ctx.fillStyle = "#4A372E";
    ctx.font = "800 23px Kanit, 'Noto Sans Thai', sans-serif";
    ctx.fillText(`${choice.icon || "⭐"} ${truncateCanvasText(ctx, choice.text || choice, chip.w - 82)}`, chip.x + 18, chip.y + 30);
  });
  drawCardImage(ctx, trophyIcon, x + width - 132, y + 18, 96, 96, 0.9, "contain");
}

function drawWowProgress(ctx, completed, total, x, y, width, height, pairIcon) {
  const safeTotal = Math.max(Number(total || 0), 1);
  const safeCompleted = Math.max(Math.min(Number(completed || 0), safeTotal), 0);
  const ratio = safeCompleted / safeTotal;

  drawCardShadow(ctx, x, y, width, height, 26, "#F2F8EC", "#9DCB8A");
  drawCardImage(ctx, pairIcon, x + 16, y + 4, 178, 118, 1, "contain");
  ctx.fillStyle = "#4A372E";
  ctx.font = "900 32px Kanit, 'Noto Sans Thai', sans-serif";
  ctx.fillText("เส้นทางการเรียนรู้", x + 208, y + 58);

  const barX = x + 462;
  const barY = y + 46;
  const barW = width - 608;
  const barH = 30;
  roundedRect(ctx, barX, barY, barW, barH, barH / 2);
  ctx.fillStyle = "#DCEFD2";
  ctx.fill();
  if (ratio > 0) {
    roundedRect(ctx, barX, barY, Math.max(barW * ratio, barH), barH, barH / 2);
    ctx.fillStyle = "#6EA154";
    ctx.fill();
  }
  ctx.fillStyle = "#18743D";
  ctx.font = "900 33px Kanit, 'Noto Sans Thai', sans-serif";
  ctx.fillText(`${safeCompleted}/${safeTotal}`, barX + barW + 24, y + 72);
}

async function loadCanvasImage(url) {
  if (!url) return null;
  return new Promise((resolve) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = url;
  });
}

function updateCropTransform() {
  if (!cropState || !cropImage || !cropStage) return;
  const stageWidth = cropStage.clientWidth || 430;
  const stageHeight = cropStage.clientHeight || Math.round(stageWidth * 0.6);
  const stageRatio = stageWidth / stageHeight;
  const naturalRatio = cropState.image.naturalWidth / cropState.image.naturalHeight;
  let baseWidth = stageWidth;
  let baseHeight = stageHeight;
  if (naturalRatio > stageRatio) {
    baseHeight = stageHeight;
    baseWidth = stageHeight * naturalRatio;
  } else {
    baseWidth = stageWidth;
    baseHeight = stageWidth / naturalRatio;
  }
  const width = baseWidth * cropState.zoom;
  const height = baseHeight * cropState.zoom;
  const maxX = Math.max((width - stageWidth) / 2, 0);
  const maxY = Math.max((height - stageHeight) / 2, 0);
  cropState.offsetX = Math.max(Math.min(cropState.offsetX, maxX), -maxX);
  cropState.offsetY = Math.max(Math.min(cropState.offsetY, maxY), -maxY);
  cropImage.style.width = `${width}px`;
  cropImage.style.height = `${height}px`;
  cropImage.style.transform = `translate(calc(-50% + ${cropState.offsetX}px), calc(-50% + ${cropState.offsetY}px))`;
}

function getDefaultCropPreset(image) {
  const ratio = image?.naturalWidth && image?.naturalHeight
    ? image.naturalWidth / image.naturalHeight
    : 1;
  if (ratio < 0.82) return { zoom: 1.12, offsetYRatio: 0.1 };
  if (ratio > 1.18) return { zoom: 1.05, offsetYRatio: 0.02 };
  return { zoom: 1.08, offsetYRatio: 0.06 };
}

function resetCropPosition() {
  if (!cropState) return;
  const stageHeight = cropStage?.clientHeight || Math.round((cropStage?.clientWidth || 430) * 0.6);
  const preset = getDefaultCropPreset(cropImage);
  cropState.offsetX = 0;
  cropState.offsetY = stageHeight * preset.offsetYRatio;
  cropState.zoom = preset.zoom;
  if (cropZoomInput) cropZoomInput.value = String(preset.zoom);
  updateCropTransform();
}

function closeCropModal(clearInput = false) {
  if (photoCropModal) photoCropModal.hidden = true;
  if (cropState?.objectUrl) URL.revokeObjectURL(cropState.objectUrl);
  cropState = null;
  if (cropImage) cropImage.removeAttribute("src");
  if (clearInput && sessionPhotoInput) sessionPhotoInput.value = "";
}

function cancelCropSelection() {
  closeCropModal(true);
  if (activeCroppedPhotoUrl) URL.revokeObjectURL(activeCroppedPhotoUrl);
  activeCroppedPhotoUrl = "";
  activeCroppedPhotoBlob = null;
  activeCroppedPhotoName = "";
  if (photoPreview) {
    photoPreview.hidden = true;
    photoPreview.innerHTML = "";
  }
}

function openCropModal(file) {
  if (!file || !photoCropModal || !cropImage) return;
  if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
    setMessage("รูปผลงานต้องเป็น PNG, JPG หรือ WEBP", true);
    sessionPhotoInput.value = "";
    return;
  }
  if (file.size > 8 * 1024 * 1024) {
    setMessage("รูปผลงานต้องไม่เกิน 8 MB", true);
    sessionPhotoInput.value = "";
    return;
  }
  closeCropModal(false);
  const objectUrl = URL.createObjectURL(file);
  cropState = {
    objectUrl,
    fileName: file.name || "after-class-photo.jpg",
    image: cropImage,
    offsetX: 0,
    offsetY: 0,
    zoom: 1.1,
    isDragging: false,
    startX: 0,
    startY: 0,
    startOffsetX: 0,
    startOffsetY: 0
  };
  cropImage.onload = () => resetCropPosition();
  cropImage.src = objectUrl;
  if (cropZoomInput) cropZoomInput.value = "1.1";
  photoCropModal.hidden = false;
}

function createCroppedPhotoBlob() {
  return new Promise((resolve, reject) => {
    if (!cropState || !cropStage || !cropImage.naturalWidth) {
      reject(new Error("ยังไม่มีรูปสำหรับครอป"));
      return;
    }
    const stageWidth = cropStage.clientWidth || 430;
    const stageHeight = cropStage.clientHeight || Math.round(stageWidth * 0.6);
    const displayWidth = Number.parseFloat(cropImage.style.width) || stageWidth;
    const displayHeight = Number.parseFloat(cropImage.style.height) || stageHeight;
    const visibleLeft = displayWidth / 2 - cropState.offsetX - stageWidth / 2;
    const visibleTop = displayHeight / 2 - cropState.offsetY - stageHeight / 2;
    const sourceWidth = stageWidth * cropImage.naturalWidth / displayWidth;
    const sourceHeight = stageHeight * cropImage.naturalHeight / displayHeight;
    const sx = Math.max(0, Math.min(
      visibleLeft * cropImage.naturalWidth / displayWidth,
      cropImage.naturalWidth - sourceWidth
    ));
    const sy = Math.max(0, Math.min(
      visibleTop * cropImage.naturalHeight / displayHeight,
      cropImage.naturalHeight - sourceHeight
    ));
    const canvas = document.createElement("canvas");
    canvas.width = 1600;
    canvas.height = 960;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FBF7F0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(cropImage, sx, sy, sourceWidth, sourceHeight, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("สร้างรูปที่ครอปไม่สำเร็จ"));
    }, "image/jpeg", 0.92);
  });
}

async function confirmCropPhoto() {
  if (!cropState) return;
  confirmCropButton.disabled = true;
  confirmCropButton.textContent = "กำลังเตรียมรูป...";
  try {
    const blob = await createCroppedPhotoBlob();
    if (activeCroppedPhotoUrl) URL.revokeObjectURL(activeCroppedPhotoUrl);
    activeCroppedPhotoBlob = blob;
    activeCroppedPhotoName = cropState.fileName.replace(/\.[^.]+$/, "") || "after-class-photo";
    activeCroppedPhotoUrl = URL.createObjectURL(blob);
    photoPreview.hidden = false;
    photoPreview.innerHTML = `<img src="${activeCroppedPhotoUrl}" alt="รูปที่ครอปแล้ว"><span>ครอปเป็นภาพแนวนอนสำหรับการ์ดแล้ว</span>`;
    closeCropModal(false);
  } catch (error) {
    setMessage(`ครอปรูปไม่สำเร็จ: ${error.message}`, true);
  } finally {
    confirmCropButton.disabled = false;
    confirmCropButton.textContent = "ใช้รูปนี้";
  }
}

async function drawShareCard(data) {
  shareCanvas.width = 1080;
  shareCanvas.height = data.mode === "session" ? 1350 : 1080;
  const ctx = shareCanvas.getContext("2d");
  const width = shareCanvas.width;
  const height = shareCanvas.height;
  const logo = await loadCanvasImage("assets/card/logo-card.svg?v=20260630-logo-split");
  const photo = await loadCanvasImage(data.photoUrl);
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#FAF6EF";
  ctx.fillRect(0, 0, width, height);

  if (data.mode === "session") {
    const wowCourseIconUrl = {
      robot: afterClassWowAssets.icons.robot,
      art: afterClassWowAssets.icons.creativeArt,
      creative_art: afterClassWowAssets.icons.creativeArt,
      water_color: afterClassWowAssets.icons.waterColor,
      clay: afterClassWowAssets.icons.clay
    }[data.courseType] || afterClassWowAssets.icons.creativeArt;
    const [
      cardLogo,
      courseIcon,
      placeholderIcon,
      toko,
      pair,
      heartIcon,
      starIcon,
      blinkIcon,
      lightIcon,
      smileIcon,
      tapeIcon,
      trophyIcon
    ] = await Promise.all([
      loadCanvasImage(afterClassWowAssets.logoWord),
      loadCanvasImage(wowCourseIconUrl),
      loadCanvasImage(afterClassAssets.placeholder),
      loadCanvasImage(afterClassWowAssets.toko),
      loadCanvasImage(afterClassWowAssets.pair),
      loadCanvasImage(afterClassWowAssets.icons.heart),
      loadCanvasImage(afterClassWowAssets.icons.star),
      loadCanvasImage(afterClassWowAssets.icons.blink),
      loadCanvasImage(afterClassWowAssets.icons.light),
      loadCanvasImage(afterClassWowAssets.icons.smile),
      loadCanvasImage(afterClassWowAssets.icons.tape),
      loadCanvasImage(afterClassWowAssets.icons.trophy)
    ]);
    const childLabel = String(data.childLabel || "น้อง").replace(/^น้อง/, "").slice(0, 14);
    const lessonTitle = data.lessonTitle || data.primaryLine || "กิจกรรมสร้างสรรค์";
    const teacherNote = data.teacherComment || data.note || "วันนี้ตั้งใจเรียนดีมาก เก็บผลงานไว้เป็นกำลังใจนะคะ/ครับ";
    const strengthChoices = Array.isArray(data.strengthChoices) && data.strengthChoices.length
      ? data.strengthChoices
      : getDefaultStrengthChoices(data.courseType);
    const sessionNumber = Number(data.sessionNumber || 0);
    const totalSessions = Number(data.totalSessions || 0);
    const completed = Number(data.completedAfter || sessionNumber || 0);
    const displayTotal = totalSessions || Math.max(sessionNumber, completed, 4);

    drawWowBackground(ctx, width, height);
    drawCardImage(ctx, starIcon, 486, 62, 88, 88, 0.86, "contain");
    drawCardImage(ctx, heartIcon, 968, 132, 92, 92, 0.58, "contain");
    drawCardImage(ctx, blinkIcon, 36, 178, 72, 72, 0.72, "contain");

    drawCardImage(ctx, cardLogo, 38, 24, 368, 140, 1, "contain");
    drawWowInfoPill(ctx, 466, 34, 266, 70, "📅", formatThaiDate(data.sessionDate), {
      color: "#4F7D48",
      iconColor: "#8A6E5F",
      iconFont: "900 32px 'Apple Color Emoji', Kanit, 'Noto Sans Thai', sans-serif",
      font: "900 27px Kanit, 'Noto Sans Thai', sans-serif"
    });
    drawWowInfoPill(ctx, 754, 34, 286, 70, "📍", data.branchName ? `สาขา ${data.branchName}` : "Toko & Poppy", {
      color: "#5E4A3E",
      iconColor: "#D95342",
      iconFont: "900 31px 'Apple Color Emoji', Kanit, 'Noto Sans Thai', sans-serif",
      font: "900 27px Kanit, 'Noto Sans Thai', sans-serif"
    });

    drawWowPhoto(ctx, photo, placeholderIcon, 66, 174, 466, 430);
    drawCardImage(ctx, tapeIcon, 382, 164, 116, 64, 0.78, "contain");
    drawCardImage(ctx, toko, 386, 518, 160, 160, 1, "contain");
    drawWowTitle(ctx, `น้อง${childLabel}`, 548, 242, 444);

    drawWowBox(ctx, 548, 424, 460, 178, {
      icon: courseIcon,
      title: data.courseName || "บทเรียนวันนี้",
      text: `${lessonTitle} · ${totalSessions ? `ครั้งที่ ${sessionNumber}/${totalSessions}` : `ครั้งที่ ${sessionNumber || "-"}`}`,
      fill: "#FFFFFF",
      stroke: "#E8D8C7",
      accent: "#4F8B37",
      iconSize: 68,
      bodyFont: "700 26px Kanit, 'Noto Sans Thai', sans-serif",
      maxLines: 3,
      lineHeight: 33
    });

    drawWowBox(ctx, 72, 624, 936, 188, {
      icon: lightIcon,
      title: "ข้อความจากคุณครู",
      text: teacherNote,
      fill: "#FFFFFF",
      stroke: "#F1DEC8",
      accent: "#F05B3E",
      iconSize: 72,
      maxLines: 3,
      lineHeight: 35
    });

    drawWowStrengthPanel(ctx, strengthChoices, trophyIcon, 72, 834, 936, 248);

    drawWowProgress(ctx, completed || sessionNumber, displayTotal, 72, 1106, 936, 122, pair);
    ctx.textAlign = "start";
    return;
  }

  drawContainImage(ctx, logo, 72, 36, 170, 170);
  ctx.fillStyle = "#F3BE38";
  ctx.font = "900 64px Kanit, sans-serif";
  ctx.fillText(data.mode === "reminder" ? "พรุ่งนี้มีเรียน" : "วันนี้เรียนอะไรบ้าง", 82, 238);

  ctx.fillStyle = "#4A372E";
  ctx.font = "900 72px Kanit, sans-serif";
  wrapText(ctx, data.childLabel, 82, 330, 750, 78, 2);

  if (data.mode === "session" && photo) {
    drawPanel(ctx, 82, 378, 916, 250, "#ffffff", "#eadccb");
    ctx.save();
    roundedRect(ctx, 104, 400, 872, 206, 24);
    ctx.clip();
    ctx.drawImage(photo, 104, 400, 872, 206);
    ctx.restore();
  }

  const infoY = data.mode === "session" && photo ? 658 : 430;
  drawPanel(ctx, 82, infoY, 916, 180, data.mode === "reminder" ? "#F2F8EC" : "#ffffff", "#9BBE86");
  ctx.fillStyle = "#4F7D48";
  ctx.font = "900 44px Kanit, sans-serif";
  ctx.fillText(`${data.courseIcon} ${data.courseName}`, 128, infoY + 66);
  ctx.fillStyle = "#4A372E";
  ctx.font = "800 34px Kanit, sans-serif";
  wrapText(ctx, data.primaryLine, 128, infoY + 122, 780, 40, 1);
  ctx.fillStyle = "#F05B3E";
  ctx.font = "900 38px Kanit, sans-serif";
  ctx.fillText(data.accentLine, 128, infoY + 164);

  drawPanel(ctx, 82, 846, 916, 160, "#ffffff", "#eadccb");
  ctx.fillStyle = "#8A7668";
  ctx.font = "700 30px Kanit, sans-serif";
  wrapText(ctx, data.note, 128, 912, 780, 38, 2);

  ctx.fillStyle = "#6EA154";
  ctx.font = "900 30px Kanit, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Toko & Poppy", width / 2, 1030);
  ctx.textAlign = "start";
}

function revokeActiveShareCardUrl() {
  if (activeShareCardUrl) URL.revokeObjectURL(activeShareCardUrl);
  activeShareCardUrl = "";
  activeShareCardBlob = null;
  if (shareImagePreview) {
    shareImagePreview.removeAttribute("src");
    shareImagePreview.hidden = true;
  }
  if (saveCardHint) saveCardHint.hidden = true;
}

function canvasToPngBlob() {
  return new Promise((resolve, reject) => {
    shareCanvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("สร้างรูปการ์ดไม่สำเร็จ"));
    }, "image/png");
  });
}

function getShareCardFileName() {
  const safeName = (activeShareData?.childLabel || "student")
    .replace(/[^\wก-๙-]+/g, "-")
    .slice(0, 50) || "student";
  return `toko-poppy-${activeShareData?.mode || "card"}-${safeName}.png`;
}

function isLineOrIosWebView() {
  const ua = navigator.userAgent || "";
  return Boolean(window.liff?.isInClient?.()) || /Line\//i.test(ua) || /iPhone|iPad|iPod/i.test(ua);
}

async function refreshShareCardImage(data) {
  downloadShareCardButton.disabled = true;
  downloadShareCardButton.textContent = "กำลังสร้างรูป...";
  try {
    if (document.fonts?.ready) await document.fonts.ready;
    await drawShareCard(data);
    const blob = await canvasToPngBlob();
    revokeActiveShareCardUrl();
    activeShareCardBlob = blob;
    activeShareCardUrl = URL.createObjectURL(blob);
    if (shareImagePreview) shareImagePreview.src = activeShareCardUrl;
  } catch (error) {
    setMessage(`สร้างรูปการ์ดไม่สำเร็จ: ${error.message}`, true);
  } finally {
    downloadShareCardButton.disabled = false;
    downloadShareCardButton.textContent = isLineOrIosWebView() ? "เปิดรูปเพื่อบันทึก" : "ดาวน์โหลดการ์ด";
  }
}

function openShareSheet(data) {
  activeShareData = data;
  revokeActiveShareCardUrl();
  setSheetStatus("");
  shareEyebrow.textContent = data.mode === "reminder" ? "Class Reminder" : "After Class";
  shareTitle.textContent = data.title;
  shareSubtitle.textContent = data.subtitle;
  shareText.value = data.text;
  markReminderSentButton.hidden = data.mode !== "reminder";
  if (confirmSessionSaveButton) confirmSessionSaveButton.hidden = data.mode !== "session";
  shareSheet.hidden = false;
  document.body.style.overflow = "hidden";
  downloadShareCardButton.textContent = isLineOrIosWebView() ? "เปิดรูปเพื่อบันทึก" : "ดาวน์โหลดการ์ด";
  refreshShareCardImage(data);
}

function closeShareSheet() {
  shareSheet.hidden = true;
  document.body.style.overflow = "";
  setSheetStatus("");
  if (activeShareData?.mode === "session" && activeSessionEnrollment) {
    recordSheet.hidden = false;
    document.body.style.overflow = "hidden";
  }
  revokeActiveShareCardUrl();
  activeShareData = null;
  activeReminder = null;
}

function openReminder(item) {
  activeReminder = item;
  const text = buildReminderText(item);
  openShareSheet({
    mode: "reminder",
    title: `แจ้งเตือน ${getChildLabel(item)}`,
    subtitle: `${getCourseLabel(item)} · ${getScheduleLabel(item)}`,
    text,
    childLabel: getChildLabel(item),
    courseIcon: getCourseMeta(item.course_type).icon,
    courseName: getCourseLabel(item),
    primaryLine: `${weekdayLabels[Number(portalData.target_weekday)]} ${formatThaiDate(portalData.target_date)}`,
    accentLine: getScheduleLabel(item),
    note: "หากไม่สะดวกหรือต้องการเปลี่ยนวันและเวลา แจ้งได้เลยนะคะ"
  });
}

async function markReminderSent(item = activeReminder) {
  if (!item) return;
  markReminderSentButton.disabled = true;
  const { error } = await supabaseClient.rpc("mark_teacher_liff_reminder_sent", {
    p_line_user_id: lineUserId,
    p_course_enrollment_id: item.id,
    p_class_date: portalData.target_date,
    p_message: buildReminderText(item),
    p_channel: "line"
  });
  markReminderSentButton.disabled = false;
  if (error) {
    setMessage(`บันทึกแจ้งเตือนไม่สำเร็จ: ${error.message}`, true);
    return;
  }
  setMessage("บันทึกว่าแจ้งเตือนแล้ว");
  closeShareSheet();
  await loadPortal();
}

function populateSessionNumberOptions(total, selected) {
  if (!sessionNumberInput) return;
  const maxSession = total ? Math.max(total, 1) : Math.max(selected, 24);
  sessionNumberInput.innerHTML = [
    '<option value="">เลือกครั้งที่เรียน</option>',
    ...Array.from({ length: maxSession }, (_, index) => {
      const value = index + 1;
      const label = total ? `ครั้งที่ ${value}/${total}` : `ครั้งที่ ${value}`;
      return `<option value="${value}">${label}</option>`;
    })
  ].join("");
  sessionNumberInput.value = String(Math.min(Math.max(selected || 1, 1), maxSession));
}

function openRecordSheet(item) {
  activeSessionEnrollment = item;
  pendingSessionInput = null;
  const completed = Number(item.completed_sessions || 0);
  const total = Number(item.total_sessions || 0);
  const next = total ? Math.min(completed + 1, total) : completed + 1;
  recordTitle.textContent = `บันทึก ${getChildLabel(item)}`;
  recordSubtitle.textContent = `${getCourseLabel(item)} · เรียนแล้ว ${getCompletedText(item)}`;
  populateSessionNumberOptions(total, next);
  sessionDateInput.value = toLocalDateInputValue(new Date());
  lessonTitleInput.maxLength = sessionFieldLimits.lessonTitle;
  lessonTitleInput.value = "";
  teacherCommentInput.maxLength = sessionFieldLimits.teacherComment;
  teacherCommentInput.value = "";
  sessionPhotoInput.value = "";
  selectedStrengthChoices = getDefaultStrengthChoices(item.course_type || "creative_art");
  renderStrengthChoices(item.course_type || "creative_art");
  updateCharacterCounters();
  if (activeCroppedPhotoUrl) URL.revokeObjectURL(activeCroppedPhotoUrl);
  activeCroppedPhotoUrl = "";
  activeCroppedPhotoBlob = null;
  activeCroppedPhotoName = "";
  photoPreview.hidden = true;
  photoPreview.innerHTML = "";
  recordConfirmActions.hidden = true;
  recordSheet.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeRecordSheet() {
  recordSheet.hidden = true;
  document.body.style.overflow = "";
  activeSessionEnrollment = null;
  pendingSessionInput = null;
  if (activePhotoObjectUrl) {
    URL.revokeObjectURL(activePhotoObjectUrl);
    activePhotoObjectUrl = "";
  }
  if (activeCroppedPhotoUrl) {
    URL.revokeObjectURL(activeCroppedPhotoUrl);
    activeCroppedPhotoUrl = "";
  }
  activeCroppedPhotoBlob = null;
  activeCroppedPhotoName = "";
  selectedStrengthChoices = [];
  closeCropModal(false);
}

function getSessionInput() {
  if (!activeSessionEnrollment) return null;
  const total = Number(activeSessionEnrollment.total_sessions || 0);
  const sessionNumber = Number.parseInt(sessionNumberInput.value, 10);
  if (!Number.isInteger(sessionNumber) || sessionNumber < 1) {
    setMessage("กรุณาระบุครั้งที่เรียนให้ถูกต้อง", true);
    return null;
  }
  if (total && sessionNumber > total) {
    setMessage(`ครั้งที่เรียนต้องไม่เกิน ${total}`, true);
    return null;
  }
  return {
    sessionNumber,
    sessionDate: sessionDateInput.value || toLocalDateInputValue(new Date()),
    lessonTitle: normalizeText(lessonTitleInput.value),
    teacherComment: normalizeText(teacherCommentInput.value),
    strengthChoices: selectedStrengthChoices.slice(),
    strengthText: getSelectedStrengthText()
  };
}

function buildSessionShareData(input, photoUrl = "") {
  const item = activeSessionEnrollment;
  const total = Number(item.total_sessions || 0);
  const completedAfter = Math.max(Number(item.completed_sessions || 0), input.sessionNumber);
  const courseType = item.course_type || "creative_art";
  return {
    mode: "session",
    title: `หลังเรียน ${getChildLabel(item)}`,
    subtitle: `${getCourseLabel(item)} · ครั้งที่ ${input.sessionNumber}`,
    childLabel: getChildLabel(item),
    courseType,
    courseIcon: getCourseMeta(item.course_type).icon,
    courseName: getCourseLabel(item),
    primaryLine: input.lessonTitle || "กิจกรรมสร้างสรรค์",
    accentLine: total ? `ครั้งที่ ${input.sessionNumber}/${total}` : `ครั้งที่ ${input.sessionNumber}`,
    note: input.teacherComment || "วันนี้ตั้งใจเรียนดีมาก เก็บผลงานไว้เป็นกำลังใจนะคะ/ครับ",
    branchName: item.branch_name || "",
    sessionNumber: input.sessionNumber,
    sessionDate: input.sessionDate,
    lessonTitle: input.lessonTitle,
    teacherComment: input.teacherComment,
    totalSessions: total,
    completedAfter,
    remainingAfter: total ? Math.max(total - completedAfter, 0) : 0,
    strengthChoices: input.strengthChoices?.length ? input.strengthChoices : getDefaultStrengthChoices(courseType),
    strengthText: input.strengthText || getSessionStrengthText({ courseType }),
    photoUrl
  };
}

async function previewSession(event) {
  event.preventDefault();
  const input = getSessionInput();
  if (!input) return;
  let photoUrl = "";
  if (sessionPhotoInput.files?.[0]) {
    if (!activeCroppedPhotoUrl || !activeCroppedPhotoBlob) {
      setMessage("กรุณาครอปรูปก่อนสร้างการ์ด", true);
      openCropModal(sessionPhotoInput.files[0]);
      return;
    }
    photoUrl = activeCroppedPhotoUrl;
  }
  pendingSessionInput = input;
  const data = buildSessionShareData(input, photoUrl);
  shareText.value = buildSessionText(data);
  recordSheet.hidden = true;
  openShareSheet({ ...data, text: buildSessionText(data) });
  recordConfirmActions.hidden = false;
}

async function uploadLearningPhoto(enrollmentId) {
  const file = activeCroppedPhotoBlob
    ? new File([activeCroppedPhotoBlob], `${activeCroppedPhotoName || "after-class-photo"}.jpg`, { type: "image/jpeg" })
    : sessionPhotoInput.files?.[0];
  if (!file) return null;
  const extension = normalizeText(file.name).split(".").pop()?.toLowerCase() || "jpg";
  const safeName = `${crypto.randomUUID ? crypto.randomUUID() : Date.now()}.${extension}`;
  const path = `${enrollmentId}/${safeName}`;
  const { error } = await supabaseClient.storage
    .from("learning-session-photos")
    .upload(path, file, { upsert: false, contentType: file.type });
  if (error) throw error;
  return path;
}

function setSessionSavingState(isSaving, message = "", isError = false) {
  [saveSessionButton, confirmSessionSaveButton].forEach((button) => {
    if (!button) return;
    button.disabled = isSaving;
  });
  if (saveSessionButton) saveSessionButton.textContent = isSaving ? "กำลังบันทึก..." : "บันทึกจริง";
  if (confirmSessionSaveButton) confirmSessionSaveButton.textContent = isSaving ? "กำลังบันทึก..." : "บันทึกหลังเรียนจริง";
  if (message || isSaving) setSheetStatus(message, isError);
}

async function saveSession() {
  const input = pendingSessionInput || getSessionInput();
  if (!input || !activeSessionEnrollment) {
    setSheetStatus("ไม่พบข้อมูลคอร์สที่กำลังบันทึก กรุณาปิดแล้วลองใหม่อีกครั้ง", true);
    return;
  }
  if (!lineUserId) {
    setSheetStatus("ไม่พบ LINE user id กรุณาเปิดจาก LINE OA อีกครั้ง", true);
    return;
  }
  setSessionSavingState(true, "กำลังบันทึกหลังเรียน...");
  try {
    let photoPath = null;
    if (sessionPhotoInput.files?.[0]) {
      setSheetStatus("กำลังอัปโหลดรูปผลงาน...");
      try {
        photoPath = await uploadLearningPhoto(activeSessionEnrollment.id);
      } catch (uploadError) {
        setSheetStatus("อัปโหลดรูปไม่สำเร็จ กำลังบันทึกข้อมูลโดยไม่แนบรูป...");
        console.warn("Learning photo upload failed", uploadError);
      }
    }
    setSheetStatus("กำลังบันทึกข้อมูลครั้งเรียน...");
    const { error } = await supabaseClient.rpc("record_teacher_liff_session", {
      p_line_user_id: lineUserId,
      p_course_enrollment_id: activeSessionEnrollment.id,
      p_session_number: input.sessionNumber,
      p_session_date: input.sessionDate,
      p_lesson_title: input.lessonTitle || null,
      p_teacher_comment: input.teacherComment || null,
      p_photo_path: photoPath
    });
    if (error) throw error;
    setSheetStatus("บันทึกหลังเรียนเรียบร้อยแล้ว");
    setMessage("บันทึกหลังเรียนเรียบร้อยแล้ว");
    closeShareSheet();
    closeRecordSheet();
    await loadPortal();
  } catch (error) {
    setSheetStatus(`บันทึกไม่สำเร็จ: ${error.message}`, true);
    setMessage(`บันทึกหลังเรียนไม่สำเร็จ: ${error.message}`, true);
  } finally {
    setSessionSavingState(false);
  }
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    setMessage("คัดลอกข้อความแล้ว");
  } catch {
    shareText.select();
    document.execCommand("copy");
    setMessage("คัดลอกข้อความแล้ว");
  }
}

async function downloadCard() {
  if (!activeShareData) return;
  if (!activeShareCardUrl || !activeShareCardBlob) {
    await refreshShareCardImage(activeShareData);
  }
  if (!activeShareCardUrl || !activeShareCardBlob) return;

  const fileName = getShareCardFileName();
  const file = new File([activeShareCardBlob], fileName, { type: "image/png" });

  if (isLineOrIosWebView()) {
    if (navigator.canShare?.({ files: [file] }) && navigator.share) {
      try {
        await navigator.share({ files: [file], title: "Toko & Poppy Card" });
        return;
      } catch {
        // Fall through to the long-press image preview when native sharing is cancelled or unavailable.
      }
    }
    if (shareImagePreview) {
      shareImagePreview.hidden = false;
      shareImagePreview.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    if (saveCardHint) saveCardHint.hidden = false;
    setMessage("กดค้างที่รูปการ์ด แล้วเลือกบันทึกรูปภาพหรือแชร์ต่อใน LINE");
    return;
  }

  const link = document.createElement("a");
  link.download = fileName;
  link.href = activeShareCardUrl;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

async function submitRegistration(event) {
  event.preventDefault();
  if (!lineUserId) {
    setMessage("ยังไม่มี LINE user id กรุณาเปิดจาก LINE OA", true);
    return;
  }
  registerButton.disabled = true;
  registerButton.textContent = "กำลังส่งคำขอ...";
  const { error } = await supabaseClient.rpc("submit_teacher_liff_application", {
    p_line_user_id: lineUserId,
    p_line_display_name: lineProfile?.displayName || null,
    p_line_picture_url: lineProfile?.pictureUrl || null,
    p_teacher_name: teacherNameInput.value,
    p_teacher_phone: teacherPhoneInput.value || null,
    p_branch_id: branchSelect.value || null
  });
  registerButton.disabled = false;
  registerButton.textContent = "ส่งคำขอให้แอดมินอนุมัติ";
  if (error) {
    setMessage(`ส่งคำขอไม่สำเร็จ: ${error.message}`, true);
    return;
  }
  setMessage("ส่งคำขอเรียบร้อย รอแอดมินสาขาอนุมัติ");
  await loadPortal();
}

function bindEvents() {
  teacherRegisterForm?.addEventListener("submit", submitRegistration);
  refreshButton?.addEventListener("click", loadPortal);
  reloadDashboardButton?.addEventListener("click", loadPortal);
  document.querySelectorAll("[data-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-tab]").forEach((item) => item.classList.toggle("active", item === button));
      const tab = button.dataset.tab;
      document.querySelector("#todayPanel").hidden = tab !== "today";
      document.querySelector("#remindersPanel").hidden = tab !== "reminders";
      document.querySelector("#sessionsPanel").hidden = tab !== "sessions";
    });
  });
  const handleTeacherTaskClick = (event) => {
    const reminderButton = event.target.closest("[data-open-reminder]");
    if (reminderButton) {
      const item = (portalData.reminders || []).find((row) => row.id === reminderButton.dataset.openReminder);
      if (item) openReminder(item);
      return;
    }

    const sessionButton = event.target.closest("[data-open-session]");
    if (!sessionButton) return;
    const item = (portalData.today_enrollments || []).find((row) => row.id === sessionButton.dataset.openSession);
    if (item) openRecordSheet(item);
  };
  todayClassList?.addEventListener("click", handleTeacherTaskClick);
  todayActionList?.addEventListener("click", handleTeacherTaskClick);
  reminderList?.addEventListener("click", (event) => {
    const openButton = event.target.closest("[data-open-reminder]");
    if (openButton) {
      const item = (portalData.reminders || []).find((row) => row.id === openButton.dataset.openReminder);
      if (item) openReminder(item);
      return;
    }
    const markButton = event.target.closest("[data-mark-reminder]");
    if (markButton) {
      const item = (portalData.reminders || []).find((row) => row.id === markButton.dataset.markReminder);
      if (item) markReminderSent(item);
    }
  });
  sessionList?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-open-session]");
    if (!button) return;
    const item = (portalData.today_enrollments || []).find((row) => row.id === button.dataset.openSession);
    if (item) openRecordSheet(item);
  });
  document.querySelectorAll("[data-close-sheet]").forEach((element) => element.addEventListener("click", closeShareSheet));
  document.querySelectorAll("[data-close-record]").forEach((element) => element.addEventListener("click", closeRecordSheet));
  copyShareTextButton?.addEventListener("click", () => copyText(shareText.value));
  downloadShareCardButton?.addEventListener("click", downloadCard);
  markReminderSentButton?.addEventListener("click", () => markReminderSent(activeReminder));
  confirmSessionSaveButton?.addEventListener("click", saveSession);
  recordForm?.addEventListener("submit", previewSession);
  copySessionDraftButton?.addEventListener("click", () => copyText(shareText.value || ""));
  saveSessionButton?.addEventListener("click", saveSession);
  lessonTitleInput?.addEventListener("input", updateCharacterCounters);
  teacherCommentInput?.addEventListener("input", updateCharacterCounters);
  strengthChoiceGroup?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-strength-choice]");
    if (!button) return;
    toggleStrengthChoice(button.dataset.strengthChoice);
  });
  cropZoomInput?.addEventListener("input", () => {
    if (!cropState) return;
    cropState.zoom = Number(cropZoomInput.value || 1);
    updateCropTransform();
  });
  resetCropButton?.addEventListener("click", resetCropPosition);
  confirmCropButton?.addEventListener("click", confirmCropPhoto);
  document.querySelectorAll("[data-cancel-crop]").forEach((element) => {
    element.addEventListener("click", cancelCropSelection);
  });
  cropStage?.addEventListener("pointerdown", (event) => {
    if (!cropState) return;
    cropState.isDragging = true;
    cropState.startX = event.clientX;
    cropState.startY = event.clientY;
    cropState.startOffsetX = cropState.offsetX;
    cropState.startOffsetY = cropState.offsetY;
    cropStage.setPointerCapture?.(event.pointerId);
  });
  cropStage?.addEventListener("pointermove", (event) => {
    if (!cropState?.isDragging) return;
    cropState.offsetX = cropState.startOffsetX + event.clientX - cropState.startX;
    cropState.offsetY = cropState.startOffsetY + event.clientY - cropState.startY;
    updateCropTransform();
  });
  ["pointerup", "pointercancel", "pointerleave"].forEach((eventName) => {
    cropStage?.addEventListener(eventName, () => {
      if (cropState) cropState.isDragging = false;
    });
  });
  sessionPhotoInput?.addEventListener("change", () => {
    const file = sessionPhotoInput.files?.[0];
    if (activeCroppedPhotoUrl) URL.revokeObjectURL(activeCroppedPhotoUrl);
    activeCroppedPhotoUrl = "";
    activeCroppedPhotoBlob = null;
    activeCroppedPhotoName = "";
    if (!file) {
      photoPreview.hidden = true;
      photoPreview.innerHTML = "";
      return;
    }
    photoPreview.hidden = false;
    photoPreview.innerHTML = `<span>กำลังเปิดเครื่องมือครอปรูป...</span>`;
    openCropModal(file);
  });
}

async function init() {
  if (!supabaseClient) {
    setMessage("ยังไม่พบ Supabase config", true);
    return;
  }
  bindEvents();
  try {
    await Promise.all([initLine(), loadBranches()]);
    await loadPortal();
  } catch (error) {
    setMessage(`เริ่มต้นระบบไม่สำเร็จ: ${error.message}`, true);
    showOnly(registerView);
  }
}

init();
