/* app.js — shell, hash router, home dashboard, and shared services
   (toast, bottom sheet, streak, view lifecycle). */
(function () {
  "use strict";
  var MA = window.MA, U = MA.util, el = U.el;
  var viewEl = document.getElementById("view");
  var titleEl = document.getElementById("appTitle");
  var backBtn = document.getElementById("navBack");
  var sheet = document.getElementById("sheet");
  var sheetBody = document.getElementById("sheetBody");
  var toastEl = document.getElementById("toast");
  var leaveHandlers = [];

  /* ---------- view lifecycle ---------- */
  function runLeave() { leaveHandlers.forEach(function (f) { try { f(); } catch (e) {} }); leaveHandlers = []; }
  function onLeave(fn) { leaveHandlers.push(fn); }
  function setView(node, title) {
    viewEl.innerHTML = "";
    viewEl.appendChild(node);
    viewEl.scrollTop = 0;
    if (title) titleEl.textContent = title;
    viewEl.focus({ preventScroll: true });
  }

  /* ---------- toast ---------- */
  var toastT;
  function toast(msg) { toastEl.textContent = msg; toastEl.hidden = false; clearTimeout(toastT); toastT = setTimeout(function () { toastEl.hidden = true; }, 1800); }

  /* ---------- bottom sheet ---------- */
  function openSheet(node) { sheetBody.innerHTML = ""; sheetBody.appendChild(node); sheet.hidden = false; }
  function closeSheet() { sheet.hidden = true; sheetBody.innerHTML = ""; }
  sheet.addEventListener("click", function (e) { if (e.target.hasAttribute("data-close-sheet")) closeSheet(); });

  /* ---------- streak ---------- */
  function todayStr() { return new Date().toISOString().slice(0, 10); }
  function bumpStreak() {
    return MA.store.getKV("streak", { count: 0, last: null }).then(function (s) {
      var t = todayStr();
      if (s.last === t) return s;
      var y = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      s.count = s.last === y ? (s.count || 0) + 1 : 1;
      s.last = t;
      return MA.store.setKV("streak", s).then(function () { return s; });
    });
  }

  /* ---------- router ---------- */
  var TABS = { home: 1, study: 1, anatomy: 1, notes: 1 };
  function go(route) { var target = "#/" + route; if (location.hash === target) handle(); else location.hash = target; }
  window.addEventListener("hashchange", handle);

  function handle() {
    var path = (location.hash || "#/home").replace(/^#\/?/, "");
    var seg = path.split("/").filter(Boolean);
    var base = seg[0] || "home";

    // "More" just opens the menu over the current view — don't tear the view down.
    if (base === "more") { openMore(); highlightTab(TABS[currentBase] ? currentBase : ""); return; }

    runLeave();
    closeSheet();
    var node, title, showBack = false;
    try {
      switch (base) {
        case "home": node = renderHome(); title = "MA Study"; break;
        case "study":
          if (seg[2]) { node = MA.flashcards.routes[seg[2]](seg[1]); title = "Study"; showBack = true; }
          else if (seg[1]) { node = MA.flashcards.routes.deck(seg[1]); title = "Study"; showBack = true; }
          else { node = MA.flashcards.renderList(); title = "Study"; }
          break;
        case "anatomy": node = MA.viewer3d.render(seg[1]); title = "Anatomy 3D"; break;
        case "notes": node = MA.notes.render(); title = "Notes"; break;
        case "quiz":
          node = seg[1] ? MA.quiz.renderBank(seg[1]) : MA.quiz.renderHub(); title = "Quizzes"; showBack = !!seg[1] || true; break;
        case "calendar": node = MA.calendar.render(); title = "Calendar"; showBack = true; break;
        case "facts": node = MA.facts.render(); title = "Fun Facts"; showBack = true; break;
        case "library": node = MA.library.render(seg.slice(1).join("/")); title = "Library"; showBack = true; break;
        case "settings": node = MA.settings.render(); title = "Settings"; showBack = true; break;
        default: node = renderHome(); title = "MA Study"; base = "home";
      }
    } catch (err) {
      node = el("div", { class: "empty" }, [el("div", { class: "empty__emoji", text: "⚠️" }), el("h3", { text: "Something went wrong" }), el("p", { class: "muted", text: String(err && err.message || err) })]);
    }
    // deeper study/library routes also get back
    if (seg.length > 1) showBack = true;

    currentBase = base;
    setView(node, title);
    backBtn.hidden = !showBack;
    backBtn.onclick = function () { history.length > 1 ? history.back() : go(base); };
    highlightTab(TABS[base] ? base : "");
  }
  var currentBase = "home";

  function highlightTab(base) {
    Array.prototype.forEach.call(document.querySelectorAll(".tabbar__btn"), function (b) {
      var on = b.dataset.route === base;
      if (on) b.setAttribute("aria-current", "page"); else b.removeAttribute("aria-current");
    });
  }

  document.querySelector(".tabbar").addEventListener("click", function (e) {
    var btn = e.target.closest(".tabbar__btn"); if (!btn) return;
    var r = btn.dataset.route;
    if (r === "more") openMore(); else go(r);
  });
  document.getElementById("navSettings").addEventListener("click", function () { go("settings"); });

  /* ---------- "More" menu ---------- */
  function openMore() {
    var items = [
      { r: "quiz", e: "❓", n: "Quizzes", s: "Weekly quiz & subject quizzes" },
      { r: "calendar", e: "🗓️", n: "Calendar", s: "Your exams & TEAS date" },
      { r: "library", e: "📚", n: "Library & BSN/TEAS", s: "Reference docs & pathway" },
      { r: "facts", e: "💡", n: "Fun Facts", s: "Bite-size knowledge" },
      { r: "settings", e: "⚙️", n: "Settings", s: "Preferences & your data" }
    ];
    var box = el("div", { class: "stack" });
    box.appendChild(el("h3", { text: "More" }));
    var list = el("div", { class: "list" });
    items.forEach(function (it) {
      list.appendChild(el("button", { class: "list__item", onclick: function () { closeSheet(); go(it.r); } }, [
        el("span", { class: "tile__emoji", text: it.e }),
        el("div", { class: "list__grow" }, [el("div", { class: "list__title", text: it.n }), el("div", { class: "list__sub", text: it.s })]),
        el("span", { class: "chev", text: "›" })
      ]));
    });
    box.appendChild(list);
    openSheet(box);
  }

  /* ---------- home dashboard ---------- */
  function renderHome() {
    var wrap = el("div", { class: "stack" });
    var hour = new Date().getHours();
    var greet = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

    var hero = el("div", { class: "hero stack" }, [
      el("div", { class: "row row--between" }, [
        el("div", {}, [el("div", { class: "muted", text: greet + " 👋" }), el("h2", { text: "Ready to study?" })]),
        el("div", { class: "streak", id: "homeStreak", text: "" })
      ]),
      el("div", { class: "muted", text: (MA_DATA.meta && MA_DATA.meta.tagline) || "" })
    ]);
    wrap.appendChild(hero);
    MA.store.getKV("streak", { count: 0 }).then(function (s) { var n = document.getElementById("homeStreak"); if (n) n.textContent = "🔥 " + (s.count || 0); });

    // weekly quiz prompt
    MA.store.getKV("weeklyOptIn", false).then(function (on) {
      if (!on) return;
      MA.store.getKV("weeklyDone", {}).then(function (done) {
        var wk = U.weekKey();
        if (done[wk]) return;
        var c = el("div", { class: "card row row--between" }, [
          el("div", {}, [el("div", { class: "list__title", text: "📅 Weekly quiz is ready" }), el("div", { class: "list__sub", text: "10 mixed questions" })]),
          el("button", { class: "btn btn--primary btn--sm", onclick: function () { go("quiz"); } }, "Start")
        ]);
        wrap.insertBefore(c, wrap.children[1] || null);
      });
    });

    // upcoming exam
    MA.store.all("events").then(function (events) {
      var up = events.filter(function (e) { return new Date(e.date).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0); }).sort(function (a, b) { return a.date - b.date; })[0];
      if (!up) return;
      var d = U.daysUntil(up.date);
      var c = el("button", { class: "list__item card", style: "width:100%;border-radius:var(--r)", onclick: function () { go("calendar"); } }, [
        el("span", { class: "tile__emoji", text: "⏳" }),
        el("div", { class: "list__grow" }, [el("div", { class: "list__title ellipsis", text: up.title }), el("div", { class: "list__sub", text: U.fmtDate(up.date, { weekday: "short", month: "short", day: "numeric" }) })]),
        el("span", { class: "pill pill--accent", text: d === 0 ? "Today" : d + "d" })
      ]);
      wrap.appendChild(el("div", {}, [el("div", { class: "section-title", text: "Next up" }), c]));
    });

    // quick tiles
    wrap.appendChild(el("div", { class: "section-title", text: "Jump in" }));
    var tiles = el("div", { class: "tiles" });
    [
      { r: "study", e: "🃏", n: "Flashcards", s: "Quizlet-style decks" },
      { r: "anatomy", e: "🫀", n: "3D Anatomy", s: "Interactive models" },
      { r: "quiz", e: "❓", n: "Quizzes", s: "Test yourself" },
      { r: "notes", e: "📓", n: "Notes", s: "Folders + .md export" },
      { r: "calendar", e: "🗓️", n: "Calendar", s: "Plan your exams" },
      { r: "library", e: "📚", n: "BSN / TEAS", s: "Pathway & docs" },
      { r: "facts", e: "💡", n: "Fun Facts", s: "Quick knowledge" },
      { r: "settings", e: "⚙️", n: "Settings", s: "You & your data" }
    ].forEach(function (t) {
      tiles.appendChild(el("button", { class: "tile", onclick: function () { go(t.r); } }, [
        el("span", { class: "tile__emoji", text: t.e }), el("span", { class: "tile__name", text: t.n }), el("span", { class: "tile__sub", text: t.s })
      ]));
    });
    wrap.appendChild(tiles);

    // fact of the day
    var facts = (MA_DATA && MA_DATA.facts) || [];
    if (facts.length) {
      var f = facts[Math.floor(Date.now() / 86400000) % facts.length];
      wrap.appendChild(el("div", {}, [
        el("div", { class: "section-title", text: "Fact of the day" }),
        el("button", { class: "card", style: "width:100%;text-align:left", onclick: function () { go("facts"); } }, [el("div", { class: "fact", text: "💡 " + f.text }), el("div", { class: "fact__src", text: f.source })])
      ]));
    }
    return wrap;
  }

  MA.app = { go: go, setView: setView, onLeave: onLeave, toast: toast, openSheet: openSheet, closeSheet: closeSheet, bumpStreak: bumpStreak };

  /* ---------- boot ---------- */
  if ("serviceWorker" in navigator && location.protocol.indexOf("http") === 0) {
    window.addEventListener("load", function () { navigator.serviceWorker.register("service-worker.js").catch(function () {}); });
  }
  handle();
})();
