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
      console.error(err);
      // 👇 THIS IS THE FIX: Read the specific message from the server
      const serverMessage = err.response?.data?.message || "Login failed";
      alert(`Login Failed: ${serverMessage}`); 
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        
        <input 
          className="w-full border p-2 mb-4" 
          placeholder="Email" 
          type="email"
          value={form.email}
          onChange={e => setForm({...form, email: e.target.value})} 
          required 
        />
        <input 
          className="w-full border p-2 mb-4" 
          placeholder="Password" 
          type="password"
          value={form.password}
          onChange={e => setForm({...form, password: e.target.value})} 
          required 
        />
        
        <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 font-bold mb-4">
          Login
        </button>
        
        <p className="text-center text-sm">
          Don't have an account? <Link to="/signup" className="text-blue-600">Sign Up</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;