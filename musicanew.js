const audio = document.getElementById("audio");

const playBtn = document.getElementById("play");

const nextBtn = document.getElementById("next");

const prevBtn = document.getElementById("prev");

const title = document.getElementById("title");

const artist = document.getElementById("artist");

const progress = document.getElementById("progress");

const volume = document.getElementById("volume");

const loadFolderBtn = document.getElementById("loadFolder");

const songList = document.getElementById("songList");

const search = document.getElementById("search");

const currentTimeEl = document.getElementById("currentTime");

const durationEl = document.getElementById("duration");

const canvas = document.getElementById("visualizer");

const ctx = canvas.getContext("2d");
const logo = document.getElementById("logo");

const btn = document.getElementById("menu-btn");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const toggle = document.getElementById("darkModeToggle");
let db;
const cover = document.getElementById("cover");
const eqBtn = document.getElementById("eqBtn");

const equalizer = document.getElementById("equalizer");

const bassSlider =
document.getElementById("Bajos");

const midSlider =
document.getElementById("Medios");

const trebleSlider =
document.getElementById("Agudos");

const request = indexedDB.open("BrutalMusicDB", 1);
const resetEQ = document.getElementById("resetEQ");

request.onupgradeneeded = (e) => {
  db = e.target.result;

  if (!db.objectStoreNames.contains("folders")) {
    db.createObjectStore("folders");
  }
};

request.onsuccess = (e) => {
  db = e.target.result;

  loadSavedFolder();
};

window.addEventListener("DOMContentLoaded", () => {

  loadEQSettings();
  const darkMode = localStorage.getItem("darkMode");
  if (darkMode === "on") {
    document.body.classList.add("dark");
    toggle.checked = true;
    logo.src = "indeximg/logoblanco.png";
    btn.src = "indeximg/menublanco.png";
  } else {
    logo.src = "indeximg/logonegro.png";
    btn.src = "indeximg/menunegro.png";
  }
  const savedVolume = localStorage.getItem("volume");

  if (savedVolume) {
    volume.value = savedVolume;
    audio.volume = savedVolume;
  } else {
    volume.value = 0.3;
    audio.volume = 0.3;
  }

  updateVolumeUI();
  let currentTime = localStorage.getItem("songTime");
});

btn.addEventListener("click", () => {
  sidebar.classList.toggle("active");
  overlay.classList.toggle("active");
});

overlay.addEventListener("click", () => {
  sidebar.classList.remove("active");
  overlay.classList.remove("active");
});

toggle.addEventListener("change", () => {
  document.body.classList.toggle("dark");

  if (toggle.checked) {
    localStorage.setItem("darkMode", "on");

    logo.src = "indeximg/logoblanco.png";
    btn.src = "indeximg/menublanco.png";
    cover.src ="indeximg/BRUTALdiscblanco.png";
  } else {
    localStorage.setItem("darkMode", "off");
    logo.src = "indeximg/logonegro.png";
    btn.src = "indeximg/menunegro.png";
        cover.src ="indeximg/BRUTALdiscnegro.png";
  }
});

let songs = [];

let currentIndex = 0;

let playing = false;

let audioContext;

let analyser;

let source;
let bassFilter;
let midFilter;
let trebleFilter;
function loadEQSettings(){

    const savedBass =
    localStorage.getItem("bass") || 0;

    const savedMid =
    localStorage.getItem("mid") || 0;

    const savedTreble =
    localStorage.getItem("treble") || 0;

    bassSlider.value =
    savedBass;

    midSlider.value =
    savedMid;

    trebleSlider.value =
    savedTreble;

}
function initAudio() {
  if (!audioContext) {
    audioContext = new AudioContext();

    analyser = audioContext.createAnalyser();

    source = audioContext.createMediaElementSource(audio);

    bassFilter = audioContext.createBiquadFilter();

    bassFilter.type = "lowshelf";

    bassFilter.frequency.value = 200;

    midFilter = audioContext.createBiquadFilter();

    midFilter.type = "peaking";

    midFilter.frequency.value = 1000;

    trebleFilter = audioContext.createBiquadFilter();

    trebleFilter.type = "highshelf";

    trebleFilter.frequency.value = 3000;

    source.connect(bassFilter);

    bassFilter.connect(midFilter);

    midFilter.connect(trebleFilter);

    trebleFilter.connect(analyser);

    analyser.connect(audioContext.destination);

    analyser.fftSize = 256;

    bufferLength = analyser.frequencyBinCount;

    dataArray = new Uint8Array(bufferLength);
    const savedBass = localStorage.getItem("bass") || 0;

    const savedMid = localStorage.getItem("mid") || 0;

    const savedTreble = localStorage.getItem("treble") || 0;

    bassSlider.value = savedBass;
    midSlider.value = savedMid;
    trebleSlider.value = savedTreble;

    bassFilter.gain.value = savedBass;
    midFilter.gain.value = savedMid;
    trebleFilter.gain.value = savedTreble;
  }
}

let bufferLength;

let dataArray;
loadFolderBtn.addEventListener("click", async () => {
  const dirHandle = await window.showDirectoryPicker();
  saveFolder(dirHandle);

  songs = [];

  for await (const entry of dirHandle.values()) {
    if (entry.kind === "file") {
      const file = await entry.getFile();

      if (file.type.startsWith("audio/")) {
        songs.push({
          name: file.name,
          file: file,
        });
      }
    }
  }

  renderSongs(songs);
});
function renderSongs(songArray) {
  songList.innerHTML = "";

  songArray.forEach((song, index) => {
    const div = document.createElement("div");

    div.classList.add("song");

    div.textContent = song.name;

    div.addEventListener("click", () => {
      currentIndex = index;

      loadSong(currentIndex);

      playSong();
    });

    songList.appendChild(div);
  });
}
search.addEventListener("input", () => {
  const text = search.value.toLowerCase();

  const filtered = songs.filter((song) =>
    song.name.toLowerCase().includes(text),
  );

  renderSongs(filtered);
});
function loadSong(index) {
  const song = songs[index];

  if (!song) return;

  audio.src = URL.createObjectURL(song.file);

  title.textContent = song.name;

  artist.textContent = "Archivo local";
  localStorage.setItem(
    "currentSong",
    index
);
}
function playSong() {
  initAudio();

  audioContext.resume();

  audio.play();

  playBtn.textContent = "⏸";

  playing = true;

  cover.classList.add("spinning");
}

function pauseSong() {
  audio.pause();

  playBtn.textContent = "▶";

  playing = false;

  cover.classList.remove("spinning");
}

playBtn.addEventListener("click", () => {
  playing ? pauseSong() : playSong();
});
nextBtn.addEventListener("click", () => {
  cover.classList.remove("reverse");

  cover.classList.add("fast");

  setTimeout(() => {
    cover.classList.remove("fast");
  }, 700);

  currentIndex++;

  if (currentIndex >= songs.length) {
    currentIndex = 0;
  }

  loadSong(currentIndex);

  playSong();
});

prevBtn.addEventListener("click", () => {
  cover.classList.add("reverse");

  cover.classList.add("fast");

  setTimeout(() => {
    cover.classList.remove("fast");
    cover.classList.remove("reverse");
  }, 700);

  if (audio.currentTime > 3) {
    audio.currentTime = 0;
  } else {
    currentIndex--;

    if (currentIndex < 0) {
      currentIndex = songs.length - 1;
    }

    loadSong(currentIndex);

    playSong();
  }
});
audio.addEventListener("timeupdate", () => {
  progress.value = (audio.currentTime / audio.duration) * 100 || 0;

  currentTimeEl.textContent = formatTime(audio.currentTime);

  durationEl.textContent = formatTime(audio.duration);

  updateProgressUI();
  localStorage.setItem(
    "songTime",
    audio.currentTime
);
});

let lastProgress = 0;

progress.addEventListener("input", () => {
  const currentValue = progress.value;

  audio.currentTime = (currentValue / 100) * audio.duration;

  if (currentValue > lastProgress) {
    cover.classList.remove("reverse");

    cover.classList.add("fast");
  } else {
    cover.classList.add("reverse");

    cover.classList.add("fast");
  }

  clearTimeout(window.spinTimeout);

  window.spinTimeout = setTimeout(() => {
    cover.classList.remove("fast");

    cover.classList.remove("reverse");
  }, 500);

  lastProgress = currentValue;
});
volume.addEventListener("input", () => {
  updateVolumeUI();
  audio.volume = volume.value;
  localStorage.setItem("volume", volume.value);
});

function formatTime(time) {
  const minutes = Math.floor(time / 60);

  const seconds = Math.floor(time % 60);

  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}
// volumen
function updateVolumeUI() {
  const value = volume.value * 100;
  volume.style.background = `linear-gradient(to right, #1db954 ${value}%, #444 ${value}%)`;
}

function updateProgressUI() {
  const value = progress.value;
  const color = document.body.classList.contains("dark")
    ? "#1db954"
    : "#00d4ff";

  progress.style.background = `linear-gradient(to right, ${color} ${value}%, #555 ${value}%)`;
}

audio.addEventListener("ended", () => {
  cover.classList.add("fast");

  setTimeout(() => {
    cover.classList.remove("fast");

    currentIndex++;

    if (currentIndex >= songs.length) {
      currentIndex = 0;
    }

    loadSong(currentIndex);

    playSong();
  }, 300);
});

function animateVisualizer() {
  requestAnimationFrame(animateVisualizer);

  if (!analyser) return;

  analyser.getByteFrequencyData(dataArray);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const barWidth = (canvas.width / bufferLength) * 2.5;

  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    const barHeight = dataArray[i] / 1.8;

    const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);

    gradient.addColorStop(0, "#7b2ff7");

    gradient.addColorStop(1, "#00d4ff");

    ctx.fillStyle = gradient;

    ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

    x += barWidth + 2;
  }
}

function saveFolder(handle) {
  const transaction = db.transaction(["folders"], "readwrite");

  const store = transaction.objectStore("folders");

  store.put(handle, "musicFolder");
}
async function loadSavedFolder() {
  const transaction = db.transaction(["folders"], "readonly");

  const store = transaction.objectStore("folders");

  const request = store.get("musicFolder");

  request.onsuccess = async () => {
    const dirHandle = request.result;

    if (!dirHandle) return;

    const permission = await dirHandle.queryPermission({
      mode: "read",
    });

    if (permission !== "granted") return;

    songs = [];

    for await (const entry of dirHandle.values()) {
      if (entry.kind === "file") {
        const file = await entry.getFile();

        if (file.type.startsWith("audio/")) {
          songs.push({
            name: file.name,
            file: file,
          });
        }
      }
    }

    renderSongs(songs);
    const savedSong =
localStorage.getItem("currentSong");

if(savedSong){

    currentIndex =
    parseInt(savedSong);

    loadSong(currentIndex);

    audio.addEventListener(
    "loadedmetadata",
    ()=>{

        const savedTime =
        localStorage.getItem("songTime");

        if(savedTime){

            audio.currentTime =
            parseFloat(savedTime);
        }

    });

}
  };

}

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

animateVisualizer();

eqBtn.addEventListener("click", () => {
  equalizer.classList.toggle("active");
});

bassSlider.addEventListener("input", () => {
  bassFilter.gain.value = bassSlider.value;
  localStorage.setItem("bass", bassSlider.value);
});

midSlider.addEventListener("input", () => {
  midFilter.gain.value = midSlider.value;
  localStorage.setItem("mid", midSlider.value);
});

trebleSlider.addEventListener("input", () => {
  trebleFilter.gain.value = trebleSlider.value;
  localStorage.setItem("treble", trebleSlider.value);
});

resetEQ.addEventListener("click", ()=>{

    bassSlider.value = 0;
    midSlider.value = 0;
    trebleSlider.value = 0;

    bassFilter.gain.value = 0;
    midFilter.gain.value = 0;
    trebleFilter.gain.value = 0;

    localStorage.setItem("bass",0);
    localStorage.setItem("mid",0);
    localStorage.setItem("treble",0);

});
