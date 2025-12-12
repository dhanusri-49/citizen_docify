import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      // Show more detailed error message
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'Login failed. Please try again.';
      alert(`Login Failed: ${errorMessage}`);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input 
            id="email"
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
            placeholder="Email" 
            type="email"
            value={form.email}
            onChange={e => setForm({...form, email: e.target.value})} 
            required 
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input 
            id="password"
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
            placeholder="Password" 
            type="password"
            value={form.password}
            onChange={e => setForm({...form, password: e.target.value})} 
            required 
          />
        </div>
        
        <button 
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 font-bold transition duration-200"
          type="submit"
        >
          Login
        </button>
        
        <p className="text-center text-sm mt-4">
          Don't have an account? <Link to="/signup" className="text-blue-600 hover:text-blue-800">Sign Up</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;