'use client';

import { useState } from 'react';
import GlassCard from '@/components/GlassCard';
import { GL_SUBJECTS } from '@/lib/gl-topics';
import { Plus, Trash2, Wand2, PenLine, ChevronDown, ChevronUp, Save, Send } from 'lucide-react';
import type { Question } from '@/lib/types';

const LEVELS = ['11+', 'KS2', 'KS3', 'GCSE', 'A-Level'];

interface SectionDraft {
  id: string;
  subject: string;
  topic_id: string;
  topic_name: string;
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
  const [generating, setGenerating] = useState<string | null>(null); // section id being generated

  // Build sections from selected topics
  const [selectedTopics, setSelectedTopics] = useState<Record<string, string[]>>(() => {
    const m: Record<string, string[]> = {};
    GL_SUBJECTS.forEach(s => { m[s.name] = s.topics.map(t => t.id); });
    return m;
  });

  const toggleTopic = (subject: string, topicId: string) => {
    setSelectedTopics(prev => {
      const curr = prev[subject] || [];
      return {
        ...prev,
        [subject]: curr.includes(topicId)
          ? curr.filter(t => t !== topicId)
          : [...curr, topicId]
      };
    });
  };

  const totalTopics = Object.values(selectedTopics).reduce((a, v) => a + v.length, 0);
  const totalQuestions = totalTopics * 20;

  const startBuilding = () => {
    if (!title) {
      const weekDate = new Date(weekStart);
      const weekStr = weekDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
      setTitle(`Weekly Test — ${weekStr}`);
    }

    const newSections: SectionDraft[] = [];
    GL_SUBJECTS.forEach(subj => {
      const topics = selectedTopics[subj.name] || [];
      subj.topics.forEach(t => {
        if (topics.includes(t.id)) {
          const qs: Question[] = [];
          for (let i = 0; i < 20; i++) qs.push(EMPTY_Q());
          newSections.push({
            id: `sec-${subj.name}-${t.id}`,
            subject: subj.name,
            topic_id: t.id,
            topic_name: t.name,
            questions: qs,
            collapsed: true
          });
        }
      });
    });

    setSections(newSections);
    setStep('build');
  };

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

  const generateForSection = async (secIdx: number) => {
    const sec = sections[secIdx];
    setGenerating(sec.id);
    setError(null);
    try {
      const r = await fetch('/api/admin/generate-quiz', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          subject: sec.subject,
          level,
          count: 20,
          topic: sec.topic_name
        })
      });
      const j = await r.json();
      if (j.questions) {
        setSections(prev => {
          const copy = [...prev];
          copy[secIdx] = { ...copy[secIdx], questions: j.questions.slice(0, 20), collapsed: false };
          return copy;
        });
      } else {
        throw new Error(j.error || 'No questions generated');
      }
    } catch (err: any) {
      setError(`Failed to generate ${sec.subject} - ${sec.topic_name}: ${err.message}`);
    } finally {
      setGenerating(null);
    }
  };

  const saveTest = async (publish: boolean) => {
    setSaving(true);
    setError(null);
    try {
      // Validate questions before saving
      for (const sec of sections) {
        const filledQs = sec.questions.filter(q => q.text.trim());
        if (filledQs.length === 0) {
          throw new Error(`Section "${sec.subject} — ${sec.topic_name}" has no questions filled in. Use AI Fill or enter questions manually.`);
        }
        for (let i = 0; i < filledQs.length; i++) {
          const q = filledQs[i];
          const emptyOpts = q.options.filter(o => !o.trim()).length;
          if (emptyOpts > 0) {
            throw new Error(`${sec.subject} — ${sec.topic_name}: Q${i + 1} has empty options. All 4 options are required.`);
          }
        }
      }

      const finalTitle = title || `Weekly Test — ${level}`;
      // Strip empty questions before sending
      const payload = {
        title: finalTitle,
        level,
        week_start: weekStart,
        sections: sections.map(s => {
          const validQs = s.questions.filter(q => q.text.trim());
          return {
            id: s.id,
            subject: s.subject,
            topic_id: s.topic_id,
            topic_name: s.topic_name,
            questions: validQs,
            question_count: validQs.length
          };
        })
      };

      // Create the test
      const r = await fetch('/api/admin/weekly-tests', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error);

      // Publish if requested
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

  // Compute subject completion stats
  const subjectStats = GL_SUBJECTS.map(subj => {
    const subSections = sections.filter(s => s.subject === subj.name);
    const filled = subSections.reduce((acc, s) =>
      acc + s.questions.filter(q => q.text.trim()).length, 0);
    const total = subSections.reduce((acc, s) => acc + s.questions.length, 0);
    return { name: subj.name, filled, total, sections: subSections.length };
  }).filter(s => s.sections > 0);

  // ─── Setup Step ───
  if (step === 'setup') {
    return (
      <div>
        <button onClick={onCancel} className="text-sm text-ink-muted hover:text-white mb-4">&larr; Back</button>
        <h2 className="font-serif text-3xl font-semibold text-gradient mb-2">Create Weekly Test</h2>
        <p className="text-ink-soft text-sm mb-8">
          GL Assessment format — all 4 subjects, 20 questions per topic, 2 tests per student per week.
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

          <div>
            <label className="field-label mb-3">Select Topics (20 questions each)</label>
            <div className="space-y-4">
              {GL_SUBJECTS.map(subj => (
                <div key={subj.name}>
                  <p className="text-sm font-semibold mb-2">{subj.name}</p>
                  <div className="flex flex-wrap gap-2">
                    {subj.topics.map(t => {
                      const active = (selectedTopics[subj.name] || []).includes(t.id);
                      return (
                        <button
                          key={t.id}
                          onClick={() => toggleTopic(subj.name, t.id)}
                          className={`px-3 py-2 rounded-xl text-sm border transition ${
                            active
                              ? 'border-gold/60 bg-gold-dim text-gold-light'
                              : 'border-white/10 bg-white/3 text-ink-soft hover:border-white/20'
                          }`}
                        >
                          <span className="font-medium">{t.name}</span>
                          <span className="text-xs text-ink-muted ml-1.5">20 Qs</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/3 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">{totalTopics} topics selected</p>
                <p className="text-xs text-ink-muted">{totalQuestions} total questions across 4 subjects</p>
              </div>
              <button
                onClick={startBuilding}
                disabled={totalTopics === 0}
                className="btn btn-gold disabled:opacity-50"
              >
                Start Building Test
              </button>
            </div>
          </div>
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
            <span>{sections.reduce((a, s) => a + s.questions.length, 0)} questions</span>
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

      {/* Subject progress */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {subjectStats.map(s => (
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

      {/* Sections */}
      <div className="space-y-4">
        {sections.map((sec, si) => (
          <GlassCard
            key={sec.id}
            className="!p-0 overflow-hidden"
            hover={false}
            style={{ borderLeft: `4px solid ${
              sec.subject === 'Maths' ? '#a78bfa' :
              sec.subject === 'English' ? '#22d3ee' :
              sec.subject === 'Verbal Reasoning' ? '#f59e0b' :
              '#ec4899'
            }` }}
          >
            {/* Section header */}
            <div
              className="flex items-center justify-between p-5 cursor-pointer hover:bg-white/3 transition"
              onClick={() => toggleCollapse(si)}
            >
              <div className="flex items-center gap-3">
                <div>
                  <h4 className="font-serif text-lg font-semibold">{sec.subject}</h4>
                  <p className="text-sm text-ink-muted">{sec.topic_name} &middot; {sec.questions.filter(q => q.text.trim()).length}/{sec.questions.length} questions filled</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); generateForSection(si); }}
                  disabled={generating === sec.id}
                  className="text-xs px-3 py-1.5 rounded-lg border border-white/10 hover:border-gold/30 transition disabled:opacity-50 flex items-center gap-1"
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
                      {sec.questions.length > 1 && (
                        <button
                          onClick={() => removeQuestion(si, qi)}
                          className="text-xs p-1 rounded hover:bg-red-400/10 text-red-300/60 hover:text-red-300 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
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
        ))}
      </div>
    </div>
  );
}
