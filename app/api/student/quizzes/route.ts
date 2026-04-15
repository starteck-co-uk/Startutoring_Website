import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabase, getSupabase } from '@/lib/supabase';
import { demoAdminQuizStore } from '@/lib/demo-data';

export async function GET(req: NextRequest) {
  const level = req.nextUrl.searchParams.get('level');
  const studentId = req.nextUrl.searchParams.get('student_id');

  if (!level || !studentId) {
    return NextResponse.json({ error: 'level and student_id required' }, { status: 400 });
  }

  const sb = getAdminSupabase() || getSupabase();
  if (sb) {
    try {
      const { data: quizzes } = await sb
        .from('quizzes')
        .select('*')
        .eq('level', level)
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      const { data: attempts } = await sb
        .from('quiz_attempts')
        .select('quiz_id, score, total, percentage, graded')
        .eq('student_id', studentId);

      const attemptMap = new Map((attempts || []).map((a: any) => [a.quiz_id, a]));

      const enriched = (quizzes || []).map((q: any) => {
        const attempt = attemptMap.get(q.id);
        return {
          ...q,
          attempted: !!attempt,
          score: attempt?.score,
          total: attempt?.total,
          percentage: attempt?.percentage,
          graded: attempt?.graded
        };
      });

      return NextResponse.json({ quizzes: enriched });
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }

  // Demo mode
  const quizzes = demoAdminQuizStore.publishedForLevel(level);
  const enriched = quizzes.map((q) => {
    const attempt = demoAdminQuizStore.attemptByStudentQuiz(studentId, q.id);
    return {
      ...q,
      attempted: !!attempt,
      score: attempt?.score,
      total: attempt?.total,
      percentage: attempt?.percentage,
      graded: attempt?.graded
    };
  });

  return NextResponse.json({ quizzes: enriched });
}
