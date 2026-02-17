# Smart Course Companion - Project Structure Overview

## 📁 Complete Folder Structure

```
smart-course-companion/
│
├── client/                              # React Frontend (Phase 1 & 2)
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Signup.jsx
│   │   │   ├── Student/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── CourseList.jsx
│   │   │   │   ├── CourseDetails.jsx
│   │   │   │   ├── AssessmentList.jsx
│   │   │   │   ├── GradeEntryForm.jsx
│   │   │   │   └── ProgressVisualization.jsx
│   │   │   └── Admin/
│   │   │       ├── Dashboard.jsx
│   │   │       ├── CourseBuilder.jsx
│   │   │       └── CourseManager.jsx
│   │   ├── pages/                      # Container pages (optional layer)
│   │   ├── data/                       # Mock JSON data (Phase 1)
│   │   │   ├── users.json
│   │   │   ├── courses.json
│   │   │   ├── assessments.json
│   │   │   ├── grades.json
│   │   │   └── courseStructure.json
│   │   ├── utils/
│   │   │   ├── auth.js                 # Mock authentication utilities
│   │   │   └── dataLoader.js           # Load and manage mock data
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
│
├── server/                              # Node.js Backend (Phase 2)
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.js                 # Login, Signup, JWT refresh
│   │   │   ├── courses.js              # Course CRUD, enrollment
│   │   │   ├── assessments.js          # Assessment CRUD, submissions
│   │   │   ├── grades.js               # Grade recording, GPA calculation
│   │   │   └── users.js                # User management, enrollment
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── courseController.js
│   │   │   ├── assessmentController.js
│   │   │   ├── gradeController.js
│   │   │   └── userController.js
│   │   ├── models/
│   │   │   ├── User.js                 # MongoDB User schema
│   │   │   ├── Course.js               # MongoDB Course schema
│   │   │   ├── Assessment.js           # MongoDB Assessment schema
│   │   │   ├── Grade.js                # MongoDB Grade schema
│   │   │   └── Enrollment.js           # MongoDB Enrollment schema
│   │   ├── middleware/
│   │   │   ├── auth.js                 # JWT authentication middleware
│   │   │   └── errorHandler.js         # Error handling middleware
│   │   └── server.js                   # Main Express server file
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
├── .gitignore
├── package.json                        # Root monorepo package.json
└── README.md
```

---

## 📋 Directory Descriptions

### `/client` - React Frontend
**Purpose:** User-facing web application for students and instructors.

**Key Folders:**
- **`src/components/Auth/`** - Login and Signup components with form validation
- **`src/components/Student/`** - Student-specific features (courses, assessments, grades, progress tracking)
- **`src/components/Admin/`** - Admin/Instructor features (course builder, course manager, dashboard)
- **`src/data/`** - Mock JSON files for Phase 1 development (hard-coded data)
- **`src/utils/`** - Utility functions for authentication and data loading
- **`public/`** - Static assets and HTML root file

**Tech Stack:** React 18, Vite (dev server), Axios, Chart.js, React Router

---

### `/server` - Node.js/Express Backend
**Purpose:** REST API server for authentication, course management, and data persistence.

**Key Folders:**
- **`src/routes/`** - API endpoint definitions for each resource
- **`src/controllers/`** - Business logic for handling requests
- **`src/models/`** - MongoDB schemas and database models
- **`src/middleware/`** - Custom middleware (JWT auth, error handling)
- **`src/server.js`** - Express app initialization and configuration

**Tech Stack:** Node.js, Express, MongoDB, JWT, bcryptjs

---

## 🚀 Getting Started - Phase 1 (Frontend Only)

### Installation

```bash
# Install root dependencies (optional, for monorepo commands)
npm install

# Install all dependencies
npm run install-all

# OR install individually
cd client && npm install
```

### Running the Frontend

```bash
# From root directory
npm run client

# OR from client directory
cd client
npm run dev
```

**Frontend runs on:** `http://localhost:5173`

### Package.json Scripts

**Root `package.json`:**
```json
{
  "scripts": {
    "dev": "concurrently \"cd client && npm run dev\" \"cd server && npm run dev\"",
    "client": "cd client && npm run dev",
    "server": "cd server && npm run dev",
    "install-all": "npm install && cd client && npm install && cd ../server && npm install"
  }
}
```

**Client `package.json`:**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

---

## 📊 Mock JSON Data Files (Phase 1)

The frontend uses 5 mock JSON data files in `/client/src/data/`:

### 1. **users.json**
**Purpose:** User accounts (students, instructors, admins)
**Key Fields:**
- `id`, `firstName`, `lastName`, `email`, `role`
- `enrolledCourses` (for students)
- `teachingCourses` (for instructors)
- `gpa` (for students)

**Sample:**
```json
{
  "id": "USR001",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@university.edu",
  "role": "student",
  "enrolledCourses": ["CS101", "MATH201"],
  "gpa": 3.75
}
```

---

### 2. **courses.json**
**Purpose:** Course catalog with metadata
**Key Fields:**
- `id`, `code`, `title`, `description`
- `instructor`, `credits`, `semester`
- `enrollmentCount`, `maxCapacity`
- `isActive`, `meetingTime`, `location`

**Sample:**
```json
{
  "id": "CS101",
  "code": "CS101",
  "title": "Introduction to Computer Science",
  "instructor": "INS001",
  "credits": 3,
  "enrollmentCount": 150,
  "maxCapacity": 200,
  "isActive": true
}
```

---

### 3. **assessments.json**
**Purpose:** Assignments, quizzes, exams
**Key Fields:**
- `id`, `courseId`, `title`, `type` (assignment/quiz/exam/project)
- `description`, `dueDate`, `maxPoints`
- `status` (open/upcoming/closed)

**Sample:**
```json
{
  "id": "ASS001",
  "courseId": "CS101",
  "title": "Assignment 1: Variables and Data Types",
  "type": "assignment",
  "dueDate": "2025-02-15",
  "maxPoints": 50,
  "status": "open"
}
```

---

### 4. **grades.json**
**Purpose:** Student grades and assessment results
**Key Fields:**
- `id`, `studentId`, `courseId`
- `assessments[]` with `pointsEarned`, `maxPoints`, `percentage`
- `currentGrade` (letter grade), `gpa`

**Sample:**
```json
{
  "id": "GRD001",
  "studentId": "USR001",
  "courseId": "CS101",
  "assessments": [
    {
      "assessmentId": "ASS001",
      "pointsEarned": 48,
      "maxPoints": 50,
      "percentage": 96
    }
  ],
  "currentGrade": "A",
  "gpa": 4.0
}
```

---

### 5. **courseStructure.json**
**Purpose:** Course content organization (modules, topics, lessons)
**Key Fields:**
- `courseId`, `title`
- `modules[]` containing:
  - `moduleId`, `title`, `order`
  - `topics[]` with `topicId`, `title`, `contentType`, `durationMinutes`

**Sample:**
```json
{
  "id": "STRUCT001",
  "courseId": "CS101",
  "title": "Introduction to Computer Science",
  "modules": [
    {
      "moduleId": "MOD001",
      "title": "Module 1: Programming Basics",
      "order": 1,
      "topics": [
        {
          "topicId": "TOP001",
          "title": "Variables and Data Types",
          "contentType": "lecture",
          "durationMinutes": 45
        }
      ]
    }
  ]
}
```

---

## 🎯 Phase 1 Checklist (Due Feb 27, 2026)

- [ ] Responsive frontend UI for all pages
- [ ] Login & Signup functionality (mock auth)
- [ ] Student Dashboard with course overview
- [ ] Course list and course detail pages
- [ ] Assessment list with filtering
- [ ] Grade visualization with charts and progress bars
- [ ] Admin dashboard with statistics
- [ ] Course builder and course manager (UI)
- [ ] Role-based conditional rendering
- [ ] Navigation between all pages
- [ ] Basic CSS styling (complete)
- [ ] Git repository initialized with README

---

## 🔧 Phase 2 Preview (Due Mar 27, 2026)

**What changes:**
1. Remove mock data, use real API
2. Implement Node.js/Express backend
3. Add MongoDB for data persistence
4. Real JWT authentication
5. API routes for crud operations
6. User registration with email verification
7. Grade calculation engine
8. Analytics and reporting

**Backend will provide:**
- `/api/auth/*` - User authentication
- `/api/courses/*` - Course management
- `/api/assessments/*` - Assessment management
- `/api/grades/*` - Grade recording and calculation
- `/api/users/*` - User profile and enrollment

---

## 👥 User Roles & Permissions

### **Student**
- View enrolled courses
- Submit assessments
- View grades and feedback
- Track progress
- View dashboard with GPA

### **Instructor/Admin**
- Create and manage courses
- Create assessments
- Record grades
- View enrollment statistics
- Enable/disable courses
- View system usage analytics

### **System Admin**
- All instructor permissions
- User management
- System settings
- View all analytics

---

## 🔑 Demo Credentials (Phase 1)

| Email | Password | Role |
|-------|----------|------|
| john.doe@university.edu | password123 | Student |
| jane.smith@university.edu | password123 | Student |
| m.brown@university.edu | password123 | Instructor |
| admin@university.edu | admin123 | Admin |

---

## 📝 Development Guidelines

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/login-page

# Make changes and commit
git add .
git commit -m "feat: implement login page"

# Push before deadlines
git push origin feature/login-page
```

### Code Structure
- Keep components focused and reusable
- Use consistent naming conventions
- Add comments for complex logic
- Separate concerns (components, utilities, data)

### Testing Phase 1
- Test on different screen sizes (desktop, tablet, mobile)
- Verify role-based access works correctly
- Check all navigation links
- Validate form inputs

---

## 📚 Resources & Next Steps

1. **Vite Documentation:** https://vitejs.dev/
2. **React Docs:** https://react.dev/
3. **Express Docs:** https://expressjs.com/
4. **MongoDB Docs:** https://docs.mongodb.com/
5. **JWT Guide:** https://jwt.io/

---

## 🎓 Team Collaboration

- **Repository:** [Add GitHub URL]
- **Project Board:** [Add Trello/GitHub Projects URL]
- **Communication:** [Add Slack/Discord/Teams Channel]
- **Deadline:** Feb 27, 2026 (Phase 1) | Mar 27, 2026 (Phase 2)

Good luck with your Smart Course Companion project! 🚀
