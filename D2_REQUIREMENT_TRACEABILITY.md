# D2 Requirement Traceability Matrix

## Student Requirements
1. Create/manage personal account
- Status: Complete
- Evidence:
- API: server/routes/auth.js (register, login, me)
- UI: client/src/components/Auth/Login.jsx, client/src/components/Auth/Signup.jsx

2. Add enrolled courses (code, name, instructor, term)
- Status: Complete
- Evidence:
- API: server/routes/courses.js (POST /:id/enroll, DELETE /:id/enroll, GET /)
- UI: client/src/components/Student/CourseList.jsx

3. View assessments per course
- Status: Complete
- Evidence:
- API: server/routes/assessments.js (GET /, GET /course/:courseId)
- UI: client/src/components/Student/CourseDetails.jsx, client/src/components/Student/AssessmentList.jsx

4. Enter earned marks and total marks
- Status: Complete
- Evidence:
- API: server/routes/grades.js (POST /assessment/:assessmentId/status, POST /, PUT /:id)
- UI: client/src/components/Student/AssessmentList.jsx

5. Auto-calculate/display course averages
- Status: Complete
- Evidence:
- API: server/utils/calculations.js, server/routes/grades.js (GET /student/:studentId)
- UI: client/src/components/Student/Dashboard.jsx, client/src/components/Student/ProgressVisualization.jsx

6. Upcoming assessments in single dashboard
- Status: Complete
- Evidence:
- API: server/routes/grades.js (upcomingAssessments payload)
- UI: client/src/components/Student/Dashboard.jsx

7. Mark assessments completed/pending
- Status: Complete
- Evidence:
- API: server/models/Grade.js (status), server/routes/grades.js
- UI: client/src/components/Student/AssessmentList.jsx

8. Edit/delete own tracking data
- Status: Complete
- Evidence:
- API: server/routes/grades.js (PUT /:id, DELETE /:id)
- Scope control: ownership checks in routes

9. Visual summaries (progress bars/charts)
- Status: Complete
- Evidence:
- UI: client/src/components/Student/ProgressVisualization.jsx, client/src/components/Student/Dashboard.jsx

## Instructor/Admin Requirements
1. Create/manage courses
- Status: Complete
- Evidence:
- API: server/routes/courses.js (POST, PUT, DELETE)
- UI: client/src/components/Admin/CourseBuilder.jsx, client/src/components/Admin/CourseManager.jsx

2. Define assessment categories and weightings
- Status: Complete
- Evidence:
- API: server/models/Assessment.js (type, weight), server/routes/assessments.js validations

3. Reusable course structures
- Status: Complete (implemented as reusable course + assessment schema workflow)
- Evidence:
- UI: client/src/components/Admin/CourseBuilder.jsx
- Models: server/models/Course.js, server/models/Assessment.js

4. View anonymized usage stats
- Status: Complete
- Evidence:
- API: server/routes/users.js (/stats -> completion metrics)
- UI: client/src/components/Admin/Dashboard.jsx

5. Enable/disable courses
- Status: Complete
- Evidence:
- API: server/routes/courses.js (PUT isActive)
- UI: client/src/components/Admin/CourseManager.jsx

## Technical Requirements
1. Web-based and responsive
- Status: Complete
- Evidence:
- UI: client/src/index.css, client/src/App.css

2. Backend in Node.js
- Status: Complete
- Evidence:
- Runtime: server/server.js

3. Authentication required
- Status: Complete
- Evidence:
- Middleware: server/middleware/auth.js
- Protected routes: courses/assessments/grades/users

4. Data persistence
- Status: Complete
- Evidence:
- MongoDB: server/config/db.js + Mongoose models

5. Student data isolation
- Status: Complete
- Evidence:
- Access checks in server/routes/courses.js, assessments.js, grades.js

6. Server-side calculations
- Status: Complete
- Evidence:
- server/utils/calculations.js used by grade routes

7. Input validation
- Status: Complete
- Evidence:
- express-validator + server/middleware/validate.js across route handlers

8. Modular project structure
- Status: Complete
- Evidence:
- Separate models/routes/middleware/utils and client components/utils

## Bonus Features
1. GPA estimation
- Status: Complete
- Evidence: server/routes/grades.js, client dashboard/progress components

2. Export grades to CSV
- Status: Complete
- Evidence: server/routes/grades.js export.csv + client/src/utils/dataLoader.js

3. Export grades to PDF
- Status: Complete
- Evidence: server/routes/grades.js export.pdf + client/src/utils/dataLoader.js

4. Deadline reminders via email
- Status: Complete
- Evidence: server/routes/grades.js reminders endpoint + SMTP preview fallback

5. Dark/Light mode
- Status: Complete
- Evidence: client/src/App.jsx + theme variables in CSS

## Verification Summary
- Frontend build: PASS (npm run build in client)
- Backend route load sanity: PASS (routes required successfully)
- Full runtime API verification: Requires active MongoDB and optionally SMTP for real send mode
