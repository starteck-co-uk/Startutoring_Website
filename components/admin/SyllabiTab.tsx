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

export default function SyllabiTab() {
  const [syllabi, setSyllabi] = useState<SyllabusEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null); // "subject-level"
  const [pasteMode, setPasteMode] = useState<{ subject: string; level: string } | null>(null);
  const [pasteTitle, setPasteTitle] = useState('');
  const [pasteContent, setPasteContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTarget, setUploadTarget] = useState<{ subject: string; level: string } | null>(null);

  useEffect(() => {
    fetch('/api/admin/syllabi')
      .then((r) => r.json())
      .then((d) => setSyllabi(d.syllabi || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

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

  const handlePasteSave = async () => {
    if (!pasteMode || !pasteTitle.trim() || !pasteContent.trim()) return;
    setSaving(true);
    setError(null);

    try {
      const r = await fetch('/api/admin/syllabi', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          subject: pasteMode.subject,
          level: pasteMode.level,
          title: pasteTitle,
          content: pasteContent
        })
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || 'Save failed');

      setSyllabi((prev) => {
        const idx = prev.findIndex((s) => s.subject === pasteMode.subject && s.level === pasteMode.level);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = j.syllabus;
          return updated;
        }
        return [...prev, j.syllabus];
      });
      setPasteMode(null);
      setPasteTitle('');
      setPasteContent('');
    } catch (err: any) {
      setError(err.message);
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

  // Paste modal
  if (pasteMode) {
    return (
      <div>
        <button onClick={() => setPasteMode(null)} className="text-sm text-ink-muted hover:text-white mb-4">
          &larr; Back to Syllabi
        </button>
        <h2 className="font-serif text-3xl font-semibold text-gradient mb-2">
          Paste Syllabus — {pasteMode.level} {pasteMode.subject}
        </h2>
        <p className="text-ink-soft text-sm mb-6">Paste the syllabus content directly as text.</p>

        <GlassCard className="!p-6 space-y-4" hover={false}>
          <div>
            <label className="field-label">Title</label>
            <input
              className="field"
              placeholder={`e.g. ${pasteMode.level} ${pasteMode.subject} AQA 2024`}
              value={pasteTitle}
              onChange={(e) => setPasteTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="field-label">Syllabus Content</label>
            <textarea
              className="field !min-h-[300px]"
              placeholder="Paste the syllabus topics, objectives, and content here..."
              value={pasteContent}
              onChange={(e) => setPasteContent(e.target.value)}
            />
          </div>
          {error && (
            <div className="p-3 rounded-xl border border-red-400/30 bg-red-400/10 text-red-300 text-sm">{error}</div>
          )}
          <button onClick={handlePasteSave} disabled={saving || !pasteTitle.trim() || !pasteContent.trim()} className="btn btn-gold disabled:opacity-60">
            {saving ? 'Saving...' : 'Save Syllabus'}
          </button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-serif text-3xl font-semibold text-gradient mb-2">Syllabus Management</h2>
      <p className="text-ink-soft text-sm mb-8">
        Upload syllabi for each subject and level. The AI will use these to generate curriculum-aligned quizzes.
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

                return (
                  <GlassCard key={key} className="!p-5" hover={false}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold">{level}</p>
                        {syl ? (
                          <p className="text-xs text-green-300 mt-1">Uploaded</p>
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

                    {syl && (
                      <div className="mb-3">
                        <p className="text-xs text-ink-muted">{syl.title}</p>
                        {syl.file_name && <p className="text-xs text-ink-muted mt-0.5">{syl.file_name}</p>}
                        <p className="text-xs text-ink-soft mt-2 line-clamp-3">{syl.content.slice(0, 200)}...</p>
                      </div>
                    )}

                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => handleUploadClick(subject, level)}
                        disabled={isUploading}
                        className="text-xs px-3 py-1.5 rounded-lg border border-white/10 bg-white/3 hover:border-gold/30 transition disabled:opacity-50"
                      >
                        {isUploading ? 'Uploading...' : syl ? 'Replace PDF' : 'Upload PDF'}
                      </button>
                      <button
                        onClick={() => {
                          setPasteMode({ subject, level });
                          setPasteTitle(syl?.title || `${level} ${subject} Syllabus`);
                          setPasteContent(syl?.content || '');
                        }}
                        className="text-xs px-3 py-1.5 rounded-lg border border-white/10 bg-white/3 hover:border-gold/30 transition"
                      >
                        {syl ? 'Edit Text' : 'Paste Text'}
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
