'use client';

import { useEffect, useState } from 'react';

interface QuestionGrade {
  question_number: number | string;
  question_topic: string;
  answer_score: number;
  method_score: number;
  marks_awarded: number;
  marks_available: number;
  steps_analysis: string;
  feedback: string;
}

interface GradingResult {
  overall_score: number;
  overall_grade: string;
  overall_feedback: string;
  questions: QuestionGrade[];
  strengths: string[];
  improvements: string[];
  study_tips: string[];
}

interface Props {
  title: string;
  subject: string;
  level: string;
  grading: GradingResult;
  onDone: () => void;
}

export default function PdfGradeResults({ title, subject, level, grading, onDone }: Props) {
  const [displayPct, setDisplayPct] = useState(0);
  const pct = Math.round(grading.overall_score);

  useEffect(() => {
    let raf: number;
    const start = Date.now();
    const step = () => {
      const t = Math.min(1, (Date.now() - start) / 1200);
      setDisplayPct(Math.round(pct * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [pct]);

  const circumference = 2 * Math.PI * 90;
  const offset = circumference - (displayPct / 100) * circumference;
  const gradeColor =
    pct >= 75 ? '#34d399' : pct >= 50 ? '#fbbf24' : '#f87171';

  const totalMarks = grading.questions.reduce((a, q) => a + q.marks_awarded, 0);
  const totalAvailable = grading.questions.reduce((a, q) => a + q.marks_available, 0);

  return (
    <div className="fixed inset-0 z-50 bg-[#080d1a] overflow-y-auto">
      <div className="bg-mesh">
        <div className="blob blob-gold" />
        <div className="blob blob-blue" />
      </div>
      <div className="relative min-h-screen px-5 py-14">
        <div className="container-xl max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <p className="text-xs text-ink-muted uppercase tracking-widest">PDF Grading Complete</p>
            <h1 className="font-serif text-4xl md:text-5xl font-semibold text-gradient mt-2">
              {title}
            </h1>
            <div className="flex justify-center gap-2 mt-4">
              <span className="text-xs px-3 py-1 rounded-full bg-gold-dim border border-gold/30 text-gold-light">
                {subject}
              </span>
              <span className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10">
                {level}
              </span>
            </div>
          </div>

          {/* Score circle + summary */}
          <div className="glass !p-10 flex flex-col md:flex-row gap-10 items-center">
            <div className="relative w-[220px] h-[220px] flex-shrink-0">
              <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
                <circle cx="100" cy="100" r="90" stroke="rgba(255,255,255,0.06)" strokeWidth="12" fill="none" />
                <circle
                  cx="100" cy="100" r="90"
                  stroke="url(#gradeG)" strokeWidth="12" fill="none"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  style={{ filter: 'drop-shadow(0 0 12px rgba(245,183,47,0.6))' }}
                />
                <defs>
                  <linearGradient id="gradeG" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#ffd166" />
                    <stop offset="1" stopColor="#f5b72f" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-serif text-6xl font-semibold text-gradient-gold">
                  {displayPct}%
                </span>
                <span className="text-lg font-semibold mt-1" style={{ color: gradeColor }}>
                  Grade {grading.overall_grade}
                </span>
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <p className="text-ink-soft text-lg leading-relaxed">
                {grading.overall_feedback}
              </p>
              <div className="grid grid-cols-2 gap-3 mt-6">
                <div className="rounded-xl bg-white/5 border border-white/8 p-3 text-center">
                  <p className="font-serif text-2xl font-semibold text-gold">
                    {totalMarks}/{totalAvailable}
                  </p>
                  <p className="text-xs text-ink-muted mt-1">Total Marks</p>
                </div>
                <div className="rounded-xl bg-white/5 border border-white/8 p-3 text-center">
                  <p className="font-serif text-2xl font-semibold" style={{ color: gradeColor }}>
                    {grading.questions.length}
                  </p>
                  <p className="text-xs text-ink-muted mt-1">Questions Graded</p>
                </div>
              </div>
              <button onClick={onDone} className="btn btn-gold mt-7">
                Done
              </button>
            </div>
          </div>

          {/* Strengths & Improvements */}
          <div className="grid md:grid-cols-2 gap-6 mt-10">
            <div className="glass !p-6">
              <h3 className="font-serif text-xl font-semibold mb-4 text-green-300">Strengths</h3>
              <ul className="space-y-2">
                {grading.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-ink-soft">
                    <span className="text-green-400 mt-0.5 flex-shrink-0">+</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass !p-6">
              <h3 className="font-serif text-xl font-semibold mb-4 text-orange-300">Areas to Improve</h3>
              <ul className="space-y-2">
                {grading.improvements.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-ink-soft">
                    <span className="text-orange-400 mt-0.5 flex-shrink-0">!</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Question-by-question breakdown */}
          <h3 className="font-serif text-2xl font-semibold mt-14 mb-6">Question Breakdown</h3>
          <div className="space-y-4">
            {grading.questions.map((q, i) => {
              const qPct = q.marks_available > 0 ? Math.round((q.marks_awarded / q.marks_available) * 100) : 0;
              const qColor = qPct >= 75 ? '#34d399' : qPct >= 50 ? '#fbbf24' : '#f87171';
              return (
                <div
                  key={i}
                  className="glass !p-6"
                  style={{ borderLeft: `4px solid ${qColor}` }}
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <p className="font-serif text-lg font-semibold">
                        <span className="text-ink-muted">Q{q.question_number}.</span>{' '}
                        {q.question_topic}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-serif text-xl font-semibold" style={{ color: qColor }}>
                        {q.marks_awarded}/{q.marks_available}
                      </p>
                      <p className="text-xs text-ink-muted">marks</p>
                    </div>
                  </div>

                  {/* Score bars */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-ink-muted">Answer</span>
                        <span className="text-ink-soft">{q.answer_score}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${q.answer_score}%`,
                            background: q.answer_score >= 75 ? '#34d399' : q.answer_score >= 50 ? '#fbbf24' : '#f87171'
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-ink-muted">Method & Steps</span>
                        <span className="text-ink-soft">{q.method_score}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${q.method_score}%`,
                            background: q.method_score >= 75 ? '#34d399' : q.method_score >= 50 ? '#fbbf24' : '#f87171'
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Steps analysis */}
                  <div className="p-4 rounded-xl bg-white/3 border border-white/5 mb-3">
                    <p className="text-xs text-ink-muted uppercase tracking-widest mb-2">Steps Analysis</p>
                    <p className="text-sm text-ink-soft leading-relaxed">{q.steps_analysis}</p>
                  </div>

                  {/* Feedback */}
                  <p className="text-sm text-ink-soft italic border-l-2 border-gold/40 pl-3">
                    {q.feedback}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Study tips */}
          {grading.study_tips && grading.study_tips.length > 0 && (
            <div className="glass !p-6 mt-10">
              <h3 className="font-serif text-xl font-semibold mb-4 text-cyan-300">Study Tips</h3>
              <ul className="space-y-2">
                {grading.study_tips.map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-ink-soft">
                    <span className="text-cyan-400 mt-0.5 flex-shrink-0">{i + 1}.</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
