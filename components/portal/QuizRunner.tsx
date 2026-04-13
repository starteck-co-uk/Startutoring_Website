'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Question } from '@/lib/types';

interface Props {
  title: string;
  subject: string;
  level: string;
  questions: Question[];
  onExit: () => void;
  onComplete: (result: {
    score: number;
    total: number;
    timeTakenSecs: number;
    answers: Array<Question & { selected: number | null }>;
  }) => void;
}

export default function QuizRunner({ title, subject, level, questions, onExit, onComplete }: Props) {
  const total = questions.length;
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<(number | null)[]>(() => Array(total).fill(null));
  const [startedAt] = useState(() => Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [done, setDone] = useState(false);

  const perQuestion = 120;
  const totalSecs = perQuestion * total;
  const remaining = Math.max(0, totalSecs - elapsed);

  useEffect(() => {
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (remaining === 0 && !done) submit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining]);

  const score = useMemo(
    () => selected.reduce((acc: number, s, i) => (s === questions[i].correct ? acc + 1 : acc), 0),
    [selected, questions]
  );

  const pick = (i: number) => {
    setSelected((arr) => {
      const n = [...arr];
      n[idx] = i;
      return n;
    });
  };

  const submit = () => {
    const answers = questions.map((q, i) => ({ ...q, selected: selected[i] }));
    setDone(true);
    const finalScore = answers.reduce((a, q) => (q.selected === q.correct ? a + 1 : a), 0);
    onComplete({
      score: finalScore,
      total,
      timeTakenSecs: Math.round((Date.now() - startedAt) / 1000),
      answers
    });
  };

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const lowTime = remaining < 60;
  const q = questions[idx];
  const progress = ((idx + 1) / total) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-[#080d1a] overflow-y-auto">
      <div className="bg-mesh">
        <div className="blob blob-gold" />
        <div className="blob blob-blue" />
      </div>
      <div className="relative min-h-screen flex flex-col">
        {/* top bar */}
        <div className="sticky top-0 z-10 backdrop-blur-xl bg-[rgba(8,13,26,0.8)] border-b border-white/5 px-5 py-4">
          <div className="container-xl flex items-center justify-between gap-4">
            <button
              onClick={onExit}
              className="text-ink-soft hover:text-white text-sm flex items-center gap-1"
            >
              ← Exit
            </button>
            <div className="flex-1 flex items-center gap-3 justify-center">
              <span className="font-serif text-base md:text-lg font-semibold truncate">{title}</span>
              <span className="hidden md:inline text-xs px-2 py-0.5 rounded-full bg-gold-dim border border-gold/30 text-gold-light">
                {subject}
              </span>
              <span className="hidden md:inline text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                {level}
              </span>
            </div>
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full border font-mono text-sm ${
                lowTime
                  ? 'border-red-400/50 bg-red-400/10 text-red-300 animate-pulse'
                  : 'border-white/10 bg-white/5 text-ink-soft'
              }`}
            >
              ⏱ {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
            </div>
          </div>
          <div className="container-xl mt-4">
            <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #ffd166, #f5b72f)',
                  boxShadow: '0 0 20px rgba(245,183,47,0.6)'
                }}
              />
            </div>
          </div>
        </div>

        {/* question */}
        <div className="flex-1 px-5 py-10">
          <div className="container-xl max-w-3xl">
            <p className="text-xs text-ink-muted uppercase tracking-widest mb-4">
              Question {idx + 1} of {total}
            </p>
            <h2 className="font-serif text-2xl md:text-3xl leading-snug font-semibold text-ink">
              {q.text}
            </h2>

            <div className="mt-8 space-y-3">
              {q.options.map((opt, i) => {
                const on = selected[idx] === i;
                return (
                  <button
                    key={i}
                    onClick={() => pick(i)}
                    className={`w-full text-left p-5 rounded-2xl border transition-all ${
                      on
                        ? 'border-gold/60 bg-gold-dim shadow-[0_0_30px_-5px_rgba(245,183,47,0.4)]'
                        : 'border-white/8 bg-white/3 hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold flex-shrink-0 ${
                          on
                            ? 'bg-gold text-[#1a1304]'
                            : 'bg-white/5 border border-white/10 text-ink-soft'
                        }`}
                      >
                        {String.fromCharCode(65 + i)}
                      </div>
                      <span className="flex-1 text-ink">{opt}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* navigation */}
            <div className="mt-10 flex items-center justify-between gap-3">
              <button
                onClick={() => setIdx((i) => Math.max(0, i - 1))}
                disabled={idx === 0}
                className="btn btn-ghost disabled:opacity-40"
              >
                ← Previous
              </button>

              {idx < total - 1 ? (
                <button onClick={() => setIdx((i) => Math.min(total - 1, i + 1))} className="btn btn-gold">
                  Next →
                </button>
              ) : (
                <button onClick={submit} className="btn btn-gold">
                  Submit Quiz ★
                </button>
              )}
            </div>

            {/* dot nav */}
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  className={`w-8 h-8 rounded-lg text-xs font-semibold transition ${
                    i === idx
                      ? 'bg-gold text-[#1a1304]'
                      : selected[i] !== null
                      ? 'bg-gold/20 border border-gold/40 text-gold-light'
                      : 'bg-white/5 border border-white/10 text-ink-muted'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
