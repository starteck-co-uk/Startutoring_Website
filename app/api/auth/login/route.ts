import { NextRequest, NextResponse } from 'next/server';
import { getSupabase, hasSupabase } from '@/lib/supabase';
import { DEMO_STUDENTS } from '@/lib/demo-data';

export async function GET() {
  return NextResponse.json({ supabase: hasSupabase });
}

export async function POST(req: NextRequest) {
  try {
    const { email, pin } = await req.json();
    if (!email || !pin) {
      return NextResponse.json({ error: 'Email and PIN are required' }, { status: 400 });
    }

    const sb = getSupabase();
    if (sb) {
      const { data, error } = await sb
        .from('students')
        .select('*')
        .eq('email', email)
        .eq('pin', pin)
        .single();
      if (error || !data) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }
      return NextResponse.json({ user: data });
    }

    // demo mode fallback
    const user = DEMO_STUDENTS.find(
      (s) => s.email.toLowerCase() === email.toLowerCase() && s.pin === pin
    );
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    return NextResponse.json({ user });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
}
