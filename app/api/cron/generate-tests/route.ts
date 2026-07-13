import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabase, getSupabase } from '@/lib/supabase';
import { demoWeeklyTestStore } from '@/lib/demo-data';
import { GL_SECTIONS } from '@/lib/gl-topics';
import { getFallback } from '@/lib/fallback-questions';
import { getAISettings, getActiveKey } from '@/lib/ai-settings';
import { generateQuestions } from '@/lib/ai-generate';

export const runtime = 'nodejs';
export const maxDuration = 300; // 5 minutes — generating 520 questions takes time

// Build the AI prompt for a section (same as admin/generate-quiz but inlined for cron)
const GL_FORMAT_GUIDANCE: Record<string, string> = {
  'Maths': 'Generate GL Assessment 11+ Maths questions covering arithmetic, fractions/decimals/percentages, geometry, data handling, measurement, ratio & algebra. Year 6 level. Each question needs calculation, not just recall.',
  'English': 'Generate GL Assessment 11+ English questions covering comprehension, vocabulary, punctuation & grammar (VERY important), spelling & error spotting. Year 6 level. Each question must be self-contained.',
  'Verbal Reasoning': 'Generate GL Assessment 11+ Verbal Reasoning questions: opposites, synonyms, odd one out, analogies, anagrams, codes, letter patterns. Year 6 level. All text-based with 4 options.',
  'Non-Verbal Reasoning': 'Generate GL Assessment 11+ Non-Verbal Reasoning questions: rotations, reflections, symmetry, nets/3D shapes, pattern sequences, spatial reasoning, matrices. ALL questions FULLY TEXT-BASED — describe shapes in words, no images.'
};

function buildPrompt(subject: string, count: number): string {
  return `You are an expert UK 11+ GL Assessment quiz creator.

${GL_FORMAT_GUIDANCE[subject] || ''}

Generate exactly ${count} multiple-choice questions.

Return STRICT JSON only — no markdown, no prose, no backticks. Format:
{"questions":[{"text":"...","options":["A","B","C","D"],"correct":0,"explanation":"..."}]}

RULES:
- Exactly 4 options per question, clearly distinct
- "correct" is the 0-based index of the correct option
- Explanations must show full working (2-3 sentences)
- Each question has exactly ONE correct answer
- Progressive difficulty (easier to harder)

CRITICAL: These are for Year 6 students (age 10-11) preparing for the 11+ entrance exam.
- Stick to KS2 curriculum ONLY — NO secondary school content
- Maths: basic arithmetic, simple fractions, basic percentages, simple area/perimeter. NO algebra with variables, NO trigonometry
- English: age-appropriate vocabulary. NO literary analysis terms
- VR: words a Year 6 child would know. NO obscure vocabulary
- NVR: basic spatial reasoning. NO complex 3D transformations
- When in doubt, make it EASIER. Test reasoning, not trick children.`;
}

async function generateSectionQuestions(
  subject: string,
  count: number
): Promise<{ questions: any[]; source: string }> {
  // Try AI first
  try {
    const settings = await getAISettings();
    const active = getActiveKey(settings);
    if (active) {
      const prompt = buildPrompt(subject, count);
      const questions = await generateQuestions(prompt, active.provider, active.key);
      if (questions.length >= count * 0.8) { // accept if we got at least 80%
        return { questions: questions.slice(0, count), source: active.provider };
      }
    }
  } catch (err: any) {
    console.error(`[cron] AI generation failed for ${subject}:`, err.message);
  }

  // Fallback to question bank
  const questions = getFallback(subject, '11+', count);
  return { questions, source: 'question-bank' };
}

async function createAndPublishTest(
  title: string,
  weekStart: string,
  sections: any[]
): Promise<string | null> {
  const payload = {
    title,
    level: '11+',
    week_start: weekStart,
    sections,
    status: 'draft' as const
  };

  const sb = getAdminSupabase() || getSupabase();
  if (sb) {
    const { data, error } = await sb.from('weekly_tests').insert(payload).select().single();
    if (error) throw error;
    // Publish immediately
    await sb.from('weekly_tests').update({ status: 'published' }).eq('id', data.id);
    return data.id;
  }

  // Demo mode
  const test = demoWeeklyTestStore.insertTest(payload);
  test.status = 'published';
  return test.id;
}

function kebab(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function generateFullTest(label: string, weekStart: string): Promise<string | null> {
  const sections = [];

  for (const sec of GL_SECTIONS) {
    console.log(`[cron] Generating ${label}: ${sec.name} (${sec.question_count}Q)...`);
    const { questions, source } = await generateSectionQuestions(sec.name, sec.question_count);
    console.log(`[cron] ${sec.name}: got ${questions.length} questions from ${source}`);

    sections.push({
      id: `sec-${kebab(sec.name)}`,
      subject: sec.name,
      topic_id: sec.name,
      topic_name: sec.name,
      questions,
      question_count: questions.length,
      time_minutes: sec.time_minutes
    });
  }

  const weekDate = new Date(weekStart);
  const weekStr = weekDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  const title = `Weekly Test — ${weekStr} (Set ${label})`;

  return createAndPublishTest(title, weekStart, sections);
}

// GET handler — called by Vercel Cron or external scheduler
export async function GET(req: NextRequest) {
  // Verify cron secret (skip in demo/dev mode if not set)
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const auth = req.headers.get('authorization');
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  try {
    // Calculate this week's Monday
    const now = new Date();
    const dayOfWeek = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
    const weekStart = monday.toISOString().split('T')[0];

    console.log(`[cron] Starting weekly test generation for week of ${weekStart}`);

    // Generate Set A
    const setAId = await generateFullTest('A', weekStart);
    console.log(`[cron] Set A created: ${setAId}`);

    // Generate Set B
    const setBId = await generateFullTest('B', weekStart);
    console.log(`[cron] Set B created: ${setBId}`);

    const totalQs = GL_SECTIONS.reduce((a, s) => a + s.question_count, 0);

    return NextResponse.json({
      success: true,
      week_start: weekStart,
      set_a_id: setAId,
      set_b_id: setBId,
      total_questions_per_set: totalQs,
      generated_at: new Date().toISOString()
    });
  } catch (err: any) {
    console.error('[cron] Weekly test generation failed:', err.message);
    return NextResponse.json(
      { error: err.message || 'Generation failed' },
      { status: 500 }
    );
  }
}
