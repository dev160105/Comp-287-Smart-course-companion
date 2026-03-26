// src/components/Admin/CourseManager.jsx
export default function CourseManager({ courses = [], onToggleCourse, onDeleteCourse }) {

  return (
    <div className="course-manager">
      <h1>Course Manager</h1>
      {courses.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>No courses yet. Use the Course Builder to add one.</p>}
      <table className="course-management-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Title</th>
            <th>Instructor</th>
            <th>Enrollment</th>
            <th>Status</th>
              <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map(course => (
            <tr key={course._id || course.id}>
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
                  onClick={() => onToggleCourse(course._id || course.id)}
                >
                  {course.isActive ? 'Disable' : 'Enable'}
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => onDeleteCourse && onDeleteCourse(course._id || course.id)}
                  style={{ marginLeft: '0.5rem' }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
