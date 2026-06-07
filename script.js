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

registerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!registerForm.checkValidity()) {
    registerForm.reportValidity();
    return;
  }
  closeAuth();
  statusModal.classList.add("open");
  statusModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
});

document.querySelector("#closeStatus").addEventListener("click", () => {
  statusModal.classList.remove("open");
  statusModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  registerForm.reset();
  filePreview.innerHTML = "";
  filePreview.classList.remove("show");
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const [email, password] = loginForm.querySelectorAll("input:not([type=checkbox])");
  if (email.value === "demo@tokoandpoppy.com" && password.value === "12345678") {
    closeAuth();
    showToast("เข้าสู่ระบบสำเร็จ ยินดีต้อนรับ!");
    return;
  }
  showToast("บัญชีนี้ยังไม่ได้รับอนุมัติ หรือข้อมูลไม่ถูกต้อง");
});
