const axios = require('axios');

async function testLogin() {
  try {
    console.log('Testing login with credentials:');
    console.log('Email: admin@docify.com');
    console.log('Password: admin123');
    
    const response = await axios.post('http://localhost:8060/api/auth/login', {
      email: 'admin@docify.com',
      password: 'admin123'
    });
    console.log('Login successful:', response.data);
  } catch (error) {
    console.log('Login failed:');
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
      console.log('Headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.log('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error:', error.message);
    }
  }
}

testLogin();