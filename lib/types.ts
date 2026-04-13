export interface Question {
  text: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface QuizResult {
  id?: string;
  student_id: string;
  subject: string;
  level: string;
  title: string;
  score: number;
  total: number;
  percentage?: number;
  time_taken_secs: number;
  questions: Array<Question & { selected: number | null }>;
  created_at?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  pin: string;
  role: 'student' | 'parent';
  grade?: string;
  parent_id?: string;
  avatar?: string;
}

export type Subject = 'Maths' | 'Science' | 'English';
export type Level = '11+' | 'KS2' | 'KS3' | 'GCSE' | 'A-Level';
