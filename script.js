const tracks = [
  { src: "tracks/track1.mp3", title: "Трек 1" },
  { src: "tracks/track2.mp3", title: "Трек 2" },
  { src: "tracks/track3.mp3", title: "Трек 3" },
];

let currentIndex = 0;
let gameStarted = false;
let timerInterval = null;

const timerEl = document.getElementById("timer");
const statusEl = document.getElementById("status");
const titleEl = document.getElementById("track-title");

const startBtn = document.getElementById("start-btn");
const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");

const btnShowTitle = document.getElementById("btn-show-title");
const btnReplay = document.getElementById("btn-replay");
const btnNext = document.getElementById("btn-next");

const wavesurfer = WaveSurfer.create({
  container: "#waveform",
  waveColor: "#2a3444",
  progressColor: "#1db954",
  barWidth: 2,
  barGap: 1,
  responsive: true,
  height: 88,
  cursorWidth: 0,
  hideScrollbar: true,
  normalize: true,
});

function clearTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function formatTime(sec) {
  if (Number.isNaN(sec) || !Number.isFinite(sec)) return "0:00";
  const total = Math.max(0, Math.floor(sec));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function startTimer() {
  clearTimer();
  statusEl.textContent = "";

  timerInterval = setInterval(() => {
    const current = wavesurfer.getCurrentTime();
    timerEl.textContent = formatTime(current);
  }, 200);
}

function resetTimerDisplay() {
  timerEl.textContent = "0:00";
}

function loadTrack(index) {
  const track = tracks[index];
  if (!track) return;

  clearTimer();
  wavesurfer.empty();

  titleEl.classList.add("hidden");
  titleEl.textContent = track.title;
  statusEl.textContent = "";
  resetTimerDisplay();

  wavesurfer.load(track.src);
}

wavesurfer.on("ready", () => {
  if (gameStarted) {
    wavesurfer.play();
    startTimer();
  }
});

wavesurfer.on("finish", () => {
  clearTimer();
  timerEl.textContent = formatTime(wavesurfer.getDuration());
});

function nextTrack() {
  clearTimer();
  currentIndex = (currentIndex + 1) % tracks.length;
  loadTrack(currentIndex);
}

startBtn.addEventListener("click", () => {
  gameStarted = true;
  startScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  loadTrack(currentIndex);
});

btnShowTitle.addEventListener("click", () => {
  titleEl.classList.remove("hidden");
});

btnReplay.addEventListener("click", () => {
  if (!tracks[currentIndex]) return;
  wavesurfer.stop();
  resetTimerDisplay();
  wavesurfer.play();
  startTimer();
});

btnNext.addEventListener("click", () => {
  nextTrack();
});
