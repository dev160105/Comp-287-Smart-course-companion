# Deliverable 2 Completion Checklist

## Student Features
- [x] Create and manage a personal account
- [x] Add courses enrolled in (enroll/unenroll)
- [x] View assessments for each course
- [x] Enter earned marks and total marks for assessments
- [x] Automatically calculate and display current course averages
- [x] View upcoming assessments across all courses in one dashboard
- [x] Mark assessments as completed or pending
- [x] Edit or delete their own course/assessment tracking data
- [x] View visual summaries (progress bars, grades by course, performance chart)

## Instructor/Admin Features
- [x] Create and manage courses
- [x] Define assessment categories and weightings per course
- [x] Provide reusable course structures (course + assessment schema reuse through builder)
- [x] View anonymized usage statistics (completion metrics)
- [x] Enable or disable courses

## Technical Requirements
- [x] Web-based and responsive
- [x] Backend implemented using Node.js
- [x] Authentication required for protected routes
- [x] Data persisted in MongoDB
- [x] Students restricted to their own data
- [x] Calculations performed server side
- [x] Input validation on key API routes
- [x] Modular project structure

## Bonus Features
- [x] GPA estimation across all courses
- [x] Export grades to CSV
- [x] Export grades to PDF
- [x] Deadline reminders via email (SMTP or preview mode)
- [x] Dark/light mode support

## Verification Performed
- [x] Frontend production build passes (`client npm run build`)
- [x] Backend route module load sanity check passes
- [x] Backend startup verified (server starts; requires MongoDB running)

## Environment Notes
- MongoDB must be running locally or configured through `MONGODB_URI`.
- Email reminders send real email only when SMTP env vars are configured; otherwise preview mode is returned.
- CORS frontend origins are configured using `CLIENT_URLS`.
