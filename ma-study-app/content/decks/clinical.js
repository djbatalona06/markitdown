/* clinical.js — Clinical Skills & Safety flashcard deck.
   Schema: { id, title, subject, emoji, cards:[{ id, term, def, hint? }] } */
(function () {
  window.MA_DATA = window.MA_DATA || { decks: [], quizzes: [] };
  window.MA_DATA.decks.push({
    id: "clinical",
    title: "Clinical Skills & Safety",
    subject: "Clinical",
    emoji: "🩺",
    cards: [
      { id: "cl1", term: "Normal adult body temperature", def: "97–99°F (36.1–37.2°C), with average 98.6°F (37°C).", hint: "Afebrile = without fever" },
      { id: "cl2", term: "Afebrile vs. febrile", def: "Afebrile = normal body temperature (no fever); febrile = elevated body temperature (fever present)." },
      { id: "cl3", term: "Normal adult pulse (heart rate)", def: "60–100 beats per minute (bpm) at rest." },
      { id: "cl4", term: "Tachycardia vs. bradycardia", def: "Tachycardia = heart rate >100 bpm; bradycardia = heart rate <60 bpm." },
      { id: "cl5", term: "Normal adult respiration rate", def: "12–20 breaths per minute." },
      { id: "cl6", term: "Tachypnea vs. bradypnea", def: "Tachypnea = rapid breathing (>20 breaths/min); bradypnea = slow breathing (<12 breaths/min)." },
      { id: "cl7", term: "Normal adult blood pressure", def: "Less than 120/80 mmHg is normal. Per current AHA categories: 120–129 systolic (and <80 diastolic) is 'elevated,' and 130/80 or higher is hypertension." },
      { id: "cl8", term: "Systolic vs. diastolic pressure", def: "Systolic (top) = pressure when heart contracts; diastolic (bottom) = pressure when heart relaxes." },
      { id: "cl9", term: "Hypertension vs. hypotension", def: "Hypertension = persistently high blood pressure (≥130/80 per AHA; some textbooks still use ≥140/90); hypotension = low blood pressure, generally <90/60." },
      { id: "cl10", term: "Normal oxygen saturation (SpO2)", def: "95–100% is normal; <95% indicates hypoxia." },
      { id: "cl11", term: "Definition of phlebotomy", def: "The practice of drawing blood from a patient using a needle and syringe or other collection tube." },
      { id: "cl12", term: "Most common venipuncture site", def: "The median cubital vein in the antecubital fossa (inside of the elbow)." },
      { id: "cl13", term: "Order of draw in phlebotomy", def: "CLSI sequence after any blood-culture tubes: light blue (citrate) → red or gold/SST → green (heparin) → lavender/purple (EDTA) → gray. The correct order prevents additive carryover contamination." },
      { id: "cl14", term: "What additive carryover means", def: "When anticoagulants or additives from one tube contaminate subsequent tubes, invalidating results; prevented by correct order of draw." },
      { id: "cl15", term: "Purpose and maximum time for tourniquet use", def: "A tourniquet restricts blood flow to make veins more visible; should not be applied >1 minute to avoid hemoconcentration." },
      { id: "cl16", term: "Gauge concept in phlebotomy", def: "The needle size; higher gauge number = smaller needle (e.g., 27G is smaller than 18G); 20–22G typical for adults." },
      { id: "cl17", term: "Standard Precautions definition", def: "Infection prevention practices that assume all blood and body fluids may be infectious and require consistent use of barriers (gloves, gown, mask, eye protection)." },
      { id: "cl18", term: "Hand hygiene as #1 infection control measure", def: "Performing hand hygiene with soap and water or alcohol-based sanitizer before and after patient contact is the single most effective way to prevent healthcare-associated infections (CDC)." },
      { id: "cl19", term: "Asepsis vs. sterile technique", def: "Asepsis = absence of pathogenic microorganisms; sterile technique = practices to maintain asepsis and prevent contamination of sterile fields." },
      { id: "cl20", term: "Medical asepsis vs. surgical asepsis", def: "Medical (clean) asepsis = reduces pathogen numbers, used for non-invasive procedures; surgical (sterile) asepsis = eliminates all microorganisms, used for invasive procedures." },
      { id: "cl21", term: "When to use surgical asepsis", def: "During invasive procedures such as urinary catheterization, wound care, injections, and any procedure entering body cavities or sterile tissues." },
      { id: "cl22", term: "Proper sharps disposal", def: "Place all needles and sharp instruments directly into a designated puncture-resistant sharps container labeled with biohazard symbol." },
      { id: "cl23", term: "Biohazard symbol and meaning", def: "The three-pronged orange symbol that labels containers and bags for blood, body fluids, and contaminated items requiring special disposal." },
      { id: "cl24", term: "What an EKG/ECG measures", def: "The electrical activity of the heart over time, recorded as waveforms; used to detect arrhythmias, ischemia, and structural abnormalities." },
      { id: "cl25", term: "P wave, QRS complex, T wave meaning", def: "P = atrial depolarization; QRS = ventricular depolarization; T = ventricular repolarization." },
      { id: "cl26", term: "12-lead EKG and limb leads concept", def: "The 12 leads are arranged to view the heart from different angles: 6 limb leads (I, II, III, aVR, aVL, aVF) and 6 chest leads (V1–V6) for comprehensive assessment." },
      { id: "cl27", term: "HIPAA and PHI definition", def: "HIPAA = Health Insurance Portability and Accountability Act; PHI = Protected Health Information (patient name, medical record number, dates of birth, diagnoses, test results) that requires confidentiality." },
      { id: "cl28", term: "Informed consent", def: "Patient's voluntary agreement to a procedure after being informed of risks, benefits, alternatives, and right to refuse; must be documented." },
      { id: "cl29", term: "Negligence vs. malpractice", def: "Negligence = failure to exercise reasonable care causing harm; malpractice = negligence by a healthcare professional that breaches duty of care and causes injury." },
      { id: "cl30", term: "Scope of practice for Medical Assistants", def: "Defined by state law and employer policy; typically includes vital signs, EKGs, phlebotomy, patient education, and administrative tasks—NOT diagnosis or treatment." }
    ]
  });
})();
