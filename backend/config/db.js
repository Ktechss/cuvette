const mongoose = require('mongoose');
const dotenv = require('dotenv');


dotenv.config();

const connectDB = async () => {
  try {
    // Connect to MongoDB without deprecated options
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);  // Exit if MongoDB connection fails
  }
};

module.exports = connectDB;
