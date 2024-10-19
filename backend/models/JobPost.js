const mongoose = require('mongoose');

const JobPostSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },  // Reference to the company that posted the job
  title: { type: String, required: true },        // Job title (e.g., "Frontend Developer")
  description: { type: String, required: true },  // Job description
  experienceLevel: { type: String, required: true },  // Required experience level (e.g., "Mid-level")
  candidates: [{ type: String }],  // Array of candidate emails
  endDate: { type: Date, required: true },        // Application end date
  createdAt: { type: Date, default: Date.now }    // When the job post was created
});

module.exports = mongoose.model('JobPost', JobPostSchema);
