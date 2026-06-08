/* content.test.js — dependency-free integrity tests for the baked study content.
   Run: node tests/content.test.js   (exit code != 0 on failure) */
"use strict";
var path = require("path");

// minimal window/globals the content files expect
global.window = {};
global.TextEncoder = require("util").TextEncoder;

var CONTENT = path.resolve(__dirname, "..", "content");
[
  "data.js", "library.js",
  "decks/anatomy.js", "decks/med-terminology.js", "decks/pharmacology.js",
  "decks/clinical.js", "decks/teas.js", "quizzes/quizbank.js"
].forEach(function (f) { require(path.join(CONTENT, f)); });

var D = global.window.MA_DATA;
var fails = [];
function ok(cond, msg) { if (!cond) fails.push(msg); }

// ---- decks ----
ok(Array.isArray(D.decks) && D.decks.length >= 8, "expected >= 8 decks, got " + (D.decks && D.decks.length));
var deckIds = {};
D.decks.forEach(function (d) {
  ok(d.id && d.title && d.subject, "deck missing id/title/subject: " + JSON.stringify(d.id));
  ok(!deckIds[d.id], "duplicate deck id: " + d.id); deckIds[d.id] = true;
  ok(Array.isArray(d.cards) && d.cards.length > 0, "deck has no cards: " + d.id);
  var cardIds = {};
  d.cards.forEach(function (c) {
    ok(c.id && c.term && c.def, "card missing id/term/def in " + d.id + ": " + JSON.stringify(c.id));
    ok(!cardIds[c.id], "duplicate card id in " + d.id + ": " + c.id); cardIds[c.id] = true;
  });
});

// ---- quizzes (answer index must be valid) ----
ok(Array.isArray(D.quizzes) && D.quizzes.length >= 7, "expected >= 7 quiz banks, got " + (D.quizzes && D.quizzes.length));
D.quizzes.forEach(function (b) {
  ok(b.id && b.questions && b.questions.length, "quiz bank empty/invalid: " + b.id);
  b.questions.forEach(function (q) {
    ok(q.q && Array.isArray(q.choices) && q.choices.length >= 2, "bad question in " + b.id + ": " + q.id);
    ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.choices.length, "answer index out of range in " + b.id + ": " + q.id);
  });
});

// ---- facts ----
ok(Array.isArray(D.facts) && D.facts.length >= 10, "expected >= 10 facts");
D.facts.forEach(function (f) { ok(f.id && f.text && f.source, "fact missing fields: " + JSON.stringify(f.id)); });

// ---- 3D topics must reference existing decks ----
ok(Array.isArray(D.topics) && D.topics.length >= 6, "expected >= 6 topics");
D.topics.forEach(function (t) {
  ok(t.id && t.name && t.proc, "topic missing fields: " + JSON.stringify(t.id));
  if (t.deck) ok(deckIds[t.deck], "topic '" + t.id + "' references missing deck '" + t.deck + "'");
});

// ---- guides + refs (library) ----
ok(D.guides && D.guides.length >= 2, "expected >= 2 pathway guides (MA->BSN, TEAS)");
ok(D.refs && D.refs.length >= 3, "expected >= 3 quick-reference docs");
ok(D.guides.some(function (g) { return /bsn/i.test(g.id) || /bsn/i.test(g.title); }), "missing MA->BSN guide");
ok(D.guides.some(function (g) { return /teas/i.test(g.id) || /teas/i.test(g.title); }), "missing TEAS guide");

// ---- report ----
var totalCards = D.decks.reduce(function (a, d) { return a + d.cards.length; }, 0);
var totalQs = D.quizzes.reduce(function (a, b) { return a + b.questions.length; }, 0);
if (fails.length) {
  console.error("✗ content tests FAILED (" + fails.length + "):");
  fails.forEach(function (m) { console.error("  • " + m); });
  process.exit(1);
}
console.log("✓ content OK — " + D.decks.length + " decks / " + totalCards + " cards, " +
  D.quizzes.length + " quiz banks / " + totalQs + " questions, " +
  D.facts.length + " facts, " + D.topics.length + " 3D topics, " +
  D.guides.length + " guides, " + D.refs.length + " refs.");
