// services/mailService.js
const nodemailer = require('../config/mail');  // Import the Nodemailer transporter

/**
 * Sends an email using Nodemailer
 * @param {string} to - Recipient's email address
 * @param {string} subject - Subject of the email
 * @param {string} html - Body content of the email (HTML format)
 */
const sendEmail = async (to, subject, html) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,  // Sender's email
    to,                            // Recipient's email
    subject,                       // Email subject
    html                           // Email body (HTML format)
  };

  try {
    // Send the email
    await nodemailer.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
    throw new Error('Email could not be sent');
  }
};

module.exports = { sendEmail };
