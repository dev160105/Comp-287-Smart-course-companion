// src/utils/dataLoader.js
// Phase 2: fetch data from the Express/MongoDB backend via Axios

import api from './api';

// Normalize a course from MongoDB format to what components expect
const normalizeCourse = (c) => ({
  ...c,
  id: c._id || c.id,
  instructor: c.instructor
    ? typeof c.instructor === 'object'
      ? `${c.instructor.firstName} ${c.instructor.lastName}`
      : c.instructor
    : 'N/A',
});

// Normalize an assessment from MongoDB format
const normalizeAssessment = (a) => ({
  ...a,
  id: a._id || a.id,
  courseId: a.courseId?._id || a.courseId,
  courseCode: a.courseId?.code || a.courseCode,
  courseTitle: a.courseId?.title || a.courseTitle,
});

export const loadCourses = async () => {
  const res = await api.get('/api/courses');
  return res.data.map(normalizeCourse);
};

export const loadAssessments = async () => {
  const res = await api.get('/api/assessments');
  return res.data.map(normalizeAssessment);
};

// Returns { courses: [...], overallGPA }
// Each course: { courseId, code, title, credits, assessments, currentGrade, average, gpaPoints }
export const loadGrades = async (studentId) => {
  const res = await api.get(`/api/grades/student/${studentId}`);
  return res.data;
};

export const upsertStudentAssessment = async (assessmentId, payload) => {
  const res = await api.post(`/api/grades/assessment/${assessmentId}/status`, payload);
  return res.data;
};

export const enrollInCourse = async (courseId) => {
  const res = await api.post(`/api/courses/${courseId}/enroll`);
  return res.data;
};

export const unenrollFromCourse = async (courseId) => {
  const res = await api.delete(`/api/courses/${courseId}/enroll`);
  return res.data;
};

export const triggerReminderEmail = async (studentId) => {
  const res = await api.post(`/api/grades/student/${studentId}/reminders/email`);
  return res.data;
};

const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const downloadGradesCsv = async (studentId) => {
  const res = await api.get(`/api/grades/student/${studentId}/export.csv`, { responseType: 'blob' });
  downloadBlob(res.data, 'grades-export.csv');
};

export const downloadGradesPdf = async (studentId) => {
  const res = await api.get(`/api/grades/student/${studentId}/export.pdf`, { responseType: 'blob' });
  downloadBlob(res.data, 'grades-export.pdf');
};

export const loadUsers = async () => {
  const res = await api.get('/api/users');
  return res.data.map(u => ({ ...u, id: u._id || u.id }));
};

export const getCourseById = async (courseId) => {
  const res = await api.get(`/api/courses/${courseId}`);
  return normalizeCourse(res.data);
};

export const getAssessmentsByCourse = async (courseId) => {
  const res = await api.get(`/api/assessments/course/${courseId}`);
  return res.data.map(normalizeAssessment);
};

export const getUserStats = async () => {
  const res = await api.get('/api/users/stats');
  return res.data;
};
