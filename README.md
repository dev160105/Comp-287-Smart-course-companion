# Smart Course Companion

A web-based educational platform supporting student and instructor workflows for course management, assessment, and progress tracking.

## Project Timeline

- **Phase 1 (Due Feb 27, 2026)**: Frontend Only - React UI with mock data
- **Phase 2 (Due Mar 27, 2026)**: Backend - Node.js API with data persistence

## Tech Stack

- **Frontend**: React + Vite, Axios, Chart.js for visualizations
- **Backend**: Node.js + Express, MongoDB (Phase 2)
- **Monorepo Structure**: `/client` and `/server` folders

## Project Structure

```
smart-course-companion/
├── client/              # React frontend application
├── server/              # Node.js backend API
├── .gitignore
├── README.md
└── package.json (root)
```

## Quick Start

### Phase 1: Frontend Development

```bash
cd client
npm install
npm run dev
```

Runs on `http://localhost:5173` (Vite default)

### Phase 2: Full Stack (Coming March 27)

```bash
# Terminal 1: Frontend
cd client && npm run dev

# Terminal 2: Backend
cd server && npm run dev
```

## Features

### Authentication
- Login & Signup pages with role-based access
- Mock authentication (Phase 1) → Real authentication (Phase 2)

### Student Features
- Dashboard with course overview
- Course list & detailed course pages
- Assessment tracking
- Grade visualization with charts
- Progress tracking

### Admin/Instructor Features
- Admin dashboard with usage statistics
- Course structure builder
- Course management (enable/disable courses)

## Mock Data (Phase 1)

The frontend includes mock JSON files in `/client/src/data/`:
- `users.json` - Student and instructor accounts
- `courses.json` - Course catalog
- `assessments.json` - Assignments and quizzes
- `grades.json` - Student grades
- `courseStructure.json` - Course modules and content

## Team Collaboration Guidelines

1. Create feature branches: `git checkout -b feature/feature-name`
2. Commit frequently with clear messages
3. Push to remote before deadlines
4. Code review before merging to main

## Phase 1 Deliverables (Feb 27)

- [ ] Responsive UI for all student/admin pages
- [ ] Fully functional mock data loading
- [ ] Navigation between pages
- [ ] Progress charts & visualizations
- [ ] Role-based conditional rendering

## Phase 2 Deliverables (Mar 27)

- [ ] Express API with authentication
- [ ] MongoDB integration
- [ ] User registration & login (real)
- [ ] CRUD operations for courses, grades, assessments
- [ ] Data persistence layer

---

**Repository**: [Add your GitHub URL]  
**Trello/Project Board**: [Add your management tool URL]
