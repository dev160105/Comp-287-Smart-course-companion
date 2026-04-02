// src/components/Auth/Login.jsx
import { useState } from 'react';
import api from '../../utils/api';
import { setAuthData } from '../../utils/auth';

export default function Login({ onLoginSuccess }) {
  const [role, setRole] = useState(null); // null = role picker, 'student' or 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/api/auth/login', { email, password });
      const { token, user } = res.data;

      // Validate the user's role matches the selected portal
      if (role === 'student' && user.role !== 'student') {
        setError('This account is not a student account. Please use the Admin/Instructor portal.');
        setLoading(false);
        return;
      }
      if (role === 'admin' && user.role === 'student') {
        setError('This account is not an admin or instructor account. Please use the Student portal.');
        setLoading(false);
        return;
      }

      setAuthData(token, user);
      onLoginSuccess(user);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  // Role picker screen
  if (!role) {
    return (
      <div className="login-role-picker">
        <div className="login-logo">
          <span className="login-logo-icon">🎓</span>
          <h1>Smart Course Companion</h1>
          <p>Please select your role to continue</p>
        </div>
        <div className="role-cards">
          <button className="role-card student-card" onClick={() => setRole('student')}>
            <span className="role-icon">👨‍🎓</span>
            <h2>Student</h2>
            <p>Access your courses, grades, and progress</p>
            <span className="role-arrow">→</span>
          </button>
          <button className="role-card admin-card" onClick={() => setRole('admin')}>
            <span className="role-icon">👨‍🏫</span>
            <h2>Admin / Instructor</h2>
            <p>Manage courses, assessments, and students</p>
            <span className="role-arrow">→</span>
          </button>
        </div>
      </div>
    );
  }

  // Login form screen
  return (
    <div className={`login-container ${role === 'admin' ? 'admin-login' : 'student-login'}`}>
      <button className="back-button" onClick={() => { setRole(null); setError(''); setEmail(''); setPassword(''); }}>
        ← Back
      </button>

      <div className="login-header">
        <span className="login-role-badge">
          {role === 'student' ? '👨‍🎓 Student Portal' : '👨‍🏫 Admin / Instructor Portal'}
        </span>
        <h1>Smart Course Companion</h1>
        <p className="login-subtitle">
          {role === 'student' ? 'Sign in to your student account' : 'Sign in to manage your courses'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={role === 'student' ? 'student@university.edu' : 'instructor@university.edu'}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className={`btn-login ${role === 'admin' ? 'btn-admin' : 'btn-student'}`} disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="demo-info">
        <p><strong>Demo Credentials:</strong></p>
        {role === 'student' ? (
          <p>📧 john.doe@university.edu &nbsp;|&nbsp; 🔑 password123</p>
        ) : (
          <>
            <p>👨‍🏫 m.brown@university.edu &nbsp;|&nbsp; 🔑 password123</p>
            <p>🔑 admin@university.edu &nbsp;|&nbsp; 🔑 admin123</p>
          </>
        )}
      </div>
    </div>
  );
}
