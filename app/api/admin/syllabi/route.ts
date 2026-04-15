import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabase, getSupabase } from '@/lib/supabase';
import { demoSyllabiStore } from '@/lib/demo-data';

export async function GET() {
  const sb = getAdminSupabase() || getSupabase();
  if (sb) {
    try {
      const { data } = await sb.from('syllabi').select('*').order('subject').order('level');
      return NextResponse.json({ syllabi: data || [] });
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }
  return NextResponse.json({ syllabi: demoSyllabiStore.all() });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { subject, level, title, content, file_name, file_size } = body;
    if (!subject || !level || !title || !content) {
      return NextResponse.json({ error: 'subject, level, title, and content are required' }, { status: 400 });
    }

    const row = { subject, level, title, content, file_name: file_name || null, file_size: file_size || null };

    const sb = getAdminSupabase() || getSupabase();
    if (sb) {
      const { data, error } = await sb
        .from('syllabi')
        .upsert({ ...row, updated_at: new Date().toISOString() }, { onConflict: 'subject,level' })
        .select()
        .single();
      if (error) throw error;
      return NextResponse.json({ syllabus: data });
    }

    const saved = demoSyllabiStore.upsert(row);
    return NextResponse.json({ syllabus: saved });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const sb = getAdminSupabase() || getSupabase();
  if (sb) {
    await sb.from('syllabi').delete().eq('id', id);
    return NextResponse.json({ ok: true });
  }

  demoSyllabiStore.remove(id);
  return NextResponse.json({ ok: true });
}
