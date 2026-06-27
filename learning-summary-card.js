const form = document.querySelector("#summaryCardForm");
const card = document.querySelector("#learningSummaryCard");
const exportButton = document.querySelector("#exportSummaryCard");
const courseMeta = {
  clay: {
    name: "ปั้นดินเบา (CLAY)",
    icon: "assets/card/icon_clay.png"
  },
  creative_art: {
    name: "Creative Art",
    icon: "assets/card/3.png"
  },
  water_color: {
    name: "Water Color",
    icon: "assets/card/icon_watercolor_set.png"
  },
  robot: {
    name: "Robot + Coding",
    icon: "assets/card/icon_robot.png"
  }
};

function setField(name, value) {
  card.querySelectorAll(`[data-field="${name}"]`).forEach((element) => {
    element.textContent = value;
  });
}

function formatThaiDate(value) {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).replace(/\s+/g, " ");
}

function updateProgressDots(sessionNumber, totalSessions) {
  const dots = card.querySelector('[data-field="progressDots"]');
  const total = Math.max(Number(totalSessions || 0), 1);
  const completed = Math.max(Math.min(Number(sessionNumber || 0), total), 0);
  dots.innerHTML = Array.from({ length: total }, (_, index) =>
    `<i class="${index < completed ? "is-done" : ""}"></i>`
  ).join("");
}

function updateCard() {
  const data = new FormData(form);
  const sessionNumber = Number(data.get("sessionNumber") || 0);
  const totalSessions = Number(data.get("totalSessions") || 0);
  const course = courseMeta[data.get("courseType")] || courseMeta.clay;
  setField("studentName", String(data.get("studentName") || "โลมา").trim().slice(0, 12));
  setField("branchName", String(data.get("branchName") || "ชลบุรี").trim());
  setField("courseName", course.name);
  setField("lessonNumber", String(data.get("lessonNumber") || "1"));
  setField("lessonTitle", String(data.get("lessonTitle") || "กิจกรรมสร้างสรรค์").trim().slice(0, 28));
  setField("classDate", formatThaiDate(data.get("classDate")));
  setField("sessionNumber", String(sessionNumber || 1));
  setField("totalSessions", String(totalSessions || 1));
  setField("remainingSessions", String(Math.max((totalSessions || 0) - (sessionNumber || 0), 0)));
  setField("teacherNote", String(data.get("teacherNote") || "").trim().slice(0, 140));
  card.querySelector('[data-field="courseIcon"]').src = course.icon;
  updateProgressDots(sessionNumber, totalSessions);
}

async function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function imageToDataUrl(src) {
  if (src.startsWith("data:")) return src;
  const response = await fetch(src);
  const blob = await response.blob();
  return fileToDataUrl(blob);
}

async function loadExportImage(src) {
  const image = new Image();
  image.crossOrigin = "anonymous";
  image.src = await imageToDataUrl(src);
  await image.decode();
  return image;
}

function drawRoundedRect(context, x, y, width, height, radius) {
  const safeRadius = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + safeRadius, y);
  context.lineTo(x + width - safeRadius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + safeRadius);
  context.lineTo(x + width, y + height - safeRadius);
  context.quadraticCurveTo(x + width, y + height, x + width - safeRadius, y + height);
  context.lineTo(x + safeRadius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - safeRadius);
  context.lineTo(x, y + safeRadius);
  context.quadraticCurveTo(x, y, x + safeRadius, y);
  context.closePath();
}

function drawCoverImage(context, image, x, y, width, height, radius) {
  const sourceRatio = image.width / image.height;
  const targetRatio = width / height;
  let sourceWidth = image.width;
  let sourceHeight = image.height;
  let sourceX = 0;
  let sourceY = 0;
  if (sourceRatio > targetRatio) {
    sourceWidth = image.height * targetRatio;
    sourceX = (image.width - sourceWidth) / 2;
  } else {
    sourceHeight = image.width / targetRatio;
    sourceY = (image.height - sourceHeight) / 2;
  }
  context.save();
  drawRoundedRect(context, x, y, width, height, radius);
  context.clip();
  context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height);
  context.restore();
}

function drawCardBox(context, x, y, width, height, radius, fill = "#FFFFFF", stroke = "#E9DCCB") {
  context.save();
  context.shadowColor = "rgba(74,55,46,.08)";
  context.shadowBlur = 18;
  context.shadowOffsetY = 8;
  context.fillStyle = fill;
  drawRoundedRect(context, x, y, width, height, radius);
  context.fill();
  context.restore();
  context.strokeStyle = stroke;
  context.lineWidth = 2;
  drawRoundedRect(context, x, y, width, height, radius);
  context.stroke();
}

function wrapCanvasText(context, text, x, y, maxWidth, lineHeight, maxLines) {
  const source = String(text || "").replace(/\s+/g, " ").trim();
  if (!source) return;
  const segments = Array.from(source);
  const lines = [];
  let line = "";
  segments.forEach((char) => {
    const test = `${line}${char}`;
    if (context.measureText(test).width <= maxWidth || !line) {
      line = test;
      return;
    }
    lines.push(line);
    line = char;
  });
  if (line) lines.push(line);
  lines.slice(0, maxLines).forEach((item, index) => {
    const clipped = index === maxLines - 1 && lines.length > maxLines
      ? `${Array.from(item).slice(0, -2).join("")}...`
      : item;
    context.fillText(clipped, x, y + index * lineHeight);
  });
}

function drawExportDots(context, completed, total) {
  const safeTotal = Math.max(Math.min(Number(total || 0), 12), 1);
  const safeCompleted = Math.max(Math.min(Number(completed || 0), safeTotal), 0);
  const radius = safeTotal > 8 ? 13 : 18;
  const gap = safeTotal > 8 ? 38 : 56;
  const startX = 430;
  const y = 1292;
  for (let index = 0; index < safeTotal; index += 1) {
    const dotX = startX + index * gap;
    context.beginPath();
    context.arc(dotX, y, radius, 0, Math.PI * 2);
    context.fillStyle = index < safeCompleted ? "#6EA154" : "#FFFFFF";
    context.fill();
    context.strokeStyle = "#6EA154";
    context.lineWidth = 3;
    context.stroke();
  }
}

async function exportSummaryCard() {
  exportButton.disabled = true;
  exportButton.textContent = "กำลังสร้าง PNG...";
  try {
    await document.fonts.ready;
    const data = new FormData(form);
    const course = courseMeta[data.get("courseType")] || courseMeta.clay;
    const sessionNumber = Number(data.get("sessionNumber") || 1);
    const totalSessions = Number(data.get("totalSessions") || 1);
    const remaining = Math.max(totalSessions - sessionNumber, 0);
    const studentName = String(data.get("studentName") || "โลมา").trim().slice(0, 12);
    const [logo, location, sun, photo, courseIcon, book, calendar, noteHeart, heart, trophy, sparkle] = await Promise.all([
      loadExportImage("assets/card/01_logo_short.png"),
      loadExportImage("assets/card/icon_location.png"),
      loadExportImage("assets/card/deco_sun_rays_yellow.png"),
      loadExportImage(card.querySelector('[data-field="photo"]').src),
      loadExportImage(course.icon),
      loadExportImage("assets/card/icon_book.png"),
      loadExportImage("assets/card/icon_calendar.png"),
      loadExportImage("assets/card/icon_teacher_note_heart.png"),
      loadExportImage("assets/card/icon_heart.png"),
      loadExportImage("assets/card/icon_trophy.png"),
      loadExportImage("assets/card/doodle_sparkle_yellow.png")
    ]);
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1350;
    const context = canvas.getContext("2d");
    context.fillStyle = "#FAF6EF";
    context.fillRect(0, 0, 1080, 1350);
    context.drawImage(logo, 58, 55, 330, 94);
    context.strokeStyle = "#D7B99C";
    context.beginPath();
    context.moveTo(404, 62);
    context.lineTo(404, 150);
    context.stroke();
    drawCardBox(context, 778, 50, 254, 60, 30, "#FFFFFF", "#DFBF9F");
    context.drawImage(location, 804, 63, 34, 34);
    context.fillStyle = "#4F8B37";
    context.font = "800 26px Kanit, sans-serif";
    context.fillText(`สาขา ${String(data.get("branchName") || "ชลบุรี")}`, 848, 89);
    context.drawImage(sun, 42, 136, 78, 78);
    context.font = "900 58px Kanit, sans-serif";
    context.fillStyle = "#4A372E";
    context.fillText("วันนี้ ", 124, 210);
    const titleStart = 124 + context.measureText("วันนี้ ").width;
    context.fillStyle = "#F05B3E";
    context.fillText(`น้อง${studentName.replace(/^น้อง/, "")}`, titleStart, 210);
    const titleMid = titleStart + context.measureText(`น้อง${studentName.replace(/^น้อง/, "")}`).width;
    context.fillStyle = "#4A372E";
    context.fillText(" เรียนอะไรบ้าง?", titleMid, 210);
    drawCardBox(context, 48, 270, 984, 594, 38, "#FFFFFF", "#F1DEC8");
    drawCoverImage(context, photo, 62, 284, 956, 566, 26);
    context.fillStyle = "#62A742";
    drawRoundedRect(context, 78, 304, 218, 54, 8);
    context.fill();
    context.fillStyle = "#FFFFFF";
    context.font = "900 25px Kanit, sans-serif";
    context.fillText("★  ผลงานวันนี้", 96, 339);
    drawCardBox(context, 48, 895, 984, 126, 26, "#FFFFFF", "#F1DEC8");
    context.drawImage(courseIcon, 86, 931, 56, 56);
    context.fillStyle = "#4F8B37";
    context.font = "800 25px Kanit, sans-serif";
    wrapCanvasText(context, course.name, 158, 955, 225, 28, 2);
    context.drawImage(book, 438, 931, 52, 52);
    context.fillStyle = "#4A372E";
    context.font = "800 25px Kanit, sans-serif";
    context.fillText(`บทที่ ${data.get("lessonNumber") || "1"}`, 504, 952);
    context.font = "700 22px Kanit, sans-serif";
    context.fillText(String(data.get("lessonTitle") || ""), 504, 984);
    context.drawImage(calendar, 662, 931, 52, 52);
    context.font = "800 24px Kanit, sans-serif";
    context.fillText(formatThaiDate(data.get("classDate")), 724, 968);
    context.font = "800 22px Kanit, sans-serif";
    context.fillText("ครั้งที่", 896, 940);
    context.fillStyle = "#F05B3E";
    context.font = "900 45px Kanit, sans-serif";
    context.fillText(`${sessionNumber}/${totalSessions}`, 884, 988);
    drawCardBox(context, 48, 1044, 984, 174, 26, "#FFFFFF", "#F1DEC8");
    context.drawImage(noteHeart, 72, 1088, 88, 88);
    context.globalAlpha = .36;
    context.drawImage(heart, 856, 1094, 108, 108);
    context.globalAlpha = 1;
    context.fillStyle = "#F05B3E";
    context.font = "900 31px Kanit, sans-serif";
    context.fillText("ข้อความจากคุณครู", 188, 1105);
    context.fillStyle = "#4A372E";
    context.font = "700 25px Kanit, sans-serif";
    wrapCanvasText(context, String(data.get("teacherNote") || ""), 188, 1148, 610, 34, 3);
    drawCardBox(context, 48, 1238, 984, 102, 28, "#F2F8EC", "#93B985");
    context.drawImage(trophy, 70, 1253, 72, 72);
    context.fillStyle = "#4A372E";
    context.font = "900 30px Kanit, sans-serif";
    context.fillText(`เรียนแล้ว ${sessionNumber} ครั้ง`, 178, 1284);
    context.font = "500 20px Kanit, sans-serif";
    context.fillText("เก่งขึ้นทุกครั้งเลยนะ!", 178, 1316);
    drawExportDots(context, sessionNumber, totalSessions);
    context.font = "900 27px Kanit, sans-serif";
    context.fillText("คงเหลือ", 786, 1298);
    context.fillStyle = "#18743D";
    context.font = "900 34px Kanit, sans-serif";
    context.fillText(String(remaining), 888, 1298);
    context.fillStyle = "#4A372E";
    context.font = "900 27px Kanit, sans-serif";
    context.fillText("ครั้ง", 930, 1298);
    context.drawImage(sparkle, 960, 1256, 54, 54);
    const link = document.createElement("a");
    link.download = `toko-poppy-summary-${studentName || "student"}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    exportButton.disabled = false;
    exportButton.textContent = "Export PNG 1080 x 1350";
  } catch (error) {
    console.error(error);
    alert("Export PNG ไม่สำเร็จ กรุณาลองเปิดผ่าน local server หรือ deploy แล้วลองใหม่");
    exportButton.disabled = false;
    exportButton.textContent = "Export PNG 1080 x 1350";
  }
}

form.addEventListener("input", updateCard);
form.photo.addEventListener("change", async () => {
  const file = form.photo.files?.[0];
  if (!file) return;
  card.querySelector('[data-field="photo"]').src = await fileToDataUrl(file);
});
exportButton.addEventListener("click", exportSummaryCard);
updateCard();
