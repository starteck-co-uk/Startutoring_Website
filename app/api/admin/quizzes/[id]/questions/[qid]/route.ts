import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabase, getSupabase } from '@/lib/supabase';
import { demoAdminQuizStore } from '@/lib/demo-data';

export async function PATCH(req: NextRequest, { params }: { params: { id: string; qid: string } }) {
  try {
    const body = await req.json();
    const patch: any = {};
    if (body.text !== undefined) patch.text = body.text;
    if (body.options !== undefined) patch.options = body.options;
    if (body.correct !== undefined) patch.correct = body.correct;
    if (body.explanation !== undefined) patch.explanation = body.explanation;

    const sb = getAdminSupabase() || getSupabase();
    if (sb) {
      const { data, error } = await sb.from('quiz_questions').update(patch).eq('id', params.qid).select().single();
      if (error) throw error;
      return NextResponse.json({ question: data });
    }

    const updated = demoAdminQuizStore.updateQuestion(params.qid, patch);
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ question: updated });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
}
