# Representations — routing & catalog

How to pick the form that carries the explanation, and which `.ux-*` component implements it.
Read this after the thesis and salience tiers are fixed, before you render. **Route on the JOB,
not the noun.** "It's an API" tells you nothing; "the reader must FEEL latency change as
concurrency rises" tells you everything.

## Routing procedure (run in this order, stop at the first that fits)

### 1. The MANIPULABILITY question — ask FIRST, it outranks everything

> *Is there a relationship the reader should FEEL by changing an input?*

If **yes**, the default is an **interactive form** — a parameter model, a step-through, or a
scenario toggle. A static chart of "latency vs. concurrency" tells; a slider that recomputes the
curve as you drag *teaches the shape of the function*. Reach for:
- a relationship over a continuous input (Big-O growth, cache hit-rate, retry/backoff, token
  bucket, latency budget) → **parameter-driven model** (`[data-playground]`).
- order + intermediate state are the meaning (algorithm mutating an array, request hopping
  services, a parse) → **step-through** (`[data-stepper]`).
- discrete configs that swap behavior (cache hot/cold, flag on/off, auth'd/anon) → **scenario
  toggle** (`.ux-seg[data-scenario-ctl]`).

**Interactivity must EARN its keep.** Never manufacture a slider for a one-sentence answer. If the
truth is genuinely static (a verdict, a fixed topology, a finished comparison), fall through to the
static forms below. The anchor discipline is the toll: every range/default/formula must trace to a
const/config/measured curve **or** be stamped `illustrative model, not measured`. An interactive lie
is worse than a static one.

### 2. Data-shape × cognitive-job (the main router)

If manipulability is "no", choose by what the data *is* crossed with what the reader must *do*:

| Data shape | Cognitive job | Form |
|---|---|---|
| one claim / verdict | decide / accept | typographic thesis hero |
| a true linear sequence | follow the order | flow strip / spine |
| non-linear relationships | trace structure | node-edge graph (≤12 nodes) |
| dense pairwise relations | find clusters | matrix heatmap |
| a code change | judge the delta | annotated diff + verdict |
| expected vs actual | locate the fork | two-track timeline |
| a misconception | unlearn then relearn | naive-vs-correct panels |
| two-axis options | compare / rank | comparison table |
| quantitative metrics | grasp magnitude/trend | KPI row + lean chart |
| whole consumed by parts | see proportion | ranked-bar magnitude profile |
| commentary beside artifact | read without breaking flow | sidenote-annotated figure |

### 3. Content-type lookup — quick fallback ONLY

Use the noun ("it's a state machine → state table") only as a last-resort shortcut when steps 1–2
were inconclusive. It was v1's PRIMARY router and that was the bug: it drifts to template slop.
Subordinate it.

## Lowest-ink law

Pick the **lowest-ink form that does the job**. More ink is not more rigor.

- labeled list **>** flow strip **>** flowchart
- KPI row **>** chart (≤4 numbers never earn a chart)
- table **>** prose for any two-axis comparison
- **Encode magnitude quantitatively, not as equal boxes.** Three boxes the same size that
  actually differ 10×/3×/1× is a lie of layout. Use bar length / KPI value.
- **Reserve node-edge graphs for genuinely non-linear structure** (branching, merging, cycles),
  ≤12 nodes, hot path emphasized, siblings abstracted (×12). Above ~12 nodes / ~20 edges a
  **matrix beats a hairball**. A linear pipeline is a spine, never a graph.
- Exactly one T0 focal point per page; everything else is T1/T2.

---

## The representation catalog

Each entry: when to use → the `.ux-*` component(s) that implement it.

### Typographic thesis hero
**When:** one dominant takeaway, a yes/no, an executive verdict. The most under-used best form —
set the claim large and manufacture *no* diagram.
**Implements with:** `.ux-thesis` (+ `.lit` / `.lit--grad` to color the load-bearing phrase),
`.ux-kicker`, `.ux-lede`. This is the minimum-viable-explainer; often the whole T0.

### Numbered/labeled flow strip (single-axis)
**When:** a TRUE linear sequence — pipeline, request lifecycle, ordered steps, **no branching**. A
flowchart here is chartjunk.
**Implements with:** `.ux-spine` + `.ux-spine__node` (vertical), or `.ux-timeline` /
`.ux-tl-item` when the axis is time. `.is-active` / `.is-done` mark progress.

### Node-edge graph with routed connectors (+ hover-to-trace)
**When:** relationships ARE the explanation — branching/merging/cyclic flow, dependency fan-out,
topology. ≤12 nodes, hot path emphasized, siblings abstracted (×12). Reserve for genuinely
non-linear structure; if it's a hairball, use the matrix instead.
**Implements with:** `.ux-graph` (`__edges` svg + `__layer` grid of `.ux-node`), `.ux-epath`
for strokes. Edges come from a `script.ux-edges` JSON `[{from,to,color,dashed}]`; `initGraph`
routes beziers by node id and wires hover-to-trace (`.is-hot` / `.is-dim` / `.is-faded`).

### Adjacency / coupling matrix heatmap
**When:** dense pairwise relations where a graph becomes a hairball (>~12 nodes / >~20 edges) —
module coupling, co-change, confusion matrix. Reorder rows/cols to surface clusters.
**Implements with:** `.ux-matrix` table; cell intensity from a per-cell background tinted with
`color-mix(... var(--accent) N%)`. Illegal/empty pairs are blank cells.

### Themed Mermaid (zoom/pan/expand shell)
**When:** a large / generated / naturally-Mermaid-shaped graph (big flowchart, sequence, ER,
state, class) where hand-placement is impractical. Theme it to the active language — never default
Mermaid colors.
**Implements with:** `.ux-diagram-shell` → `.ux-mermaid-wrap` → `.ux-mermaid-canvas` +
`.ux-zoom-controls` / `.ux-zoom-label`. Mermaid source goes in a `<script type="text/plain">`.

### Annotated diff + verdict (from real git diff)
**When:** a code change / PR — 2–3 decisive hunks, plain-language behavioral delta, file:line +
git SHA anchors, full diff collapsed in T2. **Ingest real diff output; never retype it.**
**Implements with:** `.ux-diff` (`__bar` / `__file` / `__branch` / `__tally`; `__scroll` →
`__row` / `__row--add` / `__row--del` with `__ln` / `__gut` / `__code`), `.ux-annot`
(`__pin` / `__body`) for inline notes, closed by `.ux-verdict` (`__t` / `__d` + `.ux-check`).

### Two-track divergence timeline
**When:** a bug/failure/incident — expected vs actual path with the **divergence point as the
single focal node**. The aha IS the fork.
**Implements with:** `.ux-timeline` for each track (or two `.ux-spine`s) with the fork node
marked focal (`.ux-tl-item.is-risk` or a `--focal` node); `.ux-compare` works when it reduces to
a clean expected-vs-actual pair.

### Naive-vs-correct paired panels + worked example
**When:** teaching / correcting a misconception — label the wrong panel "what you'd expect", show
why it's tempting, then trace ONE concrete example with real values.
**Implements with:** `.ux-compare` (`__side--before` tagged wrong / `__side--after` tagged
correct, via `.ux-compare__tag`). Follow with a `[data-stepper]` or `.ux-codeblock` worked trace.

### Topology overview + detail cards (hybrid)
**When:** system/module architecture — a ≤10-node overview on the dependency axis + per-module
cards anchored to real dirs/files. Edges only where imports/calls actually exist.
**Implements with:** `.ux-graph` overview + a `.ux-grid.ux-cols-auto` of `.ux-card`
(`__title` / `__desc`), each carrying its file:line anchor chip.

### State table or stateDiagram
**When:** a state machine / lifecycle. ≤8 states → a Mermaid `stateDiagram`; more → a
from-by-event-to matrix. Illegal transitions are empty cells unless the thesis is about them.
**Implements with:** themed Mermaid (`.ux-diagram-shell`) for the small case, `.ux-matrix` or
`.ux-table` for the from/to grid.

### Semantic comparison / audit table (sort + filter)
**When:** a two-axis comparison or capability/coverage matrix — recommendation marked,
conditional-format cells as a mini-heatmap, inferred cells flagged.
**Implements with:** `.ux-table` (+ `.ux-table-wrap` / `-scroll`), `th[data-sort]` for sortable
columns, `.num` cells for tabular-nums, `.is-flag` / `.is-warn` rows. Pair with
`input[data-ux-filter]` + a `[data-ux-count]` "shown/total" readout.

### Delta-led KPI row + honest lean chart
**When:** quantitative metrics — lead with the delta as a big number (value + unit + source +
as-of), then the leanest honest chart. ≤4 numbers → KPI row beats a chart.
**Implements with:** `.ux-kpis` / `.ux-kpi` (`__val` / `__label` / `__trend`, `--focus` /
`--up` / `--down`), then `.ux-bars` or `.ux-linechart`. See `charts-honesty.md`.

### Small multiples / slope graph
**When:** compare the same shape across many series (>4 series → small multiples) or rank-change
across two conditions (slope graph). The two highest-leverage Tufte forms.
**Implements with:** a `.ux-grid.ux-cols-auto` of repeated small `.ux-linechart`s (small
multiples); a slope graph is a 2-point hand-authored inline `<svg>` using theme tokens. *(No JS
small-multiple/slope generator exists — see GAPS.)*

### Flame / treemap / ranked-bar magnitude profile
**When:** a WHOLE consumed by parts sized by a metric — perf profile, bundle size, cost breakdown.
Ranked bars beat a fake flamegraph unless there's true stack nesting.
**Implements with:** `.ux-bars` / `.ux-bar` (`__col` / `__v` / `__x`) sorted descending, widths
driven by `[data-fill]`/`--v`. *(No flamegraph or treemap component — see GAPS.)*

### Current→target block + risk-tiered timeline
**When:** a plan / roadmap / migration / proposal — reality-vs-target contrast, then a timeline
whose beats are the arc; risky/irreversible steps emphasized and anchored or marked "proposal".
**Implements with:** `.ux-compare` for current→target, then `.ux-timeline` with `.is-risk` on
the irreversible beats.

### Sidenote-annotated figure
**When:** dense explanation where commentary must sit beside the artifact without breaking the
read. Native to Notebook (Tufte marginalia).
**Implements with:** `.ux-sidenote-layout` (content column + wide margin) holding `.ux-sidenote`
notes; collapses to stacked under 900px.

### Viewport-fit slide deck
**When:** an explicitly requested presentation — 100dvh slides, big type, one idea per slide, with
a source-coverage map proving nothing was dropped to fit a count.
**Implements with:** scroll-snap slide sections (see `slides.md` playbook). *(No dedicated
`.ux-slide` component in core.css — see GAPS.)*

### Custom inline SVG illustration
**When:** the escape hatch — a vector-space diagram, geometric proof, bespoke schematic, when no
component fits.
**Implements with:** inline `<svg>` whose `fill`/`stroke` reference **theme tokens**
(`var(--accent)`, `var(--text)`, `var(--hairline)`) so it follows the active language and both
light/dark tunings. Never hardcode hex.

### Parameter-driven model / playground
**When:** a quantitative or causal relationship the reader should FEEL by changing an input.
EARN it only when every range/default/formula is anchored or stamped "illustrative model".
**Implements with:** `[data-playground]` — `.ux-state` JSON seeds state, `data-derive="fn"`
points to `window.fn(state)`, `[data-param]` inputs write state on input, `[data-show]` /
`[data-fill]` (sets `--v`) / `[data-out]` render outputs, `data-fmt` formats. UI from
`.ux-control` / `.ux-slider`.

### Step-through walkthrough (code↔data stepper)
**When:** order + intermediate state are the meaning. Each step highlights the active code line
AND the live data state in lockstep.
**Implements with:** `[data-stepper]` — `.ux-steps` JSON `[{cap, code?, show?}]`, `[data-step]`
prev/next/reset buttons (+ arrow keys), `.ux-codeblock` with `.l` lines that get `.is-active`,
`[data-step-cap]` / `[data-step-n]` readouts. UI chrome from `.ux-stepper` / `.ux-step-cap`.

### Scenario toggle / scrollytelling
**When:** a system behaves differently across discrete configs, or a guided argument transforms
one persistent visual as the reader scrolls. Both drive the same shared `update()`.
**Implements with:** `.ux-seg[data-scenario-ctl]` buttons set `data-scenario` on a
`data-target`; CSS attribute selectors do the visual swap, `[data-step-show]` toggles visibility,
and `Ultra.redrawGraphs()` re-routes any graphs. *(Scroll-driven scrollytelling controller is
spec'd but not wired — see GAPS.)*

## GAPS (not yet in code)

- **Predict-then-reveal widget** (the TEACH-mode commitment component): in the spec's
  interactivity primitives, but no `.ux-*` class or JS hook exists in core.css / ux.js.
- **Scrollytelling controller** (IntersectionObserver toggling `.is-active` on step blocks read
  by a sticky visual): `initScenarios` covers segmented-control toggles only; there is no
  scroll-spy-driven scenario driver. `initNav` is scroll-spy for the section *nav*, not for
  driving `update()`.
- **Slope-graph / small-multiples generator**: no JS or component builds these; today they are
  hand-authored inline SVG or repeated `.ux-linechart`s.
- **Flamegraph / treemap component**: none. Use ranked `.ux-bars` and say so.
- **Dedicated slide component**: no `.ux-slide` / scroll-snap deck class in core.css; slides rely
  on the build/playbook layer, not the component contract.
- **Hover/focus-to-trace as a generic coordinated-view broadcast** (`data-key` across table rows /
  chart points / graph nodes): implemented for the graph (`initGraph` hover-to-trace) only; the
  cross-component broadcast is spec'd but not built.
- **Copy-anchor / jump-to-source chips** (file:line → GitHub/editor links): spec'd; no
  `anchors.js` hook present in the documented `boot()` set.
