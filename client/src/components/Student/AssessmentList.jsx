// src/components/Student/AssessmentList.jsx
import { useState, useEffect } from 'react';
import { loadAssessments } from '../../utils/dataLoader';

export default function AssessmentList({ currentUser }) {
  const [assessments, setAssessments] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const allAssessments = loadAssessments();
    setAssessments(allAssessments);
  }, []);

  const filteredAssessments = filter === 'open' 
    ? assessments.filter(a => a.status === 'open')
    : filter === 'upcoming'
    ? assessments.filter(a => a.status === 'upcoming')
    : assessments;

  return (
    <div className="assessment-list">
      <h1>My Assessments</h1>
      
      <div className="filter-controls">
        <label htmlFor="status-filter">Filter:</label>
        <select id="status-filter" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="open">Open</option>
          <option value="upcoming">Upcoming</option>
        </select>
      </div>

      <div className="assessments-list">
        {filteredAssessments.length > 0 ? (
          filteredAssessments.map(assessment => (
            <div key={assessment.id} className="assessment-card">
              <div className="assessment-header">
                <h3>{assessment.title}</h3>
                <span className="status-badge">{assessment.status}</span>
              </div>
              <p><strong>Type:</strong> {assessment.type}</p>
              <p><strong>Course:</strong> {assessment.courseId}</p>
              <p><strong>Due Date:</strong> {assessment.dueDate}</p>
              <p><strong>Max Points:</strong> {assessment.maxPoints}</p>
              <button className="btn-primary">View Assessment</button>
            </div>
          ))
        ) : (
          <p>No assessments match your filter.</p>
        )}
      </div>
    </div>
  );
}
