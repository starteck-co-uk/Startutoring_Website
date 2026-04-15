import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabase, getSupabase } from '@/lib/supabase';
import { demoAdminQuizStore } from '@/lib/demo-data';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const studentId = req.nextUrl.searchParams.get('student_id');
  if (!studentId) {
    return NextResponse.json({ error: 'student_id required' }, { status: 400 });
  }

  const sb = getAdminSupabase() || getSupabase();
  if (sb) {
    try {
      const { data: attempt } = await sb
        .from('quiz_attempts')
        .select('*')
        .eq('quiz_id', params.id)
        .eq('student_id', studentId)
        .single();

      if (!attempt || !attempt.graded) {
        return NextResponse.json({ error: 'No graded attempt found' }, { status: 404 });
      }

      const { data: questions } = await sb
        .from('quiz_questions')
        .select('*')
        .eq('quiz_id', params.id)
        .order('question_order');

      const { data: quiz } = await sb.from('quizzes').select('*').eq('id', params.id).single();

      return NextResponse.json({ attempt, questions: questions || [], quiz });
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }

  // Demo mode
  const attempt = demoAdminQuizStore.attemptByStudentQuiz(studentId, params.id);
  if (!attempt || !attempt.graded) {
    return NextResponse.json({ error: 'No graded attempt found' }, { status: 404 });
  }

  const questions = demoAdminQuizStore.questionsByQuiz(params.id);
  const quiz = demoAdminQuizStore.quizById(params.id);

  return NextResponse.json({ attempt, questions, quiz });
}
