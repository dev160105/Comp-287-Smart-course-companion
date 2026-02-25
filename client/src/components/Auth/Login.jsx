// src/components/Auth/Login.jsx
import { useState, useEffect } from 'react';
import { mockLogin } from '../../utils/auth';

const REMEMBER_EMAIL_KEY = 'scc_remember_email';
const SAVED_EMAIL_KEY = 'scc_saved_email';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('student');

  useEffect(() => {
    const remember = localStorage.getItem(REMEMBER_EMAIL_KEY) === 'true';
    const savedEmail = localStorage.getItem(SAVED_EMAIL_KEY) || '';
    if(remember && savedEmail) {
      setRememberMe(true);
      setEmail(savedEmail);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    setError('');

    if (!email.trim()) {
      setError('Please enter your email.');
      return;
    }
    if(!password) {
      setError('Please enter your password.');
      return;
    }

    const user = mockLogin(email, password);
    if (user) {
      localStorage.setItem(REMEMBER_EMAIL_KEY, rememberMe ? 'true' : 'false');
      if(rememberMe) {
        localStorage.setItem(SAVED_EMAIL_KEY, email.trim());
      } else {
        localStorage.removeItem(SAVED_EMAIL_KEY);
      }

      onLoginSuccess({ ...user, role }); 
    } else {
      setError('Invalid email or password');
    }
  };

  return (
   <div className={`login-container ${role === 'admin' ? 'admin-mode' : ''}`}>
  <h1 className="login-title">
    {role === 'student' ? '🎓 Student Portal Login' : '🛠 Admin Portal Login'}
  </h1>

  <div className="role-toggle">
    <button
      type="button"
      className={role === 'student' ? 'role-btn active' : 'role-btn'}
      onClick={() => setRole('student')}
    >
      Student
    </button>

    <button
      type="button"
      className={role === 'admin' ? 'role-btn active' : 'role-btn'}
      onClick={() => setRole('admin')}
    >
      Admin
    </button>
  </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError('');
            }}
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
            onChange={(e) => {
            setPassword(e.target.value);
            if (error) setError('');
          }}
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
        <button type="submit" className="btn-primary">Login</button>
      </form>
      <p className="demo-info">
        Demo Credentials: john.doe@university.edu / password123
      </p>
    </div>
  );
}
