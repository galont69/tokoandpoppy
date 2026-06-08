const views = {
  missions: document.querySelector("#missionSelectView"),
  lessons: document.querySelector("#lessonSelectView"),
  levels: document.querySelector("#levelSelectView"),
  game: document.querySelector("#gameView")
};
const missionGrid = document.querySelector("#missionGrid");
const lessonGrid = document.querySelector("#lessonGrid");
const levelGrid = document.querySelector("#levelGrid");
const gameBoard = document.querySelector("#gameBoard");
const commandQueue = document.querySelector("#commandQueue");
const runButton = document.querySelector("#runProgram");
const resultModal = document.querySelector("#resultModal");
const toast = document.querySelector("#codekidsToast");

const directions = {
  up: { row: -1, col: 0, symbol: "↑", facing: "back", label: "ขึ้น" },
  down: { row: 1, col: 0, symbol: "↓", facing: "front", label: "ลง" },
  left: { row: 0, col: -1, symbol: "←", facing: "left", label: "ซ้าย" },
  right: { row: 0, col: 1, symbol: "→", facing: "right", label: "ขวา" }
};

const frames = {
  front: ["assets/codekids/toko-front-a.png", "assets/codekids/toko-front-b.png"],
  back: ["assets/codekids/toko-back-a.png", "assets/codekids/toko-back-b.png"],
  left: ["assets/codekids/toko-left-a.png", "assets/codekids/toko-left-b.png"],
  right: ["assets/codekids/toko-right-a.png", "assets/codekids/toko-right-b.png"]
};

const missions = [
  {
    id: 1,
    title: "โทโกะเดินเก็บเป้",
    story: "เตรียมตัวออกเดินทางตามหาเป้",
    description: "เริ่มจากการกดไอคอนคำสั่ง ฝึกลำดับขั้นตอน และพา Toko ไปหยิบเป้ให้สำเร็จ",
    icon: "🎒",
    active: true
  },
  { id: 2, title: "โทโกะตามหา Poppy", story: "เดินตามหาเพื่อนรัก", icon: "🐰" },
  { id: 3, title: "โทโกะเดินทางทูวีล", story: "ออกผจญภัยกับสองล้อ", icon: "🛞" },
  { id: 4, title: "โทโกะเดินทางเบลล่า", story: "เดินทางไปพบเบลล่า", icon: "🌸" },
  { id: 5, title: "โทโกะเดินหา Steve", story: "ตามหาเพื่อนนักสร้าง", icon: "🧢" },
  { id: 6, title: "โทโกะหาหุ่นยนต์กอริลล่า", story: "ภารกิจใหญ่ของนักคิด", icon: "🤖" }
];

const lessons = [
  {
    id: 1,
    title: "เดินตรงไปหาเป้",
    short: "ทางเดินกำหนดไว้",
    description: "เด็กๆ เห็นช่องทางเดินชัดเจน ฝึกกดหรือวางไอคอนเพื่อให้ Toko ขยับตามลำดับ",
    goal: "Icon Coding + Basic sequencing",
    icon: "👣"
  },
  {
    id: 2,
    title: "เดินตามทิศทาง",
    short: "คิดเส้นทางเองบน 3x5",
    description: "เริ่มมีเลี้ยวซ้ายและขวา เด็กต้องคิดว่าจะวางคำสั่งทิศทางใดก่อนหลัง",
    goal: "Directional sequencing",
    icon: "🧭"
  },
  {
    id: 3,
    title: "วางลำดับหลายขั้นตอน",
    short: "แผนที่เต็มพร้อมอุปสรรค",
    description: "เปิดพื้นที่มากขึ้น มีสิ่งกีดขวางเบาๆ ให้เด็กคิดเส้นทางเองและเรียงคำสั่งหลายขั้นตอน",
    goal: "Sequencing + Problem solving",
    icon: "🧩"
  }
];

function tracePath(start, solution) {
  const path = [{ ...start }];
  let position = { ...start };
  solution.forEach((command) => {
    const direction = directions[command];
    position = {
      row: position.row + direction.row,
      col: position.col + direction.col
    };
    path.push({ ...position });
  });
  return path;
}

function createLevel({ lessonId, number, title, rows, cols, start, solution, obstacles = [], guided = false }) {
  const path = tracePath(start, solution);
  return {
    id: `m1-l${lessonId}-${number}`,
    missionId: 1,
    lessonId,
    number,
    title,
    rows,
    cols,
    start,
    target: path[path.length - 1],
    solution,
    moves: solution.length,
    obstacles,
    guided,
    path: guided ? path : []
  };
}

const allLevels = [
  ...[
    ["right", "right"],
    ["right", "right", "right"],
    ["left", "left", "left"],
    ["up", "up", "up"],
    ["down", "down", "down"],
    ["right", "right", "right", "right"],
    ["up", "up", "up", "up"],
    ["down", "down", "down", "down"],
    ["right", "right", "right", "right", "right"],
    ["up", "up", "up", "up", "up"]
  ].map((solution, index) => {
    const starts = [
      { row: 0, col: 0 }, { row: 0, col: 0 }, { row: 0, col: 3 },
      { row: 3, col: 0 }, { row: 0, col: 0 }, { row: 0, col: 0 },
      { row: 4, col: 0 }, { row: 0, col: 0 }, { row: 0, col: 0 },
      { row: 5, col: 0 }
    ];
    const sizes = [
      [1, 3], [1, 4], [1, 4], [4, 1], [4, 1],
      [1, 5], [5, 1], [5, 1], [1, 6], [6, 1]
    ];
    return createLevel({
      lessonId: 1,
      number: index + 1,
      title: `ทางตรงด่านที่ ${index + 1}`,
      rows: sizes[index][0],
      cols: sizes[index][1],
      start: starts[index],
      solution,
      guided: true
    });
  }),
  ...[
    { start: { row: 2, col: 0 }, s: ["right", "right"] },
    { start: { row: 4, col: 1 }, s: ["up", "up", "up"] },
    { start: { row: 4, col: 0 }, s: ["up", "up", "right", "right"] },
    { start: { row: 0, col: 0 }, s: ["down", "down", "down", "right", "right"] },
    { start: { row: 4, col: 2 }, s: ["up", "up", "up", "left", "left"] },
    { start: { row: 0, col: 2 }, s: ["down", "down", "down", "down", "left", "left"] },
    { start: { row: 4, col: 0 }, s: ["up", "up", "up", "up", "right", "right"] },
    { start: { row: 0, col: 0 }, s: ["down", "down", "down", "down", "right", "right"] },
    { start: { row: 2, col: 0 }, s: ["up", "up", "right", "right"] },
    { start: { row: 4, col: 1 }, s: ["up", "up", "up", "up", "left"] }
  ].map((level, index) => createLevel({
    lessonId: 2,
    number: index + 1,
    title: `คิดทิศทางด่านที่ ${index + 1}`,
    rows: 5,
    cols: 3,
    start: level.start,
    solution: level.s
  })),
  ...[
    { start: { row: 6, col: 0 }, s: ["right", "right", "right"], o: [{ row: 5, col: 1 }, { row: 4, col: 4 }] },
    { start: { row: 6, col: 0 }, s: ["right", "right", "right", "up", "up"], o: [{ row: 5, col: 2 }, { row: 3, col: 4 }] },
    { start: { row: 5, col: 1 }, s: ["up", "up", "right", "right", "right", "down"], o: [{ row: 4, col: 2 }, { row: 2, col: 5 }] },
    { start: { row: 6, col: 2 }, s: ["up", "up", "up", "up", "right", "right"], o: [{ row: 4, col: 3 }, { row: 3, col: 1 }] },
    { start: { row: 6, col: 0 }, s: ["right", "right", "up", "up", "right", "right"], o: [{ row: 5, col: 3 }, { row: 3, col: 2 }] },
    { start: { row: 6, col: 5 }, s: ["left", "left", "up", "up", "up", "left", "left"], o: [{ row: 5, col: 4 }, { row: 4, col: 2 }, { row: 1, col: 1 }] },
    { start: { row: 0, col: 0 }, s: ["down", "down", "right", "right", "right", "down", "down"], o: [{ row: 1, col: 2 }, { row: 3, col: 0 }, { row: 5, col: 4 }] },
    { start: { row: 6, col: 0 }, s: ["up", "up", "right", "right", "up", "up", "right", "right"], o: [{ row: 5, col: 1 }, { row: 3, col: 3 }, { row: 1, col: 5 }] },
    { start: { row: 5, col: 0 }, s: ["right", "right", "right", "up", "up", "up", "right", "right"], o: [{ row: 4, col: 1 }, { row: 2, col: 3 }, { row: 6, col: 5 }] },
    { start: { row: 6, col: 0 }, s: ["right", "right", "up", "up", "right", "right", "up", "up", "right", "right"], o: [{ row: 5, col: 2 }, { row: 4, col: 4 }, { row: 2, col: 1 }, { row: 1, col: 5 }] }
  ].map((level, index) => createLevel({
    lessonId: 3,
    number: index + 1,
    title: `เส้นทางใหญ่ด่านที่ ${index + 1}`,
    rows: 7,
    cols: 7,
    start: level.start,
    solution: level.s,
    obstacles: level.o
  }))
];

let currentMissionId = 1;
let currentLessonId = 1;
let currentLevel = allLevels[0];
let commands = [];
let player = { ...currentLevel.start };
let reachedTarget = false;
let running = false;
let tokoElement = null;
let walkFrame = 0;

function getProgress() {
  try {
    return JSON.parse(localStorage.getItem("codekids-v2-progress")) || { completed: [] };
  } catch {
    return { completed: [] };
  }
}

function saveProgress() {
  const progress = getProgress();
  if (!progress.completed.includes(currentLevel.id)) {
    progress.completed.push(currentLevel.id);
  }
  localStorage.setItem("codekids-v2-progress", JSON.stringify(progress));
}

function completedLevels(lessonId = null) {
  const completed = getProgress().completed;
  return lessonId
    ? completed.filter((id) => id.includes(`-l${lessonId}-`)).length
    : completed.length;
}

function lessonIsUnlocked(lessonId) {
  if (lessonId === 1) return true;
  return completedLevels(lessonId - 1) >= 10;
}

function levelIsUnlocked(level) {
  if (!lessonIsUnlocked(level.lessonId)) return false;
  const previous = allLevels.find((candidate) =>
    candidate.lessonId === level.lessonId && candidate.number === level.number - 1
  );
  return level.number === 1 || getProgress().completed.includes(previous?.id);
}

function showView(name) {
  Object.entries(views).forEach(([key, view]) => {
    view.hidden = key !== name;
  });
  window.scrollTo({ top: 0 });
}

function updateHeaderProgress() {
  const count = completedLevels();
  document.querySelector("#courseProgress").style.width = `${(count / 30) * 100}%`;
  document.querySelector("#courseProgressText").textContent = `${count}/30`;
  document.querySelector("#missionTotalStars").textContent = count;
}

function renderMissions() {
  const count = completedLevels();
  missionGrid.innerHTML = missions.map((mission) => {
    const locked = !mission.active;
    return `
      <button class="mission-card ${mission.active ? "mission-card-active" : "mission-card-coming"}" type="button"
        ${mission.active ? `data-mission="${mission.id}"` : "disabled"}>
        <span class="mission-number">ภารกิจที่ ${mission.id}</span>
        <div class="mission-visual">
          <span>${locked ? "🔒" : mission.icon}</span>
          <img src="${locked ? "assets/codekids/toko-front-b.png" : "assets/codekids/backpack.png"}" alt="">
        </div>
        <div class="mission-copy">
          <h3>${mission.title}</h3>
          <p>${mission.description || mission.story}</p>
          <div class="mission-progress-row">
            <span><i style="width:${mission.active ? (count / 30) * 100 : 0}%"></i></span>
            <strong>${mission.active ? `${count}/30 Level` : "เร็วๆ นี้"}</strong>
          </div>
          <b>${mission.active ? "เริ่มภารกิจ →" : "ยังไม่เปิด"}</b>
        </div>
      </button>
    `;
  }).join("");
  updateHeaderProgress();
}

function renderLessons() {
  lessonGrid.innerHTML = lessons.map((lesson) => {
    const count = completedLevels(lesson.id);
    const unlocked = lessonIsUnlocked(lesson.id);
    return `
      <button class="lesson-card ${unlocked ? "unlocked" : "locked"}" type="button"
        ${unlocked ? `data-lesson="${lesson.id}"` : "disabled"}>
        <span class="lesson-number">Lesson ${lesson.id}</span>
        <div class="lesson-icon">${unlocked ? lesson.icon : "🔒"}</div>
        <h3>${lesson.title}</h3>
        <p>${lesson.description}</p>
        <small>${lesson.goal}</small>
        <div class="lesson-meter"><i style="width:${count * 10}%"></i></div>
        <strong>${count}/10 Level</strong>
      </button>
    `;
  }).join("");
  updateHeaderProgress();
}

function renderLevels() {
  const lesson = lessons.find((item) => item.id === currentLessonId);
  const levels = allLevels.filter((level) => level.lessonId === currentLessonId);
  const completed = getProgress().completed;
  document.querySelector("#levelSelectKicker").textContent =
    `ภารกิจที่ ${currentMissionId} · LESSON ${lesson.id}`;
  document.querySelector("#levelSelectTitle").textContent = lesson.title;
  document.querySelector("#levelSelectDescription").textContent = lesson.description;
  document.querySelector("#lessonProgressText").textContent =
    `${completedLevels(currentLessonId)}/10`;
  levelGrid.innerHTML = levels.map((level) => {
    const done = completed.includes(level.id);
    const unlocked = levelIsUnlocked(level);
    return `
      <button class="level-card ${unlocked ? "unlocked" : "locked"}" type="button"
        ${unlocked ? `data-level="${level.id}"` : "disabled"}>
        <span class="map-number">${String(level.number).padStart(2, "0")}</span>
        <span class="map-meta">${done ? "🏅" : unlocked ? "▶" : "🔒"}</span>
        <div class="map-art">${done ? "🎒" : lesson.icon}</div>
        <h3>${level.title}</h3>
        <p>ทางสั้นประมาณ ${level.moves} คำสั่ง · ${lesson.short}</p>
        <div class="map-stars">${done ? "ผ่านแล้ว" : unlocked ? "พร้อมเล่น" : "ผ่านด่านก่อนหน้า"}</div>
      </button>
    `;
  }).join("");
  updateHeaderProgress();
}

function positionKey(position) {
  return `${position.row}-${position.col}`;
}

function hasPosition(list, row, col) {
  return list.some((item) => item.row === row && item.col === col);
}

function renderBoard() {
  gameBoard.style.setProperty("--cols", currentLevel.cols);
  gameBoard.style.setProperty("--rows", currentLevel.rows);
  gameBoard.classList.toggle("guided-board", currentLevel.guided);
  gameBoard.innerHTML = "";
  const pathSet = new Set(currentLevel.path.map(positionKey));
  for (let row = 0; row < currentLevel.rows; row += 1) {
    for (let col = 0; col < currentLevel.cols; col += 1) {
      const cell = document.createElement("div");
      const onPath = !currentLevel.guided || pathSet.has(`${row}-${col}`);
      cell.className = `board-cell ${onPath ? "path" : "hidden-cell"}`;
      if (hasPosition(currentLevel.obstacles, row, col)) {
        cell.innerHTML = '<span class="cell-object">🪨</span>';
      } else if (currentLevel.target.row === row && currentLevel.target.col === col) {
        cell.innerHTML = '<img class="cell-target" src="assets/codekids/backpack.png" alt="เป้">';
      }
      gameBoard.appendChild(cell);
    }
  }
  tokoElement = document.createElement("img");
  tokoElement.className = "toko-player idle";
  tokoElement.alt = "Toko";
  tokoElement.src = frames.front[0];
  tokoElement.style.width = `${126 / currentLevel.cols}%`;
  tokoElement.style.height = `${126 / currentLevel.rows}%`;
  gameBoard.appendChild(tokoElement);
  positionToko(false);
}

function positionToko(animate = true) {
  if (!tokoElement) return;
  if (!animate) tokoElement.style.transition = "none";
  tokoElement.style.left = `${((player.col + 0.5) / currentLevel.cols) * 100}%`;
  tokoElement.style.top = `${((player.row + 0.5) / currentLevel.rows) * 100}%`;
  if (!animate) requestAnimationFrame(() => { tokoElement.style.transition = ""; });
}

function renderQueue(activeIndex = -1) {
  document.querySelector("#commandCount").textContent =
    `${commands.length} คำสั่ง`;
  if (!commands.length) {
    commandQueue.innerHTML =
      '<div class="queue-empty">แตะหรือ ลากไอคอน<br>มาวางตรงนี้</div>';
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
  if (running || !directions[command]) return;
  const maxCommands = Math.min(30, Math.max(12, currentLevel.rows * currentLevel.cols));
  if (commands.length >= maxCommands) {
    showToast(`ลองรันก่อนนะ ตอนนี้มี ${maxCommands} คำสั่งแล้ว`);
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
  const outside = next.row < 0 || next.row >= currentLevel.rows ||
    next.col < 0 || next.col >= currentLevel.cols;
  const obstacle = hasPosition(currentLevel.obstacles, next.row, next.col);
  const offGuidedPath = currentLevel.guided &&
    !currentLevel.path.some((item) => item.row === next.row && item.col === next.col);
  walkFrame = 1 - walkFrame;
  tokoElement.classList.remove("idle");
  tokoElement.classList.add("walking");
  tokoElement.src = frames[direction.facing][walkFrame];
  if (outside || obstacle || offGuidedPath) {
    tokoElement.classList.add("bump");
    await sleep(360);
    tokoElement.classList.remove("bump", "walking");
    tokoElement.classList.add("idle");
    return false;
  }
  player = next;
  positionToko();
  await sleep(430);
  reachedTarget =
    player.row === currentLevel.target.row && player.col === currentLevel.target.col;
  if (reachedTarget) {
    gameBoard.querySelector(".cell-target")?.classList.add("collected");
    document.querySelector("#levelTargetCount").textContent = "1/1";
    await sleep(180);
  }
  tokoElement.classList.remove("walking");
  tokoElement.classList.add("idle");
  return true;
}

async function runProgram() {
  if (running || !commands.length) return;
  running = true;
  resetPlayerOnly();
  setControlsDisabled(true);
  document.querySelector("#gameHint").textContent = "Toko กำลังเดินตามแผนของหนู...";
  let failed = false;
  let executedCount = 0;
  for (let index = 0; index < commands.length; index += 1) {
    renderQueue(index);
    if (!await walk(commands[index])) {
      failed = true;
      break;
    }
    executedCount = index + 1;
    if (reachedTarget) break;
  }
  renderQueue(executedCount);
  running = false;
  if (!failed && reachedTarget) {
    saveProgress();
    renderMissions();
    renderLessons();
    renderLevels();
    showResult(true);
  } else {
    document.querySelector("#gameHint").textContent = failed
      ? "โอ๊ะ! Toko เดินผิดทางหรือชนสิ่งกีดขวาง ลองใหม่อีกครั้งนะ"
      : "ยังไม่ถึงเป้ ลองเรียงคำสั่งใหม่ดูนะ";
    showResult(false, failed);
    setControlsDisabled(false);
  }
}

function resetPlayerOnly() {
  player = { ...currentLevel.start };
  reachedTarget = false;
  walkFrame = 0;
  gameBoard.querySelector(".cell-target")?.classList.remove("collected");
  document.querySelector("#levelTargetCount").textContent = "0/1";
  if (tokoElement) {
    tokoElement.src = frames.front[0];
    tokoElement.classList.remove("walking", "bump");
    tokoElement.classList.add("idle");
    positionToko(false);
  }
}

function resetLevel(clear = true) {
  resetPlayerOnly();
  if (clear) commands = [];
  renderQueue();
  setControlsDisabled(false);
  document.querySelector("#gameHint").textContent =
    `พา Toko ไปหยิบเป้ให้ได้ แผนที่นี้มีทางสั้นประมาณ ${currentLevel.moves} คำสั่ง`;
}

function openMission(missionId) {
  if (missionId !== 1) return;
  currentMissionId = missionId;
  renderLessons();
  showView("lessons");
}

function openLesson(lessonId) {
  if (!lessonIsUnlocked(lessonId)) return;
  currentLessonId = lessonId;
  renderLevels();
  showView("levels");
}

function openLevel(levelId) {
  const level = allLevels.find((item) => item.id === levelId);
  if (!level || !levelIsUnlocked(level)) return;
  currentLevel = level;
  const lesson = lessons.find((item) => item.id === level.lessonId);
  document.querySelector("#currentLevelLabel").textContent =
    `ภารกิจที่ ${level.missionId} · LESSON ${level.lessonId} · LEVEL ${level.number}`;
  document.querySelector("#currentLevelTitle").textContent = level.title;
  document.querySelector("#storyKicker").textContent = lesson.title;
  document.querySelector("#missionTitle").textContent = "พา Toko เดินไปหยิบเป้";
  document.querySelector("#missionDescription").textContent =
    level.guided
      ? "เดินตามช่องทางที่กำหนดไว้ แล้วสังเกตว่าไอคอนแต่ละตัวพา Toko ไปทางไหน"
      : level.obstacles.length
        ? "คิดเส้นทางเอง หลบสิ่งกีดขวาง แล้วพา Toko ไปหยิบเป้"
        : "คิดเส้นทางเองบนตาราง แล้วเรียงคำสั่งให้ Toko เดินถึงเป้";
  document.querySelector("#commandLimitText").textContent =
    `แนะนำ ${level.moves} คำสั่ง · ลองวิธีของหนูได้`;
  document.querySelector("#boardTitle").textContent =
    level.guided ? "ทางเดินเตรียมตัว" : lesson.id === 2 ? "ห้องฝึกทิศทาง" : "แผนที่ผจญภัย";
  commands = [];
  renderBoard();
  resetLevel();
  showView("game");
}

function showResult(success, failed = false) {
  document.querySelector("#resultKicker").textContent =
    success ? `LESSON ${currentLevel.lessonId} · LEVEL ${currentLevel.number}` : "ลองอีกครั้งได้เสมอ";
  document.querySelector("#resultTitle").textContent =
    success ? "เก่งมาก Toko ได้เป้แล้ว!" : "เกือบถึงแล้ว!";
  document.querySelector("#resultMessage").textContent = success
    ? "Toko เดินไปหยิบเป้สำเร็จแล้ว หนูลองวิธีของตัวเองได้ดีมาก"
    : failed
      ? "คำสั่งพา Toko เดินผิดทาง ลองสังเกตช่องอีกครั้งนะ"
      : "ลองเรียงคำสั่งใหม่ เพื่อให้ Toko ไปถึงเป้";
  document.querySelector("#resultStars").textContent = success ? "🎒" : "↻";
  document.querySelector("#resultToko").src = success ? frames.front[0] : frames.front[1];
  document.querySelector("#finishLevel").hidden = !success;
  const nextButton = document.querySelector("#nextLevel");
  const next = getNextLevel();
  nextButton.hidden = !success || !next;
  if (success && next) {
    nextButton.textContent = next.lessonId === currentLevel.lessonId
      ? `Level ${next.number} ต่อไป →`
      : `Lesson ${next.lessonId} ต่อไป →`;
  }
  resultModal.classList.add("open");
  resultModal.setAttribute("aria-hidden", "false");
}

function getNextLevel() {
  const currentIndex = allLevels.findIndex((level) => level.id === currentLevel.id);
  return allLevels[currentIndex + 1] || null;
}

function closeResult() {
  resultModal.classList.remove("open");
  resultModal.setAttribute("aria-hidden", "true");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2600);
}

missionGrid.addEventListener("click", (event) => {
  const card = event.target.closest("[data-mission]");
  if (card) openMission(Number(card.dataset.mission));
});
lessonGrid.addEventListener("click", (event) => {
  const card = event.target.closest("[data-lesson]");
  if (card) openLesson(Number(card.dataset.lesson));
});
levelGrid.addEventListener("click", (event) => {
  const card = event.target.closest("[data-level]");
  if (card) openLevel(card.dataset.level);
});
document.querySelector("#backToMissions").addEventListener("click", () => {
  renderMissions();
  showView("missions");
});
document.querySelector("#backToLessons").addEventListener("click", () => {
  renderLessons();
  showView("lessons");
});
document.querySelector("#backToLevels").addEventListener("click", () => {
  if (running) return;
  renderLevels();
  showView("levels");
});
document.querySelectorAll("[data-command]").forEach((button) => {
  button.addEventListener("click", () => addCommand(button.dataset.command));
  button.addEventListener("dragstart", (event) => {
    event.dataTransfer.setData("text/plain", button.dataset.command);
    event.dataTransfer.effectAllowed = "copy";
  });
});
commandQueue.addEventListener("dragover", (event) => {
  event.preventDefault();
  commandQueue.classList.add("dragging");
});
commandQueue.addEventListener("dragleave", () => {
  commandQueue.classList.remove("dragging");
});
commandQueue.addEventListener("drop", (event) => {
  event.preventDefault();
  commandQueue.classList.remove("dragging");
  addCommand(event.dataTransfer.getData("text/plain"));
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
document.querySelector("#resetLevel").addEventListener("click", () => resetLevel());
document.querySelector("#tryAgain").addEventListener("click", () => {
  closeResult();
  resetLevel(false);
});
document.querySelector("#finishLevel").addEventListener("click", () => {
  closeResult();
  renderLevels();
  showView("levels");
});
document.querySelector("#nextLevel").addEventListener("click", () => {
  const next = getNextLevel();
  if (!next) return;
  closeResult();
  openLevel(next.id);
});

renderMissions();
renderLessons();
renderLevels();
