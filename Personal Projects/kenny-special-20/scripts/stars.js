/* =========================================================
   BIRTHDAY SKY — random star scatter + flicker
   =========================================================
   Edit STAR_TYPES below if your filenames differ.
   Files expected in /assets/, e.g. assets/star1_a.png
========================================================= */

const STAR_TYPES = [1, 2, 3, 4, 5, 6, 7]; // matches star1...star7

const sky = document.getElementById("sky");

/* ---------- 1. Decide how many stars & how big, based on screen size ---------- */
function getStarConfig() {
  const w = window.innerWidth;

  if (w < 480) {
    // small phones
    return { count: 26, minSize: 18, maxSize: 34 };
  } else if (w < 900) {
    // large phones / small tablets
    return { count: 40, minSize: 22, maxSize: 42 };
  } else if (w < 1400) {
    // tablets / small desktop
    return { count: 60, minSize: 28, maxSize: 52 };
  } else {
    // large desktop
    return { count: 85, minSize: 30, maxSize: 60 };
  }
}

/* ---------- 2. Helpers ---------- */
function randBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function randChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/* ---------- 3. Build one star element ---------- */
function createStar(size) {
  const starEl = document.createElement("div");
  starEl.className = "star";

  // Random position across the whole sky, as a percentage so it
  // stays proportional at any screen size / on resize.
  const topPct = randBetween(2, 96);
  const leftPct = randBetween(2, 96);

  starEl.style.top = `${topPct}%`;
  starEl.style.left = `${leftPct}%`;
  starEl.style.setProperty("--star-size", `${size}px`);

  // Random gentle pulse timing per star, so they don't sync up
  starEl.style.setProperty("--pulse-duration", `${randBetween(2, 5).toFixed(2)}s`);
  starEl.style.setProperty("--pulse-delay", `${randBetween(0, 4).toFixed(2)}s`);

  // Pick one of the 7 star doodle designs at random
  const type = randChoice(STAR_TYPES);

  const frameA = document.createElement("img");
  frameA.className = "frame-a";
  frameA.src = `assets/stars/star${type}_a.png`;
  frameA.alt = "";

  const frameB = document.createElement("img");
  frameB.className = "frame-b";
  frameB.src = `assets/stars/star${type}_b.png`;
  frameB.alt = "";

  starEl.appendChild(frameA);
  starEl.appendChild(frameB);

  // Slight random rotation so identical doodles don't look copy-pasted
  starEl.style.setProperty(
    "--extra-rotate",
    `${randBetween(-15, 15).toFixed(1)}deg`
  );
  frameA.style.transform = `rotate(${randBetween(-15, 15)}deg)`;
  frameB.style.transform = frameA.style.transform;

  scheduleFlicker(starEl);

  return starEl;
}

/* ---------- 4. Flicker logic ----------
   Each star flips between frame A and B on its OWN random timer,
   so the whole sky feels alive rather than blinking in unison. */
function scheduleFlicker(starEl) {
  const nextDelay = randBetween(600, 4000); // ms between flickers, random per star

  setTimeout(() => {
    starEl.classList.toggle("flip");
    scheduleFlicker(starEl); // schedule the next flicker with a fresh random delay
  }, nextDelay);
}

/* ---------- 5. Populate the sky ---------- */
let currentStars = [];

function populateSky() {
  // clear old stars (used on resize)
  currentStars.forEach((el) => el.remove());
  currentStars = [];

  const { count, minSize, maxSize } = getStarConfig();

  for (let i = 0; i < count; i++) {
    const size = randBetween(minSize, maxSize);
    const star = createStar(size);
    sky.appendChild(star);
    currentStars.push(star);
  }
}

populateSky();

/* ---------- 6. Re-scatter on resize (debounced) ----------
   Rebuilding on resize keeps density/size correct if someone
   rotates their phone or resizes a desktop window. */
let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(populateSky, 300);
});