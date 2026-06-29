/* ================================================================
   ROMANTIC WEBSITE — script.js  (cinematic upgrade)
   Pure vanilla JS, no frameworks.
   HOW TO CUSTOMISE:
   ─ Questions & answers  → edit QUIZ_QUESTIONS below
   ─ Typewriter intro     → edit INTRO_LINES below
   ─ Girl's photo         → change src attr in index.html (Screen 2)
   ─ Per-question images  → add   image: "yourfile.jpg"   to any question
   ─ Background music     → uncomment <audio> in index.html
   ================================================================ */

/* ================================================================
   QUIZ QUESTIONS
   Each object:
     question : string
     answers  : array of accepted answers (matching is normalized — case,
                extra spaces, punctuation insensitive)
     image    : (optional) image filename or URL shown below the question
   ================================================================ */
const QUIZ_QUESTIONS = [
  {
    question: "What does Somil say to start a conversation? 🫠",
    answers: ["heyyo"],
    wrongMsg: "nuh uh, think again 🫠",
  },
  {
    question: "What does Pragya usually reply with? 🙃",
    answers: ["hoi"],
    wrongMsg: "c'mon you know this 🙃",
  },
  {
    question: "What time did Somil stupidly gather the courage to confess? 😲",
    answers: ["5:30am", "5:30 am", "5 30 am", "5:30", "530"],
    wrongMsg: "that's not it… dig deeper 😲",
  },
  {
    question: "What date did we make it official? 😮‍💨",
    answers: ["10 april", "10th april", "april 10", "10/04", "10 apr", "apr 10", "10apr", "10th apr"],
    wrongMsg: "nope! you definitely know this one 😮‍💨",
  },
  {
    question: "What was my nickname in school?",
    answers: ["traitor"],
    wrongMsg: "really?? you of all people should remember 🫠",
  },
];

/* ================================================================
   TYPEWRITER INTRO LINES (Screen 3)
   Empty string = visual gap / pause line.
   ================================================================ */
const INTRO_LINES = [
  "Now now... 🫠",
  "Answer these questions that only my girlfriend would know...",
  "",
  "Yup... 🙃",
  "You read that right.",
  "",
  "She's my girlfriend. 😲",
  "",
  "Lucky, right? 😌",
];

/* ================================================================
   CINEMATIC FINAL LINES (Screen 5)
   Each object:  { text, delay (ms after previous), isHeadline }
   ================================================================ */
const CINEMATIC_LINES = [
  { text: "So it really is you, 😮‍💨",                          delay: 600  },
  { text: "Miss Magnifique ✨",                              delay: 900,  isHeadline: true },
  { text: "Welcome, and answer a final question for me...", delay: 1400 },
  { text: "Will you go on a date with me mi dona?",         delay: 1600, isHeadline: true },
];

/* ================================================================
   STATE
   ================================================================ */
let currentQuestion = 0;

/* ================================================================
   NORMALIZE — flexible answer matching
   Strips case, collapses whitespace, removes trailing punctuation.
   ================================================================ */
function normalize(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[.,!?;:]+$/, "");
}

function isCorrect(input, acceptedAnswers) {
  const n = normalize(input);
  return acceptedAnswers.some((a) => normalize(a) === n);
}

/* ================================================================
   CORRECT ANSWER SOUND — Web Audio API chime (no files needed)
   ================================================================ */
function playCorrectSound() {
  try {
    const ctx  = new (window.AudioContext || window.webkitAudioContext)();
    const gain = ctx.createGain();
    gain.connect(ctx.destination);

    const notes = [523.25, 659.25, 783.99]; // C5 E5 G5
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.connect(gain);
      osc.type = "sine";
      const t = ctx.currentTime + i * 0.13;
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.28, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
      osc.start(t);
      osc.stop(t + 0.55);
    });
  } catch (e) { /* silently ignore if audio blocked */ }
}

/* ================================================================
   STARS / PARTICLES
   ================================================================ */
(function initStars() {
  const canvas = document.getElementById("stars-canvas");
  const ctx    = canvas.getContext("2d");
  let   stars  = [];
  const COUNT  = 170;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    buildStars();
  }

  function buildStars() {
    stars = Array.from({ length: COUNT }, () => ({
      x:     Math.random() * canvas.width,
      y:     Math.random() * canvas.height,
      r:     Math.random() * 1.4 + 0.3,
      alpha: Math.random() * 0.55 + 0.2,
      speed: Math.random() * 0.18 + 0.03,
      drift: (Math.random() - 0.5) * 0.10,
      phase: Math.random() * Math.PI * 2,
      freq:  Math.random() * 0.6 + 0.2,
    }));
  }

  function draw(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach((s) => {
      const twinkle = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t * s.freq * 0.001 + s.phase));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(220, 200, 255, ${s.alpha * twinkle})`;
      ctx.fill();
      s.y -= s.speed;
      s.x += s.drift;
      if (s.y < -2) { s.y = canvas.height + 2; s.x = Math.random() * canvas.width; }
      if (s.x < -2) s.x = canvas.width + 2;
      if (s.x > canvas.width + 2) s.x = -2;
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  resize();
  requestAnimationFrame(draw);
})();

/* ================================================================
   SCREEN TRANSITIONS
   ================================================================ */
function changeScreen(id) {
  const current = document.querySelector(".screen.active");
  const next    = document.getElementById(id);
  if (!next || next === current) return;

  if (current) {
    current.classList.add("exit");
    setTimeout(() => current.classList.remove("active", "exit"), 750);
  }
  setTimeout(() => next.classList.add("active"), current ? 140 : 0);
}

/* ================================================================
   SCREEN 1 — Welcome
   ================================================================ */
(function screen1() {
  const yesBtn = document.getElementById("s1-yes");
  const noBtn  = document.getElementById("s1-no");
  const toast  = document.getElementById("s1-toast");
  const retry  = document.getElementById("s1-retry");

  yesBtn.addEventListener("click", () => changeScreen("screen-2"));

  noBtn.addEventListener("click", () => {
    toast.classList.remove("hidden");
    retry.classList.remove("hidden");
    noBtn.style.display  = "none";
    yesBtn.style.display = "none";
  });

  retry.addEventListener("click", () => {
    toast.classList.add("hidden");
    retry.classList.add("hidden");
    noBtn.style.display  = "";
    yesBtn.style.display = "";
  });
})();

/* ================================================================
   SCREEN 2 — Identity check
   ================================================================ */
(function screen2() {
  const yesBtn = document.getElementById("s2-yes");
  const noBtn  = document.getElementById("s2-no");
  const toast  = document.getElementById("s2-toast");

  yesBtn.addEventListener("click", () => {
    toast.classList.add("hidden");
    changeScreen("screen-3");
    startTypewriter();
  });

  noBtn.addEventListener("click", () => {
    toast.classList.remove("hidden");
    triggerShake(noBtn.closest(".card"));
    setTimeout(() => toast.classList.add("hidden"), 3200);
  });
})();

/* ================================================================
   SCREEN 3 — Typewriter intro
   ================================================================ */
function startTypewriter() {
  const output = document.getElementById("typewriter-output");
  const cursor = document.querySelector(".cursor");
  const goBtn  = document.getElementById("s3-go");

  output.innerHTML = "";

  let i = 0;
  let lineIndex = 0;

  function typeLine() {
    if (lineIndex >= INTRO_LINES.length) {
      cursor.classList.remove("blink");
      goBtn.classList.remove("hidden");
      return;
    }

    const line = INTRO_LINES[lineIndex];

    const span = document.createElement("span");
    span.className = "tw-line";
    output.appendChild(span);

    let charIndex = 0;

    function typeChar() {
      span.textContent = line.substring(0, charIndex);

      if (charIndex < line.length) {
        charIndex++;
        setTimeout(typeChar, 35); // smooth typing speed
      } else {
        lineIndex++;
        setTimeout(typeLine, 500); // pause between lines
      }
    }

    typeChar();
  }

  typeLine();

  document.getElementById("s3-go").addEventListener("click", () => {
    changeScreen("screen-4");
    loadQuestion(0);
  }, { once: true });
}

/* ================================================================
   SCREEN 4 — Quiz
   ================================================================ */
function buildProgressDots(total) {
  const container = document.getElementById("quiz-progress-dots");
  container.innerHTML = "";
  for (let i = 0; i < total; i++) {
    const dot = document.createElement("div");
    dot.className = "progress-dot";
    dot.dataset.index = i;
    container.appendChild(dot);
  }
}

function updateProgressDots(current) {
  document.querySelectorAll(".progress-dot").forEach((dot, i) => {
    dot.classList.remove("filled", "current");
    if (i < current)        dot.classList.add("filled");
    else if (i === current) dot.classList.add("current");
  });
}

function loadQuestion(index) {
  const q          = QUIZ_QUESTIONS[index];
  const qText      = document.getElementById("question-text");
  const quizBody   = document.getElementById("quiz-body");
  const input      = document.getElementById("quiz-input");
  const feedback   = document.getElementById("quiz-feedback");
  const loadingMsg = document.getElementById("loading-memory");
  const imgWrap    = document.getElementById("question-image-wrap");
  const img        = document.getElementById("question-image");

  updateProgressDots(index);
  quizBody.classList.add("fading");
  feedback.classList.add("hidden");

  setTimeout(() => {
    loadingMsg.classList.remove("hidden");
  }, 200);

  setTimeout(() => {
    qText.textContent = q.question;
    if (q.image) {
      img.src = q.image;
      imgWrap.classList.remove("hidden");
    } else {
      imgWrap.classList.add("hidden");
      img.src = "";
    }
    input.value = "";
    quizBody.classList.remove("fading");
    quizBody.classList.add("entering");
    quizBody.addEventListener("animationend", () => {
      quizBody.classList.remove("entering");
    }, { once: true });
    loadingMsg.classList.add("hidden");
    input.focus();
  }, 950);
}

(function screen4() {
  const input     = document.getElementById("quiz-input");
  const submitBtn = document.getElementById("quiz-submit");
  const feedback  = document.getElementById("quiz-feedback");
  const card      = document.getElementById("quiz-card");

  buildProgressDots(QUIZ_QUESTIONS.length);

  function checkAnswer() {
    const raw      = input.value;
    const q        = QUIZ_QUESTIONS[currentQuestion];
    const accepted = q.answers;

    if (isCorrect(raw, accepted)) {
      playCorrectSound();
      card.classList.add("correct-glow");
      feedback.classList.add("hidden");
      setTimeout(() => {
        card.classList.remove("correct-glow");
        currentQuestion++;
        if (currentQuestion < QUIZ_QUESTIONS.length) {
          loadQuestion(currentQuestion);
        } else {
          changeScreen("screen-5");
          startCinematicSequence();
        }
      }, 1100);
    } else {
      triggerShake(card);
      feedback.textContent = q.wrongMsg || "Hmm, that doesn't sound right… try again 💭";
      feedback.classList.remove("hidden");
      input.value = "";
      input.focus();
    }
  }

  submitBtn.addEventListener("click", checkAnswer);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") checkAnswer();
  });
})();

/* ================================================================
   SCREEN 5 — Cinematic sequence + date question
   ================================================================ */
function startCinematicSequence() {
  const container = document.getElementById("cinematic-text");
  const dateQ     = document.getElementById("date-question");

  container.innerHTML = "";
  let totalDelay = 400;

  CINEMATIC_LINES.forEach((line) => {
    totalDelay += line.delay;
    const el = document.createElement("p");
    el.className = "cinematic-line" + (line.isHeadline ? " headline-line" : "");
    el.textContent = line.text;
    container.appendChild(el);
    const revealAt = totalDelay;
    setTimeout(() => el.classList.add("visible"), revealAt);
  });

  // Show YES / NO buttons after all lines
  setTimeout(() => {
    dateQ.classList.remove("hidden");
    setTimeout(() => initDodgeButton(), 200);
  }, totalDelay + 1000);
}

/* ================================================================
   SCREEN 5 — YES / NO  (smooth-dodge NO button)
   ================================================================ */
function lerp(a, b, t) { return a + (b - a) * t; }

function initDodgeButton() {
  const noBtn  = document.getElementById("final-no");
  const yesBtn = document.getElementById("final-yes");

  let isDodging  = false;
  let targetX = 0, targetY = 0;
  let curX = 0,    curY = 0;
  let dodgeCount = 0;
  const MAX_DODGES = 12;

  // Switch NO from inline flow to fixed positioning using its current screen location
  function startDodging() {
    if (isDodging) return;
    isDodging = true;
    const rect = noBtn.getBoundingClientRect();
    curX    = rect.left;
    curY    = rect.top;
    targetX = curX;
    targetY = curY;
    noBtn.style.position = "fixed";
    noBtn.style.margin   = "0";
    noBtn.style.left     = curX + "px";
    noBtn.style.top      = curY + "px";
    animateNo();
  }

  function animateNo() {
    curX = lerp(curX, targetX, 0.12);
    curY = lerp(curY, targetY, 0.12);
    noBtn.style.left = curX + "px";
    noBtn.style.top  = curY + "px";
    requestAnimationFrame(animateNo);
  }

  function updateTarget(mx, my) {
    const rect = noBtn.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    const dist = Math.hypot(mx - cx, my - cy);

    // Resistance decays with every dodge — button gradually gives up
    const resistanceFactor = Math.max(0.08, 1 - dodgeCount / MAX_DODGES);
    const THRESHOLD = 130 * resistanceFactor;
    const pushDist  = (200 - dist * 0.4) * resistanceFactor;

    if (dist < THRESHOLD && pushDist > 4) {
      startDodging();
      dodgeCount++;
      const vw    = window.innerWidth, vh = window.innerHeight;
      const bw    = rect.width,        bh = rect.height;
      const angle = Math.atan2(cy - my, cx - mx);
      let nx = cx + Math.cos(angle) * pushDist - bw / 2;
      let ny = cy + Math.sin(angle) * pushDist - bh / 2;
      targetX = Math.max(8, Math.min(vw - bw - 8, nx));
      targetY = Math.max(8, Math.min(vh - bh - 8, ny));

      // After enough dodges the button visually surrenders
      if (dodgeCount >= MAX_DODGES) {
        noBtn.style.opacity = "0.4";
        noBtn.title = "Okay fine... 😔";
      }
    }
  }

  document.addEventListener("mousemove", (e) => updateTarget(e.clientX, e.clientY));
  noBtn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    updateTarget(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: false });

  yesBtn.addEventListener("click", () => {
    showCelebration();
  });
}

function placeNo(btn) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const bw = btn.offsetWidth  || 80;
  const bh = btn.offsetHeight || 44;
  const x  = randomBetween(vw * 0.5 + 20, vw - bw - 16);
  const y  = randomBetween(vh * 0.4, vh - bh - 20);
  btn.style.left = x + "px";
  btn.style.top  = y + "px";
}

/* ================================================================
   SCREEN 6 — YES clicked → celebration
   ================================================================ */
function showCelebration() {
  changeScreen("screen-6");
  setTimeout(() => {
    spawnConfetti(150);
    animateCelebrationLines();
  }, 350);
}

function animateCelebrationLines() {
  document.querySelectorAll("#screen-6 .reveal-line").forEach((el) => {
    const delay = parseInt(el.dataset.delay || 0, 10);
    setTimeout(() => el.classList.add("visible"), delay);
  });
}

/* ================================================================
   EFFECTS — helpers
   ================================================================ */
// Shake card on wrong answer
function triggerShake(card) {
  card.classList.remove("shake");
  void card.offsetWidth; // force reflow to restart animation
  card.classList.add("shake");
  card.addEventListener("animationend", () => card.classList.remove("shake"), { once: true });
}

// Confetti burst (celebration screen only)
function spawnConfetti(count) {
  const colors = ["#c084fc","#f472b6","#818cf8","#fb7185","#fbbf24","#34d399","#fff"];
  for (let i = 0; i < count; i++) {
    const el   = document.createElement("div");
    const size = randomBetween(6, 13);
    el.className = "confetti-piece";
    el.style.setProperty("--fall-dur",   randomBetween(2.5, 5.0) + "s");
    el.style.setProperty("--fall-delay", randomBetween(0, 1.8) + "s");
    el.style.left         = randomBetween(0, window.innerWidth) + "px";
    el.style.top          = "-20px";
    el.style.background   = colors[Math.floor(Math.random() * colors.length)];
    el.style.width        = size + "px";
    el.style.height       = size + "px";
    el.style.borderRadius = Math.random() > 0.45 ? "50%" : "3px";
    el.style.transform    = `rotate(${randomBetween(0, 360)}deg)`;
    document.body.appendChild(el);
    el.addEventListener("animationend", () => el.remove());
  }
}

/* ================================================================
   UTILITY
   ================================================================ */
function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}
