import { NextRequest, NextResponse } from 'next/server';
import { getAISettings, getActiveKey } from '@/lib/ai-settings';
import { generateQuestions } from '@/lib/ai-generate';
import { getAdminSupabase, getSupabase } from '@/lib/supabase';
import { demoSyllabiStore } from '@/lib/demo-data';
import { getFallback } from '@/lib/fallback-questions';

export const runtime = 'nodejs';
export const maxDuration = 45;

function buildSyllabusPrompt(subject: string, level: string, count: number, topic?: string, syllabusContent?: string): string {
  let prompt = `You are an expert UK National Curriculum quiz creator for ${level} ${subject}.`;

  if (syllabusContent) {
    prompt += `\n\nThe following is the official syllabus content for this subject and level. Generate questions that are DIRECTLY ALIGNED to this syllabus:\n\n--- SYLLABUS ---\n${syllabusContent.slice(0, 8000)}\n--- END SYLLABUS ---\n`;
  }

  if (topic) {
    prompt += `\n\nFocus specifically on the topic: "${topic}". All questions must relate to this topic.`;
  }

  prompt += `\n\nGenerate exactly ${count} multiple-choice questions.

Return STRICT JSON only — no markdown, no prose, no backticks. Format:
{"questions":[{"text":"...","options":["A","B","C","D"],"correct":0,"explanation":"..."}]}

IMPORTANT RULES:
- Exactly 4 options per question, clearly distinct — no "all of the above" or ambiguous choices
- "correct" is the 0-based index of the correct option
- Explanations must show the full working/method (2-3 sentences), suitable for a student who got it wrong
- Questions MUST match ${level} difficulty precisely per UK National Curriculum expectations
- Include a MIX of question types: recall, application, and problem-solving
- Each question must have exactly ONE defensible correct answer — no ambiguity
- For Maths: include numerical problems requiring calculation, show the method in explanations
- For Science: cover theory, practical applications, and data interpretation
- For English: cover grammar, comprehension, literary techniques, and vocabulary
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
