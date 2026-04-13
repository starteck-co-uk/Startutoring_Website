'use client';

import { useEffect, useState } from 'react';
import Sidebar, { usePortalUser } from '@/components/portal/Sidebar';
import GlassCard from '@/components/GlassCard';

interface QuizRow {
  id: string;
  subject: string;
  level: string;
  title: string;
  score: number;
  total: number;
  percentage: number;
  time_taken_secs: number;
  created_at: string;
}

const SUBJECT_COLORS: Record<string, string> = {
  Maths: '#a78bfa',
  Science: '#ec4899',
  English: '#22d3ee'
};

export default function AnalyticsPage() {
  const user = usePortalUser();
  const [stats, setStats] = useState<{
    recent: QuizRow[];
    bySubject: Record<string, { count: number; avg: number; trend: number }>;
    totals: { count: number; avg: number; bestSubject: string; totalQuestions: number };
  } | null>(null);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/student-stats?id=${user.id}`)
      .then((r) => r.json())
      .then(setStats);
  }, [user]);

  if (!user) return null;
  const recent = stats?.recent || [];
  const totals = stats?.totals || { count: 0, avg: 0, bestSubject: '—', totalQuestions: 0 };
  const bySubject = stats?.bySubject || {};

  // trend chart points
  const trendData = [...recent].reverse();
  const chartW = 720;
  const chartH = 220;
  const pad = 36;
  const maxY = 100;
  const points = trendData.map((r, i) => {
    const x = pad + (i * (chartW - pad * 2)) / Math.max(1, trendData.length - 1);
    const y = chartH - pad - (r.percentage / maxY) * (chartH - pad * 2);
    return { x, y, row: r };
  });
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const area = points.length
    ? `${path} L ${points[points.length - 1].x} ${chartH - pad} L ${points[0].x} ${chartH - pad} Z`
    : '';

  return (
    <>
      <Sidebar user={user} />
      <main className="md:pl-[72px] pb-24 md:pb-10 min-h-screen">
        <div className="px-5 md:px-10 py-10 max-w-6xl mx-auto">
          {/* header */}
          <div className="flex items-center gap-4 mb-10">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-[#1a1304]"
              style={{ background: 'linear-gradient(135deg, #ffd166, #f5b72f)' }}
            >
              {user.name[0]}
            </div>
            <div>
              <p className="text-xs text-ink-muted uppercase tracking-widest">Analytics</p>
              <h1 className="font-serif text-3xl md:text-4xl font-semibold text-gradient">
                {user.name}
              </h1>
              {user.grade && <p className="text-ink-soft text-sm">{user.grade}</p>}
            </div>
          </div>

          {/* stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {[
              { l: 'Quizzes Taken', v: totals.count, c: '#f5b72f' },
              { l: 'Average Score', v: `${Math.round(totals.avg)}%`, c: '#34d399' },
              { l: 'Best Subject', v: totals.bestSubject, c: '#a78bfa' },
              { l: 'Total Questions', v: totals.totalQuestions, c: '#22d3ee' }
            ].map((s) => (
              <GlassCard key={s.l} className="!p-6">
                <p className="text-xs text-ink-muted uppercase tracking-widest">{s.l}</p>
                <p className="font-serif text-3xl md:text-4xl font-semibold mt-3" style={{ color: s.c }}>
                  {s.v}
                </p>
              </GlassCard>
            ))}
          </div>

          {/* trend chart */}
          <GlassCard className="!p-8 mb-10" hover={false}>
            <div className="flex items-baseline justify-between mb-6">
              <div>
                <p className="text-xs text-ink-muted uppercase tracking-widest">Score Trend</p>
                <h3 className="font-serif text-2xl font-semibold mt-1">Progress over time</h3>
              </div>
            </div>
            {trendData.length === 0 ? (
              <div className="text-center py-10 text-ink-muted">
                Take your first quiz to see your trend.
              </div>
            ) : (
              <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-auto">
                <defs>
                  <linearGradient id="ta" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor="#f5b72f" stopOpacity="0.35" />
                    <stop offset="1" stopColor="#f5b72f" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* grid lines */}
                {[0, 25, 50, 75, 100].map((v) => {
                  const y = chartH - pad - (v / 100) * (chartH - pad * 2);
                  return (
                    <g key={v}>
                      <line
                        x1={pad}
                        x2={chartW - pad}
                        y1={y}
                        y2={y}
                        stroke="rgba(255,255,255,0.05)"
                        strokeDasharray="3 4"
                      />
                      <text x={pad - 8} y={y + 4} textAnchor="end" fontSize="10" fill="#5a6478">
                        {v}
                      </text>
                    </g>
                  );
                })}
                {area && <path d={area} fill="url(#ta)" />}
                {path && (
                  <path
                    d={path}
                    fill="none"
                    stroke="#f5b72f"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ filter: 'drop-shadow(0 0 8px rgba(245,183,47,0.6))' }}
                  />
                )}
                {points.map((p, i) => (
                  <circle
                    key={i}
                    cx={p.x}
                    cy={p.y}
                    r="5"
                    fill={SUBJECT_COLORS[p.row.subject] || '#f5b72f'}
                    stroke="#080d1a"
                    strokeWidth="2"
                  />
                ))}
              </svg>
            )}
          </GlassCard>

          {/* subject breakdown */}
          <div className="grid lg:grid-cols-2 gap-6 mb-10">
            <GlassCard className="!p-8" hover={false}>
              <p className="text-xs text-ink-muted uppercase tracking-widest">By Subject</p>
              <h3 className="font-serif text-2xl font-semibold mt-1 mb-6">Subject breakdown</h3>
              <div className="space-y-5">
                {Object.entries(bySubject).map(([name, data]) => (
                  <div key={name}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ background: SUBJECT_COLORS[name] || '#f5b72f' }}
                        />
                        {name}
                      </span>
                      <span className="text-sm">
                        <span className="font-semibold">{Math.round(data.avg)}%</span>
                        <span className="text-ink-muted ml-2">
                          {data.trend > 0 ? '↑' : data.trend < 0 ? '↓' : '–'}{' '}
                          {Math.abs(data.trend).toFixed(0)}%
                        </span>
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${data.avg}%`,
                          background: `linear-gradient(90deg, ${SUBJECT_COLORS[name] || '#f5b72f'}, ${
                            SUBJECT_COLORS[name] || '#f5b72f'
                          }80)`
                        }}
                      />
                    </div>
                    <p className="text-xs text-ink-muted mt-1">
                      {data.count} {data.count === 1 ? 'quiz' : 'quizzes'} taken
                    </p>
                  </div>
                ))}
                {Object.keys(bySubject).length === 0 && (
                  <p className="text-ink-muted text-sm text-center py-4">No data yet.</p>
                )}
              </div>
            </GlassCard>

            <GlassCard className="!p-8" hover={false}>
              <p className="text-xs text-ink-muted uppercase tracking-widest">Recent Activity</p>
              <h3 className="font-serif text-2xl font-semibold mt-1 mb-6">Latest quizzes</h3>
              <div className="space-y-3">
                {recent.slice(0, 8).map((r, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/3 border border-white/5"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className="w-2 h-10 rounded-full flex-shrink-0"
                        style={{ background: SUBJECT_COLORS[r.subject] || '#f5b72f' }}
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{r.title || r.subject}</p>
                        <p className="text-xs text-ink-muted">{r.level}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className="font-serif text-lg font-semibold"
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
                {recent.length === 0 && (
                  <p className="text-ink-muted text-sm text-center py-4">No activity yet.</p>
                )}
              </div>
            </GlassCard>
          </div>
        </div>
      </main>
    </>
  );
}
