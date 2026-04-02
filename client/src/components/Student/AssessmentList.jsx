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
    lab: '#8b5cf6',
  };

  const openModal = (assessment) => {
    setSelectedAssessment(assessment);
    setScore(assessment.studentScore !== null && assessment.studentScore !== undefined ? assessment.studentScore : '');
    setFeedback(assessment.studentFeedback || '');
    setMessage('');
  };

  const updateStudentStatus = async (assessment, nextStatus) => {
    setMessage('');
    try {
      await upsertStudentAssessment(assessment.id, {
        status: nextStatus,
        score: score !== '' ? Number(score) : null,
        feedback,
      });

      setAssessments((prev) => prev.map((a) =>
        a.id === assessment.id
          ? {
              ...a,
              studentStatus: nextStatus,
              studentScore: score !== '' ? Number(score) : a.studentScore,
              studentFeedback: feedback,
            }
          : a
      ));
      setMessage(`✓ Assessment marked as ${nextStatus}`);
      setSelectedAssessment(null);
      setScore('');
      setFeedback('');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Could not update assessment status');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>My Assessments</h1>
        <p className="page-subtitle">Track and manage your assessment progress</p>
      </div>

      {message && <div className="alert alert-success">{message}</div>}

      <div className="filter-bar">
        <span className="filter-label">Filter:</span>
        <div className="filter-tabs">
          {['all', 'open', 'upcoming', 'pending', 'completed'].map(f => (
            <button
              key={f}
              className={`filter-tab ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="cards-grid">
        {filteredAssessments.length > 0 ? (
          filteredAssessments.map(assessment => (
            <div
              key={assessment.id}
              className="ac-card"
              style={{ borderLeftColor: typeColors[assessment.type] || '#2563eb' }}
            >
              <div className="ac-header">
                <h3 className="ac-title">{assessment.title}</h3>
                <span className={`badge badge-${assessment.status}`}>{assessment.status}</span>
              </div>

              <div className="ac-meta">
                <div className="ac-meta-item">
                  <span className="ac-meta-label">Course</span>
                  <span className="ac-meta-value">{assessment.courseCode || assessment.courseId}</span>
                </div>
                <div className="ac-meta-item">
                  <span className="ac-meta-label">Type</span>
                  <span className="ac-meta-value" style={{ textTransform: 'capitalize' }}>{assessment.type}</span>
                </div>
                <div className="ac-meta-item">
                  <span className="ac-meta-label">Due</span>
                  <span className="ac-meta-value">{assessment.dueDate || 'N/A'}</span>
                </div>
                <div className="ac-meta-item">
                  <span className="ac-meta-label">Score</span>
                  <span className="ac-meta-value ac-score">
                    {assessment.studentScore !== null && assessment.studentScore !== undefined
                      ? `${assessment.studentScore} / ${assessment.maxPoints}`
                      : `— / ${assessment.maxPoints}`}
                  </span>
                </div>
              </div>

              <div className="ac-footer">
                <span className={`badge badge-progress-${assessment.studentStatus || 'pending'}`}>
                  {assessment.studentStatus || 'pending'}
                </span>
                <button className="btn-sm btn-primary" onClick={() => openModal(assessment)}>
                  Update
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">No assessments match your filter.</div>
        )}
      </div>

      {selectedAssessment && (
        <div className="modal-overlay" onClick={() => setSelectedAssessment(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-top" style={{ borderLeftColor: typeColors[selectedAssessment.type] || '#2563eb' }}>
              <h2>{selectedAssessment.title}</h2>
              <button className="modal-close" onClick={() => setSelectedAssessment(null)}>✕</button>
            </div>

            <div className="modal-body-content">
              <div className="info-grid">
                <div className="info-cell">
                  <span className="info-label">TYPE</span>
                  <span className="info-value" style={{ textTransform: 'capitalize' }}>{selectedAssessment.type}</span>
                </div>
                <div className="info-cell">
                  <span className="info-label">COURSE</span>
                  <span className="info-value">{selectedAssessment.courseCode || selectedAssessment.courseId}</span>
                </div>
                <div className="info-cell">
                  <span className="info-label">DUE DATE</span>
                  <span className="info-value">{selectedAssessment.dueDate || 'N/A'}</span>
                </div>
                <div className="info-cell">
                  <span className="info-label">MAX POINTS</span>
                  <span className="info-value">{selectedAssessment.maxPoints}</span>
                </div>
                <div className="info-cell">
                  <span className="info-label">STATUS</span>
                  <span className={`badge badge-${selectedAssessment.status}`}>{selectedAssessment.status}</span>
                </div>
                <div className="info-cell">
                  <span className="info-label">MY PROGRESS</span>
                  <span className={`badge badge-progress-${selectedAssessment.studentStatus || 'pending'}`}>
                    {selectedAssessment.studentStatus || 'pending'}
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label>Earned Marks (optional)</label>
                <input
                  type="number"
                  min="0"
                  max={selectedAssessment.maxPoints}
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  placeholder={`0 – ${selectedAssessment.maxPoints}`}
                />
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  rows="3"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Optional notes for this assessment"
                />
              </div>

              {selectedAssessment.description && (
                <div className="modal-desc">
                  <span className="info-label">DESCRIPTION</span>
                  <p>{selectedAssessment.description}</p>
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button className="btn btn-success" onClick={() => updateStudentStatus(selectedAssessment, 'completed')}>
                Mark Completed
              </button>
              <button className="btn btn-secondary" onClick={() => updateStudentStatus(selectedAssessment, 'pending')}>
                Mark Pending
              </button>
              <button className="btn btn-ghost" onClick={() => setSelectedAssessment(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
