const Company = require('../models/Company');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../config/jwt');

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
 * Register a new company (with random password generation)
 */
exports.registerCompany = async (req, res) => {
  const { name, email, phone, employeeSize } = req.body;  // No password from frontend

  try {
    // Check if the company already exists
    const existingCompany = await Company.findOne({ email });
    if (existingCompany) {
      return res.status(400).json({ error: 'Company already registered' });
    }

    // Generate a random password
    const randomPassword = generateRandomPassword(); 

    // Hash the random password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(randomPassword, salt);

    // Create and save new company
    const newCompany = new Company({
      name,
      email,
      phone,
      passwordHash: hashedPassword,  // Save the hashed random password
      employeeSize,
      isVerified: false  // Set to false initially
    });
    const company = await newCompany.save();

    // Optionally, you could return the random password here (for testing)
    res.status(201).json({ message: 'Company registered successfully', randomPassword });
  } catch (error) {
    console.error('Error registering company:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Company login (with token generation)
 */
exports.loginCompany = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find company by email
    const company = await Company.findOne({ email });
    if (!company) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, company.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token with only companyId and email
    const token = generateToken({
      companyId: company._id,
      email: company.email
    });

    res.status(200).json({
      message: 'Login successful',
      token
    });
  } catch (error) {
    console.error('Error logging in company:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
