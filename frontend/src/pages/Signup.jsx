import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      // 👇 THIS IS THE FIX: Show the real error from the backend
      const errorMessage = err.response?.data?.message || "Registration failed. Please check the backend terminal.";
      alert(errorMessage);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
        
        <input 
          className="w-full border p-2 mb-4" 
          placeholder="Full Name" 
          type="text"
          value={form.name}
          onChange={e => setForm({...form, name: e.target.value})} 
          required 
        />
        
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
        
        <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 font-bold transition">
          Create Account
        </button>
      </form>
    </div>
  );
};

export default Signup;