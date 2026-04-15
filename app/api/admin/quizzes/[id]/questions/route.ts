import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabase, getSupabase } from '@/lib/supabase';
import { demoAdminQuizStore } from '@/lib/demo-data';

// Replace all questions for a quiz
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { questions } = await req.json();
    if (!Array.isArray(questions)) {
      return NextResponse.json({ error: 'questions array required' }, { status: 400 });
    }

    const sb = getAdminSupabase() || getSupabase();
    if (sb) {
      // Delete old questions
      await sb.from('quiz_questions').delete().eq('quiz_id', params.id);
      // Insert new
      const rows = questions.map((q: any, i: number) => ({
        quiz_id: params.id,
        question_order: i + 1,
        text: q.text,
        options: q.options,
        correct: q.correct,
        explanation: q.explanation
      }));
      const { data, error } = await sb.from('quiz_questions').insert(rows).select();
      if (error) throw error;
      // Update question_count
      await sb.from('quizzes').update({ question_count: rows.length, updated_at: new Date().toISOString() }).eq('id', params.id);
      return NextResponse.json({ questions: data || [] });
    }

    const saved = demoAdminQuizStore.setQuestions(params.id, questions);
    return NextResponse.json({ questions: saved });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
}
