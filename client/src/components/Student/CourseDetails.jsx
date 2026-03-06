// src/components/Student/CourseDetails.jsx
import { useState, useEffect } from 'react';
import { getCourseById, getAssessmentsByCourse } from '../../utils/dataLoader';

export default function CourseDetails({ courseId }) {
  const [course, setCourse] = useState(null);
  const [assessments, setAssessments] = useState([]);

  useEffect(() => {
    const courseData = getCourseById(courseId);
    const assessmentData = getAssessmentsByCourse(courseId);
    
    setCourse(courseData);
    setAssessments(assessmentData);
  }, [courseId]);

  if (!course) return <div>Loading...</div>;

  return (
    <div className="course-details">
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
            <strong>Semester:</strong> {course.semester}
          </div>
          <div className="info-item">
            <strong>Meeting Time:</strong> {course.meetingTime}
          </div>
          <div className="info-item">
            <strong>Location:</strong> {course.location}
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
