// src/components/Student/CourseList.jsx
import { useState, useEffect } from 'react';
import { loadCourses } from '../../utils/dataLoader';

export default function CourseList({ onSelectCourse }) {
  const [courses, setCourses] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const allCourses = loadCourses();
    setCourses(allCourses);
  }, []);

  const filteredCourses = filter === 'active' 
    ? courses.filter(c => c.isActive)
    : courses;

  return (
    <div className="course-list">
      <h1>Course Catalog</h1>
      
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
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.map(course => (
              <tr key={course.id}>
                <td>{course.code}</td>
                <td>{course.title}</td>
                <td>{course.instructor}</td>
                <td>{course.credits}</td>
                <td>{course.enrollmentCount}/{course.maxCapacity}</td>
                <td>{course.isActive ? 'Active' : 'Inactive'}</td>
                <td>
                  <button 
                    className="btn-secondary"
                    onClick={() => onSelectCourse(course.id)}
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
