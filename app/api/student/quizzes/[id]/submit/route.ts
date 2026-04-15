import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabase, getSupabase } from '@/lib/supabase';
import { demoAdminQuizStore } from '@/lib/demo-data';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { student_id, answers, time_taken_secs } = await req.json();
    if (!student_id || !answers) {
      return NextResponse.json({ error: 'student_id and answers required' }, { status: 400 });
    }

    const sb = getAdminSupabase() || getSupabase();

    // Get correct answers to grade
    let correctAnswers: Array<{ id: string; correct: number }>;

    if (sb) {
      const { data } = await sb
        .from('quiz_questions')
        .select('id, correct')
        .eq('quiz_id', params.id)
        .order('question_order');
      correctAnswers = data || [];
    } else {
      correctAnswers = demoAdminQuizStore.questionsByQuiz(params.id).map((q) => ({
        id: q.id,
        correct: q.correct
      }));
    }

    if (correctAnswers.length === 0) {
      return NextResponse.json({ error: 'Quiz has no questions' }, { status: 404 });
    }

    // Grade
    const total = correctAnswers.length;
    let score = 0;
    const correctMap = new Map(correctAnswers.map((c) => [c.id, c.correct]));

    for (const ans of answers) {
      if (correctMap.has(ans.question_id) && ans.selected === correctMap.get(ans.question_id)) {
        score++;
      }
    }

    const attempt = {
      quiz_id: params.id,
      student_id,
      answers,
      score,
      total,
      graded: true,
      time_taken_secs: time_taken_secs || 0,
      submitted_at: new Date().toISOString()
    };

    if (sb) {
      const { data, error } = await sb.from('quiz_attempts').insert(attempt).select().single();
      if (error) throw error;
      return NextResponse.json({ attempt: data });
    }

    const saved = demoAdminQuizStore.insertAttempt(attempt);
    demoAdminQuizStore.gradeAttempt(saved.id, score, total);
    return NextResponse.json({ attempt: { ...saved, score, total, graded: true, percentage: Math.round((score / total) * 100) } });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
}
