import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabase, getSupabase } from '@/lib/supabase';
import { demoWeeklyTestStore } from '@/lib/demo-data';

// GET — list all weekly tests
export async function GET() {
  const sb = getAdminSupabase() || getSupabase();
  if (sb) {
    try {
      const { data } = await sb.from('weekly_tests').select('*').order('created_at', { ascending: false });
      return NextResponse.json({ tests: data || [] });
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
