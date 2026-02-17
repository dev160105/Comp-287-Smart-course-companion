// src/routes/courses.js
// Phase 2: Course management routes

const courseRoutes = /* express.Router() */ {
  /*
  GET /api/courses
  - Get all courses (with filters for active/inactive)
  - Query: ?active=true

  GET /api/courses/:courseId
  - Get single course details
  - Params: courseId

  POST /api/courses
  - Create new course (Admin only)
  - Body: { code, title, description, credits, instructor, maxCapacity }

  PUT /api/courses/:courseId
  - Update course (Admin/Instructor only)
  - Params: courseId
  - Body: partial course data

  DELETE /api/courses/:courseId
  - Delete course (Admin only)

  PATCH /api/courses/:courseId/toggle
  - Enable/Disable course

  GET /api/courses/:courseId/enrollments
  - Get course enrollment list (Instructor/Admin)
  */
};

export default courseRoutes;
