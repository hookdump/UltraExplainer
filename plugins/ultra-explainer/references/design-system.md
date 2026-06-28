# Aurora — the UltraExplainer design system

You are generating a self-contained HTML "visual explanation". Aurora is the canonical look. This document is both your instruction set and your copy-paste token reference. Every class and variable named here is real — it lives in `plugins/ultra-explainer/assets/aurora.css` and `aurora.js`. Do not invent tokens. If you need a value, use one of these; if you need a new glowing effect, route it through an `--fx-*` variable (see "Adding glow to a new element").

Class prefix is `.ux-`. It exists to avoid colliding with Mermaid's `.node` and generic framework `.card`. Never drop the prefix.

---

## 1. Philosophy

**Clarity first. Glow is a layer, not the identity.** Aurora reads as a precise, premium technical document that happens to be lit. The thing a reader must take away is the *structure* — the graph, the diff, the dashboard, the comparison. Light is there to direct attention along that structure, never to decorate emptiness.

**The identity is visualization variety, not "cards with a halo".** A good Aurora page reaches for the right primitive: node-edge graphs with routed, arrowed connectors (`.ux-graph`); diffs with gutters and verdicts (`.ux-diff`); dashboards and charts (`.ux-kpi`, `.ux-bars`, `.ux-donut`, `.ux-linechart`); custom inline SVG illustrations; timelines (`.ux-timeline`, `.ux-spine`); and Mermaid when a generated graph is genuinely the clearest option. Reaching for a flat stack of `.ux-card`s every time is a failure of imagination, not a style.

**Glow is budgeted and toggleable.** Every luminous effect flows through an `--fx-*` variable. That makes glow a single switchable layer: `[data-fx="flat"]` reassigns those variables to `none` (or to a crisp 1px ring) and the page becomes a calm, premium *flat* rendering with all structure, color, and depth intact. Because glow is budgeted, spend it on the focal point — the resolved node, the winning KPI, the one beam carrying the request — not on every border.

**The narrative ramp is a color grammar.** Aurora encodes a left-to-right story:

- **INPUT → azure** (`--azure`, `--azure-bright`): where data enters, the request, the "before".
- **TRANSIT → cyan** (`--cyan`, `--cyan-soft`): work in flight, focus, the active edge, the thing being examined.
- **RESOLVED → green** (`--green`, `--green-bright`): the settled result, success, the "after".

Use the ramp to mean something. An input node is azure (`data-accent="azure"`), the processing hop is cyan, the datastore/result is green. `--violet` is a *rare* structural accent for sidecar/guard concerns (auth, rate limiter); `--gold` is a warm rim tone. Do not paint things rainbow — the ramp is a sequence, and a reader should be able to follow azure → cyan → green as a sentence.

---

## 2. The theme system

Two orthogonal attributes on `<html>` control everything:

- `data-theme="dark"` (Aurora Night, default) or `data-theme="light"` (Aurora Day).
- `data-fx="glow"` (default) or `data-fx="flat"`.

These are independent: any of the four combinations is valid and tuned. There is no media-query duplication — themes are pure variable reassignment in `:root` and `:root[data-theme="light"]`.

### FOUC-free head resolver (required, verbatim, in `<head>` BEFORE the stylesheet)

This sets the attributes before first paint so there is no flash. Every template ships exactly this:

```html
<script>(function(){var d=document.documentElement,s=window.localStorage;
var t=null;try{t=s.getItem('ux-theme')}catch(e){}
d.dataset.theme=(t==='light'||t==='dark')?t:(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');
var f=null;try{f=s.getItem('ux-fx')}catch(e){}
d.dataset.fx=f==='flat'?'flat':'glow';})();</script>
```

It honors a saved choice (`ux-theme`, `ux-fx` in `localStorage`), otherwise follows the OS `prefers-color-scheme`, and is wrapped in `try/catch` so a blocked `localStorage` cannot break the page. With no JS at all, the CSS defaults (`color-scheme: dark`, glow on) still render correctly.

### The corner switcher

`aurora.js` auto-builds a fixed switcher (`.ux-fxbar`) in the top-right with two buttons: a theme toggle (night/day) and a glow/flat toggle. It writes the choice to `localStorage` and, on theme change, calls `redrawGraphs()` so connector geometry stays correct. It is a no-op if the page already contains a `.ux-fxbar`, or if `<html>` carries `data-no-switcher`. **Ship the switcher on every page** — it is part of the contract that glow is the reader's choice, not yours.

### What flat mode is (and is not)

`:root[data-fx="flat"]` keeps structure, color, and depth and removes only the *bloom*. Concretely it reassigns the `--fx-*` layer: rim conic-gradients and bloom shadows become `none`; node glow shadows become a crisp single-color 1px ring via `color-mix` (e.g. `--fx-node-input: 0 0 0 1px color-mix(in srgb, var(--azure) 45%, var(--hairline-bright))`); `--fx-edge-glow`, `--fx-gutter-add/del`, KPI/bar text-glows, the donut `drop-shadow`, and the corner `--nebula-*` washes all go to `none`; `--fx-field-opacity` and `--fx-spark-display` switch off the particle field and the animated beam packet. The page must still look intentional and complete in flat mode. **Design for flat first, then let glow enhance** — if your layout only reads with the bloom on, the structure is too weak.

---

## 3. Token vocabulary

All values below are the Aurora Night defaults. Aurora Day (`:root[data-theme="light"]`) retunes the same names — it is *not* an inversion (it lowers glow-triplet brightness, drops nebula opacity, flips shadows to cool blue-grey). Always reference the variable, never a hardcoded hex, so both themes follow.

### Canvas & surfaces

| Token | Role |
|---|---|
| `--bg` `#05070d` / `--bg-2` `#070a12` | Page background; blue-biased near-black, never pure `#000`. |
| `--surface` | Primary glass panel (`.ux-panel`). |
| `--surface-2` | Nested cards, KPIs, table headers. |
| `--surface-raised` | Chips, popovers, comment cards, spine dots. |
| `--recessed` | Code wells, diff body — reads as cut *into* the surface. |
| `--surface-solid` `#0d1220` | Opaque fallback when `backdrop-filter` is unsupported (applied via `@supports`). |
| `--glass-blur` `18px` | Backdrop blur radius. |

### Hairlines (borders)

| Token | Role |
|---|---|
| `--hairline` | Default 1px border on nearly everything. |
| `--hairline-bright` | Emphasis border / sticky-header underline. |
| `--hairline-rim` | Brightest rim tone, used inside rim gradients. |

### Text

| Token | Role |
|---|---|
| `--text` `#e7edfb` | Body and headings; cool off-white, never `#fff`. |
| `--text-dim` | Secondary prose, descriptions, captions. |
| `--text-faint` | Labels, axis ticks, line numbers, muted meta. |

### The accent ramp (narrative)

INPUT → `--azure-deep`, `--azure`, `--azure-bright`. TRANSIT → `--cyan`, `--cyan-soft`. RESOLVED → `--green-deep`, `--green`, `--green-bright`. Each has a tint wash for fills: `--azure-wash`, `--cyan-wash`, `--green-wash`. Rare structural accent: `--violet` + `--violet-wash`. Warm rim tone: `--gold`. Default connector stroke: `--edge`.

### Semantic state (distinct from the ramp)

Diffs and status use their own palette so "added code" never reads as "the resolved step": `--add` / `--add-wash` / `--add-gutter`, `--remove` / `--remove-wash` / `--remove-gutter`, `--warn` / `--warn-wash`. Keep diff-green (`--add`) conceptually separate from ramp-green (`--green`) even though they look similar.

### Glow primitives (R,G,B triplets — alpha at the usage site)

These are bare `R, G, B` triplets, **not** colors. You wrap them in `rgba(var(--glow-x), <alpha>)` wherever you need them, so one triplet serves many opacities:

```
--glow-azure: 96, 178, 255;   --glow-cyan: 56, 224, 230;   --glow-green: 92, 242, 173;
--glow-violet: 167, 139, 250; --glow-gold: 245, 196, 81;   --glow-red: 255, 93, 108;
```

Composite, rationed text-glows are pre-built from them: `--glow-soft-azure`, `--glow-soft-cyan`, `--glow-soft-green`, `--glow-soft-red`. (In flat mode these become `none`.)

### The `--fx-*` toggleable glow layer

This is the heart of the system: **every glow assignment indirects through an `--fx-*` variable**, and flat mode reassigns the whole set. The real ones:

- Rim/panel: `--fx-rim` (the focal panel's conic rim, `--rim-light`), `--fx-rim-bloom` (its outer bloom).
- Beams/edges: `--fx-beam-glow` (kicker line, beam core, chart lines), `--fx-edge-glow` (graph connector `drop-shadow`), `--fx-spark-display` (animated beam packet on/off).
- Nodes: `--fx-node-input` (azure), `--fx-node-output` (green), `--fx-node-focus` (cyan) — applied alongside `--shadow-card` on `.ux-node[data-accent=…]`.
- Diff gutters: `--fx-gutter-add`, `--fx-gutter-del`.
- Resolution marks: `--fx-check` (the verdict checkmark ring), `--fx-dot-success` (success status dots).
- Dashboard: `--fx-kpi-green` / `--fx-kpi-azure` / `--fx-kpi-cyan` / `--fx-kpi-red` (KPI value text-glow), `--fx-bar-glow` / `--fx-bar-glow-g` (bar columns), `--fx-avatar`.
- Backdrop: `--fx-field-opacity` (particle canvas opacity).

### Shadows, radii, motion

Shadows: `--shadow-panel` (deep, layered, for `.ux-panel`/tables), `--shadow-card` (lighter, for cards/nodes/KPIs), `--shadow-inset`. Radii: `--radius` `16px`, `--radius-md` `12px`, `--radius-sm` `9px`. Motion: `--motion-fast` `180ms`, `--motion-mid` `340ms`, `--ease` `cubic-bezier(0.2, 0.9, 0.3, 1)`. Corner washes: `--nebula-azure`, `--nebula-green`, `--nebula-violet` (composited onto `body`).

### Adding glow to a new element (keep it toggleable)

Never put a raw `box-shadow: 0 0 …` glow directly on an element — that glow would survive flat mode and break the contract. Instead:

1. Declare a new `--fx-yourthing` in `:root` using a glow primitive, e.g.
   `--fx-yourthing: 0 0 22px -4px rgba(var(--glow-cyan), .6);`
2. Override it under flat to a non-glowing equivalent (usually a crisp ring or `none`):
   `:root[data-fx="flat"] { --fx-yourthing: 0 0 0 1px var(--hairline-bright); }`
3. Reference it on the element: `.ux-yourthing { box-shadow: var(--shadow-card), var(--fx-yourthing); }`

Follow the existing naming (`--fx-node-*`, `--fx-kpi-*`) and pick the ramp color that matches the element's narrative role.

---

## 4. Typography

Three roles, each with system fallbacks that **must look correct if the webfont never loads** — this is a hard rule. The page loads Space Grotesk / Inter Tight / JetBrains Mono from Google Fonts, but those can fail (offline, blocked, file:// open). The fallback stacks are tuned so a webfont failure degrades gracefully, never to Times New Roman.

- `--font-display`: `"Space Grotesk", "Segoe UI", system-ui, -apple-system, sans-serif` — headings, KPI values, thesis.
- `--font-body`: `"Inter Tight", "Inter", system-ui, -apple-system, "Segoe UI", sans-serif` — prose.
- `--font-mono`: `"JetBrains Mono", "SF Mono", ui-monospace, Consolas, monospace` — labels, kickers, code, data, axis ticks.

Roles and their scale (use the class, do not re-roll sizes):

| Class | Use | Notable |
|---|---|---|
| `.ux-thesis` | The one big statement | `clamp(30px,4.6vw,54px)`, display. Wrap the key phrase in `.lit` for the cyan→green gradient text. |
| `.ux-h2` / `.ux-h3` | Section / subsection | display, balanced wrap. |
| `.ux-lede` | Standfirst under thesis | dim, `max-width:62ch`. |
| `.ux-kicker` | Above a thesis | mono, cyan-soft, has a glowing lead line. |
| `.ux-section-title` | Section divider | mono uppercase + trailing hairline rule. |
| `.ux-eyebrow` / `.ux-label` | Micro-labels | mono uppercase. `.ux-label--{azure,cyan,green,violet,warn}` color the dot to the ramp. |
| `.ux-prose` | Paragraph body | dim, `max-width:68ch`; `.ux-strong` / `strong` lifts to `--text`. |
| `code` / `.ux-code-inline` | Inline code | mono, cyan wash, `overflow-wrap:anywhere`. |

Mono is the system's "instrument label" voice — uppercase, letter-spaced. Use it for anything that names or measures (labels, KPIs, axis ticks, chips). Reserve display for statements and big numbers. Numeric values use `font-variant-numeric: tabular-nums` (already set on KPI/table/chart values).

---

## 5. Motion & accessibility

These are non-negotiable; the CSS already implements them, so honor them rather than overriding.

- **`prefers-reduced-motion`**: a global rule kills all animation/transition/scroll-behavior; the beam spark and the check-draw animation also self-disable. Do not add JS-driven motion that ignores this; `aurora.js` reads `matchMedia("(prefers-reduced-motion: reduce)")` and skips the particle loop. Entrance motion uses `.ux-rise` with a staggered `--i` index — fine to use, it respects the reduced-motion kill.
- **`:focus-visible`**: every focusable element gets `2px solid var(--cyan)` with offset. Keep real `<button>`/`<a>`/`<input>` elements (tabs, switcher, filter input are real buttons/inputs) so focus works; never strip the outline.
- **Contrast**: text tokens are tuned for AA on their intended surfaces in both themes. Put `--text-dim` on `--surface`/`--surface-2`, not on washes; do not place `--text-faint` on glowing fills. In Aurora Day the same class names already carry darker accents — trust the variables.
- **No horizontal scroll**: `body` is `overflow-x: hidden` and every flex/grid child has `min-width: 0`. Wide content must scroll *inside its own container*, not the page: use the provided `.ux-diff__scroll`, `.ux-table-scroll`, and `.ux-tree` (each is `overflow-x: auto`). Never let a wide table, diff, or code line push the body sideways.
- **Self-contained**: inline all CSS/JS; the only external request is the font stylesheet, and the page is designed to survive its failure (see §4).

---

## 6. Anti-cheese discipline

These rules keep Aurora reading as a precise instrument rather than a glowing toy. Treat them as constraints, not suggestions.

- **Earn the glow.** Glow marks the focal point — the resolved node, the winning KPI, the active beam. If everything glows, nothing does. Most borders should be a plain `--hairline`.
- **At most one rim-lit focal panel per view.** `.ux-panel--rim` (the conic `--fx-rim` + `--fx-rim-bloom`) is the single brightest object on screen. One per page, reserved for the hero/result.
- **No glow on body text.** Text-glow is rationed to KPI values and the `.lit` thesis phrase. Never apply `--glow-soft-*` to paragraphs, table cells, or descriptions.
- **The ramp means something.** Azure = input, cyan = transit, green = resolved. Don't color by vibe. Don't use violet as a fourth "fun" color — it is for sidecar/guard concerns only. Don't go rainbow.
- **Reach past cards.** Before emitting a stack of `.ux-card`s, ask whether a graph, diff, dashboard, comparison, timeline, or custom SVG would carry the idea better. Card stacks are the lazy default; variety is the identity.
- **Pass the flat test.** Toggle the design in your head to `data-fx="flat"`: structure, hierarchy, and the color story must all survive with zero bloom. If it falls apart flat, the layout — not the glow — needs fixing.
- **Never `#fff` / `#000`.** Use `--text` and `--bg`. Pure black/white shatters the glass aesthetic.
- **Don't hand-roll tokens.** Use the variables and `.ux-` classes. New glow goes through a new `--fx-*` var (see §3) so it stays toggleable. Bespoke one-off shadows that ignore flat mode are the cardinal sin.
- **Don't fake data or precision.** Tabular-nums and tidy KPIs invite invented numbers; only render values you were given. An honest empty state beats a glowing fake metric.
