// src/components/Admin/Dashboard.jsx
import { useState, useEffect } from 'react';
import { loadUsers, loadCourses } from '../../utils/dataLoader';

export default function AdminDashboard({ currentUser }) {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalInstructors: 0,
    activeCourses: 0,
    totalCourses: 0,
  });

  useEffect(() => {
    const users = loadUsers();
    const courses = loadCourses();

    setStats({
      totalUsers: users.length,
      totalStudents: users.filter(u => u.role === 'student').length,
      totalInstructors: users.filter(u => u.role === 'instructor').length,
      activeCourses: courses.filter(c => c.isActive).length,
      totalCourses: courses.length,
    });
  }, []);

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
          <button className="btn-primary">Manage Courses</button>
          <button className="btn-primary">Manage Users</button>
          <button className="btn-primary">View Reports</button>
          <button className="btn-primary">System Settings</button>
        </div>
      </section>

      <section className="recent-activity">
        <h2>Recent Activity</h2>
        <p>(Activity log will display here)</p>
      </section>
    </div>
  );
}
