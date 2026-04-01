const express = require('express');
const { body, param } = require('express-validator');
const Course = require('../models/Course');
const Assessment = require('../models/Assessment');
const Grade = require('../models/Grade');
const Enrollment = require('../models/Enrollment');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// GET /api/courses  — all users can list courses
router.get('/', protect, async (req, res) => {
  try {
    let query = {};
    let enrolledSet = null;
    if (req.user.role === 'student') {
      const enrollments = await Enrollment.find({ studentId: req.user._id }).select('courseId');
      enrolledSet = new Set(enrollments.map((e) => e.courseId.toString()));
    } else if (req.user.role === 'instructor') {
      query = { instructor: req.user._id };
    }

    const courses = await Course.find(query).populate('instructor', 'firstName lastName email');
    const result = req.user.role === 'student'
      ? courses.map((course) => ({
          ...course.toObject(),
          isEnrolled: enrolledSet.has(course._id.toString()),
        }))
      : courses;

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/courses/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      'instructor',
      'firstName lastName email'
    );
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (req.user.role === 'student') {
      const enrollment = await Enrollment.findOne({ studentId: req.user._id, courseId: course._id });
      if (!enrollment) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    if (req.user.role === 'instructor' && course.instructor._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/courses  — admin/instructor only
router.post(
  '/',
  protect,
  authorize('admin', 'instructor'),
  [
    body('code').notEmpty().withMessage('Course code is required'),
    body('title').notEmpty().withMessage('Course title is required'),
    body('credits').isInt({ min: 1, max: 6 }).withMessage('Credits must be 1–6'),
    body('maxCapacity').isInt({ min: 1 }).withMessage('Max capacity must be positive'),
  ],
  validate,
  async (req, res) => {
    try {
      const { code, title, description, credits, maxCapacity, semester, startDate, endDate, meetingTime, location } = req.body;

      const existing = await Course.findOne({ code: code.toUpperCase() });
      if (existing) return res.status(400).json({ message: 'Course code already exists' });

      const course = await Course.create({
        code,
        title,
        description,
        instructor: req.user._id,
        credits,
        maxCapacity,
        semester: semester || 'Spring 2026',
        startDate: startDate || '',
        endDate: endDate || '',
        meetingTime: meetingTime || 'TBD',
        location: location || 'TBD',
      });

      const populated = await course.populate('instructor', 'firstName lastName email');
      res.status(201).json(populated);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// PUT /api/courses/:id  — admin/instructor only
router.put(
  '/:id',
  protect,
  authorize('admin', 'instructor'),
  [
    body('credits').optional().isInt({ min: 1, max: 6 }).withMessage('Credits must be 1–6'),
    body('maxCapacity').optional().isInt({ min: 1 }).withMessage('Max capacity must be positive'),
  ],
  validate,
  async (req, res) => {
    try {
      const course = await Course.findById(req.params.id);
      if (!course) return res.status(404).json({ message: 'Course not found' });

      if (req.user.role === 'instructor' && course.instructor.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }

      const allowedFields = ['title', 'description', 'credits', 'maxCapacity', 'isActive', 'semester', 'startDate', 'endDate', 'meetingTime', 'location'];
      allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) course[field] = req.body[field];
      });

      await course.save();
      const populated = await course.populate('instructor', 'firstName lastName email');
      res.json(populated);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// DELETE /api/courses/:id  — admin only
router.delete('/:id', protect, authorize('admin', 'instructor'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (req.user.role === 'instructor' && course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Cascade delete: enrollments, grades, assessments, then the course itself
    await Enrollment.deleteMany({ courseId: course._id });
    await Grade.deleteMany({ courseId: course._id });
    await Assessment.deleteMany({ courseId: course._id });

    await course.deleteOne();

    // Remove course code from users' enrolledCourses arrays
    await User.updateMany(
      { enrolledCourses: course.code },
      { $pull: { enrolledCourses: course.code } }
    );

    res.json({ message: 'Course removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/courses/:id/enroll  — student only
router.post(
  '/:id/enroll',
  protect,
  authorize('student'),
  async (req, res) => {
    try {
      const course = await Course.findById(req.params.id);
      if (!course) return res.status(404).json({ message: 'Course not found' });
      if (!course.isActive) return res.status(400).json({ message: 'Course is not active' });
      if (course.enrollmentCount >= course.maxCapacity) {
        return res.status(400).json({ message: 'Course is at full capacity' });
      }

      const alreadyEnrolled = await Enrollment.findOne({
        studentId: req.user._id,
        courseId: course._id,
      });
      if (alreadyEnrolled) return res.status(400).json({ message: 'Already enrolled in this course' });

      await Enrollment.create({ studentId: req.user._id, courseId: course._id });
      course.enrollmentCount += 1;
      await course.save();

      // Update user's enrolledCourses
      await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { enrolledCourses: course.code },
      });

      res.status(201).json({ message: 'Enrolled successfully', courseId: course._id });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// DELETE /api/courses/:id/enroll  — student unenroll
router.delete('/:id/enroll', protect, authorize('student'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const enrollment = await Enrollment.findOne({ studentId: req.user._id, courseId: course._id });
    if (!enrollment) {
      return res.status(400).json({ message: 'You are not enrolled in this course' });
    }

    await enrollment.deleteOne();
    course.enrollmentCount = Math.max(0, course.enrollmentCount - 1);
    await course.save();

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { enrolledCourses: course.code },
    });

    await Grade.deleteMany({ studentId: req.user._id, courseId: course._id });

    res.json({ message: 'Unenrolled successfully', courseId: course._id });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/courses/:id/students  — instructor/admin: list enrolled students
router.get('/:id/students', protect, authorize('admin', 'instructor'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (req.user.role === 'instructor' && course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const enrollments = await Enrollment.find({ courseId: course._id }).populate(
      'studentId',
      'firstName lastName email major gpa'
    );

    const students = enrollments
      .filter((e) => e.studentId)
      .map((e) => ({
        _id: e.studentId._id,
        firstName: e.studentId.firstName,
        lastName: e.studentId.lastName,
        email: e.studentId.email,
        major: e.studentId.major,
        gpa: e.studentId.gpa,
        enrolledAt: e.enrolledAt,
      }));

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
