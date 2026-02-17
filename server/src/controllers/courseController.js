// src/controllers/courseController.js
// Phase 2: Course controller

export const getAllCourses = async (req, res) => {
  /*
  - Query database for courses
  - Apply filters (active, search, pagination)
  - Return course list
  */
};

export const getCourseById = async (req, res) => {
  /*
  - Query course by ID
  - Include enrollments if requested
  - Return course details
  */
};

export const createCourse = async (req, res) => {
  /*
  - Validate input
  - Create course document
  - Return created course
  */
};

export const updateCourse = async (req, res) => {
  /*
  - Update course fields
  - Validate permissions (Admin/Instructor)
  - Return updated course
  */
};

export const deleteCourse = async (req, res) => {
  /*
  - Check admin permission
  - Delete course
  - Return success message
  */
};

export const toggleCourseStatus = async (req, res) => {
  /*
  - Toggle isActive status
  - Return updated course
  */
};
