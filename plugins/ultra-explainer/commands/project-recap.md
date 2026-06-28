---
description: Generate a visual project recap for context-switching, as a self-contained Aurora HTML page
argument-hint: [optional: time window or area]
---

Use the **ultra-explainer** skill to produce a project recap that lets someone (or future-you) rebuild context fast: $ARGUMENTS

Pull from recent git history, open work, and the code itself. Audience = future-self context-switch. Lead with where things stand (the thesis), then: what changed recently (a timeline), the current architecture touchpoints (a small node-edge graph or cards), what's in-flight, and the open questions / next steps as explicit callouts. Anchor claims to commits and `file:line`. Prefer `templates/architecture-graph.html` or a composed page. Write the file, open it, summarize in one line.
