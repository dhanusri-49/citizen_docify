const jwt = require('jsonwebtoken');
require('dotenv').config();

// Test token generation and verification
console.log('JWT_SECRET_TOKEN:', process.env.JWT_SECRET_TOKEN);

// Create a test token
const payload = { user: { id: 'test-user-id' } };
const token = jwt.sign(payload, process.env.JWT_SECRET_TOKEN, { expiresIn: '1h' });
console.log('Generated token:', token);

// Try to verify the token
try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
  console.log('Token verification successful:', decoded);
} catch (err) {
  console.log('Token verification failed:', err.message);
}