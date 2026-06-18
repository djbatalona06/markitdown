/* quiz.js — quiz banks + an opt-in weekly quiz.
   The weekly quiz is chosen deterministically from the ISO week so it's the same
   all week, fully offline, and resets automatically each new week. */
(function () {
  "use strict";
  var MA = window.MA, U = MA.util, el = U.el;

  function banks() { return (window.MA_DATA && MA_DATA.quizzes) || []; }
  function bankById(id) { return banks().filter(function (q) { return q.id === id; })[0]; }

  function scoreCard(score, total, onBack) {
    var pct = Math.round((score / total) * 100);
    var emoji = pct >= 80 ? "🏆" : pct >= 60 ? "👍" : "📚";
    return el("div", { class: "empty" }, [
      el("div", { class: "empty__emoji", text: emoji }),
      el("h3", { text: score + " / " + total + "  (" + pct + "%)" }),
      el("p", { class: "muted", text: pct >= 80 ? "Excellent work!" : pct >= 60 ? "Solid — review the misses and go again." : "Keep at it — repetition builds recall." }),
      el("button", { class: "btn btn--primary", onclick: onBack }, "Done")
    ]);
  }

  /* ---- generic runner over a question bank ---- */
  function runBank(bank, opts) {
    opts = opts || {};
    var qs = U.shuffle(bank.questions, opts.seed).slice(0, opts.limit || bank.questions.length);
    var wrap = el("div", { class: "stack" });
    var head = el("div", { class: "hero" }, [
      el("div", { class: "pill", text: bank.subject }),
      el("h2", { text: opts.title || bank.title }),
      el("div", { class: "muted", text: qs.length + " questions" })
    ]);
    var body = el("div"); wrap.appendChild(head); wrap.appendChild(body);
    var idx = 0, score = 0;
    step();
    function step() {
      body.innerHTML = "";
      if (idx >= qs.length) {
        if (opts.onFinish) opts.onFinish(score, qs.length);
        body.appendChild(scoreCard(score, qs.length, opts.onBack || function () { MA.app.go("quiz"); }));
        return;
      }
      var q = qs[idx];
      // keep choices stable but shuffle display order, tracking the correct text
      var correctText = q.choices[q.answer];
      var shown = U.shuffle(q.choices);
      body.appendChild(el("div", { class: "muted center", text: (idx + 1) + " / " + qs.length }));
      body.appendChild(el("div", { class: "card" }, [el("h3", { text: q.q })]));
      var answered = false;
      shown.forEach(function (choice) {
        var b = el("button", { class: "opt", text: choice });
        b.addEventListener("click", function () {
          if (answered) return; answered = true;
          var ok = choice === correctText;
          if (ok) { b.classList.add("correct"); score++; }
          else {
            b.classList.add("wrong");
            Array.prototype.forEach.call(body.querySelectorAll(".opt"), function (o) { if (o.textContent === correctText) o.classList.add("correct"); });
          }
          Array.prototype.forEach.call(body.querySelectorAll(".opt"), function (o) { o.disabled = true; });
          if (q.explain) body.appendChild(el("div", { class: "card", style: "margin-top:12px", html: "<strong>Why:</strong> " + U.esc(q.explain) }));
          body.appendChild(el("button", { class: "btn btn--primary btn--block", style: "margin-top:14px", onclick: function () { idx++; step(); } }, idx + 1 >= qs.length ? "See score" : "Next question"));
        });
        body.appendChild(b);
      });
    }
    return wrap;
  }

  /* ---- weekly quiz: deterministic per ISO week, mixes all banks ---- */
  function weeklyPool() {
    var all = [];
    banks().forEach(function (b) { b.questions.forEach(function (q) { all.push(q); }); });
    return all;
  }
  function weeklyBank() {
    var wk = U.weekKey();
    var pool = U.shuffle(weeklyPool(), wk).slice(0, 10);
    return { id: "weekly-" + wk, title: "Weekly Quiz · " + wk, subject: "Weekly", questions: pool };
  }

  function renderHub() {
    var wrap = el("div", { class: "stack" });
    var wk = U.weekKey();

    MA.store.getKV("weeklyOptIn", false).then(function (optIn) {
      MA.store.getKV("weeklyDone", {}).then(function (done) {
        var card = el("div", { class: "card stack" });
        card.appendChild(el("div", { class: "row row--between" }, [
          el("div", {}, [el("h3", { text: "📅 Weekly Quiz" }), el("div", { class: "muted", text: optIn ? "On · resets every week" : "Opted out" })]),
          weeklyToggle(optIn)
        ]));
        if (optIn) {
          if (done[wk]) {
            card.appendChild(el("div", { class: "pill pill--accent", text: "Done this week: " + done[wk].score + "/" + done[wk].total }));
            card.appendChild(el("button", { class: "btn btn--ghost btn--block", onclick: startWeekly }, "Retake"));
          } else {
            card.appendChild(el("button", { class: "btn btn--primary btn--block", onclick: startWeekly }, "Start this week's quiz"));
          }
        } else {
          card.appendChild(el("p", { class: "muted", text: "Turn this on to get a fresh 10-question mixed quiz each week. You can opt out any time." }));
        }
        wrap.insertBefore(card, wrap.firstChild);
      });
    });

    function weeklyToggle(on) {
      var input = el("input", { type: "checkbox", "aria-label": "Weekly quiz opt in" });
      input.checked = !!on;
      input.addEventListener("change", function () {
        MA.store.setKV("weeklyOptIn", input.checked).then(function () { MA.app.go("quiz"); });
      });
      return el("label", { class: "switch" }, [input, el("span", { class: "switch__track" })]);
    }
    function startWeekly() {
      MA.app.setView(runBank(weeklyBank(), {
        seed: wk, title: "Weekly Quiz", onBack: function () { MA.app.go("quiz"); },
        onFinish: function (s, t) {
          MA.store.getKV("weeklyDone", {}).then(function (d) { d[wk] = { score: s, total: t }; MA.store.setKV("weeklyDone", d); });
          MA.app.bumpStreak();
        }
      }), "Weekly Quiz");
    }

    wrap.appendChild(el("div", { class: "section-title", text: "Quiz by subject" }));
    var list = el("div", { class: "list" });
    banks().forEach(function (b) {
      list.appendChild(el("button", { class: "list__item", onclick: function () { MA.app.go("quiz/" + b.id); } }, [
        el("span", { class: "tile__emoji", text: b.emoji || "❓" }),
        el("div", { class: "list__grow" }, [
          el("div", { class: "list__title", text: b.title }),
          el("div", { class: "list__sub", text: b.questions.length + " questions" })
        ]),
        el("span", { class: "chev", text: "›" })
      ]));
    });
    wrap.appendChild(list);
    return wrap;
  }

  function renderBank(id) {
    var b = bankById(id);
    if (!b) return el("div", { class: "empty" }, "Quiz not found.");
    return runBank(b, { onBack: function () { MA.app.go("quiz"); }, onFinish: function () { MA.app.bumpStreak(); } });
  }

  MA.quiz = { title: "Quizzes", scoreCard: scoreCard, renderHub: renderHub, renderBank: renderBank, weeklyBank: weeklyBank };
})();
