import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getFallback } from '@/lib/fallback-questions';
import { getAISettings, getActiveKey } from '@/lib/ai-settings';
import type { Question } from '@/lib/types';

export const runtime = 'nodejs';
export const maxDuration = 30;

function buildPrompt(subject: string, level: string, count: number) {
  return `Generate ${count} multiple-choice questions for a ${level} student studying ${subject} under the UK National Curriculum.

Return STRICT JSON only — no markdown, no prose, no backticks. Format:
{"questions":[{"text":"...","options":["A","B","C","D"],"correct":0,"explanation":"..."}]}

Rules:
- Exactly 4 options per question
- "correct" is the 0-based index of the correct option
- Explanations should be concise (1-2 sentences)
- Questions must be age-appropriate for ${level}
- Make questions varied, fresh, and challenging but fair`;
}

function extractQuestions(raw: string): Question[] | null {
  const jsonStart = raw.indexOf('{');
  const jsonEnd = raw.lastIndexOf('}');
  if (jsonStart === -1 || jsonEnd === -1) return null;
  const parsed = JSON.parse(raw.slice(jsonStart, jsonEnd + 1));
  const questions: Question[] = parsed.questions?.filter(
    (q: any) =>
      q &&
      typeof q.text === 'string' &&
      Array.isArray(q.options) &&
      q.options.length === 4 &&
      typeof q.correct === 'number'
  );
  return questions && questions.length > 0 ? questions : null;
}

/* ─── Claude (Anthropic) ─── */
async function generateWithClaude(prompt: string, key: string): Promise<Question[]> {
  const client = new Anthropic({ apiKey: key });
  const msg = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }]
  });
  const txt = msg.content
    .filter((b: any) => b.type === 'text')
    .map((b: any) => b.text)
    .join('\n');
  const q = extractQuestions(txt);
  if (!q) throw new Error('Claude returned no valid questions');
  return q;
}

/* ─── OpenAI (GPT) ─── */
async function generateWithOpenAI(prompt: string, key: string): Promise<Question[]> {
  const client = new OpenAI({ apiKey: key });
  const chat = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    max_tokens: 2048,
    messages: [
      { role: 'system', content: 'You are a UK curriculum quiz generator. Return strict JSON only.' },
      { role: 'user', content: prompt }
    ]
  });
  const txt = chat.choices[0]?.message?.content || '';
  const q = extractQuestions(txt);
  if (!q) throw new Error('OpenAI returned no valid questions');
  return q;
}

/* ─── Gemini (Google) ─── */
async function generateWithGemini(prompt: string, key: string): Promise<Question[]> {
  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContent(prompt);
  const txt = result.response.text();
  const q = extractQuestions(txt);
  if (!q) throw new Error('Gemini returned no valid questions');
  return q;
}

/* ─── Copilot (GitHub Models / OpenAI-compatible) ─── */
async function generateWithCopilot(prompt: string, key: string): Promise<Question[]> {
  const client = new OpenAI({
    apiKey: key,
    baseURL: 'https://models.inference.ai.azure.com'
  });
  const chat = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    max_tokens: 2048,
    messages: [
      { role: 'system', content: 'You are a UK curriculum quiz generator. Return strict JSON only.' },
      { role: 'user', content: prompt }
    ]
  });
  const txt = chat.choices[0]?.message?.content || '';
  const q = extractQuestions(txt);
  if (!q) throw new Error('Copilot returned no valid questions');
  return q;
}

/* ─── Main handler ─── */
export async function POST(req: NextRequest) {
  try {
    const { subject, level, count = 5 } = await req.json();
    if (!subject || !level) {
      return NextResponse.json({ error: 'subject and level required' }, { status: 400 });
    }

    const settings = await getAISettings();
    const active = getActiveKey(settings);

    if (!active) {
      return NextResponse.json({
        questions: getFallback(subject, level, count),
        source: 'fallback-no-key'
      });
    }

    const prompt = buildPrompt(subject, level, count);

    try {
      let questions: Question[];

      switch (active.provider) {
        case 'claude':
          questions = await generateWithClaude(prompt, active.key);
          break;
        case 'openai':
          questions = await generateWithOpenAI(prompt, active.key);
          break;
        case 'gemini':
          questions = await generateWithGemini(prompt, active.key);
          break;
        case 'copilot':
          questions = await generateWithCopilot(prompt, active.key);
          break;
        default:
          questions = getFallback(subject, level, count);
      }

      return NextResponse.json({
        questions: questions.slice(0, count),
        source: active.provider
      });
    } catch (err: any) {
      console.error(`AI generation failed (${active.provider}):`, err.message);
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
