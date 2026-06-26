# Star Tutoring Platform — User Guide

---

## Table of Contents

1. [Admin Guide](#admin-guide)
   - [Logging In](#admin-login)
   - [Dashboard Overview](#admin-dashboard-overview)
   - [Managing Students](#managing-students)
   - [Creating Weekly Tests](#creating-weekly-tests)
   - [Managing Weekly Tests](#managing-weekly-tests)
   - [Viewing Student Performance](#viewing-student-performance)
   - [Managing Resources](#managing-resources)
   - [Feedback & Contact Forms](#feedback--contact-forms)
2. [Parent/Student Guide](#parentstudent-guide)
   - [Logging In](#parent-login)
   - [Dashboard Overview](#parent-dashboard-overview)
   - [Taking Weekly Tests](#taking-weekly-tests)
   - [Viewing Analytics](#viewing-analytics)
   - [Downloading Resources](#downloading-resources)
   - [AI Quizzes](#ai-quizzes)

---

## Admin Guide

### Admin Login

1. Go to the portal login page: `/portal/login`
2. Enter the admin email address and PIN
3. You will be redirected to the admin dashboard at `/portal/admin`

> Note: Admin and parent sessions are independent — you can be logged in as both simultaneously in the same browser.

---

### Admin Dashboard Overview

The admin dashboard has the following tabs:

| Tab | Purpose |
|-----|---------|
| **Students** | Manage student records, link parents, view profiles |
| **Weekly Tests** | Create, publish, and monitor GL Assessment-style tests |
| **Quizzes** | Manage AI-generated quizzes assigned to students |
| **Resources** | Upload study materials for parents to download |
| **Feedback** | View contact form submissions from the website |

---

### Managing Students

**Adding a Student:**
1. Click the **Students** tab
2. Click **Add Student**
3. Fill in: Name, Email, Grade (e.g. "Year 6 — 11+"), Parent email
4. The student's grade determines which tests they see (level matching)

**Linking Parents:**
- When a parent logs in with their email, they are automatically linked to their child via the `parent_email` field on the student record
- The parent sees their child's data (tests, analytics, resources)

**Student Fields:**
- `name` — Student's full name
- `email` — Student's email (for direct login if needed)
- `grade` — e.g. "Year 5 — 11+", "Year 10 — GCSE" (determines level)
- `parent_email` — Links to the parent's login account
- `subjects` — Subjects the student is enrolled in

---

### Creating Weekly Tests

Weekly tests follow the **GL Assessment format**: 4 subjects, 20 MCQ questions per section.

**Steps:**
1. Go to the **Weekly Tests** tab
2. Click **Create Weekly Test**
3. Fill in:
   - **Title** — e.g. "Week 25 — June 2026"
   - **Level** — e.g. "11+", "GCSE" (must match student grade levels)
   - **Week Start** — The Monday of the test week
4. For each section, provide:
   - **Subject** — Maths, English, Verbal Reasoning, or Non-Verbal Reasoning
   - **Topic Name** — e.g. "Fractions & Decimals"
   - **Questions** — 20 multiple-choice questions, each with:
     - Question text
     - 4 options (A, B, C, D)
     - Correct answer index (0-3)
     - Explanation (shown after submission)

**AI Question Generation:**
- When creating sections, use the **Generate with AI** button
- Select subject, topic, and difficulty
- The AI generates 20 questions automatically
- Review and edit before saving
- Falls back to a curated question bank if AI is unavailable

---

### Managing Weekly Tests

**Test Lifecycle:**

```
Draft → Published → Closed
```

| Status | Visibility | Actions |
|--------|-----------|---------|
| **Draft** | Only visible to admin | Edit, Publish, Delete |
| **Published** | Visible to students matching the level | Close, Delete |
| **Closed** | No longer available for new attempts | Delete |

**Publishing:**
- Click the green **Publish** button on a draft test
- Students with matching levels will immediately see it in their dashboard

**Monitoring:**
- Each test card shows: attempt count and average score
- Click a test to see detailed per-student results

---

### Viewing Student Performance

**From the Weekly Tests tab:**
- Each test shows attempt count and average score (e.g. "3 attempts · avg 72%")
- Open a specific test to see:
  - List of students who completed it
  - Each student's total score, percentage, and time taken
  - Submission timestamps

**How scoring works:**
- Tests are auto-graded immediately on submission
- Each section is scored independently (score/total per subject)
- Total percentage is calculated across all sections
- Results flow into the analytics dashboard in real-time

---

### Managing Resources

**Uploading Resources:**
1. Go to the **Resources** tab
2. Click **Upload New**
3. Fill in:
   - **Title** (required) — e.g. "Maths Practice Paper 1"
   - **File** (required) — PDF, DOC, DOCX, XLSX, PPTX, PNG, JPG
   - **Description** (optional)
   - **Subject** — Maths, English, Verbal Reasoning, Non-Verbal Reasoning, or General
   - **Level** — 11+, KS2, KS3, GCSE, A-Level, or All levels
4. Click **Upload**

**What parents see:**
- Parents see ALL uploaded resources immediately after upload
- Resources are grouped by subject and shown with download buttons
- Static study materials (201 pre-loaded files) are also visible
- Parents can search and filter by subject/category

**Deleting Resources:**
- Click the trash icon next to any uploaded resource
- Static pre-loaded materials cannot be deleted from the dashboard

---

### Feedback & Contact Forms

- The **Feedback** tab shows submissions from the website contact form
- Each entry includes: name, email, phone, message, and timestamp
- Use this to follow up with enquiries

---

## Parent/Student Guide

### Parent Login

1. Go to `/portal/login`
2. Enter your registered email and PIN (provided by Star Tutoring)
3. You'll be taken to the student dashboard

> Your account is linked to your child's profile. Everything you see relates to your child's progress.

---

### Parent Dashboard Overview

After logging in, you'll see:

| Section | What it shows |
|---------|--------------|
| **Dashboard** (home) | Weekly tests available, recent quiz results, quick stats |
| **Analytics** | Detailed performance breakdown by subject with trends |
| **Resources** | Study materials available for download |
| **AI Quizzes** | Practice quizzes your child can take anytime |

---

### Taking Weekly Tests

**Finding available tests:**
- On the main dashboard, look for the **Weekly Tests** section
- Only tests matching your child's level are shown
- Tests show: title, number of sections, and total questions

**Starting a test:**
1. Click the **Start Test** button on any available test
2. The test opens with a timer
3. Each section contains 20 multiple-choice questions
4. Select one answer per question (A, B, C, or D)

**During the test:**
- Navigate between sections using the section tabs
- Questions can be answered in any order
- Unanswered questions are flagged
- Time taken is recorded

**Submitting:**
1. Click **Submit Test** when finished
2. You'll see your results immediately:
   - Score per section (e.g. "Maths: 16/20")
   - Total percentage
   - Time taken
   - Correct answers and explanations for each question

**Important notes:**
- Each test can only be submitted once
- You cannot go back and change answers after submission
- Results appear immediately in your analytics

---

### Viewing Analytics

Go to **Analytics** from the sidebar to see:

**Overview Cards:**
- Total assessments completed
- Overall average score
- Total questions answered
- Best subject

**Per-Subject Breakdown:**
- Average score per subject (Maths, English, VR, NVR)
- Trend indicator (improving/declining)
- Number of assessments per subject

**Recent Results:**
- Chronological list of all quiz and test results
- Shows: title, subject, score, percentage, date
- Includes both AI quizzes and weekly test sections

**How data flows:**
- Weekly test scores appear instantly after submission
- AI quiz scores appear immediately after completion
- All data is combined for a complete picture of progress

---

### Downloading Resources

1. Click **Resources** in the sidebar
2. Browse by subject or use the search bar
3. Filter by subject or category using the dropdowns
4. Click the **Download** button on any file

**Available materials:**
- Practice papers (organised by subject and topic)
- Worksheets and revision guides
- Materials uploaded by your tutor
- All in PDF format, ready to print

**Organisation:**
- Resources are grouped by subject (colour-coded):
  - Purple — Maths
  - Cyan — English
  - Amber — Verbal Reasoning
  - Pink — Non-Verbal Reasoning
  - Green — General
- Click a category to expand and see individual files

---

### AI Quizzes

**How they work:**
1. From the dashboard, find available quizzes or request a practice session
2. Select your subject and topic
3. The AI generates personalised questions at your level
4. Answer the multiple-choice questions
5. Get instant feedback with explanations

**Features:**
- Adaptive difficulty based on your level
- Covers all 4 GL Assessment subjects
- Instant scoring and detailed explanations
- Results feed into your analytics automatically

---

## Quick Reference

| Action | Where |
|--------|-------|
| Admin login | `/portal/login` with admin credentials |
| Parent login | `/portal/login` with parent credentials |
| Create test | Admin → Weekly Tests → Create |
| Publish test | Admin → Weekly Tests → Publish button |
| Upload resource | Admin → Resources → Upload New |
| Take test | Parent Dashboard → Weekly Tests → Start |
| View scores | Parent → Analytics |
| Download materials | Parent → Resources |

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "No tests available" | Check that the test is **published** and the student's grade/level matches |
| Can't see resources | Admin must upload them first; check the Resources tab |
| Analytics empty | Student needs to complete at least one quiz or test |
| Login not working | Verify email and PIN with admin; check for typos |
| Test won't start | Ensure the test status is "published" (not draft/closed) |

---

*Star Tutoring — Stretford, Manchester*
*Platform built for GL Assessment preparation (11+, KS2, KS3, GCSE)*
