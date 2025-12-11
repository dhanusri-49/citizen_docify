import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8060/api', // Matches Backend PORT
});

API.interceptors.request.use((req) => {
  if (localStorage.getItem('token')) {
    req.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  }
  return req;
});

export default API;