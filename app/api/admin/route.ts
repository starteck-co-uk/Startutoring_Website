import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { DEMO_STUDENTS, demoQuizStore, demoAssessmentStore, demoContactStore } from '@/lib/demo-data';

export async function GET(req: NextRequest) {
  const section = req.nextUrl.searchParams.get('section') || 'overview';

  const sb = getSupabase();

  if (sb) {
    try {
      if (section === 'assessments') {
        const { data } = await sb.from('assessments').select('*').order('created_at', { ascending: false });
        return NextResponse.json({ assessments: data || [] });
      }
      if (section === 'contacts') {
        const { data } = await sb.from('contacts').select('*').order('created_at', { ascending: false });
        return NextResponse.json({ contacts: data || [] });
      }
      if (section === 'students') {
        const { data: students } = await sb.from('students').select('*').order('created_at', { ascending: false });
        const { data: quizzes } = await sb.from('quiz_results').select('*').order('created_at', { ascending: false });
        return NextResponse.json({ students: students || [], quizzes: quizzes || [] });
      }
      // overview
      const { data: students } = await sb.from('students').select('id,name,email,role,grade');
      const { data: quizzes } = await sb.from('quiz_results').select('id,student_id,subject,score,total,percentage,created_at');
      const { data: assessments } = await sb.from('assessments').select('id,status,created_at');
      const { data: contacts } = await sb.from('contacts').select('id,read,created_at');
      return NextResponse.json({
        counts: {
          students: (students || []).filter((s: any) => s.role === 'student').length,
          parents: (students || []).filter((s: any) => s.role === 'parent').length,
          quizzes: (quizzes || []).length,
          assessments: (assessments || []).length,
          pendingAssessments: (assessments || []).filter((a: any) => a.status === 'pending').length,
          contacts: (contacts || []).length,
          unreadContacts: (contacts || []).filter((c: any) => !c.read).length
        },
        recentQuizzes: (quizzes || []).slice(0, 10),
        recentAssessments: (assessments || []).slice(0, 5)
      });
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }

  // Demo mode
  const students = DEMO_STUDENTS.filter((s) => s.role !== 'admin');
  const quizzes = demoQuizStore.all();
  const assessments = demoAssessmentStore.all();
  const contacts = demoContactStore.all();

  if (section === 'assessments') return NextResponse.json({ assessments });
  if (section === 'contacts') return NextResponse.json({ contacts });
  if (section === 'students') return NextResponse.json({ students, quizzes });

  return NextResponse.json({
    counts: {
      students: students.filter((s) => s.role === 'student').length,
      parents: students.filter((s) => s.role === 'parent').length,
      quizzes: quizzes.length,
      assessments: assessments.length,
      pendingAssessments: assessments.filter((a: any) => a.status === 'pending').length,
      contacts: contacts.length,
      unreadContacts: contacts.filter((c: any) => !c.read).length
    },
    recentQuizzes: quizzes.slice(0, 10),
    recentAssessments: assessments.slice(0, 5)
  });
}
