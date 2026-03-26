// src/components/Student/Dashboard.jsx
import { useState, useEffect } from 'react';
import {
  loadGrades,
  triggerReminderEmail,
  downloadGradesCsv,
  downloadGradesPdf,
} from '../../utils/dataLoader';

export default function StudentDashboard({ currentUser, onSelectCourse }) {
  const [courses, setCourses] = useState([]);
  const [overallGPA, setOverallGPA] = useState(0);
  const [upcomingAssessments, setUpcomingAssessments] = useState([]);
  const [info, setInfo] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Grades endpoint returns { courses, overallGPA, upcomingAssessments } grouped by course
        const gradesData = await loadGrades(currentUser.id);
        const enrolledCourses = gradesData.courses || [];
        setCourses(enrolledCourses);
        setOverallGPA(gradesData.overallGPA || 0);
        setUpcomingAssessments((gradesData.upcomingAssessments || []).slice(0, 5));
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      }
    };
    fetchData();
  }, [currentUser]);

  const calculateBreakdown = () => {
    const breakdown = { A: 0, B: 0, C: 0, F: 0 };
    courses.forEach(c => {
      const letter = c.currentGrade;
      if (!letter) return;
      if (letter.startsWith('A')) breakdown.A++;
      else if (letter.startsWith('B')) breakdown.B++;
      else if (letter.startsWith('C')) breakdown.C++;
      else breakdown.F++;
    });
    return breakdown;
  };

  const breakdown = calculateBreakdown();

  const handleSendReminder = async () => {
    try {
      const result = await triggerReminderEmail(currentUser.id);
      setInfo(result.message || 'Reminder request completed');
    } catch (err) {
      setInfo(err.response?.data?.message || 'Could not send reminder');
    }
  };

  const handleDownload = async (kind) => {
    try {
      if (kind === 'csv') await downloadGradesCsv(currentUser.id);
      if (kind === 'pdf') await downloadGradesPdf(currentUser.id);
      setInfo(`Downloaded ${kind.toUpperCase()} export`);
    } catch (err) {
      setInfo(err.response?.data?.message || `Could not download ${kind.toUpperCase()}`);
    }
  };

  return (
    <div className="student-dashboard">
      <h1>Welcome, {currentUser.name}!</h1>
      {info && <p className="info-text">{info}</p>}

      <div className="action-buttons" style={{ marginBottom: '1rem' }}>
        <button className="btn-primary" onClick={() => handleDownload('csv')}>Export CSV</button>
        <button className="btn-primary" onClick={() => handleDownload('pdf')}>Export PDF</button>
        <button className="btn-secondary" onClick={handleSendReminder}>Email Reminder</button>
      </div>

      <div className="dashboard-summary">
        <div className="summary-card">
          <h3>Enrolled Courses</h3>
          <p className="stat">{courses.length}</p>
        </div>
        <div className="summary-card">
          <h3>Current GPA</h3>
          <p className="stat">{overallGPA.toFixed(2)}</p>
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
              <div key={a.assessmentId} className="assessment-card">
                <h3>{a.title}</h3>
                <p><strong>Course:</strong> {a.courseCode} - {a.courseTitle}</p>
                <p><strong>Type:</strong> {a.type}</p>
                <p><strong>Due:</strong> {a.dueDate}</p>
                <p><strong>Status:</strong> {a.status}</p>
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
              <div key={course.courseId} className="course-card">
                <h3>{course.title}</h3>
                <p><strong>Code:</strong> {course.code}</p>
                <p><strong>Grade:</strong> {course.currentGrade || 'N/A'}</p>
                <p><strong>Credits:</strong> {course.credits}</p>
                <button className="btn-secondary" onClick={() => onSelectCourse && onSelectCourse(course.courseId)}>View Course</button>
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
