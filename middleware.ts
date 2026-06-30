import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth-token';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const res = NextResponse.next();

  // ── Security headers on all responses ──
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('X-XSS-Protection', '1; mode=block');
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  if (process.env.NODE_ENV === 'production') {
    res.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  // ── Skip auth for cron endpoints (they use CRON_SECRET) ──
  if (pathname.startsWith('/api/cron')) {
    return res;
  }

  // ── Auth protection for API routes ──
  if (pathname.startsWith('/api/admin') || pathname.startsWith('/api/student')) {
    const token = req.cookies.get('star_auth')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 });
    }

    // Admin routes require admin role
    if (pathname.startsWith('/api/admin') && user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden — admin access required' }, { status: 403 });
    }

    // Pass user info to API routes via headers
    res.headers.set('x-user-id', user.id);
    res.headers.set('x-user-role', user.role);
    res.headers.set('x-user-email', user.email);
  }

  // Protect student-stats and resource downloads too
  if (pathname.startsWith('/api/student-stats') || pathname.match(/^\/api\/resources\/[^/]+\/download/)) {
    const token = req.cookies.get('star_auth')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 });
    }
    res.headers.set('x-user-id', user.id);
    res.headers.set('x-user-role', user.role);
  }

  return res;
}

export const config = {
  matcher: [
    '/api/admin/:path*',
    '/api/student/:path*',
    '/api/student-stats',
    '/api/resources/:path*',
    // Security headers on all pages
    '/((?!_next/static|_next/image|favicon.ico).*)'
  ]
};
