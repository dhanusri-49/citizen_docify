import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Upload from './pages/Upload';
import Dashboard from './pages/Dashboard';
import Summary from './pages/Summary';
import Eligibility from './pages/Eligibility'; // 👈 Import the new page
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
            {/* 👇 Added the Eligibility Route here */}
            <Route path="/eligibility" element={<Eligibility />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;