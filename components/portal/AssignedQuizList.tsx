'use client';

import { useEffect, useState } from 'react';
import GlassCard from '@/components/GlassCard';

interface AssignedQuiz {
  id: string;
  title: string;
  subject: string;
  level: string;
  topic?: string;
  question_count: number;
  attempted: boolean;
  score?: number;
  total?: number;
  percentage?: number;
  graded?: boolean;
  published_at: string;
}

interface Props {
  studentId: string;
  level: string;
  onTakeQuiz: (quizId: string, title: string) => void;
  onViewResults: (quizId: string) => void;
}

export default function AssignedQuizList({ studentId, level, onTakeQuiz, onViewResults }: Props) {
  const [quizzes, setQuizzes] = useState<AssignedQuiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!level || !studentId) return;
    fetch(`/api/student/quizzes?level=${encodeURIComponent(level)}&student_id=${studentId}`)
      .then((r) => r.json())
      .then((d) => setQuizzes(d.quizzes || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [level, studentId]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (quizzes.length === 0) return null;

  return (
    <div className="mb-10">
      <h3 className="font-serif text-2xl font-semibold mb-5">Assigned Quizzes</h3>
      <div className="space-y-4">
        {quizzes.map((q) => (
          <GlassCard key={q.id} className="!p-6" hover={false}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h4 className="font-serif text-lg font-semibold">{q.title}</h4>
                  {!q.attempted && (
                    <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-gold-dim border border-gold/30 text-gold-light font-semibold">
                      New
                    </span>
                  )}
                </div>
                <div className="flex gap-3 mt-1 text-sm text-ink-muted">
                  <span>{q.subject}</span>
                  <span>{q.level}</span>
                  {q.topic && <span>{q.topic}</span>}
                  <span>{q.question_count} questions</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {q.attempted && q.graded ? (
                  <>
                    <div className="text-right">
                      <p
                        className="font-serif text-2xl font-semibold"
                        style={{
                          color: (q.percentage || 0) >= 75 ? '#34d399' : (q.percentage || 0) >= 50 ? '#fbbf24' : '#f87171'
                        }}
                      >
                        {Math.round(q.percentage || 0)}%
                      </p>
                      <p className="text-xs text-ink-muted">{q.score}/{q.total}</p>
                    </div>
                    <button
                      onClick={() => onViewResults(q.id)}
                      className="px-4 py-2 rounded-full border border-white/10 bg-white/3 text-sm hover:border-gold/30 transition"
                    >
                      View Results
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => onTakeQuiz(q.id, q.title)}
                    className="btn btn-gold !py-2 !px-5 !text-sm"
                  >
                    Take Quiz
                  </button>
                )}
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
