import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabase, getSupabase } from '@/lib/supabase';
import { demoWeeklyTestStore } from '@/lib/demo-data';

// GET — single test with sections + attempt stats
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sb = getAdminSupabase() || getSupabase();
  if (sb) {
    try {
      const { data } = await sb.from('weekly_tests').select('*').eq('id', id).single();
      // Also fetch attempts for this test
      const { data: attempts } = await sb.from('weekly_test_attempts')
        .select('id, student_id, total_score, total_questions, total_percentage, time_taken_secs, completed, submitted_at')
        .eq('test_id', id)
        .eq('completed', true)
        .order('submitted_at', { ascending: false });
      // Get student names for attempts
      const studentIds = [...new Set((attempts || []).map((a: any) => a.student_id))];
      let students: any[] = [];
      if (studentIds.length > 0) {
        const { data: sData } = await sb.from('students').select('id, name').in('id', studentIds);
        students = sData || [];
      }
      const studentMap = new Map(students.map((s: any) => [s.id, s.name]));
      const enrichedAttempts = (attempts || []).map((a: any) => ({
        ...a,
        student_name: studentMap.get(a.student_id) || 'Unknown'
      }));
      return NextResponse.json({ test: data, attempts: enrichedAttempts });
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }
  const test = demoWeeklyTestStore.testById(id);
  if (!test) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const attempts = demoWeeklyTestStore.attemptsByStudent('').length > 0 ? [] : []; // demo: no easy way to get all attempts for a test
  return NextResponse.json({ test, attempts });
}

// PATCH — update test (title, sections, status)
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const sb = getAdminSupabase() || getSupabase();
    if (sb) {
      const { data, error } = await sb.from('weekly_tests')
        .update({ ...body, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return NextResponse.json({ test: data });
    }
    const test = demoWeeklyTestStore.updateTest(id, body);
    if (!test) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ test });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// DELETE
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sb = getAdminSupabase() || getSupabase();
  if (sb) {
    try {
      await sb.from('weekly_tests').delete().eq('id', id);
      return NextResponse.json({ ok: true });
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }
  demoWeeklyTestStore.deleteTest(id);
  return NextResponse.json({ ok: true });
}
