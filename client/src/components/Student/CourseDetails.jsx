// src/components/Student/CourseDetails.jsx
import { useState, useEffect } from 'react';
import { getAssessmentsByCourse } from '../../utils/dataLoader';
import api from '../../utils/api';

export default function CourseDetails({ course, onBack, currentUser }) {
  const [assessments, setAssessments] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (course) {
      const id = course._id || course.id;
      getAssessmentsByCourse(id).then(setAssessments).catch(console.error);
    }
  }, [course]);

  const handleScoreUpdate = async (assessmentId, score) => {
    setMessage('');
    try {
      await api.post(`/api/grades/assessment/${assessmentId}/status`, {
        status: score !== '' ? 'completed' : 'pending',
        score: score === '' ? null : Number(score),
      });
      setMessage('Score updated!');
      // Refresh
      const id = course._id || course.id;
      const updated = await getAssessmentsByCourse(id);
      setAssessments(updated);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update score');
    }
  };

  if (!course) return <div>Course not found.</div>;

  return (
    <div className="course-details">
      {onBack && (
        <button className="btn-back" onClick={onBack}>← Back</button>
      )}
      <h1>{course.title}</h1>
      {message && <p className="info-text">{message}</p>}

      <div className="course-info">
        <div className="info-grid">
          <div className="info-item">
            <strong>Course Code:</strong> {course.code}
          </div>
          <div className="info-item">
            <strong>Instructor:</strong> {course.instructor}
          </div>
          <div className="info-item">
            <strong>Credits:</strong> {course.credits}
          </div>
          <div className="info-item">
            <strong>Semester:</strong> {course.semester || 'N/A'}
          </div>
          <div className="info-item">
            <strong>Meeting Time:</strong> {course.meetingTime || 'TBD'}
          </div>
          <div className="info-item">
            <strong>Location:</strong> {course.location || 'TBD'}
          </div>
          <div className="info-item">
            <strong>Enrollment:</strong> {course.enrollmentCount}/{course.maxCapacity}
          </div>
          <div className="info-item">
            <strong>Status:</strong> {course.isActive ? 'Active' : 'Inactive'}
          </div>
        </div>
      </div>

      <div className="course-description">
        <h2>Description</h2>
        <p>{course.description || 'No description available.'}</p>
      </div>

      <div className="course-assessments">
        <h2>Assessments ({assessments.length})</h2>
        {assessments.length > 0 ? (
          <table className="course-management-table">
            <thead>
              <tr>
                <th>Assessment</th>
                <th>Type</th>
                <th>Due Date</th>
                <th>Max Points</th>
                <th>My Score</th>
                <th>My Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {assessments.map(assessment => (
                <AssessmentRow
                  key={assessment._id || assessment.id}
                  assessment={assessment}
                  onSave={handleScoreUpdate}
                />
              ))}
            </tbody>
          </table>
        ) : (
          <p>No assessments available for this course.</p>
        )}
      </div>
    </div>
  );
}

function AssessmentRow({ assessment, onSave }) {
  const [score, setScore] = useState(assessment.studentScore != null ? String(assessment.studentScore) : '');
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setScore(assessment.studentScore != null ? String(assessment.studentScore) : '');
  }, [assessment]);

  const handleSave = () => {
    onSave(assessment._id || assessment.id, score);
    setEditing(false);
  };

  return (
    <tr>
      <td><strong>{assessment.title}</strong></td>
      <td style={{ textTransform: 'capitalize' }}>{assessment.type}</td>
      <td>{assessment.dueDate}</td>
      <td>{assessment.maxPoints}</td>
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
          <span>{assessment.studentScore != null ? `${assessment.studentScore}/${assessment.maxPoints}` : 'Not entered'}</span>
        )}
      </td>
      <td>
        <span className={`status-badge ${assessment.studentStatus || 'pending'}`}>
          {assessment.studentStatus || 'pending'}
        </span>
      </td>
      <td>
        {editing ? (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn-primary" onClick={handleSave}>Save</button>
            <button className="btn-secondary" onClick={() => { setEditing(false); setScore(assessment.studentScore != null ? String(assessment.studentScore) : ''); }}>Cancel</button>
          </div>
        ) : (
          <button className="btn-secondary" onClick={() => setEditing(true)}>
            {assessment.studentScore != null ? 'Edit Score' : 'Enter Score'}
          </button>
        )}
      </td>
    </tr>
  );
}
