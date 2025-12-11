require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/db');

const fixAdmin = async () => {
  await connectDB();
  try {
    const admin = await User.findOne({ email: 'admin@docify.com' });
    if (admin) {
      admin.isAdmin = true;
      await admin.save();
      console.log('Admin user fixed:', admin.name, admin.email, 'isAdmin:', admin.isAdmin);
    } else {
      console.log('Admin user not found');
    }
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

fixAdmin();