
const audio = document.getElementById("audio");
const cover = document.getElementById("cover");
const surahTitle = document.getElementById("surah-title");
const reciter = document.getElementById("reciter");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const volume = document.getElementById("volume");
const autoplay = document.getElementById("autoplay");
const surahList = document.getElementById("surah-list");
const surahCount = document.getElementById("surah-count");
const status = document.getElementById("status");

// Qur'an recitation collection
// Make sure every audio filename exists in your Audios folder.
const surahs = [
  {
    number: 112,
    name: "Surah Al-Ikhlas",
    reciter: "Sheikh Abdirashid Sheikh Ali Sufi",
    audio: "Audios/112 Al-Ikhlas.mp3",
    image: "images/shiekh.jpg"
  },
  {
    number: 113,
    name: "Surah Al-Falaq",
    reciter: "Sheikh Abdirashid Sheikh Ali Sufi",
    audio: "Audios/113 Al-Falaq.mp3",
    image: "images/shiekh.jpg"
  },
  {
    number: 114,
    name: "Surah An-Nas",
    reciter: "Sheikh Abdirashid Sheikh Ali Sufi",
    audio: "Audios/114 An-Nas.mp3",
    image: "images/shiekh.jpg"
  },
  {
    number: 111,
    name: "Surah Al-Masad",
    reciter: "Sheikh Abdirashid Sheikh Ali Sufi",
    audio: "Audios/111 Al-Masad.mp3",
    image: "images/shiekh.jpg"
  },
  {
    number: 110,
    name: "Surah An-Nasr",
    reciter: "Sheikh Abdirashid Sheikh Ali Sufi",
    audio: "Audios/110 An-Nasr.mp3",
    image: "images/shiekh.jpg"
  }
];

let currentSurah = 0;

// Format time as minutes:seconds
function formatTime(seconds) {
  if (!Number.isFinite(seconds)) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

// Display status messages
function showStatus(message, isError = false) {
  status.textContent = message;
  status.classList.toggle("error", isError);
}

// Update the play button
function updatePlayButton(isPlaying) {
  playBtn.textContent = isPlaying ? "Ⅱ" : "▶";

  playBtn.setAttribute(
    "aria-label",
    isPlaying ? "Pause recitation" : "Play recitation"
  );

  playBtn.title = isPlaying ? "Pause" : "Play";
}

// Load a surah
function loadSurah(index) {
  currentSurah = index;

  const surah = surahs[currentSurah];

  audio.pause();
  audio.src = surah.audio;

  surahTitle.textContent = surah.name;
  reciter.textContent = surah.reciter;

  cover.src = surah.image;

  progress.value = 0;
  currentTimeEl.textContent = "0:00";
  durationEl.textContent = "0:00";

  updatePlayButton(false);
  renderSurahList();

  showStatus("Ready to listen. Press play to begin.");
}

// Play the current recitation
async function playSurah() {
  try {
    await audio.play();
    updatePlayButton(true);
    showStatus("Now reciting: " + surahs[currentSurah].name);
  } catch (error) {
    updatePlayButton(false);
    showStatus(
      "Unable to play. Check the audio filename and try again.",
      true
    );
    console.error("Recitation playback error:", error);
  }
}

// Pause recitation
function pauseSurah() {
  audio.pause();
  updatePlayButton(false);
  showStatus("Recitation paused.");
}

// Play/pause button
playBtn.addEventListener("click", () => {
  if (audio.paused) {
    playSurah();
  } else {
    pauseSurah();
  }
});

// Next surah
function nextSurah(shouldPlay = true) {
  const nextIndex = (currentSurah + 1) % surahs.length;

  loadSurah(nextIndex);

  if (shouldPlay) {
    playSurah();
  }
}

// Previous surah
function previousSurah() {
  const previousIndex =
    (currentSurah - 1 + surahs.length) % surahs.length;

  loadSurah(previousIndex);
  playSurah();
}

nextBtn.addEventListener("click", () => nextSurah());
prevBtn.addEventListener("click", previousSurah);

// Display duration when audio metadata loads
audio.addEventListener("loadedmetadata", () => {
  durationEl.textContent = formatTime(audio.duration);
});

// Update progress as the recitation plays
audio.addEventListener("timeupdate", () => {
  if (Number.isFinite(audio.duration) && audio.duration > 0) {
    progress.value =
      (audio.currentTime / audio.duration) * 100;

    currentTimeEl.textContent = formatTime(audio.currentTime);
  }
});

// Allow seeking through the recitation
progress.addEventListener("input", () => {
  if (Number.isFinite(audio.duration) && audio.duration > 0) {
    audio.currentTime =
      (Number(progress.value) / 100) * audio.duration;
  }
});

// Volume control
volume.addEventListener("input", () => {
  audio.volume = Number(volume.value);
});

// Continue to the next surah when the current one ends
audio.addEventListener("ended", () => {
  if (autoplay.checked) {
    nextSurah();
  } else {
    audio.currentTime = 0;
    progress.value = 0;
    currentTimeEl.textContent = "0:00";

    updatePlayButton(false);
    showStatus("Recitation finished.");
  }
});

// Handle audio loading errors
audio.addEventListener("error", () => {
  updatePlayButton(false);

  showStatus(
    "Audio could not be loaded. Check the file path and filename.",
    true
  );
});

// Render the surah list
function renderSurahList() {
  surahList.replaceChildren();

  surahCount.textContent =
    `${surahs.length} ${surahs.length === 1 ? "Surah" : "Surahs"}`;

  surahs.forEach((surah, index) => {
    const item = document.createElement("button");

    item.type = "button";
    item.className = "playlist-item";

    if (index === currentSurah) {
      item.classList.add("active");
      item.setAttribute("aria-current", "true");
    }

    const number = document.createElement("span");
    number.className = "surah-number";
    number.textContent = surah.number;

    const info = document.createElement("div");
    info.className = "track-info";

    const name = document.createElement("h3");
    name.textContent = surah.name;

    const reader = document.createElement("p");
    reader.textContent = surah.reciter;

    info.append(name, reader);

    const indicator = document.createElement("span");
    indicator.className = "track-indicator";
    indicator.textContent =
      index === currentSurah && !audio.paused ? "♫" : "›";

    item.append(number, info, indicator);

    item.addEventListener("click", () => {
      loadSurah(index);
      playSurah();
    });

    surahList.appendChild(item);
  });
}

// Keep the playlist indicator synchronized
audio.addEventListener("play", renderSurahList);
audio.addEventListener("pause", renderSurahList);

// Initial setup
audio.volume = Number(volume.value);

cover.addEventListener("error", () => {
  cover.alt = "Reciter image unavailable";
});

loadSurah(0);
