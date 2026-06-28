# Changelog

All notable changes to UltraExplainer are documented here.

## [0.1.0] — 2026-06-28

Initial release.

### Added
- **Aurora design system** (`assets/aurora.css`) — dark/light themes and an optional, toggleable glow layer (`data-theme` × `data-fx`), with glow routed entirely through `--fx-*` variables so it switches cleanly.
- **Connector engine + behaviors** (`assets/aurora.js`) — routes bezier arrows between arbitrary nodes and re-draws on resize; theme/glow switcher (FOUC-free); tabs; live table filter; particle backdrop.
- **7 self-contained templates** — architecture graph, diff review, dashboard, concept explainer (custom SVG), data table, themed Mermaid, slide deck.
- **Synthesis method** (`references/synthesis-method.md`) — charter → thesis-with-tension → evidence ledger → reconcile gate → salience tiering → lowest-ink representation → first-viewport gate → in-loop fact-check.
- **Reference docs** — design system, components catalog, Mermaid, slides, self-containment.
- **9 commands** — `/ultra-explain`, `/diff-review`, `/plan-review`, `/dashboard`, `/concept`, `/web-diagram`, `/slides`, `/project-recap`, `/fact-check`.
- Cross-harness configs for Codex, Cursor, and OpenCode.
- `scripts/build-templates.mjs` — assembles self-contained templates from the canonical assets.
