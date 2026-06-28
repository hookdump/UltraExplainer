# Self-Contained Delivery + Robustness

How an UltraExplainer page is assembled, why it survives being opened from a `file://` path on a stranger's machine, and the failure modes you must engineer around before you hand a page over. Read this every time you generate a page. The rules here are not style preferences — they are the difference between a page that renders and a page that overflows, flashes, or throws.

The canonical assets you inline are `assets/aurora.css` and `assets/aurora.js`. Every class, variable, and helper named below exists in those files — do not invent new ones. The class prefix is `.ux-`; the design system is "Aurora", with two themes (`data-theme="dark|light"`) and a toggleable glow layer (`data-fx="glow|flat"`). Glow is one optional layer, not the identity. The identity is clarity plus visualization variety: node-edge graphs with routed arrows, diffs, dashboards and charts, custom SVG, timelines, mermaid.

## 1. What "self-contained" means

A delivered page is one `.html` file. All CSS lives in an inline `<style>`. All behavior lives in inline `<script>`. No build step, no sibling files, no `<link rel="stylesheet">` to a local CSS file, no `<script src="./aurora.js">`. The user can move the file, email it, or open it offline and it looks and behaves identically.

There are exactly two permitted external requests, both optional:

- **Google Fonts** — the `<link rel="preconnect">` pair plus the `css2?family=Space+Grotesk…Inter+Tight…JetBrains+Mono` stylesheet in `<head>`. These are the display/body/mono faces. Aurora's `--font-display`, `--font-body`, and `--font-mono` all carry real fallback stacks (`system-ui`, `-apple-system`, `Segoe UI`, `SF Mono`, `ui-monospace`, …), so the page is correct and on-brand without them. Fonts are a nicety, never a dependency.
- **Mermaid CDN** — only on pages that actually render a mermaid diagram: `import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs"` in a `<script type="module">`. A page with no mermaid must not include this import.

Everything else — the Aurora stylesheet, the FOUC resolver, the connector engine, charts, the particle field, the theme/glow switcher — is inlined. There are no other hosts. No remote images (embed as `data:` URIs), no analytics, no web-component registries.

**Going fully offline.** To produce a page with zero network requests:

1. Delete the three font lines from `<head>` (the two `preconnect` links and the `fonts.googleapis.com/css2` stylesheet link). The fallback stacks render cleanly; nothing else changes.
2. If the page has a mermaid diagram and you need it offline, you cannot keep the CDN import. Either drop the mermaid section and express the relationship with a `.ux-graph` node-edge diagram (routed arrows, fully inline, no dependency — often the better choice anyway), or inline the entire `mermaid.esm.min.mjs` bundle into the module script. Inlining the bundle is large and rarely worth it; prefer the native graph.

State up front which mode you shipped. A page that "works offline except mermaid" is a page that silently shows an unrendered code block on a plane.

## 2. The build model

Assemble the file in this exact order. The ordering is load-bearing, not cosmetic.

```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>…</title>

  <!-- (optional) Google Fonts: preconnect pair + css2 stylesheet -->

  <!-- FOUC resolver: MUST run before the stylesheet -->
  <script>(function(){var d=document.documentElement,s=window.localStorage;var t=null;try{t=s.getItem('ux-theme')}catch(e){}d.dataset.theme=(t==='light'||t==='dark')?t:(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');var f=null;try{f=s.getItem('ux-fx')}catch(e){}d.dataset.fx=f==='flat'?'flat':'glow';})();</script>

  <!-- All of aurora.css, inlined -->
  <style> … </style>

  <!-- (optional) one extra <style> for page-specific grid-template-areas, etc. -->
</head>
<body>
  <div class="ux-field" aria-hidden="true"><canvas></canvas></div>
  <div class="ux-wrap"> … your content … </div>

  <!-- (optional) mermaid module, only if the page has a diagram -->

  <!-- All of aurora.js, inlined -->
  <script> … </script>
</body>
</html>
```

**The FOUC resolver goes in `<head>`, before the `<style>`, and runs synchronously.** It reads the saved `ux-theme` / `ux-fx` from `localStorage` (falling back to `prefers-color-scheme` for theme, `glow` for fx) and writes `data-theme` and `data-fx` onto `<html>` before first paint. Because every Aurora color and effect resolves from those attributes, the correct theme and glow state are applied before any pixel is drawn — no flash of the wrong theme, no flash of glow before flat. Wrap the `localStorage` reads in `try/catch`: `file://` pages and privacy modes can throw on storage access, and a throw here would leave the page unstyled.

**`aurora.js` goes last, before `</body>`.** It is safe to include wholesale: every subsystem auto-inits on boot and is a no-op when its target DOM is absent. `boot()` builds the switcher, initializes any `.ux-graph`, wires `.ux-tabbar` tabs, hooks `input[data-ux-filter]` table filters, and starts the `.ux-field` particle canvas. You do not call anything by hand; you just include the markup the engine looks for.

**CRITICAL — escaping `</script>` inside inlined JS.** The inlined `aurora.js` contains JavaScript strings that themselves contain the text `</script>` (in the documentation comment showing the FOUC snippet, and in the connector-engine markup example). An HTML parser ends the surrounding `<script>` block at the first literal `</script>` it sees anywhere in the text — including inside a JS string or comment. If you paste the raw text, the page breaks at that point: the rest of your script becomes visible body text and nothing initializes. **Every literal `</script>` inside an inlined script must be written `<\/script>`.** The backslash is invisible to the JS string but stops the HTML parser from closing the block early. The canonical `aurora.js` already uses `<\/script>` in both places; preserve those backslashes verbatim and apply the same escape to any `</script>`, `</style>`, or other closing tag you embed inside string/comment content of an inline script.

## 3. Overflow safety

The body must never scroll sideways. A single blown-out child produces a horizontal scrollbar across the whole page and is the most common defect. Aurora's base layer already does the heavy lifting — your job is to not defeat it and to put wide content in scrollers.

What the stylesheet guarantees for you:

- `*, *::before, *::after { min-width: 0; }` — grid and flex children default to `min-width: auto`, which refuses to shrink below content width. This global override lets every track shrink. Aurora's column helpers (`.ux-cols-2`, `.ux-cols-3`, `.ux-cols-auto`) also use `minmax(0, 1fr)` / `minmax(220px, 1fr)` so tracks never force overflow.
- `body { overflow-x: hidden; overflow-wrap: break-word; }` — the page cannot scroll sideways, and long unbroken strings wrap instead of pushing width. Inline `code` additionally sets `overflow-wrap: anywhere`.

What you must do:

- **Wide content lives in its own horizontal scroller — never the page.** Diffs, tables, trees, and mermaid each have a dedicated overflow region: put diff rows inside `.ux-diff__scroll` (`overflow-x: auto`); put tables inside `.ux-table-wrap > .ux-table-scroll`; `.ux-tree` is itself `overflow-x: auto` with `white-space: pre`; mermaid pans inside `.ux-mermaid-wrap` (`overflow: hidden`). A long line of code or a 12-column table scrolls within its panel while the page body stays put.
- **`white-space: pre` content is intentionally non-wrapping** — diff code (`.ux-diff__code`) and trees keep alignment by not wrapping, which is exactly why they need an `overflow-x: auto` ancestor. Never place pre-formatted or tree-connector content (`├──`, `│`, `└──`) in a wrapping context; the alignment turns to noise.
- **Never put `display: flex` on an `<li>` that uses a `::before` marker.** The flex layout creates an anonymous flex item for the text run, that anonymous box gets `min-width: auto`, and you cannot set `min-width: 0` on it — so a list item full of inline `<code>` badges overflows with no CSS fix. Mark list items with absolute positioning instead: `li { position: relative; padding-left: 14px; } li::before { position: absolute; left: 0; }`.
- **Lists inside bordered containers** (`.ux-panel`, `.ux-card`, `.ux-callout`) need `list-style-position: inside` or `padding-left: 2em`; the default ~20px lets outside markers overlap the border.
- **Custom SVG illustrations and charts must declare a viewBox and scale to their container** (`width: 100%; height: auto`), as `.ux-linechart` does. A fixed-pixel-width SVG wider than its column will overflow.
- **Embed images as `data:` URIs with `max-width: 100%`.** A remote image both violates self-containment and can blow out width before it 404s.

## 4. Responsive

Design for one column on a phone and a wider layout on a desktop. Test at **360px** width — that is the floor, and most overflow bugs only appear there.

- Aurora collapses its multi-column helpers automatically: at `max-width: 820px`, `.ux-cols-2` and `.ux-cols-3` become a single column. `.ux-cols-auto` and `.ux-kpis` use `auto-fit` with a `minmax` floor, so they reflow without a breakpoint.
- When you hand-write a `grid-template-areas` layout (as `architecture-graph.html` does for its request graph), you **must** supply a stacked single-column `grid-template-areas` inside a `@media (max-width: 820px)` block. A fixed multi-area grid does not collapse on its own and will overflow at 360px.
- The `.ux-graph` connector engine re-routes arrows on resize (it observes the host with `ResizeObserver` and listens for `resize`), so a graph whose node grid reflows keeps its arrows correct. Verify the arrows still read after the layout stacks.
- The `.ux-spine` rail drops its vertical line and node dots at `max-width: 560px` and becomes a bordered stack — do not reintroduce a fixed left padding that would clip it.
- **The switcher.** The fixed `.ux-fxbar` sits at `top: 14px; right: 14px` and moves to `top: 8px; right: 8px` at `max-width: 560px`. Confirm it does not cover your `<h1>` / kicker on a narrow screen; if your header content reaches the top-right corner, add top padding so the two never collide.
- Body padding is fluid (`clamp(28px, 5vw, 60px) clamp(18px, 5vw, 56px) 96px`); do not override it with fixed margins that reintroduce horizontal overflow.

## 5. Accessibility

- **Focus.** Aurora ships a global `:focus-visible { outline: 2px solid var(--cyan); outline-offset: 2px; }`. Keep interactive elements as real focusable elements (`<button>`, `<a>`, `<summary>`, `<input>`). The switcher and tabs are real `<button>`s; do not replace them with click-handled `<div>`s.
- **Reduced motion.** `@media (prefers-reduced-motion: reduce)` disables all animations and transitions globally; additionally the particle field (`initField`) bails out of its animation loop, the beam spark is hidden, and the check-mark draw is shown in its final state. Do not add motion that ignores this — if you author a new animation, it is already neutralized by the global rule, so don't fight it with `!important`.
- **Contrast is measured against the surface, not the nebula.** The corner nebula gradients and the particle field sit behind glass panels and are near-transparent; text contrast is `--text` / `--text-dim` / `--text-faint` against `--surface` / `--surface-2` / `--recessed`. Never place body text directly on the bare `--bg` over a nebula and assume it passes — keep readable text on a surface. Reserve `--text-faint` for incidental labels, not for content a reader must parse.
- **Semantic HTML.** Use real `<table>`/`<thead>`/`<th>`/`<td>` for tabular data (the `.ux-table` styles assume it and give you sticky headers), real headings (`.ux-thesis` on `<h1>`, `.ux-h2`/`.ux-h3` on `<h2>`/`<h3>`), and native `<details>`/`<summary>` for collapsibles (`.ux-details`). Tabs use `role="tablist"`/`role="tab"` with `aria-selected`; the engine toggles `aria-selected` and the panels' `hidden` attribute for you.
- **ARIA where it earns its place.** Mark the decorative `.ux-field` canvas and the SVG check/branch glyphs `aria-hidden="true"`. The switcher already sets `aria-label` on the theme button and `aria-pressed` on the glow button. Do not over-annotate; a correct heading outline and real controls beat a sprinkle of ARIA.

## 6. Delivery checklist

Before you consider a page delivered:

- [ ] Written to a real path on disk (a `.html` file), not just printed.
- [ ] Opened in a browser from that path. The page renders; it is not raw markup or a half-styled document.
- [ ] **Console is clean** — no errors, no failed requests beyond the two permitted hosts. A `</script>` that wasn't escaped to `<\/script>` shows up here as a syntax error and as visible stray text in the body.
- [ ] **Both themes verified** — toggle `◑ night` / `◐ day`. Colors are retuned, not inverted; text stays readable on surfaces in both.
- [ ] **Both fx modes verified** — toggle `✦ glow` / `○ flat`. Flat must keep all structure, color, and depth (it only removes glow/bloom/particles); nothing should disappear or lose meaning when glow is off.
- [ ] No horizontal page scroll at **360px**. Multi-column layouts have collapsed to one column; diffs/tables/trees/mermaid scroll inside their own region; the switcher does not occlude the header.
- [ ] If the page uses mermaid: the diagram rendered (not a bare code block), and you have stated whether the page is online-only or you swapped to a native `.ux-graph`.
- [ ] Self-containment holds: no `<link>`/`<script src>` to local files; images are `data:` URIs; the only external references are the optional fonts and the optional mermaid CDN.
