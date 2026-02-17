// src/utils/auth.js
// Mock authentication utility for Phase 1

const MOCK_SESSION_STORAGE_KEY = 'currentUser';

export const mockLogin = (email, password) => {
  // Mock login - in Phase 2, this will call the backend API
  const users = [
    { id: 'USR001', email: 'john.doe@university.edu', password: 'password123', role: 'student', name: 'John Doe' },
    { id: 'USR002', email: 'jane.smith@university.edu', password: 'password123', role: 'student', name: 'Jane Smith' },
    { id: 'INS001', email: 'm.brown@university.edu', password: 'password123', role: 'instructor', name: 'Dr. Michael Brown' },
    { id: 'ADM001', email: 'admin@university.edu', password: 'admin123', role: 'admin', name: 'Admin User' },
  ];

  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    const { password, ...userWithoutPassword } = user;
    sessionStorage.setItem(MOCK_SESSION_STORAGE_KEY, JSON.stringify(userWithoutPassword));
    return userWithoutPassword;
  }
  return null;
};

export const mockSignup = (data) => {
  // Mock signup - in Phase 2, this will call the backend API
  const newUser = {
    id: `USR${Math.floor(Math.random() * 10000)}`,
    email: data.email,
    role: 'student',
    name: `${data.firstName} ${data.lastName}`,
  };
  sessionStorage.setItem(MOCK_SESSION_STORAGE_KEY, JSON.stringify(newUser));
  return newUser;
};

export const getCurrentUser = () => {
  const user = sessionStorage.getItem(MOCK_SESSION_STORAGE_KEY);
  return user ? JSON.parse(user) : null;
};

export const logout = () => {
  sessionStorage.removeItem(MOCK_SESSION_STORAGE_KEY);
};

export const isAuthenticated = () => {
  return getCurrentUser() !== null;
};

export const isStudent = () => {
  const user = getCurrentUser();
  return user && user.role === 'student';
};

export const isInstructor = () => {
  const user = getCurrentUser();
  return user && user.role === 'instructor';
};

export const isAdmin = () => {
  const user = getCurrentUser();
  return user && user.role === 'admin';
};
