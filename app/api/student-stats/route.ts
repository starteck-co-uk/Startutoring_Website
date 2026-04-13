import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { demoQuizStore } from '@/lib/demo-data';

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  let rows: any[] = [];
  const sb = getSupabase();
  if (sb) {
    const { data } = await sb
      .from('quiz_results')
      .select('*')
      .eq('student_id', id)
      .order('created_at', { ascending: false })
      .limit(50);
    rows = data || [];
  } else {
    rows = demoQuizStore.byStudent(id);
  }

  const totals = {
    count: rows.length,
    avg: rows.length ? rows.reduce((a, r) => a + (r.percentage || 0), 0) / rows.length : 0,
    totalQuestions: rows.reduce((a, r) => a + (r.total || 0), 0),
    bestSubject: '—'
  };

  const bySubject: Record<string, { count: number; avg: number; trend: number }> = {};
  for (const r of rows) {
    const s = r.subject;
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
