/* pharmacology.js — Pharmacology Basics flashcard deck.
   Schema: { id, title, subject, emoji, cards:[{ id, term, def, hint? }] } */
(function () {
  window.MA_DATA = window.MA_DATA || { decks: [], quizzes: [] };
  window.MA_DATA.decks.push({
    id: "pharmacology",
    title: "Pharmacology Basics",
    subject: "Pharmacology",
    emoji: "💊",
    cards: [
      { id: "ph1", term: "The Five Rights of Medication Administration", def: "Right patient, right drug, right dose, right route, and right time — essential checks to prevent medication errors." },
      { id: "ph2", term: "The Seven Rights of Medication Administration", def: "The Five Rights plus right documentation and right to refuse." },
      { id: "ph3", term: "PO (Per Os) route", def: "Oral administration; medication taken by mouth and absorbed through the digestive system." },
      { id: "ph4", term: "IM (Intramuscular) route", def: "Injection into the muscle tissue; absorption is faster than subcutaneous; typically administered at 90-degree angle." },
      { id: "ph5", term: "Subcutaneous (SubQ) route", def: "Injection into the fatty tissue beneath the skin; slower absorption than IM; typically administered at 45-degree angle." },
      { id: "ph6", term: "IV (Intravenous) route", def: "Injection directly into a vein; provides rapid absorption and immediate onset; highest concentration in bloodstream." },
      { id: "ph7", term: "Topical route", def: "Application to the surface of the skin or mucous membranes for local effect (cream, ointment, patch)." },
      { id: "ph8", term: "Sublingual route", def: "Medication placed under the tongue to dissolve and be absorbed directly into the bloodstream; bypasses digestive system." },
      { id: "ph9", term: "Inhalation route", def: "Medication inhaled as vapor, gas, or aerosol into the lungs for local or systemic effect (commonly used for respiratory conditions)." },
      { id: "ph10", term: "Rectal route", def: "Medication administered through the rectum as a suppository or enema for absorption through rectal tissue." },
      { id: "ph11", term: "Analgesics", def: "Medications that relieve pain by reducing pain perception; include non-narcotic and narcotic types." },
      { id: "ph12", term: "Antibiotics", def: "Medications that inhibit or kill bacteria to treat bacterial infections; specific to bacterial organisms." },
      { id: "ph13", term: "Antihistamines", def: "Medications that block histamine effects to relieve allergy symptoms, itching, and allergic reactions." },
      { id: "ph14", term: "Antihypertensives", def: "Medications that lower blood pressure by reducing vascular resistance or decreasing heart contractility." },
      { id: "ph15", term: "Anticoagulants", def: "Medications that prevent blood clot formation and slow clotting processes; used to prevent thrombosis and stroke." },
      { id: "ph16", term: "Bronchodilators", def: "Medications that relax smooth muscle in airways to dilate bronchi and improve airflow in respiratory conditions." },
      { id: "ph17", term: "Diuretics", def: "Medications that increase urine production to remove excess water and electrolytes; used to treat hypertension and edema." },
      { id: "ph18", term: "Antipyretics", def: "Medications that reduce fever by resetting the body's temperature set point; reduce abnormally elevated temperature." },
      { id: "ph19", term: "Antiemetics", def: "Medications that prevent or relieve nausea and vomiting." },
      { id: "ph20", term: "Corticosteroids", def: "Medications that reduce inflammation and suppress immune response; used for inflammatory and autoimmune conditions." },
      { id: "ph21", term: "Generic drug name", def: "The chemical or scientific name of a drug; same regardless of manufacturer; typically lowercase." },
      { id: "ph22", term: "Brand (Trade) name", def: "The proprietary name given by a pharmaceutical company; typically capitalized; same drug may have multiple brand names." },
      { id: "ph23", term: "Controlled substance schedules", def: "DEA classification (Schedules I–V) based on abuse potential and medical use; Schedule I highest abuse risk, V lowest." },
      { id: "ph24", term: "Intradermal injection angle", def: "10–15 degree angle to the skin; shallow injection into the dermis; used for allergy testing and TB skin tests." },
      { id: "ph25", term: "PRN (As Needed)", def: "Medication administered only when the patient requests it or shows signs of needing it; not on a fixed schedule." },
      { id: "ph26", term: "BID (Twice Daily)", def: "Medication administered two times per day." },
      { id: "ph27", term: "TID (Three Times Daily) and QID (Four Times Daily)", def: "TID = three times per day; QID = four times per day." },
      { id: "ph28", term: "STAT and NPO", def: "STAT = immediately, as soon as possible; NPO = nothing by mouth (nil per os) — patient must fast." }
    ]
  });
})();
