import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { demoQuizStore, demoWeeklyTestStore } from '@/lib/demo-data';

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  let rows: any[] = [];
  const sb = getSupabase();

  if (sb) {
    // Get regular quiz results
    const { data: quizData } = await sb
      .from('quiz_results')
      .select('*')
      .eq('student_id', id)
      .order('created_at', { ascending: false })
      .limit(50);

    // Get weekly test attempts
    const { data: weeklyData } = await sb
      .from('weekly_test_attempts')
      .select('*')
      .eq('student_id', id)
      .eq('completed', true)
      .order('submitted_at', { ascending: false })
      .limit(50);

    rows = quizData || [];

    // Convert weekly test section results into individual subject rows for analytics
    for (const attempt of (weeklyData || [])) {
      for (const sr of (attempt.section_results || [])) {
        rows.push({
          id: `${attempt.id}-${sr.section_id}`,
          student_id: id,
          subject: sr.subject,
          level: '',
          title: `Weekly Test — ${sr.topic_name}`,
          score: sr.score,
          total: sr.total,
          percentage: sr.percentage,
          time_taken_secs: attempt.time_taken_secs,
          created_at: attempt.submitted_at || attempt.started_at,
          source: 'weekly-test'
        });
      }
    }
  } else {
    // Demo mode — combine quiz results + weekly test attempts
    rows = [...demoQuizStore.byStudent(id)];

    const weeklyAttempts = demoWeeklyTestStore.attemptsByStudent(id)
      .filter(a => a.completed);

    for (const attempt of weeklyAttempts) {
      for (const sr of (attempt.section_results || [])) {
        rows.push({
          id: `${attempt.id}-${sr.section_id}`,
          student_id: id,
          subject: sr.subject,
          level: '',
          title: `Weekly Test — ${sr.topic_name}`,
          score: sr.score,
          total: sr.total,
          percentage: sr.percentage,
          time_taken_secs: attempt.time_taken_secs,
          created_at: attempt.submitted_at || attempt.started_at,
          source: 'weekly-test'
        });
      }
    }
  }

  // Sort all rows by date (most recent first)
  rows.sort((a, b) => {
    const da = new Date(a.created_at || 0).getTime();
    const db = new Date(b.created_at || 0).getTime();
    return db - da;
  });

  // Compute totals
  const totals = {
    count: rows.length,
    avg: rows.length ? rows.reduce((a, r) => a + (r.percentage || 0), 0) / rows.length : 0,
    totalQuestions: rows.reduce((a, r) => a + (r.total || 0), 0),
    bestSubject: '—'
  };

  // Compute per-subject breakdown
  const bySubject: Record<string, { count: number; avg: number; trend: number }> = {};
  for (const r of rows) {
    const s = r.subject;
    if (!s) continue;
    if (!bySubject[s]) bySubject[s] = { count: 0, avg: 0, trend: 0 };
    bySubject[s].count += 1;
    bySubject[s].avg += r.percentage || 0;
  }
  for (const s of Object.keys(bySubject)) {
    bySubject[s].avg = bySubject[s].avg / bySubject[s].count;
    const subjectRows = rows.filter((r) => r.subject === s);
    if (subjectRows.length >= 2) {
      const recent = subjectRows[0].percentage || 0;
      const prev = subjectRows[subjectRows.length - 1].percentage || 0;
      bySubject[s].trend = recent - prev;
    }
  }

  const best = Object.entries(bySubject).sort((a, b) => b[1].avg - a[1].avg)[0];
  if (best) totals.bestSubject = best[0];

  return NextResponse.json({ recent: rows, bySubject, totals });
}
