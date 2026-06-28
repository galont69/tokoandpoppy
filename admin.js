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
const learningTeacherSummary = document.querySelector("#learningTeacherSummary");
const learningFollowupQueue = document.querySelector("#learningFollowupQueue");
const learningScopeText = document.querySelector("#learningScopeText");
const refreshLearningButton = document.querySelector("#refreshLearningButton");
const studentBadge = document.querySelector("#studentBadge");
const studentManagementRows = document.querySelector("#studentManagementRows");
const studentManagementLoadingState = document.querySelector("#studentManagementLoadingState");
const studentManagementEmptyState = document.querySelector("#studentManagementEmptyState");
const studentManagementSummary = document.querySelector("#studentManagementSummary");
const studentManagementScopeText = document.querySelector("#studentManagementScopeText");
const studentSearchInput = document.querySelector("#studentSearchInput");
const studentCourseFilter = document.querySelector("#studentCourseFilter");
const studentStatusFilter = document.querySelector("#studentStatusFilter");
const refreshStudentsButton = document.querySelector("#refreshStudentsButton");
const addStaffStudentButton = document.querySelector("#addStaffStudentButton");
const staffStudentModal = document.querySelector("#staffStudentModal");
const staffStudentForm = document.querySelector("#staffStudentForm");
const staffStudentTitle = document.querySelector("#staffStudentTitle");
const staffStudentBranch = document.querySelector("#staffStudentBranch");
const staffStudentName = document.querySelector("#staffStudentName");
const staffStudentNickname = document.querySelector("#staffStudentNickname");
const staffStudentBirthDate = document.querySelector("#staffStudentBirthDate");
const staffStudentAge = document.querySelector("#staffStudentAge");
const staffStudentCourseList = document.querySelector("#staffStudentCourseList");
const addStaffStudentCourseButton = document.querySelector("#addStaffStudentCourseButton");
const staffStudentParentName = document.querySelector("#staffStudentParentName");
const staffStudentParentPhone = document.querySelector("#staffStudentParentPhone");
const staffStudentNote = document.querySelector("#staffStudentNote");
const saveStaffStudentButton = document.querySelector("#saveStaffStudentButton");
const staffStudentReadinessText = document.querySelector("#staffStudentReadinessText");
const classReminderBadge = document.querySelector("#classReminderBadge");
const classReminderHeroText = document.querySelector("#classReminderHeroText");
const classReminderScopeText = document.querySelector("#classReminderScopeText");
const classReminderSummary = document.querySelector("#classReminderSummary");
const classReminderRows = document.querySelector("#classReminderRows");
const classReminderLoadingState = document.querySelector("#classReminderLoadingState");
const classReminderEmptyState = document.querySelector("#classReminderEmptyState");
const refreshClassRemindersButton = document.querySelector("#refreshClassRemindersButton");
const refreshRevenueButton = document.querySelector("#refreshRevenueButton");
const exportRevenueButton = document.querySelector("#exportRevenueButton");
const revenueDateFrom = document.querySelector("#revenueDateFrom");
const revenueDateTo = document.querySelector("#revenueDateTo");
const revenueBranchFilter = document.querySelector("#revenueBranchFilter");
const revenueCourseFilter = document.querySelector("#revenueCourseFilter");
const revenueStatusFilter = document.querySelector("#revenueStatusFilter");
const revenueScopeText = document.querySelector("#revenueScopeText");
const revenueSummary = document.querySelector("#revenueSummary");
const revenueRows = document.querySelector("#revenueRows");
const revenueEmptyState = document.querySelector("#revenueEmptyState");
const revenueLoadingState = document.querySelector("#revenueLoadingState");
const classReminderModal = document.querySelector("#classReminderModal");
const classReminderTitle = document.querySelector("#classReminderTitle");
const classReminderSummaryText = document.querySelector("#classReminderSummaryText");
const classReminderCanvas = document.querySelector("#classReminderCanvas");
const classReminderMessage = document.querySelector("#classReminderMessage");
const copyClassReminderMessageButton = document.querySelector("#copyClassReminderMessageButton");
const downloadClassReminderCardButton = document.querySelector("#downloadClassReminderCardButton");
const markClassReminderSentButton = document.querySelector("#markClassReminderSentButton");
const courseScheduleModal = document.querySelector("#courseScheduleModal");
const courseScheduleForm = document.querySelector("#courseScheduleForm");
const courseScheduleTitle = document.querySelector("#courseScheduleTitle");
const courseScheduleSummary = document.querySelector("#courseScheduleSummary");
const courseScheduleWeekday = document.querySelector("#courseScheduleWeekday");
const courseScheduleStartTime = document.querySelector("#courseScheduleStartTime");
const courseScheduleEndTime = document.querySelector("#courseScheduleEndTime");
const courseScheduleReminderEnabled = document.querySelector("#courseScheduleReminderEnabled");
const courseScheduleNote = document.querySelector("#courseScheduleNote");
const saveCourseScheduleButton = document.querySelector("#saveCourseScheduleButton");
const clearCourseScheduleButton = document.querySelector("#clearCourseScheduleButton");
const recordSessionModal = document.querySelector("#recordSessionModal");
const recordSessionForm = document.querySelector("#recordSessionForm");
const recordSessionTitle = document.querySelector("#recordSessionTitle");
const recordSessionSummary = document.querySelector("#recordSessionSummary");
const recordSessionNumber = document.querySelector("#recordSessionNumber");
const recordSessionDate = document.querySelector("#recordSessionDate");
const recordLessonTitle = document.querySelector("#recordLessonTitle");
const recordTeacherComment = document.querySelector("#recordTeacherComment");
const teacherCommentTemplates = document.querySelector("#teacherCommentTemplates");
const recordSessionPhoto = document.querySelector("#recordSessionPhoto");
const recordSessionPhotoPreview = document.querySelector("#recordSessionPhotoPreview");
const learningSessionTimeline = document.querySelector("#learningSessionTimeline");
const refreshSessionHistory = document.querySelector("#refreshSessionHistory");
const saveSessionButton = document.querySelector("#saveSessionButton");
const sessionSharePanel = document.querySelector("#sessionSharePanel");
const sessionShareCanvas = document.querySelector("#sessionShareCanvas");
const sessionShareText = document.querySelector("#sessionShareText");
const copySessionShareTextButton = document.querySelector("#copySessionShareTextButton");
const downloadSessionShareCardButton = document.querySelector("#downloadSessionShareCardButton");
const confirmSaveSessionButton = document.querySelector("#confirmSaveSessionButton");
const sessionShareStepLabel = document.querySelector("#sessionShareStepLabel");
const sessionShareHeadingText = document.querySelector("#sessionShareHeadingText");
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
let studentManagementEnrollments = [];
let classReminderEnrollments = [];
let branchRevenueEvents = [];
let classReminderSentKeys = new Set();
let activeClassReminder = null;
let activeLearningEnrollment = null;
let activeScheduleEnrollment = null;
let activeStaffStudentApplicationId = null;
let lastSessionShareData = null;
let pendingSessionShareData = null;
let pendingSessionObjectUrl = "";
let sessionShareIsSaved = false;
const learningStudentTimelineGroups = new Map();
const learningStudentTimelineCache = new Map();
let freeResources = [];
let freeResourceLeads = [];
let partnerLeads = [];

const summaryCardAssets = {
  logo: "assets/card/01_logo_short.png",
  sun: "assets/card/deco_sun_rays_yellow.png",
  location: "assets/card/icon_location.png",
  star: "assets/card/doodle_sparkle_yellow.png",
  teacherHeart: "assets/card/icon_teacher_note_heart.png",
  heart: "assets/card/icon_heart.png",
  trophy: "assets/card/icon_trophy.png",
  book: "assets/card/icon_book.png",
  calendar: "assets/card/icon_calendar.png",
  course: {
    robot: "assets/card/icon_robot.png",
    art: "assets/card/3.png",
    creative_art: "assets/card/3.png",
    water_color: "assets/card/icon_watercolor_set.png",
    clay: "assets/card/icon_clay.png"
  }
};
const summaryCardImageCache = new Map();

const courseLabels = {
  robot: ["โรบอท + โค้ดดิ้ง", "SPIKE Essential"],
  art: ["คอร์สศิลปะ", "Creative Art"],
  creative_art: ["Creative Art", "ศิลปะสร้างสรรค์"],
  water_color: ["Water Color", "สีน้ำ"],
  clay: ["ปั้นดินเบา (CLAY)", "Clay Art"],
  both: ["ทั้งสองคอร์ส", "Robot + Creative Art"],
  pending: ["ยังไม่ระบุคอร์ส", "กรอกภายหลัง"]
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

const weekdayLabels = {
  0: "วันอาทิตย์",
  1: "วันจันทร์",
  2: "วันอังคาร",
  3: "วันพุธ",
  4: "วันพฤหัสบดี",
  5: "วันศุกร์",
  6: "วันเสาร์"
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

function formatDateOnly(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "medium"
  }).format(new Date(value));
}

function formatDateInputFromDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getTomorrowDate() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(12, 0, 0, 0);
  return date;
}

function getClassReminderDateInfo() {
  const date = getTomorrowDate();
  return {
    date,
    dateInput: formatDateInputFromDate(date),
    weekday: date.getDay(),
    dateLabel: formatDateOnly(date)
  };
}

function formatRelativeDate(value) {
  if (!value) return "ยังไม่มีการบันทึก";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "ยังไม่มีการบันทึก";
  const diffDays = Math.max(0, Math.floor((Date.now() - date.getTime()) / 86400000));
  if (diffDays === 0) return "วันนี้";
  if (diffDays === 1) return "เมื่อวาน";
  if (diffDays < 7) return `${diffDays} วันที่แล้ว`;
  return formatDateOnly(value);
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

function getLearningPhotoUrl(photoPath) {
  if (!photoPath) return "";
  const { data } = supabaseClient.storage
    .from("learning-session-photos")
    .getPublicUrl(photoPath);
  return data?.publicUrl || "";
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
  document.querySelectorAll("[data-branch-revenue-admin]").forEach((element) => {
    element.hidden = branchTeacher;
  });
  document.querySelector('[data-admin-view="applications"]').hidden = branchTeacher;
  document.querySelector('[data-admin-view="students"]').hidden = false;
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
  if (studentBadge) studentBadge.textContent = count("approved");
}

function showAdminView(viewName) {
  const roleAllowedViews = isBranchTeacher()
    ? ["students", "progress", "classReminders"]
    : isBranchAdmin()
      ? ["applications", "students", "classReminders", "branchRevenue", "progress", "branchStaff"]
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
    students: ["นักเรียน", "STUDENT CENTER"],
    classReminders: ["แจ้งเตือนก่อนวันเรียน", "CLASS REMINDERS"],
    branchRevenue: ["รายรับสาขา", "BRANCH REVENUE"],
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
  if (viewName === "students") loadStudentManagement();
  if (viewName === "classReminders") loadClassReminders();
  if (viewName === "branchRevenue") loadBranchRevenue();
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
  if (courseType === "pending") return "📝";
  return "🎨";
}

function normalizeTimeLabel(value) {
  if (!value) return "";
  return String(value).slice(0, 5);
}

function getCourseScheduleLabel(enrollment = {}) {
  const weekday = enrollment.class_weekday;
  const hasWeekday = weekday !== null && weekday !== undefined && weekday !== "";
  const dayLabel = hasWeekday ? weekdayLabels[Number(weekday)] : "";
  const startTime = normalizeTimeLabel(enrollment.class_start_time);
  const endTime = normalizeTimeLabel(enrollment.class_end_time);
  if (!dayLabel && !startTime) return "ยังไม่ได้ตั้งตารางเรียน";
  const timeLabel = [startTime, endTime].filter(Boolean).join("-");
  return [dayLabel, timeLabel].filter(Boolean).join(" · ");
}

function getCourseScheduleClass(enrollment = {}) {
  const hasSchedule = enrollment.class_weekday !== null &&
    enrollment.class_weekday !== undefined &&
    enrollment.class_weekday !== "" &&
    Boolean(enrollment.class_start_time);
  if (!hasSchedule) return "is-empty";
  return enrollment.class_reminder_enabled === false ? "is-muted" : "is-ready";
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
      badgeClass: "completed",
      remaining,
      urgency: "completed"
    };
  }

  if (completed <= 0) {
    return {
      key: "not_started",
      label: "ยังไม่เคยบันทึก",
      helper: "เหมาะสำหรับเริ่มบันทึกครั้งแรก",
      badgeClass: "active",
      remaining,
      urgency: "new"
    };
  }

  if (total > 0 && remaining <= 3) {
    const isCritical = remaining <= 1;
    return {
      key: "almost_done",
      label: isCritical ? "เหลือ 1 ครั้ง" : "ใกล้หมดแพ็กเกจ",
      helper: `เหลือ ${remaining} ครั้ง เหมาะสำหรับติดตามต่อคอร์ส`,
      badgeClass: isCritical ? "critical" : "almost",
      remaining,
      urgency: isCritical ? "critical" : "almost"
    };
  }

  return {
    key: "active",
    label: "กำลังเรียน",
    helper: "ยังอยู่ในแพ็กเกจปัจจุบัน",
    badgeClass: "active",
    remaining,
    urgency: "active"
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

function getLearningStudentKey(enrollment) {
  if (enrollment.application_id) return `application:${enrollment.application_id}`;
  if (enrollment.student_id) return `student:${enrollment.student_id}`;
  return [
    enrollment.branch_id || "no-branch",
    enrollment.student_name || "",
    enrollment.student_nickname || "",
    enrollment.parent_name || "",
    enrollment.parent_email || "",
    enrollment.parent_phone || ""
  ].join("|").toLowerCase();
}

function getLearningStudentGroups(rows) {
  const groups = new Map();
  rows.forEach((enrollment) => {
    const key = getLearningStudentKey(enrollment);
    if (!groups.has(key)) {
      groups.set(key, {
        key,
        studentName: enrollment.student_name || "ไม่ระบุชื่อนักเรียน",
        nickname: enrollment.student_nickname || "",
        parentName: enrollment.parent_name || "",
        parentEmail: enrollment.parent_email || "",
        parentPhone: enrollment.parent_phone || "",
        branchName: enrollment.branch_name || "",
        latestUpdatedAt: enrollment.updated_at || enrollment.created_at || "",
        enrollments: []
      });
    }

    const group = groups.get(key);
    group.enrollments.push(enrollment);
    const updatedAt = enrollment.updated_at || enrollment.created_at || "";
    if (updatedAt > group.latestUpdatedAt) group.latestUpdatedAt = updatedAt;
    if (!group.parentName && enrollment.parent_name) group.parentName = enrollment.parent_name;
    if (!group.parentEmail && enrollment.parent_email) group.parentEmail = enrollment.parent_email;
    if (!group.parentPhone && enrollment.parent_phone) group.parentPhone = enrollment.parent_phone;
    if (!group.branchName && enrollment.branch_name) group.branchName = enrollment.branch_name;
  });

  return [...groups.values()].sort((a, b) =>
    String(b.latestUpdatedAt).localeCompare(String(a.latestUpdatedAt)));
}

function getStudentApplication(enrollment) {
  return enrollment?.enrollment_applications || enrollment?.application || {};
}

function getStudentManagementRows() {
  const keyword = (studentSearchInput?.value || "").trim().toLowerCase();
  const course = studentCourseFilter?.value || "all";
  const status = studentStatusFilter?.value || "active";
  return studentManagementEnrollments.filter((enrollment) => {
    const app = getStudentApplication(enrollment);
    const haystack = [
      enrollment.student_name,
      enrollment.student_nickname,
      app.student_name,
      app.student_nickname,
      app.parent_name,
      app.parent_phone,
      app.parent_email,
      app.line_display_name,
      enrollment.course_type,
      enrollment.level_label,
      enrollment.program_label
    ].filter(Boolean).join(" ").toLowerCase();
    const matchesKeyword = !keyword || haystack.includes(keyword);
    const matchesCourse = course === "all" ||
      enrollment.course_type === course ||
      (course === "art_family" && isArtCourseType(enrollment.course_type));
    const state = getLearningEnrollmentState(enrollment);
    const matchesStatus = status === "all" ||
      state.key === status ||
      (status === "active" && state.key !== "completed");
    return matchesKeyword && matchesCourse && matchesStatus;
  });
}

function getStudentManagementGroups(rows) {
  const groups = new Map();
  rows.forEach((enrollment) => {
    const app = getStudentApplication(enrollment);
    const key = enrollment.application_id || getLearningStudentKey(enrollment);
    if (!groups.has(key)) {
      groups.set(key, {
        key,
        applicationId: enrollment.application_id,
        studentName: app.student_name || enrollment.student_name || "ไม่ระบุชื่อนักเรียน",
        nickname: app.student_nickname || enrollment.student_nickname || "",
        parentName: app.parent_name || "",
        parentEmail: app.parent_email || "",
        parentPhone: app.parent_phone || "",
        birthDate: app.birth_date || "",
        ageYears: app.age_years || "",
        legacyNote: app.legacy_note || app.student_notes || "",
        lineDisplayName: app.line_display_name || "",
        lineUserId: app.line_user_id || enrollment.line_user_id || "",
        registrationSource: app.registration_source || "",
        branchId: app.branch_id || enrollment.branch_id || "",
        branchName: app.branches?.name || enrollment.branches?.name || "",
        status: app.status || "approved",
        createdAt: app.created_at || enrollment.created_at || "",
        latestUpdatedAt: enrollment.updated_at || enrollment.created_at || "",
        enrollments: []
      });
    }

    const group = groups.get(key);
    group.enrollments.push(enrollment);
    const updatedAt = enrollment.updated_at || enrollment.created_at || "";
    if (updatedAt > group.latestUpdatedAt) group.latestUpdatedAt = updatedAt;
    if (!group.applicationId && enrollment.application_id) group.applicationId = enrollment.application_id;
    if (!group.branchId && enrollment.branch_id) group.branchId = enrollment.branch_id;
    if (!group.branchName && enrollment.branches?.name) group.branchName = enrollment.branches.name;
  });

  return [...groups.values()].sort((a, b) =>
    String(b.latestUpdatedAt).localeCompare(String(a.latestUpdatedAt)));
}

function renderStudentManagementSummary(groups) {
  if (!studentManagementSummary) return;
  const totals = studentManagementEnrollments.reduce((summary, enrollment) => {
    const state = getLearningEnrollmentState(enrollment);
    if (state.key !== "completed") summary.active += 1;
    if (state.key === "not_started") summary.notStarted += 1;
    if (state.key === "completed") summary.completed += 1;
    summary.remaining += Math.max(Number(enrollment.total_sessions || 0) - Number(enrollment.completed_sessions || 0), 0);
    return summary;
  }, {
    active: 0,
    notStarted: 0,
    completed: 0,
    remaining: 0
  });
  const allGroups = getStudentManagementGroups(studentManagementEnrollments);
  studentManagementSummary.innerHTML = [
    ["นักเรียนทั้งหมด", allGroups.length],
    ["คอร์สกำลังเรียน", totals.active],
    ["ยังไม่เริ่มเรียน", totals.notStarted],
    ["จบคอร์สแล้ว", totals.completed],
    ["ครั้งคงเหลือรวม", totals.remaining]
  ].map(([label, count]) => `
    <article>
      <strong>${count}</strong>
      <span>${escapeHtml(label)}</span>
    </article>
  `).join("");
  if (studentBadge) studentBadge.textContent = allGroups.length;
}

function renderStudentManagement() {
  if (!studentManagementRows) return;
  const rows = getStudentManagementRows();
  const groups = getStudentManagementGroups(rows);
  renderStudentManagementSummary(groups);
  studentManagementEmptyState.hidden = groups.length > 0;

  studentManagementRows.innerHTML = groups.map((group) => {
    const completedTotal = group.enrollments.reduce((sum, enrollment) =>
      sum + Number(enrollment.completed_sessions || 0), 0);
    const sessionTotal = group.enrollments.reduce((sum, enrollment) =>
      sum + Number(enrollment.total_sessions || 0), 0);
    const remainingTotal = Math.max(sessionTotal - completedTotal, 0);
    const courses = group.enrollments.map((enrollment) => {
      const completed = Number(enrollment.completed_sessions || 0);
      const total = Number(enrollment.total_sessions || 0);
      const percent = total ? Math.min(100, Math.round((completed / total) * 100)) : 0;
      const state = getLearningEnrollmentState(enrollment);
      const scheduleLabel = getCourseScheduleLabel(enrollment);
      const scheduleClass = getCourseScheduleClass(enrollment);
      return `
        <li>
          <span>${getCourseIcon(enrollment.course_type)} ${escapeHtml(getCourseEnrollmentLabel(enrollment))}</span>
          <strong>${completed}/${total} ครั้ง</strong>
          <em class="${escapeHtml(state.key)}">${escapeHtml(state.label)}</em>
          <button class="course-schedule-chip ${scheduleClass}" type="button" data-edit-course-schedule="${enrollment.id}">
            ${escapeHtml(scheduleLabel)}
          </button>
          <i><b style="width: ${percent}%"></b></i>
        </li>
      `;
    }).join("");
    const parentPhone = group.parentPhone === "00000000" ? "" : group.parentPhone;
    const parentEmail = String(group.parentEmail || "").endsWith("@staff-created.tokoandpoppy.local") ? "" : group.parentEmail;
    const contact = [
      parentPhone,
      parentEmail,
      group.lineDisplayName ? `LINE: ${group.lineDisplayName}` : ""
    ].filter(Boolean).join(" · ") || (
      group.registrationSource === "staff_created"
        ? "ยังไม่ได้ผูกบัญชีผู้ปกครอง"
        : "ยังไม่มีข้อมูลติดต่อ"
    );
    const sourceText = group.registrationSource === "staff_created"
      ? "เพิ่มโดยทีมงาน · รอผูกบัญชีผู้ปกครองได้ภายหลัง"
      : "ข้อมูลจากใบสมัครที่อนุมัติแล้ว";
    const canDelete = Boolean(group.applicationId) && !isBranchTeacher();
    return `
      <article class="student-management-card">
        <div class="student-management-main">
          <span class="student-management-avatar">🧒</span>
          <div>
            <strong>${escapeHtml(group.studentName)}</strong>
            <small>${escapeHtml([
              group.nickname ? `ชื่อเล่น ${group.nickname}` : "",
              group.parentName ? `ผู้ปกครอง ${group.parentName}` : "",
              group.branchName ? `สาขา ${group.branchName}` : ""
            ].filter(Boolean).join(" · ") || sourceText)}</small>
            <small>${escapeHtml(contact)}</small>
            ${group.registrationSource === "staff_created" ? `<small>${escapeHtml(sourceText)}</small>` : ""}
          </div>
        </div>
        <div class="student-management-metrics">
          <span><strong>${group.enrollments.length}</strong> คอร์ส</span>
          <span><strong>${completedTotal}/${sessionTotal}</strong> ครั้ง</span>
          <span><strong>${remainingTotal}</strong> คงเหลือ</span>
        </div>
        <ul class="student-management-courses">${courses}</ul>
        <div class="student-management-actions">
          ${group.enrollments[0] ? `
            <button class="review-button" type="button" data-student-record-enrollment="${group.enrollments[0].id}">
              เปิดสมุดพัฒนาการ
            </button>
          ` : ""}
          ${group.applicationId ? `
            <button class="review-button" type="button" data-edit-staff-student="${group.applicationId}">
              แก้ไข / เพิ่มคอร์ส
            </button>
          ` : ""}
          ${canDelete ? `
            <button class="delete-student-button" type="button" data-delete-student-application="${group.applicationId}" data-student-name="${escapeHtml(group.studentName)}">
              ลบนักเรียน
            </button>
          ` : ""}
        </div>
      </article>
    `;
  }).join("");
}

async function loadStudentManagement() {
  if (!studentManagementRows) return;
  studentManagementLoadingState.hidden = false;
  studentManagementEmptyState.hidden = true;
  studentManagementRows.innerHTML = "";
  if (studentManagementScopeText) {
    studentManagementScopeText.textContent = (isBranchAdmin() || isBranchTeacher())
      ? `นักเรียนที่อนุมัติแล้วใน${getCurrentBranchName()}`
      : "นักเรียนที่อนุมัติแล้วจากทุกสาขา";
  }

  let query = supabaseClient
    .from("course_enrollments")
    .select("*, enrollment_applications(id,status,student_name,student_nickname,parent_name,parent_phone,parent_email,birth_date,age_years,student_notes,legacy_note,line_display_name,line_user_id,registration_source,branch_id,created_at,branches(name,code)), branches(name,code)")
    .order("updated_at", { ascending: false });

  if ((isBranchAdmin() || isBranchTeacher()) && currentBranchAssignment?.branch_id) {
    query = query.eq("branch_id", currentBranchAssignment.branch_id);
  }

  const { data, error } = await query;
  studentManagementLoadingState.hidden = true;
  if (error) {
    showToast(`โหลดรายชื่อนักเรียนไม่สำเร็จ: ${error.message}`, true);
    studentManagementRows.innerHTML = "";
    studentManagementEmptyState.hidden = false;
    return;
  }

  studentManagementEnrollments = (data || []).filter((enrollment) => {
    const app = getStudentApplication(enrollment);
    return !app.status || app.status === "approved";
  });
  renderStudentManagement();
}

async function deleteStudentRecord(applicationId, studentName) {
  if (!applicationId || isBranchTeacher()) return;
  const confirmed = window.confirm(
    `ต้องการลบนักเรียน "${studentName || "รายการนี้"}" ใช่ไหม?\n\nระบบจะลบใบสมัครที่อนุมัติแล้ว คอร์สที่เปิดสิทธิ์ และประวัติครั้งเรียนของนักเรียนคนนี้ เพื่อให้สมัครใหม่ได้`
  );
  if (!confirmed) return;

  const button = studentManagementRows?.querySelector(`[data-delete-student-application="${CSS.escape(applicationId)}"]`);
  if (button) {
    button.disabled = true;
    button.textContent = "กำลังลบ...";
  }

  const { error } = await supabaseClient.rpc("delete_student_record", {
    p_application_id: applicationId
  });

  if (error) {
    showToast(`ลบนักเรียนไม่สำเร็จ: ${error.message}`, true);
    if (button) {
      button.disabled = false;
      button.textContent = "ลบนักเรียน";
    }
    return;
  }

  showToast("ลบนักเรียนและข้อมูลคอร์สเรียบร้อยแล้ว");
  await Promise.all([
    loadStudentManagement(),
    isBranchTeacher() ? Promise.resolve() : loadApplications()
  ]);
  learningEnrollments = learningEnrollments.filter((enrollment) => enrollment.application_id !== applicationId);
  renderLearningProgress();
}

async function loadStaffStudentBranches() {
  if (!staffStudentBranch) return;

  if ((isBranchAdmin() || isBranchTeacher()) && currentBranchAssignment?.branch_id) {
    staffStudentBranch.innerHTML = `
      <option value="${escapeHtml(currentBranchAssignment.branch_id)}">${escapeHtml(getCurrentBranchName())}</option>
    `;
    staffStudentBranch.value = currentBranchAssignment.branch_id;
    staffStudentBranch.disabled = true;
    return;
  }

  staffStudentBranch.disabled = false;
  if (!branches.length) {
    const { data, error } = await supabaseClient
      .from("branches")
      .select("id,name,code,is_active")
      .eq("is_active", true)
      .order("name", { ascending: true });
    if (error) {
      staffStudentBranch.innerHTML = '<option value="">โหลดสาขาไม่สำเร็จ</option>';
      showToast(`โหลดสาขาไม่สำเร็จ: ${error.message}`, true);
      return;
    }
    branches = data || [];
  }

  staffStudentBranch.innerHTML = [
    '<option value="">เลือกสาขา</option>',
    ...branches
      .filter((branch) => branch.is_active !== false)
      .map((branch) => `
        <option value="${escapeHtml(branch.id)}">${escapeHtml(branch.name)}${branch.code ? ` (${escapeHtml(branch.code)})` : ""}</option>
      `)
  ].join("");
}

async function openStaffStudentModal() {
  if (!staffStudentModal || !staffStudentForm) return;
  activeStaffStudentApplicationId = null;
  staffStudentForm.reset();
  if (staffStudentTitle) staffStudentTitle.textContent = "เพิ่มนักเรียนเก่าเข้าระบบ";
  if (saveStaffStudentButton) saveStaffStudentButton.textContent = "เพิ่มนักเรียน";
  renderStaffStudentCourseItems([getBlankStaffStudentCourse()]);
  if (staffStudentReadinessText) {
    staffStudentReadinessText.textContent = "รู้แค่ชื่อเล่นก็เพิ่มก่อนได้ แล้วกลับมากรอกส่วนที่เหลือภายหลัง";
  }
  await loadStaffStudentBranches();
  staffStudentModal.classList.add("open");
  staffStudentModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  staffStudentName?.focus();
}

async function openEditStaffStudentModal(applicationId) {
  if (!applicationId || !staffStudentModal || !staffStudentForm) return;
  const group = getStudentManagementGroups(studentManagementEnrollments)
    .find((item) => item.applicationId === applicationId);
  if (!group) {
    showToast("ไม่พบนักเรียนที่ต้องการแก้ไข กรุณารีเฟรชรายชื่ออีกครั้ง", true);
    return;
  }

  activeStaffStudentApplicationId = applicationId;
  staffStudentForm.reset();
  if (staffStudentTitle) staffStudentTitle.textContent = `แก้ไขข้อมูล: ${group.nickname || group.studentName}`;
  staffStudentName.value = group.studentName || "";
  staffStudentNickname.value = group.nickname || "";
  staffStudentBirthDate.value = group.birthDate || "";
  staffStudentAge.value = group.ageYears || "";
  staffStudentParentName.value = group.parentName || "";
  staffStudentParentPhone.value = group.parentPhone === "00000000" ? "" : group.parentPhone || "";
  staffStudentNote.value = group.legacyNote || "";
  if (saveStaffStudentButton) saveStaffStudentButton.textContent = "บันทึกข้อมูล";
  if (staffStudentReadinessText) {
    staffStudentReadinessText.textContent = "แก้ไขข้อมูลเด็กหรือกดเพิ่มคอร์สเพื่อเปิดคอร์สใหม่ให้เด็กคนนี้";
  }

  await loadStaffStudentBranches();
  if (staffStudentBranch && group.branchId) {
    staffStudentBranch.value = group.branchId;
  }

  renderStaffStudentCourseItems(group.enrollments.map((enrollment) => ({
    course_type: enrollment.course_type || "pending",
    total_sessions: Number(enrollment.total_sessions || "") || "",
    completed_sessions: Number(enrollment.completed_sessions || 0),
    level_label: enrollment.level_label || "",
    class_weekday: enrollment.class_weekday === null || enrollment.class_weekday === undefined ? "" : String(enrollment.class_weekday),
    class_start_time: normalizeTimeLabel(enrollment.class_start_time),
    class_end_time: normalizeTimeLabel(enrollment.class_end_time),
    class_reminder_enabled: enrollment.class_reminder_enabled !== false
  })));

  staffStudentModal.classList.add("open");
  staffStudentModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  staffStudentNickname?.focus();
}

function closeStaffStudentModal() {
  staffStudentModal?.classList.remove("open");
  staffStudentModal?.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  activeStaffStudentApplicationId = null;
}

function getBlankStaffStudentCourse() {
  return {
    course_type: "pending",
    total_sessions: "",
    completed_sessions: "",
    level_label: "",
    class_weekday: "",
    class_start_time: "",
    class_end_time: "",
    class_reminder_enabled: true
  };
}

function renderStaffStudentCourseItems(courses = [getBlankStaffStudentCourse()]) {
  if (!staffStudentCourseList) return;
  staffStudentCourseList.innerHTML = courses.map((course, index) => `
    <article class="staff-course-item" data-staff-course-item>
      <div class="staff-course-heading">
        <strong>คอร์สที่ ${index + 1}</strong>
        <button type="button" data-remove-staff-course>ลบคอร์ส</button>
      </div>
      <div class="staff-student-grid">
        <label>คอร์ส
          <select data-staff-course-type>
            <option value="pending" ${course.course_type === "pending" ? "selected" : ""}>ยังไม่ทราบ / กรอกภายหลัง</option>
            <option value="robot" ${course.course_type === "robot" ? "selected" : ""}>Robot + Coding</option>
            <option value="creative_art" ${course.course_type === "creative_art" ? "selected" : ""}>Creative Art</option>
            <option value="water_color" ${course.course_type === "water_color" ? "selected" : ""}>Water Color</option>
            <option value="clay" ${course.course_type === "clay" ? "selected" : ""}>ปั้นดินเบา (CLAY)</option>
            <option value="art" ${course.course_type === "art" ? "selected" : ""}>ศิลปะเดิม</option>
          </select>
        </label>
        <label>จำนวนครั้งทั้งหมด
          <input data-staff-total-sessions type="number" min="1" max="120" value="${escapeHtml(course.total_sessions ?? "")}" placeholder="ไม่ทราบ / กรอกภายหลัง">
        </label>
        <label>เรียนไปแล้ว
          <input data-staff-completed-sessions type="number" min="0" max="120" value="${escapeHtml(course.completed_sessions ?? "")}" placeholder="ไม่ทราบ / กรอกภายหลัง">
        </label>
        <label>Level / หมวด
          <input data-staff-level type="text" maxlength="80" value="${escapeHtml(course.level_label || "")}" placeholder="ไม่ทราบ / กรอกภายหลัง">
        </label>
        <label>วันเรียน
          <select data-staff-weekday>
            <option value="" ${course.class_weekday === "" ? "selected" : ""}>ยังไม่ทราบ / กรอกภายหลัง</option>
            <option value="1" ${String(course.class_weekday) === "1" ? "selected" : ""}>วันจันทร์</option>
            <option value="2" ${String(course.class_weekday) === "2" ? "selected" : ""}>วันอังคาร</option>
            <option value="3" ${String(course.class_weekday) === "3" ? "selected" : ""}>วันพุธ</option>
            <option value="4" ${String(course.class_weekday) === "4" ? "selected" : ""}>วันพฤหัสบดี</option>
            <option value="5" ${String(course.class_weekday) === "5" ? "selected" : ""}>วันศุกร์</option>
            <option value="6" ${String(course.class_weekday) === "6" ? "selected" : ""}>วันเสาร์</option>
            <option value="0" ${String(course.class_weekday) === "0" ? "selected" : ""}>วันอาทิตย์</option>
          </select>
        </label>
        <label>เวลาเริ่ม
          <input data-staff-start-time type="time" value="${escapeHtml(course.class_start_time || "")}">
        </label>
        <label>เวลาเลิก
          <input data-staff-end-time type="time" value="${escapeHtml(course.class_end_time || "")}">
        </label>
        <label class="schedule-toggle staff-student-toggle">
          <input data-staff-reminder-enabled type="checkbox" ${course.class_reminder_enabled === false ? "" : "checked"}>
          <span>เปิดใช้แจ้งเตือนก่อนเรียน</span>
        </label>
      </div>
    </article>
  `).join("");
}

function getStaffStudentCourseItems() {
  return [...(staffStudentCourseList?.querySelectorAll("[data-staff-course-item]") || [])];
}

function readStaffStudentCourseItems() {
  return getStaffStudentCourseItems().map((item, index) => {
    const totalValue = item.querySelector("[data-staff-total-sessions]")?.value || "";
    const completedValue = item.querySelector("[data-staff-completed-sessions]")?.value || "";
    const weekday = item.querySelector("[data-staff-weekday]")?.value || "";
    const startTime = item.querySelector("[data-staff-start-time]")?.value || "";
    const endTime = item.querySelector("[data-staff-end-time]")?.value || "";
    const totalSessions = totalValue ? Number.parseInt(totalValue, 10) : null;
    const completedSessions = completedValue ? Number.parseInt(completedValue, 10) : null;

    if (totalValue && (!Number.isInteger(totalSessions) || totalSessions < 1 || totalSessions > 120)) {
      item.querySelector("[data-staff-total-sessions]")?.focus();
      throw new Error(`กรุณาระบุจำนวนครั้งทั้งหมดของคอร์สที่ ${index + 1} เป็น 1-120 หรือเว้นว่างไว้`);
    }
    if (completedValue && (!Number.isInteger(completedSessions) || completedSessions < 0 || completedSessions > (totalSessions || 120))) {
      item.querySelector("[data-staff-completed-sessions]")?.focus();
      throw new Error(`จำนวนครั้งที่เรียนไปแล้วของคอร์สที่ ${index + 1} ไม่ถูกต้อง`);
    }
    if ((weekday || startTime || endTime) && (weekday === "" || !startTime)) {
      (weekday === "" ? item.querySelector("[data-staff-weekday]") : item.querySelector("[data-staff-start-time]"))?.focus();
      throw new Error(`ถ้าตั้งตารางเรียนคอร์สที่ ${index + 1} กรุณาเลือกวันเรียนและเวลาเริ่ม`);
    }
    if (endTime && endTime <= startTime) {
      item.querySelector("[data-staff-end-time]")?.focus();
      throw new Error(`เวลาเลิกเรียนของคอร์สที่ ${index + 1} ต้องมากกว่าเวลาเริ่มเรียน`);
    }

    return {
      course_type: item.querySelector("[data-staff-course-type]")?.value || "pending",
      total_sessions: totalSessions,
      completed_sessions: completedSessions,
      level_label: item.querySelector("[data-staff-level]")?.value.trim() || null,
      class_weekday: weekday === "" ? null : Number(weekday),
      class_start_time: startTime || null,
      class_end_time: endTime || null,
      class_reminder_enabled: Boolean(item.querySelector("[data-staff-reminder-enabled]")?.checked)
    };
  });
}

function addStaffStudentCourse() {
  const courses = readStaffStudentCourseItems();
  courses.push(getBlankStaffStudentCourse());
  renderStaffStudentCourseItems(courses);
}

function getStaffStudentPayload() {
  const branchId = staffStudentBranch?.value || "";
  const studentName = staffStudentName?.value.trim() || "";
  const nickname = staffStudentNickname?.value.trim() || "";
  const displayStudentName = studentName || (nickname ? `น้อง${nickname.replace(/^น้อง/, "")}` : "");
  const courses = readStaffStudentCourseItems();

  if (!displayStudentName || displayStudentName.length < 2) {
    staffStudentNickname?.focus();
    throw new Error("กรุณาระบุชื่อเล่นอย่างน้อย 2 ตัวอักษร หรือกรอกชื่อ-นามสกุล");
  }
  if (!branchId) {
    staffStudentBranch?.focus();
    throw new Error("กรุณาเลือกสาขา");
  }

  return {
    p_application_id: activeStaffStudentApplicationId || null,
    p_student_name: displayStudentName,
    p_student_nickname: nickname || null,
    p_birth_date: staffStudentBirthDate?.value || null,
    p_age_years: staffStudentAge?.value ? Number.parseInt(staffStudentAge.value, 10) : null,
    p_branch_id: branchId,
    p_course_type: courses[0]?.course_type || "pending",
    p_total_sessions: courses[0]?.total_sessions || null,
    p_completed_sessions: courses[0]?.completed_sessions || null,
    p_level_label: courses[0]?.level_label || null,
    p_class_weekday: courses[0]?.class_weekday ?? null,
    p_class_start_time: courses[0]?.class_start_time || null,
    p_class_end_time: courses[0]?.class_end_time || null,
    p_class_reminder_enabled: Boolean(courses[0]?.class_reminder_enabled),
    p_courses: courses,
    p_parent_name: staffStudentParentName?.value.trim() || null,
    p_parent_phone: staffStudentParentPhone?.value.trim() || null,
    p_staff_note: staffStudentNote?.value.trim() || null
  };
}

async function saveStaffStudent(event) {
  event.preventDefault();
  let payload;
  try {
    payload = getStaffStudentPayload();
  } catch (error) {
    showToast(error.message, true);
    return;
  }

  const isEditing = Boolean(activeStaffStudentApplicationId);
  saveStaffStudentButton.disabled = true;
  saveStaffStudentButton.textContent = isEditing ? "กำลังบันทึก..." : "กำลังเพิ่ม...";
  if (staffStudentReadinessText) {
    staffStudentReadinessText.textContent = isEditing ? "กำลังบันทึกข้อมูลนักเรียน..." : "กำลังสร้างนักเรียนและคอร์ส...";
  }
  const rpcName = isEditing ? "update_staff_student_record" : "create_staff_student_record";
  const rpcPayload = isEditing ? payload : Object.fromEntries(
    Object.entries(payload).filter(([key]) => key !== "p_application_id")
  );
  const { error } = await supabaseClient.rpc(rpcName, rpcPayload);
  saveStaffStudentButton.disabled = false;
  saveStaffStudentButton.textContent = isEditing ? "บันทึกข้อมูล" : "เพิ่มนักเรียน";

  if (error) {
    if (staffStudentReadinessText) staffStudentReadinessText.textContent = "เพิ่มไม่สำเร็จ กรุณาตรวจข้อมูลอีกครั้ง";
    showToast(`เพิ่มนักเรียนไม่สำเร็จ: ${error.message}`, true);
    return;
  }

  showToast(isEditing ? "บันทึกข้อมูลนักเรียนเรียบร้อยแล้ว" : "เพิ่มนักเรียนเข้าระบบเรียบร้อยแล้ว");
  closeStaffStudentModal();
  await Promise.all([
    loadStudentManagement(),
    loadLearningProgress()
  ]);
}

function findCourseEnrollment(enrollmentId) {
  return learningEnrollments.find((enrollment) => enrollment.id === enrollmentId) ||
    studentManagementEnrollments.find((enrollment) => enrollment.id === enrollmentId) ||
    null;
}

function updateCourseEnrollmentInMemory(updatedEnrollment) {
  if (!updatedEnrollment?.id) return;
  const applyUpdate = (list) => {
    const index = list.findIndex((enrollment) => enrollment.id === updatedEnrollment.id);
    if (index >= 0) {
      list[index] = {
        ...list[index],
        ...updatedEnrollment,
        enrollment_applications: list[index].enrollment_applications,
        branches: list[index].branches
      };
    }
  };
  applyUpdate(learningEnrollments);
  applyUpdate(studentManagementEnrollments);
}

function openCourseSchedule(enrollmentId) {
  const enrollment = findCourseEnrollment(enrollmentId);
  if (!enrollment || !courseScheduleModal) return;
  activeScheduleEnrollment = enrollment;
  courseScheduleTitle.textContent =
    `ตารางเรียน: ${getLearningStudentDisplayName(enrollment)}`;
  const branchLabel = enrollment.branch_name ||
    enrollment.branches?.name ||
    getStudentApplication(enrollment).branches?.name ||
    getCurrentBranchName();
  courseScheduleSummary.textContent =
    `${getCourseEnrollmentLabel(enrollment)} · ${branchLabel} · ใช้สำหรับเตรียมแจ้งเตือนผู้ปกครองก่อนวันเรียน`;
  courseScheduleWeekday.value = enrollment.class_weekday === null ||
    enrollment.class_weekday === undefined
      ? ""
      : String(enrollment.class_weekday);
  courseScheduleStartTime.value = normalizeTimeLabel(enrollment.class_start_time);
  courseScheduleEndTime.value = normalizeTimeLabel(enrollment.class_end_time);
  courseScheduleReminderEnabled.checked = enrollment.class_reminder_enabled !== false;
  courseScheduleNote.value = enrollment.class_schedule_note || "";
  courseScheduleModal.classList.add("open");
  courseScheduleModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeCourseSchedule() {
  courseScheduleModal?.classList.remove("open");
  courseScheduleModal?.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  activeScheduleEnrollment = null;
}

function getCourseSchedulePayload({ clear = false } = {}) {
  if (clear) {
    return {
      p_course_enrollment_id: activeScheduleEnrollment?.id,
      p_class_weekday: null,
      p_class_start_time: null,
      p_class_end_time: null,
      p_class_schedule_note: null,
      p_class_reminder_enabled: false
    };
  }

  const weekday = courseScheduleWeekday.value;
  const startTime = courseScheduleStartTime.value;
  const endTime = courseScheduleEndTime.value;
  if (weekday === "") {
    courseScheduleWeekday.focus();
    throw new Error("กรุณาเลือกวันเรียน");
  }
  if (!startTime) {
    courseScheduleStartTime.focus();
    throw new Error("กรุณาระบุเวลาเริ่มเรียน");
  }
  if (endTime && endTime <= startTime) {
    courseScheduleEndTime.focus();
    throw new Error("เวลาเลิกเรียนต้องมากกว่าเวลาเริ่มเรียน");
  }

  return {
    p_course_enrollment_id: activeScheduleEnrollment?.id,
    p_class_weekday: Number(weekday),
    p_class_start_time: startTime,
    p_class_end_time: endTime || null,
    p_class_schedule_note: courseScheduleNote.value.trim() || null,
    p_class_reminder_enabled: Boolean(courseScheduleReminderEnabled.checked)
  };
}

async function saveCourseSchedule(event) {
  event.preventDefault();
  if (!activeScheduleEnrollment) return;
  let payload;
  try {
    payload = getCourseSchedulePayload();
  } catch (error) {
    showToast(error.message, true);
    return;
  }

  saveCourseScheduleButton.disabled = true;
  saveCourseScheduleButton.textContent = "กำลังบันทึก...";
  const { data, error } = await supabaseClient.rpc("update_course_schedule", payload);
  saveCourseScheduleButton.disabled = false;
  saveCourseScheduleButton.textContent = "บันทึกตารางเรียน";

  if (error) {
    showToast(`บันทึกตารางเรียนไม่สำเร็จ: ${error.message}`, true);
    return;
  }

  updateCourseEnrollmentInMemory(data);
  renderStudentManagement();
  renderLearningProgress();
  showToast("บันทึกตารางเรียนเรียบร้อยแล้ว");
  closeCourseSchedule();
}

async function clearCourseSchedule() {
  if (!activeScheduleEnrollment) return;
  const confirmed = window.confirm("ล้างตารางเรียนของคอร์สนี้ใช่ไหม?");
  if (!confirmed) return;

  clearCourseScheduleButton.disabled = true;
  clearCourseScheduleButton.textContent = "กำลังล้าง...";
  const { data, error } = await supabaseClient.rpc("update_course_schedule", getCourseSchedulePayload({ clear: true }));
  clearCourseScheduleButton.disabled = false;
  clearCourseScheduleButton.textContent = "ล้างตารางเรียน";

  if (error) {
    showToast(`ล้างตารางเรียนไม่สำเร็จ: ${error.message}`, true);
    return;
  }

  updateCourseEnrollmentInMemory(data);
  renderStudentManagement();
  renderLearningProgress();
  showToast("ล้างตารางเรียนเรียบร้อยแล้ว");
  closeCourseSchedule();
}

function getReminderKey(enrollmentId, classDate) {
  return `${enrollmentId}|${classDate}`;
}

function getClassReminderContact(enrollment = {}) {
  const app = getStudentApplication(enrollment);
  return {
    parentName: app.parent_name || enrollment.parent_name || "ผู้ปกครอง",
    parentPhone: app.parent_phone || enrollment.parent_phone || "",
    parentEmail: app.parent_email || enrollment.parent_email || "",
    lineDisplayName: app.line_display_name || "",
    lineUserId: app.line_user_id || enrollment.line_user_id || ""
  };
}

function buildClassReminderMessage(enrollment, dateInfo = getClassReminderDateInfo()) {
  const studentName = getLearningStudentDisplayName(enrollment);
  const courseName = getCourseEnrollmentLabel(enrollment);
  const branchName = enrollment.branch_name ||
    enrollment.branches?.name ||
    getStudentApplication(enrollment).branches?.name ||
    getCurrentBranchName();
  const completed = Number(enrollment.completed_sessions || 0);
  const total = Number(enrollment.total_sessions || 0);
  const nextSession = total ? Math.min(completed + 1, total) : completed + 1;
  const sessionText = total ? `ครั้งที่ ${nextSession}/${total}` : `ครั้งที่ ${nextSession}`;
  const timeLabel = [
    normalizeTimeLabel(enrollment.class_start_time),
    normalizeTimeLabel(enrollment.class_end_time)
  ].filter(Boolean).join("-");
  return [
    `แจ้งเตือนคอร์สเรียนของน้อง${studentName.replace(/^น้อง/, "")}`,
    "",
    `พรุ่งนี้ (${dateInfo.dateLabel}) น้องมีเรียน ${courseName} ${sessionText}`,
    `เวลา ${timeLabel || "ตามเวลาที่แจ้งไว้"}${branchName ? ` ที่สาขา ${branchName}` : ""}`,
    "",
    "หากไม่สะดวกหรือต้องการเปลี่ยนวันและเวลา แจ้งได้เลยนะคะ",
    "",
    "Toko & Poppy"
  ].join("\n");
}

function getClassReminderRows() {
  return [...classReminderEnrollments].sort((a, b) => {
    const timeCompare = String(a.class_start_time || "").localeCompare(String(b.class_start_time || ""));
    if (timeCompare !== 0) return timeCompare;
    const branchCompare = String(a.branch_name || a.branches?.name || "").localeCompare(String(b.branch_name || b.branches?.name || ""));
    if (branchCompare !== 0) return branchCompare;
    return String(getLearningStudentDisplayName(a)).localeCompare(String(getLearningStudentDisplayName(b)));
  });
}

function renderClassReminderSummary() {
  if (!classReminderSummary) return;
  const dateInfo = getClassReminderDateInfo();
  const total = classReminderEnrollments.length;
  const sent = classReminderEnrollments.filter((enrollment) =>
    classReminderSentKeys.has(getReminderKey(enrollment.id, dateInfo.dateInput))).length;
  const pending = Math.max(total - sent, 0);
  const branchCount = new Set(classReminderEnrollments.map((enrollment) =>
    enrollment.branch_id || enrollment.branches?.name || "unknown")).size;
  classReminderSummary.innerHTML = [
    ["วันเรียน", `${weekdayLabels[dateInfo.weekday]} ${dateInfo.dateLabel}`],
    ["ต้องแจ้ง", `${pending} คน`],
    ["แจ้งแล้ว", `${sent} คน`],
    ["รวม", `${total} คอร์ส`],
    ["สาขา", `${branchCount} สาขา`]
  ].map(([label, value]) => `
    <article>
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
    </article>
  `).join("");
  if (classReminderBadge) classReminderBadge.textContent = pending;
}

function renderClassReminders() {
  if (!classReminderRows) return;
  const dateInfo = getClassReminderDateInfo();
  const rows = getClassReminderRows();
  renderClassReminderSummary();
  classReminderEmptyState.hidden = rows.length > 0;
  classReminderRows.innerHTML = rows.map((enrollment) => {
    const contact = getClassReminderContact(enrollment);
    const sent = classReminderSentKeys.has(getReminderKey(enrollment.id, dateInfo.dateInput));
    const branchName = enrollment.branch_name ||
      enrollment.branches?.name ||
      getStudentApplication(enrollment).branches?.name ||
      "ไม่ระบุสาขา";
    const timeLabel = [
      normalizeTimeLabel(enrollment.class_start_time),
      normalizeTimeLabel(enrollment.class_end_time)
    ].filter(Boolean).join("-");
    return `
      <article class="class-reminder-item ${sent ? "is-sent" : ""}">
        <div class="class-reminder-time">
          <strong>${escapeHtml(timeLabel || "-")}</strong>
          <span>${escapeHtml(weekdayLabels[dateInfo.weekday])}</span>
        </div>
        <div class="class-reminder-student">
          <span class="learning-course-icon">${getCourseIcon(enrollment.course_type)}</span>
          <div>
            <strong>${escapeHtml(getLearningStudentDisplayName(enrollment))}</strong>
            <small>${escapeHtml(getCourseEnrollmentLabel(enrollment))} · สาขา ${escapeHtml(branchName)}</small>
            <small>${escapeHtml([
              contact.parentName ? `ผู้ปกครอง ${contact.parentName}` : "",
              contact.parentPhone,
              contact.lineDisplayName ? `LINE: ${contact.lineDisplayName}` : ""
            ].filter(Boolean).join(" · ") || "ยังไม่มีข้อมูลติดต่อ")}</small>
          </div>
        </div>
        <div class="class-reminder-status">
          <span>${sent ? "แจ้งแล้ว" : "รอแจ้ง"}</span>
          <small>${escapeHtml(dateInfo.dateLabel)}</small>
        </div>
        <div class="class-reminder-row-actions">
          <button type="button" data-create-class-reminder="${enrollment.id}">สร้างการ์ด/ข้อความ</button>
          <button type="button" data-mark-class-reminder="${enrollment.id}" ${sent ? "disabled" : ""}>แจ้งแล้ว</button>
        </div>
      </article>
    `;
  }).join("");
}

async function loadClassReminders() {
  if (!classReminderRows) return;
  const dateInfo = getClassReminderDateInfo();
  classReminderLoadingState.hidden = false;
  classReminderEmptyState.hidden = true;
  classReminderRows.innerHTML = "";
  if (classReminderHeroText) {
    classReminderHeroText.textContent =
      `พรุ่งนี้ ${weekdayLabels[dateInfo.weekday]} ${dateInfo.dateLabel} มีคิวเรียนที่ต้องแจ้งผู้ปกครอง`;
  }
  if (classReminderScopeText) {
    classReminderScopeText.textContent = isMainAdmin()
      ? "แอดมินหลักเห็นทุกสาขา"
      : `มุมมอง${getCurrentBranchName()}`;
  }

  let query = supabaseClient
    .from("course_enrollments")
    .select("*, enrollment_applications(id,status,student_name,student_nickname,parent_name,parent_phone,parent_email,line_display_name,line_user_id,branches(name,code)), branches(name,code)")
    .eq("class_weekday", dateInfo.weekday)
    .eq("class_reminder_enabled", true)
    .not("class_start_time", "is", null)
    .neq("status", "completed")
    .order("class_start_time", { ascending: true });

  if ((isBranchAdmin() || isBranchTeacher()) && currentBranchAssignment?.branch_id) {
    query = query.eq("branch_id", currentBranchAssignment.branch_id);
  }

  const { data, error } = await query;
  if (error) {
    classReminderLoadingState.hidden = true;
    classReminderEmptyState.hidden = false;
    showToast(`โหลดคิวแจ้งเตือนไม่สำเร็จ: ${error.message}`, true);
    return;
  }

  classReminderEnrollments = (data || []).filter((enrollment) => {
    const app = getStudentApplication(enrollment);
    return !app.status || app.status === "approved";
  });

  const enrollmentIds = classReminderEnrollments.map((enrollment) => enrollment.id);
  classReminderSentKeys = new Set();
  if (enrollmentIds.length) {
    const { data: logs, error: logError } = await supabaseClient
      .from("course_reminder_logs")
      .select("course_enrollment_id,class_date")
      .eq("class_date", dateInfo.dateInput)
      .in("course_enrollment_id", enrollmentIds);
    if (!logError) {
      (logs || []).forEach((log) => {
        classReminderSentKeys.add(getReminderKey(log.course_enrollment_id, log.class_date));
      });
    }
  }

  classReminderLoadingState.hidden = true;
  renderClassReminders();
}

async function renderClassReminderCard(enrollment, message) {
  if (!classReminderCanvas) return;
  const context = classReminderCanvas.getContext("2d");
  const width = classReminderCanvas.width;
  const height = classReminderCanvas.height;
  const dateInfo = getClassReminderDateInfo();
  const [logoImage, locationImage, courseImage, calendarImage, sparkleImage] = await Promise.all([
    loadSummaryCardImage(summaryCardAssets.logo),
    loadSummaryCardImage(summaryCardAssets.location),
    loadSummaryCardImage(summaryCardAssets.course[enrollment.course_type] || summaryCardAssets.course.creative_art),
    loadSummaryCardImage(summaryCardAssets.calendar),
    loadSummaryCardImage(summaryCardAssets.star)
  ]);
  const studentName = getLearningStudentDisplayName(enrollment);
  const branchName = enrollment.branch_name ||
    enrollment.branches?.name ||
    getStudentApplication(enrollment).branches?.name ||
    getCurrentBranchName();
  const completed = Number(enrollment.completed_sessions || 0);
  const total = Number(enrollment.total_sessions || 0);
  const nextSession = total ? Math.min(completed + 1, total) : completed + 1;
  const sessionText = total ? `ครั้งที่ ${nextSession}/${total}` : `ครั้งที่ ${nextSession}`;
  const timeLabel = [
    normalizeTimeLabel(enrollment.class_start_time),
    normalizeTimeLabel(enrollment.class_end_time)
  ].filter(Boolean).join("-");

  context.clearRect(0, 0, width, height);
  context.fillStyle = "#FAF6EF";
  context.fillRect(0, 0, width, height);
  drawCardImage(context, logoImage, 70, 20, 640, 184);
  drawCardImage(context, sparkleImage, 888, 102, 62, 62, 0.68);

  drawCardShadow(context, 70, 208, 940, 245, 34, "#FFFFFF", "#E9DCCB");
  drawCardImage(context, courseImage, 128, 250, 146, 146);
  context.fillStyle = "#F05B3E";
  context.font = "900 38px Kanit, 'Noto Sans Thai', sans-serif";
  context.fillText("พรุ่งนี้มีเรียน", 312, 284);
  context.fillStyle = "#4A372E";
  context.font = "900 56px Kanit, 'Noto Sans Thai', sans-serif";
  wrapCanvasText(context, `น้อง${studentName.replace(/^น้อง/, "")}`, 312, 354, 560, 62, 1);
  context.fillStyle = "#4F7D48";
  context.font = "900 28px Kanit, 'Noto Sans Thai', sans-serif";
  context.fillText(sessionText, 312, 412);

  drawCardShadow(context, 70, 484, 940, 270, 32, "#F2F8EC", "#9BBE86");
  drawCardImage(context, calendarImage, 128, 546, 146, 146);
  context.fillStyle = "#4F7D48";
  context.font = "900 34px Kanit, 'Noto Sans Thai', sans-serif";
  wrapCanvasText(context, getCourseEnrollmentLabel(enrollment), 312, 556, 610, 40, 1);
  context.fillStyle = "#4A372E";
  context.font = "800 44px Kanit, 'Noto Sans Thai', sans-serif";
  wrapCanvasText(context, `${weekdayLabels[dateInfo.weekday]} ${dateInfo.dateLabel}`, 312, 630, 610, 50, 1);
  context.fillStyle = "#F05B3E";
  context.font = "900 50px Kanit, 'Noto Sans Thai', sans-serif";
  context.fillText(timeLabel || "ตามเวลาที่แจ้งไว้", 312, 696);
  context.fillStyle = "#4F7D48";
  context.font = "900 26px Kanit, 'Noto Sans Thai', sans-serif";
  context.fillText(sessionText, 312, 734);

  drawCardShadow(context, 70, 782, 940, 172, 30, "#FFFFFF", "#E9DCCB");
  drawCardImage(context, locationImage, 128, 795, 146, 146);
  context.fillStyle = "#4A372E";
  context.font = "800 31px Kanit, 'Noto Sans Thai', sans-serif";
  wrapCanvasText(context, `สาขา ${branchName}`, 312, 854, 610, 36, 1);
  context.fillStyle = "#8A7668";
  context.font = "700 24px Kanit, 'Noto Sans Thai', sans-serif";
  wrapCanvasText(context, "หากไม่สะดวกหรือต้องการเปลี่ยนวันและเวลา แจ้งได้เลยนะคะ", 312, 914, 610, 32, 2);

  context.fillStyle = "#6EA154";
  context.font = "900 26px Kanit, 'Noto Sans Thai', sans-serif";
  context.textAlign = "center";
  context.fillText("Toko & Poppy", width / 2, 1010);
  context.textAlign = "start";
}

function openClassReminder(enrollmentId) {
  const enrollment = classReminderEnrollments.find((item) => item.id === enrollmentId);
  if (!enrollment || !classReminderModal) return;
  const dateInfo = getClassReminderDateInfo();
  activeClassReminder = enrollment;
  classReminderTitle.textContent = `แจ้งเตือน: ${getLearningStudentDisplayName(enrollment)}`;
  classReminderSummaryText.textContent =
    `${getCourseEnrollmentLabel(enrollment)} · ${weekdayLabels[dateInfo.weekday]} ${dateInfo.dateLabel} · ${getCourseScheduleLabel(enrollment)}`;
  classReminderMessage.value = buildClassReminderMessage(enrollment, dateInfo);
  classReminderModal.classList.add("open");
  classReminderModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  renderClassReminderCard(enrollment, classReminderMessage.value);
}

function closeClassReminder() {
  classReminderModal?.classList.remove("open");
  classReminderModal?.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  activeClassReminder = null;
}

function downloadClassReminderCard() {
  if (!classReminderCanvas || !activeClassReminder) return;
  const dateInfo = getClassReminderDateInfo();
  const link = document.createElement("a");
  link.download = `toko-poppy-reminder-${getLearningStudentDisplayName(activeClassReminder)}-${dateInfo.dateInput}.png`;
  link.href = classReminderCanvas.toDataURL("image/png");
  document.body.appendChild(link);
  link.click();
  link.remove();
}

async function markClassReminderSent(enrollmentId = activeClassReminder?.id) {
  if (!enrollmentId) return;
  const dateInfo = getClassReminderDateInfo();
  const targetEnrollment = classReminderEnrollments.find((item) => item.id === enrollmentId);
  const message = activeClassReminder?.id === enrollmentId && classReminderMessage?.value
    ? classReminderMessage.value
    : buildClassReminderMessage(targetEnrollment, dateInfo);
  const { error } = await supabaseClient.rpc("mark_course_reminder_sent", {
    p_course_enrollment_id: enrollmentId,
    p_class_date: dateInfo.dateInput,
    p_message: message
  });
  if (error) {
    showToast(`บันทึกสถานะแจ้งเตือนไม่สำเร็จ: ${error.message}`, true);
    return;
  }
  classReminderSentKeys.add(getReminderKey(enrollmentId, dateInfo.dateInput));
  renderClassReminders();
  showToast("บันทึกว่าแจ้งเตือนผู้ปกครองเรียบร้อยแล้ว");
  if (activeClassReminder?.id === enrollmentId) closeClassReminder();
}

function renderLearningTeacherSummary() {
  if (!learningTeacherSummary) return;
  const managerMode = isMainAdmin() || isBranchAdmin();
  const studentCount = getLearningStudentGroups(learningEnrollments).length;
  const counts = learningEnrollments.reduce((summary, enrollment) => {
    const state = getLearningEnrollmentState(enrollment);
    if (state.key !== "completed") summary.active += 1;
    if (state.key === "not_started") summary.not_started += 1;
    if (state.key === "almost_done") summary.almost_done += 1;
    if (state.urgency === "critical") summary.critical += 1;
    return summary;
  }, {
    active: 0,
    not_started: 0,
    almost_done: 0,
    critical: 0
  });
  const currentStatus = learningStatusFilter?.value || "active";
  const items = [
    { filter: "active", count: counts.active, label: "คอร์สกำลังเรียน" },
    { filter: "not_started", count: counts.not_started, label: managerMode ? "ยังไม่เริ่มบันทึก" : "ยังไม่เคยบันทึก" },
    { filter: "almost_done", count: counts.almost_done, label: counts.critical ? `ใกล้หมด (${counts.critical} ด่วน)` : "ใกล้หมดแพ็กเกจ" },
    { filter: "all", count: studentCount, label: "เด็กทั้งหมด" }
  ];

  learningTeacherSummary.innerHTML = items.map((item) => `
    <button type="button" class="${currentStatus === item.filter ? "active" : ""}" data-learning-summary-filter="${item.filter}">
      <strong>${item.count}</strong>
      <span>${escapeHtml(item.label)}</span>
    </button>
  `).join("");
}

function getLearningFollowupRows() {
  const priority = {
    critical: 0,
    almost: 1,
    new: 2,
    active: 3,
    completed: 4
  };
  return [...learningEnrollments]
    .filter((enrollment) => getLearningEnrollmentState(enrollment).key !== "completed")
    .sort((a, b) => {
      const stateA = getLearningEnrollmentState(a);
      const stateB = getLearningEnrollmentState(b);
      if (priority[stateA.urgency] !== priority[stateB.urgency]) {
        return priority[stateA.urgency] - priority[stateB.urgency];
      }
      if (stateA.remaining !== stateB.remaining) return stateA.remaining - stateB.remaining;
      const completedA = Number(a.completed_sessions || 0);
      const completedB = Number(b.completed_sessions || 0);
      if (completedA !== completedB) return completedA - completedB;
      return String(a.updated_at || a.created_at || "").localeCompare(String(b.updated_at || b.created_at || ""));
    })
    .slice(0, (isMainAdmin() || isBranchAdmin()) ? 6 : 4);
}

function getPreferredLearningEnrollment(enrollments = []) {
  const priority = {
    critical: 0,
    almost: 1,
    new: 2,
    active: 3,
    completed: 4
  };
  return [...enrollments]
    .sort((a, b) => {
      const stateA = getLearningEnrollmentState(a);
      const stateB = getLearningEnrollmentState(b);
      if (priority[stateA.urgency] !== priority[stateB.urgency]) {
        return priority[stateA.urgency] - priority[stateB.urgency];
      }
      if (stateA.remaining !== stateB.remaining) return stateA.remaining - stateB.remaining;
      const completedA = Number(a.completed_sessions || 0);
      const completedB = Number(b.completed_sessions || 0);
      if (completedA !== completedB) return completedA - completedB;
      return String(a.updated_at || a.created_at || "").localeCompare(String(b.updated_at || b.created_at || ""));
    })[0] || null;
}

function getLearningUpdatedLabel(enrollment) {
  if (Number(enrollment?.completed_sessions || 0) <= 0) {
    return "ยังไม่เคยบันทึก";
  }
  return formatRelativeDate(enrollment.updated_at || enrollment.created_at);
}

function getLearningGroupUpdatedLabel(group) {
  const hasRecorded = group.enrollments.some((enrollment) =>
    Number(enrollment.completed_sessions || 0) > 0);
  if (!hasRecorded) return "ยังไม่เคยบันทึก";
  return formatRelativeDate(group.latestUpdatedAt);
}

function getLearningTimelineEnrollment(enrollmentId) {
  return learningEnrollments.find((enrollment) => enrollment.id === enrollmentId);
}

function renderLearningStudentTimeline(detailId, sessions = []) {
  const timelineList = document.getElementById(`${detailId}TimelineList`);
  if (!timelineList) return;

  if (!sessions.length) {
    timelineList.innerHTML = `
      <div class="learning-history-empty">
        ยังไม่มีประวัติครั้งเรียนของเด็กคนนี้
      </div>
    `;
    return;
  }

  timelineList.innerHTML = sessions.map((session) => {
    const enrollment = getLearningTimelineEnrollment(session.course_enrollment_id);
    const photoUrl = getLearningPhotoUrl(session.photo_path);
    const dateLabel = formatDateOnly(session.session_date || session.created_at);
    const courseLabel = enrollment
      ? getCourseEnrollmentLabel(enrollment)
      : "คอร์สเรียน";
    const sessionNumber = Number(session.session_number || 0);

    return `
      <article class="learning-student-timeline-item">
        <span class="learning-student-timeline-icon">
          ${getCourseIcon(enrollment?.course_type)}
        </span>
        <div class="learning-student-timeline-body">
          <div class="learning-student-timeline-meta">
            <strong>${escapeHtml(courseLabel)}</strong>
            <span>${escapeHtml(dateLabel)}</span>
          </div>
          <h4>${escapeHtml(session.lesson_title || `ครั้งที่ ${sessionNumber || "-"}`)}</h4>
          <p>${session.teacher_comment ? escapeHtml(session.teacher_comment) : "ยังไม่มีคอมเมนต์คุณครู"}</p>
          <small>ครั้งที่ ${sessionNumber || "-"} · บันทึก ${escapeHtml(formatRelativeDate(session.created_at || session.session_date))}</small>
        </div>
        ${photoUrl ? `
          <img src="${photoUrl}" alt="รูปผลงาน ${escapeHtml(courseLabel)} ครั้งที่ ${sessionNumber || ""}">
        ` : ""}
      </article>
    `;
  }).join("");
}

async function loadLearningStudentTimeline(detailId) {
  const timelineList = document.getElementById(`${detailId}TimelineList`);
  const enrollmentIds = learningStudentTimelineGroups.get(detailId) || [];
  if (!timelineList || !enrollmentIds.length) return;

  if (learningStudentTimelineCache.has(detailId)) {
    renderLearningStudentTimeline(detailId, learningStudentTimelineCache.get(detailId));
    return;
  }

  timelineList.innerHTML = `
    <div class="learning-history-empty">
      กำลังโหลดประวัติครั้งเรียนรวม...
    </div>
  `;

  const { data, error } = await supabaseClient
    .from("learning_sessions")
    .select("id,course_enrollment_id,session_number,session_date,lesson_title,teacher_comment,photo_path,created_at")
    .in("course_enrollment_id", enrollmentIds)
    .order("session_date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(12);

  if (error) {
    timelineList.innerHTML = `
      <div class="learning-history-empty">
        โหลดประวัติรวมไม่สำเร็จ ลองเปิดอีกครั้งหรือกดรีเฟรช
      </div>
    `;
    showToast(`โหลดประวัติรวมไม่สำเร็จ: ${error.message}`, true);
    return;
  }

  learningStudentTimelineCache.set(detailId, data || []);
  renderLearningStudentTimeline(detailId, data || []);
}

function getLearningFollowupReason(enrollment) {
  const state = getLearningEnrollmentState(enrollment);
  const remaining = state.remaining;
  if (state.key === "not_started") {
    return {
      label: "เริ่มบันทึกครั้งแรก",
      detail: "คอร์สนี้เปิดสิทธิ์แล้ว แต่ยังไม่มีประวัติครั้งเรียน",
      tone: "new"
    };
  }
  if (state.urgency === "critical") {
    return {
      label: "ด่วน: เหลือ 1 ครั้ง",
      detail: "ควรแจ้งเจ้าของสาขาหรือผู้ปกครองเพื่อวางแผนต่อคอร์ส",
      tone: "critical"
    };
  }
  if (state.key === "almost_done") {
    return {
      label: `เหลือ ${remaining} ครั้ง`,
      detail: `เหลือ ${remaining} ครั้ง ควรติดตามผลงานและวางแผนต่อคอร์ส`,
      tone: "almost"
    };
  }
  return {
    label: "ควรอัปเดตต่อเนื่อง",
    detail: "ยังอยู่ในแพ็กเกจปัจจุบัน กดบันทึกเมื่อเด็กมาเรียน",
    tone: "active"
  };
}

function renderLearningFollowupQueue() {
  if (!learningFollowupQueue) return;
  const rows = getLearningFollowupRows();
  const managerMode = isMainAdmin() || isBranchAdmin();
  learningFollowupQueue.hidden = rows.length === 0;
  if (!rows.length) {
    learningFollowupQueue.innerHTML = "";
    return;
  }

  const items = rows.map((enrollment) => {
    const state = getLearningEnrollmentState(enrollment);
    const reason = getLearningFollowupReason(enrollment);
    const completed = Number(enrollment.completed_sessions || 0);
    const total = Number(enrollment.total_sessions || 0);
    const nextSession = completed + 1;
    const studentLabel = [
      enrollment.student_name || "ไม่ระบุชื่อนักเรียน",
      enrollment.student_nickname ? `(${enrollment.student_nickname})` : ""
    ].filter(Boolean).join(" ");
    const meta = [
      getCourseEnrollmentLabel(enrollment),
      total ? `${completed}/${total} ครั้ง` : `${completed} ครั้ง`,
      state.label,
      `อัปเดต ${getLearningUpdatedLabel(enrollment)}`
    ].filter(Boolean).join(" · ");

    return `
      <article class="learning-followup-item is-${reason.tone}">
        <span class="learning-course-icon">${getCourseIcon(enrollment.course_type)}</span>
        <div>
          <em>${escapeHtml(reason.label)}</em>
          <strong>${escapeHtml(studentLabel)}</strong>
          <small>${escapeHtml(meta)}</small>
          <small>${escapeHtml(reason.detail)}</small>
        </div>
        <button type="button" data-queue-record-enrollment="${enrollment.id}">
          บันทึกครั้งที่ ${total ? Math.min(nextSession, total) : nextSession}
        </button>
      </article>
    `;
  }).join("");

  learningFollowupQueue.innerHTML = `
    <div class="learning-followup-heading">
      <div>
        <strong>${managerMode ? "เด็กที่ควรติดตามต่อคอร์ส" : "คิวที่ควรติดตาม"}</strong>
        <span>${managerMode
          ? "เรียงจากเด็กที่ใกล้หมดแพ็กเกจ เหลือ 1-3 ครั้ง และเด็กที่ยังไม่เริ่มบันทึก"
          : "ระบบเรียงจากคอร์สใกล้หมดแพ็กเกจและคอร์สที่ยังไม่เคยบันทึกก่อน"}</span>
      </div>
      <button type="button" data-learning-summary-filter="almost_done">ดูคอร์สใกล้หมด</button>
    </div>
    <div class="learning-followup-list">${items}</div>
  `;
}

async function loadLearningProgress() {
  if (!learningProgressRows) return;
  learningLoadingState.hidden = false;
  learningEmptyState.hidden = true;
  learningProgressRows.innerHTML = "";
  learningScopeText.textContent = isBranchAdmin()
    ? `มุมมองเด็กใน${getCurrentBranchName()} พร้อมคอร์สที่เหลือ 1-3 ครั้งเพื่อช่วยติดตามต่อคอร์ส`
    : isBranchTeacher()
      ? `รวมคอร์สของเด็กแต่ละคนใน${getCurrentBranchName()}ไว้ในกล่องเดียว เพื่อบันทึกครั้งเรียนได้เร็วขึ้น`
      : "รวมคอร์สของเด็กแต่ละคนไว้ในกล่องเดียว แอดมินหลักเห็นทุกสาขาและคอร์สใกล้หมดแพ็กเกจ";

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
  renderLearningTeacherSummary();
  renderLearningFollowupQueue();
  const rows = getLearningFilteredRows();
  learningEmptyState.hidden = rows.length > 0;
  learningStudentTimelineGroups.clear();

  const groups = getLearningStudentGroups(rows);
  learningProgressRows.innerHTML = groups.map((group, groupIndex) => {
    const states = group.enrollments.map((enrollment) => getLearningEnrollmentState(enrollment));
    const completedTotal = group.enrollments.reduce(
      (sum, enrollment) => sum + Number(enrollment.completed_sessions || 0),
      0
    );
    const sessionTotal = group.enrollments.reduce(
      (sum, enrollment) => sum + Number(enrollment.total_sessions || 0),
      0
    );
    const remainingTotal = Math.max(sessionTotal - completedTotal, 0);
    const hasCriticalCourse = states.some((state) => state.urgency === "critical");
    const hasAlmostDoneCourse = states.some((state) => state.key === "almost_done");
    const allCompleted = states.every((state) => state.key === "completed");
    const groupBadge = allCompleted
      ? ["completed", "จบครบทุกคอร์ส"]
      : hasCriticalCourse
        ? ["critical", "เหลือ 1 ครั้ง"]
        : hasAlmostDoneCourse
          ? ["almost", "มีคอร์สใกล้หมด"]
        : ["active", "กำลังเรียน"];
    const preferredEnrollment = getPreferredLearningEnrollment(group.enrollments);
    const preferredReason = preferredEnrollment ? getLearningFollowupReason(preferredEnrollment) : null;
    const preferredCompleted = Number(preferredEnrollment?.completed_sessions || 0);
    const preferredTotal = Number(preferredEnrollment?.total_sessions || 0);
    const preferredNextSession = preferredCompleted + 1;
    const preferredButtonText = preferredEnrollment
      ? allCompleted
        ? "ดู/บันทึกย้อนหลัง"
        : `บันทึกต่อ: ${getCourseIcon(preferredEnrollment.course_type)} ครั้งที่ ${preferredTotal ? Math.min(preferredNextSession, preferredTotal) : preferredNextSession}`
      : "";
    const latestUpdatedLabel = getLearningGroupUpdatedLabel(group);
    const meta = [
      group.nickname ? `ชื่อเล่น ${group.nickname}` : "",
      group.parentName ? `ผู้ปกครอง ${group.parentName}` : "",
      group.branchName ? `สาขา ${group.branchName}` : ""
    ].filter(Boolean).join(" · ");
    const detailId = `learningStudentDetail-${groupIndex}`;
    learningStudentTimelineGroups.set(detailId, group.enrollments.map((enrollment) => enrollment.id));
    const contactText = [
      group.parentPhone || "",
      group.parentEmail || ""
    ].filter(Boolean).join(" · ") || "ยังไม่มีข้อมูลติดต่อ";
    const detailCourses = group.enrollments.map((enrollment) => {
      const completed = Number(enrollment.completed_sessions || 0);
      const total = Number(enrollment.total_sessions || 0);
      const state = getLearningEnrollmentState(enrollment);
      return `
        <li>
          <span>${getCourseIcon(enrollment.course_type)} ${escapeHtml(getCourseEnrollmentLabel(enrollment))}</span>
          <strong>${completed}/${total} ครั้ง · ${escapeHtml(state.label)}</strong>
        </li>
      `;
    }).join("");

    const courseItems = group.enrollments.map((enrollment) => {
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
      const updatedLabel = getLearningUpdatedLabel(enrollment);
      const nextSession = completed + 1;
      const recordButtonLabel = learningState.key === "completed"
        ? "ดู/บันทึกย้อนหลัง"
        : `บันทึกครั้งที่ ${total ? Math.min(nextSession, total) : nextSession}`;
      const packageAlert = learningState.urgency === "critical" || learningState.urgency === "almost"
        ? `<span class="learning-package-alert is-${learningState.urgency}">${escapeHtml(learningState.label)}</span>`
        : "";
      const scheduleLabel = getCourseScheduleLabel(enrollment);
      const scheduleClass = getCourseScheduleClass(enrollment);

      return `
        <div class="learning-course-item ${learningState.key === "completed" ? "is-completed" : ""}">
          <div class="learning-course-summary">
            <span class="learning-course-icon">${getCourseIcon(enrollment.course_type)}</span>
            <div>
              <strong>${escapeHtml(courseLabel)}</strong>
              ${packageAlert}
              <small>${escapeHtml(certificateText)}</small>
              <small class="learning-last-updated">อัปเดตล่าสุด ${escapeHtml(updatedLabel)}</small>
              <button class="course-schedule-chip ${scheduleClass}" type="button" data-edit-course-schedule="${enrollment.id}">
                ${escapeHtml(scheduleLabel)}
              </button>
            </div>
          </div>
          <div class="learning-course-meter">
            <div class="learning-meter"><i style="width: ${percent}%"></i></div>
            <small>${percent}% · ${escapeHtml(learningState.helper)}</small>
          </div>
          <div class="learning-mini-numbers">
            <span><strong>${completed}</strong> เรียนแล้ว</span>
            <span><strong>${remaining}</strong> เหลือ</span>
            <span><strong>${total}</strong> รวม</span>
          </div>
          <button class="review-button learning-record-button" type="button" data-record-enrollment="${enrollment.id}">
            ${recordButtonLabel}
          </button>
        </div>
      `;
    }).join("");

    return `
      <article class="learning-student-card">
        <div class="learning-student-header">
          <div class="learning-progress-top learning-student-cell">
            <span class="learning-avatar">${getCourseIcon(group.enrollments[0]?.course_type)}</span>
            <div>
              <strong>${escapeHtml(group.studentName)}</strong>
              <small>${escapeHtml(meta || "ยังไม่มีข้อมูลผู้ปกครอง/สาขา")}</small>
              <small class="learning-last-updated">อัปเดตล่าสุด ${escapeHtml(latestUpdatedLabel)}</small>
            </div>
          </div>
          <div class="learning-student-stats">
            <span class="learning-status-badge ${groupBadge[0]}">${escapeHtml(groupBadge[1])}</span>
            <span><strong>${group.enrollments.length}</strong> คอร์ส</span>
            <span><strong>${completedTotal}/${sessionTotal}</strong> ครั้ง</span>
            <span><strong>${remainingTotal}</strong> เหลือรวม</span>
            ${preferredEnrollment ? `
              <button class="learning-student-primary-action" type="button" data-record-enrollment="${preferredEnrollment.id}" title="${escapeHtml(preferredReason?.detail || "บันทึกคอร์สที่ควรติดตาม")}">
                ${escapeHtml(preferredButtonText)}
              </button>
            ` : ""}
            <button class="learning-detail-toggle" type="button" data-student-detail="${detailId}" aria-expanded="false">
              ดูข้อมูลเด็ก
            </button>
          </div>
        </div>
        <div class="learning-student-detail" id="${detailId}" hidden>
          <div>
            <small>ผู้ปกครอง</small>
            <strong>${escapeHtml(group.parentName || "ยังไม่ระบุ")}</strong>
            <span>${escapeHtml(contactText)}</span>
          </div>
          <div>
            <small>สาขา</small>
            <strong>${escapeHtml(group.branchName || "ยังไม่ระบุ")}</strong>
            <span>${group.nickname ? `ชื่อเล่น ${escapeHtml(group.nickname)}` : "ยังไม่มีชื่อเล่น"}</span>
          </div>
          <div>
            <small>ภาพรวม</small>
            <strong>${completedTotal}/${sessionTotal} ครั้ง</strong>
            <span>เหลือรวม ${remainingTotal} ครั้ง จาก ${group.enrollments.length} คอร์ส · อัปเดตล่าสุด ${escapeHtml(latestUpdatedLabel)}</span>
          </div>
          <div class="learning-detail-courses">
            <small>คอร์สที่ลงเรียน</small>
            <ul>${detailCourses}</ul>
          </div>
          <div class="learning-student-timeline" id="${detailId}Timeline">
            <div class="learning-student-timeline-heading">
              <div>
                <small>ประวัติครั้งเรียนรวม</small>
                <strong>ล่าสุดของเด็กคนนี้</strong>
              </div>
              <span>รวมทุกคอร์ส แสดง 12 รายการล่าสุด</span>
            </div>
            <div class="learning-student-timeline-list" id="${detailId}TimelineList">
              <div class="learning-history-empty">เปิดข้อมูลเด็กเพื่อโหลดประวัติรวม</div>
            </div>
          </div>
        </div>
        <div class="learning-course-list">
          ${courseItems}
        </div>
      </article>
    `;
  }).join("");
}

function renderLearningSessionHistory(sessions = []) {
  if (!learningSessionTimeline) return;
  if (!sessions.length) {
    learningSessionTimeline.innerHTML =
      '<div class="learning-history-empty">ยังไม่มีประวัติครั้งเรียนของคอร์สนี้</div>';
    return;
  }

  learningSessionTimeline.innerHTML = sessions.map((session) => {
    const photoUrl = getLearningPhotoUrl(session.photo_path);
    return `
      <article class="learning-session-item">
        <div class="learning-session-marker">
          <strong>${Number(session.session_number || 0)}</strong>
          <span>ครั้ง</span>
        </div>
        <div class="learning-session-body">
          <div class="learning-session-meta">
            <strong>${escapeHtml(session.lesson_title || `ครั้งที่ ${session.session_number}`)}</strong>
            <span>${escapeHtml(formatDateOnly(session.session_date))}</span>
          </div>
          ${session.teacher_comment ? `<p>${escapeHtml(session.teacher_comment)}</p>` : '<p class="muted">ยังไม่มีคอมเมนต์คุณครู</p>'}
          ${photoUrl ? `<img src="${photoUrl}" alt="รูปผลงานครั้งที่ ${escapeHtml(session.session_number)}">` : ""}
        </div>
      </article>
    `;
  }).join("");
}

async function loadLearningSessionHistory(enrollmentId) {
  if (!learningSessionTimeline || !enrollmentId) return;
  learningSessionTimeline.innerHTML =
    '<div class="learning-history-empty">กำลังโหลดประวัติครั้งเรียน...</div>';

  const { data, error } = await supabaseClient
    .from("learning_sessions")
    .select("id,session_number,session_date,lesson_title,teacher_comment,photo_path,created_at")
    .eq("course_enrollment_id", enrollmentId)
    .order("session_number", { ascending: false });

  if (error) {
    learningSessionTimeline.innerHTML =
      '<div class="learning-history-empty">โหลดประวัติไม่สำเร็จ ลองกดรีเฟรชอีกครั้ง</div>';
    showToast(`โหลดประวัติครั้งเรียนไม่สำเร็จ: ${error.message}`, true);
    return;
  }

  renderLearningSessionHistory(data || []);
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
    `บันทึกครั้งเรียน: ${getLearningStudentDisplayName(activeLearningEnrollment)}`;
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
  hideSessionSharePanel();
  if (saveSessionButton) {
    saveSessionButton.disabled = false;
    saveSessionButton.textContent = "ดูตัวอย่างการ์ดก่อนบันทึก";
  }
  if (learningSessionTimeline) {
    learningSessionTimeline.innerHTML =
      '<div class="learning-history-empty">กำลังโหลดประวัติครั้งเรียน...</div>';
  }
  recordSessionModal.classList.add("open");
  recordSessionModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  loadLearningSessionHistory(activeLearningEnrollment.id);
}

function closeRecordSession() {
  recordSessionModal.classList.remove("open");
  recordSessionModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  hideSessionSharePanel();
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

function hideSessionSharePanel() {
  lastSessionShareData = null;
  pendingSessionShareData = null;
  sessionShareIsSaved = false;
  if (pendingSessionObjectUrl) {
    URL.revokeObjectURL(pendingSessionObjectUrl);
    pendingSessionObjectUrl = "";
  }
  if (sessionSharePanel) sessionSharePanel.hidden = true;
  if (sessionShareText) sessionShareText.value = "";
  if (confirmSaveSessionButton) confirmSaveSessionButton.hidden = false;
  if (copySessionShareTextButton) copySessionShareTextButton.hidden = true;
  if (downloadSessionShareCardButton) downloadSessionShareCardButton.hidden = true;
  if (sessionShareStepLabel) sessionShareStepLabel.textContent = "ตรวจทานก่อนบันทึกจริง";
  if (sessionShareHeadingText) sessionShareHeadingText.textContent = "Preview การ์ดสรุปหลังเรียน";
  if (sessionShareCanvas) {
    const context = sessionShareCanvas.getContext("2d");
    context?.clearRect(0, 0, sessionShareCanvas.width, sessionShareCanvas.height);
  }
}

function validateLearningSessionForm() {
  if (!activeLearningEnrollment) return null;
  const totalSessions = Number(activeLearningEnrollment.total_sessions || 0);
  const sessionNumber = Number.parseInt(recordSessionNumber?.value || "", 10);
  if (!Number.isInteger(sessionNumber) || sessionNumber < 1) {
    showToast("กรุณาระบุครั้งที่เรียนเป็นตัวเลขอย่างน้อย 1", true);
    recordSessionNumber?.focus();
    return null;
  }
  if (totalSessions && sessionNumber > totalSessions) {
    showToast(`ครั้งที่เรียนต้องไม่เกินแพ็กเกจ ${totalSessions} ครั้ง`, true);
    recordSessionNumber?.focus();
    return null;
  }
  return {
    sessionNumber,
    sessionDate: recordSessionDate.value || toLocalDateInputValue(new Date()),
    lessonTitle: recordLessonTitle.value.trim(),
    teacherComment: recordTeacherComment.value.trim()
  };
}

function getDraftLearningPhotoUrl() {
  const file = recordSessionPhoto.files?.[0];
  if (!file) return "";
  if (pendingSessionObjectUrl) URL.revokeObjectURL(pendingSessionObjectUrl);
  pendingSessionObjectUrl = URL.createObjectURL(file);
  return pendingSessionObjectUrl;
}

function buildDraftAfterClassShareData(sessionInput) {
  const data = buildAfterClassShareData({
    enrollment: activeLearningEnrollment,
    sessionNumber: sessionInput.sessionNumber,
    sessionDate: sessionInput.sessionDate,
    lessonTitle: sessionInput.lessonTitle,
    teacherComment: sessionInput.teacherComment,
    photoPath: null
  });
  data.photoUrl = getDraftLearningPhotoUrl();
  return data;
}

function markSessionPreviewDirty() {
  if (!sessionSharePanel || sessionSharePanel.hidden || sessionShareIsSaved) return;
  pendingSessionShareData = null;
  if (confirmSaveSessionButton) confirmSaveSessionButton.hidden = true;
  if (copySessionShareTextButton) copySessionShareTextButton.hidden = true;
  if (downloadSessionShareCardButton) downloadSessionShareCardButton.hidden = true;
  if (sessionShareHeadingText) {
    sessionShareHeadingText.textContent = "ข้อมูลถูกแก้ไข กดอัปเดต Preview อีกครั้ง";
  }
}

function getShareBranchName(enrollment = {}) {
  return enrollment.branches?.name ||
    enrollment.branch_name ||
    currentBranchAssignment?.branches?.name ||
    currentBranchAssignment?.branch_name ||
    "";
}

function getLearningStudentDisplayName(enrollment = {}) {
  const studentName = String(enrollment.student_name || "").trim();
  const nickname = String(enrollment.student_nickname || "").trim();
  const parentName = String(enrollment.parent_name || "").trim();

  if (nickname && nickname !== parentName) return nickname;
  if (studentName && studentName !== parentName) return studentName;
  return studentName || nickname || "น้อง";
}

function getShareChildLabel(name = "") {
  const cleanName = String(name || "").trim() || "น้อง";
  return cleanName.startsWith("น้อง") ? cleanName : `น้อง${cleanName}`;
}

function getShareCardChildLabel(name = "") {
  return getShareChildLabel(name).replace(/\s+/g, "");
}

function buildAfterClassShareData({
  enrollment,
  sessionNumber,
  sessionDate,
  lessonTitle,
  teacherComment,
  photoPath
}) {
  const totalSessions = Number(enrollment.total_sessions || 0);
  const completedBefore = Number(enrollment.completed_sessions || 0);
  const completedAfter = Math.max(completedBefore, sessionNumber);
  const remainingAfter = totalSessions
    ? Math.max(totalSessions - completedAfter, 0)
    : 0;

  return {
    studentName: getLearningStudentDisplayName(enrollment),
    courseType: enrollment.course_type || "creative_art",
    courseName: getCourseEnrollmentLabel(enrollment),
    courseIcon: getCourseIcon(enrollment.course_type),
    branchName: getShareBranchName(enrollment),
    sessionNumber,
    sessionDate: sessionDate || toLocalDateInputValue(new Date()),
    lessonTitle: lessonTitle || "",
    teacherComment: teacherComment || "",
    photoUrl: getLearningPhotoUrl(photoPath),
    totalSessions,
    completedAfter,
    remainingAfter
  };
}

function buildAfterClassShareText(data) {
  const sessionText = data.totalSessions
    ? `ครั้งที่ ${data.sessionNumber}/${data.totalSessions}`
    : `ครั้งที่ ${data.sessionNumber}`;
  const childLabel = getShareChildLabel(data.studentName);
  const lines = [
    `สรุปวันนี้ของ${childLabel}`,
    data.branchName ? `สาขา: ${data.branchName}` : "",
    `${data.courseIcon} ${data.courseName}`,
    `วันที่ ${formatDateOnly(data.sessionDate)} · ${sessionText}`,
    data.lessonTitle ? `บทเรียนวันนี้: ${data.lessonTitle}` : "",
    data.teacherComment ? `คอมเมนต์คุณครู: ${data.teacherComment}` : "",
    data.totalSessions ? `คงเหลือ ${data.remainingAfter} ครั้ง` : "",
    "ขอบคุณค่ะ/ครับ"
  ];
  return lines.filter(Boolean).join("\n");
}

function drawRoundedRect(context, x, y, width, height, radius) {
  const safeRadius = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + safeRadius, y);
  context.lineTo(x + width - safeRadius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + safeRadius);
  context.lineTo(x + width, y + height - safeRadius);
  context.quadraticCurveTo(x + width, y + height, x + width - safeRadius, y + height);
  context.lineTo(x + safeRadius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - safeRadius);
  context.lineTo(x, y + safeRadius);
  context.quadraticCurveTo(x, y, x + safeRadius, y);
  context.closePath();
}

function getCanvasTextSegments(context, text, maxWidth) {
  const normalized = String(text || "").replace(/\s+/g, " ").trim();
  if (!normalized) return [];

  let segments = [];
  if (normalized.includes(" ")) {
    segments = normalized.split(" ");
  } else if (typeof Intl !== "undefined" && Intl.Segmenter) {
    segments = Array.from(
      new Intl.Segmenter("th", { granularity: "word" }).segment(normalized),
      (part) => part.segment
    ).filter(Boolean);
  }

  if (!segments.length) segments = [normalized];

  return segments.flatMap((segment) => {
    if (context.measureText(segment).width <= maxWidth) return [segment];
    const chunks = [];
    let chunk = "";
    Array.from(segment).forEach((char) => {
      const testChunk = `${chunk}${char}`;
      if (context.measureText(testChunk).width <= maxWidth || !chunk) {
        chunk = testChunk;
        return;
      }
      chunks.push(chunk);
      chunk = char;
    });
    if (chunk) chunks.push(chunk);
    return chunks;
  });
}

function clipCanvasTextLine(line) {
  const chars = Array.from(line);
  if (chars.length <= 3) return `${line}...`;
  return `${chars.slice(0, -2).join("")}...`;
}

function wrapCanvasText(context, text, x, y, maxWidth, lineHeight, maxLines = 4) {
  const normalized = String(text || "").replace(/\s+/g, " ").trim();
  if (!normalized) return y;
  const words = getCanvasTextSegments(context, normalized, maxWidth);
  const lines = [];
  let currentLine = "";

  words.forEach((word) => {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (context.measureText(testLine).width <= maxWidth || !currentLine) {
      currentLine = testLine;
      return;
    }
    lines.push(currentLine);
    currentLine = word;
  });
  if (currentLine) lines.push(currentLine);

  const visibleLines = lines.slice(0, maxLines);
  visibleLines.forEach((line, index) => {
    const isLast = index === maxLines - 1 && lines.length > maxLines;
    context.fillText(isLast ? clipCanvasTextLine(line) : line, x, y + index * lineHeight);
  });
  return y + visibleLines.length * lineHeight;
}

function loadCanvasImage(url) {
  if (!url) return Promise.resolve(null);
  if (summaryCardImageCache.has(url)) return summaryCardImageCache.get(url);
  return new Promise((resolve) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = url;
  });
}

function loadSummaryCardImage(url) {
  if (!url) return Promise.resolve(null);
  if (!summaryCardImageCache.has(url)) {
    summaryCardImageCache.set(url, loadCanvasImage(url));
  }
  return summaryCardImageCache.get(url);
}

function drawCardImage(context, image, x, y, width, height, alpha = 1) {
  if (!image) return;
  context.save();
  context.globalAlpha = alpha;
  context.drawImage(image, x, y, width, height);
  context.restore();
}

function drawCardShadow(context, x, y, width, height, radius, fill = "#ffffff", stroke = "#E9DCCB") {
  context.save();
  context.shadowColor = "rgba(74, 55, 46, 0.08)";
  context.shadowBlur = 18;
  context.shadowOffsetY = 8;
  context.fillStyle = fill;
  drawRoundedRect(context, x, y, width, height, radius);
  context.fill();
  context.restore();
  context.strokeStyle = stroke;
  context.lineWidth = 2;
  drawRoundedRect(context, x, y, width, height, radius);
  context.stroke();
}

function drawCardText(context, text, x, y, maxWidth, lineHeight, maxLines, options = {}) {
  context.save();
  context.fillStyle = options.color || "#4A372E";
  context.font = options.font || "600 32px Kanit, 'Noto Sans Thai', sans-serif";
  context.textAlign = options.align || "start";
  context.textBaseline = "alphabetic";
  const finalY = wrapCanvasText(context, text, x, y, maxWidth, lineHeight, maxLines);
  context.restore();
  return finalY;
}

function drawSummaryCardTitle(context, childLabel) {
  const startX = 124;
  const y = 210;
  context.font = "900 58px Kanit, 'Noto Sans Thai', sans-serif";
  context.textBaseline = "alphabetic";
  context.fillStyle = "#4A372E";
  context.fillText("วันนี้ ", startX, y);
  const firstWidth = context.measureText("วันนี้ ").width;
  context.fillStyle = "#F05B3E";
  context.fillText(childLabel, startX + firstWidth, y);
  const childWidth = context.measureText(childLabel).width;
  context.fillStyle = "#4A372E";
  context.fillText(" เรียนอะไรบ้าง?", startX + firstWidth + childWidth, y);
}

function drawSummaryDateLabel(context, sessionDate) {
  const dateText = formatDateOnly(sessionDate);
  if (!dateText) return;
  context.fillStyle = "#876F5F";
  context.font = "700 24px Kanit, 'Noto Sans Thai', sans-serif";
  context.fillText(dateText, 124, 248);
}

function drawSummaryInfoColumn(context, { icon, title, subtitle, accent, big, iconSize = 46, titleFont, subtitleFont }, x, y, width, height) {
  const safeIconSize = big ? 0 : iconSize;
  if (icon) drawCardImage(context, icon, x + 24, y + (height - safeIconSize) / 2, safeIconSize, safeIconSize);
  const textX = icon ? x + safeIconSize + 40 : x + 24;
  const textWidth = width - (icon ? safeIconSize + 54 : 44);
  context.fillStyle = accent || "#4A372E";
  context.font = big ? "900 44px Kanit, 'Noto Sans Thai', sans-serif" : (titleFont || "800 24px Kanit, 'Noto Sans Thai', sans-serif");
  if (big) {
    context.fillStyle = "#4A372E";
    context.font = "800 22px Kanit, 'Noto Sans Thai', sans-serif";
    context.fillText(title, x + 30, y + 42);
    context.fillStyle = "#F05B3E";
    context.font = "900 45px Kanit, 'Noto Sans Thai', sans-serif";
    context.fillText(subtitle, x + 30, y + 88);
    return;
  }
  if (!subtitle) {
    wrapCanvasText(context, title, textX, y + 73, textWidth, 28, 1);
    return;
  }
  wrapCanvasText(context, title, textX, y + 50, textWidth, 28, 1);
  context.fillStyle = "#4A372E";
  context.font = subtitleFont || "700 21px Kanit, 'Noto Sans Thai', sans-serif";
  wrapCanvasText(context, subtitle, textX, y + 82, textWidth, 25, 1);
}

function drawProgressDots(context, completed, total, x, y) {
  const safeTotal = Math.max(Math.min(Number(total || 0), 12), 0);
  const safeCompleted = Math.max(Math.min(Number(completed || 0), safeTotal), 0);
  if (!safeTotal) return;
  const radius = safeTotal > 8 ? 13 : 18;
  const gap = safeTotal > 8 ? 38 : 56;
  for (let index = 0; index < safeTotal; index += 1) {
    const dotX = x + index * gap;
    context.beginPath();
    context.arc(dotX, y, radius, 0, Math.PI * 2);
    context.fillStyle = index < safeCompleted ? "#6EA154" : "#FFFFFF";
    context.fill();
    context.strokeStyle = "#6EA154";
    context.lineWidth = 3;
    context.stroke();
    if (index < safeTotal - 1) {
      context.strokeStyle = "#9BBE86";
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(dotX + radius + 6, y);
      context.lineTo(dotX + gap - radius - 6, y);
      context.stroke();
    }
  }
}

function drawProgressBar(context, completed, total, x, y, width, height) {
  const safeTotal = Math.max(Number(total || 0), 1);
  const safeCompleted = Math.max(Math.min(Number(completed || 0), safeTotal), 0);
  const ratio = safeCompleted / safeTotal;
  drawRoundedRect(context, x, y, width, height, height / 2);
  context.fillStyle = "#DDEED2";
  context.fill();
  context.strokeStyle = "#9BBE86";
  context.lineWidth = 2;
  context.stroke();
  if (ratio > 0) {
    drawRoundedRect(context, x, y, Math.max(width * ratio, height), height, height / 2);
    context.fillStyle = "#6EA154";
    context.fill();
  }
  context.fillStyle = "#4A372E";
  context.font = "800 20px Kanit, 'Noto Sans Thai', sans-serif";
  context.textAlign = "center";
  context.fillText(`${safeCompleted}/${safeTotal}`, x + width / 2, y + height + 25);
  context.textAlign = "start";
}

function drawCoverImage(context, image, x, y, width, height, radius) {
  const sourceRatio = image.width / image.height;
  const targetRatio = width / height;
  let sourceWidth = image.width;
  let sourceHeight = image.height;
  let sourceX = 0;
  let sourceY = 0;

  if (sourceRatio > targetRatio) {
    sourceWidth = image.height * targetRatio;
    sourceX = (image.width - sourceWidth) / 2;
  } else {
    sourceHeight = image.width / targetRatio;
    sourceY = (image.height - sourceHeight) / 2;
  }

  context.save();
  drawRoundedRect(context, x, y, width, height, radius);
  context.clip();
  context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height);
  context.restore();
}

async function renderSessionShareCard(data) {
  if (!sessionShareCanvas) return;
  const context = sessionShareCanvas.getContext("2d");
  const width = sessionShareCanvas.width;
  const height = sessionShareCanvas.height;
  const [
    photoImage,
    logoImage,
    locationImage,
    sunImage,
    sparkleImage,
    teacherHeartImage,
    heartImage,
    trophyImage,
    bookImage,
    courseImage
  ] = await Promise.all([
    loadSummaryCardImage(data.photoUrl),
    loadSummaryCardImage(summaryCardAssets.logo),
    loadSummaryCardImage(summaryCardAssets.location),
    loadSummaryCardImage(summaryCardAssets.sun),
    loadSummaryCardImage(summaryCardAssets.star),
    loadSummaryCardImage(summaryCardAssets.teacherHeart),
    loadSummaryCardImage(summaryCardAssets.heart),
    loadSummaryCardImage(summaryCardAssets.trophy),
    loadSummaryCardImage(summaryCardAssets.book),
    loadSummaryCardImage(summaryCardAssets.course[data.courseType] || summaryCardAssets.course.creative_art)
  ]);
  const childLabel = getShareCardChildLabel(data.studentName).slice(0, 14);
  const lessonTitle = data.lessonTitle || "กิจกรรมสร้างสรรค์";
  const teacherNote = data.teacherComment ||
    "วันนี้ตั้งใจเรียนดีมาก เก็บผลงานไว้เป็นกำลังใจนะคะ/ครับ";
  const sessionNumber = Number(data.sessionNumber || 0);
  const totalSessions = Number(data.totalSessions || 0);
  const completed = Number(data.completedAfter || sessionNumber || 0);
  const remaining = totalSessions ? Math.max(totalSessions - completed, 0) : 0;
  const displayTotal = totalSessions || Math.max(sessionNumber, completed, 4);

  context.clearRect(0, 0, width, height);
  context.fillStyle = "#FAF6EF";
  context.fillRect(0, 0, width, height);

  const glow = context.createRadialGradient(550, 250, 80, 550, 250, 760);
  glow.addColorStop(0, "rgba(255, 255, 255, 0.88)");
  glow.addColorStop(1, "rgba(250, 246, 239, 0)");
  context.fillStyle = glow;
  context.fillRect(0, 0, width, height);

  [["#F4C64E", 502, 66], ["#F05B3E", 598, 50], ["#6EA154", 448, 118], ["#F8B7C8", 1030, 214],
    ["#F4C64E", 960, 156], ["#6EA154", 560, 112], ["#F05B3E", 840, 92]].forEach(([color, x, y]) => {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, 5, 0, Math.PI * 2);
    context.fill();
    context.fillRect(x - 3, y - 12, 6, 24);
    context.fillRect(x - 12, y - 3, 24, 6);
  });

  drawCardImage(context, logoImage, 58, 55, 326, 93);
  context.strokeStyle = "#D7B99C";
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(404, 62);
  context.lineTo(404, 150);
  context.stroke();

  if (data.branchName) {
    drawCardShadow(context, 778, 50, 254, 60, 30, "#FFFFFF", "#DFBF9F");
    drawCardImage(context, locationImage, 804, 63, 34, 34);
    context.fillStyle = "#4F8B37";
    context.font = "800 26px Kanit, 'Noto Sans Thai', sans-serif";
    wrapCanvasText(context, `สาขา ${data.branchName}`, 848, 89, 150, 30, 1);
  }

  drawCardImage(context, sunImage, 42, 136, 78, 78);
  drawSummaryCardTitle(context, `น้อง${childLabel.replace(/^น้อง/, "")}`);
  drawSummaryDateLabel(context, data.sessionDate);

  const photoX = 48;
  const photoY = 270;
  const photoW = 984;
  const photoH = 594;
  drawCardShadow(context, photoX, photoY, photoW, photoH, 38, "#FFFFFF", "#F1DEC8");
  if (photoImage) {
    drawCoverImage(context, photoImage, photoX + 14, photoY + 14, photoW - 28, photoH - 28, 26);
  } else {
    context.fillStyle = "#F5EFE4";
    drawRoundedRect(context, photoX + 14, photoY + 14, photoW - 28, photoH - 28, 26);
    context.fill();
    context.fillStyle = "#8B7668";
    context.font = "800 42px Kanit, 'Noto Sans Thai', sans-serif";
    context.textAlign = "center";
    context.fillText("เลือกรูปผลงานครั้งนี้", width / 2, photoY + photoH / 2);
    context.textAlign = "start";
  }

  context.fillStyle = "#62A742";
  drawRoundedRect(context, 78, 304, 218, 54, 8);
  context.fill();
  context.fillStyle = "#FFFFFF";
  context.font = "900 25px Kanit, 'Noto Sans Thai', sans-serif";
  context.fillText("★  ผลงานวันนี้", 96, 339);

  const infoY = 895;
  drawCardShadow(context, 48, infoY, 984, 126, 26, "#FFFFFF", "#F1DEC8");
  [224, 770].forEach((x) => {
    context.strokeStyle = "#D7B99C";
    context.setLineDash([4, 4]);
    context.beginPath();
    context.moveTo(x, infoY + 26);
    context.lineTo(x, infoY + 102);
    context.stroke();
    context.setLineDash([]);
  });
  drawCardImage(context, courseImage, 110, infoY + 31, 64, 64);
  drawSummaryInfoColumn(context, {
    icon: bookImage,
    title: `บทที่ ${sessionNumber || "-"}`,
    subtitle: lessonTitle,
    accent: "#4A372E",
    iconSize: 54,
    titleFont: "800 32px Kanit, 'Noto Sans Thai', sans-serif",
    subtitleFont: "700 27px Kanit, 'Noto Sans Thai', sans-serif"
  }, 252, infoY, 490, 126);
  drawSummaryInfoColumn(context, {
    title: "ครั้งที่",
    subtitle: totalSessions ? `${sessionNumber}/${totalSessions}` : String(sessionNumber || "-"),
    big: true
  }, 820, infoY, 176, 126);

  const noteY = 1044;
  drawCardShadow(context, 48, noteY, 984, 174, 26, "#FFFFFF", "#F1DEC8");
  drawCardImage(context, teacherHeartImage, 72, noteY + 44, 88, 88);
  drawCardImage(context, heartImage, 856, noteY + 50, 108, 108, 0.38);
  context.fillStyle = "#F05B3E";
  context.font = "900 31px Kanit, 'Noto Sans Thai', sans-serif";
  context.fillText("ข้อความจากคุณครู", 188, noteY + 61);
  drawCardText(context, teacherNote, 188, noteY + 104, 610, 34, 3, {
    color: "#4A372E",
    font: "700 25px Kanit, 'Noto Sans Thai', sans-serif"
  });

  const progressY = 1238;
  drawCardShadow(context, 48, progressY, 984, 102, 28, "#F2F8EC", "#93B985");
  drawCardImage(context, trophyImage, 70, progressY + 15, 72, 72);
  context.fillStyle = "#4A372E";
  context.font = "900 30px Kanit, 'Noto Sans Thai', sans-serif";
  context.fillText(`เรียนแล้ว ${completed || sessionNumber || 0} ครั้ง`, 178, progressY + 46);
  context.fillStyle = "#4A372E";
  context.font = "500 20px Kanit, 'Noto Sans Thai', sans-serif";
  context.fillText("เก่งขึ้นทุกครั้งเลยนะ!", 178, progressY + 78);
  drawProgressBar(context, completed || sessionNumber, displayTotal, 430, progressY + 34, 300, 28);
  context.fillStyle = "#4A372E";
  context.font = "900 27px Kanit, 'Noto Sans Thai', sans-serif";
  context.fillText("คงเหลือ", 786, progressY + 60);
  context.fillStyle = "#18743D";
  context.font = "900 34px Kanit, 'Noto Sans Thai', sans-serif";
  context.fillText(`${remaining}`, 888, progressY + 60);
  context.fillStyle = "#4A372E";
  context.font = "900 27px Kanit, 'Noto Sans Thai', sans-serif";
  context.fillText("ครั้ง", 930, progressY + 60);
  drawCardImage(context, sparkleImage, 960, progressY + 18, 54, 54);
}

window.renderSessionShareCard = renderSessionShareCard;

async function showSessionSharePanel(data, { saved = false } = {}) {
  lastSessionShareData = data;
  sessionShareIsSaved = saved;
  if (sessionShareText) sessionShareText.value = buildAfterClassShareText(data);
  if (sessionSharePanel) sessionSharePanel.hidden = false;
  if (confirmSaveSessionButton) confirmSaveSessionButton.hidden = saved;
  if (copySessionShareTextButton) copySessionShareTextButton.hidden = !saved;
  if (downloadSessionShareCardButton) downloadSessionShareCardButton.hidden = !saved;
  if (sessionShareStepLabel) {
    sessionShareStepLabel.textContent = saved
      ? "ส่งให้ผู้ปกครองทาง LINE"
      : "ตรวจทานก่อนบันทึกจริง";
  }
  if (sessionShareHeadingText) {
    sessionShareHeadingText.textContent = saved
      ? "ภาพสรุปหลังเรียน + ข้อความพร้อมคัดลอก"
      : "Preview การ์ดสรุปหลังเรียน";
  }
  await renderSessionShareCard(data);
  sessionSharePanel?.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

async function copySessionShareText() {
  if (!sessionShareText?.value) return;
  try {
    await navigator.clipboard.writeText(sessionShareText.value);
    showToast("คัดลอกข้อความสำหรับส่งผู้ปกครองแล้ว");
  } catch {
    sessionShareText.select();
    document.execCommand("copy");
    showToast("คัดลอกข้อความสำหรับส่งผู้ปกครองแล้ว");
  }
}

function downloadSessionShareCard() {
  if (!sessionShareCanvas || !lastSessionShareData) return;
  const link = document.createElement("a");
  const safeName = String(lastSessionShareData.studentName || "student")
    .replace(/[^\wก-๙-]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
  link.download = `toko-poppy-session-${safeName}-${lastSessionShareData.sessionNumber}.png`;
  try {
    link.href = sessionShareCanvas.toDataURL("image/png");
    link.click();
  } catch (error) {
    console.error(error);
    showToast("ดาวน์โหลดภาพไม่สำเร็จ ลองเปิดใหม่หรือส่งข้อความสรุปให้ผู้ปกครองก่อน", true);
  }
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

async function previewLearningSession(event) {
  event.preventDefault();
  const sessionInput = validateLearningSessionForm();
  if (!sessionInput) return;

  saveSessionButton.disabled = true;
  saveSessionButton.textContent = "กำลังสร้าง Preview...";

  try {
    pendingSessionShareData = buildDraftAfterClassShareData(sessionInput);
    await showSessionSharePanel(pendingSessionShareData, { saved: false });
    showToast("ตรวจทานการ์ดก่อนบันทึกจริงได้เลย");
  } catch (error) {
    showToast(`สร้าง Preview ไม่สำเร็จ: ${error.message}`, true);
  } finally {
    saveSessionButton.disabled = false;
    saveSessionButton.textContent = "อัปเดต Preview การ์ด";
  }
}

async function confirmSaveLearningSession() {
  const sessionInput = validateLearningSessionForm();
  if (!sessionInput || !activeLearningEnrollment) return;

  confirmSaveSessionButton.disabled = true;
  confirmSaveSessionButton.textContent = "กำลังบันทึกจริง...";
  saveSessionButton.disabled = true;

  try {
    const photoPath = await uploadLearningPhoto(activeLearningEnrollment.id);
    const shareData = buildAfterClassShareData({
      enrollment: activeLearningEnrollment,
      sessionNumber: sessionInput.sessionNumber,
      sessionDate: sessionInput.sessionDate,
      lessonTitle: sessionInput.lessonTitle,
      teacherComment: sessionInput.teacherComment,
      photoPath
    });
    const { error } = await supabaseClient.rpc("record_learning_session", {
      p_course_enrollment_id: activeLearningEnrollment.id,
      p_session_number: sessionInput.sessionNumber,
      p_session_date: recordSessionDate.value || null,
      p_lesson_title: sessionInput.lessonTitle || null,
      p_teacher_comment: sessionInput.teacherComment || null,
      p_photo_path: photoPath
    });
    if (error) throw error;

    showToast("บันทึกครั้งเรียนเรียบร้อยแล้ว");
    learningStudentTimelineCache.clear();
    pendingSessionShareData = null;
    if (pendingSessionObjectUrl) {
      URL.revokeObjectURL(pendingSessionObjectUrl);
      pendingSessionObjectUrl = "";
    }
    await showSessionSharePanel(shareData, { saved: true });
    recordSessionPhoto.value = "";
    recordSessionPhotoPreview.innerHTML = "";
    await loadLearningProgress();
    if (activeLearningEnrollment) {
      await loadLearningSessionHistory(activeLearningEnrollment.id);
    }
  } catch (error) {
    showToast(`บันทึกครั้งเรียนไม่สำเร็จ: ${error.message}`, true);
  } finally {
    confirmSaveSessionButton.disabled = false;
    confirmSaveSessionButton.textContent = "ยืนยันบันทึกจริง";
    saveSessionButton.disabled = false;
    saveSessionButton.textContent = "อัปเดต Preview การ์ด";
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

function ensureRevenueDefaultDates() {
  if (!revenueDateFrom || !revenueDateTo) return;
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  if (!revenueDateFrom.value) revenueDateFrom.value = toLocalDateInputValue(firstDay);
  if (!revenueDateTo.value) revenueDateTo.value = toLocalDateInputValue(lastDay);
}

function renderRevenueBranchOptions() {
  if (!revenueBranchFilter) return;
  if ((isBranchAdmin() || isBranchTeacher()) && currentBranchAssignment?.branch_id) {
    revenueBranchFilter.innerHTML = `
      <option value="${escapeHtml(currentBranchAssignment.branch_id)}">${escapeHtml(getCurrentBranchName())}</option>
    `;
    revenueBranchFilter.value = currentBranchAssignment.branch_id;
    revenueBranchFilter.disabled = true;
    return;
  }
  revenueBranchFilter.disabled = false;
  const currentValue = revenueBranchFilter.value || "all";
  const branchOptions = branches
    .filter((branch) => branch.is_active !== false)
    .map((branch) => `
      <option value="${escapeHtml(branch.id)}">${escapeHtml(branch.name)}${branch.code ? ` (${escapeHtml(branch.code)})` : ""}</option>
    `);
  revenueBranchFilter.innerHTML = ['<option value="all">ทุกสาขา</option>', ...branchOptions].join("");
  revenueBranchFilter.value = [...revenueBranchFilter.options].some((option) => option.value === currentValue)
    ? currentValue
    : "all";
}

function getFilteredRevenueEvents() {
  const branch = revenueBranchFilter?.value || "all";
  const course = revenueCourseFilter?.value || "all";
  const status = revenueStatusFilter?.value || "all";
  return branchRevenueEvents.filter((event) => {
    const matchesBranch = branch === "all" || event.branch_id === branch;
    const matchesCourse = course === "all" || event.course_type === course;
    const matchesStatus = status === "all" || event.status === status;
    return matchesBranch && matchesCourse && matchesStatus;
  });
}

function getRevenueStatusLabel(status) {
  return {
    pending: "รอตรวจ",
    confirmed: "ยืนยันแล้ว",
    cancelled: "ยกเลิก",
    refunded: "คืนเงิน"
  }[status] || status || "-";
}

function renderBranchRevenue() {
  if (!revenueRows) return;
  const rows = getFilteredRevenueEvents();
  const activeRows = rows.filter((event) => !["cancelled", "refunded"].includes(event.status));
  const totalActual = activeRows.reduce((sum, event) => sum + Number(event.actual_amount || 0), 0);
  const totalRoyaltyBase = activeRows.reduce((sum, event) => sum + Number(event.royalty_base_amount || event.actual_amount || 0), 0);
  const uniqueStudents = new Set(activeRows.map((event) => event.application_id || event.student_name).filter(Boolean)).size;
  const totalSessions = activeRows.reduce((sum, event) => sum + Number(event.total_sessions || 0), 0);

  if (revenueSummary) {
    revenueSummary.innerHTML = [
      ["เด็กที่เปิดคอร์ส", uniqueStudents],
      ["จำนวนคอร์ส", activeRows.length],
      ["จำนวนครั้งรวม", totalSessions],
      ["ยอดรับจริง", `${formatMoney(totalActual)} บาท`],
      ["ฐานค่าแฟรนไชส์", `${formatMoney(totalRoyaltyBase)} บาท`]
    ].map(([label, count]) => `
      <article>
        <strong>${escapeHtml(count)}</strong>
        <span>${escapeHtml(label)}</span>
      </article>
    `).join("");
  }

  revenueEmptyState.hidden = rows.length > 0;
  revenueRows.innerHTML = rows.map((event) => {
    const branchName = event.branches?.name || event.branch_name || "-";
    const openedBy = event.opened_by_profile?.email || event.opened_by_email || "-";
    return `
      <tr>
        <td><strong>${escapeHtml(formatDateOnly(event.event_date || event.created_at))}</strong><small>${escapeHtml(toLocalDateTimeValue(event.created_at))}</small></td>
        <td>${escapeHtml(branchName)}</td>
        <td><strong>${escapeHtml(event.student_name || "-")}</strong><small>${escapeHtml(event.student_nickname || "")}</small></td>
        <td>${getCourseIcon(event.course_type)} ${escapeHtml(courseLabels[event.course_type]?.[0] || event.course_type || "-")}</td>
        <td>${Number(event.total_sessions || 0)}</td>
        <td>${formatMoney(event.actual_amount || 0)} บาท</td>
        <td>${formatMoney(event.royalty_base_amount || event.actual_amount || 0)} บาท</td>
        <td><span class="revenue-status ${escapeHtml(event.status || "pending")}">${escapeHtml(getRevenueStatusLabel(event.status))}</span></td>
        <td><small>${escapeHtml(openedBy)}</small></td>
      </tr>
    `;
  }).join("");
}

async function loadBranchRevenue() {
  if (!revenueRows) return;
  ensureRevenueDefaultDates();
  revenueLoadingState.hidden = false;
  revenueEmptyState.hidden = true;
  revenueRows.innerHTML = "";

  if (!branches.length && isMainAdmin()) {
    const { data } = await supabaseClient
      .from("branches")
      .select("id,name,code,is_active")
      .order("name", { ascending: true });
    branches = data || branches;
  }
  renderRevenueBranchOptions();

  const fromDate = revenueDateFrom?.value || "";
  const toDate = revenueDateTo?.value || "";
  if (revenueScopeText) {
    revenueScopeText.textContent = `${fromDate || "ไม่ระบุวันเริ่ม"} ถึง ${toDate || "ไม่ระบุวันสิ้นสุด"}`;
  }

  let query = supabaseClient
    .from("course_revenue_events")
    .select("*, branches(name,code)")
    .order("event_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (fromDate) query = query.gte("event_date", fromDate);
  if (toDate) query = query.lte("event_date", toDate);
  if ((isBranchAdmin() || isBranchTeacher()) && currentBranchAssignment?.branch_id) {
    query = query.eq("branch_id", currentBranchAssignment.branch_id);
  }

  const { data, error } = await query;
  revenueLoadingState.hidden = true;
  if (error) {
    showToast(`โหลดรายรับสาขาไม่สำเร็จ: ${error.message}`, true);
    branchRevenueEvents = [];
    renderBranchRevenue();
    return;
  }

  branchRevenueEvents = data || [];
  renderBranchRevenue();
}

function exportBranchRevenueCsv() {
  const rows = getFilteredRevenueEvents();
  if (!rows.length) {
    showToast("ไม่มีรายการรายรับให้ Export", true);
    return;
  }
  const headers = [
    "วันที่เปิดคอร์ส",
    "สาขา",
    "นักเรียน",
    "ชื่อเล่น",
    "คอร์ส",
    "จำนวนครั้ง",
    "ราคาตั้งต้น",
    "ส่วนลด",
    "ยอดรับจริง",
    "ฐานแฟรนไชส์",
    "สถานะ",
    "ผู้เปิดสิทธิ์",
    "หมายเหตุ"
  ];
  const lines = [
    headers.map(csvCell).join(","),
    ...rows.map((event) => [
      event.event_date,
      event.branches?.name || event.branch_name || "",
      event.student_name,
      event.student_nickname,
      courseLabels[event.course_type]?.[0] || event.course_type,
      event.total_sessions,
      event.list_price,
      event.discount_amount,
      event.actual_amount,
      event.royalty_base_amount,
      getRevenueStatusLabel(event.status),
      event.opened_by_email || "",
      event.note || ""
    ].map(csvCell).join(","))
  ];
  const blob = new Blob([`\ufeff${lines.join("\n")}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `toko-poppy-branch-revenue-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast(`Export รายรับสำเร็จ ${rows.length} รายการ`);
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
    activeApplication.student_name || activeApplication.student_nickname || "ใบสมัครเรียน";
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
  const hasLineIdentity = Boolean(activeApplication.line_user_id);
  const pendingAccountNotice = !activeApplication.parent_user_id
    ? hasLineIdentity
      ? `
      <div class="full account-link-notice">
        <dt>สถานะบัญชีผู้ปกครอง</dt>
        <dd>ใบสมัครนี้มาจาก LINE อนุมัติแล้วจะเปิดสิทธิ์คอร์สให้ผู้ปกครองดูผ่าน LINE ได้ทันที การผูกบัญชีเว็บด้วยอีเมลทำภายหลังได้ถ้าต้องการเข้าเว็บปกติ</dd>
      </div>
    `
      : `
      <div class="full account-link-notice">
        <dt>สถานะบัญชีผู้ปกครอง</dt>
        <dd>ใบสมัครนี้ยังไม่มีบัญชีเว็บหรือ LINE ID สำหรับเปิดสิทธิ์คอร์ส กรุณาผูกบัญชีผู้ปกครองก่อนอนุมัติเปิดสิทธิ์</dd>
      </div>
    `
    : "";
  document.querySelector("#studentDetails").innerHTML = `
    ${pendingAccountNotice}
    <div><dt>ชื่อจริงสำหรับใบประกาศ</dt><dd>${escapeHtml(activeApplication.student_name || "-")}</dd></div>
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
    : activeApplication.line_user_id && !activeApplication.parent_user_id
      ? "✓ อนุมัติและเปิดสิทธิ์ LINE"
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

  const needsParentAccount = Boolean(
    activeApplication &&
    !activeApplication.parent_user_id &&
    !activeApplication.line_user_id
  );
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
    const canOpenCourseAccess = Boolean(activeApplication.parent_user_id || activeApplication.line_user_id);
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
  const approvedWithLine = Boolean(activeApplication.line_user_id);
  closeReview();
  showToast(decision === "approved"
    ? approvedWithParentAccount
      ? "อนุมัติและเปิดสิทธิ์คอร์สเรียบร้อย"
      : approvedWithLine
        ? "อนุมัติและเปิดสิทธิ์คอร์สผ่าน LINE เรียบร้อย"
        : "อนุมัติใบสมัครแล้ว แต่ยังไม่มีบัญชีหรือ LINE ID สำหรับเปิดสิทธิ์คอร์ส"
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
refreshStudentsButton?.addEventListener("click", loadStudentManagement);
addStaffStudentButton?.addEventListener("click", openStaffStudentModal);
addStaffStudentCourseButton?.addEventListener("click", () => {
  try {
    addStaffStudentCourse();
  } catch (error) {
    showToast(error.message, true);
  }
});
staffStudentCourseList?.addEventListener("click", (event) => {
  const removeButton = event.target.closest("[data-remove-staff-course]");
  if (!removeButton) return;
  const courses = readStaffStudentCourseItems();
  if (courses.length <= 1) return;
  const item = removeButton.closest("[data-staff-course-item]");
  const index = getStaffStudentCourseItems().indexOf(item);
  courses.splice(index, 1);
  renderStaffStudentCourseItems(courses);
});
staffStudentForm?.addEventListener("submit", saveStaffStudent);
document.querySelector("#closeStaffStudent")?.addEventListener("click", closeStaffStudentModal);
staffStudentModal?.addEventListener("click", (event) => {
  if (event.target === staffStudentModal) closeStaffStudentModal();
});
refreshClassRemindersButton?.addEventListener("click", loadClassReminders);
refreshRevenueButton?.addEventListener("click", loadBranchRevenue);
exportRevenueButton?.addEventListener("click", exportBranchRevenueCsv);
[
  revenueDateFrom,
  revenueDateTo,
  revenueBranchFilter,
  revenueCourseFilter,
  revenueStatusFilter
].forEach((field) => {
  field?.addEventListener("change", () => {
    if (field === revenueDateFrom || field === revenueDateTo) {
      loadBranchRevenue();
    } else {
      renderBranchRevenue();
    }
  });
});
classReminderRows?.addEventListener("click", (event) => {
  const createButton = event.target.closest("[data-create-class-reminder]");
  if (createButton) {
    openClassReminder(createButton.dataset.createClassReminder);
    return;
  }

  const markButton = event.target.closest("[data-mark-class-reminder]");
  if (markButton) markClassReminderSent(markButton.dataset.markClassReminder);
});
classReminderMessage?.addEventListener("input", () => {
  if (activeClassReminder) renderClassReminderCard(activeClassReminder, classReminderMessage.value);
});
copyClassReminderMessageButton?.addEventListener("click", () => {
  copyTextToClipboard(classReminderMessage?.value || "", "คัดลอกข้อความแจ้งเตือนแล้ว");
});
downloadClassReminderCardButton?.addEventListener("click", downloadClassReminderCard);
markClassReminderSentButton?.addEventListener("click", () => markClassReminderSent());
document.querySelector("#closeClassReminder")?.addEventListener("click", closeClassReminder);
classReminderModal?.addEventListener("click", (event) => {
  if (event.target === classReminderModal) closeClassReminder();
});
studentSearchInput?.addEventListener("input", renderStudentManagement);
studentCourseFilter?.addEventListener("change", renderStudentManagement);
studentStatusFilter?.addEventListener("change", renderStudentManagement);
studentManagementRows?.addEventListener("click", async (event) => {
  const scheduleButton = event.target.closest("[data-edit-course-schedule]");
  if (scheduleButton) {
    openCourseSchedule(scheduleButton.dataset.editCourseSchedule);
    return;
  }

  const recordButton = event.target.closest("[data-student-record-enrollment]");
  if (recordButton) {
    showAdminView("progress");
    if (!learningEnrollments.some((enrollment) => enrollment.id === recordButton.dataset.studentRecordEnrollment)) {
      await loadLearningProgress();
    }
    openRecordSession(recordButton.dataset.studentRecordEnrollment);
    return;
  }

  const editButton = event.target.closest("[data-edit-staff-student]");
  if (editButton) {
    openEditStaffStudentModal(editButton.dataset.editStaffStudent);
    return;
  }

  const deleteButton = event.target.closest("[data-delete-student-application]");
  if (deleteButton) {
    deleteStudentRecord(deleteButton.dataset.deleteStudentApplication, deleteButton.dataset.studentName);
  }
});
learningSearchInput?.addEventListener("input", renderLearningProgress);
learningCourseFilter?.addEventListener("change", renderLearningProgress);
learningStatusFilter?.addEventListener("change", renderLearningProgress);
learningTeacherSummary?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-learning-summary-filter]");
  if (!button || !learningStatusFilter) return;
  learningStatusFilter.value = button.dataset.learningSummaryFilter || "active";
  renderLearningProgress();
});
learningFollowupQueue?.addEventListener("click", (event) => {
  const filterButton = event.target.closest("[data-learning-summary-filter]");
  if (filterButton && learningStatusFilter) {
    learningStatusFilter.value = filterButton.dataset.learningSummaryFilter || "active";
    renderLearningProgress();
    return;
  }

  const recordButton = event.target.closest("[data-queue-record-enrollment]");
  if (recordButton) openRecordSession(recordButton.dataset.queueRecordEnrollment);
});
learningProgressRows?.addEventListener("click", (event) => {
  const scheduleButton = event.target.closest("[data-edit-course-schedule]");
  if (scheduleButton) {
    openCourseSchedule(scheduleButton.dataset.editCourseSchedule);
    return;
  }

  const detailButton = event.target.closest("[data-student-detail]");
  if (detailButton) {
    const detailPanel = document.getElementById(detailButton.dataset.studentDetail);
    if (!detailPanel) return;
    const isOpening = detailPanel.hidden;
    detailPanel.hidden = !isOpening;
    detailButton.setAttribute("aria-expanded", String(isOpening));
    detailButton.textContent = isOpening ? "ซ่อนข้อมูลเด็ก" : "ดูข้อมูลเด็ก";
    if (isOpening) loadLearningStudentTimeline(detailButton.dataset.studentDetail);
    return;
  }

  const button = event.target.closest("[data-record-enrollment]");
  if (button) openRecordSession(button.dataset.recordEnrollment);
});
recordSessionForm?.addEventListener("submit", previewLearningSession);
courseScheduleForm?.addEventListener("submit", saveCourseSchedule);
clearCourseScheduleButton?.addEventListener("click", clearCourseSchedule);
document.querySelector("#closeCourseSchedule")?.addEventListener("click", closeCourseSchedule);
courseScheduleModal?.addEventListener("click", (event) => {
  if (event.target === courseScheduleModal) closeCourseSchedule();
});
recordSessionPhoto?.addEventListener("change", () => {
  renderLearningPhotoPreview();
  markSessionPreviewDirty();
});
confirmSaveSessionButton?.addEventListener("click", confirmSaveLearningSession);
copySessionShareTextButton?.addEventListener("click", copySessionShareText);
downloadSessionShareCardButton?.addEventListener("click", downloadSessionShareCard);
[
  recordSessionNumber,
  recordSessionDate,
  recordLessonTitle,
  recordTeacherComment,
  recordSessionPhoto
].forEach((field) => {
  field?.addEventListener("input", markSessionPreviewDirty);
});
refreshSessionHistory?.addEventListener("click", () => {
  if (activeLearningEnrollment) loadLearningSessionHistory(activeLearningEnrollment.id);
});
teacherCommentTemplates?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-comment-template]");
  if (!button || !recordTeacherComment) return;
  const template = button.dataset.commentTemplate || "";
  const currentComment = recordTeacherComment.value.trim();
  recordTeacherComment.value = currentComment ? `${currentComment}\n${template}` : template;
  markSessionPreviewDirty();
  recordTeacherComment.focus();
});
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
  if (courseScheduleModal?.classList.contains("open")) {
    closeCourseSchedule();
    return;
  }
  if (staffStudentModal?.classList.contains("open")) {
    closeStaffStudentModal();
    return;
  }
  if (classReminderModal?.classList.contains("open")) {
    closeClassReminder();
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
