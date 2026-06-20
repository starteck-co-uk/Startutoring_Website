'use client';

import { useEffect, useState, useRef } from 'react';
import Sidebar, { usePortalUser } from '@/components/portal/Sidebar';
import GlassCard from '@/components/GlassCard';
import QuizRunner from '@/components/portal/QuizRunner';
import QuizResults from '@/components/portal/QuizResults';
import PdfGradeResults from '@/components/portal/PdfGradeResults';
import AssignedQuizList from '@/components/portal/AssignedQuizList';
import WeeklyTestRunner from '@/components/portal/WeeklyTestRunner';
import WeeklyTestResults from '@/components/portal/WeeklyTestResults';
import type { Question, Level } from '@/lib/types';
import { Star as StarIcon, CalendarCheck, Lock, ChevronRight, Clock, GraduationCap, School, BookOpen, TrendingUp, AlertCircle, User } from 'lucide-react';

type Phase =
  | 'idle' | 'loading'
  | 'quiz' | 'results'
  | 'pdf-grading' | 'pdf-results'
  | 'assigned-quiz' | 'assigned-results'
  | 'weekly-test' | 'weekly-results';

export default function DashboardPage() {
  const user = usePortalUser();
  const [phase, setPhase] = useState<Phase>('idle');
  const [currentSubject, setCurrentSubject] = useState('');
  const [currentLevel, setCurrentLevel] = useState('');
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

  // Weekly test state
  const [weeklyTests, setWeeklyTests] = useState<any[]>([]);
  const [testsThisWeek, setTestsThisWeek] = useState(0);
  const [weeklyTestData, setWeeklyTestData] = useState<any>(null);
  const [weeklyResult, setWeeklyResult] = useState<any>(null);

  // Student profile (for parent view)
  const [studentProfile, setStudentProfile] = useState<any>(null);

  const studentId = user?.role === 'parent' && user?.linked_students?.length
    ? user.linked_students[0]
    : user?.id;

  const studentLevel = user?.grade?.includes('—')
    ? user.grade.split('—')[1]?.trim()
    : user?.grade?.split(' ').pop() || '';

  useEffect(() => {
    if (!studentId) return;
    fetch(`/api/student-stats?id=${studentId}`)
      .then(r => r.json())
      .then(setStats)
      .catch(() => setStats(null));

    // Fetch linked student profile for parent dashboard
    if (user?.role === 'parent') {
      fetch(`/api/student/profile?id=${studentId}`)
        .then(r => r.json())
        .then(d => setStudentProfile(d.student || null))
        .catch(() => setStudentProfile(null));
    }
  }, [studentId, user?.role]);

  // Load weekly tests
  useEffect(() => {
    if (!studentLevel || !studentId) return;
    fetch(`/api/student/weekly-tests?level=${encodeURIComponent(studentLevel)}&student_id=${studentId}`)
      .then(r => r.json())
      .then(d => {
        setWeeklyTests(d.tests || []);
        setTestsThisWeek(d.tests_this_week || 0);
      })
      .catch(() => {});
  }, [studentLevel, studentId]);

  const startWeeklyTest = async (testId: string, testTitle: string) => {
    setTitle(testTitle);
    setPhase('loading');
    try {
      const r = await fetch(`/api/student/weekly-tests/${testId}?student_id=${studentId}`);
      const j = await r.json();
      if (!r.ok) throw new Error(j.error);
      setWeeklyTestData(j.test);
      setPhase('weekly-test');
    } catch {
      setPhase('idle');
    }
  };

  const onWeeklySubmit = async (data: { section_answers: any; time_taken_secs: number }) => {
    if (!studentId || !weeklyTestData) return;
    setPhase('loading');
    try {
      const r = await fetch(`/api/student/weekly-tests/${weeklyTestData.id}/submit`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          student_id: studentId,
          section_answers: data.section_answers,
          time_taken_secs: data.time_taken_secs
        })
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error);
      setWeeklyResult(j);
      setPhase('weekly-results');

      // Refresh weekly test list
      fetch(`/api/student/weekly-tests?level=${encodeURIComponent(studentLevel)}&student_id=${studentId}`)
        .then(r => r.json())
        .then(d => {
          setWeeklyTests(d.tests || []);
          setTestsThisWeek(d.tests_this_week || 0);
        })
        .catch(() => {});
    } catch (err: any) {
      alert(err.message || 'Failed to submit');
      setPhase('idle');
    }
  };

  const viewWeeklyResults = async (testId: string) => {
    if (!studentId) return;
    setPhase('loading');
    try {
      const r = await fetch(`/api/student/weekly-tests/${testId}?student_id=${studentId}`);
      const j = await r.json();
      if (!r.ok) throw new Error(j.error);
      setWeeklyTestData(j.test);
      setWeeklyResult({ attempt: j.attempt, test: j.test });
      setTitle(j.test.title);
      setPhase('weekly-results');
    } catch {
      setPhase('idle');
    }
  };

  // Existing quiz functions
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
    } catch { setPhase('idle'); }
  };

  const onComplete = (r: typeof result) => {
    setResult(r);
    setPhase('results');
  };

  const onSave = async () => {
    if (!result || !studentId) return;
    setSaving(true);
    try {
      await fetch('/api/submit-quiz', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          student_id: studentId,
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
    fetch(`/api/student-stats?id=${studentId}`)
      .then(r => r.json())
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
    if (file.type !== 'application/pdf') { setPdfError('Please upload a PDF file.'); return; }
    if (file.size > 10 * 1024 * 1024) { setPdfError('File too large. Maximum size is 10MB.'); return; }
    setPhase('pdf-grading');
    setTitle(`${currentSubject} — ${currentLevel} (PDF)`);
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
    } catch { setPhase('idle'); }
  };

  const onAssignedComplete = async (r: { score: number; total: number; timeTakenSecs: number; answers: any[] }) => {
    if (!studentId || !assignedQuizId) return;
    setPhase('loading');
    try {
      await fetch(`/api/student/quizzes/${assignedQuizId}/submit`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          student_id: studentId,
          answers: r.answers.map((a: any) => ({ question_id: a.id, selected: a.selected })),
          time_taken_secs: r.timeTakenSecs
        })
      });
      const resultsR = await fetch(`/api/student/quizzes/${assignedQuizId}/results?student_id=${studentId}`);
      const resultsJ = await resultsR.json();
      setAssignedResult(resultsJ);
      setPhase('assigned-results');
    } catch { setPhase('idle'); }
  };

  const viewAssignedResults = async (quizId: string) => {
    if (!studentId) return;
    setAssignedQuizId(quizId);
    setPhase('loading');
    try {
      const r = await fetch(`/api/student/quizzes/${quizId}/results?student_id=${studentId}`);
      const j = await r.json();
      if (!r.ok) throw new Error(j.error);
      setTitle(j.quiz?.title || 'Quiz Results');
      setAssignedResult(j);
      setPhase('assigned-results');
    } catch { setPhase('idle'); }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ─── Weekly Test Runner ───
  if (phase === 'weekly-test' && weeklyTestData) {
    return (
      <WeeklyTestRunner
        title={weeklyTestData.title || title}
        sections={weeklyTestData.sections || []}
        onExit={() => { setPhase('idle'); setWeeklyTestData(null); }}
        onSubmit={onWeeklySubmit}
      />
    );
  }

  // ─── Weekly Test Results ───
  if (phase === 'weekly-results' && weeklyResult) {
    const attempt = weeklyResult.attempt || weeklyResult;
    const test = weeklyResult.test || weeklyTestData;
    return (
      <WeeklyTestResults
        title={test?.title || title}
        totalScore={attempt.total_score}
        totalQuestions={attempt.total_questions}
        totalPercentage={attempt.total_percentage}
        timeTakenSecs={attempt.time_taken_secs}
        sectionResults={attempt.section_results || []}
        sections={test?.sections}
        onDone={() => {
          setPhase('idle');
          setWeeklyResult(null);
          setWeeklyTestData(null);
        }}
      />
    );
  }

  // ─── Existing quiz phases ───
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
        onDone={() => { setPhase('idle'); setPdfGrading(null); }}
      />
    );
  }

  if (phase === 'pdf-grading') {
    return (
      <>
        <Sidebar user={user} />
        <main className="md:pl-[72px] min-h-screen flex items-center justify-center px-5">
          <div className="text-center">
            <div className="w-20 h-20 rounded-3xl mx-auto flex items-center justify-center animate-pulseGold"
              style={{ background: 'linear-gradient(135deg, #ffd166, #f5b72f)', color: '#1a1304' }}>
              <StarIcon className="w-9 h-9 fill-[#1a1304]" />
            </div>
            <h2 className="font-serif text-2xl font-semibold mt-6 text-gradient">Grading your work...</h2>
            <p className="text-ink-soft text-sm mt-2">AI is analysing your {currentLevel} {currentSubject} submission</p>
            <div className="mt-6 flex justify-center gap-1">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-2 h-2 rounded-full bg-gold animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
          </div>
        </main>
      </>
    );
  }

  if (phase === 'assigned-quiz' && assignedQuestions.length > 0) {
    const runnerQuestions: Question[] = assignedQuestions.map(q => ({
      text: q.text,
      options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
      correct: -1,
      explanation: ''
    }));
    return (
      <QuizRunner
        title={title} subject="" level=""
        questions={runnerQuestions}
        onExit={() => setPhase('idle')}
        onComplete={(r) => {
          const answersWithIds = r!.answers.map((a, i) => ({ ...a, id: assignedQuestions[i]?.id }));
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
          if (studentId) fetch(`/api/student-stats?id=${studentId}`).then(r => r.json()).then(setStats).catch(() => {});
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
            <div className="w-20 h-20 rounded-3xl mx-auto flex items-center justify-center animate-pulseGold"
              style={{ background: 'linear-gradient(135deg, #ffd166, #f5b72f)', color: '#1a1304' }}>
              <StarIcon className="w-9 h-9 fill-[#1a1304]" />
            </div>
            <h2 className="font-serif text-2xl font-semibold mt-6 text-gradient">Preparing...</h2>
            <div className="mt-6 flex justify-center gap-1">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-2 h-2 rounded-full bg-gold animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
          </div>
        </main>
      </>
    );
  }

  const recent: any[] = stats?.recent || [];
  const canTakeTest = testsThisWeek < 2;

  return (
    <>
      <Sidebar user={user} />
      <main className="md:pl-[72px] pb-24 md:pb-10 min-h-screen">
        <div className="px-5 md:px-10 py-10 max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-start justify-between flex-wrap gap-4 mb-10">
            <div>
              {user.role === 'parent' && (
                <p className="text-xs text-gold uppercase tracking-widest mb-1">Parent Dashboard</p>
              )}
              <p className="text-xs text-ink-muted uppercase tracking-widest">Welcome, {user.name.split(' ')[0]}</p>
              <h1 className="font-serif text-4xl md:text-5xl font-semibold text-gradient mt-2">
                {user.role === 'parent' ? "Your Child's Tests" : 'Weekly Tests'}
              </h1>
              <p className="text-ink-soft mt-2">
                GL Assessment format — Maths, English, Verbal Reasoning & Non-Verbal Reasoning. 2 tests per week.
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/3">
              <CalendarCheck className="w-5 h-5 text-gold" />
              <div>
                <p className="text-xs text-ink-muted">This Week</p>
                <p className="font-serif text-lg font-semibold">
                  <span className={testsThisWeek >= 2 ? 'text-red-400' : 'text-gold'}>{testsThisWeek}</span>
                  <span className="text-ink-muted">/2 tests</span>
                </p>
              </div>
            </div>
          </div>

          {/* Student Profile Card (parent view) */}
          {user.role === 'parent' && studentProfile && (
            <GlassCard className="!p-6 mb-10" hover={false}>
              <div className="flex items-start gap-5">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center font-semibold text-2xl shrink-0"
                  style={{ background: 'linear-gradient(135deg, #ffd166, #f5b72f)', color: '#1a1304' }}
                >
                  {studentProfile.avatar || studentProfile.name?.[0] || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="font-serif text-2xl font-semibold">{studentProfile.name}</h2>
                    <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full font-semibold border ${
                      (studentProfile.status || 'active') === 'active'
                        ? 'bg-green-400/10 border-green-400/30 text-green-300'
                        : (studentProfile.status || 'active') === 'paused'
                        ? 'bg-yellow-400/10 border-yellow-400/30 text-yellow-300'
                        : 'bg-red-400/10 border-red-400/30 text-red-300'
                    }`}>
                      {studentProfile.status || 'active'}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2 mt-3 text-sm">
                    {studentProfile.grade && (
                      <div className="flex items-center gap-2 text-ink-soft">
                        <GraduationCap className="w-4 h-4 text-gold shrink-0" />
                        <span>{studentProfile.grade}</span>
                      </div>
                    )}
                    {studentProfile.school_name && (
                      <div className="flex items-center gap-2 text-ink-soft">
                        <School className="w-4 h-4 text-gold shrink-0" />
                        <span className="truncate">{studentProfile.school_name}</span>
                      </div>
                    )}
                    {studentProfile.parent_name && (
                      <div className="flex items-center gap-2 text-ink-soft">
                        <User className="w-4 h-4 text-gold shrink-0" />
                        <span>Parent: {studentProfile.parent_name}</span>
                      </div>
                    )}
                  </div>

                  {/* Subjects */}
                  {studentProfile.subjects && studentProfile.subjects.length > 0 && (
                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                      <BookOpen className="w-4 h-4 text-gold shrink-0" />
                      {studentProfile.subjects.map((sub: string) => (
                        <span key={sub} className="text-xs px-2.5 py-1 rounded-full bg-gold-dim border border-gold/30 text-gold-light">
                          {sub}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Strengths & Areas to improve */}
                  {(studentProfile.strengths || studentProfile.areas_to_improve) && (
                    <div className="grid sm:grid-cols-2 gap-4 mt-4">
                      {studentProfile.strengths && (
                        <div className="flex gap-2 text-sm">
                          <TrendingUp className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-green-300 font-medium text-xs uppercase tracking-wider mb-0.5">Strengths</p>
                            <p className="text-ink-soft leading-relaxed">{studentProfile.strengths}</p>
                          </div>
                        </div>
                      )}
                      {studentProfile.areas_to_improve && (
                        <div className="flex gap-2 text-sm">
                          <AlertCircle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-yellow-300 font-medium text-xs uppercase tracking-wider mb-0.5">Areas to Improve</p>
                            <p className="text-ink-soft leading-relaxed">{studentProfile.areas_to_improve}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </GlassCard>
          )}

          {/* Hidden file input for PDF uploads */}
          <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={handlePdfFile} />
          {pdfError && (
            <div className="mb-6 p-4 rounded-xl border border-red-400/30 bg-red-400/10 text-red-300 text-sm">{pdfError}</div>
          )}

          {/* Weekly Tests */}
          {weeklyTests.length > 0 && (
            <div className="mb-10">
              <h3 className="font-serif text-2xl font-semibold mb-5 flex items-center gap-2">
                <CalendarCheck className="w-6 h-6 text-gold" />
                Weekly Tests
              </h3>
              <div className="space-y-4">
                {weeklyTests.map((t: any) => {
                  const attempted = !!t.attempt?.completed;
                  const subjects = (t.sections || []).reduce((acc: string[], s: any) => {
                    if (!acc.includes(s.subject)) acc.push(s.subject);
                    return acc;
                  }, [] as string[]);
                  const totalQs = (t.sections || []).reduce((a: number, s: any) => a + (s.questions?.length || s.question_count || 0), 0);

                  return (
                    <GlassCard key={t.id} className="!p-6" hover={false}>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h4 className="font-serif text-lg font-semibold">{t.title}</h4>
                            {!attempted && canTakeTest && (
                              <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-gold-dim border border-gold/30 text-gold-light font-semibold">
                                New
                              </span>
                            )}
                          </div>
                          <div className="flex gap-3 mt-1.5 text-sm text-ink-muted flex-wrap">
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {Math.ceil(totalQs * 2 / 60)} mins</span>
                            <span>{totalQs} questions</span>
                            <span>{(t.sections || []).length} sections</span>
                          </div>
                          <div className="flex gap-1.5 mt-2">
                            {subjects.map((s: string) => (
                              <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-ink-muted">{s}</span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          {attempted ? (
                            <>
                              <div className="text-right">
                                <p className="font-serif text-2xl font-semibold" style={{
                                  color: (t.attempt.total_percentage || 0) >= 75 ? '#34d399' :
                                    (t.attempt.total_percentage || 0) >= 50 ? '#fbbf24' : '#f87171'
                                }}>
                                  {t.attempt.total_percentage}%
                                </p>
                                <p className="text-xs text-ink-muted">{t.attempt.total_score}/{t.attempt.total_questions}</p>
                              </div>
                              <button
                                onClick={() => viewWeeklyResults(t.id)}
                                className="px-4 py-2 rounded-full border border-white/10 bg-white/3 text-sm hover:border-gold/30 transition flex items-center gap-1"
                              >
                                View Results <ChevronRight className="w-3 h-3" />
                              </button>
                            </>
                          ) : canTakeTest ? (
                            <button
                              onClick={() => startWeeklyTest(t.id, t.title)}
                              className="btn btn-gold !py-2 !px-5 !text-sm flex items-center gap-1"
                            >
                              Start Test <ChevronRight className="w-4 h-4" />
                            </button>
                          ) : (
                            <div className="flex items-center gap-2 text-sm text-ink-muted">
                              <Lock className="w-4 h-4" />
                              <span>Limit reached this week</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </GlassCard>
                  );
                })}
              </div>
            </div>
          )}

          {/* Assigned quizzes from admin */}
          <AssignedQuizList
            studentId={studentId || ''}
            level={studentLevel}
            onTakeQuiz={startAssignedQuiz}
            onViewResults={viewAssignedResults}
          />

          {/* Recent scores */}
          {recent.length > 0 && (
            <div className="mt-12">
              <h3 className="font-serif text-2xl font-semibold mb-5">Recent Scores</h3>
              <GlassCard className="!p-0 overflow-hidden" hover={false}>
                <div className="divide-y divide-white/5">
                  {recent.slice(0, 5).map((r: any, i: number) => (
                    <div key={i} className="flex items-center justify-between px-6 py-4">
                      <div>
                        <p className="font-medium">{r.title || `${r.subject} Quiz`}</p>
                        <p className="text-xs text-ink-muted mt-0.5">{r.subject} &middot; {r.level}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-serif text-xl font-semibold" style={{
                          color: r.percentage >= 75 ? '#34d399' : r.percentage >= 50 ? '#fbbf24' : '#f87171'
                        }}>
                          {Math.round(r.percentage)}%
                        </p>
                        <p className="text-xs text-ink-muted">{r.score}/{r.total}</p>
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
