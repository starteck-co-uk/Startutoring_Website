'use client';

import GlassCard from '@/components/GlassCard';
import { CheckCircle2, XCircle, Trophy, BarChart3, Download } from 'lucide-react';
import type { SectionResult } from '@/lib/types';
import { generateWeeklyTestPdf } from '@/lib/generate-pdf';

const SUBJECT_COLORS: Record<string, string> = {
  'Maths': '#a78bfa',
  'English': '#22d3ee',
  'Verbal Reasoning': '#f59e0b',
  'Non-Verbal Reasoning': '#ec4899'
};

interface Props {
  title: string;
  totalScore: number;
  totalQuestions: number;
  totalPercentage: number;
  timeTakenSecs: number;
  sectionResults: SectionResult[];
  sections?: any[]; // full test sections with correct answers for review
  onDone: () => void;
}

export default function WeeklyTestResults({
  title, totalScore, totalQuestions, totalPercentage,
  timeTakenSecs, sectionResults, sections, onDone
}: Props) {
  const mins = Math.floor(timeTakenSecs / 60);
  const secs = timeTakenSecs % 60;

  const grade =
    totalPercentage >= 90 ? { label: 'Outstanding', color: '#34d399', emoji: 'A*' } :
    totalPercentage >= 75 ? { label: 'Excellent', color: '#34d399', emoji: 'A' } :
    totalPercentage >= 60 ? { label: 'Good', color: '#fbbf24', emoji: 'B' } :
    totalPercentage >= 45 ? { label: 'Fair', color: '#fb923c', emoji: 'C' } :
    { label: 'Needs Improvement', color: '#f87171', emoji: 'D' };

  return (
    <div className="min-h-screen bg-[#080d1a] overflow-y-auto">
      <div className="bg-mesh">
        <div className="blob blob-gold" />
        <div className="blob blob-blue" />
      </div>
      <div className="relative px-5 py-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-20 h-20 rounded-3xl mx-auto flex items-center justify-center mb-4"
              style={{ background: `linear-gradient(135deg, ${grade.color}, ${grade.color}80)` }}
            >
              <Trophy className="w-9 h-9 text-[#1a1304]" />
            </div>
            <h1 className="font-serif text-4xl font-semibold text-gradient">{title}</h1>
            <p className="text-ink-soft mt-2">{grade.label}</p>
          </div>

          {/* Overall score */}
          <GlassCard className="!p-8 text-center mb-8" hover={false}>
            <div className="flex items-center justify-center gap-8 flex-wrap">
              <div>
                <p className="text-5xl font-serif font-bold" style={{ color: grade.color }}>
                  {totalPercentage}%
                </p>
                <p className="text-sm text-ink-muted mt-1">Overall Score</p>
              </div>
              <div className="h-16 w-px bg-white/10 hidden md:block" />
              <div>
                <p className="text-3xl font-serif font-semibold">{totalScore}/{totalQuestions}</p>
                <p className="text-sm text-ink-muted mt-1">Questions Correct</p>
              </div>
              <div className="h-16 w-px bg-white/10 hidden md:block" />
              <div>
                <p className="text-3xl font-serif font-semibold">{mins}:{String(secs).padStart(2, '0')}</p>
                <p className="text-sm text-ink-muted mt-1">Time Taken</p>
              </div>
              <div className="h-16 w-px bg-white/10 hidden md:block" />
              <div>
                <p className="text-3xl font-serif font-bold" style={{ color: grade.color }}>{grade.emoji}</p>
                <p className="text-sm text-ink-muted mt-1">Grade</p>
              </div>
            </div>
          </GlassCard>

          {/* Subject breakdown */}
          <h3 className="font-serif text-2xl font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-gold" /> Subject Breakdown
          </h3>
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {sectionResults.map((sr) => {
              const color = SUBJECT_COLORS[sr.subject] || '#f5b72f';
              return (
                <GlassCard key={sr.section_id} className="!p-5" hover={false}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: color }} />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold truncate">{sr.topic_name}</h4>
                      <p className="text-xs text-ink-muted">{sr.subject}</p>
                    </div>
                    <p className="font-serif text-2xl font-bold" style={{
                      color: sr.percentage >= 75 ? '#34d399' : sr.percentage >= 50 ? '#fbbf24' : '#f87171'
                    }}>
                      {sr.percentage}%
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${sr.percentage}%`, background: color }}
                      />
                    </div>
                    <span className="text-xs text-ink-muted">{sr.score}/{sr.total}</span>
                  </div>
                </GlassCard>
              );
            })}
          </div>

          {/* Review answers if full test data available */}
          {sections && sections.length > 0 && (
            <div className="mb-8">
              <h3 className="font-serif text-2xl font-semibold mb-4">Review Answers</h3>
              {sections.map((sec, si) => {
                const sr = sectionResults.find(r => r.section_id === sec.id);
                if (!sr) return null;
                const color = SUBJECT_COLORS[sec.subject] || '#f5b72f';
                return (
                  <div key={sec.id} className="mb-6">
                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                      {sec.subject} — {sec.topic_name}
                      <span className="text-ink-muted">({sr.score}/{sr.total})</span>
                    </h4>
                    <div className="space-y-2">
                      {sec.questions.map((q: any, qi: number) => {
                        const ans = sr.answers.find((a: any) => a.question_index === qi);
                        const selected = ans?.selected;
                        const isCorrect = selected === q.correct;
                        return (
                          <GlassCard key={qi} className="!p-4" hover={false}>
                            <div className="flex items-start gap-2">
                              {isCorrect
                                ? <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                : <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                              }
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium">Q{qi + 1}: {q.text}</p>
                                <div className="flex flex-wrap gap-2 mt-1.5">
                                  {q.options.map((opt: string, oi: number) => (
                                    <span
                                      key={oi}
                                      className={`text-xs px-2 py-0.5 rounded-full border ${
                                        oi === q.correct
                                          ? 'bg-green-400/10 border-green-400/30 text-green-300'
                                          : oi === selected && oi !== q.correct
                                            ? 'bg-red-400/10 border-red-400/30 text-red-300 line-through'
                                            : 'border-white/10 text-ink-muted'
                                      }`}
                                    >
                                      {String.fromCharCode(65 + oi)}: {opt}
                                    </span>
                                  ))}
                                </div>
                                {q.explanation && !isCorrect && (
                                  <p className="text-xs text-ink-soft mt-1.5 italic">{q.explanation}</p>
                                )}
                              </div>
                            </div>
                          </GlassCard>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex justify-center gap-3">
            <button onClick={onDone} className="btn btn-gold">
              Back to Dashboard
            </button>
            {sections && sections.length > 0 && (
              <button
                onClick={() => {
                  const pdfSections = sectionResults.map((sr) => {
                    const sec = sections.find((s: any) => s.id === sr.section_id);
                    return {
                      subject: sr.subject,
                      topicName: sr.topic_name,
                      score: sr.score,
                      total: sr.total,
                      percentage: sr.percentage,
                      questions: (sec?.questions || []).map((q: any, qi: number) => {
                        const ans = sr.answers.find((a: any) => a.question_index === qi);
                        return {
                          text: q.text,
                          options: q.options,
                          correct: q.correct,
                          explanation: q.explanation || '',
                          selected: ans?.selected ?? null
                        };
                      })
                    };
                  });
                  generateWeeklyTestPdf(title, totalScore, totalQuestions, totalPercentage, timeTakenSecs, pdfSections);
                }}
                className="px-5 py-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-sm font-semibold transition flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
