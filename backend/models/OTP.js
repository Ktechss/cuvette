// models/OTP.js
const mongoose = require('mongoose');

const OTPSchema = new mongoose.Schema({
  otp: { type: String, required: true },            // The actual OTP code
  email: { type: String, required: true },          // Email address the OTP is sent to
  companyName: { type: String, required: true },    // Company name
  phone: { type: String, required: true },          // Company phone number
  employeeSize: { type: String, required: true },   // Employee size (from the registration form)
  otpExpiresAt: { type: Date, required: true },     // Expiry time for the OTP
  createdAt: { type: Date, default: Date.now }      // When the OTP record was created
});

module.exports = mongoose.model('OTP', OTPSchema);
