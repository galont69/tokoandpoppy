const mapSelectView = document.querySelector("#mapSelectView");
const gameView = document.querySelector("#gameView");
const mapGrid = document.querySelector("#mapGrid");
const gameBoard = document.querySelector("#gameBoard");
const commandQueue = document.querySelector("#commandQueue");
const queueEmpty = document.querySelector("#queueEmpty");
const runButton = document.querySelector("#runProgram");
const resultModal = document.querySelector("#resultModal");
const toast = document.querySelector("#codekidsToast");

const maps = [
  { number: 1, title: "ทางกลับบ้านของ Toko", description: "ฝึกวางคำสั่ง ขึ้น ลง ซ้าย ขวา", icon: "🏡", unlocked: true },
  { number: 2, title: "สะพานใบไม้", description: "เลือกเส้นทางที่สั้นกว่า", icon: "🌿" },
  { number: 3, title: "สวนเห็ดมหัศจรรย์", description: "หลบสิ่งกีดขวางหลายจุด", icon: "🍄" },
  { number: 4, title: "ตามหา Poppy", description: "เดินตามแผนที่ให้ถูกลำดับ", icon: "🐰" },
  { number: 5, title: "ลำธารประกายดาว", description: "เก็บดาวให้ครบทุกดวง", icon: "⭐" },
  { number: 6, title: "ป่าฝนแสนซน", description: "คิดก่อนเดินทุกก้าว", icon: "🌧️" },
  { number: 7, title: "เมืองของเล่น", description: "วางแผนเส้นทางที่ซับซ้อนขึ้น", icon: "🧸" },
  { number: 8, title: "ปราสาทสายรุ้ง", description: "ฝึกใช้คำสั่งอย่างประหยัด", icon: "🌈" },
  { number: 9, title: "คืนหิ่งห้อย", description: "จำเส้นทางและแก้ปัญหา", icon: "✨" },
  { number: 10, title: "งานเลี้ยงนิทาน", description: "ภารกิจใหญ่ของนักคิดตัวน้อย", icon: "🎉" }
];

const level = {
  rows: 7,
  cols: 7,
  start: { row: 6, col: 0 },
  home: { row: 0, col: 6 },
  stars: [{ row: 5, col: 1 }, { row: 3, col: 3 }, { row: 1, col: 5 }],
  rocks: [
    { row: 6, col: 2 }, { row: 5, col: 2 }, { row: 4, col: 2 },
    { row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 },
    { row: 4, col: 4 }, { row: 4, col: 5 }, { row: 2, col: 5 },
    { row: 1, col: 3 }, { row: 0, col: 3 }
  ],
  trees: [{ row: 6, col: 5 }, { row: 3, col: 0 }, { row: 0, col: 1 }]
};

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

let commands = [];
let player = { ...level.start };
let collectedStars = new Set();
let running = false;
let tokoElement = null;
let walkFrame = 0;

function getSavedResult() {
  try {
    return JSON.parse(localStorage.getItem("codekids-map-1") || "null");
  } catch {
    return null;
  }
}

function renderMaps() {
  const saved = getSavedResult();
  mapGrid.innerHTML = maps.map((map) => {
    const completed = map.number === 1 && saved?.completed;
    return `
      <button class="map-card ${map.unlocked ? "unlocked" : "locked"}" type="button"
        ${map.unlocked ? `data-map="${map.number}"` : "disabled"}>
        <span class="map-number">${String(map.number).padStart(2, "0")}</span>
        <span class="map-meta">${completed ? "🏅" : map.unlocked ? "▶" : "🔒"}</span>
        <div class="map-art">${map.icon}</div>
        <h3>${map.title}</h3>
        <p>${map.description}</p>
        <div class="map-stars">${completed ? "★★★" : map.unlocked ? "☆☆☆" : "เร็วๆ นี้"}</div>
      </button>
    `;
  }).join("");
  const completed = saved?.completed ? 1 : 0;
  document.querySelector("#courseProgress").style.width = `${completed * 10}%`;
  document.querySelector("#courseProgressText").textContent = `${completed}/10`;
  document.querySelector("#totalStars").textContent = saved?.stars || 0;
}

function cellKey(position) {
  return `${position.row}-${position.col}`;
}

function hasPosition(list, row, col) {
  return list.some((item) => item.row === row && item.col === col);
}

function renderBoard() {
  gameBoard.style.setProperty("--cols", level.cols);
  gameBoard.innerHTML = "";
  for (let row = 0; row < level.rows; row += 1) {
    for (let col = 0; col < level.cols; col += 1) {
      const cell = document.createElement("div");
      cell.className = "board-cell path";
      cell.dataset.row = row;
      cell.dataset.col = col;
      if (hasPosition(level.rocks, row, col)) {
        cell.innerHTML = '<span class="cell-object">🪨</span>';
      } else if (hasPosition(level.trees, row, col)) {
        cell.innerHTML = '<span class="cell-object">🌳</span>';
      } else if (level.home.row === row && level.home.col === col) {
        cell.innerHTML = '<span class="cell-object">🏡</span>';
      } else {
        const starIndex = level.stars.findIndex(
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
  gameBoard.appendChild(tokoElement);
  positionToko(false);
}

function positionToko(animate = true) {
  if (!tokoElement) return;
  if (!animate) tokoElement.style.transition = "none";
  tokoElement.style.left = `${(player.col / level.cols) * 100}%`;
  tokoElement.style.top = `${(player.row / level.rows) * 100}%`;
  if (!animate) {
    requestAnimationFrame(() => {
      tokoElement.style.transition = "";
    });
  }
}

function renderQueue(activeIndex = -1) {
  document.querySelector("#commandCount").textContent = `${commands.length}/12`;
  if (!commands.length) {
    commandQueue.innerHTML =
      '<div class="queue-empty" id="queueEmpty">แตะลูกศรด้านล่าง<br>เพื่อวางแผนการเดิน</div>';
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
  if (commands.length >= 12) {
    showToast("วางคำสั่งได้สูงสุด 12 คำสั่งนะ");
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

  const outside = next.row < 0 || next.row >= level.rows ||
    next.col < 0 || next.col >= level.cols;
  const obstacle = hasPosition(level.rocks, next.row, next.col) ||
    hasPosition(level.trees, next.row, next.col);
  if (outside || obstacle) {
    tokoElement.classList.add("bump");
    await sleep(380);
    tokoElement.classList.remove("bump");
    return false;
  }

  player = next;
  positionToko();
  await sleep(480);

  const starIndex = level.stars.findIndex(
    (star) => star.row === player.row && star.col === player.col
  );
  if (starIndex >= 0 && !collectedStars.has(starIndex)) {
    collectedStars.add(starIndex);
    const star = gameBoard.querySelector(`[data-star="${starIndex}"]`);
    star?.classList.add("collected");
    document.querySelector("#levelStarCount").textContent =
      `${collectedStars.size}/3`;
    await sleep(220);
  }
  return true;
}

async function runProgram() {
  if (running || !commands.length) return;
  running = true;
  resetPlayerOnly();
  setControlsDisabled(true);
  document.querySelector("#gameHint").textContent =
    "Toko กำลังทำตามแผนของหนู...";

  let hitObstacle = false;
  for (let index = 0; index < commands.length; index += 1) {
    renderQueue(index);
    const moved = await walk(commands[index]);
    if (!moved) {
      hitObstacle = true;
      break;
    }
  }
  renderQueue(commands.length);
  running = false;

  const reachedHome =
    player.row === level.home.row && player.col === level.home.col;
  if (reachedHome && collectedStars.size === level.stars.length) {
    finishLevel(true);
  } else {
    document.querySelector("#gameHint").textContent = hitObstacle
      ? "โอ๊ะ! Toko ชนสิ่งกีดขวาง ลองแก้ชุดคำสั่งดูนะ"
      : reachedHome
        ? "ถึงบ้านแล้ว แต่ยังเก็บดาวไม่ครบ ลองวางแผนใหม่!"
        : "ยังไม่ถึงบ้าน ลองเพิ่มหรือเปลี่ยนคำสั่งดูนะ";
    showResult(false, hitObstacle);
    setControlsDisabled(false);
  }
}

function resetPlayerOnly() {
  player = { ...level.start };
  collectedStars = new Set();
  walkFrame = 0;
  gameBoard.querySelectorAll(".cell-star").forEach((star) => {
    star.classList.remove("collected");
  });
  document.querySelector("#levelStarCount").textContent = "0/3";
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
    "วางแผนให้ดีก่อนกดเริ่มนะ!";
}

function showResult(success, hitObstacle = false) {
  document.querySelector("#resultKicker").textContent =
    success ? "MAP COMPLETE" : "ลองอีกครั้งได้เสมอ";
  document.querySelector("#resultTitle").textContent =
    success ? "เยี่ยมมาก นักวางแผน!" : "เกือบสำเร็จแล้ว!";
  document.querySelector("#resultMessage").textContent = success
    ? "Toko เก็บดาวครบและกลับถึงบ้านอย่างปลอดภัย"
    : hitObstacle
      ? "คำสั่งพา Toko ชนสิ่งกีดขวาง ลองเปลี่ยนเส้นทางดูนะ"
      : "ลองสังเกตตำแหน่งดาวและบ้าน แล้วจัดคำสั่งใหม่อีกครั้ง";
  document.querySelector("#resultStars").textContent =
    success ? "★★★" : "☆☆☆";
  document.querySelector("#resultToko").src =
    success ? frames.front[0] : frames.front[1];
  document.querySelector("#finishMap").hidden = !success;
  resultModal.classList.add("open");
  resultModal.setAttribute("aria-hidden", "false");
}

function finishLevel() {
  localStorage.setItem("codekids-map-1", JSON.stringify({
    completed: true,
    stars: 3,
    completedAt: new Date().toISOString()
  }));
  renderMaps();
  showResult(true);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function openMap() {
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
  const card = event.target.closest("[data-map='1']");
  if (card) openMap();
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
  gameView.hidden = true;
  mapSelectView.hidden = false;
  renderMaps();
  window.scrollTo({ top: 0 });
});

renderMaps();
