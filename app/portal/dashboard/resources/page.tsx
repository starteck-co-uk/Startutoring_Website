'use client';

import { useEffect, useState } from 'react';
import Sidebar, { usePortalUser } from '@/components/portal/Sidebar';
import GlassCard from '@/components/GlassCard';
import { FolderOpen, Download, FileText, Search } from 'lucide-react';

interface ResourceItem {
  id: string;
  title: string;
  description?: string;
  subject?: string;
  level?: string;
  file_name: string;
  file_size: number;
  created_at: string;
}

const SUBJECT_COLORS: Record<string, string> = {
  'Maths': '#a78bfa',
  'English': '#22d3ee',
  'Verbal Reasoning': '#f59e0b',
  'Non-Verbal Reasoning': '#ec4899'
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ResourcesPage() {
  const user = usePortalUser();
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterSubject, setFilterSubject] = useState('');

  useEffect(() => {
    fetch('/api/resources')
      .then(r => r.json())
      .then(d => setResources(d.resources || []))
      .catch(() => setResources([]))
      .finally(() => setLoading(false));
  }, []);

  if (!user) return null;

  const filtered = resources.filter(r => {
    const matchSearch = !search || r.title.toLowerCase().includes(search.toLowerCase())
      || r.description?.toLowerCase().includes(search.toLowerCase())
      || r.file_name.toLowerCase().includes(search.toLowerCase());
    const matchSubject = !filterSubject || r.subject === filterSubject;
    return matchSearch && matchSubject;
  });

  const subjects = Array.from(new Set(resources.map(r => r.subject).filter(Boolean)));

  return (
    <>
      <Sidebar user={user} />
      <main className="md:pl-[72px] pb-24 md:pb-10 min-h-screen">
        <div className="px-5 md:px-10 py-10 max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <p className="text-xs text-ink-muted uppercase tracking-widest">Resources</p>
            <h1 className="font-serif text-4xl md:text-5xl font-semibold text-gradient mt-2">
              Study Materials
            </h1>
            <p className="text-ink-soft mt-2">
              Download practice papers, worksheets, and study guides.
            </p>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
              <input
                type="text"
                placeholder="Search resources..."
                className="field !pl-10"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            {subjects.length > 0 && (
              <select
                className="field !w-auto min-w-[160px]"
                value={filterSubject}
                onChange={e => setFilterSubject(e.target.value)}
              >
                <option value="">All Subjects</option>
                {subjects.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            )}
          </div>

          {/* Resources List */}
          {loading ? (
            <div className="text-center py-20">
              <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : filtered.length === 0 ? (
            <GlassCard className="!p-12 text-center" hover={false}>
              <FolderOpen className="w-12 h-12 text-ink-muted mx-auto mb-4" />
              <h3 className="font-serif text-xl font-semibold text-ink-soft">
                {resources.length === 0 ? 'No resources available yet' : 'No resources match your search'}
              </h3>
              <p className="text-sm text-ink-muted mt-2">
                {resources.length === 0
                  ? 'Your tutor will upload study materials here soon.'
                  : 'Try adjusting your search or filter.'}
              </p>
            </GlassCard>
          ) : (
            <div className="space-y-4">
              {filtered.map(r => {
                const color = SUBJECT_COLORS[r.subject || ''] || '#f5b72f';
                return (
                  <GlassCard key={r.id} className="!p-5" hover={false}>
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: `${color}15`, border: `1px solid ${color}30` }}
                      >
                        <FileText className="w-5 h-5" style={{ color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold truncate">{r.title}</h4>
                        {r.description && (
                          <p className="text-sm text-ink-soft mt-0.5 line-clamp-1">{r.description}</p>
                        )}
                        <div className="flex gap-2 mt-1.5 flex-wrap">
                          {r.subject && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full border text-ink-muted"
                              style={{ borderColor: `${color}40`, background: `${color}10`, color }}>
                              {r.subject}
                            </span>
                          )}
                          {r.level && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-ink-muted">
                              {r.level}
                            </span>
                          )}
                          <span className="text-[10px] text-ink-muted">
                            {r.file_name} &middot; {formatSize(r.file_size)}
                          </span>
                        </div>
                      </div>
                      <a
                        href={`/api/resources/${r.id}/download`}
                        className="btn btn-gold !py-2 !px-4 !text-sm flex items-center gap-1.5 shrink-0"
                      >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Download</span>
                      </a>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
