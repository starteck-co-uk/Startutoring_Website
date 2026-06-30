import { NextRequest, NextResponse } from 'next/server';
import { getSupabase, hasSupabase } from '@/lib/supabase';
import { DEMO_STUDENTS } from '@/lib/demo-data';
import { createToken } from '@/lib/auth-token';
import { logger } from '@/lib/logger';

// Simple in-memory rate limiter (per deployment instance)
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 10;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (!entry || now > entry.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  entry.count++;
  return entry.count <= MAX_ATTEMPTS;
}

export async function GET() {
  return NextResponse.json({ supabase: hasSupabase });
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (!checkRateLimit(ip)) {
      logger.warn('Rate limit exceeded', { ip });
      return NextResponse.json({ error: 'Too many login attempts. Please try again later.' }, { status: 429 });
    }

    const { email, pin } = await req.json();
    if (!email || !pin) {
      return NextResponse.json({ error: 'Email and PIN are required' }, { status: 400 });
    }

    const emailLower = email.toLowerCase().trim();
    let authenticatedUser: any = null;

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
        if (data) authenticatedUser = data;
      } catch {
        // Supabase query failed — fall through to demo
      }
    }

    // Fall back to built-in accounts
    if (!authenticatedUser) {
      const user = DEMO_STUDENTS.find(
        (s) => s.email.toLowerCase() === emailLower && s.pin === pin
      );
      if (user) authenticatedUser = { ...user };
    }

    // Constant-time-ish delay to mitigate timing attacks
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 150));

    if (!authenticatedUser) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Only admin and parent roles can log in
    if (authenticatedUser.role === 'student') {
      return NextResponse.json({ error: 'Student accounts cannot log in directly. Please use your parent login.' }, { status: 403 });
    }

    const { pin: _pin, admin_notes, medical_notes, ...safeUser } = authenticatedUser;

    // Create signed auth token and set httponly cookie
    const token = await createToken({
      id: safeUser.id,
      role: safeUser.role,
      email: safeUser.email
    });

    const res = NextResponse.json({ user: safeUser });
    res.cookies.set('star_auth', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return res;
  } catch (e: any) {
    logger.error('Login error', { error: e.message });
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
}
