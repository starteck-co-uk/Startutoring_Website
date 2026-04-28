'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import GlassCard from '@/components/GlassCard';
import SyllabiTab from '@/components/admin/SyllabiTab';
import QuizzesTab from '@/components/admin/QuizzesTab';
import StudentsAdminTab from '@/components/admin/StudentsAdminTab';

type Tab = 'overview' | 'syllabi' | 'quizzes' | 'assessments' | 'contacts' | 'feedback' | 'students' | 'settings';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [tab, setTab] = useState<Tab>('overview');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem('star_user');
    if (!raw) { router.replace('/portal/login'); return; }
    try {
      const u = JSON.parse(raw);
      if (u.role !== 'admin') { router.replace('/portal/dashboard'); return; }
      setUser(u);
    } catch { router.replace('/portal/login'); }
  }, [router]);

  useEffect(() => {
    if (!user) return;
    if (tab === 'settings' || tab === 'syllabi' || tab === 'quizzes' || tab === 'students' || tab === 'feedback') {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`/api/admin?section=${tab}`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [user, tab]);

  const logout = () => {
    localStorage.removeItem('star_user');
    router.push('/portal/login');
  };

  if (!user) return null;

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'syllabi', label: 'Syllabi', icon: '📚' },
    { id: 'quizzes', label: 'Quizzes', icon: '📝' },
    { id: 'assessments', label: 'Assessments', icon: '📋' },
    { id: 'contacts', label: 'Messages', icon: '✉' },
    { id: 'feedback', label: 'Feedback', icon: '⭐' },
    { id: 'students', label: 'Students', icon: '🎓' },
    { id: 'settings', label: 'AI Settings', icon: '⚙' }
  ];

  return (
    <main className="min-h-screen">
      {/* Top bar */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[rgba(8,13,26,0.8)] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold text-[#1a1304]"
              style={{ background: 'linear-gradient(135deg, #ffd166, #f5b72f)' }}
            >
              ★
            </div>
            <div>
              <span className="font-serif text-lg font-semibold text-gradient">Star Tutoring</span>
              <span className="text-xs text-ink-muted ml-2 uppercase tracking-widest">Admin</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-ink-soft hidden md:inline">{user.name}</span>
            <button onClick={logout} className="text-sm text-ink-muted hover:text-red-300 transition">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="sticky top-[73px] z-30 backdrop-blur-xl bg-[rgba(8,13,26,0.6)] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-5 flex gap-1 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                tab === t.id
                  ? 'border-gold text-gold-light'
                  : 'border-transparent text-ink-soft hover:text-white'
              }`}
            >
              <span>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-5 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {tab === 'overview' && <OverviewTab data={data} />}
            {tab === 'syllabi' && <SyllabiTab />}
            {tab === 'quizzes' && <QuizzesTab />}
            {tab === 'assessments' && <AssessmentsTab data={data} />}
            {tab === 'contacts' && <ContactsTab data={data} />}
            {tab === 'feedback' && <FeedbackTab />}
            {tab === 'students' && <StudentsAdminTab />}
            {tab === 'settings' && <SettingsTab />}
          </>
        )}
      </div>
    </main>
  );
}

/* ==================== OVERVIEW ==================== */
function OverviewTab({ data }: { data: any }) {
  if (!data?.counts) return <p className="text-ink-muted">No data available.</p>;
  const c = data.counts;
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-3xl font-semibold text-gradient mb-6">Dashboard</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { l: 'Students', v: c.students, c: '#f5b72f', icon: '🎓' },
            { l: 'Quizzes Taken', v: c.quizzes, c: '#34d399', icon: '📝' },
            { l: 'Pending Assessments', v: c.pendingAssessments, c: '#fbbf24', icon: '📋' },
            { l: 'Unread Messages', v: c.unreadContacts, c: '#f87171', icon: '✉' }
          ].map((s) => (
            <GlassCard key={s.l} className="!p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-ink-muted uppercase tracking-widest">{s.l}</p>
                  <p className="font-serif text-4xl font-semibold mt-2" style={{ color: s.c }}>
                    {s.v}
                  </p>
                </div>
                <span className="text-2xl">{s.icon}</span>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <GlassCard className="!p-6" hover={false}>
          <h3 className="font-serif text-xl font-semibold mb-4">Recent Quiz Results</h3>
          <div className="space-y-2">
            {(data.recentQuizzes || []).length === 0 && (
              <p className="text-ink-muted text-sm py-4 text-center">No quiz results yet.</p>
            )}
            {(data.recentQuizzes || []).map((q: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/3 border border-white/5">
                <div>
                  <p className="text-sm font-medium">{q.subject}</p>
                  <p className="text-xs text-ink-muted">{q.student_id?.slice(0, 8)}</p>
                </div>
                <span
                  className="font-serif text-lg font-semibold"
                  style={{ color: (q.percentage || 0) >= 75 ? '#34d399' : (q.percentage || 0) >= 50 ? '#fbbf24' : '#f87171' }}
                >
                  {Math.round(q.percentage || (q.score / q.total) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="!p-6" hover={false}>
          <h3 className="font-serif text-xl font-semibold mb-4">Quick Stats</h3>
          <div className="space-y-4">
            {[
              { l: 'Total Students', v: c.students },
              { l: 'Total Quizzes', v: c.quizzes },
              { l: 'Total Assessments', v: c.assessments },
              { l: 'Total Contact Messages', v: c.contacts }
            ].map((s) => (
              <div key={s.l} className="flex justify-between items-center">
                <span className="text-sm text-ink-soft">{s.l}</span>
                <span className="font-serif text-xl font-semibold">{s.v}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

/* ==================== ASSESSMENTS ==================== */
function AssessmentsTab({ data }: { data: any }) {
  const assessments = data?.assessments || [];
  return (
    <div>
      <h2 className="font-serif text-3xl font-semibold text-gradient mb-6">
        Assessment Bookings <span className="text-lg text-ink-muted">({assessments.length})</span>
      </h2>
      {assessments.length === 0 ? (
        <GlassCard className="!p-10 text-center" hover={false}>
          <p className="text-ink-muted">No assessment bookings yet.</p>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {assessments.map((a: any) => (
            <GlassCard key={a.id} className="!p-6" hover={false}>
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-serif text-xl font-semibold">{a.learner_name}</h3>
                    <span className={`text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded-full font-semibold ${
                      a.status === 'pending'
                        ? 'bg-yellow-400/10 border border-yellow-400/30 text-yellow-300'
                        : a.status === 'contacted'
                        ? 'bg-blue-400/10 border border-blue-400/30 text-blue-300'
                        : 'bg-green-400/10 border border-green-400/30 text-green-300'
                    }`}>
                      {a.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-sm">
                    <div>
                      <p className="text-xs text-ink-muted">Year</p>
                      <p>{a.academic_year || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-ink-muted">Course</p>
                      <p>{a.course || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-ink-muted">Parent</p>
                      <p>{a.parent_name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-ink-muted">School</p>
                      <p>{a.school_name || '—'}</p>
                    </div>
                  </div>

                  {a.subjects && a.subjects.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {a.subjects.map((s: string) => (
                        <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-gold-dim border border-gold/20 text-gold-light">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  {(a.good_at || a.improve) && (
                    <div className="grid md:grid-cols-2 gap-3 mt-4 text-sm">
                      {a.good_at && (
                        <div className="p-3 rounded-xl bg-green-400/5 border border-green-400/10">
                          <p className="text-xs text-green-300 mb-1 font-semibold">Strengths</p>
                          <p className="text-ink-soft">{a.good_at}</p>
                        </div>
                      )}
                      {a.improve && (
                        <div className="p-3 rounded-xl bg-orange-400/5 border border-orange-400/10">
                          <p className="text-xs text-orange-300 mb-1 font-semibold">To Improve</p>
                          <p className="text-ink-soft">{a.improve}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {a.medical && (
                    <div className="mt-3 p-3 rounded-xl bg-red-400/5 border border-red-400/10 text-sm">
                      <p className="text-xs text-red-300 mb-1 font-semibold">Medical Notes</p>
                      <p className="text-ink-soft">{a.medical}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2 text-right text-sm shrink-0">
                  <div>
                    <p className="text-xs text-ink-muted">Phone</p>
                    <a href={`tel:${a.phone}`} className="text-gold hover:text-gold-light">{a.phone}</a>
                  </div>
                  <div>
                    <p className="text-xs text-ink-muted">Email</p>
                    <a href={`mailto:${a.email}`} className="text-gold hover:text-gold-light">{a.email}</a>
                  </div>
                  <p className="text-xs text-ink-muted mt-1">
                    {new Date(a.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}

/* ==================== CONTACTS ==================== */
function ContactsTab({ data }: { data: any }) {
  const contacts = data?.contacts || [];
  return (
    <div>
      <h2 className="font-serif text-3xl font-semibold text-gradient mb-6">
        Contact Messages <span className="text-lg text-ink-muted">({contacts.length})</span>
      </h2>
      {contacts.length === 0 ? (
        <GlassCard className="!p-10 text-center" hover={false}>
          <p className="text-ink-muted">No messages yet.</p>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {contacts.map((c: any) => (
            <GlassCard key={c.id} className="!p-6" hover={false} style={{
              borderLeft: c.read ? '4px solid rgba(255,255,255,0.05)' : '4px solid #f5b72f'
            }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-serif text-lg font-semibold">{c.name}</h3>
                    {!c.read && (
                      <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-gold-dim border border-gold/30 text-gold-light font-semibold">
                        New
                      </span>
                    )}
                  </div>
                  <a href={`mailto:${c.email}`} className="text-sm text-gold hover:text-gold-light">
                    {c.email}
                  </a>
                  <p className="text-ink-soft mt-3 leading-relaxed">{c.message}</p>
                </div>
                <p className="text-xs text-ink-muted whitespace-nowrap">
                  {new Date(c.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </p>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}

/* ==================== FEEDBACK ==================== */
function FeedbackTab() {
  const [feedback, setFeedback] = useState<any[]>([]);
  const [loadingFb, setLoadingFb] = useState(true);

  useEffect(() => {
    fetch('/api/feedback')
      .then((r) => r.json())
      .then((d) => setFeedback(d.feedback || []))
      .catch(() => {})
      .finally(() => setLoadingFb(false));
  }, []);

  if (loadingFb) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-serif text-3xl font-semibold text-gradient mb-6">
        Feedback <span className="text-lg text-ink-muted">({feedback.length})</span>
      </h2>
      {feedback.length === 0 ? (
        <GlassCard className="!p-10 text-center" hover={false}>
          <p className="text-ink-muted">No feedback submitted yet.</p>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {feedback.map((f: any) => (
            <GlassCard key={f.id} className="!p-6" hover={false}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-serif text-lg font-semibold">{f.name}</h3>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className={star <= f.rating ? 'text-gold' : 'text-ink-muted'}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <a href={`mailto:${f.email}`} className="text-sm text-gold hover:text-gold-light">
                    {f.email}
                  </a>
                  <p className="text-ink-soft mt-3 leading-relaxed">{f.message}</p>
                </div>
                <p className="text-xs text-ink-muted whitespace-nowrap">
                  {new Date(f.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </p>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}

/* ==================== AI SETTINGS ==================== */
const PROVIDERS = [
  {
    id: 'claude' as const,
    name: 'Claude (Anthropic)',
    field: 'claude_key',
    color: '#d97706',
    icon: '🟠',
    placeholder: 'sk-ant-...',
    desc: 'Anthropic Claude API key. Uses claude-sonnet-4 model.'
  },
  {
    id: 'openai' as const,
    name: 'OpenAI (GPT)',
    field: 'openai_key',
    color: '#34d399',
    icon: '🟢',
    placeholder: 'sk-...',
    desc: 'OpenAI API key. Uses gpt-4o-mini model.'
  },
  {
    id: 'gemini' as const,
    name: 'Gemini (Google)',
    field: 'gemini_key',
    color: '#3b82f6',
    icon: '🔵',
    placeholder: 'AIza...',
    desc: 'Google AI Studio API key. Uses gemini-1.5-flash model.'
  },
  {
    id: 'copilot' as const,
    name: 'Copilot (GitHub Models)',
    field: 'copilot_key',
    color: '#a78bfa',
    icon: '🟣',
    placeholder: 'ghp_...',
    desc: 'GitHub personal access token for GitHub Models inference.'
  }
];

function SettingsTab() {
  const [provider, setProvider] = useState('claude');
  const [keys, setKeys] = useState<Record<string, string>>({
    claude_key: '',
    openai_key: '',
    gemini_key: '',
    copilot_key: ''
  });
  const [maskedKeys, setMaskedKeys] = useState<Record<string, string>>({});
  const [hasKeys, setHasKeys] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((d) => {
        setProvider(d.provider || 'claude');
        setMaskedKeys({
          claude_key: d.claude_key || '',
          openai_key: d.openai_key || '',
          gemini_key: d.gemini_key || '',
          copilot_key: d.copilot_key || ''
        });
        setHasKeys({
          claude_key: d.has_claude,
          openai_key: d.has_openai,
          gemini_key: d.has_gemini,
          copilot_key: d.has_copilot
        });
      })
      .catch(() => {})
      .finally(() => setLoadingSettings(false));
  }, []);

  const save = async () => {
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      // Only send keys that the admin actually typed (non-empty)
      const payload: any = { provider };
      for (const p of PROVIDERS) {
        if (keys[p.field]) {
          payload[p.field] = keys[p.field];
        }
      }
      const r = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || 'Failed to save');
      setSaved(true);
      // refresh masked view
      const fresh = await fetch('/api/admin/settings').then((r) => r.json());
      setMaskedKeys({
        claude_key: fresh.claude_key || '',
        openai_key: fresh.openai_key || '',
        gemini_key: fresh.gemini_key || '',
        copilot_key: fresh.copilot_key || ''
      });
      setHasKeys({
        claude_key: fresh.has_claude,
        openai_key: fresh.has_openai,
        gemini_key: fresh.has_gemini,
        copilot_key: fresh.has_copilot
      });
      setKeys({ claude_key: '', openai_key: '', gemini_key: '', copilot_key: '' });
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loadingSettings) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-serif text-3xl font-semibold text-gradient mb-2">AI Provider Settings</h2>
      <p className="text-ink-soft text-sm mb-8">
        Choose which AI provider generates quiz questions. Paste your API key below — keys are stored
        securely and never shown in full again.
      </p>

      {/* Active provider selector */}
      <GlassCard className="!p-6 mb-8" hover={false}>
        <p className="text-xs text-ink-muted uppercase tracking-widest mb-4">Active Provider</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {PROVIDERS.map((p) => (
            <button
              key={p.id}
              onClick={() => setProvider(p.id)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                provider === p.id
                  ? 'border-gold/60 bg-gold-dim shadow-[0_0_30px_-5px_rgba(245,183,47,0.3)]'
                  : 'border-white/8 bg-white/3 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl">{p.icon}</span>
                {provider === p.id && (
                  <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-gold text-[#1a1304] font-bold">
                    Active
                  </span>
                )}
              </div>
              <p className="font-semibold text-sm">{p.name}</p>
              <p className="text-xs text-ink-muted mt-1">
                {hasKeys[p.field] ? (
                  <span className="text-ok">Key configured</span>
                ) : (
                  <span className="text-ink-muted">No key set</span>
                )}
              </p>
            </button>
          ))}
        </div>
      </GlassCard>

      {/* API key inputs */}
      <div className="space-y-4 mb-8">
        {PROVIDERS.map((p) => (
          <GlassCard
            key={p.id}
            className={`!p-6 transition-all ${
              provider === p.id ? 'ring-1 ring-gold/30' : ''
            }`}
            hover={false}
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                <span className="text-xl">{p.icon}</span>
                <div>
                  <h4 className="font-semibold">{p.name}</h4>
                  <p className="text-xs text-ink-muted">{p.desc}</p>
                </div>
              </div>
              {hasKeys[p.field] && (
                <span className="text-xs px-2 py-1 rounded-full bg-green-400/10 border border-green-400/30 text-green-300 whitespace-nowrap">
                  Configured
                </span>
              )}
            </div>

            {hasKeys[p.field] && (
              <div className="mb-3 px-3 py-2 rounded-lg bg-white/3 border border-white/5 text-sm font-mono text-ink-muted">
                {maskedKeys[p.field]}
              </div>
            )}

            <div>
              <label className="field-label">
                {hasKeys[p.field] ? 'Replace API Key' : 'API Key'}
              </label>
              <input
                type="password"
                className="field font-mono text-sm"
                placeholder={p.placeholder}
                value={keys[p.field]}
                onChange={(e) => setKeys({ ...keys, [p.field]: e.target.value })}
              />
            </div>
          </GlassCard>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-xl border border-red-400/30 bg-red-400/10 text-red-300 text-sm">
          {error}
        </div>
      )}

      {saved && (
        <div className="mb-4 p-4 rounded-xl border border-green-400/30 bg-green-400/10 text-green-300 text-sm">
          Settings saved successfully. Quizzes will now use {PROVIDERS.find((p) => p.id === provider)?.name}.
        </div>
      )}

      <button
        onClick={save}
        disabled={saving}
        className="btn btn-gold disabled:opacity-60"
      >
        {saving ? 'Saving...' : 'Save Settings'}
      </button>

      <div className="mt-8 p-5 rounded-xl bg-white/3 border border-white/5">
        <p className="text-xs text-ink-muted uppercase tracking-widest mb-2">How it works</p>
        <ul className="space-y-2 text-sm text-ink-soft">
          <li className="flex gap-2"><span className="text-gold">1.</span> Select an AI provider above</li>
          <li className="flex gap-2"><span className="text-gold">2.</span> Paste its API key in the field</li>
          <li className="flex gap-2"><span className="text-gold">3.</span> Click "Save Settings"</li>
          <li className="flex gap-2"><span className="text-gold">4.</span> Students will get AI-generated quizzes from your chosen provider</li>
          <li className="flex gap-2"><span className="text-ink-muted">*</span> If no key is configured, quizzes fall back to a curated question bank</li>
        </ul>
      </div>
    </div>
  );
}
