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
import { getCurrentUser, logout, isStudent, isAdmin } from './utils/auth';
import './App.css';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('login');
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setCurrentPage('dashboard');
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setCurrentPage('dashboard');
  };

    const toggleDarkMode = (e) => {
    document.body.classList.toggle('dark-theme');
    e.target.innerText = document.body.classList.contains('dark-theme') ? '☀️' : '🌙';
  };

const courseGrades = [
  { name: 'Introduction to Computer Science', score: 88 },
  { name: 'Data Structures and Algorithms', score: 76 },
  { name: 'Calculus II', score: 92 },
  { name: 'Web Development Fundamentals', score: 65 }
];

  const handleSignupSuccess = (user) => {
    setCurrentUser(user);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
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
              <button onClick={toggleDarkMode} className="nav-button"> 🌙 </button>
              
            </>
          )}
          {isAdmin(currentUser) && (
            <>
              <button onClick={() => handleNavigate('dashboard')} className="nav-link">Dashboard</button>
              <button onClick={() => handleNavigate('course-manager')} className="nav-link">Manage Courses</button>
              <button onClick={() => handleNavigate('course-builder')} className="nav-link">Build Course</button>
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
            {currentPage === 'dashboard' && <StudentDashboard currentUser={currentUser} />}
            {currentPage === 'courses' && ( <> <CourseList onSelectCourse={() => {}} /> </>
            )}
            {currentPage === 'assessments' && <AssessmentList currentUser={currentUser} />}
            {currentPage === 'progress' && (
              <>
                <CircularProgress currentUser={currentUser} grades={[]} />
                <div className="grade-chart-wrapper">
                  <h2 className="chart-title">Course Performance Overview</h2>
                  <div className="bar-chart">
                    {courseGrades.map((course, index) => (
                      <div key={index} className="bar-container">
                        <div className="grade-bar-wrapper">
                          <div 
                            className="grade-bar" style={{ height: `${course.score}%` }} >
                            <span className="bar-score-text">{course.score}/100</span>
                          </div>
                        </div>
                        <div className="bar-info">
                          <span className="course-name-label">{course.name}</span>
                          <span className="course-percentage">({course.score}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </>
        )}  
        
        {isAdmin(currentUser) && ( 
          <>
            {currentPage === 'dashboard' && <AdminDashboard currentUser={currentUser} />}
            {currentPage === 'course-manager' && <CourseManager onToggleCourse={() => {}} />}
            {currentPage === 'course-builder' && <CourseBuilder onSaveCourse={() => {}} />}
          </>
        )}
      </main>
    </div>
  );
}
