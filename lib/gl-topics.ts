// GL Assessment 11+ test structure
// Each test has 4 sections (subjects), each with its own question count and time limit.
// Topics within each section define the mix of question types generated.

export interface GLTopic {
  id: string;
  name: string;
  description: string;
}

export interface GLSection {
  name: string;
  question_count: number; // questions per section
  time_minutes: number;   // minutes allowed for this section
  topics: GLTopic[];      // topics mixed within this section
}

// The definitive test format per the client spec (WhatsApp image)
export const GL_SECTIONS: GLSection[] = [
  {
    name: 'Maths',
    question_count: 50,
    time_minutes: 50,
    topics: [
      { id: 'arithmetic', name: 'Arithmetic', description: 'Addition, subtraction, multiplication, division, BODMAS, place value' },
      { id: 'fractions-decimals-percentages', name: 'Fractions, Decimals & Percentages', description: 'Equivalent fractions, operations, conversions, percentage of amounts' },
      { id: 'geometry', name: 'Geometry', description: 'Shapes, area, perimeter, volume, angles, coordinates, symmetry' },
      { id: 'data-handling', name: 'Data Handling', description: 'Tables, charts, mean, median, mode, probability' },
      { id: 'measurement', name: 'Measurement', description: 'Units, time, money, converting between units' },
      { id: 'ratio-algebra', name: 'Ratio & Basic Algebra', description: 'Simple ratios, sequences, basic equations, number patterns' }
    ]
  },
  {
    name: 'English',
    question_count: 50,
    time_minutes: 50,
    topics: [
      { id: 'comprehension', name: 'Reading Comprehension', description: 'Reading passages, inference, deduction, summarising, main idea' },
      { id: 'vocabulary', name: 'Vocabulary', description: 'Word meanings, synonyms, antonyms, context clues, word roots' },
      { id: 'punctuation-grammar', name: 'Punctuation & Grammar', description: 'Sentence structure, tenses, clauses, commas, apostrophes, colons, semicolons, speech marks' },
      { id: 'spelling-errors', name: 'Spelling & Error Spotting', description: 'Correct spellings, common misspellings, spot the mistake, proofreading' }
    ]
  },
  {
    name: 'Verbal Reasoning',
    question_count: 80,
    time_minutes: 60,
    topics: [
      { id: 'word-meanings', name: 'Word Meanings & Analogies', description: 'Synonyms, antonyms, odd one out, word relationships, closest in meaning' },
      { id: 'word-codes', name: 'Word Codes & Hidden Words', description: 'Letter codes, coded messages, hidden words within sentences, compound words' },
      { id: 'sequences', name: 'Number & Letter Sequences', description: 'Number patterns, letter series, mixed sequences, position in alphabet' },
      { id: 'logic', name: 'Logic & Deduction', description: 'Logical statements, if-then reasoning, true/false from given info, syllogisms' },
      { id: 'anagrams-rearrange', name: 'Anagrams & Rearrangement', description: 'Rearranging letters to form words, sorting words, word ladders' }
    ]
  },
  {
    name: 'Non-Verbal Reasoning',
    question_count: 80,
    time_minutes: 60,
    topics: [
      { id: 'pattern-series', name: 'Pattern & Series', description: 'Shape sequences, what comes next, analogies with shapes' },
      { id: 'odd-one-out', name: 'Odd One Out', description: 'Which shape is different, classification of shapes by properties' },
      { id: 'spatial-rotation', name: 'Rotation & Reflection', description: 'Rotating shapes, mirror images, symmetry lines' },
      { id: 'folding-nets', name: 'Folding & 3D Shapes', description: 'Cube nets, paper folding, 3D shape from 2D net, which cube can be made' },
      { id: 'matrices', name: 'Matrices & Grids', description: 'Complete the grid, find the missing piece, pattern in rows and columns' }
    ]
  }
];

// Total questions per test: 50 + 50 + 80 + 80 = 260
// Total time per test: 50 + 50 + 60 + 60 = 220 minutes

// Helper: get section config by subject name
export function getSectionConfig(subjectName: string): GLSection | undefined {
  return GL_SECTIONS.find(s => s.name === subjectName);
}

// Helper: get all topic IDs for a subject
export function getTopicsForSubject(subjectName: string): GLTopic[] {
  return GL_SECTIONS.find(s => s.name === subjectName)?.topics || [];
}

// Legacy export for backward compatibility (old code imported GL_SUBJECTS)
export const GL_SUBJECTS = GL_SECTIONS;
