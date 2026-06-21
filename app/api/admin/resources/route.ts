import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabase, getSupabase } from '@/lib/supabase';
import { demoResourcesStore } from '@/lib/demo-data';

// GET — list all resources (admin)
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

  // Demo — return without file_data for listing
  const resources = demoResourcesStore.all().map(({ file_data, ...rest }) => rest);
  return NextResponse.json({ resources });
}

// POST — upload a resource
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const title = formData.get('title') as string;
    const description = (formData.get('description') as string) || '';
    const subject = (formData.get('subject') as string) || '';
    const level = (formData.get('level') as string) || '';
    const file = formData.get('file') as File;

    if (!title || !file) {
      return NextResponse.json({ error: 'Title and file are required' }, { status: 400 });
    }

    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Maximum 20MB.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

    const sb = getAdminSupabase() || getSupabase();
    if (sb) {
      try {
        const { data, error } = await sb.from('resources').insert({
          title,
          description,
          subject,
          level,
          file_name: file.name,
          file_size: file.size,
          file_data: base64,
        }).select('id, title, description, subject, level, file_name, file_size, created_at').single();

        if (error) throw error;
        return NextResponse.json({ resource: data });
      } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
      }
    }

    // Demo mode
    const resource = demoResourcesStore.insert({
      title,
      description,
      subject,
      level,
      file_name: file.name,
      file_size: file.size,
      file_data: base64,
    });
    const { file_data, ...safe } = resource;
    return NextResponse.json({ resource: safe });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
}

// DELETE — remove a resource
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const sb = getAdminSupabase() || getSupabase();
  if (sb) {
    try {
      const { error } = await sb.from('resources').delete().eq('id', id);
      if (error) throw error;
      return NextResponse.json({ ok: true });
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }

  demoResourcesStore.delete(id);
  return NextResponse.json({ ok: true });
}
