# Synthesis Method

The reasoning methodology you follow to turn a codebase, diff/PR, plan, or concept into an illuminating explainer page. This is a thesis-spine pipeline with a hard cognitive-load governor and an in-loop evidence ledger. Read it as live instructions: run the steps in order, never start drawing before the thesis and the ledger exist, and never ship before both self-audit passes complete.

The single governing rule: **a beautiful false explainer is a failed deliverable.** Evidence beats narrative, and that is enforced by a gate (step 4) and an audit (step 12), not by a slogan.

---

## The pipeline (run in order)

### 1. Charter — artifact, altitude, audience, job

Before any design thought, write ONE charter sentence and commit to four fields:

- **ARTIFACT TYPE** — `codebase` | `diff/PR` | `plan/proposal` | `concept/algorithm` | `data/metrics`.
- **ALTITUDE** — pick exactly ONE rung and hold it:
  - **A0** one-line mental model
  - **A1** system map (box = service)
  - **A2** module + dataflow (box = file or class)
  - **A3** procedure + control-flow (box = function or step)
  - **A4** line-level (the statements)

  Mixing altitudes in one view is the #1 comprehension killer. Two genuinely-needed altitudes = two views, never one crowded diagram.
- **AUDIENCE** — `new-to-system` | `reviewer-of-THIS-change` | `future-self context-switch` | `non-author stakeholder`. This sets the assumed-knowledge floor and the **density budget**: novice/skim ≤ 7 primary objects per view; expert/study up to ~15.
- **JOB** — finish: "after 30 seconds the reader can now ___ (decide / rebuild model / find the bug / approve)."

Write it as: **"This explains `<artifact>` at altitude `<A_>` for `<audience>` so they can `<job>`."**

If you cannot fill this sentence, you are not ready to design — go read more source. This header governs every later cut.

### 2. Thesis with tension (claim, not topic) + spine axis

Force ONE thesis: a declarative sentence stating the most important TRUE thing the reader does not yet know, carrying **tension** — a gap between what they'd expect and what's true.

- Topic FAILS: "the auth system."
- Claim-with-tension PASSES: "Auth looks like one check but is two trust boundaries, and the bug lives in the seam."

**Tension test (must pass all three):** (i) falsifiable against the source; (ii) carries surprise/stakes; (iii) everything else can hang off it.

Then pick the **SPINE** — the single organizing axis the eye follows:

`data-flow` (source→sink) | `control-flow` (call order) | `causal` (cause→effect) | `temporal` (before→after / timeline) | `dependency` (what-needs-what) | `claim→evidence` (concept) | `comparative` (A vs B).

The spine becomes the dominant layout axis. A page with no spine is boxes-and-arrows soup. If you cannot state the thesis in one sentence, you do not understand the subject — return to source, do NOT start drawing.

### 3. Evidence harvest into a ledger (anchor at capture time)

NOW read the real source. Never reconstruct from the request's prose, naming conventions, or how systems "usually" look.

For every prospective node / edge / label / number / claim, record a ledger row **at capture time**:

```
{ element, claim, ANCHOR, confidence }
```

- **ANCHOR** = `file:line` range | exact symbol name | commit SHA / git ref (diffs: capture before AND after) | verbatim command output | metric source + as-of date | config key.
- **CONFIDENCE** = `verified` (you opened and read it) | `inferred` (deduced from structure/names, not confirmed) | `assumed` (a gap you are filling).

Counts ("12 handlers") must come from a command you actually ran — else mark `~`. Harvest ALONG the spine and arc beats only; do not vacuum the repo.

**Critical:** harvest evidence AGAINST the thesis too. If you find it, do not discard it — it triggers step 4. An element with no anchor cannot be rendered as fact.

### 4. RECONCILE gate

Before designing anything, hold the thesis against the harvested ledger and resolve every contradiction explicitly. For each piece of evidence that contradicts or complicates the thesis, choose ONE and record it:

- **(a) REVISE** — the thesis was wrong; rewrite it (loop to step 2) and re-harvest.
- **(b) SCOPE** — the thesis is true within a stated boundary; add the boundary to the thesis sentence.
- **(c) SHOW** — the contradiction IS interesting; render it as a marked caveat/tension on the page.

**FORBIDDEN:** silently dropping contradicting evidence to keep a clean story. This is the cardinal sin.

Output of this gate: a thesis you have actively tried and failed to falsify, plus a short list of caveats that **MUST survive compression**.

### 5. Minimum-viable-explainer check (escape hatch)

Ask: does this artifact actually need a multi-section visual page?

- If the honest answer fits in a hero sentence + ONE diagram/table/number (a 1-file change, a single metric, a yes/no), build exactly that and skip to render. Do NOT manufacture sections, arcs, or diagrams to look thorough. Decoration-as-completeness is bloat.
- Conversely, if the artifact spans more than one altitude or more than ~15 tier-0/1 objects, it is multiple views, not one crowded page.

Record the decision — `minimal` | `standard` | `multi-view` — so later steps match scope to substance.

### 6. Narrative arc selection (reading order is a design decision)

Sequence the spine into an arc matched to artifact type. Each beat owns exactly ONE job and sets up the next.

- **Codebase/system:** context → spine walk → the one subtlety that bites.
- **Diff/PR:** before-state pain → what changed & where (anchored) → why → blast radius/risk.
- **Plan:** current reality → target → ordered steps → decision points/unknowns.
- **Concept:** the question it answers → mechanism → ONE worked concrete example with real values → edge cases.
- **Data:** headline delta → the series/breakdown → caveats.

Mark where the **aha** lands: everything before it is setup, everything after is payoff. Section headers are story beats ("Why the second write wins"), never taxonomy labels ("Implementation Details"). The arc determines section order and the first-viewport payload (step 11).

### 7. Salience tiering in the ledger BEFORE choosing visuals

Tag every ledger element `T0`/`T1`/`T2` in the ledger, so emphasis is reasoned — not an accident of which box ended up biggest.

- **T0** = thesis + spine through-line + the must-survive caveats from step 4. **CAP ≤ 3 elements.** Dominates the first viewport. The ONLY tier permitted accent/glow.
- **T1** = the 3–7 objects that make the thesis believable (key steps, modules, decisive risks). **CAP ≤ 7 per view.** Clear but visually subordinate, no glow.
- **T2** = provenance anchors, edge cases, exact signatures, full lists, raw diffs. **UNLIMITED but hidden by default.**

**Tiering rule per element:** "If deleted, is the thesis still understood?" → yes → T2 or cut. "Needed to BELIEVE the thesis?" → T1. "Is it the thesis/spine?" → T0.

If T0 needs > 3 or T1 > 7, the altitude is wrong (→ step 1) or the view must split — **NEVER shrink-to-fit.**

Confidence (step 3) is **orthogonal** to tier and lives on a separate channel: an important-but-inferred element is T0-large AND visibly marked inferred.

### 8. Representation mapping (route on cognitive job, prefer lowest-ink form)

Only now choose form, per the representation map (below), routing on (`spine type` × `altitude` × `what the eye must COMPARE`) and on what makes the THESIS fastest to grasp — not a flat content-type lookup.

Prefer the **lowest-ink form** that does the job: labeled list > flow strip > flowchart; KPI row > chart; table > prose. A diagram is EARNED only when relationships are non-linear (a flowchart for a straight sequence is chartjunk).

One PRIMARY representation per spine, at most one SECONDARY for detail. No decorative second diagram restating the first.

Encode quantitative claims **quantitatively** — node size / bar length / position, never six equal boxes when step 3 is 90% of latency. Inside any diagram, emphasize ONLY the thesis path; dim off-path context; abstract sibling branches into one labeled group ("×12 handlers").

### 9. Compression — data-ink discipline, omission is the craft

Apply the compression rules (below). Per element: "delete it — what does the reader lose?" If "nothing," it stays deleted.

Cut chartjunk, redundant legends, boxes-around-boxes, decorative gradients/shadows, labels that repeat the heading. Collapse repeated structures into one annotated exemplar ("×6 similar"). Elide plumbing with no thesis weight (DI wiring, getters, boilerplate) unless the thesis is about it.

Code: smallest excerpt where the load-bearing line is the focus; elide the rest with an ellipsis + a `file:line` anchor; never paste a whole function for one line; excerpts verbatim.

**Order of preference: collapse > omit > abstract > defer-to-T2.** Compression reduces what is shown AT ONCE (detail moves to T2), never what is verifiable. Never compress by inventing a cleaner-but-false abstraction — an honest "it is messier than this, see details" beats a tidy lie.

### 10. Render (self-contained HTML; load craft references HERE, not earlier)

Build self-contained HTML per artifact-design fundamentals:

- A deliberate, subject-grounded palette + type pairing. No cream/serif/terracotta or dark/violet AI defaults; no Inter / Space-Grotesk as a safe default. No webfont CDN.
- Real typographic hierarchy **mirroring the salience tiers**.
- Layout via grid/flex `gap`. Wide content (tables/code/diagrams) in its own `overflow-x` container so the body never scrolls sideways.
- `font-variant-numeric: tabular-nums` for aligned digits.
- Mermaid (or hand-built SVG/CSS) diagram shell with zoom/pan/expand.
- `prefers-reduced-motion` respected; visible keyboard focus.

The spine is the dominant layout axis; T0 hero in the first viewport; section headers are the arc beats; T2 in `<details>` / hover / appendix. Keep all reasoning upstream — this step only renders decisions already made.

### 11. First-viewport gate (falsifiable, 4 questions)

Render the top ~900px at desktop width. Simulate a cold target-audience reader given 10 seconds and zero scroll/interaction, and answer:

1. Can they restate the **THESIS** in their own words (not just read a title)?
2. Is there exactly ONE obvious focal point (not zero, not three)?
3. Does that focal point prove or set up the thesis?
4. Is there a visible reason to scroll (a promised arc)?

Also: no horizontal overflow; fonts have fallbacks; no T2 leaking into the first viewport; visual weight order == tier order.

Any "no" → fix salience (step 7) or compression (step 9). Do NOT add explanation, and do NOT ship a pretty-but-flat page whose first screen states a topic instead of a claim.

### 12. Self-audit against the ledger (TRUTH pass + NARRATIVE pass; in-loop, before delivery)

**PASS A — TRUTH.** Walk the ledger element by element. **RE-OPEN each anchor** (do not trust memory; source drifts during a session) and confirm the rendered node/edge/label/number/signature still matches. Classify each: `verified` | `corrected-in-place` | `downgraded-to-inferred` | `deleted`. Anything unsupported is downgraded with a visible marker or deleted — never left as confident fact.

Hunt **structural hallucination** explicitly:
- invented layers / queues / caches / buses / edges the source does not contain;
- false symmetry (drawing a tidy 4 when 3 are real);
- lifecycle/order claims not in the code;
- rationale/motive stated without a commit/comment/PR anchor.

**PASS B — NARRATIVE.** Read top-to-bottom as the target reader: thesis stated once and proven, no arc gap, the aha reachable without knowledge beyond the audience floor, every step-4 caveat survived, nothing off-thesis survived compression, no T2 element out-shouts a T0 element.

Only after **both** passes is the explainer deliverable. No decorative provenance footer; provenance lives per-claim in the ledger and as inline anchors.

---

## The three-tier salience model

A progressive-disclosure model with HARD numeric caps, decided in the evidence ledger BEFORE any visual is chosen, with confidence on a separate orthogonal channel.

| Tier | What it holds | Cap | Treatment |
|---|---|---|---|
| **T0** | Thesis + spine + must-survive caveats (the answer the reader leaves with) | **≤ 3 elements** | Maximum weight: largest type, highest contrast, focal position at top of first viewport. ONLY tier permitted accent/glow. Never collapsed. |
| **T1** | Load-bearing support (why the thesis is true / how it works): main steps, key modules, decisive risks, numbers a skimmer needs | **≤ 7 per view** | Medium weight: clear but subordinate to T0, flat surfaces, normal contrast, no glow. |
| **T2** | Provenance & exhaustive detail (the receipts): anchors, signatures, file trees, edge cases, line-level diffs, config, raw series | **Unlimited, hidden by default** | Behind progressive disclosure (`<details>`, hover, click-to-expand, appendix). Recessed when revealed: dimmer, smaller, monospace. |

If T0 needs > 3 elements, the altitude is wrong — return to Charter.

**Emphasis is scarce currency.** At most ONE focal point per viewport may carry the strongest treatment, and it is spent only on T0. If two things glow, nothing does. Salience is relative — every emphasized element needs quieter neighbors.

**Salience tracks truth and magnitude, not box size or aesthetics.** The biggest/brightest element is the most thesis-important one (which may be physically small — emphasize by contrast, position, and annotation). Quantitative importance is encoded quantitatively: the 90%-of-latency step is visibly larger/longer, not a differently-colored equal box.

**Confidence is orthogonal to salience** (see next section). An important-but-inferred fact is T0-large AND dashed-and-hedged.

### Cognitive-load governor (bounds load across the whole page, not just the first viewport)

1. **Density budget from audience** — novice/skim ≤ 7 primary objects per view; expert/study up to ~15.
2. **Diagram node budget** ~7±2, hard ceiling **12**; beyond it, raise altitude (group children into a parent node) or split into a second view.
3. **One idea per section beat; one focal point per viewport; one idea per sentence.**
4. **Open-nothing rule** — the thesis is comprehensible with zero interaction.
5. **2-click-depth rule** — any anchored T2 detail is reachable in ≤ 2 interactions.

When a cap is exceeded the response is ALWAYS **split-the-view** or **demote-to-T2** — NEVER shrink-to-fit.

---

## Cross-format confidence convention

Confidence is a channel **orthogonal to salience**, defined for EVERY format (not diagram-only). Never render inferred/assumed as confident fact anywhere. A clearly-marked "I could not confirm X" is more trustworthy than a confident fabrication.

| Confidence | Meaning | Diagram | Prose | Table cell | KPI |
|---|---|---|---|---|---|
| **verified** | You opened and read the source | solid stroke | plain assertion | plain value | plain number |
| **inferred** | Deduced from naming/structure/convention, not confirmed | dashed stroke + tag | hedged verb ("appears to", "likely") + optional `inferred` marker | distinct mark / footnote | `(inferred)` parenthetical |
| **assumed** | A gap you are filling | dotted stroke + tag | explicit `(assumed)` note | distinct mark / footnote | `(assumed)` parenthetical |

Only `verified` claims render as plain assertions.

---

## Anti-hallucination rules

Evidence-anchoring is a **precondition captured at harvest time**, not a post-hoc check.

1. **ANCHOR-OR-OMIT.** Every rendered node, edge, box, label, number, signature, and behavioral claim must trace to a re-checkable anchor recorded in the ledger at capture time (step 3): `file:line` range | exact symbol | commit SHA / git ref | verbatim command output | metric source + as-of date | config key. No anchor → it does not appear as fact (cut it, or show it as an explicit open question).

2. **LEDGER WITH CONFIDENCE.** Maintain `{element, claim, anchor, confidence}` for every prospective element. `verified` = you opened and read the source. `inferred` = deduced from naming/structure/convention without confirming. `assumed` = a gap you are filling. Only verified claims render as plain assertions.

3. **CROSS-FORMAT CONFIDENCE.** Mark inferred/assumed items on the channel that works in every representation (see table above). Never render unverified content as confident fact in any format.

4. **NO INVENTED STRUCTURE.** Hunt these specific hallucinations in the audit:
   - arrows implying a call/dependency that does not exist;
   - architectural layers / queues / caches / buses / interfaces the code does not contain;
   - **false symmetry** (drawing a tidy 4 services when 3 are real and 1 is wishful — architectural symmetry is the most seductive hallucination; resist it);
   - lifecycle/ordering claims not backed by the code.

   **Absence is data:** an empty layer or a missing error path is worth showing as empty, not filled.

5. **NO INVENTED RATIONALE.** Never state WHY something was done ("for performance") unless it is in a commit message, PR description, code comment, or the session's own plan notes. Otherwise label it `inferred intent` or omit. Attribute motive only with an anchor.

6. **THESIS CANNOT OVERRIDE EVIDENCE** — enforced by the RECONCILE gate (step 4), not just asserted. If evidence contradicts the thesis you MUST revise it, scope it with a stated boundary, or show the contradiction as a marked caveat. Silently dropping contradicting evidence is the cardinal sin.

7. **QUOTE, DON'T PARAPHRASE, LOAD-BEARING DETAIL.** Function signatures, error strings, config values, code excerpts, and counts are copied verbatim from source (elisions marked with an ellipsis), never reconstructed into a cleaner version that does not exist. Counts come from a command you actually ran, else marked `~`.

8. **THE FACT-CHECK PASS IS IN-LOOP** (step 12A), before delivery. RE-OPEN every anchor (source drifts during a session; do not trust memory), confirm the page still matches, classify `verified | corrected | downgraded | deleted`, and fix in place. Provenance lives per-claim in the ledger and as inline monospace anchors on the page — NOT as a decorative "verified against `<ref>`" page footer, which is bloat and implies false precision when no single ref exists.

---

## Representation map

Route on cognitive job, not content-type default. Pick the form that makes the THESIS fastest to grasp.

| Content | Representation |
|---|---|
| **Single dominant idea / executive takeaway / yes-no answer** | Typographic hero statement — the thesis set large, optionally one spine diagram beneath. The most under-used and often-best form; do NOT manufacture a diagram around it (minimum-viable-explainer, step 5). |
| **True linear sequence** (pipeline, request lifecycle, ordered steps, NO branching) | Numbered/labeled vertical list or single-axis CSS flow strip — NOT a flowchart (a flowchart for a straight line is chartjunk). Reserve arrows for real branches/merges. |
| **Non-linear control or data flow** (branches, merges, cycles, fan-out) where stages differ in cost | Mermaid flowchart with semantic edge labels; node SIZE or an adjacent bar encodes the quantitative claim (latency/volume/%) — not equal boxes + a color legend. Emphasize the thesis/hot path (T0 stroke); dim rare branches to T2; abstract siblings into one labeled group. Hard ceiling 12 nodes, else overview + detail cards. Sankey when volume splits/merges. |
| **Code diff / refactor / PR** | Before→after paired panels for the 2–3 DECISIVE hunks along a temporal spine, behavioral delta in plain language beside each, change sites anchored to `file:line` + git ref; blast radius as edges from changed symbols to callers (dashed where caller-impact is inferred not grepped). Full file-by-file diff collapsed in T2 `<details>`. Show the diff that PROVES the thesis; hide the diff that merely accompanies it. |
| **A bug / failure mode** (consequence beat) | Two-track timeline or sequence diagram: expected path vs actual path diverging, with the divergence point as the single emphasized focal node. The aha IS the fork. |
| **A misconception being corrected** (concept/algorithm) | Question-it-answers header → naive-model vs correct-model paired panels (label the wrong one "what you'd expect") → ONE worked concrete example with real values traced through → edge cases in a collapsed appendix. The difference between the panels glows. Examples beat schematics for first comprehension. |
| **System / module architecture** (relationships dominate, A1–A2) | Hybrid: a small T0 topology overview (≤ 10 nodes) on the dependency axis (upstream→downstream) + T1 CSS detail cards per module, each card anchored to a real dir/file. Relationships drawn ONLY where they exist in imports/calls, never by architectural convention. Never one 25-node mega-diagram. |
| **Dependency / layering / coupling** | Layered band diagram (CSS rows = layers, arrows only for cross-layer calls) or a compact adjacency table for dense graphs. Highlight ONLY surprising/risky edges; suppress the obvious ones to protect data-ink. |
| **State machine / lifecycle** | Mermaid `stateDiagram` if ≤ 8 states, else a state table (rows = from, cols = event, cell = to). Thesis-relevant transition(s) emphasized; illegal/error transitions marked and pushed to T2 unless the thesis is about them. |
| **Comparison / trade-off / audit / capability matrix** (2 axes) | Semantic HTML `<table>`, tabular-nums, with the recommendation column/row marked (T1 emphasis) so it is a decision aid not a neutral grid; one consistent semantic color language (added/removed/risk/neutral), one glyph+color per cell, no decorative fills; inferred-not-measured cells visibly marked. |
| **Quantitative data / metrics** | Lead with the summary delta (the thesis) as a big-number KPI with units + source + as-of date; below it the leanest chart that reveals the comparison (bar = magnitude, line = trend, small-multiples = many series), direct labels not legends, faint grid, emphasized endpoint. ≤ 4 numbers → KPI row beats a chart. No dual axes, 3D, gradient fills, or vanity dashboards. |
| **Plan / roadmap / chronology** | current-reality → target contrast block, then a CSS vertical timeline whose beats are the arc; RISKY/uncertain steps emphasized (T1), routine steps recessed; each step anchored to the file/module it will touch or marked "proposal" not fact; decisions + open questions as explicit T1 callouts; exhaustive task lists in T2. |
| **Implementation plan / proposal** (decision needed) | One-line recommendation banner (T0) → trade-off table (T1) → affected-files map + open questions (T2). Every "this will change X" anchored to a real `file:symbol` or marked as proposal. |
| **Exhaustive reference** (full file tree, all configs, every endpoint, 15+ elements) | T2 only: collapsed `<details>`, dim, in a scrollable container — present for completeness, never competing with the thesis; most explainers omit it. For 15+ elements at one altitude, raise altitude (parent groups) + drill-down cards; never cram one diagram. |

---

## Compression rules

- **Omission is the primary craft.** Data-ink test on every mark: "delete it — what does the reader lose?" If "nothing," it stays deleted. Applies to legends, gridlines, borders, shadows, repeated labels, decorative icons, and whole sections.
- **One spine per view:** cut or demote-to-T2 anything that does not advance the thesis or sit on the chosen backbone. Coverage is preserved via progressive disclosure, never via cramming.
- **Lowest-ink form that does the job:** labeled list > flow strip > flowchart; KPI row > chart; table > prose. A diagram is earned only when relationships are genuinely non-linear.
- **Hard caps, enforced by split-or-demote (never shrink-to-fit):** T0 ≤ 3, T1 ≤ 7 per view, diagram nodes ~7±2 with a 12-node ceiling. Over a cap → raise altitude (group children into a parent) or split the view.
- **Collapse repetition into one annotated exemplar:** show one of N near-identical handlers/routes/cases labeled "×N similar," never all N.
- **Elide plumbing with no thesis weight** (DI wiring, getters/setters, logging, boilerplate config, framework ceremony) unless the thesis is ABOUT the plumbing. Merge nodes that always fire together.
- **Code:** smallest excerpt where the load-bearing line is the visual focus; elide the rest with an ellipsis + a `file:line` anchor; never paste a whole function to show one line; excerpts verbatim.
- **Order of preference: collapse > omit > abstract > defer-to-T2.** Detail with provenance is pushed DOWN, not deleted — compression reduces what is shown at once, not what is verifiable.
- **Section headers state a story beat** ("Why the second write wins"), not a taxonomy label ("Architecture"). One idea per section, one focal point per viewport, one idea per sentence — split if two.
- **Encode quantity, do not enumerate it:** replace a list of equal boxes with sizes/bars showing relative magnitude, so compression also ADDS information.
- **Color is encoding, not decoration:** one consistent semantic palette (added/removed/risk/neutral), separate from the accent hue. No gradient meshes, neon, or color that means nothing. Direct-label over legends.
- **Suppress the obvious to surface the surprising:** hide relationships the reader already assumes; spend ink on what is non-obvious or risky.
- **Compression must not destroy truth:** never compress by inventing a cleaner-but-false abstraction. An honest "it is messier than this — see details" beats a tidy lie.
- **Whitespace is signal, not waste:** high signal density, not crowding — protect the breathing room that lets T0 dominate. Every step-4 caveat must survive compression.

---

## Final quality checklist

Run before delivery. Every line must pass.

- **CHARTER** — "This explains `<artifact>` at altitude `<A_>` for `<audience>` so they can `<job>`" is filled and the page honors it; one primary altitude held (no A1 service boxes mixed with A4 statements).
- **THESIS WITH TENSION** — one declarative claim (not a topic), legible in the first viewport, passes the 3-part tension test; a cold reader can restate it after 5–10s with zero scroll/interaction.
- **RECONCILE DONE** — the thesis was actively tested against contradicting evidence; every contradiction was revised / scoped / shown — none silently dropped; all resulting caveats survived to the page.
- **SCOPE FIT** — minimum-viable-explainer check applied; simple artifacts not over-rendered into fake sections; > 1 altitude or > ~15 T0/T1 objects split into multiple views.
- **SPINE + ARC** — exactly one organizing axis the eye follows (not boxes-and-arrows soup); sections follow the chosen arc; each beat does one job and sets up the next; the aha lands; headers are story beats, not taxonomy.
- **SALIENCE** — exactly one focal point per viewport; T0 ≤ 3 and dominant, T1 ≤ 7 and subordinate, T2 hidden by default; only T0 carries glow/accent; visual weight order == tier order; no T2 element out-shouts a T0 element.
- **LOAD GOVERNOR** — density budget honored for the pinned audience; diagrams within ~7±2 (≤ 12); overflow handled by raising altitude or splitting, never shrink-to-fit; any T2 detail reachable in ≤ 2 interactions; thesis comprehensible with zero interaction.
- **ANCHORED** — every rendered node/edge/label/number/signature traces to a verified ledger anchor (`file:line` / symbol / git ref / metric source); counts came from a real command (else `~`); the ledger was re-walked against live source at audit time.
- **CONFIDENCE ENCODED CROSS-FORMAT** — inferred = dashed/hedged, assumed = dotted/noted — applied consistently in diagrams, tables, prose, and KPIs; nothing unverified renders as confident fact.
- **NO INVENTED STRUCTURE** — no arrows for non-existent calls, no fictional layers/queues/caches/buses, no false symmetry, no unattributed rationale; absence shown as absence; the structural-hallucination hunt was run explicitly.
- **QUANTITATIVE HONESTY** — magnitudes encoded by size/length/position (not equal boxes); metrics show source + as-of date; code/signatures/error strings verbatim with marked elisions.
- **REPRESENTATION FIT** — each beat uses the form that makes the THESIS fastest to grasp (e.g. hot path emphasized), routed on cognitive job not content-type default; one primary representation per spine + at most one secondary; no decorative duplicate diagram.
- **COMPRESSION** — every kept element earns its pixels; repetition collapsed to exemplars; plumbing elided; full-tree/all-configs dumps confined to T2 or omitted; thesis + all caveats intact.
- **CRAFT (artifact-design)** — self-contained HTML, deliberate subject-grounded palette + type pairing (no AI-default looks, no webfont CDN), hierarchy mirrors salience tiers, layout via grid/flex gap, wide content in its own overflow-x container (body never scrolls sideways), tabular-nums for aligned digits, Mermaid/SVG shell with zoom/pan/expand, prefers-reduced-motion respected, visible keyboard focus, no console errors, no horizontal overflow.
- **AUDITS PASSED** — in-loop TRUTH pass (12A) and NARRATIVE pass (12B) both completed before delivery; FIRST-VIEWPORT gate passes all 4 questions (state thesis / one focal point / focal point proves-or-sets-up thesis / visible reason to scroll).
- **HONESTY OVER POLISH** — where verification failed, the page says so; no confident fabrication anywhere; no decorative provenance footer — provenance is per-claim in the ledger and inline anchors.
