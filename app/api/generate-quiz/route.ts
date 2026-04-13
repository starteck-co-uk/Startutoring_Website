import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getFallback } from '@/lib/fallback-questions';
import type { Question } from '@/lib/types';

export const runtime = 'nodejs';
export const maxDuration = 30;

const MODEL = 'claude-sonnet-4-20250514';

export async function POST(req: NextRequest) {
  try {
    const { subject, level, count = 5 } = await req.json();
    if (!subject || !level) {
      return NextResponse.json({ error: 'subject and level required' }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        questions: getFallback(subject, level, count),
        source: 'fallback-no-key'
      });
    }

    try {
      const client = new Anthropic({ apiKey });
      const prompt = `Generate ${count} multiple-choice questions for a ${level} student studying ${subject} under the UK National Curriculum.

Return STRICT JSON only — no markdown, no prose, no backticks. Format:
{"questions":[{"text":"...","options":["A","B","C","D"],"correct":0,"explanation":"..."}]}

Rules:
- Exactly 4 options per question
- "correct" is the 0-based index of the correct option
- Explanations should be concise (1-2 sentences)
- Questions must be age-appropriate for ${level}
- Make questions varied, fresh, and challenging but fair`;

      const msg = await client.messages.create({
        model: MODEL,
        max_tokens: 2048,
        messages: [{ role: 'user', content: prompt }]
      });

      const txt = msg.content
        .filter((b: any) => b.type === 'text')
        .map((b: any) => b.text)
        .join('\n');
      const jsonStart = txt.indexOf('{');
      const jsonEnd = txt.lastIndexOf('}');
      if (jsonStart === -1 || jsonEnd === -1) throw new Error('no json');
      const parsed = JSON.parse(txt.slice(jsonStart, jsonEnd + 1));
      const questions: Question[] = parsed.questions?.filter(
        (q: any) =>
          q &&
          typeof q.text === 'string' &&
          Array.isArray(q.options) &&
          q.options.length === 4 &&
          typeof q.correct === 'number'
      );
      if (!questions || questions.length === 0) throw new Error('no questions');
      return NextResponse.json({ questions: questions.slice(0, count), source: 'anthropic' });
    } catch (err) {
      return NextResponse.json({
        questions: getFallback(subject, level, count),
        source: 'fallback-error'
      });
    }
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
}
