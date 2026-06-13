const authModal = document.querySelector("#authModal");
const statusModal = document.querySelector("#statusModal");
const registerForm = document.querySelector("#registerForm");
const loginForm = document.querySelector("#loginForm");
const registerTab = document.querySelector("#registerTab");
const loginTab = document.querySelector("#loginTab");
const slipInput = document.querySelector("#slipInput");
const filePreview = document.querySelector("#filePreview");
const uploadBox = document.querySelector("#uploadBox");
const branchSelect = document.querySelector("#branchSelect");
const branchSelectWrap = document.querySelector("#branchSelectWrap");
const paymentMethodInput = document.querySelector("#paymentMethod");
const paidAmountInput = registerForm.querySelector("input[name=paidAmount]");
const paidAtInput = registerForm.querySelector("input[name=paidAt]");
const paidAmountBadge = document.querySelector("#paidAmountBadge");
const paidAtBadge = document.querySelector("#paidAtBadge");
const slipBadge = document.querySelector("#slipBadge");
const toast = document.querySelector("#toast");
const authContent = document.querySelector(".auth-content");
const parentDashboardModal = document.querySelector("#parentDashboardModal");
const closeParentDashboardButton = document.querySelector("#closeParentDashboard");
const parentDashboardTitle = document.querySelector("#parentDashboardTitle");
const parentDashboardStats = document.querySelector("#parentDashboardStats");
const parentCourseProgress = document.querySelector("#parentCourseProgress");
const parentSessionTimeline = document.querySelector("#parentSessionTimeline");
const fallbackSupabaseConfig = {
  url: "https://kpdikwbutsfxwsanetvm.supabase.co",
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwZGlrd2J1dHNmeHdzYW5ldHZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3NTg2MzIsImV4cCI6MjA5NjMzNDYzMn0.6D-FQjRAv0SLZJfnEHPGsM4yt4s5sf7zvH90bVRtGLM"
};
const externalSupabaseConfig = window.SUPABASE_CONFIG || {};
const externalConfigIsValid = Boolean(
  externalSupabaseConfig.url &&
  externalSupabaseConfig.anonKey &&
  !externalSupabaseConfig.url.includes("YOUR_PROJECT") &&
  !externalSupabaseConfig.anonKey.includes("YOUR_SUPABASE")
);
const supabaseConfig = externalConfigIsValid
  ? externalSupabaseConfig
  : fallbackSupabaseConfig;
const supabaseConfigured = Boolean(supabaseConfig.url &&
  supabaseConfig.anonKey &&
  !supabaseConfig.url.includes("YOUR_PROJECT") &&
  !supabaseConfig.anonKey.includes("YOUR_SUPABASE"));
const supabaseSdkAvailable =
  typeof window.supabase?.createClient === "function";
const enrollmentSupabase = supabaseConfigured && supabaseSdkAvailable
  ? window.supabase.createClient(supabaseConfig.url, supabaseConfig.anonKey)
  : null;
document.documentElement.dataset.supabaseReady =
  String(Boolean(enrollmentSupabase));

function canUseSupabase() {
  if (!supabaseConfigured) {
    showToast("ไม่พบค่าการเชื่อมต่อ Supabase กรุณาตรวจไฟล์ supabase-config.js");
    return false;
  }
  if (!supabaseSdkAvailable) {
    showToast("โหลดระบบ Supabase ไม่สำเร็จ กรุณาตรวจอินเทอร์เน็ตแล้วรีเฟรชหน้า");
    return false;
  }
  return true;
}

function setAuthMode(mode) {
  const isRegister = mode === "register";
  registerForm.classList.toggle("hidden", !isRegister);
  loginForm.classList.toggle("hidden", isRegister);
  registerTab.classList.toggle("active", isRegister);
  loginTab.classList.toggle("active", !isRegister);
  registerTab.setAttribute("aria-selected", String(isRegister));
  loginTab.setAttribute("aria-selected", String(!isRegister));
}

function openAuth(mode) {
  setAuthMode(mode);
  authModal.classList.add("open");
  authModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  setTimeout(() => authModal.querySelector("input")?.focus(), 220);
}

function closeAuth() {
  authModal.classList.remove("open");
  authModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getPublicLearningPhotoUrl(path) {
  if (!path || !enrollmentSupabase) return "";
  const { data } = enrollmentSupabase.storage
    .from("learning-session-photos")
    .getPublicUrl(path);
  return data?.publicUrl || "";
}

function getParentCourseLabel(enrollment) {
  const courseMap = {
    robot: "โรบอท + โค้ดดิ้ง",
    art: "ศิลปะ"
  };
  const course = courseMap[enrollment.course_type] || enrollment.course_type || "คอร์สเรียน";
  return enrollment.level_label ? `${course} · ${enrollment.level_label}` : course;
}

function getCertificateCopy(enrollment) {
  const completed = Number(enrollment.completed_sessions || 0);
  const total = Number(enrollment.total_sessions || 0);
  const remaining = Math.max(total - completed, 0);

  if (enrollment.course_type === "robot") {
    if (completed >= 30) return "ครบ 30 ครั้ง พร้อมรับเกียรติบัตรจบคอร์ส";
    if (completed >= 15) return "ถึงเกณฑ์รับเกียรติบัตร 15 ครั้งแล้ว";
    return `อีก ${Math.max(15 - completed, 0)} ครั้ง ถึงเกณฑ์เกียรติบัตรแรก`;
  }

  if (enrollment.course_type === "art") {
    if (remaining === 0) return "ครบ Level แล้ว พร้อมรับเกียรติบัตร";
    return `อีก ${remaining} ครั้ง จะครบ Level นี้`;
  }

  return remaining === 0 ? "เรียนครบตามรอบแล้ว" : `เหลือ ${remaining} ครั้ง`;
}

function closeParentDashboard() {
  parentDashboardModal?.classList.remove("open");
  parentDashboardModal?.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function renderParentDashboard({ applications = [], enrollments = [], sessions = [] }) {
  const latestApplication = applications[0];
  const displayName =
    latestApplication?.student_nickname ||
    latestApplication?.student_name ||
    "นักเรียนของเรา";
  parentDashboardTitle.textContent = `สมุดพัฒนาการของ ${displayName}`;

  const totalCompleted = enrollments.reduce(
    (sum, enrollment) => sum + Number(enrollment.completed_sessions || 0),
    0
  );
  const totalRemaining = enrollments.reduce((sum, enrollment) => {
    const total = Number(enrollment.total_sessions || 0);
    const completed = Number(enrollment.completed_sessions || 0);
    return sum + Math.max(total - completed, 0);
  }, 0);

  parentDashboardStats.innerHTML = [
    ["สมัครเรียน", `${applications.length}`, "ครั้ง"],
    ["เรียนแล้ว", `${totalCompleted}`, "ครั้ง"],
    ["ยังเหลือ", `${totalRemaining}`, "ครั้ง"]
  ].map(([label, value, unit]) => `
    <div class="parent-stat-card">
      <span>${label}</span>
      <strong>${value}</strong>
      <small>${unit}</small>
    </div>
  `).join("");

  if (!enrollments.length) {
    parentCourseProgress.innerHTML = `
      <div class="parent-empty-panel">ยังไม่มีคอร์สที่เปิดสิทธิ์ในสมุดพัฒนาการ</div>
    `;
  } else {
    parentCourseProgress.innerHTML = enrollments.map((enrollment) => {
      const total = Number(enrollment.total_sessions || 0);
      const completed = Number(enrollment.completed_sessions || 0);
      const percent = total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;
      const icon = enrollment.course_type === "robot" ? "🤖" : "🎨";
      return `
        <article class="parent-course-card">
          <div class="parent-course-top">
            <span class="parent-course-icon">${icon}</span>
            <div>
              <strong>${escapeHtml(getParentCourseLabel(enrollment))}</strong>
              <small>${escapeHtml(getCertificateCopy(enrollment))}</small>
            </div>
          </div>
          <div class="parent-progress"><i style="width:${percent}%"></i></div>
          <div class="parent-course-meta">
            <span>${completed}/${total} ครั้ง</span>
            <span>${percent}%</span>
          </div>
        </article>
      `;
    }).join("");
  }

  const enrollmentMap = new Map(enrollments.map((enrollment) => [enrollment.id, enrollment]));
  if (!sessions.length) {
    parentSessionTimeline.innerHTML = `
      <div class="parent-empty-panel">ยังไม่มีรูปผลงานหรือคอมเมนต์จากคุณครู</div>
    `;
    return;
  }

  parentSessionTimeline.innerHTML = sessions.map((session) => {
    const enrollment = enrollmentMap.get(session.course_enrollment_id) || {};
    const photoUrl = getPublicLearningPhotoUrl(session.photo_path);
    const sessionDate = session.session_date
      ? new Date(session.session_date).toLocaleDateString("th-TH", {
          year: "numeric",
          month: "short",
          day: "numeric"
        })
      : "ยังไม่ระบุวันที่";
    return `
      <article class="parent-session-item">
        ${photoUrl
          ? `<img class="parent-session-image" src="${photoUrl}" alt="ผลงานการเรียนครั้งที่ ${session.session_number || ""}">`
          : `<div class="parent-session-placeholder">📸</div>`}
        <div>
          <span>${escapeHtml(sessionDate)} · ครั้งที่ ${session.session_number || "-"}</span>
          <strong>${escapeHtml(session.lesson_title || getParentCourseLabel(enrollment))}</strong>
          <p>${escapeHtml(session.teacher_comment || "คุณครูยังไม่ได้เขียนคอมเมนต์สำหรับครั้งนี้")}</p>
        </div>
      </article>
    `;
  }).join("");
}

async function openParentDashboard(userId) {
  if (!parentDashboardModal || !enrollmentSupabase) return;

  parentDashboardModal.classList.add("open");
  parentDashboardModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  parentDashboardTitle.textContent = "กำลังโหลดสมุดพัฒนาการ...";
  parentDashboardStats.innerHTML = "";
  parentCourseProgress.innerHTML = '<div class="parent-empty-panel">กำลังอ่านข้อมูลคอร์สเรียน...</div>';
  parentSessionTimeline.innerHTML = '<div class="parent-empty-panel">กำลังอ่านรูปผลงานล่าสุด...</div>';

  try {
    const [applicationResult, enrollmentResult, sessionResult] = await Promise.all([
      enrollmentSupabase
        .from("enrollment_applications")
        .select("id, student_name, student_nickname, course, status, robot_access, art_access, created_at")
        .eq("parent_user_id", userId)
        .order("created_at", { ascending: false }),
      enrollmentSupabase
        .from("course_enrollments")
        .select("*")
        .eq("parent_user_id", userId)
        .order("created_at", { ascending: false }),
      enrollmentSupabase
        .from("learning_sessions")
        .select("*")
        .eq("parent_user_id", userId)
        .order("session_date", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(40)
    ]);

    const error = applicationResult.error || enrollmentResult.error || sessionResult.error;
    if (error) throw error;

    renderParentDashboard({
      applications: applicationResult.data || [],
      enrollments: enrollmentResult.data || [],
      sessions: sessionResult.data || []
    });
  } catch (error) {
    parentDashboardTitle.textContent = "ยังโหลดสมุดพัฒนาการไม่ได้";
    parentDashboardStats.innerHTML = "";
    parentCourseProgress.innerHTML = `
      <div class="parent-empty-panel">
        กรุณารันไฟล์ SQL <strong>outputs/supabase-learning-history-schema.sql</strong> ก่อนใช้งานส่วนนี้
      </div>
    `;
    parentSessionTimeline.innerHTML = `
      <div class="parent-empty-panel">${escapeHtml(error.message || "ไม่ทราบสาเหตุ")}</div>
    `;
    showToast(`โหลดสมุดพัฒนาการไม่สำเร็จ: ${error.message}`);
  }
}

async function loadBranches() {
  if (!branchSelect || !enrollmentSupabase) return;
  const { data, error } = await enrollmentSupabase
    .from("branches")
    .select("id, name")
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) {
    branchSelect.innerHTML = '<option value="">ยังโหลดสาขาไม่ได้ ใช้สมัครออนไลน์ได้ก่อน</option>';
    return;
  }

  const branches = data || [];
  branchSelect.innerHTML = [
    '<option value="">เลือกสาขาที่สมัคร</option>',
    ...branches.map((branch) =>
      `<option value="${branch.id}">${branch.name}</option>`
    )
  ].join("");
}

function syncEnrollmentSource() {
  const selectedSource =
    registerForm.querySelector("input[name=enrollmentSource]:checked")?.value || "online";
  const isBranch = selectedSource === "branch";
  branchSelectWrap.hidden = !isBranch;
  branchSelect.required = isBranch;
  if (!isBranch) branchSelect.value = "";
}

function syncPaymentRequirements() {
  const method = paymentMethodInput.value;
  const isPaid = ["cash", "transfer", "admin_chat"].includes(method);
  const needsSlip = method === "transfer";

  paidAmountInput.required = isPaid;
  paidAtInput.required = isPaid;
  slipInput.required = needsSlip;
  paidAmountInput.setCustomValidity("");
  paidAtInput.setCustomValidity("");
  slipInput.setCustomValidity("");
  uploadBox.classList.toggle("required-upload", needsSlip);

  paidAmountBadge.textContent = isPaid ? "จำเป็นเมื่อชำระแล้ว" : "เว้นว่างได้";
  paidAtBadge.textContent = isPaid ? "จำเป็นเมื่อชำระแล้ว" : "เว้นว่างได้";
  slipBadge.textContent = needsSlip ? "จำเป็นเมื่อโอนเงิน" : "เว้นว่างได้";
}

function setFriendlyValidationMessages() {
  const messages = {
    studentName: "กรุณากรอกชื่อ - นามสกุลนักเรียน",
    studentNickname: "กรุณากรอกชื่อเล่นนักเรียน",
    parentName: "กรุณากรอกชื่อผู้ปกครอง",
    phone: "กรุณากรอกเบอร์โทรศัพท์ผู้ปกครอง",
    email: "กรุณากรอกอีเมลผู้ปกครองให้ถูกต้อง",
    birthDate: "กรุณาเลือกวันเกิดนักเรียน",
    password: "กรุณาตั้งรหัสผ่านอย่างน้อย 8 ตัวอักษร",
    branchId: "กรุณาเลือกสาขาที่สมัคร",
    paymentMethod: "กรุณาเลือกวิธีชำระเงิน",
    paidAmount: "กรุณากรอกยอดชำระ",
    paidAt: "กรุณาเลือกวันที่ชำระ",
    slip: "กรุณาแนบหลักฐานการโอนเงิน"
  };

  registerForm.querySelectorAll("input, select, textarea").forEach((field) => {
    const message = messages[field.name];
    if (!message) return;
    field.addEventListener("invalid", () => {
      field.setCustomValidity(message);
    });
    field.addEventListener("input", () => {
      field.setCustomValidity("");
    });
    field.addEventListener("change", () => {
      field.setCustomValidity("");
    });
  });
}

function showToast(message, duration = 4000) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), duration);
}

function isExistingUserError(error) {
  const message = `${error?.message || ""}`.toLowerCase();
  return message.includes("already registered") ||
    message.includes("already exists") ||
    message.includes("user already") ||
    message.includes("email rate limit");
}

function getFriendlySupabaseError(error) {
  const message = error?.message || "ไม่ทราบสาเหตุ";
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("email not confirmed")) {
    return "บัญชีนี้ถูกสร้างแล้ว แต่ยังไม่ได้ยืนยันอีเมล กรุณาปิด Confirm email ใน Supabase Auth หรือยืนยันอีเมลก่อน แล้วกดสมัครอีกครั้ง";
  }
  if (lowerMessage.includes("invalid login credentials")) {
    return "อีเมลนี้มีบัญชีอยู่แล้ว แต่รหัสผ่านที่กรอกไม่ตรงกับบัญชีเดิม กรุณาใช้รหัสเดิมหรือลองสมัครด้วยอีเมลใหม่";
  }
  if (lowerMessage.includes("branch is required")) {
    return "กรุณาเลือกสาขาที่สมัคร";
  }
  if (lowerMessage.includes("selected branch is not active")) {
    return "สาขาที่เลือกยังไม่เปิดใช้งาน กรุณาเลือกสาขาใหม่";
  }
  if (lowerMessage.includes("row-level security") || lowerMessage.includes("permission denied")) {
    return "สิทธิ์ Supabase ยังไม่ครบ กรุณารัน SQL schema ล่าสุดอีกครั้งใน Supabase";
  }
  return message;
}

async function getEnrollmentUser(formData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const { data: signUpData, error: signUpError } =
    await enrollmentSupabase.auth.signUp({ email, password });

  if (!signUpError && signUpData.session && signUpData.user) {
    return signUpData.user;
  }

  if (!signUpError && signUpData.user && !signUpData.session) {
    const { data: signInData, error: signInError } =
      await enrollmentSupabase.auth.signInWithPassword({ email, password });
    if (!signInError && signInData.user) return signInData.user;
    throw signInError || new Error(
      "สร้างบัญชีแล้ว แต่ยังไม่มี session สำหรับบันทึกใบสมัคร กรุณาปิด Confirm email ใน Supabase Auth Settings"
    );
  }

  if (isExistingUserError(signUpError)) {
    const { data: signInData, error: signInError } =
      await enrollmentSupabase.auth.signInWithPassword({ email, password });
    if (!signInError && signInData.user) {
      showToast("พบอีเมลนี้อยู่แล้ว ระบบจะส่งใบสมัครต่อให้ด้วยบัญชีเดิม", 6500);
      return signInData.user;
    }
    throw signInError || signUpError;
  }

  throw signUpError;
}

async function uploadPaymentSlip(userId, slip) {
  if (!(slip instanceof File && slip.size > 0)) return { slipPath: null, warning: "" };

  const extension = slip.name.split(".").pop().toLowerCase();
  const fileName = `${crypto.randomUUID()}.${extension}`;
  const slipPath = `${userId}/${fileName}`;
  const { error } = await enrollmentSupabase.storage
    .from("payment-slips")
    .upload(slipPath, slip, {
      cacheControl: "3600",
      contentType: slip.type,
      upsert: false
    });

  if (error) {
    return {
      slipPath: null,
      warning: `ระบบอัปโหลดหลักฐานไม่สำเร็จ: ${error.message}`
    };
  }

  return { slipPath, warning: "" };
}

document.querySelectorAll("[data-open-auth]").forEach((button) => {
  button.addEventListener("click", () => openAuth(button.dataset.openAuth));
});

document.querySelector(".modal-close").addEventListener("click", closeAuth);
registerTab.addEventListener("click", () => setAuthMode("register"));
loginTab.addEventListener("click", () => setAuthMode("login"));

authModal.addEventListener("click", (event) => {
  if (event.target === authModal) closeAuth();
});

parentDashboardModal?.addEventListener("click", (event) => {
  if (event.target === parentDashboardModal) closeParentDashboard();
});

closeParentDashboardButton?.addEventListener("click", closeParentDashboard);

authModal.addEventListener("wheel", (event) => {
  if (window.innerWidth <= 720 || authContent.contains(event.target)) return;
  authContent.scrollBy({ top: event.deltaY });
  event.preventDefault();
}, { passive: false });

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (parentDashboardModal?.classList.contains("open")) {
      closeParentDashboard();
    } else if (statusModal.classList.contains("open")) {
      statusModal.classList.remove("open");
      document.body.style.overflow = "";
    } else {
      closeAuth();
    }
  }
});

document.querySelectorAll(".toggle-password").forEach((button) => {
  button.addEventListener("click", () => {
    const input = button.previousElementSibling;
    const show = input.type === "password";
    input.type = show ? "text" : "password";
    button.textContent = show ? "🙈" : "👁";
    button.setAttribute("aria-label", show ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน");
  });
});

function renderFile(file) {
  if (!file) return;
  const allowedTypes = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    slipInput.value = "";
    filePreview.classList.remove("show");
    showToast("กรุณาเลือกไฟล์ภาพ PNG, JPG หรือ WEBP");
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    slipInput.value = "";
    filePreview.classList.remove("show");
    showToast("ไฟล์มีขนาดเกิน 5 MB");
    return;
  }
  const imageUrl = URL.createObjectURL(file);
  filePreview.innerHTML = `<img src="${imageUrl}" alt="ตัวอย่างสลิป"><span>${file.name}</span>`;
  filePreview.classList.add("show");
}

slipInput.addEventListener("change", () => renderFile(slipInput.files[0]));

registerForm.querySelectorAll("input[name=enrollmentSource]").forEach((input) => {
  input.addEventListener("change", syncEnrollmentSource);
});

paymentMethodInput.addEventListener("change", syncPaymentRequirements);

["dragenter", "dragover"].forEach((eventName) => {
  uploadBox.addEventListener(eventName, (event) => {
    event.preventDefault();
    uploadBox.classList.add("dragging");
  });
});

["dragleave", "drop"].forEach((eventName) => {
  uploadBox.addEventListener(eventName, (event) => {
    event.preventDefault();
    uploadBox.classList.remove("dragging");
  });
});

uploadBox.addEventListener("drop", (event) => {
  const file = event.dataTransfer.files[0];
  if (!file) return;
  const transfer = new DataTransfer();
  transfer.items.add(file);
  slipInput.files = transfer.files;
  renderFile(file);
});

document.querySelector(".copy-account")?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText("xxx-x-xxxxx-x");
    showToast("คัดลอกเลขบัญชีแล้ว");
  } catch {
    showToast("เลขบัญชี: xxx-x-xxxxx-x");
  }
});

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  syncPaymentRequirements();
  if (!registerForm.checkValidity()) {
    registerForm.reportValidity();
    return;
  }
  if (!canUseSupabase()) return;

  const submitButton = registerForm.querySelector(".submit-button");
  const formData = new FormData(registerForm);
  const slip = formData.get("slip");
  const enrollmentSource = formData.get("enrollmentSource") || "online";
  const paymentMethod = formData.get("paymentMethod") || "unpaid";
  if (enrollmentSource === "branch" && !formData.get("branchId")) {
    showToast("กรุณาเลือกสาขาที่สมัคร");
    return;
  }
  if (["cash", "transfer", "admin_chat"].includes(paymentMethod)) {
    if (!Number(formData.get("paidAmount") || 0)) {
      showToast("กรุณากรอกยอดชำระ");
      paidAmountInput.focus();
      return;
    }
    if (!formData.get("paidAt")) {
      showToast("กรุณาเลือกวันที่ชำระ");
      paidAtInput.focus();
      return;
    }
  }
  if (paymentMethod === "transfer" && !(slip instanceof File && slip.size > 0)) {
    showToast("กรุณาแนบหลักฐานการโอนเงิน");
    uploadBox.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }
  submitButton.disabled = true;
  submitButton.innerHTML = "กำลังส่งใบสมัคร...";

  try {
    const user = await getEnrollmentUser(formData);
    const uploadResult = await uploadPaymentSlip(user.id, slip);
    const paymentNoteParts = [
      formData.get("paymentNote") || "",
      uploadResult.warning
    ].filter(Boolean);

    const { error: enrollmentError } = await enrollmentSupabase.rpc(
      "submit_enrollment",
      {
        p_student_name: formData.get("studentName"),
        p_student_nickname: formData.get("studentNickname") || null,
        p_parent_name: formData.get("parentName") || null,
        p_parent_phone: formData.get("phone"),
        p_course: formData.get("course"),
        p_enrollment_source: enrollmentSource,
        p_branch_id: enrollmentSource === "branch" ? formData.get("branchId") : null,
        p_payment_method: paymentMethod,
        p_paid_amount: Number(formData.get("paidAmount") || 0),
        p_slip_path: uploadResult.slipPath,
        p_birth_date: formData.get("birthDate") || null,
        p_allergy_food: formData.get("allergyFood") || null,
        p_allergy_pollen: formData.get("allergyPollen") || null,
        p_student_notes: formData.get("studentNotes") || null,
        p_payment_note: paymentNoteParts.join("\n") || null,
        p_paid_at: formData.get("paidAt") || null
      }
    );
    if (enrollmentError) {
      throw enrollmentError;
    }

    closeAuth();
    statusModal.classList.add("open");
    statusModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    if (uploadResult.warning) {
      showToast("ใบสมัครถูกบันทึกแล้ว แต่หลักฐานแนบไม่สำเร็จ แอดมินจะเห็นหมายเหตุในใบสมัคร", 9000);
    }
  } catch (error) {
    showToast(`ส่งใบสมัครไม่สำเร็จ: ${getFriendlySupabaseError(error)}`, 12000);
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = 'ส่งใบสมัคร <span>→</span>';
  }
});

document.querySelector("#closeStatus").addEventListener("click", () => {
  statusModal.classList.remove("open");
  statusModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  registerForm.reset();
  filePreview.innerHTML = "";
  filePreview.classList.remove("show");
  syncEnrollmentSource();
  syncPaymentRequirements();
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!canUseSupabase()) return;

  const [email, password] =
    loginForm.querySelectorAll("input:not([type=checkbox])");
  const submitButton = loginForm.querySelector(".submit-button");
  submitButton.disabled = true;
  submitButton.textContent = "กำลังเข้าสู่ระบบ...";

  const { data, error } = await enrollmentSupabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  });

  if (error) {
    submitButton.disabled = false;
    submitButton.innerHTML = 'เข้าสู่ระบบ <span>→</span>';
    showToast(`เข้าสู่ระบบไม่สำเร็จ: ${error.message}`);
    return;
  }

  const { data: application } = await enrollmentSupabase
    .from("enrollment_applications")
    .select("status, robot_access, art_access")
    .eq("parent_user_id", data.user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  submitButton.disabled = false;
  submitButton.innerHTML = 'เข้าสู่ระบบ <span>→</span>';
  closeAuth();

  if (application?.status === "approved") {
    const courses = [
      application.robot_access ? "โรบอท" : "",
      application.art_access ? "ศิลปะ" : ""
    ].filter(Boolean).join(" และ ");
    showToast(`เข้าสู่ระบบสำเร็จ เปิดสิทธิ์คอร์ส${courses}แล้ว`);
    await openParentDashboard(data.user.id);
  } else {
    showToast("บัญชียังอยู่ระหว่างรอการอนุมัติจากแอดมิน");
  }
});

syncEnrollmentSource();
syncPaymentRequirements();
setFriendlyValidationMessages();
loadBranches();
