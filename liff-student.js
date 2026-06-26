const config = window.SUPABASE_CONFIG || {};
const supabaseClient = window.supabase?.createClient(config.url, config.anonKey);

const lineFallbackCard = document.querySelector("#lineFallbackCard");
const lineProfileCard = document.querySelector("#lineProfileCard");
const linePicture = document.querySelector("#linePicture");
const lineDisplayName = document.querySelector("#lineDisplayName");
const lineStatus = document.querySelector("#lineStatus");
const messageCard = document.querySelector("#messageCard");
const dashboard = document.querySelector("#dashboard");
const studentSwitcher = document.querySelector("#studentSwitcher");
const studentName = document.querySelector("#studentName");
const studentMeta = document.querySelector("#studentMeta");
const activeCourseCount = document.querySelector("#activeCourseCount");
const remainingCount = document.querySelector("#remainingCount");
const sessionCount = document.querySelector("#sessionCount");
const applicationList = document.querySelector("#applicationList");
const studentNotes = document.querySelector("#studentNotes");
const courseList = document.querySelector("#courseList");
const timelineList = document.querySelector("#timelineList");
const editStudentButton = document.querySelector("#editStudentButton");
const editProfilePanel = document.querySelector("#editProfilePanel");
const editProfileForm = document.querySelector("#editProfileForm");
const closeEditProfileButton = document.querySelector("#closeEditProfileButton");
const cancelEditProfileButton = document.querySelector("#cancelEditProfileButton");
const saveEditProfileButton = document.querySelector("#saveEditProfileButton");
const editBirthDate = document.querySelector("#editBirthDate");
const editNickname = document.querySelector("#editNickname");
const editParentName = document.querySelector("#editParentName");
const editParentPhone = document.querySelector("#editParentPhone");
const editAllergyFood = document.querySelector("#editAllergyFood");
const editAllergyPollen = document.querySelector("#editAllergyPollen");
const editStudentNotes = document.querySelector("#editStudentNotes");

const courseMeta = {
  robot: { label: "Robot Coding", icon: "🤖" },
  art: { label: "ศิลปะ", icon: "🎨" },
  creative_art: { label: "Creative Art", icon: "🎨" },
  water_color: { label: "สีน้ำ", icon: "💧" },
  clay: { label: "ปั้นดินเบา", icon: "🧱" }
};

const statusMeta = {
  pending: { label: "รอตรวจสอบ", color: "yellow" },
  approved: { label: "อนุมัติแล้ว", color: "green" },
  rejected: { label: "ไม่อนุมัติ", color: "red" },
  payment_review: { label: "รอตรวจสลิป", color: "yellow" },
  paid: { label: "ชำระแล้ว", color: "green" }
};

let lineProfile = null;
let lineUserId = "";
let students = [];
let selectedStudentIndex = 0;

function normalizeText(value) {
  return String(value || "").trim();
}

function escapeHtml(value) {
  return normalizeText(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function showElement(element) {
  element?.classList.remove("is-hidden");
}

function hideElement(element) {
  element?.classList.add("is-hidden");
}

function setMessage(message, type = "error") {
  messageCard.textContent = message;
  messageCard.className = `status-card ${type}`;
  showElement(messageCard);
}

function clearMessage() {
  messageCard.textContent = "";
  messageCard.className = "status-card is-hidden";
}

function getQueryValue(...keys) {
  const params = new URLSearchParams(window.location.search);
  for (const key of keys) {
    const value = normalizeText(params.get(key));
    if (value) return value;
  }
  return "";
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return normalizeText(value);
  return date.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

function formatDateInput(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function calculateAge(birthDate, fallbackAge) {
  if (!birthDate) return fallbackAge ? `${fallbackAge} ปี` : "";
  const date = new Date(birthDate);
  if (Number.isNaN(date.getTime())) return fallbackAge ? `${fallbackAge} ปี` : "";
  const today = new Date();
  let years = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) years -= 1;
  return years >= 0 ? `${years} ปี` : "";
}

function getCourseMeta(courseType) {
  return courseMeta[courseType] || { label: courseType || "คอร์สเรียน", icon: "🌿" };
}

function getStatusPill(status, paymentStatus) {
  const statusInfo = statusMeta[status] || { label: status || "รอตรวจสอบ", color: "yellow" };
  const paymentInfo = paymentStatus ? statusMeta[paymentStatus] || { label: paymentStatus, color: "yellow" } : null;
  return [
    `<span class="pill ${statusInfo.color}">${escapeHtml(statusInfo.label)}</span>`,
    paymentInfo ? `<span class="pill ${paymentInfo.color}">${escapeHtml(paymentInfo.label)}</span>` : ""
  ].join("");
}

function getPublicLearningPhotoUrl(path) {
  const cleanPath = normalizeText(path);
  if (!cleanPath || !supabaseClient) return "";
  const { data } = supabaseClient.storage.from("learning-session-photos").getPublicUrl(cleanPath);
  return data?.publicUrl || "";
}

function makeStudentKey(application) {
  return [
    normalizeText(application.student_name || application.student_nickname || "student").toLowerCase(),
    normalizeText(application.birth_date),
    normalizeText(application.parent_phone),
    normalizeText(application.parent_user_id)
  ].join("|");
}

function groupStudents(payload) {
  const applications = payload?.applications || [];
  const enrollments = payload?.enrollments || [];
  const sessions = payload?.sessions || [];
  const grouped = new Map();

  applications.forEach((application) => {
    const key = makeStudentKey(application) || application.id;
    if (!grouped.has(key)) {
      grouped.set(key, {
        key,
        applications: [],
        enrollments: [],
        sessions: [],
        displayName: application.student_name || application.student_nickname || "นักเรียน"
      });
    }
    grouped.get(key).applications.push(application);
  });

  enrollments.forEach((enrollment) => {
    const app = applications.find((application) => application.id === enrollment.application_id);
    const key = app ? makeStudentKey(app) : [
      normalizeText(enrollment.student_name || enrollment.student_nickname || "student").toLowerCase(),
      "",
      "",
      normalizeText(enrollment.parent_user_id)
    ].join("|");

    if (!grouped.has(key)) {
      grouped.set(key, {
        key,
        applications: [],
        enrollments: [],
        sessions: [],
        displayName: enrollment.student_name || enrollment.student_nickname || "นักเรียน"
      });
    }
    grouped.get(key).enrollments.push(enrollment);
  });

  sessions.forEach((session) => {
    const enrollment = enrollments.find((item) => item.id === session.course_enrollment_id);
    const app = applications.find((application) => application.id === session.application_id || application.id === enrollment?.application_id);
    const key = app ? makeStudentKey(app) : [
      normalizeText(session.student_name || session.student_nickname || "student").toLowerCase(),
      "",
      "",
      normalizeText(session.parent_user_id)
    ].join("|");

    if (!grouped.has(key)) {
      grouped.set(key, {
        key,
        applications: [],
        enrollments: [],
        sessions: [],
        displayName: session.student_name || session.student_nickname || "นักเรียน"
      });
    }
    grouped.get(key).sessions.push(session);
  });

  return [...grouped.values()].filter((student) => {
    return student.applications.length || student.enrollments.length || student.sessions.length;
  });
}

function getCurrentStudent() {
  return students[selectedStudentIndex] || null;
}

function getEditableApplication(student) {
  if (!student || !lineUserId) return null;
  return student.applications.find((app) => normalizeText(app.line_user_id) === lineUserId) || null;
}

function renderStudentSwitcher() {
  if (students.length <= 1) {
    studentSwitcher.innerHTML = "";
    return;
  }

  studentSwitcher.innerHTML = students.map((student, index) => {
    const activeClass = index === selectedStudentIndex ? " is-active" : "";
    return `<button class="student-tab${activeClass}" type="button" data-student-index="${index}">${escapeHtml(student.displayName)}</button>`;
  }).join("");
}

function renderApplications(student) {
  if (!student.applications.length) {
    applicationList.innerHTML = '<div class="empty-box"><p>ยังไม่พบใบสมัครของน้องใน LINE นี้</p></div>';
    return;
  }

  applicationList.innerHTML = student.applications.map((application) => {
    const branch = [application.branch_name, application.branch_province].filter(Boolean).join(" · ") || "ยังไม่ระบุสาขา";
    const courses = application.requested_courses?.length
      ? application.requested_courses.map((course) => getCourseMeta(course).label).join(" + ")
      : getCourseMeta(application.course).label;
    return `
      <div class="app-item">
        <strong>${getStatusPill(application.status, application.payment_status)}</strong>
        <p>${escapeHtml(courses)}<br>${escapeHtml(branch)} · สมัครเมื่อ ${escapeHtml(formatDate(application.created_at))}</p>
      </div>
    `;
  }).join("");
}

function renderNotes(student) {
  const editableApp = getEditableApplication(student);
  const app = editableApp || student.applications[0] || {};

  if (editStudentButton) {
    editStudentButton.disabled = !editableApp;
    editStudentButton.textContent = editableApp ? "แก้ไขข้อมูล" : "ให้สาขาแก้ไข";
    editStudentButton.title = editableApp ? "" : "ข้อมูลนี้ไม่ได้สมัครผ่าน LINE นี้";
  }

  const notes = [
    ["วันเกิด", app.birth_date ? `${formatDate(app.birth_date)} (${calculateAge(app.birth_date, app.age_years)})` : "ยังไม่ระบุ"],
    ["ชื่อเล่น", app.student_nickname || "ยังไม่ระบุ"],
    ["ผู้ปกครอง", app.parent_name || "ยังไม่ระบุ"],
    ["เบอร์ติดต่อ", app.parent_phone || "ยังไม่ระบุ"],
    ["อาการแพ้ / หมายเหตุ", [app.allergy_food, app.allergy_pollen, app.student_notes].filter(Boolean).join(" · ") || "ไม่มีข้อมูลเพิ่มเติม"]
  ];

  studentNotes.innerHTML = notes.map(([label, value]) => `
    <div class="note-item">
      <strong>${escapeHtml(label)}</strong>
      <p>${escapeHtml(value)}</p>
    </div>
  `).join("");
}

function renderCourses(student) {
  if (!student.enrollments.length) {
    courseList.innerHTML = `
      <div class="empty-box">
        <p>ยังไม่มีคอร์สที่เปิดสิทธิ อาจอยู่ระหว่างรอสาขาอนุมัติหรือผูกบัญชีผู้ปกครอง</p>
      </div>
    `;
    return;
  }

  courseList.innerHTML = student.enrollments.map((enrollment) => {
    const meta = getCourseMeta(enrollment.course_type);
    const completed = Number(enrollment.completed_sessions || 0);
    const total = Number(enrollment.total_sessions || 0);
    const remaining = Math.max(Number(enrollment.remaining_sessions ?? total - completed), 0);
    const percent = total > 0 ? Math.min(Math.round((completed / total) * 100), 100) : 0;
    const lowClass = remaining <= 1 ? " is-critical" : remaining <= 3 ? " is-low" : "";
    const branch = [enrollment.branch_name, enrollment.branch_province].filter(Boolean).join(" · ");

    return `
      <article class="course-card${lowClass}">
        <div class="course-icon">${meta.icon}</div>
        <div>
          <h3>${escapeHtml(meta.label)}${enrollment.level_label ? ` · ${escapeHtml(enrollment.level_label)}` : ""}</h3>
          <p>${branch ? `${escapeHtml(branch)} · ` : ""}${remaining <= 3 ? "ใกล้หมดแพ็กเกจแล้ว" : "กำลังเรียนอยู่"}</p>
          <div class="progress-track" aria-label="เรียนแล้ว ${percent}%">
            <div class="progress-bar" style="width: ${percent}%"></div>
          </div>
        </div>
        <div class="course-metrics">
          <div class="metric"><strong>${completed}</strong><span>เรียนแล้ว</span></div>
          <div class="metric"><strong>${remaining}</strong><span>เหลือ</span></div>
          <div class="metric"><strong>${total}</strong><span>รวม</span></div>
        </div>
      </article>
    `;
  }).join("");
}

function renderTimeline(student) {
  const sessions = [...student.sessions].sort((a, b) => {
    const aTime = new Date(a.session_date || a.created_at).getTime();
    const bTime = new Date(b.session_date || b.created_at).getTime();
    return bTime - aTime;
  });

  if (!sessions.length) {
    timelineList.innerHTML = `
      <div class="empty-box">
        <p>ยังไม่มีบันทึกการเรียน เมื่อครูบันทึกครั้งเรียนแล้ว ผู้ปกครองจะเห็นรูปผลงานและคอมเมนต์ที่นี่</p>
      </div>
    `;
    return;
  }

  timelineList.innerHTML = sessions.map((session) => {
    const meta = getCourseMeta(session.course_type);
    const photoUrl = getPublicLearningPhotoUrl(session.photo_path);
    return `
      <article class="timeline-item${photoUrl ? "" : " no-photo"}">
        <div>
          <div class="timeline-meta">
            <span class="pill green">${escapeHtml(meta.label)}</span>
            <span class="pill">ครั้งที่ ${escapeHtml(session.session_number || "-")}</span>
            <span class="pill">${escapeHtml(formatDate(session.session_date || session.created_at))}</span>
          </div>
          <h3>${escapeHtml(session.lesson_title || "บันทึกการเรียน")}</h3>
          <p>${escapeHtml(session.teacher_comment || "ครูยังไม่ได้เพิ่มคอมเมนต์")}</p>
        </div>
        ${photoUrl ? `
          <div class="timeline-photo">
            <img src="${escapeHtml(photoUrl)}" alt="ผลงาน ${escapeHtml(session.lesson_title || "นักเรียน")}" loading="lazy" />
          </div>
        ` : ""}
      </article>
    `;
  }).join("");
}

function renderSelectedStudent() {
  const student = students[selectedStudentIndex];
  if (!student) return;
  const primaryApp = student.applications[0] || {};
  const age = calculateAge(primaryApp.birth_date, primaryApp.age_years);
  const branchNames = [...new Set([
    ...student.applications.map((app) => app.branch_name),
    ...student.enrollments.map((enrollment) => enrollment.branch_name)
  ].filter(Boolean))];
  const remaining = student.enrollments.reduce((sum, enrollment) => {
    const total = Number(enrollment.total_sessions || 0);
    const completed = Number(enrollment.completed_sessions || 0);
    return sum + Math.max(Number(enrollment.remaining_sessions ?? total - completed), 0);
  }, 0);

  studentName.textContent = student.displayName;
  studentMeta.textContent = [
    primaryApp.student_nickname ? `ชื่อเล่น ${primaryApp.student_nickname}` : "",
    age ? `อายุ ${age}` : "",
    branchNames.length ? `สาขา ${branchNames.join(", ")}` : ""
  ].filter(Boolean).join(" · ") || "ข้อมูลจากใบสมัครและคอร์สที่เปิดสิทธิ";
  activeCourseCount.textContent = student.enrollments.length;
  remainingCount.textContent = remaining;
  sessionCount.textContent = student.sessions.length;

  renderStudentSwitcher();
  renderApplications(student);
  renderNotes(student);
  renderCourses(student);
  renderTimeline(student);
  showElement(dashboard);
}

function openEditProfile() {
  const student = getCurrentStudent();
  const app = getEditableApplication(student);
  if (!app) {
    setMessage("ข้อมูลชุดนี้ไม่ได้สมัครผ่าน LINE นี้ กรุณาให้สาขาแก้ไขให้ครับ");
    return;
  }

  editBirthDate.value = formatDateInput(app.birth_date);
  editNickname.value = app.student_nickname || "";
  editParentName.value = app.parent_name || "";
  editParentPhone.value = app.parent_phone || "";
  editAllergyFood.value = app.allergy_food || "";
  editAllergyPollen.value = app.allergy_pollen || "";
  editStudentNotes.value = app.student_notes || "";

  showElement(editProfilePanel);
  document.body.classList.add("has-modal");
  editBirthDate.focus();
}

function closeEditProfile() {
  hideElement(editProfilePanel);
  document.body.classList.remove("has-modal");
}

async function saveStudentProfile(event) {
  event.preventDefault();

  const student = getCurrentStudent();
  const app = getEditableApplication(student);
  if (!app) {
    setMessage("ไม่พบใบสมัครที่แก้ไขได้จาก LINE นี้");
    closeEditProfile();
    return;
  }

  if (!editBirthDate.value) {
    setMessage("กรุณาระบุวันเกิดของน้อง");
    return;
  }

  if (!normalizeText(editParentName.value) || !normalizeText(editParentPhone.value)) {
    setMessage("กรุณาระบุชื่อผู้ปกครองและเบอร์ติดต่อ");
    return;
  }

  saveEditProfileButton.disabled = true;
  saveEditProfileButton.textContent = "กำลังบันทึก...";

  const { error } = await supabaseClient.rpc("update_liff_student_basic_info", {
    p_line_user_id: lineUserId,
    p_application_id: app.id,
    p_birth_date: editBirthDate.value,
    p_student_nickname: normalizeText(editNickname.value) || null,
    p_parent_name: normalizeText(editParentName.value),
    p_parent_phone: normalizeText(editParentPhone.value),
    p_allergy_food: normalizeText(editAllergyFood.value) || null,
    p_allergy_pollen: normalizeText(editAllergyPollen.value) || null,
    p_student_notes: normalizeText(editStudentNotes.value) || null
  });

  saveEditProfileButton.disabled = false;
  saveEditProfileButton.textContent = "บันทึกข้อมูล";

  if (error) {
    console.error(error);
    setMessage(`บันทึกไม่สำเร็จ: ${error.message}`);
    return;
  }

  closeEditProfile();
  setMessage("บันทึกข้อมูลน้องเรียบร้อยแล้ว", "success");
  await loadDashboard({ preferredApplicationId: app.id });
}

async function setupLineProfile() {
  const browserLineId = getQueryValue("line_user_id", "lineUserId", "line");
  const browserDisplayName = getQueryValue("display_name", "displayName", "name");
  if (browserLineId) {
    lineUserId = browserLineId;
    lineStatus.textContent = `โหมดทดสอบ: ${browserLineId}`;
    if (browserDisplayName) {
      lineDisplayName.textContent = browserDisplayName;
      hideElement(lineFallbackCard);
      showElement(lineProfileCard);
    }
    return;
  }

  const liffId = normalizeText(config.liffStudentId || config.liffEnrollmentId);
  if (!liffId) {
    lineStatus.textContent = "ยังไม่ได้ตั้งค่า LIFF ID";
    return;
  }

  if (!window.liff) {
    lineStatus.textContent = "ไม่พบ LINE LIFF SDK";
    return;
  }

  try {
    await window.liff.init({ liffId });
    if (!window.liff.isLoggedIn()) {
      window.liff.login({ redirectUri: window.location.href });
      return;
    }

    lineProfile = await window.liff.getProfile();
    lineUserId = lineProfile.userId || "";
    lineDisplayName.textContent = lineProfile.displayName || "LINE user";
    if (lineProfile.pictureUrl) {
      linePicture.src = lineProfile.pictureUrl;
    }
    hideElement(lineFallbackCard);
    showElement(lineProfileCard);
  } catch (error) {
    console.warn("LIFF init failed", error);
    lineStatus.textContent = "เปิดผ่าน LINE OA หรือใส่ line_user_id เพื่อทดสอบ";
  }
}

async function loadDashboard(options = {}) {
  if (!supabaseClient) {
    setMessage("ยังไม่ได้เชื่อม Supabase กรุณาใส่ Project URL และ anon/public key ในไฟล์ supabase-config.js");
    return;
  }

  if (!lineUserId) {
    setMessage("ยังไม่พบ LINE user id กรุณาเปิดหน้านี้จาก LINE OA หรือทดสอบด้วย ?line_user_id=LINE_USER_ID");
    return;
  }

  clearMessage();
  const { data, error } = await supabaseClient.rpc("get_liff_student_dashboard", {
    p_line_user_id: lineUserId
  });

  if (error) {
    console.error(error);
    setMessage(`โหลดข้อมูลไม่สำเร็จ: ${error.message} กรุณาตรวจว่ารันไฟล์ supabase-liff-student-dashboard.sql แล้ว`);
    return;
  }

  students = groupStudents(data);
  if (options.preferredApplicationId) {
    const nextIndex = students.findIndex((student) => {
      return student.applications.some((application) => application.id === options.preferredApplicationId);
    });
    selectedStudentIndex = nextIndex >= 0 ? nextIndex : 0;
  } else {
    selectedStudentIndex = 0;
  }

  if (!students.length) {
    setMessage("ยังไม่พบใบสมัครหรือคอร์สที่ผูกกับ LINE นี้ หากเพิ่งสมัครเรียนให้รอสาขาตรวจสอบและอนุมัติก่อน", "success");
    return;
  }

  renderSelectedStudent();
}

studentSwitcher?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-student-index]");
  if (!button) return;
  selectedStudentIndex = Number(button.dataset.studentIndex || 0);
  renderSelectedStudent();
});

editStudentButton?.addEventListener("click", openEditProfile);
closeEditProfileButton?.addEventListener("click", closeEditProfile);
cancelEditProfileButton?.addEventListener("click", closeEditProfile);
editProfilePanel?.addEventListener("click", (event) => {
  if (event.target === editProfilePanel) closeEditProfile();
});
editProfileForm?.addEventListener("submit", saveStudentProfile);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !editProfilePanel?.classList.contains("is-hidden")) {
    closeEditProfile();
  }
});

async function init() {
  await setupLineProfile();
  await loadDashboard();
}

init();
