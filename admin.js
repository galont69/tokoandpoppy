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

let applications = [];
let activeStatus = "all";
let activeApplication = null;

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
