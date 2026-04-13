# Star Tutoring

Premium Next.js 14 website for **Star Tutoring** — a UK-based tutoring centre in
Stretford, Manchester — with an integrated AI-powered student/parent portal.

- Marketing site (home, courses, about, book assessment, contact)
- Student portal with AI-generated quizzes, instant grading and analytics
- Fully responsive, dark premium theme with gold accents
- Works in **demo mode** without any backend configuration

## Tech Stack

- **Next.js 14** (App Router, TypeScript, Server Components)
- **Tailwind CSS** with custom design tokens
- **Supabase** for the database (Postgres + RLS)
- **Anthropic Claude** (claude-sonnet-4) for AI quiz generation
- **Fraunces** + **Outfit** Google Fonts

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. (Optional) copy env file and fill in values
cp .env.local.example .env.local

# 3. Run the dev server
npm run dev
```

Open <http://localhost:3000>.

### Environment Variables

All are **optional** — the app runs in demo mode without them.

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
```

## Demo Mode

Without Supabase and Anthropic keys the app still works end-to-end:

- **Portal login** uses hardcoded demo accounts
- **Quiz generation** falls back to a curated bank of 75 questions
- **Quiz submissions** are stored in-memory for the session
- **Contact/Assessment forms** simply acknowledge submission

### Demo Accounts

| Email             | PIN  | Role    |
| ----------------- | ---- | ------- |
| amara@test.com    | 1234 | Student |
| oliver@test.com   | 1234 | Student |
| parent@test.com   | 1234 | Parent  |

## Supabase Setup

1. Create a new Supabase project.
2. Open the SQL editor and paste the contents of `supabase/schema.sql` — this
   creates all tables, row-level security policies and demo data.
3. Copy the project URL and anon key into `.env.local`.
4. Copy the service role key into `.env.local` (used by API routes for writes).

## Pages

| Route                               | Description                                       |
| ----------------------------------- | ------------------------------------------------- |
| `/`                                 | Landing page with all marketing sections          |
| `/courses`                          | Course tiers (11+, KS2/3, GCSE, A-Level)          |
| `/about`                            | Founder story and approach                        |
| `/book-assessment`                  | Free assessment booking form                      |
| `/contact`                          | Contact form with map                             |
| `/portal/login`                     | Student portal login                              |
| `/portal/dashboard`                 | Quiz hub — start a quiz for any subject/level     |
| `/portal/dashboard/analytics`       | Progress analytics with charts                    |

## API Routes

| Route                  | Method | Purpose                                                         |
| ---------------------- | ------ | --------------------------------------------------------------- |
| `/api/auth/login`      | POST   | Authenticates a student/parent by email + PIN                   |
| `/api/generate-quiz`   | POST   | Generates fresh AI questions (falls back to bank on failure)    |
| `/api/submit-quiz`     | POST   | Persists a quiz result                                          |
| `/api/student-stats`   | GET    | Returns aggregate analytics for a student                       |
| `/api/book-assessment` | POST   | Stores a free-assessment booking                                |
| `/api/contact`         | POST   | Stores a contact-form message                                   |

## Deployment

### Vercel (recommended for the frontend)

```bash
npm i -g vercel
vercel            # first time — links the project and deploys preview
vercel --prod     # production deploy
```

Add your environment variables in the Vercel project dashboard or via
`vercel env add` before the production deploy.

### Railway (if you want a managed Postgres or backend services)

```bash
npm i -g @railway/cli
railway login
railway init
railway up
```

The primary database is Supabase; Railway is optional and can be used to host
supplemental services (e.g. a cron worker) if required.

## Design System

- **Background**: `#080d1a` with animated gradient mesh + noise + grid overlay
- **Glass surfaces**: `rgba(15,22,41,0.65)` with `backdrop-filter: blur(20px)`
- **Accent**: gold `#f5b72f` (light `#ffd166`)
- **Fonts**: Fraunces (headings), Outfit (body)
- **Animations**: intersection-observer reveal, mesh float, star drift

## License

Copyright © 2025 Star Tutoring.
