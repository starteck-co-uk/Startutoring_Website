/**
 * Default UK curriculum topics for each subject × level.
 * Used to pre-populate syllabi when admin first opens the Syllabi tab.
 * Based on the UK National Curriculum and common exam boards (AQA, Edexcel, OCR).
 */

interface DefaultSyllabus {
  subject: string;
  level: string;
  title: string;
  topics: string[];
}

export const DEFAULT_SYLLABI: DefaultSyllabus[] = [
  // ─── MATHS ───
  {
    subject: 'Maths',
    level: '11+',
    title: '11+ Maths Entrance Exam',
    topics: [
      'Number & Place Value',
      'Addition, Subtraction, Multiplication & Division',
      'Fractions, Decimals & Percentages',
      'Ratio & Proportion',
      'Basic Algebra (Missing Numbers, Sequences)',
      'Measurement (Length, Mass, Capacity, Time)',
      'Area, Perimeter & Volume',
      'Geometry — Properties of 2D & 3D Shapes',
      'Angles & Symmetry',
      'Coordinates & Translations',
      'Data Handling — Tables, Charts & Graphs',
      'Mean, Median, Mode & Range',
      'Problem Solving & Reasoning',
      'Money & Real-Life Context Problems',
      'Roman Numerals & Number Patterns'
    ]
  },
  {
    subject: 'Maths',
    level: 'KS2',
    title: 'KS2 Maths (Years 3–6)',
    topics: [
      'Number & Place Value (up to 10,000,000)',
      'Addition & Subtraction (multi-digit)',
      'Multiplication & Division (long multiplication, short/long division)',
      'Fractions (equivalent, comparing, adding, subtracting, multiplying, dividing)',
      'Decimals (place value, rounding, ordering)',
      'Percentages (of amounts, fraction/decimal equivalents)',
      'Ratio & Proportion',
      'Algebra (formulae, linear sequences, unknowns)',
      'Measurement — Length, Mass & Capacity',
      'Measurement — Perimeter, Area & Volume',
      'Measurement — Time (12/24 hour, durations)',
      'Geometry — Properties of 2D & 3D Shapes',
      'Geometry — Angles (measuring, calculating, missing angles)',
      'Geometry — Position & Direction (coordinates, reflection, translation)',
      'Statistics — Tables, Bar Charts, Pie Charts, Line Graphs',
      'Statistics — Mean as an Average'
    ]
  },
  {
    subject: 'Maths',
    level: 'KS3',
    title: 'KS3 Maths (Years 7–9)',
    topics: [
      'Number — Place Value & Ordering (integers, decimals, negatives)',
      'Number — Factors, Multiples, Primes & HCF/LCM',
      'Number — Powers, Roots & Index Notation',
      'Number — Fractions, Decimals & Percentages',
      'Ratio, Proportion & Rates of Change',
      'Algebra — Expressions, Simplifying & Substitution',
      'Algebra — Equations & Inequalities',
      'Algebra — Sequences (arithmetic, geometric, nth term)',
      'Algebra — Graphs (linear, real-life)',
      'Geometry — Angles (parallel lines, polygons)',
      'Geometry — Properties of 2D & 3D Shapes',
      'Geometry — Perimeter, Area & Volume',
      'Geometry — Transformations (reflection, rotation, translation, enlargement)',
      'Geometry — Constructions & Loci',
      'Probability — Single & Combined Events',
      'Statistics — Averages, Range, Charts & Diagrams'
    ]
  },
  {
    subject: 'Maths',
    level: 'GCSE',
    title: 'GCSE Mathematics',
    topics: [
      'Number — Integers, Decimals, Surds & Standard Form',
      'Number — Fractions, Percentages & Ratio',
      'Number — Bounds & Error Intervals',
      'Algebra — Expressions, Formulae & Identities',
      'Algebra — Linear Equations & Inequalities',
      'Algebra — Quadratic Equations (factorising, formula, completing the square)',
      'Algebra — Simultaneous Equations',
      'Algebra — Sequences (nth term, quadratic)',
      'Algebra — Graphs (linear, quadratic, cubic, reciprocal)',
      'Algebra — Functions & Transformations of Graphs',
      'Ratio, Proportion & Rates of Change',
      'Geometry — Angles, Polygons & Parallel Lines',
      'Geometry — Congruence & Similarity',
      'Geometry — Pythagoras\' Theorem & Trigonometry',
      'Geometry — Circle Theorems',
      'Geometry — Perimeter, Area & Volume (inc. cones, spheres)',
      'Geometry — Vectors',
      'Geometry — Transformations',
      'Probability — Single, Combined & Conditional',
      'Statistics — Averages, Cumulative Frequency, Box Plots, Histograms'
    ]
  },
  {
    subject: 'Maths',
    level: 'A-Level',
    title: 'A-Level Mathematics',
    topics: [
      'Pure — Proof',
      'Pure — Algebra & Functions',
      'Pure — Coordinate Geometry (straight lines, circles)',
      'Pure — Sequences & Series (arithmetic, geometric, binomial expansion)',
      'Pure — Trigonometry (identities, equations, radians, sec/cosec/cot)',
      'Pure — Exponentials & Logarithms',
      'Pure — Differentiation (chain, product, quotient rules, implicit, parametric)',
      'Pure — Integration (by substitution, by parts, partial fractions, differential equations)',
      'Pure — Numerical Methods (iteration, Newton-Raphson, trapezium rule)',
      'Pure — Vectors (2D & 3D)',
      'Statistics — Statistical Sampling',
      'Statistics — Data Presentation & Interpretation',
      'Statistics — Probability (Venn diagrams, tree diagrams, conditional)',
      'Statistics — Statistical Distributions (binomial, normal)',
      'Statistics — Hypothesis Testing',
      'Mechanics — Quantities & Units in Mechanics',
      'Mechanics — Kinematics (constant acceleration, variable acceleration)',
      'Mechanics — Forces & Newton\'s Laws',
      'Mechanics — Moments'
    ]
  },

  // ─── SCIENCE ───
  {
    subject: 'Science',
    level: '11+',
    title: '11+ Science',
    topics: [
      'Living Things — Plants, Animals & Classification',
      'The Human Body — Skeleton, Muscles & Organs',
      'Nutrition & Healthy Eating',
      'Habitats & Food Chains',
      'Life Cycles & Reproduction',
      'Materials — Properties, Solids, Liquids & Gases',
      'Changing Materials — Reversible & Irreversible Changes',
      'Forces — Pushes, Pulls, Friction & Gravity',
      'Magnets & Magnetic Materials',
      'Light — Sources, Shadows & Reflection',
      'Sound — Vibrations, Pitch & Volume',
      'Electricity — Simple Circuits & Components',
      'Earth & Space — Sun, Moon, Planets, Day & Night',
      'Rocks & Soils',
      'Evolution & Adaptation'
    ]
  },
  {
    subject: 'Science',
    level: 'KS2',
    title: 'KS2 Science (Years 3–6)',
    topics: [
      'Plants — Parts, Functions, Requirements for Growth',
      'Animals including Humans — Nutrition, Skeleton, Digestion, Teeth, Circulation',
      'Living Things & Their Habitats — Classification, Life Cycles',
      'Evolution & Inheritance — Fossils, Adaptation, Natural Selection',
      'Properties & Changes of Materials — Dissolving, Separating, Reversible/Irreversible',
      'Rocks — Types, Fossils, Soil',
      'States of Matter — Solids, Liquids, Gases, Evaporation, Condensation',
      'Light — Sources, Reflection, Shadows, How We See',
      'Sound — Vibrations, Pitch, Volume, Distance',
      'Electricity — Circuits, Switches, Conductors, Insulators, Voltage',
      'Forces & Magnets — Friction, Gravity, Air Resistance, Levers, Pulleys, Gears',
      'Earth & Space — Solar System, Earth\'s Rotation, Moon Phases'
    ]
  },
  {
    subject: 'Science',
    level: 'KS3',
    title: 'KS3 Science (Years 7–9)',
    topics: [
      'Biology — Cells & Organisation',
      'Biology — Skeletal & Muscular Systems',
      'Biology — Nutrition & Digestion',
      'Biology — Gas Exchange & Breathing',
      'Biology — Reproduction (plant & human)',
      'Biology — Health & Disease',
      'Biology — Photosynthesis & Respiration',
      'Biology — Ecosystems & Interdependence',
      'Chemistry — Atoms, Elements & Compounds',
      'Chemistry — The Periodic Table',
      'Chemistry — Chemical Reactions (acids, metals, combustion)',
      'Chemistry — Separating Mixtures',
      'Chemistry — Acids & Alkalis (pH scale)',
      'Chemistry — Earth\'s Atmosphere & Climate',
      'Physics — Forces (speed, gravity, pressure)',
      'Physics — Energy (stores, transfers, conservation)',
      'Physics — Waves — Sound & Light',
      'Physics — Electricity & Magnetism',
      'Physics — Space — Solar System & Universe'
    ]
  },
  {
    subject: 'Science',
    level: 'GCSE',
    title: 'GCSE Combined Science (AQA Trilogy)',
    topics: [
      'Biology — Cell Biology (structure, division, transport)',
      'Biology — Organisation (enzymes, heart, lungs, blood)',
      'Biology — Infection & Response (pathogens, immune system, drugs)',
      'Biology — Bioenergetics (photosynthesis, respiration)',
      'Biology — Homeostasis & Response (nervous system, hormones)',
      'Biology — Inheritance, Variation & Evolution (DNA, natural selection)',
      'Biology — Ecology (communities, biodiversity, cycles)',
      'Chemistry — Atomic Structure & the Periodic Table',
      'Chemistry — Bonding, Structure & Properties',
      'Chemistry — Quantitative Chemistry (moles, concentrations)',
      'Chemistry — Chemical Changes (reactivity, electrolysis)',
      'Chemistry — Energy Changes (exothermic, endothermic)',
      'Chemistry — Rate & Extent of Chemical Change',
      'Chemistry — Organic Chemistry (hydrocarbons, polymers)',
      'Chemistry — Chemical Analysis (chromatography, tests)',
      'Chemistry — Chemistry of the Atmosphere',
      'Chemistry — Using Resources (life cycle assessments, potable water)',
      'Physics — Energy (stores, efficiency, resources)',
      'Physics — Electricity (circuits, mains, power)',
      'Physics — Particle Model of Matter (density, states, pressure)',
      'Physics — Atomic Structure & Radiation',
      'Physics — Forces (Newton\'s laws, momentum, pressure)',
      'Physics — Waves (properties, EM spectrum, light)',
      'Physics — Magnetism & Electromagnetism',
      'Physics — Space Physics (life cycle of stars, red shift, Big Bang)'
    ]
  },
  {
    subject: 'Science',
    level: 'A-Level',
    title: 'A-Level Sciences (Biology, Chemistry, Physics)',
    topics: [
      'A-Level Biology — Biological Molecules (proteins, carbohydrates, lipids, nucleic acids)',
      'A-Level Biology — Cells (structure, mitosis, meiosis, stem cells)',
      'A-Level Biology — Exchange & Transport (gas exchange, circulation, mass transport)',
      'A-Level Biology — Genetics (DNA, gene expression, inheritance)',
      'A-Level Biology — Energy Transfers (photosynthesis, respiration, ecosystems)',
      'A-Level Biology — Organisms & Environment (populations, evolution, biodiversity)',
      'A-Level Chemistry — Physical Chemistry (atomic structure, bonding, energetics, kinetics, equilibria)',
      'A-Level Chemistry — Inorganic Chemistry (periodicity, groups 2 & 7, transition metals)',
      'A-Level Chemistry — Organic Chemistry (alkanes, halogenoalkanes, alcohols, carbonyls, aromatics, polymers)',
      'A-Level Chemistry — Analytical Techniques (mass spec, IR, NMR)',
      'A-Level Physics — Particles & Radiation (fundamental particles, electromagnetic radiation)',
      'A-Level Physics — Waves & Optics (progressive waves, refraction, diffraction, interference)',
      'A-Level Physics — Mechanics & Materials (forces, motion, energy, materials)',
      'A-Level Physics — Electricity (circuits, EMF, resistivity)',
      'A-Level Physics — Further Mechanics & Thermal Physics (circular motion, SHM, thermal energy)',
      'A-Level Physics — Fields (gravitational, electric, magnetic, capacitors)',
      'A-Level Physics — Nuclear Physics (radioactivity, nuclear energy, nuclear radius)'
    ]
  },

  // ─── ENGLISH ───
  {
    subject: 'English',
    level: '11+',
    title: '11+ English Entrance Exam',
    topics: [
      'Reading Comprehension — Fiction Passages',
      'Reading Comprehension — Non-Fiction Passages',
      'Inference & Deduction',
      'Vocabulary in Context',
      'Creative Writing — Story Writing',
      'Creative Writing — Descriptive Writing',
      'Grammar — Parts of Speech (nouns, verbs, adjectives, adverbs)',
      'Grammar — Sentence Types & Clauses',
      'Grammar — Tenses (past, present, future, perfect)',
      'Punctuation — Full Stops, Commas, Apostrophes, Speech Marks',
      'Spelling — Common Patterns, Homophones, Prefixes & Suffixes',
      'Figurative Language (similes, metaphors, personification)',
      'Synonyms & Antonyms',
      'Cloze Exercises (gap fill)'
    ]
  },
  {
    subject: 'English',
    level: 'KS2',
    title: 'KS2 English (Years 3–6)',
    topics: [
      'Reading — Word Reading & Decoding',
      'Reading — Comprehension (literal & inferential)',
      'Reading — Fiction, Poetry & Non-Fiction Texts',
      'Reading — Authorial Intent & Language Choices',
      'Writing — Planning & Drafting',
      'Writing — Narrative Writing (stories, characters, settings)',
      'Writing — Non-Fiction Writing (reports, letters, instructions, persuasion)',
      'Writing — Editing & Proof-Reading',
      'Grammar — Nouns, Verbs, Adjectives, Adverbs, Prepositions, Conjunctions',
      'Grammar — Sentence Structure (simple, compound, complex)',
      'Grammar — Active & Passive Voice',
      'Grammar — Subjunctive, Modal Verbs, Relative Clauses',
      'Punctuation — Commas, Apostrophes, Inverted Commas, Colons, Semi-Colons, Dashes, Brackets',
      'Spelling — Statutory Word Lists, Prefixes, Suffixes, Homophones',
      'Handwriting — Joined, Legible, Fluent',
      'Spoken Language — Presentations, Discussions, Debates'
    ]
  },
  {
    subject: 'English',
    level: 'KS3',
    title: 'KS3 English (Years 7–9)',
    topics: [
      'Reading — Fiction (novels, short stories, genre conventions)',
      'Reading — Non-Fiction (articles, speeches, letters, travel writing)',
      'Reading — Poetry (form, structure, language, comparison)',
      'Reading — Shakespeare (introduction to plays)',
      'Reading — Inference, Analysis & Evaluation',
      'Writing — Creative Writing (narrative, descriptive)',
      'Writing — Transactional Writing (articles, letters, speeches, reviews)',
      'Writing — Argument & Persuasion',
      'Writing — Structure & Paragraphing',
      'Grammar — Sentence Variety & Accuracy',
      'Grammar — Tenses, Voice & Mood',
      'Vocabulary — Word Classes, Etymology, Ambitious Vocabulary',
      'Spelling, Punctuation & Grammar (SPaG)',
      'Speaking & Listening — Presentations, Group Discussion, Role Play',
      'Literary Techniques (imagery, symbolism, pathetic fallacy, irony)'
    ]
  },
  {
    subject: 'English',
    level: 'GCSE',
    title: 'GCSE English Language & Literature',
    topics: [
      'Language Paper 1 — Explorations in Creative Reading & Writing',
      'Language Paper 1 — Analysing Fiction Extracts',
      'Language Paper 1 — Narrative & Descriptive Writing',
      'Language Paper 2 — Writers\' Viewpoints & Perspectives',
      'Language Paper 2 — Analysing Non-Fiction Texts (19th & 21st century)',
      'Language Paper 2 — Transactional Writing (articles, letters, speeches)',
      'Language — Spoken Language Endorsement (presentation)',
      'Literature — Shakespeare (study of one play in depth)',
      'Literature — 19th Century Novel (e.g. A Christmas Carol, Jekyll & Hyde)',
      'Literature — Modern Texts (e.g. An Inspector Calls, Lord of the Flies)',
      'Literature — Poetry Anthology (Power & Conflict / Love & Relationships)',
      'Literature — Unseen Poetry (analysis & comparison)',
      'Analytical Skills — Language, Structure & Form',
      'Analytical Skills — Writer\'s Methods & Effects',
      'Analytical Skills — Context (social, historical, cultural)',
      'Writing Skills — Accuracy, Tone, Register, Audience & Purpose'
    ]
  },
  {
    subject: 'English',
    level: 'A-Level',
    title: 'A-Level English Literature & Language',
    topics: [
      'Literature — Drama (pre-1900, e.g. Othello, The Duchess of Malfi)',
      'Literature — Prose (post-1900, e.g. The Handmaid\'s Tale, The Great Gatsby)',
      'Literature — Poetry (anthology or named poet collection)',
      'Literature — Unseen Prose & Poetry',
      'Literature — Literary Criticism & Theory',
      'Literature — Comparative Analysis',
      'Literature — Context (genre conventions, literary movements, social/political)',
      'Literature — Coursework / NEA (independent study)',
      'Language — Language & Gender, Power, Technology',
      'Language — Language Change & History of English',
      'Language — Child Language Acquisition',
      'Language — Sociolinguistics (dialect, idiolect, sociolect)',
      'Language — Textual Analysis (spoken & written discourse)',
      'Language — Original Writing & Commentary',
      'Language — Phonetics, Morphology, Syntax, Semantics, Pragmatics'
    ]
  }
];
