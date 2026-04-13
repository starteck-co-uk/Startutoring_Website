import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabase, getSupabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const required = ['learner_name', 'parent_name', 'phone', 'email'];
    for (const k of required) {
      if (!body[k]) {
        return NextResponse.json({ error: `${k} is required` }, { status: 400 });
      }
    }

    const row = {
      learner_name: body.learner_name,
      academic_year: body.academic_year || '',
      parent_name: body.parent_name,
      school_name: body.school_name || '',
      course: body.course || '',
      subjects: body.subjects || [],
      good_at: body.good_at || '',
      improve: body.improve || '',
      other_info: body.other_info || '',
      medical: body.medical || '',
      phone: body.phone,
      email: body.email,
      status: 'pending'
    };

    const sb = getAdminSupabase() || getSupabase();
    if (sb) {
      const { data, error } = await sb.from('assessments').insert(row).select().single();
      if (error) throw error;
      return NextResponse.json({ ok: true, assessment: data });
    }

    // demo mode: just acknowledge
    return NextResponse.json({ ok: true, assessment: { ...row, id: 'demo', created_at: new Date().toISOString() } });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
}
