const express = require('express');
const { body } = require('express-validator');
const Assessment = require('../models/Assessment');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Grade = require('../models/Grade');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// GET /api/assessments  — returns assessments relevant to the current user
router.get('/', protect, async (req, res) => {
  try {
    let assessments;

    if (req.user.role === 'student') {
      // Only return assessments for courses the student is enrolled in
      const enrollments = await Enrollment.find({ studentId: req.user._id });
      const courseIds = enrollments.map((e) => e.courseId);
      assessments = await Assessment.find({ courseId: { $in: courseIds } }).populate(
        'courseId',
        'code title'
      );

      const grades = await Grade.find({ studentId: req.user._id, assessmentId: { $in: assessments.map((a) => a._id) } });
      const gradeByAssessmentId = new Map(grades.map((g) => [g.assessmentId.toString(), g]));

      const decorated = assessments.map((a) => {
        const grade = gradeByAssessmentId.get(a._id.toString());
        return {
          ...a.toObject(),
          studentStatus: grade ? grade.status : 'pending',
          studentScore: grade ? grade.score : null,
          studentFeedback: grade ? grade.feedback : '',
        };
      });

      return res.json(decorated);
    } else {
      assessments = await Assessment.find().populate('courseId', 'code title');
    }

    res.json(assessments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/courses/:courseId/assessments
router.get('/course/:courseId', protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Students must be enrolled
    if (req.user.role === 'student') {
      const enrolled = await Enrollment.findOne({
        studentId: req.user._id,
        courseId: course._id,
      });
      if (!enrolled) return res.status(403).json({ message: 'Not enrolled in this course' });
    }

    const assessments = await Assessment.find({ courseId: course._id });

    if (req.user.role === 'student') {
      const grades = await Grade.find({ studentId: req.user._id, assessmentId: { $in: assessments.map((a) => a._id) } });
      const gradeByAssessmentId = new Map(grades.map((g) => [g.assessmentId.toString(), g]));
      return res.json(
        assessments.map((a) => {
          const grade = gradeByAssessmentId.get(a._id.toString());
          return {
            ...a.toObject(),
            studentStatus: grade ? grade.status : 'pending',
            studentScore: grade ? grade.score : null,
            studentFeedback: grade ? grade.feedback : '',
          };
        })
      );
    }

    res.json(assessments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/assessments/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id).populate('courseId', 'code title');
    if (!assessment) return res.status(404).json({ message: 'Assessment not found' });

    // Students must be enrolled in the course
    if (req.user.role === 'student') {
      const enrolled = await Enrollment.findOne({
        studentId: req.user._id,
        courseId: assessment.courseId,
      });
      if (!enrolled) return res.status(403).json({ message: 'Not enrolled in this course' });
    }

    res.json(assessment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/assessments  — admin/instructor only
router.post(
  '/',
  protect,
  authorize('admin', 'instructor'),
  [
    body('courseId').notEmpty().withMessage('Course ID is required'),
    body('title').notEmpty().withMessage('Title is required'),
    body('type')
      .isIn(['assignment', 'quiz', 'lab', 'exam', 'project'])
      .withMessage('Invalid assessment type'),
    body('dueDate').notEmpty().withMessage('Due date is required'),
    body('maxPoints').isInt({ min: 1 }).withMessage('Max points must be positive'),
    body('weight').optional().isFloat({ min: 0, max: 100 }).withMessage('Weight must be between 0 and 100'),
  ],
  validate,
  async (req, res) => {
    try {
      const { courseId, title, type, description, dueDate, maxPoints, weight, status } = req.body;

      const course = await Course.findById(courseId);
      if (!course) return res.status(404).json({ message: 'Course not found' });

      if (req.user.role === 'instructor' && course.instructor.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }

      const assessment = await Assessment.create({
        courseId,
        title,
        type,
        description: description || '',
        dueDate,
        maxPoints,
        weight: weight || 0,
        status: status || 'upcoming',
      });

      res.status(201).json(assessment);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// PUT /api/assessments/:id  — admin/instructor only
router.put(
  '/:id',
  protect,
  authorize('admin', 'instructor'),
  [
    body('type')
      .optional()
      .isIn(['assignment', 'quiz', 'lab', 'exam', 'project'])
      .withMessage('Invalid type'),
    body('status')
      .optional()
      .isIn(['open', 'upcoming', 'closed'])
      .withMessage('Invalid status'),
    body('weight').optional().isFloat({ min: 0, max: 100 }).withMessage('Weight must be between 0 and 100'),
    body('maxPoints').optional().isInt({ min: 1 }).withMessage('Max points must be positive'),
  ],
  validate,
  async (req, res) => {
    try {
      const assessment = await Assessment.findById(req.params.id);
      if (!assessment) return res.status(404).json({ message: 'Assessment not found' });

      const course = await Course.findById(assessment.courseId);
      if (!course) return res.status(404).json({ message: 'Course not found' });

      if (req.user.role === 'instructor' && course.instructor.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }

      const allowedFields = ['title', 'type', 'description', 'dueDate', 'maxPoints', 'weight', 'status'];
      allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) assessment[field] = req.body[field];
      });

      await assessment.save();
      res.json(assessment);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// DELETE /api/assessments/:id  — admin/instructor only
router.delete('/:id', protect, authorize('admin', 'instructor'), async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);
    if (!assessment) return res.status(404).json({ message: 'Assessment not found' });

    const course = await Course.findById(assessment.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (req.user.role === 'instructor' && course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await assessment.deleteOne();
    res.json({ message: 'Assessment removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
