# Smart Course Companion - Quick Start Guide

## ⚡ 5-Minute Setup

### 1. Install Dependencies
```bash
cd smart-course-companion
npm install
cd client && npm install
cd ../server && npm install
```

### 2. Run Frontend (Phase 1)
```bash
cd client
npm run dev
```
**Opens at:** http://localhost:5173

### 3. Demo Login
- **Email:** john.doe@university.edu
- **Password:** password123
- **Role:** Student

---

## 📂 File Structure at a Glance

```
smart-course-companion/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── data/        # 5 JSON mock files ← START HERE for data
│   │   ├── utils/       # auth.js, dataLoader.js
│   │   └── App.jsx      # Main app entry
│   └── package.json
├── server/              # Node.js backend (Phase 2)
│   ├── src/
│   │   ├── routes/      # API endpoints
│   │   ├── models/      # DB schemas
│   │   └── server.js    # Express app
│   └── package.json
├── PROJECT_STRUCTURE.md # Detailed documentation
├── DEVELOPMENT_GUIDE.md # Task breakdown
└── README.md            # Project overview
```

---

## 📊 The 5 Mock JSON Data Files

| File | Purpose | Contains |
|------|---------|----------|
| **users.json** | User accounts | Students, instructors, admins with enrollments |
| **courses.json** | Course catalog | Course metadata, enrollment info, instructor |
| **assessments.json** | Assignments/quizzes | Due dates, types, point values |
| **grades.json** | Student scores | Assessment scores, GPA per course |
| **courseStructure.json** | Course content | Modules, topics, lessons, duration |

**Location:** `client/src/data/`

---

## 🎯 Key Package.json Scripts

```bash
# From root directory
npm run install-all          # Install all dependencies
npm run dev                  # Run both frontend & server (Phase 2)
npm run client               # Run frontend only
npm run server               # Run backend only

# From client directory
npm run dev                  # Start Vite dev server
npm run build                # Build for production
npm run preview              # Preview production build
```

---

## 🏗️ Main Directories Explained

### `/client/src/components/`
- **Auth/** - Login, Signup pages
- **Student/** - Dashboard, courses, assessments, grades, progress charts
- **Admin/** - Dashboard, course builder, course manager

### `/client/src/data/`
- Mock JSON files that act as a database for Phase 1
- Replace with API calls in Phase 2
- All real data structures are here

### `/client/src/utils/`
- `auth.js` - Mock authentication, login/logout logic
- `dataLoader.js` - Load mock data from JSON files

### `/server/src/`
- **routes/** - API endpoint blueprints (Phase 2)
- **controllers/** - Business logic (Phase 2)
- **models/** - MongoDB schemas (Phase 2)
- **middleware/** - Auth, error handling (Phase 2)

---

## 🚀 Phase 1 Goals (Due Feb 27)

✅ Complete these by deadline:
- [ ] Login/Signup working
- [ ] Student dashboard functional
- [ ] Course list & details pages
- [ ] Assessment list with filters
- [ ] Grade visualization with charts
- [ ] Admin dashboard & course management
- [ ] Responsive design (desktop, tablet, mobile)
- [ ] All navigation working
- [ ] Clean code with proper styling

---

## 🔧 Phase 2 Preview (Due Mar 27)

What changes:
```
Phase 1: Mock Data (JSON) → Phase 2: Real Database (MongoDB)
Phase 1: Local state        → Phase 2: API calls to backend
Phase 1: Demo auth          → Phase 2: JWT authentication
```

The 5 JSON files will become database collections in MongoDB.

---

## 📝 User Role Demo Accounts

| Email | Password | Role | Features |
|-------|----------|------|----------|
| john.doe@university.edu | password123 | Student | View courses, grades, assessments |
| jane.smith@university.edu | password123 | Student | Same as above |
| m.brown@university.edu | password123 | Instructor | Manage courses, record grades |
| admin@university.edu | admin123 | Admin | Full system access |

---

## 🎨 Tech Stack Summary

**Frontend (Phase 1):**
- React 18
- Vite (dev server, blazing fast)
- Chart.js (for grade visualizations)
- CSS3 (responsive design included)

**Backend (Phase 2):**
- Node.js + Express
- MongoDB (database)
- JWT (authentication)
- bcryptjs (password hashing)

---

## 🔗 Component Hierarchy

```
App.jsx (routing, auth check)
├── Login.jsx (unauthenticated)
├── Signup.jsx (unauthenticated)
│
├── StudentDashboard (if role === 'student')
│   ├── CourseList
│   │   └── CourseDetails
│   ├── AssessmentList
│   │   └── GradeEntryForm
│   └── ProgressVisualization
│
└── AdminDashboard (if role === 'admin')
    ├── CourseBuilder
    └── CourseManager
```

---

## 📚 Documentation Files

1. **README.md** - Project overview, timeline, quick start
2. **PROJECT_STRUCTURE.md** - Detailed folder structure & descriptions
3. **DEVELOPMENT_GUIDE.md** - Task assignments, testing checklist
4. **This file** - Quick reference

---

## 💡 Common Tasks

### Add new user to mock data
Edit `client/src/data/users.json`:
```json
{
  "id": "USR004",
  "firstName": "New",
  "lastName": "User",
  "email": "user@university.edu",
  "role": "student",
  "enrolledCourses": ["CS101"],
  "gpa": 3.5
}
```

### Add new course
Edit `client/src/data/courses.json`:
```json
{
  "id": "PHY101",
  "code": "PHY101",
  "title": "Physics I",
  "instructor": "INS001",
  "credits": 4,
  "isActive": true,
  "enrollmentCount": 0,
  "maxCapacity": 100
  // ... more fields
}
```

### Add new assessment
Edit `client/src/data/assessments.json`:
```json
{
  "id": "ASS007",
  "courseId": "CS101",
  "title": "Midterm Exam",
  "type": "exam",
  "dueDate": "2025-03-15",
  "maxPoints": 100,
  "status": "upcoming"
}
```

---

## ⚠️ Important Notes

1. **Phase 1 = Frontend Only** - No backend needed yet
2. **Mock Data** - All data is hardcoded in JSON files
3. **No Database** - Phase 1 uses client-side state only
4. **No API Calls** - Phase 2 will replace JSON with API calls
5. **Auth is Mock** - Phase 1 uses sessionStorage, Phase 2 will use JWT

---

## 🆘 When Something Breaks

**Port 5173 already in use?**
```bash
# Kill the process or specify different port
npm run dev -- --port 5174
```

**Module import errors?**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Data not loading?**
Check:
1. JSON file syntax (no trailing commas)
2. File paths in `dataLoader.js`
3. Browser console for errors
4. JSON file is in correct folder

**Styling issues?**
- Clear browser cache: Ctrl+Shift+Del
- Check DevTools (F12) Inspector
- Verify CSS selectors match elements

---

## 📞 Need Help?

1. Check PROJECT_STRUCTURE.md for detailed folder explanations
2. Read DEVELOPMENT_GUIDE.md for task breakdown
3. Review component comments in JSX files
4. Check browser console for error messages
5. Verify JSON file syntax at jsonlint.com

---

## ✨ You're All Set!

Your Smart Course Companion project is ready for Phase 1 development!

```bash
cd client
npm run dev
```

**Happy coding! 🚀**

---

**Deadline:** February 27, 2026  
**Phase 2 Starts:** March 1, 2026  
**Final Deadline:** March 27, 2026
