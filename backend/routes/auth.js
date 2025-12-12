const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Import auth middleware
const { 
  register, 
  login, 
  getProfile, 
  updateProfile 
} = require('../controllers/authController');

// Define Routes
router.post('/register', register);
router.post('/login', login);

// New Profile Routes
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);

module.exports = router;