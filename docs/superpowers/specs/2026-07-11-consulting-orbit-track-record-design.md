# Consulting Track Record Orbit — Design

**Date:** 2026-07-11  
**Status:** Approved (visual companion iterations A→B v7)  
**Scope:** Replace the static Consulting hero track-record panel with an interactive angled-orbit “Results” widget. Keep the rest of the Consulting page unchanged.

## Goal

Make the Consulting hero track record more compact and present (B+C), while matching the editorial visual language. Metrics revolve in an angled POV; the user can drag to spin; the focused metric becomes clear and shows its full explanation.

## Approved visual direction

- **Concept:** Angled POV solar system (option B), not flat top-down or single-ring center-focus.
- **No orbit rings / no panel edge:** Metrics float on the page background — no card border, shadow, or elliptical guide lines.
- **Center label:** `TRACK RECORD` (mono kicker) + `Results` (serif title).
- **Fonts:** Same as editorial site — Source Serif 4 (numbers/titles), system-ui sans (tags/detail), IBM Plex Mono (TRACK RECORD label).
- **Background:** Same as page (`--ed-bg` / `#fbfaf7` light; respect dark theme tokens).
- **Hero text:** Wider Consulting lede (`max-width` ~560px) and a grid that gives the left column more share than the current 1fr / 320px aside.

### Metrics (content)

| Number | Short tag (orbits) | Full detail (center, when focused) |
|--------|--------------------|------------------------------------|
| `~2000×` | Moldex3D | Simulation speedup at Moldex3D — hours to seconds, &lt;3% error |
| `281.8×` | Plasma Wave Surrogates | Faster lower-hybrid-wave inference with a neural-operator surrogate |
| `3rd place` | NeurIPS ML4CFD | NeurIPS 2024 ML4CFD Competition — top 1% of 254 teams |

## Interaction

1. **Idle:** Three chips orbit slowly on distinct radii (~130 / 175 / 210 CSS px at desktop), phased ~120° apart, with ~36° tilt so the path reads as perspective.
2. **Depth cue:** Soft blur + lower opacity when back; sharp + full opacity when near front or hovered.
3. **Hover / front:** Focused chip clears; full explanation appears under `Results` (not on the orbiting chip — keeps orbit uncluttered).
4. **Drag:** Pointer drag left/right on the stage adds angular velocity; release coasts back to idle speed.
5. **No grasp/pin required for v1** beyond hover-clear + drag-spin (approved companion behavior).

## Architecture

### Markup (`_pages/scientific_ai_hpc_consulting.md`)

Replace `.ed-trackrecord` static list with:

```html
<aside class="ed-hero-aside">
  <div class="ed-orbit" id="ed-orbit" data-tilt="36" aria-label="Track record">
    <div class="ed-orbit-center">
      <span class="ed-label">TRACK RECORD</span>
      <div class="ed-orbit-title">Results</div>
      <div class="ed-orbit-detail" id="ed-orbit-detail" aria-live="polite"></div>
    </div>
    <!-- three .ed-orbit-planet nodes with data-r, data-phase, data-detail -->
  </div>
</aside>
```

Widen `.ed-hero-main .ed-lede` via CSS (not copy change).

### Styles (`_sass/_editorial.scss`)

- Update `.ed-hero-grid` column ratio toward ~1.55fr / 1fr; raise lede `max-width` to ~560px.
- Replace / supersede bordered `.ed-trackrecord` card styles with borderless `.ed-orbit*` rules.
- Dark theme: use existing `--ed-*` tokens so numbers/tags remain readable on `--ed-bg`.
- Mobile: if viewport is narrow, fall back to a compact stacked list (same content, no orbit) via media query — avoid unusable tiny orbits.

### Script (`assets/js/ed-orbit.js`)

- Vanilla JS, no new dependencies.
- Init only when `#ed-orbit` exists (Consulting page).
- `requestAnimationFrame` loop for placement; pointer events for drag.
- Respect `prefers-reduced-motion: reduce` → static fan layout (no auto-spin); hover still clarifies detail.

### Wiring

- Load `ed-orbit.js` from the editorial layout or Consulting page only (prefer layout conditional / footer include gated on page, or a small script tag at bottom of the Consulting markdown). Prefer a dedicated include or page-end script to avoid loading on About/Projects.

## Accessibility & fallbacks

- Stage has `aria-label="Track record"`.
- Detail region uses `aria-live="polite"`.
- Keyboard: Tab to each planet; Enter/Space focuses detail (optional polish if cheap).
- Reduced motion: no continuous rotation.
- No-JS: show the three metrics as a simple stacked list (noscript or CSS-visible static markup duplicated lightly — prefer progressive enhancement: static HTML list inside `.ed-orbit` that JS transforms, or a CSS-only stacked fallback when JS adds `.ed-orbit-ready`).

**Chosen approach:** Render the three planets as static HTML; CSS without JS can display them stacked under Results. JS adds `.ed-orbit-ready` and switches to absolute orbit positioning.

## Out of scope

- Repo-wide cleanup (blog/news/repositories removal) — separate earlier thread; not part of this change.
- Changing Expertise / Example Problems / How it works / CTA sections.
- 3D WebGL / Three.js — keep 2D CSS transforms only.

## Success criteria

- Consulting hero matches approved companion v7: borderless angled orbit, site fonts, short tags + center detail, wider lede.
- Drag + hover work on desktop; usable fallback on mobile / reduced motion / no-JS.
- No new npm packages; no change to non-Consulting pages’ behavior.
