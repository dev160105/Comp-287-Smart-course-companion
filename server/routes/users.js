const express = require('express');
const { body } = require('express-validator');
const User = require('../models/User');
const Course = require('../models/Course');
const Assessment = require('../models/Assessment');
const Enrollment = require('../models/Enrollment');
const Grade = require('../models/Grade');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { calculateCourseAverage, calculateGPA } = require('../utils/calculations');

const router = express.Router();

// GET /api/users/stats  — admin only
router.get('/stats', protect, authorize('admin', 'instructor'), async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalInstructors = await User.countDocuments({ role: 'instructor' });
    const totalCourses = await Course.countDocuments();
    const activeCourses = await Course.countDocuments({ isActive: true });
    const totalEnrollments = await Enrollment.countDocuments();
    const totalAssessments = await Assessment.countDocuments();

    const completedGrades = await Grade.countDocuments({ status: 'completed' });
    const pendingGrades = await Grade.countDocuments({ status: 'pending' });

    const denominator = totalEnrollments * totalAssessments;
    const completionRatePercent = denominator > 0
      ? Number(((completedGrades / denominator) * 100).toFixed(2))
      : 0;

    res.json({
      totalStudents,
      totalInstructors,
      totalCourses,
      activeCourses,
      totalEnrollments,
      totalAssessments,
      completedGrades,
      pendingGrades,
      completionRatePercent,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/users  — admin only
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/users/:id  — admin sees all, students/instructors see own profile only
router.get('/:id', protect, async (req, res) => {
  try {
    if (req.user.role === 'student' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/users/:id  — own profile or admin
router.put(
  '/:id',
  protect,
  [
    body('email').optional().isEmail().withMessage('Valid email required'),
    body('password').optional().isLength({ min: 6 }).withMessage('Password min 6 chars'),
  ],
  validate,
  async (req, res) => {
    try {
      if (req.user.role === 'student' && req.user._id.toString() !== req.params.id) {
        return res.status(403).json({ message: 'Access denied' });
      }

      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      const allowedFields = ['firstName', 'lastName', 'major', 'department'];
      allowedFields.forEach((f) => {
        if (req.body[f] !== undefined) user[f] = req.body[f];
      });

      // Only admin can change role
      if (req.user.role === 'admin' && req.body.role) {
        user.role = req.body.role;
      }

      // Update password if provided
      if (req.body.password) {
        user.password = req.body.password; // pre-save hook will hash it
      }

      await user.save();

      const updated = await User.findById(user._id).select('-password');
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

module.exports = router;
