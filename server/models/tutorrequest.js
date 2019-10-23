const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');

// TutorRequest
const TutorRequestSchema = new mongoose.Schema({
  courseCode: String,
  tutorId: String,
  professor: String,
  wage: Number,
  notes: String
});

TutorRequestSchema.plugin(URLSlugs('courseCode tutorId'));

module.exports = mongoose.model('TutorRequest', TutorRequestSchema);
