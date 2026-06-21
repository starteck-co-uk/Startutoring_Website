import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { demoResourcesStore } from '@/lib/demo-data';

// GET — list resources for parents (no file_data)
export async function GET() {
  const sb = getSupabase();
  if (sb) {
    try {
      const { data } = await sb.from('resources')
        .select('id, title, description, subject, level, file_name, file_size, uploaded_by, created_at')
        .order('created_at', { ascending: false });
      return NextResponse.json({ resources: data || [] });
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }

  const resources = demoResourcesStore.all().map(({ file_data, ...rest }) => rest);
  return NextResponse.json({ resources });
}
