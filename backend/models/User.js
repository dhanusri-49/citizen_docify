const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  
  // New Profile Fields
  photo: { type: String, default: '' }, // Stores URL or Base64 string
  dob: { type: String, default: '' },
  mobile: { type: String, default: '' },
  aadhaar: { type: String, default: '' },
  pan: { type: String, default: '' },
  district: { type: String, default: '' },
  state: { type: String, default: '' },
  pincode: { type: String, default: '' },
  category: { type: String, default: 'General' },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);