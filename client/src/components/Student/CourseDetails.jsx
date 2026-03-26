// src/components/Student/CourseDetails.jsx
import { useState, useEffect } from 'react';
import { getAssessmentsByCourse } from '../../utils/dataLoader';

export default function CourseDetails({ course, onBack }) {
  const [assessments, setAssessments] = useState([]);

  useEffect(() => {
    if (course) {
      const id = course._id || course.id;
      getAssessmentsByCourse(id).then(setAssessments).catch(console.error);
    }
  }, [course]);

  if (!course) return <div>Course not found.</div>;

  return (
    <div className="course-details">
      {onBack && (
        <button className="btn-back" onClick={onBack}>← Back</button>
      )}
      <h1>{course.title}</h1>
      
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
        </div>
      </div>

      <div className="course-description">
        <h2>Description</h2>
        <p>{course.description}</p>
      </div>

      <div className="course-assessments">
        <h2>Assessments</h2>
        {assessments.length > 0 ? (
          <ul>
            {assessments.map(assessment => (
              <li key={assessment.id} className="assessment-item">
                <strong>{assessment.title}</strong>
                <p>Type: {assessment.type} | Points: {assessment.maxPoints} | Due: {assessment.dueDate}</p>
                <p>Status: {assessment.status}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No assessments available.</p>
        )}
      </div>
    </div>
  );
}
