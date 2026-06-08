/* util.js — tiny DOM + helpers shared across modules. */
(function () {
  "use strict";
  window.MA = window.MA || {};

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (k === "class") node.className = v;
      else if (k === "html") node.innerHTML = v;
      else if (k === "text") node.textContent = v;
      else if (k === "dataset") Object.keys(v).forEach(function (d) { node.dataset[d] = v[d]; });
      else if (k.slice(0, 2) === "on" && typeof v === "function") node.addEventListener(k.slice(2).toLowerCase(), v);
      else if (v === true) node.setAttribute(k, "");
      else if (v !== false && v != null) node.setAttribute(k, v);
    });
    (Array.isArray(children) ? children : children != null ? [children] : []).forEach(function (c) {
      if (c == null) return;
      node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return node;
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }

  function fmtDate(ts, opts) {
    try { return new Date(ts).toLocaleDateString(undefined, opts || { month: "short", day: "numeric", year: "numeric" }); }
    catch (e) { return new Date(ts).toDateString(); }
  }

  function daysUntil(ts) {
    var ms = new Date(ts).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0);
    return Math.round(ms / 86400000);
  }

  // ISO week number — drives deterministic "weekly quiz" selection offline.
  function isoWeek(d) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    var day = (d.getUTCDay() + 6) % 7;
    d.setUTCDate(d.getUTCDate() - day + 3);
    var firstThu = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
    return 1 + Math.round(((d - firstThu) / 86400000 - 3 + ((firstThu.getUTCDay() + 6) % 7)) / 7);
  }
  function weekKey(date) { var d = date || new Date(); return d.getFullYear() + "-W" + isoWeek(d); }

  // seeded shuffle (deterministic when a seed string is given)
  function shuffle(arr, seed) {
    var a = arr.slice(), rnd = seed == null ? Math.random : mulberry(hashStr(seed));
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(rnd() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function hashStr(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function mulberry(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; var t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

  // very small, safe markdown -> html (headings, bold, italics, lists, code, links, blockquote)
  function mdToHtml(md) {
    var lines = String(md || "").replace(/\r\n/g, "\n").split("\n");
    var out = [], inUl = false, inOl = false, inCode = false;
    function closeLists() { if (inUl) { out.push("</ul>"); inUl = false; } if (inOl) { out.push("</ol>"); inOl = false; } }
    for (var i = 0; i < lines.length; i++) {
      var ln = lines[i];
      if (/^```/.test(ln)) { if (inCode) { out.push("</code></pre>"); inCode = false; } else { closeLists(); out.push("<pre><code>"); inCode = true; } continue; }
      if (inCode) { out.push(esc(ln)); continue; }
      var h = ln.match(/^(#{1,3})\s+(.*)$/);
      if (h) { closeLists(); out.push("<h" + h[1].length + ">" + inline(h[2]) + "</h" + h[1].length + ">"); continue; }
      if (/^>\s?/.test(ln)) { closeLists(); out.push("<blockquote>" + inline(ln.replace(/^>\s?/, "")) + "</blockquote>"); continue; }
      if (/^\s*[-*]\s+/.test(ln)) { if (!inUl) { closeLists(); out.push("<ul>"); inUl = true; } out.push("<li>" + inline(ln.replace(/^\s*[-*]\s+/, "")) + "</li>"); continue; }
      if (/^\s*\d+\.\s+/.test(ln)) { if (!inOl) { closeLists(); out.push("<ol>"); inOl = true; } out.push("<li>" + inline(ln.replace(/^\s*\d+\.\s+/, "")) + "</li>"); continue; }
      if (/^\s*$/.test(ln)) { closeLists(); continue; }
      closeLists(); out.push("<p>" + inline(ln) + "</p>");
    }
    closeLists(); if (inCode) out.push("</code></pre>");
    return out.join("\n");
    function inline(s) {
      return esc(s)
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
        .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
        .replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>")
        .replace(/`([^`]+)`/g, "<code>$1</code>");
    }
  }

  function download(filename, text, mime) {
    var blob = new Blob([text], { type: mime || "text/plain;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = el("a", { href: url, download: filename });
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  MA.util = { el: el, esc: esc, uid: uid, fmtDate: fmtDate, daysUntil: daysUntil, isoWeek: isoWeek, weekKey: weekKey, shuffle: shuffle, mdToHtml: mdToHtml, download: download };
})();
