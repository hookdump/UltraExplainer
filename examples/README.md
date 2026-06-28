# Examples

The files in [`../plugins/ultra-explainer/templates/`](../plugins/ultra-explainer/templates/) are complete, self-contained example outputs — open any directly in a browser (no server needed) and use the corner switcher to toggle **night / day** (and, on Luminous, **glow / flat**). Each is rendered in the design language that fits its subject.

| File | Language | Demonstrates |
|---|---|---|
| `chameleon.<preset>.html` | all 7 | the **same** cache explanation rendered in every design language — the squint test |
| `editorial-concept.html` | Editorial | concept explainer: custom SVG ring, naive-vs-correct, scroll-spy nav, sidenotes |
| `terminal-diff.html` | Terminal | PR review: annotated diff + verdict + blast-radius graph |
| `instrument-dashboard.html` | Instrument | KPI masthead + honest line/bar charts + sortable, filterable table |
| `playground.html` | Blueprint | an interactive parameter model — sliders drive every KPI and bar live |
| `notebook-teach.html` | Notebook | TEACH mode: a step-through player, predict-then-reveal, exit ticket |
| `swiss-comparison.html` | Swiss | a decision matrix: oversized numerals + sortable comparison table |
| `luminous-flow.html` | Luminous | a system flow with a scenario toggle (cache hit / miss) + optional glow |
| `mermaid.html` | (any) | a themed Mermaid flowchart with zoom / pan / expand |
| `slides.html` | (any) | a full-viewport slide deck with keyboard / scroll / touch navigation |

These are produced by [`../scripts/build.mjs`](../scripts/build.mjs), which reads a per-body directive and inlines the canonical `assets/core.css` + `assets/themes.css` + `assets/ux.js` into each page. When the skill runs for real, it picks the design language and representation for your actual code and follows the synthesis method in [`../plugins/ultra-explainer/references/synthesis-method.md`](../plugins/ultra-explainer/references/synthesis-method.md).
