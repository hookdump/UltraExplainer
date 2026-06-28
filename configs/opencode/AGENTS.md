# UltraExplainer (OpenCode)

This project bundles the **UltraExplainer** skill for generating self-contained HTML visual explanations (diagrams, diff/PR reviews, plan audits, dashboards, slide decks, concept explainers, project recaps).

When a visual or relational answer is warranted, build one self-contained `.html` instead of ASCII/Markdown:

1. Read `plugins/ultra-explainer/SKILL.md` + the relevant `plugins/ultra-explainer/references/`.
2. Adapt the closest `plugins/ultra-explainer/templates/*.html`; inline `assets/aurora.css` and `assets/aurora.js` (escape literal `</script>` as `<\/script>`).
3. Apply the synthesis method (thesis-with-tension, evidence anchors with confidence, salience tiers, lowest-ink representation, first-viewport gate, in-loop self-audit).
4. Write the file, open it, and summarize in one line.

Aurora ships light/dark themes + an optional, toggleable glow layer; keep glow budgeted and never invent structure absent from the source.

Install path: copy `plugins/ultra-explainer` to `~/.config/opencode/skill/ultra-explainer`.
