// src/components/Auth/Login.jsx
import { useState } from 'react';
import api from '../../utils/api';
import { setAuthData } from '../../utils/auth';

export default function Login({ onLoginSuccess }) {
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
      setAuthData(token, user);
      onLoginSuccess(user);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1>Smart Course Companion - Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@university.edu"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <div className="demo-info">
        <p><strong>Demo Credentials:</strong></p>
        <p>🎓 Student: john.doe@university.edu / password123</p>
        <p>👨‍🏫 Professor: m.brown@university.edu / password123</p>
        <p>🔑 Admin: admin@university.edu / admin123</p>
      </div>
    </div>
  );
}
