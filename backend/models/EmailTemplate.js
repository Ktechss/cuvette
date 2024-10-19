// models/EmailTemplate.js
const mongoose = require('mongoose');

const EmailTemplateSchema = new mongoose.Schema({
  templateName: { type: String, required: true, unique: true },  // Name of the template (e.g., "OTP Verification")
  subject: { type: String, required: true },                     // Subject of the email
  body: { type: String, required: true },                        // Body of the email (with placeholders like {{name}}, {{otp}})
  placeholders: { type: [String], required: true }               // List of placeholders (e.g., ["name", "otp"])
});

module.exports = mongoose.model('EmailTemplate', EmailTemplateSchema);
