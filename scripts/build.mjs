#!/usr/bin/env node
/* Repo-dev convenience wrapper. The canonical build script ships INSIDE the
   plugin (so installed users have it too); this just delegates to it, passing
   through process.argv. Run from the repo root:  node scripts/build.mjs <name> */
import "../plugins/ultra-explainer/scripts/build.mjs";
