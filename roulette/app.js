const DEFAULT_OPTIONS = ["Yes", "No", "Maybe", "Later", "Surprise me"];

const PALETTE = [
  "#18553d",
  "#1f6b4b",
  "#27401f",
  "#0f3d2c",
  "#3a5f2e",
  "#164d38",
  "#2d6a4f",
  "#1b4332",
  "#40916c",
  "#081c15",
];

const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spinBtn");
const resultEl = document.getElementById("result");
const optionForm = document.getElementById("optionForm");
const optionInput = document.getElementById("optionInput");
const optionList = document.getElementById("optionList");
const shuffleBtn = document.getElementById("shuffleBtn");
const clearBtn = document.getElementById("clearBtn");

const state = {
  options: [...DEFAULT_OPTIONS],
  rotation: 0,
  spinning: false,
  winnerIndex: -1,
};

function normalizeLabel(value) {
  return value.replace(/\s+/g, " ").trim();
}

function canSpin() {
  return state.options.length >= 2 && !state.spinning;
}

function updateSpinButton() {
  spinBtn.disabled = !canSpin();
}

function colorFor(index) {
  return PALETTE[index % PALETTE.length];
}

function renderList() {
  optionList.innerHTML = "";
  state.options.forEach((label, index) => {
    const li = document.createElement("li");
    if (index === state.winnerIndex) li.classList.add("highlight");

    const swatch = document.createElement("i");
    swatch.className = "swatch";
    swatch.style.background = colorFor(index);
    swatch.setAttribute("aria-hidden", "true");

    const text = document.createElement("span");
    text.textContent = label;

    const remove = document.createElement("button");
    remove.type = "button";
    remove.setAttribute("aria-label", `Remove ${label}`);
    remove.textContent = "Remove";
    remove.addEventListener("click", () => {
      if (state.spinning) return;
      state.options.splice(index, 1);
      state.winnerIndex = -1;
      resultEl.textContent =
        state.options.length >= 2
          ? "Ready when you are."
          : "Add at least two options to spin.";
      resultEl.classList.remove("winner");
      render();
    });

    li.append(swatch, text, remove);
    optionList.appendChild(li);
  });
}

function drawWheel() {
  const { width, height } = canvas;
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(cx, cy) - 8;
  const count = Math.max(state.options.length, 1);
  const slice = (Math.PI * 2) / count;

  ctx.clearRect(0, 0, width, height);
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(state.rotation);

  for (let i = 0; i < count; i += 1) {
    const start = i * slice - Math.PI / 2;
    const end = start + slice;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius, start, end);
    ctx.closePath();
    ctx.fillStyle = state.options.length ? colorFor(i) : "#123528";
    ctx.fill();

    ctx.strokeStyle = "rgba(240, 208, 138, 0.35)";
    ctx.lineWidth = 2;
    ctx.stroke();

    if (!state.options.length) continue;

    const mid = start + slice / 2;
    ctx.save();
    ctx.rotate(mid);
    ctx.translate(radius * 0.62, 0);
    ctx.rotate(Math.PI / 2);
    ctx.fillStyle = "#f3ebe0";
    ctx.font = `700 ${Math.max(18, Math.min(28, 220 / count))}px Syne, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const label = state.options[i];
    const maxChars = count > 8 ? 10 : 14;
    const text =
      label.length > maxChars ? `${label.slice(0, maxChars - 1)}…` : label;
    ctx.fillText(text, 0, 0);
    ctx.restore();
  }

  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.18, 0, Math.PI * 2);
  ctx.fillStyle = "#0b2419";
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#f0d08a";
  ctx.stroke();

  ctx.restore();
}

function render() {
  renderList();
  drawWheel();
  updateSpinButton();
}

function easeOutCubic(t) {
  return 1 - (1 - t) ** 3;
}

function winnerFromRotation(rotation, count) {
  const slice = (Math.PI * 2) / count;
  // Pointer is at the top (-PI/2). Convert current rotation to an index.
  const normalized = ((-rotation % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
  return Math.floor(normalized / slice) % count;
}

function spin() {
  if (!canSpin()) return;

  state.spinning = true;
  state.winnerIndex = -1;
  resultEl.classList.remove("winner");
  resultEl.textContent = "Spinning…";
  updateSpinButton();

  const count = state.options.length;
  const slice = (Math.PI * 2) / count;
  const targetIndex = Math.floor(Math.random() * count);
  const turns = 5 + Math.floor(Math.random() * 3);
  const sliceCenter = targetIndex * slice + slice / 2;
  const targetRotation =
    turns * Math.PI * 2 + (Math.PI * 2 - sliceCenter) - (state.rotation % (Math.PI * 2));

  const start = performance.now();
  const duration = 4200;
  const from = state.rotation;

  function frame(now) {
    const t = Math.min(1, (now - start) / duration);
    state.rotation = from + targetRotation * easeOutCubic(t);
    drawWheel();

    if (t < 1) {
      requestAnimationFrame(frame);
      return;
    }

    state.rotation = from + targetRotation;
    state.winnerIndex = winnerFromRotation(state.rotation, count);
    const winner = state.options[state.winnerIndex];
    resultEl.textContent = `Winner: ${winner}`;
    resultEl.classList.add("winner");
    state.spinning = false;
    render();
  }

  requestAnimationFrame(frame);
}

optionForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (state.spinning) return;

  const label = normalizeLabel(optionInput.value);
  if (!label) return;

  const exists = state.options.some(
    (item) => item.toLocaleLowerCase() === label.toLocaleLowerCase(),
  );
  if (exists) {
    resultEl.textContent = "That option is already on the wheel.";
    resultEl.classList.remove("winner");
    return;
  }

  if (state.options.length >= 24) {
    resultEl.textContent = "Maximum 24 options.";
    resultEl.classList.remove("winner");
    return;
  }

  state.options.push(label);
  state.winnerIndex = -1;
  optionInput.value = "";
  resultEl.textContent = "Option added. Spin when ready.";
  resultEl.classList.remove("winner");
  render();
  optionInput.focus();
});

shuffleBtn.addEventListener("click", () => {
  if (state.spinning || state.options.length < 2) return;
  for (let i = state.options.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [state.options[i], state.options[j]] = [state.options[j], state.options[i]];
  }
  state.winnerIndex = -1;
  resultEl.textContent = "Options shuffled.";
  resultEl.classList.remove("winner");
  render();
});

clearBtn.addEventListener("click", () => {
  if (state.spinning) return;
  state.options = [];
  state.winnerIndex = -1;
  resultEl.textContent = "Add at least two options to spin.";
  resultEl.classList.remove("winner");
  render();
  optionInput.focus();
});

spinBtn.addEventListener("click", spin);

window.addEventListener("keydown", (event) => {
  if (event.code === "Space" && document.activeElement === document.body) {
    event.preventDefault();
    spin();
  }
});

render();
optionInput.focus();
