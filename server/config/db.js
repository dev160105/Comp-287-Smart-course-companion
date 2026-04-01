const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-course-companion';
  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    console.error('Make sure MongoDB is running. Install from https://www.mongodb.com/try/download/community');
    console.error('Or use MongoDB Atlas: https://www.mongodb.com/cloud/atlas');
    process.exit(1);
  }
};

module.exports = connectDB;
