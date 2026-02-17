// src/components/Student/Dashboard.jsx
import { useState, useEffect } from 'react';
import { loadCourses, loadGrades } from '../../utils/dataLoader';

export default function StudentDashboard({ currentUser }) {
  const [courses, setCourses] = useState([]);
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    // Load mock data
    const allCourses = loadCourses();
    const allGrades = loadGrades();
    
    // Filter courses enrolled by this student
    const enrolledCourses = allCourses.filter(course => 
      loadCourses().includes(course.id)
    );
    
    setCourses(enrolledCourses);
    setGrades(allGrades.filter(g => g.studentId === currentUser.id));
  }, [currentUser]);

  const calculateGPA = () => {
    if (grades.length === 0) return 0;
    const total = grades.reduce((sum, g) => {
      const gradeMap = { 'A+': 4.0, 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C': 2.0, 'F': 0 };
      return sum + (gradeMap[g.currentGrade] || 0);
    }, 0);
    return (total / grades.length).toFixed(2);
  };

  return (
    <div className="student-dashboard">
      <h1>Welcome, {currentUser.name}!</h1>
      
      <div className="dashboard-summary">
        <div className="summary-card">
          <h3>Enrolled Courses</h3>
          <p className="stat">{courses.length}</p>
        </div>
        <div className="summary-card">
          <h3>Current GPA</h3>
          <p className="stat">{calculateGPA()}</p>
        </div>
        <div className="summary-card">
          <h3>Pending Assessments</h3>
          <p className="stat">5</p>
        </div>
      </div>

      <section className="courses-overview">
        <h2>Your Courses</h2>
        <div className="courses-grid">
          {courses.length > 0 ? (
            courses.map(course => (
              <div key={course.id} className="course-card">
                <h3>{course.title}</h3>
                <p><strong>Code:</strong> {course.code}</p>
                <p><strong>Instructor:</strong> {course.instructor}</p>
                <p><strong>Credits:</strong> {course.credits}</p>
                <button className="btn-secondary">View Course</button>
              </div>
            ))
          ) : (
            <p>No courses enrolled yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
