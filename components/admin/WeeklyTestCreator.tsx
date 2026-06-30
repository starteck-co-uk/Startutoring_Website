'use client';

import { useState } from 'react';
import GlassCard from '@/components/GlassCard';
import { GL_SECTIONS } from '@/lib/gl-topics';
import { Plus, Trash2, Wand2, ChevronDown, ChevronUp, Save, Send, Database, RefreshCw, Layers } from 'lucide-react';
import type { Question } from '@/lib/types';

const LEVELS = ['11+', 'KS2', 'KS3', 'GCSE', 'A-Level'];

const SUBJECT_COLORS: Record<string, string> = {
  'Maths': '#a78bfa',
  'English': '#22d3ee',
  'Verbal Reasoning': '#f59e0b',
  'Non-Verbal Reasoning': '#ec4899'
};

interface SectionDraft {
  id: string;
  subject: string;
  topic_id: string;
  topic_name: string;
  question_count: number;
  time_minutes: number;
  questions: Question[];
  collapsed: boolean;
}

interface Props {
  onDone: () => void;
  onCancel: () => void;
}

const EMPTY_Q = (): Question => ({
  text: '',
  options: ['', '', '', ''],
  correct: 0,
  explanation: ''
});

function kebab(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function buildSections(): SectionDraft[] {
  return GL_SECTIONS.map(sec => {
    const qs: Question[] = [];
    for (let i = 0; i < sec.question_count; i++) qs.push(EMPTY_Q());
    return {
      id: `sec-${kebab(sec.name)}`,
      subject: sec.name,
      topic_id: sec.name,
      topic_name: sec.name,
      question_count: sec.question_count,
      time_minutes: sec.time_minutes,
      questions: qs,
      collapsed: true
    };
  });
}

export default function WeeklyTestCreator({ onDone, onCancel }: Props) {
  const [title, setTitle] = useState('');
  const [level, setLevel] = useState('11+');
  const [weekStart, setWeekStart] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); // Monday
    return d.toISOString().split('T')[0];
  });
  const [sections, setSections] = useState<SectionDraft[]>([]);
  const [step, setStep] = useState<'setup' | 'build'>('setup');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState<string | null>(null);
  const [redoing, setRedoing] = useState<string | null>(null);
  const [generatingBoth, setGeneratingBoth] = useState<string | null>(null); // progress message for Set A & B

  const totalQuestions = GL_SECTIONS.reduce((a, s) => a + s.question_count, 0);
  const totalTime = GL_SECTIONS.reduce((a, s) => a + s.time_minutes, 0);

  const getAutoTitle = (suffix?: string) => {
    const t = title.trim();
    if (t) return suffix ? `${t} (${suffix})` : t;
    const weekDate = new Date(weekStart);
    const weekStr = weekDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    const base = `Weekly Test — ${weekStr}`;
    return suffix ? `${base} (${suffix})` : base;
  };

  // ── Build step (single test) ──
  const startBuilding = () => {
    if (!title) {
      setTitle(getAutoTitle());
    }
    setSections(buildSections());
    setStep('build');
  };

  // ── Generate for one section ──
  const generateForSection = async (secIdx: number, source: 'ai' | 'bank') => {
    const sec = sections[secIdx];
    setGenerating(sec.id);
    setError(null);
    try {
      const endpoint = source === 'bank' ? '/api/admin/question-bank' : '/api/admin/generate-quiz';
      const r = await fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          subject: sec.subject,
          level,
          count: sec.question_count,
          topic: sec.topic_name
        })
      });
      const j = await r.json();
      if (j.questions) {
        setSections(prev => {
          const copy = [...prev];
          copy[secIdx] = { ...copy[secIdx], questions: j.questions.slice(0, sec.question_count), collapsed: false };
          return copy;
        });
      } else {
        throw new Error(j.error || 'No questions generated');
      }
    } catch (err: any) {
      setError(`Failed to generate ${sec.subject}: ${err.message}`);
    } finally {
      setGenerating(null);
    }
  };

  // ── Redo single question with AI ──
  const redoQuestionWithAI = async (secIdx: number, qIdx: number) => {
    const sec = sections[secIdx];
    const key = `${secIdx}-${qIdx}`;
    setRedoing(key);
    setError(null);
    try {
      const r = await fetch('/api/admin/generate-quiz', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          subject: sec.subject,
          level,
          count: 1,
          topic: sec.topic_name
        })
      });
      const j = await r.json();
      if (j.questions && j.questions.length > 0) {
        setSections(prev => {
          const copy = [...prev];
          const s = { ...copy[secIdx], questions: [...copy[secIdx].questions] };
          s.questions[qIdx] = j.questions[0];
          copy[secIdx] = s;
          return copy;
        });
      } else {
        throw new Error(j.error || 'No question generated');
      }
    } catch (err: any) {
      setError(`Failed to redo Q${qIdx + 1}: ${err.message}`);
    } finally {
      setRedoing(null);
    }
  };

  // ── Question editing helpers ──
  const updateQuestion = (secIdx: number, qIdx: number, field: keyof Question, value: any) => {
    setSections(prev => {
      const copy = [...prev];
      const sec = { ...copy[secIdx], questions: [...copy[secIdx].questions] };
      sec.questions[qIdx] = { ...sec.questions[qIdx], [field]: value };
      copy[secIdx] = sec;
      return copy;
    });
  };

  const updateOption = (secIdx: number, qIdx: number, optIdx: number, value: string) => {
    setSections(prev => {
      const copy = [...prev];
      const sec = { ...copy[secIdx], questions: [...copy[secIdx].questions] };
      const q = { ...sec.questions[qIdx], options: [...sec.questions[qIdx].options] };
      q.options[optIdx] = value;
      sec.questions[qIdx] = q;
      copy[secIdx] = sec;
      return copy;
    });
  };

  const addQuestion = (secIdx: number) => {
    setSections(prev => {
      const copy = [...prev];
      copy[secIdx] = { ...copy[secIdx], questions: [...copy[secIdx].questions, EMPTY_Q()] };
      return copy;
    });
  };

  const removeQuestion = (secIdx: number, qIdx: number) => {
    setSections(prev => {
      const copy = [...prev];
      copy[secIdx] = {
        ...copy[secIdx],
        questions: copy[secIdx].questions.filter((_, i) => i !== qIdx)
      };
      return copy;
    });
  };

  const toggleCollapse = (secIdx: number) => {
    setSections(prev => {
      const copy = [...prev];
      copy[secIdx] = { ...copy[secIdx], collapsed: !copy[secIdx].collapsed };
      return copy;
    });
  };

  // ── Save a single test ──
  const saveTest = async (publish: boolean) => {
    setSaving(true);
    setError(null);
    try {
      validateSections(sections);

      const finalTitle = title || getAutoTitle();
      const payload = buildPayload(finalTitle, sections);

      const r = await fetch('/api/admin/weekly-tests', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error);

      if (publish && j.test?.id) {
        await fetch(`/api/admin/weekly-tests/${j.test.id}`, {
          method: 'PATCH',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ status: 'published' })
        });
      }

      onDone();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ── Generate Set A & Set B ──
  const generateBothSets = async () => {
    setError(null);
    setGeneratingBoth('Generating Set A...');

    try {
      const setATitle = getAutoTitle('Set A');
      const setBTitle = getAutoTitle('Set B');

      // Generate Set A
      const setASections = await generateFullTest('A');
      setGeneratingBoth('Saving Set A...');
      const setAId = await saveAndPublish(setATitle, setASections);
      if (!setAId) throw new Error('Failed to save Set A');

      // Generate Set B
      setGeneratingBoth('Generating Set B...');
      const setBSections = await generateFullTest('B');
      setGeneratingBoth('Saving Set B...');
      const setBId = await saveAndPublish(setBTitle, setBSections);
      if (!setBId) throw new Error('Failed to save Set B');

      setGeneratingBoth(null);
      onDone();
    } catch (err: any) {
      setError(err.message);
      setGeneratingBoth(null);
    }
  };

  async function generateFullTest(label: string): Promise<SectionDraft[]> {
    const secs = buildSections();

    for (let i = 0; i < secs.length; i++) {
      const sec = secs[i];
      setGeneratingBoth(`Generating Set ${label}: ${sec.subject} (${i + 1}/${secs.length})...`);

      const r = await fetch('/api/admin/generate-quiz', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          subject: sec.subject,
          level,
          count: sec.question_count,
          topic: sec.topic_name
        })
      });
      const j = await r.json();
      if (j.questions) {
        secs[i] = { ...secs[i], questions: j.questions.slice(0, sec.question_count) };
      } else {
        throw new Error(j.error || `No questions generated for ${sec.subject}`);
      }
    }

    return secs;
  }

  async function saveAndPublish(testTitle: string, secs: SectionDraft[]): Promise<string | null> {
    const payload = buildPayload(testTitle, secs);

    const r = await fetch('/api/admin/weekly-tests', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const j = await r.json();
    if (!r.ok) throw new Error(j.error);

    if (j.test?.id) {
      await fetch(`/api/admin/weekly-tests/${j.test.id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ status: 'published' })
      });
      return j.test.id;
    }
    return null;
  }

  function buildPayload(testTitle: string, secs: SectionDraft[]) {
    return {
      title: testTitle,
      level,
      week_start: weekStart,
      sections: secs.map(s => {
        const validQs = s.questions.filter(q => q.text.trim());
        return {
          id: s.id,
          subject: s.subject,
          topic_id: s.topic_id,
          topic_name: s.topic_name,
          questions: validQs,
          question_count: validQs.length,
          time_minutes: s.time_minutes
        };
      })
    };
  }

  function validateSections(secs: SectionDraft[]) {
    for (const sec of secs) {
      const filledQs = sec.questions.filter(q => q.text.trim());
      if (filledQs.length === 0) {
        throw new Error(`Section "${sec.subject}" has no questions filled in. Use AI Fill or enter questions manually.`);
      }
      for (let i = 0; i < filledQs.length; i++) {
        const q = filledQs[i];
        const emptyOpts = q.options.filter(o => !o.trim()).length;
        if (emptyOpts > 0) {
          throw new Error(`${sec.subject}: Q${i + 1} has empty options. All 4 options are required.`);
        }
      }
    }
  }

  // ── Section stats for build step ──
  const sectionStats = sections.map(sec => {
    const filled = sec.questions.filter(q => q.text.trim()).length;
    return { name: sec.subject, filled, total: sec.questions.length };
  });

  // ─── Setup Step ───
  if (step === 'setup') {
    return (
      <div>
        <button onClick={onCancel} className="text-sm text-ink-muted hover:text-white mb-4">&larr; Back</button>
        <h2 className="font-serif text-3xl font-semibold text-gradient mb-2">Create Weekly Test</h2>
        <p className="text-ink-soft text-sm mb-8">
          GL Assessment format — 4 sections, 260 questions, ~220 minutes total. Generate Set A &amp; Set B for the week.
        </p>

        <GlassCard className="!p-6 space-y-5" hover={false}>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="field-label">Test Title</label>
              <input
                className="field"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Auto-generated from week date"
              />
            </div>
            <div>
              <label className="field-label">Level</label>
              <select className="field" value={level} onChange={(e) => setLevel(e.target.value)}>
                {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="field-label">Week Starting</label>
              <input
                type="date"
                className="field"
                value={weekStart}
                onChange={(e) => setWeekStart(e.target.value)}
              />
            </div>
          </div>

          {/* Section summary cards */}
          <div>
            <label className="field-label mb-3">Test Structure (fixed)</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {GL_SECTIONS.map(sec => (
                <div
                  key={sec.name}
                  className="p-4 rounded-xl bg-white/3 border border-white/10"
                  style={{ borderLeftWidth: 4, borderLeftColor: SUBJECT_COLORS[sec.name] || '#888' }}
                >
                  <p className="text-sm font-semibold" style={{ color: SUBJECT_COLORS[sec.name] || '#fff' }}>
                    {sec.name}
                  </p>
                  <p className="text-xs text-ink-muted mt-1">
                    {sec.question_count} questions &middot; {sec.time_minutes} min
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {sec.topics.map(t => (
                      <span key={t.id} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-ink-muted">
                        {t.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary + action buttons */}
          <div className="p-4 rounded-xl bg-white/3 border border-white/10">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-sm font-semibold">{totalQuestions} questions, {GL_SECTIONS.length} sections, ~{totalTime} minutes</p>
                <p className="text-xs text-ink-muted">All 4 sections are always included with the fixed GL Assessment structure</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={startBuilding}
                  className="text-xs px-4 py-2 rounded-xl border border-white/10 hover:border-gold/30 transition flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  Start Building Single Test
                </button>
                <button
                  onClick={generateBothSets}
                  disabled={!!generatingBoth}
                  className="btn btn-gold disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Layers className="w-4 h-4" />
                  {generatingBoth || 'Generate Set A & Set B'}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl border border-red-400/30 bg-red-400/10 text-red-300 text-sm">{error}</div>
          )}
        </GlassCard>
      </div>
    );
  }

  // ─── Build Step ───
  return (
    <div>
      <button onClick={() => setStep('setup')} className="text-sm text-ink-muted hover:text-white mb-4">&larr; Back to Setup</button>

      <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[300px]">
          <input
            className="field !text-2xl !font-semibold font-serif"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Weekly Test Title"
          />
          <div className="flex gap-3 mt-2 text-sm text-ink-muted flex-wrap">
            <span>{level}</span>
            <span>Week of {new Date(weekStart).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            <span>{sections.length} sections</span>
            <span>{sections.reduce((a, s) => a + s.questions.filter(q => q.text.trim()).length, 0)}/{totalQuestions} questions filled</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => saveTest(false)}
            disabled={saving}
            className="text-xs px-3 py-1.5 rounded-lg border border-white/10 hover:border-gold/30 transition disabled:opacity-50 flex items-center gap-1"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            onClick={() => saveTest(true)}
            disabled={saving}
            className="btn btn-gold !py-1.5 !px-4 !text-xs disabled:opacity-50 flex items-center gap-1"
          >
            <Send className="w-3.5 h-3.5" />
            Publish
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl border border-red-400/30 bg-red-400/10 text-red-300 text-sm">{error}</div>
      )}

      {/* Section progress cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {sectionStats.map(s => (
          <GlassCard key={s.name} className="!p-4" hover={false}>
            <p className="text-xs text-ink-muted uppercase tracking-widest">{s.name}</p>
            <p className="font-serif text-xl font-semibold mt-1">
              {s.filled}/{s.total}
              <span className="text-sm text-ink-muted ml-1">filled</span>
            </p>
            <div className="w-full h-1.5 rounded-full bg-white/5 mt-2 overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${s.total > 0 ? (s.filled / s.total) * 100 : 0}%`,
                  background: s.filled === s.total && s.total > 0
                    ? 'linear-gradient(90deg, #34d399, #10b981)'
                    : 'linear-gradient(90deg, #ffd166, #f5b72f)'
                }}
              />
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Section cards */}
      <div className="space-y-4">
        {sections.map((sec, si) => {
          const glSection = GL_SECTIONS.find(s => s.name === sec.subject);
          return (
            <GlassCard
              key={sec.id}
              className="!p-0 overflow-hidden"
              hover={false}
              style={{ borderLeft: `4px solid ${SUBJECT_COLORS[sec.subject] || '#888'}` }}
            >
              {/* Section header */}
              <div
                className="flex items-center justify-between p-5 cursor-pointer hover:bg-white/3 transition"
                onClick={() => toggleCollapse(si)}
              >
                <div className="flex items-center gap-3">
                  <div>
                    <h4 className="font-serif text-lg font-semibold">{sec.subject}</h4>
                    <p className="text-sm text-ink-muted">
                      {sec.question_count} questions &middot; {sec.time_minutes} min
                      {glSection && (
                        <span className="ml-2 text-ink-muted/60">
                          ({glSection.topics.map(t => t.name).join(', ')})
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-ink-muted mt-0.5">
                      {sec.questions.filter(q => q.text.trim()).length}/{sec.questions.length} questions filled
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); generateForSection(si, 'bank'); }}
                    disabled={!!generating}
                    className="text-xs px-3 py-1.5 rounded-lg border border-white/10 hover:border-cyan-400/30 transition disabled:opacity-50 flex items-center gap-1"
                    title="Fill from curated question bank"
                  >
                    <Database className="w-3.5 h-3.5" />
                    {generating === sec.id ? 'Filling...' : 'Bank Fill'}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); generateForSection(si, 'ai'); }}
                    disabled={!!generating}
                    className="text-xs px-3 py-1.5 rounded-lg border border-white/10 hover:border-gold/30 transition disabled:opacity-50 flex items-center gap-1"
                    title="Generate with AI"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    {generating === sec.id ? 'Generating...' : 'AI Fill'}
                  </button>
                  {sec.collapsed ? <ChevronDown className="w-5 h-5 text-ink-muted" /> : <ChevronUp className="w-5 h-5 text-ink-muted" />}
                </div>
              </div>

              {/* Questions */}
              {!sec.collapsed && (
                <div className="px-5 pb-5 space-y-4 border-t border-white/5 pt-4">
                  {sec.questions.map((q, qi) => (
                    <div key={qi} className="p-4 rounded-xl bg-white/3 border border-white/5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-ink-muted font-semibold">Q{qi + 1}</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => redoQuestionWithAI(si, qi)}
                            disabled={redoing === `${si}-${qi}`}
                            className="text-xs p-1 rounded hover:bg-gold-dim text-ink-muted hover:text-gold-light transition disabled:opacity-50"
                            title="Redo this question with AI"
                          >
                            {redoing === `${si}-${qi}`
                              ? <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              : <Wand2 className="w-3.5 h-3.5" />}
                          </button>
                          {sec.questions.length > 1 && (
                            <button
                              onClick={() => removeQuestion(si, qi)}
                              className="text-xs p-1 rounded hover:bg-red-400/10 text-red-300/60 hover:text-red-300 transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                      <textarea
                        className="field !bg-transparent !border-0 !p-0 !text-sm font-serif !min-h-[36px] resize-none w-full"
                        value={q.text}
                        onChange={(e) => updateQuestion(si, qi, 'text', e.target.value)}
                        placeholder="Enter question text..."
                        rows={2}
                      />
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {q.options.map((opt, oi) => (
                          <div key={oi} className="flex items-center gap-1.5">
                            <button
                              onClick={() => updateQuestion(si, qi, 'correct', oi)}
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 border transition ${
                                q.correct === oi
                                  ? 'bg-green-400/20 border-green-400/50 text-green-300'
                                  : 'bg-white/3 border-white/10 text-ink-muted hover:border-white/30'
                              }`}
                            >
                              {String.fromCharCode(65 + oi)}
                            </button>
                            <input
                              className="field !py-1 !text-xs flex-1"
                              value={opt}
                              onChange={(e) => updateOption(si, qi, oi, e.target.value)}
                              placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                            />
                          </div>
                        ))}
                      </div>
                      <textarea
                        className="field !text-xs !min-h-[30px] mt-2 resize-none"
                        value={q.explanation}
                        onChange={(e) => updateQuestion(si, qi, 'explanation', e.target.value)}
                        placeholder="Explanation (shown after grading)..."
                        rows={1}
                      />
                    </div>
                  ))}

                  <button
                    onClick={() => addQuestion(si)}
                    className="w-full py-3 rounded-xl border border-dashed border-white/10 hover:border-gold/30 text-sm text-ink-muted hover:text-gold-light transition flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Add Question
                  </button>
                </div>
              )}
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
