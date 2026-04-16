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
  role: 'student' | 'parent' | 'admin';
  grade?: string;
  parent_id?: string;
  avatar?: string;
  phone?: string;
  school_name?: string;
  subjects?: string[];
  strengths?: string;
  areas_to_improve?: string;
  medical_notes?: string;
  admin_notes?: string;
  status?: 'active' | 'inactive' | 'paused';
  enrollment_date?: string;
  created_at?: string;
}

export type Subject = 'Maths' | 'Science' | 'English';
export type Level = '11+' | 'KS2' | 'KS3' | 'GCSE' | 'A-Level';
export type QuizStatus = 'draft' | 'published' | 'closed';

export interface Syllabus {
  id: string;
  subject: string;
  level: string;
  title: string;
  content: string;
  file_name?: string;
  file_size?: number;
  created_at: string;
  updated_at: string;
}

export interface Quiz {
  id: string;
  title: string;
  subject: string;
  level: string;
  topic?: string;
  status: QuizStatus;
  question_count: number;
  created_by?: string;
  published_at?: string;
  closed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question_order: number;
  text: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface QuizAttempt {
  id: string;
  quiz_id: string;
  student_id: string;
  answers: Array<{ question_id: string; selected: number | null }>;
  score: number | null;
  total: number | null;
  percentage?: number;
  graded: boolean;
  time_taken_secs: number;
  started_at: string;
  submitted_at?: string;
}

export interface QuizChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
