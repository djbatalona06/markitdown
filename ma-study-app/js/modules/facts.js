/* facts.js — swipeable "fun facts" feed with on-device favorites. */
(function () {
  "use strict";
  var MA = window.MA, U = MA.util, el = U.el;
  function facts() { return (window.MA_DATA && MA_DATA.facts) || []; }

  function render() {
    var wrap = el("div", { class: "stack" });
    var order = U.shuffle(facts());
    var i = 0;
    var card = el("div", { class: "card stack", style: "min-height:220px;justify-content:center" });
    var body = el("div"); card.appendChild(body);
    var favBtn = el("button", { class: "btn btn--ghost btn--sm", "aria-label": "Favorite" });

    MA.store.getKV("factFavs", {}).then(function (favs) {
      function show() {
        var f = order[i];
        body.innerHTML = "";
        body.appendChild(el("div", { class: "fact", text: "💡 " + f.text }));
        body.appendChild(el("div", { class: "fact__src", text: "Source: " + f.source }));
        favBtn.textContent = favs[f.id] ? "★ Saved" : "☆ Save";
        counter.textContent = (i + 1) + " / " + order.length;
      }
      favBtn.addEventListener("click", function () {
        var f = order[i];
        if (favs[f.id]) delete favs[f.id]; else favs[f.id] = f.text;
        MA.store.setKV("factFavs", favs).then(show);
      });
      var counter = el("div", { class: "muted center" });
      var nav = el("div", { class: "row row--between" }, [
        el("button", { class: "btn btn--ghost", onclick: function () { i = (i - 1 + order.length) % order.length; show(); } }, "‹ Prev"),
        favBtn,
        el("button", { class: "btn btn--primary", onclick: function () { i = (i + 1) % order.length; show(); } }, "Next ›")
      ]);
      // swipe support
      var sx = 0;
      card.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
      card.addEventListener("touchend", function (e) {
        var dx = e.changedTouches[0].clientX - sx;
        if (dx < -40) { i = (i + 1) % order.length; show(); }
        else if (dx > 40) { i = (i - 1 + order.length) % order.length; show(); }
      });
      wrap.appendChild(el("p", { class: "muted center", text: "Swipe or tap to flip through. Save your favorites." }));
      wrap.appendChild(counter); wrap.appendChild(card); wrap.appendChild(nav);
      show();
    });
    return wrap;
  }

  MA.facts = { title: "Fun Facts", render: render };
})();
