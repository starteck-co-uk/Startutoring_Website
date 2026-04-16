import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabase, getSupabase } from '@/lib/supabase';
import { DEMO_STUDENTS } from '@/lib/demo-data';

// GET single student
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const sb = getAdminSupabase() || getSupabase();
  if (sb) {
    try {
      const { data } = await sb.from('students').select('*').eq('id', params.id).single();
      if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      return NextResponse.json({ student: data });
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }
  const student = DEMO_STUDENTS.find((s) => s.id === params.id);
  if (!student) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ student });
}

// PATCH — update student
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const allowed = [
      'name', 'email', 'pin', 'role', 'grade', 'parent_id', 'avatar',
      'phone', 'school_name', 'subjects', 'strengths', 'areas_to_improve',
      'medical_notes', 'admin_notes', 'status'
    ];
    const patch: any = {};
    for (const k of allowed) {
      if (body[k] !== undefined) patch[k] = body[k];
    }
    if (patch.email) patch.email = patch.email.toLowerCase().trim();

    const sb = getAdminSupabase() || getSupabase();
    if (sb) {
      const { data, error } = await sb.from('students').update(patch).eq('id', params.id).select().single();
      if (error) {
        if (error.code === '23505') {
          return NextResponse.json({ error: 'A user with this email already exists' }, { status: 409 });
        }
        throw error;
      }
      return NextResponse.json({ student: data });
    }

    const student = DEMO_STUDENTS.find((s) => s.id === params.id);
    if (!student) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    Object.assign(student, patch);
    return NextResponse.json({ student });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
}

// DELETE student
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const sb = getAdminSupabase() || getSupabase();
  if (sb) {
    await sb.from('students').delete().eq('id', params.id);
    return NextResponse.json({ ok: true });
  }
  const idx = DEMO_STUDENTS.findIndex((s) => s.id === params.id);
  if (idx >= 0) DEMO_STUDENTS.splice(idx, 1);
  return NextResponse.json({ ok: true });
}
