# Job playbooks

Pre-bound page recipes for the ten developer jobs. Read the ONE matching your job after the
charter, before harvesting. A playbook is a THIN layer the single generator reads — it pre-binds
{default mode, default arc, default representation set, suggested design language, anchors to
harvest, the hallucination traps for that job} so your reasoning budget goes to CONTENT, not to
rediscovering page shape every time.

A playbook is a STARTING POSITION, never an override of the method. The synthesis pipeline
(charter → thesis → ledger → reconcile → tiering → audit), the three gates (TRUTH · CRAFT ·
OBSERVED), and anchor-or-omit all still run. If the artifact argues for a different mode, language,
or arc, deviate and record why. Language is a suggestion scored on subject×audience×medium — honor
explicit user requests over it. The "anchors to harvest" line tells you what REAL source to read;
the "traps" line names the specific way THIS job tempts fabrication — treat each as a hunt target
in the TRUTH pass.

---

### pr-review
- **Mode** EXPLAIN. **Language** Terminal (developer-native; IDE gutters + status bar).
- **Arc** before-state pain → the 2–3 decisive hunks (anchored) → why → blast radius / risk.
- **Representations** `.ux-diff` for decisive hunks; `.ux-verdict` for the call; `.ux-graph` for
  blast-radius edges (changed symbol → callers); full file-by-file diff in `.ux-details` (T2).
- **Anchors** real `git diff` output (never retype it); `file:line` per hunk; the head + base git
  SHAs; the actual import/call sites for each blast-radius edge.
- **Traps** inventing blast-radius edges that aren't real imports (grep them — dash any caller-impact
  you inferred but didn't confirm); stating WHY a change was made with no commit/PR/comment anchor;
  retyping diff lines into a cleaner version that doesn't match source.

### postmortem
- **Mode** EXPLAIN. **Language** Editorial (narrative read by stakeholders) or Terminal if log-heavy.
- **Arc** what readers think happened → expected vs actual path → the divergence point (the aha) →
  blast radius → fix / prevention.
- **Representations** two-track divergence timeline (`.ux-timeline` or `.ux-graph`) with the fork as
  the single focal node; `.ux-callout--warn` for the trigger; KPI row for impact (duration, users).
- **Anchors** log lines + timestamps (verbatim, with timezone); commit/deploy SHA that introduced it;
  metric source + as-of for the impact numbers; the incident ticket.
- **Traps** narrative-driven causality (a tidy "root cause" the evidence doesn't support — reconcile
  it); inventing a clean timeline when logs are gappy (show the gap, don't fill it); blameful motive
  with no anchor.

### ADR (architecture decision record)
- **Mode** EXPLAIN. **Language** Editorial (decision write-up read top-to-bottom).
- **Arc** the forcing question / context → options considered → the decision (T0 banner) →
  consequences & trade-offs accepted.
- **Representations** typographic thesis hero for the decision; `.ux-compare` or `.ux-table`
  (sort/filter) for option trade-offs with the chosen row marked; `.ux-callout` for consequences.
- **Anchors** the decision itself (PR/doc/commit where it was made); the real constraints driving it
  (config, SLA, dep versions); each option's actual cost/limitation, not a strawman.
- **Traps** strawmanning rejected options (false symmetry — present each honestly); asserting
  consequences as fact when they're predictions (mark "expected"); rationale with no anchor.

### onboarding-map
- **Mode** TEACH (a newcomer rebuilding the model). **Language** Notebook (default-quiet teach home).
- **Arc** first-QUESTION ("where does a request actually go?") → concrete entry point traced → the
  module map → the one subtlety that bites newcomers → transfer/exit-ticket.
- **Representations** topology overview (≤10 nodes) + `.ux-card` detail per module anchored to a real
  dir; `.ux-sidenote` for asides; `.ux-stepper` to trace one request; predict-then-reveal close.
- **Anchors** real directory/file paths and entry-point `file:line`; the import graph (edges only
  where imports/calls exist); the actual run/build command.
- **Traps** drawing architectural layers by convention rather than from imports; false symmetry (a
  tidy 4-service diagram when 3 exist + 1 is aspirational); inventing a "typical" flow not in code.

### blast-radius
- **Mode** EXPLAIN. **Language** Blueprint (studying structure) or Terminal if change-anchored.
- **Arc** the changed surface → direct dependents → transitive reach → what's safe vs at-risk.
- **Representations** `.ux-graph` fanning out from the changed symbol (hot/risky edges emphasized,
  safe ones dimmed); `.ux-matrix` if the graph would hairball (>~12 nodes / >20 edges); risk `.ux-badge`.
- **Anchors** every edge traced to a real import/call/reference site (grep, don't guess); the changed
  symbol's `file:line`; a real reference count (from a command — else mark `~`).
- **Traps** THE core trap — edges that aren't real imports (every edge needs a grep hit); false
  transitive reach (claiming a dependency 3 hops out without tracing each hop); reachability stated
  as fact when it's inferred — dash it.

### api-surface
- **Mode** EXPLAIN. **Language** Blueprint (schema/contract) or Instrument if usage-metric-heavy.
- **Arc** what the API is for → the surface (endpoints/methods grouped) → contracts & shapes → the
  gotchas (auth, pagination, deprecations).
- **Representations** `.ux-table` (sort/filter) of endpoints with method/path/auth columns;
  `.ux-codeblock` for request/response shapes; `.ux-badge` for stable/deprecated/internal.
- **Anchors** route definitions `file:line`; the actual type/schema/serializer; real status codes and
  required params from the handler; version/deprecation from config or annotations.
- **Traps** inventing endpoints/params that "should" exist by REST convention; guessing
  response shapes instead of reading the serializer; claiming an auth requirement not in the code;
  listing a status code the handler never returns.

### perf-profile
- **Mode** EXPLAIN. **Language** Instrument (lab-readout precision, tabular-nums).
- **Arc** the headline cost (delta as a big number) → where time/space goes → the dominant
  contributor → the fix lever.
- **Representations** delta-led KPI row (value + unit + source + as-of); ranked bars (`.ux-bars`) for
  the breakdown — magnitude encoded by length; flame/treemap ONLY when there's true stack nesting.
- **Anchors** the profiler output / benchmark run (verbatim); the metric source + as-of date + the
  environment; the hot frame's `file:line`; baseline vs current numbers from real runs.
- **Traps** fake flamegraph nesting (ranked bars beat an invented call stack — don't fabricate
  parent/child frames); equal-width bars when one item is 80% of cost (encode magnitude honestly);
  precise-looking numbers with no run behind them; missing axis zero-baseline.

### coverage-map (requirements / audit)
- **Mode** EXPLAIN. **Language** Swiss (decisive, authoritative) or Instrument for dense matrices.
- **Arc** what was required → what's covered vs not (the gap is the thesis) → the at-risk gaps →
  recommendation.
- **Representations** semantic `.ux-table` / `.ux-matrix` (sort/filter), requirement × status, each
  cell a covered/partial/missing glyph+color; recommendation row marked; inferred cells flagged.
- **Anchors** each "covered" cell traced to the real test/impl/`file:line` that covers it; the
  requirements source (spec/ticket); a real count of covered vs total (from a command).
- **Traps** THE core trap — claiming "done/covered" without an anchor (every green cell needs a real
  test or impl reference; no anchor → mark partial/unknown, never green); false 100% via optimistic
  rounding; treating "code exists" as "requirement met."

### release-notes
- **Mode** EXPLAIN. **Language** Editorial (read by users/stakeholders) or Swiss for a terse changelog.
- **Arc** the headline (what's newly possible) → notable changes grouped by impact → breaking changes
  & migrations → fixes.
- **Representations** typographic thesis hero; grouped `.ux-card` / list by theme; `.ux-badge`
  (new/changed/breaking/fixed); `.ux-callout--warn` for breaking changes.
- **Anchors** merged PR titles + SHAs in the range; the real version tags (from..to); the actual
  user-facing behavior change (read the diff, not the PR title's optimism).
- **Traps** marketing inflation (a refactor described as a feature); claiming a fix for an issue not
  actually closed; omitting a breaking change because it's awkward (absence-is-data — surface it);
  attributing a change to the wrong PR/SHA.

### migration-plan
- **Mode** EXPLAIN. **Language** Blueprint (structural plan) or Editorial for a proposal narrative.
- **Arc** current reality → target state → ordered steps → decision points / irreversible / unknown.
- **Representations** current→target `.ux-compare` block; risk-tiered `.ux-timeline` whose beats are
  the arc (risky/irreversible steps emphasized, routine recessed); open questions as `.ux-callout`.
- **Anchors** each "this will change X" tied to a real `file`/`symbol` it will touch, OR explicitly
  stamped "proposal"; current-state facts read from real config/code; real dep versions / counts.
- **Traps** asserting future steps as facts (everything unbuilt is "proposal," not fact); inventing a
  clean N-phase symmetry the work doesn't have; understating irreversible/risky steps; an effort or
  timeline number with nothing behind it.

---

## GAPS (not yet in code)

- **No playbook registry / job field in code.** Playbooks are authoring guidance only — there is no
  `job` field in the `<!--ux: …-->` build directive and `scripts/build.mjs` doesn't read one.
  Routing from a job to its playbook is the skill's reasoning (SKILL.md routing), not a mechanical
  lookup. Noted so nobody hunts for a `playbooks.json`.
- **No flame / treemap component.** perf-profile and any magnitude-profile job lean on `.ux-bars`
  (ranked bars) because `core.css` has bars/line/matrix but NO flamegraph or treemap primitive. The
  spec's "flame/treemap/ranked-bar magnitude profile" representation is bars-only today; true stack
  nesting has no first-class widget. Flag for the integrator.
- **No Sankey / volume-split component.** Flows that split and merge by volume (some migration /
  pipeline cases) have no Sankey primitive; use `.ux-graph` with labeled edges and note the loss.
- **TEACH-mode jobs reuse generic components.** onboarding-map's predict-then-reveal close is
  hand-built from `.ux-callout` + `.ux-details` (see `teaching.md` GAPS) — no dedicated widget.
- **No clickable-source anchors yet.** Several traps are mitigated by `file:line` anchors graduating
  to GitHub/editor links (spec's anchors.js / copy-jump affordance). Verify that module is wired
  before promising clickable anchors; otherwise anchors render as plain mono chips.
- **Coverage/audit counts are unverified by tooling.** Nothing in code enforces that a "covered"
  cell has a real anchor — the anti-fabrication discipline for coverage-map is entirely the TRUTH
  pass, not a mechanical guard.
