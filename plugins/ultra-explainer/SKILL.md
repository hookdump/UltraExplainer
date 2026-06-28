---
name: ultra-explainer
description: Generate strikingly clear, self-contained HTML visual explanations of code, systems, diffs, plans, data, and concepts. Use for architecture diagrams, node-edge graphs, diff/PR reviews, plan reviews, dashboards, comparison tables, slide decks, project recaps, and concept explainers. Produces one self-contained .html file with the "Aurora" design system — node-edge graphs with routed arrows, annotated diffs, charts, custom SVG illustrations, and themed Mermaid — with an optional glow layer and light/dark themes the reader can toggle.
license: MIT
metadata:
  author: hookdump
  version: "0.1.0"
  homepage: https://github.com/hookdump/UltraExplainer
---

# UltraExplainer

Turn code, systems, diffs, plans, data, and concepts into a single self-contained HTML page that makes the **one important idea** obvious in the first screenful — then proves it with anchored evidence. UltraExplainer is two things working together:

1. **A synthesis method** (the brain) — how to decide *what* to show, what to emphasize, what to cut, and how to never draw structure that isn't in the source. See `references/synthesis-method.md`.
2. **The Aurora design system** (the craft) — a dark/light glass aesthetic with a rich visualization vocabulary (node-edge graphs with real routed arrows, annotated diffs, dashboards/charts, custom SVG illustrations, timelines, themed Mermaid). Glow is an **optional, toggleable layer**, not the point. See `references/design-system.md` and `references/components.md`.

> Identity: **clarity + sophisticated visualization.** Not "everything glows," not "boxes-and-arrows soup," not "a wall of cards."

## When to use this skill

Reach for an HTML page whenever the output is inherently visual or relational and ASCII/Markdown would mangle it:

- A diagram, architecture overview, or **node-edge graph** of how something connects or flows.
- A **diff / PR review** (changed code + why it matters + blast radius).
- A **plan review** (requirements vs. implementation), audit, or comparison matrix.
- A **dashboard** of metrics, or any table with 4+ rows / 3+ columns.
- A **slide deck**, a **project recap** for context-switching, or a **concept explainer** that teaches a mechanism.

If the honest answer fits in one sentence or a single number, say it in chat — do **not** manufacture a page (see the minimum-viable-explainer rule in the method). When you do build, give a one-line chat summary and deliver the file.

## Delivery rules

- Output **one complete, self-contained HTML document** (`<!DOCTYPE html> … </html>`). Inline all CSS and JS.
- Write it to the explicit eval/output path if given, else to `~/.agent/diagrams/<descriptive-name>.html` (or the current working dir if that's unavailable). Use a descriptive filename.
- Open it in the browser when running interactively (`open` on macOS, `xdg-open` on Linux). Mention the path in chat.
- The only external requests are Google Fonts and (when used) the Mermaid CDN. The page must still look right if those fail — fonts have system fallbacks and the layout never depends on them.

## How to build a page (assembly)

Every page is assembled from the canonical assets so the look is consistent and the toggles work:

1. `<head>`: the font links, then the **FOUC-free resolver** script (sets `data-theme` and `data-fx` before paint), then `<style>` with the full contents of `assets/aurora.css` inlined.
2. `<body>`: `<div class="ux-field" aria-hidden="true"><canvas></canvas></div>` (the particle backdrop), then your content using `.ux-` components.
3. Before `</body>`: `<script>` with `assets/aurora.js` inlined (it auto-builds the theme/glow switcher, wires the connector engine, tabs, filters, and the particle field).

**The fastest path: copy a template from `templates/` and adapt it.** Each is a complete, self-contained example of one representation:

| Template | Use for |
|---|---|
| `templates/architecture-graph.html` | systems, services, request flow — **node-edge graph with routed arrows** + hover-to-trace |
| `templates/diff-review.html` | a code change: annotated diff + comment connector + verdict + blast radius |
| `templates/dashboard.html` | metrics: focal-glow KPIs + area/bar/donut charts + table |
| `templates/concept.html` | teaching a mechanism: **custom SVG illustration** + naive-vs-correct + worked example |
| `templates/data-table.html` | audits, comparisons, requirement matrices: glass table + live filter + status badges |
| `templates/mermaid.html` | flowcharts, sequence, state, ER, class — **themed Mermaid** with zoom/pan/expand |
| `templates/slides.html` | a presentation: full-viewport deck with keyboard/scroll nav |

> CRITICAL when inlining `aurora.js` (or any JS): escape every literal `</script>` inside it as `<\/script>` or it will close the tag early and dump source onto the page.

## The method, in brief

Read `references/synthesis-method.md` before generating anything non-trivial. The short form:

1. **Charter** — one sentence: "This explains *\<artifact\>* at altitude *\<A0–A4\>* for *\<audience\>* so they can *\<job\>*." Hold one altitude.
2. **Thesis with tension** — one declarative claim the reader doesn't yet know (not a topic). Pick the spine (the single axis the eye follows: data-flow, control-flow, causal, temporal, dependency, comparison).
3. **Evidence ledger** — read the real source; for every node/edge/label/number record `{claim, anchor (file:line / symbol / git ref / metric+date), confidence (verified|inferred|assumed)}`. **No anchor → it doesn't render as fact.**
4. **Reconcile** — hold the thesis against contradicting evidence; revise, scope, or *show* it. Never silently drop it.
5. **Minimum-viable check** — don't over-render. Simple answer → hero sentence + one visual.
6. **Salience tiering** — T0 (thesis + spine, **≤3**, the only tier that may glow) / T1 (load-bearing support, **≤7**) / T2 (receipts, hidden in `<details>`/hover). Over a cap → split the view or demote, **never shrink-to-fit**.
7. **Represent** — pick the **lowest-ink form** that does the job (labeled list > flow strip > flowchart; KPI row > chart; table > prose). Encode magnitude *quantitatively* (size/length/position), not equal boxes.
8. **Compress** — omission is the craft; collapse repetition ("×12 handlers"); excerpt the load-bearing lines, not whole files.
9. **First-viewport gate** — a cold reader can restate the thesis from the first screen; exactly one focal point; a visible reason to scroll.
10. **Self-audit** — re-open every anchor and confirm the page still matches; mark inferred/assumed with dashed/dotted/hedged language; hunt invented structure (fake layers, false symmetry, unattributed rationale).

## Choosing the representation

Route on the cognitive job, not the content type:

| Content | Representation |
|---|---|
| One dominant takeaway / yes-no | Typographic hero (thesis sentence large), optionally one diagram below |
| True linear sequence (no branches) | Numbered list or single-axis flow strip — **not** a flowchart |
| Branching / merging / cyclic flow | Node-edge graph (`architecture-graph`) or themed Mermaid; emphasize the hot path, dim the rest |
| Code change / PR | `diff-review`: decisive hunks + plain-language delta + anchors + blast radius |
| Bug / failure | Two-track timeline: expected vs actual, the divergence is the focal point |
| Concept / misconception | `concept`: question → naive-vs-correct panels → one worked example → edge cases |
| Architecture (relationships) | Small topology overview + detail cards; draw edges only where they exist in code |
| State machine / lifecycle | Mermaid `stateDiagram` (≤8 states) or a state table |
| Comparison / audit / matrix | `data-table`: semantic table, recommendation marked, one color language |
| Metrics / quantitative | `dashboard`: lead with the delta KPI (units + source + date), then the leanest chart |
| Plan / roadmap | current→target block, then a timeline; risky steps emphasized, each anchored or marked "proposal" |
| Presentation | `slides` |

## Reference routing

Read only what the current output needs:

| Need | Read |
|---|---|
| Tokens, themes, glow/flat toggle, motion, a11y | `references/design-system.md` |
| Component markup (graphs, diff, charts, tabs, timeline, custom SVG…) | `references/components.md` |
| How to decide what/how to show (the brain) | `references/synthesis-method.md` |
| Self-containment, overflow safety, delivery checklist | `references/self-contained.md` |
| Themed Mermaid (when + how) | `references/mermaid.md` |
| Slide decks | `references/slides.md` |

## Invariants

- **Glow is budgeted and optional.** It appears only on the active path, the single most important state/answer, and key metrics — routed through `--fx-*` variables so `data-fx="flat"` cleanly removes it. Build new glow through an `--fx-*` var, never hard-coded, so the toggle keeps working. No continuous breathing/pulsing on static content.
- **No horizontal page scroll.** `min-width:0` on grid/flex children; wide content (diffs, tables, Mermaid) scrolls inside its own `overflow-x:auto` container. Verify at 360px.
- **Both themes and both fx modes must look composed.** Aurora Day is retuned, not inverted (lower glow alpha). Respect `prefers-reduced-motion` and `prefers-color-scheme`; keep keyboard focus visible.
- **Evidence over polish.** Every node/edge/number traces to a real anchor; inferred/assumed content is visibly hedged; never invent layers, symmetry, or rationale. A clearly-marked "couldn't confirm X" beats a confident fabrication.
- **Never define a page-level `.node` class** — Mermaid uses it internally. All UltraExplainer classes are `.ux-` prefixed.

## Final checklist

Before delivering: complete self-contained document written to the right path · no console errors · no horizontal overflow at desktop or 360px · fonts degrade gracefully · the thesis is obvious in the first viewport with exactly one focal point · tables/diffs/diagrams scroll inside their own containers · theme + glow toggles work · Mermaid (if any) uses the diagram shell with zoom/pan · every claim is anchored or hedged.
