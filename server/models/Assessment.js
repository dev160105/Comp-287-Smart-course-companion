const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema(
  {
    courseId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    title:       { type: String, required: true, trim: true },
    type:        { type: String, enum: ['assignment', 'quiz', 'lab', 'exam', 'project'], required: true },
    description: { type: String, default: '' },
    dueDate:     { type: String, required: true },
    maxPoints:   { type: Number, required: true, min: 1 },
    weight:      { type: Number, default: 0 },
    status:      { type: String, enum: ['open', 'upcoming', 'closed'], default: 'upcoming' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Assessment', assessmentSchema);
