# Slide decks

A deck is a different medium from a scrolling page: one idea per viewport, big type, visible navigation. Use it only when the user asks for slides/a presentation/a deck, or a command requests it. Start from `templates/slides.html`.

## Structure

- The deck is `.ux-deck` (a `100dvh` scroll-snap container); each slide is a `.ux-slide` (`100dvh`). `slides.head.html` overrides the body to `overflow:hidden` and supplies slide-type CSS; `slides.foot.html` runs the `SlideEngine` (progress bar, dots, counter, hint, `IntersectionObserver` reveal, keyboard/scroll/touch nav).
- Wrap each slide's children in `.reveal` to get staggered entrance (auto-disabled under `prefers-reduced-motion`).
- The theme/glow switcher and particle field still work — they come from the inlined `aurora.css`/`aurora.js`.

## Slide types (compose freely)

| Class | Use |
|---|---|
| `.slide--title` | Opening / closing — centered `.s-display` headline (use `.lit` for the gradient word) + mono sublines |
| `.slide--divider` | Section break — giant faint `.s-num` ("01") behind an `.s-h` beat |
| `.slide--split` | Before/after or two-column — `.s-cols` grid with `.s-bullets` |
| (plain) + `.s-kpis` | Dashboard slide — reuse `.ux-kpi`/`.ux-kpi--focus` for one lit metric |
| `.slide--diagram` | A `.mermaid` flowchart sized to ≤64vh; init in the foot (see below) |
| `.slide--quote` | A single line — `.mark` quote glyph + `blockquote` |

## Rules

- **One idea per slide.** Larger type than a page (`.s-display` is 46–100px). Fewer objects. Vary composition (centered, split, full-bleed) so it doesn't feel like a paginated article.
- **Inventory the source first**, map every item to a slide, and *add slides* rather than cramming — never drop content to hit a fixed count.
- **Mermaid on a slide**: render at presentation scale (18px labels). Init with `theme:'base'` + Aurora `themeVariables` read from `data-theme` (see `references/mermaid.md`); the slides foot already does this.
- Keep the salience discipline: one focal point per slide, glow only on the T0 element, everything else calm.
- The first slide is the cover; the last is a clear next-step CTA.
