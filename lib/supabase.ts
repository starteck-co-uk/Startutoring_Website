import { createClient, SupabaseClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const hasSupabase = Boolean(url && anon);

let _browser: SupabaseClient | null = null;
let _admin: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!hasSupabase) return null;
  if (!_browser) _browser = createClient(url!, anon!);
  return _browser;
}

export function getAdminSupabase(): SupabaseClient | null {
  if (!url || !service) return null;
  if (!_admin)
    _admin = createClient(url, service, {
      auth: { persistSession: false, autoRefreshToken: false }
    });
  return _admin;
}
