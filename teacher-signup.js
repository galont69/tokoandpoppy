const teacherConfig = window.SUPABASE_CONFIG || {};
const teacherConfigured = teacherConfig.url &&
  teacherConfig.anonKey &&
  !teacherConfig.url.includes("YOUR_PROJECT") &&
  !teacherConfig.anonKey.includes("YOUR_SUPABASE");
const teacherLibraryReady = Boolean(window.supabase?.createClient);

const teacherSupabase = teacherConfigured && teacherLibraryReady
  ? window.supabase.createClient(teacherConfig.url, teacherConfig.anonKey)
  : null;

const teacherSignupForm = document.querySelector("#teacherSignupForm");
const inviteCodeInput = document.querySelector("#inviteCode");
const teacherConfigWarning = document.querySelector("#teacherConfigWarning");
const teacherToast = document.querySelector("#teacherToast");
const successBox = document.querySelector("#successBox");

function showTeacherToast(message, isError = false) {
  teacherToast.textContent = message;
  teacherToast.classList.toggle("error", isError);
  teacherToast.hidden = false;
  window.clearTimeout(showTeacherToast.timer);
  showTeacherToast.timer = window.setTimeout(() => {
    teacherToast.hidden = true;
  }, 4200);
}

function fillInviteFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const invite = params.get("invite");
  if (invite) inviteCodeInput.value = invite;
}

function updateConnectionWarning() {
  if (!teacherConfigWarning) return;

  if (!teacherConfigured) {
    teacherConfigWarning.hidden = false;
    teacherConfigWarning.querySelector("strong").textContent = "ยังไม่ได้เชื่อม Supabase";
    teacherConfigWarning.querySelector("span").innerHTML =
      'กรุณาใส่ Project URL และ anon/public key ในไฟล์ <code>supabase-config.js</code>';
    return;
  }

  if (!teacherLibraryReady) {
    teacherConfigWarning.hidden = false;
    teacherConfigWarning.querySelector("strong").textContent = "โหลด Supabase ไม่สำเร็จ";
    teacherConfigWarning.querySelector("span").textContent =
      "กรุณารีเฟรชหน้าอีกครั้ง หรือเปิดผ่านเครือข่ายที่โหลด cdn.jsdelivr.net ได้";
    return;
  }

  teacherConfigWarning.hidden = true;
}

async function submitTeacherSignup(event) {
  event.preventDefault();
  if (!teacherConfigured || !teacherSupabase) {
    showTeacherToast("ยังไม่ได้ตั้งค่า Supabase", true);
    return;
  }

  const formData = new FormData(teacherSignupForm);
  const inviteCode = String(formData.get("invite_code") || "").trim();
  const fullName = String(formData.get("full_name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const button = teacherSignupForm.querySelector("button[type=submit]");

  if (!inviteCode || !fullName || !email || password.length < 6) {
    showTeacherToast("กรุณากรอกข้อมูลให้ครบ และรหัสผ่านอย่างน้อย 6 ตัว", true);
    return;
  }

  button.disabled = true;
  button.textContent = "กำลังส่งคำขอ...";

  try {
    let { data, error } = await teacherSupabase.auth.signUp({ email, password });

    if (error && /already registered|already exists|user already/i.test(error.message)) {
      ({ data, error } = await teacherSupabase.auth.signInWithPassword({ email, password }));
    }

    if (error) throw error;
    if (!data.user) throw new Error("สร้างบัญชีไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");

    const { error: requestError } = await teacherSupabase.rpc(
      "submit_branch_teacher_application",
      {
        p_invite_code: inviteCode,
        p_full_name: fullName,
        p_phone: phone || null
      }
    );

    if (requestError) throw requestError;

    await teacherSupabase.auth.signOut();
    teacherSignupForm.hidden = true;
    successBox.hidden = false;
    showTeacherToast("ส่งคำขอครูเรียบร้อย");
  } catch (error) {
    showTeacherToast(`ส่งคำขอไม่สำเร็จ: ${error.message}`, true);
  } finally {
    button.disabled = false;
    button.innerHTML = 'ส่งคำขอเป็นครู <span>→</span>';
  }
}

fillInviteFromUrl();
updateConnectionWarning();
teacherSignupForm.addEventListener("submit", submitTeacherSignup);
