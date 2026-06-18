/* viewer3d.js — interactive 3D anatomy diagrams using pure CSS 3D transforms.
   No WebGL library, no downloads: works fully offline from a folder, light on a phone.
   Drag to rotate, pinch/scroll to zoom, tap a labeled part to learn it.
   Tweakables: toggle anatomical layers, explode the model, hide labels, pause auto-spin.
   Each topic shows a fun fact, a need-to-know tip, and an interactive practice question.
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

    // model spec + view state shared by the controls and the renderer
    var spec = SPECS[topic.proc] ? SPECS[topic.proc](topic) : SPECS.generic(topic);
    var layers = layersOf(spec);
    var state = {
      explode: false,
      labels: true,
      spin: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      hidden: {}
    };

    // stage
    var stage = el("div", { class: "v3d", role: "img", "aria-label": "3D model of " + topic.name });
    var scene = el("div", { class: "v3d__scene" });
    stage.appendChild(scene);
    stage.appendChild(el("div", { class: "viewer__hint", text: "Drag to rotate · pinch/scroll to zoom · tap a label" }));

    function rebuild() {
      scene.innerHTML = "";
      spec.forEach(function (p) {
        if (p.layer && state.hidden[p.layer]) return;
        scene.appendChild(node(p, state));
      });
      stage.classList.toggle("v3d--nolabels", !state.labels);
    }

    enableControls(stage, scene, state);
    rebuild();

    // tweakables: per-layer visibility + view toggles
    var ctrls = el("div", { class: "v3d-controls" });
    layers.forEach(function (L) {
      var chip = el("button", { class: "folder-chip active", "aria-pressed": "true" }, "● " + L);
      chip.addEventListener("click", function () {
        var off = !state.hidden[L];
        state.hidden[L] = off;
        chip.classList.toggle("active", !off);
        chip.setAttribute("aria-pressed", String(!off));
        rebuild();
      });
      ctrls.appendChild(chip);
    });
    ctrls.appendChild(toggleChip("🏷️ Labels", state.labels, function (on) { state.labels = on; rebuild(); }));
    ctrls.appendChild(toggleChip("💥 Explode", state.explode, function (on) { state.explode = on; rebuild(); }));
    ctrls.appendChild(toggleChip("🔄 Auto-spin", state.spin, function (on) { state.spin = on; }));

    // info + educational content
    var info = el("div", { class: "stack", style: "margin-top:12px" }, [
      el("div", { class: "card stack" }, [
        el("div", { class: "row row--between" }, [el("h3", { text: topic.emoji + " " + topic.name, style: "margin:0" }), el("span", { class: "pill pill--primary", text: "3D" })]),
        el("p", { class: "muted", text: topic.blurb, style: "margin:0" }),
        el("div", { id: "v3dPart", class: "muted", text: "Tap a labeled part to see what it is." })
      ]),
      topic.funFact ? el("div", { class: "card" }, [el("div", { class: "fact", style: "font-size:var(--fs-lg)", text: "💡 " + topic.funFact })]) : null,
      topic.tip ? el("div", { class: "card" }, [el("strong", { text: "📌 Need-to-know: " }), topic.tip]) : null,
      questionCard(topic),
      topic.deck ? el("button", { class: "btn btn--accent btn--block", onclick: function () { MA.app.go("study/" + topic.deck); } }, "📑 Study related flashcards") : null
    ]);

    wrap.appendChild(stage);
    wrap.appendChild(ctrls);
    wrap.appendChild(info);
    return wrap;
  }

  /* ---------- tweakable controls ---------- */
  function toggleChip(label, initial, onChange) {
    var chip = el("button", { class: "folder-chip" + (initial ? " active" : ""), "aria-pressed": String(!!initial) }, label);
    chip.addEventListener("click", function () {
      var on = !chip.classList.contains("active");
      chip.classList.toggle("active", on);
      chip.setAttribute("aria-pressed", String(on));
      onChange(on);
    });
    return chip;
  }

  function layersOf(spec) {
    var seen = {}, out = [];
    spec.forEach(function (p) { if (p.layer && !seen[p.layer]) { seen[p.layer] = 1; out.push(p.layer); } });
    return out;
  }

  /* ---------- interactive practice question ---------- */
  function questionCard(topic) {
    var qs = (topic.questions || []).filter(function (q) { return q && q.q && Array.isArray(q.choices); });
    if (!qs.length) return null;
    var idx = 0;
    var box = el("div", { class: "card stack" });
    function show() {
      box.innerHTML = "";
      var q = qs[idx];
      box.appendChild(el("div", { class: "row row--between" }, [
        el("div", { class: "section-title", style: "margin:0", text: "📝 Practice question" }),
        qs.length > 1 ? el("button", { class: "btn btn--ghost btn--sm", onclick: function () { idx = (idx + 1) % qs.length; show(); } }, "↻ Another") : null
      ]));
      box.appendChild(el("p", { text: q.q, style: "font-weight:600;margin:6px 0" }));
      var answered = false;
      q.choices.forEach(function (c, i) {
        var opt = el("button", { class: "opt", text: c });
        opt.addEventListener("click", function () {
          if (answered) return; answered = true;
          var opts = box.querySelectorAll(".opt");
          Array.prototype.forEach.call(opts, function (o) { o.disabled = true; });
          opts[q.answer].classList.add("correct");
          if (i !== q.answer) opt.classList.add("wrong");
          box.appendChild(el("div", { class: "muted", style: "margin-top:10px", html: (i === q.answer ? "✅ Correct! " : "❌ Not quite. ") + U.esc(q.explain || "") }));
        });
        box.appendChild(opt);
      });
    }
    show();
    return box;
  }

  /* ---------- controls: drag-rotate + zoom + auto-spin ---------- */
  function enableControls(stage, scene, state) {
    var rx = -18, ry = 24, scale = 1, dragging = false, lx = 0, ly = 0, pinch0 = 0, s0 = 1;
    function apply() { scene.style.transform = "translateZ(-40px) rotateX(" + rx + "deg) rotateY(" + ry + "deg) scale(" + scale + ")"; }
    apply();
    var raf;
    function spin() { if (state.spin && !dragging) { ry += 0.25; apply(); } raf = requestAnimationFrame(spin); }
    spin();
    MA.app.onLeave(function () { cancelAnimationFrame(raf); });

    stage.addEventListener("pointerdown", function (e) { dragging = true; lx = e.clientX; ly = e.clientY; try { stage.setPointerCapture(e.pointerId); } catch (_) {} });
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
  function node(cfg, state) {
    var k = state.explode ? 1.85 : 1;
    var n = el("div", { class: "v3d__node" + (cfg.box ? " v3d__box" : ""), title: cfg.label || "" });
    var w = cfg.size || 60, h = cfg.h || w;
    n.style.width = w + "px"; n.style.height = h + "px";
    n.style.marginLeft = (-w / 2) + "px"; n.style.marginTop = (-h / 2) + "px";
    n.style.background = cfg.color || COL.teal;
    n.style.transform = "translate3d(" + ((cfg.x || 0) * k) + "px," + ((cfg.y || 0) * k) + "px," + ((cfg.z || 0) * k) + "px)";
    if (cfg.box) n.style.borderRadius = (cfg.r != null ? cfg.r : 10) + "px";
    if (cfg.label) {
      n.appendChild(el("span", { class: "v3d__label", text: cfg.label }));
      n.addEventListener("click", function (e) { e.stopPropagation(); var p = document.getElementById("v3dPart"); if (p) p.innerHTML = "<strong>" + U.esc(cfg.label) + "</strong>" + (cfg.desc ? " — " + U.esc(cfg.desc) : ""); });
    }
    return n;
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
    // Right heart is blue (oxygen-poor), left heart is red (oxygen-rich) by convention.
    heart: function () {
      return [
        { layer: "Chambers", box: true, size: 70, h: 90, x: -38, y: -30, z: 20, color: COL.blue, label: "RA", desc: "Right atrium — receives oxygen-poor blood from the body." },
        { layer: "Chambers", box: true, size: 70, h: 110, x: -38, y: 40, z: 20, color: COL.blue, label: "RV", desc: "Right ventricle — pumps blood to the lungs." },
        { layer: "Chambers", box: true, size: 70, h: 90, x: 38, y: -30, z: -20, color: COL.red, label: "LA", desc: "Left atrium — receives oxygen-rich blood from the lungs." },
        { layer: "Chambers", box: true, size: 70, h: 120, x: 38, y: 45, z: -20, color: COL.red, label: "LV", desc: "Left ventricle — pumps oxygen-rich blood to the body (thickest wall)." },
        { layer: "Vessels", size: 34, x: 0, y: -98, z: 0, color: COL.red, label: "Aorta", desc: "Largest artery — carries oxygen-rich blood from the LV to the body." },
        { layer: "Vessels", size: 30, x: -34, y: -92, z: 6, color: COL.blue, label: "Pulmonary artery", desc: "Carries oxygen-poor blood from the RV to the lungs." },
        { layer: "Vessels", box: true, r: 6, size: 16, h: 70, x: -64, y: -36, z: 18, color: COL.blue, label: "Vena cava", desc: "Returns oxygen-poor blood from the body to the right atrium." },
        { layer: "Valves", size: 18, x: -38, y: 5, z: 32, color: COL.bone, label: "Tricuspid valve", desc: "Between the right atrium and right ventricle." },
        { layer: "Valves", size: 18, x: 38, y: 8, z: -32, color: COL.bone, label: "Mitral valve", desc: "Between the left atrium and left ventricle." }
      ];
    },
    cell: function () {
      var parts = [
        { layer: "Membrane", size: 240, x: 0, y: 0, z: 0, color: "radial-gradient(circle at 35% 30%, #bdeef0aa, #0e9aa733)", label: "Cell membrane", desc: "Outer boundary — controls what enters and leaves the cell." },
        { layer: "Nucleus", size: 90, x: 0, y: 0, z: 0, color: COL.purp, label: "Nucleus", desc: "Control center — holds the cell's DNA." }
      ];
      var organelles = [
        { label: "Mitochondria", desc: "Powerhouse — makes ATP energy.", color: COL.red },
        { label: "Ribosome", desc: "Builds proteins.", color: COL.teal },
        { label: "Rough ER", desc: "Endoplasmic reticulum studded with ribosomes — makes proteins.", color: COL.green },
        { label: "Golgi apparatus", desc: "Packages and ships proteins.", color: COL.pink },
        { label: "Lysosome", desc: "Digests waste and worn-out parts.", color: COL.blue }
      ];
      organelles.forEach(function (o, i) {
        var a = (i / organelles.length) * Math.PI * 2;
        parts.push({ layer: "Organelles", size: 44, x: Math.cos(a) * 82, y: Math.sin(a) * 74, z: Math.sin(a * 1.7) * 60, color: o.color, label: o.label, desc: o.desc });
      });
      return parts;
    },
    dna: function () {
      var parts = [];
      for (var i = 0; i < 12; i++) {
        var a = i * 0.55, y = i * 26 - 150;
        parts.push({ layer: "Backbone", size: 22, x: Math.cos(a) * 60, y: y, z: Math.sin(a) * 60, color: COL.teal, label: i === 0 ? "Sugar-phosphate backbone" : "", desc: "The two twisting strands that hold the bases." });
        parts.push({ layer: "Backbone", size: 22, x: Math.cos(a + Math.PI) * 60, y: y, z: Math.sin(a + Math.PI) * 60, color: COL.purp, label: "" });
        parts.push({ layer: "Bases", box: true, r: 4, size: 110, h: 8, x: 0, y: y, z: 0, color: i % 2 ? COL.pink : COL.green, label: i === 6 ? "Base pair (A–T / G–C)" : "", desc: "Complementary base pairs — A pairs with T, G pairs with C." });
      }
      return parts;
    },
    skeleton: function () {
      return [
        { layer: "Axial", box: true, r: 30, size: 60, h: 60, x: 0, y: -130, z: 0, color: COL.bone, label: "Skull", desc: "Protects the brain." },
        { layer: "Axial", box: true, r: 8, size: 26, h: 120, x: 0, y: -20, z: 0, color: COL.bone, label: "Spine", desc: "Vertebral column — 33 vertebrae." },
        { layer: "Axial", box: true, r: 40, size: 130, h: 90, x: 0, y: -40, z: -10, color: "radial-gradient(circle at 40% 30%, #fffef0cc, #d8d2b855)", label: "Rib cage", desc: "Protects the heart and lungs." },
        { layer: "Appendicular", box: true, r: 14, size: 120, h: 28, x: 0, y: -96, z: 0, color: COL.bone, label: "Shoulder girdle", desc: "Clavicle and scapula — anchor the arms." },
        { layer: "Appendicular", box: true, r: 8, size: 18, h: 110, x: -70, y: -30, z: 0, color: COL.bone, label: "Humerus", desc: "Upper arm bone." },
        { layer: "Appendicular", box: true, r: 8, size: 18, h: 110, x: 70, y: -30, z: 0, color: COL.bone, label: "" },
        { layer: "Appendicular", box: true, r: 18, size: 90, h: 46, x: 0, y: 35, z: 0, color: COL.bone, label: "Pelvis", desc: "Hip girdle — supports the trunk and anchors the legs." },
        { layer: "Appendicular", box: true, r: 8, size: 22, h: 150, x: -32, y: 120, z: 0, color: COL.bone, label: "Femur", desc: "Longest, strongest bone in the body." },
        { layer: "Appendicular", box: true, r: 8, size: 22, h: 150, x: 32, y: 120, z: 0, color: COL.bone, label: "" }
      ];
    },
    skull: function () {
      return [
        { layer: "Cranial", size: 150, x: 0, y: -20, z: 0, color: COL.bone, label: "Cranium", desc: "The braincase — frontal, parietal, temporal, and occipital bones." },
        { layer: "Cranial", box: true, r: 30, size: 80, h: 44, x: 0, y: -72, z: 35, color: "radial-gradient(circle at 40% 30%, #fffef0, #ded7bd)", label: "Frontal bone", desc: "Forms the forehead and the top of the eye sockets." },
        { layer: "Facial", box: true, r: 16, size: 90, h: 60, x: 0, y: 78, z: 30, color: "radial-gradient(circle at 40% 30%, #fffef0, #cfc9ad)", label: "Mandible", desc: "Lower jaw — the only movable bone in the skull." },
        { layer: "Facial", size: 34, x: 0, y: 26, z: 62, color: "radial-gradient(circle at 40% 30%, #fffef0, #d8d2b8)", label: "Maxilla", desc: "Upper jaw — holds the upper teeth." },
        { layer: "Facial", size: 26, x: -32, y: -10, z: 60, color: "#222", label: "Orbit", desc: "Eye socket." },
        { layer: "Facial", size: 26, x: 32, y: -10, z: 60, color: "#222", label: "" }
      ];
    },
    lungs: function () {
      return [
        { layer: "Airways", box: true, r: 8, size: 18, h: 90, x: 0, y: -80, z: 0, color: COL.teal, label: "Trachea", desc: "Windpipe — carries air toward the lungs." },
        { layer: "Airways", box: true, r: 6, size: 14, h: 48, x: -26, y: -30, z: 0, color: COL.teal, label: "Bronchi", desc: "The trachea branches into the left and right bronchi." },
        { layer: "Airways", box: true, r: 6, size: 14, h: 48, x: 26, y: -30, z: 0, color: COL.teal, label: "" },
        { layer: "Lungs", box: true, r: 40, size: 80, h: 150, x: -50, y: 15, z: 0, color: COL.pink, label: "Left lung", desc: "Two lobes — smaller, it shares space with the heart." },
        { layer: "Lungs", box: true, r: 40, size: 85, h: 160, x: 50, y: 10, z: 0, color: COL.pink, label: "Right lung", desc: "Three lobes." },
        { layer: "Lungs", size: 22, x: -50, y: 36, z: 34, color: COL.red, label: "Alveoli", desc: "Tiny air sacs where oxygen and CO₂ are exchanged with the blood." },
        { layer: "Lungs", box: true, r: 30, size: 175, h: 18, x: 0, y: 112, z: 0, color: COL.green, label: "Diaphragm", desc: "Main breathing muscle — contracts and flattens to pull air in." }
      ];
    },
    brain: function () {
      return [
        { layer: "Cerebrum", size: 170, x: 0, y: -20, z: 0, color: COL.pink, label: "Cerebrum", desc: "Thinking, the senses, and voluntary movement." },
        { layer: "Cerebrum", size: 40, x: -55, y: -55, z: 40, color: "radial-gradient(circle at 30% 30%, #ffe1ea, #c77b97)", label: "Frontal lobe", desc: "Planning, decision-making, and voluntary movement." },
        { layer: "Cerebellum", size: 70, x: 0, y: 70, z: -30, color: COL.purp, label: "Cerebellum", desc: "Balance and coordination." },
        { layer: "Brainstem", box: true, r: 10, size: 28, h: 70, x: 0, y: 95, z: 0, color: COL.teal, label: "Brainstem", desc: "Controls breathing, heart rate, and other vital functions." }
      ];
    },
    // Coronal cross-section of one kidney: cortex → medulla → pelvis → ureter.
    kidney: function () {
      return [
        { layer: "Cortex", size: 150, x: 0, y: 0, z: 0, color: "radial-gradient(circle at 32% 28%, #ffd2d2, #b94a4a)", label: "Renal cortex", desc: "Outer layer — contains the filtering nephrons." },
        { layer: "Medulla", size: 96, x: 8, y: 0, z: 0, color: "radial-gradient(circle at 32% 28%, #ffb3a0, #9b3b2f)", label: "Renal medulla", desc: "Inner region — renal pyramids that collect urine." },
        { layer: "Pelvis", size: 46, x: 26, y: 6, z: 12, color: COL.bone, label: "Renal pelvis", desc: "Funnel that gathers urine and drains it into the ureter." },
        { layer: "Ureter", box: true, r: 6, size: 12, h: 130, x: 36, y: 110, z: 0, color: COL.teal, label: "Ureter", desc: "Carries urine from the kidney to the bladder." }
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
      ".v3d__node{position:absolute;left:0;top:0;border-radius:50%;transform-style:preserve-3d;" +
      "box-shadow:inset -6px -8px 16px rgba(0,0,0,.35),0 8px 22px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;cursor:pointer}" +
      ".v3d__box{border-radius:10px}" +
      ".v3d__label{position:absolute;top:-6px;left:50%;transform:translate(-50%,-100%);background:rgba(8,55,66,.9);color:#eafcff;font-size:11px;font-weight:700;" +
      "padding:2px 7px;border-radius:999px;white-space:nowrap;pointer-events:none}" +
      ".v3d--nolabels .v3d__label{display:none}" +
      ".v3d-controls{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}";
    document.head.appendChild(el("style", { id: "v3d-style", html: css }));
  }

  MA.viewer3d = { title: "Anatomy 3D", render: render };
})();
