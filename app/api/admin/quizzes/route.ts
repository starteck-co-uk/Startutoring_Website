import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabase, getSupabase } from '@/lib/supabase';
import { demoAdminQuizStore } from '@/lib/demo-data';

export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get('status');

  const sb = getAdminSupabase() || getSupabase();
  if (sb) {
    try {
      let query = sb.from('quizzes').select('*').order('created_at', { ascending: false });
      if (status) query = query.eq('status', status);
      const { data } = await query;
      return NextResponse.json({ quizzes: data || [] });
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }

  let quizzes = demoAdminQuizStore.allQuizzes();
  if (status) quizzes = quizzes.filter((q) => q.status === status);
  return NextResponse.json({ quizzes });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, subject, level, topic, created_by } = body;
    if (!title || !subject || !level) {
      return NextResponse.json({ error: 'title, subject, and level required' }, { status: 400 });
    }

    const row = { title, subject, level, topic: topic || null, created_by: created_by || null, status: 'draft', question_count: 0 };

    const sb = getAdminSupabase() || getSupabase();
    if (sb) {
      const { data, error } = await sb.from('quizzes').insert(row).select().single();
      if (error) throw error;
      return NextResponse.json({ quiz: data });
    }

    const saved = demoAdminQuizStore.insertQuiz(row);
    return NextResponse.json({ quiz: saved });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
}
