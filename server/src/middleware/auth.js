// src/middleware/auth.js
// Phase 2: JWT authentication middleware

export const authenticateToken = (req, res, next) => {
  /*
  - Extract JWT from Authorization header
  - Verify token
  - Attach user to request
  - Return 401 if invalid
  */
  next();
};

export const authorizeRole = (...roles) => {
  return (req, res, next) => {
    /*
    - Check if user role is in allowed roles
    - Return 403 if not authorized
    */
    next();
  };
};

export const requireAdmin = (req, res, next) => {
  /*
  Middleware to require admin role
  */
  next();
};

export const requireInstructor = (req, res, next) => {
  /*
  Middleware to require instructor or admin role
  */
  next();
};
