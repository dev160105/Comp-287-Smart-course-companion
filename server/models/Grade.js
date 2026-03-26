const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema(
  {
    studentId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assessmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assessment', required: true },
    courseId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    score:        { type: Number, default: null, min: 0 },
    status:       { type: String, enum: ['pending', 'completed'], default: 'pending' },
    feedback:     { type: String, default: '' },
    submittedAt:  { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// A student can only have one grade per assessment
gradeSchema.index({ studentId: 1, assessmentId: 1 }, { unique: true });

module.exports = mongoose.model('Grade', gradeSchema);
