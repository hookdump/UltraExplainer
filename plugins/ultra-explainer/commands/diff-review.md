---
description: Generate a visual diff/PR review as a self-contained Aurora HTML page
argument-hint: [ref/range or PR, e.g. main..HEAD]
---

Use the **ultra-explainer** skill to produce a diff review HTML page for: ${ARGUMENTS:-the current working changes}

Gather the real diff (e.g. `git diff`, `git show`, or the PR). Lead with a thesis: the one behavioral change that matters, not a file list. Start from `templates/diff-review.html`. Show only the **decisive hunks** with the behavioral delta stated in plain language beside each, anchored to `file:line` + the git ref; put the full file-by-file diff in a collapsed `<details>`. Add a **blast radius** section (callers, API surface, tests) and mark any caller-impact you inferred-but-didn't-grep as unverified. End with a verdict. Write the file, open it, summarize in one line.
