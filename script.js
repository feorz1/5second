const tracks = [
  { src: "tracks/track1.mp3", title: "Снег идёт Глюк'oZa" },
  { src: "tracks/track2.mp3", title: "Heads Will Roll Yeah Yeah Yeahs" },
  { src: "tracks/track3.mp3", title: "Decadence Disturbed" },
  { src: "tracks/track4.mp3", title: "Vanished Crystal Castles" },
  { src: "tracks/track5.mp3", title: "Розовый фламинго CREAM SODA, Алёна Свиридова" },
  { src: "tracks/track6.mp3", title: "Strangers by Night C.C. Catch" },
  { src: "tracks/track7.mp3", title: "Белая ночь Форум" },
  { src: "tracks/track8.mp3", title: "Ночь Андрей Губин" },
  { src: "tracks/track9.mp3", title: "Седьмой лепесток Hi-Fi" },
  { src: "tracks/track10.mp3", title: "Still Loving You Scorpions" },
  { src: "tracks/track11.mp3", title: "Жиган-лимон Михаил Круг" },
  { src: "tracks/track12.mp3", title: "My Favourite Game The Cardigans" },
  { src: "tracks/track13.mp3", title: "Money, Money, Money ABBA" },
  { src: "tracks/track14.mp3", title: "BFG Division Mick Gordon", isVideo: true, videoSrc: "tracks/track14.mp4" },
];

let currentIndex = 0;
let gameStarted = false;
let timerInterval = null;
let videoTimerInterval = null;

const timerEl = document.getElementById("timer");
const videoTimerEl = document.getElementById("video-timer");
const statusEl = document.getElementById("status");
const titleEl = document.getElementById("track-title");

const startBtn = document.getElementById("start-btn");
const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");

const btnShowTitle = document.getElementById("btn-show-title");
const btnReplay = document.getElementById("btn-replay");
const btnNext = document.getElementById("btn-next");

const waveContainer = document.getElementById("wave-container");
const videoContainer = document.getElementById("video-container");
const videoPlayer = document.getElementById("video-player");

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
  if (videoTimerInterval) {
    clearInterval(videoTimerInterval);
    videoTimerInterval = null;
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

function startVideoTimer() {
  clearTimer();
  statusEl.textContent = "";

  videoTimerInterval = setInterval(() => {
    const current = videoPlayer.currentTime;
    videoTimerEl.textContent = formatTime(current);
  }, 200);
}

function resetTimerDisplay() {
  timerEl.textContent = "0:00";
  videoTimerEl.textContent = "0:00";
}

function loadTrack(index) {
  const track = tracks[index];
  if (!track) return;

  clearTimer();

  // Скрываем название и очищаем текст сразу
  titleEl.classList.add("hidden");
  titleEl.textContent = "";

  statusEl.textContent = "";
  resetTimerDisplay();

  // Если это видео-трек
  if (track.isVideo) {
    waveContainer.classList.add("hidden");
    videoContainer.classList.remove("hidden");
    
    wavesurfer.empty();
    videoPlayer.src = track.videoSrc;
    videoPlayer.load();
    
    console.log("Загружено видео:", track.videoSrc);
  } else {
    // Обычный аудио-трек
    videoContainer.classList.add("hidden");
    waveContainer.classList.remove("hidden");
    
    videoPlayer.pause();
    videoPlayer.src = "";
    wavesurfer.empty();
    wavesurfer.load(track.src);
  }
}

// События Wavesurfer
wavesurfer.on("ready", () => {
  if (gameStarted && !tracks[currentIndex].isVideo) {
    wavesurfer.play();
    startTimer();
  }
});

wavesurfer.on("finish", () => {
  clearTimer();
  timerEl.textContent = formatTime(wavesurfer.getDuration());
});

// События Video
videoPlayer.addEventListener("loadeddata", () => {
  console.log("Видео готово к воспроизведению");
  if (gameStarted && tracks[currentIndex].isVideo) {
    videoPlayer.play();
    startVideoTimer();
  }
});

videoPlayer.addEventListener("error", (e) => {
  console.error("Ошибка загрузки видео:", e);
});

videoPlayer.addEventListener("ended", () => {
  clearTimer();
  videoTimerEl.textContent = formatTime(videoPlayer.duration);
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
  const track = tracks[currentIndex];
  if (!track) return;

  // Подставляем название только в момент нажатия кнопки
  titleEl.textContent = track.title;
  titleEl.classList.remove("hidden");
});

btnReplay.addEventListener("click", () => {
  const track = tracks[currentIndex];
  if (!track) return;

  if (track.isVideo) {
    videoPlayer.currentTime = 0;
    videoPlayer.play();
    startVideoTimer();
  } else {
    wavesurfer.stop();
    resetTimerDisplay();
    wavesurfer.play();
    startTimer();
  }
});

btnNext.addEventListener("click", () => {
  nextTrack();
});
