// src/models/User.js
// Phase 2: MongoDB User Schema

/*
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }, // hashed
  role: { type: String, enum: ['student', 'instructor', 'admin'], required: true },
  enrolledCourses: [{ type: String }], // For students
  teachingCourses: [{ type: String }], // For instructors
  department: String,
  major: String,
  gpa: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('User', userSchema);
*/

export const UserSchema = {
  description: 'User model schema (to be implemented in Phase 2)',
};
