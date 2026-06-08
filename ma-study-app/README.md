# MA Study 🩺 — Offline Study App for Medical Assistants

A single, **fully offline** study app for Medical Assistant students — with an eye on
the road to a **BSN** (and the **TEAS** entrance exam). No accounts, no servers, no
tracking: everything you create stays on your device.

> Educational use only. Verify clinical details against current authoritative sources
> (your program, the CDC, AHA, your state board of nursing, and the official ATI TEAS).

## ✨ Features

- **🃏 Flashcards (Quizlet-style)** — 186+ cards across Anatomy & Physiology, Medical
  Terminology, Pharmacology Basics, Clinical Skills & Safety, and 4 TEAS decks. Four
  study modes: **Flashcards** (flip), **Learn** (spaced repetition), **Match** (timed),
  and **Test** (multiple choice). Progress saves on-device.
- **🫀 3D anatomy** — interactive, draggable CSS-3D models (heart, skeleton, skull,
  lungs, brain, kidney, animal cell, DNA). Tap labeled parts; jump to related flashcards.
  Pure CSS 3D — no downloads, runs great offline on a phone.
- **❓ Quizzes + opt-in weekly quiz** — subject quiz banks plus a **weekly quiz you can
  turn on or off**. The weekly quiz is the same all week and refreshes automatically.
- **🗓️ Calendar** — add your own exams (including a **TEAS test** type) and get live
  countdowns.
- **📓 Notes with a Letterboxd-style folder system** — organize notes into named lists;
  export a single note, a whole list as one combined `.md`, or a **zip of separate `.md`
  files**. Markdown supported.
- **💡 Fun facts** — swipeable feed with favorites.
- **📚 Library + BSN/TEAS pathway** — offline quick-reference docs, a **“MA → BSN: what
  you need to do”** guide, and a **TEAS study guide + test-day checklist**. Pull in more
  open-source docs with the included tools.

## 📱 Install on your phone (fully offline)

The most reliable way to get a true offline app on a phone is to install it as a PWA:

1. Put this `ma-study-app` folder somewhere it can be **served over http** (any static
   host or a local server — see below), or use the published URL if you host it.
2. Open it in your phone's browser.
3. **Add to Home Screen** (iOS Safari: Share → Add to Home Screen; Android Chrome: menu →
   Install app / Add to Home Screen).
4. Launch it from the home-screen icon — it now works **fully offline**. A service worker
   caches the whole app, content, and any docs/models you've opened.

### Run it locally (desktop or to serve to your phone)

```bash
cd ma-study-app
python3 -m http.server 8000
# open http://localhost:8000  (or http://<your-computer-ip>:8000 from your phone)
```

> **About `file://`:** the app's study content is baked into JS so opening `index.html`
> directly from a folder works in most desktop browsers. However, phones restrict
> `file://`, and imported Library docs/3D model files load over http only — so for the
> phone, **install it as a PWA** (above). That's the supported offline path.

## 💾 Get it onto your computer

This app lives on the `markitdown` repo branch `claude/ma-study-app-interactive-aA8sh`.
Clone it into your own projects folder:

```bash
git clone -b claude/ma-study-app-interactive-aA8sh <your-markitdown-repo-url> ma-study
cd ma-study/ma-study-app
```

(You can copy the `ma-study-app/` folder anywhere — it's self-contained.)

## 📥 Add more medical documents (optional)

Pull additional **open-source / public-domain** medical references into the offline
Library. Run these on a computer with internet access:

```bash
pip install pyyaml requests 'markitdown[all]'
# optional, for sites that block plain requests:
pip install cloakbrowser

python3 tools/fetch_docs.py      # downloads curated sources (see tools/sources.yaml)
python3 tools/convert_docs.py    # markitdown -> library/*.md + library/index.json
```

New docs appear automatically under **Library → Imported documents**. Edit
`tools/sources.yaml` to add your own reputable, openly-licensed source URLs. Be a good
citizen: respect each site's terms and keep the request delay polite.

## 🧱 Project structure

```
ma-study-app/
├── index.html            # app shell (loads everything as classic scripts → file:// friendly)
├── manifest.webmanifest  # installable PWA
├── service-worker.js     # offline cache
├── css/app.css           # design system (healthcare palette, dark mode, WCAG-minded)
├── js/
│   ├── store.js          # IndexedDB persistence (with localStorage fallback)
│   ├── app.js            # router + home dashboard + shared services
│   └── modules/          # flashcards, quiz, calendar, notes, facts, viewer3d, library, settings, util
├── content/              # baked, offline study content (decks, quizzes, facts, guides)
├── models/               # (optional) drop real CC0 .glb anatomy models here later
├── library/              # imported docs land here (built by tools/)
├── tools/                # fetch_docs.py, convert_docs.py, sources.yaml (build-time only)
└── assets/               # icons
```

## 🔒 Privacy

100% local. No network calls in normal use, no analytics, no accounts. Your notes,
calendar, streaks, and study progress live only in your browser's storage on your device.
Back them up or wipe them any time from **Settings → Your data**.

## 🛠️ Extending the 3D models

v1 ships interactive, lightweight **CSS-3D** diagrams (recognizable and labeled, but
stylized — not anatomical scans). To add true 3D meshes later, drop CC0/CC-licensed
`.glb` files into `models/` (e.g. from the NIH 3D Print Exchange or BodyParts3D) and wire
a topic entry in `content/data.js`. A WebGL loader (Three.js) can be vendored into
`js/vendor/` if you go that route.
