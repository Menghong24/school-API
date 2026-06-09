const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({

  // 1. Who is this score for?
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student', // Ensure this matches your Student model name
    required: true
  },

  // 2. Which Subject?
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject', // Matches your Subject model name
    required: true
  },

  // 3. Which Class? (Optional, but very useful for filtering reports by class)
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class', // Matches your Class model name
    required: true
  },

  // 4. The Score Data
  score: {
    type: Number,
    required: true,
    min: 0,   // Prevents negative scores
    max: 100, // Optional: Adjust based on your grading scale (e.g., 50, 100)
    default: 0
  },

  // 5. Categorization (When was this score taken?)
  type: {
    type: String,
    enum: ['monthly', 'midterm', 'final', 'quiz', 'assignment'],
    default: 'monthly'
  },

  month: {
    type: String,
    // You can use an enum here if you want strict month names in Khmer or English
    // enum: ['January', 'February', ... 'December'] 
  },

  semester: {
    type: String,
    enum: ['Semester 1', 'Semester 2', 'Summer'],
    default: 'Semester 1'
  },

  academicYear: {
    type: String,
    required: true,
    trim: true // e.g., "2025-2026"
  },

  // 6. Meta
  gradedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher', // Useful to track which teacher input the score
    default: null
  },

  remark: {
    type: String,
    trim: true
  }

}, { timestamps: true });

// COMPOUND INDEX: 
// This prevents entering two scores for the same student, subject, and month in the same year.
// For example: Student A cannot have two 'monthly' scores for 'Math' in 'January 2026'.
scoreSchema.index({ studentId: 1, subjectId: 1, type: 1, month: 1, academicYear: 1 }, { unique: true });

module.exports = mongoose.model('Score', scoreSchema);