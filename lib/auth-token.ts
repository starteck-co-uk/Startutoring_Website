/**
 * Simple HMAC-signed auth token for httponly cookies.
 * Format: base64(JSON) + "." + hex(HMAC-SHA256)
 */

const SECRET = process.env.AUTH_SECRET || 'star-tutoring-default-secret-change-in-production';

async function hmacSign(data: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function hmacVerify(data: string, signature: string): Promise<boolean> {
  const expected = await hmacSign(data);
  if (expected.length !== signature.length) return false;
  let result = 0;
  for (let i = 0; i < expected.length; i++) {
    result |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  return result === 0;
}

export interface AuthPayload {
  id: string;
  role: string;
  email: string;
}

export async function createToken(payload: AuthPayload): Promise<string> {
  const data = btoa(JSON.stringify(payload));
  const sig = await hmacSign(data);
  return `${data}.${sig}`;
}

export async function verifyToken(token: string): Promise<AuthPayload | null> {
  const dotIdx = token.lastIndexOf('.');
  if (dotIdx === -1) return null;
  const data = token.substring(0, dotIdx);
  const sig = token.substring(dotIdx + 1);
  if (!(await hmacVerify(data, sig))) return null;
  try {
    return JSON.parse(atob(data));
  } catch {
    return null;
  }
}
