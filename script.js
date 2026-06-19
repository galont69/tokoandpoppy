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
const parentProfileModal = document.querySelector("#parentProfileModal");
const parentProfileForm = document.querySelector("#parentProfileForm");
const closeParentProfileButton = document.querySelector("#closeParentProfile");
const myLearningSection = document.querySelector("#myLearning");
const learningHomeTitle = document.querySelector("#learningHomeTitle");
const learningHomeSubtitle = document.querySelector("#learningHomeSubtitle");
const learningStatus = document.querySelector("#learningStatus");
const learningCourseGrid = document.querySelector("#learningCourseGrid");
const openLearningProgressButton = document.querySelector("#openLearningProgress");
const openLearnerProfileButton = document.querySelector("#openLearnerProfile");
const showSalePageButton = document.querySelector("#showSalePage");
const freeResourceGrid = document.querySelector("#freeResourceGrid");
const freeResourceModal = document.querySelector("#freeResourceModal");
const closeFreeResourceModalButton = document.querySelector("#closeFreeResourceModal");
const freeResourceLeadForm = document.querySelector("#freeResourceLeadForm");
const freeResourceModalCategory = document.querySelector("#freeResourceModalCategory");
const freeResourceModalTitle = document.querySelector("#freeResourceModalTitle");
const freeResourceModalDescription = document.querySelector("#freeResourceModalDescription");
const freeResourceVideoPanel = document.querySelector("#freeResourceVideoPanel");
const freeResourceVideoEmbed = document.querySelector("#freeResourceVideoEmbed");
const freeResourceVideoLink = document.querySelector("#freeResourceVideoLink");
const freeResourceLandingBody = document.querySelector("#freeResourceLandingBody");
const freeResourceFileSummary = document.querySelector("#freeResourceFileSummary");
const showFreeResourceLeadFormButton = document.querySelector("#showFreeResourceLeadForm");
const freeResourceShareLink = document.querySelector("#freeResourceShareLink");
const freeReturningLead = document.querySelector("#freeReturningLead");
const freeReturningLeadTitle = document.querySelector("#freeReturningLeadTitle");
const freeReturningLeadCopy = document.querySelector("#freeReturningLeadCopy");
const useSavedFreeLeadButton = document.querySelector("#useSavedFreeLead");
const editSavedFreeLeadButton = document.querySelector("#editSavedFreeLead");
const freeResourceDownloadResult = document.querySelector("#freeResourceDownloadResult");
const freeResourceDownloadLinks = document.querySelector("#freeResourceDownloadLinks");
const freeResourceNextStep = document.querySelector("#freeResourceNextStep");
const headerLoginButton = document.querySelector(".btn-login[data-open-auth='login']");
const headerNavActions = headerLoginButton?.parentElement || null;
const loginButtonDefaultMarkup = headerLoginButton?.innerHTML || "เข้าสู่ระบบ";
let parentLoggedInUser = null;
let parentLogoutButton = null;
let freeResources = [];
let activeFreeResource = null;
let savedFreeLead = null;
let lastOpenedFreeResourceHash = "";
const freeLeadStorageKey = "tokoPoppyFreeLead";
const externalSupabaseConfig = window.SUPABASE_CONFIG || {};
const externalConfigIsValid = Boolean(
  externalSupabaseConfig.url &&
  externalSupabaseConfig.anonKey &&
  !externalSupabaseConfig.url.includes("YOUR_PROJECT") &&
  !externalSupabaseConfig.anonKey.includes("YOUR_SUPABASE")
);
const supabaseConfig = externalConfigIsValid ? externalSupabaseConfig : {};
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

const freeResourceCategoryLabels = {
  thai: "ภาษาไทย",
  math: "คณิตศาสตร์",
  science: "วิทยาศาสตร์",
  art: "ศิลปะ",
  unplugged_coding: "Unplugged Coding"
};

const fallbackFreeResources = [
  {
    id: "fallback-art",
    slug: "creative-art-story",
    title: "ใบงานศิลปะผ่านนิทาน",
    category: "art",
    age_group: "3-6 ปี",
    description: "ตัวอย่างกิจกรรมวาด ระบายสี และเล่าไอเดียจากเรื่องราว",
    video_url: "",
    worksheet_url: "",
    powerpoint_url: ""
  },
  {
    id: "fallback-coding",
    slug: "unplugged-coding-algorithm",
    title: "ภารกิจคิดเป็นขั้นตอน",
    category: "unplugged_coding",
    age_group: "4-6 ปี",
    description: "ใบงานฝึก algorithm แบบไม่ต้องใช้คอมพิวเตอร์สำหรับเด็กเล็ก",
    video_url: "",
    worksheet_url: "",
    powerpoint_url: ""
  },
  {
    id: "fallback-math",
    slug: "play-with-numbers",
    title: "เล่นกับตัวเลขรอบตัว",
    category: "math",
    age_group: "3-6 ปี",
    description: "กิจกรรมสังเกต นับ จับคู่ และแก้ปัญหาง่าย ๆ ผ่านการเล่น",
    video_url: "",
    worksheet_url: "",
    powerpoint_url: ""
  }
];

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
  if (mode === "login" && parentLoggedInUser?.userId) {
    openParentDashboard(parentLoggedInUser.userId);
    return;
  }

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

function getParentDisplayName(application, user) {
  return (
    application?.student_nickname ||
    application?.student_name ||
    user?.email ||
    "ผู้ปกครอง"
  );
}

function setParentHeaderLoggedOut() {
  parentLoggedInUser = null;

  if (headerLoginButton) {
    headerLoginButton.classList.remove("is-logged-in", "is-pending");
    headerLoginButton.innerHTML = loginButtonDefaultMarkup;
    headerLoginButton.setAttribute("aria-label", "เข้าสู่ระบบ");
  }

  parentLogoutButton?.remove();
  parentLogoutButton = null;
  showSaleExperience();
}

function setParentHeaderLoggedIn({ user, application }) {
  if (!headerLoginButton || !headerNavActions) return;

  const isApproved = application?.status === "approved";
  const displayName = getParentDisplayName(application, user);
  parentLoggedInUser = {
    userId: user.id,
    email: user.email,
    application,
    displayName
  };

  headerLoginButton.classList.toggle("is-logged-in", isApproved);
  headerLoginButton.classList.toggle("is-pending", !isApproved);
  headerLoginButton.setAttribute(
    "aria-label",
    isApproved ? `เปิดบันทึกการเรียนรู้ของ ${displayName}` : "บัญชีรออนุมัติ"
  );
  headerLoginButton.innerHTML = `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 19.5V5a2 2 0 012-2h12v18H6a2 2 0 01-2-1.5zM8 7h7M8 11h7M8 15h4"/>
    </svg>
    <span class="parent-login-label">
      <small>${isApproved ? "เข้าสู่ระบบแล้ว" : "รออนุมัติ"}</small>
      <strong>${isApproved ? "บันทึกการเรียนรู้" : "บัญชีผู้ปกครอง"}</strong>
    </span>
  `;

  if (!parentLogoutButton) {
    parentLogoutButton = document.createElement("button");
    parentLogoutButton.type = "button";
    parentLogoutButton.className = "btn-logout";
    parentLogoutButton.textContent = "ออกจากระบบ";
    parentLogoutButton.addEventListener("click", signOutParent);
    headerNavActions.appendChild(parentLogoutButton);
  }
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getFreeResourceCategoryLabel(category) {
  return freeResourceCategoryLabels[category] || category || "สื่อฟรี";
}

function getFreeResourceSlugFromHash() {
  const hash = decodeURIComponent(window.location.hash || "");
  const match = hash.match(/^#free-resource\/([^/?#]+)/);
  return match ? match[1] : "";
}

function getFreeResourceShareUrl(resource) {
  const slug = resource?.slug || resource?.id || "";
  if (!slug) return `${window.location.origin}${window.location.pathname}#free-resources`;
  return `${window.location.origin}${window.location.pathname}#free-resource/${encodeURIComponent(slug)}`;
}

function findFreeResourceBySlug(slug) {
  if (!slug) return null;
  return [...freeResources, ...fallbackFreeResources].find((resource) =>
    resource.slug === slug || resource.id === slug
  ) || null;
}

function openFreeResourceFromHash() {
  const slug = getFreeResourceSlugFromHash();
  if (!slug) return false;
  const resource = findFreeResourceBySlug(slug);
  if (!resource) return false;
  const currentHash = `#free-resource/${slug}`;
  if (freeResourceModal?.classList.contains("open") && lastOpenedFreeResourceHash === currentHash) {
    return true;
  }
  setTimeout(() => openFreeResourceModal(resource, { preserveHash: true }), 80);
  return true;
}

function setFreeResourceHash(resource) {
  const slug = resource?.slug || resource?.id;
  if (!slug) return;
  const nextHash = `#free-resource/${encodeURIComponent(slug)}`;
  if (window.location.hash !== nextHash) {
    history.pushState(null, "", nextHash);
  }
  lastOpenedFreeResourceHash = decodeURIComponent(nextHash);
}

function getSavedFreeLead() {
  try {
    const saved = JSON.parse(localStorage.getItem(freeLeadStorageKey) || "null");
    if (!saved?.parent_name || !saved?.child_age) return null;
    const savedAt = saved.saved_at ? new Date(saved.saved_at).getTime() : 0;
    const ninetyDays = 90 * 24 * 60 * 60 * 1000;
    if (!savedAt || Date.now() - savedAt > ninetyDays) {
      localStorage.removeItem(freeLeadStorageKey);
      return null;
    }
    return saved;
  } catch {
    return null;
  }
}

function saveFreeLeadToDevice(payload) {
  const reusablePayload = {
    parent_name: payload.parent_name,
    contact_email: payload.contact_email,
    contact_phone: payload.contact_phone,
    line_id: payload.line_id,
    child_age: payload.child_age,
    province: payload.province,
    district: payload.district,
    interested_categories: payload.interested_categories || [],
    consent_contact: payload.consent_contact,
    saved_at: new Date().toISOString()
  };
  localStorage.setItem(freeLeadStorageKey, JSON.stringify(reusablePayload));
  savedFreeLead = reusablePayload;
}

function fillFreeLeadFormFromSaved() {
  if (!savedFreeLead || !freeResourceLeadForm) return;
  freeResourceLeadForm.elements.parentName.value = savedFreeLead.parent_name || "";
  freeResourceLeadForm.elements.childAge.value = savedFreeLead.child_age || "";
  freeResourceLeadForm.elements.contactEmail.value = savedFreeLead.contact_email || "";
  freeResourceLeadForm.elements.contactPhone.value =
    savedFreeLead.contact_phone || savedFreeLead.line_id || "";
  freeResourceLeadForm.elements.province.value = savedFreeLead.province || "";
  freeResourceLeadForm.elements.district.value = savedFreeLead.district || "";
  freeResourceLeadForm.elements.consentContact.checked = Boolean(savedFreeLead.consent_contact);
  freeResourceLeadForm.querySelectorAll("input[name=interest]").forEach((input) => {
    input.checked = (savedFreeLead.interested_categories || []).includes(input.value);
  });
}

function getVideoEmbedUrl(url = "") {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtube.com")) {
      const pathParts = parsed.pathname.split("/").filter(Boolean);
      const shortsIndex = pathParts.indexOf("shorts");
      const videoId = parsed.searchParams.get("v") ||
        (shortsIndex >= 0 ? pathParts[shortsIndex + 1] : "");
      return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
    }
    if (parsed.hostname.includes("youtu.be")) {
      const videoId = parsed.pathname.split("/").filter(Boolean)[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
    }
    if (parsed.hostname.includes("facebook.com")) {
      return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&width=720`;
    }
  } catch {
    return "";
  }
  return "";
}

function getFreeResourceCourseSuggestion(category) {
  return {
    thai: {
      title: "ต่อยอดด้วยบทเรียนภาษาไทยผ่านนิทาน",
      copy: "ถ้าลูกสนุกกับการอ่านและเสียงพยัญชนะ ลองดูตัวอย่างบทเรียนที่ใช้เรื่องเล่าเป็นตัวพาเด็กฝึกอ่าน",
      href: "#lessons",
      label: "ดูตัวอย่างบทเรียน"
    },
    math: {
      title: "ต่อยอดด้วยกิจกรรมคิดเป็นขั้นตอน",
      copy: "ถ้าลูกชอบนับ จับคู่ และแก้ปัญหา คอร์สโค้ดดิ้งช่วยพาเด็กคิดเป็นระบบผ่านเกมและภารกิจ",
      href: "#courses",
      label: "ดูคอร์สที่เกี่ยวข้อง"
    },
    science: {
      title: "ต่อยอดด้วยกิจกรรมลงมือทดลอง",
      copy: "เด็กจะเข้าใจสิ่งรอบตัวได้ดีขึ้นเมื่อได้สังเกต ตั้งคำถาม และลองทำด้วยตัวเอง",
      href: "#courses",
      label: "ดูหลักสูตรทั้งหมด"
    },
    art: {
      title: "ต่อยอดด้วยคอร์สศิลปะแสนสนุก",
      copy: "ถ้าลูกชอบวาด ระบายสี หรือเล่างานของตัวเอง คอร์สศิลปะช่วยฝึกจินตนาการ กล้ามเนื้อมือ และความมั่นใจ",
      href: "#courses",
      label: "ดูคอร์สศิลปะ"
    },
    unplugged_coding: {
      title: "ต่อยอดด้วยคอร์ส Robot + Coding",
      copy: "ถ้าลูกสนุกกับภารกิจคิดเป็นขั้นตอน คอร์ส Robot + Coding จะพาไปสั่งงานหุ่นยนต์และแก้ปัญหาจริง",
      href: "#courses",
      label: "ดูคอร์ส Robot + Coding"
    }
  }[category] || {
    title: "ต่อยอดสู่คอร์สเรียนจริง",
    copy: "ถ้าลูกสนุกกับกิจกรรมนี้ ลองดูหลักสูตรที่ต่อเนื่องและเหมาะกับวัยของลูกได้เลย",
    href: "#courses",
    label: "ดูหลักสูตรทั้งหมด"
  };
}

function getFreeResourceLearningCopy(resource) {
  const title = resource?.title || "สื่อนี้";
  const byCategory = {
    thai: {
      focus: "ฝึกภาษาไทยแบบไม่กดดัน",
      outcomes: ["สังเกตเสียงและรูปคำ", "ฝึกอ่านผ่านภาพและนิทาน", "กล้าออกเสียงและเล่าให้ผู้ปกครองฟัง"],
      steps: ["ดูคลิปสั้นกับลูก", "ทำใบงานทีละข้อ", "ชวนลูกอ่านหรือเล่าอีกครั้ง"]
    },
    math: {
      focus: "ฝึกคิดเลขจากสิ่งใกล้ตัว",
      outcomes: ["นับและเปรียบเทียบ", "จับคู่และจัดกลุ่ม", "ฝึกแก้ปัญหาแบบเล่นสนุก"],
      steps: ["ดูตัวอย่างกิจกรรม", "ให้ลูกลองทำเองก่อน", "ชวนอธิบายวิธีคิดของตัวเอง"]
    },
    science: {
      focus: "ฝึกสังเกตโลกใกล้ตัว",
      outcomes: ["ตั้งคำถามจากสิ่งรอบตัว", "สังเกตความเปลี่ยนแปลง", "เชื่อมโยงคำตอบกับชีวิตประจำวัน"],
      steps: ["ดูคลิปก่อนเริ่ม", "ลองสังเกตหรือทดลองง่าย ๆ", "ชวนลูกเล่าว่าค้นพบอะไร"]
    },
    art: {
      focus: "ฝึกจินตนาการและกล้ามเนื้อมือ",
      outcomes: ["วาดและระบายสีอย่างมั่นใจ", "เล่าไอเดียจากผลงาน", "ฝึกสมาธิผ่านการลงมือทำ"],
      steps: ["ดูคลิปหรือภาพตัวอย่าง", "ให้ลูกเลือกสีและลงมือทำ", "ชวนลูกตั้งชื่อผลงาน"]
    },
    unplugged_coding: {
      focus: "ฝึกคิดเป็นขั้นตอนแบบไม่ต้องใช้คอม",
      outcomes: ["เรียงลำดับก่อน-หลัง", "ฝึกวางแผนและแก้ปัญหา", "เข้าใจคำสั่งแบบง่าย ๆ"],
      steps: ["ดูภารกิจจากคลิป", "ให้ลูกลองวางแผนเส้นทาง", "ชวนแก้ไขเมื่อคำสั่งยังไม่สำเร็จ"]
    }
  };
  const copy = byCategory[resource?.category] || byCategory.art;
  return {
    ...copy,
    headline: `${title} ช่วยให้ลูกได้อะไร?`
  };
}

function renderFreeResourceLanding(resource) {
  if (!freeResourceLandingBody) return;
  const learning = getFreeResourceLearningCopy(resource);
  const suggestion = getFreeResourceCourseSuggestion(resource?.category);
  freeResourceLandingBody.innerHTML = `
    <div class="free-learning-card">
      <span>เหมาะสำหรับ ${escapeHtml(resource?.age_group || "3-6 ปี")}</span>
      <h3>${escapeHtml(learning.headline)}</h3>
      <p>${escapeHtml(learning.focus)}</p>
      <ul>
        ${learning.outcomes.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
    </div>
    <div class="free-use-steps">
      <strong>วิธีใช้สื่อกับลูกที่บ้าน</strong>
      <div>
        ${learning.steps.map((step, index) => `
          <article>
            <span>${index + 1}</span>
            <p>${escapeHtml(step)}</p>
          </article>
        `).join("")}
      </div>
    </div>
    <div class="free-course-suggestion">
      <span>ต่อยอดหลังลองทำ</span>
      <strong>${escapeHtml(suggestion.title)}</strong>
      <p>${escapeHtml(suggestion.copy)}</p>
      <a href="${escapeHtml(suggestion.href)}" data-close-free-modal>${escapeHtml(suggestion.label)} →</a>
    </div>
  `;
}

function renderFreeResourceVideo(resource) {
  if (!freeResourceVideoPanel || !freeResourceVideoEmbed || !freeResourceVideoLink) return;
  freeResourceVideoEmbed.innerHTML = "";
  freeResourceVideoLink.hidden = false;
  if (!resource.video_url && !resource.thumbnail_url) {
    freeResourceVideoPanel.hidden = true;
    freeResourceVideoLink.removeAttribute("href");
    return;
  }
  if (!resource.video_url && resource.thumbnail_url) {
    freeResourceVideoEmbed.innerHTML = `
      <div class="free-resource-thumbnail-frame">
        <img src="${escapeHtml(resource.thumbnail_url)}" alt="${escapeHtml(resource.title || "สื่อฟรี")}" loading="lazy">
      </div>
    `;
    freeResourceVideoLink.hidden = true;
    freeResourceVideoPanel.hidden = false;
    return;
  }
  const embedUrl = getVideoEmbedUrl(resource.video_url);
  if (embedUrl) {
    freeResourceVideoEmbed.innerHTML = `
      <div class="free-portrait-video-frame">
        <iframe
          src="${escapeHtml(embedUrl)}"
          title="${escapeHtml(resource.title || "วิดีโอสื่อฟรี")}"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen></iframe>
      </div>
    `;
  } else {
    freeResourceVideoEmbed.innerHTML =
      '<div class="free-video-placeholder">ดูวิดีโอตัวอย่างได้จากลิงก์ด้านล่าง</div>';
  }
  freeResourceVideoLink.href = resource.video_url;
  freeResourceVideoPanel.hidden = false;
}

function renderFreeResourceFileSummary(resource) {
  if (!freeResourceFileSummary) return;
  const files = [];
  if (resource?.worksheet_url) files.push("ใบงาน PDF");
  if (resource?.powerpoint_url) files.push("PowerPoint");
  freeResourceFileSummary.innerHTML = files.length
    ? files.map((file) => `<span>${escapeHtml(file)}</span>`).join("")
    : "<p>ยังไม่มีไฟล์แนบในระบบ แอดมินจะส่งให้ตามช่องทางที่กรอกไว้</p>";
}

function renderFreeResourceNextStep(resource) {
  if (!freeResourceNextStep) return;
  const relatedCourse = {
    art: { label: "ดูคอร์สศิลปะแสนสนุก", href: "#courses" },
    thai: { label: "ดูตัวอย่างบทเรียน", href: "#lessons" },
    math: { label: "ดูหลักสูตรทั้งหมด", href: "#courses" },
    science: { label: "ดูหลักสูตรทั้งหมด", href: "#courses" },
    unplugged_coding: { label: "ดูคอร์ส Robot + Coding", href: "#courses" }
  }[resource?.category] || { label: "ดูหลักสูตรทั้งหมด", href: "#courses" };
  freeResourceNextStep.innerHTML = `
    <strong>อยากได้กิจกรรมต่อเนื่อง?</strong>
    <p>ลองดูสื่อฟรีชิ้นอื่น หรือดูคอร์สที่ต่อยอดจากกิจกรรมนี้ได้เลย</p>
    <div>
      <a href="#free-resources" data-close-free-modal>ดูสื่อฟรีอื่น</a>
      <a href="${escapeHtml(relatedCourse.href)}" data-close-free-modal>${escapeHtml(relatedCourse.label)}</a>
    </div>
  `;
}

function renderFreeResources(resources = fallbackFreeResources) {
  if (!freeResourceGrid) return;
  freeResources = resources.length ? resources : fallbackFreeResources;
  freeResourceGrid.innerHTML = freeResources.map((resource) => {
    const image = resource.thumbnail_url
      ? `<img src="${escapeHtml(resource.thumbnail_url)}" alt="${escapeHtml(resource.title)}" loading="lazy">`
      : "";
    return `
      <article class="free-resource-card">
        ${image}
        <span>${escapeHtml(getFreeResourceCategoryLabel(resource.category))} · ${escapeHtml(resource.age_group || "3-6 ปี")}</span>
        <h3>${escapeHtml(resource.title)}</h3>
        <p>${escapeHtml(resource.description || "สื่อฟรีสำหรับลองเล่นและเรียนรู้กับลูกที่บ้าน")}</p>
        <div class="free-card-actions">
          <button type="button" data-free-resource-id="${escapeHtml(resource.id)}">ดูรายละเอียด →</button>
          <button type="button" data-free-download-id="${escapeHtml(resource.id)}">รับไฟล์ฟรี</button>
        </div>
      </article>
    `;
  }).join("");
}

async function loadFreeResources() {
  renderFreeResources(fallbackFreeResources);
  openFreeResourceFromHash();
  if (!enrollmentSupabase) return;

  const { data, error } = await enrollmentSupabase
    .from("free_resources")
    .select("id, slug, title, category, age_group, description, video_url, thumbnail_url, worksheet_url, powerpoint_url, worksheet_file_name, powerpoint_file_name")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(12);

  if (error) {
    console.warn("Free resources are not ready yet:", error.message);
    return;
  }

  if (data?.length) {
    renderFreeResources(data);
    openFreeResourceFromHash();
  }
  const resourceSlug = new URLSearchParams(window.location.search).get("resource");
  if (resourceSlug) {
    const resource = (data || []).find((item) => item.slug === resourceSlug);
    if (resource) setTimeout(() => openFreeResourceModal(resource), 300);
  }
}

function openFreeResourceModal(resource, options = {}) {
  if (!freeResourceModal || !freeResourceLeadForm) return;
  activeFreeResource = resource;
  if (!options.preserveHash) setFreeResourceHash(resource);
  freeResourceLeadForm.reset();
  freeResourceLeadForm.hidden = true;
  freeResourceDownloadResult.hidden = true;
  freeResourceDownloadLinks.innerHTML = "";
  if (freeResourceNextStep) freeResourceNextStep.innerHTML = "";
  freeResourceLeadForm.elements.resourceId.value = resource.id || "";
  freeResourceLeadForm.elements.resourceSlug.value = resource.slug || "";
  freeResourceModalCategory.textContent =
    `${getFreeResourceCategoryLabel(resource.category)} · ${resource.age_group || "3-6 ปี"}`;
  freeResourceModalTitle.textContent = resource.title || "รับสื่อการเรียนรู้ฟรี";
  freeResourceModalDescription.textContent =
    resource.description || "ดูวิดีโอและรายละเอียดสื่อก่อน แล้วค่อยรับไฟล์ไปลองเล่นกับลูกที่บ้าน";
  renderFreeResourceVideo(resource);
  renderFreeResourceLanding(resource);
  renderFreeResourceFileSummary(resource);
  if (freeResourceShareLink) {
    const shareUrl = getFreeResourceShareUrl(resource);
    freeResourceShareLink.href = shareUrl;
    freeResourceShareLink.dataset.shareUrl = shareUrl;
  }
  savedFreeLead = getSavedFreeLead();
  if (savedFreeLead && freeReturningLead) {
    freeReturningLead.hidden = false;
    freeReturningLeadTitle.textContent = `ใช้ข้อมูลเดิมของ ${savedFreeLead.parent_name}`;
    freeReturningLeadCopy.textContent =
      `ลูกอายุ ${savedFreeLead.child_age} · ${savedFreeLead.district}, ${savedFreeLead.province}`;
  } else {
    freeReturningLead.hidden = true;
  }
  freeResourceModal.classList.add("open");
  freeResourceModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeFreeResourceModal() {
  if (!freeResourceModal) return;
  freeResourceModal.classList.remove("open");
  freeResourceModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (getFreeResourceSlugFromHash()) {
    history.pushState(null, "", "#free-resources");
  }
  lastOpenedFreeResourceHash = "";
}

function getFreeLeadPayload(formData) {
  const contactEmail = String(formData.get("contactEmail") || "").trim();
  const contactPhone = String(formData.get("contactPhone") || "").trim();
  const interests = formData.getAll("interest");
  return {
    resource_id: activeFreeResource?.id?.startsWith("fallback-")
      ? null
      : activeFreeResource?.id || null,
    resource_slug: activeFreeResource?.slug || formData.get("resourceSlug") || null,
    parent_name: String(formData.get("parentName") || "").trim(),
    contact_email: contactEmail || null,
    contact_phone: contactPhone || null,
    line_id: contactPhone || null,
    child_age: String(formData.get("childAge") || "").trim(),
    province: String(formData.get("province") || "").trim(),
    district: String(formData.get("district") || "").trim(),
    interested_categories: interests,
    consent_contact: Boolean(formData.get("consentContact")),
    source: new URLSearchParams(window.location.search).get("source") || document.referrer || "website",
    user_agent: navigator.userAgent || null
  };
}

function getSavedLeadPayload() {
  if (!savedFreeLead) return null;
  return {
    resource_id: activeFreeResource?.id?.startsWith("fallback-")
      ? null
      : activeFreeResource?.id || null,
    resource_slug: activeFreeResource?.slug || null,
    parent_name: savedFreeLead.parent_name,
    contact_email: savedFreeLead.contact_email || null,
    contact_phone: savedFreeLead.contact_phone || null,
    line_id: savedFreeLead.line_id || savedFreeLead.contact_phone || null,
    child_age: savedFreeLead.child_age,
    province: savedFreeLead.province,
    district: savedFreeLead.district,
    interested_categories: savedFreeLead.interested_categories || [],
    consent_contact: Boolean(savedFreeLead.consent_contact),
    source: `${new URLSearchParams(window.location.search).get("source") || "website"}:saved-lead`,
    user_agent: navigator.userAgent || null
  };
}

async function submitFreeResourceLead(payload, submitButton = null) {
  if (!payload?.contact_email && !payload?.contact_phone && !payload?.line_id) {
    showToast("กรุณากรอกอีเมล หรือเบอร์โทร/LINE อย่างน้อยหนึ่งช่อง");
    return;
  }
  if (!payload.consent_contact) {
    showToast("กรุณาติ๊กยินยอมให้ติดต่อกลับก่อนรับสื่อฟรี");
    return;
  }

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = "กำลังบันทึกข้อมูล...";
  }
  try {
    if (enrollmentSupabase) {
      const { error } = await enrollmentSupabase
        .from("free_resource_leads")
        .insert(payload);
      if (error) throw error;
    }
    saveFreeLeadToDevice(payload);
    renderFreeDownloadLinks(activeFreeResource);
  } catch (error) {
    showToast(`บันทึกข้อมูลไม่สำเร็จ: ${getFriendlySupabaseError(error)}`, 12000);
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.innerHTML = 'รับลิงก์ดาวน์โหลดฟรี <span>→</span>';
    }
  }
}

function renderFreeDownloadLinks(resource) {
  const links = [];
  if (resource?.worksheet_url) {
    links.push(`<a href="${escapeHtml(resource.worksheet_url)}" target="_blank" rel="noopener">ดาวน์โหลดใบงาน PDF</a>`);
  }
  if (resource?.powerpoint_url) {
    links.push(`<a href="${escapeHtml(resource.powerpoint_url)}" target="_blank" rel="noopener">ดาวน์โหลด PowerPoint</a>`);
  }
  freeResourceDownloadLinks.className = "free-download-links";
  freeResourceDownloadLinks.innerHTML = links.length
    ? links.join("")
    : "<p>ทีมงานได้รับข้อมูลแล้วครับ รายการนี้ยังไม่ได้แนบไฟล์ดาวน์โหลด แอดมินจะส่งสื่อให้ตามช่องทางที่กรอกไว้</p>";
  renderFreeResourceNextStep(resource);
  freeResourceLeadForm.hidden = true;
  freeResourceDownloadResult.hidden = false;
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
    art: "ศิลปะ",
    creative_art: "Creative Art",
    water_color: "Watercolor",
    clay: "Clay Art"
  };
  const course = courseMap[enrollment.course_type] || enrollment.course_type || "คอร์สเรียน";
  const levelLabel = String(enrollment.level_label || "").trim();
  if (!levelLabel) return course;

  const normalizeLabel = (value) => String(value)
    .toLowerCase()
    .replace(/[\s·+()_-]/g, "");
  const normalizedCourse = normalizeLabel(course);
  const normalizedLevel = normalizeLabel(levelLabel);
  const courseAlreadyInLevel =
    normalizedLevel.includes(normalizedCourse) ||
    normalizedCourse.includes(normalizedLevel);

  if (courseAlreadyInLevel) return levelLabel;
  if (["art", "creative_art", "water_color", "clay", "robot"].includes(enrollment.course_type)) {
    return levelLabel;
  }

  return `${course} · ${levelLabel}`;
}

function getLearningCourseMeta(courseType = "art") {
  const normalizedType = courseType || "art";
  const meta = {
    robot: {
      icon: "🤖",
      title: "โรบอท + โค้ดดิ้ง",
      copy: "เข้าเรียนภารกิจหุ่นยนต์ ฝึกคิดเป็นลำดับ วางคำสั่ง และแก้ปัญหา",
      href: "robot-lessons.html",
      accent: "#cbe6c2"
    },
    art: {
      icon: "🎨",
      title: "ศิลปะสร้างสรรค์",
      copy: "เข้าเรียนศิลปะผ่านนิทาน วาด ออกแบบ และเล่าไอเดียผ่านผลงาน",
      href: "art-lessons.html",
      accent: "#f7cac8"
    },
    creative_art: {
      icon: "🎨",
      title: "Creative Art",
      copy: "วาด ออกแบบตัวละคร ฉาก และเรื่องราวจากโจทย์สร้างสรรค์",
      href: "art-lessons.html",
      accent: "#f7cac8"
    },
    water_color: {
      icon: "💧",
      title: "Watercolor",
      copy: "ฝึกควบคุมน้ำ สี และพู่กันผ่านนิทานและผลงานละมุน",
      href: "art-lessons.html",
      accent: "#c4e1e5"
    },
    clay: {
      icon: "🧸",
      title: "Clay Art",
      copy: "ปั้นดินเบา ฝึกกล้ามเนื้อมือและสร้างผลงานสามมิติที่จับต้องได้",
      href: "art-lessons.html",
      accent: "#ffe2a7"
    }
  };

  return meta[normalizedType] || meta.art;
}

function getFallbackEnrollmentsFromApplication(application) {
  if (!application || application.status !== "approved") return [];
  const enrollments = [];
  if (application.robot_access) {
    enrollments.push({
      id: "fallback-robot",
      course_type: "robot",
      total_sessions: 15,
      completed_sessions: 0
    });
  }
  if (application.art_access) {
    enrollments.push({
      id: "fallback-art",
      course_type: "art",
      total_sessions: 12,
      completed_sessions: 0
    });
  }
  return enrollments;
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

async function getLatestParentApplication(userId) {
  if (!enrollmentSupabase || !userId) return null;

  const { data, error } = await enrollmentSupabase
    .from("enrollment_applications")
    .select("id, status, robot_access, art_access, student_name, student_nickname, parent_name, parent_phone, parent_email, birth_date, allergy_food, allergy_pollen, student_notes")
    .eq("parent_user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data || null;
}

async function getParentEnrollments(userId) {
  if (!enrollmentSupabase || !userId) return [];

  const { data, error } = await enrollmentSupabase
    .from("course_enrollments")
    .select("*")
    .eq("parent_user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

function showSaleExperience() {
  document.body.classList.remove("parent-authenticated", "sale-peek");
  if (myLearningSection) myLearningSection.hidden = true;
}

function showParentLearningExperience() {
  document.body.classList.add("parent-authenticated");
  document.body.classList.remove("sale-peek");
  if (myLearningSection) myLearningSection.hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderLearningHome({ user, application, enrollments = [] }) {
  if (!myLearningSection || !learningCourseGrid) return;

  const isApproved = application?.status === "approved";
  const displayName = getParentDisplayName(application, user);
  learningHomeTitle.textContent = isApproved
    ? `เลือกคอร์สเรียนของ ${displayName}`
    : "บัญชีกำลังรออนุมัติ";
  learningHomeSubtitle.textContent = isApproved
    ? "คอร์สที่เปิดสิทธิ์แล้วอยู่ด้านล่าง พร้อม Codekids สำหรับฝึกตรรกะผ่านเกม"
    : "แอดมินกำลังตรวจใบสมัครและสถานะการชำระเงิน เมื่ออนุมัติแล้วคอร์สเรียนจะแสดงที่หน้านี้";
  openLearningProgressButton.hidden = !isApproved;

  const displayEnrollments = enrollments.length
    ? enrollments
    : getFallbackEnrollmentsFromApplication(application);

  if (!isApproved) {
    learningStatus.hidden = false;
    learningStatus.innerHTML = `
      <strong>ยังไม่สามารถเข้าเรียนได้</strong><br>
      ใบสมัครของบัญชีนี้ยังอยู่ระหว่างรอการอนุมัติจากแอดมิน
    `;
    learningCourseGrid.innerHTML = "";
    showParentLearningExperience();
    return;
  }

  learningStatus.hidden = displayEnrollments.length > 0;
  learningStatus.innerHTML = displayEnrollments.length > 0
    ? ""
    : `
      <strong>ยังไม่พบคอร์สที่เปิดสิทธิ์</strong><br>
      หากเพิ่งได้รับการอนุมัติ กรุณารอสักครู่หรือแจ้งแอดมินให้ตรวจสิทธิ์คอร์ส
    `;

  const courseCards = displayEnrollments.map((enrollment) => {
    const meta = getLearningCourseMeta(enrollment.course_type);
    const completed = Number(enrollment.completed_sessions || 0);
    const total = Number(enrollment.total_sessions || 0);
    const progress = total > 0 ? `${completed}/${total} ครั้ง` : "พร้อมเข้าเรียน";
    return `
      <article class="learning-course-card" style="--learning-accent:${meta.accent}">
        <div class="learning-course-main">
          <span class="learning-course-icon">${meta.icon}</span>
          <h3>${escapeHtml(getParentCourseLabel(enrollment) || meta.title)}</h3>
          <p>${escapeHtml(meta.copy)}</p>
          <div class="learning-course-meta">
            <span>${escapeHtml(progress)}</span>
            <span>${escapeHtml(getCertificateCopy(enrollment))}</span>
          </div>
        </div>
        <a class="learning-course-action" href="${meta.href}">เข้าเรียน →</a>
      </article>
    `;
  });

  courseCards.push(`
    <article class="learning-course-card" style="--learning-accent:#c4e1e5">
      <div class="learning-course-main">
        <span class="learning-course-icon">🕹️</span>
        <h3>Codekids</h3>
        <p>เกมเขาวงกตฝึกตรรกะ วางคำสั่งล่วงหน้าแล้วช่วย Toko เดินทางกลับบ้าน</p>
        <div class="learning-course-meta">
          <span>กิจกรรมเสริม</span>
          <span>เล่นได้ทุกคอร์ส</span>
        </div>
      </div>
      <a class="learning-course-action secondary" href="codekids.html">เริ่มเล่น →</a>
    </article>
  `);

  learningCourseGrid.innerHTML = courseCards.join("");
  showParentLearningExperience();
}

async function loadAndRenderLearningHome(user, application) {
  try {
    const enrollments = await getParentEnrollments(user.id);
    renderLearningHome({ user, application, enrollments });
  } catch (error) {
    renderLearningHome({ user, application, enrollments: [] });
    showToast(`โหลดคอร์สเรียนไม่สำเร็จ: ${error.message}`);
  }
}

async function signOutParent() {
  if (enrollmentSupabase) {
    await enrollmentSupabase.auth.signOut();
  }

  closeParentDashboard();
  closeParentProfile();
  setParentHeaderLoggedOut();
  showSaleExperience();
  showToast("ออกจากระบบเรียบร้อยแล้ว");
}

async function restoreParentSession() {
  if (!enrollmentSupabase) {
    setParentHeaderLoggedOut();
    return;
  }

  const { data } = await enrollmentSupabase.auth.getSession();
  const user = data?.session?.user;
  if (!user) {
    setParentHeaderLoggedOut();
    return;
  }

  try {
    const application = await getLatestParentApplication(user.id);
    setParentHeaderLoggedIn({ user, application });
    await loadAndRenderLearningHome(user, application);
  } catch (error) {
    setParentHeaderLoggedOut();
    showSaleExperience();
    showToast(`ตรวจสถานะบัญชีไม่สำเร็จ: ${error.message}`);
  }
}

function closeParentDashboard() {
  parentDashboardModal?.classList.remove("open");
  parentDashboardModal?.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function closeParentProfile() {
  parentProfileModal?.classList.remove("open");
  parentProfileModal?.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function setProfileField(name, value = "") {
  const field = parentProfileForm?.elements?.[name];
  if (field) field.value = value || "";
}

function fillParentProfileForm(application, user) {
  if (!parentProfileForm) return;

  setProfileField("student_name", application?.student_name);
  setProfileField("student_nickname", application?.student_nickname);
  setProfileField("birth_date", application?.birth_date);
  setProfileField("parent_name", application?.parent_name);
  setProfileField("parent_phone", application?.parent_phone);
  setProfileField("parent_email", application?.parent_email || user?.email);
  setProfileField("allergy_food", application?.allergy_food);
  setProfileField("allergy_pollen", application?.allergy_pollen);
  setProfileField("student_notes", application?.student_notes);
}

async function openParentProfile() {
  if (!parentProfileModal || !parentProfileForm || !parentLoggedInUser?.userId) return;

  parentProfileModal.classList.add("open");
  parentProfileModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  try {
    let application = parentLoggedInUser.application;
    if (!application?.id) {
      application = await getLatestParentApplication(parentLoggedInUser.userId);
      parentLoggedInUser.application = application;
    }
    fillParentProfileForm(application, {
      email: parentLoggedInUser.email
    });
  } catch (error) {
    showToast(`โหลดข้อมูลผู้เรียนไม่สำเร็จ: ${error.message}`);
  }
}

function getProfileFormPayload(formData) {
  return {
    student_name: formData.get("student_name")?.trim(),
    student_nickname: formData.get("student_nickname")?.trim() || null,
    parent_name: formData.get("parent_name")?.trim() || null,
    parent_phone: formData.get("parent_phone")?.trim(),
    birth_date: formData.get("birth_date") || null,
    allergy_food: formData.get("allergy_food")?.trim() || null,
    allergy_pollen: formData.get("allergy_pollen")?.trim() || null,
    student_notes: formData.get("student_notes")?.trim() || null
  };
}

function renderParentDashboard({ applications = [], enrollments = [], sessions = [] }) {
  const latestApplication = applications[0];
  const displayName =
    latestApplication?.student_nickname ||
    latestApplication?.student_name ||
    "นักเรียนของเรา";
  parentDashboardTitle.textContent = `บันทึกการเรียนรู้ของ ${displayName}`;

  const totalCompleted = enrollments.reduce(
    (sum, enrollment) => sum + Number(enrollment.completed_sessions || 0),
    0
  );
  const totalRemaining = enrollments.reduce((sum, enrollment) => {
    const total = Number(enrollment.total_sessions || 0);
    const completed = Number(enrollment.completed_sessions || 0);
    return sum + Math.max(total - completed, 0);
  }, 0);
  const activeCourseCount = enrollments.length;

  parentDashboardStats.innerHTML = [
    ["คอร์สที่เปิดอยู่", `${activeCourseCount}`, "รายการ"],
    ["เรียนแล้ว", `${totalCompleted}`, "ครั้ง"],
    ["เหลือรวม", `${totalRemaining}`, "ครั้ง"]
  ].map(([label, value, unit]) => `
    <div class="parent-stat-card">
      <span>${label}</span>
      <strong>${value}</strong>
      <small>${unit}</small>
    </div>
  `).join("") + `
    <p class="parent-stat-note">
      ใบสมัครทั้งหมด ${applications.length} ใบ · “เหลือรวม” คือจำนวนครั้งที่ยังไม่ได้บันทึกจากทุกคอร์สด้านล่างรวมกัน
    </p>
  `;

  if (!enrollments.length) {
    parentCourseProgress.innerHTML = `
      <div class="parent-empty-panel">ยังไม่มีคอร์สที่เปิดสิทธิ์ในบันทึกการเรียนรู้</div>
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
  parentDashboardTitle.textContent = "กำลังโหลดบันทึกการเรียนรู้...";
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
    parentDashboardTitle.textContent = "ยังโหลดบันทึกการเรียนรู้ไม่ได้";
    parentDashboardStats.innerHTML = "";
    parentCourseProgress.innerHTML = `
      <div class="parent-empty-panel">
        กรุณารันไฟล์ SQL <strong>outputs/supabase-learning-history-schema.sql</strong> ก่อนใช้งานส่วนนี้
      </div>
    `;
    parentSessionTimeline.innerHTML = `
      <div class="parent-empty-panel">${escapeHtml(error.message || "ไม่ทราบสาเหตุ")}</div>
    `;
    showToast(`โหลดบันทึกการเรียนรู้ไม่สำเร็จ: ${error.message}`);
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
  if (
    lowerMessage.includes("update_parent_application_profile") ||
    lowerMessage.includes("could not find the function") ||
    (lowerMessage.includes("function") && lowerMessage.includes("not found"))
  ) {
    return "ยังไม่ได้รัน SQL สำหรับแก้ไขข้อมูลผู้เรียน กรุณารันไฟล์ outputs/supabase-parent-profile-update.sql ใน Supabase ก่อน";
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

freeResourceGrid?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-free-resource-id], [data-free-resource-fallback], [data-free-download-id], [data-free-download-fallback]");
  if (!button) return;
  const resourceId = button.dataset.freeResourceId || button.dataset.freeDownloadId;
  const fallbackCategory = button.dataset.freeResourceFallback || button.dataset.freeDownloadFallback;
  const resource = freeResources.find((item) => item.id === resourceId) ||
    fallbackFreeResources.find((item) => item.category === fallbackCategory) ||
    fallbackFreeResources[0];
  openFreeResourceModal(resource);
  if (button.dataset.freeDownloadId || button.dataset.freeDownloadFallback) {
    setTimeout(() => showFreeResourceLeadFormButton?.click(), 80);
  }
});

freeResourceShareLink?.addEventListener("click", async (event) => {
  event.preventDefault();
  const shareUrl = freeResourceShareLink.dataset.shareUrl || freeResourceShareLink.href;
  try {
    await navigator.clipboard.writeText(shareUrl);
    showToast("คัดลอกลิงก์สื่อฟรีแล้ว ส่งให้ผู้ปกครองได้เลยครับ");
  } catch {
    window.prompt("คัดลอกลิงก์นี้เพื่อส่งให้ผู้ปกครอง", shareUrl);
  }
});

closeFreeResourceModalButton?.addEventListener("click", closeFreeResourceModal);
freeResourceModal?.addEventListener("click", (event) => {
  if (event.target === freeResourceModal) closeFreeResourceModal();
  const closeLink = event.target.closest("[data-close-free-modal]");
  if (closeLink) setTimeout(closeFreeResourceModal, 80);
});

showFreeResourceLeadFormButton?.addEventListener("click", () => {
  freeResourceLeadForm.hidden = false;
  if (freeResourceDownloadResult) freeResourceDownloadResult.hidden = true;
  fillFreeLeadFormFromSaved();
  setTimeout(() => freeResourceLeadForm.querySelector("input[name=parentName]")?.focus(), 120);
});

useSavedFreeLeadButton?.addEventListener("click", async () => {
  const payload = getSavedLeadPayload();
  await submitFreeResourceLead(payload, useSavedFreeLeadButton);
});

editSavedFreeLeadButton?.addEventListener("click", () => {
  freeResourceLeadForm.hidden = false;
  fillFreeLeadFormFromSaved();
  setTimeout(() => freeResourceLeadForm.querySelector("input[name=parentName]")?.focus(), 120);
});

freeResourceLeadForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!freeResourceLeadForm.checkValidity()) {
    freeResourceLeadForm.reportValidity();
    return;
  }
  const payload = getFreeLeadPayload(new FormData(freeResourceLeadForm));
  const submitButton = freeResourceLeadForm.querySelector(".submit-button");
  await submitFreeResourceLead(payload, submitButton);
});

window.addEventListener("hashchange", () => {
  if (openFreeResourceFromHash()) return;
  if (freeResourceModal?.classList.contains("open") && !getFreeResourceSlugFromHash()) {
    closeFreeResourceModal();
  }
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

parentProfileModal?.addEventListener("click", (event) => {
  if (event.target === parentProfileModal) closeParentProfile();
});

closeParentProfileButton?.addEventListener("click", closeParentProfile);

openLearningProgressButton?.addEventListener("click", () => {
  if (parentLoggedInUser?.userId) openParentDashboard(parentLoggedInUser.userId);
});

openLearnerProfileButton?.addEventListener("click", openParentProfile);

showSalePageButton?.addEventListener("click", () => {
  document.body.classList.add("sale-peek");
  document.querySelector("#courses")?.scrollIntoView({ behavior: "smooth", block: "start" });
});

authModal.addEventListener("wheel", (event) => {
  if (window.innerWidth <= 720 || authContent.contains(event.target)) return;
  authContent.scrollBy({ top: event.deltaY });
  event.preventDefault();
}, { passive: false });

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (parentProfileModal?.classList.contains("open")) {
      closeParentProfile();
    } else if (freeResourceModal?.classList.contains("open")) {
      closeFreeResourceModal();
    } else if (parentDashboardModal?.classList.contains("open")) {
      closeParentDashboard();
    } else if (statusModal.classList.contains("open")) {
      statusModal.classList.remove("open");
      document.body.style.overflow = "";
    } else {
      closeAuth();
    }
  }
});

parentProfileForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!canUseSupabase() || !parentLoggedInUser?.userId) return;
  if (!parentProfileForm.checkValidity()) {
    parentProfileForm.reportValidity();
    return;
  }

  const currentApplication = parentLoggedInUser.application;
  if (!currentApplication?.id) {
    showToast("ยังไม่พบใบสมัครสำหรับแก้ไขข้อมูล");
    return;
  }

  const submitButton = parentProfileForm.querySelector(".profile-save-button");
  const formData = new FormData(parentProfileForm);
  const payload = getProfileFormPayload(formData);
  submitButton.disabled = true;
  submitButton.innerHTML = "กำลังบันทึก...";

  try {
    const { data, error } = await enrollmentSupabase.rpc(
      "update_parent_application_profile",
      {
        p_application_id: currentApplication.id,
        p_student_name: payload.student_name,
        p_student_nickname: payload.student_nickname,
        p_parent_name: payload.parent_name,
        p_parent_phone: payload.parent_phone,
        p_birth_date: payload.birth_date,
        p_allergy_food: payload.allergy_food,
        p_allergy_pollen: payload.allergy_pollen,
        p_student_notes: payload.student_notes
      }
    );

    if (error) throw error;

    parentLoggedInUser.application = data;
    setParentHeaderLoggedIn({
      user: { id: parentLoggedInUser.userId, email: parentLoggedInUser.email },
      application: data
    });
    await loadAndRenderLearningHome(
      { id: parentLoggedInUser.userId, email: parentLoggedInUser.email },
      data
    );
    fillParentProfileForm(data, { email: parentLoggedInUser.email });
    closeParentProfile();
    showToast("บันทึกข้อมูลผู้เรียนเรียบร้อยแล้ว");
  } catch (error) {
    showToast(`บันทึกข้อมูลไม่สำเร็จ: ${getFriendlySupabaseError(error)}`, 12000);
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = 'บันทึกข้อมูล <span>→</span>';
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

  let application = null;
  try {
    application = await getLatestParentApplication(data.user.id);
  } catch (error) {
    submitButton.disabled = false;
    submitButton.innerHTML = 'เข้าสู่ระบบ <span>→</span>';
    showToast(`ตรวจสถานะบัญชีไม่สำเร็จ: ${error.message}`);
    return;
  }

  submitButton.disabled = false;
  submitButton.innerHTML = 'เข้าสู่ระบบ <span>→</span>';
  setParentHeaderLoggedIn({ user: data.user, application });
  closeAuth();

  if (application?.status === "approved") {
    const courses = [
      application.robot_access ? "โรบอท" : "",
      application.art_access ? "ศิลปะ" : ""
    ].filter(Boolean).join(" และ ");
    showToast(`เข้าสู่ระบบสำเร็จ เปิดสิทธิ์คอร์ส${courses}แล้ว`);
    await loadAndRenderLearningHome(data.user, application);
  } else {
    await loadAndRenderLearningHome(data.user, application);
    showToast("บัญชียังอยู่ระหว่างรอการอนุมัติจากแอดมิน");
  }
});

syncEnrollmentSource();
syncPaymentRequirements();
setFriendlyValidationMessages();
loadFreeResources();
loadBranches();
restoreParentSession();
