// models/Company.js
const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  passwordHash: { type: String, required: true },  // Hashed password for authentication
  isVerified: { type: Boolean, default: false },   // Indicates if the company is verified
  employeeSize: { type: String, required: true },  // Size of the company (e.g., small, medium, large)
  jobsPosted: [{ type: mongoose.Schema.Types.ObjectId, ref: 'JobPost' }],  // Reference to the jobs posted by the company
  createdAt: { type: Date, default: Date.now },     // Timestamp when the company was created
  updatedAt: { type: Date, default: Date.now }      // Timestamp when the company was last updated
});

module.exports = mongoose.model('Company', CompanySchema);
