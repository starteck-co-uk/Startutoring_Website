import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabase, getSupabase } from '@/lib/supabase';
import { demoQuizStore } from '@/lib/demo-data';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const required = ['student_id', 'subject', 'level', 'score', 'total'];
    for (const k of required) {
      if (body[k] === undefined) {
        return NextResponse.json({ error: `${k} required` }, { status: 400 });
      }
    }

    const row = {
      student_id: body.student_id,
      subject: body.subject,
      level: body.level,
      title: body.title || `${body.subject} Quiz — ${body.level}`,
      score: Number(body.score),
      total: Number(body.total),
      time_taken_secs: Number(body.time_taken_secs || 0),
      questions: body.questions || []
    };

    const sb = getAdminSupabase() || getSupabase();
    if (sb) {
      const { data, error } = await sb.from('quiz_results').insert(row).select().single();
      if (error) throw error;
      return NextResponse.json({ result: data });
    }

    const saved = demoQuizStore.insert(row);
    return NextResponse.json({ result: saved });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
}
