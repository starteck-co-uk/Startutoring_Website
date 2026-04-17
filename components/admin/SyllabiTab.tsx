'use client';

import { useEffect, useState, useRef } from 'react';
import GlassCard from '@/components/GlassCard';

const SUBJECTS = ['Maths', 'Science', 'English'];
const LEVELS = ['11+', 'KS2', 'KS3', 'GCSE', 'A-Level'];

interface SyllabusEntry {
  id: string;
  subject: string;
  level: string;
  title: string;
  content: string;
  file_name?: string;
  file_size?: number;
  updated_at: string;
}

/** Parse content string into topic lines */
function parseTopics(content: string): string[] {
  return content
    .split('\n')
    .map((t) => t.replace(/^[-•*]\s*/, '').trim())
    .filter(Boolean);
}

/** Join topic lines back into content string */
function joinTopics(topics: string[]): string {
  return topics.map((t) => `• ${t}`).join('\n');
}

export default function SyllabiTab() {
  const [syllabi, setSyllabi] = useState<SyllabusEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [editing, setEditing] = useState<{ subject: string; level: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTarget, setUploadTarget] = useState<{ subject: string; level: string } | null>(null);

  const [seeding, setSeeding] = useState(false);

  const refresh = () => {
    fetch('/api/admin/syllabi')
      .then((r) => r.json())
      .then((d) => setSyllabi(d.syllabi || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { refresh(); }, []);

  const getSyllabus = (subject: string, level: string) =>
    syllabi.find((s) => s.subject === subject && s.level === level);

  const handleUploadClick = (subject: string, level: string) => {
    setUploadTarget({ subject, level });
    setError(null);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !uploadTarget) return;

    const key = `${uploadTarget.subject}-${uploadTarget.level}`;
    setUploading(key);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('pdf', file);
      formData.append('subject', uploadTarget.subject);
      formData.append('level', uploadTarget.level);
      formData.append('title', `${uploadTarget.level} ${uploadTarget.subject} Syllabus`);

      const r = await fetch('/api/admin/syllabi/upload', { method: 'POST', body: formData });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || 'Upload failed');

      setSyllabi((prev) => {
        const idx = prev.findIndex((s) => s.subject === uploadTarget.subject && s.level === uploadTarget.level);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = j.syllabus;
          return updated;
        }
        return [...prev, j.syllabus];
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(null);
    }
  };

  const saveSyllabus = async (subject: string, level: string, title: string, content: string) => {
    setSaving(true);
    setError(null);
    try {
      const r = await fetch('/api/admin/syllabi', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ subject, level, title, content })
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || 'Save failed');
      setSyllabi((prev) => {
        const idx = prev.findIndex((s) => s.subject === subject && s.level === level);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = j.syllabus;
          return updated;
        }
        return [...prev, j.syllabus];
      });
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/syllabi?id=${id}`, { method: 'DELETE' });
    setSyllabi((prev) => prev.filter((s) => s.id !== id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Topic editor view
  if (editing) {
    const syl = getSyllabus(editing.subject, editing.level);
    return (
      <TopicEditor
        subject={editing.subject}
        level={editing.level}
        syllabus={syl || null}
        saving={saving}
        error={error}
        onSave={async (title, content) => {
          const ok = await saveSyllabus(editing.subject, editing.level, title, content);
          if (ok) setEditing(null);
        }}
        onBack={() => { setEditing(null); setError(null); }}
        onUploadPdf={() => handleUploadClick(editing.subject, editing.level)}
      />
    );
  }

  return (
    <div>
      <div className="flex items-start justify-between flex-wrap gap-4 mb-2">
        <h2 className="font-serif text-3xl font-semibold text-gradient">Syllabus Management</h2>
        {syllabi.length === 0 && (
          <button
            onClick={async () => {
              setSeeding(true);
              setError(null);
              try {
                const r = await fetch('/api/admin/syllabi/seed', { method: 'POST' });
                const j = await r.json();
                if (!r.ok) throw new Error(j.error || 'Seeding failed');
                refresh();
              } catch (err: any) {
                setError(err.message);
              } finally {
                setSeeding(false);
              }
            }}
            disabled={seeding}
            className="btn btn-gold !py-2 !px-5 !text-sm disabled:opacity-60"
          >
            {seeding ? 'Loading...' : 'Load UK Curriculum Topics'}
          </button>
        )}
      </div>
      <p className="text-ink-soft text-sm mb-8">
        Manage topics for each subject and level. The AI uses these to generate curriculum-aligned quizzes.
      </p>

      <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />

      {error && (
        <div className="mb-6 p-4 rounded-xl border border-red-400/30 bg-red-400/10 text-red-300 text-sm">{error}</div>
      )}

      <div className="space-y-8">
        {SUBJECTS.map((subject) => (
          <div key={subject}>
            <h3 className="font-serif text-xl font-semibold mb-4">{subject}</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {LEVELS.map((level) => {
                const syl = getSyllabus(subject, level);
                const key = `${subject}-${level}`;
                const isUploading = uploading === key;
                const topics = syl ? parseTopics(syl.content) : [];

                return (
                  <GlassCard key={key} className="!p-5" hover={false}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold">{level}</p>
                        {syl ? (
                          <p className="text-xs text-green-300 mt-1">{topics.length} topics</p>
                        ) : (
                          <p className="text-xs text-ink-muted mt-1">Not set</p>
                        )}
                      </div>
                      {syl && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-400/10 border border-green-400/30 text-green-300">
                          Active
                        </span>
                      )}
                    </div>

                    {topics.length > 0 && (
                      <div className="mb-3 space-y-1">
                        {topics.slice(0, 4).map((t, i) => (
                          <p key={i} className="text-xs text-ink-soft flex items-start gap-1.5">
                            <span className="text-gold mt-0.5 shrink-0">&#8226;</span>
                            <span className="line-clamp-1">{t}</span>
                          </p>
                        ))}
                        {topics.length > 4 && (
                          <p className="text-xs text-ink-muted">+ {topics.length - 4} more topics</p>
                        )}
                      </div>
                    )}

                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => setEditing({ subject, level })}
                        className="text-xs px-3 py-1.5 rounded-lg border border-gold/30 bg-gold-dim text-gold-light hover:bg-gold-dim/80 transition"
                      >
                        {syl ? 'Edit Topics' : 'Add Topics'}
                      </button>
                      <button
                        onClick={() => handleUploadClick(subject, level)}
                        disabled={isUploading}
                        className="text-xs px-3 py-1.5 rounded-lg border border-white/10 bg-white/3 hover:border-gold/30 transition disabled:opacity-50"
                      >
                        {isUploading ? 'Uploading...' : 'Upload PDF'}
                      </button>
                      {syl && (
                        <button
                          onClick={() => handleDelete(syl.id)}
                          className="text-xs px-3 py-1.5 rounded-lg border border-red-400/20 text-red-300 hover:bg-red-400/10 transition"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ==================== TOPIC EDITOR ==================== */
function TopicEditor({
  subject,
  level,
  syllabus,
  saving,
  error,
  onSave,
  onBack,
  onUploadPdf
}: {
  subject: string;
  level: string;
  syllabus: SyllabusEntry | null;
  saving: boolean;
  error: string | null;
  onSave: (title: string, content: string) => Promise<void>;
  onBack: () => void;
  onUploadPdf: () => void;
}) {
  const [title, setTitle] = useState(syllabus?.title || `${level} ${subject} Syllabus`);
  const [topics, setTopics] = useState<string[]>(() =>
    syllabus ? parseTopics(syllabus.content) : []
  );
  const [newTopic, setNewTopic] = useState('');
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editVal, setEditVal] = useState('');

  const addTopic = () => {
    const val = newTopic.trim();
    if (!val) return;
    setTopics((prev) => [...prev, val]);
    setNewTopic('');
  };

  const removeTopic = (idx: number) => {
    setTopics((prev) => prev.filter((_, i) => i !== idx));
    if (editIdx === idx) setEditIdx(null);
  };

  const startEdit = (idx: number) => {
    setEditIdx(idx);
    setEditVal(topics[idx]);
  };

  const saveEdit = () => {
    if (editIdx === null) return;
    const val = editVal.trim();
    if (!val) {
      removeTopic(editIdx);
    } else {
      setTopics((prev) => prev.map((t, i) => (i === editIdx ? val : t)));
    }
    setEditIdx(null);
    setEditVal('');
  };

  const moveTopic = (idx: number, dir: -1 | 1) => {
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= topics.length) return;
    setTopics((prev) => {
      const next = [...prev];
      [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
      return next;
    });
  };

  const handleSave = () => {
    onSave(title, joinTopics(topics));
  };

  return (
    <div>
      <button onClick={onBack} className="text-sm text-ink-muted hover:text-white mb-4">
        &larr; Back to Syllabi
      </button>
      <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
        <div>
          <h2 className="font-serif text-3xl font-semibold text-gradient">
            {level} {subject}
          </h2>
          <p className="text-ink-soft text-sm mt-1">
            {topics.length} topics — add, edit, reorder, or remove topics below.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={onUploadPdf} className="text-xs px-3 py-1.5 rounded-lg border border-white/10 bg-white/3 hover:border-gold/30 transition">
            Upload PDF
          </button>
          <button
            onClick={handleSave}
            disabled={saving || topics.length === 0}
            className="btn btn-gold !py-2 !px-5 !text-sm disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save Topics'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl border border-red-400/30 bg-red-400/10 text-red-300 text-sm">{error}</div>
      )}

      {/* Title */}
      <GlassCard className="!p-4 mb-4" hover={false}>
        <label className="field-label">Syllabus Title</label>
        <input
          className="field"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={`${level} ${subject} Syllabus`}
        />
      </GlassCard>

      {/* Add new topic */}
      <GlassCard className="!p-4 mb-4" hover={false}>
        <label className="field-label">Add Topic</label>
        <div className="flex gap-2">
          <input
            className="field flex-1"
            placeholder="e.g. Quadratic Equations, Cell Biology, Shakespeare..."
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTopic(); } }}
          />
          <button
            onClick={addTopic}
            disabled={!newTopic.trim()}
            className="px-4 py-2 rounded-xl border border-gold/30 bg-gold-dim text-gold-light text-sm font-semibold hover:bg-gold-dim/80 transition disabled:opacity-40"
          >
            + Add
          </button>
        </div>
      </GlassCard>

      {/* Topic list */}
      {topics.length === 0 ? (
        <GlassCard className="!p-10 text-center" hover={false}>
          <p className="text-ink-muted">No topics yet. Add your first topic above or upload a PDF.</p>
        </GlassCard>
      ) : (
        <div className="space-y-2">
          {topics.map((topic, idx) => (
            <GlassCard key={idx} className="!p-0 !rounded-xl" hover={false}>
              {editIdx === idx ? (
                <div className="flex items-center gap-2 p-3">
                  <input
                    className="field flex-1 !py-2 !rounded-lg"
                    value={editVal}
                    onChange={(e) => setEditVal(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') setEditIdx(null); }}
                    autoFocus
                  />
                  <button onClick={saveEdit} className="text-xs px-3 py-1.5 rounded-lg bg-green-400/10 border border-green-400/30 text-green-300 hover:bg-green-400/20 transition">
                    Save
                  </button>
                  <button onClick={() => setEditIdx(null)} className="text-xs px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 transition">
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3 px-4 py-3">
                  <span className="text-ink-muted text-xs w-6 text-right shrink-0">{idx + 1}</span>
                  <span className="flex-1 text-sm">{topic}</span>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => moveTopic(idx, -1)}
                      disabled={idx === 0}
                      className="text-xs p-1 rounded hover:bg-white/5 text-ink-muted hover:text-white disabled:opacity-20 transition"
                      title="Move up"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => moveTopic(idx, 1)}
                      disabled={idx === topics.length - 1}
                      className="text-xs p-1 rounded hover:bg-white/5 text-ink-muted hover:text-white disabled:opacity-20 transition"
                      title="Move down"
                    >
                      ▼
                    </button>
                    <button
                      onClick={() => startEdit(idx)}
                      className="text-xs px-2 py-1 rounded hover:bg-white/5 text-ink-soft hover:text-gold transition"
                      title="Edit"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => removeTopic(idx)}
                      className="text-xs px-2 py-1 rounded hover:bg-red-400/10 text-ink-muted hover:text-red-300 transition"
                      title="Remove"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
