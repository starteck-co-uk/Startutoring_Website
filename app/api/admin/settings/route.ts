import { NextRequest, NextResponse } from 'next/server';
import { getAISettings, saveAISettings } from '@/lib/ai-settings';

export async function GET() {
  try {
    const settings = await getAISettings();
    // Mask keys for security — only show last 4 chars
    const mask = (k: string) => (k ? '•'.repeat(Math.max(0, k.length - 4)) + k.slice(-4) : '');
    return NextResponse.json({
      provider: settings.provider,
      claude_key: mask(settings.claude_key),
      openai_key: mask(settings.openai_key),
      gemini_key: mask(settings.gemini_key),
      copilot_key: mask(settings.copilot_key),
      has_claude: !!settings.claude_key,
      has_openai: !!settings.openai_key,
      has_gemini: !!settings.gemini_key,
      has_copilot: !!settings.copilot_key
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const updated = await saveAISettings({
      provider: body.provider,
      claude_key: body.claude_key,
      openai_key: body.openai_key,
      gemini_key: body.gemini_key,
      copilot_key: body.copilot_key
    });
    return NextResponse.json({ ok: true, provider: updated.provider });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
