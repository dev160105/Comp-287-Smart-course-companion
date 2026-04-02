// src/components/Auth/Login.jsx
// Original UI by hsk1006 (Seok Kyu Hong) - updated to use real API auth
import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { setAuthData } from '../../utils/auth';

const REMEMBER_EMAIL_KEY = 'scc_remember_email';
const SAVED_EMAIL_KEY = 'scc_saved_email';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('student');

  useEffect(() => {
    const remember = localStorage.getItem(REMEMBER_EMAIL_KEY) === 'true';
    const savedEmail = localStorage.getItem(SAVED_EMAIL_KEY) || '';
    if (remember && savedEmail) {
      setRememberMe(true);
      setEmail(savedEmail);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/api/auth/login', { email, password });
      const { token, user } = res.data;

      // Validate role matches selected portal
      if (role === 'student' && user.role !== 'student') {
        setError('This account is not a student. Please use the Admin portal.');
        setLoading(false);
        return;
      }
      if (role === 'admin' && user.role === 'student') {
        setError('This account is not an admin or instructor. Please use the Student portal.');
        setLoading(false);
        return;
      }

      localStorage.setItem(REMEMBER_EMAIL_KEY, rememberMe ? 'true' : 'false');
      if (rememberMe) {
        localStorage.setItem(SAVED_EMAIL_KEY, email.trim());
      } else {
        localStorage.removeItem(SAVED_EMAIL_KEY);
      }

      setAuthData(token, user);
      onLoginSuccess(user);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`login-container ${role === 'admin' ? 'admin-mode' : ''}`}>
      <h1 className="login-title">
        {role === 'student' ? '🎓 Student Portal Login' : '🛠 Admin/Instructor Portal Login'}
      </h1>

      <div className="role-toggle">
        <button
          type="button"
          className={role === 'student' ? 'role-btn active' : 'role-btn'}
          onClick={() => { setRole('student'); setError(''); }}
        >
          Student
        </button>
        <button
          type="button"
          className={role === 'admin' ? 'role-btn active' : 'role-btn'}
          onClick={() => { setRole('admin'); setError(''); }}
        >
          Admin/Instructor
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); if (error) setError(''); }}
            placeholder="your.email@university.edu"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); if (error) setError(''); }}
            placeholder="Enter password"
            required
          />
        </div>

        <div className="login-options">
          <label>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Remember me
          </label>
          <label>
            <input
              type="checkbox"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
            />
            Show password
          </label>
        </div>

        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
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
