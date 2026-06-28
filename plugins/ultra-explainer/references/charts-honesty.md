# Charts & honesty

How to plot numbers without lying. Read this whenever a representation includes a quantity:
KPI rows, bars, lines, slopes, small multiples, heatmaps. The chart engine is CSS/SVG and
dependency-free — there is **no JS charting library**. Honesty is a hard gate, not a nicety:
an explorable that scrubs a fabricated relationship is the cardinal sin.

## The numbers ledger (anchor-or-omit, for data)

Every plotted value carries four fields:

> **{ value, unit, source/anchor, as-of date }**

No number renders without provenance. This mirrors anchor-or-omit: a value you cannot attribute to
a const, a config, a measured run, or a cited dataset/section does **not** get plotted. Keep the
ledger explicit (a comment block or a `<details>` receipt is fine) so every bar/point/KPI traces
back.

- **value** — the raw number, not a rounded-for-looks approximation.
- **unit** — ms, %, MB, $, req/s. Render it next to the number (`.ux-kpi__val` + label).
- **source/anchor** — file:line, git SHA, benchmark name, or the provided dataset/section. For
  data jobs with no codebase, cite the dataset and mark **given vs inferred**.
- **as-of date** — metrics rot. Stamp when it was measured.

If you cannot fill all four, either omit the number or stamp the whole figure
**`illustrative model — not measured`**. Marked-as-illustrative is honest; unmarked invention is not.

## Channel ranking (pick the highest-fidelity channel the data allows)

Encode magnitude in this order of perceptual accuracy:

> **position > length > angle/area > color**

- **Position** (a point on a common axis) — most accurate. Lines, slope graphs, dot plots.
- **Length** (bar height/width from a shared baseline) — strong. The default for magnitude.
- **Angle / area** (pie, bubble, treemap) — weak; humans misjudge area. Avoid pies entirely;
  use area only when nesting is the point (and we have no treemap component anyway).
- **Color** (hue/intensity) — weakest for magnitude; reserve for categories or heatmap density.

Never encode a primary magnitude in color when length or position is available.

## Axis-honesty rules

- **Zero baseline for bar length**, always, unless you *explicitly justify* truncation in text. A
  bar's length is read as its value; a clipped baseline triples a 3% difference into a lie.
- **No dual-axis charts.** Two y-axes invite a fabricated correlation. Use two small multiples
  or a slope graph instead.
- **Label endpoints directly.** Put the value at the end of the line / top of the bar
  (`.ux-bar__v`, `.ux-linechart .dot--end`). Don't make the reader interpolate against gridlines.
- **Never invent intermediate coordinates.** Don't draw a smooth curve through two measured points
  implying samples you don't have. Plot only the points you actually measured; connect with a
  straight segment, not a fabricated spline.
- **Small-n (≤4 values) → KPI row beats a chart.** Four bars is a table pretending to be a graph.
  Lead with the delta as a big number.

## The chart components that EXIST (CSS/SVG, dependency-free)

These three live in `core.css`. Everything beyond them is hand-authored inline SVG using theme
tokens — there is **no JS charting engine**. Bars are driven by `--v` / `[data-fill]` (via the
playground engine) or by static inline widths; lines and slopes are hand-authored SVG paths.

### Honest bar chart — `.ux-bars` + `.ux-bar`

```html
<div class="ux-bars">
  <div class="ux-bar">
    <span class="ux-bar__v">128ms</span>
    <div class="ux-bar__col" style="height:100%"></div>
    <span class="ux-bar__x">p50</span>
  </div>
  <div class="ux-bar">
    <span class="ux-bar__v">410ms</span>
    <div class="ux-bar__col is-focus" style="height:320%"></div>
    <span class="ux-bar__x">p99</span>
  </div>
</div>
```

Heights are CSS — set static `height:%` relative to the tallest bar, or let the playground engine
drive `[data-fill]` (writes `--v` 0..1; `data-fill-h` for height). `.ux-bars` has a fixed
`height:170px` with a `border-bottom` that IS the zero baseline — keep heights proportional to it.
Use `.ux-bar__col--good` for the semantic-good series and `.is-focus` for the one bar that carries
the point. Value labels (`.ux-bar__v`) ARE the direct endpoint labels — fill them.

### Line chart — `.ux-linechart` (hand-authored SVG)

```html
<svg class="ux-linechart" viewBox="0 0 320 140" preserveAspectRatio="none" aria-label="…">
  <line class="grid" x1="0" y1="120" x2="320" y2="120" />
  <path class="area" d="M0,90 L160,60 L320,30 L320,120 L0,120 Z" />
  <path class="line" d="M0,90 L160,60 L320,30" />
  <circle class="dot--end" cx="320" cy="30" r="3.5" />
  <text class="axis" x="318" y="22" text-anchor="end">42</text>
</svg>
```

`.line` / `.area` / `.grid` / `.dot--end` / `.axis` are themed via tokens (`--accent`,
`--accent-soft`, `--hairline`, `--text-faint`). Plot only measured points — each `L` is a real
sample. Direct-label the last point with `.dot--end` + a `.axis` `<text>`.

### Matrix heatmap — `.ux-matrix`

```html
<table class="ux-matrix">
  <tr><th></th><th>auth</th><th>api</th><th>db</th></tr>
  <tr><th class="row">auth</th>
    <td style="background:color-mix(in srgb,var(--accent) 60%,transparent)">6</td>
    <td style="background:color-mix(in srgb,var(--accent) 20%,transparent)">2</td>
    <td></td></tr>
</table>
```

Cell intensity = a `color-mix` of `--accent` (or a diverging pair) scaled to the value. Empty
cells = no relationship; leave them blank, don't fake a zero tint. Reorder rows/cols to surface
clusters. This is the form when a node-edge graph would be a hairball.

## Which form, when

- **Delta-led KPI row** (`.ux-kpis` / `.ux-kpi`): the lead for any metrics page. Big number +
  unit + `__trend`. ≤4 numbers → this is the whole chart.
- **Honest bar** (`.ux-bars`): comparing a handful of magnitudes on one axis, zero-baselined.
- **Line** (`.ux-linechart`): a trend over an ordered/continuous axis with several real samples.
- **Slope graph** (hand-authored 2-point SVG): rank-change across exactly two conditions — before
  vs after, control vs treatment.
- **Small multiples** (a `.ux-grid.ux-cols-auto` of small `.ux-linechart`s, shared scale): the
  same shape across >4 series. Never overplot them on one axis.
- **Ranked-bar magnitude profile** (`.ux-bars` sorted descending): a whole consumed by parts —
  perf profile, bundle size, cost breakdown. Beats a fake flamegraph unless there's true nesting.
- **Matrix heatmap** (`.ux-matrix`): dense pairwise magnitudes / coupling.

## GAPS (not yet in code)

- **No JS chart engine.** `charts.js` in the build plan (dependency-free SVG/CSS bars/line/slope/
  small-multiples/treemap with a numbers-ledger guard + axis-honesty enforcement) is **not built**.
  Today bars are static-height or `[data-fill]`-driven and lines/slopes are hand-authored SVG.
- **No anti-fabrication guard in code.** The numbers-ledger requirement and axis-honesty rules are
  authoring discipline you must enforce by hand; nothing refuses a fabricated coordinate or a
  truncated baseline at build/render time.
- **No slope-graph or small-multiples component / generator.** Both are hand-authored inline SVG
  with theme tokens.
- **No flamegraph or treemap component.** Use a ranked `.ux-bars` profile and state that nesting
  isn't shown.
- **No automatic axis/gridline/tick generation.** `.ux-linechart` ticks and `.ux-matrix` scales
  are placed by hand; there is no scale function to map data→pixels, so you must compute
  coordinates yourself (and only from measured points).
- **Live-region a11y announce for scrubbed values** (spec'd for sliders writing chart values): not
  present in the documented playground hooks.
