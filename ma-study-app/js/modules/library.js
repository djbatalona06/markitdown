/* library.js — offline reference library: BSN/TEAS pathway guides, quick-reference
   docs, and any docs added by the build-time pipeline (library/index.json). */
(function () {
  "use strict";
  var MA = window.MA, U = MA.util, el = U.el;
  function guides() { return (window.MA_DATA && MA_DATA.guides) || []; }
  function refs() { return (window.MA_DATA && MA_DATA.refs) || []; }

  function render(docId) {
    if (docId) return readDoc(docId);
    var wrap = el("div", { class: "stack" });
    wrap.appendChild(el("p", { class: "muted", text: "Reference docs and the road from MA to BSN — all available offline." }));

    wrap.appendChild(el("div", { class: "section-title", text: "Pathway & TEAS" }));
    wrap.appendChild(docList(guides(), "guide"));

    wrap.appendChild(el("div", { class: "section-title", text: "Quick references" }));
    wrap.appendChild(docList(refs(), "ref"));

    // pipeline-generated docs (present only when served & built)
    var extra = el("div");
    wrap.appendChild(extra);
    tryLoadIndex().then(function (items) {
      if (items && items.length) {
        extra.appendChild(el("div", { class: "section-title", text: "Imported documents" }));
        extra.appendChild(docList(items.map(function (it) { return { id: it.id, title: it.title, tag: it.source || "Imported", file: it.file }; }), "file"));
      }
    });

    wrap.appendChild(el("div", { class: "card", style: "margin-top:18px" }, [
      el("h3", { text: "📥 Add more medical documents" }),
      el("p", { class: "muted", text: "On your computer you can pull more open-source medical docs into this library. See tools/ in the app folder: run fetch_docs.py then convert_docs.py (uses markitdown). The new docs appear here automatically." })
    ]));
    return wrap;
  }

  function docList(items, kind) {
    var list = el("div", { class: "list" });
    if (!items.length) { return el("div", { class: "empty" }, [el("p", { class: "muted", text: "Nothing here yet." })]); }
    items.forEach(function (d) {
      list.appendChild(el("button", { class: "list__item", onclick: function () { MA.app.go("library/" + kind + ":" + d.id); } }, [
        el("span", { class: "tile__emoji", text: "📄" }),
        el("div", { class: "list__grow" }, [el("div", { class: "list__title", text: d.title }), el("div", { class: "list__sub", text: d.tag || "" })]),
        el("span", { class: "chev", text: "›" })
      ]));
    });
    return list;
  }

  function readDoc(docId) {
    var parts = docId.split(":"), kind = parts[0], id = parts.slice(1).join(":");
    var wrap = el("div", { class: "stack" });
    var article = el("article", { class: "card markdown" });
    wrap.appendChild(article);

    var doc;
    if (kind === "guide") doc = guides().filter(function (g) { return g.id === id; })[0];
    else if (kind === "ref") doc = refs().filter(function (r) { return r.id === id; })[0];

    if (doc) {
      article.innerHTML = U.mdToHtml(doc.body);
      wrap.appendChild(el("button", { class: "btn btn--ghost btn--block", onclick: function () { U.download((doc.title || "doc").replace(/[^a-z0-9]+/gi, "-").toLowerCase() + ".md", doc.body, "text/markdown"); } }, "⤓ Export this doc as .md"));
    } else if (kind === "file") {
      article.textContent = "Loading…";
      tryLoadIndex().then(function (items) {
        var it = (items || []).filter(function (x) { return x.id === id; })[0];
        if (!it) { article.textContent = "Document not found."; return; }
        fetch("library/" + it.file).then(function (r) { return r.text(); }).then(function (md) {
          article.innerHTML = U.mdToHtml(md);
        }).catch(function () { article.innerHTML = "<p class='muted'>This imported document can't be read from a raw file:// folder. Open the app from the installed PWA or a local server to view it.</p>"; });
      });
    } else { article.textContent = "Document not found."; }
    return wrap;
  }

  var _idx;
  function tryLoadIndex() {
    if (_idx) return _idx;
    _idx = fetch("library/index.json").then(function (r) { return r.ok ? r.json() : []; }).then(function (j) { return j.docs || j || []; }).catch(function () { return []; });
    return _idx;
  }

  MA.library = { title: "Library", render: render };
})();
