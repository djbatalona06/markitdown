/* store.js — on-device persistence (IndexedDB with a localStorage fallback).
   Everything the user creates lives here; nothing leaves the device. */
(function () {
  "use strict";
  window.MA = window.MA || {};

  var DB_NAME = "ma-study";
  var DB_VER = 1;
  var STORES = ["kv", "notes", "folders", "events"]; // object stores
  var dbp = null;

  function open() {
    if (dbp) return dbp;
    dbp = new Promise(function (resolve, reject) {
      if (!("indexedDB" in window)) { reject(new Error("no-idb")); return; }
      var req = indexedDB.open(DB_NAME, DB_VER);
      req.onupgradeneeded = function () {
        var db = req.result;
        STORES.forEach(function (s) {
          if (!db.objectStoreNames.contains(s)) db.createObjectStore(s, { keyPath: "id" });
        });
      };
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { reject(req.error); };
    });
    return dbp;
  }

  function tx(store, mode) {
    return open().then(function (db) {
      return db.transaction(store, mode).objectStore(store);
    });
  }
  function reqP(r) {
    return new Promise(function (res, rej) { r.onsuccess = function () { res(r.result); }; r.onerror = function () { rej(r.error); }; });
  }

  // ---- localStorage fallback (used only if IndexedDB is unavailable) ----
  var LS = {
    key: function (s) { return "ma:" + s; },
    all: function (s) { try { return JSON.parse(localStorage.getItem(LS.key(s)) || "[]"); } catch (e) { return []; } },
    save: function (s, arr) { localStorage.setItem(LS.key(s), JSON.stringify(arr)); }
  };
  var useLS = !("indexedDB" in window);

  var store = {
    /* generic record API over a named store */
    put: function (s, obj) {
      if (!obj.id) obj.id = MA.util ? MA.util.uid() : String(Date.now()) + Math.random().toString(36).slice(2);
      if (useLS) { var a = LS.all(s).filter(function (x) { return x.id !== obj.id; }); a.push(obj); LS.save(s, a); return Promise.resolve(obj); }
      return tx(s, "readwrite").then(function (os) { return reqP(os.put(obj)); }).then(function () { return obj; });
    },
    get: function (s, id) {
      if (useLS) return Promise.resolve(LS.all(s).filter(function (x) { return x.id === id; })[0] || null);
      return tx(s, "readonly").then(function (os) { return reqP(os.get(id)); });
    },
    all: function (s) {
      if (useLS) return Promise.resolve(LS.all(s));
      return tx(s, "readonly").then(function (os) { return reqP(os.getAll()); });
    },
    del: function (s, id) {
      if (useLS) { LS.save(s, LS.all(s).filter(function (x) { return x.id !== id; })); return Promise.resolve(); }
      return tx(s, "readwrite").then(function (os) { return reqP(os.delete(id)); });
    },

    /* convenience key/value (settings, srs map, quiz results) stored in "kv" */
    setKV: function (key, value) { return store.put("kv", { id: key, value: value }); },
    getKV: function (key, def) {
      return store.get("kv", key).then(function (r) { return r ? r.value : (def === undefined ? null : def); });
    }
  };

  MA.store = store;
})();
