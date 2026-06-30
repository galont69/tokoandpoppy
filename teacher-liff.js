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

const weekdayLabels = ["วันอาทิตย์", "วันจันทร์", "วันอังคาร", "วันพุธ", "วันพฤหัสบดี", "วันศุกร์", "วันเสาร์"];
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
    data.branchName ? `สาขา: ${data.branchName}` : "",
    `${data.courseIcon} ${data.courseName}`,
    `วันที่ ${formatThaiDate(data.sessionDate)} · ${sessionText}`,
    data.lessonTitle ? `บทเรียนวันนี้: ${data.lessonTitle}` : "",
    data.teacherComment ? `คอมเมนต์คุณครู: ${data.teacherComment}` : "",
    data.totalSessions ? `คงเหลือ ${data.remainingAfter} ครั้ง` : "",
    "ขอบคุณค่ะ/ครับ"
  ].filter(Boolean).join("\n");
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
    const [
      cardLogo,
      locationIcon,
      sunIcon,
      sparkleIcon,
      teacherHeartIcon,
      heartIcon,
      trophyIcon,
      bookIcon,
      courseIcon
    ] = await Promise.all([
      loadCanvasImage(sessionSummaryAssets.logo),
      loadCanvasImage(sessionSummaryAssets.location),
      loadCanvasImage(sessionSummaryAssets.sun),
      loadCanvasImage(sessionSummaryAssets.star),
      loadCanvasImage(sessionSummaryAssets.teacherHeart),
      loadCanvasImage(sessionSummaryAssets.heart),
      loadCanvasImage(sessionSummaryAssets.trophy),
      loadCanvasImage(sessionSummaryAssets.book),
      loadCanvasImage(sessionSummaryAssets.course[data.courseType] || sessionSummaryAssets.course.creative_art)
    ]);
    const childLabel = String(data.childLabel || "น้อง").replace(/^น้อง/, "").slice(0, 14);
    const lessonTitle = data.lessonTitle || data.primaryLine || "กิจกรรมสร้างสรรค์";
    const teacherNote = data.teacherComment || data.note || "วันนี้ตั้งใจเรียนดีมาก เก็บผลงานไว้เป็นกำลังใจนะคะ/ครับ";
    const sessionNumber = Number(data.sessionNumber || 0);
    const totalSessions = Number(data.totalSessions || 0);
    const completed = Number(data.completedAfter || sessionNumber || 0);
    const remaining = totalSessions ? Math.max(totalSessions - completed, 0) : 0;
    const displayTotal = totalSessions || Math.max(sessionNumber, completed, 4);

    ctx.fillStyle = "#FAF6EF";
    ctx.fillRect(0, 0, width, height);

    const glow = ctx.createRadialGradient(550, 250, 80, 550, 250, 760);
    glow.addColorStop(0, "rgba(255, 255, 255, 0.88)");
    glow.addColorStop(1, "rgba(250, 246, 239, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    [
      ["#F4C64E", 502, 66],
      ["#F05B3E", 598, 50],
      ["#6EA154", 448, 118],
      ["#F8B7C8", 1030, 214],
      ["#F4C64E", 960, 156],
      ["#6EA154", 560, 112],
      ["#F05B3E", 840, 92]
    ].forEach(([color, x, y]) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(x - 3, y - 12, 6, 24);
      ctx.fillRect(x - 12, y - 3, 24, 6);
    });

    drawCardImage(ctx, cardLogo, 54, 34, 140, 140, 1, "contain");
    ctx.strokeStyle = "#D7B99C";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(220, 62);
    ctx.lineTo(220, 150);
    ctx.stroke();

    if (data.branchName) {
      drawCardShadow(ctx, 778, 50, 254, 60, 30, "#FFFFFF", "#DFBF9F");
      drawCardImage(ctx, locationIcon, 804, 63, 34, 34, 1, "contain");
      ctx.fillStyle = "#4F8B37";
      ctx.font = "800 26px Kanit, 'Noto Sans Thai', sans-serif";
      wrapCanvasTextByChar(ctx, `สาขา ${data.branchName}`, 848, 89, 150, 30, 1);
    }

    drawCardImage(ctx, sunIcon, 42, 136, 78, 78, 1, "contain");
    drawSessionSummaryTitle(ctx, `น้อง${childLabel}`);
    ctx.fillStyle = "#876F5F";
    ctx.font = "700 24px Kanit, 'Noto Sans Thai', sans-serif";
    ctx.fillText(formatThaiDate(data.sessionDate), 124, 248);

    const photoX = 48;
    const photoY = 270;
    const photoW = 984;
    const photoH = 594;
    drawCardShadow(ctx, photoX, photoY, photoW, photoH, 38, "#FFFFFF", "#F1DEC8");
    if (photo) {
      drawRoundImage(ctx, photo, photoX + 14, photoY + 14, photoW - 28, photoH - 28, 26, "cover");
    } else {
      ctx.fillStyle = "#F5EFE4";
      roundedRect(ctx, photoX + 14, photoY + 14, photoW - 28, photoH - 28, 26);
      ctx.fill();
      ctx.fillStyle = "#8B7668";
      ctx.font = "800 42px Kanit, 'Noto Sans Thai', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("เลือกรูปผลงานครั้งนี้", width / 2, photoY + photoH / 2);
      ctx.textAlign = "start";
    }

    ctx.fillStyle = "#62A742";
    roundedRect(ctx, 78, 304, 218, 54, 8);
    ctx.fill();
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "900 25px Kanit, 'Noto Sans Thai', sans-serif";
    ctx.fillText("★  ผลงานวันนี้", 96, 339);

    const infoY = 895;
    drawCardShadow(ctx, 48, infoY, 984, 126, 26, "#FFFFFF", "#F1DEC8");
    [224, 770].forEach((x) => {
      ctx.strokeStyle = "#D7B99C";
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(x, infoY + 26);
      ctx.lineTo(x, infoY + 102);
      ctx.stroke();
      ctx.setLineDash([]);
    });
    drawCardImage(ctx, courseIcon, 110, infoY + 31, 64, 64, 1, "contain");
    drawSessionInfoColumn(ctx, {
      icon: bookIcon,
      title: `บทที่ ${sessionNumber || "-"}`,
      subtitle: lessonTitle,
      accent: "#4A372E",
      iconSize: 54,
      titleFont: "800 32px Kanit, 'Noto Sans Thai', sans-serif",
      subtitleFont: "700 27px Kanit, 'Noto Sans Thai', sans-serif"
    }, 252, infoY, 490, 126);
    drawSessionInfoColumn(ctx, {
      title: "ครั้งที่",
      subtitle: totalSessions ? `${sessionNumber}/${totalSessions}` : String(sessionNumber || "-"),
      big: true
    }, 820, infoY, 176, 126);

    const noteY = 1044;
    drawCardShadow(ctx, 48, noteY, 984, 174, 26, "#FFFFFF", "#F1DEC8");
    drawCardImage(ctx, teacherHeartIcon, 72, noteY + 44, 88, 88, 1, "contain");
    drawCardImage(ctx, heartIcon, 856, noteY + 50, 108, 108, 0.38, "contain");
    ctx.fillStyle = "#F05B3E";
    ctx.font = "900 31px Kanit, 'Noto Sans Thai', sans-serif";
    ctx.fillText("ข้อความจากคุณครู", 188, noteY + 61);
    drawCardText(ctx, teacherNote, 188, noteY + 104, 610, 34, 3, {
      color: "#4A372E",
      font: "700 25px Kanit, 'Noto Sans Thai', sans-serif"
    });

    const progressY = 1238;
    drawCardShadow(ctx, 48, progressY, 984, 102, 28, "#F2F8EC", "#93B985");
    drawCardImage(ctx, trophyIcon, 70, progressY + 15, 72, 72, 1, "contain");
    ctx.save();
    ctx.fillStyle = "#4A372E";
    ctx.font = "900 30px Kanit, 'Noto Sans Thai', sans-serif";
    ctx.fillText(`เรียนแล้ว ${completed || sessionNumber || 0} ครั้ง`, 178, progressY + 46);
    ctx.fillStyle = "#4A372E";
    ctx.font = "500 20px Kanit, 'Noto Sans Thai', sans-serif";
    ctx.fillText("เก่งขึ้นทุกครั้งเลยนะ!", 178, progressY + 78);
    drawProgressBar(ctx, completed || sessionNumber, displayTotal, 430, progressY + 34, 300, 28);
    ctx.fillStyle = "#4A372E";
    ctx.font = "900 27px Kanit, 'Noto Sans Thai', sans-serif";
    ctx.fillText("คงเหลือ", 786, progressY + 60);
    ctx.fillStyle = "#18743D";
    ctx.font = "900 34px Kanit, 'Noto Sans Thai', sans-serif";
    ctx.fillText(`${remaining}`, 888, progressY + 60);
    ctx.fillStyle = "#4A372E";
    ctx.font = "900 27px Kanit, 'Noto Sans Thai', sans-serif";
    ctx.fillText("ครั้ง", 930, progressY + 60);
    drawCardImage(ctx, sparkleIcon, 960, progressY + 18, 54, 54, 1, "contain");
    ctx.restore();
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

function openRecordSheet(item) {
  activeSessionEnrollment = item;
  pendingSessionInput = null;
  const completed = Number(item.completed_sessions || 0);
  const total = Number(item.total_sessions || 0);
  const next = total ? Math.min(completed + 1, total) : completed + 1;
  recordTitle.textContent = `บันทึก ${getChildLabel(item)}`;
  recordSubtitle.textContent = `${getCourseLabel(item)} · เรียนแล้ว ${getCompletedText(item)}`;
  sessionNumberInput.value = String(next);
  sessionNumberInput.max = total ? String(total) : "";
  sessionDateInput.value = toLocalDateInputValue(new Date());
  lessonTitleInput.value = "";
  teacherCommentInput.value = "";
  sessionPhotoInput.value = "";
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
    teacherComment: normalizeText(teacherCommentInput.value)
  };
}

function buildSessionShareData(input, photoUrl = "") {
  const item = activeSessionEnrollment;
  const total = Number(item.total_sessions || 0);
  const completedAfter = Math.max(Number(item.completed_sessions || 0), input.sessionNumber);
  return {
    mode: "session",
    title: `หลังเรียน ${getChildLabel(item)}`,
    subtitle: `${getCourseLabel(item)} · ครั้งที่ ${input.sessionNumber}`,
    childLabel: getChildLabel(item),
    courseType: item.course_type || "creative_art",
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
