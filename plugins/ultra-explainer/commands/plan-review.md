---
description: Compare a plan/requirements against the codebase as a self-contained Aurora HTML audit
argument-hint: [path to plan, or describe the requirements]
---

Use the **ultra-explainer** skill to audit a plan/requirements against the current codebase: $ARGUMENTS

Read the plan and the relevant source. Build a point-by-point audit using `templates/data-table.html`: each requirement vs. what the code/plan actually does, with a status badge (match / partial / gap). Lead with the thesis (e.g. "N of M met — the gap is X"), KPI summary, a live-filterable table, and a collapsed detail for each gap. Anchor every "the plan does X" claim to the plan text or a `file:symbol`; mark inferences explicitly. Write the file, open it, summarize in one line.
