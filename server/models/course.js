const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');

// Course
const CourseSchema = new mongoose.Schema({
  // courseName: String,
  courseCode: String,
  availableTutors: [{type: mongoose.Schema.Types.ObjectId, ref:'TutorRequest'}]
});

CourseSchema.plugin(URLSlugs('courseCode'));

module.exports = mongoose.model('Course', CourseSchema);
