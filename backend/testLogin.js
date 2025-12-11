const axios = require('axios');

async function testLogin() {
  try {
    const response = await axios.post('http://localhost:8060/api/auth/login', {
      email: 'admin@docify.com',
      password: 'admin123'
    });
    console.log('Login successful:', response.data);
  } catch (error) {
    console.log('Login failed:', error.response?.data || error.message);
  }
}

testLogin();