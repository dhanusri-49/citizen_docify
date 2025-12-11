require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const connectDB = require('./config/db');

const seedAdmin = async () => {
  await connectDB();
  try {
    const email = 'admin@docify.com';
    const exists = await User.findOne({ email });
    if (exists) {
      console.log('Admin already exists.');
      process.exit();
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    await User.create({
      name: 'System Admin',
      email: email,
      password: hashedPassword,
      isAdmin: true
    });
    console.log(`Admin User Created -> Email: ${email} | Pass: admin123`);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedAdmin();