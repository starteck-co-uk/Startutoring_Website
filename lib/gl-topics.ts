// GL Assessment 11+ topic structure per subject
// Each topic gets 20 questions in a weekly test

export interface GLTopic {
  id: string;
  name: string;
  description: string;
}

export interface GLSubject {
  name: string;
  topics: GLTopic[];
}

export const GL_SUBJECTS: GLSubject[] = [
  {
    name: 'Maths',
    topics: [
      { id: 'number-place-value', name: 'Number & Place Value', description: 'Ordering, rounding, negative numbers, Roman numerals' },
      { id: 'arithmetic', name: 'Arithmetic', description: 'Addition, subtraction, multiplication, division, BODMAS' },
      { id: 'fractions-decimals', name: 'Fractions, Decimals & Percentages', description: 'Equivalent fractions, operations, conversions' },
      { id: 'geometry-measurement', name: 'Geometry & Measurement', description: 'Shapes, area, perimeter, volume, angles, coordinates' },
      { id: 'data-handling', name: 'Data Handling & Statistics', description: 'Tables, charts, mean, median, mode, probability' }
    ]
  },
  {
    name: 'English',
    topics: [
      { id: 'comprehension', name: 'Comprehension', description: 'Reading passages, inference, deduction, summarising' },
      { id: 'grammar-punctuation', name: 'Grammar & Punctuation', description: 'Sentence structure, tenses, clauses, punctuation rules' },
      { id: 'spelling-vocabulary', name: 'Spelling & Vocabulary', description: 'Correct spellings, word meanings, synonyms, antonyms' }
    ]
  },
  {
    name: 'Verbal Reasoning',
    topics: [
      { id: 'word-meanings', name: 'Word Meanings & Analogies', description: 'Synonyms, antonyms, odd one out, word relationships' },
      { id: 'codes-sequences', name: 'Codes & Sequences', description: 'Letter codes, number sequences, hidden words, anagrams' },
      { id: 'logic-deduction', name: 'Logic & Deduction', description: 'Logical statements, if-then reasoning, syllogisms' }
    ]
  },
  {
    name: 'Non-Verbal Reasoning',
    topics: [
      { id: 'pattern-recognition', name: 'Pattern Recognition', description: 'Shape sequences, series completion, analogies' },
      { id: 'spatial-reasoning', name: 'Spatial Reasoning', description: 'Rotation, reflection, nets, folding, symmetry' },
      { id: 'matrices-odd-one-out', name: 'Matrices & Odd One Out', description: 'Grid patterns, which shape is different, classification' }
    ]
  }
];

// Get all topic IDs for a subject
export function getTopicsForSubject(subjectName: string): GLTopic[] {
  return GL_SUBJECTS.find(s => s.name === subjectName)?.topics || [];
}
