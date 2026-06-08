/* library.js (content) — baked, offline reference docs shown in the Library tab.
   These are concise, hand-verified quick references. The build-time pipeline in
   /tools can add more docs (pulled from open sources, converted with markitdown). */
(function () {
  var D = (window.MA_DATA = window.MA_DATA || {});
  D.refs = [
    {
      id: "vitals", title: "Vital Signs Quick Reference", tag: "Clinical",
      body: [
        "# Vital Signs — Normal Adult Ranges",
        "Always consider the patient's baseline, age, and context. These are general adult resting values.",
        "",
        "| Vital sign | Normal adult range |",
        "| --- | --- |",
        "| Temperature | ~97–99°F (avg 98.6°F / 37°C) |",
        "| Pulse (heart rate) | 60–100 beats/min |",
        "| Respiration | 12–20 breaths/min |",
        "| Blood pressure | < 120/80 mmHg |",
        "| Pulse oximetry (SpO₂) | 95–100% |",
        "",
        "## Key terms",
        "- **Systolic / diastolic** — pressure during the heart's contraction / relaxation.",
        "- **Tachycardia / bradycardia** — fast / slow heart rate.",
        "- **Tachypnea / bradypnea** — fast / slow breathing.",
        "- **Hypertension / hypotension** — high / low blood pressure.",
        "- **Febrile / afebrile** — with / without fever.",
        "",
        "_Educational reference only. Follow your facility's protocols and provider orders._"
      ].join("\n")
    },
    {
      id: "abbrev", title: "Common Medical Abbreviations", tag: "Terminology",
      body: [
        "# Common Clinical Abbreviations",
        "- **NPO** — nothing by mouth (nil per os)",
        "- **PRN** — as needed",
        "- **BID / TID / QID** — twice / three times / four times a day",
        "- **STAT** — immediately",
        "- **PO** — by mouth; **IM** — intramuscular; **SubQ/SQ** — subcutaneous; **IV** — intravenous",
        "- **BP** — blood pressure; **HR** — heart rate; **RR** — respiratory rate; **T** — temperature",
        "- **SOB** — shortness of breath; **Hx** — history; **Dx** — diagnosis; **Rx** — prescription; **Tx** — treatment",
        "- **WNL** — within normal limits; **c/o** — complains of; **y/o** — years old",
        "",
        "> Many facilities discourage certain error-prone abbreviations — always follow your workplace's approved list.",
      ].join("\n")
    },
    {
      id: "order-of-draw", title: "Phlebotomy: Order of Draw", tag: "Clinical",
      body: [
        "# Phlebotomy — Order of Draw",
        "The order of draw reduces additive carryover between tubes (CLSI standard). A common sequence:",
        "",
        "1. **Blood culture** (sterile) — yellow/SPS",
        "2. **Light blue** — sodium citrate (coagulation)",
        "3. **Red / gold (SST)** — serum (clot activator ± gel)",
        "4. **Green** — heparin (plasma)",
        "5. **Lavender** — EDTA (whole blood / CBC)",
        "6. **Gray** — sodium fluoride (glucose)",
        "",
        "## Reminders",
        "- Most common venipuncture site: **median cubital vein** in the antecubital fossa.",
        "- Tourniquet on for **no more than ~1 minute** to avoid hemoconcentration.",
        "- Label tubes at the bedside; follow standard precautions and proper sharps disposal.",
        "",
        "_Verify against your lab's current procedure — additives and tube colors can vary by manufacturer._"
      ].join("\n")
    },
    {
      id: "precautions", title: "Infection Control: Standard Precautions", tag: "Safety",
      body: [
        "# Standard Precautions",
        "Treat **all** blood and body fluids as potentially infectious (CDC).",
        "",
        "## Core practices",
        "- **Hand hygiene** — the single most effective prevention measure. Before and after every patient contact.",
        "- **PPE** — gloves, gown, mask, and eye protection based on anticipated exposure.",
        "- **Respiratory hygiene / cough etiquette.**",
        "- **Safe injection practices** and proper **sharps disposal** in biohazard containers.",
        "- **Clean and disinfect** surfaces and equipment.",
        "",
        "## Asepsis",
        "- **Medical asepsis (clean technique)** — reduces the number of microorganisms.",
        "- **Surgical asepsis (sterile technique)** — eliminates all microorganisms.",
        "",
        "_Always follow CDC guidance and your facility's infection-control policy._"
      ].join("\n")
    }
  ];
})();
