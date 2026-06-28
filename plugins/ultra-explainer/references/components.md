# Aurora Component Catalog

The visualization vocabulary for UltraExplainer. Every class below is real and lives in `assets/aurora.css`; every behavior below is wired in `assets/aurora.js`. Copy the snippets verbatim.

**Routing rule: pick the lowest-ink form that does the job.** A claim that is one number wants a KPI, not a chart. A sequence of three steps wants a spine, not a node-edge graph. A graph wants edges only where the relationship is the point. Reach for the heaviest component (node-edge graph, custom SVG) only when the structure *is* the explanation. Variety is the identity — a page that is all cards has failed as surely as one that is all glow.

## How the system is wired (read first)

- **Theme + glow are attributes on `<html>`.** `data-theme="dark|light"` and `data-fx="glow|flat"`. The FOUC-free resolver in `<head>` sets them before paint; the corner switcher (`.ux-fxbar`, auto-built by `aurora.js`) flips them at runtime and persists to `localStorage`. You ship both states in one page — never hardcode a dark-only color.
- **Glow is never a hardcoded shadow.** Every luminous effect resolves through a `--fx-*` variable that goes to `none` (or a flat 1px ring) under `[data-fx="flat"]`. If you invent a glow, route it through `var(--fx-beam-glow)` or a sibling so flat mode stays calm. Structure, color, and depth must survive with glow off.
- **Color is a narrative ramp, not decoration.** `azure` = input/entry, `cyan` = transit/focus, `green` = resolved/output, `violet` = rare structural aside, `gold` = rim warmth only. Semantic state (`--add`/`--remove`/`--warn`) is separate from the ramp — use it for diffs and status, not for accenting nodes.
- **`aurora.js` auto-inits everything and no-ops when its DOM is absent.** Safe to inline wholesale. It boots graphs, tabs, filters, the particle field, and the switcher on `DOMContentLoaded`.

Page scaffold: `<div class="ux-field"><canvas></canvas></div>` (particle backdrop) then `<div class="ux-wrap">` (or `ux-wrap--narrow`) holding `<header>` + `<section class="ux-section">` blocks. Each section opens with `<div class="ux-section-title">…</div>`.

---

## Glass panel — `.ux-panel`

**When:** the default container for a body of content (a chart, a prose block, a KPI you want lifted). One panel per idea. Add `--rim` to exactly one focal panel per page — the hero or the headline result — to give it the bicolor rim-light; using it everywhere destroys the focal hierarchy.

```html
<div class="ux-panel">
  <div class="ux-label ux-label--cyan"><span class="ux-dot"></span>Throughput</div>
  <p class="ux-prose">Panel body. Glass blur + hairline border + soft shadow.</p>
</div>

<!-- Focal panel: the one result the eye should land on -->
<div class="ux-panel ux-panel--rim">
  <h2 class="ux-h2">The headline result</h2>
</div>
```

**Notes:** `--rim` draws via `::before` (the gradient ring from `var(--fx-rim)`) and `::after` (the bloom from `var(--fx-rim-bloom)`). In flat mode the ring collapses to a plain `var(--hairline-bright)` and the bloom disappears — automatically. `.ux-panel` is `isolation: isolate`, so the rim's negative `z-index` bloom stays contained. There is no `--focal` class; the focal treatment *is* `ux-panel--rim`. Panels fall back to `--surface-solid` where `backdrop-filter` is unsupported.

## Card and chip — `.ux-card`, `.ux-chip`

**When:** a card is a small titled fact inside a grid (`ux-grid ux-cols-3`); a chip is an inline mono token (a tag, a count, a key). Cards are the workhorse for "blast radius" / "at a glance" rows. Do not let cards become the whole page — they carry facts, not structure.

```html
<div class="ux-grid ux-cols-3">
  <div class="ux-card"><div class="ux-card__title">2 callers</div><div class="ux-card__desc">Both wrap in try/catch</div></div>
  <div class="ux-card"><div class="ux-card__title">No API change</div><div class="ux-card__desc">Signature unchanged</div></div>
  <div class="ux-card"><div class="ux-card__title">1 new test</div><div class="ux-card__desc">Added in <code>processor.test.ts</code></div></div>
</div>

<span class="ux-chip">retries: 3</span>
```

**Notes:** `.ux-card__title`/`.ux-card__desc` have shorthand aliases `.t`/`.d`. Cards sit on `--surface-2` (one step recessed from a panel). Chips sit on `--surface-raised`, are mono, and `inline-flex` with an 8px gap so you can drop an icon or dot before the text.

## KPI grid + focal glow — `.ux-kpis`, `.ux-kpi`, `.ux-kpi--focus`

**When:** the headline numbers at the top of a dashboard or review. Use focal sparingly — glow the one or two numbers that carry the story, leave the rest plain so the contrast means something.

```html
<div class="ux-kpis">
  <div class="ux-panel ux-kpi ux-kpi--focus"><div class="ux-kpi__val">$48.2k</div><div class="ux-kpi__label">Recovered (30d)</div><div class="ux-kpi__trend ux-kpi__trend--up">↑ 34% vs prior</div></div>
  <div class="ux-panel ux-kpi"><div class="ux-kpi__val">61.4%</div><div class="ux-kpi__label">Recovery rate</div><div class="ux-kpi__trend ux-kpi__trend--up">↑ from 47%</div></div>
  <div class="ux-panel ux-kpi"><div class="ux-kpi__val">2,914</div><div class="ux-kpi__label">Charges retried</div><div class="ux-kpi__trend">≈ flat</div></div>
  <div class="ux-panel ux-kpi ux-kpi--focus ux-kpi--down"><div class="ux-kpi__val">1</div><div class="ux-kpi__label">Gap</div></div>
</div>
```

**Notes:** `.ux-kpis` auto-fits at `minmax(180px, 1fr)`; override with inline `grid-template-columns:repeat(4,1fr)` when you want a fixed count. `.ux-kpi--focus` alone glows green; add a tint modifier to recolor: `ux-kpi--azure`, `ux-kpi--cyan`, or `ux-kpi--down` (red, for a bad number). Focus also adds a bottom accent bar and a colored border. The glow is `text-shadow: var(--fx-kpi-*)` — gone in flat mode, color retained. `--val` uses `tabular-nums` and `white-space:nowrap` so numbers never wrap or jitter.

## Status badge — `.ux-badge`

**When:** a single-word state on a row, card, or header — Match / Partial / Gap / live / failing.

```html
<span class="ux-badge ux-badge--success"><span class="ux-badge__dot"></span>Match</span>
<span class="ux-badge ux-badge--warn"><span class="ux-badge__dot"></span>Partial</span>
<span class="ux-badge ux-badge--error"><span class="ux-badge__dot"></span>Gap</span>
<span class="ux-badge ux-badge--transit"><span class="ux-badge__dot"></span>In flight</span>
```

**Notes:** Variants: `--success` (green), `--transit` (cyan), `--warn` (gold), `--error` (red); the bare `.ux-badge` is neutral. The `.ux-badge__dot` is optional but recommended — the success dot carries `var(--fx-dot-success)`. Pill-shaped, mono, uppercase.

## Node-edge graph + connector engine — `.ux-graph`

**When:** the relationships between parts *are* the explanation — request flow, dependency fan-out, pipeline topology. This is the signature component. Do not use it for a linear sequence (use a spine) or for a tree (use `.ux-tree`).

The graph is three layers inside one positioned host:
1. `<svg class="ux-graph__edges">` — absolutely positioned, `pointer-events:none`, `overflow:visible`. The engine draws paths into it.
2. `<div class="ux-graph__layer">` — a CSS **grid** you lay out yourself. Place nodes with `grid-template-areas` (define them in a tiny page-local `<style>`). Each node is a `.ux-node` with a **unique `id`**.
3. `<script type="application/json" class="ux-edges">` — the edge list.

```html
<div class="ux-graph">
  <svg class="ux-graph__edges" aria-hidden="true"></svg>
  <div class="ux-graph__layer lay-flow">
    <div class="ux-node ga-client" data-accent="azure" id="n-client"><div class="ux-node__label">entry</div><div class="ux-node__title">Client</div><div class="ux-node__desc">Browser / SDK</div></div>
    <div class="ux-node ga-edge"   data-accent="cyan"  id="n-edge"><div class="ux-node__label">edge</div><div class="ux-node__title">Edge Worker</div><div class="ux-node__desc">Routes &amp; guards</div></div>
    <div class="ux-node ga-api"                          id="n-api"><div class="ux-node__label">origin</div><div class="ux-node__title">API Service</div></div>
    <div class="ux-node ga-db"     data-accent="green" id="n-db"><div class="ux-node__label">store</div><div class="ux-node__title">Database</div></div>
  </div>
  <script type="application/json" class="ux-edges">
    [{"from":"n-client","to":"n-edge","color":"azure"},
     {"from":"n-edge","to":"n-api","color":"cyan"},
     {"from":"n-api","to":"n-db","color":"green","dashed":true}]
  </script>
</div>
```

Page-local layout style (grid areas are how you position nodes):

```html
<style>
.lay-flow{grid-template-columns:repeat(4,minmax(0,1fr));grid-template-areas:'client edge api db'}
.ga-client{grid-area:client}.ga-edge{grid-area:edge}.ga-api{grid-area:api}.ga-db{grid-area:db}
@media(max-width:820px){.lay-flow{grid-template-columns:1fr;grid-template-areas:'client' 'edge' 'api' 'db'}}
</style>
```

**Edge format:** array of objects. `from`/`to` are node `id`s. `color` is one of `edge | azure | cyan | green | violet` (omit or `"edge"` = neutral `--edge` stroke). `dashed:true` renders `stroke-dasharray:5 6`. Any colored edge auto-gets `is-glow` (`var(--fx-edge-glow)`, `drop-shadow(0 0 4px currentColor)`), so it glows in its own color and goes flat under flat mode.

**What the engine does (`initGraph`):** measures every `.ux-node[id]` relative to the host, picks the dominant axis between each pair (horizontal vs vertical), anchors the path to the correct edge *faces* (right→left, bottom→top, etc.), and draws a smooth cubic Bézier. **Arrows auto-route and re-draw** on `ResizeObserver`, window `resize`, font load, and a 250ms settle — so reflow and theme toggles never desync the edges. Arrowheads use a shared `#ux-arrow` marker whose `fill="context-stroke"`, so the head always matches the edge color and theme. **Hover-to-trace:** hovering a node dims (`is-dim`) all non-adjacent nodes, lifts the node (`is-hot`), and fades (`is-faded`) every edge not touching it.

**Notes:** Give nodes a `data-accent` (`azure|cyan|green|violet`) to tint the label and add the matching node glow. If you build graphs after load, call `window.Ultra.initGraph(hostEl)`; the switcher calls `window.Ultra.redrawGraphs()` on theme change for you. Node ids must be unique on the page.

## Flow beam — `svg .ux-beam-*`

**When:** a single luminous connector that isn't part of the auto-routed grid graph — a hero "energy travels A→B" arc, or one emphasized path you hand-place. For multi-node topology use the graph engine instead.

```html
<svg viewBox="0 0 600 120" style="width:100%;height:auto" aria-hidden="true">
  <defs>
    <linearGradient id="ux-flow-grad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="var(--azure)"/><stop offset="1" stop-color="var(--green)"/>
    </linearGradient>
  </defs>
  <path class="ux-beam-halo" d="M20,60 C200,60 400,60 580,60"/>
  <path class="ux-beam-core" d="M20,60 C200,60 400,60 580,60"/>
  <path class="ux-beam-spark" d="M20,60 C200,60 400,60 580,60"/>
</svg>
```

**Notes:** three stacked paths sharing one `d`: `ux-beam-halo` (blurred wide underglow), `ux-beam-core` (the 1.6px line, `var(--fx-beam-glow)`), `ux-beam-spark` (an animated energy packet that drifts along via `ux-beam-drift`). You **must** define a `#ux-flow-grad` gradient in `<defs>` — halo and core stroke `url(#ux-flow-grad)`. In flat mode the halo and spark hide and the core stops glowing. The spark also hides under reduced-motion.

## Diff + comment connector + verdict — `.ux-diff`, `.ux-annot`, `.ux-verdict`

**When:** showing a code change with review commentary and a conclusion. The canonical diff-review body.

```html
<div class="ux-diff">
  <div class="ux-diff__bar">
    <span class="ux-diff__branch" aria-hidden="true">⎇</span>
    <span class="ux-diff__file">src/api/processor.ts</span>
    <span class="ux-diff__tally"><span class="add">+3</span><span class="del">−1</span></span>
  </div>
  <div class="ux-diff__scroll">
    <div class="ux-diff__row"><div class="ux-diff__ln">79</div><div class="ux-diff__gut"></div><div class="ux-diff__code"><span class="tok-k">async function</span> <span class="tok-f">fetchData</span>(id) {</div></div>
    <div class="ux-diff__row ux-diff__row--del"><div class="ux-diff__ln">80</div><div class="ux-diff__gut"></div><div class="ux-diff__code">  <span class="tok-k">return</span> res.json();</div></div>
    <div class="ux-diff__row ux-diff__row--add"><div class="ux-diff__ln">80</div><div class="ux-diff__gut"></div><div class="ux-diff__code">  <span class="tok-k">if</span> (!res.ok) <span class="tok-k">throw new</span> <span class="tok-n">Error</span>(<span class="tok-s">`Failed ${id}`</span>);</div></div>
    <div class="ux-diff__row ux-diff__row--add"><div class="ux-diff__ln">81</div><div class="ux-diff__gut"></div><div class="ux-diff__code">  <span class="tok-k">return</span> res.json();</div></div>
  </div>
  <div class="ux-annot">
    <div class="ux-annot__pin">1</div>
    <div class="ux-annot__body"><b>Adds the missing failure path.</b> A 4xx body used to fall through to <code>res.json()</code>. <span style="color:var(--text-faint)">Anchored to <code>processor.ts:80–82</code>.</span></div>
  </div>
  <div class="ux-verdict">
    <div class="ux-check" aria-hidden="true"><svg viewBox="0 0 84 84"><path d="M18 43 L34 58 L66 24"/></svg></div>
    <div><div class="ux-verdict__t">Approved — correctness fix</div><div class="ux-verdict__d">Verified against the working tree</div></div>
  </div>
</div>
```

**Notes:** Each row is a 3-column grid: line number / 4px gutter strip / code. Add `--add` or `--del` to `.ux-diff__row` to wash the row and light the gutter (`var(--fx-gutter-add/del)`). Apply syntax tokens by hand: `.tok-k` keyword (violet), `.tok-s` string (green), `.tok-c` comment (faint italic), `.tok-f` function (cyan), `.tok-n` name/type (azure). The `.ux-annot` is the comment connector — a numbered violet pin (`.ux-annot__pin`) tying prose to the lines above it; for a richer reviewer note use `.ux-comment-chip` with an `.ux-avatar`. `.ux-verdict` is the closing band (green wash). The `.ux-check` circle draws its checkmark via `ux-check-draw` (the `<path>` must be the single tick stroke); `.ux-terminus` is the identical treatment for a flow endpoint. Wrap code in `.ux-diff__scroll` so long lines scroll inside the diff, never the page.

## Spine — `.ux-spine` (true sequence)

**When:** an ordered sequence of steps where order is the meaning — a plan, a pipeline you walk top-to-bottom, phases of a migration. This is the lowest-ink answer to "show me the steps"; prefer it over a graph for anything linear.

```html
<div class="ux-spine">
  <div class="ux-spine__node is-done"><h3 class="ux-h3">Detect</h3><p class="ux-prose">Sold-out variant found in the DOM.</p></div>
  <div class="ux-spine__node is-active"><h3 class="ux-h3">Capture</h3><p class="ux-prose">Open the inline form.</p></div>
  <div class="ux-spine__node"><h3 class="ux-h3">Notify</h3><p class="ux-prose">Email on restock.</p></div>
</div>
```

**Notes:** a vertical rail with a node marker per step. `is-done` fills the marker green (`var(--fx-dot-success)`); `is-active` rings it cyan and glows. On narrow screens the rail drops away and nodes become top-bordered blocks. The marker dots are the only ornament — keep step bodies prose-light.

## Timeline — `.ux-timeline`

**When:** events anchored to *time* (dates, releases, an incident log) rather than logical steps. The difference from a spine: a timeline carries a `when`.

```html
<div class="ux-timeline">
  <div class="ux-tl-item"><div class="ux-tl-when">2026-06-21</div><div class="ux-tl-title">First report</div><div class="ux-tl-desc">P99 spike in eu-west.</div></div>
  <div class="ux-tl-item"><div class="ux-tl-when">2026-06-22</div><div class="ux-tl-title">Root cause</div><div class="ux-tl-desc">Cold connection pool.</div></div>
  <div class="ux-tl-item"><div class="ux-tl-when">2026-06-23</div><div class="ux-tl-title">Fixed</div><div class="ux-tl-desc">Warm pool shipped.</div></div>
</div>
```

**Notes:** the rail is a fixed azure→cyan→green gradient (the narrative ramp as time-progress); each item gets a cyan-ringed dot. `.ux-tl-when` is cyan mono.

## Tabs — `.ux-tabbar` / `.ux-tab` / `.ux-tabpanel`

**When:** parallel facets of one subject the reader chooses between (Latency / Cost / Resilience) — not a sequence. Keeps a section dense without scrolling.

```html
<section class="ux-section" data-tabs>
  <div class="ux-tabbar" role="tablist">
    <button class="ux-tab" role="tab" aria-selected="true"  data-tab="lat">Latency</button>
    <button class="ux-tab" role="tab" aria-selected="false" data-tab="cost">Cost</button>
  </div>
  <div class="ux-tabpanel ux-prose" data-panel="lat">P99 drops from 142&thinsp;ms to 12&thinsp;ms.</div>
  <div class="ux-tabpanel ux-prose" data-panel="cost" hidden>Cost falls 68% at 10k requests.</div>
</section>
```

**Notes:** `data-tab` on the button must equal `data-panel` on the panel. The engine scopes switching to the nearest `[data-tabs]` ancestor (or the tabbar's parent), so multiple tab groups coexist on one page. Mark all but the first panel `hidden` and set `aria-selected` accordingly; the engine maintains both. Panels fade in via `ux-fade`.

## Bar chart — `.ux-bars`

**When:** comparing a handful of categorical magnitudes (throughput by region, count by status). For a trend over a continuous axis use the line chart; for parts-of-a-whole use the donut.

```html
<div class="ux-panel">
  <div class="ux-bars">
    <div class="ux-bar"><div class="ux-bar__col" style="height:48%"></div><div class="ux-bar__v">4.2k</div><div class="ux-bar__x">us-east</div></div>
    <div class="ux-bar"><div class="ux-bar__col" style="height:100%"></div><div class="ux-bar__v">8.7k</div><div class="ux-bar__x">eu-west</div></div>
    <div class="ux-bar"><div class="ux-bar__col ux-bar__col--g" style="height:61%"></div><div class="ux-bar__v">5.3k</div><div class="ux-bar__x">ap-south</div></div>
  </div>
</div>
```

**Notes:** set each bar's `height` as a percentage inline — they are flex columns in a 170px-tall rail. Default columns are azure→cyan; add `ux-bar__col--g` to flag one as the success/winner (green). Column glow is `var(--fx-bar-glow)` / `--fx-bar-glow-g`. Put it in a panel for the glass backdrop.

## Donut — `.ux-donut` (conic-gradient + mask)

**When:** parts of a whole, 2–4 slices, where the proportion is the point. More than ~4 slices: switch to a bar chart.

```html
<div class="ux-donut-wrap" style="--sz:150px">
  <div class="ux-donut" style="background:conic-gradient(var(--green) 0 58%, var(--cyan) 58% 82%, var(--violet) 82% 100%)"></div>
  <div class="ux-donut-center"><div class="v">58%</div><div class="l">card retry</div></div>
</div>
<div class="ux-legend" style="flex-direction:column;gap:8px">
  <div class="ux-legend-item"><span class="ux-legend-swatch" style="background:var(--green)"></span> Card retry — 58%</div>
  <div class="ux-legend-item"><span class="ux-legend-swatch" style="background:var(--cyan)"></span> Updated method — 24%</div>
  <div class="ux-legend-item"><span class="ux-legend-swatch" style="background:var(--violet)"></span> Email link — 18%</div>
</div>
```

**Notes:** the ring is a `conic-gradient` set inline on `.ux-donut`; cumulative stops define the slices (`color start% end%`). The hole is a `radial-gradient` mask at 56%/57% — do not change the mask, just the gradient. Size with `--sz` on the wrap. `.ux-donut-center` overlays the headline number (`.v`) and label (`.l`). Color slices from the ramp + violet; pair with a `.ux-legend`.

## Line / area chart — `.ux-linechart` (inline SVG)

**When:** a trend over a continuous axis — revenue over days, latency over time. One series reads cleanest; the area fill makes the trend legible at a glance.

```html
<div class="ux-panel">
  <svg class="ux-linechart" viewBox="0 0 620 200" preserveAspectRatio="none" role="img" aria-label="Daily recovered revenue">
    <defs>
      <linearGradient id="ux-line-grad" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="var(--azure)"/><stop offset="1" stop-color="var(--green)"/></linearGradient>
      <linearGradient id="ux-area-grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgba(56,224,230,0.26)"/><stop offset="1" stop-color="rgba(56,224,230,0)"/></linearGradient>
    </defs>
    <path class="area" d="M0,150 L88,150 L176,118 L264,128 L352,86 L440,70 L528,44 L620,30 L620,200 L0,200 Z"/>
    <path class="line" d="M0,140 L88,150 L176,118 L264,128 L352,86 L440,70 L528,44 L620,30"/>
    <circle class="dot dot--end" cx="620" cy="30" r="4"/>
  </svg>
</div>
```

**Notes:** you must define `#ux-line-grad` (horizontal azure→green stroke) and `#ux-area-grad` (vertical cyan fade) in `<defs>` — the CSS references them by id. The `.line` path is the open trend; the `.area` path is the same path closed down to the baseline and back. The line carries `var(--fx-beam-glow)`. Mark the latest point with `.dot--end` for a glowing terminus. Hand-compute the `d` coordinates against the `viewBox`.

## Table — `.ux-table-wrap` (scroll + live filter)

**When:** point-by-point comparison, requirement coverage, any dense tabular truth. Pair status cells with `.ux-badge`.

```html
<div class="ux-toolbar">
  <div class="ux-section-title" style="margin:0;flex:1">Point-by-point</div>
  <input class="ux-input" type="search" data-ux-filter=".ux-table" data-ux-count="#rowcount" placeholder="Filter requirements…" aria-label="Filter requirements">
  <span class="ux-eyebrow" id="rowcount">14 / 14</span>
</div>
<div class="ux-table-wrap">
  <div class="ux-table-scroll">
    <table class="ux-table">
      <thead><tr><th class="wide">Request</th><th class="wide">Plan</th><th>Status</th></tr></thead>
      <tbody>
        <tr><td class="wide">Scope to one template</td><td class="wide">Plan scopes everything here</td><td><span class="ux-badge ux-badge--success">Match</span></td></tr>
        <tr><td class="wide">Analytics passthrough</td><td class="wide">Forwards UTM, not session id</td><td><span class="ux-badge ux-badge--warn">Partial</span></td></tr>
        <tr><td class="wide">Fire submit event<small>Unclear if auto-dispatched.</small></td><td class="wide">Not addressed</td><td><span class="ux-badge ux-badge--error">Gap</span></td></tr>
      </tbody>
      <tfoot><tr><td>3 reviewed</td><td></td><td>1 match · 1 partial · 1 gap</td></tr></tfoot>
    </table>
  </div>
</div>
```

**Notes:** **live filter** — put `data-ux-filter` on an `<input>`; its value is a CSS selector for the target table (`.ux-table`, or omit to use the nearest table in the section). Typing hides non-matching `<tbody>` rows via `.ux-row-hidden` (full-text, case-insensitive). Add `data-ux-count="#someId"` and the engine writes `shown / total` into that element on each keystroke. `thead` is sticky; wrap the table in `.ux-table-scroll` so wide tables scroll inside the card, not the page. `.wide` widens a column; nest `<small>` for a sub-note in a cell.

## Comparison before/after — `.ux-compare`

**When:** exactly two states side by side — old vs new, naive vs fixed, before vs after. For more than two facets use tabs or a table.

```html
<div class="ux-compare">
  <div class="ux-compare__side ux-compare__side--before">
    <div class="ux-compare__tag">Before</div>
    <p class="ux-prose">Opaque <code>SyntaxError</code> in logs.</p>
  </div>
  <div class="ux-compare__side ux-compare__side--after">
    <div class="ux-compare__tag">After</div>
    <p class="ux-prose">Real HTTP error with the request id.</p>
  </div>
</div>
```

**Notes:** a hairline-gap two-column grid; collapses to stacked on narrow. `--before` tag is red, `--after` tag is green — wire those modifiers so the semantics read.

## Callout — `.ux-callout`

**When:** one boxed aside that must not be missed — a caveat, a watch-out, a key takeaway. One or two per page; more and they stop being calls.

```html
<div class="ux-callout"><b>Note:</b> auth runs at the edge, before the origin is reached.</div>
<div class="ux-callout ux-callout--warn"><b>Watch:</b> callers relying on the old <code>{}</code>-on-failure will now see an exception.</div>
<div class="ux-callout ux-callout--green"><b>Result:</b> P99 dropped 10×.</div>
```

**Notes:** default is cyan (informational). `--warn` (gold) for caveats, `--green` for confirmed wins. Left-border accent + a fading wash. `<b>` lifts to full `--text`.

## Collapsible — `.ux-details`

**When:** secondary detail that would bury the main thread — full stack traces, exhaustive config, "show all 40 rows". Keeps the page scannable; the reader opts in.

```html
<details class="ux-details">
  <summary>Full call sites (12)</summary>
  <div class="ux-details__body"><p>loadProfile(), refreshFeed(), … all wrap in try/catch.</p></div>
</details>
```

**Notes:** native `<details>`/`<summary>` styled; the default marker is replaced by a `▸` that rotates on open. Put body content in `.ux-details__body`. No JS needed.

## Tree — `.ux-tree`

**When:** a hierarchy where indentation *is* the structure — a file tree, a config shape, a nested call. Cheaper and clearer than a node-edge graph for pure parent/child nesting.

```html
<div class="ux-tree">src/
├─ api/
│  ├─ <span class="hl">processor.ts</span>   <span class="ann">// the change</span>
│  └─ processor.test.ts
└─ index.ts</div>
```

**Notes:** mono, `white-space:pre` (draw the box-drawing characters literally), scrolls horizontally on overflow. `.hl` highlights a line (cyan); `.ann` is a faint italic inline comment. Indentation and glyphs are yours to type.

## Mermaid diagram shell — `.ux-diagram-shell`

**When:** the graph is large, generated, or naturally Mermaid-shaped (a big flowchart, a sequence diagram, an ER diagram) and hand-placing a `.ux-graph` would be impractical. For a small, deliberately art-directed topology, prefer the connector engine — it looks more bespoke.

```html
<div class="ux-diagram-shell">
  <div class="ux-zoom-controls">
    <button data-zoom="in" title="Zoom in" aria-label="Zoom in">+</button>
    <button data-zoom="out" title="Zoom out" aria-label="Zoom out">−</button>
    <button data-zoom="reset" title="Reset" aria-label="Reset">⟲</button>
    <button data-zoom="expand" title="Open full size" aria-label="Open full size">⤢</button>
  </div>
  <div class="ux-mermaid-wrap">
    <div class="ux-mermaid-canvas">
      <pre class="mermaid">
flowchart TD
  push["git push"] --> lint{"lint &amp; types"}
  lint -->|pass| test["unit + integration"]
  lint -->|fail| block["block PR"]
  test -->|green| ship["deploy to edge"]
  ship --> done(["live"])
  classDef ok fill:#2bd58a22,stroke:#2bd58a,stroke-width:2px,color:#e7edfb
  classDef stop fill:#ff5d6c22,stroke:#ff5d6c,stroke-width:2px,color:#e7edfb
  class ship,done ok
  class block stop
      </pre>
    </div>
  </div>
  <span class="ux-zoom-label">100%</span>
</div>
```

**Notes:** the shell provides zoom/pan/expand (wired in the mermaid template's script — drag to pan, buttons to zoom, ⤢ opens full size). Style Mermaid nodes with `classDef` using Aurora hex literals (`#2bd58a` green, `#ff5d6c` red, `#60b2ff`/`#3b82f6` azure, `#ffc555` gold) and `color:#e7edfb` for label text; the stylesheet already forces `.mermaid` to the body font and themes node/edge labels. `&amp;` for ampersands inside labels. This shell requires the Mermaid library and the template's pan/zoom script — copy them from `templates/mermaid.html`.

## Custom SVG illustration

**When:** the explanation is a picture nothing else captures — a vector-space diagram, a geometric proof, a bespoke schematic. The escape hatch for "no component fits". Reach for it deliberately; it is the highest-ink form.

```html
<svg viewBox="0 0 380 300" style="width:100%;height:auto;max-width:520px;display:block;margin:0 auto" role="img" aria-label="Two vectors, same direction, different magnitude">
  <defs>
    <marker id="va" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0,1 L9,5 L0,9 Z" fill="context-stroke"/>
    </marker>
  </defs>
  <!-- axes: hairline so they recede -->
  <line x1="40" y1="270" x2="350" y2="270" stroke="var(--hairline-bright)" stroke-width="1"/>
  <line x1="40" y1="270" x2="40"  y2="24"  stroke="var(--hairline-bright)" stroke-width="1"/>
  <!-- the data: ramp colors + glow that follows the theme -->
  <line x1="40" y1="270" x2="120" y2="120" stroke="var(--cyan)"  stroke-width="2.4" marker-end="url(#va)" filter="var(--fx-beam-glow)"/>
  <line x1="40" y1="270" x2="250" y2="58"  stroke="var(--green)" stroke-width="2.4" marker-end="url(#va)" filter="var(--fx-beam-glow)"/>
  <line x1="120" y1="120" x2="250" y2="58" stroke="var(--remove)" stroke-width="1.6" stroke-dasharray="5 5"/>
  <circle cx="250" cy="58" r="3.5" fill="var(--green)"/>
  <text x="178" y="52" font-family="JetBrains Mono,monospace" font-size="11" fill="var(--green-bright)">"too slow" ×47</text>
</svg>
```

**Rules that keep a custom SVG on-system:**
- **Color from variables, never hex.** Stroke and fill with `var(--cyan)`, `var(--green)`, `var(--azure)`, `var(--violet)`, `var(--remove)`, `var(--text-faint)` — so both themes work. Use `var(--hairline-bright)` for axes/scaffolding that should recede.
- **Arrowheads via a `<marker>` with `fill="context-stroke"`** so the head inherits the line's color and adapts to theme (exactly how the connector engine's `#ux-arrow` works). Each SVG needs its own uniquely-id'd marker in `<defs>`.
- **Keep glow optional:** put it on data strokes as `filter="var(--fx-beam-glow)"` — it lights in glow mode and vanishes in flat mode for free. Don't bake a fixed `drop-shadow`.
- **Labels in mono:** `font-family="JetBrains Mono,monospace"`, ~10–11px, colored with the matching ramp variable (`var(--cyan-soft)`, `var(--green-bright)`, etc.).
- Always set `role="img"` and an `aria-label`; size with `viewBox` + `width:100%;height:auto` so it scales without horizontal page scroll.
