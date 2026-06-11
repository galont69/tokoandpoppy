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
const loginForm = document.querySelector("#adminLoginForm");
const configWarning = document.querySelector("#configWarning");
const rows = document.querySelector("#applicationRows");
const emptyState = document.querySelector("#emptyState");
const loadingState = document.querySelector("#loadingState");
const reviewModal = document.querySelector("#reviewModal");
const slipFrame = document.querySelector("#slipFrame");
const openSlipLink = document.querySelector("#openSlipLink");
const toast = document.querySelector("#adminToast");
const robotAccess = document.querySelector("#robotAccess");
const artAccess = document.querySelector("#artAccess");
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

let applications = [];
let activeStatus = "all";
let activeApplication = null;
let robotLessons = [];
let activeLesson = null;
let artCategories = [];
let artLevels = [];
let artLessons = [];
let activeArtLesson = null;

const courseLabels = {
  robot: ["โรบอท + โค้ดดิ้ง", "SPIKE Essential"],
  art: ["คอร์สศิลปะ", "Creative Art"],
  both: ["ทั้งสองคอร์ส", "Robot + Creative Art"]
};

const statusLabels = {
  pending: "รอตรวจสอบ",
  approved: "อนุมัติแล้ว",
  rejected: "ไม่อนุมัติ"
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

async function verifyAdmin(user) {
  const { data, error } = await supabaseClient
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error || data?.role !== "admin") {
    await supabaseClient.auth.signOut();
    throw new Error("บัญชีนี้ไม่มีสิทธิ์ผู้ดูแลระบบ");
  }
}

async function showDashboard(user) {
  await verifyAdmin(user);
  document.querySelector("#adminEmail").textContent = user.email;
  document.querySelector(".profile-avatar").textContent =
    (user.email?.[0] || "A").toUpperCase();
  loginView.hidden = true;
  shell.hidden = false;
  await loadApplications();
}

async function loadApplications() {
  loadingState.hidden = false;
  emptyState.hidden = true;
  rows.innerHTML = "";

  const { data, error } = await supabaseClient
    .from("enrollment_applications")
    .select("*")
    .order("created_at", { ascending: false });

  loadingState.hidden = true;
  if (error) {
    showToast(`โหลดข้อมูลไม่สำเร็จ: ${error.message}`, true);
    return;
  }

  applications = data || [];
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
  document.querySelectorAll(".admin-view").forEach((view) => {
    view.hidden = view.id !== `${viewName}View`;
  });
  document.querySelectorAll("[data-admin-view]").forEach((button) => {
    button.classList.toggle("active", button.dataset.adminView === viewName);
  });
  const viewCopy = {
    applications: ["ใบสมัครเรียน", "ศูนย์จัดการสมาชิก"],
    lessons: ["จัดการบทเรียนโรบอท", "ROBOT COURSE STUDIO"],
    art: ["จัดการบทเรียนศิลปะ", "ART COURSE STUDIO"]
  };
  const [title, kicker] = viewCopy[viewName] || viewCopy.applications;
  document.querySelector(".topbar h1").textContent = title;
  document.querySelector(".page-kicker").textContent = kicker;
  document.querySelector(".sidebar").classList.remove("open");
  if (viewName === "lessons") loadRobotLessons();
  if (viewName === "art") loadArtStudio();
}

function renderApplications() {
  const query = document.querySelector("#searchInput").value.trim().toLowerCase();
  const filtered = applications.filter((application) => {
    const matchesStatus =
      activeStatus === "all" || application.status === activeStatus;
    const haystack = [
      application.student_name,
      application.parent_email,
      application.parent_phone
    ].join(" ").toLowerCase();
    return matchesStatus && haystack.includes(query);
  });

  rows.innerHTML = filtered.map((application) => {
    const [courseName, courseDescription] =
      courseLabels[application.course] || [application.course, ""];
    const approvedCourses = [
      application.robot_access ? "โรบอท" : "",
      application.art_access ? "ศิลปะ" : ""
    ].filter(Boolean).join(" + ");

    return `
      <tr>
        <td>
          <div class="student-cell">
            <span class="student-avatar">🧒</span>
            <div>
              <strong>${escapeHtml(application.student_name)}</strong>
              <small>${escapeHtml(application.parent_email)}</small>
              <small>${escapeHtml(application.parent_phone)}</small>
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
          </div>
        </td>
        <td>
          <button class="slip-button" type="button" data-review-id="${application.id}">
            🧾 ดูสลิป
          </button>
        </td>
        <td class="date-cell">
          <strong>${formatDate(application.created_at).split(" เวลา ")[0]}</strong>
          <small>${formatDate(application.created_at)}</small>
        </td>
        <td><span class="status-pill ${application.status}">${statusLabels[application.status]}</span></td>
        <td><button class="review-button" type="button" data-review-id="${application.id}">
          ${application.status === "pending" ? "ตรวจสอบ" : "ดูรายละเอียด"}
        </button></td>
      </tr>
    `;
  }).join("");

  emptyState.hidden = filtered.length > 0;
}

async function openReview(applicationId) {
  activeApplication = applications.find(({ id }) => id === applicationId);
  if (!activeApplication) return;

  document.querySelector("#reviewTitle").textContent =
    activeApplication.student_name;
  document.querySelector("#reviewSubtitle").textContent =
    `สมัครเมื่อ ${formatDate(activeApplication.created_at)}`;

  const [courseName] =
    courseLabels[activeApplication.course] || [activeApplication.course];
  document.querySelector("#studentDetails").innerHTML = `
    <div><dt>อีเมลผู้ปกครอง</dt><dd>${escapeHtml(activeApplication.parent_email)}</dd></div>
    <div><dt>เบอร์โทรศัพท์</dt><dd>${escapeHtml(activeApplication.parent_phone)}</dd></div>
    <div><dt>คอร์สที่สมัคร</dt><dd>${escapeHtml(courseName)}</dd></div>
    <div><dt>สถานะการชำระเงิน</dt><dd>${escapeHtml(activeApplication.payment_status)}</dd></div>
  `;

  robotAccess.checked = activeApplication.status === "pending"
    ? ["robot", "both"].includes(activeApplication.course)
    : activeApplication.robot_access;
  artAccess.checked = activeApplication.status === "pending"
    ? ["art", "both"].includes(activeApplication.course)
    : activeApplication.art_access;
  rejectionReason.value = activeApplication.rejection_reason || "";
  approveButton.textContent = activeApplication.status === "approved"
    ? "✓ บันทึกสิทธิ์คอร์ส"
    : "✓ อนุมัติและเปิดสิทธิ์";

  reviewModal.classList.add("open");
  reviewModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  slipFrame.innerHTML = '<div class="slip-loading">กำลังโหลดรูปสลิป...</div>';
  openSlipLink.removeAttribute("href");

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

function closeReview() {
  reviewModal.classList.remove("open");
  reviewModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  activeApplication = null;
}

async function reviewApplication(decision) {
  if (!activeApplication) return;
  if (decision === "approved" && !robotAccess.checked && !artAccess.checked) {
    showToast("กรุณาเลือกอย่างน้อยหนึ่งคอร์ส", true);
    return;
  }
  if (decision === "rejected" && !rejectionReason.value.trim()) {
    showToast("กรุณาระบุเหตุผลที่ไม่อนุมัติ", true);
    rejectionReason.focus();
    return;
  }

  setBusy(true);
  const { error } = await supabaseClient.rpc("review_enrollment", {
    p_application_id: activeApplication.id,
    p_decision: decision,
    p_robot_access: robotAccess.checked,
    p_art_access: artAccess.checked,
    p_rejection_reason: rejectionReason.value.trim() || null
  });
  setBusy(false);

  if (error) {
    showToast(`บันทึกไม่สำเร็จ: ${error.message}`, true);
    return;
  }

  closeReview();
  showToast(decision === "approved"
    ? "อนุมัติและเปิดสิทธิ์คอร์สเรียบร้อย"
    : "บันทึกการไม่อนุมัติเรียบร้อย");
  await loadApplications();
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
  return fileName
    .normalize("NFKD")
    .replace(/[^\w.-]+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
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
        ? "พร้อมเผยแพร่บทเรียนศิลปะ"
        : "มีวิดีโอแล้ว แนะนำเพิ่มภาพตัวอย่างก่อนเผยแพร่";
    readiness.classList.add(imageCount ? "ready" : "warning");
    saveButton.textContent = "บันทึกบทเรียนศิลปะ";
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
  if (activeArtLesson) selectArtLesson(activeArtLesson.id);
}

async function createArtLesson() {
  if (!artCategories.length) {
    showToast("ยังไม่มีหมวดศิลปะ กรุณารัน SQL สำหรับสร้างหมวดก่อน", true);
    return;
  }
  const categoryId = selectedArtCategoryId();
  const levelId =
    artLevelFilter.value !== "all"
      ? artLevelFilter.value
      : artLevels.find((level) => level.category_id === categoryId)?.id || null;
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
  if (!file || !activeArtLesson) return;
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
  if (!files.length || !activeArtLesson) return;
  const invalid = files.find((file) =>
    file.size > 8 * 1024 * 1024 ||
    !["image/jpeg", "image/png", "image/webp"].includes(file.type));
  if (invalid) {
    input.value = "";
    showToast("รูปต้องเป็น PNG, JPG หรือ WEBP และไม่เกิน 8 MB ต่อรูป", true);
    return;
  }

  const caption = document.querySelector("#artImageCaption").value.trim();
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
    await loadArtStudio();
    selectArtLesson(activeArtLesson.id);
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
artImageList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-delete-art-image]");
  if (button) deleteArtImage(button.dataset.deleteArtImage);
});

artEditor.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!activeArtLesson) return;

  const title = document.querySelector("#artLessonTitle").value.trim();
  const storyPrompt = document.querySelector("#artLessonPrompt").value.trim();
  const videoUrl = document.querySelector("#artVideoUrl").value.trim();
  const categoryId = artCategorySelect.value;
  const levelId = artLevelSelect.value || null;
  const publish = document.querySelector("#artLessonPublished").checked;

  if (publish && !(activeArtLesson.video_path || videoUrl)) {
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

    showToast("บันทึกบทเรียนศิลปะแล้ว");
    activeArtLesson = { ...activeArtLesson, category_id: categoryId, level_id: levelId };
    await loadArtStudio();
    selectArtLesson(activeArtLesson.id);
  } catch (error) {
    showToast(`บันทึกบทเรียนศิลปะไม่สำเร็จ: ${error.message}`, true);
  } finally {
    saveButton.disabled = false;
    artUploadProgress.hidden = true;
  }
});

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
    showToast(`เข้าสู่ระบบไม่สำเร็จ: ${error.message}`, true);
    return;
  }

  try {
    await showDashboard(data.user);
  } catch (adminError) {
    showToast(adminError.message, true);
  }
});

document.querySelector("#logoutButton").addEventListener("click", async () => {
  await supabaseClient.auth.signOut();
  shell.hidden = true;
  loginView.hidden = false;
  loginForm.reset();
});

document.querySelector("#refreshButton").addEventListener("click", loadApplications);
document.querySelector("#searchInput").addEventListener("input", renderApplications);
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
document.querySelector("#closeReview").addEventListener("click", closeReview);
reviewModal.addEventListener("click", (event) => {
  if (event.target === reviewModal) closeReview();
});
document.querySelector("#approveButton").addEventListener("click", () =>
  reviewApplication("approved"));
document.querySelector("#rejectButton").addEventListener("click", () =>
  reviewApplication("rejected"));
document.querySelector("#menuButton").addEventListener("click", () =>
  document.querySelector(".sidebar").classList.toggle("open"));
document.querySelectorAll("[data-admin-view]").forEach((button) => {
  button.addEventListener("click", () =>
    showAdminView(button.dataset.adminView));
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
  if (event.key === "Escape" && reviewModal.classList.contains("open")) {
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
