const canvas = document.querySelector("#labCanvas");
const ctx = canvas.getContext("2d");
const templateSelect = document.querySelector("#templateSelect");
const photoInput = document.querySelector("#photoInput");
const photoInputLabel = document.querySelector("#photoInputLabel");
const nameField = document.querySelector("#nameField");
const nameFieldLabel = document.querySelector("#nameFieldLabel");
const nameInput = document.querySelector("#nameInput");
const nameTargetButton = document.querySelector("#nameTargetButton");
const nameControlCard = document.querySelector("#nameControlCard");
const nameControlTitle = document.querySelector("#nameControlTitle");
const statusLabel = document.querySelector("#statusLabel");
const configOutput = document.querySelector("#configOutput");
const gridToggle = document.querySelector("#gridToggle");
const stepSelect = document.querySelector("#stepSelect");

const inputs = {
  photoX: document.querySelector("#photoXInput"),
  photoY: document.querySelector("#photoYInput"),
  photoW: document.querySelector("#photoWInput"),
  photoH: document.querySelector("#photoHInput"),
  photoRotate: document.querySelector("#photoRotateInput"),
  photoRotateLabel: document.querySelector("#photoRotateLabel"),
  cropScale: document.querySelector("#cropScaleInput"),
  cropX: document.querySelector("#cropXInput"),
  cropY: document.querySelector("#cropYInput"),
  nameX: document.querySelector("#nameXInput"),
  nameY: document.querySelector("#nameYInput"),
  nameW: document.querySelector("#nameWInput"),
  nameH: document.querySelector("#nameHInput"),
  fontSize: document.querySelector("#fontSizeInput")
};

const templateDefinitions = {
  pizza1: {
    label: "ภาพที่ 1 ถือผลงาน",
    photoLabel: "รูปที่ 1: ถือผลงานหน้าตรง",
    photoKey: "pizzaPhoto",
    cropKey: "",
    showName: true,
    placeholder: "อัปโหลดรูปถือผลงาน",
    assets: {
      background: "assets/artwork-carousel/pizza/layer_01.png",
      foreground: "assets/artwork-carousel/pizza/layer_03.png"
    },
    config: {
      canvas: { width: 2160, height: 2700 },
      photo: { x: 199, y: 821, width: 1810, height: 1720, rotate: -0.05934 },
      chefName: { x: 1052, y: 566, width: 500, height: 116, fontSize: 117, minFontSize: 56 }
    },
    crop: { scale: 1, offsetX: 0, offsetY: 0 }
  },
  donut1: {
    label: "โดนัททำไมมีรู? ภาพที่ 1",
    photoLabel: "รูปที่ 1: ถือผลงานโดนัท",
    photoKey: "donutPhoto",
    cropKey: "donutCrop",
    nameKey: "donutName",
    nameLabel: "ชื่อเด็กบนช่อง BY",
    showName: true,
    placeholder: "อัปโหลดรูปถือผลงานโดนัท",
    assets: {
      background: "assets/artwork-carousel/donut/donut_layer_01.png?v=20260808-donut-layer01-by",
      foreground: "assets/artwork-carousel/donut/donut_layer_03.png?v=20260808-donut-layer01-by"
    },
    config: {
      canvas: { width: 2160, height: 2700 },
      photo: { x: 286, y: 1042, width: 1584, height: 1355, rotate: 0, radius: 34 },
      chefName: { x: 1039, y: 791, width: 650, height: 118, fontSize: 106, minFontSize: 54 }
    },
    crop: { scale: 1, offsetX: 0, offsetY: 0 }
  },
  pizza3: {
    label: "ภาพที่ 3 วางแผนก่อนวาด",
    photoLabel: "รูปที่ 3: กำลังวางแผนก่อนวาด",
    photoKey: "pizzaPlanPhoto",
    cropKey: "pizzaPlanCrop",
    showName: false,
    placeholder: "อัปโหลดรูปกำลังวางแผน",
    assets: {
      background: "assets/artwork-carousel/pizza/p3_layer_01.png",
      foreground: "assets/artwork-carousel/pizza/p3_layer_03.png"
    },
    config: {
      canvas: { width: 2160, height: 2700 },
      photo: { x: 284, y: 557, width: 1650, height: 947, rotate: 0 },
      chefName: { x: 1052, y: 566, width: 500, height: 116, fontSize: 117, minFontSize: 56 }
    },
    crop: { scale: 1, offsetX: -1, offsetY: 37 }
  },
  pizza4: {
    label: "ภาพที่ 4 ลงมือทำ",
    photoLabel: "รูปที่ 4: กำลังวาด / ลงมือทำ",
    photoKey: "pizzaDrawPhoto",
    cropKey: "pizzaDrawCrop",
    showName: false,
    placeholder: "อัปโหลดรูปกำลังวาด",
    assets: {
      background: "assets/artwork-carousel/pizza/p4_layer_01.png",
      foreground: "assets/artwork-carousel/pizza/p4_layer_03.png"
    },
    config: {
      canvas: { width: 2160, height: 2700 },
      photo: { x: 130, y: 1015, width: 1900, height: 1525, rotate: 0, radius: 96 },
      chefName: { x: 1052, y: 566, width: 500, height: 116, fontSize: 117, minFontSize: 56 }
    },
    crop: { scale: 1, offsetX: 0, offsetY: 0 }
  },
  pizza5main: {
    label: "ภาพที่ 5 รูปใหญ่",
    photoLabel: "รูปที่ 5: รูปใหญ่จากภาพที่ 1",
    photoKey: "pizzaResultMainPhoto",
    cropKey: "pizzaResultMainCrop",
    showName: false,
    placeholder: "อัปโหลดรูปถือผลงาน",
    assets: {
      background: "assets/artwork-carousel/pizza/p5_layer_01.png",
      foreground: "assets/artwork-carousel/pizza/p5_layer_04.png"
    },
    config: {
      canvas: { width: 2160, height: 2700 },
      photo: { x: 165, y: 332, width: 1173, height: 1081, rotate: -0.04014, radius: 44 },
      chefName: { x: 1052, y: 566, width: 500, height: 116, fontSize: 117, minFontSize: 56 }
    },
    crop: { scale: 1, offsetX: -15, offsetY: -54 }
  },
  pizza5plan: {
    label: "ภาพที่ 5 รูปเล็ก",
    photoLabel: "รูปที่ 5: รูปเล็กจากภาพที่ 3",
    photoKey: "pizzaResultPlanPhoto",
    cropKey: "pizzaResultPlanCrop",
    showName: false,
    placeholder: "อัปโหลดรูปวางแผน",
    assets: {
      background: "assets/artwork-carousel/pizza/p5_layer_01.png",
      foreground: "assets/artwork-carousel/pizza/p5_layer_04.png"
    },
    config: {
      canvas: { width: 2160, height: 2700 },
      photo: { x: 1386, y: 548, width: 616, height: 871, rotate: 0.09076, radius: 44 },
      chefName: { x: 1052, y: 566, width: 500, height: 116, fontSize: 117, minFontSize: 56 }
    },
    crop: { scale: 1, offsetX: 0, offsetY: 0 }
  }
};

const state = {
  templateId: "pizza1",
  activeTarget: "photo",
  showGrid: true,
  config: structuredClone(templateDefinitions.pizza1.config),
  crop: structuredClone(templateDefinitions.pizza1.crop)
};
const images = {
  background: null,
  foreground: null,
  photo: null
};

let dragState = null;

function getTemplate() {
  return templateDefinitions[state.templateId] || templateDefinitions.pizza1;
}

function cloneTemplateState(templateId = state.templateId) {
  const template = templateDefinitions[templateId] || templateDefinitions.pizza1;
  return {
    config: structuredClone(template.config),
    crop: structuredClone(template.crop)
  };
}

function setStatus(message) {
  if (statusLabel) statusLabel.textContent = message;
}

function roundedRect(context, x, y, width, height, radius) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
}

function loadImage(url) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = url;
  });
}

function imageFromFile(file) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => resolve({ image, objectUrl });
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("เปิดรูปไม่สำเร็จ"));
    };
    image.src = objectUrl;
  });
}

function normalizeChefName(value) {
  return String(value || "")
    .trim()
    .replace(/^น้อง\s*/i, "")
    .replace(/^เชฟ\s*/i, "")
    .trim();
}

function drawCoverImage(context, image, x, y, width, height, scale = 1, offsetX = 0, offsetY = 0) {
  if (!image) return;
  const fitScale = Math.max(width / image.width, height / image.height) * scale;
  const drawWidth = image.width * fitScale;
  const drawHeight = image.height * fitScale;
  const drawX = x + width / 2 - drawWidth / 2 + offsetX;
  const drawY = y + height / 2 - drawHeight / 2 + offsetY;
  context.drawImage(image, drawX, drawY, drawWidth, drawHeight);
}

function createPhotoCropCanvas() {
  const frame = state.config.photo;
  const crop = document.createElement("canvas");
  crop.width = frame.width;
  crop.height = frame.height;
  const cropCtx = crop.getContext("2d");
  cropCtx.fillStyle = "#fffaf2";
  cropCtx.fillRect(0, 0, crop.width, crop.height);
  if (images.photo) {
    drawCoverImage(cropCtx, images.photo, 0, 0, crop.width, crop.height, state.crop.scale, state.crop.offsetX, state.crop.offsetY);
  } else {
    cropCtx.fillStyle = "#f7e8c4";
    cropCtx.fillRect(0, 0, crop.width, crop.height);
    cropCtx.fillStyle = "#9a7b4d";
    cropCtx.font = "900 90px Kanit, 'Noto Sans Thai', sans-serif";
    cropCtx.textAlign = "center";
    cropCtx.textBaseline = "middle";
    cropCtx.fillText(getTemplate().placeholder || "อัปโหลดรูปเด็กตัวอย่าง", crop.width / 2, crop.height / 2);
  }
  return crop;
}

function drawPizzaPhoto() {
  const frame = state.config.photo;
  const crop = createPhotoCropCanvas();
  ctx.save();
  ctx.translate(frame.x + frame.width / 2, frame.y + frame.height / 2);
  ctx.rotate(frame.rotate || 0);
  roundedRect(ctx, -frame.width / 2, -frame.height / 2, frame.width, frame.height, Number(frame.radius || 58));
  ctx.clip();
  ctx.drawImage(crop, -frame.width / 2, -frame.height / 2);
  ctx.restore();
}

function drawChefName() {
  if (!getTemplate().showName) return;
  const name = normalizeChefName(nameInput?.value || "");
  if (!name) return;
  const box = state.config.chefName;
  const fontFamily = "'Mali', 'Noto Sans Thai', sans-serif";
  let fontSize = Number(box.fontSize || 104);
  const minFontSize = Number(box.minFontSize || 56);
  do {
    ctx.font = `700 ${fontSize}px ${fontFamily}`;
    if (ctx.measureText(name).width <= box.width) break;
    fontSize -= 2;
  } while (fontSize > minFontSize);
  ctx.save();
  ctx.fillStyle = "#3b2418";
  ctx.font = `700 ${fontSize}px ${fontFamily}`;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "rgba(255, 226, 120, 0.45)";
  ctx.shadowBlur = 2;
  ctx.fillText(name, box.x, box.y + box.height / 2);
  ctx.restore();
}

function drawGrid() {
  if (!state.showGrid) return;
  ctx.save();
  ctx.lineWidth = 1;
  ctx.font = "26px ui-monospace, Menlo, monospace";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  for (let x = 0; x <= canvas.width; x += 100) {
    ctx.strokeStyle = x % 500 === 0 ? "rgba(244, 126, 95, .55)" : "rgba(95, 142, 79, .18)";
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
    if (x % 500 === 0) {
      ctx.fillStyle = "rgba(244, 126, 95, .88)";
      ctx.fillText(String(x), x + 6, 8);
    }
  }
  for (let y = 0; y <= canvas.height; y += 100) {
    ctx.strokeStyle = y % 500 === 0 ? "rgba(244, 126, 95, .55)" : "rgba(95, 142, 79, .18)";
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
    if (y % 500 === 0) {
      ctx.fillStyle = "rgba(244, 126, 95, .88)";
      ctx.fillText(String(y), 8, y + 6);
    }
  }
  ctx.restore();
}

function drawBox(box, label, color = "#1677ff") {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 5;
  ctx.setLineDash([20, 12]);
  ctx.strokeRect(box.x, box.y, box.width, box.height);
  ctx.setLineDash([]);
  ctx.fillStyle = color;
  ctx.font = "900 34px Kanit, 'Noto Sans Thai', sans-serif";
  ctx.fillText(label, box.x + 12, Math.max(box.y - 18, 40));
  ctx.restore();
}

function drawDebugBoxes() {
  if (!state.showGrid) return;
  drawBox(state.config.photo, getTemplate().photoKey, state.activeTarget === "photo" ? "#1677ff" : "rgba(22,119,255,.56)");
  if (getTemplate().showName) {
    drawBox(state.config.chefName, getTemplate().nameKey || "chefName", state.activeTarget === "name" ? "#e24f39" : "rgba(226,79,57,.62)");
  }
}

function render() {
  const { width, height } = state.config.canvas;
  canvas.width = width;
  canvas.height = height;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#fff1c9";
  ctx.fillRect(0, 0, width, height);
  if (images.background) ctx.drawImage(images.background, 0, 0, width, height);
  drawPizzaPhoto();
  if (images.foreground) ctx.drawImage(images.foreground, 0, 0, width, height);
  drawChefName();
  drawGrid();
  drawDebugBoxes();
  syncInputs();
  updateConfigOutput();
}

function getRotateDeg() {
  return Number((state.config.photo.rotate * 180 / Math.PI).toFixed(2));
}

function syncInputs() {
  inputs.photoX.value = Math.round(state.config.photo.x);
  inputs.photoY.value = Math.round(state.config.photo.y);
  inputs.photoW.value = Math.round(state.config.photo.width);
  inputs.photoH.value = Math.round(state.config.photo.height);
  inputs.photoRotate.value = getRotateDeg();
  inputs.photoRotateLabel.textContent = `${getRotateDeg().toFixed(1)}°`;
  inputs.cropScale.value = Number(state.crop.scale).toFixed(2);
  inputs.cropX.value = Math.round(state.crop.offsetX);
  inputs.cropY.value = Math.round(state.crop.offsetY);
  inputs.nameX.value = Math.round(state.config.chefName.x);
  inputs.nameY.value = Math.round(state.config.chefName.y);
  inputs.nameW.value = Math.round(state.config.chefName.width);
  inputs.nameH.value = Math.round(state.config.chefName.height);
  inputs.fontSize.value = Math.round(state.config.chefName.fontSize);
}

function updateConfigOutput() {
  const template = getTemplate();
  const photo = state.config.photo;
  const name = state.config.chefName;
  const hasCrop = Boolean(template.cropKey);
  const hasName = Boolean(template.showName);
  const nameKey = template.nameKey || "chefName";
  const lines = [
    `${template.photoKey}: {`,
    `  x: ${Math.round(photo.x)},`,
    `  y: ${Math.round(photo.y)},`,
    `  width: ${Math.round(photo.width)},`,
    `  height: ${Math.round(photo.height)},`,
    `  rotate: ${Number(photo.rotate.toFixed(5))}`,
    hasCrop || hasName ? "}," : "}"
  ];
  if (hasCrop) {
    lines.push(
      `${template.cropKey}: {`,
      `  scale: ${Number(state.crop.scale.toFixed(2))},`,
      `  offsetX: ${Math.round(state.crop.offsetX)},`,
      `  offsetY: ${Math.round(state.crop.offsetY)}`,
      hasName ? "}," : "}"
    );
  }
  if (hasName) {
    lines.push(
      `${nameKey}: {`,
      `  x: ${Math.round(name.x)},`,
      `  y: ${Math.round(name.y)},`,
      `  width: ${Math.round(name.width)},`,
      `  height: ${Math.round(name.height)},`,
      `  fontSize: ${Math.round(name.fontSize)},`,
      `  minFontSize: ${Math.round(name.minFontSize || 56)}`,
      "}"
    );
  }
  configOutput.value = lines.join("\n");
}

function applyInputs() {
  state.config.photo.x = Number(inputs.photoX.value || 0);
  state.config.photo.y = Number(inputs.photoY.value || 0);
  state.config.photo.width = Number(inputs.photoW.value || 1);
  state.config.photo.height = Number(inputs.photoH.value || 1);
  state.config.photo.rotate = Number(inputs.photoRotate.value || 0) * Math.PI / 180;
  state.crop.scale = Number(inputs.cropScale.value || 1);
  state.crop.offsetX = Number(inputs.cropX.value || 0);
  state.crop.offsetY = Number(inputs.cropY.value || 0);
  state.config.chefName.x = Number(inputs.nameX.value || 0);
  state.config.chefName.y = Number(inputs.nameY.value || 0);
  state.config.chefName.width = Number(inputs.nameW.value || 1);
  state.config.chefName.height = Number(inputs.nameH.value || 1);
  state.config.chefName.fontSize = Number(inputs.fontSize.value || 104);
  render();
}

function getCanvasPoint(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) * canvas.width / rect.width,
    y: (event.clientY - rect.top) * canvas.height / rect.height
  };
}

function pointInBox(point, box) {
  return point.x >= box.x &&
    point.x <= box.x + box.width &&
    point.y >= box.y &&
    point.y <= box.y + box.height;
}

function setActiveTarget(target) {
  if (target === "name" && !getTemplate().showName) target = "photo";
  state.activeTarget = target;
  document.querySelectorAll("[data-target]").forEach((button) => {
    button.classList.toggle("active", button.dataset.target === target);
  });
  setStatus(target === "photo" ? "กำลังขยับกรอบรูป" : target === "crop" ? "กำลังขยับ crop ในรูป" : "กำลังขยับชื่อเด็ก");
  render();
}

function startDrag(event) {
  const point = getCanvasPoint(event);
  let target = state.activeTarget;
  if (getTemplate().showName && pointInBox(point, state.config.chefName)) target = "name";
  else if (pointInBox(point, state.config.photo)) target = state.activeTarget === "crop" ? "crop" : "photo";
  setActiveTarget(target);
  dragState = {
    target,
    startPoint: point,
    photoStart: { ...state.config.photo },
    nameStart: { ...state.config.chefName },
    cropStart: { ...state.crop }
  };
  canvas.setPointerCapture?.(event.pointerId);
}

function moveDrag(event) {
  if (!dragState) return;
  const point = getCanvasPoint(event);
  const dx = point.x - dragState.startPoint.x;
  const dy = point.y - dragState.startPoint.y;
  if (dragState.target === "photo") {
    state.config.photo.x = dragState.photoStart.x + dx;
    state.config.photo.y = dragState.photoStart.y + dy;
  } else if (dragState.target === "name") {
    state.config.chefName.x = dragState.nameStart.x + dx;
    state.config.chefName.y = dragState.nameStart.y + dy;
  } else {
    state.crop.offsetX = dragState.cropStart.offsetX + dx;
    state.crop.offsetY = dragState.cropStart.offsetY + dy;
  }
  render();
}

function endDrag() {
  dragState = null;
}

function nudge(direction) {
  const amount = Number(stepSelect.value || 5);
  const dx = direction === "left" ? -amount : direction === "right" ? amount : 0;
  const dy = direction === "up" ? -amount : direction === "down" ? amount : 0;
  if (state.activeTarget === "photo") {
    state.config.photo.x += dx;
    state.config.photo.y += dy;
  } else if (state.activeTarget === "name") {
    state.config.chefName.x += dx;
    state.config.chefName.y += dy;
  } else {
    state.crop.offsetX += dx;
    state.crop.offsetY += dy;
  }
  render();
}

async function copyConfig() {
  try {
    await navigator.clipboard.writeText(configOutput.value);
    setStatus("คัดลอก config แล้ว");
  } catch {
    configOutput.select();
    document.execCommand("copy");
    setStatus("คัดลอก config แล้ว");
  }
}

function downloadPreview() {
  const link = document.createElement("a");
  const safeName = normalizeChefName(nameInput.value || "student") || "student";
  link.download = `toko-poppy-template-lab-${state.templateId}-${safeName}.png`;
  link.href = canvas.toDataURL("image/png");
  document.body.appendChild(link);
  link.click();
  link.remove();
}

async function loadTemplateAssets() {
  const template = getTemplate();
  [images.background, images.foreground] = await Promise.all([
    loadImage(template.assets.background),
    loadImage(template.assets.foreground)
  ]);
}

function updateTemplateUi() {
  const template = getTemplate();
  if (templateSelect) templateSelect.value = state.templateId;
  if (photoInputLabel) photoInputLabel.textContent = template.photoLabel || "รูปเด็กตัวอย่าง";
  if (nameField) nameField.hidden = !template.showName;
  if (nameControlCard) nameControlCard.hidden = !template.showName;
  if (nameFieldLabel) nameFieldLabel.textContent = template.nameLabel || "ชื่อเชฟ";
  if (nameControlTitle) nameControlTitle.textContent = template.nameLabel || "ชื่อหลัง By เชฟ";
  if (nameTargetButton) {
    nameTargetButton.hidden = !template.showName;
    nameTargetButton.disabled = !template.showName;
  }
  if (!template.showName && state.activeTarget === "name") {
    state.activeTarget = "photo";
  }
  document.querySelectorAll("[data-target]").forEach((button) => {
    button.classList.toggle("active", button.dataset.target === state.activeTarget);
  });
}

async function applyTemplate(templateId) {
  state.templateId = templateDefinitions[templateId] ? templateId : "pizza1";
  const fresh = cloneTemplateState(state.templateId);
  state.config = fresh.config;
  state.crop = fresh.crop;
  state.activeTarget = "photo";
  updateTemplateUi();
  setStatus(`กำลังโหลด ${getTemplate().label}...`);
  await loadTemplateAssets();
  setStatus(`พร้อมจูนตำแหน่ง ${getTemplate().label}`);
  render();
}

function resetLab() {
  const fresh = cloneTemplateState(state.templateId);
  state.activeTarget = "photo";
  state.showGrid = true;
  state.config = fresh.config;
  state.crop = fresh.crop;
  gridToggle.checked = true;
  updateTemplateUi();
  setActiveTarget("photo");
  render();
}

function bindEvents() {
  templateSelect?.addEventListener("change", () => {
    applyTemplate(templateSelect.value);
  });
  photoInput.addEventListener("change", async () => {
    const file = photoInput.files?.[0];
    if (!file) return;
    try {
      const { image } = await imageFromFile(file);
      images.photo = image;
      setStatus("โหลดรูปเด็กแล้ว ลากหรือปรับ crop ได้เลย");
      render();
    } catch (error) {
      setStatus(error.message);
    }
  });

  nameInput.addEventListener("input", render);
  Object.values(inputs).forEach((input) => {
    input?.addEventListener("input", applyInputs);
  });
  gridToggle.addEventListener("change", () => {
    state.showGrid = gridToggle.checked;
    render();
  });
  document.querySelectorAll("[data-target]").forEach((button) => {
    button.addEventListener("click", () => setActiveTarget(button.dataset.target));
  });
  document.querySelectorAll("[data-nudge]").forEach((button) => {
    button.addEventListener("click", () => nudge(button.dataset.nudge));
  });
  document.querySelector("#copyConfigButton").addEventListener("click", copyConfig);
  document.querySelector("#downloadPreviewButton").addEventListener("click", downloadPreview);
  document.querySelector("#resetButton").addEventListener("click", resetLab);
  canvas.addEventListener("pointerdown", startDrag);
  canvas.addEventListener("pointermove", moveDrag);
  ["pointerup", "pointercancel", "pointerleave"].forEach((eventName) => {
    canvas.addEventListener(eventName, endDrag);
  });
}

async function init() {
  updateTemplateUi();
  await loadTemplateAssets();
  bindEvents();
  syncInputs();
  render();
}

init();
