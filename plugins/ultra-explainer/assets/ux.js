/* ==========================================================================
   UltraExplainer — runtime behavior (canonical, self-contained).
   Inlined into generated pages by build.mjs. Everything auto-inits and is a
   no-op when its target DOM is absent, so it is safe to include wholesale.

   IMPORTANT — build.mjs injects a FOUC-free resolver in <head> BEFORE the
   stylesheet so the theme/glow choice is applied before first paint. It seeds
   from the directive's chosen theme (each design language has a natural one),
   then honors the reader's persisted toggle, per preset:

     <script>(function(){var d=document.documentElement,s=localStorage;
       d.dataset.themePreset=PRESET;
       var t=s.getItem('ux-theme-'+PRESET);
       d.dataset.theme=(t==='light'||t==='dark')?t:DIRECTIVE_THEME;
       d.dataset.fx=s.getItem('ux-fx')==='flat'?'flat':DIRECTIVE_FX;})();<\/script>

   The rest of this file loads at the end of <body>.
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
    var preset = root.dataset.themePreset || "luminous";
    themeBtn.addEventListener("click", function () {
      var next = root.dataset.theme === "light" ? "dark" : "light";
      root.dataset.theme = next; try { localStorage.setItem("ux-theme-" + preset, next); } catch (e) {}
      syncTheme(); redrawGraphs();
    });
    glowBtn.addEventListener("click", function () {
      var flat = root.dataset.fx !== "flat";
      root.dataset.fx = flat ? "flat" : "glow";
      try { localStorage.setItem("ux-fx", root.dataset.fx); } catch (e) {}
      syncGlow();
    });
    syncTheme();
    bar.appendChild(themeBtn);
    // glow/flat toggle is meaningful only in the Luminous design language
    if (preset === "luminous") { syncGlow(); bar.appendChild(glowBtn); }
    doc.body.appendChild(bar);
  }

  /* ---------------- Connector engine (node-edge graphs) ----------------
     Markup:
       <div class="ux-graph">
         <svg class="ux-graph__edges"></svg>
         <div class="ux-graph__layer" style="grid-template-...">…nodes with id…</div>
         <script type="application/json" class="ux-edges">
           [{"from":"n-a","to":"n-b","color":"accent","dashed":false,"cls":"e-x"}]
         <\/script>
       </div>
     color: edge | accent | accent2 | good | meta  (any non-"edge" colour also gets .is-glow)
     optional per-edge: "dashed":true, "cls":"<class>" and "id":"<id>" for scenario/CSS targeting
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
      p.setAttribute("class", "ux-epath ux-epath--" + (ed.color || "edge") + (ed.color && ed.color !== "edge" ? " is-glow" : "") + (ed.cls ? " " + ed.cls : ""));
      p.setAttribute("marker-end", "url(#ux-arrow)");
      if (ed.id) p.id = ed.id;
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

  /* ---------------- Explorable model: state -> derive -> render ----------------
     <div data-playground data-derive="myDerive">
       <script type="application/json" class="ux-state">{"n":1000}<\/script>
       <input type="range" data-param="n" min="100" max="9000" step="100"><output data-out="n"></output>
       <b data-show="cost" data-fmt="money"></b>  <span data-fill="load"></span>
     window.myDerive = function(s){ return { cost: s.n*0.004, load: s.n/9000 }; }  */
  var FMT = {
    int: function (v) { return Math.round(v).toLocaleString(); },
    pct: function (v) { return (v * 100).toFixed(0) + "%"; },
    pct1: function (v) { return (v * 100).toFixed(1) + "%"; },
    ms: function (v) { return Math.round(v) + "ms"; },
    x: function (v) { return v.toFixed(1) + "×"; },
    money: function (v) { return "$" + (Math.round(v * 100) / 100).toLocaleString(); },
    raw: function (v) { return String(v); },
  };
  function initPlayground(host) {
    var stateEl = host.querySelector(".ux-state");
    var state = {}; if (stateEl) { try { state = JSON.parse(stateEl.textContent); } catch (e) {} }
    var derive = host.dataset.derive && window[host.dataset.derive] ? window[host.dataset.derive] : function (s) { return s; };
    function render() {
      var out = derive(Object.assign({}, state)) || {};
      var all = Object.assign({}, state, out);
      host.querySelectorAll("[data-show]").forEach(function (el) {
        var k = el.dataset.show; if (!(k in all)) return;
        el.textContent = (FMT[el.dataset.fmt] || FMT.raw)(all[k]);
      });
      host.querySelectorAll("[data-fill]").forEach(function (el) {
        var v = all[el.dataset.fill]; if (v == null) return;
        el.style.setProperty("--v", Math.max(0, Math.min(1, +v)));
        if (el.hasAttribute("data-fill-h")) el.style.height = (Math.max(0, Math.min(1, +v)) * 100) + "%";
        if (el.hasAttribute("data-fill-w")) el.style.width = (Math.max(0, Math.min(1, +v)) * 100) + "%";
      });
    }
    host.querySelectorAll("[data-param]").forEach(function (inp) {
      var k = inp.dataset.param; var o = host.querySelector('[data-out="' + k + '"]');
      function sync() { state[k] = inp.type === "range" || inp.type === "number" ? +inp.value : inp.value; if (o) o.textContent = (FMT[o.dataset.fmt] || FMT.raw)(state[k]); render(); }
      inp.addEventListener("input", sync); sync();
    });
    host.querySelectorAll("[data-set]").forEach(function (btn) {
      btn.addEventListener("click", function () { try { Object.assign(state, JSON.parse(btn.dataset.set)); } catch (e) {}
        host.querySelectorAll("[data-param]").forEach(function (i) { if (i.dataset.param in state) { i.value = state[i.dataset.param]; var o = host.querySelector('[data-out="' + i.dataset.param + '"]'); if (o) o.textContent = (FMT[o.dataset.fmt] || FMT.raw)(state[i.dataset.param]); } });
        render(); });
    });
    render();
  }

  /* ---------------- Scenario segmented control: sets data-scenario on a target ---------------- */
  function initScenarios(seg) {
    var target = seg.dataset.target ? doc.querySelector(seg.dataset.target) : seg.closest("[data-scenario-root]") || doc.body;
    var btns = [].slice.call(seg.querySelectorAll("button"));
    btns.forEach(function (b) { b.addEventListener("click", function () {
      btns.forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
      target.dataset.scenario = b.dataset.scenario;
      if (window.Ultra) window.Ultra.redrawGraphs();
    }); });
  }

  /* ---------------- Step-through player ---------------- */
  function initStepper(host) {
    var stepsEl = host.querySelector(".ux-steps"); var steps = [];
    if (stepsEl) { try { steps = JSON.parse(stepsEl.textContent); } catch (e) {} }
    if (!steps.length) return;
    var cap = host.querySelector("[data-step-cap]");
    var code = host.dataset.code ? doc.querySelector(host.dataset.code) : host.querySelector(".ux-codeblock");
    var counter = host.querySelector("[data-step-n]");
    var i = 0;
    function show() {
      var s = steps[i] || {};
      if (cap) cap.innerHTML = s.cap || "";
      if (counter) counter.textContent = (i + 1) + " / " + steps.length;
      if (code) { var lines = code.querySelectorAll(".l"); lines.forEach(function (l, n) { l.classList.toggle("is-active", (s.lines || []).indexOf(n + 1) > -1); }); }
      host.querySelectorAll("[data-step-show]").forEach(function (el) { el.hidden = +el.dataset.stepShow !== i; });
      if (s.scenario && code) {}
    }
    host.querySelectorAll("[data-step]").forEach(function (b) { b.addEventListener("click", function () {
      var a = b.dataset.step; if (a === "next") i = Math.min(i + 1, steps.length - 1); else if (a === "prev") i = Math.max(i - 1, 0); else if (a === "reset") i = 0; show();
    }); });
    doc.addEventListener("keydown", function (e) { if (!host.contains(doc.activeElement) && doc.activeElement !== doc.body) return;
      if (e.key === "ArrowRight") { i = Math.min(i + 1, steps.length - 1); show(); } else if (e.key === "ArrowLeft") { i = Math.max(i - 1, 0); show(); } });
    show();
  }

  /* ---------------- Sortable table ---------------- */
  function initSortable(table) {
    var ths = [].slice.call(table.querySelectorAll("th[data-sort]"));
    ths.forEach(function (th, ci) {
      th.addEventListener("click", function () {
        var idx = [].slice.call(th.parentNode.children).indexOf(th);
        var dir = th.getAttribute("aria-sort") === "ascending" ? "descending" : "ascending";
        ths.forEach(function (x) { x.removeAttribute("aria-sort"); }); th.setAttribute("aria-sort", dir);
        var numeric = th.dataset.sort === "num";
        var body = table.tBodies[0]; var rows = [].slice.call(body.rows);
        rows.sort(function (a, b) {
          var av = a.cells[idx] ? a.cells[idx].textContent.trim() : "", bv = b.cells[idx] ? b.cells[idx].textContent.trim() : "";
          if (numeric) { av = parseFloat(av.replace(/[^0-9.\-]/g, "")) || 0; bv = parseFloat(bv.replace(/[^0-9.\-]/g, "")) || 0; return dir === "ascending" ? av - bv : bv - av; }
          return dir === "ascending" ? av.localeCompare(bv) : bv.localeCompare(av);
        });
        rows.forEach(function (r) { body.appendChild(r); });
      });
    });
  }

  /* ---------------- Scroll-spy section nav ---------------- */
  function initNav() {
    var nav = doc.querySelector(".ux-nav"); if (!nav) return;
    var links = [].slice.call(nav.querySelectorAll("a[href^='#']"));
    var map = {}; links.forEach(function (a) { var t = doc.getElementById(a.getAttribute("href").slice(1)); if (t) map[a.getAttribute("href").slice(1)] = a; });
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { links.forEach(function (l) { l.classList.remove("is-active"); }); if (map[e.target.id]) { map[e.target.id].classList.add("is-active"); var act = map[e.target.id]; if (nav.scrollWidth > nav.clientWidth) act.scrollIntoView({ inline: "center", block: "nearest" }); } } });
    }, { rootMargin: "-15% 0px -75% 0px" });
    Object.keys(map).forEach(function (id) { var t = doc.getElementById(id); if (t) obs.observe(t); });
    links.forEach(function (a) { a.addEventListener("click", function (e) { e.preventDefault(); var t = doc.getElementById(a.getAttribute("href").slice(1)); if (t) t.scrollIntoView({ behavior: "smooth" }); }); });
  }

  /* ---------------- Boot ---------------- */
  function boot() {
    buildSwitcher();
    doc.querySelectorAll(".ux-graph").forEach(initGraph);
    doc.querySelectorAll(".ux-tabbar").forEach(initTabs);
    doc.querySelectorAll("[data-playground]").forEach(initPlayground);
    doc.querySelectorAll(".ux-seg[data-scenario-ctl]").forEach(initScenarios);
    doc.querySelectorAll("[data-stepper]").forEach(initStepper);
    doc.querySelectorAll("table.ux-table").forEach(function (t) { if (t.querySelector("th[data-sort]")) initSortable(t); });
    initFilters();
    initNav();
    initField();
  }
  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", boot);
  else boot();

  /* expose for templates that build graphs dynamically */
  window.Ultra = { redrawGraphs: redrawGraphs, initGraph: initGraph };
})();
