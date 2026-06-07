const authModal = document.querySelector("#authModal");
const statusModal = document.querySelector("#statusModal");
const registerForm = document.querySelector("#registerForm");
const loginForm = document.querySelector("#loginForm");
const registerTab = document.querySelector("#registerTab");
const loginTab = document.querySelector("#loginTab");
const slipInput = document.querySelector("#slipInput");
const filePreview = document.querySelector("#filePreview");
const uploadBox = document.querySelector("#uploadBox");
const toast = document.querySelector("#toast");
const authContent = document.querySelector(".auth-content");
const supabaseConfig = window.SUPABASE_CONFIG || {};
const supabaseConfigured = supabaseConfig.url &&
  supabaseConfig.anonKey &&
  !supabaseConfig.url.includes("YOUR_PROJECT") &&
  !supabaseConfig.anonKey.includes("YOUR_SUPABASE");
const enrollmentSupabase = supabaseConfigured
  ? window.supabase.createClient(supabaseConfig.url, supabaseConfig.anonKey)
  : null;

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

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2600);
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

authModal.addEventListener("wheel", (event) => {
  if (window.innerWidth <= 720 || authContent.contains(event.target)) return;
  authContent.scrollBy({ top: event.deltaY });
  event.preventDefault();
}, { passive: false });

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (statusModal.classList.contains("open")) {
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

document.querySelector(".copy-account").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText("xxx-x-xxxxx-x");
    showToast("คัดลอกเลขบัญชีแล้ว");
  } catch {
    showToast("เลขบัญชี: xxx-x-xxxxx-x");
  }
});

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!registerForm.checkValidity()) {
    registerForm.reportValidity();
    return;
  }
  if (!supabaseConfigured) {
    showToast("กรุณาตั้งค่า Supabase ในไฟล์ supabase-config.js");
    return;
  }

  const submitButton = registerForm.querySelector(".submit-button");
  const formData = new FormData(registerForm);
  const slip = formData.get("slip");
  submitButton.disabled = true;
  submitButton.innerHTML = "กำลังส่งใบสมัคร...";

  try {
    const { data: authData, error: signUpError } =
      await enrollmentSupabase.auth.signUp({
        email: formData.get("email"),
        password: formData.get("password")
      });

    if (signUpError) throw signUpError;
    if (!authData.session || !authData.user) {
      throw new Error(
        "กรุณายืนยันอีเมลก่อนสมัคร หรือปิด Confirm email ใน Supabase Auth Settings"
      );
    }

    const extension = slip.name.split(".").pop().toLowerCase();
    const fileName = `${crypto.randomUUID()}.${extension}`;
    const slipPath = `${authData.user.id}/${fileName}`;

    const { error: uploadError } = await enrollmentSupabase.storage
      .from("payment-slips")
      .upload(slipPath, slip, {
        cacheControl: "3600",
        contentType: slip.type,
        upsert: false
      });
    if (uploadError) throw uploadError;

    const { error: enrollmentError } = await enrollmentSupabase.rpc(
      "submit_enrollment",
      {
        p_student_name: formData.get("studentName"),
        p_parent_phone: formData.get("phone"),
        p_course: formData.get("course"),
        p_slip_path: slipPath
      }
    );
    if (enrollmentError) {
      throw enrollmentError;
    }

    closeAuth();
    statusModal.classList.add("open");
    statusModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  } catch (error) {
    showToast(`ส่งใบสมัครไม่สำเร็จ: ${error.message}`);
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
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!supabaseConfigured) {
    showToast("กรุณาตั้งค่า Supabase ในไฟล์ supabase-config.js");
    return;
  }

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
  } else {
    showToast("บัญชียังอยู่ระหว่างรอการอนุมัติจากแอดมิน");
  }
});
