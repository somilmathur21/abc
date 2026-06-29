# AGENTS.md — Project Architecture

## Overview

Pure static site — one HTML file, one CSS file, one JS file. No framework, no build pipeline, no dependencies. Netlify serves the repo root directly (`publish = "."`).

## Key files

| File | Purpose |
|------|---------|
| `index.html` | Six `<section class="screen">` elements, each representing one step of the experience. Only one is `active` at a time. |
| `style.css` | Dark cosmic palette with CSS custom properties. Glass morphism via `backdrop-filter`. Screen transitions use `opacity` + `transform`. |
| `script.js` | All logic. Structured as one IIFE per screen plus shared helpers. |
| `netlify.toml` | Sets `publish = "."` so Netlify serves the repo root. |

## JavaScript structure

- **Configuration blocks** at the top: `QUIZ_QUESTIONS`, `INTRO_LINES`, `CINEMATIC_LINES` — easy to edit without understanding the logic.
- **`initStars()`** — Canvas star field, runs as an IIFE, independent of screen state.
- **`changeScreen(id)`** — Handles CSS class transitions between screens.
- **`screen1()` … `screen4()`** — IIFEs that wire up event listeners for each screen.
- **`startTypewriter()`** — Called when screen 3 becomes active; builds and reveals lines with timed CSS class additions.
- **`loadQuestion(index)`** — Manages quiz state; fades out/in quiz body between questions.
- **`startCinematicSequence()`** — Builds and reveals cinematic lines on screen 5, then shows the YES/NO buttons.
- **`initDodgeButton()`** — Uses `lerp` + `requestAnimationFrame` to smoothly push the NO button away from the cursor. Resistance fades over 12 dodges.
- **`showCelebration()` / `spawnConfetti()`** — Screen 6 confetti burst using dynamically created DOM elements with CSS custom property animation vars.

## Coding conventions

- No TypeScript, no linting config — keep it simple.
- State is minimal: only `currentQuestion` (integer) is module-level mutable state.
- Answer matching goes through `normalize()` — lowercases, trims, collapses whitespace, strips trailing punctuation — before comparing.
- All timing uses `setTimeout` / `requestAnimationFrame`; no external animation libraries.

## Non-obvious decisions

- The NO button starts in normal document flow and only switches to `position: fixed` on first dodge, so its initial rendered position is predictable regardless of screen size.
- `void card.offsetWidth` in `triggerShake` forces a reflow so removing + re-adding `.shake` restarts the CSS animation reliably.
- `{ once: true }` is used on `animationend` listeners throughout to avoid listener accumulation across question loads.
