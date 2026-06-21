import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { demoWeeklyTestStore } from '@/lib/demo-data';

function getMonday(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = (day + 6) % 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() - diff);
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString();
}

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

      // Get all attempts for this student
      const { data: attempts } = await sb.from('weekly_test_attempts')
        .select('*')
        .eq('student_id', studentId);

      const attemptMap = new Map((attempts || []).map((a: any) => [a.test_id, a]));

      const enriched = (tests || []).map((t: any) => ({
        ...t,
        attempt: attemptMap.get(t.id) || null
      }));

      // Count completed attempts this week (Monday-based)
      const mondayISO = getMonday();
      const thisWeekCount = (attempts || []).filter(
        (a: any) => a.completed && a.started_at >= mondayISO
      ).length;

      return NextResponse.json({
        tests: enriched,
        tests_this_week: thisWeekCount,
        max_per_week: 2
      });
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

  const weeklyAttempts = demoWeeklyTestStore.attemptsThisWeek(studentId);

  return NextResponse.json({
    tests: enriched,
    tests_this_week: weeklyAttempts.length,
    max_per_week: 2
  });
}
