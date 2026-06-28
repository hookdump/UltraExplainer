# Changelog

All notable changes to UltraExplainer are documented here.

## [0.2.0] — 2026-06-28

A ground-up overhaul. v0.1 collapsed into a single dark "Aurora" glow identity; v0.2 keeps the synthesis method (the differentiator) and replaces the one skin with a **chameleon studio** of seven design languages, adds a real interactivity layer, and makes delivery verifiable.

### Added
- **Chameleon studio — 7 design languages.** A design-language-agnostic component contract (`assets/core.css`, semantic tokens only) re-skinned by seven complete theme packs (`assets/themes.css`): **Blueprint, Editorial, Terminal, Instrument, Notebook, Swiss, Luminous**. The language is *chosen* on subject × audience × medium and recorded; each must pass the squint test. Both light and dark tunings.
- **Interactivity layer** (`assets/ux.js`) — one shared **state→render engine** powering parameter sliders, scenario toggles, and step-through players, plus sortable/filterable tables, scroll-spy nav, and the routed connector graph (now scenario-addressable via per-edge `cls`/`id`).
- **EXPLAIN vs TEACH modes** — TEACH adds a learner-state model, concrete-before-abstract ordering, predict-then-reveal, and a closing transfer check (`references/teaching.md`).
- **Three delivery gates** — TRUTH (anchored/hedged, reconciled), CRAFT (squint test, one focal point), OBSERVED (the rendered page was actually checked via a render-and-observe loop). Truth wins every tie.
- **10 self-contained templates** across the languages — `chameleon` (×7), `editorial-concept`, `terminal-diff`, `instrument-dashboard`, `playground` (Blueprint), `notebook-teach`, `swiss-comparison`, `luminous-flow`, `mermaid`, `slides`.
- **New reference docs** — `aesthetic-languages`, `component-contract`, `representations`, `interactivity`, `teaching`, `charts-honesty`, `playbooks` (10 job recipes); `synthesis-method` extended with the mode switch, aesthetic-selection step, manipulability question, interaction-as-evidence rule, and the three gates.
- **New build pipeline** (`scripts/build.mjs`) — a per-body directive selects the `preset`/`theme`/`fx` (or emits one file per preset for chameleon demos) and inlines `core.css` + `themes.css` + `ux.js` FOUC-free.

### Changed
- Glow is demoted from the house style to **one** language (Luminous) and never the default; routed through `--fx-*` so `data-fx="flat"` removes it cleanly. Pages are designed flat-first.
- Representation routing now asks the **manipulability question** first (feel-it-by-changing-an-input → interactive form) before the content-type lookup.

### Removed
- The Aurora monoculture: `assets/aurora.css` / `assets/aurora.js`, the old `scripts/build-templates.mjs`, the always-on particle backdrop and ambient motion as defaults, and the v1 single-skin templates (architecture-graph, diff-review, dashboard, concept, data-table) — superseded by the language-specific set above.

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
