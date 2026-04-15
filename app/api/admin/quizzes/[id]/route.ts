import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabase, getSupabase } from '@/lib/supabase';
import { demoAdminQuizStore } from '@/lib/demo-data';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const sb = getAdminSupabase() || getSupabase();
  if (sb) {
    try {
      const { data: quiz } = await sb.from('quizzes').select('*').eq('id', params.id).single();
      if (!quiz) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      const { data: questions } = await sb.from('quiz_questions').select('*').eq('quiz_id', params.id).order('question_order');
      return NextResponse.json({ quiz, questions: questions || [] });
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }

  const quiz = demoAdminQuizStore.quizById(params.id);
  if (!quiz) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const questions = demoAdminQuizStore.questionsByQuiz(params.id);
  return NextResponse.json({ quiz, questions });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const patch: any = {};
    if (body.title !== undefined) patch.title = body.title;
    if (body.topic !== undefined) patch.topic = body.topic;
    if (body.status !== undefined) {
      patch.status = body.status;
      if (body.status === 'published') patch.published_at = new Date().toISOString();
      if (body.status === 'closed') patch.closed_at = new Date().toISOString();
    }
    patch.updated_at = new Date().toISOString();

    const sb = getAdminSupabase() || getSupabase();
    if (sb) {
      const { data, error } = await sb.from('quizzes').update(patch).eq('id', params.id).select().single();
      if (error) throw error;
      return NextResponse.json({ quiz: data });
    }

    const updated = demoAdminQuizStore.updateQuiz(params.id, patch);
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ quiz: updated });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const sb = getAdminSupabase() || getSupabase();
  if (sb) {
    await sb.from('quizzes').delete().eq('id', params.id);
    return NextResponse.json({ ok: true });
  }

  demoAdminQuizStore.deleteQuiz(params.id);
  return NextResponse.json({ ok: true });
}
