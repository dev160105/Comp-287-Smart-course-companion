/**
 * Seed script: populate MongoDB with data from client/src/data/ JSON files.
 * Run: node seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');

const User       = require('./models/User');
const Course     = require('./models/Course');
const Assessment = require('./models/Assessment');
const Grade      = require('./models/Grade');
const Enrollment = require('./models/Enrollment');

// Raw data mirroring client/src/data/
const usersData = [
  { legacyId: 'USR001', firstName: 'John',       lastName: 'Doe',     email: 'john.doe@university.edu',    password: 'password123', role: 'student',    major: 'Computer Science', gpa: 3.75, enrolledCourses: ['CS101','MATH201','CS301'] },
  { legacyId: 'USR002', firstName: 'Jane',       lastName: 'Smith',   email: 'jane.smith@university.edu',  password: 'password123', role: 'student',    major: 'Computer Science', gpa: 3.92, enrolledCourses: ['CS101','CS301'] },
  { legacyId: 'USR003', firstName: 'Sarah',      lastName: 'Johnson', email: 'sarah.johnson@university.edu',password:'password123', role: 'student',    major: 'Mathematics',      gpa: 3.45, enrolledCourses: ['MATH201'] },
  { legacyId: 'INS001', firstName: 'Dr. Michael',lastName: 'Brown',   email: 'm.brown@university.edu',     password: 'password123', role: 'instructor', department: 'Computer Science', teachingCourses: ['CS101','CS301'] },
  { legacyId: 'INS002', firstName: 'Dr. Emily',  lastName: 'Wilson',  email: 'e.wilson@university.edu',    password: 'password123', role: 'instructor', department: 'Mathematics', teachingCourses: ['MATH201'] },
  { legacyId: 'ADM001', firstName: 'Admin',      lastName: 'User',    email: 'admin@university.edu',       password: 'admin123',    role: 'admin' },
];

const coursesData = [
  { legacyId: 'CS101',   code: 'CS101',   title: 'Introduction to Computer Science',     description: 'Fundamentals of programming, algorithms, and computer science concepts',          instructorLegacyId: 'INS001', credits: 3, maxCapacity: 200, enrollmentCount: 150, isActive: true,  semester: 'Spring 2025', startDate: '2025-02-01', endDate: '2025-05-15', meetingTime: 'MWF 10:00 AM - 11:15 AM', location: 'Science Building Room 305' },
  { legacyId: 'CS301',   code: 'CS301',   title: 'Data Structures and Algorithms',        description: 'Advanced study of data structures, algorithm design, and complexity analysis',    instructorLegacyId: 'INS001', credits: 4, maxCapacity: 100, enrollmentCount: 80,  isActive: true,  semester: 'Spring 2025', startDate: '2025-02-01', endDate: '2025-05-15', meetingTime: 'TTh 1:30 PM - 3:00 PM',   location: 'Tech Center Room 210' },
  { legacyId: 'MATH201', code: 'MATH201', title: 'Calculus II',                           description: 'Integration techniques, sequences, series, and multivariable calculus',            instructorLegacyId: 'INS002', credits: 4, maxCapacity: 150, enrollmentCount: 120, isActive: true,  semester: 'Spring 2025', startDate: '2025-02-01', endDate: '2025-05-15', meetingTime: 'MWF 2:00 PM - 3:15 PM',  location: 'Math Building Room 120' },
  { legacyId: 'CS201',   code: 'CS201',   title: 'Web Development Fundamentals',          description: 'HTML, CSS, JavaScript and responsive design principles',                          instructorLegacyId: 'INS001', credits: 3, maxCapacity: 120, enrollmentCount: 0,   isActive: false, semester: 'Spring 2025', startDate: '2025-03-15', endDate: '2025-06-30', meetingTime: 'TTh 10:00 AM - 11:30 AM', location: 'Tech Center Room 115' },
];

const assessmentsData = [
  { legacyId: 'ASS001', courseLegacyId: 'CS101',   title: 'Assignment 1: Variables and Data Types',      type: 'assignment', description: 'Write a program to demonstrate understanding of variables and data types',  dueDate: '2025-02-15', maxPoints: 50, status: 'open' },
  { legacyId: 'ASS002', courseLegacyId: 'CS101',   title: 'Quiz 1: Fundamentals',                        type: 'quiz',       description: 'Timed quiz covering chapters 1-3',                                          dueDate: '2025-02-22', maxPoints: 30, status: 'open' },
  { legacyId: 'ASS003', courseLegacyId: 'CS101',   title: 'Midterm Exam',                                type: 'exam',       description: 'Comprehensive exam covering first half of course material',                 dueDate: '2025-03-22', maxPoints: 100,status: 'upcoming' },
  { legacyId: 'ASS004', courseLegacyId: 'CS301',   title: 'Project 1: Implement Binary Search Tree',     type: 'project',    description: 'Implement and test a complete binary search tree with traversal methods',   dueDate: '2025-02-28', maxPoints: 75, status: 'open' },
  { legacyId: 'ASS005', courseLegacyId: 'CS301',   title: 'Quiz 2: Trees and Graphs',                    type: 'quiz',       description: 'Quiz on tree structures and graph algorithms',                              dueDate: '2025-03-08', maxPoints: 30, status: 'open' },
  { legacyId: 'ASS006', courseLegacyId: 'MATH201', title: 'Problem Set 4: Integration Techniques',       type: 'assignment', description: 'Set of 20 problems on various integration techniques',                      dueDate: '2025-02-20', maxPoints: 40, status: 'open' },
  { legacyId: 'ASS007', courseLegacyId: 'CS101',   title: 'Assignment 2: Functions',                     type: 'assignment', description: 'Practice writing functions and using parameters/return values',              dueDate: '2026-02-27', maxPoints: 50, status: 'open' },
  { legacyId: 'ASS008', courseLegacyId: 'CS301',   title: 'Quiz 3: Graph Traversal',                     type: 'quiz',       description: 'BFS/DFS concepts and complexity questions',                                 dueDate: '2026-03-01', maxPoints: 30, status: 'open' },
  { legacyId: 'ASS009', courseLegacyId: 'MATH201', title: 'Problem Set 5: Applications of Integration',  type: 'assignment', description: 'Area, volume, and applications practice problems',                          dueDate: '2026-03-04', maxPoints: 40, status: 'upcoming' },
];

// Grades: { studentLegacy, assessmentLegacy, score, submittedAt }
const gradesData = [
  { studentLegacy: 'USR001', assessmentLegacy: 'ASS001', score: 48, submittedAt: '2025-02-14' },
  { studentLegacy: 'USR001', assessmentLegacy: 'ASS002', score: 28, submittedAt: '2025-02-22' },
  { studentLegacy: 'USR001', assessmentLegacy: 'ASS004', score: 72, submittedAt: '2025-02-27' },
  { studentLegacy: 'USR001', assessmentLegacy: 'ASS006', score: 38, submittedAt: '2025-02-19' },
  { studentLegacy: 'USR002', assessmentLegacy: 'ASS001', score: 50, submittedAt: '2025-02-13' },
  { studentLegacy: 'USR002', assessmentLegacy: 'ASS002', score: 30, submittedAt: '2025-02-21' },
  { studentLegacy: 'USR003', assessmentLegacy: 'ASS006', score: 34, submittedAt: '2025-02-20' },
];

async function seed() {
  await connectDB();

  console.log('Clearing existing data...');
  await Promise.all([
    User.deleteMany(),
    Course.deleteMany(),
    Assessment.deleteMany(),
    Grade.deleteMany(),
    Enrollment.deleteMany(),
  ]);

  console.log('Seeding users...');
  const userMap = {}; // legacyId -> MongoDB _id
  for (const u of usersData) {
    const created = await User.create({
      firstName:       u.firstName,
      lastName:        u.lastName,
      email:           u.email,
      password:        u.password,
      role:            u.role,
      major:           u.major || '',
      gpa:             u.gpa || 0,
      enrolledCourses: u.enrolledCourses || [],
      department:      u.department || '',
      teachingCourses: u.teachingCourses || [],
    });
    userMap[u.legacyId] = created._id;
    console.log(`  Created user: ${u.email}`);
  }

  console.log('Seeding courses...');
  const courseMap = {}; // legacyId -> MongoDB _id
  for (const c of coursesData) {
    const created = await Course.create({
      code:            c.code,
      title:           c.title,
      description:     c.description,
      instructor:      userMap[c.instructorLegacyId],
      credits:         c.credits,
      maxCapacity:     c.maxCapacity,
      enrollmentCount: c.enrollmentCount,
      isActive:        c.isActive,
      semester:        c.semester,
      startDate:       c.startDate,
      endDate:         c.endDate,
      meetingTime:     c.meetingTime,
      location:        c.location,
    });
    courseMap[c.legacyId] = created._id;
    console.log(`  Created course: ${c.code}`);
  }

  console.log('Seeding enrollments...');
  const enrollmentCourses = { USR001: ['CS101','MATH201','CS301'], USR002: ['CS101','CS301'], USR003: ['MATH201'] };
  for (const [studentLegacy, codes] of Object.entries(enrollmentCourses)) {
    for (const code of codes) {
      await Enrollment.create({
        studentId: userMap[studentLegacy],
        courseId:  courseMap[code],
      });
    }
  }

  console.log('Seeding assessments...');
  const assessmentMap = {}; // legacyId -> MongoDB _id
  for (const a of assessmentsData) {
    const created = await Assessment.create({
      courseId:    courseMap[a.courseLegacyId],
      title:       a.title,
      type:        a.type,
      description: a.description,
      dueDate:     a.dueDate,
      maxPoints:   a.maxPoints,
      status:      a.status,
    });
    assessmentMap[a.legacyId] = created._id;
    console.log(`  Created assessment: ${a.title}`);
  }

  console.log('Seeding grades...');
  for (const g of gradesData) {
    const assessment = await Assessment.findById(assessmentMap[g.assessmentLegacy]);
    await Grade.create({
      studentId:    userMap[g.studentLegacy],
      assessmentId: assessmentMap[g.assessmentLegacy],
      courseId:     assessment.courseId,
      score:        g.score,
      status:       'completed',
      submittedAt:  new Date(g.submittedAt),
    });
  }

  console.log('\nSeed complete!');
  console.log('Demo credentials:');
  console.log('  Student:    john.doe@university.edu    / password123');
  console.log('  Student:    jane.smith@university.edu  / password123');
  console.log('  Instructor: m.brown@university.edu     / password123');
  console.log('  Admin:      admin@university.edu       / admin123');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
