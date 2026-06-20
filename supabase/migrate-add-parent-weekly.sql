-- Migration: Add parent role, linked_students, parent_email, and weekly test tables
-- Run this in Supabase SQL Editor if you already have the original schema

-- 1. Add missing columns to students table
alter table public.students add column if not exists parent_email text;
alter table public.students add column if not exists linked_students text[] default '{}';

-- 2. Update role check constraint to include 'parent'
alter table public.students drop constraint if exists students_role_check;
alter table public.students add constraint students_role_check
  check (role in ('student', 'parent', 'admin'));

-- 3. Weekly tests table
create table if not exists public.weekly_tests (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  level text not null,
  week_start date not null,
  status text not null default 'draft' check (status in ('draft', 'published', 'closed')),
  sections jsonb not null default '[]',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists weekly_tests_level_status_idx on public.weekly_tests (level, status);

-- 4. Weekly test attempts table
create table if not exists public.weekly_test_attempts (
  id uuid primary key default gen_random_uuid(),
  test_id uuid not null references public.weekly_tests(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  section_results jsonb not null default '[]',
  total_score int not null default 0,
  total_questions int not null default 0,
  total_percentage numeric not null default 0,
  time_taken_secs int not null default 0,
  completed boolean not null default false,
  started_at timestamptz not null default now(),
  submitted_at timestamptz,
  unique(test_id, student_id)
);
create index if not exists weekly_test_attempts_student_idx on public.weekly_test_attempts (student_id, submitted_at desc);

-- 5. RLS for new tables
alter table public.weekly_tests enable row level security;
alter table public.weekly_test_attempts enable row level security;

drop policy if exists "weekly_tests all" on public.weekly_tests;
create policy "weekly_tests all" on public.weekly_tests using (true) with check (true);

drop policy if exists "weekly_test_attempts all" on public.weekly_test_attempts;
create policy "weekly_test_attempts all" on public.weekly_test_attempts using (true) with check (true);
