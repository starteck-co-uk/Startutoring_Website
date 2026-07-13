'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, CheckCircle2, AlertCircle, Lock } from 'lucide-react';

interface TestSection {
  id: string;
  subject: string;
  topic_id: string;
  topic_name: string;
  questions: Array<{ text: string; options: string[] }>;
  question_count: number;
  time_minutes?: number;
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

const DEFAULT_SECTION_MINUTES = 50;
const STORAGE_KEY = 'star_weekly_test_progress';

interface SavedProgress {
  testTitle: string;
  sectionIdx: number;
  questionIdx: number;
  answers: Record<string, (number | null)[]>;
  sectionTimeRemaining: Record<string, number>;
  lockedSections: string[];
  sectionStarted: string[];
  globalStartedAt: number;
}

function loadProgress(testTitle: string, sections: TestSection[]): SavedProgress | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const saved: SavedProgress = JSON.parse(raw);
    // Only restore if same test
    if (saved.testTitle !== testTitle) return null;
    // Validate section IDs match
    const savedIds = Object.keys(saved.answers);
    const currentIds = sections.map(s => s.id);
    if (!currentIds.every(id => savedIds.includes(id))) return null;
    return saved;
  } catch {
    return null;
  }
}

function saveProgress(state: SavedProgress) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

function clearProgress() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {}
}

export default function WeeklyTestRunner({ title, sections, onExit, onSubmit }: Props) {
  // Try to restore saved progress
  const saved = useMemo(() => loadProgress(title, sections), [title, sections]);

  const [sectionIdx, setSectionIdx] = useState(saved?.sectionIdx ?? 0);
  const [questionIdx, setQuestionIdx] = useState(saved?.questionIdx ?? 0);
  const [answers, setAnswers] = useState<Record<string, (number | null)[]>>(() => {
    if (saved?.answers) return saved.answers;
    const m: Record<string, (number | null)[]> = {};
    sections.forEach(s => { m[s.id] = Array(s.questions.length).fill(null); });
    return m;
  });

  // Per-section timer state
  const [sectionTimeRemaining, setSectionTimeRemaining] = useState<Record<string, number>>(() => {
    if (saved?.sectionTimeRemaining) return saved.sectionTimeRemaining;
    const m: Record<string, number> = {};
    sections.forEach(s => {
      m[s.id] = (s.time_minutes ?? DEFAULT_SECTION_MINUTES) * 60;
    });
    return m;
  });

  // Track which sections are locked (completed / timed out)
  const [lockedSections, setLockedSections] = useState<Set<string>>(() =>
    new Set(saved?.lockedSections ?? [])
  );

  // Track whether each section's timer has started
  const [sectionStarted, setSectionStarted] = useState<Set<string>>(() =>
    new Set(saved?.sectionStarted ?? [sections[0]?.id])
  );

  // Global elapsed time
  const [globalStartedAt] = useState(() => saved?.globalStartedAt ?? Date.now());
  const [globalElapsed, setGlobalElapsed] = useState(0);

  // Persist progress to sessionStorage on every state change
  useEffect(() => {
    saveProgress({
      testTitle: title,
      sectionIdx,
      questionIdx,
      answers,
      sectionTimeRemaining,
      lockedSections: Array.from(lockedSections),
      sectionStarted: Array.from(sectionStarted),
      globalStartedAt
    });
  }, [title, sectionIdx, questionIdx, answers, sectionTimeRemaining, lockedSections, sectionStarted, globalStartedAt]);

  // Confirmation dialogs
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSectionAdvanceConfirm, setShowSectionAdvanceConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Ref to avoid stale closures in auto-submit
  const submittingRef = useRef(false);
  const lockedSectionsRef = useRef(lockedSections);
  lockedSectionsRef.current = lockedSections;
  const sectionIdxRef = useRef(sectionIdx);
  sectionIdxRef.current = sectionIdx;

  const sec = sections[sectionIdx];
  const q = sec?.questions[questionIdx];
  const totalQs = sections.reduce((a, s) => a + s.questions.length, 0);

  // Lock a section
  const lockSection = useCallback((sectionId: string) => {
    setLockedSections(prev => {
      const next = new Set(prev);
      next.add(sectionId);
      return next;
    });
  }, []);

  // Advance to the next unlocked section
  const advanceToNextSection = useCallback((fromIdx: number) => {
    const nextIdx = fromIdx + 1;
    if (nextIdx < sections.length) {
      setSectionIdx(nextIdx);
      setQuestionIdx(0);
      // Start the next section's timer if not already started
      setSectionStarted(prev => {
        const next = new Set(prev);
        next.add(sections[nextIdx].id);
        return next;
      });
    }
  }, [sections]);

  // Timer tick: decrement current section's time and track global elapsed
  useEffect(() => {
    const id = setInterval(() => {
      setGlobalElapsed(Math.round((Date.now() - globalStartedAt) / 1000));

      setSectionTimeRemaining(prev => {
        const next = { ...prev };
        // Only tick sections that have started and are not locked
        for (const s of sections) {
          if (lockedSectionsRef.current.has(s.id)) continue;
          // Only tick the current section (active section)
          if (s.id !== sections[sectionIdxRef.current]?.id) continue;
          if (next[s.id] > 0) {
            next[s.id] = next[s.id] - 1;
          }
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [globalStartedAt, sections]);

  // Watch for section timer expiry
  useEffect(() => {
    const currentSection = sections[sectionIdx];
    if (!currentSection) return;
    const remaining = sectionTimeRemaining[currentSection.id] ?? 0;

    if (remaining <= 0 && !lockedSections.has(currentSection.id)) {
      lockSection(currentSection.id);

      // If this is the last section, auto-submit
      if (sectionIdx === sections.length - 1) {
        // Check if ALL sections are now locked
        const allLocked = sections.every(s => s.id === currentSection.id || lockedSections.has(s.id));
        if (allLocked) {
          doSubmit();
        }
      } else {
        advanceToNextSection(sectionIdx);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionTimeRemaining, sectionIdx]);

  // Check if all sections are locked -> auto-submit
  useEffect(() => {
    if (sections.length > 0 && sections.every(s => lockedSections.has(s.id))) {
      doSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lockedSections]);

  const isSectionLocked = (sectionId: string) => lockedSections.has(sectionId);
  const isCurrentSectionLocked = isSectionLocked(sec?.id);

  const pick = (optIdx: number) => {
    if (isCurrentSectionLocked) return;
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
      // Moving to next section - show confirmation if time remains
      const remaining = sectionTimeRemaining[sec.id] ?? 0;
      if (remaining > 0 && !isSectionLocked(sec.id)) {
        setShowSectionAdvanceConfirm(true);
      } else {
        confirmAdvanceSection();
      }
    }
  };

  const confirmAdvanceSection = () => {
    setShowSectionAdvanceConfirm(false);
    // Lock the current section
    lockSection(sec.id);
    advanceToNextSection(sectionIdx);
  };

  const goPrev = () => {
    if (questionIdx > 0) {
      setQuestionIdx(qi => qi - 1);
    }
    // Cannot go back to previous sections
  };

  const goToSection = (si: number) => {
    const targetSection = sections[si];
    // Can only navigate to the current section (clicking its tab to jump to q0)
    // Cannot go to locked sections or future sections
    if (isSectionLocked(targetSection.id)) return;
    if (si !== sectionIdx) return; // Only allow clicking current section tab
    setQuestionIdx(0);
  };

  const answeredCount = useMemo(() => {
    return Object.values(answers).reduce((a, arr) => a + arr.filter(v => v !== null).length, 0);
  }, [answers]);

  const sectionAnsweredCount = (sectionId: string) => {
    return (answers[sectionId] || []).filter(v => v !== null).length;
  };

  const doSubmit = useCallback(() => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    clearProgress(); // Clear saved progress on submit
    const sectionAnswers: Record<string, Array<{ question_index: number; selected: number | null }>> = {};
    for (const s of sections) {
      sectionAnswers[s.id] = (answers[s.id] || []).map((sel, qi) => ({
        question_index: qi,
        selected: sel
      }));
    }
    onSubmit({
      section_answers: sectionAnswers,
      time_taken_secs: Math.round((Date.now() - globalStartedAt) / 1000)
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers, sections, onSubmit, globalStartedAt]);

  // Current section timer values
  const currentSectionRemaining = sectionTimeRemaining[sec?.id] ?? 0;
  const secMins = Math.floor(currentSectionRemaining / 60);
  const secSecs = currentSectionRemaining % 60;
  const lowTime = currentSectionRemaining < 120 && currentSectionRemaining > 0;

  // Global elapsed display
  const globalHrs = Math.floor(globalElapsed / 3600);
  const globalMins = Math.floor((globalElapsed % 3600) / 60);
  const globalSecs = globalElapsed % 60;

  const isLastQuestion = sectionIdx === sections.length - 1 && questionIdx === sec.questions.length - 1;
  const isLastSection = sectionIdx === sections.length - 1;

  // Section progress
  const sectionProgress = sec ? ((questionIdx + 1) / sec.questions.length) * 100 : 0;

  const currentColor = SUBJECT_COLORS[sec?.subject] || '#f5b72f';

  // Format time helper
  const formatSectionTime = (sectionId: string) => {
    const rem = sectionTimeRemaining[sectionId] ?? 0;
    if (lockedSections.has(sectionId)) return 'Locked';
    const m = Math.floor(rem / 60);
    const s = rem % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

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
              <button
                onClick={() => {
                  if (confirm('Your progress is saved. You can resume this test later. Leave now?')) {
                    onExit();
                  }
                }}
                className="text-ink-soft hover:text-white text-sm flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Exit
              </button>
              <span className="font-serif text-base font-semibold truncate">{title}</span>
              {/* Section timer - main display */}
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border font-mono text-sm ${
                lowTime ? 'border-red-400/50 bg-red-400/10 text-red-300 animate-pulse' : 'border-white/10 bg-white/5 text-ink-soft'
              }`}>
                <Clock className="w-3.5 h-3.5" />
                <span style={{ color: isCurrentSectionLocked ? '#666' : currentColor }}>
                  {sec?.subject}
                </span>
                {' '}
                {isCurrentSectionLocked
                  ? <span className="text-ink-muted">Locked</span>
                  : <>{String(secMins).padStart(2, '0')}:{String(secSecs).padStart(2, '0')}</>
                }
              </div>
            </div>

            {/* Global summary bar */}
            <div className="flex items-center justify-between text-[11px] text-ink-muted mb-2">
              <span>Section {sectionIdx + 1} of {sections.length}</span>
              <span>
                Total elapsed: {globalHrs > 0 ? `${globalHrs}:` : ''}{String(globalMins).padStart(2, '0')}:{String(globalSecs).padStart(2, '0')}
              </span>
            </div>

            {/* Section tabs */}
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {sections.map((s, si) => {
                const secAnswered = sectionAnsweredCount(s.id);
                const secTotal = s.questions.length;
                const isCurrent = si === sectionIdx;
                const isLocked = isSectionLocked(s.id);
                const color = SUBJECT_COLORS[s.subject] || '#f5b72f';
                return (
                  <button
                    key={s.id}
                    onClick={() => goToSection(si)}
                    disabled={isLocked || si !== sectionIdx}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs whitespace-nowrap border transition ${
                      isCurrent && !isLocked
                        ? 'border-white/20 bg-white/5'
                        : isLocked
                          ? 'border-transparent opacity-50 cursor-not-allowed'
                          : 'border-transparent opacity-40 cursor-not-allowed'
                    }`}
                  >
                    {isLocked ? (
                      <Lock className="w-3 h-3 text-ink-muted flex-shrink-0" />
                    ) : (
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                    )}
                    <span className={`font-medium ${isLocked ? 'text-ink-muted line-through' : ''}`}>
                      {s.topic_name}
                    </span>
                    <span className="text-ink-muted">{secAnswered}/{secTotal}</span>
                    {!isLocked && sectionStarted.has(s.id) && (
                      <span className={`font-mono text-[10px] ${
                        (sectionTimeRemaining[s.id] ?? 0) < 120 && (sectionTimeRemaining[s.id] ?? 0) > 0
                          ? 'text-red-400'
                          : 'text-ink-muted'
                      }`}>
                        {formatSectionTime(s.id)}
                      </span>
                    )}
                    {isLocked && secAnswered === secTotal && secTotal > 0 && (
                      <CheckCircle2 className="w-3 h-3 text-green-400" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Progress bar - section progress */}
            <div className="w-full h-1 rounded-full bg-white/5 mt-2 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${sectionProgress}%`,
                  background: `linear-gradient(90deg, ${currentColor}, #f5b72f)`
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
                style={{ background: `${currentColor}20`, color: currentColor, border: `1px solid ${currentColor}40` }}
              >
                {sec.subject}
              </span>
              <span className="text-xs text-ink-muted">{sec.topic_name}</span>
              {isCurrentSectionLocked && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-red-400/10 text-red-300 border border-red-400/20 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Locked
                </span>
              )}
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
                    disabled={isCurrentSectionLocked}
                    className={`w-full text-left p-5 rounded-2xl border transition-all ${
                      isCurrentSectionLocked
                        ? on
                          ? 'border-gold/30 bg-gold-dim/50 opacity-70 cursor-not-allowed'
                          : 'border-white/5 bg-white/2 opacity-50 cursor-not-allowed'
                        : on
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
                disabled={questionIdx === 0}
                className="btn btn-ghost disabled:opacity-40 flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              {isLastQuestion ? (
                <button
                  onClick={() => setShowConfirm(true)}
                  className="btn btn-gold flex items-center gap-1"
                >
                  Submit Test
                </button>
              ) : questionIdx === sec.questions.length - 1 && !isLastSection ? (
                <button onClick={goNext} className="btn btn-gold flex items-center gap-1">
                  Next Section <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={goNext}
                  disabled={isCurrentSectionLocked && questionIdx === sec.questions.length - 1}
                  className="btn btn-gold flex items-center gap-1"
                >
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

      {/* Section advance confirmation */}
      {showSectionAdvanceConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#0c1424] border border-white/10 shadow-2xl p-6">
            <h3 className="font-serif text-xl font-semibold mb-3">Move to next section?</h3>
            <div className="flex items-start gap-2 p-3 rounded-xl bg-yellow-400/10 border border-yellow-400/20 text-yellow-300 text-sm mb-4">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>
                You have{' '}
                <strong>
                  {Math.floor((sectionTimeRemaining[sec.id] ?? 0) / 60)}:{String((sectionTimeRemaining[sec.id] ?? 0) % 60).padStart(2, '0')}
                </strong>
                {' '}remaining in <strong>{sec.subject}</strong>. Once you move to{' '}
                <strong>{sections[sectionIdx + 1]?.subject}</strong>, you cannot return to this section.
              </span>
            </div>
            <p className="text-ink-soft text-sm mb-6">
              {sectionAnsweredCount(sec.id)}/{sec.questions.length} questions answered in this section.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowSectionAdvanceConfirm(false)}
                className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition text-sm"
              >
                Stay Here
              </button>
              <button
                onClick={confirmAdvanceSection}
                className="btn btn-gold !py-2 !px-5 !text-sm"
              >
                Move to {sections[sectionIdx + 1]?.subject}
              </button>
            </div>
          </div>
        </div>
      )}

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
                disabled={submitting}
                className="btn btn-gold !py-2 !px-5 !text-sm disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Test'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
