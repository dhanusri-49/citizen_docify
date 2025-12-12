import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Upload from './pages/Upload';
import Dashboard from './pages/Dashboard';
import Summary from './pages/Summary';
import Eligibility from './pages/Eligibility'; 
import Profile from './pages/Profile'; // 👈 Import Profile Page
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/summary/:id" element={<Summary />} />
            <Route path="/eligibility" element={<Eligibility />} />
            {/* 👇 Added the Profile Route here */}
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;