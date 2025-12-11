import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 p-4 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">Docify</Link>
        <div className="space-x-4">
          {user ? (
            <>
              <Link to="/upload" className="hover:underline">New Upload</Link>
              {/* 👇 Added this line */}
              <Link to="/eligibility" className="hover:underline">Check Eligibility</Link> 
              <Link to="/dashboard" className="hover:underline">My Docs</Link>
              <button onClick={handleLogout} className="bg-blue-800 px-3 py-1 rounded">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">Login</Link>
              <Link to="/signup" className="hover:underline">Signup</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;