# Component contract & build reference

The build/markup source of truth: every `.ux-*` class in `core.css`, which token it consumes, and how `build.mjs` assembles a self-contained page. Read this when you are writing a `_src/<name>.body.html` body or extending the contract. The golden rule: **components reference SEMANTIC + FX tokens only — never raw hex.** Theme packs fill those tokens; you write markup against the abstract names.

## Token tiers

Three tiers. You write markup that touches **none** of them directly except `--i` (rise stagger) and the FX layer via `is-glow`/`is-focus` classes. The cascade is: theme pack → SEMANTIC tokens → component CSS.

**PRIMITIVE** — raw hex/rgba, defined *only* inside a theme pack (`themes.css`) or the neutral `:root` fallback in core.css. You never write these in a body.

**SEMANTIC** — what every component consumes. A theme MUST define all of these:
```
--bg --bg-2 --surface --surface-2 --surface-3 --recessed
--hairline --hairline-strong --text --text-dim --text-faint
--accent --accent-2 --accent-3 --accent-soft --accent-2-soft
--good --good-soft --warn --warn-soft --bad --bad-soft
--meta --meta-soft --edge --code-bg --code-text
--tok-key --tok-str --tok-com --tok-fn --tok-num
--focal-border --focal-ring
--font-display --font-body --font-mono
--radius --radius-sm --radius-lg --measure --gap --pad
--shadow --shadow-strong --inset --grain
--motion-fast --motion-mid --ease
```

**FX** — the texture/glow layer. `none`/`0` by default; **only Luminous (or a theme) fills them**. This is what makes "flat" a single switch:
```
--fx-accent-glow --fx-good-glow --fx-edge-glow --fx-bar-glow
--fx-focal-bloom --fx-rim --fx-node --fx-text-accent --fx-field-opacity
```
FX tokens are applied inside core.css via `box-shadow: var(--fx-*)`, `filter: var(--fx-edge-glow)`, `text-shadow: var(--fx-text-accent)`, etc. When a preset is flat, every one resolves to `none`/`0` and the component degrades cleanly. **Do not hardcode glows in `head` styles** — set/clear `--fx-*` if you must, so the flat switch keeps working.

Rule restated: in body markup and any `head` style overrides, reference SEMANTIC + FX token names, never hex. If you need a one-off color, derive it with `color-mix(in srgb, var(--accent) 30%, transparent)`.

## Assembly — how a page is built

A page is `_src/<name>.body.html`. Line 1 is the directive; the rest is the body fragment that lands inside `<body>` after the particle-field div.

**Directive (line 1):**
```html
<!--ux: {"title":"…","preset":"blueprint","theme":"light","fx":"flat","fonts":true,"head":"<style>…</style>"} -->
```
Fields:
- `preset` — `blueprint|editorial|terminal|instrument|notebook|swiss|luminous` (default `luminous`).
- `presets` — array; emit one file per preset as `<name>.<preset>.html` (chameleon demos). Overrides `preset`.
- `theme` — `light|dark`. Defaults to the preset's NATURAL tuning: blueprint/editorial/notebook/swiss = light; terminal/instrument/luminous = dark.
- `fx` — `glow|flat`. Defaults to `glow` for luminous, `flat` for everything else.
- `head` / `foot` — extra markup strings. Sidecar files `<name>.head.html` / `<name>.foot.html` are also merged (head: directive then sidecar; foot: sidecar then directive).
- `fonts` — `true` (default) links the preset's Google Fonts; set `false` to skip.

**What `build.mjs` emits** (skeleton order in `<head>`):
1. `<title>`, charset, viewport.
2. Fonts `<link>` (Google Fonts CDN per preset, `&display=swap`). Deliberate tradeoff vs base64-inlining — layout never depends on the webfont; system fallbacks are in every `--font-*`.
3. **FOUC-free resolver `<script>`** — runs before paint, sets on `<html>`: `data-theme-preset` (the preset), `data-theme` (localStorage `ux-theme-<preset>` if light/dark, else directive default), `data-fx` (localStorage `ux-fx==='flat'?'flat':` directive default). This is why themes apply with no flash.
4. `<style>` containing inlined `core.css` then `themes.css`.
5. The directive/sidecar `head` markup.

`<body>` order: `<div class="ux-field" aria-hidden="true"><canvas></canvas></div>`, then your body, then `foot`, then a `<script>` with inlined `ux.js`.

**CRITICAL inlining rule:** `core.css`/`themes.css`/`ux.js` are inlined inside `<style>`/`<script>`. Any literal `</script>` inside inlined JS (or in your `head`/`foot` JS) **must be escaped as `<\/script>`**, or the browser closes the script tag early and the page breaks. The resolver in `build.mjs` already does this. If you add inline JS that emits a script tag, escape it the same way.

**Run the build:**
```
node scripts/build.mjs            # build every _src/*.body.html
node scripts/build.mjs cache      # only fragments whose filename includes "cache"
```
Output lands in `plugins/ultra-explainer/templates/<name>.html` (or `<name>.<preset>.html` for multi-preset). Log line shows preset + kb size.

## Component catalog

Every group below is a real block in `core.css`. Snippets are minimal and correct. "Use for" is one line.

### Layout & typography
```html
<div class="ux-wrap">…</div>                  <!-- centered 1120px column; --reading = 760px -->
<section class="ux-section">                  <!-- top-margin rhythm -->
  <div class="ux-section-title">Read path</div>  <!-- mono uppercase label + trailing rule -->
  <div class="ux-grid ux-cols-2">…</div>       <!-- also ux-cols-3 / ux-cols-auto (auto-fit 220px) -->
</section>
```
```html
<span class="ux-kicker">Cache · read path</span>     <!-- accent mono eyebrow with leading dash -->
<span class="ux-eyebrow">FIG 1</span>                <!-- faint mono micro-label -->
<h1 class="ux-thesis">Hits <span class="lit">94%</span> of the time.</h1>  <!-- hero; .lit / .lit--grad for emphasis -->
<p class="ux-lede">One-paragraph framing.</p>
<h2 class="ux-h2">Section head</h2> <h3 class="ux-h3">Sub-head</h3>
<div class="ux-prose"><p>Body…</p><p>…<strong class="ux-strong">key</strong></p></div>
<code>inline code</code>                              <!-- styled via accent-soft automatically -->
```
Use for: page scaffold, headings, narrative prose, inline code. Add `class="ux-rise" style="--i:N"` to any element for a staggered fade-in (N = order).

### Panels, cards, chips
```html
<div class="ux-panel">…</div>                          <!-- primary raised container -->
<div class="ux-panel ux-panel--focal">…</div>          <!-- the one most-important element: focal border+ring+bloom -->
<div class="ux-card"><div class="ux-card__title">Name</div><div class="ux-card__desc">One line.</div></div>
<span class="ux-chip">v2.1.0</span>                    <!-- mono pill -->
```
Use for: grouping content; `--focal` marks the single hero element per view.

### KPIs, badges, labels
```html
<div class="ux-kpis">
  <div class="ux-panel ux-kpi ux-kpi--focus"><div class="ux-kpi__val">94%</div>
    <div class="ux-kpi__label">Hit rate</div>
    <div class="ux-kpi__trend ux-kpi__trend--up">↑ from 81%</div></div>
  <div class="ux-panel ux-kpi"><div class="ux-kpi__val">8ms</div><div class="ux-kpi__label">p99</div></div>
</div>
```
`ux-kpi--focus` colors the value good (default), or `--accent` / `--down`(bad) when combined. `__trend--up`=good, `__trend--down`=bad.
```html
<span class="ux-badge ux-badge--good"><span class="ux-badge__dot"></span>healthy</span>
<!-- variants: --good --warn --bad --accent (default = neutral) -->
<div class="ux-label ux-label--accent"><span class="ux-dot"></span>SECTION</div>
<!-- variants: --accent --accent2 --good --warn --meta; dot class is .ux-dot -->
```
Use for: metric masthead, status pills, mono section flags.

### Node-edge graph (connector engine)
```html
<div class="ux-graph">
  <svg class="ux-graph__edges" aria-hidden="true"></svg>
  <div class="ux-graph__layer lay-cache">   <!-- layout columns via your own head style -->
    <div class="ux-node" data-accent="accent" id="c-req">
      <div class="ux-node__label">in</div><div class="ux-node__title">Request</div>
      <div class="ux-node__desc">LRU, 2GB</div></div>
    <div class="ux-node" data-accent="good" id="c-resp">…</div>
  </div>
  <script type="application/json" class="ux-edges">
    [{"from":"c-req","to":"c-resp","color":"good","dashed":false}]
  <\/script>
</div>
```
`initGraph` reads the `ux-edges` JSON and routes bezier SVG arrows between nodes by `id`, re-routing on resize with hover-to-trace. `data-accent`: `accent|accent2|meta|good`. Edge `color`: `accent|accent2|good|edge|meta`. Note the `<\/script>` escape on the JSON block. Edge `.ux-epath` variants map to those colors; `.is-glow` applies `--fx-edge-glow`, `.is-faded` dims.

### Diff + verdict
```html
<div class="ux-diff">
  <div class="ux-diff__bar"><span class="ux-diff__branch">⎇</span>
    <span class="ux-diff__file">cache.ts</span>
    <span class="ux-diff__tally"><span class="add">+2</span><span class="del">−1</span></span></div>
  <div class="ux-diff__scroll">                              <!-- this wrapper is the overflow-x:auto box -->
    <div class="ux-diff__row"><div class="ux-diff__ln">41</div><div class="ux-diff__gut"></div>
      <div class="ux-diff__code"><span class="tok-k">const</span> ttl = <span class="tok-n">60</span>;</div></div>
    <div class="ux-diff__row ux-diff__row--del"><div class="ux-diff__ln"></div><div class="ux-diff__gut"></div><div class="ux-diff__code">cache.set(k,v);</div></div>
    <div class="ux-diff__row ux-diff__row--add"><div class="ux-diff__ln">42</div><div class="ux-diff__gut"></div><div class="ux-diff__code">cache.set(k,v,{ttl});</div></div>
  </div>
  <div class="ux-annot"><div class="ux-annot__pin">1</div>
    <div class="ux-annot__body"><b>Why:</b> stale-while-revalidate.</div></div>
  <div class="ux-verdict"><div class="ux-check"><svg viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg></div>
    <div><div class="ux-verdict__t">Ships green</div><div class="ux-verdict__d">CI passing.</div></div></div>
</div>
```
Use for: code change review. Row grid is `48px 4px 1fr` (line / gutter / code). Token spans inside code/diffs — **actual class names**: `.tok-k`(key), `.tok-s`(string), `.tok-c`(comment), `.tok-f`(fn), `.tok-n`(num).

### Compare, callout, details, tree
```html
<div class="ux-compare">
  <div class="ux-compare__side ux-compare__side--before"><div class="ux-compare__tag">Before</div>…</div>
  <div class="ux-compare__side ux-compare__side--after"><div class="ux-compare__tag">After</div>…</div>
</div>
<div class="ux-callout ux-callout--warn"><b>Heads up:</b> …</div>   <!-- default | --good | --warn -->
<details class="ux-details"><summary>Edge cases</summary><div class="ux-details__body">…</div></details>
<pre class="ux-tree"><span class="hl">src/</span>
  cache.ts   <span class="ann">// the fix</span></pre>
```
Use for: before/after, advisories, collapsible detail, directory trees. `ux-tree` is `white-space:pre` + its own `overflow-x:auto` — keep tree content literal.

### Spine & timeline
```html
<div class="ux-spine">
  <div class="ux-spine__node is-done">Step 1</div>
  <div class="ux-spine__node is-active">Step 2</div>
</div>
<div class="ux-timeline">
  <div class="ux-tl-item"><div class="ux-tl-when">Q1</div><div class="ux-tl-title">Ship</div><div class="ux-tl-desc">…</div></div>
  <div class="ux-tl-item is-risk">…</div>
</div>
```
Use for: ordered process (spine: `is-done`/`is-active` dots) or dated milestones (timeline: `is-risk` flags a warn node).

### Tabs
```html
<div class="ux-tabbar" role="tablist">
  <button class="ux-tab" data-tab="a" aria-selected="true">Read</button>
  <button class="ux-tab" data-tab="b">Write</button>
</div>
<div class="ux-tabpanel" data-panel="a">…</div>
<div class="ux-tabpanel" data-panel="b" hidden>…</div>
```
`initTabs` wires `data-tab` ↔ `data-panel`. Use for: switching between alternative views of the same region.

### Charts (honest, dependency-free)
```html
<!-- bars -->
<div class="ux-bars">
  <div class="ux-bar"><div class="ux-bar__col is-focus" style="height:94%"></div>
    <div class="ux-bar__v">94</div><div class="ux-bar__x">user:</div></div>
  <div class="ux-bar"><div class="ux-bar__col ux-bar__col--good" style="height:62%"></div>…</div>
</div>
<div class="ux-legend"><div class="ux-legend-item"><span class="ux-legend-sw" style="background:var(--accent)"></span>hits</div></div>
<!-- line chart: author the SVG yourself -->
<svg class="ux-linechart" viewBox="0 0 300 120"><path class="grid" .../><path class="area" .../><path class="line" .../><circle class="dot--end" .../></svg>
<!-- matrix heatmap -->
<table class="ux-matrix"><tr><th></th><th>A</th></tr><tr><th class="row">x</th><td style="background:var(--accent-soft)">3</td></tr></table>
```
Use for: comparisons (`ux-bars`, `is-focus` highlights one, `--good` recolors), trends (`ux-linechart`, hand-authored SVG), correlation grids (`ux-matrix`). Bar height is your inline `style`.

### Table
```html
<div class="ux-table-wrap"><div class="ux-table-scroll">    <!-- scroll wrapper = overflow-x:auto -->
  <table class="ux-table">
    <thead><tr><th>Prefix</th><th class="num" data-sort="num">Hit <span class="ux-sort-i"></span></th></tr></thead>
    <tbody>
      <tr><td class="wide">user:</td><td class="num">97</td></tr>
      <tr class="is-flag"><td>search:</td><td class="num">62</td></tr>
    </tbody>
    <tfoot><tr><td>Total</td><td class="num">…</td></tr></tfoot>
  </table>
</div></div>
```
`initSortable` sorts on `th[data-sort]` (`data-sort="num"` numeric). `.num` = tabular right-aligned, `.wide` = min/max width, `tr.is-flag`/`tr.is-warn` = bad/warn rows, `.ux-row-hidden` hides (used by filters). Always wrap in `ux-table-wrap > ux-table-scroll`.

### Interactive controls
```html
<div class="ux-toolbar">
  <input class="ux-input" placeholder="filter…" data-ux-filter="#t">
  <span data-ux-count></span>
</div>
<div class="ux-control"><div class="ux-slider">
  <label>TTL</label><input type="range" data-param="ttl" min="0" max="120" value="60"><output data-out="ttl"></output>
</div></div>
<div class="ux-seg" data-scenario-ctl data-target="#demo">
  <button data-scenario="cold" aria-pressed="true">Cold</button><button data-scenario="warm">Warm</button></div>
<div class="ux-stepper"><button data-step="prev">‹</button>
  <span data-step-n></span><button data-step="next">›</button></div>
<div class="ux-step-cap" data-step-cap></div>
<pre class="ux-codeblock"><span class="l"><span class="ln">1</span> code</span></pre>
<div class="ux-sidenote-layout"><div class="ux-prose">…</div><aside class="ux-sidenote">margin note</aside></div>
```
Use for the shared state→render engine. `initPlayground([data-playground])`: `.ux-state` (JSON script) seeds state; `data-derive="fn"` → `window.fn(state)`; `[data-param]` writes on input; `[data-show]` sets text, `[data-fill]` sets `--v` (0..1; `data-fill-h`/`data-fill-w`), `[data-out]` mirrors a value; `data-fmt`=`int|pct|pct1|ms|x|money|raw`; `[data-set]` buttons merge JSON. `initScenarios` toggles `data-scenario`/`[data-step-show]` then redraws graphs. `initStepper` reads `.ux-steps` JSON, highlights `.l` lines, drives `[data-step-cap]`/`[data-step-n]`. `initFilters` filters `tbody tr`, writes shown/total to `[data-ux-count]`.

### Scroll-spy nav
```html
<div class="ux-haslayout">
  <nav class="ux-nav"><a href="#read">Read</a><a href="#write">Write</a></nav>
  <div><section id="read">…</section><section id="write">…</section></div>
</div>
```
`initNav` is IntersectionObserver scroll-spy over `a[href^='#']` → sections, smooth-scroll on click, `.is-active` on the current link. Use for: long pages with 4+ sections.

### FX bar (glow toggle) & particle field
The `.ux-fxbar` / `.ux-fxbtn` toggle is **built by `buildSwitcher()`** — you do not author it. It always offers light/dark; it appends a glow/flat button **only** when `data-theme-preset="luminous"`. Suppress the whole bar with `[data-no-switcher]` on `<body>` or `ux-wrap`. `.ux-field` (the particle canvas) is injected by the skeleton and only renders when `--fx-field-opacity > 0` (Luminous); `initField` drives it. You normally touch neither.

### Diagram / Mermaid shell
```html
<div class="ux-diagram-shell">
  <div class="ux-zoom-controls"><button>−</button><button>＋</button></div>
  <div class="ux-mermaid-wrap"><div class="ux-mermaid-canvas"><div class="mermaid">graph LR; A--&gt;B</div></div></div>
  <div class="ux-zoom-label">100%</div>
</div>
```
Use for: embedding a Mermaid diagram with pan/zoom. The wrap clips + grabs; the canvas is the pan/zoom transform target. Core themes `.mermaid` nodes/edges to the token palette. (Mermaid itself must be provided via `head`/`foot` — see GAPS.)

## Overflow-safety catalog

`core.css` already handles most of this; respect the rest in your own `head` styles.

- **`min-width:0` on grid/flex children** — core sets `*, *::before, *::after { min-width: 0 }` globally, so flex/grid items can shrink below content size instead of forcing horizontal scroll. If you add a custom flex/grid child that still overflows, re-assert `min-width:0` on it.
- **Never `display:flex` on a `<li>` with a marker** — flexbox drops the list marker and can blow out width. Keep list items as default block flow.
- **Wide content lives in its own `overflow-x:auto` box.** Already done for you: diffs (`.ux-diff__scroll`), tables (`.ux-table-scroll`), code (`.ux-codeblock`), trees (`.ux-tree`), matrix wrappers. If you hand-author wide content in `head`/body, wrap it in a `overflow-x:auto` container — never let it widen the page.
- **Directory trees use `white-space:pre`** (`.ux-tree`) and scroll within themselves — keep the literal whitespace, don't reflow.
- **Body is `overflow-x:hidden` + `overflow-wrap:break-word`** globally and inline `code` is `overflow-wrap:anywhere`, so long tokens/URLs wrap instead of scrolling the page. The page body must **never** scroll horizontally; if it does, you introduced a fixed-width child — fix it, don't hide it.

## a11y / print

`core.css` ships these — don't undo them:
- **Focus**: global `:focus-visible { outline: 2px solid var(--accent) }`; `.ux-input:focus-visible` recolors its border. Use real `<button>`/`<a>`/`<input>` so this applies.
- **Reduced motion**: `@media (prefers-reduced-motion: reduce)` kills all animation/transition/`scroll-behavior` with `!important`. The `ux-rise` stagger and tab/edge transitions degrade to instant.
- **Print**: `@media print` strips padding, forces black-on-white, and `display:none`s `.ux-fxbar`, `.ux-field`, `.ux-nav`. Keep important content out of those. Tabs/details that are `hidden` stay hidden in print — surface critical content in the default-visible panel.
- Decorative SVGs (`.ux-graph__edges`, `.ux-field`) carry `aria-hidden="true"`; mirror that on any decorative markup you add.

## GAPS (not yet in code)

- **Mermaid runtime not bundled.** `core.css` styles `.ux-diagram-shell`/`.mermaid`, but there is no Mermaid library, no init for `.ux-zoom-controls`/pan-zoom, and no `redrawGraphs` for mermaid in the assets read here. You must supply the Mermaid script and zoom wiring via `head`/`foot`/sidecar (subject to self-contained constraints). Confirm against `ux.js` before relying on it.
- **`--inset` / `--shadow-strong` / `--accent-3` / `--accent-2-soft`** exist as tokens in core's `:root` but no `.ux-*` component in core.css consumes them — they're available for theme/`head` use only.
- **`--fx-rim`** exists in the FX `:root` block but the brief's FX list omits it; it has no consumer in core.css (theme/head use only).
- **`--bg-2` / `--meta-soft`** are referenced by components (e.g. `.ux-annot__pin` falls back `var(--meta-soft, var(--accent-soft))`) but are not in core's `:root` defaults — a theme pack must define them or the fallback kicks in. Verify each theme in `themes.css` fills them.
- **EXPLAIN-vs-TEACH mode switch** and the **render-and-observe verification loop** named in the brief are process/skill-level features; no class, token, or `data-` hook for them exists in `core.css`. Not a markup concern here.
- **`data-playground` / `data-bind` / `[data-step-show]`** are wired in `ux.js` (per the brief), but `core.css` only styles `[data-bind]` (tabular-nums). Trust `ux.js` for behavior; this doc documents only the CSS-visible surface plus the JS-hook contract from the brief.
