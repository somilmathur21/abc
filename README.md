# Website

A personal, cinematic single-page experience built with pure vanilla HTML, CSS, and JavaScript. No frameworks, no build step.

## What it does

Guides the visitor through six interactive screens:

1. **Welcome** — "Hey, is that you?" with a cheeky No button
2. **Identity check** — Shows a photo to confirm it's really her
3. **Typewriter intro** — Animated lines reveal the surprise
4. **Quiz** — Four personalised questions only she would know
5. **Cinematic reveal** — Dramatic lines culminating in "Will you go on a date with me?"  
6. **Celebration** — Confetti burst and a heartfelt message

## Key technologies

- Vanilla JS (ES6+), no dependencies
- Canvas-based animated star field
- CSS glass morphism with `backdrop-filter`
- Smooth screen transitions (opacity + transform)
- Dodge button (the NO button runs away on hover using `lerp` + `requestAnimationFrame`)
- Confetti particle system

## Running locally

Open `index.html` directly in a browser — no server needed. Or use any static server:

```bash
npx serve .
# then visit http://localhost:3000
```

## Customising

All personalisation lives at the top of `script.js`:

| What | Where |
|------|-------|
| Quiz questions & accepted answers | `QUIZ_QUESTIONS` array |
| Typewriter intro lines | `INTRO_LINES` array |
| Cinematic reveal lines | `CINEMATIC_LINES` array |
| Her photo | `src` attribute on `<img class="identity-photo">` in `index.html` |
| Per-question images | Add `image: "yourfile.jpg"` to a question object |
