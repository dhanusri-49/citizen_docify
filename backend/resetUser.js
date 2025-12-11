require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const resetUser = async () => {
  const emailToDelete = 'admin@docify.com'; // 👈 CHANGE THIS to the email you are stuck with

  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("✅ Connected to DB");

    const deleted = await User.findOneAndDelete({ email: emailToDelete });
    
    if (deleted) {
      console.log(`🗑️  Successfully deleted user: ${emailToDelete}`);
      console.log("👉 Now go to the Frontend and Sign Up again with this email.");
    } else {
      console.log(`❌ User ${emailToDelete} was not found. You can just Sign Up directly.`);
    }

    mongoose.connection.close();
  } catch (err) {
    console.error(err);
  }
};

resetUser();
