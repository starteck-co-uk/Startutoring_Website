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

    const emailLower = email.toLowerCase().trim();

    // Try Supabase first
    const sb = getSupabase();
    if (sb) {
      try {
        const { data } = await sb
          .from('students')
          .select('*')
          .eq('email', emailLower)
          .eq('pin', pin)
          .single();
        if (data) {
          return NextResponse.json({ user: data });
        }
      } catch {
        // Supabase query failed (table missing, etc.) — fall through to demo
      }
    }

    // Always fall back to built-in accounts (works even when Supabase is
    // connected but the schema hasn't been run or the user doesn't exist yet)
    const user = DEMO_STUDENTS.find(
      (s) => s.email.toLowerCase() === emailLower && s.pin === pin
    );
    if (user) {
      return NextResponse.json({ user });
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
}
