import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabase, getSupabase } from '@/lib/supabase';
import { demoFeedbackStore } from '@/lib/demo-data';

export async function GET() {
  const sb = getAdminSupabase() || getSupabase();
  if (sb) {
    try {
      const { data } = await sb.from('feedback').select('*').order('created_at', { ascending: false });
      return NextResponse.json({ feedback: data || [] });
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }
  return NextResponse.json({ feedback: demoFeedbackStore.all() });
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, rating, message } = await req.json();
    if (!name || !email || !message || !rating) {
      return NextResponse.json({ error: 'name, email, rating, and message are required' }, { status: 400 });
    }

    const row = { name, email, rating: Number(rating), message, read: false };
    const sb = getAdminSupabase() || getSupabase();
    if (sb) {
      const { data, error } = await sb.from('feedback').insert(row).select().single();
      if (error) throw error;
      return NextResponse.json({ ok: true, feedback: data });
    }

    const saved = demoFeedbackStore.insert(row);
    return NextResponse.json({ ok: true, feedback: saved });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
}
