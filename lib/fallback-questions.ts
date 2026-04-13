import type { Question } from './types';

type Bank = Record<string, Record<string, Question[]>>;

export const FALLBACK_QUESTIONS: Bank = {
  Maths: {
    '11+': [
      {
        text: 'What is 256 ÷ 8?',
        options: ['28', '30', '32', '34'],
        correct: 2,
        explanation: '256 divided by 8 equals 32. You can check: 32 × 8 = 256.'
      },
      {
        text: 'Which number is a prime?',
        options: ['21', '27', '29', '33'],
        correct: 2,
        explanation: '29 is only divisible by 1 and itself, making it prime.'
      },
      {
        text: 'If a rectangle has length 12 cm and width 5 cm, what is its area?',
        options: ['17 cm²', '34 cm²', '60 cm²', '72 cm²'],
        correct: 2,
        explanation: 'Area = length × width = 12 × 5 = 60 cm².'
      },
      {
        text: 'What is 3/4 of 80?',
        options: ['40', '60', '50', '70'],
        correct: 1,
        explanation: '1/4 of 80 is 20, so 3/4 of 80 is 60.'
      },
      {
        text: 'A train leaves at 09:45 and arrives at 11:20. How long is the journey?',
        options: ['1h 25m', '1h 35m', '1h 45m', '2h 05m'],
        correct: 1,
        explanation: 'From 09:45 to 11:20 is 1 hour 35 minutes.'
      }
    ],
    KS2: [
      {
        text: 'What is 7 × 8?',
        options: ['54', '56', '58', '64'],
        correct: 1,
        explanation: '7 × 8 = 56.'
      },
      {
        text: 'Which is larger: 0.6 or 0.59?',
        options: ['0.6', '0.59', 'They are equal', 'Cannot tell'],
        correct: 0,
        explanation: '0.6 = 0.60, which is greater than 0.59.'
      },
      {
        text: 'What is 1/2 + 1/4?',
        options: ['1/6', '2/6', '3/4', '1/3'],
        correct: 2,
        explanation: '1/2 = 2/4, so 2/4 + 1/4 = 3/4.'
      },
      {
        text: 'How many sides does a hexagon have?',
        options: ['5', '6', '7', '8'],
        correct: 1,
        explanation: 'A hexagon has 6 sides.'
      },
      {
        text: 'What is 100 – 47?',
        options: ['43', '53', '57', '63'],
        correct: 1,
        explanation: '100 – 47 = 53.'
      }
    ],
    KS3: [
      {
        text: 'Solve for x: 3x + 5 = 20',
        options: ['3', '5', '7', '15'],
        correct: 1,
        explanation: '3x = 15, so x = 5.'
      },
      {
        text: 'What is the value of 5²  + 3³?',
        options: ['32', '34', '52', '58'],
        correct: 2,
        explanation: '5² = 25 and 3³ = 27. 25 + 27 = 52.'
      },
      {
        text: 'Simplify 4a + 3b − 2a + b',
        options: ['2a + 4b', '6a + 4b', '2a + 2b', '2a + 3b'],
        correct: 0,
        explanation: 'Combine like terms: 4a − 2a = 2a and 3b + b = 4b.'
      },
      {
        text: 'What is 20% of 250?',
        options: ['25', '45', '50', '75'],
        correct: 2,
        explanation: '10% of 250 = 25, so 20% = 50.'
      },
      {
        text: 'If the probability of rain is 0.3, what is the probability of no rain?',
        options: ['0.3', '0.5', '0.6', '0.7'],
        correct: 3,
        explanation: 'Probabilities add to 1: 1 − 0.3 = 0.7.'
      }
    ],
    GCSE: [
      {
        text: 'Solve: 2x² − 8 = 0',
        options: ['x = ±2', 'x = ±4', 'x = 2', 'x = 4'],
        correct: 0,
        explanation: '2x² = 8 → x² = 4 → x = ±2.'
      },
      {
        text: 'What is the gradient of y = 3x − 7?',
        options: ['−7', '3', '7', '−3'],
        correct: 1,
        explanation: 'In y = mx + c form, m is the gradient, so it is 3.'
      },
      {
        text: 'Factorise: x² + 5x + 6',
        options: ['(x+1)(x+6)', '(x+2)(x+3)', '(x−2)(x−3)', '(x+5)(x+1)'],
        correct: 1,
        explanation: 'Two numbers that multiply to 6 and add to 5 are 2 and 3.'
      },
      {
        text: 'A circle has radius 7 cm. What is its area? (Take π = 22/7)',
        options: ['44 cm²', '49 cm²', '154 cm²', '308 cm²'],
        correct: 2,
        explanation: 'Area = πr² = (22/7) × 49 = 154 cm².'
      },
      {
        text: 'What is sin(30°)?',
        options: ['0', '0.5', '√3/2', '1'],
        correct: 1,
        explanation: 'sin(30°) = 1/2 = 0.5, a standard exact value.'
      }
    ],
    'A-Level': [
      {
        text: 'Differentiate: y = x³ − 4x + 2',
        options: ['3x² − 4', '3x² + 4', 'x² − 4', '3x³ − 4'],
        correct: 0,
        explanation: 'Power rule: d/dx(x³) = 3x², d/dx(−4x) = −4, d/dx(2) = 0.'
      },
      {
        text: 'Integrate: ∫ 6x² dx',
        options: ['2x³ + C', '3x³ + C', '6x³ + C', '12x + C'],
        correct: 0,
        explanation: '∫6x² dx = 6 × x³/3 + C = 2x³ + C.'
      },
      {
        text: 'Solve: log₁₀(x) = 2',
        options: ['x = 2', 'x = 10', 'x = 20', 'x = 100'],
        correct: 3,
        explanation: 'log₁₀(100) = 2, so x = 100.'
      },
      {
        text: 'What is the value of e^0?',
        options: ['0', '1', 'e', '∞'],
        correct: 1,
        explanation: 'Any non-zero number raised to the power 0 equals 1.'
      },
      {
        text: 'A vector a = 3i + 4j. What is its magnitude?',
        options: ['5', '7', '12', '25'],
        correct: 0,
        explanation: '|a| = √(3² + 4²) = √25 = 5.'
      }
    ]
  },
  Science: {
    '11+': [
      { text: 'What is the closest planet to the Sun?', options: ['Venus', 'Mercury', 'Earth', 'Mars'], correct: 1, explanation: 'Mercury is the innermost planet of the Solar System.' },
      { text: 'Which part of the plant makes food?', options: ['Roots', 'Stem', 'Leaves', 'Flowers'], correct: 2, explanation: 'Leaves make food through photosynthesis.' },
      { text: 'What is H₂O?', options: ['Oxygen', 'Hydrogen', 'Water', 'Salt'], correct: 2, explanation: 'H₂O is the chemical formula for water.' },
      { text: 'Which force pulls objects down to Earth?', options: ['Friction', 'Gravity', 'Magnetism', 'Tension'], correct: 1, explanation: 'Gravity is the force that attracts objects towards Earth.' },
      { text: 'How many legs does a spider have?', options: ['6', '8', '10', '12'], correct: 1, explanation: 'Spiders are arachnids and have 8 legs.' }
    ],
    KS2: [
      { text: 'Which gas do plants absorb for photosynthesis?', options: ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Hydrogen'], correct: 2, explanation: 'Plants take in CO₂ and release O₂ during photosynthesis.' },
      { text: 'What is the boiling point of water in °C?', options: ['50', '75', '100', '150'], correct: 2, explanation: 'Pure water boils at 100°C at standard atmospheric pressure.' },
      { text: 'Which organ pumps blood around the body?', options: ['Lungs', 'Heart', 'Liver', 'Kidneys'], correct: 1, explanation: 'The heart pumps blood through the circulatory system.' },
      { text: 'What is the state of ice?', options: ['Solid', 'Liquid', 'Gas', 'Plasma'], correct: 0, explanation: 'Ice is frozen water — a solid.' },
      { text: 'Which of these is a carnivore?', options: ['Cow', 'Lion', 'Rabbit', 'Goat'], correct: 1, explanation: 'Lions eat meat, making them carnivores.' }
    ],
    KS3: [
      { text: 'What is the unit of electric current?', options: ['Volt', 'Watt', 'Ampere', 'Ohm'], correct: 2, explanation: 'Electric current is measured in amperes (amps).' },
      { text: 'Which gas makes up most of Earth\'s atmosphere?', options: ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Argon'], correct: 1, explanation: 'Roughly 78% of the atmosphere is nitrogen.' },
      { text: 'What particle has a positive charge?', options: ['Electron', 'Neutron', 'Proton', 'Photon'], correct: 2, explanation: 'Protons are positively charged particles in the nucleus.' },
      { text: 'Which of these is a renewable energy source?', options: ['Coal', 'Oil', 'Wind', 'Natural gas'], correct: 2, explanation: 'Wind energy is renewable — it does not deplete.' },
      { text: 'What process turns liquid into gas?', options: ['Melting', 'Freezing', 'Evaporation', 'Condensation'], correct: 2, explanation: 'Evaporation is the change from liquid to gas.' }
    ],
    GCSE: [
      { text: 'What is the formula for kinetic energy?', options: ['mgh', '½mv²', 'mv', 'F × d'], correct: 1, explanation: 'Kinetic energy = ½ × mass × velocity².' },
      { text: 'Which acid is found in the stomach?', options: ['Sulfuric acid', 'Hydrochloric acid', 'Nitric acid', 'Citric acid'], correct: 1, explanation: 'The stomach produces hydrochloric acid for digestion.' },
      { text: 'What is the pH of a neutral solution?', options: ['0', '5', '7', '14'], correct: 2, explanation: 'A neutral solution (e.g. pure water) has pH 7.' },
      { text: 'Which organelle produces energy in a cell?', options: ['Nucleus', 'Ribosome', 'Mitochondrion', 'Vacuole'], correct: 2, explanation: 'Mitochondria produce ATP through respiration.' },
      { text: 'What is Newton\'s third law?', options: ['F = ma', 'Objects stay at rest', 'Every action has an equal and opposite reaction', 'Energy is conserved'], correct: 2, explanation: 'Newton\'s 3rd law: action = −reaction.' }
    ],
    'A-Level': [
      { text: 'What is Planck\'s constant (h) approximately?', options: ['6.63 × 10⁻³⁴ J·s', '9.11 × 10⁻³¹ kg', '1.6 × 10⁻¹⁹ C', '3 × 10⁸ m/s'], correct: 0, explanation: 'h ≈ 6.63 × 10⁻³⁴ joule-seconds.' },
      { text: 'What does ΔG < 0 indicate?', options: ['Non-spontaneous', 'Spontaneous', 'Equilibrium', 'Endothermic'], correct: 1, explanation: 'A negative Gibbs free energy means the reaction is spontaneous.' },
      { text: 'Which enzyme unwinds DNA during replication?', options: ['Ligase', 'Polymerase', 'Helicase', 'Primase'], correct: 2, explanation: 'Helicase unwinds the DNA double helix.' },
      { text: 'What is the SI unit of magnetic flux density?', options: ['Henry', 'Weber', 'Tesla', 'Gauss'], correct: 2, explanation: 'Magnetic flux density is measured in Tesla.' },
      { text: 'What is the general formula of an alkane?', options: ['CₙH₂ₙ', 'CₙH₂ₙ₊₂', 'CₙH₂ₙ₋₂', 'CₙHₙ'], correct: 1, explanation: 'Alkanes follow the formula CₙH₂ₙ₊₂.' }
    ]
  },
  English: {
    '11+': [
      { text: 'Which word is a noun?', options: ['Quickly', 'Happiness', 'Green', 'Run'], correct: 1, explanation: '"Happiness" names a thing (an emotion), making it a noun.' },
      { text: 'What is the opposite of "ancient"?', options: ['Old', 'Modern', 'Rare', 'Historic'], correct: 1, explanation: '"Modern" is the antonym of "ancient".' },
      { text: 'Choose the correctly spelled word:', options: ['Recieve', 'Receive', 'Receve', 'Receeve'], correct: 1, explanation: 'Remember: "i before e except after c" — Receive.' },
      { text: 'Which sentence is punctuated correctly?', options: ['where are you going', 'Where are you going?', 'Where are you going.', 'where are you going?'], correct: 1, explanation: 'Questions begin with a capital and end with a question mark.' },
      { text: 'What does "reluctant" mean?', options: ['Eager', 'Unwilling', 'Quick', 'Angry'], correct: 1, explanation: 'Reluctant means hesitant or unwilling.' }
    ],
    KS2: [
      { text: 'What is a synonym for "big"?', options: ['Small', 'Large', 'Tiny', 'Short'], correct: 1, explanation: '"Large" means the same as "big".' },
      { text: 'Which is a verb?', options: ['Table', 'Blue', 'Jump', 'Kind'], correct: 2, explanation: '"Jump" is an action, so it is a verb.' },
      { text: 'What is the plural of "child"?', options: ['Childs', 'Childes', 'Children', 'Childrens'], correct: 2, explanation: '"Children" is the irregular plural of "child".' },
      { text: 'Find the adjective: "The happy dog ran fast."', options: ['Dog', 'Happy', 'Ran', 'Fast'], correct: 1, explanation: '"Happy" describes the dog — it is an adjective.' },
      { text: 'What punctuation ends a question?', options: ['.', '!', '?', ','], correct: 2, explanation: 'Questions end with a question mark (?).' }
    ],
    KS3: [
      { text: 'What literary device is "The stars danced in the sky"?', options: ['Simile', 'Metaphor', 'Personification', 'Alliteration'], correct: 2, explanation: 'Stars given human action ("danced") — personification.' },
      { text: 'Identify the simile:', options: ['Time flies', 'She is a star', 'As brave as a lion', 'Life is a journey'], correct: 2, explanation: 'A simile uses "like" or "as" — "as brave as a lion".' },
      { text: 'What is the past tense of "run"?', options: ['Runned', 'Ran', 'Running', 'Runs'], correct: 1, explanation: 'The past tense of "run" is "ran".' },
      { text: 'Which word is a conjunction?', options: ['Because', 'Quickly', 'Happy', 'Table'], correct: 0, explanation: 'Conjunctions (because, and, but) join clauses.' },
      { text: 'What is the main idea of a paragraph called?', options: ['Summary', 'Topic sentence', 'Thesis', 'Hook'], correct: 1, explanation: 'The topic sentence expresses the paragraph\'s main idea.' }
    ],
    GCSE: [
      { text: 'Who wrote "Romeo and Juliet"?', options: ['Charles Dickens', 'William Shakespeare', 'Jane Austen', 'George Orwell'], correct: 1, explanation: 'Shakespeare wrote the tragedy in the 1590s.' },
      { text: 'What is onomatopoeia?', options: ['A comparison', 'A word that imitates sound', 'An exaggeration', 'A type of rhyme'], correct: 1, explanation: 'Words like "buzz" or "bang" imitate real sounds — onomatopoeia.' },
      { text: 'Which is an example of iambic pentameter?', options: ['5 unstressed + 5 stressed', '10 syllables in da-DUM pattern', '6 beats per line', '4 rhyming couplets'], correct: 1, explanation: 'Iambic pentameter = 10 syllables, unstressed/stressed pairs.' },
      { text: 'What is the narrative voice of "I walked home"?', options: ['First person', 'Second person', 'Third person', 'Omniscient'], correct: 0, explanation: '"I" indicates first-person narration.' },
      { text: 'What is the climax of a story?', options: ['The opening', 'The turning point', 'The ending', 'The setting'], correct: 1, explanation: 'The climax is the most intense moment or turning point.' }
    ],
    'A-Level': [
      { text: 'Who wrote "The Waste Land"?', options: ['T.S. Eliot', 'W.B. Yeats', 'Ezra Pound', 'Sylvia Plath'], correct: 0, explanation: 'T.S. Eliot published "The Waste Land" in 1922.' },
      { text: 'What is a Shakespearean sonnet\'s rhyme scheme?', options: ['ABAB CDCD EFEF GG', 'AABB CCDD', 'ABBA ABBA CDE CDE', 'ABCABC'], correct: 0, explanation: 'Three quatrains (ABAB CDCD EFEF) plus a couplet (GG).' },
      { text: 'What literary movement is associated with Virginia Woolf?', options: ['Romanticism', 'Realism', 'Modernism', 'Post-modernism'], correct: 2, explanation: 'Woolf was a leading Modernist writer (stream of consciousness).' },
      { text: 'What does "in medias res" mean?', options: ['At the end', 'In the middle of things', 'Flashback', 'Foreshadowing'], correct: 1, explanation: 'Latin for "in the midst of things" — starting mid-action.' },
      { text: 'Which term describes a character\'s tragic flaw?', options: ['Catharsis', 'Hubris', 'Hamartia', 'Pathos'], correct: 2, explanation: 'Aristotle\'s term "hamartia" refers to a tragic flaw.' }
    ]
  }
};

export function getFallback(subject: string, level: string, count = 5): Question[] {
  const bank = FALLBACK_QUESTIONS[subject]?.[level] || FALLBACK_QUESTIONS.Maths['KS3'];
  // shuffle a copy and return `count`
  const copy = [...bank];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, Math.min(count, copy.length));
}
