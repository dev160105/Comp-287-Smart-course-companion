// src/components/Student/GradeEntryForm.jsx
import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { loadGrades } from '../../utils/dataLoader';

export default function GradeEntryForm({ currentUser }) {
  const [coursesData, setCoursesData] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await loadGrades(currentUser.id);
        setCoursesData(data.courses || []);
      } catch (err) {
        console.error('Failed to load grades:', err);
      }
    };
    fetchData();
  }, [currentUser]);

  const selectedCourse = coursesData.find(c => c.courseId === selectedCourseId);

  const handleScoreUpdate = async (assessmentId, score, feedback) => {
    setMessage('');
    try {
      await api.post(`/api/grades/assessment/${assessmentId}/status`, {
        status: score !== '' ? 'completed' : 'pending',
        score: score === '' ? null : Number(score),
        feedback: feedback || '',
      });
      setMessage('Grade updated successfully!');
      // Refresh data
      const data = await loadGrades(currentUser.id);
      setCoursesData(data.courses || []);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update grade');
    }
  };

  return (
    <div className="grade-entry-form">
      <h1>Enter Grades</h1>
      <p>Track your progress by entering earned marks for your assessments.</p>
      {message && <p className="info-text">{message}</p>}

      <div className="form-group">
        <label htmlFor="ge-course">Select Course:</label>
        <select
          id="ge-course"
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
        >
          <option value="">-- Choose a course --</option>
          {coursesData.map(c => (
            <option key={c.courseId} value={c.courseId}>
              {c.code} - {c.title} (Current: {c.currentGrade || 'N/A'})
            </option>
          ))}
        </select>
      </div>

      {selectedCourse && (
        <div style={{ marginTop: '1.5rem' }}>
          <h2>{selectedCourse.code} - {selectedCourse.title}</h2>
          <p>
            <strong>Current Average:</strong> {selectedCourse.average || 0}% ({selectedCourse.currentGrade || 'N/A'}) |{' '}
            <strong>Progress:</strong> {selectedCourse.completedAssessments}/{selectedCourse.totalAssessments} completed
          </p>

          {selectedCourse.assessments && selectedCourse.assessments.length > 0 ? (
            <table className="course-management-table">
              <thead>
                <tr>
                  <th>Assessment</th>
                  <th>Type</th>
                  <th>Due Date</th>
                  <th>Score</th>
                  <th>Max Points</th>
                  <th>Percentage</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {selectedCourse.assessments.map(a => (
                  <GradeEntryRow
                    key={a.assessmentId}
                    assessment={a}
                    onSave={handleScoreUpdate}
                  />
                ))}
              </tbody>
            </table>
          ) : (
            <p>No assessments for this course yet.</p>
          )}
        </div>
      )}

      {!selectedCourseId && coursesData.length > 0 && (
        <div style={{ marginTop: '1.5rem' }}>
          <h2>Course Summary</h2>
          <div className="courses-grid">
            {coursesData.map(c => (
              <div key={c.courseId} className="course-card" onClick={() => setSelectedCourseId(c.courseId)} style={{ cursor: 'pointer' }}>
                <h3>{c.code}</h3>
                <p><strong>Title:</strong> {c.title}</p>
                <p><strong>Grade:</strong> {c.currentGrade || 'N/A'} ({c.average || 0}%)</p>
                <p><strong>Progress:</strong> {c.completedAssessments}/{c.totalAssessments}</p>
                <div className="progress-bar-container" style={{ marginTop: '0.5rem' }}>
                  <div className="progress-bar" style={{ width: `${c.progressPercent || 0}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function GradeEntryRow({ assessment, onSave }) {
  const [score, setScore] = useState(assessment.score != null ? String(assessment.score) : '');
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setScore(assessment.score != null ? String(assessment.score) : '');
  }, [assessment]);

  const handleSave = () => {
    onSave(assessment.assessmentId, score, '');
    setEditing(false);
  };

  return (
    <tr>
      <td>{assessment.title}</td>
      <td style={{ textTransform: 'capitalize' }}>{assessment.type}</td>
      <td>{assessment.dueDate}</td>
      <td>
        {editing ? (
          <input
            type="number"
            min="0"
            max={assessment.maxPoints}
            value={score}
            onChange={(e) => setScore(e.target.value)}
            style={{ width: '80px' }}
          />
        ) : (
          <span>{assessment.score != null ? assessment.score : '-'}</span>
        )}
      </td>
      <td>{assessment.maxPoints}</td>
      <td>{assessment.percentage != null ? `${assessment.percentage}%` : '-'}</td>
      <td>
        <span className={`status-badge ${assessment.status}`}>
          {assessment.status}
        </span>
      </td>
      <td>
        {editing ? (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn-primary" onClick={handleSave}>Save</button>
            <button className="btn-secondary" onClick={() => { setEditing(false); setScore(assessment.score != null ? String(assessment.score) : ''); }}>Cancel</button>
          </div>
        ) : (
          <button className="btn-secondary" onClick={() => setEditing(true)}>
            {assessment.score != null ? 'Edit' : 'Enter Score'}
          </button>
        )}
      </td>
    </tr>
  );
}
