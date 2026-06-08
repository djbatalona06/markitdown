/* med-terminology.js — Medical Terminology flashcard deck.
   Schema: { id, title, subject, emoji, cards:[{ id, term, def, hint? }] } */
(function () {
  window.MA_DATA = window.MA_DATA || { decks: [], quizzes: [] };
  window.MA_DATA.decks.push({
    id: "med-terminology",
    title: "Medical Terminology",
    subject: "Terminology",
    emoji: "🔤",
    cards: [
      { id: "mt1", term: "Tachy-", def: "Prefix meaning fast. Example: tachycardia (rapid heartbeat)." },
      { id: "mt2", term: "Brady-", def: "Prefix meaning slow. Example: bradypnea (slow breathing)." },
      { id: "mt3", term: "Hyper-", def: "Prefix meaning excessive or above normal. Example: hypertension (high blood pressure)." },
      { id: "mt4", term: "Hypo-", def: "Prefix meaning below normal or deficient. Example: hypoglycemia (low blood sugar)." },
      { id: "mt5", term: "Peri-", def: "Prefix meaning around or surrounding. Example: pericardium (membrane around the heart)." },
      { id: "mt6", term: "Intra-", def: "Prefix meaning within or inside. Example: intramuscular injection (within muscle)." },
      { id: "mt7", term: "Sub-", def: "Prefix meaning below or under. Example: subcutaneous (under the skin)." },
      { id: "mt8", term: "A-/An-", def: "Prefix meaning absence or without. Example: anemia (lack of red blood cells)." },
      { id: "mt9", term: "Dys-", def: "Prefix meaning abnormal or difficult. Example: dyspnea (difficulty breathing)." },
      { id: "mt10", term: "Poly-", def: "Prefix meaning many or multiple. Example: polydipsia (excessive thirst)." },
      { id: "mt11", term: "-itis", def: "Suffix meaning inflammation. Example: arthritis (inflammation of joints)." },
      { id: "mt12", term: "-ectomy", def: "Suffix meaning surgical removal. Example: appendectomy (removal of appendix)." },
      { id: "mt13", term: "-otomy", def: "Suffix meaning surgical incision or cut. Example: tracheotomy (incision into trachea)." },
      { id: "mt14", term: "-ostomy", def: "Suffix meaning surgical opening. Example: colostomy (opening from colon to abdominal wall)." },
      { id: "mt15", term: "-ology", def: "Suffix meaning study of. Example: cardiology (study of the heart)." },
      { id: "mt16", term: "-emia", def: "Suffix meaning condition of the blood. Example: bacteremia (bacteria in the blood)." },
      { id: "mt17", term: "-pnea", def: "Suffix meaning breathing. Example: apnea (temporary cessation of breathing)." },
      { id: "mt18", term: "-algia", def: "Suffix meaning pain. Example: myalgia (muscle pain)." },
      { id: "mt19", term: "-megaly", def: "Suffix meaning enlargement. Example: hepatomegaly (enlarged liver)." },
      { id: "mt20", term: "-plasty", def: "Suffix meaning surgical repair or reconstruction. Example: arthroplasty (surgical repair of a joint)." },
      { id: "mt21", term: "-scopy", def: "Suffix meaning visual examination. Example: colonoscopy (visual exam of the colon)." },
      { id: "mt22", term: "-rrhea", def: "Suffix meaning discharge or flow. Example: diarrhea (abnormal discharge from bowels)." },
      { id: "mt23", term: "Cardi/o", def: "Root word meaning heart. Example: cardiologist (heart specialist)." },
      { id: "mt24", term: "Hemat/o", def: "Root word meaning blood. Example: hematology (study of blood)." },
      { id: "mt25", term: "Gastr/o", def: "Root word meaning stomach. Example: gastroenterology (study of stomach and intestines)." },
      { id: "mt26", term: "Derm/a", def: "Root word meaning skin. Example: dermatitis (skin inflammation)." },
      { id: "mt27", term: "Nephr/o", def: "Root word meaning kidney. Example: nephrology (study of kidneys)." },
      { id: "mt28", term: "Neur/o", def: "Root word meaning nerve. Example: neurology (study of nervous system)." },
      { id: "mt29", term: "Oste/o", def: "Root word meaning bone. Example: osteoporosis (decrease in bone density)." },
      { id: "mt30", term: "Pneum/o", def: "Root word meaning lung or air. Example: pneumonia (lung infection)." },
      { id: "mt31", term: "Hepat/o", def: "Root word meaning liver. Example: hepatitis (liver inflammation)." },
      { id: "mt32", term: "NPO, PRN, BID, TID, QID, STAT, PO, IM, SQ/SubQ", def: "Common clinical abbreviations: NPO (nothing by mouth), PRN (as needed), BID (twice daily), TID (three times daily), QID (four times daily), STAT (immediately), PO (by mouth), IM (intramuscular), SQ/SubQ (subcutaneous)." }
    ]
  });
})();
