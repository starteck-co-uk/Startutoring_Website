'use client';

import { useEffect, useState } from 'react';
import GlassCard from '@/components/GlassCard';
import QuizCreator from './QuizCreator';

const SUBJECTS = ['Maths', 'Science', 'English'];
const LEVELS = ['11+', 'KS2', 'KS3', 'GCSE', 'A-Level'];
const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-yellow-400/10 border-yellow-400/30 text-yellow-300',
  published: 'bg-green-400/10 border-green-400/30 text-green-300',
  closed: 'bg-red-400/10 border-red-400/30 text-red-300'
};

interface QuizRow {
  id: string;
  title: string;
  subject: string;
  level: string;
  topic?: string;
  status: string;
  question_count: number;
  created_at: string;
  published_at?: string;
}

export default function QuizzesTab() {
  const [quizzes, setQuizzes] = useState<QuizRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    const url = filter ? `/api/admin/quizzes?status=${filter}` : '/api/admin/quizzes';
    fetch(url)
      .then((r) => r.json())
      .then((d) => setQuizzes(d.quizzes || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filter]);

  const handlePublish = async (id: string) => {
    await fetch(`/api/admin/quizzes/${id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ status: 'published' })
    });
    load();
  };

  const handleClose = async (id: string) => {
    await fetch(`/api/admin/quizzes/${id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ status: 'closed' })
    });
    load();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/quizzes/${id}`, { method: 'DELETE' });
    load();
  };

  if (creating || editingId) {
    return (
      <QuizCreator
        quizId={editingId || undefined}
        onDone={() => {
          setCreating(false);
          setEditingId(null);
          load();
        }}
        onCancel={() => {
          setCreating(false);
          setEditingId(null);
        }}
      />
    );
  }

  return (
    <div>
      <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
        <div>
          <h2 className="font-serif text-3xl font-semibold text-gradient">Quizzes</h2>
          <p className="text-ink-soft text-sm mt-1">Create, preview, and publish quizzes for your students.</p>
        </div>
        <button onClick={() => setCreating(true)} className="btn btn-gold">
          + Create Quiz
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {[null, 'draft', 'published', 'closed'].map((s) => (
          <button
            key={s || 'all'}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-sm border transition ${
              filter === s
                ? 'border-gold/60 bg-gold-dim text-gold-light'
                : 'border-white/10 bg-white/3 text-ink-soft hover:border-white/20'
            }`}
          >
            {s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
      ) : quizzes.length === 0 ? (
        <GlassCard className="!p-10 text-center" hover={false}>
          <p className="text-ink-muted">No quizzes yet. Create your first one!</p>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {quizzes.map((q) => (
            <GlassCard key={q.id} className="!p-6" hover={false}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-serif text-lg font-semibold">{q.title}</h3>
                    <span className={`text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded-full font-semibold border ${STATUS_COLORS[q.status]}`}>
                      {q.status}
                    </span>
                  </div>
                  <div className="flex gap-4 mt-2 text-sm text-ink-muted">
                    <span>{q.subject}</span>
                    <span>{q.level}</span>
                    {q.topic && <span>Topic: {q.topic}</span>}
                    <span>{q.question_count} questions</span>
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {q.status === 'draft' && (
                    <>
                      <button onClick={() => setEditingId(q.id)} className="text-xs px-3 py-1.5 rounded-lg border border-white/10 hover:border-gold/30 transition">
                        Edit
                      </button>
                      <button onClick={() => handlePublish(q.id)} className="text-xs px-3 py-1.5 rounded-lg border border-green-400/30 text-green-300 hover:bg-green-400/10 transition">
                        Publish
                      </button>
                    </>
                  )}
                  {q.status === 'published' && (
                    <button onClick={() => handleClose(q.id)} className="text-xs px-3 py-1.5 rounded-lg border border-yellow-400/30 text-yellow-300 hover:bg-yellow-400/10 transition">
                      Close
                    </button>
                  )}
                  <button onClick={() => setEditingId(q.id)} className="text-xs px-3 py-1.5 rounded-lg border border-white/10 hover:border-gold/30 transition">
                    Preview
                  </button>
                  <button onClick={() => handleDelete(q.id)} className="text-xs px-3 py-1.5 rounded-lg border border-red-400/20 text-red-300 hover:bg-red-400/10 transition">
                    Delete
                  </button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
