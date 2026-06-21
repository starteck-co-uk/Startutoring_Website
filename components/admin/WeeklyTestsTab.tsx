'use client';

import { useEffect, useState } from 'react';
import GlassCard from '@/components/GlassCard';
import WeeklyTestCreator from './WeeklyTestCreator';
import { Plus, Send, Archive, Trash2, Users } from 'lucide-react';

interface WeeklyTestSummary {
  id: string;
  title: string;
  level: string;
  week_start: string;
  status: string;
  sections: any[];
  created_at: string;
  attempt_count?: number;
  avg_score?: number;
}

export default function WeeklyTestsTab() {
  const [tests, setTests] = useState<WeeklyTestSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/admin/weekly-tests');
      const j = await r.json();
      setTests(j.tests || []);
    } catch { }
    setLoading(false);
  };

  useEffect(() => { refresh(); }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/admin/weekly-tests/${id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ status })
      });
      refresh();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const deleteTest = async (id: string) => {
    if (!confirm('Delete this test? This cannot be undone.')) return;
    try {
      await fetch(`/api/admin/weekly-tests/${id}`, { method: 'DELETE' });
      refresh();
    } catch (e: any) {
      setError(e.message);
    }
  };

  if (creating) {
    return <WeeklyTestCreator onDone={() => { setCreating(false); refresh(); }} onCancel={() => setCreating(false)} />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    draft: 'bg-yellow-400/10 border-yellow-400/30 text-yellow-300',
    published: 'bg-green-400/10 border-green-400/30 text-green-300',
    closed: 'bg-red-400/10 border-red-400/30 text-red-300'
  };

  return (
    <div>
      <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
        <div>
          <h2 className="font-serif text-3xl font-semibold text-gradient">Weekly Tests</h2>
          <p className="text-ink-soft text-sm mt-1">
            GL Assessment format — 4 subjects, 20 questions per topic. Students get 2 per week.
          </p>
        </div>
        <button onClick={() => setCreating(true)} className="btn btn-gold flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Create Weekly Test
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl border border-red-400/30 bg-red-400/10 text-red-300 text-sm">{error}</div>
      )}

      {tests.length === 0 ? (
        <GlassCard className="!p-10 text-center" hover={false}>
          <p className="text-ink-muted">No weekly tests yet. Create your first one above.</p>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {tests.map((t) => {
            const totalQs = (t.sections || []).reduce((a: number, s: any) => a + (s.questions?.length || s.question_count || 0), 0);
            const subjects = [...new Set((t.sections || []).map((s: any) => s.subject))];
            return (
              <GlassCard key={t.id} className="!p-6" hover={false}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-serif text-lg font-semibold">{t.title}</h3>
                      <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full font-semibold border ${statusColors[t.status] || statusColors.draft}`}>
                        {t.status}
                      </span>
                    </div>
                    <div className="flex gap-3 mt-1 text-sm text-ink-muted flex-wrap">
                      <span>{t.level}</span>
                      <span>Week of {new Date(t.week_start).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                      <span>{(t.sections || []).length} sections</span>
                      <span>{totalQs} questions</span>
                      {(t.attempt_count || 0) > 0 && (
                        <span className="flex items-center gap-1 text-green-300">
                          <Users className="w-3 h-3" />
                          {t.attempt_count} attempt{t.attempt_count !== 1 ? 's' : ''} · avg {t.avg_score}%
                        </span>
                      )}
                    </div>
                    <div className="flex gap-1.5 mt-2">
                      {subjects.map((s: string) => (
                        <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-ink-muted">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {t.status === 'draft' && (
                      <button
                        onClick={() => updateStatus(t.id, 'published')}
                        className="text-xs px-3 py-2 rounded-lg border border-green-400/30 bg-green-400/10 text-green-300 hover:bg-green-400/20 transition flex items-center gap-1"
                      >
                        <Send className="w-3 h-3" /> Publish
                      </button>
                    )}
                    {t.status === 'published' && (
                      <button
                        onClick={() => updateStatus(t.id, 'closed')}
                        className="text-xs px-3 py-2 rounded-lg border border-white/10 hover:border-yellow-400/30 transition flex items-center gap-1"
                      >
                        <Archive className="w-3 h-3" /> Close
                      </button>
                    )}
                    <button
                      onClick={() => deleteTest(t.id)}
                      className="text-xs px-3 py-2 rounded-lg border border-red-400/20 hover:border-red-400/40 text-red-300/60 hover:text-red-300 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
