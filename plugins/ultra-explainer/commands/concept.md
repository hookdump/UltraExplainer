---
description: Explain a technical concept/algorithm with a custom SVG illustration (self-contained HTML page)
argument-hint: [concept to teach]
---

Use the **ultra-explainer** skill to teach: $ARGUMENTS

Start from `templates/editorial-concept.html`. Structure it as: the question it answers → a naive-vs-correct pair of panels (label the wrong one "what you'd expect") → **one worked concrete example with real values traced through** → edge cases in a collapsed appendix. Build a **custom inline-SVG illustration** of the mechanism (not just boxes) — use theme tokens, `context-stroke` arrowheads, and mono labels. The difference between naive and correct is the focal point. Write the file, open it, summarize in one line.
