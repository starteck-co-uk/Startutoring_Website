import { NextRequest, NextResponse } from 'next/server';
import { getAISettings, getActiveKey } from '@/lib/ai-settings';
import { generateQuestions } from '@/lib/ai-generate';
import { getAdminSupabase, getSupabase } from '@/lib/supabase';
import { demoSyllabiStore } from '@/lib/demo-data';
import { getFallback } from '@/lib/fallback-questions';

export const runtime = 'nodejs';
export const maxDuration = 45;

// GL Assessment question type guidance per subject
const GL_FORMAT_GUIDANCE: Record<string, string> = {
  'Maths': `Question types to include (mix these):
- Arithmetic: addition, subtraction, multiplication, division with multi-digit numbers
- Fractions, decimals & percentages: conversions, calculations, word problems
- Geometry: area, perimeter, volume, angles, properties of shapes
- Algebra: simple equations, sequences, substitution, forming expressions
- Data handling: mean/median/mode, probability, interpreting charts/tables
- Time & measurement: unit conversions, time calculations, word problems
- Ratio & proportion: sharing quantities, scaling, recipe-style problems
- Number properties: factors, multiples, primes, HCF, LCM, powers
All questions must require CALCULATION — not just recall. Include the working method in explanations.`,

  'English': `Question types to include (mix these):
- Grammar: identify parts of speech, correct sentence structure, active/passive voice, tenses, relative clauses
- Vocabulary: synonyms, antonyms, word meanings in context, "what does X mean?"
- Spelling: "which word is spelled correctly?" with 4 options including common misspellings
- Punctuation: apostrophes, commas, speech marks, colons — "which sentence is punctuated correctly?"
- Cloze/sentence completion: "Complete the sentence: The children were ___ because..." with 4 word choices
- Figurative language: identify simile, metaphor, personification, alliteration, hyperbole, onomatopoeia
- Comprehension: short passage (2-3 sentences) then a question about meaning, inference, or purpose
Do NOT use long reading passages. Each question must be self-contained with all needed context in the question text.`,

  'Verbal Reasoning': `Question types to include (mix these equally):
- Opposite words: "Select the word most OPPOSITE in meaning to X" with 4 options
- Synonyms: "Which word is closest in meaning to X?" with 4 options
- Odd one out: "Find the odd one out: A, B, C, D, E" — one doesn't belong to the category
- Analogies: "X is to Y as Z is to ___" with 4 options
- Double-meaning words: "Which word can mean both X and Y?" with 4 options
- Anagrams: "Rearrange the letters X to make another word" with 4 options
- Code/number sequences: letter-number codes, alphabet position values
- Letter patterns: "Complete the sequence: AB, CD, EF, ?"
All questions must be text-based with exactly 4 options. Use age-appropriate vocabulary for the level.`,

  'Non-Verbal Reasoning': `Question types to include (mix these):
- Rotations: "If shape X is rotated Y degrees, what happens?" — describe transformations in words
- Reflections: "Which letter looks the same when reflected in a vertical/horizontal mirror?"
- Symmetry: "How many lines of symmetry does shape X have?"
- Nets/3D shapes: "Which net folds into shape X?", "How many faces/edges/vertices?"
- Pattern sequences: "In a pattern, each shape gains one more side. What comes next?"
- Spatial reasoning: "If you fold paper X times and punch a hole, how many holes appear?"
- Matrix patterns: "In a 3x3 grid, each row has X, Y, Z. What is missing?"
- Shape properties: rotational symmetry order, diagonals, angles
ALL questions must be FULLY TEXT-BASED — do not reference images. Describe shapes and patterns in words.`
};

function buildSyllabusPrompt(subject: string, level: string, count: number, topic?: string, syllabusContent?: string): string {
  let prompt = `You are an expert UK 11+ GL Assessment quiz creator specialising in ${level} ${subject}.`;

  if (syllabusContent) {
    prompt += `\n\nThe following is the official syllabus content for this subject and level. Generate questions that are DIRECTLY ALIGNED to this syllabus:\n\n--- SYLLABUS ---\n${syllabusContent.slice(0, 8000)}\n--- END SYLLABUS ---\n`;
  }

  if (topic) {
    prompt += `\n\nFocus specifically on the topic: "${topic}". All questions must relate to this topic.`;
  }

  const formatGuide = GL_FORMAT_GUIDANCE[subject] || '';

  prompt += `\n\nGenerate exactly ${count} multiple-choice questions in GL Assessment style.

${formatGuide ? `\n${formatGuide}\n` : ''}
Return STRICT JSON only — no markdown, no prose, no backticks. Format:
{"questions":[{"text":"...","options":["A","B","C","D"],"correct":0,"explanation":"..."}]}

IMPORTANT RULES:
- Exactly 4 options per question (A, B, C, D), clearly distinct — no "all of the above" or ambiguous choices
- "correct" is the 0-based index of the correct option
- Explanations must show the full working/method (2-3 sentences), suitable for a student who got it wrong
- Questions MUST match ${level} difficulty precisely per UK National Curriculum and GL Assessment standards
- Each question must have exactly ONE defensible correct answer — no ambiguity
- Options should include plausible distractors (common mistakes students make)
- Order questions from easier to harder (progressive difficulty)`;

  return prompt;
}

export async function POST(req: NextRequest) {
  try {
    const { subject, level, count = 5, topic } = await req.json();
    if (!subject || !level) {
      return NextResponse.json({ error: 'subject and level required' }, { status: 400 });
    }

    // Look up syllabus
    let syllabusContent: string | undefined;
    const sb = getAdminSupabase() || getSupabase();
    if (sb) {
      const { data } = await sb.from('syllabi').select('content').eq('subject', subject).eq('level', level).single();
      if (data?.content) syllabusContent = data.content;
    } else {
      const syl = demoSyllabiStore.bySubjectLevel(subject, level);
      if (syl?.content) syllabusContent = syl.content;
    }

    const settings = await getAISettings();
    const active = getActiveKey(settings);

    if (!active) {
      return NextResponse.json({
        questions: getFallback(subject, level, count),
        source: 'fallback-no-key'
      });
    }

    const prompt = buildSyllabusPrompt(subject, level, count, topic, syllabusContent);

    try {
      const questions = await generateQuestions(prompt, active.provider, active.key);
      return NextResponse.json({
        questions: questions.slice(0, count),
        source: active.provider,
        hasSyllabus: !!syllabusContent
      });
    } catch (err: any) {
      console.error(`Admin quiz generation failed (${active.provider}):`, err.message);
      return NextResponse.json({
        questions: getFallback(subject, level, count),
        source: 'fallback-error',
        providerError: err.message
      });
    }
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
}
