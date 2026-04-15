import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getAISettings, getActiveKey } from '@/lib/ai-settings';

export const runtime = 'nodejs';
export const maxDuration = 60;

const GRADING_PROMPT = `You are an expert UK National Curriculum examiner. A student has submitted their handwritten or typed work as a PDF. Your job is to grade it thoroughly.

Subject: {{subject}}
Level: {{level}}

GRADING CRITERIA — you MUST evaluate:
1. **Final answers**: Are the answers correct?
2. **Working & method**: Did the student show clear working? Are the steps logical and in the right order? Award marks for correct method even if the final answer is wrong.
3. **Presentation**: Is the work neat, structured, and easy to follow?
4. **Understanding**: Does the student demonstrate genuine understanding of the concepts, or are they just memorising procedures?

For Maths/Science: Pay close attention to the steps and working out. Partial credit for correct method with arithmetic errors.
For English: Evaluate structure, grammar, vocabulary, argument quality, and use of evidence.

Return STRICT JSON only — no markdown, no prose, no backticks. Format:
{
  "overall_score": <number 0-100>,
  "overall_grade": "<A*/A/B/C/D/E/U based on UK grading>",
  "overall_feedback": "<2-3 sentence summary of performance>",
  "questions": [
    {
      "question_number": <number or string identifying the question>,
      "question_topic": "<brief topic/description>",
      "answer_score": <number 0-100 for correctness of final answer>,
      "method_score": <number 0-100 for quality of working/steps>,
      "marks_awarded": <number>,
      "marks_available": <number>,
      "steps_analysis": "<detailed analysis of the steps the student took — what they did right, where they went wrong>",
      "feedback": "<specific advice for improvement on this question>"
    }
  ],
  "strengths": ["<strength 1>", "<strength 2>"],
  "improvements": ["<area to improve 1>", "<area to improve 2>"],
  "study_tips": ["<specific tip 1>", "<specific tip 2>"]
}

If you cannot identify distinct questions, treat the entire submission as one item.
Be encouraging but honest. This is for a {{level}} student — calibrate your expectations accordingly.`;

function buildPrompt(subject: string, level: string): string {
  return GRADING_PROMPT.replace(/\{\{subject\}\}/g, subject).replace(/\{\{level\}\}/g, level);
}

interface GradingResult {
  overall_score: number;
  overall_grade: string;
  overall_feedback: string;
  questions: Array<{
    question_number: number | string;
    question_topic: string;
    answer_score: number;
    method_score: number;
    marks_awarded: number;
    marks_available: number;
    steps_analysis: string;
    feedback: string;
  }>;
  strengths: string[];
  improvements: string[];
  study_tips: string[];
}

function extractGradingResult(raw: string): GradingResult | null {
  const jsonStart = raw.indexOf('{');
  const jsonEnd = raw.lastIndexOf('}');
  if (jsonStart === -1 || jsonEnd === -1) return null;
  const parsed = JSON.parse(raw.slice(jsonStart, jsonEnd + 1));
  if (typeof parsed.overall_score !== 'number') return null;
  return parsed as GradingResult;
}

/* ─── Claude ─── */
async function gradeWithClaude(pdfBase64: string, prompt: string, key: string): Promise<GradingResult> {
  const client = new Anthropic({ apiKey: key });
  const msg = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: [
          // Use 'any' cast — the SDK types lag behind the API; 'document' type works at runtime
          {
            type: 'document',
            source: { type: 'base64', media_type: 'application/pdf', data: pdfBase64 }
          } as any,
          { type: 'text', text: prompt }
        ]
      }
    ]
  });
  const txt = msg.content
    .filter((b: any) => b.type === 'text')
    .map((b: any) => b.text)
    .join('\n');
  const result = extractGradingResult(txt);
  if (!result) throw new Error('Claude returned no valid grading result');
  return result;
}

/* ─── OpenAI ─── */
async function gradeWithOpenAI(pdfBase64: string, prompt: string, key: string): Promise<GradingResult> {
  const client = new OpenAI({ apiKey: key });
  const chat = await client.chat.completions.create({
    model: 'gpt-4o',
    max_tokens: 4096,
    messages: [
      {
        role: 'system',
        content: 'You are an expert UK curriculum examiner. Return strict JSON only.'
      },
      {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: { url: `data:application/pdf;base64,${pdfBase64}`, detail: 'high' }
          },
          { type: 'text', text: prompt }
        ]
      }
    ]
  });
  const txt = chat.choices[0]?.message?.content || '';
  const result = extractGradingResult(txt);
  if (!result) throw new Error('OpenAI returned no valid grading result');
  return result;
}

/* ─── Gemini ─── */
async function gradeWithGemini(pdfBase64: string, prompt: string, key: string): Promise<GradingResult> {
  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContent([
    {
      inlineData: { mimeType: 'application/pdf', data: pdfBase64 }
    },
    { text: prompt }
  ]);
  const txt = result.response.text();
  const grading = extractGradingResult(txt);
  if (!grading) throw new Error('Gemini returned no valid grading result');
  return grading;
}

/* ─── Copilot (GitHub Models) ─── */
async function gradeWithCopilot(pdfBase64: string, prompt: string, key: string): Promise<GradingResult> {
  const client = new OpenAI({
    apiKey: key,
    baseURL: 'https://models.inference.ai.azure.com'
  });
  const chat = await client.chat.completions.create({
    model: 'gpt-4o',
    max_tokens: 4096,
    messages: [
      {
        role: 'system',
        content: 'You are an expert UK curriculum examiner. Return strict JSON only.'
      },
      {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: { url: `data:application/pdf;base64,${pdfBase64}`, detail: 'high' }
          },
          { type: 'text', text: prompt }
        ]
      }
    ]
  });
  const txt = chat.choices[0]?.message?.content || '';
  const result = extractGradingResult(txt);
  if (!result) throw new Error('Copilot returned no valid grading result');
  return result;
}

/* ─── Main handler ─── */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('pdf') as File | null;
    const subject = formData.get('subject') as string;
    const level = formData.get('level') as string;

    if (!file || !subject || !level) {
      return NextResponse.json({ error: 'pdf file, subject, and level are required' }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are accepted' }, { status: 400 });
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large. Maximum size is 10MB.' }, { status: 400 });
    }

    const settings = await getAISettings();
    const active = getActiveKey(settings);

    if (!active) {
      return NextResponse.json(
        { error: 'No AI provider configured. Ask your admin to set up an API key in the admin panel.' },
        { status: 503 }
      );
    }

    const buffer = await file.arrayBuffer();
    const pdfBase64 = Buffer.from(buffer).toString('base64');
    const prompt = buildPrompt(subject, level);

    let grading: GradingResult;

    switch (active.provider) {
      case 'claude':
        grading = await gradeWithClaude(pdfBase64, prompt, active.key);
        break;
      case 'openai':
        grading = await gradeWithOpenAI(pdfBase64, prompt, active.key);
        break;
      case 'gemini':
        grading = await gradeWithGemini(pdfBase64, prompt, active.key);
        break;
      case 'copilot':
        grading = await gradeWithCopilot(pdfBase64, prompt, active.key);
        break;
      default:
        return NextResponse.json({ error: 'Unknown AI provider' }, { status: 500 });
    }

    return NextResponse.json({ grading, provider: active.provider });
  } catch (e: any) {
    console.error('PDF grading error:', e.message);
    return NextResponse.json(
      { error: e.message || 'Failed to grade PDF. Please try again.' },
      { status: 500 }
    );
  }
}
