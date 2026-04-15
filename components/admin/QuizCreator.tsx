'use client';

import { useEffect, useState } from 'react';
import GlassCard from '@/components/GlassCard';
import type { Question } from '@/lib/types';

const SUBJECTS = ['Maths', 'Science', 'English'];
const LEVELS = ['11+', 'KS2', 'KS3', 'GCSE', 'A-Level'];

interface Props {
  quizId?: string;
  onDone: () => void;
  onCancel: () => void;
}

interface ChatMsg {
  role: 'user' | 'assistant';
  content: string;
}

export default function QuizCreator({ quizId, onDone, onCancel }: Props) {
  // Step 1 state (setup)
  const [subject, setSubject] = useState('Maths');
  const [level, setLevel] = useState('GCSE');
  const [topic, setTopic] = useState('');
  const [title, setTitle] = useState('');
  const [count, setCount] = useState(5);

  // Step 2 state (questions)
  const [questions, setQuestions] = useState<Question[]>([]);
  const [step, setStep] = useState<'setup' | 'preview'>('setup');
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quizDbId, setQuizDbId] = useState<string | undefined>(quizId);
  const [quizStatus, setQuizStatus] = useState('draft');

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatting, setChatting] = useState(false);
  const [showChat, setShowChat] = useState(false);

  // Regenerate
  const [regeneratingIdx, setRegeneratingIdx] = useState<number | null>(null);

  // Load existing quiz if editing
  useEffect(() => {
    if (!quizId) return;
    fetch(`/api/admin/quizzes/${quizId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.quiz) {
          setSubject(d.quiz.subject);
          setLevel(d.quiz.level);
          setTopic(d.quiz.topic || '');
          setTitle(d.quiz.title);
          setQuizStatus(d.quiz.status);
        }
        if (d.questions?.length > 0) {
          setQuestions(d.questions.map((q: any) => ({
            text: q.text,
            options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
            correct: q.correct,
            explanation: q.explanation
          })));
          setCount(d.questions.length);
          setStep('preview');
        }
      })
      .catch(() => {});
  }, [quizId]);

  const generate = async () => {
    setGenerating(true);
    setError(null);
    try {
      const r = await fetch('/api/admin/generate-quiz', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ subject, level, count, topic: topic || undefined })
      });
      const j = await r.json();
      if (j.questions) {
        setQuestions(j.questions);
        if (!title) setTitle(`${subject} Quiz — ${level}${topic ? ` (${topic})` : ''}`);
        setStep('preview');
      } else {
        throw new Error(j.error || 'No questions generated');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const saveQuiz = async (publish: boolean) => {
    setSaving(true);
    setError(null);
    try {
      let id = quizDbId;

      // Create quiz if new
      if (!id) {
        const r = await fetch('/api/admin/quizzes', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ title, subject, level, topic: topic || null })
        });
        const j = await r.json();
        if (!r.ok) throw new Error(j.error);
        id = j.quiz.id;
        setQuizDbId(id);
      } else {
        // Update title/topic
        await fetch(`/api/admin/quizzes/${id}`, {
          method: 'PATCH',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ title, topic: topic || null })
        });
      }

      // Save questions
      await fetch(`/api/admin/quizzes/${id}/questions`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ questions })
      });

      // Publish if requested
      if (publish) {
        await fetch(`/api/admin/quizzes/${id}`, {
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

  const sendChat = async () => {
    if (!chatInput.trim()) return;
    const newMsg: ChatMsg = { role: 'user', content: chatInput };
    const allMessages = [...chatMessages, newMsg];
    setChatMessages(allMessages);
    setChatInput('');
    setChatting(true);

    try {
      const r = await fetch('/api/admin/quiz-chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: allMessages, questions, subject, level })
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error);

      setChatMessages([...allMessages, { role: 'assistant', content: j.reply }]);
      if (j.questions) setQuestions(j.questions);
    } catch (err: any) {
      setChatMessages([...allMessages, { role: 'assistant', content: `Error: ${err.message}` }]);
    } finally {
      setChatting(false);
    }
  };

  const regenerateQuestion = async (idx: number) => {
    setRegeneratingIdx(idx);
    try {
      const r = await fetch('/api/admin/regenerate-question', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          subject, level, topic: topic || undefined,
          existing_questions: questions
        })
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error);

      const updated = [...questions];
      updated[idx] = j.question;
      setQuestions(updated);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setRegeneratingIdx(null);
    }
  };

  const updateQuestion = (idx: number, field: string, value: any) => {
    const updated = [...questions];
    (updated[idx] as any)[field] = value;
    setQuestions(updated);
  };

  const updateOption = (qIdx: number, oIdx: number, value: string) => {
    const updated = [...questions];
    updated[qIdx].options[oIdx] = value;
    setQuestions(updated);
  };

  // ─── Setup Step ───
  if (step === 'setup') {
    return (
      <div>
        <button onClick={onCancel} className="text-sm text-ink-muted hover:text-white mb-4">&larr; Back</button>
        <h2 className="font-serif text-3xl font-semibold text-gradient mb-2">
          {quizId ? 'Edit Quiz' : 'Create New Quiz'}
        </h2>
        <p className="text-ink-soft text-sm mb-8">
          Select subject, level, and optionally a topic. AI will generate curriculum-aligned questions.
        </p>

        <GlassCard className="!p-6 space-y-5" hover={false}>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="field-label">Subject</label>
              <select className="field" value={subject} onChange={(e) => setSubject(e.target.value)}>
                {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="field-label">Level</label>
              <select className="field" value={level} onChange={(e) => setLevel(e.target.value)}>
                {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="field-label">Topic (optional)</label>
            <input
              className="field"
              placeholder="e.g. Quadratic Equations, Photosynthesis, Shakespeare..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
            <p className="text-xs text-ink-muted mt-1">Leave blank for a general quiz across the whole subject.</p>
          </div>

          <div>
            <label className="field-label">Number of Questions</label>
            <div className="flex gap-2">
              {[5, 10, 15].map((n) => (
                <button
                  key={n}
                  onClick={() => setCount(n)}
                  className={`px-4 py-2 rounded-full text-sm border transition ${
                    count === n ? 'border-gold/60 bg-gold-dim text-gold-light' : 'border-white/10 bg-white/3 text-ink-soft'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl border border-red-400/30 bg-red-400/10 text-red-300 text-sm">{error}</div>
          )}

          <button onClick={generate} disabled={generating} className="btn btn-gold disabled:opacity-60">
            {generating ? 'Generating...' : 'Generate Quiz'}
          </button>
        </GlassCard>
      </div>
    );
  }

  // ─── Preview/Edit Step ───
  return (
    <div>
      <button onClick={() => quizId ? onCancel() : setStep('setup')} className="text-sm text-ink-muted hover:text-white mb-4">
        &larr; Back
      </button>
      <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[300px]">
          <input
            className="field !text-2xl !font-semibold font-serif"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Quiz Title"
          />
          <div className="flex gap-2 mt-2 text-sm text-ink-muted">
            <span>{subject}</span> <span>{level}</span>
            {topic && <span>Topic: {topic}</span>}
            <span>{questions.length} questions</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowChat(!showChat)} className={`text-xs px-3 py-1.5 rounded-lg border transition ${showChat ? 'border-gold/60 bg-gold-dim text-gold-light' : 'border-white/10 hover:border-gold/30'}`}>
            AI Chat
          </button>
          <button onClick={() => saveQuiz(false)} disabled={saving} className="text-xs px-3 py-1.5 rounded-lg border border-white/10 hover:border-gold/30 transition disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Draft'}
          </button>
          {quizStatus === 'draft' && (
            <button onClick={() => saveQuiz(true)} disabled={saving} className="btn btn-gold !py-1.5 !px-4 !text-xs disabled:opacity-50">
              Publish
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl border border-red-400/30 bg-red-400/10 text-red-300 text-sm">{error}</div>
      )}

      <div className={`${showChat ? 'grid lg:grid-cols-[1fr_380px] gap-6' : ''}`}>
        {/* Questions */}
        <div className="space-y-4">
          {questions.map((q, i) => (
            <GlassCard key={i} className="!p-6" hover={false} style={{ borderLeft: '4px solid rgba(245,183,47,0.4)' }}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="text-xs text-ink-muted font-semibold mt-1">Q{i + 1}</span>
                <button
                  onClick={() => regenerateQuestion(i)}
                  disabled={regeneratingIdx === i}
                  className="text-xs px-2 py-1 rounded border border-white/10 hover:border-gold/30 transition disabled:opacity-50 flex-shrink-0"
                >
                  {regeneratingIdx === i ? 'Regenerating...' : 'Regenerate'}
                </button>
              </div>

              <textarea
                className="field !bg-transparent !border-0 !p-0 !text-base font-serif !min-h-[40px] resize-none"
                value={q.text}
                onChange={(e) => updateQuestion(i, 'text', e.target.value)}
                rows={2}
              />

              <div className="grid grid-cols-2 gap-2 mt-3">
                {q.options.map((opt, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuestion(i, 'correct', j)}
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 border transition ${
                        q.correct === j
                          ? 'bg-green-400/20 border-green-400/50 text-green-300'
                          : 'bg-white/3 border-white/10 text-ink-muted hover:border-white/30'
                      }`}
                    >
                      {String.fromCharCode(65 + j)}
                    </button>
                    <input
                      className="field !py-1.5 !text-sm flex-1"
                      value={opt}
                      onChange={(e) => updateOption(i, j, e.target.value)}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-3">
                <label className="text-xs text-ink-muted">Explanation (shown to students after grading)</label>
                <textarea
                  className="field !text-sm !min-h-[50px] mt-1 resize-none"
                  value={q.explanation}
                  onChange={(e) => updateQuestion(i, 'explanation', e.target.value)}
                  rows={2}
                />
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Chat panel */}
        {showChat && (
          <div className="glass !p-4 h-fit sticky top-4">
            <h4 className="font-semibold text-sm mb-3">AI Assistant</h4>
            <p className="text-xs text-ink-muted mb-3">
              Tell the AI to adjust questions, fix errors, or change difficulty.
            </p>

            <div className="space-y-2 max-h-[400px] overflow-y-auto mb-3">
              {chatMessages.length === 0 && (
                <p className="text-xs text-ink-muted italic py-4 text-center">No messages yet. Try: "Make Q3 harder" or "The answer for Q2 should be C"</p>
              )}
              {chatMessages.map((m, i) => (
                <div key={i} className={`p-2.5 rounded-xl text-sm ${
                  m.role === 'user'
                    ? 'bg-gold-dim border border-gold/20 text-gold-light ml-6'
                    : 'bg-white/5 border border-white/5 mr-6'
                }`}>
                  {m.content}
                </div>
              ))}
              {chatting && (
                <div className="flex gap-1 p-2.5">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <input
                className="field !py-2 !text-sm flex-1"
                placeholder="Type your instruction..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !chatting && sendChat()}
              />
              <button
                onClick={sendChat}
                disabled={chatting || !chatInput.trim()}
                className="px-3 py-2 rounded-xl bg-gold text-[#1a1304] text-sm font-semibold disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
