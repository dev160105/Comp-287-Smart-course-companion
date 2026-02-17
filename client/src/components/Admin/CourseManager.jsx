// src/components/Admin/CourseManager.jsx
import { useState, useEffect } from 'react';
import { loadCourses } from '../../utils/dataLoader';

export default function CourseManager({ onToggleCourse }) {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const allCourses = loadCourses();
    setCourses(allCourses);
  }, []);

  const handleToggle = (courseId) => {
    const updatedCourses = courses.map(course =>
      course.id === courseId ? { ...course, isActive: !course.isActive } : course
    );
    setCourses(updatedCourses);
    onToggleCourse(courseId);
  };

  return (
    <div className="course-manager">
      <h1>Course Manager</h1>
      
      <table className="course-management-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Title</th>
            <th>Instructor</th>
            <th>Enrollment</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {courses.map(course => (
            <tr key={course.id}>
              <td>{course.code}</td>
              <td>{course.title}</td>
              <td>{course.instructor}</td>
              <td>{course.enrollmentCount}/{course.maxCapacity}</td>
              <td>
                <span className={`status ${course.isActive ? 'active' : 'inactive'}`}>
                  {course.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td>
                <button 
                  className="btn-toggle"
                  onClick={() => handleToggle(course.id)}
                >
                  {course.isActive ? 'Disable' : 'Enable'}
                </button>
                <button className="btn-secondary">Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
