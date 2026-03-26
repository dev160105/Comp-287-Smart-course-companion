# D2 Demo Script (8-10 minutes)

## 1) Setup (30-45s)
- Start backend: npm run dev (server folder)
- Start frontend: npm run dev (client folder)
- Confirm database is connected and seeded (optional: npm run seed)

## 2) Student Flow (3-4 min)
- Login as student.
- Open Courses page.
- Enroll into one active course.
- Open Course Details and verify assessments are visible.
- Open Assessments page.
- Mark one assessment as completed and enter earned marks.
- Mark one assessment as pending.
- Open Dashboard:
- Show upcoming assessments list across all enrolled courses.
- Show updated GPA and summary cards.
- Export grades to CSV.
- Export grades to PDF.
- Trigger email reminder (shows sent mode if SMTP configured, preview mode otherwise).

## 3) Instructor/Admin Flow (3-4 min)
- Login as instructor or admin.
- Create one new course in Course Builder.
- In Course Manager, disable then re-enable a course.
- Delete a test course (if needed for cleanup).
- Open Admin Dashboard > Reports:
- Show anonymized completion metrics.
- Show completed/pending counts and completion rate.

## 4) Security/Validation Checks (1-2 min)
- Explain that students can only access their own grade/assessment tracking.
- Show backend validation example (invalid score > max points rejected).
- Explain all GPA/course-average calculations are server-side.

## 5) Bonus Features Callout (30-45s)
- GPA estimation.
- CSV/PDF export.
- Email reminders.
- Dark/Light mode toggle with persistence.

## Backup Plan
- If SMTP is not configured, show reminder preview response.
- If MongoDB is unavailable, run route module sanity check and frontend build as proof of integration state.
