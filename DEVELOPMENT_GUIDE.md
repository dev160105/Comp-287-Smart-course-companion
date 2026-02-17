# Smart Course Companion - Development Guide

## 🎯 Phase 1 Development Plan (Due Feb 27, 2026)

### Task Breakdown by Component

---

## 👥 Task Assignments

### **Team Member 1: Authentication & Navigation**
**Deadline:** Feb 20, 2026

**Tasks:**
1. Implement Login component (`src/components/Auth/Login.jsx`)
   - Form validation
   - Mock authentication using `utils/auth.js`
   - Error message display
   - Demo credentials display
   
2. Implement Signup component (`src/components/Auth/Signup.jsx`)
   - Form fields: firstName, lastName, email, password, major
   - Input validation
   - Mock signup flow
   - Success redirect to dashboard

3. Create Navigation Bar
   - Logo and branding
   - Conditional menu items based on user role
   - User info display
   - Logout button
   - Responsive design

4. Implement Role-Based Routing
   - Redirect unauthenticated users to login
   - Show student UI for student role
   - Show admin UI for admin role

**Files to Create/Modify:**
- ✅ `src/components/Auth/Login.jsx`
- ✅ `src/components/Auth/Signup.jsx`
- ✅ `src/utils/auth.js`
- ✅ `src/App.jsx` (routing logic)
- ✅ `src/App.css` (navbar styling)

---

### **Team Member 2: Student Dashboard & Course Features**
**Deadline:** Feb 23, 2026

**Tasks:**
1. Implement Student Dashboard (`src/components/Student/Dashboard.jsx`)
   - Display welcome message with student name
   - Show enrolled courses count
   - Display current GPA
   - Show pending assessments count
   - List enrolled courses as cards
   - Make course cards clickable

2. Implement Course List (`src/components/Student/CourseList.jsx`)
   - Display all courses in table format
   - Columns: Code, Title, Instructor, Credits, Enrollment, Status
   - Filter button for "Active Courses"
   - "View Details" button per course

3. Implement Course Details (`src/components/Student/CourseDetails.jsx`)
   - Display course metadata (code, instructor, credits, semester)
   - Course description
   - Meeting time and location
   - List of assessments for the course
   - Clickable assessment items

4. Polish Student UI
   - Consistent styling across components
   - Responsive grid layouts
   - Hover effects on interactive elements

**Files to Create/Modify:**
- ✅ `src/components/Student/Dashboard.jsx`
- ✅ `src/components/Student/CourseList.jsx`
- ✅ `src/components/Student/CourseDetails.jsx`
- ✅ `src/utils/dataLoader.js` (add filtering functions)
- ✅ `src/data/courses.json`
- ✅ `src/App.css` (course card styling)

---

### **Team Member 3: Assessments & Grades**
**Deadline:** Feb 24, 2026

**Tasks:**
1. Implement Assessment List (`src/components/Student/AssessmentList.jsx`)
   - Display student's assessments
   - Filter by status: All, Open, Upcoming
   - Show assessment details: title, type, due date, max points
   - Status badge styling (open, upcoming, closed)

2. Implement Grade Entry Form (`src/components/Student/GradeEntryForm.jsx`)
   - Score input field with validation (0 to max points)
   - Feedback textarea (optional)
   - Submit button
   - Form reset on submit

3. Create Assessment Detail View
   - Show full assessment information
   - Display student submissions (if any)
   - Show grading interface for instructors

4. Mock Data Integration
   - Load assessments from JSON
   - Load grades from JSON
   - Connect components to data

**Files to Create/Modify:**
- ✅ `src/components/Student/AssessmentList.jsx`
- ✅ `src/components/Student/GradeEntryForm.jsx`
- ✅ `src/data/assessments.json`
- ✅ `src/data/grades.json`
- ✅ `src/utils/dataLoader.js` (add filtering by course, student)

---

### **Team Member 4: Analytics & Progress Visualization**
**Deadline:** Feb 25, 2026

**Tasks:**
1. Implement Progress Visualization (`src/components/Student/ProgressVisualization.jsx`)
   - Display grades by course as cards
   - Show grade letter (A+, A, A-, B+, etc.)
   - Display GPA for each course
   - Create progress bars showing percentage completion
   - Visual color coding for different grade ranges

2. Implement Charts (if using Chart.js)
   - GPA trend over time (line chart)
   - Grade distribution (bar chart)
   - Course performance comparison (radar chart)

3. Grade Calculation Logic
   - Calculate GPA from grades data
   - Determine letter grades from percentages
   - Aggregate course grades

4. Polish Visualizations
   - Responsive grid layout
   - Color scheme consistency
   - Clear legend and labels

**Files to Create/Modify:**
- ✅ `src/components/Student/ProgressVisualization.jsx`
- ✅ `src/data/grades.json` (ensure complete data)
- ✅ `src/App.css` (chart and progress styling)

---

### **Team Member 5: Admin Features**
**Deadline:** Feb 25, 2026

**Tasks:**
1. Implement Admin Dashboard (`src/components/Admin/Dashboard.jsx`)
   - Display statistics cards:
     - Total users
     - Total students
     - Total instructors
     - Active/total courses
   - Management action buttons
   - Recent activity section placeholder
   - Make buttons navigate to respective pages

2. Implement Course Builder (`src/components/Admin/CourseBuilder.jsx`)
   - Form fields: code, title, description, credits, instructor, capacity
   - Form validation
   - Submit button with success feedback
   - Form reset after submission

3. Implement Course Manager (`src/components/Admin/CourseManager.jsx`)
   - Display all courses in table
   - Show enrollment status
   - Toggle buttons (Enable/Disable course)
   - Edit button (navigates to course builder)
   - Visual status indicators

4. Admin UI Polish
   - Consistent styling between admin components
   - Clear visual hierarchy
   - Professional appearance

**Files to Create/Modify:**
- ✅ `src/components/Admin/Dashboard.jsx`
- ✅ `src/components/Admin/CourseBuilder.jsx`
- ✅ `src/components/Admin/CourseManager.jsx`
- ✅ `src/utils/dataLoader.js` (admin-specific functions)
- ✅ `src/App.css` (admin styling)

---

### **Team Member 6: Styling & Responsive Design**
**Deadline:** Feb 26, 2026

**Tasks:**
1. Complete CSS Implementation
   - Review and finalize all CSS files
   - Ensure consistent color scheme
   - Implement all hover states and transitions
   - Add mobile responsiveness

2. Test All Components
   - Desktop (1920px, 1440px, 1024px)
   - Tablet (768px)
   - Mobile (375px)
   - Verify touch-friendly button sizes
   - Check text readability

3. Accessibility Improvements
   - Alt text for images
   - Proper heading hierarchy
   - Color contrast compliance
   - Keyboard navigation

4. Polish & Bug Fixes
   - Fix any layout issues
   - Ensure smooth transitions
   - Optimize asset loading
   - Final visual review

**Files to Modify:**
- ✅ `src/App.css`
- ✅ `src/index.css`
- All component files (styling adjustments)

---

## 📦 Mock Data Reference

### users.json Content:
- 3 student accounts (USR001, USR002, USR003)
- 2 instructor accounts (INS001, INS002)
- 1 admin account (ADM001)

### courses.json Content:
- CS101 (active, 150/200 enrollment)
- CS301 (active, 80/100 enrollment)
- MATH201 (active, 120/150 enrollment)
- CS201 (inactive, for testing disabled state)

### assessments.json Content:
- 2 assignments for CS101
- 2 quizzes for CS301
- 1 assignment for MATH201
- Mix of open, upcoming, and closed statuses

### grades.json Content:
- Complete grades for all student/course combinations
- Sample scores for all assessments
- GPA calculations for each student

### courseStructure.json Content:
- 2 courses with module/topic hierarchies
- Realistic content organization

---

## 🔄 Development Workflow

### Daily Standup (Optional)
```
What did I complete yesterday?
What will I complete today?
Any blockers or help needed?
```

### Weekly Check-in
- Review completed components
- Address any issues
- Adjust timeline if needed
- Merge code from feature branches

### Before Deadline (Feb 26)
1. All features complete and tested
2. No console errors or warnings
3. Responsive design verified
4. Components properly styled
5. All navigation working
6. Git history clean and organized

---

## 🧪 Testing Checklist

### Functionality Testing
- [ ] Login/Signup works with all roles
- [ ] Navigation between pages smooth
- [ ] Data loads correctly from mock files
- [ ] All forms submit without errors
- [ ] Filters and sorting work correctly
- [ ] Charts and visualizations display properly

### Role-Based Testing
- [ ] Student sees correct pages
- [ ] Admin sees correct pages
- [ ] Unauthenticated users redirected to login
- [ ] Logout clears session properly

### Responsive Design Testing
- [ ] Desktop (1920px): All elements visible
- [ ] Tablet (768px): No horizontal scroll
- [ ] Mobile (375px): Touch-friendly, readable
- [ ] Images scale appropriately
- [ ] Navigation adaptable (hamburger menu if needed)

### Browser Testing
- Chrome/Edge
- Firefox
- Safari (if possible)
- Mobile browsers

---

## 📝 Code Review Checklist

Before merging code:
- [ ] Code follows naming conventions
- [ ] Components are reusable
- [ ] No console errors/warnings
- [ ] Comments added for complex logic
- [ ] CSS is organized and reusable
- [ ] No hardcoded values (use constants)
- [ ] Consistent with existing code style

---

## 🚀 Deployment Prep (Phase 2)

### Frontend Build
```bash
cd client
npm run build
```

Creates optimized production build in `/dist`

### Backend Setup (Phase 2)
```bash
cd server
npm install
cp .env.example .env
# Configure .env with MongoDB URI
npm run dev
```

---

## 📞 Troubleshooting

### "Module not found" error
```bash
# Reinstall dependencies
npm install

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Port already in use (5173)
```bash
# Specify different port in vite.config.js
server: {
  port: 5174,
  strictPort: false
}
```

### Data not loading
- Check file paths in `dataLoader.js`
- Verify JSON syntax (use jsonlint.com)
- Check browser console for import errors

### Styling issues
- Clear browser cache (Ctrl+Shift+Del)
- Check CSS specificity conflicts
- Use browser DevTools to inspect elements

---

## 🎓 Learning Resources

### React
- https://react.dev/learn
- https://www.youtube.com/watch?v=hQAHSlTtFmE (React basics)

### Vite
- https://vitejs.dev/guide/
- Fast HMR (Hot Module Replacement)

### CSS Grid/Flexbox
- https://css-tricks.com/snippets/css/complete-guide-grid/
- https://css-tricks.com/snippets/css/a-guide-to-flexbox/

### Git
- https://github.com/git-tips/tips
- https://www.atlassian.com/git/tutorials/

---

## ✅ Phase 1 Sign-Off Criteria

**All of the following must be true:**
1. ✅ Frontend runs without errors: `npm run dev`
2. ✅ All components display correctly
3. ✅ All navigation works (no broken links)
4. ✅ Student and Admin views separate and functional
5. ✅ Mock data loads into all components
6. ✅ Forms validate input properly
7. ✅ Charts and visualizations render
8. ✅ Responsive design works on desktop/tablet/mobile
9. ✅ Git repository has clean commit history
10. ✅ README and documentation complete
11. ✅ No console errors or warnings
12. ✅ Code follows project conventions

---

**Good luck with Phase 1! Remember: focus on functionality first, then polish styling. Communication with your team is key!** 🚀
