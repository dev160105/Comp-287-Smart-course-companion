// src/App.jsx
import { useState, useEffect } from 'react';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import StudentDashboard from './components/Student/Dashboard';
import AdminDashboard from './components/Admin/Dashboard';
import CircularProgress from './components/Student/ProgressVisualization';
import CourseList from './components/Student/CourseList';
import AssessmentList from './components/Student/AssessmentList';
import CourseManager from './components/Admin/CourseManager';
import CourseBuilder from './components/Admin/CourseBuilder';
import CourseDetails from './components/Student/CourseDetails';
import { getCurrentUser, logout, isStudent, isAdmin, isInstructor } from './utils/auth';
import { loadCourses } from './utils/dataLoader';
import api from './utils/api';
import './App.css';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('login');
  const [showSignup, setShowSignup] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [allCourses, setAllCourses] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  // Load courses from backend whenever a user is logged in
  const fetchCourses = async () => {
    try {
      const courses = await loadCourses();
      setAllCourses(courses);
    } catch {
      // Backend may not be available; keep empty list
    }
  };

  const handleSaveCourse = async (formData) => {
    try {
      await api.post('/api/courses', {
        code: formData.code,
        title: formData.title,
        description: formData.description,
        credits: Number(formData.credits),
        maxCapacity: Number(formData.maxCapacity),
        semester: formData.semester || 'Spring 2026',
        startDate: formData.startDate || '',
        endDate: formData.endDate || '',
        meetingTime: formData.meetingTime || 'TBD',
        location: formData.location || 'TBD',
      });
      await fetchCourses();
    } catch (err) {
      console.error('Failed to save course:', err);
    }
    handleNavigate('course-manager');
  };

  const handleToggleCourse = async (courseId) => {
    const course = allCourses.find(c => c._id === courseId || c.id === courseId);
    if (!course) return;
    try {
      await api.put(`/api/courses/${course._id || courseId}`, { isActive: !course.isActive });
      await fetchCourses();
    } catch (err) {
      // Optimistic update fallback
      setAllCourses(prev =>
        prev.map(c => (c._id === courseId || c.id === courseId) ? { ...c, isActive: !c.isActive } : c)
      );
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      await api.delete(`/api/courses/${courseId}`);
      await fetchCourses();
    } catch (err) {
      console.error('Failed to delete course:', err);
    }
  };

  useEffect(() => {
    // Check if user is already logged in (persisted token)
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setCurrentPage('dashboard');
    }
  }, []);

  useEffect(() => {
    if (currentUser) fetchCourses();
  }, [currentUser]);

  useEffect(() => {
    document.body.classList.toggle('dark-theme', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setCurrentPage('dashboard');
  };

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  const handleSignupSuccess = (user) => {
    setCurrentUser(user);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    setAllCourses([]);
    setCurrentPage('login');
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  // Render authentication pages
  if (!currentUser) {
    return (
      <div className="app-container auth-container">
        {showSignup ? (
          <div>
            <Signup onSignupSuccess={handleSignupSuccess} />
            <p className="auth-toggle">
              Already have an account?
              <button onClick={() => setShowSignup(false)} className="link-button">
                Login here
              </button>
            </p>
          </div>
        ) : (
          <div>
            <Login onLoginSuccess={handleLoginSuccess} />
            <p className="auth-toggle">
              Don't have an account?
              <button onClick={() => setShowSignup(true)} className="link-button">
                Sign up here
              </button>
            </p>
          </div>
        )}
      </div>
    );
  }

  // Render application pages
  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="nav-brand">Smart Course Companion</div>
        <div className="nav-center">
          {isStudent(currentUser) && (
            <>
              <button onClick={() => handleNavigate('dashboard')} className="nav-link">Dashboard</button>
              <button onClick={() => handleNavigate('courses')} className="nav-link">Courses</button>
              <button onClick={() => handleNavigate('assessments')} className="nav-link">Assessments</button>
              <button onClick={() => handleNavigate('progress')} className="nav-link">Progress</button>
              <button onClick={toggleDarkMode} className="nav-button">{isDarkMode ? 'Light' : 'Dark'}</button>
            </>
          )}
          {(isAdmin(currentUser) || isInstructor(currentUser)) && (
            <>
              <button onClick={() => handleNavigate('dashboard')} className="nav-link">Dashboard</button>
              <button onClick={() => handleNavigate('course-manager')} className="nav-link">Manage Courses</button>
              <button onClick={() => handleNavigate('course-builder')} className="nav-link">Build Course</button>
              <button onClick={toggleDarkMode} className="nav-button">{isDarkMode ? 'Light' : 'Dark'}</button>
            </>
          )}
        </div>
        <div className="nav-user">
          <span className="user-info">{currentUser.name} ({currentUser.role})</span>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </nav>

      <main className="main-content">
        {isStudent(currentUser) && (
          <>
            {currentPage === 'dashboard' && <StudentDashboard currentUser={currentUser} onSelectCourse={(id) => { setSelectedCourseId(id); setCurrentPage('course-details'); }} />}
            {currentPage === 'courses' && <CourseList courses={allCourses} onRefresh={fetchCourses} onSelectCourse={(id) => { setSelectedCourseId(id); setCurrentPage('course-details'); }} />}
            {currentPage === 'course-details' && <CourseDetails course={allCourses.find(c => (c._id || c.id) === selectedCourseId)} onBack={() => setCurrentPage('courses')} />}
            {currentPage === 'assessments' && <AssessmentList currentUser={currentUser} />}
            {currentPage === 'progress' && (
              <CircularProgress
                currentUser={currentUser}
                courses={allCourses}
              />
            )}
          </>
        )}

        {(isAdmin(currentUser) || isInstructor(currentUser)) && (
          <>
            {currentPage === 'dashboard' && <AdminDashboard currentUser={currentUser} courses={allCourses} onNavigate={handleNavigate} />}
            {currentPage === 'course-manager' && <CourseManager courses={allCourses} onToggleCourse={handleToggleCourse} onDeleteCourse={handleDeleteCourse} />}
            {currentPage === 'course-builder' && <CourseBuilder onSaveCourse={handleSaveCourse} />}
          </>
        )}
      </main>
    </div>
  );
}
