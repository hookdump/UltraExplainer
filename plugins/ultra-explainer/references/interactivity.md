# Interactivity reference

The interactivity layer of UltraExplainer v2: one shared state→render engine plus a handful of
self-initializing primitives in `ux.js`. Read this when the page needs the reader to *do* something —
change an input, step through a sequence, toggle a scenario — not just read. Every attribute below is
the literal hook `ux.js` looks for; treat the names as exact.

---

## 0. The earn-it rule (read before adding ANY widget)

Interactivity is expensive: it costs reader attention, screen space, and your credibility if the
numbers are fake. It must earn its keep. In representation routing, after you've decided *what* to
show, ask the **MANIPULABILITY question**:

> **Is there a relationship the reader should FEEL by changing an input?**

- **Yes** → a parameter-model (`data-playground`), a `scenario` toggle, or a `stepper`. The reader
  drags `n` and watches cost bend; flips staging→prod and watches the graph rewire.
- **No** → static components. A KPI, a sentence, a diff. **Never manufacture a slider for a
  one-sentence answer.** "p99 is 8ms" is a `ux-kpi`, not a playground. A slider whose output the
  reader can predict before touching it is noise.

Heuristics: one input that moves one number the reader already expects = cut it. A monotonic curve
the reader can guess (more cache → fewer misses) only earns a widget if the *shape* (knee, cliff,
diminishing returns) is the point. Stepper earns its place only when order matters and the steps
differ; otherwise it's a list.

### INTERACTION-AS-EVIDENCE (non-negotiable)

Every interactive control is a truth claim. Honor it:

- Every slider's `min`/`max`/`step` and `value` (default) must be anchored to a real bound — a
  `const` in the code, a config limit, a measured range. Don't let the reader drag `n` to 9000 if
  the system caps at 4096.
- The input→output function (your `data-derive` body) must come from a real formula, a fitted curve,
  or measured points — not a number that "feels right."
- If you cannot anchor it, **stamp it**: a visible `ux-label ux-label--meta` reading
  `illustrative model — not measured` next to the control. An honest toy beats a dishonest
  instrument. Never imply precision you don't have.

---

## 1. The shared state→render engine — `initPlayground` / `[data-playground]`

ONE mental model: **a single `state` object → a pure `derive(state)` function → declarative
bindings that paint the result.** You never write event handlers; you declare inputs and outputs and
`ux.js` wires them.

How it runs (from `initPlayground`):
1. `.ux-state` (a `<script type="application/json">`) seeds `state` once.
2. `data-derive="fnName"` names a `window.fnName(state)` returning an object of derived values.
   Render merges `{...state, ...derive(state)}` so bindings can read **both** raw params and derived
   keys. If `data-derive` is absent/unknown, derive is identity (raw state only).
3. Any `[data-param]` input (`range`/`number` are coerced with `+`, everything else stays a string)
   writes `state[param]` on the `input` event, then re-renders. It also fires once on init.
4. `[data-set]` buttons `Object.assign` parsed JSON into state, push values back into matching
   `[data-param]` inputs, and re-render — use them for presets/reset.

### Bindings (exact)

| Attribute | Effect |
|---|---|
| `data-show="key"` | sets `el.textContent` to the (formatted) value of `key` from merged state |
| `data-out="key"` | mirrors a **param**'s current value (set on the input element's twin output); `ux.js` writes it when that `data-param` changes |
| `data-fill="key"` | sets CSS custom prop `--v` to value clamped 0..1 (for bar/meter fills via CSS `width:calc(var(--v)*100%)` etc.) |
| `data-fill="key" data-fill-h` | additionally sets inline `height: <v*100>%` |
| `data-fill="key" data-fill-w` | additionally sets inline `width: <v*100>%` |
| `data-fmt="…"` | formatter applied by `data-show` and `data-out` |

Formatters (`FMT`): `int` (rounded, locale commas) · `pct` (×100, 0 dp, `%`) · `pct1` (×100, 1 dp,
`%`) · `ms` (rounded + `ms`) · `x` (1 dp + `×`) · `money` (`$` + 2 dp, locale) · `raw` (String()).
Unknown/absent `data-fmt` falls back to `raw`.

Notes: `data-show` keys missing from merged state are skipped (no crash, no paint). `data-fill`
values that are `null`/absent are skipped. `--v` is always clamped to [0,1] — feed it a ratio, not a
percent.

### Complete, copy-pasteable playground

```html
<div class="ux-panel" data-playground data-derive="cacheModel" data-scenario-root>
  <!-- seed: anchored to real config (cache caps at 4096 entries) -->
  <script type="application/json" class="ux-state">{"rps":1200,"size":2048}<\/script>

  <div class="ux-control">
    <label>Requests / sec
      <input type="range" data-param="rps" min="100" max="5000" step="100" class="ux-slider">
    </label>
    <output data-out="rps" data-fmt="int">1,200</output>
  </div>

  <div class="ux-control">
    <label>Cache entries
      <input type="range" data-param="size" min="256" max="4096" step="256" class="ux-slider">
    </label>
    <output data-out="size" data-fmt="int">2,048</output>
  </div>

  <div class="ux-kpis">
    <div class="ux-kpi"><div class="ux-kpi__val" data-show="hit" data-fmt="pct1">—</div>
      <div class="ux-kpi__label">Hit rate</div></div>
    <div class="ux-kpi"><div class="ux-kpi__val" data-show="p99" data-fmt="ms">—</div>
      <div class="ux-kpi__label">p99 read</div></div>
    <div class="ux-kpi"><div class="ux-kpi__val" data-show="cost" data-fmt="money">—</div>
      <div class="ux-kpi__label">$/day</div></div>
  </div>

  <!-- a meter: CSS reads --v -->
  <div class="ux-bar"><div class="ux-bar__v" data-fill="load" data-fill-w></div></div>

  <div class="ux-toolbar">
    <button class="ux-control" data-set='{"rps":1200,"size":2048}'>Reset</button>
    <button class="ux-control" data-set='{"rps":5000,"size":256}'>Spike + small cache</button>
  </div>
  <span class="ux-label ux-label--meta">illustrative model — not measured</span>
</div>

<script>
  // window.<name> matching data-derive. Pure: state in, derived object out.
  window.cacheModel = function (s) {
    var hit  = 1 - Math.exp(-s.size / 1400);        // diminishing-returns curve
    var p99  = 4 + (1 - hit) * 90;                   // misses dominate tail
    var cost = s.rps * 86400 / 1e6 * 0.40;           // $/day at $0.40 / M reads
    return { hit: hit, p99: p99, cost: cost, load: s.rps / 5000 };
  };
<\/script>
```

Always write `<\/script>` for any literal closing tag inside an inlined `<script>` so it doesn't
terminate the block early.

---

## 2. Scenario segmented-control — `initScenarios` / `.ux-seg[data-scenario-ctl]`

Flips a `data-scenario` attribute on a target element; **CSS** keys off that attribute to restyle /
re-reveal. The JS does only three things: set `aria-pressed` on the clicked button, write
`target.dataset.scenario = btn.dataset.scenario`, and call `window.Ultra.redrawGraphs()` (so any
connector graph re-routes after the layout changes).

Target resolution: `data-target="#sel"` → that element; else nearest `[data-scenario-root]` ancestor;
else `<body>`.

```html
<div class="ux-seg" data-scenario-ctl data-target="#flow" role="group" aria-label="Environment">
  <button data-scenario="staging" aria-pressed="true">Staging</button>
  <button data-scenario="prod" aria-pressed="false">Production</button>
</div>

<div id="flow" data-scenario="staging">
  <!-- you supply the CSS that reacts: -->
  <!-- [data-scenario="prod"] .replica { display:flex } -->
  <div class="ux-graph">…</div>
</div>
```

`[data-step-show]` is **not** a scenario hook — it belongs to the stepper (§4). To show/hide on
scenario change, write attribute-selector CSS against `[data-scenario="…"]`. Reflect the active
state into `aria-pressed`; seed one button `aria-pressed="true"` to match the initial
`data-scenario`.

---

## 3. Step-through player — `[data-stepper]` + `.ux-steps`

Walks a fixed sequence: caption, optional code-line highlight, optional per-step reveal. Driven by
prev/next/reset buttons and Left/Right arrow keys (arrows only fire when focus is inside the stepper
or on `<body>`).

`.ux-steps` is a `<script type="application/json">` whose array shape — **as the code actually reads
it** — is:

```json
[
  {"cap": "Request arrives", "lines": [1,2]},
  {"cap": "Cache miss → DB", "lines": [4,5,6]},
  {"cap": "Backfill + respond", "lines": [8]}
]
```

- `cap` → written as **innerHTML** into `[data-step-cap]`.
- `lines` → 1-indexed line numbers; toggles `.is-active` on the matching `.l` elements inside the
  step's code block. (The brief's `{cap,code?,show?}` is loose — the field is `lines`, not `show`.)
- A `scenario` field is parsed but currently a **no-op** (see GAPS).

Code block: `host.dataset.code` (a selector) → that element, else the first `.ux-codeblock` inside
the stepper. Highlightable lines must be `.l` elements, in order.

Per-step reveal: `[data-step-show="N"]` elements are `hidden` unless the current index === N
(0-based).

`[data-step-n]` gets `"<i+1> / <total>"`.

```html
<div data-stepper>
  <pre class="ux-codeblock"><code><span class="l">function read(key){</span>
<span class="l">  const v = cache.get(key);</span>
<span class="l">  if (v) return v;</span>
<span class="l">  const row = db.get(key);</span>
<span class="l">  cache.set(key, row);</span>
<span class="l">  return row;</span>
<span class="l">}</span></code></pre>

  <script type="application/json" class="ux-steps">
    [{"cap":"Look in cache first","lines":[2]},
     {"cap":"Hit → return immediately","lines":[3]},
     {"cap":"Miss → hit the DB, then backfill","lines":[4,5]},
     {"cap":"Return the row","lines":[6]}]
  <\/script>

  <p class="ux-step-cap" data-step-cap></p>
  <p data-step-show="2" hidden>Note: backfill is write-through here.</p>

  <div class="ux-toolbar">
    <button class="ux-control" data-step="prev" aria-label="Previous step">‹ Prev</button>
    <span data-step-n aria-live="polite"></span>
    <button class="ux-control" data-step="next" aria-label="Next step">Next ›</button>
    <button class="ux-control" data-step="reset">Reset</button>
  </div>
</div>
```

Style `.l.is-active` (e.g. left accent bar + brightened text) so the active line reads clearly.

---

## 4. Sortable + filtered table — `initSortable` + `initFilters`

Two independent behaviors on the same `.ux-table`.

**Sort:** any `th[data-sort]` becomes a sort toggle. Clicking sets `aria-sort` ascending↔descending
on that header (and clears the others), sorts `tBodies[0]` rows by that column's text. Add
`data-sort="num"` for numeric columns — it strips everything but `0-9.-` before comparing, so `97%`,
`$1,200`, `8ms` all sort correctly. Default (no `="num"`) is `localeCompare`.

**Filter:** an `input[data-ux-filter]` live-filters `tbody tr` by substring (case-insensitive, whole
row text). The value of `data-ux-filter` is a **selector for the target table**; if empty, it targets
the first `.ux-table` in the input's `<section>`. Matching rows keep showing; misses get
`.ux-row-hidden`. `data-ux-count="#sel"` points at an element that receives `"<shown> / <total>"`.

```html
<input class="ux-input" type="search" placeholder="Filter prefixes…"
       data-ux-filter="#keys" data-ux-count="#keys-count" aria-label="Filter rows">
<span id="keys-count" class="ux-label ux-label--meta" aria-live="polite"></span>

<div class="ux-table-wrap"><div class="ux-table-scroll">
<table class="ux-table" id="keys">
  <thead><tr>
    <th data-sort>Prefix</th>
    <th data-sort="num" class="num">Hit</th>
    <th data-sort="num" class="num">Evictions/m</th>
  </tr></thead>
  <tbody>
    <tr><td><code>user:</code></td><td class="num">97%</td><td class="num">12</td></tr>
    <tr><td><code>feed:</code></td><td class="num">88%</td><td class="num">140</td></tr>
    <tr><td><code>search:</code></td><td class="num">62%</td><td class="num">410</td></tr>
  </tbody>
</table>
</div></div>
```

Sorting only auto-wires for tables that already contain a `th[data-sort]` (see `boot()`).

---

## 5. Hover/focus-to-trace connector graph — `initGraph` / `.ux-graph`

A node-edge graph where you place nodes with CSS (grid/flex) and `ux.js` draws bezier SVG arrows
between them by id, re-routing on resize / font load / scenario change.

Structure:
- `.ux-graph` host containing `svg.ux-graph__edges` (empty; the engine fills it) and a
  `.ux-graph__layer` holding the nodes.
- Each node is `.ux-node` (or any `[data-node]`) with a **unique `id`**. `[data-accent="…"]` tints it.
- `script.ux-edges` = JSON array of `{from, to, color, dashed}` using node ids.

`color` becomes the class `ux-epath--<color>`. The example body uses semantic names
(`accent`, `accent2`, `good`, `edge`); the source comment also lists `azure|cyan|green|violet`.
Use the semantic set (`accent`/`accent2`/`good`/`edge`) — those are the tokens themes fill. `dashed:true`
draws a dashed stroke. `edge` is the un-glowed default; any other color also gets `.is-glow` (a no-op
unless Luminous fills the glow token).

Arrows carry an arrowhead marker; anchor sides are chosen automatically (horizontal vs vertical) from
node centers.

**Trace:** hovering a `.ux-node` dims non-adjacent nodes (`.is-dim`), marks the hovered node
`.is-hot`, and fades non-incident edges (`.is-faded`); mouseleave clears it. (This is mouse-only — see
a11y/GAPS for focus.)

```html
<div class="ux-graph">
  <svg class="ux-graph__edges" aria-hidden="true"></svg>
  <div class="ux-graph__layer" style="display:grid;grid-template-columns:repeat(3,1fr);gap:2rem">
    <div class="ux-node" id="g-in"  data-accent="accent"><div class="ux-node__title">Request</div></div>
    <div class="ux-node" id="g-mid" data-accent="accent2"><div class="ux-node__title">Cache</div></div>
    <div class="ux-node" id="g-out" data-accent="good"><div class="ux-node__title">Response</div></div>
  </div>
  <script type="application/json" class="ux-edges">
    [{"from":"g-in","to":"g-mid","color":"accent"},
     {"from":"g-mid","to":"g-out","color":"good"},
     {"from":"g-mid","to":"g-out","color":"edge","dashed":true}]
  <\/script>
</div>
```

If you build a graph *after* load (e.g. injected by a scenario), call
`window.Ultra.initGraph(hostEl)`; after any layout change that moves nodes, call
`window.Ultra.redrawGraphs()` (scenario buttons already do this).

---

## 6. Tabs — `initTabs` / `.ux-tabbar`

`.ux-tab[data-tab="x"]` buttons toggle `aria-selected`; matching `.ux-tabpanel[data-panel="x"]`
becomes visible (`hidden` toggled). Panels are scoped to the nearest `[data-tabs]` ancestor, else the
tabbar's parent — wrap a tab group in `[data-tabs]` when several coexist on a page.

```html
<div data-tabs>
  <div class="ux-tabbar" role="tablist">
    <button class="ux-tab" data-tab="json" role="tab" aria-selected="true">JSON</button>
    <button class="ux-tab" data-tab="curl" role="tab" aria-selected="false">cURL</button>
  </div>
  <div class="ux-tabpanel" data-panel="json" role="tabpanel">…</div>
  <div class="ux-tabpanel" data-panel="curl" role="tabpanel" hidden>…</div>
</div>
```

Seed initial state in markup: one tab `aria-selected="true"`, all non-default panels `hidden`.

---

## 7. Progressive disclosure — `.ux-details`

No JS in `ux.js`. Use the native `<details>`/`<summary>` element with class `ux-details` (and
`ux-details__body` on the inner content) — it's keyboard-accessible and degrades without JS for free.

```html
<details class="ux-details">
  <summary>Why staleWhileRevalidate?</summary>
  <div class="ux-details__body">Serves the stale value instantly, refreshes in the background…</div>
</details>
```

---

## 8. Theme + glow controls — `buildSwitcher`

On boot, `buildSwitcher()` appends a `.ux-fxbar` with a **day/night theme button**, and — **only when
`data-theme-preset="luminous"`** — a **glow/flat button**. It's suppressed if the page already ships a
`.ux-fxbar`, or if `<html data-no-switcher>` is set.

- Theme click flips `data-theme` light↔dark, persists to `localStorage["ux-theme-<preset>"]`, and
  calls `redrawGraphs()`.
- Glow click flips `data-fx` glow↔flat, persists to `localStorage["ux-fx"]`. Glow is the only thing
  the `--fx-*` tokens light up, and only Luminous fills them — outside Luminous the toggle is
  meaningless (hence it's hidden).

Add `data-no-switcher` when the page is a fixed-theme artifact (e.g. print handout) or supplies its
own controls. The mandatory FOUC resolver in `<head>` (top of `ux.js`) must run before the
stylesheet so the saved theme applies before first paint.

---

## 9. Scroll-spy nav — `initNav` / `.ux-nav`

A single `.ux-nav` containing `a[href="#id"]` links. An IntersectionObserver watches each linked
section; the one in the reading band (`rootMargin: -15% 0 -75% 0`) gets its link marked `.is-active`
(and scrolled into view if the nav itself scrolls horizontally). Clicks smooth-scroll to the target.

```html
<nav class="ux-nav" aria-label="Sections">
  <a href="#overview">Overview</a>
  <a href="#readpath">Read path</a>
  <a href="#tuning">Tuning</a>
</nav>
…
<section id="overview" class="ux-haslayout">…</section>
<section id="readpath" class="ux-haslayout">…</section>
```

The targets are matched by the link's `#id` to elements with that id; mark spied sections
`.ux-haslayout` (the contract's hook for scroll-spy layout). Links degrade to plain anchor jumps
without JS.

---

## 10. Particle field — `initField` / `.ux-field` (Luminous only)

`initField` seeds nebula motes into `.ux-field canvas`. It is a **no-op when `data-fx="flat"`** and
**static (no animation loop) under `prefers-reduced-motion`**. Density scales with canvas area
(capped at 30 motes). Decorative only — `aria-hidden`, behind content.

```html
<div class="ux-field" aria-hidden="true"><canvas></canvas></div>
```

Use only on Luminous wow-factor pages, behind a hero. Never put information in it.

---

## a11y checklist (apply to every widget you add)

- **Keyboard reachable.** All controls are real `<button>`/`<input>`/`<a>`/`<summary>` — keep them
  so. Stepper arrow keys work only when focus is inside the stepper; ensure its buttons are tabbable.
- **Reduced motion.** `initField` already goes static and you must not add autoplay/transition that
  ignores `prefers-reduced-motion`. The particle field and any decorative animation must freeze.
- **Live regions.** Mark dynamic readouts `aria-live="polite"` — the playground KPI values, the
  stepper's `[data-step-n]`, the filter's `[data-ux-count]` — so screen readers announce changes.
- **Degrade without JS.** `<details>`, tabs (seed default panel visible, others `hidden`), nav
  anchors, and tables all still work or read sensibly with JS off. The playground/stepper/graph do
  not render without JS — don't put load-bearing facts *only* inside them; mirror the headline number
  in static prose or a `ux-kpi`.
- **State in markup, not just JS.** Seed `aria-selected`/`aria-pressed`/`hidden`/`data-scenario` to
  match the initial render so the first paint (pre-JS) is already correct.

---

## GAPS (not yet in code)

- **Scrollytelling beyond scroll-spy.** `initNav` is the only IntersectionObserver. There is no
  step-on-scroll narrative (pin a graphic, advance steps as the reader scrolls). Steppers are
  click/arrow-driven only. Build with `[data-stepper]` + manual buttons, or note the gap.
- **Predict-then-reveal widget.** No primitive captures a reader's guess and then reveals the answer
  (e.g. "drag to your estimate, then reveal actual"). Approximate with a `data-set` "Reveal" button
  that snaps a param to the true value — but there's no guess-capture/scoring.
- **Stepper `scenario` field.** `.ux-steps` entries may carry a `scenario` key, but `initStepper`
  reads it into a do-nothing branch (`if (s.scenario && code) {}`). It does **not** drive the scenario
  control. Don't rely on it; flip scenarios with the `.ux-seg` control instead.
- **Stepper code via `s.code`.** Steps cannot swap code per step — the brief's `code?` field is not
  read. There's one code block; steps only highlight `.l` lines within it. Show different code per
  step via `[data-step-show]` blocks or tabs.
- **Focus-to-trace on graphs.** Hover-to-trace is `mouseenter`/`mouseleave` only — no
  `focus`/`blur` equivalent, so keyboard/touch users can't trigger the trace. Graph nodes also aren't
  focusable by default. Treat trace as a mouse-only enhancement, never the sole way to read the graph.
- **Theme persistence key mismatch.** `buildSwitcher` saves to `ux-theme-<preset>`, but the `<head>`
  FOUC resolver reads `ux-theme` (no suffix). Saved theme won't survive reload until the resolver and
  switcher agree on a key. Flag if cross-session theme memory matters.
- **No declarative chart binding.** `data-fill` drives a single `--v`/height/width on one element; the
  playground can't repaint a multi-series `ux-bars`/`ux-linechart` from derived state. Recompute and
  re-render charts yourself, or keep charts static.
