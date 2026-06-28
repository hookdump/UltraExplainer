---
description: Generate a metrics dashboard as a self-contained Aurora HTML page
argument-hint: [metrics source or what to measure]
---

Use the **ultra-explainer** skill to build a metrics dashboard for: $ARGUMENTS

Start from `templates/dashboard.html`. Lead with the headline delta as one focal-glow KPI (with units + source + as-of date), then the leanest charts that reveal the comparison (area for trend, bar for magnitude, donut for breakdown) and a supporting table. Encode magnitude quantitatively, direct-label over legends, and add a "read carefully" caveat about what could mislead. Use real numbers from a command you actually ran (else mark `~`). Write the file, open it, summarize in one line.
