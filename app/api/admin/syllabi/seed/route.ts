import { NextResponse } from 'next/server';
import { getAdminSupabase, getSupabase } from '@/lib/supabase';
import { demoSyllabiStore } from '@/lib/demo-data';
import { DEFAULT_SYLLABI } from '@/lib/default-syllabi';

// POST — seed all default syllabi (skip any that already exist)
export async function POST() {
  try {
    const sb = getAdminSupabase() || getSupabase();
    let seeded = 0;

    if (sb) {
      for (const s of DEFAULT_SYLLABI) {
        const content = s.topics.map((t) => `• ${t}`).join('\n');
        const { error } = await sb
          .from('syllabi')
          .upsert(
            {
              subject: s.subject,
              level: s.level,
              title: s.title,
              content,
              updated_at: new Date().toISOString()
            },
            { onConflict: 'subject,level', ignoreDuplicates: true }
          );
        if (!error) seeded++;
      }
    } else {
      for (const s of DEFAULT_SYLLABI) {
        const existing = demoSyllabiStore.bySubjectLevel(s.subject, s.level);
        if (!existing) {
          const content = s.topics.map((t) => `• ${t}`).join('\n');
          demoSyllabiStore.upsert({ subject: s.subject, level: s.level, title: s.title, content });
          seeded++;
        }
      }
    }

    return NextResponse.json({ ok: true, seeded });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
}
