// src/routes/users.js
// Phase 2: User management routes

const userRoutes = /* express.Router() */ {
  /*
  GET /api/users
  - Get all users (Admin only)
  - Query: ?role=student&search=query

  GET /api/users/:userId
  - Get user profile
  - Query: ?includeEnrollments=true

  PUT /api/users/:userId
  - Update user profile
  - Body: partial user data

  DELETE /api/users/:userId
  - Delete user (Admin only)

  GET /api/users/:userId/courses
  - Get courses for user (student enrollments or instructor teaching)

  PUT /api/users/:userId/enroll
  - Enroll student in course
  - Body: { courseId }

  PUT /api/users/:userId/unenroll
  - Remove student from course
  - Body: { courseId }

  GET /api/users/:userId/analytics
  - Get user analytics (Admin for any user, students for self)
  */
};

export default userRoutes;
