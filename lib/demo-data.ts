import type { Student } from './types';

export const DEMO_STUDENTS: Student[] = [
  {
    id: 'demo-amara',
    name: 'Amara Patel',
    email: 'amara@test.com',
    pin: '1234',
    role: 'student',
    grade: 'Year 10 — GCSE',
    avatar: 'A'
  },
  {
    id: 'demo-oliver',
    name: 'Oliver Hughes',
    email: 'oliver@test.com',
    pin: '1234',
    role: 'student',
    grade: 'Year 6 — 11+',
    avatar: 'O'
  },
  {
    id: 'demo-parent',
    name: 'Sarah Patel',
    email: 'parent@test.com',
    pin: '1234',
    role: 'parent',
    grade: 'Parent',
    avatar: 'S'
  },
  {
    id: 'demo-admin',
    name: 'Star Admin',
    email: 'admin@startutoring.uk',
    pin: '0000',
    role: 'admin',
    grade: 'Administrator',
    avatar: '★'
  }
];

// simple in-memory store for demo mode. Not durable across cold starts.
const store: any[] = [
  // seeded quiz results for Amara
  { id: 'r1', student_id: 'demo-amara', subject: 'Maths', level: 'GCSE', title: 'Maths Quiz — GCSE', score: 4, total: 5, percentage: 80, time_taken_secs: 420, questions: [], created_at: new Date(Date.now() - 86400000 * 7).toISOString() },
  { id: 'r2', student_id: 'demo-amara', subject: 'Science', level: 'GCSE', title: 'Science Quiz — GCSE', score: 3, total: 5, percentage: 60, time_taken_secs: 480, questions: [], created_at: new Date(Date.now() - 86400000 * 6).toISOString() },
  { id: 'r3', student_id: 'demo-amara', subject: 'English', level: 'GCSE', title: 'English Quiz — GCSE', score: 5, total: 5, percentage: 100, time_taken_secs: 360, questions: [], created_at: new Date(Date.now() - 86400000 * 5).toISOString() },
  { id: 'r4', student_id: 'demo-amara', subject: 'Maths', level: 'GCSE', title: 'Maths Quiz — GCSE', score: 4, total: 5, percentage: 80, time_taken_secs: 400, questions: [], created_at: new Date(Date.now() - 86400000 * 4).toISOString() },
  { id: 'r5', student_id: 'demo-amara', subject: 'Science', level: 'GCSE', title: 'Science Quiz — GCSE', score: 4, total: 5, percentage: 80, time_taken_secs: 450, questions: [], created_at: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id: 'r6', student_id: 'demo-amara', subject: 'Maths', level: 'GCSE', title: 'Maths Quiz — GCSE', score: 5, total: 5, percentage: 100, time_taken_secs: 380, questions: [], created_at: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: 'r7', student_id: 'demo-amara', subject: 'English', level: 'GCSE', title: 'English Quiz — GCSE', score: 4, total: 5, percentage: 80, time_taken_secs: 410, questions: [], created_at: new Date(Date.now() - 86400000 * 1).toISOString() }
];

// In-memory stores for demo mode
const assessmentsStore: any[] = [
  {
    id: 'a1',
    learner_name: 'Zain Ali',
    academic_year: 'Year 5',
    parent_name: 'Fatima Ali',
    school_name: 'Stretford Grammar',
    course: '11+',
    subjects: ['Maths', 'English', 'Verbal Reasoning'],
    good_at: 'Maths and problem solving',
    improve: 'English comprehension and timed essays',
    other_info: '11+ exam in September',
    medical: '',
    phone: '07912345678',
    email: 'fatima.ali@email.com',
    status: 'pending',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'a2',
    learner_name: 'Emily Carter',
    academic_year: 'Year 10',
    parent_name: 'David Carter',
    school_name: 'Urmston Academy',
    course: 'GCSE',
    subjects: ['Maths', 'Physics', 'Chemistry'],
    good_at: 'Biology and lab work',
    improve: 'Algebra, equation solving',
    other_info: 'Wants to study Medicine',
    medical: '',
    phone: '07834567890',
    email: 'david.carter@email.com',
    status: 'pending',
    created_at: new Date(Date.now() - 86400000 * 1).toISOString()
  }
];

const contactsStore: any[] = [
  {
    id: 'c1',
    name: 'Rachel Green',
    email: 'rachel.green@email.com',
    message: 'Hi, I would like to know more about your A-Level Maths tuition. My daughter is currently in Year 12 and needs help with mechanics. What are your rates?',
    read: false,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'c2',
    name: 'Mohammed Khan',
    email: 'mkhan@email.com',
    message: 'Can you offer online sessions? We are based in Salford and travel to Stretford is difficult on weekdays.',
    read: false,
    created_at: new Date(Date.now() - 86400000 * 1).toISOString()
  }
];

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
