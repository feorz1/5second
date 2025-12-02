// Укажи свои реальные файлы и названия треков
const tracks = [
  { src: "tracks/track1.mp3", title: "Трек 1" },
  { src: "tracks/track2.mp3", title: "Трек 2" },
  { src: "tracks/track3.mp3", title: "Трек 3" },
];

const SHOW_SECONDS = 5;

let currentIndex = 0;
let timerInterval = null;
let autoPauseTimeout = null;

const timerEl = document.getElementById("timer");
const statusEl = document.getElementById("status");
const titleEl = document.getElementById("track-title");

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
  height: 80,
  cursorWidth: 0,
  hideScrollbar: true,
  normalize: true,
});

function clearTimers() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  if (autoPauseTimeout) {
    clearTimeout(autoPauseTimeout);
    autoPauseTimeout = null;
  }
}

function updateTimerDisplay(secondsLeft) {
  if (secondsLeft < 0) secondsLeft = 0;
  timerEl.textContent = `0:${secondsLeft.toString().padStart(2, "0")}`;
}

function startFiveSecondTimer() {
  clearTimers();
  statusEl.textContent = "";
  let secondsLeft = SHOW_SECONDS;
  updateTimerDisplay(secondsLeft);

  timerInterval = setInterval(() => {
    secondsLeft -= 1;
    if (secondsLeft >= 0) {
      updateTimerDisplay(secondsLeft);
    }
    if (secondsLeft <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      statusEl.textContent = "Время вышло!";
    }
  }, 1000);

  autoPauseTimeout = setTimeout(() => {
    if (wavesurfer.isPlaying()) {
      wavesurfer.pause();
    }
    statusEl.textContent = "Время вышло!";
  }, SHOW_SECONDS * 1000);
}

function loadTrack(index) {
  const track = tracks[index];
  if (!track) return;

  clearTimers();
  wavesurfer.empty();

  titleEl.classList.add("hidden");
  titleEl.textContent = track.title;
  statusEl.textContent = "";
  updateTimerDisplay(SHOW_SECONDS);

  wavesurfer.load(track.src);
}

wavesurfer.on("ready", () => {
  wavesurfer.play();
  startFiveSecondTimer();
});

function nextTrack() {
  clearTimers();
  currentIndex = (currentIndex + 1) % tracks.length;
  loadTrack(currentIndex);
}

btnShowTitle.addEventListener("click", () => {
  titleEl.classList.remove("hidden");
});

btnReplay.addEventListener("click", () => {
  if (!tracks[currentIndex]) return;
  wavesurfer.stop();
  wavesurfer.play();
  startFiveSecondTimer();
});

btnNext.addEventListener("click", () => {
  nextTrack();
});

// стартовый трек
loadTrack(currentIndex);
