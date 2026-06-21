'use client';

import { useEffect, useState, useRef } from 'react';
import GlassCard from '@/components/GlassCard';
import { Upload, Trash2, FileText, FolderOpen, ChevronDown } from 'lucide-react';

interface ResourceItem {
  id: string;
  title: string;
  description?: string;
  subject?: string;
  category?: string;
  level?: string;
  file_name: string;
  file_size: number;
  path?: string;
  created_at?: string;
  source?: 'static' | 'uploaded';
}

const SUBJECTS = ['', 'Maths', 'English', 'Verbal Reasoning', 'Non-Verbal Reasoning'];
const LEVELS = ['', '11+', 'KS2', 'KS3', 'GCSE', 'A-Level'];

const SUBJECT_COLORS: Record<string, string> = {
  'Maths': '#a78bfa',
  'English': '#22d3ee',
  'Verbal Reasoning': '#f59e0b',
  'Non-Verbal Reasoning': '#ec4899',
  'General': '#34d399'
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ResourcesTab() {
  const [staticResources, setStaticResources] = useState<ResourceItem[]>([]);
  const [uploadedResources, setUploadedResources] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [level, setLevel] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [expandedSubjects, setExpandedSubjects] = useState<Set<string>>(new Set());

  useEffect(() => {
    Promise.all([
      fetch('/resources/manifest.json').then(r => r.json()).catch(() => []),
      fetch('/api/admin/resources').then(r => r.json()).then(d => d.resources || []).catch(() => [])
    ]).then(([staticData, uploaded]) => {
      setStaticResources(staticData.map((r: any) => ({ ...r, source: 'static' })));
      setUploadedResources(uploaded.map((r: any) => ({ ...r, source: 'uploaded' })));
    }).finally(() => setLoading(false));
  }, []);

  const fetchUploaded = () => {
    fetch('/api/admin/resources')
      .then(r => r.json())
      .then(d => setUploadedResources((d.resources || []).map((r: any) => ({ ...r, source: 'uploaded' }))))
      .catch(() => {});
  };

  const upload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !file) return;
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append('title', title.trim());
      fd.append('description', description.trim());
      fd.append('subject', subject);
      fd.append('level', level);
      fd.append('file', file);

      const r = await fetch('/api/admin/resources', { method: 'POST', body: fd });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || 'Upload failed');

      setTitle('');
      setDescription('');
      setSubject('');
      setLevel('');
      setFile(null);
      if (fileRef.current) fileRef.current.value = '';
      setShowForm(false);
      fetchUploaded();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const deleteResource = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await fetch(`/api/admin/resources?id=${id}`, { method: 'DELETE' });
      fetchUploaded();
    } catch {}
  };

  const toggleSubject = (s: string) => {
    setExpandedSubjects(prev => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s); else next.add(s);
      return next;
    });
  };

  // Group static resources by subject
  const grouped: Record<string, ResourceItem[]> = {};
  for (const r of staticResources) {
    const s = r.subject || 'General';
    if (!grouped[s]) grouped[s] = [];
    grouped[s].push(r);
  }

  const totalStatic = staticResources.length;
  const totalUploaded = uploadedResources.length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-serif text-2xl font-semibold">Resources</h2>
          <p className="text-sm text-ink-muted mt-1">
            {totalStatic} static files + {totalUploaded} uploaded &middot; Parents can download all from the Resources tab.
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-gold !text-sm">
          <Upload className="w-4 h-4" />
          Upload New
        </button>
      </div>

      {/* Upload form */}
      {showForm && (
        <GlassCard className="!p-6 mb-6" hover={false}>
          <form onSubmit={upload} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="field-label">Title *</label>
                <input className="field" value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. Maths Practice Paper 1" />
              </div>
              <div>
                <label className="field-label">File *</label>
                <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.xlsx,.pptx,.png,.jpg" className="field" onChange={e => setFile(e.target.files?.[0] || null)} required />
              </div>
            </div>
            <div>
              <label className="field-label">Description</label>
              <input className="field" value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief description (optional)" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="field-label">Subject</label>
                <select className="field" value={subject} onChange={e => setSubject(e.target.value)}>
                  {SUBJECTS.map(s => <option key={s} value={s}>{s || 'General'}</option>)}
                </select>
              </div>
              <div>
                <label className="field-label">Level</label>
                <select className="field" value={level} onChange={e => setLevel(e.target.value)}>
                  {LEVELS.map(l => <option key={l} value={l}>{l || 'All levels'}</option>)}
                </select>
              </div>
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <div className="flex gap-3">
              <button type="submit" disabled={uploading} className="btn btn-gold !text-sm disabled:opacity-60">
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-ink-muted hover:text-ink-soft transition">
                Cancel
              </button>
            </div>
          </form>
        </GlassCard>
      )}

      {loading ? (
        <div className="text-center py-10">
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : (
        <>
          {/* Uploaded resources (deletable) */}
          {uploadedResources.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-ink-muted uppercase tracking-widest mb-3">Uploaded via Dashboard</h3>
              <div className="space-y-2">
                {uploadedResources.map(r => (
                  <GlassCard key={r.id} className="!p-4" hover={false}>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gold-dim border border-gold/20 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-gold" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{r.title}</p>
                        <p className="text-xs text-ink-muted mt-0.5">
                          {r.file_name} &middot; {formatSize(r.file_size)}
                          {r.subject && ` · ${r.subject}`}
                          {r.level && ` · ${r.level}`}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteResource(r.id, r.title)}
                        className="p-2 rounded-lg text-ink-muted hover:text-red-400 hover:bg-red-400/10 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}

          {/* Static resources (from public/resources/) */}
          <h3 className="text-sm font-semibold text-ink-muted uppercase tracking-widest mb-3">
            Study Materials ({totalStatic} files)
          </h3>
          <div className="space-y-3">
            {Object.entries(grouped).map(([subjectName, items]) => {
              const color = SUBJECT_COLORS[subjectName] || '#f5b72f';
              const isExpanded = expandedSubjects.has(subjectName);
              return (
                <GlassCard key={subjectName} className="!p-0 overflow-hidden" hover={false}>
                  <button
                    onClick={() => toggleSubject(subjectName)}
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/3 transition text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full" style={{ background: color }} />
                      <span className="font-semibold text-sm">{subjectName}</span>
                      <span className="text-xs text-ink-muted">{items.length} files</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-ink-muted transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>
                  {isExpanded && (
                    <div className="border-t border-white/5 divide-y divide-white/5 max-h-[400px] overflow-y-auto">
                      {items.map(r => (
                        <div key={r.id} className="flex items-center gap-3 px-5 py-2.5">
                          <FileText className="w-3.5 h-3.5 text-ink-muted shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs truncate">{r.title}</p>
                            <p className="text-[10px] text-ink-muted">{r.category} &middot; {formatSize(r.file_size)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </GlassCard>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
