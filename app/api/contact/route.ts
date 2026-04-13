import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabase, getSupabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'name, email and message are required' }, { status: 400 });
    }

    const row = { name, email, message, read: false };
    const sb = getAdminSupabase() || getSupabase();
    if (sb) {
      const { data, error } = await sb.from('contacts').insert(row).select().single();
      if (error) throw error;
      return NextResponse.json({ ok: true, contact: data });
    }
    return NextResponse.json({ ok: true, contact: { ...row, id: 'demo', created_at: new Date().toISOString() } });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
}
