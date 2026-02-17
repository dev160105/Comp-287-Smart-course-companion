// src/models/Grade.js
// Phase 2: MongoDB Grade Schema

/*
import mongoose from 'mongoose';

const gradeSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  studentId: { type: String, required: true },
  courseId: { type: String, required: true },
  assessments: [{
    assessmentId: String,
    title: String,
    pointsEarned: Number,
    maxPoints: Number,
    percentage: Number,
    submissionDate: Date,
  }],
  currentGrade: String, // A, A-, B+, B, etc.
  gpa: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Grade', gradeSchema);
*/

export const GradeSchema = {
  description: 'Grade model schema (to be implemented in Phase 2)',
};
