# Examples

The seven files in [`../plugins/ultra-explainer/templates/`](../plugins/ultra-explainer/templates/) are themselves complete, self-contained example outputs — open any of them directly in a browser (no server needed) and use the corner switcher to toggle **night / day** and **glow / flat**.

| File | Demonstrates |
|---|---|
| `architecture-graph.html` | A node-edge graph with routed arrows (fan-out → collapse), hover-to-trace, a funnel chart, and tabs |
| `diff-review.html` | An annotated diff with comment connector, approved verdict, and blast-radius cards |
| `dashboard.html` | Focal-glow KPIs, an SVG area chart, a conic donut, calm bars, and a table |
| `concept.html` | A custom SVG illustration (cosine vs. Euclidean), naive-vs-correct panels, and a worked example |
| `data-table.html` | A live-filterable audit table with status badges and flagged rows |
| `mermaid.html` | An Aurora-themed Mermaid flowchart with zoom / pan / expand |
| `slides.html` | A full-viewport slide deck with keyboard / scroll navigation |

These are produced by [`../scripts/build-templates.mjs`](../scripts/build-templates.mjs), which inlines the canonical `assets/aurora.css` and `assets/aurora.js` into each page. When the skill runs for real, it adapts one of these to your actual code with the synthesis method in [`../plugins/ultra-explainer/references/synthesis-method.md`](../plugins/ultra-explainer/references/synthesis-method.md).
