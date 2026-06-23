const config = window.SUPABASE_CONFIG || {};
const configured = config.url &&
  config.anonKey &&
  !config.url.includes("YOUR_PROJECT") &&
  !config.anonKey.includes("YOUR_SUPABASE");

const supabaseClient = configured
  ? window.supabase.createClient(config.url, config.anonKey)
  : null;

const loginView = document.querySelector("#adminLogin");
const shell = document.querySelector("#adminShell");
const adminAuthTitle = document.querySelector("#adminAuthTitle");
const adminAuthCopy = document.querySelector("#adminAuthCopy");
const adminLoginTab = document.querySelector("#adminLoginTab");
const branchAdminSignupTab = document.querySelector("#branchAdminSignupTab");
const loginForm = document.querySelector("#adminLoginForm");
const branchAdminSignupForm = document.querySelector("#branchAdminSignupForm");
const branchAdminBranch = document.querySelector("#branchAdminBranch");
const configWarning = document.querySelector("#configWarning");
const rows = document.querySelector("#applicationRows");
const emptyState = document.querySelector("#emptyState");
const loadingState = document.querySelector("#loadingState");
const searchInput = document.querySelector("#searchInput");
const sourceFilter = document.querySelector("#sourceFilter");
const branchFilter = document.querySelector("#branchFilter");
const dateFromFilter = document.querySelector("#dateFromFilter");
const dateToFilter = document.querySelector("#dateToFilter");
const clearFiltersButton = document.querySelector("#clearFiltersButton");
const exportCsvButton = document.querySelector("#exportCsvButton");
const reviewModal = document.querySelector("#reviewModal");
const slipFrame = document.querySelector("#slipFrame");
const openSlipLink = document.querySelector("#openSlipLink");
const accountLinkPanel = document.querySelector("#accountLinkPanel");
const parentAccountSearch = document.querySelector("#parentAccountSearch");
const parentAccountSearchButton = document.querySelector("#parentAccountSearchButton");
const parentAccountResults = document.querySelector("#parentAccountResults");
const toast = document.querySelector("#adminToast");
const robotAccess = document.querySelector("#robotAccess");
const artAccess = document.querySelector("#artAccess");
const robotSessionCount = document.querySelector("#robotSessionCount");
const artSessionCount = document.querySelector("#artSessionCount");
const creativeArtProgram = document.querySelector("#creativeArtProgram");
const waterColorProgram = document.querySelector("#waterColorProgram");
const clayProgram = document.querySelector("#clayProgram");
const creativeArtSessionCount = document.querySelector("#creativeArtSessionCount");
const waterColorSessionCount = document.querySelector("#waterColorSessionCount");
const claySessionCount = document.querySelector("#claySessionCount");
const robotSessionsField = document.querySelector("#robotSessionsField");
const artSessionsField = document.querySelector("#artSessionsField");
const rejectionReason = document.querySelector("#rejectionReason");
const approveButton = document.querySelector("#approveButton");
const rejectButton = document.querySelector("#rejectButton");
const lessonAdminList = document.querySelector("#lessonAdminList");
const lessonEditor = document.querySelector("#lessonEditor");
const lessonUploadProgress = document.querySelector("#lessonUploadProgress");
const artAdminList = document.querySelector("#artAdminList");
const artEditor = document.querySelector("#artEditor");
const artUploadProgress = document.querySelector("#artUploadProgress");
const artCategoryFilter = document.querySelector("#artCategoryFilter");
const artLevelFilter = document.querySelector("#artLevelFilter");
const artCategorySelect = document.querySelector("#artCategorySelect");
const artLevelSelect = document.querySelector("#artLevelSelect");
const artImageList = document.querySelector("#artImageList");
const deleteArtLessonButton = document.querySelector("#deleteArtLessonButton");
const branchRows = document.querySelector("#branchRows");
const branchForm = document.querySelector("#branchForm");
const branchAdminRows = document.querySelector("#branchAdminRows");
const branchAdminPendingBadge = document.querySelector("#branchAdminPendingBadge");
const refreshBranchAdminsButton = document.querySelector("#refreshBranchAdminsButton");
const teacherInviteForm = document.querySelector("#teacherInviteForm");
const teacherInviteBranch = document.querySelector("#teacherInviteBranch");
const teacherInviteRows = document.querySelector("#teacherInviteRows");
const refreshTeacherInvitesButton = document.querySelector("#refreshTeacherInvitesButton");
const branchTeacherPendingBadge = document.querySelector("#branchTeacherPendingBadge");
const learningProgressRows = document.querySelector("#learningProgressRows");
const learningLoadingState = document.querySelector("#learningLoadingState");
const learningEmptyState = document.querySelector("#learningEmptyState");
const learningSearchInput = document.querySelector("#learningSearchInput");
const learningCourseFilter = document.querySelector("#learningCourseFilter");
const learningStatusFilter = document.querySelector("#learningStatusFilter");
const learningScopeText = document.querySelector("#learningScopeText");
const refreshLearningButton = document.querySelector("#refreshLearningButton");
const recordSessionModal = document.querySelector("#recordSessionModal");
const recordSessionForm = document.querySelector("#recordSessionForm");
const recordSessionTitle = document.querySelector("#recordSessionTitle");
const recordSessionSummary = document.querySelector("#recordSessionSummary");
const recordSessionNumber = document.querySelector("#recordSessionNumber");
const recordSessionDate = document.querySelector("#recordSessionDate");
const recordLessonTitle = document.querySelector("#recordLessonTitle");
const recordTeacherComment = document.querySelector("#recordTeacherComment");
const recordSessionPhoto = document.querySelector("#recordSessionPhoto");
const recordSessionPhotoPreview = document.querySelector("#recordSessionPhotoPreview");
const saveSessionButton = document.querySelector("#saveSessionButton");
const freeResourceForm = document.querySelector("#freeResourceForm");
const freeResourceAdminList = document.querySelector("#freeResourceAdminList");
const freeResourceCount = document.querySelector("#freeResourceCount");
const refreshFreeResourcesButton = document.querySelector("#refreshFreeResourcesButton");
const freeLeadRows = document.querySelector("#freeLeadRows");
const freeLeadCount = document.querySelector("#freeLeadCount");
const freeLeadNewCount = document.querySelector("#freeLeadNewCount");
const freeLeadInterestedCount = document.querySelector("#freeLeadInterestedCount");
const freeLeadAreaCount = document.querySelector("#freeLeadAreaCount");
const freeLeadSearchInput = document.querySelector("#freeLeadSearchInput");
const freeLeadResourceFilter = document.querySelector("#freeLeadResourceFilter");
const freeLeadCategoryFilter = document.querySelector("#freeLeadCategoryFilter");
const freeLeadStatusFilter = document.querySelector("#freeLeadStatusFilter");
const refreshFreeLeadsButton = document.querySelector("#refreshFreeLeadsButton");
const exportFreeLeadsButton = document.querySelector("#exportFreeLeadsButton");
const partnerLeadRows = document.querySelector("#partnerLeadRows");
const partnerLeadCount = document.querySelector("#partnerLeadCount");
const partnerLeadNewCount = document.querySelector("#partnerLeadNewCount");
const partnerLeadInterestedCount = document.querySelector("#partnerLeadInterestedCount");
const partnerLeadAreaCount = document.querySelector("#partnerLeadAreaCount");
const partnerLeadSearchInput = document.querySelector("#partnerLeadSearchInput");
const partnerLeadCourseFilter = document.querySelector("#partnerLeadCourseFilter");
const partnerLeadStatusFilter = document.querySelector("#partnerLeadStatusFilter");
const refreshPartnerLeadsButton = document.querySelector("#refreshPartnerLeadsButton");
const exportPartnerLeadsButton = document.querySelector("#exportPartnerLeadsButton");

let applications = [];
let activeStatus = "all";
let activeApplication = null;
let currentAdminProfile = null;
let currentBranchAssignment = null;
let branchAdminApplications = [];
let branchTeacherInvitations = [];
let signupBranchesLoaded = false;
let branches = [];
let robotLessons = [];
let activeLesson = null;
let artCategories = [];
let artLevels = [];
let artLessons = [];
let activeArtLesson = null;
let learningEnrollments = [];
let activeLearningEnrollment = null;
let freeResources = [];
let freeResourceLeads = [];
let partnerLeads = [];

const courseLabels = {
  robot: ["โรบอท + โค้ดดิ้ง", "SPIKE Essential"],
  art: ["คอร์สศิลปะ", "Creative Art"],
  creative_art: ["Creative Art", "ศิลปะสร้างสรรค์"],
  water_color: ["Water Color", "สีน้ำ"],
  clay: ["ปั้นดินเบา (CLAY)", "Clay Art"],
  both: ["ทั้งสองคอร์ส", "Robot + Creative Art"]
};

const artCourseTypes = ["art", "creative_art", "water_color", "clay"];
const liffCourseTypes = ["robot", "creative_art", "water_color", "clay"];

function getApplicationCourseCodes(application = {}) {
  const requestedCourses = Array.isArray(application.requested_courses)
    ? application.requested_courses
    : [];
  const normalized = requestedCourses
    .map((course) => String(course || "").trim())
    .filter((course) => liffCourseTypes.includes(course));
  if (normalized.length) return normalized;
  return application.course ? [application.course] : [];
}

function getApplicationCourseText(application = {}) {
  const courseCodes = getApplicationCourseCodes(application);
  if (!courseCodes.length) return "-";
  return courseCodes
    .map((course) => courseLabels[course]?.[0] || course)
    .join(" + ");
}

const freeLeadStatusLabels = {
  new: "ยังไม่ติดต่อ",
  contacted: "ติดต่อแล้ว",
  interested: "สนใจ",
  trial_booked: "นัดทดลองเรียน",
  enrolled: "สมัครแล้ว",
  not_interested: "ยังไม่สนใจ"
};

const partnerLeadStatusLabels = {
  new: "ยังไม่ติดต่อ",
  contacted: "ติดต่อแล้ว",
  interested: "สนใจ",
  meeting_booked: "นัดคุยแล้ว",
  sample_sent: "ส่งชุดตัวอย่างแล้ว",
  converted: "เป็นพาร์ทเนอร์แล้ว",
  not_fit: "ยังไม่เหมาะ"
};

const partnerLeadCourseLabels = {
  creative_art: "ศิลปะสร้างสรรค์",
  clay: "ปั้นดินเบา",
  water_color: "สีน้ำ",
  robot: "Robot + Coding",
  free_resources: "สื่อฟรี/ใบงานดึงลูกค้า"
};

const partnerLeadInstituteLabels = {
  yes: "มีโรงเรียน/สถาบันอยู่แล้ว",
  planning: "กำลังวางแผนเปิด",
  no: "ยังไม่มี แต่อยากศึกษาโอกาส"
};

const freeResourceCategoryLabels = {
  thai: "ภาษาไทยผ่านนิทาน",
  math: "คณิตศาสตร์",
  science: "วิทยาศาสตร์รอบตัว",
  art: "ศิลปะ",
  unplugged_coding: "Unplugged Coding",
  trial_lesson: "นัดทดลองเรียน",
  creative_art: "ศิลปะสร้างสรรค์",
  clay: "ปั้นดินเบา",
  water_color: "สีน้ำ",
  robot: "Robot + Coding"
};

const trialLeadResourceLabels = {
  "trial-creative_art": "นัดทดลอง Creative Art",
  "trial-clay": "นัดทดลองปั้นดินเบา",
  "trial-water_color": "นัดทดลองสีน้ำ",
  "trial-robot": "นัดทดลอง Robot + Coding"
};

const artProgramControls = [
  {
    type: "creative_art",
    checkbox: creativeArtProgram,
    input: creativeArtSessionCount,
    defaultSessions: 12,
    label: "Creative Art"
  },
  {
    type: "water_color",
    checkbox: waterColorProgram,
    input: waterColorSessionCount,
    defaultSessions: 8,
    label: "Water Color"
  },
  {
    type: "clay",
    checkbox: clayProgram,
    input: claySessionCount,
    defaultSessions: 4,
    label: "ปั้นดินเบา (CLAY)"
  }
];

const statusLabels = {
  pending: "รอตรวจสอบ",
  approved: "อนุมัติแล้ว",
  rejected: "ไม่อนุมัติ"
};

const paymentMethodLabels = {
  unpaid: "ยังไม่ชำระ",
  cash: "เงินสด",
  transfer: "โอนเงิน",
  admin_chat: "ชำระผ่านแอดมิน"
};

const sourceLabels = {
  online: "สมัครออนไลน์",
  branch: "ผ่านสาขา"
};

const registrationSourceLabels = {
  web: "เว็บ",
  line_liff: "LINE LIFF",
  branch_staff: "เจ้าหน้าที่สาขา"
};

function showToast(message, isError = false) {
  toast.textContent = message;
  toast.classList.toggle("error", isError);
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 3200);
}

function setBusy(busy) {
  approveButton.disabled = busy;
  rejectButton.disabled = busy;
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[character]);
}

function formatDate(value) {
  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function formatMoney(value) {
  const amount = Number(value || 0);
  return amount.toLocaleString("th-TH", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
}

function getBranchName(application) {
  return application.branches?.name || "ไม่ระบุสาขา";
}

function isMainAdmin() {
  return currentAdminProfile?.role === "admin";
}

function isBranchAdmin() {
  return currentAdminProfile?.role === "branch_admin";
}

function isBranchTeacher() {
  return currentAdminProfile?.role === "branch_teacher";
}

function canManageBranchStaff() {
  return isMainAdmin() || isBranchAdmin();
}

function canManageApplication(application) {
  if (!application) return false;
  if (isMainAdmin()) return true;
  return isBranchAdmin() &&
    application.enrollment_source === "branch" &&
    currentBranchAssignment?.branch_id &&
    application.branch_id === currentBranchAssignment.branch_id;
}

function updateSessionPackageFields() {
  const canReview = canManageApplication(activeApplication);
  const robotEnabled = Boolean(robotAccess?.checked);
  const artEnabled = Boolean(artAccess?.checked);

  if (robotSessionCount) robotSessionCount.disabled = !canReview || !robotEnabled;
  if (artSessionCount) artSessionCount.disabled = !canReview || !artEnabled;
  artProgramControls.forEach((program) => {
    if (program.checkbox) program.checkbox.disabled = !canReview || !artEnabled;
    if (program.input) {
      program.input.disabled = !canReview || !artEnabled || !program.checkbox?.checked;
    }
  });
  robotSessionsField?.classList.toggle("muted", !robotEnabled);
  artSessionsField?.classList.toggle("muted", !artEnabled);
}

function setArtProgramsEnabled(enabled) {
  if (enabled && !artProgramControls.some((program) => program.checkbox?.checked)) {
    artProgramControls[0].checkbox.checked = true;
  }
  updateSessionPackageFields();
}

function getSessionPackageValue(input, label) {
  const value = Number.parseInt(input?.value || "", 10);
  if (!Number.isInteger(value) || value < 1) {
    throw new Error(`กรุณาระบุจำนวนครั้ง${label}อย่างน้อย 1 ครั้ง`);
  }
  if (value > 120) {
    throw new Error(`จำนวนครั้ง${label}สูงเกินไป กรุณาตรวจสอบแพ็กเกจอีกครั้ง`);
  }
  return value;
}

function getCurrentBranchName() {
  return currentBranchAssignment?.branches?.name ||
    currentBranchAssignment?.branch_name ||
    "สาขาของฉัน";
}

function toLocalDateInputValue(value) {
  if (!value) return "";
  const date = new Date(value);
  const localTime = date.getTime() - date.getTimezoneOffset() * 60000;
  return new Date(localTime).toISOString().slice(0, 10);
}

function toLocalDateTimeValue(value) {
  if (!value) return "";
  const date = new Date(value);
  const localTime = date.getTime() - date.getTimezoneOffset() * 60000;
  return new Date(localTime).toISOString().slice(0, 16).replace("T", " ");
}

function renderBranchFilterOptions() {
  if (isBranchAdmin() && currentBranchAssignment?.branch_id) {
    const branchName = getCurrentBranchName();
    branchFilter.innerHTML =
      `<option value="${currentBranchAssignment.branch_id}">${escapeHtml(branchName)}</option>`;
    branchFilter.value = currentBranchAssignment.branch_id;
    sourceFilter.value = "branch";
    sourceFilter.disabled = true;
    branchFilter.disabled = true;
    return;
  }

  sourceFilter.disabled = false;
  branchFilter.disabled = false;
  const currentValue = branchFilter.value || "all";
  const seen = new Set();
  const branchOptions = applications
    .filter((application) => application.branch_id && application.branches?.name)
    .filter((application) => {
      if (seen.has(application.branch_id)) return false;
      seen.add(application.branch_id);
      return true;
    })
    .sort((a, b) => getBranchName(a).localeCompare(getBranchName(b), "th"))
    .map((application) =>
      `<option value="${application.branch_id}">${escapeHtml(getBranchName(application))}</option>`
    );

  branchFilter.innerHTML = [
    '<option value="all">ทุกสาขา / ออนไลน์</option>',
    '<option value="online">เฉพาะออนไลน์</option>',
    '<option value="unassigned">ยังไม่ระบุสาขา</option>',
    ...branchOptions
  ].join("");
  branchFilter.value = [...branchFilter.options].some(({ value }) => value === currentValue)
    ? currentValue
    : "all";
}

async function loadBranchChoicesForSignup() {
  if (!configured || !branchAdminBranch || signupBranchesLoaded) return;
  branchAdminBranch.innerHTML = '<option value="">กำลังโหลดสาขา...</option>';
  const { data, error } = await supabaseClient
    .from("branches")
    .select("id, name, code")
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) {
    branchAdminBranch.innerHTML = '<option value="">โหลดสาขาไม่สำเร็จ</option>';
    showToast(`โหลดสาขาไม่สำเร็จ: ${error.message}`, true);
    return;
  }

  signupBranchesLoaded = true;
  branchAdminBranch.innerHTML = [
    '<option value="">เลือกสาขาที่รับผิดชอบ</option>',
    ...(data || []).map((branch) => `
      <option value="${branch.id}">
        ${escapeHtml(branch.name)}${branch.code ? ` (${escapeHtml(branch.code)})` : ""}
      </option>
    `)
  ].join("");
}

function setAdminAuthMode(mode) {
  const isSignup = mode === "signup";
  loginForm.hidden = isSignup;
  branchAdminSignupForm.hidden = !isSignup;
  adminLoginTab.classList.toggle("active", !isSignup);
  branchAdminSignupTab.classList.toggle("active", isSignup);
  adminAuthTitle.textContent = isSignup
    ? "สมัครผู้ดูแลสาขา"
    : "เข้าสู่ระบบผู้ดูแล";
  adminAuthCopy.textContent = isSignup
    ? "เลือกสาขาที่รับผิดชอบ แล้วรอแอดมินหลักอนุมัติก่อนใช้งาน"
    : "ใช้บัญชีแอดมินหลัก ผู้ดูแลสาขา หรือครูประจำสาขาที่ได้รับอนุมัติแล้ว";
  if (isSignup) loadBranchChoicesForSignup();
}

function getAuthErrorMessage(error) {
  const message = error?.message || "";
  if (/invalid login credentials/i.test(message)) {
    return "อีเมลหรือรหัสผ่านไม่ถูกต้อง ครูต้องใช้อีเมลและรหัสผ่านที่ตั้งไว้ตอนสมัครจากลิงก์เชิญครู";
  }
  if (/email not confirmed/i.test(message)) {
    return "บัญชียังไม่ได้ยืนยันอีเมล กรุณาตรวจอีเมลยืนยันก่อนเข้าสู่ระบบ";
  }
  return message || "กรุณาลองใหม่อีกครั้ง";
}

async function verifyAdmin(user) {
  const { data, error } = await supabaseClient
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  currentAdminProfile = null;
  currentBranchAssignment = null;

  if (error) {
    await supabaseClient.auth.signOut();
    throw new Error("บัญชีนี้ไม่มีสิทธิ์ผู้ดูแลระบบ");
  }

  if (data?.role === "admin") {
    currentAdminProfile = { role: "admin" };
    return;
  }

  if (data?.role === "branch_admin") {
    const { data: assignment, error: assignmentError } = await supabaseClient
      .from("branch_admin_assignments")
      .select("branch_id, is_active, branches(name, code)")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .maybeSingle();

    if (assignmentError || !assignment?.branch_id) {
      await supabaseClient.auth.signOut();
      throw new Error("บัญชีผู้ดูแลสาขานี้ยังไม่ได้รับการอนุมัติจากแอดมินหลัก");
    }

    currentAdminProfile = { role: "branch_admin" };
    currentBranchAssignment = assignment;
    return;
  }

  if (data?.role === "branch_teacher") {
    const { data: assignment, error: assignmentError } = await supabaseClient
      .from("branch_teacher_assignments")
      .select("branch_id, is_active, display_name, branches(name, code)")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .maybeSingle();

    if (assignmentError || !assignment?.branch_id) {
      await supabaseClient.auth.signOut();
      throw new Error("บัญชีครูนี้ยังไม่ได้รับการอนุมัติจากเจ้าของสาขา");
    }

    currentAdminProfile = { role: "branch_teacher" };
    currentBranchAssignment = assignment;
    return;
  }

  await supabaseClient.auth.signOut();
  throw new Error("บัญชีนี้ไม่มีสิทธิ์ผู้ดูแลระบบ");
}

function applyAdminPermissions() {
  const mainAdmin = isMainAdmin();
  const branchTeacher = isBranchTeacher();
  document.querySelectorAll("[data-main-admin-only]").forEach((element) => {
    element.hidden = !mainAdmin;
  });
  document.querySelectorAll("[data-branch-staff-admin]").forEach((element) => {
    element.hidden = !canManageBranchStaff();
  });
  document.querySelector('[data-admin-view="applications"]').hidden = branchTeacher;
  document.querySelector(".admin-profile strong").textContent = mainAdmin
    ? "ผู้ดูแลระบบ"
    : branchTeacher
      ? "ครูประจำสาขา"
      : "ผู้ดูแลสาขา";
  if (exportCsvButton) {
    exportCsvButton.textContent = mainAdmin ? "⬇ Export CSV" : "⬇ Export CSV สาขา";
  }
  if (branchTeacher) {
    showAdminView("progress");
  } else if (!mainAdmin) {
    showAdminView("applications");
  }
}

async function showDashboard(user) {
  await verifyAdmin(user);
  document.querySelector("#adminEmail").textContent = user.email;
  document.querySelector(".profile-avatar").textContent =
    (user.email?.[0] || "A").toUpperCase();
  applyAdminPermissions();
  loginView.hidden = true;
  shell.hidden = false;
  if (isBranchTeacher()) {
    await loadLearningProgress();
    return;
  }
  await loadApplications();
  if (isMainAdmin()) {
    await loadBranchAdminApplications();
  }
}

async function loadApplications() {
  if (isBranchTeacher()) {
    applications = [];
    return;
  }
  loadingState.hidden = false;
  emptyState.hidden = true;
  rows.innerHTML = "";

  let query = supabaseClient
    .from("enrollment_applications")
    .select("*, branches(name, code)")
    .order("created_at", { ascending: false });

  if (isBranchAdmin() && currentBranchAssignment?.branch_id) {
    query = query.eq("branch_id", currentBranchAssignment.branch_id);
  }

  const { data, error } = await query;

  loadingState.hidden = true;
  if (error) {
    showToast(`โหลดข้อมูลไม่สำเร็จ: ${error.message}`, true);
    return;
  }

  applications = data || [];
  renderBranchFilterOptions();
  updateStats();
  renderApplications();
}

function updateStats() {
  const count = (status) =>
    applications.filter((application) => application.status === status).length;
  const pending = count("pending");
  document.querySelector("#pendingCount").textContent = pending;
  document.querySelector("#approvedCount").textContent = count("approved");
  document.querySelector("#rejectedCount").textContent = count("rejected");
  document.querySelector("#pendingBadge").textContent = pending;
}

function showAdminView(viewName) {
  const roleAllowedViews = isBranchTeacher()
    ? ["progress"]
    : isBranchAdmin()
      ? ["applications", "progress", "branchStaff"]
      : null;
  if (roleAllowedViews && !roleAllowedViews.includes(viewName)) {
    viewName = "applications";
    if (isBranchTeacher()) viewName = "progress";
    showToast("บัญชีนี้ดูได้เฉพาะข้อมูลที่เกี่ยวข้องกับหน้าที่ของตัวเอง", true);
  }
  document.querySelectorAll(".admin-view").forEach((view) => {
    view.hidden = view.id !== `${viewName}View`;
  });
  document.querySelectorAll("[data-admin-view]").forEach((button) => {
    button.classList.toggle("active", button.dataset.adminView === viewName);
  });
  const viewCopy = {
    applications: ["ใบสมัครเรียน", "ศูนย์จัดการสมาชิก"],
    branchAdmins: ["ผู้ดูแลสาขา", "BRANCH ADMIN ACCESS"],
    branchStaff: ["ทีมสาขา/ครู", "BRANCH TEAM"],
    branches: ["สาขาเฟรนไชน์", "FRANCHISE CENTER"],
    progress: ["สมุดพัฒนาการนักเรียน", "LEARNING JOURNAL"],
    lessons: ["จัดการบทเรียนโรบอท", "ROBOT COURSE STUDIO"],
    art: ["จัดการบทเรียนศิลปะ", "ART COURSE STUDIO"],
    freeResources: ["สื่อฟรี", "FREE LEARNING HUB"],
    partnerLeads: ["Lead สถาบัน", "INSTITUTE PARTNERS"]
  };
  const [title, kicker] = viewCopy[viewName] || viewCopy.applications;
  document.querySelector(".topbar h1").textContent = title;
  document.querySelector(".page-kicker").textContent = kicker;
  document.querySelector(".sidebar").classList.remove("open");
  if (viewName === "branchAdmins") loadBranchAdminApplications();
  if (viewName === "branchStaff") loadBranchTeacherInvitations();
  if (viewName === "branches") loadBranchesAdmin();
  if (viewName === "progress") loadLearningProgress();
  if (viewName === "lessons") loadRobotLessons();
  if (viewName === "art") loadArtStudio();
  if (viewName === "freeResources") {
    loadFreeResourcesAdmin();
    loadFreeResourceLeadsAdmin();
  }
  if (viewName === "partnerLeads") loadPartnerLeadsAdmin();
}

function getCourseEnrollmentLabel(enrollment) {
  const label = courseLabels[enrollment.course_type]?.[0] ||
    enrollment.program_label ||
    enrollment.course_type ||
    "คอร์ส";
  if (enrollment.level_label && !String(enrollment.level_label).includes(label)) {
    return `${label} · ${enrollment.level_label}`;
  }
  return label;
}

function isArtCourseType(courseType) {
  return artCourseTypes.includes(courseType);
}

function getCourseIcon(courseType) {
  if (courseType === "robot") return "🤖";
  if (courseType === "water_color") return "💧";
  if (courseType === "clay") return "🧱";
  return "🎨";
}

function getLearningEnrollmentState(enrollment) {
  const completed = Number(enrollment.completed_sessions || 0);
  const total = Number(enrollment.total_sessions || 0);
  const remaining = Math.max(total - completed, 0);

  if (total > 0 && completed >= total) {
    return {
      key: "completed",
      label: "จบคอร์สแล้ว",
      helper: "เก็บประวัติไว้และค้นย้อนหลังได้",
      badgeClass: "completed"
    };
  }

  if (total > 0 && remaining <= 2) {
    return {
      key: "almost_done",
      label: "ใกล้จบ",
      helper: `เหลือ ${remaining} ครั้ง เหมาะสำหรับติดตามต่อคอร์ส`,
      badgeClass: "almost"
    };
  }

  return {
    key: "active",
    label: "กำลังเรียน",
    helper: "ยังอยู่ในแพ็กเกจปัจจุบัน",
    badgeClass: "active"
  };
}

function getLearningFilteredRows() {
  const keyword = (learningSearchInput?.value || "").trim().toLowerCase();
  const course = learningCourseFilter?.value || "all";
  const status = learningStatusFilter?.value || "active";
  return learningEnrollments.filter((enrollment) => {
    const haystack = [
      enrollment.student_name,
      enrollment.student_nickname,
      enrollment.course_type,
      enrollment.level_label
    ].filter(Boolean).join(" ").toLowerCase();
    const matchesKeyword = !keyword || haystack.includes(keyword);
    const matchesCourse = course === "all" ||
      enrollment.course_type === course ||
      (course === "art_family" && isArtCourseType(enrollment.course_type));
    const learningState = getLearningEnrollmentState(enrollment);
    const matchesStatus = status === "all" ||
      learningState.key === status ||
      (status === "active" && learningState.key !== "completed");
    return matchesKeyword && matchesCourse && matchesStatus;
  });
}

async function loadLearningProgress() {
  if (!learningProgressRows) return;
  learningLoadingState.hidden = false;
  learningEmptyState.hidden = true;
  learningProgressRows.innerHTML = "";
  learningScopeText.textContent = (isBranchAdmin() || isBranchTeacher())
    ? `กำลังดูเฉพาะนักเรียนใน${getCurrentBranchName()}`
    : "แอดมินหลักเห็นทุกสาขา ผู้ดูแลสาขาและครูเห็นเฉพาะสาขาของตัวเอง";

  let query = supabaseClient
    .from("course_enrollments")
    .select("*")
    .order("updated_at", { ascending: false });

  if ((isBranchAdmin() || isBranchTeacher()) && currentBranchAssignment?.branch_id) {
    query = query.eq("branch_id", currentBranchAssignment.branch_id);
  }

  const { data, error } = await query;
  learningLoadingState.hidden = true;

  if (error) {
    showToast(`โหลดสมุดพัฒนาการไม่สำเร็จ: ${error.message}`, true);
    learningProgressRows.innerHTML = "";
    learningEmptyState.hidden = false;
    return;
  }

  learningEnrollments = data || [];
  renderLearningProgress();
}

async function loadApplicationCoursePackages(applicationId) {
  const packages = {
    robot: 30,
    art: 12,
    creative_art: 12,
    water_color: 8,
    clay: 4,
    selectedArtPrograms: new Set()
  };
  const { data, error } = await supabaseClient
    .from("course_enrollments")
    .select("course_type,total_sessions,program_label")
    .eq("application_id", applicationId);

  if (error) return packages;
  (data || []).forEach((enrollment) => {
    if (enrollment.course_type === "robot") {
      packages.robot = Number(enrollment.total_sessions || 30);
    }
    if (enrollment.course_type === "art") {
      packages.art = Number(enrollment.total_sessions || 12);
      packages.creative_art = Number(enrollment.total_sessions || 12);
      packages.selectedArtPrograms.add("creative_art");
    }
    if (["creative_art", "water_color", "clay"].includes(enrollment.course_type)) {
      packages[enrollment.course_type] = Number(enrollment.total_sessions || packages[enrollment.course_type]);
      packages.selectedArtPrograms.add(enrollment.course_type);
    }
  });
  return packages;
}

function renderLearningProgress() {
  if (!learningProgressRows) return;
  const rows = getLearningFilteredRows();
  learningEmptyState.hidden = rows.length > 0;

  learningProgressRows.innerHTML = rows.map((enrollment) => {
    const completed = Number(enrollment.completed_sessions || 0);
    const total = Number(enrollment.total_sessions || 0);
    const remaining = Math.max(total - completed, 0);
    const percent = total ? Math.min(100, Math.round((completed / total) * 100)) : 0;
    const certificateText = enrollment.course_type === "robot"
      ? completed >= 15
        ? completed >= total ? "รับเกียรติบัตรครบคอร์สแล้ว" : "ถึงเกณฑ์รับเกียรติบัตร 15 ครั้งแล้ว"
        : `อีก ${Math.max(15 - completed, 0)} ครั้งถึงเกียรติบัตรแรก`
      : completed >= total
        ? "จบแพ็กเกจนี้แล้ว พร้อมออกเกียรติบัตร"
        : `อีก ${remaining} ครั้งจบแพ็กเกจนี้`;
    const courseLabel = getCourseEnrollmentLabel(enrollment);
    const learningState = getLearningEnrollmentState(enrollment);
    const recordButtonLabel = learningState.key === "completed"
      ? "ดู/บันทึกย้อนหลัง"
      : "+ บันทึกครั้งเรียน";

    return `
      <article class="learning-progress-row ${learningState.key === "completed" ? "is-completed" : ""}">
        <div class="learning-progress-top learning-student-cell">
          <span class="learning-avatar">${getCourseIcon(enrollment.course_type)}</span>
          <div>
            <strong>${escapeHtml(enrollment.student_name)}</strong>
            <small>${escapeHtml(enrollment.student_nickname || "ไม่มีชื่อเล่น")} · ${escapeHtml(courseLabel)}</small>
          </div>
        </div>
        <div class="learning-course-cell">
          <strong>${escapeHtml(courseLabel)}</strong>
          <small>${escapeHtml(certificateText)}</small>
          <span class="learning-status-badge ${learningState.badgeClass}">${escapeHtml(learningState.label)}</span>
        </div>
        <div class="learning-meter-cell">
          <div class="learning-meter"><i style="width: ${percent}%"></i></div>
          <small>${percent}% · ${escapeHtml(learningState.helper)}</small>
        </div>
        <div class="learning-numbers learning-row-numbers">
          <span><strong>${completed}</strong> เรียนแล้ว</span>
          <span><strong>${remaining}</strong> เหลือ</span>
          <span><strong>${total}</strong> รวม</span>
        </div>
        <button class="review-button learning-record-button" type="button" data-record-enrollment="${enrollment.id}">
          ${recordButtonLabel}
        </button>
      </article>
    `;
  }).join("");
}

function openRecordSession(enrollmentId) {
  activeLearningEnrollment = learningEnrollments.find((item) => item.id === enrollmentId);
  if (!activeLearningEnrollment) return;

  const completedSessions = Number(activeLearningEnrollment.completed_sessions || 0);
  const totalSessions = Number(activeLearningEnrollment.total_sessions || 0);
  const nextSession = completedSessions + 1;
  const defaultSession = totalSessions
    ? Math.min(nextSession, totalSessions)
    : nextSession;
  recordSessionTitle.textContent =
    `บันทึกครั้งเรียน: ${activeLearningEnrollment.student_nickname || activeLearningEnrollment.student_name}`;
  recordSessionSummary.textContent =
    `${getCourseEnrollmentLabel(activeLearningEnrollment)} · เรียนแล้ว ${completedSessions}/${totalSessions} ครั้ง · เลือกเลขครั้งเรียนย้อนหลังได้`;
  if (recordSessionNumber) {
    recordSessionNumber.value = String(defaultSession);
    recordSessionNumber.max = totalSessions ? String(totalSessions) : "";
    recordSessionNumber.placeholder = totalSessions ? `1-${totalSessions}` : "เช่น 4";
  }
  recordSessionDate.value = toLocalDateInputValue(new Date());
  recordLessonTitle.value = "";
  recordTeacherComment.value = "";
  recordSessionPhoto.value = "";
  recordSessionPhotoPreview.innerHTML = "";
  recordSessionModal.classList.add("open");
  recordSessionModal.setAttribute("aria-hidden", "false");
}

function closeRecordSession() {
  recordSessionModal.classList.remove("open");
  recordSessionModal.setAttribute("aria-hidden", "true");
  activeLearningEnrollment = null;
}

function renderLearningPhotoPreview() {
  const file = recordSessionPhoto.files?.[0];
  recordSessionPhotoPreview.innerHTML = "";
  if (!file) return;
  if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
    recordSessionPhoto.value = "";
    showToast("กรุณาเลือกไฟล์ภาพ PNG, JPG หรือ WEBP", true);
    return;
  }
  if (file.size > 8 * 1024 * 1024) {
    recordSessionPhoto.value = "";
    showToast("รูปผลงานมีขนาดเกิน 8 MB", true);
    return;
  }
  const imageUrl = URL.createObjectURL(file);
  recordSessionPhotoPreview.innerHTML =
    `<img src="${imageUrl}" alt="ตัวอย่างรูปผลงาน"><span>${escapeHtml(file.name)}</span>`;
}

async function uploadLearningPhoto(enrollmentId) {
  const file = recordSessionPhoto.files?.[0];
  if (!file) return null;
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const safeName = `${crypto.randomUUID()}.${extension}`;
  const path = `${enrollmentId}/${safeName}`;
  const { error } = await supabaseClient.storage
    .from("learning-session-photos")
    .upload(path, file, { upsert: false, contentType: file.type });
  if (error) throw error;
  return path;
}

async function saveLearningSession(event) {
  event.preventDefault();
  if (!activeLearningEnrollment) return;

  const totalSessions = Number(activeLearningEnrollment.total_sessions || 0);
  const sessionNumber = Number.parseInt(recordSessionNumber?.value || "", 10);
  if (!Number.isInteger(sessionNumber) || sessionNumber < 1) {
    showToast("กรุณาระบุครั้งที่เรียนเป็นตัวเลขอย่างน้อย 1", true);
    recordSessionNumber?.focus();
    return;
  }
  if (totalSessions && sessionNumber > totalSessions) {
    showToast(`ครั้งที่เรียนต้องไม่เกินแพ็กเกจ ${totalSessions} ครั้ง`, true);
    recordSessionNumber?.focus();
    return;
  }

  saveSessionButton.disabled = true;
  saveSessionButton.textContent = "กำลังบันทึก...";

  try {
    const photoPath = await uploadLearningPhoto(activeLearningEnrollment.id);
    const { error } = await supabaseClient.rpc("record_learning_session", {
      p_course_enrollment_id: activeLearningEnrollment.id,
      p_session_number: sessionNumber,
      p_session_date: recordSessionDate.value || null,
      p_lesson_title: recordLessonTitle.value || null,
      p_teacher_comment: recordTeacherComment.value || null,
      p_photo_path: photoPath
    });
    if (error) throw error;

    showToast("บันทึกครั้งเรียนเรียบร้อยแล้ว");
    closeRecordSession();
    await loadLearningProgress();
  } catch (error) {
    showToast(`บันทึกครั้งเรียนไม่สำเร็จ: ${error.message}`, true);
  } finally {
    saveSessionButton.disabled = false;
    saveSessionButton.textContent = "บันทึกครั้งเรียน";
  }
}

async function loadBranchesAdmin() {
  if (!isMainAdmin()) return;
  if (!branchRows) return;
  branchRows.innerHTML = '<div class="loading-state"><i></i><span>กำลังโหลดสาขา...</span></div>';
  const { data, error } = await supabaseClient
    .from("branches")
    .select("*")
    .order("is_active", { ascending: false })
    .order("name", { ascending: true });

  if (error) {
    branchRows.innerHTML = "";
    showToast(`โหลดสาขาไม่สำเร็จ: ${error.message}`, true);
    return;
  }

  branches = data || [];
  renderBranchesAdmin();
}

function renderBranchesAdmin() {
  if (!branchRows) return;
  if (!branches.length) {
    branchRows.innerHTML = `
      <div class="empty-state">
        <div>🏫</div>
        <h3>ยังไม่มีสาขา</h3>
        <p>เพิ่มสาขาแรกเพื่อให้ผู้สมัครเลือกได้จากหน้าเว็บ</p>
      </div>
    `;
    return;
  }

  branchRows.innerHTML = branches.map((branch) => `
    <article class="branch-card ${branch.is_active ? "" : "inactive"}">
      <div>
        <strong>${escapeHtml(branch.name)}</strong>
        <small>
          ${escapeHtml(branch.code || "ไม่มีรหัส")} ·
          ${escapeHtml(branch.province || "ไม่ระบุจังหวัด")} ·
          ค่าธรรมเนียม ${formatMoney(branch.franchise_fee_rate)}%
        </small>
        <small>${escapeHtml(branch.contact_name || "-")} ${escapeHtml(branch.contact_phone || "")}</small>
      </div>
      <button type="button" data-branch-toggle="${branch.id}">
        ${branch.is_active ? "ลบจาก dropdown" : "เปิดใช้งาน"}
      </button>
    </article>
  `).join("");
}

async function createBranch(event) {
  event.preventDefault();
  if (!isMainAdmin()) {
    showToast("เฉพาะแอดมินหลักเท่านั้นที่จัดการสาขาได้", true);
    return;
  }
  const payload = {
    name: document.querySelector("#branchName").value.trim(),
    code: document.querySelector("#branchCode").value.trim() || null,
    province: document.querySelector("#branchProvince").value.trim() || null,
    contact_name: document.querySelector("#branchContactName").value.trim() || null,
    contact_phone: document.querySelector("#branchContactPhone").value.trim() || null,
    franchise_fee_rate: Number(document.querySelector("#branchFeeRate").value || 0),
    is_active: true
  };

  const submitButton = branchForm.querySelector("button[type=submit]");
  submitButton.disabled = true;
  submitButton.textContent = "กำลังเพิ่มสาขา...";
  const { error } = await supabaseClient.from("branches").insert(payload);
  submitButton.disabled = false;
  submitButton.textContent = "เพิ่มสาขา";

  if (error) {
    showToast(`เพิ่มสาขาไม่สำเร็จ: ${error.message}`, true);
    return;
  }

  branchForm.reset();
  showToast("เพิ่มสาขาเรียบร้อย");
  await loadBranchesAdmin();
}

async function toggleBranch(branchId) {
  if (!isMainAdmin()) {
    showToast("เฉพาะแอดมินหลักเท่านั้นที่จัดการสาขาได้", true);
    return;
  }
  const branch = branches.find(({ id }) => id === branchId);
  if (!branch) return;
  const { error } = await supabaseClient
    .from("branches")
    .update({ is_active: !branch.is_active })
    .eq("id", branchId);

  if (error) {
    showToast(`แก้ไขสาขาไม่สำเร็จ: ${error.message}`, true);
    return;
  }

  showToast(branch.is_active ? "ลบสาขาออกจาก dropdown แล้ว" : "เปิดใช้งานสาขาแล้ว");
  await loadBranchesAdmin();
}

function getFilteredApplications() {
  const query = searchInput.value.trim().toLowerCase();
  const selectedSource = sourceFilter.value;
  const selectedBranch = branchFilter.value;
  const dateFrom = dateFromFilter.value;
  const dateTo = dateToFilter.value;
  return applications.filter((application) => {
    const matchesStatus =
      activeStatus === "all" || application.status === activeStatus;
    const matchesSource =
      selectedSource === "all" || application.enrollment_source === selectedSource;
    const matchesBranch =
      selectedBranch === "all" ||
      (selectedBranch === "online" && application.enrollment_source === "online") ||
      (selectedBranch === "unassigned" && application.enrollment_source === "branch" && !application.branch_id) ||
      application.branch_id === selectedBranch;
    const createdDate = toLocalDateInputValue(application.created_at);
    const matchesDateFrom = !dateFrom || createdDate >= dateFrom;
    const matchesDateTo = !dateTo || createdDate <= dateTo;
    const haystack = [
      application.student_name,
      application.student_nickname,
      application.parent_name,
      application.parent_email,
      application.parent_phone,
      getBranchName(application),
      getApplicationCourseText(application),
      application.paid_amount,
      application.payment_method,
      application.enrollment_source,
      application.registration_source,
      application.line_display_name,
      application.line_user_id
    ].join(" ").toLowerCase();
    return matchesStatus &&
      matchesSource &&
      matchesBranch &&
      matchesDateFrom &&
      matchesDateTo &&
      haystack.includes(query);
  });
}

function renderApplications() {
  const filtered = getFilteredApplications();

  rows.innerHTML = filtered.map((application) => {
    const [, courseDescription] =
      courseLabels[application.course] || [application.course, ""];
    const courseName = getApplicationCourseText(application);
    const approvedCourses = [
      application.robot_access ? "โรบอท" : "",
      application.art_access ? "ศิลปะ" : ""
    ].filter(Boolean).join(" + ");
    const sourceText = application.enrollment_source === "branch"
      ? `${sourceLabels.branch}: ${getBranchName(application)}`
      : sourceLabels.online;
    const registrationText =
      registrationSourceLabels[application.registration_source] ||
      application.registration_source ||
      "";
    const paymentText = paymentMethodLabels[application.payment_method] || "ไม่ระบุ";
    const proofText = application.slip_path
      ? "🧾 ดูหลักฐาน"
      : application.payment_method === "cash"
        ? "💵 เงินสด"
        : "ไม่มีหลักฐาน";

    return `
      <tr>
        <td>
          <div class="student-cell">
            <span class="student-avatar">🧒</span>
            <div>
              <strong>${escapeHtml(application.student_name)}</strong>
              <small>ชื่อเล่น: ${escapeHtml(application.student_nickname || "-")}</small>
              <small>ผู้ปกครอง: ${escapeHtml(application.parent_name || "-")}</small>
              <small>${escapeHtml(application.parent_email)}</small>
              <small>${escapeHtml(application.parent_phone)}</small>
              ${application.line_display_name ? `<small>LINE: ${escapeHtml(application.line_display_name)}</small>` : ""}
            </div>
          </div>
        </td>
        <td>
          <div class="course-cell">
            <strong>${escapeHtml(courseName)}</strong>
            <small>${escapeHtml(
              approvedCourses
                ? `สิทธิ์ที่อนุมัติ: ${approvedCourses}`
                : courseDescription
            )}</small>
            <small>${escapeHtml(sourceText)}</small>
            ${registrationText ? `<small>แหล่งที่มา: ${escapeHtml(registrationText)}</small>` : ""}
          </div>
        </td>
        <td>
          <button class="slip-button" type="button" data-review-id="${application.id}">
            ${proofText}
          </button>
          <div class="payment-mini">
            <small>${escapeHtml(paymentText)}</small>
            <small>${formatMoney(application.paid_amount)} บาท</small>
          </div>
        </td>
        <td class="date-cell">
          <strong>${formatDate(application.created_at).split(" เวลา ")[0]}</strong>
          <small>${formatDate(application.created_at)}</small>
        </td>
        <td><span class="status-pill ${application.status}">${statusLabels[application.status]}</span></td>
        <td><button class="review-button" type="button" data-review-id="${application.id}">
          ${application.status === "pending" && isMainAdmin() ? "ตรวจสอบ" : "ดูรายละเอียด"}
        </button></td>
      </tr>
    `;
  }).join("");

  emptyState.hidden = filtered.length > 0;
}

function csvCell(value) {
  const text = value === null || value === undefined ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

function exportApplicationsCsv() {
  const filtered = getFilteredApplications();
  if (!filtered.length) {
    showToast("ไม่มีใบสมัครในตัวกรองนี้ให้ Export", true);
    return;
  }

  const headers = [
    "วันที่สมัคร",
    "สถานะใบสมัคร",
    "ชื่อนักเรียน",
    "ชื่อเล่น",
    "วันเกิด",
    "อายุ",
    "ชื่อผู้ปกครอง",
    "อีเมลผู้ปกครอง",
    "เบอร์โทรผู้ปกครอง",
    "คอร์สที่สมัคร",
    "สิทธิ์โรบอท",
    "สิทธิ์ศิลปะ",
    "ช่องทางสมัคร",
    "แหล่งที่มา",
    "สาขา",
    "LINE display name",
    "LINE user id",
    "LINE picture url",
    "วิธีชำระเงิน",
    "สถานะชำระเงิน",
    "ยอดชำระ",
    "วันที่ชำระ",
    "หมายเหตุชำระเงิน",
    "มีหลักฐานชำระเงิน",
    "ที่อยู่ไฟล์หลักฐาน",
    "แพ้อาหาร",
    "แพ้เกสร / ภูมิแพ้",
    "ข้อมูลเพิ่มเติม",
    "เหตุผลไม่อนุมัติ"
  ];

  const lines = [
    headers.map(csvCell).join(","),
    ...filtered.map((application) => {
      const courseName = getApplicationCourseText(application);
      const sourceText = application.enrollment_source === "branch"
        ? sourceLabels.branch
        : sourceLabels.online;
      const registrationText =
        registrationSourceLabels[application.registration_source] ||
        application.registration_source ||
        "เว็บ";

      return [
        toLocalDateTimeValue(application.created_at),
        statusLabels[application.status] || application.status,
        application.student_name,
        application.student_nickname,
        application.birth_date,
        application.age_years,
        application.parent_name,
        application.parent_email,
        application.parent_phone,
        courseName,
        application.robot_access ? "ใช่" : "ไม่ใช่",
        application.art_access ? "ใช่" : "ไม่ใช่",
        sourceText,
        registrationText,
        application.enrollment_source === "branch" ? getBranchName(application) : "ออนไลน์",
        application.line_display_name,
        application.line_user_id,
        application.line_picture_url,
        paymentMethodLabels[application.payment_method] || application.payment_method,
        application.payment_status,
        application.paid_amount || 0,
        application.paid_at,
        application.payment_note,
        application.slip_path ? "มี" : "ไม่มี",
        application.slip_path,
        application.allergy_food,
        application.allergy_pollen,
        application.student_notes,
        application.rejection_reason
      ].map(csvCell).join(",");
    })
  ];

  const filenameDate = new Date().toISOString().slice(0, 10);
  const blob = new Blob([`\ufeff${lines.join("\n")}`], {
    type: "text/csv;charset=utf-8"
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `toko-poppy-enrollments-${filenameDate}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast(`Export CSV สำเร็จ ${filtered.length} รายการ`);
}

async function openReview(applicationId) {
  activeApplication = applications.find(({ id }) => id === applicationId);
  if (!activeApplication) return;

  document.querySelector("#reviewTitle").textContent =
    activeApplication.student_name;
  document.querySelector("#reviewSubtitle").textContent =
    `สมัครเมื่อ ${formatDate(activeApplication.created_at)}`;

  const courseName = getApplicationCourseText(activeApplication);
  const sourceText = activeApplication.enrollment_source === "branch"
    ? `${sourceLabels.branch}: ${getBranchName(activeApplication)}`
    : sourceLabels.online;
  const registrationText =
    registrationSourceLabels[activeApplication.registration_source] ||
    activeApplication.registration_source ||
    "เว็บ";
  const paymentText = paymentMethodLabels[activeApplication.payment_method] || "ไม่ระบุ";
  const pendingAccountNotice = !activeApplication.parent_user_id
    ? `
      <div class="full account-link-notice">
        <dt>สถานะบัญชีผู้ปกครอง</dt>
        <dd>ใบสมัครนี้ยังไม่ได้ผูกบัญชีผู้ปกครอง อนุมัติใบสมัครได้ก่อน แต่ระบบจะยังไม่เปิดสิทธิ์คอร์สจนกว่าจะผูกบัญชี</dd>
      </div>
    `
    : "";
  document.querySelector("#studentDetails").innerHTML = `
    ${pendingAccountNotice}
    <div><dt>ชื่อเล่นนักเรียน</dt><dd>${escapeHtml(activeApplication.student_nickname || "-")}</dd></div>
    <div><dt>ชื่อผู้ปกครอง</dt><dd>${escapeHtml(activeApplication.parent_name || "-")}</dd></div>
    <div><dt>อีเมลผู้ปกครอง</dt><dd>${escapeHtml(activeApplication.parent_email)}</dd></div>
    <div><dt>เบอร์โทรศัพท์</dt><dd>${escapeHtml(activeApplication.parent_phone)}</dd></div>
    <div><dt>ช่องทางสมัคร</dt><dd>${escapeHtml(sourceText)}</dd></div>
    <div><dt>แหล่งที่มา</dt><dd>${escapeHtml(registrationText)}</dd></div>
    <div><dt>ชื่อ LINE</dt><dd>${escapeHtml(activeApplication.line_display_name || "-")}</dd></div>
    <div><dt>LINE user id</dt><dd>${escapeHtml(activeApplication.line_user_id || "-")}</dd></div>
    <div><dt>ช่องทางติดต่อสะดวก</dt><dd>${escapeHtml(activeApplication.preferred_contact || "-")}</dd></div>
    <div><dt>คอร์สที่สมัคร</dt><dd>${escapeHtml(courseName)}</dd></div>
    <div><dt>วิธีชำระเงิน</dt><dd>${escapeHtml(paymentText)}</dd></div>
    <div><dt>ยอดชำระ</dt><dd>${formatMoney(activeApplication.paid_amount)} บาท</dd></div>
    <div><dt>วันที่ชำระ</dt><dd>${escapeHtml(activeApplication.paid_at || "-")}</dd></div>
    <div><dt>วันเกิด / อายุ</dt><dd>${escapeHtml(activeApplication.birth_date || "-")} · ${escapeHtml(activeApplication.age_years || "-")} ปี</dd></div>
    <div><dt>แพ้อาหาร</dt><dd>${escapeHtml(activeApplication.allergy_food || "-")}</dd></div>
    <div><dt>แพ้เกสร / ภูมิแพ้</dt><dd>${escapeHtml(activeApplication.allergy_pollen || "-")}</dd></div>
    <div><dt>ข้อมูลเพิ่มเติม</dt><dd>${escapeHtml(activeApplication.student_notes || "-")}</dd></div>
    <div><dt>หมายเหตุจากสาขา</dt><dd>${escapeHtml(activeApplication.branch_note || "-")}</dd></div>
    <div><dt>หมายเหตุชำระเงิน</dt><dd>${escapeHtml(activeApplication.payment_note || "-")}</dd></div>
    <div><dt>สถานะการชำระเงิน</dt><dd>${escapeHtml(activeApplication.payment_status)}</dd></div>
  `;
  renderAccountLinkPanel();

  const isPendingApplication = activeApplication.status === "pending";
  const pendingCourses = getApplicationCourseCodes(activeApplication);
  const pendingCourse = activeApplication.course;
  robotAccess.checked = isPendingApplication
    ? pendingCourses.includes("robot") || pendingCourse === "both"
    : activeApplication.robot_access;
  artAccess.checked = isPendingApplication
    ? pendingCourses.some((course) => ["art", "creative_art", "water_color", "clay"].includes(course)) ||
      ["art", "both"].includes(pendingCourse)
    : activeApplication.art_access;
  const packages = await loadApplicationCoursePackages(activeApplication.id);
  if (robotSessionCount) robotSessionCount.value = packages.robot || 30;
  if (artSessionCount) artSessionCount.value = packages.art || 12;
  const hasStoredArtPackage = packages.selectedArtPrograms.size > 0;
  artProgramControls.forEach((program) => {
    const selected = hasStoredArtPackage
      ? packages.selectedArtPrograms.has(program.type)
      : pendingCourses.includes(program.type) || program.type === pendingCourse;
    if (program.checkbox) program.checkbox.checked = artAccess.checked && selected;
    if (program.input) program.input.value = packages[program.type] || program.defaultSessions;
  });
  if (artAccess.checked && !artProgramControls.some((program) => program.checkbox?.checked)) {
    artProgramControls[0].checkbox.checked = true;
  }
  rejectionReason.value = activeApplication.rejection_reason || "";
  approveButton.textContent = activeApplication.status === "approved"
    ? "✓ บันทึกสิทธิ์คอร์ส"
    : "✓ อนุมัติและเปิดสิทธิ์";
  const canReview = canManageApplication(activeApplication);
  robotAccess.disabled = !canReview;
  artAccess.disabled = !canReview;
  rejectionReason.disabled = !canReview;
  approveButton.hidden = !canReview;
  rejectButton.hidden = !canReview;
  updateSessionPackageFields();

  reviewModal.classList.add("open");
  reviewModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  slipFrame.innerHTML = '<div class="slip-loading">กำลังโหลดรูปสลิป...</div>';
  openSlipLink.removeAttribute("href");

  if (!activeApplication.slip_path) {
    slipFrame.innerHTML = `
      <div class="slip-loading">
        ไม่มีไฟล์หลักฐานแนบมา<br>
        ${escapeHtml(paymentText)}
      </div>
    `;
    return;
  }

  const { data, error } = await supabaseClient.storage
    .from("payment-slips")
    .createSignedUrl(activeApplication.slip_path, 300);

  if (error) {
    slipFrame.innerHTML =
      `<div class="slip-loading">เปิดสลิปไม่สำเร็จ<br>${escapeHtml(error.message)}</div>`;
    return;
  }

  slipFrame.innerHTML =
    `<img src="${escapeHtml(data.signedUrl)}" alt="สลิปของ ${escapeHtml(activeApplication.student_name)}">`;
  openSlipLink.href = data.signedUrl;
}

function getSuggestedParentAccountQuery(application) {
  const email = String(application?.parent_email || "").trim();
  if (email && !email.endsWith("@line.local")) return email;
  return String(application?.parent_phone || application?.parent_name || "").trim();
}

function renderAccountLinkPanel() {
  if (!accountLinkPanel || !parentAccountSearch || !parentAccountResults) return;

  const needsParentAccount = Boolean(activeApplication && !activeApplication.parent_user_id);
  accountLinkPanel.hidden = !needsParentAccount;
  if (!needsParentAccount) {
    parentAccountSearch.value = "";
    parentAccountResults.innerHTML = "";
    return;
  }

  if (!parentAccountSearch.value.trim()) {
    parentAccountSearch.value = getSuggestedParentAccountQuery(activeApplication);
  }

  parentAccountResults.innerHTML = `
    <p>
      ค้นหาบัญชีผู้ปกครองที่สมัครผ่านเว็บไว้แล้ว จากอีเมล เบอร์โทร หรือชื่อผู้ปกครอง
      หากยังไม่พบ ให้ผู้ปกครองสมัคร/เข้าสู่ระบบเว็บด้วยอีเมลก่อน แล้วกลับมาผูกบัญชีอีกครั้ง
    </p>
  `;
}

function renderParentAccountResults(accounts) {
  if (!parentAccountResults) return;
  if (!accounts.length) {
    parentAccountResults.innerHTML = `
      <p>
        ยังไม่พบบัญชีผู้ปกครองที่ตรงกับคำค้นนี้
        ให้ผู้ปกครองสมัครบัญชีเว็บด้วยอีเมลก่อน แล้วค้นหาอีเมลนั้นเพื่อผูกกับใบสมัคร LINE
      </p>
    `;
    return;
  }

  parentAccountResults.innerHTML = accounts.map((account) => {
    const linkedCount = Number(account.linked_applications || 0);
    const detail = [
      account.parent_name || "ไม่พบชื่อจากใบสมัครเดิม",
      account.parent_phone || "ไม่มีเบอร์จากใบสมัครเดิม",
      `${linkedCount} ใบสมัครที่เคยผูก`
    ].join(" · ");
    return `
      <div class="account-link-result">
        <div>
          <strong>${escapeHtml(account.email || account.parent_user_id)}</strong>
          <small>${escapeHtml(detail)}</small>
        </div>
        <button type="button" data-link-parent-id="${escapeHtml(account.parent_user_id)}">ผูกบัญชีนี้</button>
      </div>
    `;
  }).join("");
}

async function searchParentAccounts() {
  if (!supabaseClient || !parentAccountSearch || !parentAccountResults) return;
  const query = parentAccountSearch.value.trim();
  if (query.length < 3) {
    parentAccountResults.innerHTML = "<p>กรุณาพิมพ์อย่างน้อย 3 ตัวอักษร เช่น อีเมล เบอร์โทร หรือชื่อผู้ปกครอง</p>";
    parentAccountSearch.focus();
    return;
  }

  parentAccountSearchButton.disabled = true;
  parentAccountSearchButton.textContent = "กำลังค้นหา...";
  parentAccountResults.innerHTML = "<p>กำลังค้นหาบัญชีผู้ปกครอง...</p>";

  const { data, error } = await supabaseClient.rpc("search_parent_accounts", {
    p_query: query
  });

  parentAccountSearchButton.disabled = false;
  parentAccountSearchButton.textContent = "ค้นหา";

  if (error) {
    parentAccountResults.innerHTML = `<p>ค้นหาไม่สำเร็จ: ${escapeHtml(error.message)}</p>`;
    return;
  }

  renderParentAccountResults(data || []);
}

async function linkParentAccount(parentUserId) {
  if (!activeApplication || !parentUserId) return;
  const confirmed = window.confirm(
    "ผูกบัญชีผู้ปกครองนี้กับใบสมัคร LINE ใช่ไหม?\nหลังผูกแล้ว ถ้าใบสมัครอนุมัติอยู่ ระบบจะเปิดสิทธิ์คอร์สให้อัตโนมัติ"
  );
  if (!confirmed) return;

  const button = parentAccountResults?.querySelector(`[data-link-parent-id="${CSS.escape(parentUserId)}"]`);
  if (button) {
    button.disabled = true;
    button.textContent = "กำลังผูก...";
  }

  const { data, error } = await supabaseClient.rpc("link_application_parent_account", {
    p_application_id: activeApplication.id,
    p_parent_user_id: parentUserId
  });

  if (error) {
    showToast(`ผูกบัญชีไม่สำเร็จ: ${error.message}`, true);
    if (button) {
      button.disabled = false;
      button.textContent = "ผูกบัญชีนี้";
    }
    return;
  }

  showToast("ผูกบัญชีผู้ปกครองสำเร็จ และเปิดสิทธิ์คอร์สตามใบสมัครแล้ว");
  await loadApplications();
  const refreshed = applications.find((application) => application.id === data.id);
  if (refreshed) {
    await openReview(refreshed.id);
  } else {
    closeReview();
  }
}

function closeReview() {
  reviewModal.classList.remove("open");
  reviewModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  activeApplication = null;
}

async function reviewApplication(decision) {
  if (!activeApplication) return;
  if (!canManageApplication(activeApplication)) {
    showToast("คุณอนุมัติได้เฉพาะใบสมัครของสาขาที่รับผิดชอบ", true);
    return;
  }
  const selectedArtPrograms = artProgramControls.filter((program) => program.checkbox?.checked);
  const artEnabled = Boolean(artAccess.checked && selectedArtPrograms.length);
  if (decision === "approved" && !robotAccess.checked && !artEnabled) {
    showToast("กรุณาเลือกอย่างน้อยหนึ่งคอร์ส", true);
    return;
  }
  if (decision === "rejected" && !rejectionReason.value.trim()) {
    showToast("กรุณาระบุเหตุผลที่ไม่อนุมัติ", true);
    rejectionReason.focus();
    return;
  }

  let robotSessions = null;
  const artSessions = {};
  if (decision === "approved") {
    try {
      robotSessions = robotAccess.checked
        ? getSessionPackageValue(robotSessionCount, "โรบอท")
        : null;
      artProgramControls.forEach((program) => {
        artSessions[program.type] = program.checkbox?.checked
          ? getSessionPackageValue(program.input, program.label)
          : null;
      });
    } catch (error) {
      showToast(error.message, true);
      return;
    }
  }

  setBusy(true);
  try {
    const canOpenCourseAccess = Boolean(activeApplication.parent_user_id);
    const { error } = await supabaseClient.rpc("review_enrollment", {
      p_application_id: activeApplication.id,
      p_decision: decision,
      p_robot_access: robotAccess.checked,
      p_art_access: artEnabled,
      p_rejection_reason: rejectionReason.value.trim() || null
    });
    if (error) throw error;

    if (decision === "approved" && canOpenCourseAccess) {
      const { error: packageError } = await supabaseClient.rpc("set_course_enrollment_packages", {
        p_application_id: activeApplication.id,
        p_robot_sessions: robotSessions,
        p_creative_art_sessions: artSessions.creative_art,
        p_water_color_sessions: artSessions.water_color,
        p_clay_sessions: artSessions.clay,
        p_note: null
      });
      if (packageError) throw packageError;
    }
  } catch (error) {
    setBusy(false);
    showToast(`บันทึกไม่สำเร็จ: ${error.message}`, true);
    return;
  }
  setBusy(false);

  const approvedWithParentAccount = Boolean(activeApplication.parent_user_id);
  closeReview();
  showToast(decision === "approved"
    ? approvedWithParentAccount
      ? "อนุมัติและเปิดสิทธิ์คอร์สเรียบร้อย"
      : "อนุมัติใบสมัครแล้ว รอผูกบัญชีผู้ปกครองก่อนเปิดสิทธิ์คอร์ส"
    : "บันทึกการไม่อนุมัติเรียบร้อย");
  await loadApplications();
}

async function submitBranchAdminSignup(event) {
  event.preventDefault();
  if (!configured) {
    configWarning.hidden = false;
    showToast(
      "ยังไม่ได้ตั้งค่า Supabase: ใส่ Project URL และ anon key ใน supabase-config.js",
      true
    );
    return;
  }

  const formData = new FormData(branchAdminSignupForm);
  const fullName = String(formData.get("full_name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const branchId = String(formData.get("branch_id") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const submitButton = branchAdminSignupForm.querySelector("button[type=submit]");

  if (!fullName || !phone || !branchId || !email || password.length < 6) {
    showToast("กรุณากรอกข้อมูลผู้ดูแลสาขาให้ครบ และรหัสผ่านอย่างน้อย 6 ตัว", true);
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "กำลังส่งคำขอ...";

  try {
    let { data, error } = await supabaseClient.auth.signUp({
      email,
      password
    });

    if (error && /already registered|already exists|user already/i.test(error.message)) {
      ({ data, error } = await supabaseClient.auth.signInWithPassword({ email, password }));
    }

    if (error) throw error;

    if (!data.user) {
      throw new Error("สร้างบัญชีไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
    }

    const { error: applicationError } = await supabaseClient.rpc(
      "submit_branch_admin_application",
      {
        p_full_name: fullName,
        p_phone: phone,
        p_branch_id: branchId
      }
    );

    if (applicationError) throw applicationError;

    await supabaseClient.auth.signOut();
    branchAdminSignupForm.reset();
    setAdminAuthMode("login");
    showToast("ส่งคำขอผู้ดูแลสาขาเรียบร้อย รอแอดมินหลักอนุมัติ");
  } catch (error) {
    showToast(`ส่งคำขอไม่สำเร็จ: ${error.message}`, true);
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = 'ส่งคำขอผู้ดูแลสาขา <span>→</span>';
  }
}

async function loadBranchAdminApplications() {
  if (!isMainAdmin() || !branchAdminRows) return;
  branchAdminRows.innerHTML =
    '<div class="loading-state"><i></i><span>กำลังโหลดคำขอผู้ดูแลสาขา...</span></div>';

  const { data, error } = await supabaseClient
    .from("branch_admin_applications")
    .select("*, branches(name, code)")
    .order("created_at", { ascending: false });

  if (error) {
    branchAdminApplications = [];
    updateBranchAdminBadge();
    branchAdminRows.innerHTML = `
      <div class="empty-state">
        <div>🧑‍🏫</div>
        <h3>ยังโหลดคำขอไม่ได้</h3>
        <p>กรุณารันไฟล์ SQL ระบบผู้ดูแลสาขาก่อน: ${escapeHtml(error.message)}</p>
      </div>
    `;
    return;
  }

  branchAdminApplications = data || [];
  updateBranchAdminBadge();
  renderBranchAdminApplications();
}

function updateBranchAdminBadge() {
  if (!branchAdminPendingBadge) return;
  const pending = branchAdminApplications
    .filter((application) => application.status === "pending").length;
  branchAdminPendingBadge.textContent = pending;
}

function renderBranchAdminApplications() {
  if (!branchAdminRows) return;
  if (!branchAdminApplications.length) {
    branchAdminRows.innerHTML = `
      <div class="empty-state">
        <div>🧑‍🏫</div>
        <h3>ยังไม่มีคำขอผู้ดูแลสาขา</h3>
        <p>เมื่อเฟรนไชน์ซีสมัครเข้ามา รายการจะมาอยู่ตรงนี้</p>
      </div>
    `;
    return;
  }

  branchAdminRows.innerHTML = branchAdminApplications.map((application) => {
    const branchText = application.branches?.name
      ? `${application.branches.name}${application.branches.code ? ` (${application.branches.code})` : ""}`
      : "ไม่พบสาขา";
    const isPending = application.status === "pending";
    return `
      <article class="branch-admin-request-card ${application.status}">
        <div>
          <span class="status-pill ${application.status}">${statusLabels[application.status] || application.status}</span>
          <h3>${escapeHtml(application.full_name)}</h3>
          <p>${escapeHtml(application.email)} · ${escapeHtml(application.phone)}</p>
          <div class="request-meta">
            <span>🏫 ${escapeHtml(branchText)}</span>
            <span>สมัครเมื่อ ${formatDate(application.created_at)}</span>
          </div>
          ${application.rejection_reason ? `<small>เหตุผลไม่อนุมัติ: ${escapeHtml(application.rejection_reason)}</small>` : ""}
        </div>
        <div class="branch-admin-request-actions">
          ${isPending ? `
            <button class="reject-button" type="button"
              data-branch-admin-review="${application.id}" data-decision="rejected">
              ไม่อนุมัติ
            </button>
            <button class="approve-button" type="button"
              data-branch-admin-review="${application.id}" data-decision="approved">
              อนุมัติสาขานี้
            </button>
          ` : `<strong>${application.status === "approved" ? "เปิดสิทธิ์แล้ว" : "ปิดคำขอแล้ว"}</strong>`}
        </div>
      </article>
    `;
  }).join("");
}

async function reviewBranchAdminApplication(applicationId, decision) {
  if (!isMainAdmin()) return;
  let rejectionReasonText = null;
  if (decision === "rejected") {
    rejectionReasonText = window.prompt("ระบุเหตุผลที่ไม่อนุมัติผู้ดูแลสาขา") || "";
    if (!rejectionReasonText.trim()) return;
  }

  const { error } = await supabaseClient.rpc("review_branch_admin_application", {
    p_application_id: applicationId,
    p_decision: decision,
    p_rejection_reason: rejectionReasonText?.trim() || null
  });

  if (error) {
    showToast(`บันทึกคำขอผู้ดูแลสาขาไม่สำเร็จ: ${error.message}`, true);
    return;
  }

  showToast(decision === "approved"
    ? "อนุมัติผู้ดูแลสาขาเรียบร้อย"
    : "บันทึกการไม่อนุมัติผู้ดูแลสาขาแล้ว");
  await loadBranchAdminApplications();
}

async function ensureBranchStaffOptions() {
  if (!teacherInviteBranch || isBranchTeacher()) return;
  if (isBranchAdmin() && currentBranchAssignment?.branch_id) {
    const branchName = getCurrentBranchName();
    teacherInviteBranch.innerHTML = `
      <option value="${currentBranchAssignment.branch_id}">${escapeHtml(branchName)}</option>
    `;
    teacherInviteBranch.value = currentBranchAssignment.branch_id;
    teacherInviteBranch.disabled = true;
    return;
  }

  if (!branches.length) {
    const { data, error } = await supabaseClient
      .from("branches")
      .select("id, name, code, is_active")
      .eq("is_active", true)
      .order("name", { ascending: true });
    if (error) {
      teacherInviteBranch.innerHTML = '<option value="">โหลดสาขาไม่สำเร็จ</option>';
      showToast(`โหลดสาขาไม่สำเร็จ: ${error.message}`, true);
      return;
    }
    branches = data || [];
  }

  const currentValue = teacherInviteBranch.value;
  teacherInviteBranch.disabled = false;
  teacherInviteBranch.innerHTML = [
    '<option value="">เลือกสาขาสำหรับครู</option>',
    ...branches
      .filter((branch) => branch.is_active !== false)
      .map((branch) => `
        <option value="${branch.id}">
          ${escapeHtml(branch.name)}${branch.code ? ` (${escapeHtml(branch.code)})` : ""}
        </option>
      `)
  ].join("");
  if ([...teacherInviteBranch.options].some((option) => option.value === currentValue)) {
    teacherInviteBranch.value = currentValue;
  }
}

function getTeacherInviteLink(invitation) {
  const basePath = window.location.pathname.replace(/admin\.html$/, "teacher-signup.html");
  return `${window.location.origin}${basePath}?invite=${encodeURIComponent(invitation.invite_code)}`;
}

function updateBranchTeacherBadge() {
  if (!branchTeacherPendingBadge) return;
  const pending = branchTeacherInvitations
    .filter((invitation) => invitation.status === "pending").length;
  branchTeacherPendingBadge.textContent = pending;
}

async function loadBranchTeacherInvitations() {
  if (!canManageBranchStaff() || !teacherInviteRows) return;
  await ensureBranchStaffOptions();
  teacherInviteRows.innerHTML =
    '<div class="loading-state"><i></i><span>กำลังโหลดทีมสาขา...</span></div>';

  let query = supabaseClient
    .from("branch_teacher_invitations")
    .select("*, branches(name, code)")
    .order("created_at", { ascending: false });

  if (isBranchAdmin() && currentBranchAssignment?.branch_id) {
    query = query.eq("branch_id", currentBranchAssignment.branch_id);
  }

  const { data, error } = await query;

  if (error) {
    branchTeacherInvitations = [];
    updateBranchTeacherBadge();
    teacherInviteRows.innerHTML = `
      <div class="empty-state">
        <div>👩‍🏫</div>
        <h3>ยังโหลดทีมครูไม่ได้</h3>
        <p>กรุณารันไฟล์ SQL ระบบทีมสาขาก่อน: ${escapeHtml(error.message)}</p>
      </div>
    `;
    return;
  }

  branchTeacherInvitations = data || [];
  updateBranchTeacherBadge();
  renderBranchTeacherInvitations();
}

function renderBranchTeacherInvitations() {
  if (!teacherInviteRows) return;
  if (!branchTeacherInvitations.length) {
    teacherInviteRows.innerHTML = `
      <div class="empty-state">
        <div>👩‍🏫</div>
        <h3>ยังไม่มีครูในระบบ</h3>
        <p>สร้างลิงก์เชิญครู แล้วส่งให้ครูสมัครบัญชีของตัวเอง</p>
      </div>
    `;
    return;
  }

  const statusText = {
    invited: "ส่งคำเชิญแล้ว",
    pending: "รออนุมัติ",
    active: "เปิดสิทธิ์แล้ว",
    rejected: "ไม่อนุมัติ",
    cancelled: "ยกเลิก",
    expired: "หมดอายุ",
    suspended: "พักสิทธิ์"
  };

  teacherInviteRows.innerHTML = branchTeacherInvitations.map((invitation) => {
    const branchText = invitation.branches?.name
      ? `${invitation.branches.name}${invitation.branches.code ? ` (${invitation.branches.code})` : ""}`
      : "ไม่พบสาขา";
    const isPending = invitation.status === "pending";
    const isInvited = invitation.status === "invited";
    const link = getTeacherInviteLink(invitation);
    const cardStatus = invitation.status === "active"
      ? "approved"
      : invitation.status === "rejected" || invitation.status === "cancelled" || invitation.status === "suspended"
        ? "rejected"
        : "pending";
    return `
      <article class="branch-admin-request-card ${cardStatus}">
        <div>
          <span class="status-pill ${cardStatus}">${statusText[invitation.status] || invitation.status}</span>
          <h3>${escapeHtml(invitation.teacher_name)}</h3>
          <p>
            ${escapeHtml(invitation.teacher_email || "ยังไม่ระบุอีเมล")}
            ${invitation.teacher_phone ? ` · ${escapeHtml(invitation.teacher_phone)}` : ""}
          </p>
          <div class="request-meta">
            <span>🏫 ${escapeHtml(branchText)}</span>
            <span>สร้างเมื่อ ${formatDate(invitation.created_at)}</span>
            ${invitation.accepted_at ? `<span>ตอบรับ ${formatDate(invitation.accepted_at)}</span>` : ""}
          </div>
          ${isInvited ? `
            <div class="teacher-invite-link">
              <code>${escapeHtml(link)}</code>
              <button type="button" data-copy-teacher-invite="${invitation.id}">คัดลอก</button>
            </div>
          ` : ""}
          ${invitation.rejection_reason ? `<small>เหตุผล: ${escapeHtml(invitation.rejection_reason)}</small>` : ""}
        </div>
        <div class="branch-admin-request-actions">
          ${isPending ? `
            <button class="reject-button" type="button"
              data-teacher-review="${invitation.id}" data-decision="rejected">
              ไม่อนุมัติ
            </button>
            <button class="approve-button" type="button"
              data-teacher-review="${invitation.id}" data-decision="approved">
              อนุมัติเป็นครู
            </button>
          ` : isInvited ? `
            <button class="reject-button" type="button"
              data-teacher-review="${invitation.id}" data-decision="cancelled">
              ยกเลิกคำเชิญ
            </button>
          ` : `<strong>${statusText[invitation.status] || invitation.status}</strong>`}
        </div>
      </article>
    `;
  }).join("");
}

async function createTeacherInvitation(event) {
  event.preventDefault();
  if (!canManageBranchStaff()) return;
  const branchId = teacherInviteBranch?.value || "";
  const teacherName = document.querySelector("#teacherInviteName")?.value.trim() || "";
  const teacherEmail = document.querySelector("#teacherInviteEmail")?.value.trim() || "";
  const teacherPhone = document.querySelector("#teacherInvitePhone")?.value.trim() || "";
  const submitButton = teacherInviteForm.querySelector("button[type=submit]");

  if (!branchId || !teacherName) {
    showToast("กรุณาเลือกสาขาและกรอกชื่อครู", true);
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "กำลังสร้างลิงก์...";

  const { data, error } = await supabaseClient.rpc("create_branch_teacher_invitation", {
    p_branch_id: branchId,
    p_teacher_name: teacherName,
    p_teacher_email: teacherEmail || null,
    p_teacher_phone: teacherPhone || null
  });

  submitButton.disabled = false;
  submitButton.textContent = "สร้างลิงก์เชิญครู";

  if (error) {
    showToast(`สร้างลิงก์เชิญครูไม่สำเร็จ: ${error.message}`, true);
    return;
  }

  teacherInviteForm.reset();
  await ensureBranchStaffOptions();
  if (isBranchAdmin() && currentBranchAssignment?.branch_id) {
    teacherInviteBranch.value = currentBranchAssignment.branch_id;
  }
  const link = getTeacherInviteLink(data);
  showToast("สร้างลิงก์เชิญครูเรียบร้อย");
  await loadBranchTeacherInvitations();
  copyTextToClipboard(link, "คัดลอกลิงก์เชิญครูแล้ว");
}

async function reviewBranchTeacherInvitation(invitationId, decision) {
  if (!canManageBranchStaff()) return;
  let rejectionReasonText = null;
  if (decision === "rejected") {
    rejectionReasonText = window.prompt("ระบุเหตุผลที่ไม่อนุมัติครู") || "";
    if (!rejectionReasonText.trim()) return;
  }

  const { error } = await supabaseClient.rpc("review_branch_teacher_application", {
    p_invitation_id: invitationId,
    p_decision: decision,
    p_rejection_reason: rejectionReasonText?.trim() || null
  });

  if (error) {
    showToast(`บันทึกสถานะครูไม่สำเร็จ: ${error.message}`, true);
    return;
  }

  showToast(decision === "approved"
    ? "อนุมัติครูเรียบร้อย"
    : "บันทึกสถานะครูแล้ว");
  await loadBranchTeacherInvitations();
}

function copyTextToClipboard(text, successMessage = "คัดลอกแล้ว") {
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text)
      .then(() => showToast(successMessage))
      .catch(() => window.prompt("คัดลอกลิงก์นี้", text));
    return;
  }
  window.prompt("คัดลอกลิงก์นี้", text);
}

function renderRobotLessons() {
  const published = robotLessons.filter((lesson) => lesson.is_published).length;
  document.querySelector("#publishedLessonCount").textContent = published;
  lessonAdminList.innerHTML = robotLessons.map((lesson) => {
    const hasVideo = Boolean(lesson.video_path || lesson.video_url);
    const isReady = hasVideo && lesson.instruction_pdf_path;
    return `
      <button class="lesson-admin-item ${activeLesson?.id === lesson.id ? "active" : ""}"
        type="button" data-lesson-id="${lesson.id}">
        <span>${String(lesson.lesson_number).padStart(2, "0")}</span>
        <div>
          <strong>${escapeHtml(lesson.title)}</strong>
          <small>${lesson.is_published ? "เผยแพร่แล้ว" : isReady ? "พร้อมเผยแพร่" : "ยังไม่ครบ"}</small>
        </div>
        <i class="${lesson.is_published ? "ready" : ""}"></i>
      </button>
    `;
  }).join("");
}

function selectRobotLesson(lessonId) {
  activeLesson = robotLessons.find((lesson) => lesson.id === lessonId);
  if (!activeLesson) return;
  const number = String(activeLesson.lesson_number).padStart(2, "0");
  document.querySelector("#editorLessonNumber").textContent = number;
  document.querySelector("#editorLessonHeading").textContent =
    `บทเรียนที่ ${activeLesson.lesson_number}`;
  document.querySelector("#lessonTitle").value = activeLesson.title || "";
  document.querySelector("#lessonDescription").value =
    activeLesson.description || "";
  document.querySelector("#lessonVideoUrl").value =
    activeLesson.video_url || "";
  document.querySelector("#lessonPublished").checked =
    activeLesson.is_published;
  document.querySelector("#lessonVideoFile").value = "";
  document.querySelector("#lessonPdfFile").value = "";

  const currentVideo = document.querySelector("#currentVideo");
  const currentPdf = document.querySelector("#currentPdf");
  const videoLabel = activeLesson.video_path || activeLesson.video_url;
  currentVideo.textContent = videoLabel
    ? `มีวิดีโอแล้ว: ${videoLabel}`
    : "ยังไม่มีวิดีโอ";
  currentVideo.classList.toggle("ready", Boolean(videoLabel));
  currentPdf.textContent = activeLesson.instruction_pdf_path
    ? `มี PDF แล้ว: ${activeLesson.instruction_pdf_path}`
    : "ยังไม่มีไฟล์ PDF";
  currentPdf.classList.toggle(
    "ready",
    Boolean(activeLesson.instruction_pdf_path)
  );
  updateLessonReadiness();
  renderRobotLessons();
}

function updateLessonReadiness() {
  if (!activeLesson) return;
  const hasVideo = Boolean(activeLesson.video_path || activeLesson.video_url);
  const hasPdf = Boolean(activeLesson.instruction_pdf_path);
  const readiness = document.querySelector("#lessonReadinessText");
  const saveButton = lessonEditor.querySelector(".save-lesson-button");
  readiness.className = "";

  if (activeLesson.is_published) {
    readiness.textContent = "✓ บทเรียนนี้เผยแพร่ในหน้าเด็กแล้ว";
    readiness.classList.add("ready");
    saveButton.textContent = "บันทึกการแก้ไข";
  } else if (hasVideo && hasPdf) {
    readiness.textContent = "สื่อครบแล้ว กดบันทึกเพื่อเผยแพร่บทเรียน";
    readiness.classList.add("warning");
    saveButton.textContent = "เผยแพร่บทเรียน";
  } else if (!hasVideo && !hasPdf) {
    readiness.textContent = "ยังขาดวิดีโอและ PDF";
    readiness.classList.add("warning");
    saveButton.textContent = "บันทึกข้อมูลบทเรียน";
  } else {
    readiness.textContent = hasVideo
      ? "ยังขาดไฟล์ PDF แบบต่อ LEGO"
      : "ยังขาดวิดีโอคุณครู";
    readiness.classList.add("warning");
    saveButton.textContent = "บันทึกข้อมูลบทเรียน";
  }
}

async function loadRobotLessons() {
  lessonAdminList.innerHTML =
    '<div class="loading-state"><i></i><span>กำลังโหลด 31 บทเรียน...</span></div>';
  const { data, error } = await supabaseClient
    .from("robot_lessons")
    .select("*")
    .order("lesson_number");

  if (error) {
    lessonAdminList.innerHTML = "";
    showToast(`โหลดบทเรียนไม่สำเร็จ: ${error.message}`, true);
    return;
  }

  robotLessons = data || [];
  if (!activeLesson || !robotLessons.some(({ id }) => id === activeLesson.id)) {
    activeLesson = robotLessons[0] || null;
  } else {
    activeLesson = robotLessons.find(({ id }) => id === activeLesson.id);
  }
  renderRobotLessons();
  if (activeLesson) selectRobotLesson(activeLesson.id);
}

function safeFileName(fileName) {
  const extensionMatch = String(fileName || "").match(/(\.[a-z0-9]{1,8})$/i);
  const extension = extensionMatch ? extensionMatch[1].toLowerCase() : "";
  const baseName = String(fileName || "file")
    .replace(extensionMatch?.[1] || "", "")
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
  return `${baseName || "file"}${extension}`;
}

function safeStorageSegment(value, fallback = "resource") {
  const cleaned = String(value || "")
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
  return cleaned || `${fallback}-${Date.now()}`;
}

function formatFileSize(bytes) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function uploadLessonFile(bucket, file, lessonNumber) {
  const folder = `lesson-${String(lessonNumber).padStart(2, "0")}`;
  const path = `${folder}/${crypto.randomUUID()}-${safeFileName(file.name)}`;
  const { error } = await supabaseClient.storage
    .from(bucket)
    .upload(path, file, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false
    });
  if (error) throw error;
  return path;
}

async function uploadSelectedLessonFile({
  input,
  bucket,
  column,
  currentFile,
  maxBytes,
  expectedType,
  label
}) {
  const file = input.files[0];
  if (!file || !activeLesson) return;
  const selectedLesson = activeLesson;

  if (file.size > maxBytes) {
    input.value = "";
    showToast(`${label} มีขนาดเกินกำหนด`, true);
    return;
  }
  if (expectedType && !expectedType(file)) {
    input.value = "";
    showToast(`ชนิดไฟล์ ${label} ไม่ถูกต้อง`, true);
    return;
  }

  const dropZone = input.closest(".file-drop");
  currentFile.className = "current-file selected uploading";
  currentFile.textContent =
    `เลือกแล้ว: ${file.name} (${formatFileSize(file.size)}) · กำลังอัปโหลด`;
  dropZone.classList.add("uploading");
  showToast(`กำลังอัปโหลด ${file.name}`);

  try {
    const path = await uploadLessonFile(
      bucket,
      file,
      selectedLesson.lesson_number
    );
    const nextVideoPath =
      column === "video_path" ? path : selectedLesson.video_path;
    const nextPdfPath =
      column === "instruction_pdf_path"
        ? path
        : selectedLesson.instruction_pdf_path;
    const shouldPublish = Boolean(
      (nextVideoPath || selectedLesson.video_url) && nextPdfPath
    );
    const updatePayload = {
      [column]: path,
      ...(shouldPublish ? { is_published: true } : {})
    };

    const { error } = await supabaseClient
      .from("robot_lessons")
      .update(updatePayload)
      .eq("id", selectedLesson.id);
    if (error) throw error;

    const lessonIndex = robotLessons.findIndex(
      ({ id }) => id === selectedLesson.id
    );
    if (lessonIndex >= 0) {
      robotLessons[lessonIndex][column] = path;
      if (shouldPublish) robotLessons[lessonIndex].is_published = true;
    }
    if (activeLesson?.id === selectedLesson.id) {
      activeLesson[column] = path;
      if (shouldPublish) {
        activeLesson.is_published = true;
        document.querySelector("#lessonPublished").checked = true;
      }
      currentFile.className = "current-file ready";
      currentFile.textContent =
        `อัปโหลดสำเร็จ: ${file.name} (${formatFileSize(file.size)})`;
      updateLessonReadiness();
    }
    input.value = "";
    renderRobotLessons();
    showToast(shouldPublish
      ? `อัปโหลด ${label} สำเร็จ และเผยแพร่บทเรียนแล้ว`
      : `อัปโหลด ${label} สำเร็จ`);
  } catch (error) {
    currentFile.className = "current-file selected";
    currentFile.textContent = `อัปโหลดไม่สำเร็จ: ${file.name}`;
    showToast(`อัปโหลด ${label} ไม่สำเร็จ: ${error.message}`, true);
  } finally {
    dropZone.classList.remove("uploading");
  }
}

document.querySelector("#lessonVideoFile").addEventListener("change", (event) => {
  uploadSelectedLessonFile({
    input: event.currentTarget,
    bucket: "robot-videos",
    column: "video_path",
    currentFile: document.querySelector("#currentVideo"),
    maxBytes: 500 * 1024 * 1024,
    expectedType: (file) => [
      "video/mp4",
      "video/webm",
      "video/quicktime"
    ].includes(file.type),
    label: "วิดีโอ"
  });
});

document.querySelector("#lessonPdfFile").addEventListener("change", (event) => {
  uploadSelectedLessonFile({
    input: event.currentTarget,
    bucket: "robot-instructions",
    column: "instruction_pdf_path",
    currentFile: document.querySelector("#currentPdf"),
    maxBytes: 50 * 1024 * 1024,
    expectedType: (file) =>
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf"),
    label: "PDF"
  });
});

lessonEditor.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!activeLesson) return;

  const title = document.querySelector("#lessonTitle").value.trim();
  const description =
    document.querySelector("#lessonDescription").value.trim();
  const videoUrl = document.querySelector("#lessonVideoUrl").value.trim();
  let publish = document.querySelector("#lessonPublished").checked;
  let videoPath = activeLesson.video_path;
  let pdfPath = activeLesson.instruction_pdf_path;
  if ((videoPath || videoUrl) && pdfPath) {
    publish = true;
    document.querySelector("#lessonPublished").checked = true;
  }

  if (publish && !(videoPath || videoUrl) && !pdfPath) {
    showToast("ต้องมีวิดีโอและ PDF ก่อนเผยแพร่", true);
    return;
  }
  if (publish && !(videoPath || videoUrl)) {
    showToast("กรุณาเพิ่มวิดีโอก่อนเผยแพร่", true);
    return;
  }
  if (publish && !pdfPath) {
    showToast("กรุณาเพิ่มไฟล์ PDF ก่อนเผยแพร่", true);
    return;
  }

  const saveButton = lessonEditor.querySelector(".save-lesson-button");
  saveButton.disabled = true;
  lessonUploadProgress.hidden = false;

  try {
    const { error } = await supabaseClient
      .from("robot_lessons")
      .update({
        title,
        description,
        video_path: videoPath || null,
        video_url: videoUrl || null,
        instruction_pdf_path: pdfPath || null,
        is_published: publish
      })
      .eq("id", activeLesson.id);
    if (error) throw error;

    showToast(`บันทึกบทเรียนที่ ${activeLesson.lesson_number} แล้ว`);
    await loadRobotLessons();
  } catch (error) {
    showToast(`บันทึกบทเรียนไม่สำเร็จ: ${error.message}`, true);
  } finally {
    saveButton.disabled = false;
    lessonUploadProgress.hidden = true;
  }
});

function categoryById(categoryId) {
  return artCategories.find(({ id }) => id === categoryId);
}

function levelById(levelId) {
  return artLevels.find(({ id }) => id === levelId);
}

function selectedArtCategoryId() {
  return artCategoryFilter.value === "all"
    ? (artCategories[0]?.id || "")
    : artCategoryFilter.value;
}

function selectedArtLevelIdForCategory(categoryId) {
  if (artLevelFilter.value !== "all") {
    const selectedLevel = artLevels.find(({ id }) => id === artLevelFilter.value);
    if (selectedLevel?.category_id === categoryId) return selectedLevel.id;
  }
  return null;
}

function renderArtOptions() {
  const categoryOptions = [
    '<option value="all">ทุกหมวด</option>',
    ...artCategories.map((category) =>
      `<option value="${category.id}">${escapeHtml(category.title)}</option>`)
  ].join("");
  const currentFilter = artCategoryFilter.value || "all";
  artCategoryFilter.innerHTML = categoryOptions;
  artCategoryFilter.value = artCategories.some(({ id }) => id === currentFilter)
    ? currentFilter
    : "all";

  const filteredLevels = artLevels.filter((level) =>
    artCategoryFilter.value === "all" ||
    level.category_id === artCategoryFilter.value);
  const currentLevel = artLevelFilter.value || "all";
  artLevelFilter.innerHTML = [
    '<option value="all">ทุก Level / ไม่มี Level</option>',
    ...filteredLevels.map((level) =>
      `<option value="${level.id}">${escapeHtml(level.title)}</option>`)
  ].join("");
  artLevelFilter.value = filteredLevels.some(({ id }) => id === currentLevel)
    ? currentLevel
    : "all";

  artCategorySelect.innerHTML = artCategories.map((category) =>
    `<option value="${category.id}">${escapeHtml(category.title)}</option>`
  ).join("");
  renderArtLevelSelect();
}

function renderArtLevelSelect() {
  const categoryId = artCategorySelect.value || activeArtLesson?.category_id;
  const levels = artLevels.filter((level) => level.category_id === categoryId);
  const selectedLevel = artLevelSelect.value || activeArtLesson?.level_id || "";
  artLevelSelect.innerHTML = [
    '<option value="">ไม่ผูกกับ Level</option>',
    ...levels.map((level) =>
      `<option value="${level.id}">${escapeHtml(level.title)}</option>`)
  ].join("");
  artLevelSelect.value = levels.some(({ id }) => id === selectedLevel)
    ? selectedLevel
    : "";
}

function renderArtLessons() {
  const filtered = artLessons.filter((lesson) => {
    const matchesCategory =
      artCategoryFilter.value === "all" ||
      lesson.category_id === artCategoryFilter.value;
    const matchesLevel =
      artLevelFilter.value === "all" ||
      lesson.level_id === artLevelFilter.value;
    return matchesCategory && matchesLevel;
  });

  document.querySelector("#artLessonCount").textContent = filtered.length;
  if (!filtered.length) {
    artAdminList.innerHTML =
      '<div class="loading-state art-empty"><span>ยังไม่มีบทเรียนในหมวดนี้</span></div>';
    return;
  }

  artAdminList.innerHTML = filtered.map((lesson, index) => {
    const category = categoryById(lesson.category_id);
    const level = levelById(lesson.level_id);
    const hasVideo = Boolean(lesson.video_path || lesson.video_url);
    const imageCount = lesson.art_lesson_images?.length || 0;
    return `
      <button class="lesson-admin-item art-item ${activeArtLesson?.id === lesson.id ? "active" : ""}"
        type="button" data-art-lesson-id="${lesson.id}">
        <span>${String(index + 1).padStart(2, "0")}</span>
        <div>
          <strong>${escapeHtml(lesson.title || "บทเรียนศิลปะ")}</strong>
          <small>${escapeHtml(level?.title || category?.title || "ไม่มีหมวด")} · ${hasVideo ? "มีวิดีโอ" : "ยังไม่มีวิดีโอ"} · ${imageCount} รูป</small>
        </div>
        <i class="${lesson.is_published ? "ready" : ""}"></i>
      </button>
    `;
  }).join("");
}

async function renderArtImageList() {
  const images = activeArtLesson?.art_lesson_images || [];
  const currentImages = document.querySelector("#currentArtImages");
  currentImages.textContent = images.length
    ? `มีภาพตัวอย่างแล้ว ${images.length} รูป`
    : "ยังไม่มีภาพตัวอย่าง";
  currentImages.classList.toggle("ready", images.length > 0);

  if (!images.length) {
    artImageList.innerHTML =
      '<div class="gallery-empty">ยังไม่มีภาพตัวอย่างในบทเรียนนี้</div>';
    return;
  }

  const cards = await Promise.all(images.map(async (image) => {
    const { data } = await supabaseClient.storage
      .from("art-gallery")
      .createSignedUrl(image.image_path, 300);
    return `
      <article class="admin-gallery-item">
        ${data?.signedUrl
          ? `<img src="${escapeHtml(data.signedUrl)}" alt="${escapeHtml(image.caption || "ภาพตัวอย่างศิลปะ")}">`
          : `<div class="image-missing">เปิดรูปไม่ได้</div>`}
        <div>
          <strong>${escapeHtml(image.caption || "ภาพตัวอย่าง")}</strong>
          <small>${escapeHtml(image.image_path)}</small>
        </div>
        <button type="button" data-delete-art-image="${image.id}">ลบรูป</button>
      </article>
    `;
  }));
  artImageList.innerHTML = cards.join("");
}

function clearArtEditor() {
  document.querySelector("#artEditorNumber").textContent = "🎨";
  document.querySelector("#artEditorHeading").textContent = "บทเรียนศิลปะใหม่";
  document.querySelector("#artLessonTitle").value = "";
  document.querySelector("#artLessonPrompt").value = "";
  document.querySelector("#artVideoUrl").value = "";
  document.querySelector("#artLessonPublished").checked = false;
  document.querySelector("#artVideoFile").value = "";
  document.querySelector("#artImageFiles").value = "";
  document.querySelector("#artImageCaption").value = "";
  document.querySelector("#currentArtVideo").textContent = "ยังไม่มีวิดีโอ";
  document.querySelector("#currentArtVideo").className = "current-file";
  document.querySelector("#currentArtImages").textContent = "ยังไม่มีภาพตัวอย่าง";
  document.querySelector("#currentArtImages").className = "current-file";
  document.querySelector("#artReadinessText").textContent =
    "เลือกหรือเพิ่มบทเรียนศิลปะเพื่อเริ่มแก้ไข";
  document.querySelector("#artReadinessText").className = "";
  artImageList.innerHTML =
    '<div class="gallery-empty">ยังไม่มีภาพตัวอย่างในบทเรียนนี้</div>';
  deleteArtLessonButton.disabled = true;
}

function updateArtReadiness() {
  if (!activeArtLesson) return;
  const readiness = document.querySelector("#artReadinessText");
  const saveButton = artEditor.querySelector(".save-lesson-button");
  const hasVideo = Boolean(activeArtLesson.video_path || activeArtLesson.video_url);
  const imageCount = activeArtLesson.art_lesson_images?.length || 0;

  readiness.className = "";
  if (activeArtLesson.is_published) {
    readiness.textContent =
      `✓ เผยแพร่แล้ว มีวิดีโอ${hasVideo ? "" : " (ควรเพิ่ม)"} และภาพ ${imageCount} รูป`;
    readiness.classList.add("ready");
    saveButton.textContent = "บันทึกการแก้ไข";
  } else if (hasVideo) {
    readiness.textContent =
      imageCount
        ? "พร้อมเผยแพร่ กดบันทึกแล้วเด็กจะเห็นบทเรียนนี้"
        : "มีวิดีโอแล้ว กดบันทึกเพื่อเผยแพร่ได้ และแนะนำเพิ่มภาพตัวอย่าง";
    readiness.classList.add(imageCount ? "ready" : "warning");
    saveButton.textContent = "บันทึกและเผยแพร่";
  } else {
    readiness.textContent = "ยังขาดวิดีโอหรือวิดีโอลิงก์สำหรับหน้าเด็ก";
    readiness.classList.add("warning");
    saveButton.textContent = "บันทึกข้อมูลบทเรียน";
  }
}

function selectArtLesson(lessonId) {
  activeArtLesson = artLessons.find((lesson) => lesson.id === lessonId);
  if (!activeArtLesson) return;
  document.querySelector("#artEditorNumber").textContent = "🎨";
  document.querySelector("#artEditorHeading").textContent =
    activeArtLesson.title || "บทเรียนศิลปะ";
  artCategorySelect.value = activeArtLesson.category_id || artCategories[0]?.id || "";
  renderArtLevelSelect();
  artLevelSelect.value = activeArtLesson.level_id || "";
  document.querySelector("#artLessonTitle").value = activeArtLesson.title || "";
  document.querySelector("#artLessonPrompt").value =
    activeArtLesson.story_prompt || "";
  document.querySelector("#artVideoUrl").value = activeArtLesson.video_url || "";
  document.querySelector("#artLessonPublished").checked =
    activeArtLesson.is_published;
  document.querySelector("#artVideoFile").value = "";
  document.querySelector("#artImageFiles").value = "";
  document.querySelector("#artImageCaption").value = "";
  deleteArtLessonButton.disabled = false;

  const currentVideo = document.querySelector("#currentArtVideo");
  const videoLabel = activeArtLesson.video_path || activeArtLesson.video_url;
  currentVideo.textContent = videoLabel
    ? `มีวิดีโอแล้ว: ${videoLabel}`
    : "ยังไม่มีวิดีโอ";
  currentVideo.classList.toggle("ready", Boolean(videoLabel));
  updateArtReadiness();
  renderArtLessons();
  renderArtImageList();
}

async function loadArtStudio() {
  artAdminList.innerHTML =
    '<div class="loading-state"><i></i><span>กำลังโหลดบทเรียนศิลปะ...</span></div>';
  const [categoryResult, levelResult, lessonResult] = await Promise.all([
    supabaseClient.from("art_categories").select("*").order("sort_order"),
    supabaseClient.from("art_levels").select("*").order("sort_order"),
    supabaseClient
      .from("art_lessons")
      .select("*, art_lesson_images(*)")
      .order("sort_order")
  ]);

  const firstError =
    categoryResult.error || levelResult.error || lessonResult.error;
  if (firstError) {
    artAdminList.innerHTML = "";
    showToast(`โหลดบทเรียนศิลปะไม่สำเร็จ: ${firstError.message}`, true);
    return;
  }

  artCategories = categoryResult.data || [];
  artLevels = levelResult.data || [];
  artLessons = (lessonResult.data || []).map((lesson) => ({
    ...lesson,
    art_lesson_images: [...(lesson.art_lesson_images || [])]
      .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
  }));

  renderArtOptions();
  if (!activeArtLesson || !artLessons.some(({ id }) => id === activeArtLesson.id)) {
    activeArtLesson = artLessons[0] || null;
  } else {
    activeArtLesson = artLessons.find(({ id }) => id === activeArtLesson.id);
  }
  renderArtLessons();
  if (activeArtLesson) {
    selectArtLesson(activeArtLesson.id);
  } else {
    clearArtEditor();
  }
}

async function ensureActiveArtLesson() {
  if (activeArtLesson?.id) return activeArtLesson;
  if (!artCategories.length) {
    throw new Error("ยังไม่มีหมวดศิลปะ กรุณารัน SQL สำหรับสร้างหมวดก่อน");
  }

  const title =
    document.querySelector("#artLessonTitle").value.trim() ||
    "บทเรียนศิลปะใหม่";
  const categoryId = artCategorySelect.value || selectedArtCategoryId();
  const levelId = artLevelSelect.value || selectedArtLevelIdForCategory(categoryId);
  const sortOrder =
    Math.max(0, ...artLessons.map((lesson) => lesson.sort_order || 0)) + 1;

  const { data, error } = await supabaseClient
    .from("art_lessons")
    .insert({
      category_id: categoryId,
      level_id: levelId || null,
      title,
      story_prompt: document.querySelector("#artLessonPrompt").value.trim(),
      video_url: document.querySelector("#artVideoUrl").value.trim() || null,
      sort_order: sortOrder,
      is_published: false
    })
    .select("*, art_lesson_images(*)")
    .single();

  if (error) throw error;
  activeArtLesson = {
    ...data,
    art_lesson_images: data.art_lesson_images || []
  };
  artLessons = [activeArtLesson, ...artLessons];
  renderArtLessons();
  selectArtLesson(activeArtLesson.id);
  return activeArtLesson;
}

async function createArtLesson() {
  if (!artCategories.length) {
    showToast("ยังไม่มีหมวดศิลปะ กรุณารัน SQL สำหรับสร้างหมวดก่อน", true);
    return;
  }
  const categoryId = selectedArtCategoryId();
  const levelId = selectedArtLevelIdForCategory(categoryId);
  const sortOrder =
    Math.max(0, ...artLessons.map((lesson) => lesson.sort_order || 0)) + 1;

  const { data, error } = await supabaseClient
    .from("art_lessons")
    .insert({
      category_id: categoryId,
      level_id: levelId,
      title: "บทเรียนศิลปะใหม่",
      story_prompt: "",
      sort_order: sortOrder,
      is_published: false
    })
    .select()
    .single();

  if (error) {
    showToast(`เพิ่มบทเรียนไม่สำเร็จ: ${error.message}`, true);
    return;
  }

  activeArtLesson = data;
  showToast("เพิ่มบทเรียนศิลปะใหม่แล้ว");
  await loadArtStudio();
  selectArtLesson(data.id);
}

async function uploadArtFile(bucket, file, lessonId) {
  const folder = `lesson-${lessonId}`;
  const path = `${folder}/${crypto.randomUUID()}-${safeFileName(file.name)}`;
  const { error } = await supabaseClient.storage
    .from(bucket)
    .upload(path, file, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false
    });
  if (error) throw error;
  return path;
}

async function uploadArtVideo(input) {
  const file = input.files[0];
  if (!file) return;
  try {
    await ensureActiveArtLesson();
  } catch (error) {
    input.value = "";
    showToast(`ยังสร้างบทเรียนไม่ได้: ${error.message}`, true);
    return;
  }
  if (file.size > 500 * 1024 * 1024) {
    input.value = "";
    showToast("วิดีโอมีขนาดเกิน 500 MB แนะนำใช้ลิงก์วิดีโอแทน", true);
    return;
  }
  if (!["video/mp4", "video/webm", "video/quicktime"].includes(file.type)) {
    input.value = "";
    showToast("ชนิดไฟล์วิดีโอไม่ถูกต้อง", true);
    return;
  }

  const dropZone = input.closest(".file-drop");
  const currentVideo = document.querySelector("#currentArtVideo");
  dropZone.classList.add("uploading");
  currentVideo.className = "current-file selected uploading";
  currentVideo.textContent =
    `เลือกแล้ว: ${file.name} (${formatFileSize(file.size)}) · กำลังอัปโหลด`;

  try {
    const path = await uploadArtFile("art-videos", file, activeArtLesson.id);
    const { error } = await supabaseClient
      .from("art_lessons")
      .update({ video_path: path })
      .eq("id", activeArtLesson.id);
    if (error) throw error;
    activeArtLesson.video_path = path;
    const index = artLessons.findIndex(({ id }) => id === activeArtLesson.id);
    if (index >= 0) artLessons[index].video_path = path;
    currentVideo.className = "current-file ready";
    currentVideo.textContent =
      `อัปโหลดสำเร็จ: ${file.name} (${formatFileSize(file.size)})`;
    updateArtReadiness();
    renderArtLessons();
    showToast("อัปโหลดวิดีโอศิลปะสำเร็จ");
  } catch (error) {
    currentVideo.className = "current-file selected";
    currentVideo.textContent = `อัปโหลดไม่สำเร็จ: ${file.name}`;
    showToast(`อัปโหลดวิดีโอไม่สำเร็จ: ${error.message}`, true);
  } finally {
    input.value = "";
    dropZone.classList.remove("uploading");
  }
}

async function uploadArtImages(input) {
  const files = Array.from(input.files || []);
  if (!files.length) return;
  const caption = document.querySelector("#artImageCaption").value.trim();
  try {
    await ensureActiveArtLesson();
  } catch (error) {
    input.value = "";
    showToast(`ยังสร้างบทเรียนไม่ได้: ${error.message}`, true);
    return;
  }
  const invalid = files.find((file) =>
    file.size > 8 * 1024 * 1024 ||
    !["image/jpeg", "image/png", "image/webp"].includes(file.type));
  if (invalid) {
    input.value = "";
    showToast("รูปต้องเป็น PNG, JPG หรือ WEBP และไม่เกิน 8 MB ต่อรูป", true);
    return;
  }

  const dropZone = input.closest(".file-drop");
  const currentImages = document.querySelector("#currentArtImages");
  dropZone.classList.add("uploading");
  currentImages.className = "current-file selected uploading";
  currentImages.textContent = `กำลังอัปโหลด ${files.length} รูป`;

  try {
    const currentCount = activeArtLesson.art_lesson_images?.length || 0;
    const rowsToInsert = [];
    for (const [index, file] of files.entries()) {
      const path = await uploadArtFile("art-gallery", file, activeArtLesson.id);
      rowsToInsert.push({
        lesson_id: activeArtLesson.id,
        image_path: path,
        caption: caption || file.name.replace(/\.[^.]+$/, ""),
        sort_order: currentCount + index + 1
      });
    }
    const { error } = await supabaseClient
      .from("art_lesson_images")
      .insert(rowsToInsert);
    if (error) throw error;

    showToast(`อัปโหลดภาพตัวอย่าง ${files.length} รูปสำเร็จ`);
    input.value = "";
    const lessonId = activeArtLesson.id;
    await loadArtStudio();
    selectArtLesson(lessonId);
  } catch (error) {
    currentImages.className = "current-file selected";
    currentImages.textContent = "อัปโหลดภาพไม่สำเร็จ";
    showToast(`อัปโหลดภาพไม่สำเร็จ: ${error.message}`, true);
  } finally {
    dropZone.classList.remove("uploading");
  }
}

async function deleteArtImage(imageId) {
  if (!activeArtLesson) return;
  const image = activeArtLesson.art_lesson_images?.find(({ id }) => id === imageId);
  const { error } = await supabaseClient
    .from("art_lesson_images")
    .delete()
    .eq("id", imageId);
  if (error) {
    showToast(`ลบรูปไม่สำเร็จ: ${error.message}`, true);
    return;
  }
  if (image?.image_path) {
    await supabaseClient.storage.from("art-gallery").remove([image.image_path]);
  }
  showToast("ลบรูปตัวอย่างแล้ว");
  await loadArtStudio();
  selectArtLesson(activeArtLesson.id);
}

async function deleteActiveArtLesson() {
  if (!activeArtLesson?.id) {
    showToast("ยังไม่ได้เลือกบทเรียนศิลปะ", true);
    return;
  }

  const title = activeArtLesson.title || "บทเรียนศิลปะนี้";
  const confirmed = window.confirm(
    `ต้องการลบ "${title}" ใช่ไหม?\n\nระบบจะลบบทเรียน วิดีโอที่อัปโหลด และภาพตัวอย่างของบทเรียนนี้ออกด้วย`
  );
  if (!confirmed) return;

  deleteArtLessonButton.disabled = true;
  artUploadProgress.hidden = false;
  try {
    const imagePaths = (activeArtLesson.art_lesson_images || [])
      .map((image) => image.image_path)
      .filter(Boolean);
    if (imagePaths.length) {
      const { error } = await supabaseClient.storage
        .from("art-gallery")
        .remove(imagePaths);
      if (error) throw error;
    }
    if (activeArtLesson.video_path) {
      const { error } = await supabaseClient.storage
        .from("art-videos")
        .remove([activeArtLesson.video_path]);
      if (error) throw error;
    }

    const deletedLessonId = activeArtLesson.id;
    const { error } = await supabaseClient
      .from("art_lessons")
      .delete()
      .eq("id", deletedLessonId);
    if (error) throw error;

    showToast("ลบบทเรียนศิลปะแล้ว");
    activeArtLesson = null;
    await loadArtStudio();
  } catch (error) {
    showToast(`ลบบทเรียนไม่สำเร็จ: ${error.message}`, true);
  } finally {
    deleteArtLessonButton.disabled = false;
    artUploadProgress.hidden = true;
  }
}

artCategoryFilter.addEventListener("change", () => {
  renderArtOptions();
  renderArtLessons();
});
artLevelFilter.addEventListener("change", renderArtLessons);
artCategorySelect.addEventListener("change", renderArtLevelSelect);
document.querySelector("#addArtLessonButton").addEventListener("click", createArtLesson);
document.querySelector("#refreshArtButton").addEventListener("click", loadArtStudio);
artAdminList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-art-lesson-id]");
  if (button) selectArtLesson(button.dataset.artLessonId);
});
document.querySelector("#artVideoFile").addEventListener("change", (event) =>
  uploadArtVideo(event.currentTarget));
document.querySelector("#artImageFiles").addEventListener("change", (event) =>
  uploadArtImages(event.currentTarget));
deleteArtLessonButton.addEventListener("click", deleteActiveArtLesson);
artImageList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-delete-art-image]");
  if (button) deleteArtImage(button.dataset.deleteArtImage);
});

artEditor.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    await ensureActiveArtLesson();
  } catch (error) {
    showToast(`ยังสร้างบทเรียนไม่ได้: ${error.message}`, true);
    return;
  }

  const title = document.querySelector("#artLessonTitle").value.trim();
  const storyPrompt = document.querySelector("#artLessonPrompt").value.trim();
  const videoUrl = document.querySelector("#artVideoUrl").value.trim();
  const categoryId = artCategorySelect.value;
  const levelId = artLevelSelect.value || null;
  const publishToggle = document.querySelector("#artLessonPublished");
  const hasVideo = Boolean(activeArtLesson.video_path || videoUrl);
  let publish = publishToggle.checked;

  if (hasVideo) {
    publish = true;
    publishToggle.checked = true;
  }

  if (publish && !hasVideo) {
    showToast("กรุณาเพิ่มวิดีโอหรือวางลิงก์วิดีโอก่อนเผยแพร่", true);
    return;
  }

  const saveButton = artEditor.querySelector(".save-lesson-button");
  saveButton.disabled = true;
  artUploadProgress.hidden = false;
  try {
    const { error } = await supabaseClient
      .from("art_lessons")
      .update({
        category_id: categoryId,
        level_id: levelId,
        title,
        story_prompt: storyPrompt,
        video_url: videoUrl || null,
        video_path: activeArtLesson.video_path || null,
        is_published: publish
      })
      .eq("id", activeArtLesson.id);
    if (error) throw error;

    showToast(publish ? "บันทึกและเผยแพร่บทเรียนศิลปะแล้ว" : "บันทึกบทเรียนศิลปะแล้ว");
    const lessonId = activeArtLesson.id;
    await loadArtStudio();
    selectArtLesson(lessonId);
  } catch (error) {
    showToast(`บันทึกบทเรียนศิลปะไม่สำเร็จ: ${error.message}`, true);
  } finally {
    saveButton.disabled = false;
    artUploadProgress.hidden = true;
  }
});

function getFreeResourceCategoryLabel(category) {
  return freeResourceCategoryLabels[category] || category || "สื่อฟรี";
}

function makeFreeResourceSlug(value) {
  const base = String(value || "free-resource")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9ก-๙-]+/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return base || `free-resource-${Date.now()}`;
}

function getFreeResourcePublicUrl(path) {
  if (!path) return "";
  const { data } = supabaseClient.storage.from("free-resources").getPublicUrl(path);
  return data?.publicUrl || "";
}

async function uploadFreeResourceFile(file, folder, slug, maxBytes, accepted, label) {
  if (!file || !file.size) return null;
  if (file.size > maxBytes) throw new Error(`${label} มีขนาดเกินกำหนด`);
  if (!accepted(file)) throw new Error(`ชนิดไฟล์ ${label} ไม่ถูกต้อง`);

  const path = `${safeStorageSegment(folder, "folder")}/${safeStorageSegment(slug, "resource")}/${crypto.randomUUID()}-${safeFileName(file.name)}`;
  const { error } = await supabaseClient.storage
    .from("free-resources")
    .upload(path, file, {
      cacheControl: "3600",
      contentType: file.type || "application/octet-stream",
      upsert: false
    });
  if (error) throw error;
  return { path, publicUrl: getFreeResourcePublicUrl(path), fileName: file.name };
}

function resetFreeResourceForm() {
  freeResourceForm?.reset();
  document.querySelector("#freeResourceId").value = "";
  document.querySelector("#freeResourceSlug").value = "";
  document.querySelector("#freeResourceAgeGroup").value = "3-6 ปี";
  document.querySelector("#freeResourcePublished").checked = true;
  document.querySelector("#freeResourceEditorHeading").textContent = "สื่อฟรีรายการใหม่";
  document.querySelector("#currentFreeThumbnail").textContent = "ยังไม่มีภาพหน้าปก";
  document.querySelector("#currentFreeWorksheet").textContent = "ยังไม่มีไฟล์ใบงาน";
  document.querySelector("#currentFreePowerpoint").textContent = "ยังไม่มีไฟล์ PowerPoint";
  const thumbnailPreview = document.querySelector("#freeResourceThumbnailPreview");
  const thumbnailPreviewImage = thumbnailPreview?.querySelector("img");
  if (thumbnailPreview && thumbnailPreviewImage) {
    thumbnailPreview.hidden = true;
    thumbnailPreviewImage.removeAttribute("src");
  }
}

function fillFreeResourceForm(resource) {
  document.querySelector("#freeResourceId").value = resource.id || "";
  document.querySelector("#freeResourceTitle").value = resource.title || "";
  document.querySelector("#freeResourceSlug").value = resource.slug || "";
  document.querySelector("#freeResourceCategory").value = resource.category || "art";
  document.querySelector("#freeResourceAgeGroup").value = resource.age_group || "3-6 ปี";
  document.querySelector("#freeResourceDescription").value = resource.description || "";
  document.querySelector("#freeResourceVideoUrl").value = resource.video_url || "";
  document.querySelector("#freeResourcePublished").checked = resource.status === "published";
  document.querySelector("#freeResourceEditorHeading").textContent = resource.title || "สื่อฟรีรายการใหม่";
  document.querySelector("#currentFreeThumbnail").textContent =
    resource.thumbnail_url ? "มีภาพหน้าปกแล้ว" : "ยังไม่มีภาพหน้าปก";
  document.querySelector("#currentFreeWorksheet").textContent =
    resource.worksheet_file_name || (resource.worksheet_url ? "มีไฟล์ใบงานแล้ว" : "ยังไม่มีไฟล์ใบงาน");
  document.querySelector("#currentFreePowerpoint").textContent =
    resource.powerpoint_file_name || (resource.powerpoint_url ? "มีไฟล์ PowerPoint แล้ว" : "ยังไม่มีไฟล์ PowerPoint");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function bindFreeResourceFilePreview(inputId, labelId, emptyText) {
  const input = document.querySelector(inputId);
  const label = document.querySelector(labelId);
  input?.addEventListener("change", () => {
    const file = input.files?.[0];
    label.textContent = file
      ? `เลือกแล้ว: ${file.name} (${formatFileSize(file.size)})`
      : emptyText;
  });
}

function bindFreeResourceThumbnailPreview() {
  const input = document.querySelector("#freeResourceThumbnail");
  const preview = document.querySelector("#freeResourceThumbnailPreview");
  const previewImage = preview?.querySelector("img");
  input?.addEventListener("change", () => {
    const file = input.files?.[0];
    if (!preview || !previewImage) return;
    if (!file) {
      preview.hidden = true;
      previewImage.removeAttribute("src");
      return;
    }
    previewImage.src = URL.createObjectURL(file);
    preview.hidden = false;
  });
}

async function loadFreeResourcesAdmin() {
  if (!isMainAdmin()) return;
  freeResourceAdminList.innerHTML =
    '<div class="loading-state"><i></i><span>กำลังโหลดสื่อฟรี...</span></div>';
  const { data, error } = await supabaseClient
    .from("free_resources")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    freeResourceAdminList.innerHTML = "";
    showToast(`โหลดสื่อฟรีไม่สำเร็จ: ${error.message}`, true);
    return;
  }

  freeResources = data || [];
  renderFreeResourcesAdmin();
  if (freeResourceLeads.length) renderFreeResourceLeadsAdmin();
}

function renderFreeResourcesAdmin() {
  freeResourceCount.textContent = freeResources.length;
  renderFreeLeadResourceOptions();
  if (!freeResources.length) {
    freeResourceAdminList.innerHTML =
      '<div class="gallery-empty">ยังไม่มีสื่อฟรี กรอกฟอร์มด้านซ้ายเพื่อเพิ่มรายการแรก</div>';
    return;
  }
  freeResourceAdminList.innerHTML = freeResources.map((resource) => `
    <article class="free-admin-card ${resource.status === "published" ? "" : "draft"}">
      <div class="free-admin-meta">
        <span>${escapeHtml(getFreeResourceCategoryLabel(resource.category))}</span>
        <span>${escapeHtml(resource.status === "published" ? "เผยแพร่" : "ฉบับร่าง")}</span>
      </div>
      <strong>${escapeHtml(resource.title)}</strong>
      <p>${escapeHtml(resource.description || "ยังไม่มีคำอธิบาย")}</p>
      <div class="free-admin-actions">
        <button type="button" data-free-edit="${resource.id}">แก้ไข</button>
        <button type="button" data-free-toggle="${resource.id}">${resource.status === "published" ? "ซ่อน" : "เผยแพร่"}</button>
        ${resource.worksheet_url ? `<a href="${escapeHtml(resource.worksheet_url)}" target="_blank" rel="noopener">ใบงาน</a>` : ""}
        ${resource.powerpoint_url ? `<a href="${escapeHtml(resource.powerpoint_url)}" target="_blank" rel="noopener">PPT</a>` : ""}
        <button type="button" data-free-delete="${resource.id}">ลบ</button>
      </div>
    </article>
  `).join("");
}

function renderFreeLeadResourceOptions() {
  if (!freeLeadResourceFilter) return;
  const selectedValue = freeLeadResourceFilter.value;
  const options = [
    '<option value="">ทุกสื่อฟรี</option>',
    ...freeResources.map((resource) =>
      `<option value="${escapeHtml(resource.id)}">${escapeHtml(resource.title)}</option>`)
  ];
  freeLeadResourceFilter.innerHTML = options.join("");
  freeLeadResourceFilter.value = freeResources.some((resource) => resource.id === selectedValue)
    ? selectedValue
    : "";
}

function getLeadResource(lead) {
  return freeResources.find((resource) => resource.id === lead.resource_id) ||
    lead.free_resources ||
    lead.free_resource ||
    {};
}

function getLeadResourceTitle(lead) {
  const resource = getLeadResource(lead);
  if (lead.resource_slug && trialLeadResourceLabels[lead.resource_slug]) {
    return trialLeadResourceLabels[lead.resource_slug];
  }
  return resource.title || lead.resource_slug || "ไม่ระบุรายการ";
}

function getLeadStatus(lead) {
  return lead.follow_status || "new";
}

function getCssSafeValue(value) {
  return window.CSS?.escape ? CSS.escape(String(value)) : String(value).replace(/"/g, '\\"');
}

function getLeadSearchText(lead) {
  const resource = getLeadResource(lead);
  return [
    lead.parent_name,
    lead.contact_email,
    lead.contact_phone,
    lead.line_id,
    lead.child_age,
    lead.province,
    lead.district,
    lead.source,
    lead.resource_slug,
    resource.title,
    resource.category,
    lead.admin_note,
    ...(lead.interested_categories || [])
  ].filter(Boolean).join(" ").toLowerCase();
}

function getFilteredFreeResourceLeads() {
  const resourceId = freeLeadResourceFilter?.value || "";
  const category = freeLeadCategoryFilter?.value || "";
  const status = freeLeadStatusFilter?.value || "";
  const search = (freeLeadSearchInput?.value || "").trim().toLowerCase();
  return freeResourceLeads.filter((lead) => {
    const resource = getLeadResource(lead);
    const leadCategory = resource.category || "";
    if (resourceId && lead.resource_id !== resourceId) return false;
    if (category && leadCategory !== category && !(lead.interested_categories || []).includes(category)) return false;
    if (status && getLeadStatus(lead) !== status) return false;
    if (search && !getLeadSearchText(lead).includes(search)) return false;
    return true;
  });
}

async function loadFreeResourceLeadsAdmin() {
  if (!isMainAdmin() || !freeLeadRows) return;
  if (refreshFreeLeadsButton) refreshFreeLeadsButton.disabled = true;
  if (exportFreeLeadsButton) exportFreeLeadsButton.disabled = true;
  freeLeadRows.innerHTML =
    '<tr><td colspan="9" class="loading-cell">กำลังโหลดรายชื่อ...</td></tr>';

  try {
    const request = supabaseClient
      .from("free_resource_leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    const timeout = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("โหลดรายชื่อนานเกินไป กรุณาลองรีเฟรชอีกครั้ง")), 12000);
    });
    const { data, error } = await Promise.race([request, timeout]);
    if (error) throw error;

    freeResourceLeads = data || [];
    renderFreeResourceLeadsAdmin();
  } catch (error) {
    freeResourceLeads = [];
    if (freeLeadCount) freeLeadCount.textContent = "0";
    if (freeLeadNewCount) freeLeadNewCount.textContent = "0";
    if (freeLeadInterestedCount) freeLeadInterestedCount.textContent = "0";
    if (freeLeadAreaCount) freeLeadAreaCount.textContent = "0";
    freeLeadRows.innerHTML =
      `<tr><td colspan="9" class="loading-cell">โหลดรายชื่อไม่สำเร็จ: ${escapeHtml(error.message || "ไม่ทราบสาเหตุ")}</td></tr>`;
    showToast(`โหลดรายชื่อรับสื่อฟรีไม่สำเร็จ: ${error.message || "ไม่ทราบสาเหตุ"}`, true);
  } finally {
    if (refreshFreeLeadsButton) refreshFreeLeadsButton.disabled = false;
    if (exportFreeLeadsButton) exportFreeLeadsButton.disabled = false;
  }
}

function renderFreeResourceLeadsAdmin() {
  if (!freeLeadRows || !freeLeadCount) return;
  const leads = getFilteredFreeResourceLeads();
  freeLeadCount.textContent = leads.length;
  if (freeLeadNewCount) {
    freeLeadNewCount.textContent = leads.filter((lead) => getLeadStatus(lead) === "new").length;
  }
  if (freeLeadInterestedCount) {
    freeLeadInterestedCount.textContent = leads.filter((lead) =>
      ["interested", "trial_booked"].includes(getLeadStatus(lead))).length;
  }
  if (freeLeadAreaCount) {
    freeLeadAreaCount.textContent = new Set(leads.map((lead) => lead.province).filter(Boolean)).size;
  }
  if (!leads.length) {
    freeLeadRows.innerHTML =
      '<tr><td colspan="9" class="loading-cell">ยังไม่มีผู้ปกครองกรอกข้อมูลในตัวกรองนี้</td></tr>';
    return;
  }

  freeLeadRows.innerHTML = leads.map((lead) => {
    const resource = getLeadResource(lead);
    const category = resource.category || "";
    const contactLines = [
      lead.contact_email ? `<small>${escapeHtml(lead.contact_email)}</small>` : "",
      lead.contact_phone ? `<small>${escapeHtml(lead.contact_phone)}</small>` : "",
      lead.line_id && lead.line_id !== lead.contact_phone ? `<small>LINE: ${escapeHtml(lead.line_id)}</small>` : ""
    ].filter(Boolean).join("");
    const interests = (lead.interested_categories || [])
      .map(getFreeResourceCategoryLabel)
      .join(", ");
    const status = getLeadStatus(lead);

    return `
      <tr data-free-lead-row="${escapeHtml(lead.id)}">
        <td class="date-cell">
          <strong>${escapeHtml(formatDate(lead.created_at).split(" เวลา ")[0])}</strong>
          <small>${escapeHtml(formatDate(lead.created_at))}</small>
        </td>
        <td class="student-cell">
          <span class="student-avatar">👪</span>
          <div><strong>${escapeHtml(lead.parent_name)}</strong><small>ยินยอมให้ติดต่อแล้ว</small></div>
        </td>
        <td>${contactLines || "<small>-</small>"}</td>
        <td><strong>${escapeHtml(lead.child_age || "-")}</strong></td>
        <td><strong>${escapeHtml(lead.district || "-")}</strong><small>${escapeHtml(lead.province || "")}</small></td>
        <td class="course-cell">
          <strong>${escapeHtml(getLeadResourceTitle(lead))}</strong>
          <small>${escapeHtml(getFreeResourceCategoryLabel(category || lead.resource_slug || ""))}</small>
        </td>
        <td><small>${escapeHtml(interests || "-")}</small></td>
        <td class="free-lead-follow-cell">
          <select data-free-lead-status="${escapeHtml(lead.id)}">
            ${Object.entries(freeLeadStatusLabels).map(([value, label]) =>
              `<option value="${escapeHtml(value)}" ${status === value ? "selected" : ""}>${escapeHtml(label)}</option>`).join("")}
          </select>
          <textarea data-free-lead-note="${escapeHtml(lead.id)}" rows="2" maxlength="500" placeholder="โน้ตติดตาม">${escapeHtml(lead.admin_note || "")}</textarea>
          <button type="button" data-save-free-lead="${escapeHtml(lead.id)}">บันทึก</button>
        </td>
        <td><small>${escapeHtml(lead.source || "website")}</small></td>
      </tr>
    `;
  }).join("");
}

async function saveFreeResourceLeadFollowup(leadId) {
  const lead = freeResourceLeads.find((item) => item.id === leadId);
  if (!lead) return;
  const safeLeadId = getCssSafeValue(leadId);
  const statusInput = freeLeadRows.querySelector(`[data-free-lead-status="${safeLeadId}"]`);
  const noteInput = freeLeadRows.querySelector(`[data-free-lead-note="${safeLeadId}"]`);
  const saveButton = freeLeadRows.querySelector(`[data-save-free-lead="${safeLeadId}"]`);
  const patch = {
    follow_status: statusInput?.value || "new",
    admin_note: noteInput?.value?.trim() || null,
    follow_updated_at: new Date().toISOString()
  };

  if (saveButton) {
    saveButton.disabled = true;
    saveButton.textContent = "กำลังบันทึก...";
  }
  try {
    const { error } = await supabaseClient
      .from("free_resource_leads")
      .update(patch)
      .eq("id", leadId);
    if (error) throw error;
    Object.assign(lead, patch);
    renderFreeResourceLeadsAdmin();
    showToast("บันทึกสถานะติดตามแล้ว");
  } catch (error) {
    showToast(`บันทึกสถานะไม่สำเร็จ: ${error.message || "กรุณารัน SQL สื่อฟรีเวอร์ชันล่าสุด"}`, true);
  } finally {
    if (saveButton) {
      saveButton.disabled = false;
      saveButton.textContent = "บันทึก";
    }
  }
}

function exportFreeResourceLeadsCsv() {
  const leads = getFilteredFreeResourceLeads();
  if (!leads.length) {
    showToast("ไม่มีรายชื่อรับสื่อฟรีในตัวกรองนี้ให้ Export", true);
    return;
  }

  const headers = [
    "วันที่กรอก",
    "ชื่อผู้ปกครอง",
    "อีเมล",
    "เบอร์/LINE",
    "อายุลูก",
    "อำเภอ",
    "จังหวัด",
    "สื่อที่รับ",
    "หมวดสื่อ",
    "หมวดที่สนใจ",
    "สถานะติดตาม",
    "โน้ตแอดมิน",
    "ที่มา",
    "ยินยอมให้ติดต่อ"
  ];

  const lines = [
    headers.map(csvCell).join(","),
    ...leads.map((lead) => {
      const resource = getLeadResource(lead);
      return [
        toLocalDateTimeValue(lead.created_at),
        lead.parent_name,
        lead.contact_email,
        lead.contact_phone || lead.line_id,
        lead.child_age,
        lead.district,
        lead.province,
        getLeadResourceTitle(lead),
        getFreeResourceCategoryLabel(resource.category || ""),
        (lead.interested_categories || []).map(getFreeResourceCategoryLabel).join(", "),
        freeLeadStatusLabels[getLeadStatus(lead)] || getLeadStatus(lead),
        lead.admin_note || "",
        lead.source,
        lead.consent_contact ? "ใช่" : "ไม่ใช่"
      ].map(csvCell).join(",");
    })
  ];

  const filenameDate = new Date().toISOString().slice(0, 10);
  const blob = new Blob([`\ufeff${lines.join("\n")}`], {
    type: "text/csv;charset=utf-8"
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `toko-poppy-free-resource-leads-${filenameDate}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast(`Export รายชื่อรับสื่อฟรีสำเร็จ ${leads.length} รายการ`);
}

function getPartnerLeadStatus(lead) {
  return lead.follow_status || "new";
}

function getPartnerLeadCourseText(lead) {
  return (lead.interested_courses || [])
    .map((course) => partnerLeadCourseLabels[course] || course)
    .join(", ");
}

function getPartnerLeadSearchText(lead) {
  return [
    lead.contact_name,
    lead.contact_email,
    lead.contact_phone,
    lead.line_id,
    lead.institute_name,
    lead.province,
    lead.district,
    lead.has_institute,
    partnerLeadInstituteLabels[lead.has_institute],
    getPartnerLeadCourseText(lead),
    lead.message,
    lead.admin_note,
    lead.source,
    ...(lead.interested_courses || [])
  ].filter(Boolean).join(" ").toLowerCase();
}

function getFilteredPartnerLeads() {
  const course = partnerLeadCourseFilter?.value || "";
  const status = partnerLeadStatusFilter?.value || "";
  const search = (partnerLeadSearchInput?.value || "").trim().toLowerCase();
  return partnerLeads.filter((lead) => {
    if (course && !(lead.interested_courses || []).includes(course)) return false;
    if (status && getPartnerLeadStatus(lead) !== status) return false;
    if (search && !getPartnerLeadSearchText(lead).includes(search)) return false;
    return true;
  });
}

async function loadPartnerLeadsAdmin() {
  if (!isMainAdmin() || !partnerLeadRows) return;
  if (refreshPartnerLeadsButton) refreshPartnerLeadsButton.disabled = true;
  if (exportPartnerLeadsButton) exportPartnerLeadsButton.disabled = true;
  partnerLeadRows.innerHTML =
    '<tr><td colspan="8" class="loading-cell">กำลังโหลดรายชื่อ...</td></tr>';

  try {
    const request = supabaseClient
      .from("partner_leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    const timeout = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("โหลดรายชื่อนานเกินไป กรุณาลองรีเฟรชอีกครั้ง")), 12000);
    });
    const { data, error } = await Promise.race([request, timeout]);
    if (error) throw error;

    partnerLeads = data || [];
    renderPartnerLeadsAdmin();
  } catch (error) {
    partnerLeads = [];
    if (partnerLeadCount) partnerLeadCount.textContent = "0";
    if (partnerLeadNewCount) partnerLeadNewCount.textContent = "0";
    if (partnerLeadInterestedCount) partnerLeadInterestedCount.textContent = "0";
    if (partnerLeadAreaCount) partnerLeadAreaCount.textContent = "0";
    partnerLeadRows.innerHTML =
      `<tr><td colspan="8" class="loading-cell">โหลดรายชื่อไม่สำเร็จ: ${escapeHtml(error.message || "กรุณารันไฟล์ supabase-partner-leads-schema.sql ก่อน")}</td></tr>`;
    showToast(`โหลด Lead สถาบันไม่สำเร็จ: ${error.message || "กรุณารัน SQL สถาบันก่อน"}`, true);
  } finally {
    if (refreshPartnerLeadsButton) refreshPartnerLeadsButton.disabled = false;
    if (exportPartnerLeadsButton) exportPartnerLeadsButton.disabled = false;
  }
}

function renderPartnerLeadsAdmin() {
  if (!partnerLeadRows || !partnerLeadCount) return;
  const leads = getFilteredPartnerLeads();
  partnerLeadCount.textContent = leads.length;
  if (partnerLeadNewCount) {
    partnerLeadNewCount.textContent = leads.filter((lead) => getPartnerLeadStatus(lead) === "new").length;
  }
  if (partnerLeadInterestedCount) {
    partnerLeadInterestedCount.textContent = leads.filter((lead) =>
      ["interested", "meeting_booked", "sample_sent"].includes(getPartnerLeadStatus(lead))).length;
  }
  if (partnerLeadAreaCount) {
    partnerLeadAreaCount.textContent = new Set(leads.map((lead) => lead.province).filter(Boolean)).size;
  }
  if (!leads.length) {
    partnerLeadRows.innerHTML =
      '<tr><td colspan="8" class="loading-cell">ยังไม่มี Lead สถาบันในตัวกรองนี้</td></tr>';
    return;
  }

  partnerLeadRows.innerHTML = leads.map((lead) => {
    const status = getPartnerLeadStatus(lead);
    const contactLines = [
      lead.contact_email ? `<small>${escapeHtml(lead.contact_email)}</small>` : "",
      lead.contact_phone ? `<small>${escapeHtml(lead.contact_phone)}</small>` : "",
      lead.line_id && lead.line_id !== lead.contact_phone ? `<small>LINE: ${escapeHtml(lead.line_id)}</small>` : ""
    ].filter(Boolean).join("");
    const courses = getPartnerLeadCourseText(lead);
    return `
      <tr data-partner-lead-row="${escapeHtml(lead.id)}">
        <td class="date-cell">
          <strong>${escapeHtml(formatDate(lead.created_at).split(" เวลา ")[0])}</strong>
          <small>${escapeHtml(formatDate(lead.created_at))}</small>
        </td>
        <td class="student-cell">
          <span class="student-avatar">🤝</span>
          <div>
            <strong>${escapeHtml(lead.contact_name || "-")}</strong>
            <small>${escapeHtml(lead.message || "ขอข้อมูลหลักสูตรสถาบัน")}</small>
          </div>
        </td>
        <td>${contactLines || "<small>-</small>"}</td>
        <td><strong>${escapeHtml(lead.district || "-")}</strong><small>${escapeHtml(lead.province || "")}</small></td>
        <td>
          <strong>${escapeHtml(lead.institute_name || "-")}</strong>
          <small>${escapeHtml(partnerLeadInstituteLabels[lead.has_institute] || lead.has_institute || "-")}</small>
        </td>
        <td><small>${escapeHtml(courses || "-")}</small></td>
        <td class="free-lead-follow-cell">
          <select data-partner-lead-status="${escapeHtml(lead.id)}">
            ${Object.entries(partnerLeadStatusLabels).map(([value, label]) =>
              `<option value="${escapeHtml(value)}" ${status === value ? "selected" : ""}>${escapeHtml(label)}</option>`).join("")}
          </select>
          <textarea data-partner-lead-note="${escapeHtml(lead.id)}" rows="2" maxlength="500" placeholder="โน้ตติดตาม">${escapeHtml(lead.admin_note || "")}</textarea>
          <button type="button" data-save-partner-lead="${escapeHtml(lead.id)}">บันทึก</button>
        </td>
        <td><small>${escapeHtml(lead.source || "website")}</small></td>
      </tr>
    `;
  }).join("");
}

async function savePartnerLeadFollowup(leadId) {
  const lead = partnerLeads.find((item) => item.id === leadId);
  if (!lead) return;
  const safeLeadId = getCssSafeValue(leadId);
  const statusInput = partnerLeadRows.querySelector(`[data-partner-lead-status="${safeLeadId}"]`);
  const noteInput = partnerLeadRows.querySelector(`[data-partner-lead-note="${safeLeadId}"]`);
  const saveButton = partnerLeadRows.querySelector(`[data-save-partner-lead="${safeLeadId}"]`);
  const patch = {
    follow_status: statusInput?.value || "new",
    admin_note: noteInput?.value?.trim() || null,
    follow_updated_at: new Date().toISOString()
  };

  if (saveButton) {
    saveButton.disabled = true;
    saveButton.textContent = "กำลังบันทึก...";
  }
  try {
    const { error } = await supabaseClient
      .from("partner_leads")
      .update(patch)
      .eq("id", leadId);
    if (error) throw error;
    Object.assign(lead, patch);
    renderPartnerLeadsAdmin();
    showToast("บันทึกสถานะ Lead สถาบันแล้ว");
  } catch (error) {
    showToast(`บันทึกสถานะไม่สำเร็จ: ${error.message || "กรุณารัน SQL สถาบันเวอร์ชันล่าสุด"}`, true);
  } finally {
    if (saveButton) {
      saveButton.disabled = false;
      saveButton.textContent = "บันทึก";
    }
  }
}

function exportPartnerLeadsCsv() {
  const leads = getFilteredPartnerLeads();
  if (!leads.length) {
    showToast("ไม่มี Lead สถาบันในตัวกรองนี้ให้ Export", true);
    return;
  }

  const headers = [
    "วันที่กรอก",
    "ชื่อผู้สนใจ",
    "อีเมล",
    "เบอร์/LINE",
    "ชื่อสถาบัน",
    "สถานะสถาบัน",
    "อำเภอ",
    "จังหวัด",
    "คอร์สที่สนใจ",
    "ข้อความเพิ่มเติม",
    "สถานะติดตาม",
    "โน้ตแอดมิน",
    "ที่มา",
    "ยินยอมให้ติดต่อ"
  ];

  const lines = [
    headers.map(csvCell).join(","),
    ...leads.map((lead) => [
      toLocalDateTimeValue(lead.created_at),
      lead.contact_name,
      lead.contact_email,
      lead.contact_phone || lead.line_id,
      lead.institute_name,
      partnerLeadInstituteLabels[lead.has_institute] || lead.has_institute,
      lead.district,
      lead.province,
      getPartnerLeadCourseText(lead),
      lead.message || "",
      partnerLeadStatusLabels[getPartnerLeadStatus(lead)] || getPartnerLeadStatus(lead),
      lead.admin_note || "",
      lead.source,
      lead.consent_contact ? "ใช่" : "ไม่ใช่"
    ].map(csvCell).join(","))
  ];

  const filenameDate = new Date().toISOString().slice(0, 10);
  const blob = new Blob([`\ufeff${lines.join("\n")}`], {
    type: "text/csv;charset=utf-8"
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `toko-poppy-partner-leads-${filenameDate}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast(`Export Lead สถาบันสำเร็จ ${leads.length} รายการ`);
}

async function saveFreeResource(event) {
  event.preventDefault();
  if (!isMainAdmin()) return;

  const id = document.querySelector("#freeResourceId").value;
  const existing = freeResources.find((resource) => resource.id === id) || {};
  const title = document.querySelector("#freeResourceTitle").value.trim();
  const slug = makeFreeResourceSlug(document.querySelector("#freeResourceSlug").value || title);
  if (!title) {
    showToast("กรุณากรอกชื่อสื่อฟรี", true);
    return;
  }

  const submitButton = freeResourceForm.querySelector(".save-lesson-button");
  submitButton.disabled = true;
  submitButton.textContent = "กำลังบันทึก...";
  try {
    const thumbnailUpload = await uploadFreeResourceFile(
      document.querySelector("#freeResourceThumbnail").files[0],
      "covers",
      slug,
      8 * 1024 * 1024,
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      "ภาพหน้าปก"
    );
    const worksheetUpload = await uploadFreeResourceFile(
      document.querySelector("#freeResourceWorksheet").files[0],
      "worksheets",
      slug,
      50 * 1024 * 1024,
      (file) => file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf"),
      "ใบงาน PDF"
    );
    const powerpointUpload = await uploadFreeResourceFile(
      document.querySelector("#freeResourcePowerpoint").files[0],
      "powerpoints",
      slug,
      80 * 1024 * 1024,
      (file) => [".ppt", ".pptx"].some((ext) => file.name.toLowerCase().endsWith(ext)) ||
        [
          "application/vnd.ms-powerpoint",
          "application/vnd.openxmlformats-officedocument.presentationml.presentation"
        ].includes(file.type),
      "PowerPoint"
    );

    const payload = {
      slug,
      title,
      category: document.querySelector("#freeResourceCategory").value,
      age_group: document.querySelector("#freeResourceAgeGroup").value.trim() || "3-6 ปี",
      description: document.querySelector("#freeResourceDescription").value.trim() || null,
      video_url: document.querySelector("#freeResourceVideoUrl").value.trim() || null,
      thumbnail_url: thumbnailUpload?.publicUrl || existing.thumbnail_url || null,
      worksheet_url: worksheetUpload?.publicUrl || existing.worksheet_url || null,
      worksheet_file_name: worksheetUpload?.fileName || existing.worksheet_file_name || null,
      powerpoint_url: powerpointUpload?.publicUrl || existing.powerpoint_url || null,
      powerpoint_file_name: powerpointUpload?.fileName || existing.powerpoint_file_name || null,
      status: document.querySelector("#freeResourcePublished").checked ? "published" : "draft",
      updated_at: new Date().toISOString()
    };

    const { error } = id
      ? await supabaseClient.from("free_resources").update(payload).eq("id", id)
      : await supabaseClient.from("free_resources").insert({
          ...payload,
          created_by: currentAdminProfile?.user_id || null
        });
    if (error) throw error;

    showToast("บันทึกสื่อฟรีเรียบร้อย");
    resetFreeResourceForm();
    await loadFreeResourcesAdmin();
  } catch (error) {
    showToast(`บันทึกสื่อฟรีไม่สำเร็จ: ${error.message}`, true);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "บันทึกสื่อฟรี";
  }
}

async function toggleFreeResource(id) {
  const resource = freeResources.find((item) => item.id === id);
  if (!resource) return;
  const nextStatus = resource.status === "published" ? "draft" : "published";
  const { error } = await supabaseClient
    .from("free_resources")
    .update({ status: nextStatus, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) {
    showToast(`ปรับสถานะไม่สำเร็จ: ${error.message}`, true);
    return;
  }
  showToast(nextStatus === "published" ? "เผยแพร่สื่อฟรีแล้ว" : "ซ่อนสื่อฟรีแล้ว");
  await loadFreeResourcesAdmin();
}

async function deleteFreeResource(id) {
  const resource = freeResources.find((item) => item.id === id);
  if (!resource) return;
  if (!confirm(`ลบ "${resource.title}" ใช่ไหม? ข้อมูล lead ที่เคยกรอกจะยังอยู่`)) return;
  const { error } = await supabaseClient
    .from("free_resources")
    .delete()
    .eq("id", id);
  if (error) {
    showToast(`ลบสื่อฟรีไม่สำเร็จ: ${error.message}`, true);
    return;
  }
  showToast("ลบสื่อฟรีแล้ว");
  resetFreeResourceForm();
  await loadFreeResourcesAdmin();
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!configured) {
    configWarning.hidden = false;
    configWarning.classList.remove("attention");
    void configWarning.offsetWidth;
    configWarning.classList.add("attention");
    showToast(
      "ยังไม่ได้ตั้งค่า Supabase: ใส่ Project URL และ anon key ใน supabase-config.js",
      true
    );
    return;
  }

  const button = loginForm.querySelector("button");
  const formData = new FormData(loginForm);
  button.disabled = true;
  button.textContent = "กำลังเข้าสู่ระบบ...";

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: formData.get("email"),
    password: formData.get("password")
  });

  button.disabled = false;
  button.innerHTML = 'เข้าสู่ระบบ <span>→</span>';
  if (error) {
    showToast(`เข้าสู่ระบบไม่สำเร็จ: ${getAuthErrorMessage(error)}`, true);
    return;
  }

  try {
    await showDashboard(data.user);
  } catch (adminError) {
    showToast(adminError.message, true);
  }
});
adminLoginTab.addEventListener("click", () => setAdminAuthMode("login"));
branchAdminSignupTab.addEventListener("click", () => setAdminAuthMode("signup"));
branchAdminSignupForm.addEventListener("submit", submitBranchAdminSignup);

document.querySelector("#logoutButton").addEventListener("click", async () => {
  await supabaseClient.auth.signOut();
  currentAdminProfile = null;
  currentBranchAssignment = null;
  shell.hidden = true;
  loginView.hidden = false;
  loginForm.reset();
  branchAdminSignupForm.reset();
  setAdminAuthMode("login");
});

document.querySelector("#refreshButton").addEventListener("click", loadApplications);
exportCsvButton.addEventListener("click", exportApplicationsCsv);
searchInput.addEventListener("input", renderApplications);
sourceFilter.addEventListener("change", renderApplications);
branchFilter.addEventListener("change", renderApplications);
dateFromFilter.addEventListener("change", renderApplications);
dateToFilter.addEventListener("change", renderApplications);
clearFiltersButton.addEventListener("click", () => {
  searchInput.value = "";
  sourceFilter.value = isBranchAdmin() ? "branch" : "all";
  branchFilter.value = isBranchAdmin() && currentBranchAssignment?.branch_id
    ? currentBranchAssignment.branch_id
    : "all";
  dateFromFilter.value = "";
  dateToFilter.value = "";
  activeStatus = "all";
  document.querySelectorAll("#filterTabs button").forEach((item) =>
    item.classList.toggle("active", item.dataset.status === "all"));
  renderApplications();
});
document.querySelector("#applicationRows").addEventListener("click", (event) => {
  const button = event.target.closest("[data-review-id]");
  if (button) openReview(button.dataset.reviewId);
});
document.querySelector("#filterTabs").addEventListener("click", (event) => {
  const button = event.target.closest("[data-status]");
  if (!button) return;
  activeStatus = button.dataset.status;
  document.querySelectorAll("#filterTabs button").forEach((item) =>
    item.classList.toggle("active", item === button));
  renderApplications();
});
branchForm.addEventListener("submit", createBranch);
document.querySelector("#refreshBranchesButton").addEventListener("click", loadBranchesAdmin);
branchRows.addEventListener("click", (event) => {
  const button = event.target.closest("[data-branch-toggle]");
  if (button) toggleBranch(button.dataset.branchToggle);
});
refreshBranchAdminsButton.addEventListener("click", loadBranchAdminApplications);
branchAdminRows.addEventListener("click", (event) => {
  const button = event.target.closest("[data-branch-admin-review]");
  if (!button) return;
  reviewBranchAdminApplication(button.dataset.branchAdminReview, button.dataset.decision);
});
teacherInviteForm?.addEventListener("submit", createTeacherInvitation);
refreshTeacherInvitesButton?.addEventListener("click", loadBranchTeacherInvitations);
teacherInviteRows?.addEventListener("click", (event) => {
  const reviewButton = event.target.closest("[data-teacher-review]");
  if (reviewButton) {
    reviewBranchTeacherInvitation(reviewButton.dataset.teacherReview, reviewButton.dataset.decision);
    return;
  }
  const copyButton = event.target.closest("[data-copy-teacher-invite]");
  if (!copyButton) return;
  const invitation = branchTeacherInvitations.find((item) => item.id === copyButton.dataset.copyTeacherInvite);
  if (invitation) copyTextToClipboard(getTeacherInviteLink(invitation), "คัดลอกลิงก์เชิญครูแล้ว");
});
refreshLearningButton?.addEventListener("click", loadLearningProgress);
learningSearchInput?.addEventListener("input", renderLearningProgress);
learningCourseFilter?.addEventListener("change", renderLearningProgress);
learningStatusFilter?.addEventListener("change", renderLearningProgress);
learningProgressRows?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-record-enrollment]");
  if (button) openRecordSession(button.dataset.recordEnrollment);
});
recordSessionForm?.addEventListener("submit", saveLearningSession);
recordSessionPhoto?.addEventListener("change", renderLearningPhotoPreview);
document.querySelector("#closeRecordSession")?.addEventListener("click", closeRecordSession);
recordSessionModal?.addEventListener("click", (event) => {
  if (event.target === recordSessionModal) closeRecordSession();
});
document.querySelector("#closeReview").addEventListener("click", closeReview);
reviewModal.addEventListener("click", (event) => {
  if (event.target === reviewModal) closeReview();
});
document.querySelector("#approveButton").addEventListener("click", () =>
  reviewApplication("approved"));
document.querySelector("#rejectButton").addEventListener("click", () =>
  reviewApplication("rejected"));
parentAccountSearchButton?.addEventListener("click", searchParentAccounts);
parentAccountSearch?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    searchParentAccounts();
  }
});
parentAccountResults?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-link-parent-id]");
  if (button) linkParentAccount(button.dataset.linkParentId);
});
robotAccess?.addEventListener("change", updateSessionPackageFields);
artAccess?.addEventListener("change", () => setArtProgramsEnabled(Boolean(artAccess.checked)));
artProgramControls.forEach((program) => {
  program.checkbox?.addEventListener("change", () => {
    const hasSelectedArtProgram = artProgramControls.some((item) => item.checkbox?.checked);
    if (artAccess) artAccess.checked = hasSelectedArtProgram;
    updateSessionPackageFields();
  });
});
document.querySelector("#menuButton").addEventListener("click", () =>
  document.querySelector(".sidebar").classList.toggle("open"));
document.querySelectorAll("[data-admin-view]").forEach((button) => {
  button.addEventListener("click", () =>
    showAdminView(button.dataset.adminView));
});
freeResourceForm?.addEventListener("submit", saveFreeResource);
document.querySelector("#resetFreeResourceForm")?.addEventListener("click", resetFreeResourceForm);
refreshFreeResourcesButton?.addEventListener("click", loadFreeResourcesAdmin);
refreshFreeLeadsButton?.addEventListener("click", loadFreeResourceLeadsAdmin);
exportFreeLeadsButton?.addEventListener("click", exportFreeResourceLeadsCsv);
refreshPartnerLeadsButton?.addEventListener("click", loadPartnerLeadsAdmin);
exportPartnerLeadsButton?.addEventListener("click", exportPartnerLeadsCsv);
freeLeadResourceFilter?.addEventListener("change", renderFreeResourceLeadsAdmin);
freeLeadCategoryFilter?.addEventListener("change", renderFreeResourceLeadsAdmin);
freeLeadStatusFilter?.addEventListener("change", renderFreeResourceLeadsAdmin);
freeLeadSearchInput?.addEventListener("input", renderFreeResourceLeadsAdmin);
partnerLeadCourseFilter?.addEventListener("change", renderPartnerLeadsAdmin);
partnerLeadStatusFilter?.addEventListener("change", renderPartnerLeadsAdmin);
partnerLeadSearchInput?.addEventListener("input", renderPartnerLeadsAdmin);
freeLeadRows?.addEventListener("click", (event) => {
  const saveButton = event.target.closest("[data-save-free-lead]");
  if (saveButton) saveFreeResourceLeadFollowup(saveButton.dataset.saveFreeLead);
});
partnerLeadRows?.addEventListener("click", (event) => {
  const saveButton = event.target.closest("[data-save-partner-lead]");
  if (saveButton) savePartnerLeadFollowup(saveButton.dataset.savePartnerLead);
});
bindFreeResourceFilePreview("#freeResourceThumbnail", "#currentFreeThumbnail", "ยังไม่มีภาพหน้าปก");
bindFreeResourceFilePreview("#freeResourceWorksheet", "#currentFreeWorksheet", "ยังไม่มีไฟล์ใบงาน");
bindFreeResourceFilePreview("#freeResourcePowerpoint", "#currentFreePowerpoint", "ยังไม่มีไฟล์ PowerPoint");
bindFreeResourceThumbnailPreview();
freeResourceAdminList?.addEventListener("click", (event) => {
  const editButton = event.target.closest("[data-free-edit]");
  const toggleButton = event.target.closest("[data-free-toggle]");
  const deleteButton = event.target.closest("[data-free-delete]");

  if (editButton) {
    const resource = freeResources.find((item) => item.id === editButton.dataset.freeEdit);
    if (resource) fillFreeResourceForm(resource);
    return;
  }
  if (toggleButton) {
    toggleFreeResource(toggleButton.dataset.freeToggle);
    return;
  }
  if (deleteButton) deleteFreeResource(deleteButton.dataset.freeDelete);
});
lessonAdminList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-lesson-id]");
  if (button) selectRobotLesson(button.dataset.lessonId);
});
document.querySelector("#refreshLessonsButton").addEventListener(
  "click",
  loadRobotLessons
);

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (recordSessionModal?.classList.contains("open")) {
    closeRecordSession();
    return;
  }
  if (reviewModal.classList.contains("open")) {
    closeReview();
  }
});

async function boot() {
  if (!configured) {
    configWarning.hidden = false;
    return;
  }
  const { data } = await supabaseClient.auth.getSession();
  if (!data.session?.user) return;

  try {
    await showDashboard(data.session.user);
  } catch (error) {
    showToast(error.message, true);
  }
}

boot();
