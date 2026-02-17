// src/utils/dataLoader.js
// Utility to load mock JSON data

import users from '../data/users.json';
import courses from '../data/courses.json';
import assessments from '../data/assessments.json';
import grades from '../data/grades.json';
import courseStructure from '../data/courseStructure.json';

export const loadUsers = () => users;
export const loadCourses = () => courses;
export const loadAssessments = () => assessments;
export const loadGrades = () => grades;
export const loadCourseStructure = () => courseStructure;

// Helper function to get user by ID
export const getUserById = (userId) => {
  return users.find(user => user.id === userId);
};

// Helper function to get course by ID
export const getCourseById = (courseId) => {
  return courses.find(course => course.id === courseId);
};

// Helper function to get assessments by course
export const getAssessmentsByCourse = (courseId) => {
  return assessments.filter(assessment => assessment.courseId === courseId);
};

// Helper function to get student grades for a course
export const getGradesByStudent = (studentId, courseId) => {
  return grades.find(grade => grade.studentId === studentId && grade.courseId === courseId);
};
