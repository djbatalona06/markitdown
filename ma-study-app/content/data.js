/* data.js — initializes the baked content namespace and holds app-wide content:
   fun facts, 3D topic map, and the BSN/TEAS pathway guides.
   Decks and quiz banks are registered by the files in content/decks and content/quizzes.
   All content is static and offline — no LLM runs in the shipped app. */
(function () {
  "use strict";
  var D = (window.MA_DATA = window.MA_DATA || {});
  D.decks = D.decks || [];
  D.quizzes = D.quizzes || [];

  D.meta = {
    name: "MA Study",
    tagline: "Offline study for Medical Assistants — and the road to BSN",
    version: "1.0.0"
  };

  /* ---- Fun facts (concise, verifiable; sources noted) ---- */
  D.facts = [
    { id: "f1", text: "The adult human body has 206 bones, but babies are born with about 300 — many fuse together as they grow.", source: "OpenStax Anatomy & Physiology" },
    { id: "f2", text: "The heart beats roughly 100,000 times a day, pumping about 7,500 liters of blood.", source: "NIH/NHLBI" },
    { id: "f3", text: "Normal resting adult heart rate is 60–100 beats per minute.", source: "American Heart Association" },
    { id: "f4", text: "A normal adult respiratory rate at rest is about 12–20 breaths per minute.", source: "MedlinePlus" },
    { id: "f5", text: "The 'universal donor' blood type is O-negative; the 'universal recipient' is AB-positive.", source: "American Red Cross" },
    { id: "f6", text: "Phlebotomy 'order of draw' helps prevent additive cross-contamination between tubes.", source: "CLSI guidelines" },
    { id: "f7", text: "The medial cubital vein in the antecubital fossa is the most common site for venipuncture.", source: "OpenStax A&P" },
    { id: "f8", text: "Hand hygiene is the single most effective way to prevent the spread of infection in healthcare.", source: "CDC" },
    { id: "f9", text: "'Standard Precautions' treat all blood and body fluids as potentially infectious.", source: "CDC" },
    { id: "f10", text: "The prefix 'tachy-' means fast; 'brady-' means slow. So tachycardia = fast heart rate.", source: "Medical terminology" },
    { id: "f11", text: "The suffix '-itis' means inflammation (e.g., appendicitis = inflammation of the appendix).", source: "Medical terminology" },
    { id: "f12", text: "Normal body temperature averages 98.6°F (37°C) but varies by person and time of day.", source: "MedlinePlus" },
    { id: "f13", text: "A normal adult blood pressure is below 120/80 mmHg (systolic/diastolic).", source: "American Heart Association" },
    { id: "f14", text: "The liver can regenerate; it can regrow to full size even after a large portion is removed.", source: "NIH" },
    { id: "f15", text: "There are about 5 liters of blood in the average adult, roughly 7–8% of body weight.", source: "OpenStax A&P" },
    { id: "f16", text: "The smallest bones in the body are the ossicles of the middle ear: malleus, incus, and stapes.", source: "OpenStax A&P" },
    { id: "f17", text: "HIPAA protects patient health information — never share PHI without authorization.", source: "U.S. HHS" },
    { id: "f18", text: "'NPO' on a chart means nil per os — nothing by mouth.", source: "Clinical abbreviations" },
    { id: "f19", text: "The pulse oximeter estimates blood oxygen saturation (SpO₂); 95–100% is typical for healthy adults.", source: "MedlinePlus" },
    { id: "f20", text: "Five rights of medication administration: right patient, drug, dose, route, and time.", source: "Patient safety" }
  ];

  /* ---- 3D anatomy topics. `model` points at models/<file>.glb if bundled;
     the viewer renders a labeled procedural model when a GLB is absent. ---- */
  D.topics = [
    { id: "heart", name: "Heart", emoji: "🫀", model: "heart.glb", proc: "heart", deck: "anatomy", blurb: "Four chambers, valves, and the path of blood flow through the cardiovascular system." },
    { id: "skeleton", name: "Skeletal System", emoji: "🦴", model: "skeleton.glb", proc: "skeleton", deck: "anatomy", blurb: "206 bones forming the axial and appendicular skeleton." },
    { id: "skull", name: "Skull", emoji: "💀", model: "skull.glb", proc: "skull", deck: "anatomy", blurb: "Cranial and facial bones protecting the brain." },
    { id: "lungs", name: "Respiratory", emoji: "🫁", model: "lungs.glb", proc: "lungs", deck: "anatomy", blurb: "Airways and lungs that exchange oxygen and carbon dioxide." },
    { id: "brain", name: "Brain", emoji: "🧠", model: "brain.glb", proc: "brain", deck: "anatomy", blurb: "Cerebrum, cerebellum, and brainstem of the central nervous system." },
    { id: "cell", name: "Animal Cell", emoji: "🦠", model: "cell.glb", proc: "cell", deck: "teas-science", blurb: "Organelles: nucleus, mitochondria, ER, and more — core TEAS science." },
    { id: "kidney", name: "Kidney", emoji: "🫘", model: "kidney.glb", proc: "kidney", deck: "anatomy", blurb: "Filters blood and forms urine in the urinary system." },
    { id: "dna", name: "DNA", emoji: "🧬", model: "dna.glb", proc: "dna", deck: "teas-science", blurb: "The double helix carrying genetic information." }
  ];

  /* ---- BSN / TEAS pathway guides (shown in the Library tab). Markdown bodies. ---- */
  D.guides = [
    {
      id: "ma-to-bsn",
      title: "MA → BSN: What You Need To Do",
      tag: "Pathway",
      body: [
        "# From Medical Assistant to BSN (Registered Nurse)",
        "Becoming a BSN-prepared RN is a great next step for many Medical Assistants. Requirements vary by **state and school**, so always confirm with your target nursing program. This is a general roadmap.",
        "",
        "## 1. Choose a pathway",
        "- **Traditional BSN** — a 4-year bachelor's degree in nursing.",
        "- **Accelerated BSN (ABSN)** — 12–18 months if you already hold a bachelor's in another field.",
        "- **ADN → RN → RN-to-BSN bridge** — earn an associate degree, get licensed, then complete a BSN online while working.",
        "",
        "## 2. Complete prerequisite courses",
        "Most programs require college-level: Anatomy & Physiology I & II (with labs), Microbiology, Chemistry, Statistics, Psychology, Human Growth & Development, English Composition, and Nutrition. Aim for strong grades — nursing admission is competitive.",
        "",
        "## 3. Pass the TEAS entrance exam",
        "The **ATI TEAS** (Test of Essential Academic Skills) is required by most nursing programs. See the TEAS guide in this Library. Prepare for Reading, Math, Science, and English & Language Usage.",
        "",
        "## 4. Gather application materials",
        "- Official transcripts and a competitive GPA",
        "- TEAS score report",
        "- Letters of recommendation",
        "- Personal statement / essay",
        "- Healthcare experience (your MA work counts — highlight it!)",
        "",
        "## 5. Meet clinical/compliance requirements",
        "Background check, drug screening, immunizations, CPR/BLS certification, and health insurance are commonly required before clinicals.",
        "",
        "## 6. After the BSN",
        "Graduate, then pass the **NCLEX-RN** to become licensed. Your MA experience gives you a real head start with clinical skills, terminology, and patient interaction.",
        "",
        "> Tip: Keep your prerequisite syllabi and a running list of each program's specific requirements — they differ more than you'd expect.",
        "",
        "_General educational information, not official advice. Verify requirements with your chosen nursing program and state board of nursing._"
      ].join("\n")
    },
    {
      id: "teas-howto",
      title: "How to Study for the TEAS",
      tag: "TEAS",
      body: [
        "# Studying for the ATI TEAS",
        "The TEAS has **four sections**. Knowing the structure helps you plan.",
        "",
        "## The four sections",
        "1. **Reading** — main idea, details, inference, following directions, interpreting graphics.",
        "2. **Mathematics** — numbers & algebra, measurement, data interpretation. A four-function calculator is provided.",
        "3. **Science** — human anatomy & physiology (the biggest chunk), biology, chemistry, and scientific reasoning.",
        "4. **English & Language Usage** — grammar, punctuation, sentence structure, and vocabulary.",
        "",
        "## A simple study plan",
        "- **Diagnose first.** Take a practice test to find weak areas.",
        "- **Prioritize Science**, especially Anatomy & Physiology — it carries heavy weight and overlaps your MA knowledge.",
        "- **Daily flashcards.** Use the TEAS decks in this app's Study tab; let spaced repetition do the work.",
        "- **Weekly quiz.** Turn on weekly quizzes to check progress without burning out.",
        "- **Practice math without panic.** Brush up fractions, ratios, percentages, and unit conversions.",
        "- **Schedule the exam** in the Calendar and study backward from that date.",
        "",
        "## Test-day checklist",
        "- Photo ID and your registration confirmation",
        "- Arrive early; know whether it's in-person or proctored online",
        "- Read each question fully; eliminate obviously wrong answers",
        "- Pace yourself — every section is timed",
        "- Sleep well the night before (more useful than late cramming)",
        "",
        "_Confirm current TEAS format, fees, and policies on the official ATI website — details change between versions._"
      ].join("\n")
    }
  ];
})();
