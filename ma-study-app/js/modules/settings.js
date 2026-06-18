/* settings.js — preferences, weekly-quiz opt in/out, streak, and data controls. */
(function () {
  "use strict";
  var MA = window.MA, U = MA.util, el = U.el;

  function render() {
    var wrap = el("div", { class: "stack" });

    // weekly quiz toggle
    MA.store.getKV("weeklyOptIn", false).then(function (on) {
      var input = el("input", { type: "checkbox", "aria-label": "Weekly quiz" }); input.checked = !!on;
      input.addEventListener("change", function () { MA.store.setKV("weeklyOptIn", input.checked).then(function () { MA.app.toast(input.checked ? "Weekly quizzes on" : "Opted out"); }); });
      card.appendChild(row("📅 Weekly quizzes", "Get a fresh mixed quiz each week", el("label", { class: "switch" }, [input, el("span", { class: "switch__track" })])));
    });

    var card = el("div", { class: "card" });
    wrap.appendChild(card);

    // streak + progress
    Promise.all([MA.store.getKV("streak", { count: 0 }), MA.store.all("notes"), MA.store.all("events")]).then(function (r) {
      var streak = r[0];
      var stats = el("div", { class: "grid2", style: "margin-top:4px" }, [
        stat("🔥", streak.count || 0, "day streak"),
        stat("📝", r[1].length, "notes"),
        stat("🗓️", r[2].length, "events"),
        stat("🃏", ((window.MA_DATA && MA_DATA.decks) || []).reduce(function (a, d) { return a + d.cards.length; }, 0), "flashcards")
      ]);
      wrap.insertBefore(el("div", {}, [el("div", { class: "section-title", text: "Your progress" }), stats]), wrap.firstChild);
    });

    // appearance note
    wrap.appendChild(el("div", { class: "section-title", text: "Appearance" }));
    wrap.appendChild(el("div", { class: "card" }, [el("p", { class: "muted", text: "Light/dark mode follows your device setting automatically." })]));

    // data controls
    wrap.appendChild(el("div", { class: "section-title", text: "Your data" }));
    var data = el("div", { class: "card stack" });
    data.appendChild(el("p", { class: "muted", text: "Everything you create stays on this device. Back it up or clear it here." }));
    data.appendChild(el("button", { class: "btn btn--ghost btn--block", onclick: exportAll }, "⤓ Back up all my data (.json)"));
    data.appendChild(el("button", { class: "btn btn--danger btn--block", onclick: clearAll }, "Clear all my data"));
    wrap.appendChild(data);

    // about
    wrap.appendChild(el("div", { class: "section-title", text: "About" }));
    wrap.appendChild(el("div", { class: "card" }, [
      el("p", { html: "<strong>MA Study</strong> v" + ((window.MA_DATA && MA_DATA.meta && MA_DATA.meta.version) || "1.0.0") }),
      el("p", { class: "muted", text: "Offline study app for Medical Assistants, with a BSN/TEAS pathway. Educational use only — verify clinical details against current authoritative sources." }),
      el("p", { class: "muted", text: "Install: open in your phone browser → Share/Menu → “Add to Home Screen” to use fully offline." })
    ]));

    function row(title, sub, control) {
      return el("div", { class: "row row--between", style: "padding:6px 0" }, [
        el("div", {}, [el("div", { class: "list__title", text: title }), el("div", { class: "list__sub", text: sub })]), control
      ]);
    }
    function stat(emoji, n, label) {
      return el("div", { class: "card", style: "text-align:center;padding:14px" }, [
        el("div", { style: "font-size:24px", text: emoji }), el("div", { style: "font-size:22px;font-weight:800", text: String(n) }), el("div", { class: "muted", text: label })
      ]);
    }
    function exportAll() {
      Promise.all([MA.store.all("notes"), MA.store.all("folders"), MA.store.all("events"), MA.store.all("kv")]).then(function (r) {
        var dump = { app: "ma-study", exported: new Date().toISOString(), notes: r[0], folders: r[1], events: r[2], kv: r[3] };
        U.download("ma-study-backup.json", JSON.stringify(dump, null, 2), "application/json"); MA.app.toast("Backup downloaded");
      });
    }
    function clearAll() {
      var box = el("div", { class: "stack" }, [
        el("h3", { text: "Clear all data?" }),
        el("p", { class: "muted", text: "This permanently deletes your notes, folders, events, streak, and study progress on this device. This can't be undone." }),
        el("button", { class: "btn btn--danger btn--block", onclick: function () {
          Promise.all(["notes", "folders", "events", "kv"].map(function (s) { return MA.store.all(s).then(function (items) { return Promise.all(items.map(function (it) { return MA.store.del(s, it.id); })); }); }))
            .then(function () { MA.app.closeSheet(); MA.app.toast("All data cleared"); MA.app.go("home"); });
        } }, "Yes, delete everything"),
        el("button", { class: "btn btn--ghost btn--block", onclick: function () { MA.app.closeSheet(); } }, "Cancel")
      ]);
      MA.app.openSheet(box);
    }
    return wrap;
  }

  MA.settings = { title: "Settings", render: render };
})();
