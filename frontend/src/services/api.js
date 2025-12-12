import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8060/api', // Matches Backend PORT
});

// 1. Attach Token to every request
API.interceptors.request.use((req) => {
  if (localStorage.getItem('token')) {
    req.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  }
  return req;
});

// 2. Handle Expired Tokens Automatically
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the server says "401 Unauthorized" (Token Invalid/Expired)
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Clear the bad token
      localStorage.removeItem('token');
      // Force redirect to Login page
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;