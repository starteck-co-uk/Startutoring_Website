import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabase, getSupabase } from '@/lib/supabase';
import { demoWeeklyTestStore } from '@/lib/demo-data';

// GET — list all weekly tests with attempt stats
export async function GET() {
  const sb = getAdminSupabase() || getSupabase();
  if (sb) {
    try {
      const { data: tests } = await sb.from('weekly_tests').select('*').order('created_at', { ascending: false });
      // Fetch attempt stats for all tests
      const { data: attempts } = await sb.from('weekly_test_attempts')
        .select('test_id, total_percentage, completed')
        .eq('completed', true);
      // Build stats map
      const statsMap: Record<string, { attempt_count: number; avg_score: number }> = {};
      for (const a of (attempts || [])) {
        if (!statsMap[a.test_id]) statsMap[a.test_id] = { attempt_count: 0, avg_score: 0 };
        statsMap[a.test_id].attempt_count += 1;
        statsMap[a.test_id].avg_score += (a.total_percentage || 0);
      }
      for (const id of Object.keys(statsMap)) {
        statsMap[id].avg_score = Math.round(statsMap[id].avg_score / statsMap[id].attempt_count);
      }
      const enriched = (tests || []).map(t => ({
        ...t,
        attempt_count: statsMap[t.id]?.attempt_count || 0,
        avg_score: statsMap[t.id]?.avg_score || 0
      }));
      return NextResponse.json({ tests: enriched });
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }
  return NextResponse.json({ tests: demoWeeklyTestStore.allTests() });
}

// POST — create a new weekly test
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, level, week_start, sections } = body;

    if (!title || !level) {
      return NextResponse.json({ error: 'title and level required' }, { status: 400 });
    }

    const sb = getAdminSupabase() || getSupabase();
    if (sb) {
      const { data, error } = await sb.from('weekly_tests').insert({
        title, level,
        week_start: week_start || new Date().toISOString(),
        sections: sections || [],
        status: 'draft'
      }).select().single();
      if (error) throw error;
      return NextResponse.json({ test: data });
    }

    const test = demoWeeklyTestStore.insertTest({ title, level, week_start, sections });
    return NextResponse.json({ test });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
}
