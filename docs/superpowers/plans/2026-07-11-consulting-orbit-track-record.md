# Consulting Orbit Track Record Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Consulting page’s static bordered track-record card with a borderless angled-orbit “Results” widget (drag to spin, hover/front to clarify, full detail under Results).

**Architecture:** Progressive enhancement — HTML planets render as a stacked list by default; `assets/js/ed-orbit.js` adds `.ed-orbit-ready` and drives absolute elliptical placement via `requestAnimationFrame`. Styles live in `_sass/_editorial.scss`. Script loads only from the editorial layout when `#ed-orbit` is present (guard inside the JS file so a single include is safe).

**Tech Stack:** Jekyll / Liquid, SCSS (al-folio editorial), vanilla ES5-compatible JS (no new npm packages), Node `assert` for pure-helper unit tests.

## Global Constraints

- No new npm/runtime dependencies.
- Match editorial fonts: Source Serif 4 (numbers/titles), system-ui sans (tags/detail), IBM Plex Mono for the orbit `TRACK RECORD` label.
- No orbit rings, no card border/shadow on the orbit stage.
- Metrics content fixed per spec table (Moldex3D / Plasma Wave Surrogates / NeurIPS ML4CFD).
- Radii ~130 / 175 / 210, phases ~0 / 2.094 / 4.189, tilt 36°.
- `prefers-reduced-motion: reduce` → no auto-spin.
- ≤900px viewport → stacked list (no orbit animation).
- Do not change Expertise / How it works / CTA sections.
- Do not load orbit JS behavior on pages without `#ed-orbit`.

## File map

| File | Role |
|------|------|
| `assets/js/ed-orbit.js` | Orbit runtime + exported pure helpers for tests |
| `assets/js/ed-orbit.test.js` | Node assert tests for helpers |
| `_pages/scientific_ai_hpc_consulting.md` | Hero markup swap |
| `_sass/_editorial.scss` | Hero grid + orbit styles; retire trackrecord card look |
| `_layouts/editorial.liquid` | Include `ed-orbit.js` |

---

### Task 1: Pure orbit helpers + unit tests

**Files:**
- Create: `assets/js/ed-orbit.js`
- Create: `assets/js/ed-orbit.test.js`

**Interfaces:**
- Produces:
  - `function edOrbitDepth(phase) → number` — `(Math.sin(phase) + 1) / 2`
  - `function edOrbitScale(depth) → number` — `0.78 + depth * 0.28`
  - `function edOrbitXY(r, phase, tiltRad) → {x, y}` — `{ x: cos(phase)*r, y: sin(phase)*r*sin(tiltRad) }`
  - `function initEdOrbit(root) → void` — full widget (implemented in Task 1 stub that no-ops if missing nodes; completed in same file by end of Task 1)
- Consumes: DOM `#ed-orbit` structure from Task 2 (helpers do not need DOM)

- [ ] **Step 1: Write the failing test file**

Create `assets/js/ed-orbit.test.js`:

```js
'use strict';
const assert = require('assert');
const { edOrbitDepth, edOrbitScale, edOrbitXY } = require('./ed-orbit.js');

assert.ok(Math.abs(edOrbitDepth(Math.PI / 2) - 1) < 1e-9);
assert.ok(Math.abs(edOrbitDepth(-Math.PI / 2) - 0) < 1e-9);
assert.ok(Math.abs(edOrbitScale(0) - 0.78) < 1e-9);
assert.ok(Math.abs(edOrbitScale(1) - 1.06) < 1e-9);

const p = edOrbitXY(100, 0, Math.PI / 4);
assert.ok(Math.abs(p.x - 100) < 1e-9);
assert.ok(Math.abs(p.y - 0) < 1e-9);

const q = edOrbitXY(100, Math.PI / 2, Math.PI / 4);
assert.ok(Math.abs(q.x - 0) < 1e-9);
assert.ok(Math.abs(q.y - 100 * Math.sin(Math.PI / 4)) < 1e-9);

console.log('ed-orbit helpers: ok');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node assets/js/ed-orbit.test.js`  
Expected: FAIL with `Cannot find module './ed-orbit.js'` or missing exports.

- [ ] **Step 3: Implement helpers + CommonJS/browser dual export shell**

Create `assets/js/ed-orbit.js` with at least:

```js
'use strict';

function edOrbitDepth(phase) {
  return (Math.sin(phase) + 1) / 2;
}

function edOrbitScale(depth) {
  return 0.78 + depth * 0.28;
}

function edOrbitXY(r, phase, tiltRad) {
  return {
    x: Math.cos(phase) * r,
    y: Math.sin(phase) * r * Math.sin(tiltRad),
  };
}

function initEdOrbit(root) {
  if (!root) return;
  var detail = root.querySelector('#ed-orbit-detail');
  var planets = Array.prototype.slice.call(root.querySelectorAll('.ed-orbit-planet'));
  if (!detail || planets.length === 0) return;

  var tiltDeg = parseFloat(root.getAttribute('data-tilt') || '36');
  var tiltRad = (tiltDeg * Math.PI) / 180;
  var angle = 0;
  var vel = 0;
  var dragging = false;
  var lastX = 0;
  var hovered = null;
  var reduced =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mobile =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(max-width: 900px)').matches;

  root.classList.add('ed-orbit-ready');

  function setDetail(planet) {
    if (!planet) {
      detail.classList.remove('show');
      detail.textContent = '';
      return;
    }
    detail.innerHTML = planet.getAttribute('data-detail') || '';
    detail.classList.add('show');
  }

  function place() {
    if (mobile) return;
    var front = null;
    var frontDepth = -1;
    for (var i = 0; i < planets.length; i++) {
      var p = planets[i];
      var r = parseFloat(p.getAttribute('data-r') || '0');
      var phase = parseFloat(p.getAttribute('data-phase') || '0') + angle;
      var xy = edOrbitXY(r, phase, tiltRad);
      var depth = edOrbitDepth(phase);
      var scale = edOrbitScale(depth);
      p.style.transform =
        'translate(' + xy.x + 'px, ' + xy.y + 'px) scale(' + scale + ')';
      p.style.zIndex = String(10 + Math.round(depth * 20));
      if (!hovered) {
        if (depth > 0.72) p.classList.add('clear');
        else p.classList.remove('clear');
      }
      if (depth > frontDepth) {
        frontDepth = depth;
        front = p;
      }
    }
    setDetail(hovered || (frontDepth > 0.55 ? front : null));
  }

  for (var j = 0; j < planets.length; j++) {
    (function (p) {
      p.addEventListener('mouseenter', function () {
        hovered = p;
        for (var k = 0; k < planets.length; k++) {
          if (planets[k] === p) planets[k].classList.add('clear');
          else planets[k].classList.remove('clear');
        }
        setDetail(p);
      });
      p.addEventListener('mouseleave', function () {
        hovered = null;
      });
      p.setAttribute('tabindex', '0');
      p.addEventListener('focus', function () {
        hovered = p;
        setDetail(p);
        for (var k = 0; k < planets.length; k++) {
          if (planets[k] === p) planets[k].classList.add('clear');
          else planets[k].classList.remove('clear');
        }
      });
      p.addEventListener('blur', function () {
        hovered = null;
      });
    })(planets[j]);
  }

  root.addEventListener('pointerdown', function (e) {
    if (mobile || reduced) return;
    dragging = true;
    lastX = e.clientX;
    if (root.setPointerCapture) root.setPointerCapture(e.pointerId);
  });
  root.addEventListener('pointermove', function (e) {
    if (!dragging) return;
    var dx = e.clientX - lastX;
    lastX = e.clientX;
    vel = dx * 0.012;
    angle += vel;
    place();
  });
  root.addEventListener('pointerup', function () {
    dragging = false;
  });
  root.addEventListener('pointercancel', function () {
    dragging = false;
  });

  function onResize() {
    mobile =
      window.matchMedia && window.matchMedia('(max-width: 900px)').matches;
    if (mobile) {
      for (var i = 0; i < planets.length; i++) {
        planets[i].style.transform = '';
        planets[i].classList.add('clear');
      }
      setDetail(null);
    } else {
      place();
    }
  }
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', onResize);
  }

  function tick() {
    if (!mobile) {
      if (reduced) {
        place();
      } else if (!dragging) {
        vel *= 0.94;
        angle += 0.0032 + vel;
        place();
      }
    }
    if (typeof requestAnimationFrame !== 'undefined') {
      requestAnimationFrame(tick);
    }
  }

  onResize();
  if (!mobile && reduced) {
    // Static fan: freeze angle at 0 after first place
    place();
  }
  tick();
}

function bootEdOrbit() {
  var root = document.getElementById('ed-orbit');
  if (root) initEdOrbit(root);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    edOrbitDepth: edOrbitDepth,
    edOrbitScale: edOrbitScale,
    edOrbitXY: edOrbitXY,
    initEdOrbit: initEdOrbit,
  };
} else if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootEdOrbit);
  } else {
    bootEdOrbit();
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node assets/js/ed-orbit.test.js`  
Expected: `ed-orbit helpers: ok`

- [ ] **Step 5: Commit**

```bash
git add assets/js/ed-orbit.js assets/js/ed-orbit.test.js
git commit -m "$(cat <<'EOF'
Add orbit math helpers and Consulting orbit runtime.

EOF
)"
```

---

### Task 2: Consulting hero markup

**Files:**
- Modify: `_pages/scientific_ai_hpc_consulting.md` (hero aside only, lines ~17–33)

**Interfaces:**
- Consumes: none
- Produces: DOM contract for Task 1 — `#ed-orbit`, `#ed-orbit-detail`, `.ed-orbit-planet` with `data-r`, `data-phase`, `data-detail`

- [ ] **Step 1: Replace the track-record aside**

In `_pages/scientific_ai_hpc_consulting.md`, replace the entire `<aside class="ed-hero-aside">…</aside>` block with:

```html
<aside class="ed-hero-aside">
  <div class="ed-orbit" id="ed-orbit" data-tilt="36" aria-label="Track record">
    <div class="ed-orbit-center">
      <span class="ed-label">TRACK RECORD</span>
      <div class="ed-orbit-title">Results</div>
      <div class="ed-orbit-detail" id="ed-orbit-detail" aria-live="polite"></div>
    </div>
    <div
      class="ed-orbit-planet"
      data-r="130"
      data-phase="0"
      data-detail="Simulation speedup at Moldex3D — hours to seconds, &lt;3% error"
    >
      <div class="ed-orbit-num">~2000×</div>
      <div class="ed-orbit-tag">Moldex3D</div>
      <div class="ed-orbit-fallback">Simulation speedup at Moldex3D — hours to seconds, &lt;3% error</div>
    </div>
    <div
      class="ed-orbit-planet"
      data-r="175"
      data-phase="2.094"
      data-detail="Faster lower-hybrid-wave inference with a neural-operator surrogate"
    >
      <div class="ed-orbit-num">281.8×</div>
      <div class="ed-orbit-tag">Plasma Wave Surrogates</div>
      <div class="ed-orbit-fallback">Faster lower-hybrid-wave inference with a neural-operator surrogate</div>
    </div>
    <div
      class="ed-orbit-planet"
      data-r="210"
      data-phase="4.189"
      data-detail="NeurIPS 2024 ML4CFD Competition — top 1% of 254 teams"
    >
      <div class="ed-orbit-num">3rd place</div>
      <div class="ed-orbit-tag">NeurIPS ML4CFD</div>
      <div class="ed-orbit-fallback">NeurIPS 2024 ML4CFD Competition — top 1% of 254 teams</div>
    </div>
  </div>
</aside>
```

Leave the left hero copy (kicker / h1 / lede) unchanged.

- [ ] **Step 2: Sanity-check the page still builds**

Run: `bundle exec jekyll build 2>&1 | tail -30`  
Expected: build succeeds (or same pre-existing warnings only); no Liquid errors on Consulting.

- [ ] **Step 3: Commit**

```bash
git add _pages/scientific_ai_hpc_consulting.md
git commit -m "$(cat <<'EOF'
Swap Consulting track record markup for orbit widget.

EOF
)"
```

---

### Task 3: Editorial SCSS for orbit + wider hero text

**Files:**
- Modify: `_sass/_editorial.scss` (`.ed-hero-grid` block ~647–704, plus responsive ~1023–1028)

**Interfaces:**
- Consumes: class names from Task 2
- Produces: visual contract — borderless stage; stacked fallback without `.ed-orbit-ready`; absolute planets with `.ed-orbit-ready`

- [ ] **Step 1: Update hero grid for wider text column**

Replace the `.ed-hero-grid { … }` opening rules with:

```scss
.ed-hero-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(340px, 1fr);
  gap: 40px;
  align-items: center;
  padding: 72px $ed-gutter 48px;
  max-width: 1240px;

  .ed-kicker {
    margin-bottom: 20px;
  }
  h1.ed-h1 {
    margin-bottom: 24px;
  }
  .ed-lede {
    font-size: 21px;
    line-height: 1.6;
    color: var(--ed-body);
    margin: 0;
    max-width: 560px;
  }
}
```

- [ ] **Step 2: Replace `.ed-trackrecord` / `.ed-stat` with orbit styles**

Remove (or leave unused) `.ed-trackrecord` and `.ed-stat` blocks. Add:

```scss
.ed-orbit {
  position: relative;
  width: 100%;
  min-height: 280px;
  background: transparent;
  border: none;
  box-shadow: none;
  user-select: none;
  touch-action: none;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
}

.ed-orbit-center {
  text-align: center;
  margin-bottom: 20px;

  .ed-label {
    display: block;
    font-family: $ed-mono;
    margin-bottom: 6px;
  }
}

.ed-orbit-title {
  font-family: $ed-serif;
  font-size: 22px;
  font-weight: 600;
  color: var(--ed-text);
  margin-bottom: 10px;
}

.ed-orbit-detail {
  font-family: $ed-sans;
  font-size: 13px;
  line-height: 1.45;
  color: var(--ed-secondary);
  min-height: 3.9em;
  max-width: 240px;
  margin: 0 auto;
  opacity: 0;
  transition: opacity 0.25s ease;

  &.show {
    opacity: 1;
  }
}

.ed-orbit-planet {
  text-align: center;
  padding: 12px 0;
  border-bottom: 1px solid var(--ed-border);

  &:last-child {
    border-bottom: none;
  }
}

.ed-orbit-num {
  font-family: $ed-serif;
  font-size: 28px;
  font-weight: 600;
  line-height: 1;
  color: var(--ed-accent);
}

.ed-orbit-tag {
  font-family: $ed-sans;
  font-size: 11.5px;
  line-height: 1.3;
  color: var(--ed-secondary);
  margin-top: 6px;
}

.ed-orbit-fallback {
  font-family: $ed-sans;
  font-size: 13px;
  line-height: 1.45;
  color: var(--ed-secondary);
  margin-top: 6px;
}

/* JS-enhanced orbit */
.ed-orbit.ed-orbit-ready {
  height: 460px;
  min-height: 460px;
  overflow: visible;

  .ed-orbit-center {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
    pointer-events: none;
    width: 220px;
    margin-bottom: 0;
  }

  .ed-orbit-planet {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 140px;
    margin-left: -70px;
    margin-top: -24px;
    padding: 0;
    border-bottom: none;
    opacity: 0.32;
    filter: blur(0.7px);
    transition: opacity 0.25s ease, filter 0.25s ease;
    z-index: 3;

    &.clear {
      opacity: 1;
      filter: none;
      z-index: 5;
    }
  }

  .ed-orbit-fallback {
    display: none;
  }
}
```

- [ ] **Step 3: Mobile — keep stacked list even if JS added ready**

Inside the existing `@media (max-width: 900px)` block, add:

```scss
  .ed-orbit.ed-orbit-ready {
    height: auto;
    min-height: 0;
    cursor: default;

    .ed-orbit-center {
      position: static;
      transform: none;
      width: auto;
      margin-bottom: 16px;
    }
    .ed-orbit-detail {
      display: none;
    }
    .ed-orbit-planet {
      position: static;
      width: auto;
      margin: 0;
      padding: 12px 0;
      border-bottom: 1px solid var(--ed-border);
      opacity: 1;
      filter: none;
      transform: none !important;
    }
    .ed-orbit-fallback {
      display: block;
    }
  }
```

- [ ] **Step 4: Build CSS and spot-check**

Run: `bundle exec jekyll build 2>&1 | tail -20`  
Expected: success. Open `/scientific-ai-hpc-consulting/` locally — without JS you should see stacked metrics; with JS (after Task 4) orbit.

- [ ] **Step 5: Commit**

```bash
git add _sass/_editorial.scss
git commit -m "$(cat <<'EOF'
Style Consulting orbit track record and widen hero text.

EOF
)"
```

---

### Task 4: Wire script into editorial layout

**Files:**
- Modify: `_layouts/editorial.liquid` (scripts section near end)

**Interfaces:**
- Consumes: `bootEdOrbit` / `initEdOrbit` from Task 1
- Produces: script tag on all editorial pages (safe no-op when `#ed-orbit` absent)

- [ ] **Step 1: Add script include**

After the existing shortcut-key script line in `_layouts/editorial.liquid`, add:

```liquid
<script src="{{ '/assets/js/ed-orbit.js' | relative_url | bust_file_cache }}"></script>
```

If `bust_file_cache` is unavailable in this layout context, use:

```liquid
<script src="{{ '/assets/js/ed-orbit.js' | relative_url }}"></script>
```

(Match whatever pattern `shortcut-key.js` already uses on the next line above.)

- [ ] **Step 2: Manual verification checklist**

Run local server: `bundle exec jekyll serve`  
Open `http://127.0.0.1:4000/scientific-ai-hpc-consulting/`

Verify:
1. Lede text is wider than before (more of the left column).
2. No card border around track record.
3. Three chips orbit; no ring lines.
4. Center shows `TRACK RECORD` / `Results` / detail for front chip.
5. Hover clears a chip and updates detail.
6. Drag left/right spins faster, then coasts.
7. Tags: Moldex3D / Plasma Wave Surrogates / NeurIPS ML4CFD.
8. About page still loads; no console errors from orbit boot.
9. Narrow viewport (≤900px): stacked list with fallback text visible.
10. (Optional) OS reduced-motion: no continuous spin.

- [ ] **Step 3: Re-run unit tests**

Run: `node assets/js/ed-orbit.test.js`  
Expected: `ed-orbit helpers: ok`

- [ ] **Step 4: Commit**

```bash
git add _layouts/editorial.liquid
git commit -m "$(cat <<'EOF'
Load Consulting orbit script from editorial layout.

EOF
)"
```

---

## Spec coverage (self-review)

| Spec requirement | Task |
|------------------|------|
| Angled POV orbit, no rings/edge | 2, 3 |
| Results center + short tags + full detail | 2, 1 |
| Site fonts / tokens | 3 |
| Wider lede / grid share | 3 |
| Drag + hover clear | 1 |
| Radii / phases / tilt | 2 + 1 |
| Reduced motion | 1 |
| Mobile stacked fallback | 1, 3 |
| No-JS stacked list | 2, 3 (fallback text) |
| Script only meaningful on Consulting | 1 guard + 4 |
| No WebGL / no extra deps | 1 |
| Leave other Consulting sections alone | 2 scope |

**Placeholder scan:** none.  
**Type consistency:** `edOrbitDepth` / `edOrbitScale` / `edOrbitXY` / `initEdOrbit` / `#ed-orbit` / `.ed-orbit-planet` / `data-r|phase|detail` used consistently across tasks.
