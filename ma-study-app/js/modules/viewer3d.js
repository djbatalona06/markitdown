/* viewer3d.js — interactive 3D anatomy diagrams using pure CSS 3D transforms.
   No WebGL library, no downloads: works fully offline from a folder, light on a phone.
   Drag to rotate, pinch/scroll to zoom, tap a labeled part to learn it.
   (Stylized educational diagrams; real CC0 .glb models can be added later — see README.) */
(function () {
  "use strict";
  var MA = window.MA, U = MA.util, el = U.el;
  function topics() { return (window.MA_DATA && MA_DATA.topics) || []; }

  injectStyle();

  function render(topicId) {
    var wrap = el("div", { class: "stack" });

    // topic chips
    var chips = el("div", { class: "row", style: "flex-wrap:wrap;gap:8px" });
    topics().forEach(function (t) {
      chips.appendChild(el("button", { class: "folder-chip" + (t.id === topicId ? " active" : ""), onclick: function () { MA.app.go("anatomy/" + t.id); } }, (t.emoji || "") + " " + t.name));
    });
    wrap.appendChild(chips);

    var topic = topics().filter(function (t) { return t.id === topicId; })[0] || topics()[0];
    if (!topic) return el("div", { class: "empty" }, "No 3D topics.");

    // stage
    var stage = el("div", { class: "v3d", role: "img", "aria-label": "3D model of " + topic.name });
    var scene = el("div", { class: "v3d__scene" });
    stage.appendChild(scene);
    stage.appendChild(el("div", { class: "viewer__hint", text: "Drag to rotate · pinch/scroll to zoom · tap a label" }));
    buildModel(scene, topic);
    enableControls(stage, scene);

    var info = el("div", { class: "card", style: "margin-top:12px" }, [
      el("div", { class: "row row--between" }, [el("h3", { text: topic.emoji + " " + topic.name, style: "margin:0" }), el("span", { class: "pill pill--primary", text: "3D" })]),
      el("p", { class: "muted", text: topic.blurb }),
      el("div", { id: "v3dPart", class: "muted", text: "Tap a labeled part to see what it is." }),
      topic.deck ? el("button", { class: "btn btn--accent btn--block", onclick: function () { MA.app.go("study/" + topic.deck); } }, "📑 Study related flashcards") : null
    ]);

    wrap.appendChild(stage);
    wrap.appendChild(info);
    return wrap;
  }

  /* ---------- controls: drag-rotate + zoom ---------- */
  function enableControls(stage, scene) {
    var rx = -18, ry = 24, scale = 1, dragging = false, lx = 0, ly = 0, pinch0 = 0, s0 = 1;
    var idle = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function apply() { scene.style.transform = "translateZ(-40px) rotateX(" + rx + "deg) rotateY(" + ry + "deg) scale(" + scale + ")"; }
    apply();
    var raf;
    function spin() { if (idle && !dragging) { ry += 0.25; apply(); } raf = requestAnimationFrame(spin); }
    spin();
    MA.app.onLeave(function () { cancelAnimationFrame(raf); });

    stage.addEventListener("pointerdown", function (e) { dragging = true; idle = false; lx = e.clientX; ly = e.clientY; stage.setPointerCapture(e.pointerId); });
    stage.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      ry += (e.clientX - lx) * 0.4; rx -= (e.clientY - ly) * 0.4;
      rx = Math.max(-89, Math.min(89, rx)); lx = e.clientX; ly = e.clientY; apply();
    });
    function end() { dragging = false; }
    stage.addEventListener("pointerup", end); stage.addEventListener("pointercancel", end);
    stage.addEventListener("wheel", function (e) { e.preventDefault(); scale = Math.max(0.5, Math.min(2.4, scale - e.deltaY * 0.0015)); apply(); }, { passive: false });
    stage.addEventListener("touchstart", function (e) { if (e.touches.length === 2) { pinch0 = dist(e); s0 = scale; } }, { passive: true });
    stage.addEventListener("touchmove", function (e) { if (e.touches.length === 2 && pinch0) { scale = Math.max(0.5, Math.min(2.4, s0 * dist(e) / pinch0)); apply(); } }, { passive: true });
    function dist(e) { var a = e.touches[0], b = e.touches[1]; return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY); }
  }

  /* ---------- model builders ---------- */
  function node(cfg) {
    var n = el("div", { class: "v3d__node" + (cfg.box ? " v3d__box" : ""), title: cfg.label || "" });
    var sz = cfg.size || 60;
    n.style.width = sz + "px"; n.style.height = (cfg.h || sz) + "px";
    n.style.background = cfg.color || "radial-gradient(circle at 30% 30%, #fff6, #0891B2)";
    n.style.transform = "translate3d(" + (cfg.x || 0) + "px," + (cfg.y || 0) + "px," + (cfg.z || 0) + "px)";
    if (cfg.box) n.style.borderRadius = (cfg.r != null ? cfg.r : 10) + "px";
    if (cfg.label) {
      var lab = el("span", { class: "v3d__label", text: cfg.label });
      n.appendChild(lab);
      n.addEventListener("click", function (e) { e.stopPropagation(); var p = document.getElementById("v3dPart"); if (p) p.innerHTML = "<strong>" + U.esc(cfg.label) + "</strong>" + (cfg.desc ? " — " + U.esc(cfg.desc) : ""); });
    }
    return n;
  }

  function buildModel(scene, topic) {
    scene.innerHTML = "";
    var parts = SPECS[topic.proc] ? SPECS[topic.proc](topic) : SPECS.generic(topic);
    parts.forEach(function (p) { scene.appendChild(node(p)); });
  }

  var COL = {
    red: "radial-gradient(circle at 30% 30%, #ff9aa2, #c0392b)",
    blue: "radial-gradient(circle at 30% 30%, #aee1f9, #1f6fb2)",
    bone: "radial-gradient(circle at 30% 30%, #fffef0, #d8d2b8)",
    pink: "radial-gradient(circle at 30% 30%, #ffd1dc, #d46a8a)",
    teal: "radial-gradient(circle at 30% 30%, #b6f3ec, #0e9aa7)",
    green: "radial-gradient(circle at 30% 30%, #c8f7c5, #2e8b57)",
    purp: "radial-gradient(circle at 30% 30%, #e3c8ff, #7c3aed)"
  };

  var SPECS = {
    generic: function (t) {
      return [{ size: 120, color: COL.teal, label: t.name, desc: t.blurb }];
    },
    heart: function () {
      return [
        { box: true, size: 70, h: 90, x: -38, y: -30, z: 20, color: COL.red, label: "RA", desc: "Right atrium — receives oxygen-poor blood from the body." },
        { box: true, size: 70, h: 110, x: -38, y: 40, z: 20, color: COL.red, label: "RV", desc: "Right ventricle — pumps blood to the lungs." },
        { box: true, size: 70, h: 90, x: 38, y: -30, z: -20, color: COL.blue, label: "LA", desc: "Left atrium — receives oxygen-rich blood from the lungs." },
        { box: true, size: 70, h: 120, x: 38, y: 45, z: -20, color: COL.blue, label: "LV", desc: "Left ventricle — pumps oxygen-rich blood to the body (thickest wall)." },
        { size: 36, x: 0, y: -90, z: 0, color: COL.pink, label: "Aorta", desc: "Largest artery — carries blood from the LV to the body." }
      ];
    },
    cell: function () {
      var parts = [
        { size: 230, x: 0, y: 0, z: 0, color: "radial-gradient(circle at 35% 30%, #bdeef0aa, #0e9aa733)", label: "" },
        { size: 90, x: 0, y: 0, z: 0, color: COL.purp, label: "Nucleus", desc: "Control center — holds DNA." }
      ];
      var organelles = [
        { label: "Mitochondria", desc: "Powerhouse — makes ATP energy.", color: COL.red },
        { label: "Ribosome", desc: "Builds proteins.", color: COL.teal },
        { label: "ER", desc: "Endoplasmic reticulum — transports materials.", color: COL.green },
        { label: "Golgi", desc: "Packages and ships proteins.", color: COL.pink },
        { label: "Lysosome", desc: "Digests waste.", color: COL.blue }
      ];
      organelles.forEach(function (o, i) {
        var a = (i / organelles.length) * Math.PI * 2;
        parts.push({ size: 44, x: Math.cos(a) * 78, y: Math.sin(a) * 70, z: Math.sin(a * 1.7) * 60, color: o.color, label: o.label, desc: o.desc });
      });
      return parts;
    },
    dna: function () {
      var parts = [], bases = ["A", "T", "G", "C"];
      for (var i = 0; i < 12; i++) {
        var a = i * 0.55, y = i * 26 - 150;
        parts.push({ size: 22, x: Math.cos(a) * 60, y: y, z: Math.sin(a) * 60, color: COL.teal, label: i === 0 ? "Backbone" : "", desc: "Sugar-phosphate backbone." });
        parts.push({ size: 22, x: Math.cos(a + Math.PI) * 60, y: y, z: Math.sin(a + Math.PI) * 60, color: COL.purp, label: "" });
        parts.push({ box: true, r: 4, size: 110, h: 8, x: 0, y: y, z: 0, color: i % 2 ? COL.pink : COL.green, label: i === 6 ? "Base pair (" + bases[i % 4] + ")" : "", desc: "Complementary base pairs (A-T, G-C) form the rungs." });
      }
      return parts;
    },
    skeleton: function () {
      return [
        { box: true, r: 30, size: 60, h: 60, x: 0, y: -120, z: 0, color: COL.bone, label: "Skull", desc: "Protects the brain." },
        { box: true, r: 8, size: 26, h: 120, x: 0, y: -10, z: 0, color: COL.bone, label: "Spine", desc: "Vertebral column — 33 vertebrae." },
        { box: true, r: 40, size: 130, h: 90, x: 0, y: -30, z: -10, color: "radial-gradient(circle at 40% 30%, #fffef0cc, #d8d2b855)", label: "Rib cage", desc: "Protects heart and lungs." },
        { box: true, r: 8, size: 22, h: 140, x: -45, y: 90, z: 0, color: COL.bone, label: "Femur", desc: "Longest bone in the body." },
        { box: true, r: 8, size: 22, h: 140, x: 45, y: 90, z: 0, color: COL.bone, label: "" }
      ];
    },
    skull: function () {
      return [
        { size: 150, x: 0, y: -20, z: 0, color: COL.bone, label: "Cranium", desc: "Houses and protects the brain." },
        { box: true, r: 16, size: 90, h: 60, x: 0, y: 70, z: 30, color: "radial-gradient(circle at 40% 30%, #fffef0, #cfc9ad)", label: "Mandible", desc: "Lower jaw — the only movable skull bone." },
        { size: 26, x: -32, y: -10, z: 60, color: "#222", label: "Orbit", desc: "Eye socket." },
        { size: 26, x: 32, y: -10, z: 60, color: "#222", label: "" }
      ];
    },
    lungs: function () {
      return [
        { box: true, r: 40, size: 80, h: 150, x: -50, y: 10, z: 0, color: COL.pink, label: "Left lung", desc: "Two lobes (smaller — shares space with the heart)." },
        { box: true, r: 40, size: 85, h: 160, x: 50, y: 5, z: 0, color: COL.pink, label: "Right lung", desc: "Three lobes." },
        { box: true, r: 8, size: 18, h: 90, x: 0, y: -70, z: 0, color: COL.teal, label: "Trachea", desc: "Windpipe — carries air to the bronchi." }
      ];
    },
    brain: function () {
      return [
        { size: 170, x: 0, y: -20, z: 0, color: COL.pink, label: "Cerebrum", desc: "Thinking, senses, voluntary movement." },
        { size: 70, x: 0, y: 70, z: -30, color: COL.purp, label: "Cerebellum", desc: "Balance and coordination." },
        { box: true, r: 10, size: 28, h: 70, x: 0, y: 90, z: 0, color: COL.teal, label: "Brainstem", desc: "Controls breathing, heart rate (vital functions)." }
      ];
    },
    kidney: function () {
      return [
        { box: true, r: 50, size: 90, h: 140, x: -40, y: 0, z: 0, color: COL.red, label: "Left kidney", desc: "Filters blood, makes urine." },
        { box: true, r: 50, size: 90, h: 140, x: 40, y: 0, z: 0, color: COL.red, label: "Right kidney", desc: "Sits slightly lower than the left." },
        { box: true, r: 6, size: 12, h: 120, x: -20, y: 120, z: 0, color: COL.teal, label: "Ureter", desc: "Carries urine to the bladder." }
      ];
    }
  };

  function injectStyle() {
    if (document.getElementById("v3d-style")) return;
    var css = "" +
      ".v3d{width:100%;height:58vh;min-height:340px;border-radius:var(--r-lg);overflow:hidden;position:relative;touch-action:none;cursor:grab;" +
      "background:radial-gradient(120% 90% at 50% 10%,#103642,#06141a);perspective:900px;border:1px solid var(--border);}" +
      ".v3d:active{cursor:grabbing}" +
      ".v3d__scene{position:absolute;left:50%;top:50%;width:0;height:0;transform-style:preserve-3d;transition:transform .05s linear}" +
      ".v3d__node{position:absolute;left:0;top:0;margin-left:-30px;margin-top:-30px;border-radius:50%;transform-style:preserve-3d;" +
      "box-shadow:inset -6px -8px 16px rgba(0,0,0,.35),0 8px 22px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;cursor:pointer}" +
      ".v3d__box{border-radius:10px}" +
      ".v3d__label{position:absolute;top:-6px;left:50%;transform:translate(-50%,-100%);background:rgba(8,55,66,.9);color:#eafcff;font-size:11px;font-weight:700;" +
      "padding:2px 7px;border-radius:999px;white-space:nowrap;pointer-events:none}";
    document.head.appendChild(el("style", { id: "v3d-style", html: css }));
  }

  MA.viewer3d = { title: "Anatomy 3D", render: render };
})();
