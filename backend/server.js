const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');  // Import CORS middleware
const helmet = require('helmet');  // For basic security improvements
const connectDB = require('./config/db');

// Load environment variables from .env
dotenv.config();

// Import routes
const companyRoutes = require('./routes/companyRoutes');
const otpRoutes = require('./routes/otpRoutes');
const jobPostRoutes = require('./routes/jobPostRoutes');
const candidateRoutes = require('./routes/candidateRoutes');

// Initialize the Express application
const app = express();

// Connect to the MongoDB database
connectDB();

// Security middleware
app.use(helmet());  // Provides basic protection (like setting HTTP headers)

// Use CORS middleware - you can restrict it to certain origins if needed
app.use(cors());

// Middleware to parse JSON request bodies
app.use(express.json());

// Health check route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Register route middlewares
app.use('/api/companies', companyRoutes);       // Company routes (register, login)
app.use('/api/otp', otpRoutes);                 // OTP routes (generate, verify)
app.use('/api/jobPosts', jobPostRoutes);        // Job post routes (create, list)
app.use('/api/candidates', candidateRoutes);    // Candidate routes (apply, list)

// Error handling middleware (for better debugging)
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Define the port from environment variables or use default (5000)
const PORT = process.env.PORT || 5000;
const ENV = process.env.NODE_ENV || 'development';  // Log environment

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server running in ${ENV} mode on port ${PORT}`);
});

