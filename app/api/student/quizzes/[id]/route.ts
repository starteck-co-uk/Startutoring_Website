import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabase, getSupabase } from '@/lib/supabase';
import { demoAdminQuizStore } from '@/lib/demo-data';

// Returns quiz + questions WITHOUT correct answers/explanations (for taking the quiz)
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const sb = getAdminSupabase() || getSupabase();
  if (sb) {
    try {
      const { data: quiz } = await sb.from('quizzes').select('*').eq('id', params.id).eq('status', 'published').single();
      if (!quiz) return NextResponse.json({ error: 'Quiz not found or not published' }, { status: 404 });

      const { data: questions } = await sb
        .from('quiz_questions')
        .select('id, question_order, text, options')
        .eq('quiz_id', params.id)
        .order('question_order');

      return NextResponse.json({ quiz, questions: questions || [] });
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }

  // Demo mode
  const quiz = demoAdminQuizStore.quizById(params.id);
  if (!quiz || quiz.status !== 'published') {
    return NextResponse.json({ error: 'Quiz not found or not published' }, { status: 404 });
  }

  const questions = demoAdminQuizStore.questionsByQuiz(params.id).map((q) => ({
    id: q.id,
    question_order: q.question_order,
    text: q.text,
    options: q.options
    // No correct or explanation — hidden until graded
  }));

  return NextResponse.json({ quiz, questions });
}
