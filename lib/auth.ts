import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from './supabase';
import { DEMO_STUDENTS } from './demo-data';

/**
 * Lightweight server-side auth helper.
 * Reads the x-user-id header (set by the client from localStorage)
 * and validates it exists in the DB or demo store.
 * Returns the user object or null.
 */
export async function getAuthUser(req: NextRequest) {
  const userId = req.headers.get('x-user-id');
  if (!userId) return null;

  const sb = getSupabase();
  if (sb) {
    try {
      const { data } = await sb
        .from('students')
        .select('id, name, email, role, linked_students')
        .eq('id', userId)
        .single();
      return data || null;
    } catch {
      // Fall through to demo
    }
  }

  const user = DEMO_STUDENTS.find(s => s.id === userId);
  if (!user) return null;
  return { id: user.id, name: user.name, email: user.email, role: user.role, linked_students: (user as any).linked_students };
}

/**
 * Require admin role. Returns error response or null (if authorized).
 */
export async function requireAdmin(req: NextRequest): Promise<NextResponse | null> {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  return null;
}

/**
 * Require the requesting user to be the student, their parent, or an admin.
 * Returns error response or null (if authorized).
 */
export async function requireStudentAccess(req: NextRequest, studentId: string): Promise<NextResponse | null> {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (user.role === 'admin') return null;
  if (user.id === studentId) return null;
  if (user.role === 'parent' && Array.isArray(user.linked_students) && user.linked_students.includes(studentId)) return null;
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}

/**
 * Sanitize a filename for use in Content-Disposition headers.
 */
export function sanitizeFilename(name: string): string {
  return name.replace(/[^\w\-. ]/g, '_').substring(0, 255);
}
