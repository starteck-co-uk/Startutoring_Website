import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { DEMO_STUDENTS } from '@/lib/demo-data';

// GET /api/student/profile?id=<studentId>
// Returns the student's profile (used by parent dashboard to show child info)
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  const sb = getSupabase();
  if (sb) {
    try {
      const { data } = await sb
        .from('students')
        .select('id, name, email, role, grade, parent_name, avatar, phone, school_name, subjects, strengths, areas_to_improve, status, enrollment_date, created_at')
        .eq('id', id)
        .single();
      if (data) {
        return NextResponse.json({ student: data });
      }
    } catch {
      // fall through to demo
    }
  }

  const student = DEMO_STUDENTS.find((s) => s.id === id);
  if (student) {
    const { pin, admin_notes, medical_notes, ...safe } = student as any;
    return NextResponse.json({ student: safe });
  }

  return NextResponse.json({ error: 'Student not found' }, { status: 404 });
}
