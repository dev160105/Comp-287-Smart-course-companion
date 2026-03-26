const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    code:            { type: String, required: true, unique: true, uppercase: true, trim: true },
    title:           { type: String, required: true, trim: true },
    description:     { type: String, default: '' },
    instructor:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    credits:         { type: Number, required: true, min: 1, max: 6 },
    maxCapacity:     { type: Number, required: true, min: 1 },
    enrollmentCount: { type: Number, default: 0 },
    isActive:        { type: Boolean, default: true },
    semester:        { type: String, default: 'Spring 2026' },
    startDate:       { type: String, default: '' },
    endDate:         { type: String, default: '' },
    meetingTime:     { type: String, default: 'TBD' },
    location:        { type: String, default: 'TBD' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);
