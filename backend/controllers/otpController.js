const OTP = require('../models/OTP');
const Company = require('../models/Company');
const { sendEmail } = require('../services/mailService');
const { generateToken } = require('../config/jwt');
const bcrypt = require('bcryptjs');  // Import bcrypt for password hashing
const crypto = require('crypto');

// Generates a random OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Helper function to generate random password
const generateRandomPassword = (length = 8) => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

/**
 * Generate OTP and send it to the email
 */
exports.generateOTP = async (req, res) => {
  const { email, companyName, phone, employeeSize } = req.body;

  try {
    // Check if the company already exists
    const existingCompany = await Company.findOne({ email });
    if (existingCompany) {
      return res.status(400).json({ error: 'Company already registered' });
    }

    // Generate OTP and save
    const otp = generateOTP();
    const otpRecord = new OTP({
      otp,
      companyName,
      email,
      phone,
      employeeSize,
      otpExpiresAt: Date.now() + 10 * 60 * 1000  // OTP expires in 10 minutes
    });
    await otpRecord.save();

    // Send OTP via email
    const subject = 'Your OTP for Company Registration';
    const html = `<p>Your OTP is <strong>${otp}</strong>. It will expire in 10 minutes.</p>`;
    await sendEmail(email, subject, html);

    res.status(200).json({ message: 'OTP sent to your email' });
  } catch (error) {
    console.error('Error generating OTP:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Verify the OTP entered by the user
 */
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    console.log("Email:", email);  // Log email for debugging
    console.log("OTP (input):", otp);  // Log input OTP for debugging

    // Find OTP record (ensure otp is cast to string)
    const otpRecord = await OTP.findOne({ email, otp: otp.toString() });

    console.log("OTP Record found:", otpRecord);  // Log the found record

    if (!otpRecord) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // Check if OTP is expired
    if (Date.now() > otpRecord.otpExpiresAt) {
      return res.status(400).json({ error: 'OTP has expired' });
    }

    // Generate a random password
    const randomPassword = generateRandomPassword();  // Generate a random password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(randomPassword, salt);  // Hash the password

    // Create new company
    const newCompany = new Company({
      name: otpRecord.companyName,
      email: otpRecord.email,
      phone: otpRecord.phone,
      employeeSize: otpRecord.employeeSize,
      passwordHash: hashedPassword,  // Set the hashed password
      isVerified: true  // Verified after OTP validation
    });
    await newCompany.save();

    // Remove OTP record after verification
    await OTP.deleteOne({ email });

    // Convert the Mongoose document to a plain object before generating the token
    const companyObject = newCompany.toObject();

    // Generate JWT token and respond
    const token = generateToken({ companyId: companyObject._id, email: companyObject.email });

    // Optionally send the password to the company email
    const subject = 'Your Company Account Password';
    const html = `<p>Your company has been registered successfully. Here is your temporary password: <strong>${randomPassword}</strong>. Please change it after logging in.</p>`;
    await sendEmail(email, subject, html);  // Send the password via email

    res.status(201).json({ message: 'Company registered and verified', token });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ error: 'Server error' });
  }
};