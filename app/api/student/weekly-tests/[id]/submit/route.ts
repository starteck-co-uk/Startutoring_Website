import { NextRequest, NextResponse } from 'next/server';
import { getSupabase, getAdminSupabase } from '@/lib/supabase';
import { demoWeeklyTestStore } from '@/lib/demo-data';
import type { SectionResult } from '@/lib/types';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const body = await req.json();
    const { student_id, section_answers, time_taken_secs } = body;

    if (!student_id || !section_answers) {
      return NextResponse.json({ error: 'student_id and section_answers required' }, { status: 400 });
    }

    // Check weekly limit
    const sb = getAdminSupabase() || getSupabase();

    if (sb) {
      // Supabase mode

      // Prevent double submission of same test
      const { data: existing } = await sb.from('weekly_test_attempts')
        .select('id')
        .eq('student_id', student_id)
        .eq('test_id', id)
        .eq('completed', true)
        .limit(1);
      if (existing && existing.length > 0) {
        return NextResponse.json({ error: 'You have already submitted this test' }, { status: 409 });
      }

      // Check weekly limit
      const now = new Date();
      const monday = new Date(now);
      monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
      monday.setHours(0, 0, 0, 0);

      const { data: weekAttempts } = await sb.from('weekly_test_attempts')
        .select('id')
        .eq('student_id', student_id)
        .eq('completed', true)
        .gte('started_at', monday.toISOString());

      if ((weekAttempts || []).length >= 2) {
        return NextResponse.json({ error: 'Weekly test limit reached (2 per week)' }, { status: 429 });
      }

      // Get full test to grade
      const { data: test } = await sb.from('weekly_tests').select('*').eq('id', id).single();
      if (!test) return NextResponse.json({ error: 'Test not found' }, { status: 404 });

      const graded = gradeTest(test.sections, section_answers);

      const submittedAt = new Date();
      const startedAt = new Date(submittedAt.getTime() - (time_taken_secs || 0) * 1000);

      const { data: attempt, error } = await sb.from('weekly_test_attempts').insert({
        test_id: id,
        student_id,
        section_results: graded.section_results,
        total_score: graded.total_score,
        total_questions: graded.total_questions,
        total_percentage: graded.total_percentage,
        time_taken_secs: time_taken_secs || 0,
        completed: true,
        started_at: startedAt.toISOString(),
        submitted_at: submittedAt.toISOString()
      }).select().single();

      if (error) throw error;
      return NextResponse.json({ attempt, test });
    }

    // Demo mode — prevent double submission
    const existingAttempt = demoWeeklyTestStore.attemptsByStudent(student_id)
      .find(a => a.test_id === id && a.completed);
    if (existingAttempt) {
      return NextResponse.json({ error: 'You have already submitted this test' }, { status: 409 });
    }

    const weekAttempts = demoWeeklyTestStore.attemptsThisWeek(student_id);
    if (weekAttempts.length >= 2) {
      return NextResponse.json({ error: 'Weekly test limit reached (2 per week)' }, { status: 429 });
    }

    const test = demoWeeklyTestStore.testById(id);
    if (!test) return NextResponse.json({ error: 'Test not found' }, { status: 404 });

    const graded = gradeTest(test.sections, section_answers);

    const attempt = demoWeeklyTestStore.insertAttempt({
      test_id: id,
      student_id,
      section_results: graded.section_results,
      total_score: graded.total_score,
      total_questions: graded.total_questions,
      total_percentage: graded.total_percentage,
      time_taken_secs: time_taken_secs || 0,
      completed: true
    });

    return NextResponse.json({ attempt, test });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
}

function gradeTest(
  sections: any[],
  sectionAnswers: Record<string, Array<{ question_index: number; selected: number | null }>>
) {
  let totalScore = 0;
  let totalQuestions = 0;
  const sectionResults: SectionResult[] = [];

  for (const section of sections) {
    const answers = sectionAnswers[section.id] || [];
    let sectionScore = 0;
    const sectionTotal = section.questions.length;

    for (const ans of answers) {
      const q = section.questions[ans.question_index];
      if (q && ans.selected === q.correct) {
        sectionScore++;
      }
    }

    totalScore += sectionScore;
    totalQuestions += sectionTotal;

    sectionResults.push({
      section_id: section.id,
      subject: section.subject,
      topic_id: section.topic_id,
      topic_name: section.topic_name,
      answers,
      score: sectionScore,
      total: sectionTotal,
      percentage: sectionTotal > 0 ? Math.round((sectionScore / sectionTotal) * 100) : 0
    });
  }

  return {
    section_results: sectionResults,
    total_score: totalScore,
    total_questions: totalQuestions,
    total_percentage: totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0
  };
}
