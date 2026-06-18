/* teas.js — ATI TEAS nursing entrance exam flashcard decks.
   Schema: { id, title, subject, emoji, cards:[{ id, term, def, hint? }] } */
(function () {
  window.MA_DATA = window.MA_DATA || { decks: [], quizzes: [] };

  window.MA_DATA.decks.push({
    id: "teas-science",
    title: "TEAS: Science",
    subject: "TEAS",
    emoji: "🔬",
    cards: [
      { id: "ts1", term: "Cell membrane function", def: "Selectively permeable barrier that controls what enters and exits the cell; made of phospholipids and proteins." },
      { id: "ts2", term: "Nucleus", def: "Membrane-bound organelle that contains DNA and controls cell activities." },
      { id: "ts3", term: "Mitochondria", def: "Powerhouse of the cell; produces ATP (energy) through cellular respiration." },
      { id: "ts4", term: "Ribosome", def: "Site of protein synthesis; can be free-floating or attached to the endoplasmic reticulum." },
      { id: "ts5", term: "Endoplasmic reticulum", def: "Network of membranes; rough ER has ribosomes (protein synthesis), smooth ER produces lipids." },
      { id: "ts6", term: "Golgi apparatus", def: "Packages and modifies proteins and lipids for transport throughout the cell." },
      { id: "ts7", term: "Lysosome", def: "Contains digestive enzymes that break down cellular waste; found mainly in animal cells." },
      { id: "ts8", term: "Mitosis", def: "Process of cell division producing two identical daughter cells; includes prophase, metaphase, anaphase, telophase." },
      { id: "ts9", term: "Meiosis", def: "Process of cell division producing four genetically different haploid cells (sex cells); occurs in two divisions (Meiosis I & II)." },
      { id: "ts10", term: "DNA structure", def: "Double helix made of deoxyribose sugar, phosphate, and four nitrogenous bases (A, T, G, C)." },
      { id: "ts11", term: "DNA base pairing", def: "Adenine pairs with thymine (A-T); guanine pairs with cytosine (G-C)." },
      { id: "ts12", term: "RNA vs. DNA", def: "RNA has ribose sugar (not deoxyribose), uracil instead of thymine, and is usually single-stranded." },
      { id: "ts13", term: "Atom", def: "Smallest unit of an element; made of protons, neutrons, and electrons." },
      { id: "ts14", term: "Atomic number vs. mass number", def: "Atomic number = number of protons; mass number = protons + neutrons." },
      { id: "ts15", term: "pH scale", def: "0-14 scale measuring acidity/basicity; 7 is neutral, <7 is acidic, >7 is basic." },
      { id: "ts16", term: "Acid vs. base", def: "Acid: donates H+ ions, tastes sour; base: accepts H+ ions (or donates OH-), feels slippery." },
      { id: "ts17", term: "States of matter", def: "Solid (fixed shape & volume), liquid (fixed volume, takes shape of container), gas (no fixed shape or volume)." },
      { id: "ts18", term: "Enzyme", def: "Protein catalyst that speeds up chemical reactions in cells without being consumed." },
      { id: "ts19", term: "Homeostasis", def: "Body's ability to maintain stable internal conditions (temperature, pH, glucose) despite external changes." },
      { id: "ts20", term: "Photosynthesis", def: "Process in plants: light energy + CO2 + H2O → glucose + O2; occurs in chloroplasts." }
    ]
  });

  window.MA_DATA.decks.push({
    id: "teas-math",
    title: "TEAS: Math",
    subject: "TEAS",
    emoji: "🔢",
    cards: [
      { id: "tm1", term: "Fraction", def: "Ratio of two integers (numerator/denominator); e.g., 3/4 = 0.75." },
      { id: "tm2", term: "Converting fractions to decimals", def: "Divide numerator by denominator; 1/4 = 0.25." },
      { id: "tm3", term: "Converting decimals to percentages", def: "Multiply by 100; 0.25 = 25%." },
      { id: "tm4", term: "Percentage", def: "Part per 100; e.g., 25% of 200 = 0.25 × 200 = 50." },
      { id: "tm5", term: "Ratio", def: "Comparison of two quantities; e.g., 2:3 means for every 2 of one thing, there are 3 of another." },
      { id: "tm6", term: "Proportion", def: "Equation stating two ratios are equal; 2/3 = 4/6; solve using cross-multiplication." },
      { id: "tm7", term: "Cross-multiplication", def: "For a/b = c/d, multiply: a × d = b × c; used to solve proportions." },
      { id: "tm8", term: "PEMDAS (Order of Operations)", def: "Parentheses, Exponents, Multiplication/Division (left-to-right), Addition/Subtraction (left-to-right)." },
      { id: "tm9", term: "Unit conversion", def: "Converting between measurement units; e.g., 1 kg = 1000 g; multiply by conversion factor." },
      { id: "tm10", term: "Metric prefixes", def: "kilo (1000), centi (0.01), milli (0.001), micro (0.000001)." },
      { id: "tm11", term: "Mean (average)", def: "Sum of all values divided by number of values; e.g., (2+4+6)/3 = 4." },
      { id: "tm12", term: "Median", def: "Middle value when data is ordered; for 2, 4, 6, the median is 4." },
      { id: "tm13", term: "Mode", def: "Most frequently occurring value in a dataset." },
      { id: "tm14", term: "Bar graph interpretation", def: "Horizontal or vertical bars represent quantities; read height/length to find values." },
      { id: "tm15", term: "Line graph interpretation", def: "Points connected by lines show trends over time; steeper slope = faster change." },
      { id: "tm16", term: "Distance = rate × time", def: "Formula for calculating distance traveled; e.g., 60 mph × 2 hours = 120 miles." }
    ]
  });

  window.MA_DATA.decks.push({
    id: "teas-english",
    title: "TEAS: English & Language",
    subject: "TEAS",
    emoji: "✍️",
    cards: [
      { id: "te1", term: "Noun", def: "Person, place, thing, or idea; e.g., nurse, hospital, stethoscope, courage." },
      { id: "te2", term: "Verb", def: "Action word or state of being; e.g., run, is, think." },
      { id: "te3", term: "Adjective", def: "Word that describes a noun; e.g., blue, tall, patient." },
      { id: "te4", term: "Adverb", def: "Word that modifies a verb, adjective, or another adverb; usually ends in -ly; e.g., quickly, very, carefully." },
      { id: "te5", term: "Subject-verb agreement", def: "Verb must match subject in number; singular subject takes singular verb (The nurse is here); plural subject takes plural verb (Nurses are here)." },
      { id: "te6", term: "Comma", def: "Separates items in a list, joins independent clauses with conjunctions, or sets off introductory phrases; e.g., I like apples, oranges, and bananas." },
      { id: "te7", term: "Semicolon", def: "Joins two independent clauses; e.g., She studied hard; she passed the exam." },
      { id: "te8", term: "Apostrophe", def: "Shows possession (John's book) or omission in contractions (don't = do not)." },
      { id: "te9", term: "Their vs. there vs. they're", def: "Their = possessive; there = location/introductory word; they're = they are." },
      { id: "te10", term: "Your vs. you're", def: "Your = possessive; you're = you are." },
      { id: "te11", term: "Affect vs. effect", def: "Affect = to influence (verb); effect = result (noun); e.g., Stress affects sleep; the effect was fatigue." },
      { id: "te12", term: "To vs. too vs. two", def: "To = direction/infinitive; too = also/excessive; two = the number 2." },
      { id: "te13", term: "Prefix", def: "Word part added to the beginning of a root word that changes meaning; e.g., un- (unhappy), re- (redo), pre- (preview)." },
      { id: "te14", term: "Suffix", def: "Word part added to the end of a root word; e.g., -tion (nation), -ing (running), -ous (dangerous)." },
      { id: "te15", term: "Sentence structure", def: "Simple (one independent clause), compound (two independent clauses), complex (one independent + one dependent clause)." },
      { id: "te16", term: "Run-on sentence", def: "Two independent clauses joined incorrectly without punctuation or conjunction; fix by adding period, semicolon, or conjunction." }
    ]
  });

  window.MA_DATA.decks.push({
    id: "teas-reading",
    title: "TEAS: Reading",
    subject: "TEAS",
    emoji: "📖",
    cards: [
      { id: "tr1", term: "Main idea", def: "Central theme or primary message of a passage; what the author is mostly discussing." },
      { id: "tr2", term: "Supporting details", def: "Specific facts, examples, or evidence that back up the main idea." },
      { id: "tr3", term: "Topic vs. theme", def: "Topic = subject (what is discussed); theme = message or lesson (what the author wants you to understand)." },
      { id: "tr4", term: "Fact", def: "Statement that can be verified as true or false; e.g., 'The heart pumps blood.'." },
      { id: "tr5", term: "Opinion", def: "Belief or judgment not provable as fact; e.g., 'Nursing is the best profession.'." },
      { id: "tr6", term: "Inference", def: "Logical conclusion based on evidence in the text and prior knowledge; reading between the lines." },
      { id: "tr7", term: "Author's purpose", def: "Reason for writing: to inform, persuade, entertain, or explain." },
      { id: "tr8", term: "Text structure — chronological", def: "Events presented in order of time; e.g., history, procedures, steps." },
      { id: "tr9", term: "Text structure — cause and effect", def: "Shows how one event causes another; e.g., 'Because it rained, the game was cancelled.'." },
      { id: "tr10", term: "Text structure — compare and contrast", def: "Shows similarities and differences between two things." },
      { id: "tr11", term: "Interpreting legends and graphics", def: "Read labels, axes, titles, and keys to extract data from graphs, charts, diagrams, and maps." },
      { id: "tr12", term: "Following multi-step directions", def: "Understand sequential instructions; identify each step and the correct order of execution." },
      { id: "tr13", term: "Summarizing", def: "Condensing main ideas and key details into a brief statement; exclude minor details." },
      { id: "tr14", term: "Context clues", def: "Words and phrases around an unknown word that suggest its meaning; use to infer definition." }
    ]
  });
})();
