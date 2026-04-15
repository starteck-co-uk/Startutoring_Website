import { NextRequest, NextResponse } from 'next/server';
import { getAISettings, getActiveKey } from '@/lib/ai-settings';
import { callProvider, extractJSON } from '@/lib/ai-generate';

export const runtime = 'nodejs';
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const { subject, level, topic, existing_questions, instruction } = await req.json();
    if (!subject || !level || !existing_questions) {
      return NextResponse.json({ error: 'subject, level, and existing_questions required' }, { status: 400 });
    }

    const settings = await getAISettings();
    const active = getActiveKey(settings);
    if (!active) {
      return NextResponse.json({ error: 'No AI provider configured' }, { status: 503 });
    }

    const existingTexts = existing_questions.map((q: any, i: number) => `${i + 1}. ${q.text}`).join('\n');

    const prompt = `Generate exactly 1 new multiple-choice question for ${level} ${subject} (UK National Curriculum).
${topic ? `\nTopic focus: ${topic}` : ''}
${instruction ? `\nSpecific instruction: ${instruction}` : ''}

The question must be COMPLETELY DIFFERENT from these existing questions in the quiz:
${existingTexts}

Return STRICT JSON only — no markdown, no backticks:
{"text":"...","options":["A","B","C","D"],"correct":0,"explanation":"..."}

RULES:
- Exactly 4 clearly distinct options
- "correct" is the 0-based index
- Explanation must show full working/method (2-3 sentences)
- Match ${level} difficulty precisely
- Must have exactly ONE defensible correct answer`;

    const raw = await callProvider(prompt, active.provider, active.key);
    const parsed = extractJSON(raw);

    if (!parsed?.text || !parsed?.options) {
      return NextResponse.json({ error: 'AI did not return a valid question' }, { status: 422 });
    }

    return NextResponse.json({ question: parsed, provider: active.provider });
  } catch (e: any) {
    console.error('Regenerate question error:', e.message);
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
}
