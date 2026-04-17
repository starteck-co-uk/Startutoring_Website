-- Star Tutoring — Supabase schema
-- Run this in the Supabase SQL editor (or via the CLI) to provision all tables,
-- row-level security rules, and demo data.

create extension if not exists "pgcrypto";

-- ========== TABLES ==========

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  pin text not null,
  role text not null check (role in ('student', 'parent', 'admin')),
  grade text,
  parent_id uuid references public.students(id) on delete set null,
  avatar text,
  phone text,
  school_name text,
  subjects text[] default '{}',
  strengths text,
  areas_to_improve text,
  medical_notes text,
  admin_notes text,
  status text not null default 'active' check (status in ('active', 'inactive', 'paused')),
  enrollment_date date default current_date,
  created_at timestamptz not null default now()
);

create table if not exists public.quiz_results (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  subject text not null,
  level text not null,
  title text,
  score int not null,
  total int not null,
  percentage numeric generated always as (
    case when total > 0 then (score::numeric / total::numeric) * 100 else 0 end
  ) stored,
  time_taken_secs int not null default 0,
  questions jsonb,
  created_at timestamptz not null default now()
);

create index if not exists quiz_results_student_idx on public.quiz_results (student_id, created_at desc);

create table if not exists public.assessments (
  id uuid primary key default gen_random_uuid(),
  learner_name text not null,
  academic_year text,
  parent_name text not null,
  school_name text,
  course text,
  subjects text[] default '{}',
  good_at text,
  improve text,
  other_info text,
  medical text,
  phone text not null,
  email text not null,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.ai_settings (
  id text primary key default 'global',
  provider text not null default 'claude',
  claude_key text default '',
  openai_key text default '',
  gemini_key text default '',
  copilot_key text default '',
  updated_at timestamptz not null default now()
);

-- Syllabi — one per subject+level, stores syllabus text content
create table if not exists public.syllabi (
  id uuid primary key default gen_random_uuid(),
  subject text not null,
  level text not null,
  title text not null,
  content text not null,
  file_name text,
  file_size int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(subject, level)
);

-- Admin-created quizzes with lifecycle states
create table if not exists public.quizzes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subject text not null,
  level text not null,
  topic text,
  status text not null default 'draft' check (status in ('draft', 'published', 'closed')),
  question_count int not null default 0,
  created_by uuid references public.students(id),
  published_at timestamptz,
  closed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists quizzes_level_status_idx on public.quizzes (level, status);

-- Individual questions belonging to a quiz
create table if not exists public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  question_order int not null,
  text text not null,
  options jsonb not null,
  correct int not null,
  explanation text not null,
  created_at timestamptz not null default now()
);
create index if not exists quiz_questions_quiz_idx on public.quiz_questions (quiz_id, question_order);

-- Student attempts at admin-published quizzes
create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  answers jsonb not null default '[]',
  score int,
  total int,
  percentage numeric generated always as (
    case when total > 0 then (score::numeric / total::numeric) * 100 else 0 end
  ) stored,
  graded boolean not null default false,
  time_taken_secs int not null default 0,
  started_at timestamptz not null default now(),
  submitted_at timestamptz,
  unique(quiz_id, student_id)
);
create index if not exists quiz_attempts_student_idx on public.quiz_attempts (student_id, submitted_at desc);

-- ========== ROW LEVEL SECURITY ==========
alter table public.students enable row level security;
alter table public.quiz_results enable row level security;
alter table public.assessments enable row level security;
alter table public.contacts enable row level security;
alter table public.ai_settings enable row level security;

alter table public.syllabi enable row level security;
alter table public.quizzes enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.quiz_attempts enable row level security;

drop policy if exists "syllabi all" on public.syllabi;
create policy "syllabi all" on public.syllabi using (true) with check (true);

drop policy if exists "quizzes all" on public.quizzes;
create policy "quizzes all" on public.quizzes using (true) with check (true);

drop policy if exists "quiz_questions all" on public.quiz_questions;
create policy "quiz_questions all" on public.quiz_questions using (true) with check (true);

drop policy if exists "quiz_attempts all" on public.quiz_attempts;
create policy "quiz_attempts all" on public.quiz_attempts using (true) with check (true);

-- ai_settings: only service role should read/write (API routes use admin client)
drop policy if exists "ai_settings all" on public.ai_settings;
create policy "ai_settings all" on public.ai_settings using (true) with check (true);

-- students: anon can read (needed for demo login); writes only via service role
drop policy if exists "students read" on public.students;
create policy "students read" on public.students for select using (true);

-- quiz_results: anon can read & insert
drop policy if exists "quiz_results read" on public.quiz_results;
create policy "quiz_results read" on public.quiz_results for select using (true);

drop policy if exists "quiz_results insert" on public.quiz_results;
create policy "quiz_results insert" on public.quiz_results for insert with check (true);

-- assessments: anon can insert (used by the public booking form)
drop policy if exists "assessments insert" on public.assessments;
create policy "assessments insert" on public.assessments for insert with check (true);

-- contacts: anon can insert (used by the public contact form)
drop policy if exists "contacts insert" on public.contacts;
create policy "contacts insert" on public.contacts for insert with check (true);

-- ========== SEED DATA ==========
-- Insert your admin account below. Update the email, name, and PIN as needed.
-- Admin accounts are required to manage students, quizzes, and settings.
--
-- Example:
-- insert into public.students (name, email, pin, role, grade, avatar)
-- values ('Your Name', 'admin@yourdomain.com', '0000', 'admin', 'Administrator', '★')
-- on conflict (email) do nothing;
