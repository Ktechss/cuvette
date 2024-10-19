const express = require('express');
const { generateOTP, verifyOTP } = require('../controllers/otpController');  // Make sure this path is correct

const router = express.Router();

// Define the routes
router.post('/generate', generateOTP);  // POST request to generate OTP
router.post('/verify', verifyOTP);      // POST request to verify OTP

module.exports = router;
