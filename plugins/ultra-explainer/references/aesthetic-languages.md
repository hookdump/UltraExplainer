# Aesthetic Languages — picking and wielding one of the 7

**What this is:** the CRAFT brain. How you choose ONE of UltraExplainer v2's 7 design
languages for a page, and the exact character of each. **Read it before you set
`data-theme-preset`** — i.e. before you write the build directive on line 1 of a `_src` body.
Everything here is sourced from `assets/themes.css` and `scripts/build.mjs`; don't invent
languages, fonts, or tokens beyond what those files define.

## Two-layer architecture

The component contract (`core.css`, all `.ux-*` classes) is design-language-AGNOSTIC: it styles
only against abstract semantic tokens (`--accent`, `--font-display`, `--radius`, `--grain`, …)
and never names a color or font. The 7 theme packs (`themes.css`) are the swappable layer: each
`[data-theme-preset="X"]` block FILLS those tokens (a primary tuning + a light/dark counter-tuning)
and adds structural signature overrides (e.g. Blueprint's cornered focal frames, Instrument's
hairline-fused KPI masthead, Editorial's serif pull-quote callouts). So the SAME `.ux-diff`
renders as an IDE gutter under Terminal, a ruled figure under Editorial, a bordered note under
Blueprint. **Selection is a single act:** set `preset` in the directive
(`<!--ux: {"preset":"blueprint", …} -->`), which the build inlines as `data-theme-preset` on
`<html>` before paint. You never touch component classes to switch languages.

## Selection scorecard

Score the 7 against four axes, then route. Do this BEFORE writing the body.

1. **SUBJECT** — what the page is *about* (architecture? a diff? metrics? a concept?).
2. **AUDIENCE** — who reads it (engineers at a terminal? a stakeholder skimming? a learner?).
3. **MEDIUM** — how it's consumed (live system-flow demo? printed/PDF whitepaper? dashboard? deck?).
4. **Implied tone** — the register the request carries (rigorous, narrative, quiet, urgent, wow).

Pick the language that wins the most axes. The routing tables:

| SUBJECT | → language |
|---|---|
| architecture, schemas, protocols, infra topology | **Blueprint** |
| concept, ADR, post-mortem, exec narrative, essay | **Editorial** |
| diff, PR, CLI, CI, logs, code walkthrough | **Terminal** |
| metrics, benchmarks, audits, dashboards, SLOs | **Instrument** |
| teaching, walkthrough, onboarding, tutorial | **Notebook** |
| comparison, principle page, status report, deck | **Swiss** |
| system-flow demo, wow-factor brief | **Luminous** |

| AUDIENCE | → leans |
|---|---|
| engineers, on-call, reviewers | Terminal / Instrument |
| execs, stakeholders, customers | Editorial / Swiss |
| learners, new hires | Notebook |
| architects, platform teams | Blueprint |
| a launch/demo crowd | Luminous |

| MEDIUM | → leans |
|---|---|
| printed / PDF / long-form read | Editorial / Notebook |
| dashboard / monitor / readout | Instrument |
| slide deck / poster / one-screen verdict | Swiss |
| live interactive system demo | Luminous / Blueprint |
| IDE-adjacent, copy-into-PR | Terminal |

**Tie-breakers, in order:**
1. **Honor explicit user requests.** If they say "make it look like a terminal" / "magazine style"
   / "blueprint", that wins outright — skip scoring.
2. **TEACH mode bias.** If the page is in TEACH mode (patient, scaffolded), prefer **Notebook**
   — it is the default-quiet teach home.
3. **Rotate to avoid session monotony.** If the last page used language L, and the current subject
   is a genuine tie between L and another, pick the other. Don't ship three Terminals in a row.
4. **NEVER pick Luminous just because it's flashy.** Luminous is only correct when the subject is
   literally system flow or the user explicitly asked for wow/glow. It is never the default and
   never the safe choice.

**Record one auditable line** at the top of your reasoning (not in the page):

```
LANGUAGE: Terminal because subject=PR-diff + audience=reviewers + medium=copy-into-PR
```

## Per-language profiles

Pull these exactly when you build. Fonts are the `--font-*` stacks in `themes.css`, loaded via the
`FONTS` map in `build.mjs`. Natural theme is the `NATURAL` map in `build.mjs` (the default when the
directive omits `theme`).

### Blueprint — `preset:"blueprint"`
- **Character / signature move:** cyanotype ink-on-graph. `body` carries a 22px graph grid
  (`--grain` cross-hatch, `background-size:22px 22px`); `.ux-panel--focal` gets **cornered L-frames**
  (12px brackets, top-left + bottom-right via `::before`/`::after`). Kickers and section titles
  ride wide `0.22em` tracking. Tight 4px radius.
- **Palette:** blue ink on pale graph paper. Accent `#1b6ec2` (signal blue), accent-2 `#0e7c86`
  (teal). Text `#16314f`. Dark tuning: deep navy ground `#0a1626`, accent `#4aa3e8`.
- **Fonts:** IBM Plex Sans (display + body) / IBM Plex Mono (mono).
- **Natural theme:** light.
- **Use when:** system architecture, data schemas, protocols, infra/network topology — anything
  where structure and precision are the message.

### Editorial — `preset:"editorial"`
- **Character / signature move:** magazine / whitepaper. Huge serif `.ux-thesis`
  (`clamp(34px,5.4vw,64px)`, tight 0.98 line-height, oxblood `.lit` italic accent); section titles
  are small-caps gold-underlined labels; `.ux-panel` is a bordered note with a **3px gold top rule
  and no shadow**; `.ux-callout` becomes a serif italic pull-quote (oxblood left bar, gold top+bottom
  hairlines). Near-square 3px radius.
- **Palette:** warm paper `#f6f1e7`, ink `#1f1a14`, **oxblood** accent `#8a2b2b` + thin **gold**
  rule `#b08d2e`, blue accent-2 `#2a4a7a`. Dark tuning: charcoal ground `#1a1814`, cream text,
  rose+gold accents.
- **Fonts:** Fraunces (display) / Newsreader (body serif) / JetBrains Mono (mono).
- **Natural theme:** light.
- **Use when:** concepts, ADRs, post-mortems, exec narratives, long-form essays — top-to-bottom
  stakeholder reading.

### Terminal — `preset:"terminal"`
- **Character / signature move:** developer-native IDE chrome. Near-black ground, syntax-token
  accents, fine 16px dot grain. Kicker recolored to green `--accent-2`. Diffs read as gutter rows;
  the language owns the `--tok-*` palette so code looks native. 6px radius.
- **Palette:** `#0c1018` ground; accent `#67c0ff` (sky), accent-2 `#6ee7a8` (green), meta `#c084fc`
  (violet — allowed here as a *token color*, not a default accent). Tokens: key violet, str green,
  fn sky, num orange. Light tuning is a **Solarized-light** flip (`#fdf6e3` paper, `#268bd2` blue).
- **Fonts:** Inter Tight (display + body) / JetBrains Mono (mono).
- **Natural theme:** dark.
- **Use when:** diffs, PRs, CLI sessions, CI output, logs, code walkthroughs.

### Instrument — `preset:"instrument"`
- **Character / signature move:** Bloomberg-terminal / lab readout. **KPI masthead fused by
  hairlines** (`.ux-kpis` = 1px gaps over a hairline ground, `.ux-kpi` borderless/shadowless),
  oversized tabular numerals (`--val` letter-spacing -2px, `tabular-nums`), 10px tracked-out
  section labels, dense tabular tables (12.5px, tabular-nums), horizontal gridline grain (26px
  repeating rule). Square 4px radius, near-zero shadow.
- **Palette:** GitHub-dark slate `#0d1117`; **colorblind-safe categorical** accents — `#4c8dff`
  blue, `#2aa9b8` teal, `#b98cff` violet; good `#3fb950`, warn `#d29922`, bad `#f85149`. Light
  tuning is a crisp white instrument panel (`#ffffff` surface, `#2f6fe0` blue).
- **Fonts:** Inter Tight (display + body, Geist fallback) / Geist Mono → JetBrains Mono (mono).
- **Natural theme:** dark.
- **Use when:** metrics, benchmarks, audits, dashboards, SLO/error-budget readouts.

### Notebook — `preset:"notebook"`
- **Character / signature move:** Tufte field-notebook. Warm cream paper with a **fine speckle
  grain** (two radial dot layers + manila tint, `background-size:7px/13px`); serif thesis at
  restrained scale; section titles are humanist-mono with a **dashed ink underline**; `.ux-callout`
  and `.ux-sidenote` read as true **margin annotations** (italic serif, hanging accent rule). Soft
  8px radius, gentle inset highlight on panels. This is the **default-quiet TEACH home**.
- **Palette:** cream `#f4efe4`, ink `#2a2620`, **ink-blue** accent `#2f5d8a` + **oxblood**
  accent-2 `#8a3b2b`, brown-gold `#6b5b3e`. Dark tuning: cozy warm-charcoal `#211d18`, blue+terracotta.
- **Fonts:** Karla (display) / Literata (body serif) / Source Code Pro (mono).
- **Natural theme:** light.
- **Use when:** teaching, step-by-step walkthroughs, onboarding, tutorials — especially in TEACH mode.

### Swiss — `preset:"swiss"`
- **Character / signature move:** International Typographic Style. **Zero decoration** — no shadow,
  no grain, **0px radius (hard corners)**. Structure shows through **THICK rules**: section titles
  carry a 3px top border, panels a 1.5px solid border (focal 2px accent), KPI numerals are oversized
  (`clamp(40px,6.5vw,72px)`, -3px tracking), thesis is massive bold (`clamp(36px,6vw,76px)`,
  -2.4px). ONE saturated accent does all the signaling.
- **Palette:** pure white `#ffffff`, near-black ink `#0a0a0a`, **ONE signal-red** accent `#e8000d`;
  accent-2 is just the ink black. Dark tuning: near-black `#0a0a0a`, white ink, brighter red `#ff2a36`.
- **Fonts:** DM Sans (display + body) / Fira Code (mono).
- **Natural theme:** light.
- **Use when:** comparisons, principle/manifesto pages, status reports, slide decks — high-contrast,
  one-glance clarity.

### Luminous — `preset:"luminous"` (NEVER the default)
- **Character / signature move:** the former Aurora, demoted to ONE option. Glass panels
  (`backdrop-filter: blur(16px) saturate(1.2)`), budgeted glow, optional particle field, the
  connector-engine graph. **It is the ONLY language that lights the `--fx-*` layer** (accent/good
  glow, focal bloom, node halo, edge drop-shadow, text-accent, field opacity) — so `fx:"flat"` is
  one switch that kills all of it. Large 16px radius.
- **Palette:** blue-black `#05070d`, azure→cyan→green ramp — accent `#38e0e6` (cyan), accent-2
  `#3b82f6` (blue), good `#2bd58a`; `--grain` is multi-stop radial gradient blobs (the only
  language allowed gradient-mesh). Light tuning: `#eef2fb` ground, dimmer cyan/blue, reduced glow.
- **Fonts:** Space Grotesk (display) / Inter Tight (body) / JetBrains Mono (mono).
- **Natural theme:** dark.
- **Use when:** system-flow demos, animated connector graphs, a wow-factor brief, AND only when the
  subject is genuinely flow/motion or the user explicitly asked for it.

## Cross-cutting laws (every language obeys these)

- **No system-only body font.** Never ship a page whose body is Inter/Roboto/Arial/`system-ui`
  ALONE — every preset names a real display+body stack (these are the fallbacks, not the face).
- **No violet/fuchsia default accent.** Never `#8b5cf6` / `#7c3aed` / `#a78bfa` / `#d946ef` as the
  primary accent. (Violet appears only as a *token/categorical* color in Terminal/Instrument/Luminous —
  never the lead.)
- **No gradient-mesh blobs** unless the language OWNS that texture — only Luminous does.
- **Never pure `#000`/`#fff` for text or bg** — except Swiss, which deliberately owns pure
  white/near-black as its grammar.
- **Both light AND dark** must work — every preset ships a primary tuning and a counter-tuning.
- **Flat-first.** Texture is a removable `--fx-*` layer (default empty/off); reduced-motion and
  print must stay legible.
- **The squint test is the gate** (next section).

## The squint test (the craft gate)

State it operationally: **render the page, step back until the text blurs, and ask — could this be
mistaken for any of the other 6 languages recolored?** From across the room a Blueprint (graph grid +
cornered frames), an Editorial (serif columns + gold rules), and a Terminal (dark IDE chrome) must
be **instantly different OBJECTS**, not one layout with a new palette. If the only difference you can
name at a squint is "the accent color changed," you have failed — the language's *structural*
signature (grid, rule weight, masthead, margin notes, glass) isn't carrying. Fix the structure before
shipping; truth and beauty don't excuse a recolored template.

## Light/dark + glow/flat toggles

- **Initial state** comes from the directive: `theme:"light|dark"` (defaults to the preset's
  `NATURAL` value) and, for Luminous only, `fx:"glow|flat"` (defaults to `glow` for luminous, `flat`
  otherwise). The `build.mjs` resolver runs **before paint**, reading `localStorage` first so a
  returning visitor's choice wins, then falling back to the directive default.
- **Persistence keys:** light/dark is stored per-preset under `ux-theme-<preset>`; the glow/flat
  choice under `ux-fx`. So a user's Terminal-dark preference doesn't bleed into Blueprint.
- **The switcher UI** is built by `buildSwitcher()` in `ux.js`: it always offers a light/dark toggle,
  and appends a **glow/flat button ONLY when `data-theme-preset="luminous"`** (the `.ux-fxbar`/
  `.ux-fxbtn`). Suppress the whole control with `[data-no-switcher]` on a page that must stay fixed.

## GAPS (not yet in code)

- **No EXPLAIN-vs-TEACH preset coupling.** The brief frames Notebook as "the default-quiet TEACH-mode
  home" and references an EXPLAIN/TEACH switch, but nothing in `build.mjs` or `themes.css` reads a
  mode flag or auto-routes TEACH→Notebook. The directive has no `mode` field. Tie-breaker #2 above is
  therefore a *manual* authoring rule, not enforced by the build.
- **No session-rotation memory.** Tie-breaker #3 ("rotate to avoid monotony") has no support in code —
  there is no record of the previously built preset. It relies entirely on you tracking it within a
  session.
- **No machine-checked squint test.** The squint gate is a human/Claude judgment in the render-and-
  observe loop; there is no automated structural-distinctness check.
- **`--accent-3` is defined but not in the brief's SEMANTIC token list.** Every preset sets
  `--accent-3` (e.g. Blueprint `#5b6b9e`), and Terminal/Instrument/Luminous set `--tok-*` colors, but
  the brief's token tier list omits both groups — document against `themes.css`, which is the source
  of truth, but flag the spec drift.
