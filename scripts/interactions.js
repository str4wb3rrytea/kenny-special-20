/* =========================================================
   INTERACTIVE ITEMS — record player spin + song,
   kiss voice recording
========================================================= */

function pauseAllAudio(except) {
  document.querySelectorAll('audio').forEach(a => {
    if (a !== except) {
      a.pause();
      a.currentTime = 0;
    }
  });
}

/* ---------- Record player ---------- */
const RECORD_SPIN_FRAMES = [
  'assets/record-player/record-player1.png',
  'assets/record-player/record-player2.png',
  'assets/record-player/record-player3.png',
  'assets/record-player/record-player4.png',
  'assets/record-player/record-player5.png',
  'assets/record-player/record-player6.png',
  'assets/record-player/record-player7.png',
  'assets/record-player/record-player8.png',
  'assets/record-player/record-player9.png',
  'assets/record-player/record-player10.png',
  'assets/record-player/record-player11.png',
  'assets/record-player/record-player12.png',
  'assets/record-player/record-player13.png',
  'assets/record-player/record-player14.png',
  'assets/record-player/record-player15.png',
  'assets/record-player/record-player16.png',
  'assets/record-player/record-player17.png',
];

// Preload AND decode every frame up front, so the underlying network
// fetch + decode is already warmed in the browser's cache
const recordFramesReady = Promise.all(
  RECORD_SPIN_FRAMES.map(src => {
    const img = new Image();
    img.src = src;
    return img.decode().catch(() => {});
  })
);

const recordItem = document.getElementById('recordItem');
const recordAudio = document.getElementById('recordSong');
const recordSpinImg = document.getElementById('recordSpinFrame');

let recordSpinInterval = null;
let recordPlaying = false;

async function startRecordSpin() {
  // Set the first frame and wait for THIS element to actually
  // decode/render it before revealing it — this is what removes
  // the "cut to blank, then slowly fill in" flash.
  recordSpinImg.src = RECORD_SPIN_FRAMES[0];
  try {
    await recordSpinImg.decode();
  } catch (e) {
    // ignore — if decode() isn't supported, we just proceed without the wait
  }

  recordItem.classList.remove('jiggling');
  recordItem.classList.add('spinning');

  let i = 0;
  recordSpinInterval = setInterval(() => {
    i = (i + 1) % RECORD_SPIN_FRAMES.length; // loop continuously
    recordSpinImg.src = RECORD_SPIN_FRAMES[i];
  }, 90); // ms per frame — tune spin speed here
}

function stopRecordSpin() {
  clearInterval(recordSpinInterval);
  recordItem.classList.remove('spinning');
  recordItem.classList.add('jiggling');
}

recordItem.addEventListener('click', () => {
  if (recordPlaying) {
    // clicking again stops it
    recordAudio.pause();
    recordAudio.currentTime = 0;
    stopRecordSpin();
    recordPlaying = false;
    return;
  }

  recordFramesReady.then(() => {
    pauseAllAudio(recordAudio); // stop the kiss voice if it was playing
    recordPlaying = true;
    startRecordSpin();
    recordAudio.currentTime = 0;
    recordAudio.play();
  });
});

recordAudio.addEventListener('ended', () => {
  stopRecordSpin();
  recordPlaying = false;
});

/* ---------- Kiss ---------- */
const kissItem = document.getElementById('kissItem');
const kissAudio = document.getElementById('kissVoice');

kissItem.addEventListener('click', () => {
  pauseAllAudio(kissAudio); // stop the record song if it was playing
  kissAudio.currentTime = 0;
  kissAudio.play();
});