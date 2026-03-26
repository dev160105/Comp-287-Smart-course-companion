// src/components/Student/CourseList.jsx
import { useState } from 'react';
import { enrollInCourse, unenrollFromCourse } from '../../utils/dataLoader';

export default function CourseList({ courses = [], onSelectCourse, onRefresh }) {
  const [filter, setFilter] = useState('all');
  const [message, setMessage] = useState('');
  const [busyCourseId, setBusyCourseId] = useState('');

  const filteredCourses = filter === 'active' 
    ? courses.filter(c => c.isActive)
    : courses;

  const handleEnrollToggle = async (course) => {
    const id = course._id || course.id;
    setMessage('');
    setBusyCourseId(id);
    try {
      if (course.isEnrolled) {
        await unenrollFromCourse(id);
        setMessage(`Unenrolled from ${course.code}`);
      } else {
        await enrollInCourse(id);
        setMessage(`Enrolled in ${course.code}`);
      }
      onRefresh && onRefresh();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Unable to update enrollment');
    } finally {
      setBusyCourseId('');
    }
  };

  return (
    <div className="course-list">
      <h1>Course Catalog</h1>
      {message && <p className="info-text">{message}</p>}
      
      <div className="filter-controls">
        <label htmlFor="filter">Filter:</label>
        <select id="filter" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All Courses</option>
          <option value="active">Active Courses</option>
        </select>
      </div>

      <div className="courses-table">
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Title</th>
              <th>Instructor</th>
              <th>Credits</th>
              <th>Enrollment</th>
              <th>Status</th>
              <th>Enrollment</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.map(course => (
              <tr key={course._id || course.id}>
                <td>{course.code}</td>
                <td>{course.title}</td>
                <td>{course.instructor}</td>
                <td>{course.credits}</td>
                <td>{course.enrollmentCount}/{course.maxCapacity}</td>
                <td>{course.isActive ? 'Active' : 'Inactive'}</td>
                <td>
                  <button
                    className="btn-primary"
                    disabled={busyCourseId === (course._id || course.id) || !course.isActive}
                    onClick={() => handleEnrollToggle(course)}
                  >
                    {course.isEnrolled ? 'Unenroll' : 'Enroll'}
                  </button>
                </td>
                <td>
                  <button
                    className="btn-secondary"
                    onClick={() => onSelectCourse(course._id || course.id)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
