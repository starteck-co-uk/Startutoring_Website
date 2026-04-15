import { NextRequest, NextResponse } from 'next/server';
import { getAISettings, getActiveKey } from '@/lib/ai-settings';
import { callProvider, extractJSON } from '@/lib/ai-generate';

export const runtime = 'nodejs';
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const { messages, questions, subject, level } = await req.json();
    if (!messages || !questions || !subject || !level) {
      return NextResponse.json({ error: 'messages, questions, subject, and level required' }, { status: 400 });
    }

    const settings = await getAISettings();
    const active = getActiveKey(settings);
    if (!active) {
      return NextResponse.json({ error: 'No AI provider configured' }, { status: 503 });
    }

    const questionsJson = JSON.stringify(questions.map((q: any, i: number) => ({
      index: i + 1,
      text: q.text,
      options: q.options,
      correct: q.correct,
      explanation: q.explanation
    })), null, 2);

    // Build conversation context
    const conversation = messages.map((m: any) => `${m.role === 'user' ? 'Tutor' : 'AI'}: ${m.content}`).join('\n');

    const prompt = `You are an AI assistant helping a tutor refine a ${level} ${subject} quiz for UK National Curriculum students.

Here is the current quiz:
${questionsJson}

Conversation so far:
${conversation}

The tutor's latest message is the last one above. Apply their instructions and return the FULL updated quiz.

Return STRICT JSON only — no markdown, no prose, no backticks:
{"questions":[{"text":"...","options":["A","B","C","D"],"correct":0,"explanation":"..."}],"reply":"Brief explanation of what you changed"}

RULES:
- Only modify questions the tutor asked about — keep all others EXACTLY the same
- If the tutor says an answer is wrong, fix both the correct index AND the explanation
- If asked to make something harder/easier, adjust the cognitive demand level appropriately
- Maintain exactly 4 options per question with one clear correct answer
- Keep questions aligned to ${level} UK curriculum standards
- The "reply" should be a clear, short summary of changes made`;

    const raw = await callProvider(prompt, active.provider, active.key);
    const parsed = extractJSON(raw);

    if (!parsed?.questions || !Array.isArray(parsed.questions)) {
      return NextResponse.json({ error: 'AI did not return valid questions' }, { status: 422 });
    }

    return NextResponse.json({
      questions: parsed.questions,
      reply: parsed.reply || 'Changes applied.',
      provider: active.provider
    });
  } catch (e: any) {
    console.error('Quiz chat error:', e.message);
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
}
