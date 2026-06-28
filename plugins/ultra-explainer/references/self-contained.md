# Self-Containment, Overflow Safety & the Verification Loop

How a delivered page stays a single portable file, never scrolls sideways, and gets *observed* before you ship it. Read this every time you generate a page — these are not style preferences, they are the difference between a page that renders and one that overflows, flashes, or dumps its source.

## What "self-contained" means

A delivered page is **one `.html` file**. All CSS lives in inline `<style>`; all behavior in inline `<script>`. The user can move it, email it, or open it offline (`file://`) and it looks and behaves identically. No sibling files, no `<link rel="stylesheet">` to a local stylesheet, no `<script src="./ux.js">`.

You don't hand-assemble this. `scripts/build.mjs` reads a body fragment (`templates/_src/<name>.body.html`) and inlines the three canonical assets into one file:

- `assets/core.css` — the design-language-agnostic component contract (every `.ux-` class, styled against semantic tokens only).
- `assets/themes.css` — the seven theme packs (one fills the tokens, chosen by `data-theme-preset`).
- `assets/ux.js` — the runtime: theme/glow switcher, connector graph, tabs, table sort/filter, the state→render engine (sliders/scenario/stepper), scroll-spy nav, particle field.

Run `node scripts/build.mjs <name-filter>`. The output `templates/<name>.html` is the self-contained deliverable. Every class and hook named in the reference docs exists in those three files — do not invent new ones.

### The only permitted external requests

- **Google Fonts** — a `<link rel="preconnect">` pair + one `css2?family=…` stylesheet, **per preset** (each language has its own pairing). Every `--font-display` / `--font-body` / `--font-mono` token carries a real system fallback stack (`system-ui`, `-apple-system`, `Segoe UI`, `ui-monospace`, …), so the page is correct and on-language without the webfonts. **Fonts are a nicety, never a dependency** — the layout never shifts if they fail.
- **Mermaid CDN** — only on pages that use Mermaid. The diagram shell degrades gracefully if it fails.

Everything else — the stylesheets, the FOUC resolver, the graph engine, charts, the switcher — is inlined. No remote images (embed as `data:` URIs), no analytics, no web-component registries.

## The FOUC-free resolver (in `<head>`)

`build.mjs` injects a tiny synchronous script in `<head>`, **before** the `<style>`. It sets `data-theme-preset` (the chosen language), then reads saved `ux-theme-<preset>` / `ux-fx` from `localStorage` (falling back to the directive's `theme` and `fx`) and writes `data-theme` + `data-fx` onto `<html>` before first paint. Because every color and effect resolves from those attributes, the correct theme/glow is applied before any pixel is drawn — no flash. The `localStorage` reads are wrapped in `try/catch` (file:// and privacy modes can throw).

## `ux.js` (last, before `</body>`)

Safe to include wholesale: every subsystem auto-inits on `boot()` and is a no-op when its target DOM is absent. It builds the switcher, initializes any `.ux-graph`, wires `.ux-tabbar` tabs, table sort/filter, `[data-playground]` / `[data-stepper]` / `.ux-seg[data-scenario-ctl]`, scroll-spy `.ux-nav`, and the `.ux-field` particle canvas (Luminous). You don't call anything by hand — you ship the markup the engine looks for. (Full API in `references/interactivity.md`.)

### CRITICAL — escaping `</script>` inside inlined JS

An HTML parser ends a `<script>` block at the **first** literal `</script>` it sees — even inside a JS string or comment. If any inlined script contains the text `</script>` (a documentation example, or markup-building code), the page breaks there: the rest becomes visible body text and nothing initializes. **Every literal `</script>` inside an inline script must be written `<\/script>`.** The backslash is invisible to JS but stops the parser from closing early. `ux.js` already does this; preserve those backslashes, and apply the same escape to any `</script>` / `</style>` you embed in string/comment content of an inline script. (This is the single most common way a generated page silently dumps its source — it has bitten this project twice.)

## No horizontal page scroll

The body must never scroll sideways — one blown-out child produces a page-wide scrollbar and is the most common defect. `core.css` does the heavy lifting; your job is to not defeat it and to put wide content in its own scroller.

- `*, *::before, *::after { min-width: 0; }` — grid/flex children default to `min-width:auto` and refuse to shrink below content width; this override lets tracks shrink. The column helpers (`.ux-cols-2/3/auto`, `.ux-kpis`) use `minmax(0,1fr)` so tracks never force overflow.
- **Wide content goes in an `overflow-x:auto` container.** Diffs use `.ux-diff__scroll`; tables use `.ux-table-scroll`; Mermaid/large SVG use the diagram shell. Never let a `<pre>`, a wide table, or a long code line widen the page.
- **Never `display:flex` on an `<li>` that shows a marker** — it drops the marker or overlaps the border. Directory trees use `white-space:pre`.
- **`[hidden]` loses to a class that sets `display`.** If you toggle visibility with `hidden` on an element that also has a `display:flex/grid` class (e.g. a stepper stage), add an explicit `.your-class[hidden]{display:none}` rule, or the hidden state won't take.
- In your own `head` styles, anything with a fixed or `min-width` larger than a phone must be wrapped or allowed to shrink. Verify at 360px.

## Responsive & a11y (handled by core.css — don't undo it)

- Column helpers collapse to one column on narrow viewports; `.ux-kpis`/`.ux-cols-auto` reflow with `auto-fit` + a `minmax` floor.
- Global `:focus-visible` outline. Keep interactive elements real and focusable (`<button>`, `<a>`, `<summary>`, `<input>`); the switcher, tabs, steppers and segmented controls are real `<button>`s — don't replace them with click-handled `<div>`s.
- `prefers-reduced-motion` disables the particle field, beam drift, and autoplay. `prefers-color-scheme` seeds the initial theme. A `@media print` path hides chrome and forces a light, ink-friendly page.

## The verification loop — OBSERVE before you ship

The page is not done when the markup looks right; it's done when you've **looked at the rendered result**. Don't assert checklist properties you never measured.

1. Build it: `node scripts/build.mjs <name>`.
2. Render headless and screenshot at ~1280 **and** ~360 (a Chrome/puppeteer harness, or open it and look).
3. Capture console errors. Assert: no horizontal page scroll; the thesis is in the first viewport; exactly one focal point; the `</script>` source-dump bug is absent; theme (and Luminous glow) toggles work.
4. If anything's wrong, fix and re-render. Repeat until clean.

A page that was reasoned-about but never rendered fails the **OBSERVED** gate.
