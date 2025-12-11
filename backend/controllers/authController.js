const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. REGISTER USER
exports.register = async (req, res) => {
  // 👇 Force email to lowercase immediately
  const name = req.body.name;
  const email = req.body.email.toLowerCase().trim(); 
  const password = req.body.password;

  try {
    console.log("--- REGISTERING ---");
    console.log("Email:", email);
    console.log("Password:", password);

    let user = await User.findOne({ email });
    if (user) {
      console.log("❌ User already exists");
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();
    console.log("✅ User Saved. Hash:", hashedPassword.substring(0, 10) + "...");

    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET_TOKEN, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error("Server Error:", err.message);
    res.status(500).send('Server Error');
  }
};

// 2. LOGIN USER
exports.login = async (req, res) => {
  // 👇 Force email to lowercase immediately
  const email = req.body.email.toLowerCase().trim();
  const password = req.body.password;

  try {
    console.log("--- LOGGING IN ---");
    console.log("Email:", email);
    console.log("Password Input:", password);

    // 1. Find User
    let user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User NOT found in DB");
      return res.status(400).json({ message: 'Invalid Credentials (User not found)' });
    }
    console.log("✅ User Found. ID:", user._id);

    // 2. Check Password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password Match Result:", isMatch); // True or False

    if (!isMatch) {
      console.log("❌ Password Mismatch");
      return res.status(400).json({ message: 'Invalid Credentials (Wrong Password)' });
    }

    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET_TOKEN, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error("Server Error:", err.message);
    res.status(500).send('Server Error');
  }
};