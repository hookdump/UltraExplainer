---
description: Generate a metrics dashboard as a self-contained HTML page
argument-hint: [metrics source or what to measure]
---

Use the **ultra-explainer** skill to build a metrics dashboard for: $ARGUMENTS

Start from `templates/instrument-dashboard.html`. Lead with the headline delta as one focal KPI (with units + source + as-of date), then the leanest charts that reveal the comparison (a line for trend, bars for magnitude, a matrix for a breakdown) and a supporting table. Encode magnitude quantitatively, direct-label over legends, and add a "read carefully" caveat about what could mislead. Use real numbers from a command you actually ran (else mark `~`). Write the file, open it, summarize in one line.
