import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { demoWeeklyTestStore } from '@/lib/demo-data';

// GET — list published weekly tests for a student's level + their attempt status
export async function GET(req: NextRequest) {
  const level = req.nextUrl.searchParams.get('level') || '';
  const studentId = req.nextUrl.searchParams.get('student_id') || '';

  const sb = getSupabase();
  if (sb) {
    try {
      const { data: tests } = await sb.from('weekly_tests')
        .select('*')
        .eq('status', 'published')
        .eq('level', level)
        .order('week_start', { ascending: false });

      // Get attempts for this student
      const { data: attempts } = await sb.from('weekly_test_attempts')
        .select('*')
        .eq('student_id', studentId);

      const attemptMap = new Map((attempts || []).map((a: any) => [a.test_id, a]));

      const enriched = (tests || []).map((t: any) => ({
        ...t,
        attempt: attemptMap.get(t.id) || null
      }));

      return NextResponse.json({ tests: enriched });
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }

  // Demo mode
  const tests = demoWeeklyTestStore.publishedForLevel(level);
  const enriched = tests.map(t => {
    const attempt = demoWeeklyTestStore.attemptByStudentTest(studentId, t.id);
    return { ...t, attempt };
  });

  // Count attempts this week
  const weeklyAttempts = demoWeeklyTestStore.attemptsThisWeek(studentId);

  return NextResponse.json({
    tests: enriched,
    tests_this_week: weeklyAttempts.length,
    max_per_week: 2
  });
}
