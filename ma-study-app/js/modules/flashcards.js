/* flashcards.js — Quizlet-style decks with four study modes:
   Flashcards (flip), Learn (Leitner spaced repetition), Match, and Test. */
(function () {
  "use strict";
  var MA = window.MA, U = MA.util, el = U.el;

  function decks() { return (window.MA_DATA && MA_DATA.decks) || []; }
  function deckById(id) { return decks().filter(function (d) { return d.id === id; })[0]; }

  /* ---- SRS state (Leitner). Stored in kv as srs:<deckId> = { cardId: {box, due} } ---- */
  function srsKey(id) { return "srs:" + id; }
  function loadSrs(id) { return MA.store.getKV(srsKey(id), {}); }
  function saveSrs(id, map) { return MA.store.setKV(srsKey(id), map); }
  var BOX_DAYS = [0, 1, 2, 4, 7, 15]; // box 1..5 review intervals
  function isDue(rec) { return !rec || !rec.due || rec.due <= Date.now(); }

  /* ============ deck list ============ */
  function renderList() {
    var wrap = el("div", { class: "stack" });
    wrap.appendChild(el("p", { class: "muted", text: "Pick a deck, then choose a study mode. Your progress saves on this device." }));

    var subjects = {};
    decks().forEach(function (d) { (subjects[d.subject] = subjects[d.subject] || []).push(d); });

    Object.keys(subjects).forEach(function (subj) {
      wrap.appendChild(el("div", { class: "section-title", text: subj }));
      var list = el("div", { class: "list" });
      subjects[subj].forEach(function (d) {
        list.appendChild(el("button", {
          class: "list__item", onclick: function () { MA.app.go("study/" + d.id); }
        }, [
          el("span", { class: "tile__emoji", text: d.emoji || "🃏" }),
          el("div", { class: "list__grow" }, [
            el("div", { class: "list__title", text: d.title }),
            el("div", { class: "list__sub", text: d.cards.length + " cards" })
          ]),
          el("span", { class: "chev", text: "›" })
        ]));
      });
      wrap.appendChild(list);
    });
    return wrap;
  }

  /* ============ deck home (mode picker) ============ */
  function renderDeck(deckId) {
    var d = deckById(deckId);
    if (!d) return el("div", { class: "empty" }, "Deck not found.");
    var wrap = el("div", { class: "stack" });
    wrap.appendChild(el("div", { class: "hero" }, [
      el("div", { class: "pill", text: d.subject }),
      el("h2", { text: d.title }),
      el("div", { class: "muted", text: d.cards.length + " cards" })
    ]));

    var dueNote = el("div", { class: "muted center", text: "" });
    loadSrs(deckId).then(function (map) {
      var due = d.cards.filter(function (c) { return isDue(map[c.id]); }).length;
      var learned = d.cards.length - due;
      dueNote.textContent = learned + " learned · " + due + " due for review";
    });

    var modes = [
      { k: "cards", emoji: "🃏", name: "Flashcards", sub: "Flip through at your pace" },
      { k: "learn", emoji: "🧠", name: "Learn", sub: "Spaced repetition (recommended)" },
      { k: "match", emoji: "🧩", name: "Match", sub: "Pair terms & definitions, timed" },
      { k: "test", emoji: "📝", name: "Test", sub: "Multiple-choice self-quiz" }
    ];
    var grid = el("div", { class: "tiles" });
    modes.forEach(function (m) {
      grid.appendChild(el("button", { class: "tile", onclick: function () { MA.app.go("study/" + deckId + "/" + m.k); } }, [
        el("span", { class: "tile__emoji", text: m.emoji }),
        el("span", { class: "tile__name", text: m.name }),
        el("span", { class: "tile__sub", text: m.sub })
      ]));
    });
    wrap.appendChild(dueNote);
    wrap.appendChild(grid);
    return wrap;
  }

  /* ============ mode: flashcards (flip) ============ */
  function renderCards(deckId) {
    var d = deckById(deckId);
    var cards = U.shuffle(d.cards);
    var i = 0;
    var wrap = el("div", { class: "stack" });
    var counter = el("div", { class: "muted center", text: "" });
    var stage = el("div", { class: "flash-stage" });
    var flash = el("div", { class: "flash", role: "button", tabindex: "0", "aria-label": "Tap to flip card" });
    var front = el("div", { class: "flash__face" }, [el("div", { class: "flash__term" })]);
    var back = el("div", { class: "flash__face flash__face--back" }, [el("div", { class: "flash__def" })]);
    flash.appendChild(front); flash.appendChild(back);
    flash.appendChild(el("div", { class: "flash__hint", text: "Tap to flip" }));
    stage.appendChild(flash);

    function show() {
      var c = cards[i];
      front.querySelector(".flash__term").textContent = c.term;
      back.querySelector(".flash__def").textContent = c.def + (c.hint ? "  💡 " + c.hint : "");
      flash.classList.remove("is-flipped");
      counter.textContent = (i + 1) + " / " + cards.length;
    }
    function flip() { flash.classList.toggle("is-flipped"); }
    function next(step) { i = (i + step + cards.length) % cards.length; show(); }
    flash.addEventListener("click", flip);
    flash.addEventListener("keydown", function (e) { if (e.key === " " || e.key === "Enter") { e.preventDefault(); flip(); } });

    var nav = el("div", { class: "row row--between" }, [
      el("button", { class: "btn btn--ghost", onclick: function () { next(-1); }, "aria-label": "Previous" }, "‹ Prev"),
      el("button", { class: "btn btn--ghost", onclick: function () { next(1); }, "aria-label": "Next" }, "Next ›")
    ]);
    wrap.appendChild(counter); wrap.appendChild(stage); wrap.appendChild(nav);
    show();
    return wrap;
  }

  /* ============ mode: learn (Leitner SRS) ============ */
  function renderLearn(deckId) {
    var d = deckById(deckId);
    var wrap = el("div", { class: "stack" });
    var body = el("div");
    wrap.appendChild(body);
    loadSrs(deckId).then(function (map) {
      var queue = U.shuffle(d.cards.filter(function (c) { return isDue(map[c.id]); }));
      if (!queue.length) queue = U.shuffle(d.cards); // nothing due → review all
      var idx = 0, correct = 0;
      step();

      function grade(card, knew) {
        var rec = map[card.id] || { box: 1 };
        rec.box = knew ? Math.min(5, (rec.box || 1) + 1) : 1;
        rec.due = Date.now() + BOX_DAYS[rec.box] * 86400000;
        map[card.id] = rec;
        if (knew) correct++;
        saveSrs(deckId, map);
        idx++; step();
      }
      function step() {
        body.innerHTML = "";
        if (idx >= queue.length) { body.appendChild(done()); return; }
        var c = queue[idx];
        body.appendChild(el("div", { class: "muted center", text: (idx + 1) + " / " + queue.length }));
        var stage = el("div", { class: "flash-stage" });
        var flash = el("div", { class: "flash", role: "button", tabindex: "0", "aria-label": "Tap to reveal answer" });
        flash.appendChild(el("div", { class: "flash__face" }, [el("div", { class: "flash__term", text: c.term })]));
        flash.appendChild(el("div", { class: "flash__face flash__face--back" }, [el("div", { class: "flash__def", text: c.def })]));
        flash.appendChild(el("div", { class: "flash__hint", text: "Tap to reveal" }));
        stage.appendChild(flash);
        var revealed = false;
        var actions = el("div", { class: "stack" });
        function reveal() { if (revealed) return; revealed = true; flash.classList.add("is-flipped"); actions.appendChild(graders); }
        flash.addEventListener("click", reveal);
        flash.addEventListener("keydown", function (e) { if (e.key === " " || e.key === "Enter") { e.preventDefault(); reveal(); } });
        var graders = el("div", { class: "row", style: "gap:10px" }, [
          el("button", { class: "btn btn--danger btn--block", onclick: function () { grade(c, false); } }, "Still learning"),
          el("button", { class: "btn btn--accent btn--block", onclick: function () { grade(c, true); } }, "Got it ✓")
        ]);
        body.appendChild(stage); body.appendChild(actions);
      }
      function done() {
        MA.app.bumpStreak();
        return el("div", { class: "empty" }, [
          el("div", { class: "empty__emoji", text: "🎉" }),
          el("h3", { text: "Session complete" }),
          el("p", { class: "muted", text: "You knew " + correct + " of " + queue.length + ". Spaced repetition scheduled the rest for review." }),
          el("button", { class: "btn btn--primary", onclick: function () { MA.app.go("study/" + deckId); } }, "Back to deck")
        ]);
      }
    });
    return wrap;
  }

  /* ============ mode: match (timed pairing) ============ */
  function renderMatch(deckId) {
    var d = deckById(deckId);
    var pick = U.shuffle(d.cards).slice(0, 6);
    var tiles = [];
    pick.forEach(function (c) {
      tiles.push({ id: c.id, kind: "term", text: c.term });
      tiles.push({ id: c.id, kind: "def", text: c.def });
    });
    tiles = U.shuffle(tiles);
    var wrap = el("div", { class: "stack" });
    var t0 = Date.now(), matched = 0, sel = null, timerNode = el("div", { class: "muted center", text: "0.0s" });
    var timer = setInterval(function () { timerNode.textContent = ((Date.now() - t0) / 1000).toFixed(1) + "s"; }, 100);
    MA.app.onLeave(function () { clearInterval(timer); });

    var grid = el("div", { class: "match-grid" });
    tiles.forEach(function (t) {
      var cell = el("button", { class: "match-cell", text: t.text });
      cell._t = t;
      cell.addEventListener("click", function () {
        if (cell.classList.contains("ok")) return;
        if (!sel) { sel = cell; cell.classList.add("sel"); return; }
        if (sel === cell) { sel.classList.remove("sel"); sel = null; return; }
        if (sel._t.id === t.id && sel._t.kind !== t.kind) {
          sel.classList.add("ok"); cell.classList.add("ok"); sel.classList.remove("sel"); sel = null; matched++;
          if (matched === pick.length) {
            clearInterval(timer);
            grid.after(el("div", { class: "empty" }, [
              el("div", { class: "empty__emoji", text: "⚡" }),
              el("h3", { text: "Matched in " + ((Date.now() - t0) / 1000).toFixed(1) + "s" }),
              el("button", { class: "btn btn--primary", onclick: function () { MA.app.go("study/" + deckId + "/match"); } }, "Play again")
            ]));
          }
        } else {
          var a = sel, b = cell; a.classList.add("bad"); b.classList.add("bad");
          setTimeout(function () { a.classList.remove("bad", "sel"); b.classList.remove("bad"); }, 350); sel = null;
        }
      });
      grid.appendChild(cell);
    });
    wrap.appendChild(el("p", { class: "muted center", text: "Tap a term, then its matching definition." }));
    wrap.appendChild(timerNode); wrap.appendChild(grid);
    return wrap;
  }

  /* ============ mode: test (MC self-quiz built from cards) ============ */
  function renderTest(deckId) {
    var d = deckById(deckId);
    var qs = U.shuffle(d.cards).slice(0, Math.min(10, d.cards.length));
    var wrap = el("div", { class: "stack" });
    var body = el("div"); wrap.appendChild(body);
    var idx = 0, score = 0;
    step();
    function step() {
      body.innerHTML = "";
      if (idx >= qs.length) { body.appendChild(MA.quiz.scoreCard(score, qs.length, function () { MA.app.go("study/" + deckId); })); return; }
      var c = qs[idx];
      var distract = U.shuffle(d.cards.filter(function (x) { return x.id !== c.id; })).slice(0, 3).map(function (x) { return x.def; });
      var options = U.shuffle([c.def].concat(distract));
      body.appendChild(el("div", { class: "muted center", text: (idx + 1) + " / " + qs.length }));
      body.appendChild(el("div", { class: "card" }, [el("h3", { text: c.term })]));
      var answered = false;
      options.forEach(function (opt) {
        var b = el("button", { class: "opt", text: opt });
        b.addEventListener("click", function () {
          if (answered) return; answered = true;
          var ok = opt === c.def;
          if (ok) { b.classList.add("correct"); score++; }
          else { b.classList.add("wrong"); Array.prototype.forEach.call(body.querySelectorAll(".opt"), function (o) { if (o.textContent === c.def) o.classList.add("correct"); }); }
          Array.prototype.forEach.call(body.querySelectorAll(".opt"), function (o) { o.disabled = true; });
          body.appendChild(el("button", { class: "btn btn--primary btn--block", style: "margin-top:14px", onclick: function () { idx++; step(); } }, idx + 1 >= qs.length ? "See score" : "Next"));
        });
        body.appendChild(b);
      });
    }
    return wrap;
  }

  MA.flashcards = {
    title: "Study",
    renderList: renderList,
    routes: {
      deck: renderDeck, cards: renderCards, learn: renderLearn, match: renderMatch, test: renderTest
    }
  };
})();
