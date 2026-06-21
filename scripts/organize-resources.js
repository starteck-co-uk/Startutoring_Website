const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'materials', '11 PLUS+');
const DEST = path.join(__dirname, '..', 'public', 'resources');

// Clean filename: remove version suffixes, normalize spaces
function cleanName(name) {
  return name
    .replace(/_ver_\d+/g, '')
    .replace(/\s+/g, '-')
    .replace(/[(),]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .replace('.pdf.pdf', '.pdf');
}

// Categorize files
const manifest = [];
let id = 0;

function addFile(filePath, subject, category, customTitle) {
  const fileName = path.basename(filePath);
  if (!fs.existsSync(filePath)) return;

  const ext = path.extname(fileName).toLowerCase();
  // Only PDFs
  if (ext !== '.pdf') return;

  id++;
  const cleanFileName = cleanName(fileName);
  const subjectSlug = subject.toLowerCase().replace(/\s+/g, '-');
  const categorySlug = category.toLowerCase().replace(/\s+/g, '-');

  const destDir = path.join(DEST, subjectSlug, categorySlug);
  fs.mkdirSync(destDir, { recursive: true });

  const destPath = path.join(destDir, cleanFileName);
  fs.copyFileSync(filePath, destPath);

  const relativePath = `/resources/${subjectSlug}/${categorySlug}/${cleanFileName}`;
  const stats = fs.statSync(filePath);

  const title = customTitle || fileName
    .replace(/\.pdf$/i, '')
    .replace(/_ver_\d+/g, '')
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  manifest.push({
    id: `res-${id}`,
    title,
    subject,
    category,
    level: '11+',
    file_name: cleanFileName,
    file_size: stats.size,
    path: relativePath
  });
}

// Helper to add all PDFs from a directory
function addDir(dirPath, subject, category) {
  if (!fs.existsSync(dirPath)) return;
  const files = fs.readdirSync(dirPath);
  for (const f of files) {
    const full = path.join(dirPath, f);
    if (fs.statSync(full).isFile() && f.toLowerCase().endsWith('.pdf')) {
      addFile(full, subject, category);
    }
  }
}

// ─── MATHS ───

// Knowledge Organisers
addDir(path.join(SRC, 'IMP Maths-knowledge-organisers-year-6-pack_ver_1'), 'Maths', 'Knowledge Organisers');

// Practice Tests (top level)
addFile(path.join(SRC, '11+ Maths Practice Test 1.pdf'), 'Maths', 'Practice Tests');
addFile(path.join(SRC, '11+ Maths Practice Test 2.pdf'), 'Maths', 'Practice Tests');
addFile(path.join(SRC, '11 Plus Maths Practice Test.pdf'), 'Maths', 'Practice Tests');
addFile(path.join(SRC, 'Maths.pdf'), 'Maths', 'Practice Tests');

// Maths test booklets
addDir(path.join(SRC, 'Maths', 'Maths'), 'Maths', 'Test Booklets');

// Lesson-based maths
addDir(path.join(SRC, 'Lesson 1', 'Maths Number and Place Value'), 'Maths', 'Number and Place Value');
addDir(path.join(SRC, 'Lesson 2', 'Maths Addition Subtraction'), 'Maths', 'Addition and Subtraction');
addDir(path.join(SRC, 'Lesson 3', 'Maths Multiplication and Division'), 'Maths', 'Multiplication and Division');
addDir(path.join(SRC, 'Lesson 4', 'Maths BIDMAS'), 'Maths', 'BIDMAS');
addDir(path.join(SRC, 'Lesson 5', 'Maths Fractions four operations and comparing'), 'Maths', 'Fractions');
addDir(path.join(SRC, 'Lesson 6', 'Maths FDP'), 'Maths', 'Fractions Decimals Percentages');
addDir(path.join(SRC, 'Lesson 7', 'Maths Percentage of Quantities'), 'Maths', 'Percentages');
addDir(path.join(SRC, 'Lesson 8', 'Maths Unit Convesion'), 'Maths', 'Unit Conversion');
addDir(path.join(SRC, 'Lesson 9', 'Maths Properties of Shapes'), 'Maths', 'Properties of Shapes');
addDir(path.join(SRC, 'Lesson 11', 'Maths Statistics'), 'Maths', 'Statistics');
addDir(path.join(SRC, 'Lesson 12', 'Maths Ratio and Porportion'), 'Maths', 'Ratio and Proportion');
addDir(path.join(SRC, 'Lesson 13', 'Maths Algebra'), 'Maths', 'Algebra');
addDir(path.join(SRC, 'Lesson 14', 'Maths Speed Distance Time'), 'Maths', 'Speed Distance Time');
addDir(path.join(SRC, 'Lesson 15', 'Maths Reasoning'), 'Maths', 'Reasoning');

// Maths word problems
addFile(path.join(SRC, 'Lesson 17', 'Bronze - The Four Operations Worded Problems.pdf'), 'Maths', 'Word Problems');
addFile(path.join(SRC, 'Lesson 17', 'Silver - The Four Operations Worded Problems.pdf'), 'Maths', 'Word Problems');
addFile(path.join(SRC, 'Lesson 17', 'Gold - The Four Operations Worded Problems.pdf'), 'Maths', 'Word Problems');

// MW Grade papers
addFile(path.join(SRC, 'MW Grade 1.pdf'), 'Maths', 'MW Grade Papers');
addFile(path.join(SRC, 'MW Grade 2 Part 1.pdf'), 'Maths', 'MW Grade Papers');
addFile(path.join(SRC, 'MW Grade 2 Part 2.pdf'), 'Maths', 'MW Grade Papers');
addFile(path.join(SRC, 'MW Grade 3 Part 1.pdf'), 'Maths', 'MW Grade Papers');
addFile(path.join(SRC, 'MW Grade 3 Part 2.pdf'), 'Maths', 'MW Grade Papers');
addFile(path.join(SRC, 'MW Grade 3 Part 3.pdf'), 'Maths', 'MW Grade Papers');

// Mock Exams
addDir(path.join(SRC, 'Mock Exams', '1'), 'Maths', 'Mock Exams');

// SATs Reasoning
addFile(path.join(SRC, 'SATs  Reasoning Pack Guidance.pdf'), 'Maths', 'Reasoning');
addFile(path.join(SRC, 'Reasoning Quiz 1.pdf'), 'Maths', 'Reasoning Quizzes');
addFile(path.join(SRC, 'Reasoning Quiz 1 Guidance.pdf'), 'Maths', 'Reasoning Quizzes');
addFile(path.join(SRC, 'Reasoning Quiz 2.pdf'), 'Maths', 'Reasoning Quizzes');
addFile(path.join(SRC, 'Reasoning Quiz 2 Guidance.pdf'), 'Maths', 'Reasoning Quizzes');
addFile(path.join(SRC, 'Reasoning Quiz 3.pdf'), 'Maths', 'Reasoning Quizzes');
addFile(path.join(SRC, 'Reasoning Quiz 3 Guidance.pdf'), 'Maths', 'Reasoning Quizzes');
addFile(path.join(SRC, 'Reasoning Quiz 4.pdf'), 'Maths', 'Reasoning Quizzes');
addFile(path.join(SRC, 'Reasoning Quiz 4 Guidance.pdf'), 'Maths', 'Reasoning Quizzes');
addFile(path.join(SRC, 'Reasoning Quiz 5.pdf'), 'Maths', 'Reasoning Quizzes');
addFile(path.join(SRC, 'Reasoning Quiz 5 Guidance.pdf'), 'Maths', 'Reasoning Quizzes');

// NVR + Maths combo
addDir(path.join(SRC, 'non-verbal-reasoning-maths', 'Non - Verbal Reasoning & Maths'), 'Maths', 'NVR and Maths Combined');

// ─── ENGLISH ───

addDir(path.join(SRC, 'English'), 'English', 'Test Papers');
addFile(path.join(SRC, 'English_10_11+_sample.pdf'), 'English', 'Practice Tests');
addFile(path.join(SRC, 'Watership-Down-11-English-Sample-Paper.pdf'), 'English', 'Practice Tests');
addFile(path.join(SRC, 'READING-COMPREHENSIONS-VR.pdf'), 'English', 'Reading Comprehension');
addFile(path.join(SRC, '11+ Vocabulary Calendar.pdf'), 'English', 'Vocabulary');
addFile(path.join(SRC, 'Lesson 14', 'Spot the Mistake Punctuation Worksheet - English Grammar.pdf'), 'English', 'Grammar and Punctuation');
addFile(path.join(SRC, 'Lesson 15', 'Expanding Sentences Worksheets.pdf'), 'English', 'Grammar and Punctuation');
addFile(path.join(SRC, 'Lesson 16', '11+ Creative Writing Questions (1).pdf'), 'English', 'Creative Writing');
addFile(path.join(SRC, 'Lesson 16', '11+ Creative Writing Answers.pdf'), 'English', 'Creative Writing');
addFile(path.join(SRC, 'Lesson 17', 'Complete The Sentence Punctuation Worksheet.pdf'), 'English', 'Grammar and Punctuation');

// Reading Comprehensions
const compDir = path.join(SRC, 't-e-1626682479-abridged-reading-comprehensions_ver_1');
if (fs.existsSync(compDir)) {
  const compFolders = fs.readdirSync(compDir);
  for (const folder of compFolders) {
    const fullFolder = path.join(compDir, folder);
    if (fs.statSync(fullFolder).isDirectory()) {
      addDir(fullFolder, 'English', 'Reading Comprehension');
    }
  }
}

// ─── VERBAL REASONING ───

addDir(path.join(SRC, 'Verbal Reasoning'), 'Verbal Reasoning', 'Test Papers');
addDir(path.join(SRC, 'Verbal Skills'), 'Verbal Reasoning', 'Verbal Skills');

// Lesson VR worksheets
const vrLessons = {
  'Lesson 1': ['Verbal-reasoning-complete-the-sum-1_ver_1.pdf', 'Verbal-reasoning-find-the-letter-to-complete-two-words_ver_4.pdf'],
  'Lesson 2': ['Verbal-reasoning-same-meaning_ver_1.pdf', 'Verbal-reasoning-two-odd-ones-out_ver_1.pdf'],
  'Lesson 3': ['Verbal-reasoning-related-words_ver_2.pdf'],
  'Lesson 4': ['Verbal-reasoning-practice-paper-closest-in-meaning-1-assessment_ver_10.pdf'],
  'Lesson 5': ['Verbal-reasoning-hidden-words_ver_1.pdf'],
  'Lesson 6': ['Verbal-reasoning-complete-the-word_ver_1.pdf'],
  'Lesson 7': ['Verbal-reasoning-letters-for-numbers_ver_2.pdf'],
  'Lesson 8': ['Verbal-reasoning-move-a-letter_ver_1.pdf'],
  'Lesson 9': ['Verbal-reasoning-alphabet-codes_ver_1.pdf'],
  'Lesson 10': ['Verbal-reasoning-word-connections_ver_1.pdf'],
  'Lesson 12': ['Verbal-reasoning-compound-Print version.pdf', 'Verbal-reasoning-compound-words_ver_1.pdf'],
  'Lesson 13': ['Verbal-reasoning-missing-first-letter_ver_1.pdf'],
  'Lesson 15': ['Verbal-reasoning-opposite-meaning_ver_1.pdf'],
  'Lesson 16': ['Verbal-reasoning-complete-the-word_ver_1.pdf'],
};
for (const [lesson, files] of Object.entries(vrLessons)) {
  for (const f of files) {
    addFile(path.join(SRC, lesson, f), 'Verbal Reasoning', 'Worksheets');
  }
}

// VR from Lesson 11 and 14
addFile(path.join(SRC, 'Lesson 11', '11+ Verbal Reasoning Number Codes.pdf'), 'Verbal Reasoning', 'Worksheets');
addFile(path.join(SRC, 'Lesson 11', '11+ Verbal Reasoning Number Codes Answers.pdf'), 'Verbal Reasoning', 'Worksheets');
addFile(path.join(SRC, 'Lesson 14', 'Letter Connections.pdf'), 'Verbal Reasoning', 'Worksheets');
addFile(path.join(SRC, 'Lesson 14', 'Letter Connection Answers.pdf'), 'Verbal Reasoning', 'Worksheets');

// ─── NON-VERBAL REASONING ───

addDir(path.join(SRC, 'Non-Verbal Reasoning'), 'Non-Verbal Reasoning', 'Assessment Packs');
addFile(path.join(SRC, 'Non-verbal-reasoning-ultimate-practice-pack_ver_7.pdf'), 'Non-Verbal Reasoning', 'Practice Papers');

// Lesson NVR worksheets
const nvrLessons = {
  'Lesson 1': ['Non-verbal-reasoning-analogies-assessment-pack_ver_7.pdf'],
  'Lesson 2': ['Non-verbal-reasoning-nets-and-cubes_ver_8.pdf'],
  'Lesson 3': ['Non-verbal-reasoning-odd-one-out_ver_4.pdf'],
  'Lesson 4': ['Non-verbal-reasoning-missing-codes_ver_1.pdf'],
  'Lesson 5': ['Non-verbal-reasoning-reflections_ver_1.pdf'],
  'Lesson 6': ['Non-verbal-reasoning-complete-the-grid_ver_1.pdf'],
  'Lesson 7': ['Non-verbal-reasoning-complete-the-sequence_ver_1.pdf'],
  'Lesson 8': ['Non-verbal-reasoning-similar-figures_ver_1.pdf'],
  'Lesson 9': ['Non-verbal-reasoning-changing-pairs_ver_6.pdf'],
  'Lesson 10': ['Non-verbal-reasoning-practice-paper-rotation-and-reflection_ver_1.pdf'],
  'Lesson 12': ['Non-verbal-reasoning-practice-paper-missing-Print version.pdf', 'Non-verbal-reasoning-practice-paper-missing-square_ver_1.pdf'],
  'Lesson 13': ['Non-verbal-reasoning-practice-paper-shape_ver_1.pdf'],
};
for (const [lesson, files] of Object.entries(nvrLessons)) {
  for (const f of files) {
    addFile(path.join(SRC, lesson, f), 'Non-Verbal Reasoning', 'Worksheets');
  }
}

addFile(path.join(SRC, 'Lesson 11', '11+ Non-Verbal Reasoning Progress Assessment Paper.pdf'), 'Non-Verbal Reasoning', 'Assessment Packs');
addFile(path.join(SRC, 'Lesson 11', '11+ Non-Verbal Reasoning Progress Assessment Paper Answers.pdf'), 'Non-Verbal Reasoning', 'Assessment Packs');

// ─── GENERAL / PRACTICE TESTS ───

addFile(path.join(SRC, '11+ Survival Guide for Parents or Carers Guide.pdf'), 'General', 'Parent Guides');
// Tests folder
addDir(path.join(SRC, 'Tests'), 'General', 'Practice Tests');

// ─── Write manifest ───
const manifestPath = path.join(DEST, 'manifest.json');
fs.mkdirSync(DEST, { recursive: true });
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

console.log(`Done! ${manifest.length} resources organized.`);
console.log(`Manifest written to: ${manifestPath}`);

// Print summary
const bySubject = {};
for (const r of manifest) {
  bySubject[r.subject] = (bySubject[r.subject] || 0) + 1;
}
console.log('\nBreakdown:');
for (const [s, c] of Object.entries(bySubject)) {
  console.log(`  ${s}: ${c} files`);
}
