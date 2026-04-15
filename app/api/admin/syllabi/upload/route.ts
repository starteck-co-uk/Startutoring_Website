import { NextRequest, NextResponse } from 'next/server';
import { getAISettings, getActiveKey } from '@/lib/ai-settings';
import { callProvider } from '@/lib/ai-generate';
import { getAdminSupabase, getSupabase } from '@/lib/supabase';
import { demoSyllabiStore } from '@/lib/demo-data';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('pdf') as File | null;
    const subject = formData.get('subject') as string;
    const level = formData.get('level') as string;
    const title = formData.get('title') as string;

    if (!file || !subject || !level || !title) {
      return NextResponse.json({ error: 'pdf, subject, level, and title are required' }, { status: 400 });
    }

    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Max 15MB.' }, { status: 400 });
    }

    const settings = await getAISettings();
    const active = getActiveKey(settings);

    if (!active) {
      return NextResponse.json({ error: 'No AI provider configured. Set up an API key first.' }, { status: 503 });
    }

    const buffer = await file.arrayBuffer();
    const pdfBase64 = Buffer.from(buffer).toString('base64');

    // Use AI to extract and structure the syllabus content
    const extractPrompt = `Extract and structure the syllabus content from this PDF for ${level} ${subject} (UK National Curriculum).

Organise the content into clear topics and subtopics. Include:
- Main topic headings
- Key learning objectives under each topic
- Any specific skills or knowledge requirements mentioned

Return the content as structured plain text (NOT JSON), with clear headings and bullet points. Keep all the educational content — do not summarise away important details.`;

    let content: string;

    if (active.provider === 'claude') {
      const Anthropic = (await import('@anthropic-ai/sdk')).default;
      const client = new Anthropic({ apiKey: active.key });
      const msg = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8192,
        messages: [{
          role: 'user',
          content: [
            { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: pdfBase64 } } as any,
            { type: 'text', text: extractPrompt }
          ]
        }]
      });
      content = msg.content.filter((b: any) => b.type === 'text').map((b: any) => b.text).join('\n');
    } else if (active.provider === 'gemini') {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(active.key);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent([
        { inlineData: { mimeType: 'application/pdf', data: pdfBase64 } },
        { text: extractPrompt }
      ]);
      content = result.response.text();
    } else {
      // OpenAI/Copilot — send as image_url
      const OpenAI = (await import('openai')).default;
      const client = active.provider === 'copilot'
        ? new OpenAI({ apiKey: active.key, baseURL: 'https://models.inference.ai.azure.com' })
        : new OpenAI({ apiKey: active.key });
      const chat = await client.chat.completions.create({
        model: 'gpt-4o',
        max_tokens: 8192,
        messages: [{
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: `data:application/pdf;base64,${pdfBase64}`, detail: 'high' } },
            { type: 'text', text: extractPrompt }
          ]
        }]
      });
      content = chat.choices[0]?.message?.content || '';
    }

    if (!content || content.length < 50) {
      return NextResponse.json({ error: 'Could not extract meaningful content from the PDF.' }, { status: 422 });
    }

    const row = {
      subject, level, title, content,
      file_name: file.name,
      file_size: file.size
    };

    const sb = getAdminSupabase() || getSupabase();
    if (sb) {
      const { data, error } = await sb
        .from('syllabi')
        .upsert({ ...row, updated_at: new Date().toISOString() }, { onConflict: 'subject,level' })
        .select()
        .single();
      if (error) throw error;
      return NextResponse.json({ syllabus: data });
    }

    const saved = demoSyllabiStore.upsert(row);
    return NextResponse.json({ syllabus: saved });
  } catch (e: any) {
    console.error('Syllabus upload error:', e.message);
    return NextResponse.json({ error: e.message || 'Failed to process syllabus' }, { status: 500 });
  }
}
