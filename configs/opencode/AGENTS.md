# UltraExplainer (OpenCode)

This project bundles the **UltraExplainer** skill for generating self-contained HTML visual explanations (diagrams, diff/PR reviews, plan audits, dashboards, slide decks, concept explainers, project recaps).

When a visual or relational answer is warranted, build one self-contained `.html` instead of ASCII/Markdown:

1. Read `plugins/ultra-explainer/SKILL.md` + the relevant `plugins/ultra-explainer/references/`.
2. Adapt the closest body in `plugins/ultra-explainer/templates/_src/`; build with `node scripts/build.mjs <name>` (inlines `core.css` + `themes.css` + `ux.js`; literal `</script>` is escaped as `<\/script>`).
3. Apply the synthesis method (thesis-with-tension, evidence anchors with confidence, salience tiers, choose a design language, lowest-ink/manipulable representation, first-viewport gate, the TRUTH/CRAFT/OBSERVED gates).
4. Write the file, open it, and summarize in one line.

A chameleon studio of seven design languages (Blueprint, Editorial, Terminal, Instrument, Notebook, Swiss, Luminous) — pick one for the subject. Light/dark always toggle; glow is Luminous-only, never the default. Never invent structure absent from the source.

Install path: copy `plugins/ultra-explainer` to `~/.config/opencode/skill/ultra-explainer`.
