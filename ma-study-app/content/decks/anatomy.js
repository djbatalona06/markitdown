/* anatomy.js — Anatomy & Physiology flashcard deck.
   Schema: { id, title, subject, emoji, cards:[{ id, term, def, hint? }] } */
(function () {
  window.MA_DATA = window.MA_DATA || { decks: [], quizzes: [] };
  window.MA_DATA.decks.push({
    id: "anatomy",
    title: "Anatomy & Physiology",
    subject: "Anatomy",
    emoji: "🫀",
    cards: [
      { id: "a1", term: "Cardiovascular system function", def: "Transports blood, oxygen, nutrients, hormones, and waste throughout the body; made of the heart, blood vessels, and blood." },
      { id: "a2", term: "Four chambers of the heart", def: "Right atrium, right ventricle, left atrium, left ventricle.", hint: "2 atria on top, 2 ventricles below" },
      { id: "a3", term: "Path of blood through the heart", def: "Body → right atrium → right ventricle → lungs → left atrium → left ventricle → body." },
      { id: "a4", term: "Tricuspid valve", def: "Valve between the right atrium and right ventricle." },
      { id: "a5", term: "Mitral (bicuspid) valve", def: "Valve between the left atrium and left ventricle." },
      { id: "a6", term: "Arteries vs. veins", def: "Arteries carry blood away from the heart (usually oxygen-rich); veins carry blood back to the heart (usually oxygen-poor)." },
      { id: "a7", term: "Largest artery in the body", def: "The aorta." },
      { id: "a8", term: "Number of bones in the adult body", def: "206 bones." },
      { id: "a9", term: "Axial vs. appendicular skeleton", def: "Axial = skull, vertebral column, rib cage (80 bones). Appendicular = limbs and girdles (126 bones)." },
      { id: "a10", term: "Longest bone in the body", def: "The femur (thigh bone)." },
      { id: "a11", term: "Functions of the skeletal system", def: "Support, protection, movement (with muscles), mineral storage (calcium), and blood cell production in marrow." },
      { id: "a12", term: "Three types of muscle", def: "Skeletal (voluntary), cardiac (heart, involuntary), and smooth (organs, involuntary)." },
      { id: "a13", term: "Function of the respiratory system", def: "Gas exchange — bringing in oxygen and removing carbon dioxide." },
      { id: "a14", term: "Where gas exchange occurs", def: "In the alveoli — tiny air sacs in the lungs surrounded by capillaries." },
      { id: "a15", term: "Diaphragm", def: "The main breathing muscle; contracts (flattens) to pull air into the lungs." },
      { id: "a16", term: "Function of the nervous system", def: "Detects stimuli and coordinates responses; includes the central (brain & spinal cord) and peripheral nervous systems." },
      { id: "a17", term: "Three main parts of the brain", def: "Cerebrum (thought, movement), cerebellum (balance, coordination), and brainstem (vital functions like breathing)." },
      { id: "a18", term: "Function of the urinary system", def: "Filters blood, removes waste as urine, and balances fluids and electrolytes; includes kidneys, ureters, bladder, and urethra." },
      { id: "a19", term: "Nephron", def: "The functional filtering unit of the kidney." },
      { id: "a20", term: "Function of the digestive system", def: "Breaks down food, absorbs nutrients, and eliminates waste." },
      { id: "a21", term: "Function of the endocrine system", def: "Releases hormones from glands to regulate metabolism, growth, and other processes." },
      { id: "a22", term: "Largest organ of the body", def: "The skin (integumentary system)." },
      { id: "a23", term: "Anatomical position", def: "Standing upright, facing forward, arms at sides, palms forward — the reference for all directional terms." },
      { id: "a24", term: "Superior vs. inferior", def: "Superior = toward the head (above); inferior = toward the feet (below)." },
      { id: "a25", term: "Anterior vs. posterior", def: "Anterior (ventral) = front of the body; posterior (dorsal) = back of the body." },
      { id: "a26", term: "Medial vs. lateral", def: "Medial = toward the midline; lateral = away from the midline." },
      { id: "a27", term: "Proximal vs. distal", def: "Proximal = closer to the point of attachment/trunk; distal = farther away." },
      { id: "a28", term: "Red vs. white blood cells", def: "Red cells (erythrocytes) carry oxygen; white cells (leukocytes) fight infection." },
      { id: "a29", term: "Platelets", def: "Cell fragments (thrombocytes) that help blood clot." },
      { id: "a30", term: "Homeostasis", def: "The body's maintenance of a stable internal environment (e.g., temperature, pH, glucose)." }
    ]
  });
})();
