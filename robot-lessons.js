const config = window.SUPABASE_CONFIG || {};
const configured = config.url && config.anonKey &&
  !config.url.includes("YOUR_PROJECT") &&
  !config.anonKey.includes("YOUR_SUPABASE");
const client = configured
  ? window.supabase.createClient(config.url, config.anonKey)
  : null;

const accessScreen = document.querySelector("#accessScreen");
const loginForm = document.querySelector("#robotLoginForm");
const missionSection = document.querySelector("#missionSection");
const missionMap = document.querySelector("#missionMap");
const lessonModal = document.querySelector("#lessonModal");
const videoStage = document.querySelector("#videoStage");
const pdfStage = document.querySelector("#pdfStage");
const completeButton = document.querySelector("#completeLesson");
const toast = document.querySelector("#robotToast");

let user = null;
let lessons = [];
let completedLessonIds = new Set();
let activeLesson = null;

function showToast(message, error = false) {
  toast.textContent = message;
  toast.classList.toggle("error", error);
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 3000);
}

function setAccessMessage(kicker, title, message, showLogin = false) {
  document.querySelector("#accessKicker").textContent = kicker;
  document.querySelector("#accessTitle").textContent = title;
  document.querySelector("#accessMessage").textContent = message;
  loginForm.hidden = !showLogin;
}

async function hasRobotAccess() {
  const { data, error } = await client
    .from("enrollment_applications")
    .select("student_name,status,robot_access")
    .eq("parent_user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

function renderMissionMap() {
  const lessonByNumber = new Map(
    lessons.map((lesson) => [lesson.lesson_number, lesson])
  );
  missionMap.innerHTML = Array.from({ length: 31 }, (_, index) => {
    const number = index + 1;
    const lesson = lessonByNumber.get(number);
    const completed = lesson && completedLessonIds.has(lesson.id);
    const status = completed ? "🏅" : lesson ? "▶" : "🔒";
    return `
      <button class="mission-card ${lesson ? "ready" : "locked"} ${completed ? "completed" : ""}"
        type="button" ${lesson ? `data-lesson-id="${lesson.id}"` : "disabled"}>
        <span class="mission-number">${String(number).padStart(2, "0")}</span>
        <span class="mission-status">${status}</span>
        <h3>${lesson ? escapeHtml(lesson.title) : `ภารกิจที่ ${number}`}</h3>
        <p>${lesson ? escapeHtml(lesson.description || "พร้อมออกเดินทางแล้ว!") : "คุณครูกำลังเตรียมเรื่องราวบทนี้"}</p>
      </button>
    `;
  }).join("");
  updateProgress();
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;",
    '"': "&quot;", "'": "&#039;"
  })[character]);
}

function updateProgress() {
  const completed = completedLessonIds.size;
  document.querySelector("#headerProgressText").textContent = `${completed}/31`;
  document.querySelector("#headerProgressBar").style.width =
    `${(completed / 31) * 100}%`;
  document.querySelector("#stampCount").textContent = completed;
}

function youtubeEmbed(url) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}`;
    }
    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
      if (parsed.pathname.startsWith("/embed/")) return url;
    }
  } catch {
    return null;
  }
  return null;
}

async function signedUrl(bucket, path, expiresIn = 3600) {
  if (!path) return null;
  const { data, error } = await client.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);
  if (error) throw error;
  return data.signedUrl;
}

async function openLesson(lessonId) {
  activeLesson = lessons.find(({ id }) => id === lessonId);
  if (!activeLesson) return;
  document.querySelector("#lessonNumber").textContent =
    `ภารกิจ ${String(activeLesson.lesson_number).padStart(2, "0")}`;
  document.querySelector("#lessonModalTitle").textContent = activeLesson.title;
  document.querySelector("#lessonModalDescription").textContent =
    activeLesson.description || "ดูวิดีโอ แล้วเริ่มสร้างไปพร้อมกับ Toko!";
  completeButton.disabled = completedLessonIds.has(activeLesson.id);
  completeButton.innerHTML = completeButton.disabled
    ? "ทำภารกิจนี้สำเร็จแล้ว ✓"
    : 'ภารกิจสำเร็จ! <span>★</span>';
  videoStage.innerHTML = '<div class="media-loading">กำลังเตรียมวิดีโอ...</div>';
  pdfStage.innerHTML = '<div class="media-loading">กำลังเปิดแบบต่อ...</div>';
  lessonModal.classList.add("open");
  lessonModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  try {
    const embed = activeLesson.video_url
      ? youtubeEmbed(activeLesson.video_url)
      : null;
    if (embed) {
      videoStage.innerHTML =
        `<iframe src="${escapeHtml(embed)}" title="วิดีโอบทเรียน" allowfullscreen></iframe>`;
    } else if (activeLesson.video_url) {
      videoStage.innerHTML =
        `<video controls playsinline src="${escapeHtml(activeLesson.video_url)}"></video>`;
    } else {
      const videoUrl = await signedUrl(
        "robot-videos",
        activeLesson.video_path
      );
      videoStage.innerHTML =
        `<video controls playsinline src="${escapeHtml(videoUrl)}"></video>`;
    }

    const pdfUrl = await signedUrl(
      "robot-instructions",
      activeLesson.instruction_pdf_path
    );
    pdfStage.innerHTML =
      `<iframe src="${escapeHtml(pdfUrl)}#toolbar=1&navpanes=0" title="แบบต่อ LEGO PDF"></iframe>`;
    document.querySelector("#openPdfLink").href = pdfUrl;
  } catch (error) {
    showToast(`เปิดสื่อไม่สำเร็จ: ${error.message}`, true);
  }
}

function closeLesson() {
  lessonModal.classList.remove("open");
  lessonModal.setAttribute("aria-hidden", "true");
  videoStage.innerHTML = "";
  pdfStage.innerHTML = "";
  activeLesson = null;
  document.body.style.overflow = "";
}

async function loadCourse() {
  const application = await hasRobotAccess();
  if (!application || application.status !== "approved" ||
      !application.robot_access) {
    setAccessMessage(
      "ยังไม่เปิดสิทธิ์",
      "คอร์สโรบอทยังถูกล็อกอยู่",
      "บัญชีนี้ยังไม่ได้รับการอนุมัติคอร์สโรบอท กรุณารอแอดมินตรวจสอบสลิป"
    );
    return;
  }

  const [{ data: lessonData, error: lessonError },
    { data: progressData, error: progressError }] = await Promise.all([
    client.from("robot_lessons").select("*").order("lesson_number"),
    client.from("robot_lesson_progress").select("lesson_id")
  ]);
  if (lessonError) throw lessonError;
  if (progressError) throw progressError;

  lessons = lessonData || [];
  completedLessonIds = new Set(
    (progressData || []).map(({ lesson_id: id }) => id)
  );
  document.querySelector("#studentWelcome").textContent =
    `ยินดีต้อนรับ ${application.student_name} พร้อมเริ่มภารกิจแล้ว!`;
  document.querySelector("#robotLogout").hidden = false;
  accessScreen.hidden = true;
  missionSection.hidden = false;
  renderMissionMap();
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = loginForm.querySelector("button");
  const data = new FormData(loginForm);
  button.disabled = true;
  button.textContent = "กำลังเปิดประตู...";
  const { data: authData, error } = await client.auth.signInWithPassword({
    email: data.get("email"),
    password: data.get("password")
  });
  button.disabled = false;
  button.innerHTML = 'เข้าสู่บทเรียน <span>→</span>';
  if (error) {
    showToast(`เข้าสู่ระบบไม่สำเร็จ: ${error.message}`, true);
    return;
  }
  user = authData.user;
  try {
    await loadCourse();
  } catch (courseError) {
    showToast(courseError.message, true);
  }
});

missionMap.addEventListener("click", (event) => {
  const button = event.target.closest("[data-lesson-id]");
  if (button) openLesson(button.dataset.lessonId);
});
document.querySelector("#closeLesson").addEventListener("click", closeLesson);
lessonModal.addEventListener("click", (event) => {
  if (event.target === lessonModal) closeLesson();
});
completeButton.addEventListener("click", async () => {
  if (!activeLesson || completedLessonIds.has(activeLesson.id)) return;
  completeButton.disabled = true;
  const { error } = await client.from("robot_lesson_progress").insert({
    user_id: user.id,
    lesson_id: activeLesson.id
  });
  if (error && error.code !== "23505") {
    completeButton.disabled = false;
    showToast(`บันทึกความคืบหน้าไม่สำเร็จ: ${error.message}`, true);
    return;
  }
  completedLessonIds.add(activeLesson.id);
  closeLesson();
  renderMissionMap();
  document.querySelector("#celebration").classList.add("open");
  document.querySelector("#celebration").setAttribute("aria-hidden", "false");
});
document.querySelector("#closeCelebration").addEventListener("click", () => {
  document.querySelector("#celebration").classList.remove("open");
  document.querySelector("#celebration").setAttribute("aria-hidden", "true");
});
document.querySelector("#robotLogout").addEventListener("click", async () => {
  await client.auth.signOut();
  location.reload();
});

async function boot() {
  if (!configured) {
    setAccessMessage(
      "ยังไม่ได้เชื่อมระบบ",
      "กรุณาตั้งค่า Supabase",
      "ใส่ Project URL และ anon key ในไฟล์ supabase-config.js"
    );
    return;
  }
  const { data } = await client.auth.getSession();
  user = data.session?.user || null;
  if (!user) {
    setAccessMessage(
      "สำหรับนักเรียน",
      "เข้าสู่ระบบก่อนเริ่มภารกิจ",
      "ใช้บัญชีผู้ปกครองที่ได้รับการอนุมัติคอร์สโรบอทแล้ว",
      true
    );
    return;
  }
  try {
    await loadCourse();
  } catch (error) {
    setAccessMessage("เกิดข้อผิดพลาด", "เปิดบทเรียนไม่สำเร็จ", error.message);
  }
}

boot();
