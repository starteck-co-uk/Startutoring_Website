import { NextRequest, NextResponse } from 'next/server';
import { getFallback } from '@/lib/fallback-questions';

export async function POST(req: NextRequest) {
  try {
    const { subject, level, count = 20 } = await req.json();
    if (!subject || !level) {
      return NextResponse.json({ error: 'subject and level required' }, { status: 400 });
    }

    const questions = getFallback(subject, level, count);
    return NextResponse.json({ questions, source: 'question-bank' });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
}
