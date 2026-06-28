# Teaching (TEACH mode)

The reference for building pages that INSTALL a runnable mental model, not just assert a
conclusion. Read this when the charter mode is TEACH (learner audience). It sits on top of
`synthesis-method.md` — same charter → thesis → ledger → reconcile → audit pipeline, same
anchor-or-omit invariants — and changes only the ARC, the salience logic, and the ordering.

---

## The EXPLAIN vs TEACH mode switch (set at the charter)

Add ONE field to the charter alongside artifact/altitude/audience/job: the **mode**. Pick it
from the audience and the job, then STATE it on its own line so the user can correct you (`MODE:
TEACH because the audience is a learner who must rebuild the model, not approve a change`).

| | **EXPLAIN** (default) | **TEACH** |
|---|---|---|
| Reader | reviewer · decision-maker · context-switcher | learner with a gap or a wrong model |
| Job | get the conclusion FAST, then verify | leave able to REASON about a new case |
| First screen | the thesis, stated | a specific QUESTION the reader can't yet answer |
| Arc | thesis-first (claim → evidence) | question-first (curiosity → concrete → rule) |
| Salience | hard caps **T0 ≤ 3 / T1 ≤ 7**, skim-tuned | desirable-difficulty budget (see below) |
| Ends with | the receipts (T2 anchors) | a transfer test the reader predicts unaided |

Same EVIDENCE SPINE in both modes — the ledger, anchors, and confidence channel are identical;
a TEACH page is anchored exactly as hard as an EXPLAIN page. What flips is reading order and
where emphasis is spent. EXPLAIN is the default; choose TEACH only when the job is "rebuild the
model" / "understand why," never "decide" or "approve." When unsure, default EXPLAIN and say so.

---

## The learner-state artifact (parallel to the evidence ledger)

In EXPLAIN you build an evidence ledger. In TEACH you ALSO build a learner-state model, captured
before you choose representations. Three fields, written down:

- **PRIOR-KNOWLEDGE FLOOR** — what you assume the reader already has (e.g. "knows what a thread
  is, has never used a lock"). Everything below the floor is unexplained; everything at the floor
  is the launch point. Setting it too high loses them; too low bores them.
- **CURRENT MODEL** — the reader's most likely CURRENT mental model, which is usually wrong or
  absent. Name it concretely ("they think `await` makes code run in parallel"). This is your
  before-state. If you can't name a plausible wrong model, the topic may not need TEACH at all.
- **MISCONCEPTIONS TO PRE-EMPT** — the specific wrong turns this topic invites, listed so you can
  defuse each one at the moment it would otherwise fire.

The TARGET model is the thesis. **Every teaching move = a justified diff from current → target.**
Before adding any panel, ask: "which gap in the current model does this close?" A move that
doesn't move the model toward target is decoration — cut it. This is the TEACH analogue of
anchor-or-omit.

---

## Enforced TEACH ordering

These four rules OVERRIDE the EXPLAIN defaults from synthesis-method while keeping every truth
gate intact.

**1. Concrete-before-abstract.** Never state a general rule, definition, or formula before at
least ONE concrete worked instance with real values. The instance earns the rule; the rule
generalizes the instance. Show `retry after 1s, 2s, 4s, 8s` before you say "exponential backoff."
An abstraction stated cold is a definition the reader memorizes and cannot use.

**2. First-QUESTION gate (replaces the first-VIEWPORT gate).** EXPLAIN renders the thesis in the
first screen. TEACH renders a QUESTION the reader feels but cannot yet answer — specific, not
"ever wondered how X works?". Simulate a cold reader given the top ~900px and 10 seconds, and
confirm: (i) they feel a specific curiosity or a productive surprise; (ii) they are NOT simply
handed the conclusion; (iii) there is an obvious reason to read on to resolve the tension. Giving
away the answer here kills the desirable difficulty that makes the model stick.

**3. Desirable-difficulty budget (replaces the skim-tuned T0 ≤ 3 / T1 ≤ 7 caps).** A learner
should do a small amount of WORK — predict, compare, trace — because effort that is productive is
what builds durable models. Spend the budget on prediction and on the naive-vs-correct contrast;
do NOT spend it on accidental load (jargon before its definition, a crowded diagram, an
unmotivated formula). Still one focal point per viewport, still no T2 leaking up — but the page
may legitimately ask more of the reader than a skim-tuned EXPLAIN page.

**4. End with a transfer / exit-ticket.** The page closes with a NEW case the reader predicts
UNAIDED — different surface details, same underlying mechanism. This is how you (and they) verify
the model transferred rather than that they memorized the worked example. Reveal the answer with
reasoning only after they commit (see predict-then-reveal). A TEACH page with no transfer test has
asserted a model but never checked it landed.

---

## Honest-analogy discipline

Analogies are TEACH's sharpest tool and its most common lie. **Every analogy ships its
breakpoint** — the place it stops being true — in the same breath:

> A mutex is like a bathroom key: only one person holds it at a time. EXCEPT a mutex doesn't make
> anyone wait politely — a thread that wants a held lock blocks dead until it's released.

The `EXCEPT` clause is mandatory, not optional polish. An analogy without its breakpoint installs
a NEW misconception (and goes straight onto the learner-state misconception list for the next
reader). If you can't state where an analogy breaks, you don't understand it well enough to use
it. Render the breakpoint with visible weight — a `.ux-callout--warn`, or the "after"/breakpoint
side of a `.ux-compare` — never buried in a parenthetical.

---

## Which components serve teaching

All exist in `core.css` / `ux.js` today. Compose only what the page uses.

**Notebook is the default-quiet TEACH home.** `preset:"notebook"` gives the Tufte field-notebook
grammar: a content column plus a wide sidenote margin. Use `.ux-sidenote-layout` (a 2-col grid:
`minmax(0,var(--measure))` content + sidenote) with `.ux-sidenote` for commentary that sits beside
the artifact without breaking the read — definitions, caveats, the analogy breakpoint. It collapses
to one column under 900px automatically. This is where dense explanation goes quiet.

```html
<!--ux: {"title":"How backoff actually spaces retries","preset":"notebook","theme":"light"} -->
<div class="ux-sidenote-layout">
  <div class="ux-prose"><p>The client waits 1s, then 2s, then 4s…</p></div>
  <aside class="ux-sidenote">Doubling each time is what "exponential" means here — linear
    backoff would wait 1s, 2s, 3s.</aside>
</div>
```

**Naive-vs-correct paired panels** — `.ux-compare`. Label the wrong panel "what you'd expect" and
show why it's TEMPTING before you show why it's wrong; the right panel is the target model. The
before side auto-colors `--bad`, the after side `--good`.

```html
<div class="ux-compare">
  <div class="ux-compare__side ux-compare__side--before">
    <div class="ux-compare__tag">What you'd expect</div>
    <p>await runs both fetches at the same time.</p>
  </div>
  <div class="ux-compare__side ux-compare__side--after">
    <div class="ux-compare__tag">What actually happens</div>
    <p>await pauses HERE until fetch #1 resolves, then starts #2 — sequential.</p>
  </div>
</div>
```

**Step-through walkthrough** — `[data-stepper]`. When order and intermediate STATE are the
meaning (an algorithm mutating an array, a request hopping services), scrub it. A `.ux-steps` JSON
script holds `{cap, lines, show}` objects; `[data-step="next|prev|reset"]` buttons (+ arrow keys)
advance it; the active step highlights `.l` code lines by 1-based number and toggles
`[data-step-show="N"]` blocks. Each step is one move from current → target.

```html
<div data-stepper data-code="#sort">
  <pre class="ux-codeblock" id="sort"><span class="l">i = 0</span><span class="l">swap(a,b)</span></pre>
  <script type="application/json" class="ux-steps">[
    {"cap":"Start: nothing sorted yet.","lines":[1]},
    {"cap":"First swap — 5 and 2 trade places.","lines":[2]}
  ]<\/script>
  <p class="ux-step-cap" data-step-cap></p>
  <div class="ux-stepper"><button data-step="prev">‹</button>
    <span data-step-n></span><button data-step="next">›</button></div>
</div>
```

**Parameter playground** — `[data-playground]`. For a relationship the reader should FEEL by
changing an input (cache hit-rate, growth curve, latency budget). `.ux-state` JSON seeds state,
`data-derive="fnName"` computes derived values, `[data-param]` ranges write state, and
`[data-show]`/`[data-fill]`/`[data-out]` mirror it live. Earn it: every range/default/formula is
anchored or stamped "illustrative model, not measured" — an explorable scrubbing a fabricated
relationship is the cardinal interactive sin.

**Predict-then-reveal** is the move that distinguishes TEACH from EXPLAIN: pose a NEW case, make
the reader COMMIT before the answer appears (the no-peeking commitment IS the learning), then
reveal with reasoning. There is **no dedicated predict-then-reveal widget in code yet** — build it
from `.ux-details`, whose body stays hidden until the reader opens the `<summary>`:

```html
<div class="ux-callout">
  <p><b>Predict:</b> the cache is 90% warm and a miss costs 50ms. Before you open this —
  what's the average lookup time? Commit to a number.</p>
</div>
<details class="ux-details">
  <summary>Reveal the answer</summary>
  <div class="ux-details__body">
    0.9·0 + 0.1·50 = <b>5ms</b>. If you guessed ~25ms you averaged hit and miss equally —
    but 9 of 10 lookups pay nothing. That weighting is the whole point of caching.
  </div>
</details>
```

The commitment prompt MUST come before the `<details>` and must ask for a specific answer; the
reveal must explain WHY a wrong guess is wrong, not just state the right number. Use this for the
closing transfer test.

---

## GAPS (not yet in code)

- **No dedicated predict-then-reveal widget.** `v2_spec.json` lists a "predict-then-reveal widget"
  primitive (gate the answer behind the reader's own manipulation/commit; wrong answers explain
  why). `ux.js` has no such init. Today: hand-build from `.ux-callout` (prompt) + `.ux-details`
  (gated reveal) as above. A real widget would capture the reader's committed answer, enforce the
  no-peek gate programmatically, and branch the explanation on the specific wrong answer. Flag for
  the integrator.
- **No `mode` field in the build directive.** TEACH/EXPLAIN is a reasoning/charter decision with
  no mechanical hook in `scripts/build.mjs` — it changes how you author, not a flag the assembler
  reads. The directive carries `preset`/`theme`/`fx` only. If a switchable artifact is wanted, it
  would need adding.
- **No learner-state artifact in code.** It is an authoring discipline (like the evidence ledger),
  not a rendered component — correctly so. Noted only so nobody hunts for a `.ux-learner-state`.
- **First-QUESTION gate is not measured.** The render-and-observe loop (`self-contained.md`)
  asserts thesis-in-first-viewport for EXPLAIN; there is no automated check that a TEACH page leads
  with a question rather than a conclusion. It remains a manual gate.
- **Stepper highlights code lines only.** `initStepper` toggles `.l` line highlights and
  `[data-step-show]` blocks, but has no built-in code↔data two-pane lockstep beyond what you wire
  with `[data-step-show]`; the richer coordinated code↔data view in the spec is hand-assembled.
