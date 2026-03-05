// src/components/Student/Dashboard.jsx
import { useState, useEffect } from 'react';
import { loadCourses, loadGrades, loadAssessments } from '../../utils/dataLoader';

export default function StudentDashboard({ currentUser }) {
  const [courses, setCourses] = useState([]);
  const [grades, setGrades] = useState([]);
  const [upcomingAssessments, setUpcomingAssessments] = useState([]);

  useEffect(() => {
  // Load mock data
  const allCourses = loadCourses();
  const allGrades = loadGrades();
  const allAssessments = loadAssessments();

  // get student grades once
  const myGrades = allGrades.filter(g => g.studentId === currentUser.id);
  setGrades(myGrades);

  // enrolled courses based on grades
  const myCourseIds = new Set(myGrades.map(g => g.courseId));
  const enrolledCourses = allCourses.filter(course => myCourseIds.has(course.id));
  setCourses(enrolledCourses);

  // upcoming assessments
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = allAssessments
    .filter(a => new Date(a.dueDate + "T00:00:00") >= today)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  setUpcomingAssessments(upcoming);
}, [currentUser]);
  const calculateGPA = () => {
    if (grades.length === 0) return 0;
    const total = grades.reduce((sum, g) => {
      const gradeMap = { 'A+': 4.0, 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C': 2.0, 'F': 0 };
      return sum + (gradeMap[g.currentGrade] || 0);
    }, 0);
    return (total / grades.length).toFixed(2);
  };

  const calculateBreakdown = () => {
    const breakdown = { A: 0, B: 0, C: 0, F: 0 };

    grades.forEach(g => {
      const letter = g.currentGrade;
      if (!letter) return;

      if (letter.startsWith('A')) breakdown.A++;
      else if (letter.startsWith('B')) breakdown.B++;
      else if (letter.startsWith('C')) breakdown.C++;
      else breakdown.F++;
    });

    return breakdown;
  };

  const breakdown = calculateBreakdown();

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
        <div style={{ marginTop: '10px', fontSize: '14px' }}>
            <strong>Breakdown:</strong>
            <div style={{ display: 'flex', gap: '10px', marginTop: '5px', flexWrap: 'wrap' }}>
              <span>A: {breakdown.A}</span>
              <span>B: {breakdown.B}</span>
              <span>C: {breakdown.C}</span>
              <span>F: {breakdown.F}</span>
            </div>
          </div>
        </div>
        <div className="summary-card">
          <h3>Pending Assessments</h3>
         <p className="stat">{upcomingAssessments.length}</p>
        </div>
      </div>

      <section className="assessments-overview">
        <h2>Upcoming Assessments</h2>

        {upcomingAssessments.length > 0 ? (
          <div className="assessments-list">
            {upcomingAssessments.map(a => (
              <div key={a.id} className="assessment-card">
                <h3>{a.title}</h3>
                <p><strong>Course:</strong> {a.courseId}</p>
                <p><strong>Type:</strong> {a.type}</p>
                <p><strong>Due:</strong> {a.dueDate}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No upcoming assessments!!!</p>
        )}
      </section>

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
