/* notes.js — personal notepad with a Letterboxd-style folder/list system.
   Notes are Markdown. Export a single note, or a whole folder as combined .md or
   a .zip of individual .md files (zip writer is built in — no dependencies). */
(function () {
  "use strict";
  var MA = window.MA, U = MA.util, el = U.el;
  var activeFolder = "all"; // 'all' | 'unfiled' | folderId

  function render() {
    var wrap = el("div", { class: "stack" });
    var body = el("div"); wrap.appendChild(body);
    Promise.all([MA.store.all("notes"), MA.store.all("folders")]).then(function (res) {
      var notes = res[0], folders = res[1];
      notes.sort(function (a, b) { return b.updated - a.updated; });
      folders.sort(function (a, b) { return a.created - b.created; });
      body.innerHTML = "";

      // folder chips (lists)
      var chips = el("div", { class: "row", style: "flex-wrap:wrap;gap:8px" });
      chips.appendChild(chip("all", "🗂 All", notes.length));
      chips.appendChild(chip("unfiled", "Unfiled", notes.filter(function (n) { return !n.folderId; }).length));
      folders.forEach(function (f) { chips.appendChild(chip(f.id, (f.emoji || "📁") + " " + f.name, notes.filter(function (n) { return n.folderId === f.id; }).length)); });
      chips.appendChild(el("button", { class: "folder-chip", onclick: newFolder }, "＋ List"));
      body.appendChild(chips);

      // actions
      var visible = notes.filter(function (n) {
        return activeFolder === "all" ? true : activeFolder === "unfiled" ? !n.folderId : n.folderId === activeFolder;
      });
      body.appendChild(el("div", { class: "row", style: "margin-top:12px;gap:8px" }, [
        el("button", { class: "btn btn--primary btn--block", onclick: function () { editNote(null, folders); } }, "＋ New note"),
        visible.length ? el("button", { class: "btn btn--ghost btn--sm", onclick: function () { exportSheet(visible, folders); } }, "⤓ Export") : null
      ]));

      // notes list
      if (!visible.length) {
        body.appendChild(el("div", { class: "empty" }, [el("div", { class: "empty__emoji", text: "📝" }), el("p", { class: "muted", text: "No notes here yet. Tap “New note”." })]));
      } else {
        var stack = el("div", { class: "stack", style: "margin-top:14px" });
        visible.forEach(function (n) {
          var folder = folders.filter(function (f) { return f.id === n.folderId; })[0];
          stack.appendChild(el("div", { class: "note-card", onclick: function () { editNote(n, folders); } }, [
            el("h3", { class: "ellipsis", text: n.title || "Untitled" }),
            el("p", { class: "muted ellipsis", text: (n.body || "").replace(/[#*>`]/g, "").slice(0, 90) || "Empty note" }),
            el("div", { class: "note-card__meta", text: U.fmtDate(n.updated) + (folder ? " · " + (folder.emoji || "📁") + " " + folder.name : "") })
          ]));
        });
        body.appendChild(stack);
      }
    });

    function chip(id, label, count) {
      return el("button", { class: "folder-chip" + (activeFolder === id ? " active" : ""), onclick: function () { activeFolder = id; MA.app.go("notes"); } }, label + " · " + count);
    }
    function newFolder() {
      var box = el("div", { class: "stack" });
      var emoji = el("input", { class: "input", placeholder: "📁", value: "📁", style: "width:64px;text-align:center" });
      var name = el("input", { class: "input", placeholder: "List name (e.g. Cardio, Exam 2, Watch later)" });
      box.appendChild(el("h3", { text: "New list" }));
      box.appendChild(el("div", { class: "row", style: "gap:8px" }, [emoji, name]));
      box.appendChild(el("button", { class: "btn btn--primary btn--block", onclick: function () {
        if (!name.value.trim()) { MA.app.toast("Name the list"); return; }
        MA.store.put("folders", { name: name.value.trim(), emoji: emoji.value.trim() || "📁", created: Date.now() }).then(function (f) { activeFolder = f.id; MA.app.closeSheet(); MA.app.go("notes"); });
      } }, "Create"));
      MA.app.openSheet(box);
    }
    return wrap;
  }

  function editNote(note, folders) {
    note = note || {};
    var box = el("div", { class: "stack" });
    box.appendChild(el("h3", { text: note.id ? "Edit note" : "New note" }));
    var title = el("input", { class: "input", placeholder: "Title", value: note.title || "" });
    var folderSel = el("select", { class: "input" });
    folderSel.appendChild(el("option", { value: "", text: "Unfiled" }));
    folders.forEach(function (f) { var o = el("option", { value: f.id, text: (f.emoji || "📁") + " " + f.name }); if (note.folderId === f.id) o.selected = true; folderSel.appendChild(o); });
    if (!note.folderId && activeFolder !== "all" && activeFolder !== "unfiled") folderSel.value = activeFolder;
    var area = el("textarea", { class: "textarea", placeholder: "Write in Markdown… # heading, **bold**, - lists" }); area.value = note.body || "";

    box.appendChild(el("div", { class: "field" }, [el("label", { text: "Title" }), title]));
    box.appendChild(el("div", { class: "field" }, [el("label", { text: "List / folder" }), folderSel]));
    box.appendChild(el("div", { class: "field" }, [el("label", { text: "Note (Markdown)" }), area]));
    box.appendChild(el("div", { class: "row", style: "gap:8px" }, [
      el("button", { class: "btn btn--primary btn--block", onclick: save }, "Save"),
      el("button", { class: "btn btn--ghost btn--sm", onclick: function () { exportOne(current()); } }, "⤓ .md")
    ]));
    if (note.id) box.appendChild(el("button", { class: "btn btn--danger btn--block", onclick: remove }, "Delete note"));
    MA.app.openSheet(box);

    function current() { return { id: note.id, title: title.value.trim(), body: area.value, folderId: folderSel.value || null, created: note.created || Date.now(), updated: Date.now() }; }
    function save() { MA.store.put("notes", current()).then(function () { MA.app.closeSheet(); MA.app.toast("Saved"); MA.app.go("notes"); }); }
    function remove() { MA.store.del("notes", note.id).then(function () { MA.app.closeSheet(); MA.app.toast("Deleted"); MA.app.go("notes"); }); }
  }

  /* ---------- markdown export ---------- */
  function noteToMd(n) {
    var fm = "---\ntitle: " + (n.title || "Untitled") + "\nupdated: " + new Date(n.updated).toISOString() + "\n---\n\n";
    return fm + "# " + (n.title || "Untitled") + "\n\n" + (n.body || "");
  }
  function safeName(s) { return (s || "untitled").replace(/[^a-z0-9\-_ ]/gi, "").trim().replace(/\s+/g, "-").slice(0, 50) || "note"; }

  function exportOne(n) { U.download(safeName(n.title) + ".md", noteToMd(n), "text/markdown;charset=utf-8"); MA.app.toast("Exported .md"); }

  function exportSheet(notes, folders) {
    var box = el("div", { class: "stack" });
    box.appendChild(el("h3", { text: "Export " + notes.length + " note" + (notes.length > 1 ? "s" : "") }));
    box.appendChild(el("button", { class: "btn btn--primary btn--block", onclick: function () {
      var combined = notes.map(noteToMd).join("\n\n---\n\n");
      U.download("ma-notes.md", combined, "text/markdown;charset=utf-8"); MA.app.closeSheet(); MA.app.toast("Exported combined .md");
    } }, "Combined .md (one file)"));
    box.appendChild(el("button", { class: "btn btn--ghost btn--block", onclick: function () {
      var files = notes.map(function (n, i) { return { name: safeName(n.title) + "-" + (i + 1) + ".md", data: noteToMd(n) }; });
      var blob = zip(files);
      var url = URL.createObjectURL(blob); var a = el("a", { href: url, download: "ma-notes.zip" }); document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
      MA.app.closeSheet(); MA.app.toast("Exported .zip");
    } }, "Zip of separate .md files"));
    MA.app.openSheet(box);
  }

  /* ---------- minimal STORE-method ZIP writer (no compression, no deps) ---------- */
  var CRC = (function () { var t = []; for (var n = 0; n < 256; n++) { var c = n; for (var k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
  function crc32(bytes) { var c = 0xFFFFFFFF; for (var i = 0; i < bytes.length; i++) c = CRC[(c ^ bytes[i]) & 0xFF] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; }
  function strBytes(s) { return new TextEncoder().encode(s); }
  function zip(files) {
    var chunks = [], central = [], offset = 0;
    function u16(n) { return [n & 255, (n >>> 8) & 255]; }
    function u32(n) { return [n & 255, (n >>> 8) & 255, (n >>> 16) & 255, (n >>> 24) & 255]; }
    files.forEach(function (f) {
      var name = strBytes(f.name), data = strBytes(f.data), crc = crc32(data);
      var local = [].concat(u32(0x04034b50), u16(20), u16(0), u16(0), u16(0), u16(0), u32(crc), u32(data.length), u32(data.length), u16(name.length), u16(0));
      chunks.push(new Uint8Array(local), name, data);
      var central_hdr = [].concat(u32(0x02014b50), u16(20), u16(20), u16(0), u16(0), u16(0), u16(0), u32(crc), u32(data.length), u32(data.length), u16(name.length), u16(0), u16(0), u16(0), u16(0), u32(0), u32(offset));
      central.push({ hdr: new Uint8Array(central_hdr), name: name });
      offset += local.length + name.length + data.length;
    });
    var cstart = offset, csize = 0;
    central.forEach(function (c) { chunks.push(c.hdr, c.name); csize += c.hdr.length + c.name.length; });
    var end = [].concat(u32(0x06054b50), u16(0), u16(0), u16(central.length), u16(central.length), u32(csize), u32(cstart), u16(0));
    chunks.push(new Uint8Array(end));
    return new Blob(chunks, { type: "application/zip" });
  }

  MA.notes = { title: "Notes", render: render };
})();
