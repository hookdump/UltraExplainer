---
name: ultra-explainer
description: Generate strikingly clear, self-contained HTML explanations of code, systems, diffs, plans, data, and concepts. Use for architecture & node-edge graphs, diff/PR reviews, plan/requirement audits, dashboards, comparison tables, concept explainers, interactive walkthroughs, slide decks, and project recaps. Produces one self-contained .html file built from a stable component contract re-skinned by a "chameleon studio" of seven distinct design languages (blueprint, editorial, terminal, instrument, notebook, swiss, luminous) chosen to fit the subject — with light/dark themes, an optional glow layer, and real interactivity (sliders, scenario toggles, step-throughs, sortable tables).
license: MIT
metadata:
  author: hookdump
  version: "0.2.0"
  homepage: https://github.com/hookdump/UltraExplainer
---

# UltraExplainer

Turn code, systems, diffs, plans, data, and concepts into a single self-contained HTML page that makes the **one important idea** obvious in the first screenful — then proves it with anchored evidence. UltraExplainer is three things working together:

1. **A synthesis method** (the brain) — how to decide *what* to show, what to emphasize, what to cut, and how to never draw structure that isn't in the source. See `references/synthesis-method.md`.
2. **The chameleon studio** (the craft) — a stable, design-language-agnostic **component contract** (`assets/core.css`) re-skinned by **seven complete design languages** (`assets/themes.css`). The same diff renders as an IDE gutter under *Terminal*, a ruled callout under *Blueprint*, a figure under *Editorial*. You **choose** the language to fit the subject; glow is one option (*Luminous*), never the default. See `references/aesthetic-languages.md` and `references/component-contract.md`.
3. **An interactivity layer** (`assets/ux.js`) — one shared state→render engine powering sliders, scenario toggles, step-throughs, sortable/filterable tables, scroll-spy nav, and routed node-edge graphs. See `references/interactivity.md`.

> Identity: **truth + the right design language + verified craft.** Not "everything glows," not "boxes-and-arrows soup," not "a wall of identical cards."

## When to use this skill

Reach for an HTML page whenever the output is inherently visual, relational, or manipulable and ASCII/Markdown would mangle it:

- A diagram, architecture overview, or **node-edge graph** of how something connects or flows.
- A **diff / PR review** (changed code + why it matters + blast radius).
- A **plan / requirement audit** or comparison matrix.
- A **dashboard** of metrics, or any table with 4+ rows / 3+ columns.
- A **concept explainer** that teaches a mechanism, or an **interactive model** the reader should *feel* by changing an input.
- A **slide deck**, or a **project recap** for context-switching.

If the honest answer fits in one sentence or a single number, say it in chat — do **not** manufacture a page (the minimum-viable-explainer rule). When you do build, give a one-line chat summary and deliver the file.

## Two modes — decide at the charter

State which one you're in (so the user can correct it):

- **EXPLAIN** (default) — thesis-first, for reviewers / decision-makers / context-switchers who need the conclusion fast. Salience caps apply (T0 ≤ 3, T1 ≤ 7).
- **TEACH** — question-first, for learners who need a runnable mental model. Concrete-before-abstract, predict-then-reveal, ends with a transfer check. See `references/teaching.md`.

## The method, in brief

Read `references/synthesis-method.md` before generating anything non-trivial. The short form:

1. **Charter** — one sentence: "This explains *\<artifact\>* at altitude *\<A0–A4\>* for *\<audience\>* so they can *\<job\>*," plus the **mode** (EXPLAIN/TEACH). Hold one altitude.
2. **Thesis with tension** — one declarative claim the reader doesn't yet know (not a topic). Pick the spine (the single axis the eye follows).
3. **Evidence ledger** — read the real source; for every node/edge/label/number record `{claim, anchor (file:line / symbol / git ref / metric+date), confidence (verified|inferred|assumed)}`. **No anchor → it doesn't render as fact.** For interactive models, every slider range/default and the input→output **function** is anchored or stamped "illustrative model, not measured."
4. **Reconcile** — hold the thesis against contradicting evidence; revise, scope, or *show* it. Never silently drop it.
5. **Minimum-viable check** — don't over-render. Simple answer → hero sentence + one visual.
6. **Salience tiering** — T0 (thesis + spine, **≤3**) / T1 (load-bearing support, **≤7**) / T2 (receipts, in `<details>`/hover). Over a cap → split or demote, **never shrink-to-fit**. (TEACH mode swaps caps for a desirable-difficulty budget.)
7. **Choose the design language** — score the 7 languages on subject × audience × medium and record one line: `LANGUAGE: <name> because <subject + audience + medium>`. See below.
8. **Represent** — ask the **manipulability question first** ("should the reader *feel* a relationship by changing an input?"); if yes, reach for a model/stepper/scenario. Otherwise pick the **lowest-ink** static form. Encode magnitude *quantitatively* (size/length/position), not equal boxes.
9. **Compress** — omission is the craft; collapse repetition ("×12 handlers"); excerpt the load-bearing lines, not whole files.
10. **Gates** — pass all three before delivering (below).

## Three delivery gates — truth outranks all

- **TRUTH** — every node/edge/number traces to a real anchor; inferred/assumed content is visibly hedged; the thesis was reconciled against contradicting evidence; you re-opened the anchors. A clearly-marked "couldn't confirm X" beats a confident fabrication. An interactive lie (a slider scrubbing a fabricated relationship) is the cardinal sin.
- **CRAFT** — the **squint test**: from across the room it reads as a deliberate design language, not a recolored template. Exactly one T0 focal point.
- **OBSERVED** — you actually rendered the page and looked. Build it, open it (headless screenshot at ~1280 and ~360), capture console errors, assert no horizontal page scroll and that the thesis is in the first viewport, then self-correct. Stop asserting checklist properties you never measured.

## How to build a page (assembly)

Pages are assembled by `scripts/build.mjs` from a body fragment in `templates/_src/<name>.body.html`. **The fastest path: copy the closest template, change the `preset`, and adapt the content.**

- **Line 1 directive** (JSON in an HTML comment) selects the language and tuning:
  `<!--ux: {"title":"…","preset":"blueprint","theme":"light","fx":"flat","head":"<style>…</style>"} -->`
  - `preset`: `blueprint | editorial | terminal | instrument | notebook | swiss | luminous` (default `luminous`)
  - `presets: ["…","…"]` → emit one file per language (chameleon demos)
  - `theme`: `light | dark` (defaults to the preset's natural tuning)
  - `fx`: `glow | flat` (Luminous only)
  - `head` / `foot`: extra markup; `<name>.head.html` / `<name>.foot.html` sidecars are also merged
- The build inlines `core.css` + `themes.css` + `ux.js`, links the preset's fonts, sets `data-theme-preset` / `data-theme` / `data-fx` **before paint** (FOUC-free), and emits `templates/<name>.html`.
- Run: `node scripts/build.mjs <name-filter>` (filter is a substring; omit to build all).
- The page's only external requests are Google Fonts (with system fallbacks — the layout never depends on them) and, for Mermaid pages, the Mermaid CDN. It must still look right if those fail.

> **CRITICAL** when inlining any JS that contains the literal string `</script>` (e.g. an example snippet): escape it as `<\/script>` or it closes the tag early and dumps source onto the page.

## Choosing the design language

Route on the merits, record the reason. Full scorecard + per-language profiles in `references/aesthetic-languages.md`.

| Subject | Default language |
|---|---|
| Architecture, schemas, protocols, infra topology | **Blueprint** |
| Concepts, ADRs, post-mortems, exec narratives | **Editorial** |
| Diffs, PRs, CLI tools, CI pipelines, logs | **Terminal** |
| Metrics, benchmarks, audits, dashboards | **Instrument** |
| Teaching, walkthroughs, onboarding, gentle explainers | **Notebook** |
| Comparisons, principle/manifesto pages, status reports | **Swiss** |
| System-flow demos, product-vision, wow-factor briefs | **Luminous** (never by default) |

Tie-breakers: honor explicit user requests ("make it a terminal"); rotate to avoid session monotony; **never pick Luminous just because it's flashy.**

## Choosing the representation

Route on the cognitive **job** and the **data shape**, not the content type. Manipulability first. Full catalog + routing in `references/representations.md`; honest charts in `references/charts-honesty.md`.

| Job | Representation (component) |
|---|---|
| One dominant takeaway / yes-no | Typographic thesis hero (`.ux-thesis`), maybe one visual below |
| Reader should *feel* a relationship | Parameter model (`[data-playground]`) — sliders + bound readouts |
| Order / intermediate state is the meaning | Step-through (`[data-stepper]`) — code↔data in lockstep |
| Behaves differently across configs | Scenario toggle (`.ux-seg[data-scenario-ctl]`) re-lights one diagram |
| True linear sequence | Numbered list / flow strip (`.ux-spine`) — **not** a flowchart |
| Branching / merging / cyclic flow | Node-edge graph (`.ux-graph`, ≤12 nodes) or themed Mermaid |
| Dense pairwise relations | Matrix heatmap (`.ux-matrix`) — beats a hairball graph |
| Code change / PR | Annotated diff + verdict (`.ux-diff` + `.ux-verdict`) + blast radius |
| Concept / misconception | Naive-vs-correct panels (`.ux-compare`) + one worked example |
| Comparison / audit / matrix | Sortable, filterable table (`.ux-table`, `th[data-sort]`, `data-ux-filter`) |
| Quantitative metrics | Delta-led KPI row (`.ux-kpis`) + leanest honest chart (`.ux-bars`/`.ux-linechart`) |
| Plan / roadmap | Current→target block + risk-tiered timeline (`.ux-timeline`) |
| Presentation | Slide deck (`templates/slides`) |
| Nothing fits | Custom inline SVG using theme tokens |

## Templates (`templates/`, with sources in `templates/_src/`)

| Template | Language | Demonstrates |
|---|---|---|
| `chameleon.<preset>.html` | all 7 | the SAME explanation rendered in every language — the squint test |
| `blueprint` → `playground` | Blueprint | parameter-driven model (sliders, bound KPIs/bars, presets) |
| `terminal-diff` | Terminal | PR review: annotated diff + verdict + blast radius |
| `instrument-dashboard` | Instrument | KPI masthead + honest line/bar charts + sortable/filter table |
| `editorial-concept` | Editorial | concept explainer: scroll-spy nav + custom SVG + naive-vs-correct + sidenotes |
| `notebook-teach` | Notebook | TEACH mode: step-through + predict-then-reveal + transfer check |
| `swiss-comparison` | Swiss | decision matrix: oversized numerals + sortable comparison table |
| `luminous-flow` | Luminous | scenario toggle (hit/miss) + routed graph + optional glow |
| `mermaid` | any | themed Mermaid with zoom / pan / expand |
| `slides` | any | full-viewport deck with keyboard/scroll nav |

## Reference routing — read only what the current output needs

| Need | Read |
|---|---|
| How to decide what/how to show (the brain) | `references/synthesis-method.md` |
| The 7 languages, selection scorecard, squint test | `references/aesthetic-languages.md` |
| Token tiers, every `.ux-` component, build/assembly | `references/component-contract.md` |
| Representation catalog + data-shape × job routing | `references/representations.md` |
| Sliders, scenario toggles, steppers, graphs, scroll-spy — the JS API | `references/interactivity.md` |
| Honest charts: numbers ledger, channel ranking, axis rules | `references/charts-honesty.md` |
| TEACH mode: learner-state, concrete-first, predict-reveal, transfer | `references/teaching.md` |
| Per-job playbooks (pr-review, postmortem, ADR, perf-profile, …) | `references/playbooks.md` |
| Self-containment, overflow safety, verification loop, delivery checklist | `references/self-contained.md` |
| Themed Mermaid (when + how) | `references/mermaid.md` |
| Slide decks | `references/slides.md` |

## Invariants

- **Truth outranks beauty and craft.** Anchor or omit; hedge inferred/assumed content; never invent layers, symmetry, edges, or rationale. Interactive ranges/functions are anchored or stamped "illustrative model."
- **One language per page, chosen on the merits and recorded.** It must pass the squint test. Glow is Luminous-only, routed through `--fx-*` so `data-fx="flat"` cleanly removes it; no continuous breathing/pulsing on static content.
- **No horizontal page scroll.** `min-width:0` on grid/flex children; wide content (diffs, tables, Mermaid) scrolls inside its own `overflow-x:auto` container. Verify at 360px.
- **Both themes look composed.** Light is retuned, not inverted. The page opens in its chosen theme and the reader can toggle (persisted per preset); respect `prefers-reduced-motion`; keep keyboard focus visible; print-safe.
- **Components consume semantic + `--fx-*` tokens only — never hex.** New looks come from theme packs, not inline colors.
- **Never define a page-level `.node` class** — Mermaid uses it internally. All UltraExplainer classes are `.ux-` prefixed.
- **Observe before delivering.** Render the page, look at it, fix what's wrong. Don't assert what you didn't measure.

## Final checklist

Self-contained document at the right path · built with the chosen `preset` · no console errors · no horizontal overflow at desktop or 360px · fonts degrade gracefully · the thesis is obvious in the first viewport with exactly one focal point · tables/diffs/diagrams scroll inside their own containers · theme (and Luminous glow) toggles work · every claim anchored or hedged · the page was actually rendered and inspected.
