/* quizbank.js — multiple-choice quiz banks. Answer is the INDEX into choices.
   Authored and accuracy-checked directly (not machine-generated). */
(function () {
  window.MA_DATA = window.MA_DATA || { decks: [], quizzes: [] };
  var Q = window.MA_DATA.quizzes;

  Q.push({
    id: "q-anatomy", title: "Anatomy & Physiology", subject: "Anatomy", emoji: "🫀",
    questions: [
      { id: "qa1", q: "How many bones are in the adult human body?", choices: ["186", "206", "256", "300"], answer: 1, explain: "Adults have 206 bones; infants start with ~300 that fuse over time." },
      { id: "qa2", q: "Which heart chamber pumps oxygen-rich blood to the body?", choices: ["Right atrium", "Right ventricle", "Left atrium", "Left ventricle"], answer: 3, explain: "The left ventricle has the thickest wall and pumps blood to the entire body." },
      { id: "qa3", q: "Gas exchange in the lungs occurs in the:", choices: ["Bronchi", "Trachea", "Alveoli", "Pleura"], answer: 2, explain: "Alveoli are tiny air sacs surrounded by capillaries where O₂ and CO₂ are exchanged." },
      { id: "qa4", q: "The largest artery in the body is the:", choices: ["Aorta", "Vena cava", "Pulmonary vein", "Carotid"], answer: 0, explain: "The aorta carries blood from the left ventricle to the body." },
      { id: "qa5", q: "Which directional term means 'toward the midline'?", choices: ["Lateral", "Medial", "Distal", "Superior"], answer: 1, explain: "Medial = toward the midline; lateral = away from it." },
      { id: "qa6", q: "The functional filtering unit of the kidney is the:", choices: ["Alveolus", "Nephron", "Neuron", "Villus"], answer: 1, explain: "Each kidney contains about a million nephrons that filter blood." },
      { id: "qa7", q: "Which blood cells primarily fight infection?", choices: ["Red blood cells", "Platelets", "White blood cells", "Plasma"], answer: 2, explain: "Leukocytes (white blood cells) defend against infection." }
    ]
  });

  Q.push({
    id: "q-terminology", title: "Medical Terminology", subject: "Terminology", emoji: "🔤",
    questions: [
      { id: "qt1", q: "The suffix '-itis' means:", choices: ["Removal", "Inflammation", "Pain", "Enlargement"], answer: 1, explain: "-itis = inflammation, e.g., appendicitis." },
      { id: "qt2", q: "'Tachycardia' refers to:", choices: ["Slow heart rate", "Fast heart rate", "Irregular breathing", "Low blood pressure"], answer: 1, explain: "tachy- = fast, cardi/o = heart." },
      { id: "qt3", q: "The prefix 'hypo-' means:", choices: ["Above/excessive", "Below/deficient", "Around", "Within"], answer: 1, explain: "hypo- = below or deficient (e.g., hypoglycemia)." },
      { id: "qt4", q: "'NPO' means:", choices: ["Nothing by mouth", "As needed", "Twice daily", "Immediately"], answer: 0, explain: "NPO = nil per os = nothing by mouth." },
      { id: "qt5", q: "The root 'nephr/o' refers to the:", choices: ["Liver", "Kidney", "Heart", "Lung"], answer: 1, explain: "nephr/o = kidney (e.g., nephritis)." },
      { id: "qt6", q: "The suffix '-ectomy' means:", choices: ["Incision into", "Surgical removal", "Visual exam", "Enlargement"], answer: 1, explain: "-ectomy = surgical removal (e.g., appendectomy)." },
      { id: "qt7", q: "'BID' on a medication order means:", choices: ["Once a day", "Twice a day", "Three times a day", "As needed"], answer: 1, explain: "BID = twice a day." }
    ]
  });

  Q.push({
    id: "q-pharm", title: "Pharmacology Basics", subject: "Pharmacology", emoji: "💊",
    questions: [
      { id: "qp1", q: "Which is one of the classic 'five rights' of medication administration?", choices: ["Right color", "Right dose", "Right brand", "Right price"], answer: 1, explain: "The five rights: patient, drug, dose, route, time." },
      { id: "qp2", q: "'PO' as a route of administration means:", choices: ["By mouth", "Into a muscle", "Under the skin", "Into a vein"], answer: 0, explain: "PO (per os) = by mouth." },
      { id: "qp3", q: "An intramuscular (IM) injection is typically given at what angle?", choices: ["10–15°", "45°", "90°", "180°"], answer: 2, explain: "IM injections are usually given at a 90° angle." },
      { id: "qp4", q: "A subcutaneous (SubQ) injection is typically given at:", choices: ["90°", "45°", "10°", "0°"], answer: 1, explain: "SubQ injections are commonly given at about 45° (sometimes 90° with shorter needles)." },
      { id: "qp5", q: "Antipyretic medications are used to:", choices: ["Reduce fever", "Stop bleeding", "Increase appetite", "Numb pain only"], answer: 0, explain: "Anti- (against) + pyret/o (fever) = fever reducers." },
      { id: "qp6", q: "The generic name of a drug is:", choices: ["The trademarked marketing name", "The non-proprietary official name", "Always longer than the brand", "The pharmacy's code"], answer: 1, explain: "Generic = the official, non-proprietary name; brand = the manufacturer's trademark." }
    ]
  });

  Q.push({
    id: "q-clinical", title: "Clinical Skills & Safety", subject: "Clinical", emoji: "🩺",
    questions: [
      { id: "qc1", q: "A normal resting adult heart rate is:", choices: ["30–50 bpm", "60–100 bpm", "100–140 bpm", "140–180 bpm"], answer: 1, explain: "60–100 beats per minute is the normal adult resting range." },
      { id: "qc2", q: "Normal adult blood pressure is generally below:", choices: ["90/60", "120/80", "140/90", "160/100"], answer: 1, explain: "Below 120/80 mmHg is considered normal." },
      { id: "qc3", q: "The single most effective way to prevent the spread of infection is:", choices: ["Wearing two gloves", "Hand hygiene", "Antibiotics", "Masks alone"], answer: 1, explain: "Hand hygiene is the #1 measure (CDC)." },
      { id: "qc4", q: "The most common site for venipuncture is the:", choices: ["Femoral vein", "Median cubital vein", "Jugular vein", "Radial artery"], answer: 1, explain: "The median cubital vein in the antecubital fossa is preferred." },
      { id: "qc5", q: "Standard Precautions assume that:", choices: ["Only known-positive patients are infectious", "All blood/body fluids are potentially infectious", "Gloves replace hand washing", "Masks are optional always"], answer: 1, explain: "Treat all blood and body fluids as potentially infectious." },
      { id: "qc6", q: "On an EKG, the QRS complex represents:", choices: ["Atrial depolarization", "Ventricular depolarization", "Ventricular repolarization", "The resting baseline"], answer: 1, explain: "The QRS complex reflects ventricular depolarization (contraction)." },
      { id: "qc7", q: "A tourniquet should be left on for no longer than about:", choices: ["1 minute", "5 minutes", "10 minutes", "15 minutes"], answer: 0, explain: "Keep it under ~1 minute to avoid hemoconcentration." }
    ]
  });

  Q.push({
    id: "q-teas-sci", title: "TEAS: Science", subject: "TEAS", emoji: "🔬",
    questions: [
      { id: "qts1", q: "Which organelle is the 'powerhouse of the cell'?", choices: ["Nucleus", "Ribosome", "Mitochondria", "Golgi apparatus"], answer: 2, explain: "Mitochondria produce ATP, the cell's energy currency." },
      { id: "qts2", q: "DNA base pairing follows: adenine pairs with:", choices: ["Guanine", "Cytosine", "Thymine", "Uracil"], answer: 2, explain: "A pairs with T (and G pairs with C) in DNA." },
      { id: "qts3", q: "A pH of 7 is considered:", choices: ["Acidic", "Neutral", "Basic", "Impossible"], answer: 1, explain: "pH 7 is neutral; below 7 is acidic, above 7 is basic." },
      { id: "qts4", q: "Which system includes the kidneys, ureters, and bladder?", choices: ["Digestive", "Urinary", "Endocrine", "Lymphatic"], answer: 1, explain: "These are organs of the urinary system." },
      { id: "qts5", q: "The control center of the cell that contains DNA is the:", choices: ["Mitochondria", "Cytoplasm", "Nucleus", "Lysosome"], answer: 2, explain: "The nucleus houses the cell's genetic material." }
    ]
  });

  Q.push({
    id: "q-teas-math", title: "TEAS: Math", subject: "TEAS", emoji: "🔢",
    questions: [
      { id: "qtm1", q: "Convert 3/4 to a percentage.", choices: ["34%", "60%", "75%", "80%"], answer: 2, explain: "3 ÷ 4 = 0.75 = 75%." },
      { id: "qtm2", q: "What is 15% of 200?", choices: ["15", "20", "30", "45"], answer: 2, explain: "0.15 × 200 = 30." },
      { id: "qtm3", q: "Following order of operations, 2 + 3 × 4 = ?", choices: ["14", "20", "24", "10"], answer: 0, explain: "Multiply first: 3×4=12, then 2+12=14." },
      { id: "qtm4", q: "How many milligrams are in 1 gram?", choices: ["10", "100", "1000", "10000"], answer: 2, explain: "1 g = 1000 mg." },
      { id: "qtm5", q: "Simplify the ratio 8:12 to lowest terms.", choices: ["4:6", "2:3", "3:2", "1:2"], answer: 1, explain: "Divide both by 4 → 2:3." }
    ]
  });

  Q.push({
    id: "q-teas-eng", title: "TEAS: English & Language", subject: "TEAS", emoji: "✍️",
    questions: [
      { id: "qte1", q: "Choose the correct word: 'They left ___ books at home.'", choices: ["there", "their", "they're", "thier"], answer: 1, explain: "'Their' shows possession." },
      { id: "qte2", q: "Which sentence is punctuated correctly?", choices: ["Its a nice day.", "It's a nice day.", "Its' a nice day.", "Its a nice day's."], answer: 1, explain: "'It's' = it is; 'its' is possessive." },
      { id: "qte3", q: "Identify the verb: 'The nurse charted the vitals.'", choices: ["nurse", "charted", "the", "vitals"], answer: 1, explain: "'Charted' is the action word (verb)." },
      { id: "qte4", q: "'Affect' is most often used as a:", choices: ["Noun", "Verb", "Adjective", "Preposition"], answer: 1, explain: "'Affect' is usually a verb (to influence); 'effect' is usually a noun (a result)." },
      { id: "qte5", q: "Choose the correctly spelled word:", choices: ["recieve", "receive", "receeve", "receve"], answer: 1, explain: "'I before E except after C' → receive." }
    ]
  });
})();
