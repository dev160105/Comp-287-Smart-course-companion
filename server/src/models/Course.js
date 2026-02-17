// src/models/Course.js
// Phase 2: MongoDB Course Schema

/*
import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  code: { type: String, unique: true, required: true },
  title: { type: String, required: true },
  description: String,
  instructor: { type: String, required: true }, // User ID
  semester: String,
  credits: { type: Number, required: true },
  enrollmentCount: { type: Number, default: 0 },
  maxCapacity: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  startDate: Date,
  endDate: Date,
  meetingTime: String,
  location: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Course', courseSchema);
*/

export const CourseSchema = {
  description: 'Course model schema (to be implemented in Phase 2)',
};
