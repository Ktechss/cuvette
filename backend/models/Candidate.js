// models/Candidate.js
const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },  // Candidate email
  name: { type: String, required: true },                 // Candidate name
  jobsApplied: [{ type: mongoose.Schema.Types.ObjectId, ref: 'JobPost' }],  // List of jobs the candidate has applied for
  status: { type: String, default: 'Notified' },          // Status of the candidate (e.g., "Applied", "Hired")
  createdAt: { type: Date, default: Date.now }            // When the candidate was added to the system
});

module.exports = mongoose.model('Candidate', CandidateSchema);
