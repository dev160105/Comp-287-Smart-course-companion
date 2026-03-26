// src/components/Student/AssessmentList.jsx
import { useState, useEffect } from 'react';
import { loadAssessments, upsertStudentAssessment } from '../../utils/dataLoader';

export default function AssessmentList({ currentUser }) {
  const [assessments, setAssessments] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [score, setScore] = useState('');
  const [feedback, setFeedback] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadAssessments().then(setAssessments).catch(console.error);
  }, []);

  const filteredAssessments = filter === 'open' 
    ? assessments.filter(a => a.status === 'open')
    : filter === 'upcoming'
    ? assessments.filter(a => a.status === 'upcoming')
    : filter === 'pending'
    ? assessments.filter(a => (a.studentStatus || 'pending') === 'pending')
    : filter === 'completed'
    ? assessments.filter(a => a.studentStatus === 'completed')
    : assessments;

  const typeColors = {
    assignment: '#2563eb',
    quiz: '#10b981',
    exam: '#ef4444',
    project: '#f59e0b',
  };

  const updateStudentStatus = async (assessment, nextStatus) => {
    setMessage('');
    try {
      await upsertStudentAssessment(assessment.id, {
        status: nextStatus,
        score: nextStatus === 'completed' && score !== '' ? Number(score) : null,
        feedback,
      });

      setAssessments((prev) => prev.map((a) =>
        a.id === assessment.id
          ? {
              ...a,
              studentStatus: nextStatus,
              studentScore: nextStatus === 'completed' && score !== '' ? Number(score) : null,
              studentFeedback: feedback,
            }
          : a
      ));
      setMessage(`Assessment marked as ${nextStatus}`);
      setSelectedAssessment(null);
      setScore('');
      setFeedback('');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Could not update assessment status');
    }
  };

  return (
    <div className="assessment-list">
      <h1>My Assessments</h1>
      {message && <p className="info-text">{message}</p>}
      
      <div className="filter-controls">
        <label htmlFor="status-filter">Filter:</label>
        <select id="status-filter" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="open">Open</option>
          <option value="upcoming">Upcoming</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="assessments-list">
        {filteredAssessments.length > 0 ? (
          filteredAssessments.map(assessment => (
            <div key={assessment.id} className="assessment-card">
              <div className="assessment-header">
                <h3>{assessment.title}</h3>
                <span className={`status-badge ${assessment.status}`}>{assessment.status}</span>
              </div>
              <p><strong>Type:</strong> {assessment.type}</p>
              <p><strong>Course:</strong> {assessment.courseCode || assessment.courseId}</p>
              <p><strong>Due Date:</strong> {assessment.dueDate}</p>
              <p><strong>Max Points:</strong> {assessment.maxPoints}</p>
              <p><strong>My Status:</strong> {assessment.studentStatus || 'pending'}</p>
              <button className="btn-primary" onClick={() => setSelectedAssessment(assessment)}>View Assessment</button>
            </div>
          ))
        ) : (
          <p>No assessments match your filter.</p>
        )}
      </div>

      {selectedAssessment && (
        <div className="assessment-modal-overlay" onClick={() => setSelectedAssessment(null)}>
          <div className="assessment-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{ borderLeft: `5px solid ${typeColors[selectedAssessment.type] || '#2563eb'}` }}>
              <h2>{selectedAssessment.title}</h2>
              <button className="modal-close-btn" onClick={() => setSelectedAssessment(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="modal-info-grid">
                <div className="modal-info-item">
                  <span className="modal-label">Type</span>
                  <span className="modal-value" style={{ textTransform: 'capitalize' }}>{selectedAssessment.type}</span>
                </div>
                <div className="modal-info-item">
                  <span className="modal-label">Course</span>
                  <span className="modal-value">{selectedAssessment.courseCode || selectedAssessment.courseId}</span>
                </div>
                <div className="modal-info-item">
                  <span className="modal-label">Due Date</span>
                  <span className="modal-value">{selectedAssessment.dueDate}</span>
                </div>
                <div className="modal-info-item">
                  <span className="modal-label">Max Points</span>
                  <span className="modal-value">{selectedAssessment.maxPoints}</span>
                </div>
                <div className="modal-info-item">
                  <span className="modal-label">Status</span>
                  <span className="modal-value status-badge">{selectedAssessment.status}</span>
                </div>
                <div className="modal-info-item">
                  <span className="modal-label">My Progress</span>
                  <span className="modal-value">{selectedAssessment.studentStatus || 'pending'}</span>
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label htmlFor="earned-score">Earned Marks (optional):</label>
                <input
                  id="earned-score"
                  type="number"
                  min="0"
                  max={selectedAssessment.maxPoints}
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  placeholder={`0 - ${selectedAssessment.maxPoints}`}
                />
              </div>

              <div className="form-group">
                <label htmlFor="assessment-feedback">Notes:</label>
                <textarea
                  id="assessment-feedback"
                  rows="3"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Optional notes for this assessment"
                />
              </div>

              <div className="modal-description">
                <span className="modal-label">Description</span>
                <p>{selectedAssessment.description || 'No description available.'}</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-primary" onClick={() => updateStudentStatus(selectedAssessment, 'completed')}>Mark Completed</button>
              <button className="btn-secondary" onClick={() => updateStudentStatus(selectedAssessment, 'pending')}>Mark Pending</button>
              <button className="btn-secondary" onClick={() => setSelectedAssessment(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
