require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/db');

const checkEmailCase = async () => {
  await connectDB();
  try {
    // Check for users with different email cases
    const users = await User.find({}, 'name email');
    console.log('All users and their email cases:');
    users.forEach(user => {
      console.log(`- Name: ${user.name}, Email: "${user.email}", Lowercase: "${user.email.toLowerCase()}"`);
    });
    
    // Specifically check for admin user variations
    const adminVariations = await User.find({
      email: { $regex: /^admin@docify\.com$/i }  // Case insensitive match
    });
    
    console.log('\nAdmin users (case insensitive search):');
    adminVariations.forEach(user => {
      console.log(`- Email: "${user.email}"`);
    });
    
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkEmailCase();