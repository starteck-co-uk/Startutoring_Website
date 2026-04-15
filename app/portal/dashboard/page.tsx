'use client';

import { useEffect, useState, useRef } from 'react';
import Sidebar, { usePortalUser } from '@/components/portal/Sidebar';
import GlassCard from '@/components/GlassCard';
import QuizRunner from '@/components/portal/QuizRunner';
import QuizResults from '@/components/portal/QuizResults';
import PdfGradeResults from '@/components/portal/PdfGradeResults';
import AssignedQuizList from '@/components/portal/AssignedQuizList';
import type { Question, Subject, Level } from '@/lib/types';

const SUBJECTS: {
  name: Subject;
  icon: string;
  grad: string;
  desc: string;
}[] = [
  {
    name: 'Maths',
    icon: '∑',
    grad: 'linear-gradient(135deg, #a78bfa, #6366f1)',
    desc: 'Numbers, algebra, geometry & problem solving'
  },
  {
    name: 'Science',
    icon: '⚡',
    grad: 'linear-gradient(135deg, #ec4899, #f472b6)',
    desc: 'Physics, Chemistry & Biology'
  },
  {
    name: 'English',
    icon: '📖',
    grad: 'linear-gradient(135deg, #22d3ee, #3b82f6)',
    desc: 'Reading, grammar & creative writing'
  }
];

const LEVELS: Level[] = ['11+', 'KS2', 'KS3', 'GCSE', 'A-Level'];

type Phase = 'idle' | 'loading' | 'quiz' | 'results' | 'pdf-grading' | 'pdf-results' | 'assigned-quiz' | 'assigned-results';

export default function DashboardPage() {
  const user = usePortalUser();
  const [phase, setPhase] = useState<Phase>('idle');
  const [currentSubject, setCurrentSubject] = useState<string>('');
  const [currentLevel, setCurrentLevel] = useState<string>('');
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [result, setResult] = useState<{
    score: number;
    total: number;
    timeTakenSecs: number;
    answers: Array<Question & { selected: number | null }>;
  } | null>(null);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [pdfGrading, setPdfGrading] = useState<any>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [assignedQuizId, setAssignedQuizId] = useState<string | null>(null);
  const [assignedQuestions, setAssignedQuestions] = useState<Array<{ id: string; question_order: number; text: string; options: string[] }>>([]);
  const [assignedResult, setAssignedResult] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/student-stats?id=${user.id}`)
      .then((r) => r.json())
      .then(setStats)
      .catch(() => setStats(null));
  }, [user]);

  const startQuiz = async (subject: string, level: string) => {
    setCurrentSubject(subject);
    setCurrentLevel(level);
    setPhase('loading');
    try {
      const r = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ subject, level, count: 5 })
      });
      const j = await r.json();
      setQuestions(j.questions || []);
      setTitle(`${subject} Quiz — ${level}`);
      setPhase('quiz');
    } catch {
      setPhase('idle');
    }
  };

  const onComplete = (r: typeof result) => {
    setResult(r);
    setPhase('results');
  };

  const onSave = async () => {
    if (!result || !user) return;
    setSaving(true);
    try {
      await fetch('/api/submit-quiz', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          student_id: user.id,
          subject: currentSubject,
          level: currentLevel,
          title,
          score: result.score,
          total: result.total,
          time_taken_secs: result.timeTakenSecs,
          questions: result.answers
        })
      });
    } catch {}
    setSaving(false);
    setPhase('idle');
    setResult(null);
    // refresh stats
    fetch(`/api/student-stats?id=${user.id}`)
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  };

  const startPdfUpload = (subject: string, level: string) => {
    setCurrentSubject(subject);
    setCurrentLevel(level);
    setPdfError(null);
    fileInputRef.current?.click();
  };

  const handlePdfFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    if (file.type !== 'application/pdf') {
      setPdfError('Please upload a PDF file.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setPdfError('File too large. Maximum size is 10MB.');
      return;
    }

    setPhase('pdf-grading');
    setTitle(`${currentSubject} — ${currentLevel} (PDF)`);
    setPdfError(null);

    try {
      const formData = new FormData();
      formData.append('pdf', file);
      formData.append('subject', currentSubject);
      formData.append('level', currentLevel);

      const r = await fetch('/api/grade-pdf', { method: 'POST', body: formData });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || 'Grading failed');

      setPdfGrading(j.grading);
      setPhase('pdf-results');
    } catch (err: any) {
      setPdfError(err.message || 'Failed to grade PDF.');
      setPhase('idle');
    }
  };

  // Extract student level from grade string like "Year 10 — GCSE"
  const studentLevel = user?.grade?.includes('—')
    ? user.grade.split('—')[1]?.trim()
    : user?.grade?.split(' ').pop() || '';

  const startAssignedQuiz = async (quizId: string, quizTitle: string) => {
    setAssignedQuizId(quizId);
    setTitle(quizTitle);
    setPhase('loading');
    try {
      const r = await fetch(`/api/student/quizzes/${quizId}`);
      const j = await r.json();
      if (!r.ok) throw new Error(j.error);
      setAssignedQuestions(j.questions || []);
      setPhase('assigned-quiz');
    } catch {
      setPhase('idle');
    }
  };

  const onAssignedComplete = async (r: { score: number; total: number; timeTakenSecs: number; answers: any[] }) => {
    if (!user || !assignedQuizId) return;
    setPhase('loading');
    try {
      const submitR = await fetch(`/api/student/quizzes/${assignedQuizId}/submit`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          student_id: user.id,
          answers: r.answers.map((a: any) => ({ question_id: a.id, selected: a.selected })),
          time_taken_secs: r.timeTakenSecs
        })
      });
      const j = await submitR.json();

      // Fetch full results with correct answers
      const resultsR = await fetch(`/api/student/quizzes/${assignedQuizId}/results?student_id=${user.id}`);
      const resultsJ = await resultsR.json();
      setAssignedResult(resultsJ);
      setPhase('assigned-results');
    } catch {
      setPhase('idle');
    }
  };

  const viewAssignedResults = async (quizId: string) => {
    if (!user) return;
    setAssignedQuizId(quizId);
    setPhase('loading');
    try {
      const r = await fetch(`/api/student/quizzes/${quizId}/results?student_id=${user.id}`);
      const j = await r.json();
      if (!r.ok) throw new Error(j.error);
      setTitle(j.quiz?.title || 'Quiz Results');
      setAssignedResult(j);
      setPhase('assigned-results');
    } catch {
      setPhase('idle');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (phase === 'quiz' && questions.length > 0) {
    return (
      <QuizRunner
        title={title}
        subject={currentSubject}
        level={currentLevel}
        questions={questions}
        onExit={() => setPhase('idle')}
        onComplete={onComplete}
      />
    );
  }

  if (phase === 'results' && result) {
    return (
      <QuizResults
        title={title}
        subject={currentSubject}
        level={currentLevel}
        score={result.score}
        total={result.total}
        timeTakenSecs={result.timeTakenSecs}
        answers={result.answers}
        saving={saving}
        onSave={onSave}
      />
    );
  }

  if (phase === 'pdf-results' && pdfGrading) {
    return (
      <PdfGradeResults
        title={title}
        subject={currentSubject}
        level={currentLevel}
        grading={pdfGrading}
        onDone={() => {
          setPhase('idle');
          setPdfGrading(null);
        }}
      />
    );
  }

  if (phase === 'pdf-grading') {
    return (
      <>
        <Sidebar user={user} />
        <main className="md:pl-[72px] min-h-screen flex items-center justify-center px-5">
          <div className="text-center">
            <div className="w-20 h-20 rounded-3xl mx-auto flex items-center justify-center text-4xl animate-pulseGold"
              style={{ background: 'linear-gradient(135deg, #ffd166, #f5b72f)', color: '#1a1304' }}
            >
              ★
            </div>
            <h2 className="font-serif text-2xl font-semibold mt-6 text-gradient">
              Grading your work...
            </h2>
            <p className="text-ink-soft text-sm mt-2">
              AI is analysing your {currentLevel} {currentSubject} submission — checking method, steps, and answers
            </p>
            <div className="mt-6 flex justify-center gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-gold animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        </main>
      </>
    );
  }

  if (phase === 'assigned-quiz' && assignedQuestions.length > 0) {
    // Convert assigned questions (no correct/explanation) to QuizRunner format
    const runnerQuestions: Question[] = assignedQuestions.map((q) => ({
      text: q.text,
      options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
      correct: -1, // hidden
      explanation: ''
    }));

    return (
      <QuizRunner
        title={title}
        subject=""
        level=""
        questions={runnerQuestions}
        onExit={() => setPhase('idle')}
        onComplete={(r) => {
          // Attach question IDs to answers for submission
          const answersWithIds = r!.answers.map((a, i) => ({
            ...a,
            id: assignedQuestions[i]?.id
          }));
          onAssignedComplete({ ...r!, answers: answersWithIds });
        }}
      />
    );
  }

  if (phase === 'assigned-results' && assignedResult) {
    const { attempt, questions: fullQuestions } = assignedResult;
    const answerMap = new Map((attempt.answers || []).map((a: any) => [a.question_id, a.selected]));
    const reviewAnswers = (fullQuestions || []).map((q: any) => ({
      text: q.text,
      options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
      correct: q.correct,
      explanation: q.explanation,
      selected: answerMap.get(q.id) ?? null
    }));

    return (
      <QuizResults
        title={assignedResult.quiz?.title || title}
        subject={assignedResult.quiz?.subject || ''}
        level={assignedResult.quiz?.level || ''}
        score={attempt.score || 0}
        total={attempt.total || 0}
        timeTakenSecs={attempt.time_taken_secs || 0}
        answers={reviewAnswers}
        saving={false}
        onSave={() => {
          setPhase('idle');
          setAssignedResult(null);
          // refresh stats
          if (user) {
            fetch(`/api/student-stats?id=${user.id}`)
              .then((r) => r.json())
              .then(setStats)
              .catch(() => {});
          }
        }}
      />
    );
  }

  if (phase === 'loading') {
    return (
      <>
        <Sidebar user={user} />
        <main className="md:pl-[72px] min-h-screen flex items-center justify-center px-5">
          <div className="text-center">
            <div className="w-20 h-20 rounded-3xl mx-auto flex items-center justify-center text-4xl animate-pulseGold"
              style={{ background: 'linear-gradient(135deg, #ffd166, #f5b72f)', color: '#1a1304' }}
            >
              ★
            </div>
            <h2 className="font-serif text-2xl font-semibold mt-6 text-gradient">
              AI is generating fresh questions...
            </h2>
            <p className="text-ink-soft text-sm mt-2">
              Creating a brand new {currentLevel} {currentSubject} quiz just for you
            </p>
            <div className="mt-6 flex justify-center gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-gold animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        </main>
      </>
    );
  }

  const recent: any[] = stats?.recent || [];

  return (
    <>
      <Sidebar user={user} />
      <main className="md:pl-[72px] pb-24 md:pb-10 min-h-screen">
        <div className="px-5 md:px-10 py-10 max-w-6xl mx-auto">
          <div className="flex items-start justify-between flex-wrap gap-4 mb-10">
            <div>
              <p className="text-xs text-ink-muted uppercase tracking-widest">
                Welcome back, {user.name.split(' ')[0]}
              </p>
              <h1 className="font-serif text-4xl md:text-5xl font-semibold text-gradient mt-2">
                Take a Quiz
              </h1>
              <p className="text-ink-soft mt-2">
                AI generates fresh questions every time — or upload your work as a PDF for detailed grading.
              </p>
            </div>
          </div>

          {/* Assigned quizzes from admin */}
          <AssignedQuizList
            studentId={user.id}
            level={studentLevel}
            onTakeQuiz={startAssignedQuiz}
            onViewResults={viewAssignedResults}
          />

          {/* Hidden file input for PDF uploads */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handlePdfFile}
          />

          {pdfError && (
            <div className="mb-6 p-4 rounded-xl border border-red-400/30 bg-red-400/10 text-red-300 text-sm">
              {pdfError}
            </div>
          )}

          <div className="space-y-6">
            {SUBJECTS.map((s) => {
              const subStats = stats?.bySubject?.[s.name] || { count: 0, avg: 0 };
              return (
                <GlassCard key={s.name} className="!p-7 md:!p-9">
                  <div className="flex items-start gap-5 flex-wrap">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-bold text-white flex-shrink-0"
                      style={{ background: s.grad, boxShadow: '0 10px 30px -10px rgba(0,0,0,0.6)' }}
                    >
                      {s.icon}
                    </div>
                    <div className="flex-1 min-w-[220px]">
                      <h2 className="font-serif text-2xl font-semibold">{s.name}</h2>
                      <p className="text-ink-soft text-sm mt-1">{s.desc}</p>
                    </div>
                    <div className="flex gap-3 text-sm text-right">
                      <div>
                        <p className="text-xs text-ink-muted uppercase">Quizzes</p>
                        <p className="font-serif text-xl font-semibold">{subStats.count}</p>
                      </div>
                      <div>
                        <p className="text-xs text-ink-muted uppercase">Avg</p>
                        <p className="font-serif text-xl font-semibold text-gold">
                          {subStats.avg ? `${Math.round(subStats.avg)}%` : '—'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <p className="text-xs text-ink-muted uppercase tracking-widest mb-2">Take a Quiz</p>
                    <div className="flex flex-wrap gap-2">
                      {LEVELS.map((l) => (
                        <button
                          key={l}
                          onClick={() => startQuiz(s.name, l)}
                          className="px-4 py-2 rounded-full border border-white/10 bg-white/3 text-sm text-ink-soft hover:border-gold/50 hover:bg-gold-dim hover:text-gold-light transition-all"
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-xs text-ink-muted uppercase tracking-widest mb-2">Upload Work for Grading</p>
                    <div className="flex flex-wrap gap-2">
                      {LEVELS.map((l) => (
                        <button
                          key={`pdf-${l}`}
                          onClick={() => startPdfUpload(s.name, l)}
                          className="px-4 py-2 rounded-full border border-white/10 bg-white/3 text-sm text-ink-soft hover:border-cyan-400/50 hover:bg-cyan-400/10 hover:text-cyan-300 transition-all flex items-center gap-1.5"
                        >
                          <span className="text-xs">PDF</span> {l}
                        </button>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>

          {recent.length > 0 && (
            <div className="mt-12">
              <h3 className="font-serif text-2xl font-semibold mb-5">Recent Scores</h3>
              <GlassCard className="!p-0 overflow-hidden" hover={false}>
                <div className="divide-y divide-white/5">
                  {recent.slice(0, 5).map((r: any, i: number) => (
                    <div key={i} className="flex items-center justify-between px-6 py-4">
                      <div>
                        <p className="font-medium">{r.title || `${r.subject} Quiz`}</p>
                        <p className="text-xs text-ink-muted mt-0.5">{r.subject} • {r.level}</p>
                      </div>
                      <div className="text-right">
                        <p
                          className="font-serif text-xl font-semibold"
                          style={{
                            color:
                              r.percentage >= 75 ? '#34d399' : r.percentage >= 50 ? '#fbbf24' : '#f87171'
                          }}
                        >
                          {Math.round(r.percentage)}%
                        </p>
                        <p className="text-xs text-ink-muted">
                          {r.score}/{r.total}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
