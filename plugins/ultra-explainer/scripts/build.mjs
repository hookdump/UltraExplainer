#!/usr/bin/env node
/* UltraExplainer v2 build — assemble self-contained pages from body fragments.
   Inlines core.css + themes.css + the JS runtime, links the chosen preset's
   fonts, and sets data-theme-preset / data-theme / data-fx before paint.
   Ships INSIDE the plugin and resolves all paths relative to its own location,
   so it works whether the plugin was installed or the repo was cloned. Run from
   the plugin root:  node scripts/build.mjs <name-filter>
   Directive (line 1 of <name>.body.html):  <!--ux: { ... } -->
     preset:  one design language (blueprint|editorial|terminal|instrument|notebook|swiss|luminous)
     presets: array — emit one file per preset (<name>.<preset>.html) for chameleon demos
     theme:   "light" | "dark"  (initial tuning; defaults to the preset's natural one)
     fx:      "glow" | "flat"   (luminous only)
     title, head, foot, fonts(bool) — as before; .head.html/.foot.html sidecars also merged */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");          // scripts/ lives inside the plugin → .. is the plugin root
const core = readFileSync(join(root, "assets", "core.css"), "utf8");
const themes = readFileSync(join(root, "assets", "themes.css"), "utf8");
const js = readFileSync(join(root, "assets", "ux.js"), "utf8");
const srcDir = join(root, "templates", "_src");
const outDir = join(root, "templates");

const FONTS = {
  blueprint: "family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600",
  editorial: "family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Newsreader:opsz,wght@6..72,400;6..72,500&family=JetBrains+Mono:wght@400;500",
  terminal: "family=Inter+Tight:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600;700",
  instrument: "family=Inter+Tight:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600",
  notebook: "family=Literata:opsz,wght@7..72,400;7..72,600&family=Karla:wght@400;600;700&family=Source+Code+Pro:wght@400;500",
  swiss: "family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&family=Fira+Code:wght@400;500",
  luminous: "family=Space+Grotesk:wght@400;500;600;700&family=Inter+Tight:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600;700",
};
const NATURAL = { blueprint: "light", editorial: "light", terminal: "dark", instrument: "dark", notebook: "light", swiss: "light", luminous: "dark" };

function fontsLink(preset) {
  const q = FONTS[preset] || FONTS.luminous;
  return `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?${q}&display=swap" rel="stylesheet">`;
}
function resolver(preset, theme, fx) {
  return `<script>(function(){var d=document.documentElement,s=window.localStorage;d.dataset.themePreset=${JSON.stringify(preset)};var t=null;try{t=s.getItem('ux-theme-'+${JSON.stringify(preset)})}catch(e){}d.dataset.theme=(t==='light'||t==='dark')?t:${JSON.stringify(theme)};var f=null;try{f=s.getItem('ux-fx')}catch(e){}d.dataset.fx=f==='flat'?'flat':${JSON.stringify(fx)};})();<\/script>`;
}
function skeleton({ title, body, head, foot, fonts, preset, theme, fx }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
${fonts ? fontsLink(preset) : ""}
${resolver(preset, theme, fx)}
<style>
${core}
${themes}
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

const only = process.argv[2]; // optional: build only fragments whose name includes this
const files = readdirSync(srcDir).filter((f) => f.endsWith(".body.html") && (!only || f.includes(only)));
for (const file of files) {
  const name = file.replace(/\.body\.html$/, "");
  let raw = readFileSync(join(srcDir, file), "utf8");
  let opts = {};
  const m = raw.match(/^<!--ux:\s*([\s\S]*?)-->\s*\n?/);
  if (m) { try { opts = JSON.parse(m[1]); } catch (e) { console.error("bad directive in " + file, e.message); } raw = raw.slice(m[0].length); }
  const headSide = join(srcDir, name + ".head.html");
  const footSide = join(srcDir, name + ".foot.html");
  const head = (opts.head || "") + (existsSync(headSide) ? readFileSync(headSide, "utf8") : "");
  const foot = (existsSync(footSide) ? readFileSync(footSide, "utf8") : "") + (opts.foot || "");
  const presets = opts.presets || [opts.preset || "luminous"];
  for (const preset of presets) {
    const theme = opts.theme || NATURAL[preset] || "dark";
    const fx = opts.fx || (preset === "luminous" ? "glow" : "flat");
    const html = skeleton({ title: opts.title || ("UltraExplainer — " + name), body: raw, head, foot, fonts: opts.fonts !== false, preset, theme, fx });
    const outName = presets.length > 1 ? `${name}.${preset}.html` : `${name}.html`;
    writeFileSync(join(outDir, outName), html);
    console.log("built templates/" + outName + " (" + preset + ", " + (html.length / 1024 | 0) + "kb)");
  }
}
