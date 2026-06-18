/* calendar.js — month calendar where the user adds their own exams (incl. a TEAS
   date type). Events persist on-device; upcoming items show a live countdown. */
(function () {
  "use strict";
  var MA = window.MA, U = MA.util, el = U.el;
  var view = new Date(); view.setDate(1);

  var TYPES = {
    exam: { label: "Exam", emoji: "📝", cls: "exam" },
    teas: { label: "TEAS Test", emoji: "🎯", cls: "exam" },
    study: { label: "Study session", emoji: "📚", cls: "" },
    clinical: { label: "Clinical / shift", emoji: "🩺", cls: "" }
  };

  function startOfDay(ts) { var d = new Date(ts); d.setHours(0, 0, 0, 0); return d.getTime(); }
  function sameDay(a, b) { return startOfDay(a) === startOfDay(b); }

  function render() {
    var wrap = el("div", { class: "stack" });
    var body = el("div"); wrap.appendChild(body);
    MA.store.all("events").then(function (events) {
      events.sort(function (a, b) { return a.date - b.date; });
      body.innerHTML = "";
      body.appendChild(monthCard(events));
      body.appendChild(upcomingCard(events));
      body.appendChild(el("button", { class: "btn btn--primary btn--block", onclick: function () { openEditor(null); } }, "＋ Add exam / event"));
    });

    function monthCard(events) {
      var card = el("div", { class: "card" });
      var label = view.toLocaleDateString(undefined, { month: "long", year: "numeric" });
      card.appendChild(el("div", { class: "row row--between" }, [
        el("button", { class: "btn btn--ghost btn--sm", onclick: function () { view.setMonth(view.getMonth() - 1); MA.app.go("calendar"); } }, "‹"),
        el("h3", { text: label, style: "margin:0" }),
        el("button", { class: "btn btn--ghost btn--sm", onclick: function () { view.setMonth(view.getMonth() + 1); MA.app.go("calendar"); } }, "›")
      ]));
      var grid = el("div", { class: "cal-grid", style: "margin-top:12px" });
      ["S", "M", "T", "W", "T", "F", "S"].forEach(function (d) { grid.appendChild(el("div", { class: "cal-dow", text: d })); });
      var first = new Date(view.getFullYear(), view.getMonth(), 1);
      var startPad = first.getDay();
      var daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
      for (var p = 0; p < startPad; p++) grid.appendChild(el("div", { class: "cal-cell muted-day" }));
      for (var day = 1; day <= daysInMonth; day++) {
        var date = new Date(view.getFullYear(), view.getMonth(), day);
        var dayEvents = events.filter(function (e) { return sameDay(e.date, date.getTime()); });
        var cell = el("button", { class: "cal-cell" + (sameDay(date.getTime(), Date.now()) ? " today" : ""), text: String(day) });
        if (dayEvents.length) {
          var hasExam = dayEvents.some(function (e) { return TYPES[e.type] && TYPES[e.type].cls === "exam"; });
          cell.appendChild(el("span", { class: "dot" + (hasExam ? " exam" : "") }));
        }
        (function (d) { cell.addEventListener("click", function () { daySheet(d, events); }); })(date.getTime());
        grid.appendChild(cell);
      }
      card.appendChild(grid);
      return card;
    }

    function upcomingCard(events) {
      var upcoming = events.filter(function (e) { return startOfDay(e.date) >= startOfDay(Date.now()); }).slice(0, 6);
      var card = el("div", { class: "stack" });
      card.appendChild(el("div", { class: "section-title", text: "Upcoming" }));
      if (!upcoming.length) { card.appendChild(el("div", { class: "empty" }, [el("div", { class: "empty__emoji", text: "🗓️" }), el("p", { class: "muted", text: "No events yet. Add your exam dates to see a countdown." })])); return card; }
      var list = el("div", { class: "list" });
      upcoming.forEach(function (e) {
        var t = TYPES[e.type] || TYPES.exam;
        var dleft = U.daysUntil(e.date);
        var when = dleft === 0 ? "Today" : dleft === 1 ? "Tomorrow" : "in " + dleft + " days";
        list.appendChild(el("button", { class: "list__item", onclick: function () { openEditor(e); } }, [
          el("span", { class: "tile__emoji", text: t.emoji }),
          el("div", { class: "list__grow" }, [
            el("div", { class: "list__title ellipsis", text: e.title }),
            el("div", { class: "list__sub", text: U.fmtDate(e.date, { weekday: "short", month: "short", day: "numeric" }) + " · " + t.label })
          ]),
          el("span", { class: "pill " + (dleft <= 3 ? "pill--accent" : "pill--primary"), text: when })
        ]));
      });
      card.appendChild(list);
      return card;
    }

    function daySheet(ts, events) {
      var dayEvents = events.filter(function (e) { return sameDay(e.date, ts); });
      var box = el("div", { class: "stack" });
      box.appendChild(el("h3", { text: U.fmtDate(ts, { weekday: "long", month: "long", day: "numeric" }) }));
      dayEvents.forEach(function (e) {
        var t = TYPES[e.type] || TYPES.exam;
        box.appendChild(el("button", { class: "list__item", onclick: function () { MA.app.closeSheet(); openEditor(e); } }, [
          el("span", { class: "tile__emoji", text: t.emoji }), el("div", { class: "list__grow", text: e.title })
        ]));
      });
      box.appendChild(el("button", { class: "btn btn--primary btn--block", onclick: function () { MA.app.closeSheet(); openEditor({ date: ts }); } }, "＋ Add on this day"));
      MA.app.openSheet(box);
    }

    function openEditor(ev) {
      ev = ev || {};
      var box = el("div", { class: "stack" });
      box.appendChild(el("h3", { text: ev.id ? "Edit event" : "New event" }));
      var title = el("input", { class: "input", placeholder: "e.g. TEAS exam, Anatomy midterm", value: ev.title || "" });
      var date = el("input", { type: "date", class: "input", value: ev.date ? new Date(ev.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10) });
      var type = el("select", { class: "input" });
      Object.keys(TYPES).forEach(function (k) { var o = el("option", { value: k, text: TYPES[k].emoji + " " + TYPES[k].label }); if (ev.type === k) o.selected = true; type.appendChild(o); });
      var note = el("textarea", { class: "textarea", placeholder: "Optional notes (room, what to bring, topics to review)" }); note.value = ev.note || "";
      box.appendChild(el("div", { class: "field" }, [el("label", { text: "Title" }), title]));
      box.appendChild(el("div", { class: "field" }, [el("label", { text: "Date" }), date]));
      box.appendChild(el("div", { class: "field" }, [el("label", { text: "Type" }), type]));
      box.appendChild(el("div", { class: "field" }, [el("label", { text: "Notes" }), note]));
      box.appendChild(el("button", { class: "btn btn--primary btn--block", onclick: save }, "Save"));
      if (ev.id) box.appendChild(el("button", { class: "btn btn--danger btn--block", onclick: remove }, "Delete"));
      MA.app.openSheet(box);

      function save() {
        if (!title.value.trim()) { MA.app.toast("Add a title"); return; }
        var rec = { id: ev.id, title: title.value.trim(), date: new Date(date.value + "T09:00").getTime(), type: type.value, note: note.value.trim() };
        MA.store.put("events", rec).then(function () { MA.app.closeSheet(); MA.app.toast("Saved"); MA.app.go("calendar"); });
      }
      function remove() { MA.store.del("events", ev.id).then(function () { MA.app.closeSheet(); MA.app.toast("Deleted"); MA.app.go("calendar"); }); }
    }

    return wrap;
  }

  MA.calendar = { title: "Calendar", render: render };
})();
