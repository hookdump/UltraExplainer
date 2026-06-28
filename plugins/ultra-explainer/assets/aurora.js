/* ==========================================================================
   AURORA — UltraExplainer behavior (canonical, self-contained).
   Inline the relevant parts into generated pages. Everything auto-inits and
   is a no-op when its target DOM is absent, so it is safe to include wholesale.

   IMPORTANT — put this FOUC-free resolver in <head> BEFORE the stylesheet so
   the theme/glow choice is applied before first paint:

     <script>(function(){var d=document.documentElement,s=localStorage;
       var t=s.getItem('ux-theme');
       d.dataset.theme=(t==='light'||t==='dark')?t:(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');
       d.dataset.fx=s.getItem('ux-fx')==='flat'?'flat':'glow';})();<\/script>

   The rest of this file can load at the end of <body>.
   ========================================================================== */
(function () {
  "use strict";
  var doc = document, root = doc.documentElement;
  var reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- Theme + glow switcher ---------------- */
  function buildSwitcher() {
    if (doc.querySelector(".ux-fxbar")) return;            // template may ship its own
    if (root.hasAttribute("data-no-switcher")) return;
    var bar = doc.createElement("div");
    bar.className = "ux-fxbar";
    var themeBtn = doc.createElement("button");
    themeBtn.className = "ux-fxbtn";
    themeBtn.type = "button";
    var glowBtn = doc.createElement("button");
    glowBtn.className = "ux-fxbtn";
    glowBtn.type = "button";

    function syncTheme() {
      var t = root.dataset.theme === "light" ? "light" : "dark";
      themeBtn.innerHTML = (t === "dark" ? "◑ night" : "◐ day");
      themeBtn.setAttribute("aria-label", "Theme: " + t);
    }
    function syncGlow() {
      var on = root.dataset.fx !== "flat";
      glowBtn.classList.toggle("is-on", on);
      glowBtn.innerHTML = (on ? "✦ glow" : "○ flat");
      glowBtn.setAttribute("aria-pressed", String(on));
    }
    themeBtn.addEventListener("click", function () {
      var next = root.dataset.theme === "light" ? "dark" : "light";
      root.dataset.theme = next; try { localStorage.setItem("ux-theme", next); } catch (e) {}
      syncTheme(); redrawGraphs();
    });
    glowBtn.addEventListener("click", function () {
      var flat = root.dataset.fx !== "flat";
      root.dataset.fx = flat ? "flat" : "glow";
      try { localStorage.setItem("ux-fx", root.dataset.fx); } catch (e) {}
      syncGlow();
    });
    syncTheme(); syncGlow();
    bar.appendChild(themeBtn); bar.appendChild(glowBtn);
    doc.body.appendChild(bar);
  }

  /* ---------------- Connector engine (node-edge graphs) ----------------
     Markup:
       <div class="ux-graph">
         <svg class="ux-graph__edges"></svg>
         <div class="ux-graph__layer" style="grid-template-...">…nodes with id…</div>
         <script type="application/json" class="ux-edges">
           [{"from":"n-a","to":"n-b","color":"cyan","dashed":false}]
         <\/script>
       </div>
     color: edge | azure | cyan | green | violet
  */
  var SVGNS = "http://www.w3.org/2000/svg";
  var graphs = [];
  function rectIn(el, host) {
    var r = el.getBoundingClientRect(), h = host.getBoundingClientRect();
    return { x: r.left - h.left, y: r.top - h.top, w: r.width, h: r.height,
             cx: r.left - h.left + r.width / 2, cy: r.top - h.top + r.height / 2 };
  }
  function anchors(a, b) {
    var dx = b.cx - a.cx, dy = b.cy - a.cy;
    if (Math.abs(dx) >= Math.abs(dy)) {
      return [dx >= 0 ? { x: a.x + a.w, y: a.cy } : { x: a.x, y: a.cy },
              dx >= 0 ? { x: b.x, y: b.cy } : { x: b.x + b.w, y: b.cy }, "h"];
    }
    return [dy >= 0 ? { x: a.cx, y: a.y + a.h } : { x: a.cx, y: a.y },
            dy >= 0 ? { x: b.cx, y: b.y } : { x: b.cx, y: b.y + b.h }, "v"];
  }
  function pathD(s, e, axis) {
    if (axis === "h") { var mx = (s.x + e.x) / 2; return "M" + s.x + "," + s.y + " C" + mx + "," + s.y + " " + mx + "," + e.y + " " + e.x + "," + e.y; }
    var my = (s.y + e.y) / 2; return "M" + s.x + "," + s.y + " C" + s.x + "," + my + " " + e.x + "," + my + " " + e.x + "," + e.y;
  }
  function ensureMarker(svg) {
    if (svg.querySelector("#ux-arrow")) return;
    var defs = doc.createElementNS(SVGNS, "defs");
    var m = doc.createElementNS(SVGNS, "marker");
    m.setAttribute("id", "ux-arrow"); m.setAttribute("viewBox", "0 0 10 10");
    m.setAttribute("refX", "8"); m.setAttribute("refY", "5");
    m.setAttribute("markerWidth", "7"); m.setAttribute("markerHeight", "7");
    m.setAttribute("orient", "auto-start-reverse");
    var p = doc.createElementNS(SVGNS, "path");
    p.setAttribute("d", "M0,1 L9,5 L0,9 Z");
    p.setAttribute("fill", "context-stroke");   /* follows the edge colour + theme */
    m.appendChild(p); defs.appendChild(m); svg.appendChild(defs);
  }
  function initGraph(host) {
    var svg = host.querySelector(".ux-graph__edges");
    var src = host.querySelector("script.ux-edges");
    if (!svg || !src) return;
    var edges; try { edges = JSON.parse(src.textContent); } catch (e) { return; }
    ensureMarker(svg);
    var paths = edges.map(function (ed) {
      var p = doc.createElementNS(SVGNS, "path");
      p.setAttribute("class", "ux-epath ux-epath--" + (ed.color || "edge") + (ed.color && ed.color !== "edge" ? " is-glow" : ""));
      p.setAttribute("marker-end", "url(#ux-arrow)");
      if (ed.dashed) p.setAttribute("stroke-dasharray", "5 6");
      svg.appendChild(p); return { ed: ed, el: p };
    });
    function draw() {
      var map = {};
      host.querySelectorAll(".ux-node, [data-node]").forEach(function (n) { if (n.id) map[n.id] = rectIn(n, host); });
      paths.forEach(function (o) {
        var a = map[o.ed.from], b = map[o.ed.to]; if (!a || !b) return;
        var pr = anchors(a, b); o.el.setAttribute("d", pathD(pr[0], pr[1], pr[2]));
      });
    }
    var g = { host: host, draw: draw, paths: paths, edges: edges };
    graphs.push(g);
    draw();
    if (typeof ResizeObserver !== "undefined") new ResizeObserver(draw).observe(host);
    addEventListener("resize", draw);
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(draw);
    setTimeout(draw, 250);

    // hover-to-trace
    host.querySelectorAll(".ux-node").forEach(function (node) {
      node.addEventListener("mouseenter", function () {
        var adj = {}; adj[node.id] = 1;
        edges.forEach(function (e) { if (e.from === node.id) adj[e.to] = 1; if (e.to === node.id) adj[e.from] = 1; });
        host.querySelectorAll(".ux-node").forEach(function (n) { n.classList.toggle("is-dim", !adj[n.id]); });
        node.classList.add("is-hot");
        paths.forEach(function (o) { o.el.classList.toggle("is-faded", !(o.ed.from === node.id || o.ed.to === node.id)); });
      });
      node.addEventListener("mouseleave", function () {
        host.querySelectorAll(".ux-node").forEach(function (n) { n.classList.remove("is-dim", "is-hot"); });
        paths.forEach(function (o) { o.el.classList.remove("is-faded"); });
      });
    });
  }
  function redrawGraphs() { graphs.forEach(function (g) { g.draw(); }); }

  /* ---------------- Tabs ---------------- */
  function initTabs(bar) {
    var tabs = [].slice.call(bar.querySelectorAll(".ux-tab"));
    var scope = bar.closest("[data-tabs]") || bar.parentNode;
    tabs.forEach(function (t) {
      t.addEventListener("click", function () {
        tabs.forEach(function (x) { x.setAttribute("aria-selected", x === t ? "true" : "false"); });
        scope.querySelectorAll(".ux-tabpanel").forEach(function (p) { p.hidden = p.dataset.panel !== t.dataset.tab; });
      });
    });
  }

  /* ---------------- Live table filter ---------------- */
  function initFilters() {
    doc.querySelectorAll("input[data-ux-filter]").forEach(function (input) {
      var sel = input.getAttribute("data-ux-filter");
      var table = sel ? doc.querySelector(sel) : (input.closest("section") || doc).querySelector(".ux-table");
      if (!table) return;
      var count = input.getAttribute("data-ux-count") ? doc.querySelector(input.getAttribute("data-ux-count")) : null;
      input.addEventListener("input", function () {
        var q = input.value.trim().toLowerCase(), shown = 0;
        var rows = table.querySelectorAll("tbody tr");
        rows.forEach(function (tr) {
          var hit = !q || tr.textContent.toLowerCase().indexOf(q) > -1;
          tr.classList.toggle("ux-row-hidden", !hit); if (hit) shown++;
        });
        if (count) count.textContent = shown + " / " + rows.length;
      });
    });
  }

  /* ---------------- Particle field (nebula motes) ---------------- */
  function initField() {
    var canvas = doc.querySelector(".ux-field canvas"); if (!canvas) return;
    if (root.dataset.fx === "flat") return;
    var ctx = canvas.getContext("2d"); if (!ctx) return;
    var dpr = Math.min(devicePixelRatio || 1, 2), W, H, motes = [];
    function size() {
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function seed() {
      motes = []; var n = Math.min(30, Math.round(W * H / 42000));
      for (var i = 0; i < n; i++) motes.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.18, vy: (Math.random() - 0.5) * 0.12,
        r: 0.6 + Math.random() * 1.6, c: Math.random() < 0.5 ? [120, 200, 255] : [92, 242, 173],
        a: 0.12 + Math.random() * 0.34
      });
    }
    function frame(draw) {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < motes.length; i++) {
        var m = motes[i];
        if (draw) { m.x += m.vx; m.y += m.vy;
          if (m.x < -4) m.x = W + 4; if (m.x > W + 4) m.x = -4;
          if (m.y < -4) m.y = H + 4; if (m.y > H + 4) m.y = -4; }
        ctx.beginPath(); ctx.arc(m.x, m.y, m.r, 0, 6.2832);
        ctx.fillStyle = "rgba(" + m.c[0] + "," + m.c[1] + "," + m.c[2] + "," + m.a + ")";
        ctx.shadowBlur = 6; ctx.shadowColor = ctx.fillStyle; ctx.fill();
      }
      ctx.shadowBlur = 0;
    }
    size(); seed(); frame(false);
    if (reduceMotion) return;
    (function loop() { frame(true); requestAnimationFrame(loop); })();
    addEventListener("resize", function () { size(); seed(); });
  }

  /* ---------------- Boot ---------------- */
  function boot() {
    buildSwitcher();
    doc.querySelectorAll(".ux-graph").forEach(initGraph);
    doc.querySelectorAll(".ux-tabbar").forEach(initTabs);
    initFilters();
    initField();
  }
  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", boot);
  else boot();

  /* expose for templates that build graphs dynamically */
  window.Ultra = { redrawGraphs: redrawGraphs, initGraph: initGraph };
})();
