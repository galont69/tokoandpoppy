const missionSelectView = document.querySelector("#missionSelectView");
const mapSelectView = document.querySelector("#mapSelectView");
const gameView = document.querySelector("#gameView");
const mapGrid = document.querySelector("#mapGrid");
const gameBoard = document.querySelector("#gameBoard");
const commandQueue = document.querySelector("#commandQueue");
const runButton = document.querySelector("#runProgram");
const resultModal = document.querySelector("#resultModal");
const toast = document.querySelector("#codekidsToast");

const levels = [
  {
    number: 1, stars: [{ row: 2, col: 2 }], moves: 3, start: { row: 5, col: 2 },
    solution: ["up", "up", "up"], rocks: [], trees: [],
    title: "ก้าวแรกของ Toko", description: "เดินตรง 3 ช่อง ไม่มีอุปสรรค", icon: "🌟"
  },
  {
    number: 2, stars: [{ row: 1, col: 3 }], moves: 4, start: { row: 5, col: 3 },
    solution: ["up", "up", "up", "up"], rocks: [], trees: [],
    title: "เดินอีกนิดนะ", description: "เดินตรง 4 ช่อง ไม่มีอุปสรรค", icon: "👣"
  },
  {
    number: 3, stars: [{ row: 1, col: 2 }], moves: 5, start: { row: 5, col: 1 },
    solution: ["up", "up", "up", "up", "right"], rocks: [], trees: [],
    title: "ลองเลี้ยวดูสิ", description: "เก็บ 1 ดาว ด้วยคำสั่ง 5 ช่อง", icon: "↗️"
  },
  {
    number: 4, stars: [{ row: 3, col: 1 }, { row: 1, col: 2 }], moves: 5,
    start: { row: 5, col: 1 }, solution: ["up", "up", "up", "up", "right"],
    rocks: [], trees: [], title: "ดาวสองดวง", description: "เก็บ 2 ดาว ไม่มีอุปสรรค", icon: "⭐"
  },
  {
    number: 5, stars: [{ row: 3, col: 1 }, { row: 1, col: 2 }], moves: 5,
    start: { row: 5, col: 1 }, solution: ["up", "up", "up", "up", "right"],
    rocks: [{ row: 4, col: 2 }, { row: 2, col: 2 }], trees: [{ row: 3, col: 4 }],
    title: "หลบก้อนหิน", description: "เก็บ 2 ดาว มีอุปสรรค", icon: "🪨"
  },
  {
    number: 6, stars: [{ row: 3, col: 1 }, { row: 0, col: 2 }], moves: 7,
    start: { row: 5, col: 0 }, solution: ["up", "right", "up", "up", "right", "up", "up"],
    rocks: [{ row: 4, col: 2 }, { row: 2, col: 0 }, { row: 1, col: 3 }],
    trees: [{ row: 3, col: 4 }], title: "เส้นทางซิกแซก", description: "เก็บ 2 ดาว เดิน 7 ช่อง", icon: "🌿"
  },
  {
    number: 7, stars: [{ row: 4, col: 1 }, { row: 3, col: 2 }, { row: 1, col: 3 }], moves: 7,
    start: { row: 5, col: 0 }, solution: ["up", "right", "up", "right", "up", "right", "up"],
    rocks: [{ row: 5, col: 2 }, { row: 2, col: 1 }, { row: 2, col: 4 }],
    trees: [{ row: 4, col: 4 }], title: "สามดาวแรก", description: "เก็บ 3 ดาว เดิน 7 ช่อง", icon: "✨"
  },
  {
    number: 8, stars: [{ row: 5, col: 2 }, { row: 3, col: 2 }, { row: 1, col: 1 }], moves: 7,
    start: { row: 5, col: 0 }, solution: ["right", "right", "up", "up", "left", "up", "up"],
    rocks: [{ row: 4, col: 1 }, { row: 2, col: 3 }, { row: 1, col: 4 }],
    trees: [{ row: 4, col: 4 }], title: "อ้อมแล้วกลับ", description: "เก็บ 3 ดาว มีอุปสรรค", icon: "🍃"
  },
  {
    number: 9, stars: [{ row: 3, col: 0 }, { row: 2, col: 2 }, { row: 0, col: 4 }], moves: 9,
    start: { row: 5, col: 0 }, solution: ["up", "up", "right", "right", "up", "up", "right", "right", "up"],
    rocks: [{ row: 4, col: 2 }, { row: 3, col: 3 }, { row: 1, col: 1 }],
    trees: [{ row: 5, col: 4 }], title: "ทางยาวเก้าก้าว", description: "เก็บ 3 ดาว เดิน 9 ช่อง", icon: "🗺️"
  },
  {
    number: 10, stars: [{ row: 4, col: 2 }, { row: 2, col: 3 }, { row: 0, col: 5 }], moves: 10,
    start: { row: 5, col: 0 },
    solution: ["right", "up", "right", "up", "right", "up", "right", "up", "right", "up"],
    rocks: [{ row: 5, col: 3 }, { row: 3, col: 1 }, { row: 1, col: 2 }, { row: 2, col: 5 }],
    trees: [{ row: 4, col: 4 }], title: "นักเก็บดาวตัวจริง", description: "เก็บ 3 ดาว เดิน 10 ช่อง", icon: "🏅"
  }
].map((level) => ({ rows: 6, cols: 6, ...level }));

const directions = {
  up: { row: -1, col: 0, symbol: "↑", facing: "back" },
  down: { row: 1, col: 0, symbol: "↓", facing: "front" },
  left: { row: 0, col: -1, symbol: "←", facing: "left" },
  right: { row: 0, col: 1, symbol: "→", facing: "right" }
};

const frames = {
  front: ["assets/codekids/toko-front-a.png", "assets/codekids/toko-front-b.png"],
  back: ["assets/codekids/toko-back-a.png", "assets/codekids/toko-back-b.png"],
  left: ["assets/codekids/toko-left-a.png", "assets/codekids/toko-left-b.png"],
  right: ["assets/codekids/toko-right-a.png", "assets/codekids/toko-right-b.png"]
};

let currentLevel = levels[0];
let commands = [];
let player = { ...currentLevel.start };
let collectedStars = new Set();
let running = false;
let tokoElement = null;
let walkFrame = 0;

function getProgress() {
  try {
    return JSON.parse(localStorage.getItem("codekids-mission-1-progress")) || {
      completedMaps: [], starsByMap: {}
    };
  } catch {
    return { completedMaps: [], starsByMap: {} };
  }
}

function saveProgress() {
  const progress = getProgress();
  if (!progress.completedMaps.includes(currentLevel.number)) {
    progress.completedMaps.push(currentLevel.number);
  }
  progress.starsByMap[currentLevel.number] = currentLevel.stars.length;
  localStorage.setItem("codekids-mission-1-progress", JSON.stringify(progress));
}

function renderMaps() {
  const progress = getProgress();
  const highestCompleted = progress.completedMaps.length
    ? Math.max(...progress.completedMaps) : 0;
  mapGrid.innerHTML = levels.map((level) => {
    const completed = progress.completedMaps.includes(level.number);
    const unlocked = level.number <= highestCompleted + 1;
    const stars = "★".repeat(progress.starsByMap[level.number] || 0) +
      "☆".repeat(level.stars.length - (progress.starsByMap[level.number] || 0));
    return `
      <button class="map-card ${unlocked ? "unlocked" : "locked"}" type="button"
        ${unlocked ? `data-map="${level.number}"` : "disabled"}>
        <span class="map-number">${String(level.number).padStart(2, "0")}</span>
        <span class="map-meta">${completed ? "🏅" : unlocked ? "▶" : "🔒"}</span>
        <div class="map-art">${level.icon}</div>
        <h3>${level.title}</h3>
        <p>${level.description}<br>${level.moves} คำสั่ง</p>
        <div class="map-stars">${unlocked ? stars : "ผ่าน Map ก่อนหน้า"}</div>
      </button>
    `;
  }).join("");
  const completedCount = progress.completedMaps.length;
  const totalStars = Object.values(progress.starsByMap)
    .reduce((sum, count) => sum + count, 0);
  document.querySelector("#courseProgress").style.width = `${completedCount * 10}%`;
  document.querySelector("#courseProgressText").textContent = `${completedCount}/10`;
  document.querySelector("#totalStars").textContent = totalStars;
  document.querySelector("#missionTotalStars").textContent = totalStars;
  document.querySelector("#missionProgressBar").style.width =
    `${completedCount * 10}%`;
  document.querySelector("#missionProgressText").textContent =
    `${completedCount}/10 แผนที่`;
}

function hasPosition(list, row, col) {
  return list.some((item) => item.row === row && item.col === col);
}

function renderBoard() {
  gameBoard.style.setProperty("--cols", currentLevel.cols);
  gameBoard.innerHTML = "";
  for (let row = 0; row < currentLevel.rows; row += 1) {
    for (let col = 0; col < currentLevel.cols; col += 1) {
      const cell = document.createElement("div");
      cell.className = "board-cell path";
      if (hasPosition(currentLevel.rocks, row, col)) {
        cell.innerHTML = '<span class="cell-object">🪨</span>';
      } else if (hasPosition(currentLevel.trees, row, col)) {
        cell.innerHTML = '<span class="cell-object">🌳</span>';
      } else {
        const starIndex = currentLevel.stars.findIndex(
          (star) => star.row === row && star.col === col
        );
        if (starIndex >= 0) {
          cell.innerHTML =
            `<span class="cell-object cell-star" data-star="${starIndex}">⭐</span>`;
        }
      }
      gameBoard.appendChild(cell);
    }
  }
  tokoElement = document.createElement("img");
  tokoElement.className = "toko-player";
  tokoElement.alt = "Toko";
  tokoElement.src = frames.front[0];
  tokoElement.style.width = `${100 / currentLevel.cols}%`;
  tokoElement.style.height = `${100 / currentLevel.rows}%`;
  gameBoard.appendChild(tokoElement);
  positionToko(false);
}

function positionToko(animate = true) {
  if (!tokoElement) return;
  if (!animate) tokoElement.style.transition = "none";
  tokoElement.style.left = `${(player.col / currentLevel.cols) * 100}%`;
  tokoElement.style.top = `${(player.row / currentLevel.rows) * 100}%`;
  if (!animate) requestAnimationFrame(() => { tokoElement.style.transition = ""; });
}

function renderQueue(activeIndex = -1) {
  document.querySelector("#commandCount").textContent =
    `${commands.length}/${currentLevel.moves}`;
  if (!commands.length) {
    commandQueue.innerHTML =
      '<div class="queue-empty">แตะลูกศรด้านล่าง<br>เพื่อวางแผนการเดิน</div>';
    return;
  }
  commandQueue.innerHTML = commands.map((command, index) => `
    <span class="command-token ${index === activeIndex ? "active" : ""} ${index < activeIndex ? "done" : ""}">
      ${directions[command].symbol}
    </span>
  `).join("");
}

function setControlsDisabled(disabled) {
  document.querySelectorAll(".arrow-pad button,.command-actions button")
    .forEach((button) => { button.disabled = disabled; });
  runButton.disabled = disabled || commands.length === 0;
}

function addCommand(command) {
  if (running) return;
  if (commands.length >= currentLevel.moves) {
    showToast(`แผนที่นี้ใช้ ${currentLevel.moves} คำสั่งนะ`);
    return;
  }
  commands.push(command);
  renderQueue();
  setControlsDisabled(false);
}

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function walk(command) {
  const direction = directions[command];
  const next = {
    row: player.row + direction.row,
    col: player.col + direction.col
  };
  walkFrame = 1 - walkFrame;
  tokoElement.src = frames[direction.facing][walkFrame];
  const outside = next.row < 0 || next.row >= currentLevel.rows ||
    next.col < 0 || next.col >= currentLevel.cols;
  const obstacle = hasPosition(currentLevel.rocks, next.row, next.col) ||
    hasPosition(currentLevel.trees, next.row, next.col);
  if (outside || obstacle) {
    tokoElement.classList.add("bump");
    await sleep(360);
    tokoElement.classList.remove("bump");
    return false;
  }
  player = next;
  positionToko();
  await sleep(430);
  const starIndex = currentLevel.stars.findIndex(
    (star) => star.row === player.row && star.col === player.col
  );
  if (starIndex >= 0 && !collectedStars.has(starIndex)) {
    collectedStars.add(starIndex);
    gameBoard.querySelector(`[data-star="${starIndex}"]`)?.classList.add("collected");
    document.querySelector("#levelStarCount").textContent =
      `${collectedStars.size}/${currentLevel.stars.length}`;
    await sleep(180);
  }
  return true;
}

async function runProgram() {
  if (running || !commands.length) return;
  if (commands.length !== currentLevel.moves) {
    showToast(`วางให้ครบ ${currentLevel.moves} คำสั่งก่อนเริ่มนะ`);
    return;
  }
  running = true;
  resetPlayerOnly();
  setControlsDisabled(true);
  document.querySelector("#gameHint").textContent = "Toko กำลังทำตามแผนของหนู...";
  let hitObstacle = false;
  for (let index = 0; index < commands.length; index += 1) {
    renderQueue(index);
    if (!await walk(commands[index])) {
      hitObstacle = true;
      break;
    }
  }
  renderQueue(commands.length);
  running = false;
  if (!hitObstacle && collectedStars.size === currentLevel.stars.length) {
    saveProgress();
    renderMaps();
    showResult(true);
  } else {
    document.querySelector("#gameHint").textContent = hitObstacle
      ? "โอ๊ะ! Toko ชนสิ่งกีดขวาง ลองเปลี่ยนเส้นทางนะ"
      : "ยังเก็บดาวไม่ครบ ลองจัดคำสั่งใหม่อีกครั้ง";
    showResult(false, hitObstacle);
    setControlsDisabled(false);
  }
}

function resetPlayerOnly() {
  player = { ...currentLevel.start };
  collectedStars = new Set();
  walkFrame = 0;
  gameBoard.querySelectorAll(".cell-star").forEach((star) => {
    star.classList.remove("collected");
  });
  document.querySelector("#levelStarCount").textContent =
    `0/${currentLevel.stars.length}`;
  if (tokoElement) {
    tokoElement.src = frames.front[0];
    positionToko(false);
  }
}

function resetMap(clear = true) {
  resetPlayerOnly();
  if (clear) commands = [];
  renderQueue();
  setControlsDisabled(false);
  document.querySelector("#gameHint").textContent =
    `เก็บดาวให้ครบด้วย ${currentLevel.moves} คำสั่งนะ!`;
}

function showResult(success, hitObstacle = false) {
  document.querySelector("#resultKicker").textContent =
    success ? `MAP ${currentLevel.number} COMPLETE` : "ลองอีกครั้งได้เสมอ";
  document.querySelector("#resultTitle").textContent =
    success ? "เยี่ยมมาก นักวางแผน!" : "เกือบสำเร็จแล้ว!";
  document.querySelector("#resultMessage").textContent = success
    ? `Toko เก็บดาวครบ ${currentLevel.stars.length} ดวงแล้ว`
    : hitObstacle
      ? "คำสั่งพา Toko ชนสิ่งกีดขวาง ลองเปลี่ยนเส้นทางดูนะ"
      : "ลองสังเกตตำแหน่งดาว แล้วจัดคำสั่งใหม่อีกครั้ง";
  document.querySelector("#resultStars").textContent =
    success ? "★".repeat(currentLevel.stars.length) :
      "☆".repeat(currentLevel.stars.length);
  document.querySelector("#resultToko").src =
    success ? frames.front[0] : frames.front[1];
  document.querySelector("#finishMap").hidden = !success;
  const nextMapButton = document.querySelector("#nextMap");
  nextMapButton.hidden = !success || currentLevel.number >= levels.length;
  if (success && currentLevel.number < levels.length) {
    nextMapButton.textContent = `แผนที่ ${currentLevel.number + 1} ต่อไป →`;
  }
  resultModal.classList.add("open");
  resultModal.setAttribute("aria-hidden", "false");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function openMap(mapNumber) {
  currentLevel = levels.find((level) => level.number === mapNumber) || levels[0];
  document.querySelector("#currentMapLabel").textContent =
    `MAP ${currentLevel.number} / 10`;
  document.querySelector("#currentMapTitle").textContent = currentLevel.title;
  document.querySelector("#missionTitle").textContent =
    `พา Toko เก็บดาว ${currentLevel.stars.length} ดวง`;
  document.querySelector("#missionDescription").textContent =
    `${currentLevel.rocks.length || currentLevel.trees.length ? "หลบอุปสรรคและ" : ""}เดิน ${currentLevel.moves} ช่อง เพื่อเก็บดาวให้ครบ`;
  document.querySelector("#commandLimitText").textContent =
    `ใช้ ${currentLevel.moves} คำสั่ง`;
  missionSelectView.hidden = true;
  mapSelectView.hidden = true;
  gameView.hidden = false;
  window.scrollTo({ top: 0 });
  commands = [];
  renderBoard();
  resetMap();
}

function closeResult() {
  resultModal.classList.remove("open");
  resultModal.setAttribute("aria-hidden", "true");
}

mapGrid.addEventListener("click", (event) => {
  const card = event.target.closest("[data-map]");
  if (card) openMap(Number(card.dataset.map));
});
document.querySelector("#openMissionOne").addEventListener("click", () => {
  missionSelectView.hidden = true;
  mapSelectView.hidden = false;
  gameView.hidden = true;
  renderMaps();
  window.scrollTo({ top: 0 });
});
document.querySelector("#backToMissions").addEventListener("click", () => {
  mapSelectView.hidden = true;
  gameView.hidden = true;
  missionSelectView.hidden = false;
  renderMaps();
  window.scrollTo({ top: 0 });
});
document.querySelectorAll("[data-command]").forEach((button) => {
  button.addEventListener("click", () => addCommand(button.dataset.command));
});
document.querySelector("#undoCommand").addEventListener("click", () => {
  if (!running) {
    commands.pop();
    renderQueue();
    setControlsDisabled(false);
  }
});
document.querySelector("#clearCommands").addEventListener("click", () => {
  if (!running) {
    commands = [];
    renderQueue();
    setControlsDisabled(false);
  }
});
runButton.addEventListener("click", runProgram);
document.querySelector("#resetMap").addEventListener("click", () => resetMap());
document.querySelector("#backToMaps").addEventListener("click", () => {
  if (running) return;
  missionSelectView.hidden = true;
  gameView.hidden = true;
  mapSelectView.hidden = false;
  renderMaps();
  window.scrollTo({ top: 0 });
});
document.querySelector("#tryAgain").addEventListener("click", () => {
  closeResult();
  resetMap(false);
});
document.querySelector("#finishMap").addEventListener("click", () => {
  closeResult();
  missionSelectView.hidden = true;
  gameView.hidden = true;
  mapSelectView.hidden = false;
  renderMaps();
  window.scrollTo({ top: 0 });
});
document.querySelector("#nextMap").addEventListener("click", () => {
  if (currentLevel.number >= levels.length) return;
  const nextMapNumber = currentLevel.number + 1;
  closeResult();
  openMap(nextMapNumber);
});

renderMaps();
