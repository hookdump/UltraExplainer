#!/usr/bin/env node
/* Assemble self-contained Aurora templates from canonical assets + body fragments.
   Source bodies live in templates/_src/<name>.body.html with an optional
   <!--ux: {json}--> directive on line 1 (title, fonts, head, foot, fluid).
   Output: templates/<name>.html (fully self-contained; safe to open in a browser). */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..", "plugins", "ultra-explainer");
const css = readFileSync(join(root, "assets", "aurora.css"), "utf8");
const js = readFileSync(join(root, "assets", "aurora.js"), "utf8");
const srcDir = join(root, "templates", "_src");
const outDir = join(root, "templates");

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter+Tight:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">`;

const HEAD_RESOLVE = `<script>(function(){var d=document.documentElement,s=window.localStorage;var t=null;try{t=s.getItem('ux-theme')}catch(e){}d.dataset.theme=(t==='light'||t==='dark')?t:(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');var f=null;try{f=s.getItem('ux-fx')}catch(e){}d.dataset.fx=f==='flat'?'flat':'glow';})();</script>`;

function skeleton({ title, body, head = "", foot = "", fonts = true }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
${fonts ? FONTS : ""}
${HEAD_RESOLVE}
<style>
${css}
</style>
${head}
</head>
<body>
<div class="ux-field" aria-hidden="true"><canvas></canvas></div>
${body}
${foot}
<script>
${js}
</script>
</body>
</html>
`;
}

const files = existsSync(srcDir) ? readdirSync(srcDir).filter((f) => f.endsWith(".body.html")) : [];
if (!files.length) { console.error("no body fragments in " + srcDir); process.exit(1); }

for (const file of files) {
  const name = file.replace(/\.body\.html$/, "");
  let raw = readFileSync(join(srcDir, file), "utf8");
  let opts = {};
  const m = raw.match(/^<!--ux:\s*([\s\S]*?)-->\s*\n?/);
  if (m) { try { opts = JSON.parse(m[1]); } catch (e) { console.error("bad directive in " + file, e.message); }
    raw = raw.slice(m[0].length); }
  const headSide = join(srcDir, name + ".head.html");
  const footSide = join(srcDir, name + ".foot.html");
  const head = (opts.head || "") + (existsSync(headSide) ? readFileSync(headSide, "utf8") : "");
  const foot = (existsSync(footSide) ? readFileSync(footSide, "utf8") : "") + (opts.foot || "");
  const html = skeleton({
    title: opts.title || ("UltraExplainer — " + name),
    body: raw,
    head,
    foot,
    fonts: opts.fonts !== false,
  });
  writeFileSync(join(outDir, name + ".html"), html);
  console.log("built templates/" + name + ".html (" + html.length + " bytes)");
}
