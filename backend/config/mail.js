// config/mail.js
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

// Load environment variables from the .env file
dotenv.config();

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail',  // You can replace 'gmail' with 'SendGrid', 'Mailgun', etc.
  auth: {
    user: process.env.EMAIL_USER,  // Email user (e.g., Gmail email)
    pass: process.env.EMAIL_PASS,  // Email password or SMTP API key
  },
});

module.exports = transporter;

