/* routes.test.js — headless-DOM smoke test: boots the app and renders every route,
   asserting non-empty output and zero runtime errors.
   Requires jsdom (devDependency). Run: node tests/routes.test.js
   If jsdom isn't installed, the test skips (exit 0) with a note. */
"use strict";
var path = require("path");

var jsdomMod;
try { jsdomMod = require("jsdom"); }
catch (e) { console.log("• routes.test skipped (jsdom not installed — run `npm install`)"); process.exit(0); }

var JSDOM = jsdomMod.JSDOM, VirtualConsole = jsdomMod.VirtualConsole;
var indexPath = path.resolve(__dirname, "..", "index.html");
var fileUrl = "file://" + indexPath;
var errors = [];
var vc = new VirtualConsole();
vc.on("jsdomError", function (e) { errors.push("jsdomError: " + (e && e.message)); });
vc.on("error", function () { errors.push("console.error: " + Array.prototype.join.call(arguments, " ")); });

var ROUTES = [
  "home", "study", "study/anatomy", "study/anatomy/cards", "study/anatomy/learn",
  "study/anatomy/match", "study/anatomy/test", "anatomy", "anatomy/cell", "anatomy/dna",
  "notes", "quiz", "quiz/q-anatomy", "calendar", "facts",
  "library", "library/guide:ma-to-bsn", "library/ref:vitals", "settings"
];

JSDOM.fromFile(indexPath, { runScripts: "dangerously", resources: "usable", url: fileUrl, virtualConsole: vc, pretendToBeVisual: true })
  .then(function (dom) {
    var w = dom.window;
    w.matchMedia = w.matchMedia || function () { return { matches: false, addEventListener: function () {}, removeEventListener: function () {}, addListener: function () {}, removeListener: function () {} }; };
    w.requestAnimationFrame = function (cb) { return setTimeout(function () { cb(Date.now()); }, 1000); };
    w.cancelAnimationFrame = function (id) { clearTimeout(id); };
    if (!w.TextEncoder) w.TextEncoder = require("util").TextEncoder;
    if (!w.fetch) w.fetch = function () { return Promise.reject(new Error("no fetch")); };
    w.HTMLElement.prototype.setPointerCapture = function () {};
    w.HTMLElement.prototype.releasePointerCapture = function () {};
    w.HTMLElement.prototype.scrollTo = function () {};

    return new Promise(function (r) { setTimeout(r, 900); }).then(function () { return run(w); });
  })
  .then(function () {
    if (errors.length) {
      console.error("✗ routes test FAILED (" + errors.length + " runtime errors):");
      [].concat(errors).slice(0, 25).forEach(function (e) { console.error("  • " + e); });
      process.exit(1);
    }
    console.log("✓ routes OK — booted and rendered all " + ROUTES.length + " routes, 0 runtime errors.");
  })
  .catch(function (e) { console.error("✗ boot failed: " + e.message); process.exit(1); });

function run(w) {
  var MA = w.MA;
  if (!MA || !MA.app) { errors.push("app did not boot (MA.app undefined)"); return Promise.resolve(); }
  var chain = Promise.resolve();
  ROUTES.forEach(function (route) {
    chain = chain.then(function () {
      try { MA.app.go(route); } catch (e) { errors.push("route " + route + " threw: " + e.message); }
      return new Promise(function (r) { setTimeout(r, 70); }).then(function () {
        var len = w.document.getElementById("view").innerHTML.length;
        if (len < 20) errors.push("route " + route + " rendered empty view");
      });
    });
  });
  return chain;
}
