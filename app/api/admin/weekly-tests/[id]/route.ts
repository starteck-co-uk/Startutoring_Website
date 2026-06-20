import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabase, getSupabase } from '@/lib/supabase';
import { demoWeeklyTestStore } from '@/lib/demo-data';

// GET — single test with sections
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sb = getAdminSupabase() || getSupabase();
  if (sb) {
    try {
      const { data } = await sb.from('weekly_tests').select('*').eq('id', id).single();
      return NextResponse.json({ test: data });
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }
  const test = demoWeeklyTestStore.testById(id);
  if (!test) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ test });
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
