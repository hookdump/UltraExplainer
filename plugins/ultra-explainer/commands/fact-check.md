---
description: Fact-check a generated UltraExplainer page against the real code and git history
argument-hint: [path to the .html page]
---

Run the in-loop TRUTH audit from the **ultra-explainer** skill against an existing page: ${ARGUMENTS:-the most recently generated page}

Walk the page element by element. For every node, edge, label, number, signature, and behavioral claim, **re-open the anchor** (file:line, symbol, git ref, metric source) and confirm the page still matches the live source — do not trust memory. Classify each as verified / corrected-in-place / downgraded-to-inferred / deleted, and fix the page in place: hedge or remove anything unsupported, and hunt structural hallucinations (invented layers/queues/caches, false symmetry, ordering claims not in the code, rationale with no commit/comment anchor). Report what you changed.
