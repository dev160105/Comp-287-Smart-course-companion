const express = require('express');
const { body } = require('express-validator');
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const { Parser } = require('json2csv');
const Grade = require('../models/Grade');
const Assessment = require('../models/Assessment');
const Enrollment = require('../models/Enrollment');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { calculateCourseAverage, calculateGPA } = require('../utils/calculations');

const router = express.Router();

const studentCanAccess = (req, studentId) => {
  if (req.user.role !== 'student') return true;
  return req.user._id.toString() === studentId;
};

async function getStudentCourseIds(studentId) {
  const enrollments = await Enrollment.find({ studentId }).select('courseId');
  return enrollments.map((e) => e.courseId.toString());
}

async function recalculateStudentGPA(studentId) {
  const grades = await Grade.find({ studentId, status: 'completed', score: { $ne: null } })
    .populate('assessmentId', 'maxPoints')
    .populate('courseId', 'credits');

  const courseMap = {};
  for (const g of grades) {
    if (!g.courseId || !g.assessmentId) continue;
    const key = g.courseId._id.toString();
    if (!courseMap[key]) courseMap[key] = { credits: g.courseId.credits, scores: [] };
    courseMap[key].scores.push({ score: g.score, maxPoints: g.assessmentId.maxPoints });
  }

  const courseResults = Object.values(courseMap).map((c) => {
    const avg = calculateCourseAverage(c.scores);
    return { credits: c.credits, gpaPoints: avg.gpaPoints };
  });

  const gpa = calculateGPA(courseResults);
  await User.findByIdAndUpdate(studentId, { gpa });
}

// GET /api/grades  — student sees own, instructor/admin sees all
router.get('/', protect, async (req, res) => {
  try {
    let grades;
    if (req.user.role === 'student') {
      grades = await Grade.find({ studentId: req.user._id })
        .populate('assessmentId', 'title type maxPoints dueDate status')
        .populate('courseId', 'code title credits');
    } else if (req.user.role === 'instructor') {
      grades = await Grade.find()
        .populate('studentId', 'firstName lastName email')
        .populate('assessmentId', 'title type maxPoints dueDate status')
        .populate('courseId', 'code title credits instructor');

      grades = grades.filter((g) => g.courseId && g.courseId.instructor && g.courseId.instructor.toString() === req.user._id.toString());
    } else {
      grades = await Grade.find()
        .populate('studentId', 'firstName lastName email')
        .populate('assessmentId', 'title type maxPoints dueDate status')
        .populate('courseId', 'code title credits');
    }

    res.json(grades);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/grades/student/:studentId  — student can only access own grades
router.get('/student/:studentId', protect, async (req, res) => {
  try {
    if (!studentCanAccess(req, req.params.studentId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const courseIds = await getStudentCourseIds(req.params.studentId);
    const assessments = await Assessment.find({ courseId: { $in: courseIds } })
      .populate('courseId', 'code title credits');

    const grades = await Grade.find({
      studentId: req.params.studentId,
      assessmentId: { $in: assessments.map((a) => a._id) },
    });

    const gradeMap = {};
    grades.forEach((g) => {
      gradeMap[g.assessmentId.toString()] = g;
    });

    const courseMap = {};
    assessments.forEach((a) => {
      const key = a.courseId._id.toString();
      if (!courseMap[key]) {
        courseMap[key] = {
          courseId: a.courseId._id,
          code: a.courseId.code,
          title: a.courseId.title,
          credits: a.courseId.credits,
          assessments: [],
          completedAssessments: 0,
          totalAssessments: 0,
        };
      }

      const grade = gradeMap[a._id.toString()];
      const isCompleted = Boolean(grade && grade.status === 'completed' && grade.score !== null);

      courseMap[key].assessments.push({
        assessmentId: a._id,
        title: a.title,
        type: a.type,
        score: grade ? grade.score : null,
        maxPoints: a.maxPoints,
        status: grade ? grade.status : 'pending',
        percentage: grade && grade.score !== null ? Math.round((grade.score / a.maxPoints) * 100) : null,
        submissionDate: grade ? grade.submittedAt : null,
        feedback: grade ? grade.feedback : '',
        dueDate: a.dueDate,
      });

      courseMap[key].totalAssessments += 1;
      if (isCompleted) courseMap[key].completedAssessments += 1;
    });

    const courseResults = [];
    Object.keys(courseMap).forEach((key) => {
      const c = courseMap[key];
      const graded = c.assessments.filter((a) => a.score !== null).map((a) => ({ score: a.score, maxPoints: a.maxPoints }));
      const avg = graded.length > 0 ? calculateCourseAverage(graded) : { letterGrade: 'N/A', percentage: 0, gpaPoints: 0 };
      c.currentGrade = avg.letterGrade;
      c.average = avg.percentage;
      c.gpaPoints = avg.gpaPoints;
      c.progressPercent = c.totalAssessments > 0 ? Math.round((c.completedAssessments / c.totalAssessments) * 100) : 0;
      courseResults.push({ credits: c.credits, gpaPoints: c.gpaPoints });
    });

    const overallGPA = calculateGPA(courseResults);

    const upcomingAssessments = assessments
      .filter((a) => new Date(a.dueDate) >= new Date(new Date().toDateString()))
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .map((a) => ({
        assessmentId: a._id,
        title: a.title,
        type: a.type,
        dueDate: a.dueDate,
        maxPoints: a.maxPoints,
        courseId: a.courseId._id,
        courseCode: a.courseId.code,
        courseTitle: a.courseId.title,
        status: gradeMap[a._id.toString()] ? gradeMap[a._id.toString()].status : 'pending',
      }));

    res.json({
      courses: Object.values(courseMap),
      overallGPA,
      upcomingAssessments,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/grades/student/:studentId/export.csv
router.get('/student/:studentId/export.csv', protect, async (req, res) => {
  try {
    if (!studentCanAccess(req, req.params.studentId) && req.user.role !== 'admin' && req.user.role !== 'instructor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const grades = await Grade.find({ studentId: req.params.studentId })
      .populate('assessmentId', 'title type maxPoints dueDate')
      .populate('courseId', 'code title');

    const records = grades.map((g) => ({
      courseCode: g.courseId?.code || '',
      courseTitle: g.courseId?.title || '',
      assessmentTitle: g.assessmentId?.title || '',
      assessmentType: g.assessmentId?.type || '',
      dueDate: g.assessmentId?.dueDate || '',
      score: g.score !== null ? g.score : '',
      maxPoints: g.assessmentId?.maxPoints || '',
      status: g.status,
      submittedAt: g.submittedAt,
    }));

    const parser = new Parser({
      fields: ['courseCode', 'courseTitle', 'assessmentTitle', 'assessmentType', 'dueDate', 'score', 'maxPoints', 'status', 'submittedAt'],
    });

    const csv = parser.parse(records);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="grades-export.csv"');
    res.status(200).send(csv);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/grades/student/:studentId/export.pdf
router.get('/student/:studentId/export.pdf', protect, async (req, res) => {
  try {
    if (!studentCanAccess(req, req.params.studentId) && req.user.role !== 'admin' && req.user.role !== 'instructor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const student = await User.findById(req.params.studentId).select('firstName lastName email');
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const grades = await Grade.find({ studentId: req.params.studentId })
      .populate('assessmentId', 'title type maxPoints dueDate')
      .populate('courseId', 'code title');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="grades-export.pdf"');

    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(res);

    doc.fontSize(18).text('Smart Course Companion - Grade Export');
    doc.moveDown(0.5);
    doc.fontSize(11).text(`Student: ${student.firstName} ${student.lastName}`);
    doc.fontSize(11).text(`Email: ${student.email}`);
    doc.fontSize(11).text(`Generated: ${new Date().toISOString()}`);
    doc.moveDown(1);

    grades.forEach((g, idx) => {
      const scoreText = g.score !== null ? `${g.score}/${g.assessmentId?.maxPoints || '-'} ` : '-';
      doc.fontSize(11).text(`${idx + 1}. ${g.courseId?.code || 'N/A'} - ${g.assessmentId?.title || 'N/A'}`);
      doc.fontSize(10).text(`   Type: ${g.assessmentId?.type || '-'} | Due: ${g.assessmentId?.dueDate || '-'} | Score: ${scoreText}| Status: ${g.status}`);
      if (g.feedback) doc.fontSize(10).text(`   Feedback: ${g.feedback}`);
      doc.moveDown(0.5);
    });

    doc.end();
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/grades/student/:studentId/reminders/email
router.post('/student/:studentId/reminders/email', protect, async (req, res) => {
  try {
    if (!studentCanAccess(req, req.params.studentId) && req.user.role !== 'admin' && req.user.role !== 'instructor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const student = await User.findById(req.params.studentId).select('firstName lastName email');
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const courseIds = await getStudentCourseIds(req.params.studentId);
    const assessments = await Assessment.find({ courseId: { $in: courseIds } }).populate('courseId', 'code title');
    const grades = await Grade.find({ studentId: req.params.studentId });
    const statusByAssessment = {};
    grades.forEach((g) => {
      statusByAssessment[g.assessmentId.toString()] = g.status;
    });

    const upcomingPending = assessments
      .filter((a) => new Date(a.dueDate) >= new Date(new Date().toDateString()))
      .filter((a) => (statusByAssessment[a._id.toString()] || 'pending') === 'pending')
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    if (upcomingPending.length === 0) {
      return res.json({ message: 'No pending upcoming assessments found', sent: false, count: 0 });
    }

    const reminderText = upcomingPending
      .slice(0, 10)
      .map((a) => `- ${a.courseId.code}: ${a.title} (${a.type}) due ${a.dueDate}`)
      .join('\n');

    const subject = 'Smart Course Companion: Upcoming assessment reminders';
    const text = [
      `Hi ${student.firstName},`,
      '',
      'You have upcoming pending assessments:',
      reminderText,
      '',
      'Stay on track and keep up the momentum.',
      '',
      'Smart Course Companion',
    ].join('\n');

    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return res.json({
        message: 'SMTP not configured. Returning preview only.',
        sent: false,
        count: upcomingPending.length,
        preview: { to: student.email, subject, text },
      });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: student.email,
      subject,
      text,
    });

    res.json({ message: 'Reminder email sent', sent: true, count: upcomingPending.length });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/grades  — instructor/admin create or student self-track
router.post(
  '/',
  protect,
  [
    body('assessmentId').notEmpty().withMessage('Assessment ID is required'),
    body('studentId').optional().notEmpty().withMessage('Student ID is invalid'),
    body('score').optional({ nullable: true }).isNumeric().withMessage('Score must be a number'),
    body('status').optional().isIn(['pending', 'completed']).withMessage('Invalid status'),
  ],
  validate,
  async (req, res) => {
    try {
      const isStaff = req.user.role === 'admin' || req.user.role === 'instructor';
      if (!isStaff && req.user.role !== 'student') {
        return res.status(403).json({ message: 'Access denied' });
      }

      const { assessmentId, feedback } = req.body;
      const assessment = await Assessment.findById(assessmentId).populate('courseId', 'instructor');
      if (!assessment) return res.status(404).json({ message: 'Assessment not found' });

      let studentId = req.body.studentId;
      if (req.user.role === 'student') {
        studentId = req.user._id.toString();
      }

      if (!studentId) {
        return res.status(400).json({ message: 'Student ID is required' });
      }

      if (req.user.role === 'instructor' && assessment.courseId.instructor.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }

      const enrolled = await Enrollment.findOne({ studentId, courseId: assessment.courseId._id });
      if (!enrolled) {
        return res.status(400).json({ message: 'Student is not enrolled in this course' });
      }

      const incomingScore = req.body.score === null || req.body.score === undefined || req.body.score === ''
        ? null
        : Number(req.body.score);
      if (incomingScore !== null && incomingScore > assessment.maxPoints) {
        return res.status(400).json({ message: `Score cannot exceed max points (${assessment.maxPoints})` });
      }

      let grade = await Grade.findOne({ studentId, assessmentId });
      if (!grade) {
        grade = await Grade.create({
          studentId,
          assessmentId,
          courseId: assessment.courseId._id,
          score: incomingScore,
          status: req.body.status || (incomingScore !== null ? 'completed' : 'pending'),
          feedback: feedback || '',
        });
      } else {
        grade.score = incomingScore;
        grade.status = req.body.status || (incomingScore !== null ? 'completed' : 'pending');
        if (feedback !== undefined) grade.feedback = feedback;
        await grade.save();
      }

      await recalculateStudentGPA(studentId);
      res.status(201).json(grade);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// POST /api/grades/assessment/:assessmentId/status  — student marks pending/completed
router.post(
  '/assessment/:assessmentId/status',
  protect,
  authorize('student'),
  [
    body('status').isIn(['pending', 'completed']).withMessage('Invalid status'),
    body('score').optional({ nullable: true }).isNumeric().withMessage('Score must be a number'),
    body('feedback').optional().isString().withMessage('Feedback must be text'),
  ],
  validate,
  async (req, res) => {
    try {
      const assessment = await Assessment.findById(req.params.assessmentId);
      if (!assessment) return res.status(404).json({ message: 'Assessment not found' });

      const enrolled = await Enrollment.findOne({
        studentId: req.user._id,
        courseId: assessment.courseId,
      });
      if (!enrolled) return res.status(403).json({ message: 'Not enrolled in this course' });

      const incomingScore = req.body.score === null || req.body.score === undefined || req.body.score === ''
        ? null
        : Number(req.body.score);

      if (incomingScore !== null && incomingScore > assessment.maxPoints) {
        return res.status(400).json({ message: `Score cannot exceed max points (${assessment.maxPoints})` });
      }

      const nextScore = req.body.status === 'pending' ? null : incomingScore;

      const grade = await Grade.findOneAndUpdate(
        { studentId: req.user._id, assessmentId: assessment._id },
        {
          $set: {
            courseId: assessment.courseId,
            status: req.body.status,
            score: nextScore,
            feedback: req.body.feedback || '',
            submittedAt: new Date(),
          },
        },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );

      await recalculateStudentGPA(req.user._id.toString());
      res.json(grade);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// GET /api/grades/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id)
      .populate('assessmentId', 'title type maxPoints')
      .populate('courseId', 'code title')
      .populate('studentId', 'firstName lastName email');

    if (!grade) return res.status(404).json({ message: 'Grade not found' });

    if (req.user.role === 'student' && grade.studentId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (req.user.role === 'instructor') {
      const assessment = await Assessment.findById(grade.assessmentId._id).populate('courseId', 'instructor');
      if (!assessment || assessment.courseId.instructor.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    res.json(grade);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/grades/:id  — owner student or instructor/admin
router.put(
  '/:id',
  protect,
  [
    body('score').optional({ nullable: true }).isNumeric().withMessage('Score must be a number'),
    body('status').optional().isIn(['pending', 'completed']).withMessage('Invalid status'),
  ],
  validate,
  async (req, res) => {
    try {
      const grade = await Grade.findById(req.params.id);
      if (!grade) return res.status(404).json({ message: 'Grade not found' });

      const assessment = await Assessment.findById(grade.assessmentId).populate('courseId', 'instructor maxPoints');
      if (!assessment) return res.status(404).json({ message: 'Assessment not found' });

      const ownsGrade = grade.studentId.toString() === req.user._id.toString();
      const instructorOwnsCourse = req.user.role === 'instructor' && assessment.courseId.instructor.toString() === req.user._id.toString();
      const isAdmin = req.user.role === 'admin';

      if (!ownsGrade && !instructorOwnsCourse && !isAdmin) {
        return res.status(403).json({ message: 'Access denied' });
      }

      if (req.body.score !== undefined) {
        const nextScore = req.body.score === null || req.body.score === '' ? null : Number(req.body.score);
        if (nextScore !== null && nextScore > assessment.maxPoints) {
          return res.status(400).json({ message: `Score cannot exceed max points (${assessment.maxPoints})` });
        }
        grade.score = nextScore;
      }

      if (req.body.status !== undefined) {
        grade.status = req.body.status;
        if (req.body.status === 'pending' && req.body.score === undefined) {
          grade.score = null;
        }
      }

      if (req.body.feedback !== undefined) grade.feedback = req.body.feedback;

      await grade.save();
      await recalculateStudentGPA(grade.studentId.toString());

      res.json(grade);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// DELETE /api/grades/:id  — owner student or instructor/admin
router.delete('/:id', protect, async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id);
    if (!grade) return res.status(404).json({ message: 'Grade not found' });

    const assessment = await Assessment.findById(grade.assessmentId).populate('courseId', 'instructor');
    const ownsGrade = grade.studentId.toString() === req.user._id.toString();
    const instructorOwnsCourse = req.user.role === 'instructor' && assessment && assessment.courseId.instructor.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!ownsGrade && !instructorOwnsCourse && !isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const studentId = grade.studentId.toString();
    await grade.deleteOne();
    await recalculateStudentGPA(studentId);

    res.json({ message: 'Grade removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
