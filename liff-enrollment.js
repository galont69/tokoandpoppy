const config = window.SUPABASE_CONFIG || {};
const supabaseClient = window.supabase?.createClient(config.url, config.anonKey);

const form = document.querySelector("#liffEnrollmentForm");
const branchSelect = document.querySelector("#branchSelect");
const submitButton = document.querySelector("#submitButton");
const formMessage = document.querySelector("#formMessage");
const successPanel = document.querySelector("#successPanel");
const successMessage = document.querySelector("#successMessage");
const addAnotherStudentButton = document.querySelector("#addAnotherStudentButton");
const closeLiffButton = document.querySelector("#closeLiffButton");
const lineProfileCard = document.querySelector("#lineProfileCard");
const lineFallbackCard = document.querySelector("#lineFallbackCard");
const linePicture = document.querySelector("#linePicture");
const lineDisplayName = document.querySelector("#lineDisplayName");
const lineStatus = document.querySelector("#lineStatus");
const paidAtInput = document.querySelector("#paidAtInput");
const slipFileInput = document.querySelector("#slipFileInput");
const slipUploadBox = document.querySelector("#slipUploadBox");
const slipPreview = document.querySelector("#slipPreview");
const slipPreviewImage = document.querySelector("#slipPreviewImage");
const slipFileName = document.querySelector("#slipFileName");
const slipFileSize = document.querySelector("#slipFileSize");

let lineProfile = null;
let lineContext = {};
let branches = [];

const maxSlipSize = 5 * 1024 * 1024;
const savedParentStorageKey = "toko-liff-enrollment-parent";
const allowedSlipTypes = ["image/jpeg", "image/png", "image/webp"];
const courseLabels = {
  robot: "Robot Coding",
  creative_art: "Creative Art",
  water_color: "สีน้ำ",
  clay: "ดินเบา"
};

function setMessage(message, isError = false) {
  formMessage.textContent = message;
  formMessage.classList.toggle("error", isError);
}

function normalizeText(value) {
  return String(value || "").trim();
}

function formatFileSize(bytes) {
  if (!bytes) return "0 KB";
  if (bytes < 1024 * 1024) return `${Math.ceil(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileExtension(file) {
  const fromName = normalizeText(file?.name).split(".").pop()?.toLowerCase();
  if (["jpg", "jpeg", "png", "webp"].includes(fromName)) {
    return fromName === "jpeg" ? "jpg" : fromName;
  }
  if (file?.type === "image/png") return "png";
  if (file?.type === "image/webp") return "webp";
  return "jpg";
}

function createUploadId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function validateSlipFile(file) {
  if (!(file instanceof File) || !file.size) {
    throw new Error("กรุณาแนบสลิปโอนเงิน");
  }
  if (!allowedSlipTypes.includes(file.type)) {
    throw new Error("สลิปต้องเป็นไฟล์ JPG, PNG หรือ WEBP เท่านั้น");
  }
  if (file.size > maxSlipSize) {
    throw new Error("ไฟล์สลิปต้องไม่เกิน 5 MB");
  }
}

function getSelectedCourses(formData) {
  return formData.getAll("course")
    .map((course) => normalizeText(course))
    .filter((course) => Object.hasOwn(courseLabels, course));
}

function focusMessage() {
  formMessage.scrollIntoView({ behavior: "smooth", block: "center" });
}

function showElement(element) {
  if (!element) return;
  element.hidden = false;
  element.classList.remove("is-hidden");
}

function readSavedParentDraft() {
  try {
    return JSON.parse(localStorage.getItem(savedParentStorageKey) || "{}");
  } catch (error) {
    return {};
  }
}

function getParentDraftFromForm() {
  const formData = new FormData(form);
  return {
    parentName: normalizeText(formData.get("parentName")),
    parentPhone: normalizeText(formData.get("parentPhone")),
    parentEmail: normalizeText(formData.get("parentEmail")),
    preferredContact: formData.get("preferredContact") || "line",
    branchId: formData.get("branchId") || "",
    consent: Boolean(formData.get("consent"))
  };
}

function saveParentDraft() {
  try {
    localStorage.setItem(savedParentStorageKey, JSON.stringify(getParentDraftFromForm()));
  } catch (error) {
    console.warn("Could not save parent draft", error);
  }
}

function setFieldValue(name, value) {
  const field = form.elements[name];
  if (!field || value === undefined || value === null || value === "") return;
  field.value = value;
}

function applyParentDraft(draft = readSavedParentDraft()) {
  if (!draft || typeof draft !== "object") return;
  setFieldValue("parentName", draft.parentName);
  setFieldValue("parentPhone", draft.parentPhone);
  setFieldValue("parentEmail", draft.parentEmail);
  setFieldValue("preferredContact", draft.preferredContact);

  if (draft.branchId && [...branchSelect.options].some((option) => option.value === draft.branchId)) {
    branchSelect.value = draft.branchId;
  }

  if (draft.consent && form.elements.consent) {
    form.elements.consent.checked = true;
  }
}

function resetCourseSelection() {
  const courseInputs = [...form.querySelectorAll('input[name="course"]')];
  courseInputs.forEach((input, index) => {
    input.checked = index === 0;
  });
}

function resetStudentApplicationFields() {
  [
    "studentName",
    "studentNickname",
    "birthDate",
    "paidAmount",
    "paidAt",
    "allergyFood",
    "allergyPollen",
    "studentNotes",
    "branchNote"
  ].forEach((name) => {
    const field = form.elements[name];
    if (field) field.value = "";
  });

  if (slipFileInput) {
    slipFileInput.value = "";
  }

  resetCourseSelection();
  setDefaultPaidDate();
  renderSlipPreview();
  setMessage("");
}

function hideElement(element) {
  if (!element) return;
  element.hidden = true;
  element.classList.add("is-hidden");
}

async function uploadPaymentSlip(file) {
  validateSlipFile(file);
  const extension = getFileExtension(file);
  const path = `liff/${Date.now()}-${createUploadId()}.${extension}`;
  const { error } = await supabaseClient
    .storage
    .from("payment-slips")
    .upload(path, file, {
      cacheControl: "3600",
      contentType: file.type,
      upsert: false
    });

  if (error) throw error;
  return path;
}

function setDefaultPaidDate() {
  if (!paidAtInput || paidAtInput.value) return;
  paidAtInput.value = new Date().toISOString().slice(0, 10);
}

function renderSlipPreview() {
  const file = slipFileInput?.files?.[0];
  if (!file) {
    slipPreview.hidden = true;
    slipPreviewImage.hidden = true;
    slipPreviewImage.removeAttribute("src");
    slipFileName.textContent = "ยังไม่ได้เลือกสลิป";
    slipFileSize.textContent = "";
    slipUploadBox.querySelector("strong").textContent = "เลือกภาพสลิป";
    slipUploadBox.querySelector("small").textContent = "JPG, PNG หรือ WEBP · ไม่เกิน 5 MB";
    return;
  }

  try {
    validateSlipFile(file);
    slipFileName.textContent = file.name;
    slipFileSize.textContent = formatFileSize(file.size);
    slipPreviewImage.src = URL.createObjectURL(file);
    slipPreviewImage.hidden = false;
    slipPreview.hidden = false;
    slipUploadBox.querySelector("strong").textContent = "เปลี่ยนภาพสลิป";
    slipUploadBox.querySelector("small").textContent = "เลือกแล้ว ตรวจสอบภาพตัวอย่างด้านล่าง";
    setMessage("");
  } catch (error) {
    slipFileInput.value = "";
    slipPreview.hidden = true;
    slipPreviewImage.hidden = true;
    slipPreviewImage.removeAttribute("src");
    setMessage(error.message, true);
  }
}

function getBranchQuery() {
  const params = new URLSearchParams(window.location.search);
  return normalizeText(params.get("branch") || params.get("branch_id"));
}

function branchMatchesQuery(branch, query) {
  if (!query) return false;
  const lowerQuery = query.toLowerCase();
  return [branch.id, branch.code, branch.name, branch.province]
    .filter(Boolean)
    .some((value) => String(value).toLowerCase() === lowerQuery);
}

async function setupLineProfile() {
  const liffId = normalizeText(config.liffEnrollmentId);
  if (!liffId) {
    lineStatus.textContent = "ยังไม่ได้ตั้งค่า LIFF ID";
    return;
  }

  if (!window.liff) {
    lineStatus.textContent = "ไม่พบ LINE LIFF SDK";
    return;
  }

  try {
    await window.liff.init({ liffId });
    if (!window.liff.isLoggedIn()) {
      window.liff.login({ redirectUri: window.location.href });
      return;
    }

    lineProfile = await window.liff.getProfile();
    lineContext = window.liff.getContext?.() || {};
    lineDisplayName.textContent = lineProfile.displayName || "LINE user";
    if (lineProfile.pictureUrl) {
      linePicture.src = lineProfile.pictureUrl;
    }
    hideElement(lineFallbackCard);
    showElement(lineProfileCard);
  } catch (error) {
    console.warn("LIFF init failed", error);
    lineStatus.textContent = "เปิดเป็น browser ปกติได้ แต่จะไม่ดึงชื่อ LINE";
  }
}

async function loadBranches() {
  if (!supabaseClient) {
    branchSelect.innerHTML = '<option value="">ตั้งค่า Supabase ไม่ครบ</option>';
    return;
  }

  const { data, error } = await supabaseClient
    .from("branches")
    .select("id,name,code,province,is_active")
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) {
    console.error(error);
    branchSelect.innerHTML = '<option value="">โหลดสาขาไม่สำเร็จ</option>';
    return;
  }

  branches = data || [];
  if (!branches.length) {
    branchSelect.innerHTML = '<option value="">ยังไม่มีสาขาที่เปิดใช้งาน</option>';
    return;
  }

  branchSelect.innerHTML = [
    '<option value="">เลือกสาขา</option>',
    ...branches.map((branch) => {
      const label = [branch.name, branch.province].filter(Boolean).join(" · ");
      return `<option value="${branch.id}">${label}</option>`;
    })
  ].join("");

  const query = getBranchQuery();
  const matchedBranch = branches.find((branch) => branchMatchesQuery(branch, query));
  if (matchedBranch) {
    branchSelect.value = matchedBranch.id;
  }

  applyParentDraft();
}

function buildPayload(formData, slipPath, selectedCourses) {
  const email = normalizeText(formData.get("parentEmail"));
  return {
    p_student_name: normalizeText(formData.get("studentName")),
    p_student_nickname: normalizeText(formData.get("studentNickname")) || null,
    p_parent_name: normalizeText(formData.get("parentName")),
    p_parent_phone: normalizeText(formData.get("parentPhone")),
    p_parent_email: email || null,
    p_course: selectedCourses[0] || "robot",
    p_requested_courses: selectedCourses,
    p_branch_id: formData.get("branchId"),
    p_payment_method: "transfer",
    p_paid_amount: Number(formData.get("paidAmount") || 0),
    p_paid_at: formData.get("paidAt") || new Date().toISOString().slice(0, 10),
    p_slip_path: slipPath,
    p_birth_date: formData.get("birthDate") || null,
    p_allergy_food: normalizeText(formData.get("allergyFood")) || null,
    p_allergy_pollen: normalizeText(formData.get("allergyPollen")) || null,
    p_student_notes: normalizeText(formData.get("studentNotes")) || null,
    p_line_user_id: lineProfile?.userId || null,
    p_line_display_name: lineProfile?.displayName || null,
    p_line_picture_url: lineProfile?.pictureUrl || null,
    p_line_status_message: lineProfile?.statusMessage || null,
    p_line_liff_context: lineContext || {},
    p_preferred_contact: formData.get("preferredContact") || "line",
    p_branch_note: normalizeText(formData.get("branchNote")) || null
  };
}

async function submitEnrollment(event) {
  event.preventDefault();

  if (!supabaseClient) {
    setMessage("ยังไม่ได้ตั้งค่า Supabase", true);
    return;
  }

  const formData = new FormData(form);
  if (!formData.get("consent")) {
    setMessage("กรุณายินยอมและยอมรับเงื่อนไขก่อนส่งใบสมัคร", true);
    focusMessage();
    return;
  }

  const birthDate = formData.get("birthDate");
  if (!birthDate) {
    setMessage("กรุณากรอกวันเกิดของนักเรียน เพื่อให้สาขาทราบอายุของน้อง", true);
    focusMessage();
    return;
  }

  const selectedCourses = getSelectedCourses(formData);
  if (!selectedCourses.length) {
    setMessage("กรุณาเลือกคอร์สที่สมัครอย่างน้อย 1 คอร์ส", true);
    focusMessage();
    return;
  }

  const paidAmount = Number(formData.get("paidAmount") || 0);
  if (!Number.isFinite(paidAmount) || paidAmount <= 0) {
    setMessage("กรุณากรอกยอดโอนให้ถูกต้อง", true);
    focusMessage();
    return;
  }

  const slipFile = formData.get("slipFile");
  try {
    validateSlipFile(slipFile);
  } catch (error) {
    setMessage(error.message, true);
    focusMessage();
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "กำลังส่งใบสมัคร...";
  setMessage("กำลังอัปโหลดสลิป...");

  try {
    const slipPath = await uploadPaymentSlip(slipFile);
    setMessage("กำลังบันทึกข้อมูลให้สาขา...");
    const payload = buildPayload(formData, slipPath, selectedCourses);
    const { error } = await supabaseClient.rpc("submit_liff_enrollment", payload);
    if (error) throw error;

    saveParentDraft();
    const studentName = normalizeText(formData.get("studentNickname")) || normalizeText(formData.get("studentName")) || "น้อง";
    successMessage.textContent = `ส่งใบสมัครของ ${studentName} เรียบร้อยแล้ว ทีมงานจะตรวจสอบข้อมูลและติดต่อกลับตามช่องทางที่คุณสะดวก หากต้องการสมัครให้พี่น้องอีกคน กดปุ่มด้านล่างได้เลย`;
    form.hidden = true;
    successPanel.hidden = false;
    successPanel.focus({ preventScroll: true });
    successPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (error) {
    console.error(error);
    const message = error.message || "ส่งใบสมัครไม่สำเร็จ กรุณาลองใหม่";
    setMessage(`ส่งใบสมัครไม่สำเร็จ: ${message}`, true);
    focusMessage();
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "ส่งใบสมัครให้สาขา →";
  }
}

function startAnotherStudentApplication() {
  const draft = readSavedParentDraft();
  successPanel.hidden = true;
  form.hidden = false;
  applyParentDraft(draft);
  resetStudentApplicationFields();
  form.querySelector('input[name="studentName"]')?.focus({ preventScroll: true });
  form.scrollIntoView({ behavior: "smooth", block: "start" });
}

function closeLiff() {
  if (window.liff?.isInClient?.()) {
    window.liff.closeWindow();
    return;
  }
  window.location.href = "index.html";
}

form.addEventListener("submit", submitEnrollment);
addAnotherStudentButton.addEventListener("click", startAnotherStudentApplication);
closeLiffButton.addEventListener("click", closeLiff);
slipFileInput?.addEventListener("change", renderSlipPreview);

setDefaultPaidDate();
applyParentDraft();
setupLineProfile();
loadBranches();
