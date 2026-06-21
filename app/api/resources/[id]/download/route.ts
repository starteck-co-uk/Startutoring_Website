import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { demoResourcesStore } from '@/lib/demo-data';

// GET — download a resource file
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const sb = getSupabase();
  if (sb) {
    try {
      const { data } = await sb.from('resources')
        .select('file_name, file_data')
        .eq('id', id)
        .single();
      if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });

      const match = data.file_data.match(/^data:([^;]+);base64,(.+)$/);
      if (!match) return NextResponse.json({ error: 'Invalid file data' }, { status: 500 });

      const [, mimeType, base64] = match;
      const buffer = Buffer.from(base64, 'base64');

      return new NextResponse(buffer, {
        headers: {
          'Content-Type': mimeType,
          'Content-Disposition': `attachment; filename="${data.file_name}"`,
          'Content-Length': String(buffer.length),
        },
      });
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }

  // Demo mode
  const resource = demoResourcesStore.byId(id);
  if (!resource) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const match = resource.file_data.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return NextResponse.json({ error: 'Invalid file data' }, { status: 500 });

  const [, mimeType, base64] = match;
  const buffer = Buffer.from(base64, 'base64');

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': mimeType,
      'Content-Disposition': `attachment; filename="${resource.file_name}"`,
      'Content-Length': String(buffer.length),
    },
  });
}
