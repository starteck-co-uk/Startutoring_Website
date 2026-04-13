'use client';

import { useEffect, useState } from 'react';
import type { Question } from '@/lib/types';

interface Props {
  title: string;
  subject: string;
  level: string;
  score: number;
  total: number;
  timeTakenSecs: number;
  answers: Array<Question & { selected: number | null }>;
  saving: boolean;
  onSave: () => void;
}

export default function QuizResults({
  title,
  subject,
  level,
  score,
  total,
  timeTakenSecs,
  answers,
  saving,
  onSave
}: Props) {
  const pct = Math.round((score / total) * 100);
  const [displayPct, setDisplayPct] = useState(0);

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
  const verdict =
    pct >= 90 ? 'Outstanding' : pct >= 75 ? 'Great work' : pct >= 50 ? 'Good effort' : 'Keep going';
  const verdictColor = pct >= 75 ? '#34d399' : pct >= 50 ? '#fbbf24' : '#f87171';

  return (
    <div className="fixed inset-0 z-50 bg-[#080d1a] overflow-y-auto">
      <div className="bg-mesh">
        <div className="blob blob-gold" />
        <div className="blob blob-blue" />
      </div>
      <div className="relative min-h-screen px-5 py-14">
        <div className="container-xl max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-xs text-ink-muted uppercase tracking-widest">Quiz Complete</p>
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

          <div className="glass !p-10 flex flex-col md:flex-row gap-10 items-center">
            <div className="relative w-[220px] h-[220px] flex-shrink-0">
              <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
                <circle cx="100" cy="100" r="90" stroke="rgba(255,255,255,0.06)" strokeWidth="12" fill="none" />
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  stroke="url(#scoreG)"
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  style={{ filter: 'drop-shadow(0 0 12px rgba(245,183,47,0.6))' }}
                />
                <defs>
                  <linearGradient id="scoreG" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#ffd166" />
                    <stop offset="1" stopColor="#f5b72f" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-serif text-6xl font-semibold text-gradient-gold">
                  {displayPct}%
                </span>
                <span className="text-sm text-ink-muted mt-1">
                  {score} / {total} correct
                </span>
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h2 className="font-serif text-3xl font-semibold" style={{ color: verdictColor }}>
                {verdict}
              </h2>
              <p className="text-ink-soft mt-3">
                You answered {score} out of {total} questions correctly in{' '}
                {Math.floor(timeTakenSecs / 60)}m {timeTakenSecs % 60}s.
              </p>
              <div className="grid grid-cols-3 gap-3 mt-6">
                {[
                  { l: 'Correct', v: score, c: '#34d399' },
                  { l: 'Wrong', v: total - score, c: '#f87171' },
                  { l: 'Time', v: `${Math.round(timeTakenSecs / 60)}m`, c: '#22d3ee' }
                ].map((s) => (
                  <div key={s.l} className="rounded-xl bg-white/5 border border-white/8 p-3 text-center">
                    <p className="font-serif text-2xl font-semibold" style={{ color: s.c }}>
                      {s.v}
                    </p>
                    <p className="text-xs text-ink-muted mt-1">{s.l}</p>
                  </div>
                ))}
              </div>
              <button onClick={onSave} disabled={saving} className="btn btn-gold mt-7 disabled:opacity-60">
                {saving ? 'Saving...' : 'Save & Continue →'}
              </button>
            </div>
          </div>

          <h3 className="font-serif text-2xl font-semibold mt-14 mb-6">Question Review</h3>
          <div className="space-y-4">
            {answers.map((a, i) => {
              const correct = a.selected === a.correct;
              return (
                <div
                  key={i}
                  className="glass !p-6"
                  style={{
                    borderLeft: `4px solid ${correct ? '#34d399' : '#f87171'}`
                  }}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                        correct ? 'bg-green-400/20 text-green-300' : 'bg-red-400/20 text-red-300'
                      }`}
                    >
                      {correct ? '✓' : '✗'}
                    </span>
                    <div className="flex-1">
                      <p className="font-serif text-lg">
                        <span className="text-ink-muted">Q{i + 1}.</span> {a.text}
                      </p>
                      <div className="mt-3 space-y-1.5 text-sm">
                        {a.options.map((opt, j) => {
                          const isCorrect = j === a.correct;
                          const isSelected = j === a.selected;
                          return (
                            <div
                              key={j}
                              className={`px-3 py-2 rounded-lg flex items-center gap-2 ${
                                isCorrect
                                  ? 'bg-green-400/10 border border-green-400/30 text-green-300'
                                  : isSelected
                                  ? 'bg-red-400/10 border border-red-400/30 text-red-300'
                                  : 'bg-white/3 border border-white/5 text-ink-soft'
                              }`}
                            >
                              <span className="font-semibold">{String.fromCharCode(65 + j)}.</span>
                              <span>{opt}</span>
                              {isCorrect && <span className="ml-auto text-xs">Correct</span>}
                              {isSelected && !isCorrect && (
                                <span className="ml-auto text-xs">Your answer</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <p className="mt-3 text-sm text-ink-soft italic border-l-2 border-gold/40 pl-3">
                        💡 {a.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
