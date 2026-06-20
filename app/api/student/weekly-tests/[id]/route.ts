import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { demoWeeklyTestStore } from '@/lib/demo-data';

// GET — get test details (questions without correct answers for unattempted)
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const studentId = req.nextUrl.searchParams.get('student_id') || '';

  const sb = getSupabase();
  if (sb) {
    try {
      const { data: test } = await sb.from('weekly_tests').select('*').eq('id', id).single();
      if (!test) return NextResponse.json({ error: 'Not found' }, { status: 404 });

      const { data: attempt } = await sb.from('weekly_test_attempts')
        .select('*')
        .eq('test_id', id)
        .eq('student_id', studentId)
        .single();

      // If not attempted, strip correct answers
      if (!attempt?.completed) {
        const stripped = {
          ...test,
          sections: (test.sections || []).map((s: any) => ({
            ...s,
            questions: s.questions.map((q: any) => ({
              text: q.text,
              options: q.options
            }))
          }))
        };
        return NextResponse.json({ test: stripped, attempt: null });
      }

      return NextResponse.json({ test, attempt });
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }

  // Demo mode
  const test = demoWeeklyTestStore.testById(id);
  if (!test) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const attempt = demoWeeklyTestStore.attemptByStudentTest(studentId, id);

  if (!attempt?.completed) {
    const stripped = {
      ...test,
      sections: test.sections.map(s => ({
        ...s,
        questions: s.questions.map(q => ({
          text: q.text,
          options: q.options
        }))
      }))
    };
    return NextResponse.json({ test: stripped, attempt: null });
  }

  return NextResponse.json({ test, attempt });
}
