# Entropy

**An interactive, scroll-driven history of thermodynamics** — seven chapters that
retell how humanity learned to reason about heat, disorder, information and time,
each one wrapped around **live physics you can play with** in the browser.

Inspired by Paul Sen's _Einstein's Fridge: How the Difference Between Hot and Cold
Explains the Universe_.

### ▶ Live demo: **[bpachter.github.io/entropy](https://bpachter.github.io/entropy/)**

---

## What it is

Most explainers show you a diagram. This one hands you the apparatus. Every
chapter pins an interactive simulation beside an original narrative that steps
past it as you scroll — so the physics animates in lock-step with the story.
Drag a macrostate and watch its microstate count explode; open Maxwell's demon's
door and watch the entropy meter dip, then read why the demon still has to pay;
push a black hole's mass down and watch it evaporate.

Each of the seven chapters has its own visual identity, palette, and bespoke
interactives — the layout deliberately never repeats.

| # | Chapter | Figure & idea | You can play with |
| - | --- | --- | --- |
| 1 | **The Motive Power of Fire** | Sadi Carnot & the steam engine | a working Carnot cycle, steam-engine linkage, heat-into-work ledger |
| 2 | **Two Laws** | Joule, Kelvin, Clausius | a paddlewheel that turns falling weight into heat, an absolute-zero thermometer |
| 3 | **Entropy** _(showcase)_ | Boltzmann & Maxwell's demon | a hand-written hard-sphere gas: mixing, `S = k log W` microstate counting, the sorting demon |
| 4 | **Einstein's Atoms** | Brownian motion & the fridge Einstein patented | a Brownian random-walk with the √n law, the Einstein–Szilárd refrigerator |
| 5 | **What Is Life?** | Schrödinger on negentropy | a demonstration of how living order feeds on a flow of low entropy |
| 6 | **Information** | Shannon & Landauer | a live Shannon-entropy meter over a symbol stream, a Szilárd engine, Landauer's erasure cost |
| 7 | **Black Holes and the End of Time** | Bekenstein & Hawking | Bekenstein–Hawking area-entropy and a Hawking-temperature / lifetime calculator |

The narrative is an **original retelling** of public historical and scientific
fact; it does not reproduce the book's text.

## Notable engineering

- **A hand-written physics engine, not a library.** `src/sim/engine.ts` is a
  framework-agnostic hard-sphere gas — uniform-grid broad-phase collisions,
  elastic equal-mass response, coarse-grained entropy metrics — with **zero**
  three.js dependency, so it's reusable and testable on its own. The WebGL layer
  renders it with instanced particles on top.
- **Verified physics.** The interactives compute real quantities: Stokes–Einstein
  diffusion and the √n displacement law, Shannon entropy `H = −Σ p log₂ p`,
  Landauer's `kT ln 2`, Bekenstein–Hawking `S = kA/4ℓ_P²`, Hawking temperature,
  the Carnot bound, and the Szilárd engine.
- **Built for phones.** Every animation loop is gated by an `IntersectionObserver`
  so only the visual actually on screen consumes CPU/GPU; the WebGL frameloop
  drops to `demand` when scrolled away, and touch drags scroll the page instead
  of being trapped by orbit controls. Smooth scroll, cool battery.
- **Seven distinct chapter themes** generated from a single `makeChapterTheme`
  palette factory over MUI v6, driven by a tiny custom hash router (no
  react-router dependency).

## Tech

React 18 · Vite 6 · TypeScript · MUI v6 · @react-three/fiber / three.js ·
framer-motion · SVG + Canvas 2D + WebGL. Deployed as a static site to GitHub
Pages via GitHub Actions.

## Run it

```bash
npm install
npm run dev        # vite dev server (default :5180)
npm run build      # typecheck + production build to dist/
npm run typecheck
```

## Project layout

```
src/
  sim/engine.ts          framework-agnostic hard-sphere gas + entropy metrics
  components/sim/*        R3F rendering layer (instanced particles, vessel, HUD)
  components/scrolly/*    scrollytelling: pinned visual driven by the active beat
  anim/gate.tsx          IntersectionObserver animation gating (mobile perf)
  chapters/*             the seven chapters, each with its own components & theme
  content/chapters.ts    the book arc: titles, beats, and per-chapter metadata
```

## License

[MIT](./LICENSE) — the code is free to learn from and build on. The thermodynamic
history it dramatizes belongs to everyone.
