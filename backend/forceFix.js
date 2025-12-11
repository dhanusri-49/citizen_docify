require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const runFix = async () => {
  // 1. Setup the specific user we want
  const email = 'admin@docify.com';
  const password = '123';

  try {
    // 2. Connect to the SAME database your server uses
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("✅ Connected to MongoDB for maintenance.");

    // 3. Delete any existing version of this user to avoid conflicts
    await User.deleteOne({ email });
    console.log(`🗑️  Cleaned up old data for ${email}`);

    // 4. Create the new user with a fresh password hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name: 'Admin User',
      email: email,
      password: hashedPassword
    });

    await newUser.save();
    console.log(`✅ SUCCESS: Created user ${email} with password ${password}`);
    
    // 5. Double check it exists
    const check = await User.findOne({ email });
    if(check) {
        console.log("🔍 Verified: User is definitely in the database now.");
    }

    process.exit();
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
};

runFix();