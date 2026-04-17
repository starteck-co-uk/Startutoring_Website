import type { Student, Quiz, QuizQuestion, QuizAttempt, Syllabus } from './types';

export const DEMO_STUDENTS: Student[] = [];

// simple in-memory store for demo mode. Not durable across cold starts.
const store: any[] = [];

// In-memory stores for demo mode
const assessmentsStore: any[] = [];

const contactsStore: any[] = [];

export const demoAssessmentStore = {
  all() { return assessmentsStore; },
  insert(row: any) {
    const withId = { ...row, id: `a${Date.now()}`, created_at: new Date().toISOString() };
    assessmentsStore.unshift(withId);
    return withId;
  },
  updateStatus(id: string, status: string) {
    const item = assessmentsStore.find((a) => a.id === id);
    if (item) item.status = status;
    return item;
  }
};

export const demoContactStore = {
  all() { return contactsStore; },
  insert(row: any) {
    const withId = { ...row, id: `c${Date.now()}`, created_at: new Date().toISOString() };
    contactsStore.unshift(withId);
    return withId;
  },
  markRead(id: string) {
    const item = contactsStore.find((c) => c.id === id);
    if (item) item.read = true;
    return item;
  }
};

export const demoQuizStore = {
  all(): any[] {
    return store;
  },
  byStudent(id: string) {
    return store.filter((r) => r.student_id === id).sort((a, b) => (b.created_at < a.created_at ? -1 : 1));
  },
  insert(row: any) {
    const withId = {
      ...row,
      id: row.id || `r${Date.now()}`,
      percentage: Math.round((row.score / row.total) * 100),
      created_at: new Date().toISOString()
    };
    store.unshift(withId);
    return withId;
  }
};

// ─── Syllabi store ───
const syllabiStore: any[] = [];

export const demoSyllabiStore = {
  all() { return syllabiStore; },
  bySubjectLevel(subject: string, level: string) {
    return syllabiStore.find((s) => s.subject === subject && s.level === level) || null;
  },
  upsert(row: any) {
    const now = new Date().toISOString();
    const idx = syllabiStore.findIndex((s) => s.subject === row.subject && s.level === row.level);
    const item = { ...row, id: row.id || `syl-${Date.now()}`, updated_at: now };
    if (idx >= 0) {
      syllabiStore[idx] = { ...syllabiStore[idx], ...item };
      return syllabiStore[idx];
    }
    const newItem = { ...item, created_at: now };
    syllabiStore.push(newItem);
    return newItem;
  },
  remove(id: string) {
    const idx = syllabiStore.findIndex((s) => s.id === id);
    if (idx >= 0) syllabiStore.splice(idx, 1);
  }
};

// ─── Admin quizzes store ───
const quizzesStore: any[] = [];
const quizQuestionsStore: any[] = [];
const quizAttemptsStore: any[] = [];

export const demoAdminQuizStore = {
  // Quizzes
  allQuizzes() { return quizzesStore; },
  quizById(id: string) { return quizzesStore.find((q) => q.id === id) || null; },
  insertQuiz(row: any) {
    const now = new Date().toISOString();
    const item = { ...row, id: row.id || `quiz-${Date.now()}`, status: 'draft', question_count: 0, created_at: now, updated_at: now };
    quizzesStore.unshift(item);
    return item;
  },
  updateQuiz(id: string, patch: any) {
    const q = quizzesStore.find((q) => q.id === id);
    if (!q) return null;
    Object.assign(q, patch, { updated_at: new Date().toISOString() });
    if (patch.status === 'published') q.published_at = new Date().toISOString();
    if (patch.status === 'closed') q.closed_at = new Date().toISOString();
    return q;
  },
  deleteQuiz(id: string) {
    const idx = quizzesStore.findIndex((q) => q.id === id);
    if (idx >= 0) quizzesStore.splice(idx, 1);
    // cascade delete questions and attempts
    for (let i = quizQuestionsStore.length - 1; i >= 0; i--) {
      if (quizQuestionsStore[i].quiz_id === id) quizQuestionsStore.splice(i, 1);
    }
    for (let i = quizAttemptsStore.length - 1; i >= 0; i--) {
      if (quizAttemptsStore[i].quiz_id === id) quizAttemptsStore.splice(i, 1);
    }
  },
  publishedForLevel(level: string) {
    return quizzesStore.filter((q) => q.status === 'published' && q.level === level);
  },

  // Questions
  questionsByQuiz(quizId: string) {
    return quizQuestionsStore
      .filter((q) => q.quiz_id === quizId)
      .sort((a, b) => a.question_order - b.question_order);
  },
  setQuestions(quizId: string, questions: any[]) {
    // Remove old questions
    for (let i = quizQuestionsStore.length - 1; i >= 0; i--) {
      if (quizQuestionsStore[i].quiz_id === quizId) quizQuestionsStore.splice(i, 1);
    }
    // Insert new
    const now = new Date().toISOString();
    const inserted = questions.map((q, idx) => {
      const item = { ...q, id: q.id || `qq-${Date.now()}-${idx}`, quiz_id: quizId, question_order: idx + 1, created_at: now };
      quizQuestionsStore.push(item);
      return item;
    });
    // Update quiz question_count
    const quiz = quizzesStore.find((q) => q.id === quizId);
    if (quiz) quiz.question_count = inserted.length;
    return inserted;
  },
  updateQuestion(questionId: string, patch: any) {
    const q = quizQuestionsStore.find((q) => q.id === questionId);
    if (!q) return null;
    Object.assign(q, patch);
    return q;
  },

  // Attempts
  attemptsByQuiz(quizId: string) {
    return quizAttemptsStore.filter((a) => a.quiz_id === quizId);
  },
  attemptByStudentQuiz(studentId: string, quizId: string) {
    return quizAttemptsStore.find((a) => a.student_id === studentId && a.quiz_id === quizId) || null;
  },
  insertAttempt(row: any) {
    const now = new Date().toISOString();
    const item = { ...row, id: row.id || `att-${Date.now()}`, started_at: now };
    quizAttemptsStore.push(item);
    return item;
  },
  gradeAttempt(attemptId: string, score: number, total: number) {
    const a = quizAttemptsStore.find((a) => a.id === attemptId);
    if (!a) return null;
    a.score = score;
    a.total = total;
    a.percentage = total > 0 ? Math.round((score / total) * 100) : 0;
    a.graded = true;
    a.submitted_at = new Date().toISOString();
    return a;
  }
};
