import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabase, getSupabase } from '@/lib/supabase';
import { DEMO_STUDENTS } from '@/lib/demo-data';

// GET — list all students/parents
export async function GET() {
  const sb = getAdminSupabase() || getSupabase();
  if (sb) {
    try {
      const { data } = await sb.from('students').select('*').order('created_at', { ascending: false });
      return NextResponse.json({ students: data || [] });
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }
  return NextResponse.json({ students: DEMO_STUDENTS });
}

// POST — create new student/parent
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, pin, role } = body;

    if (!name || !email || !pin || !role) {
      return NextResponse.json({ error: 'name, email, pin, and role required' }, { status: 400 });
    }

    if (!['student', 'parent', 'admin'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    const row: any = {
      name,
      email: email.toLowerCase().trim(),
      pin,
      role,
      grade: body.grade || null,
      parent_id: body.parent_id || null,
      avatar: body.avatar || name[0]?.toUpperCase(),
      phone: body.phone || null,
      school_name: body.school_name || null,
      subjects: body.subjects || [],
      strengths: body.strengths || null,
      areas_to_improve: body.areas_to_improve || null,
      medical_notes: body.medical_notes || null,
      admin_notes: body.admin_notes || null,
      status: body.status || 'active'
    };

    const sb = getAdminSupabase() || getSupabase();
    if (sb) {
      const { data, error } = await sb.from('students').insert(row).select().single();
      if (error) {
        if (error.code === '23505') {
          return NextResponse.json({ error: 'A user with this email already exists' }, { status: 409 });
        }
        throw error;
      }
      return NextResponse.json({ student: data });
    }

    // Demo mode — push to in-memory array (won't persist across cold starts)
    const newStudent = { id: `demo-${Date.now()}`, ...row, created_at: new Date().toISOString() };
    DEMO_STUDENTS.push(newStudent);
    return NextResponse.json({ student: newStudent });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
}
