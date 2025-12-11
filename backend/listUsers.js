require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/db');

const listUsers = async () => {
  await connectDB();
  try {
    const users = await User.find({}, 'name email isAdmin createdAt');
    console.log('Users in database:');
    users.forEach(user => {
      console.log(`- Name: ${user.name}, Email: ${user.email}, Admin: ${user.isAdmin}, Created: ${user.createdAt}`);
    });
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

listUsers();