const config = window.SUPABASE_CONFIG || {};
const configured = config.url && config.anonKey &&
  !config.url.includes("YOUR_PROJECT") &&
  !config.anonKey.includes("YOUR_SUPABASE");
const client = configured
  ? window.supabase.createClient(config.url, config.anonKey)
  : null;

const accessScreen = document.querySelector("#accessScreen");
const loginForm = document.querySelector("#artLoginForm");
const studioSection = document.querySelector("#studioSection");
const categoryTabs = document.querySelector("#categoryTabs");
const artLibrary = document.querySelector("#artLibrary");
const lessonModal = document.querySelector("#lessonModal");
const videoStage = document.querySelector("#videoStage");
const inspirationGrid = document.querySelector("#inspirationGrid");
const completeButton = document.querySelector("#completeLesson");
const toast = document.querySelector("#artToast");

let user = null;
let application = null;
let categories = [];
let levels = [];
let lessons = [];
let completedLessonIds = new Set();
let activeCategoryId = "all";
let activeLesson = null;

function showToast(message, error = false) {
  toast.textContent = message;
  toast.classList.toggle("error", error);
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 3200);
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

function setAccessMessage(kicker, title, message, showLogin = false) {
  document.querySelector("#accessKicker").textContent = kicker;
  document.querySelector("#accessTitle").textContent = title;
  document.querySelector("#accessMessage").textContent = message;
  loginForm.hidden = !showLogin;
}

async function hasArtAccess() {
  const { data, error } = await client
    .from("enrollment_applications")
    .select("student_name,status,art_access")
    .eq("parent_user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

async function signedUrl(bucket, path, expiresIn = 3600) {
  if (!path) return null;
  const { data, error } = await client.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);
  if (error) throw error;
  return data.signedUrl;
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

function updateProgress() {
  const total = lessons.length;
  const completed = completedLessonIds.size;
  document.querySelector("#artProgressText").textContent = `${completed}/${total}`;
  document.querySelector("#artProgressBar").style.width =
    total ? `${(completed / total) * 100}%` : "0%";
  document.querySelector("#lessonCount").textContent = total;
}

function renderCategoryTabs() {
  const tabs = [
    { id: "all", title: "ทั้งหมด" },
    ...categories
  ];
  categoryTabs.innerHTML = tabs.map((category) => `
    <button class="category-tab ${activeCategoryId === category.id ? "active" : ""}"
      type="button" data-category-id="${category.id}">
      ${escapeHtml(category.title)}
    </button>
  `).join("");
}

function lessonCategory(lesson) {
  return categories.find(({ id }) => id === lesson.category_id);
}

function lessonLevel(lesson) {
  return levels.find(({ id }) => id === lesson.level_id);
}

function renderLibrary() {
  renderCategoryTabs();
  const visibleCategories = activeCategoryId === "all"
    ? categories
    : categories.filter(({ id }) => id === activeCategoryId);

  artLibrary.innerHTML = visibleCategories.map((category) => {
    const categoryLevels = levels.filter((level) => level.category_id === category.id);
    const categoryLessons = lessons.filter((lesson) => lesson.category_id === category.id);
    const levelBlocks = categoryLevels.length
      ? categoryLevels.map((level) => renderLevelBlock(category, level)).join("")
      : renderLooseLessonsBlock(category, categoryLessons);

    return `
      <section class="category-block">
        ${levelBlocks}
      </section>
    `;
  }).join("");

  if (!lessons.length) {
    artLibrary.innerHTML =
      '<div class="empty-card">คุณครูกำลังเตรียมบทเรียนศิลปะบทแรกอยู่</div>';
  }
  updateProgress();
}

function renderLevelBlock(category, level) {
  const levelLessons = lessons.filter((lesson) => lesson.level_id === level.id);
  return `
    <article class="level-block">
      <div class="level-heading">
        <span class="level-number">${level.level_number ? `L${level.level_number}` : "★"}</span>
        <div>
          <h3>${escapeHtml(category.title)} · ${escapeHtml(level.title)}</h3>
          <p>${escapeHtml(level.subtitle || category.subtitle || "")}</p>
        </div>
      </div>
      ${renderLessonGrid(levelLessons)}
    </article>
  `;
}

function renderLooseLessonsBlock(category, categoryLessons) {
  return `
    <article class="level-block">
      <div class="level-heading">
        <span class="level-number">★</span>
        <div>
          <h3>${escapeHtml(category.title)}</h3>
          <p>${escapeHtml(category.subtitle || "เลือกบทเรียนแล้วเริ่มสร้างผลงานไปด้วยกัน")}</p>
        </div>
      </div>
      ${renderLessonGrid(categoryLessons)}
    </article>
  `;
}

function renderLessonGrid(levelLessons) {
  if (!levelLessons.length) {
    return '<div class="empty-card">ยังไม่มีบทเรียนในหัวข้อนี้</div>';
  }
  return `
    <div class="lesson-grid">
      ${levelLessons.map((lesson, index) => `
        <button class="lesson-card" type="button" data-lesson-id="${lesson.id}">
          <span class="badge">${String(index + 1).padStart(2, "0")}</span>
          <span class="complete-mark">${completedLessonIds.has(lesson.id) ? "✓" : "▶"}</span>
          <h4>${escapeHtml(lesson.title)}</h4>
          <p>${escapeHtml(lesson.story_prompt || "ดูวิดีโอ แล้วสร้างผลงานของตัวเอง")}</p>
        </button>
      `).join("")}
    </div>
  `;
}

async function openLesson(lessonId) {
  activeLesson = lessons.find(({ id }) => id === lessonId);
  if (!activeLesson) return;

  const category = lessonCategory(activeLesson);
  const level = lessonLevel(activeLesson);
  document.querySelector("#lessonPath").textContent =
    [category?.title, level?.title].filter(Boolean).join(" · ") || "ศิลปะ";
  document.querySelector("#lessonModalTitle").textContent = activeLesson.title;
  document.querySelector("#lessonModalDescription").textContent =
    activeLesson.story_prompt || "ดูวิดีโอ แล้วเริ่มสร้างผลงานไปพร้อมกับ Toko & Poppy";
  completeButton.disabled = completedLessonIds.has(activeLesson.id);
  completeButton.innerHTML = completeButton.disabled
    ? "เรียนบทนี้แล้ว ✓"
    : 'เรียนบทนี้แล้ว <span>★</span>';
  videoStage.innerHTML = '<div class="media-loading">กำลังเตรียมวิดีโอ...</div>';
  inspirationGrid.innerHTML = '<div class="empty-card">กำลังโหลดภาพตัวอย่าง...</div>';
  lessonModal.classList.add("open");
  lessonModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  try {
    const embed = activeLesson.video_url ? youtubeEmbed(activeLesson.video_url) : null;
    if (embed) {
      videoStage.innerHTML =
        `<iframe src="${escapeHtml(embed)}" title="วิดีโอศิลปะ" allowfullscreen></iframe>`;
    } else if (activeLesson.video_url) {
      videoStage.innerHTML =
        `<video controls playsinline src="${escapeHtml(activeLesson.video_url)}"></video>`;
    } else if (activeLesson.video_path) {
      const videoUrl = await signedUrl("art-videos", activeLesson.video_path);
      videoStage.innerHTML =
        `<video controls playsinline src="${escapeHtml(videoUrl)}"></video>`;
    } else {
      videoStage.innerHTML =
        '<div class="media-loading">บทเรียนนี้ยังไม่มีวิดีโอ</div>';
    }

    const images = activeLesson.art_lesson_images || [];
    if (!images.length) {
      inspirationGrid.innerHTML =
        '<div class="empty-card">ยังไม่มีภาพตัวอย่างสำหรับบทเรียนนี้</div>';
      return;
    }
    const cards = await Promise.all(images.map(async (image) => {
      const imageUrl = await signedUrl("art-gallery", image.image_path);
      return `
        <figure class="inspiration-card">
          <img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(image.caption || activeLesson.title)}">
          <p>${escapeHtml(image.caption || "ตัวอย่างผลงาน")}</p>
        </figure>
      `;
    }));
    inspirationGrid.innerHTML = cards.join("");
  } catch (error) {
    showToast(`เปิดบทเรียนไม่สำเร็จ: ${error.message}`, true);
  }
}

function closeLesson() {
  lessonModal.classList.remove("open");
  lessonModal.setAttribute("aria-hidden", "true");
  videoStage.innerHTML = "";
  inspirationGrid.innerHTML = "";
  activeLesson = null;
  document.body.style.overflow = "";
}

async function loadCourse() {
  application = await hasArtAccess();
  if (!application || application.status !== "approved" || !application.art_access) {
    setAccessMessage(
      "ยังไม่เปิดสิทธิ์",
      "คอร์สศิลปะยังถูกล็อกอยู่",
      "บัญชีนี้ยังไม่ได้รับการอนุมัติคอร์สศิลปะ กรุณารอแอดมินตรวจสอบสลิป"
    );
    return;
  }

  const [
    { data: categoryData, error: categoryError },
    { data: levelData, error: levelError },
    { data: lessonData, error: lessonError },
    { data: progressData, error: progressError }
  ] = await Promise.all([
    client.from("art_categories").select("*").order("sort_order"),
    client.from("art_levels").select("*").order("sort_order"),
    client
      .from("art_lessons")
      .select("*, art_lesson_images(*)")
      .order("sort_order"),
    client.from("art_lesson_progress").select("lesson_id")
  ]);
  if (categoryError) throw categoryError;
  if (levelError) throw levelError;
  if (lessonError) throw lessonError;
  if (progressError) throw progressError;

  categories = categoryData || [];
  levels = levelData || [];
  lessons = (lessonData || []).map((lesson) => ({
    ...lesson,
    art_lesson_images: (lesson.art_lesson_images || [])
      .sort((a, b) => a.sort_order - b.sort_order)
  }));
  completedLessonIds = new Set((progressData || []).map(({ lesson_id: id }) => id));
  document.querySelector("#studentWelcome").textContent =
    `ยินดีต้อนรับ ${application.student_name} เลือกนิทานศิลปะที่อยากเรียนได้เลย!`;
  document.querySelector("#artLogout").hidden = false;
  accessScreen.hidden = true;
  studioSection.hidden = false;
  renderLibrary();
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = loginForm.querySelector("button");
  const data = new FormData(loginForm);
  button.disabled = true;
  button.textContent = "กำลังเปิดห้องศิลปะ...";
  const { data: authData, error } = await client.auth.signInWithPassword({
    email: data.get("email"),
    password: data.get("password")
  });
  button.disabled = false;
  button.innerHTML = 'เข้าสู่ห้องเรียน <span>→</span>';
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

categoryTabs.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category-id]");
  if (!button) return;
  activeCategoryId = button.dataset.categoryId;
  renderLibrary();
});

artLibrary.addEventListener("click", (event) => {
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
  const { error } = await client.from("art_lesson_progress").insert({
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
  renderLibrary();
  document.querySelector("#celebration").classList.add("open");
  document.querySelector("#celebration").setAttribute("aria-hidden", "false");
});

document.querySelector("#closeCelebration").addEventListener("click", () => {
  document.querySelector("#celebration").classList.remove("open");
  document.querySelector("#celebration").setAttribute("aria-hidden", "true");
});

document.querySelector("#artLogout").addEventListener("click", async () => {
  await client.auth.signOut();
  location.reload();
});

async function boot() {
  if (!configured) {
    setAccessMessage(
      "ยังไม่ได้เชื่อม Supabase",
      "กรุณาตั้งค่า Supabase ก่อน",
      "ใส่ Project URL และ anon key ในไฟล์ supabase-config.js"
    );
    return;
  }
  const { data } = await client.auth.getSession();
  if (!data.session?.user) {
    setAccessMessage(
      "เข้าสู่ระบบก่อนนะ",
      "เปิดห้องเรียนศิลปะ",
      "ใช้บัญชีผู้ปกครองที่ได้รับอนุมัติคอร์สศิลปะแล้ว",
      true
    );
    return;
  }
  user = data.session.user;
  try {
    await loadCourse();
  } catch (error) {
    showToast(error.message, true);
    setAccessMessage("เปิดบทเรียนไม่สำเร็จ", "มีบางอย่างติดขัด", error.message);
  }
}

boot();
