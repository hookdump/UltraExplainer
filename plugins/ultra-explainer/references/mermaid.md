# Mermaid in UltraExplainer

Mermaid is one tool in the UltraExplainer toolbox, not the default. Reach for it only when a relationship is genuinely non-linear and auto-layout earns its keep. For everything that fits a straight line, a grid, or a known shape, hand-build it — that is where UltraExplainer's variety and polish live.

This file tells you when to pick Mermaid, how to wire it into UltraExplainer so it inherits the theme, the exact diagram-shell markup the zoom/pan/expand behavior depends on, and the authoring rules that keep diagrams from breaking or rendering ugly.

---

## 1. When Mermaid is the right tool

Use Mermaid when the diagram has **real topology that you'd otherwise position by hand and get wrong**:

- **Branches and merges** — decision points with multiple outgoing paths that reconverge. A `lint` gate that splits into pass/fail and rejoins downstream.
- **Cycles** — retry loops, state machines that return to a prior node, feedback edges. Hand-routing a back-edge is painful; Mermaid does it.
- **Sequence diagrams** — lifelines with ordered messages between participants (`sequenceDiagram`). Request/response, handshakes, async call ordering.
- **State diagrams** — lifecycles and transitions (`stateDiagram-v2`).
- **ER diagrams** — tables and cardinality (`erDiagram`).
- **Class diagrams** — OOP models, domain objects with methods (`classDiagram`).

Do **NOT** use Mermaid for:

- **Straight sequences** — `A → B → C → D` with no branching. Build a flow strip out of `.ux-node` cards plus the connector engine (`.ux-graph` + `script.ux-edges`), or a `.ux-spine` rail. These re-theme live on toggle; Mermaid does not.
- **Dashboards / charts** — use `.ux-kpis`, `.ux-bars`, `.ux-donut`, `.ux-linechart`.
- **Tables** — use `.ux-table`.
- **Timelines** — use `.ux-timeline`.
- **Custom illustrations** — hand-author SVG.

Litmus test: if you could draw it as one row of boxes with arrows between adjacent boxes, it is NOT a Mermaid diagram. The moment you have a back-edge, a fork that reconverges, or a lifeline, Mermaid pays off.

A node-edge graph built from `.ux-node` + the connector engine is the UltraExplainer-native alternative for small-to-medium graphs. It gets routed arrows, hover-to-trace, glow, and live re-theming. Prefer it for graphs up to ~8 nodes where you control the layout; reach for Mermaid when auto-layout (dagre/elk) genuinely saves you from manual positioning.

---

## 2. UltraExplainer init

Mermaid theming in UltraExplainer rests on one hard fact: **`theme: 'base'` is the only theme where your `themeVariables` are honored.** The built-in `default`, `dark`, `forest`, and `neutral` themes ignore most overrides. Always set `theme: 'base'`.

Read the current theme from `data-theme` on `<html>` at load time and pick light/dark values accordingly. The FOUC-free head snippet has already resolved `data-theme` to `"light"` or `"dark"` before the stylesheet paints, so it is reliable by the time your module runs.

```html
<script type="module">
  import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";
  var light = document.documentElement.dataset.theme === "light";
  mermaid.initialize({
    startOnLoad: false,
    theme: "base",
    securityLevel: "loose",
    flowchart: { curve: "basis", htmlLabels: true, padding: 14 },
    themeVariables: {
      fontFamily: "'Space Grotesk', system-ui, sans-serif",
      fontSize: "15px",
      background: "transparent",
      primaryColor:       light ? "#ffffff" : "#141d30",
      primaryBorderColor: light ? "#2563eb" : "#60b2ff",
      primaryTextColor:   light ? "#0e1729" : "#e7edfb",
      lineColor:          light ? "#5b6b8c" : "#7f8db0",
      tertiaryColor:      light ? "#eef2fb" : "#0c1322",
      noteBkgColor:       light ? "#eef2fb" : "#162033",
      noteTextColor:      light ? "#0e1729" : "#e7edfb"
    }
  });
  mermaid.run({ querySelector: ".mermaid" }).then(initZoom);
</script>
```

### themeVariables → token mapping

`themeVariables` is static config — you cannot pass `var(--…)`, so you bake in literals. The values below are the **Luminous** preset's resolved tokens (the natural home for Mermaid's dark glass look); for another preset, read that preset's tokens from `assets/themes.css` and bake those instead. Always map to the semantic token, not a guessed hex.

| themeVariable | Dark (Luminous) | Light | maps to token |
|---|---|---|---|
| `primaryColor` (node fill) | `#141d30` | `#ffffff` | `--surface` |
| `primaryBorderColor` | `#60b2ff` | `#2563eb` | `--accent` |
| `primaryTextColor` | `#e7edfb` | `#0e1729` | `--text` |
| `lineColor` (edges) | `#7f8db0` | `#5b6b8c` | `--edge` |
| `tertiaryColor` (subgraph bg) | `#0c1322` | `#eef2fb` | `--bg` / `--surface-2` |
| `noteBkgColor` | `#162033` | `#eef2fb` | `--surface-2` |
| `noteTextColor` | `#e7edfb` | `#0e1729` | `--text` |
| `background` | `transparent` | `transparent` | shell shows through |
| `fontFamily` | `'Space Grotesk', …` | per preset | `--font-display` |

Keep `background: "transparent"` so the `.ux-diagram-shell` (and, on Luminous, the page field) shows through the SVG.

### Known limitation: no reactive re-theming

**Mermaid initializes once and bakes its colors into the rendered SVG. It cannot re-theme when the user flips the corner theme switcher.** The UltraExplainer switcher's theme button calls `redrawGraphs()`, which only redraws the native `.ux-graph` connector paths — it does not and cannot recolor a Mermaid SVG. This is a deliberate, accepted tradeoff.

Consequences you must design around:

- The Mermaid `themeVariables` are chosen from whatever `data-theme` was at **page load**. If the user toggles, the rest of the page recolors but the Mermaid SVG keeps its load-time colors.
- This is one more reason to prefer UltraExplainer-native node-edge graphs for anything you can lay out yourself — they follow the toggle.
- The CSS overrides on `.mermaid .nodeLabel` / `.edgeLabel` (below) DO use `var(--…)` with `!important`, so label *text color* does follow the toggle. Node fills, borders, and edge strokes do not. Accept the mild mismatch; do not try to re-run `mermaid.run` on toggle (it re-parses and flickers).
- Glow toggle (`data-fx`) does not touch Mermaid at all — Mermaid SVGs are flat by design and look correct in both glow and flat modes.

---

## 3. The diagram-shell markup

The zoom buttons, Ctrl/⌘ + wheel zoom, drag-to-pan, and expand-to-tab all key off this exact structure. Reproduce it verbatim; the `initZoom` routine queries these classes by name.

```html
<div class="ux-diagram-shell">
  <div class="ux-zoom-controls">
    <button data-zoom="in"     title="Zoom in"        aria-label="Zoom in">+</button>
    <button data-zoom="out"    title="Zoom out"       aria-label="Zoom out">−</button>
    <button data-zoom="reset"  title="Reset"          aria-label="Reset">⟲</button>
    <button data-zoom="expand" title="Open full size" aria-label="Open full size">⤢</button>
  </div>
  <div class="ux-mermaid-wrap">
    <div class="ux-mermaid-canvas">
      <pre class="mermaid">
flowchart TD
  push["git push"] --> lint{"lint &amp; types"}
  lint -->|pass| test["unit + integration"]
  lint -->|fail| block["block PR"]
      </pre>
    </div>
  </div>
  <span class="ux-zoom-label">100%</span>
</div>
```

Structure contract — `.ux-diagram-shell` **>** `.ux-zoom-controls` (the four `[data-zoom]` buttons) **+** `.ux-mermaid-wrap` **>** `.ux-mermaid-canvas` **>** `pre.mermaid`, with a sibling `.ux-zoom-label`.

What it gives you, all wired by `initZoom`:

- **Zoom buttons** — `data-zoom="in"` (×1.25), `"out"` (×0.8), `"reset"` (back to 100%), `"expand"` (clones the SVG into a new tab on the page `--bg`).
- **Ctrl/⌘ + wheel** — zooms toward the cursor. Plain wheel is left alone so the page still scrolls.
- **Drag-pan** — mousedown anywhere in `.ux-mermaid-wrap` (outside the controls) pans; `.is-panning` swaps the cursor to grabbing.
- **Live % label** — `.ux-zoom-label` updates as you zoom.

`initZoom` strips the SVG's hardcoded `height` and sets `max-width:100%` so the diagram is responsive inside the glass shell. Call it from the `.then()` of `mermaid.run(...)`, after the SVG exists. Multiple shells on one page are fine — `initZoom` iterates `.ux-diagram-shell`.

Render with `startOnLoad: false` + an explicit `mermaid.run({ querySelector: ".mermaid" })` so you control ordering and can hook `initZoom` afterward. Do not set `startOnLoad: true`; it races the zoom wiring.

---

## 4. Authoring guardrails

These rules are the difference between a diagram that renders and one that dumps raw source text onto the page.

**Cap at ~12 nodes, then split.** Past a dozen nodes, readability collapses even with zoom. Raise altitude (collapse detail into one node) or split into an overview diagram plus detail cards. Group related nodes with `subgraph` while under the cap.

**Multi-line labels use `<br/>`, never `\n`.** In flowcharts `<br/>` is a line break; a literal `\n` renders as the characters backslash-n.

```
A["Copilot Backend<br/>/api + /api/voicebot"]   %% right
A["Copilot Backend\n/api + /api/voicebot"]       %% wrong — prints \n
```

**Quote labels containing special characters.** Parentheses, colons, commas, brackets, ampersands, and shape-trigger characters (`/`, `\`, `(`, `{`) break the parser unless the label is wrapped in double quotes. A label starting with `/` is read as a parallelogram shape unless quoted.

```
CMD["/gallery command"] --> SRV["server"]
B["DB: query users"]
```

Use HTML entities for literal symbols inside labels — e.g. `&amp;` for `&` (as in `{"lint &amp; types"}`).

**Escape literal pipes as `#124;`.** A bare `|` delimits edge labels. If a node or edge label must contain a pipe, write `#124;` or rephrase to avoid it.

**`classDef` fills use 8-digit hex; never set `color:`.** `classDef` is static text — it cannot read CSS variables. Use semi-transparent 8-digit hex fills (`RRGGBBAA`) so the tint layers over Mermaid's base background and survives in both schemes. Use `22`–`44` alpha for subtle, `55`–`77` for prominent. **Never put `color:` in a `classDef` or per-node `style`** — it hardcodes a text color that breaks in the opposite scheme. Let the `.mermaid .nodeLabel { color: var(--text) }` override own text color.

UltraExplainer-palette `classDef` set (alpha-22 fills over the ramp + semantic colors):

```
classDef neutral fill:#3b82f622,stroke:#60b2ff,stroke-width:1.5px
classDef ok      fill:#2bd58a22,stroke:#2bd58a,stroke-width:2px
classDef warn    fill:#ffc55522,stroke:#ffc555,stroke-width:2px
classDef stop    fill:#ff5d6c22,stroke:#ff5d6c,stroke-width:2px
class push,test,build neutral
class ship,done ok
class retry warn
class block stop
```

(Omit `color:` from every line above — text color is handled in CSS.)

**Sequence-diagram messages cannot be quoted or escaped.** Unlike flowchart labels, the text after `:` in a `sequenceDiagram` is raw — quotes, `{}`, `[]`, `<>`, and `&` silently break the parser and the whole diagram renders as plain text. Write human-readable English, not code.

```
%% wrong
A->>B: web_search({ queries: [...] })
%% right
A->>B: Call web_search with queries
```

If you need multi-line labels or special characters in what would be a state diagram, build a `flowchart` instead — `stateDiagram-v2` has a strict transition-label parser that rejects `<br/>`, parentheses like `cancel()`, and extra colons.

**Prefer `flowchart TD` over `LR`.** Left-to-right spreads horizontally; with several nodes Mermaid scales everything down to fit the width and text becomes unreadable. Top-down uses vertical space and keeps labels legible. Use `LR` only for a genuinely simple 3–4 node linear pipeline. If the graph has any branching or more than one row, use `TD`.

**Keep IDs simple, readable text in the label.** IDs are alphanumeric, no spaces; put the human name in the quoted label: `userSvc["User Service"] --> authSvc["Auth Service"]`.

**Arrow semantics** — `-->` primary, `-.->`  optional/async/fallback, `==>` critical path, `--x` blocked/rejected, `-->|label|` decision branch.

**Don't use native `C4Context` / `C4Container`.** It hardcodes sharp corners, its own font, and inline colors that ignore `themeVariables`. Build C4 boundaries with `flowchart TD` + `subgraph` — that inherits all theme settings.

---

## 5. SVG insertion + namespace gotchas

**Never define a page-level `.node` class.** Mermaid renders every flowchart vertex into an SVG group with class `node` (and `.nodeLabel`, `.edgeLabel`, `.actor`, `.messageText`, `.er.entityBox`, `.cluster-label`). A stray `.node { … }` rule in your page CSS will bleed into the diagram and corrupt it. This is exactly why the UltraExplainer design system prefixes everything with `.ux-` — `.ux-node` is the UltraExplainer card, `.node` belongs to Mermaid. Keep that boundary; never style a bare `.node`, `.edge`, `.actor`, or `.cluster`.

**Scope your Mermaid CSS overrides under `.mermaid`.** These are the only overrides that reach inside the SVG, and they must stay namespaced:

```css
.mermaid { font-family: var(--font-body) !important; }
.mermaid .nodeLabel,
.mermaid .cluster-label .nodeLabel { color: var(--text) !important; }
.mermaid .edgeLabel { color: var(--text-dim) !important; background: transparent !important; }
.mermaid .edgeLabel rect { fill: var(--bg) !important; opacity: .85; }
```

The `.nodeLabel`/`.edgeLabel` color overrides are what make label text track the theme even though node fills are baked — this is why you must NOT set `color:` in `classDef` (a hardcoded `classDef` color would beat the `var(--text)` cascade and break in the opposite scheme).

**Insertion model.** With `securityLevel: "loose"` and `htmlLabels: true`, Mermaid emits HTML `<div>`-based labels inside `<foreignObject>` — that is what lets `.nodeLabel` respond to your CSS `color`. After `mermaid.run` resolves, the SVG lives inside `.ux-mermaid-canvas > pre.mermaid`; `initZoom` finds it via `canvas.querySelector("svg")`, removes its fixed `height`, and sets `maxWidth:100%`. Do not insert the SVG yourself or move it out of the canvas — the transform-based zoom is applied to `.ux-mermaid-canvas`, and `expand` clones `canvas.querySelector("svg")`.

**ELK layout is optional and separate.** `layout: 'elk'` needs a second import (`@mermaid-js/layout-elk`) plus `mermaid.registerLayoutLoaders(elkLayouts)`. Without both, `layout:'elk'` silently falls back to dagre. ELK adds real bundle weight; only import it when a genuinely dense graph positions badly under dagre. Most UltraExplainer diagrams (≤12 nodes) render fine on the default dagre engine — skip ELK.
