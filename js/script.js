/* ==================== VARIABLES ======================== */
const playList = [
  {
    name: 'Better Day',
    artist: 'penguinmusic',
    imgPath: 'images/1-better-day.jpg',
    musicPath: 'music/1-better-day.mp3',
    musicLength: '01:30',
  },
  {
    name: 'motivational epic music inspiring cinematic background music',
    artist: 'soulProdMusic',
    imgPath: 'images/2-motevational-epic.webp',
    musicPath: 'music/2-motivational-epic-music-inspiring-cinematic-background-music.mp3',
    musicLength: '02:36',
  },
  {
    name: 'legacy of monteverdi lamento della ninfa epic trailer full version',
    artist: 'White_Records',
    imgPath: 'images/3-legacy.jpg',
    musicPath: 'music/3-legacy-of-monteverdi-lamento-della-ninfa-epic-trailer-full-version.mp3',
    musicLength: '02:52',
  },
  {
    name: 'price of freedom',
    artist: 'Good_B_Music',
    imgPath: 'images/4-price-of-freedom.webp',
    musicPath: 'music/4-price-of-freedom.mp3',
    musicLength: '05:07',
  },
  {
    name: 'haunted carnival',
    artist: 'Top-Flow',
    imgPath: 'images/5-hunted-carnival.jpeg',
    musicPath: 'music/5-haunted-carnival.mp3',
    musicLength: '01:44',
  },
  {
    name: 'petal skies',
    artist: 'Top-Flow',
    imgPath: 'images/6-petal-skies.webp',
    musicPath: 'music/6-petal-skies.mp3',
    musicLength: '01:46',
  },
];

// popup
const popupEl = document.querySelector('.popup-music-player');
const hidePopupBtn = popupEl.querySelector('.down-btn');
const backwardBtn = popupEl.querySelector('.backward-btn');
const forwardBtn = popupEl.querySelector('.forward-btn');
const repeatBtn = popupEl.querySelector('.repeat-btn');
const shuffleBtn = popupEl.querySelector('.shuffle-btn');
const volumeInput = document.querySelector('#volume-slider');
const progressContainer = document.querySelector('.progress-container');
const progressBar = document.querySelector('.progress-bar');
const volumeBtn = popupEl.querySelector('.volume-btn');
const likeBtn = popupEl.querySelector('.like-btn');
// audio
const audioContainer = document.querySelector('.audio-player');
const audio = document.getElementById('audio');
const closeAudioBtn = audioContainer.querySelector('.close-btn');
const showPopupBtn = audioContainer.querySelector('.up-btn');

let index = 0;

/* ==================== EVENTS ======================== */
// window
window.addEventListener('load', () => {
  buildHtml();
  // events
  const tracks = document.querySelectorAll('.track');
  const PlayPauseBtn = document.querySelector('.play-pause-btn');
  PlayPauseBtn.addEventListener('click', handlePlayPauseAudio);
  for (let i = 0; i < tracks.length; i++) {
    const track = tracks[i];
    track.addEventListener('click', () => {
      index = i;
      handlePlayPauseAudio();
    });
  }
  start();
});
// popup
hidePopupBtn.addEventListener('click', hidePopup);
forwardBtn.addEventListener('click', playNextAudio);
backwardBtn.addEventListener('click', playPrevAudio);
volumeInput.addEventListener('change', changeVolume);
volumeBtn.addEventListener('click', toggleVolume);
likeBtn.addEventListener('click', toggleLike);
repeatBtn.addEventListener('click', repeatTrack);
shuffleBtn.addEventListener('click', shuffleTrackList);
// audio
showPopupBtn.addEventListener('click', showPopup);
closeAudioBtn.addEventListener('click', closeAudio);
audio.addEventListener('ended', handleEndOfAudio);
audio.addEventListener('timeupdate', updateTimeProgress);
audio.addEventListener('loadeddata', updateDuration);
// progress
progressContainer.addEventListener('click', changeCurrentTime);
/* ==================== FUNCTIONS ======================== */
function handlePlayPauseAudio() {
  const tracks = document.querySelectorAll('.track');
  const activeTrack = document.querySelector('.active-track');
  const newTrack = tracks[index];
  if (!activeTrack) {
    newTrack.classList.add('active-track');
    audio.src = playList[index].musicPath;
    playAudio();
    return;
  }
  if (activeTrack === newTrack) {
    if (audio.paused) {
      resumeAudio();
      return;
    }
    pauseAudio();
    return;
  }
  // play new one
  updateLastPlayedAudio();
  newTrack.classList.add('active-track');
  audio.src = playList[index].musicPath;
  playAudio();
}
function hidePopup() {
  if (!popupEl.classList.contains('hidden')) {
    popupEl.classList.add('hidden');
  }
}
function showPopup() {
  if (popupEl.classList.contains('hidden')) {
    popupEl.classList.remove('hidden');
  }
}
function closeAudio() {
  audioContainer.classList.add('hidden');
  updateLastPlayedAudio();
}

function updateHtml() {
  const icon = document.querySelector('.play-pause-btn i');
  const cover = popupEl.querySelector('.music-img');
  const bars = document.querySelectorAll('.bar');
  const { name, artist, imgPath } = playList[index];
  const trackImage1 = document.querySelector('.audio-player .music-img');
  const trackImage2 = document.querySelector('.popup-music-player .music-img');
  const trackName1 = document.querySelector('.audio-player .track-name');
  const trackName2 = document.querySelector('.popup-music-player .track-name');
  const trackArtist1 = document.querySelector('.audio-player .track-artist');
  const trackArtist2 = document.querySelector('.popup-music-player .track-artist');
  const activeTrackStatus = document.querySelector('.active-track .track-status');
  activeTrackStatus.textContent = 'playing';
  [(trackImage1, trackImage2)].forEach((img) => (img.src = imgPath));
  [trackName1, trackName2].forEach((tName) => (tName.textContent = name));
  [trackArtist1, trackArtist2].forEach((art) => (art.textContent = artist));
  icon.classList.remove('fa-play');
  icon.classList.add('fa-pause');
  setTimeout(() => [...bars, cover].forEach((elem) => elem.classList.add('animate')), 700);
}
function pauseAudio() {
  const activeTrackStatus = document.querySelector('.active-track .track-status');
  const icon = document.querySelector('.play-pause-btn i');
  const cover = popupEl.querySelector('.music-img');
  const bars = document.querySelectorAll('.bar');
  audio.pause();
  activeTrackStatus.textContent = 'paused';
  icon.classList.remove('fa-pause');
  icon.classList.add('fa-play');
  [...bars, cover].forEach((elem) => elem.classList.remove('animate'));
}
function playAudio() {
  updateHtml();
  showAudio();
  showPopup();
  audio.play();
}
function resumeAudio() {
  const activeTrackStatus = document.querySelector('.active-track .track-status');
  const icon = document.querySelector('.play-pause-btn i');
  const cover = popupEl.querySelector('.music-img');
  const bars = document.querySelectorAll('.bar');
  activeTrackStatus.textContent = 'playing';
  icon.classList.remove('fa-play');
  icon.classList.add('fa-pause');
  setTimeout(() => [...bars, cover].forEach((elem) => elem.classList.add('animate')), 700);

  audio.play();
}
function showAudio() {
  if (audioContainer.classList.contains('hidden')) {
    audioContainer.classList.remove('hidden');
  }
}
function handleEndOfAudio() {
  if (repeatBtn.classList.contains('active')) {
    return;
  }
  playNextAudio();
}
function updateLastPlayedAudio() {
  const cover = popupEl.querySelector('.music-img');
  const bars = document.querySelectorAll('.bar');
  [...bars, cover].forEach((elem) => elem.classList.remove('animate'));
  const activeTrack = document.querySelector('.active-track');
  const activeTrackStatus = document.querySelector('.active-track .track-status');
  activeTrackStatus.textContent = '';
  activeTrack.classList.remove('active-track');
  audio.pause();
}
// start ==========
function buildHtml() {
  const tracksContainer = document.querySelector('.tracks');
  tracksContainer.innerHTML = '';
  playList.forEach((trackObj) => {
    const { name, artist, imgPath, musicLength } = trackObj;
    const track = document.createElement('div');
    track.className = 'track';
    track.innerHTML = `<img class="music-img" src=${imgPath} alt="album cover" />
            <p class="track-name">${name}</p>
            <p class="track-artist">${artist}</p>
            <p class="track-length">${musicLength}</p>
            <p class="track-status"></p>`;
    tracksContainer.appendChild(track);
  });
}
function start() {
  const tracks = document.querySelectorAll('.track');
  tracks[index].classList.add('active-track');
  const activeTrackStatus = document.querySelector('.active-track .track-status');
  activeTrackStatus.textContent = 'paused';
  const { name, artist, imgPath, musicPath } = playList[index];
  audio.src = musicPath;
  const trackImage1 = document.querySelector('.audio-player .music-img');
  const trackImage2 = document.querySelector('.popup-music-player .music-img');
  const trackName1 = document.querySelector('.audio-player .track-name');
  const trackName2 = document.querySelector('.popup-music-player .track-name');
  const trackArtist1 = document.querySelector('.audio-player .track-artist');
  const trackArtist2 = document.querySelector('.popup-music-player .track-artist');
  [trackImage1, trackImage2].forEach((img) => (img.src = imgPath));
  [trackName1, trackName2].forEach((tName) => (tName.textContent = name));
  [trackArtist1, trackArtist2].forEach((art) => (art.textContent = artist));
}
function playPrevAudio() {
  if (shuffleBtn.classList.contains('active')) {
    index = Math.floor(Math.random() * playList.length);
    handlePlayPauseAudio();
    return;
  }
  const newIndex = index - 1;
  if (newIndex >= 0) {
    index = newIndex;
  } else {
    index = playList.length - 1;
  }
  handlePlayPauseAudio();
}
function playNextAudio() {
  if (shuffleBtn.classList.contains('active')) {
    index = Math.floor(Math.random() * playList.length);
    handlePlayPauseAudio();
    return;
  }
  const newIndex = index + 1;
  if (newIndex <= playList.length - 1) {
    index = newIndex;
  } else {
    index = 0;
  }
  handlePlayPauseAudio();
}
function repeatTrack() {
  repeatBtn.classList.toggle('active');
  if (repeatBtn.classList.contains('active')) {
    audio.setAttribute('loop', 'true');
    if (shuffleBtn.classList.contains('active')) {
      shuffleBtn.classList.remove('active');
    }
    return;
  }
  audio.removeAttribute('loop');
}
function shuffleTrackList() {
  shuffleBtn.classList.toggle('active');
  if (shuffleBtn.classList.contains('active')) {
    if (repeatBtn.classList.contains('active')) {
      repeatBtn.classList.remove('active');
      audio.removeAttribute('loop');
    }
  }
}
function toggleVolume(e) {
  const volumeBtn = e.currentTarget;
  const volumeIcon = volumeBtn.querySelector('i');
  if (audio.volume > 0) {
    audio.volume = 0;
    volumeIcon.classList.remove('fa-volume-high');
    volumeIcon.classList.add('fa-volume-xmark');
    return;
  }
  audio.volume = volumeInput.value / 100;
  volumeIcon.classList.remove('fa-volume-xmark');
  volumeIcon.classList.add('fa-volume-high');
}
function changeVolume(e) {
  const volumeIcon = volumeBtn.querySelector('i');
  audio.volume = e.currentTarget.value / 100;
  if (audio.volume === 0 && volumeIcon.classList.contains('fa-volume-high')) {
    volumeIcon.classList.remove('fa-volume-high');
    volumeIcon.classList.add('fa-volume-xmark');
  } else {
    volumeIcon.classList.remove('fa-volume-xmark');
    volumeIcon.classList.add('fa-volume-high');
  }
}
function updateTimeProgress(e) {
  // update progress bar
  const currentTime = e.target.currentTime;
  const audioDuration = e.target.duration;
  const progressBarWidth = Math.floor((currentTime / audioDuration) * 100);
  progressBar.style.width = `${progressBarWidth}%`;
  // update timer
  const currentTimeEl = document.getElementById('current-duration');
  const currentMinutes = Math.floor(currentTime / 60);
  let currentSeconds = Math.floor(currentTime % 60);
  if (currentSeconds < 10) {
    currentSeconds = `0${currentSeconds}`;
  }
  currentTimeEl.textContent = `${currentMinutes}:${currentSeconds}`;
}
function changeCurrentTime(e) {
  const progressWidth = progressContainer.clientWidth;
  const clickedOffsetX = e.offsetX;
  const audioDuration = audio.duration;
  audio.currentTime = (clickedOffsetX / progressWidth) * audioDuration;
}
function updateDuration(e) {
  const audioDurationEl = popupEl.querySelector('.track-length');
  const audioDuration = e.target.duration;
  const totalMinutes = Math.floor(audioDuration / 60);
  let totalSeconds = Math.floor(audioDuration % 60);
  if (totalSeconds < 10) {
    totalSeconds = `0${totalSeconds}`;
  }
  audioDurationEl.textContent = `${totalMinutes}:${totalSeconds}`;
}
function toggleLike(e) {
  e.currentTarget.classList.toggle('liked');
}
