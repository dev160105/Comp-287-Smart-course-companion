// src/components/Admin/Dashboard.jsx
import { useState, useEffect, useMemo } from 'react';
import { loadUsers, getUserStats } from '../../utils/dataLoader';

export default function AdminDashboard({ currentUser, courses = [], onNavigate }) {
  const [users, setUsers] = useState([]);
  const [activePanel, setActivePanel] = useState(null);
  const [usageStats, setUsageStats] = useState(null);

  useEffect(() => {
    loadUsers().then(setUsers).catch(console.error);
    getUserStats().then(setUsageStats).catch(console.error);
  }, []);

  // Recompute stats whenever courses or users change
  const stats = useMemo(() => ({
    totalUsers: users.length,
    totalStudents: users.filter(u => u.role === 'student').length,
    totalInstructors: users.filter(u => u.role === 'instructor').length,
    activeCourses: courses.filter(c => c.isActive).length,
    totalCourses: courses.length,
  }), [users, courses]);

  const handleToolClick = (tool) => {
    if (tool === 'courses') {
      onNavigate && onNavigate('course-manager');
    } else {
      setActivePanel(activePanel === tool ? null : tool);
    }
  };

  const roleColor = { student: '#2563eb', instructor: '#10b981', admin: '#f59e0b' };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      
      <div className="admin-summary">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-number">{stats.totalUsers}</p>
        </div>
        <div className="stat-card">
          <h3>Students</h3>
          <p className="stat-number">{stats.totalStudents}</p>
        </div>
        <div className="stat-card">
          <h3>Instructors</h3>
          <p className="stat-number">{stats.totalInstructors}</p>
        </div>
        <div className="stat-card">
          <h3>Active Courses</h3>
          <p className="stat-number">{stats.activeCourses}/{stats.totalCourses}</p>
        </div>
      </div>

      <section className="admin-actions">
        <h2>Management Tools</h2>
        <div className="action-buttons">
          <button className="btn-primary" onClick={() => handleToolClick('courses')}>Manage Courses</button>
          <button className={activePanel === 'users' ? 'btn-primary panel-active' : 'btn-primary'} onClick={() => handleToolClick('users')}>Manage Users</button>
          <button className={activePanel === 'reports' ? 'btn-primary panel-active' : 'btn-primary'} onClick={() => handleToolClick('reports')}>View Reports</button>
          <button className={activePanel === 'settings' ? 'btn-primary panel-active' : 'btn-primary'} onClick={() => handleToolClick('settings')}>System Settings</button>
        </div>
      </section>

      {activePanel === 'users' && (
        <section className="admin-panel">
          <h2>Manage Users</h2>
          <div className="panel-table-wrapper">
            <table className="panel-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id || u.id}>
                    <td>{u._id || u.id}</td>
                    <td>{u.firstName} {u.lastName}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className="role-badge" style={{ background: roleColor[u.role] || '#6b7280' }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      {u.role === 'student' && `GPA: ${u.gpa} · ${u.major}`}
                      {u.role === 'instructor' && `Dept: ${u.department}`}
                      {u.role === 'admin' && 'Full access'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activePanel === 'reports' && (
        <section className="admin-panel">
          <h2>Course Reports</h2>
          {usageStats && (
            <div className="dashboard-summary" style={{ marginBottom: '1rem' }}>
              <div className="summary-card">
                <h3>Assessment Completion</h3>
                <p className="stat">{usageStats.completionRatePercent}%</p>
              </div>
              <div className="summary-card">
                <h3>Completed Assessments</h3>
                <p className="stat">{usageStats.completedGrades}</p>
              </div>
              <div className="summary-card">
                <h3>Pending Assessments</h3>
                <p className="stat">{usageStats.pendingGrades}</p>
              </div>
            </div>
          )}
          <div className="panel-table-wrapper">
            <table className="panel-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Title</th>
                  <th>Instructor</th>
                  <th>Enrollment</th>
                  <th>Credits</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {courses.map(c => (
                  <tr key={c._id || c.id}>
                    <td>{c.code}</td>
                    <td>{c.title}</td>
                    <td>{c.instructor}</td>
                    <td>{c.enrollmentCount}/{c.maxCapacity}</td>
                    <td>{c.credits}</td>
                    <td>
                      <span className="role-badge" style={{ background: c.isActive ? '#10b981' : '#6b7280' }}>
                        {c.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activePanel === 'settings' && (
        <section className="admin-panel">
          <h2>System Settings</h2>
          <div className="settings-grid">
            <div className="setting-item">
              <h4>Semester</h4>
              <select defaultValue="Fall 2025"><option>Fall 2025</option><option>Spring 2026</option><option>Summer 2026</option></select>
            </div>
            <div className="setting-item">
              <h4>Max Course Capacity</h4>
              <input type="number" defaultValue={30} min={1} max={200} />
            </div>
            <div className="setting-item">
              <h4>Allow Student Signup</h4>
              <input type="checkbox" defaultChecked />
            </div>
            <div className="setting-item">
              <h4>Maintenance Mode</h4>
              <input type="checkbox" />
            </div>
          </div>
          <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Note: Settings are display-only in Phase 1 (no backend).
          </p>
        </section>
      )}

      <section className="recent-activity">
        <h2>Recent Activity</h2>
        <p>(Activity log will display here)</p>
      </section>
    </div>
  );
}
