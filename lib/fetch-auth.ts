/**
 * Authenticated fetch wrapper.
 * Reads the user from localStorage and sends x-user-id header.
 */
export function authFetch(url: string, init?: RequestInit): Promise<Response> {
  const headers = new Headers(init?.headers);

  // Try admin first, then parent/student
  const raw = typeof window !== 'undefined'
    ? (localStorage.getItem('star_user_admin') || localStorage.getItem('star_user_parent') || localStorage.getItem('star_user'))
    : null;

  if (raw) {
    try {
      const user = JSON.parse(raw);
      if (user?.id) headers.set('x-user-id', user.id);
    } catch {}
  }

  return fetch(url, { ...init, headers });
}
