'use client';

import { useEffect, useState } from 'react';
import Sidebar, { usePortalUser } from '@/components/portal/Sidebar';
import GlassCard from '@/components/GlassCard';
import { FolderOpen, Download, FileText, Search, ChevronDown } from 'lucide-react';

interface ResourceItem {
  id: string;
  title: string;
  subject: string;
  category: string;
  level: string;
  file_name: string;
  file_size: number;
  path: string;
  source?: 'static' | 'uploaded';
}

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

export default function ResourcesPage() {
  const user = usePortalUser();
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    Promise.all([
      fetch('/resources/manifest.json').then(r => r.json()).catch(() => []),
      fetch('/api/resources').then(r => r.json()).then(d => d.resources || []).catch(() => [])
    ]).then(([staticData, uploaded]) => {
      const staticItems = staticData.map((r: any) => ({ ...r, source: 'static' }));
      const uploadedItems = uploaded.map((r: any) => ({
        ...r,
        source: 'uploaded',
        category: 'Uploaded by Admin',
        subject: r.subject || 'General',
        path: `/api/resources/${r.id}/download`
      }));
      setResources([...uploadedItems, ...staticItems]);
    }).finally(() => setLoading(false));
  }, []);

  if (!user) return null;

  const filtered = resources.filter(r => {
    const matchSearch = !search
      || r.title.toLowerCase().includes(search.toLowerCase())
      || r.category.toLowerCase().includes(search.toLowerCase())
      || r.file_name.toLowerCase().includes(search.toLowerCase());
    const matchSubject = !filterSubject || r.subject === filterSubject;
    const matchCategory = !filterCategory || r.category === filterCategory;
    return matchSearch && matchSubject && matchCategory;
  });

  const subjects = Array.from(new Set(resources.map(r => r.subject)));
  const categories = Array.from(new Set(
    resources
      .filter(r => !filterSubject || r.subject === filterSubject)
      .map(r => r.category)
  ));

  // Group by subject then category
  const grouped: Record<string, Record<string, ResourceItem[]>> = {};
  for (const r of filtered) {
    if (!grouped[r.subject]) grouped[r.subject] = {};
    if (!grouped[r.subject][r.category]) grouped[r.subject][r.category] = [];
    grouped[r.subject][r.category].push(r);
  }

  const toggleCategory = (key: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const totalSize = filtered.reduce((sum, r) => sum + r.file_size, 0);

  return (
    <>
      <Sidebar user={user} />
      <main className="md:pl-[72px] pb-24 md:pb-10 min-h-screen">
        <div className="px-5 md:px-10 py-10 max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <p className="text-xs text-ink-muted uppercase tracking-widest">Resources</p>
            <h1 className="font-serif text-4xl md:text-5xl font-semibold text-gradient mt-2">
              Study Materials
            </h1>
            <p className="text-ink-soft mt-2">
              {filtered.length} resources available &middot; {formatSize(totalSize)} total
            </p>
          </div>

          {/* Search & Filters */}
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
            <select
              className="field !w-auto min-w-[150px]"
              value={filterSubject}
              onChange={e => { setFilterSubject(e.target.value); setFilterCategory(''); }}
            >
              <option value="">All Subjects</option>
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            {categories.length > 1 && (
              <select
                className="field !w-auto min-w-[150px]"
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            )}
          </div>

          {/* Content */}
          {loading ? (
            <div className="text-center py-20">
              <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : filtered.length === 0 ? (
            <GlassCard className="!p-12 text-center" hover={false}>
              <FolderOpen className="w-12 h-12 text-ink-muted mx-auto mb-4" />
              <h3 className="font-serif text-xl font-semibold text-ink-soft">No resources match your search</h3>
              <p className="text-sm text-ink-muted mt-2">Try adjusting your filters.</p>
            </GlassCard>
          ) : (
            <div className="space-y-8">
              {Object.entries(grouped).map(([subject, cats]) => {
                const color = SUBJECT_COLORS[subject] || '#f5b72f';
                return (
                  <div key={subject}>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="w-3 h-3 rounded-full" style={{ background: color }} />
                      <h2 className="font-serif text-2xl font-semibold">{subject}</h2>
                      <span className="text-xs text-ink-muted">
                        ({Object.values(cats).reduce((s, arr) => s + arr.length, 0)} files)
                      </span>
                    </div>

                    <div className="space-y-3 ml-2">
                      {Object.entries(cats).map(([category, items]) => {
                        const key = `${subject}-${category}`;
                        const isExpanded = expandedCategories.has(key);

                        return (
                          <GlassCard key={key} className="!p-0 overflow-hidden" hover={false}>
                            {/* Category header - clickable */}
                            <button
                              onClick={() => toggleCategory(key)}
                              className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/3 transition text-left"
                            >
                              <div className="flex items-center gap-3">
                                <FolderOpen className="w-4 h-4" style={{ color }} />
                                <span className="font-semibold text-sm">{category}</span>
                                <span className="text-xs text-ink-muted">{items.length} files</span>
                              </div>
                              <ChevronDown className={`w-4 h-4 text-ink-muted transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Files list */}
                            {isExpanded && (
                              <div className="border-t border-white/5 divide-y divide-white/5">
                                {items.map(r => (
                                  <div key={r.id} className="flex items-center gap-3 px-5 py-3 hover:bg-white/3 transition">
                                    <FileText className="w-4 h-4 text-ink-muted shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm truncate">{r.title}</p>
                                      <p className="text-[11px] text-ink-muted">{formatSize(r.file_size)}</p>
                                    </div>
                                    <a
                                      href={r.path}
                                      download={r.file_name}
                                      className="px-3 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-gold-dim hover:border-gold/30 text-xs font-semibold transition flex items-center gap-1.5 shrink-0"
                                    >
                                      <Download className="w-3 h-3" />
                                      Download
                                    </a>
                                  </div>
                                ))}
                              </div>
                            )}
                          </GlassCard>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
