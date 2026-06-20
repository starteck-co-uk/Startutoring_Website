'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import type { Question } from '@/lib/types';

interface TestSection {
  id: string;
  subject: string;
  topic_id: string;
  topic_name: string;
  questions: Array<{ text: string; options: string[] }>;
  question_count: number;
}

interface Props {
  title: string;
  sections: TestSection[];
  onExit: () => void;
  onSubmit: (data: {
    section_answers: Record<string, Array<{ question_index: number; selected: number | null }>>;
    time_taken_secs: number;
  }) => void;
}

const SUBJECT_COLORS: Record<string, string> = {
  'Maths': '#a78bfa',
  'English': '#22d3ee',
  'Verbal Reasoning': '#f59e0b',
  'Non-Verbal Reasoning': '#ec4899'
};

export default function WeeklyTestRunner({ title, sections, onExit, onSubmit }: Props) {
  const [sectionIdx, setSectionIdx] = useState(0);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, (number | null)[]>>(() => {
    const m: Record<string, (number | null)[]> = {};
    sections.forEach(s => { m[s.id] = Array(s.questions.length).fill(null); });
    return m;
  });
  const [startedAt] = useState(() => Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);

  // Total time: 2 minutes per question
  const totalQs = sections.reduce((a, s) => a + s.questions.length, 0);
  const totalSecs = 120 * totalQs;
  const remaining = Math.max(0, totalSecs - elapsed);

  useEffect(() => {
    const id = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (remaining === 0) doSubmit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining]);

  const sec = sections[sectionIdx];
  const q = sec?.questions[questionIdx];

  const pick = (optIdx: number) => {
    setAnswers(prev => {
      const copy = { ...prev };
      const arr = [...copy[sec.id]];
      arr[questionIdx] = optIdx;
      copy[sec.id] = arr;
      return copy;
    });
  };

  const goNext = () => {
    if (questionIdx < sec.questions.length - 1) {
      setQuestionIdx(qi => qi + 1);
    } else if (sectionIdx < sections.length - 1) {
      setSectionIdx(si => si + 1);
      setQuestionIdx(0);
    }
  };

  const goPrev = () => {
    if (questionIdx > 0) {
      setQuestionIdx(qi => qi - 1);
    } else if (sectionIdx > 0) {
      setSectionIdx(si => si - 1);
      setQuestionIdx(sections[sectionIdx - 1].questions.length - 1);
    }
  };

  const goToSection = (si: number) => {
    setSectionIdx(si);
    setQuestionIdx(0);
  };

  const answeredCount = useMemo(() => {
    return Object.values(answers).reduce((a, arr) => a + arr.filter(v => v !== null).length, 0);
  }, [answers]);

  const doSubmit = () => {
    const sectionAnswers: Record<string, Array<{ question_index: number; selected: number | null }>> = {};
    for (const s of sections) {
      sectionAnswers[s.id] = (answers[s.id] || []).map((sel, qi) => ({
        question_index: qi,
        selected: sel
      }));
    }
    onSubmit({
      section_answers: sectionAnswers,
      time_taken_secs: Math.round((Date.now() - startedAt) / 1000)
    });
  };

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const lowTime = remaining < 120;
  const isLast = sectionIdx === sections.length - 1 && questionIdx === sec.questions.length - 1;

  // Overall progress
  let qsBefore = 0;
  for (let i = 0; i < sectionIdx; i++) qsBefore += sections[i].questions.length;
  const globalQ = qsBefore + questionIdx + 1;
  const progress = (globalQ / totalQs) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-[#080d1a] overflow-y-auto">
      <div className="bg-mesh">
        <div className="blob blob-gold" />
        <div className="blob blob-blue" />
      </div>
      <div className="relative min-h-screen flex flex-col">
        {/* Top bar */}
        <div className="sticky top-0 z-10 backdrop-blur-xl bg-[rgba(8,13,26,0.8)] border-b border-white/5 px-5 py-3">
          <div className="container-xl">
            <div className="flex items-center justify-between gap-4 mb-3">
              <button onClick={onExit} className="text-ink-soft hover:text-white text-sm flex items-center gap-1">
                <ChevronLeft className="w-4 h-4" /> Exit
              </button>
              <span className="font-serif text-base font-semibold truncate">{title}</span>
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border font-mono text-sm ${
                lowTime ? 'border-red-400/50 bg-red-400/10 text-red-300 animate-pulse' : 'border-white/10 bg-white/5 text-ink-soft'
              }`}>
                <Clock className="w-3.5 h-3.5" />
                {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
              </div>
            </div>

            {/* Section tabs */}
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {sections.map((s, si) => {
                const secAnswered = (answers[s.id] || []).filter(v => v !== null).length;
                const secTotal = s.questions.length;
                const isCurrent = si === sectionIdx;
                const color = SUBJECT_COLORS[s.subject] || '#f5b72f';
                return (
                  <button
                    key={s.id}
                    onClick={() => goToSection(si)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs whitespace-nowrap border transition ${
                      isCurrent
                        ? 'border-white/20 bg-white/5'
                        : 'border-transparent hover:bg-white/3'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                    <span className="font-medium">{s.topic_name}</span>
                    <span className="text-ink-muted">{secAnswered}/{secTotal}</span>
                    {secAnswered === secTotal && secTotal > 0 && <CheckCircle2 className="w-3 h-3 text-green-400" />}
                  </button>
                );
              })}
            </div>

            {/* Progress bar */}
            <div className="w-full h-1 rounded-full bg-white/5 mt-2 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${progress}%`,
                  background: `linear-gradient(90deg, ${SUBJECT_COLORS[sec.subject] || '#ffd166'}, #f5b72f)`
                }}
              />
            </div>
          </div>
        </div>

        {/* Question area */}
        <div className="flex-1 px-5 py-8">
          <div className="container-xl max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <span
                className="text-xs px-2 py-0.5 rounded-full font-semibold"
                style={{ background: `${SUBJECT_COLORS[sec.subject]}20`, color: SUBJECT_COLORS[sec.subject], border: `1px solid ${SUBJECT_COLORS[sec.subject]}40` }}
              >
                {sec.subject}
              </span>
              <span className="text-xs text-ink-muted">{sec.topic_name}</span>
              <span className="text-xs text-ink-muted ml-auto">
                Q{questionIdx + 1} of {sec.questions.length}
              </span>
            </div>

            <h2 className="font-serif text-2xl md:text-3xl leading-snug font-semibold text-ink">
              {q?.text || 'No question text'}
            </h2>

            <div className="mt-8 space-y-3">
              {(q?.options || []).map((opt, i) => {
                const on = answers[sec.id]?.[questionIdx] === i;
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
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold flex-shrink-0 ${
                        on ? 'bg-gold text-[#1a1304]' : 'bg-white/5 border border-white/10 text-ink-soft'
                      }`}>
                        {String.fromCharCode(65 + i)}
                      </div>
                      <span className="flex-1 text-ink">{opt}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="mt-10 flex items-center justify-between gap-3">
              <button
                onClick={goPrev}
                disabled={sectionIdx === 0 && questionIdx === 0}
                className="btn btn-ghost disabled:opacity-40 flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              {isLast ? (
                <button
                  onClick={() => setShowConfirm(true)}
                  className="btn btn-gold flex items-center gap-1"
                >
                  Submit Test
                </button>
              ) : (
                <button onClick={goNext} className="btn btn-gold flex items-center gap-1">
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Question dots for current section */}
            <div className="mt-6 flex flex-wrap justify-center gap-1.5">
              {sec.questions.map((_, qi) => (
                <button
                  key={qi}
                  onClick={() => setQuestionIdx(qi)}
                  className={`w-7 h-7 rounded-lg text-[10px] font-semibold transition ${
                    qi === questionIdx
                      ? 'bg-gold text-[#1a1304]'
                      : answers[sec.id]?.[qi] !== null
                        ? 'bg-gold/20 border border-gold/40 text-gold-light'
                        : 'bg-white/5 border border-white/10 text-ink-muted'
                  }`}
                >
                  {qi + 1}
                </button>
              ))}
            </div>

            {/* Summary footer */}
            <div className="mt-8 text-center text-sm text-ink-muted">
              {answeredCount} of {totalQs} questions answered
            </div>
          </div>
        </div>
      </div>

      {/* Submit confirmation */}
      {showConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#0c1424] border border-white/10 shadow-2xl p-6">
            <h3 className="font-serif text-xl font-semibold mb-3">Submit Test?</h3>
            {answeredCount < totalQs && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-yellow-400/10 border border-yellow-400/20 text-yellow-300 text-sm mb-4">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>You have {totalQs - answeredCount} unanswered question{totalQs - answeredCount > 1 ? 's' : ''}. Unanswered questions will be marked incorrect.</span>
              </div>
            )}
            <p className="text-ink-soft text-sm mb-6">
              {answeredCount}/{totalQs} questions answered. Once submitted, you cannot retake this test.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition text-sm"
              >
                Keep Working
              </button>
              <button
                onClick={doSubmit}
                className="btn btn-gold !py-2 !px-5 !text-sm"
              >
                Submit Test
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
