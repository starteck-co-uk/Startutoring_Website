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
