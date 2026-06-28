# UltraExplainer (Codex)

This project bundles the **UltraExplainer** agent skill. When the user asks for a diagram, architecture overview, diff/PR review, plan review, dashboard, comparison table, slide deck, project recap, or any visual explanation, generate a **single self-contained HTML file** using the skill instead of ASCII art.

1. Read `plugins/ultra-explainer/SKILL.md` and the relevant files under `plugins/ultra-explainer/references/`.
2. Copy the closest body in `plugins/ultra-explainer/templates/_src/` and adapt it, then build with `node scripts/build.mjs <name>` — it inlines `assets/core.css` + `assets/themes.css` + `assets/ux.js` into a self-contained page (the build already escapes literal `</script>` as `<\/script>`; preserve that in any JS you add).
3. Follow the synthesis method: charter (+ EXPLAIN/TEACH mode) → thesis-with-tension → evidence ledger with anchors → reconcile → salience tiering → choose a design language → lowest-ink (or manipulable) representation → first-viewport gate → three gates (TRUTH/CRAFT/OBSERVED).
4. Write the file to the requested path (or `~/.agent/diagrams/`), open it, and give a one-line chat summary.

UltraExplainer is a **chameleon studio**: pick one of seven design languages (Blueprint, Editorial, Terminal, Instrument, Notebook, Swiss, Luminous) to fit the subject and record why. Light/dark always toggle; glow is Luminous-only, never the default. Never invent structure that isn't in the source.

Install path: copy `plugins/ultra-explainer` to `~/.codex/skills/ultra-explainer`.
