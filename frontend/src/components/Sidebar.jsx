import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Upload, 
  FileText, 
  CheckCircle, 
  Bell, 
  HelpCircle, 
  LogOut 
} from 'lucide-react';

const Sidebar = ({ logout }) => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'Upload Document', icon: <Upload size={20} />, path: '/upload' },
    { name: 'Eligibility Check', icon: <CheckCircle size={20} />, path: '/eligibility' },
    { name: 'Notifications', icon: <Bell size={20} />, path: '#' },
    { name: 'Help', icon: <HelpCircle size={20} />, path: '#' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-64 bg-white h-screen border-r border-gray-200 flex flex-col fixed left-0 top-0 overflow-y-auto z-50">
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
          <FileText className="fill-blue-600 text-white" /> Docify
        </h1>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive(item.path) 
                ? 'bg-blue-50 text-blue-600 font-medium' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {item.icon}
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg text-left transition"
        >
          <LogOut size={20} /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;