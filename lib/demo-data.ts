import type { Student, Quiz, QuizQuestion, QuizAttempt, Syllabus, WeeklyTest, WeeklyTestAttempt, Resource } from './types';

export const DEMO_STUDENTS: Student[] = [
  {
    id: 'admin-1',
    name: 'Star Admin',
    email: 'info@startutoring.uk',
    pin: '1969',
    role: 'admin',
    grade: 'Administrator',
    avatar: '★',
    status: 'active'
  },
  {
    id: 'parent-1',
    name: 'Sarah Patel',
    email: 'parent@test.com',
    pin: '1234',
    role: 'parent',
    grade: 'Year 6 — 11+',
    parent_name: 'Sarah Patel',
    status: 'active',
    linked_students: ['student-amara']
  },
  {
    id: 'student-amara',
    name: 'Amara Patel',
    email: 'amara@test.com',
    pin: '0000',
    role: 'student',
    grade: 'Year 6 — 11+',
    parent_name: 'Sarah Patel',
    parent_email: 'parent@test.com',
    school_name: 'Stretford Grammar',
    subjects: ['Maths', 'English', 'Verbal Reasoning', 'Non-Verbal Reasoning'],
    status: 'active'
  }
];

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

const feedbackStore: any[] = [];

export const demoFeedbackStore = {
  all() { return feedbackStore; },
  insert(row: any) {
    const withId = { ...row, id: `fb${Date.now()}`, created_at: new Date().toISOString() };
    feedbackStore.unshift(withId);
    return withId;
  },
  markRead(id: string) {
    const item = feedbackStore.find((f) => f.id === id);
    if (item) item.read = true;
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

// ─── Weekly Tests store ───
const weeklyTestsStore: WeeklyTest[] = [];
const weeklyTestAttemptsStore: WeeklyTestAttempt[] = [];

export const demoWeeklyTestStore = {
  allTests() { return weeklyTestsStore; },
  testById(id: string) { return weeklyTestsStore.find(t => t.id === id) || null; },
  publishedForLevel(level: string) {
    return weeklyTestsStore.filter(t => t.status === 'published' && t.level === level);
  },
  insertTest(row: Partial<WeeklyTest>) {
    const now = new Date().toISOString();
    const item: WeeklyTest = {
      id: row.id || `wt-${Date.now()}`,
      title: row.title || 'Weekly Test',
      level: row.level || '11+',
      week_start: row.week_start || now,
      status: 'draft',
      sections: row.sections || [],
      created_at: now,
      updated_at: now
    };
    weeklyTestsStore.unshift(item);
    return item;
  },
  updateTest(id: string, patch: Partial<WeeklyTest>) {
    const t = weeklyTestsStore.find(t => t.id === id);
    if (!t) return null;
    Object.assign(t, patch, { updated_at: new Date().toISOString() });
    if (patch.status === 'published') t.published_at = new Date().toISOString();
    return t;
  },
  deleteTest(id: string) {
    const idx = weeklyTestsStore.findIndex(t => t.id === id);
    if (idx >= 0) weeklyTestsStore.splice(idx, 1);
    // cascade delete attempts
    for (let i = weeklyTestAttemptsStore.length - 1; i >= 0; i--) {
      if (weeklyTestAttemptsStore[i].test_id === id) weeklyTestAttemptsStore.splice(i, 1);
    }
  },

  // Attempts
  attemptsByStudent(studentId: string) {
    return weeklyTestAttemptsStore.filter(a => a.student_id === studentId);
  },
  attemptByStudentTest(studentId: string, testId: string) {
    return weeklyTestAttemptsStore.find(a => a.student_id === studentId && a.test_id === testId) || null;
  },
  attemptsThisWeek(studentId: string) {
    const now = new Date();
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    monday.setHours(0, 0, 0, 0);
    return weeklyTestAttemptsStore.filter(a =>
      a.student_id === studentId && new Date(a.started_at) >= monday
    );
  },
  insertAttempt(row: Partial<WeeklyTestAttempt>) {
    const now = new Date().toISOString();
    const item: WeeklyTestAttempt = {
      id: row.id || `wta-${Date.now()}`,
      test_id: row.test_id || '',
      student_id: row.student_id || '',
      started_at: now,
      section_results: [],
      total_score: 0,
      total_questions: 0,
      total_percentage: 0,
      time_taken_secs: 0,
      completed: false,
      ...row
    };
    weeklyTestAttemptsStore.push(item);
    return item;
  },
  submitAttempt(attemptId: string, data: Partial<WeeklyTestAttempt>) {
    const a = weeklyTestAttemptsStore.find(a => a.id === attemptId);
    if (!a) return null;
    Object.assign(a, data, { submitted_at: new Date().toISOString(), completed: true });
    return a;
  }
};

// ─── Resources store ───
const resourcesStore: Resource[] = [];

export const demoResourcesStore = {
  all() { return resourcesStore; },
  byId(id: string) { return resourcesStore.find(r => r.id === id) || null; },
  insert(row: Partial<Resource>) {
    const now = new Date().toISOString();
    const item: Resource = {
      id: row.id || `res-${Date.now()}`,
      title: row.title || 'Untitled',
      description: row.description || '',
      subject: row.subject || '',
      level: row.level || '',
      file_name: row.file_name || 'file.pdf',
      file_size: row.file_size || 0,
      file_data: row.file_data || '',
      uploaded_by: row.uploaded_by || '',
      created_at: now
    };
    resourcesStore.unshift(item);
    return item;
  },
  delete(id: string) {
    const idx = resourcesStore.findIndex(r => r.id === id);
    if (idx >= 0) resourcesStore.splice(idx, 1);
  }
};
