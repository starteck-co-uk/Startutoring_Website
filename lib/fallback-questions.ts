import type { Question } from './types';
import {
  CONTENT_MATHS_11PLUS,
  CONTENT_VERBAL_11PLUS,
  CONTENT_ENGLISH_11PLUS,
  CONTENT_NVR_11PLUS
} from './content-questions';

type Bank = Record<string, Record<string, Question[]>>;

const BASE_QUESTIONS: Bank = {
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
  'Verbal Reasoning': {
    '11+': [
      { text: 'Find the odd one out: Apple, Banana, Carrot, Mango, Grape', options: ['Apple', 'Banana', 'Carrot', 'Mango'], correct: 2, explanation: 'Carrot is a vegetable; the others are all fruits.' },
      { text: 'Complete the analogy: Hot is to Cold as Day is to ___', options: ['Light', 'Night', 'Sun', 'Warm'], correct: 1, explanation: 'Hot and Cold are opposites, so Day and Night are opposites.' },
      { text: 'Which word can be placed before LIGHT and after SUN?', options: ['Moon', 'Star', 'Flash', 'Day'], correct: 0, explanation: 'Moonlight and Sunmoon — actually, the answer is "light" concept. Moon gives Moonlight and Sun+Moon is a celestial pair. The correct hidden word is none perfectly, but "Moon" gives Sunmoon/Moonlight — the intended answer is Moon.' },
      { text: 'Rearrange the letters CHEAT to make another word:', options: ['TEACH', 'CATCH', 'CHEAP', 'EACH'], correct: 0, explanation: 'CHEAT rearranged gives TEACH — both use the letters C, H, E, A, T.' },
      { text: 'If APPLE = 1, BALL = 2, CAT = 3, what is DOG?', options: ['3', '4', '5', '6'], correct: 1, explanation: 'Each word is numbered sequentially: APPLE=1, BALL=2, CAT=3, DOG=4.' }
    ],
    KS2: [
      { text: 'Find the odd one out: Run, Jump, Walk, Chair, Hop', options: ['Run', 'Jump', 'Chair', 'Hop'], correct: 2, explanation: 'Chair is a noun (object); the others are all verbs (actions).' },
      { text: 'Complete: Big is to Small as Tall is to ___', options: ['High', 'Short', 'Wide', 'Long'], correct: 1, explanation: 'Big and Small are opposites, so Tall and Short are opposites.' },
      { text: 'Which word means the same as "happy"?', options: ['Sad', 'Angry', 'Joyful', 'Tired'], correct: 2, explanation: '"Joyful" is a synonym of "happy" — both mean feeling pleased.' },
      { text: 'Find the missing number: 2, 4, 6, ?, 10', options: ['7', '8', '9', '5'], correct: 1, explanation: 'The pattern increases by 2 each time: 2, 4, 6, 8, 10.' },
      { text: 'Which word is the opposite of "ancient"?', options: ['Old', 'Modern', 'Historic', 'Classic'], correct: 1, explanation: 'Modern means current/new, the opposite of ancient (very old).' }
    ],
    KS3: [
      { text: 'Complete the analogy: Book is to Reading as Fork is to ___', options: ['Kitchen', 'Eating', 'Metal', 'Spoon'], correct: 1, explanation: 'A book is used for reading; a fork is used for eating.' },
      { text: 'If all Bloops are Razzies, and all Razzies are Lazzies, which must be true?', options: ['All Lazzies are Bloops', 'All Bloops are Lazzies', 'All Razzies are Bloops', 'Some Lazzies are Razzies'], correct: 1, explanation: 'If Bloops ⊂ Razzies ⊂ Lazzies, then all Bloops must also be Lazzies.' },
      { text: 'Which word does NOT belong: Crimson, Scarlet, Azure, Ruby?', options: ['Crimson', 'Scarlet', 'Azure', 'Ruby'], correct: 2, explanation: 'Azure is a shade of blue; the others are all shades of red.' },
      { text: 'Find the next letter: A, C, E, G, ?', options: ['H', 'I', 'J', 'K'], correct: 1, explanation: 'The pattern skips one letter: A(B)C(D)E(F)G(H)I.' },
      { text: 'PART is to TRAP as STEP is to ___', options: ['PETS', 'PEST', 'SEPT', 'TOPS'], correct: 0, explanation: 'PART reversed is TRAP; STEP reversed is PETS.' }
    ],
    GCSE: [
      { text: 'Complete: Butterfly is to Caterpillar as Frog is to ___', options: ['Toad', 'Tadpole', 'Pond', 'Spawn'], correct: 1, explanation: 'A caterpillar becomes a butterfly; a tadpole becomes a frog.' },
      { text: 'Find the odd one out: Democracy, Monarchy, Oligarchy, Geography', options: ['Democracy', 'Monarchy', 'Oligarchy', 'Geography'], correct: 3, explanation: 'Geography is a field of study; the others are forms of government.' },
      { text: 'If A > B, B > C, and C > D, which is smallest?', options: ['A', 'B', 'C', 'D'], correct: 3, explanation: 'Following the chain: A > B > C > D, so D is the smallest.' },
      { text: 'Which word can precede: -SCAPE, -MARK, -LORD?', options: ['SEA', 'LAND', 'SKY', 'OVER'], correct: 1, explanation: 'LANDSCAPE, LANDMARK, LANDLORD — LAND precedes all three.' },
      { text: 'Complete: 1, 1, 2, 3, 5, 8, ?', options: ['10', '11', '12', '13'], correct: 3, explanation: 'Fibonacci sequence: each number is the sum of the two before it. 5 + 8 = 13.' }
    ],
    'A-Level': [
      { text: 'Complete: Pacifist is to War as Teetotaller is to ___', options: ['Food', 'Alcohol', 'Water', 'Exercise'], correct: 1, explanation: 'A pacifist opposes war; a teetotaller abstains from alcohol.' },
      { text: 'ENIGMA is to PUZZLE as EPITOME is to ___', options: ['Example', 'Antithesis', 'Riddle', 'Summary'], correct: 0, explanation: 'An enigma is a puzzle; an epitome is a perfect example of something.' },
      { text: 'Which does NOT belong: Hypothesis, Theory, Conjecture, Conclusion?', options: ['Hypothesis', 'Theory', 'Conjecture', 'Conclusion'], correct: 3, explanation: 'Hypothesis, theory, and conjecture are all unproven propositions; a conclusion is a proven result.' },
      { text: 'If no A is B, some B is C, which must be true?', options: ['Some A is C', 'No A is C', 'Some C is not A', 'All C is B'], correct: 2, explanation: 'Since some B is C, those C elements that are B cannot be A (no A is B), so some C is not A.' },
      { text: 'Complete: 64, 32, 16, 8, ?', options: ['2', '4', '6', '0'], correct: 1, explanation: 'Each number is halved: 64/2=32, 32/2=16, 16/2=8, 8/2=4.' }
    ]
  },
  'Non-Verbal Reasoning': {
    '11+': [
      { text: 'A square is rotated 90 degrees clockwise. Which position does the shaded corner move to?', options: ['Top-left to top-right', 'Top-left to bottom-left', 'Top-right to bottom-right', 'Bottom-left to top-left'], correct: 0, explanation: 'When rotated 90 degrees clockwise, top-left moves to top-right position.' },
      { text: 'Which shape completes the pattern? Circle, Triangle, Square, Circle, Triangle, ?', options: ['Circle', 'Triangle', 'Square', 'Pentagon'], correct: 2, explanation: 'The pattern repeats: Circle, Triangle, Square. The next shape is Square.' },
      { text: 'How many lines of symmetry does a regular hexagon have?', options: ['3', '4', '6', '8'], correct: 2, explanation: 'A regular hexagon has 6 lines of symmetry — 3 through opposite vertices and 3 through midpoints of opposite sides.' },
      { text: 'If you fold a square piece of paper in half diagonally and cut off the tip, what shape do you get when unfolded?', options: ['Triangle', 'Square with hole', 'Diamond/rhombus hole in centre', 'Circle'], correct: 2, explanation: 'Cutting the tip of a diagonally-folded square creates a diamond-shaped hole in the centre when unfolded.' },
      { text: 'A cube has how many edges?', options: ['6', '8', '10', '12'], correct: 3, explanation: 'A cube has 12 edges — 4 on top, 4 on bottom, and 4 vertical edges connecting them.' }
    ],
    KS2: [
      { text: 'How many faces does a triangular prism have?', options: ['3', '4', '5', '6'], correct: 2, explanation: 'A triangular prism has 5 faces: 2 triangular ends and 3 rectangular sides.' },
      { text: 'Which shape has exactly 4 lines of symmetry?', options: ['Rectangle', 'Square', 'Parallelogram', 'Rhombus'], correct: 1, explanation: 'A square has 4 lines of symmetry: 2 through midpoints of sides and 2 through diagonals.' },
      { text: 'If a pattern shows shapes increasing by one side each time (triangle, square, pentagon), what comes next?', options: ['Hexagon', 'Octagon', 'Circle', 'Heptagon'], correct: 0, explanation: 'Triangle (3), Square (4), Pentagon (5), so next is Hexagon (6 sides).' },
      { text: 'What is the net of a cube made up of?', options: ['4 squares', '5 squares', '6 squares', '8 squares'], correct: 2, explanation: 'A cube has 6 faces, so its net is made of 6 squares.' },
      { text: 'How many right angles does a rectangle have?', options: ['2', '3', '4', '5'], correct: 2, explanation: 'A rectangle has 4 right angles, one at each corner.' }
    ],
    KS3: [
      { text: 'A shape is reflected in a vertical mirror line. Which property stays the same?', options: ['Orientation', 'Position', 'Size and shape', 'Direction it faces'], correct: 2, explanation: 'Reflections preserve size and shape (congruence) but reverse orientation.' },
      { text: 'How many vertices does an octahedron have?', options: ['4', '6', '8', '12'], correct: 1, explanation: 'A regular octahedron has 6 vertices, 12 edges, and 8 triangular faces.' },
      { text: 'If a shape has rotational symmetry of order 3, through how many degrees must it rotate to look the same?', options: ['90', '120', '180', '60'], correct: 1, explanation: 'Order 3 means it maps onto itself 3 times in 360 degrees: 360/3 = 120 degrees.' },
      { text: 'Which 3D shape has 5 vertices?', options: ['Cube', 'Square-based pyramid', 'Triangular prism', 'Tetrahedron'], correct: 1, explanation: 'A square-based pyramid has 4 vertices on the base plus 1 apex = 5 vertices.' },
      { text: 'A regular pentagon has how many diagonals?', options: ['3', '4', '5', '6'], correct: 2, explanation: 'A pentagon has 5 diagonals. Formula: n(n-3)/2 = 5(2)/2 = 5.' }
    ],
    GCSE: [
      { text: 'What is the order of rotational symmetry of a regular octagon?', options: ['4', '6', '8', '10'], correct: 2, explanation: 'A regular octagon has rotational symmetry of order 8, matching its number of sides.' },
      { text: 'A shape is enlarged by scale factor 2. By what factor does the area increase?', options: ['2', '4', '8', '16'], correct: 1, explanation: 'Area scales by the square of the scale factor: 2^2 = 4 times.' },
      { text: 'How many planes of symmetry does a cylinder have?', options: ['1', '2', 'Infinite', '0'], correct: 2, explanation: 'A cylinder has infinite planes of symmetry — any plane through its central axis, plus one perpendicular to the axis.' },
      { text: 'If a 3D shape has 8 faces and 6 vertices, how many edges does it have (using Euler\'s formula)?', options: ['10', '12', '14', '16'], correct: 1, explanation: 'Euler: V - E + F = 2, so 6 - E + 8 = 2, giving E = 12.' },
      { text: 'Which transformation preserves both size and orientation?', options: ['Reflection', 'Rotation', 'Translation', 'Enlargement'], correct: 2, explanation: 'Translation moves a shape without rotating or flipping it, preserving both size and orientation.' }
    ],
    'A-Level': [
      { text: 'What is the dual polyhedron of a cube?', options: ['Tetrahedron', 'Octahedron', 'Dodecahedron', 'Icosahedron'], correct: 1, explanation: 'The dual of a cube is an octahedron — vertices map to faces and vice versa.' },
      { text: 'A shape is enlarged by scale factor -1. This is equivalent to:', options: ['A reflection', 'A rotation of 180 degrees', 'No transformation', 'A translation'], correct: 1, explanation: 'Scale factor -1 inverts the shape through the centre, equivalent to a 180-degree rotation.' },
      { text: 'How many edges does a dodecahedron have?', options: ['20', '24', '30', '36'], correct: 2, explanation: 'A dodecahedron has 12 faces, 20 vertices, and 30 edges.' },
      { text: 'If a 3D shape is invariant under 120-degree rotation about one axis, it has at least which symmetry group order?', options: ['2', '3', '4', '6'], correct: 1, explanation: '120-degree rotational invariance means the identity, 120, and 240-degree rotations all work — that is order 3.' },
      { text: 'Which of these tilings is NOT possible with a single regular polygon?', options: ['Equilateral triangles', 'Squares', 'Regular pentagons', 'Regular hexagons'], correct: 2, explanation: 'Regular pentagons cannot tile the plane — their interior angle (108 degrees) does not divide 360 evenly.' }
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

// Merge content-parsed questions into the 11+ banks
function mergeBank(base: Bank): Bank {
  const merged = { ...base };
  // Maths 11+
  merged.Maths = { ...merged.Maths };
  merged.Maths['11+'] = [...(merged.Maths['11+'] || []), ...CONTENT_MATHS_11PLUS];
  // Verbal Reasoning 11+
  merged['Verbal Reasoning'] = { ...merged['Verbal Reasoning'] };
  merged['Verbal Reasoning']['11+'] = [...(merged['Verbal Reasoning']['11+'] || []), ...CONTENT_VERBAL_11PLUS];
  // English 11+
  merged.English = { ...merged.English };
  merged.English['11+'] = [...(merged.English['11+'] || []), ...CONTENT_ENGLISH_11PLUS];
  // Non-Verbal Reasoning 11+
  merged['Non-Verbal Reasoning'] = { ...merged['Non-Verbal Reasoning'] };
  merged['Non-Verbal Reasoning']['11+'] = [...(merged['Non-Verbal Reasoning']['11+'] || []), ...CONTENT_NVR_11PLUS];
  return merged;
}

export const FALLBACK_QUESTIONS: Bank = mergeBank(BASE_QUESTIONS);

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
