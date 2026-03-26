// src/utils/auth.js
// Phase 2: JWT-based authentication using localStorage

const USER_KEY = 'currentUser';
const TOKEN_KEY = 'token';

export const setAuthData = (token, user) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const getCurrentUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const isAuthenticated = () => getToken() !== null && getCurrentUser() !== null;

export const isStudent = (user) => {
  const u = user || getCurrentUser();
  return u && u.role === 'student';
};

export const isInstructor = (user) => {
  const u = user || getCurrentUser();
  return u && u.role === 'instructor';
};

export const isAdmin = (user) => {
  const u = user || getCurrentUser();
  return u && u.role === 'admin';
};
