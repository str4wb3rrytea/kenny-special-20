/* =========================================================
   ENVELOPE — click to trigger security question
========================================================= */

const trigger = document.getElementById('envelopeTrigger');
const overlay = document.getElementById('questionOverlay');
const box = document.getElementById('questionBox');
const input = document.getElementById('answerInput');
const submitBtn = document.getElementById('submitAnswer');

let hasOpened = false; // becomes true once the correct answer is given

trigger.addEventListener('click', () => {
  if (hasOpened) return; // envelope already opened — do nothing

  trigger.classList.add('paused');
  overlay.classList.add('open');
  input.focus();
});

const OPEN_FRAMES = [
  'assets/envelope/envelope1.png',
  'assets/envelope/envelope2.png',
  'assets/envelope/envelope3.png',
  'assets/envelope/envelope4.png',
  'assets/envelope/envelope5.png',
  'assets/envelope/envelope6.png',
];
const FRAME_DURATION = 140;

// Preload AND decode every frame up front, not just fetch it
const preloadedFrames = OPEN_FRAMES.map(src => {
  const img = new Image();
  img.src = src;
  return img.decode().catch(() => {}); // catch in case decode isn't supported everywhere
});

function playEnvelopeOpen(onComplete) {
  const wrap = document.getElementById('envelopeTrigger');
  const openFrame = document.getElementById('envelopeOpenFrame');

  Promise.all(preloadedFrames).then(() => {
    wrap.classList.add('opening');
    let i = 0;
    openFrame.src = OPEN_FRAMES[0];

    const step = setInterval(() => {
      i++;
      if (i >= OPEN_FRAMES.length) {
        clearInterval(step);
        if (onComplete) onComplete();
        return;
      }
      openFrame.src = OPEN_FRAMES[i];
    }, FRAME_DURATION);
  });
}

function checkAnswer() {
  const value = input.value
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  const isCorrect = value === 'banana bread';

  if (isCorrect) {
    hasOpened = true; // lock it — envelope can't be reopened
    overlay.classList.remove('open');
    setTimeout(() => playEnvelopeOpen(() => {
      revealDoodles();
    }), 300);
  } else {
    box.classList.add('shake');
    setTimeout(() => box.classList.remove('shake'), 400);
    input.value = '';
  }
}

submitBtn.addEventListener('click', checkAnswer);
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') checkAnswer();
});

function revealDoodles() {
  const stage = document.getElementById('revealStage');
  const envelope = document.getElementById('envelopeTrigger');

  stage.classList.add('placed');
  envelope.classList.add('receded');

  const jiggleItems = ['kissItem', 'recordItem'];
  const staticItems = ['letterItem'];

  [...jiggleItems, ...staticItems].forEach(id => {
    const el = document.getElementById(id);
    el.addEventListener('transitionend', function handler(e) {
      if (e.propertyName !== 'transform') return;
      el.classList.add('settled');
      if (jiggleItems.includes(id)) {
        el.classList.add('jiggling');
        // slight per-item rate variation so kiss and record don't swap in sync
        const rate = (0.7 + Math.random() * 0.5).toFixed(2); // 0.7s–1.2s
        el.style.setProperty('--jiggle-rate', `${rate}s`);
      }
      el.removeEventListener('transitionend', handler);
    });
  });
}