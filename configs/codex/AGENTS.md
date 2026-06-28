# UltraExplainer (Codex)

This project bundles the **UltraExplainer** agent skill. When the user asks for a diagram, architecture overview, diff/PR review, plan review, dashboard, comparison table, slide deck, project recap, or any visual explanation, generate a **single self-contained HTML file** using the skill instead of ASCII art.

1. Read `plugins/ultra-explainer/SKILL.md` and the relevant files under `plugins/ultra-explainer/references/`.
2. Copy the closest example from `plugins/ultra-explainer/templates/` and adapt it. Inline `assets/aurora.css` and `assets/aurora.js` so the output is self-contained (escape any literal `</script>` as `<\/script>`).
3. Follow the synthesis method: charter → thesis-with-tension → evidence ledger with anchors → reconcile → salience tiering → lowest-ink representation → first-viewport gate → self-audit.
4. Write the file to the requested path (or `~/.agent/diagrams/`), open it, and give a one-line chat summary.

The Aurora design system ships light/dark themes and an optional glow layer the reader can toggle. Keep glow budgeted; never invent structure that isn't in the source.

Install path: copy `plugins/ultra-explainer` to `~/.codex/skills/ultra-explainer`.
