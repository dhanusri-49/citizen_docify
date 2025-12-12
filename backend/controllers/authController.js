const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. REGISTER USER
exports.register = async (req, res) => {
  // Force email to lowercase immediately
  const name = req.body.name;
  const email = req.body.email.toLowerCase().trim(); 
  const password = req.body.password;

  try {
    console.log("--- REGISTERING ---");
    console.log("Email:", email);

    let user = await User.findOne({ email });
    if (user) {
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
    console.log("✅ User Saved Successfully");

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
  const email = req.body.email.toLowerCase().trim();
  const password = req.body.password;

  try {
    console.log("--- LOGGING IN ---");
    console.log("Email:", email);

    // Find User
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid Credentials (User not found)' });
    }

    // Check Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials (Wrong Password)' });
    }

    console.log("✅ Login Successful");
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

// 3. GET PROFILE
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// 4. UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const { 
      name, dob, mobile, aadhaar, pan, 
      district, state, pincode, category 
    } = req.body;

    // Build profile object dynamically
    const profileFields = {};
    if (name) profileFields.name = name;
    if (dob) profileFields.dob = dob;
    if (mobile) profileFields.mobile = mobile;
    if (aadhaar) profileFields.aadhaar = aadhaar;
    if (pan) profileFields.pan = pan;
    if (district) profileFields.district = district;
    if (state) profileFields.state = state;
    if (pincode) profileFields.pincode = pincode;
    if (category) profileFields.category = category;

    // Update the user
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: profileFields },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};