import React, { useEffect, useState, useContext } from 'react';
import API from '../services/api';
import Sidebar from '../components/Sidebar';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { 
  UploadCloud, 
  FileCheck, 
  AlertTriangle, 
  Clock, 
  Search, 
  Eye 
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/docs/my-documents')
      .then(res => {
        setDocs(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const totalDocs = docs.length;
  const outdatedDocs = docs.filter(d => d.version && d.version.toLowerCase().includes('unknown')).length;
  const pendingActions = docs.filter(d => d.requiredAttachments && d.requiredAttachments.length > 0).length;

  const getStatus = (doc) => {
    if (doc.version === 'Unknown') return { label: 'Outdated', color: 'bg-red-100 text-red-700' };
    if (doc.requiredAttachments?.length > 0) return { label: 'Action Needed', color: 'bg-yellow-100 text-yellow-700' };
    return { label: 'Ready', color: 'bg-green-100 text-green-700' };
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <Sidebar logout={handleLogout} />

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8">
        <header className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Hello, {user?.name || 'User'}! 👋</h1>
            <p className="text-gray-500 mt-1">Welcome to your document command center.</p>
          </div>
          <Link to="/upload" className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition shadow-sm font-medium">
            <UploadCloud size={18} /> Upload New
          </Link>
        </header>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
             <div className="flex justify-between items-start mb-4"><div className="p-3 rounded-lg bg-blue-50"><FileCheck className="text-blue-600"/></div></div>
             <h4 className="text-gray-500 text-sm font-medium">Total Documents</h4>
             <h2 className="text-3xl font-bold text-gray-800 mt-1">{totalDocs}</h2>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
             <div className="flex justify-between items-start mb-4"><div className="p-3 rounded-lg bg-green-50"><Search className="text-green-600"/></div></div>
             <h4 className="text-gray-500 text-sm font-medium">Parsed Successfully</h4>
             <h2 className="text-3xl font-bold text-gray-800 mt-1">{totalDocs}</h2>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
             <div className="flex justify-between items-start mb-4"><div className="p-3 rounded-lg bg-red-50"><AlertTriangle className="text-red-600"/></div></div>
             <h4 className="text-gray-500 text-sm font-medium">Outdated Forms</h4>
             <h2 className="text-3xl font-bold text-gray-800 mt-1">{outdatedDocs}</h2>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
             <div className="flex justify-between items-start mb-4"><div className="p-3 rounded-lg bg-orange-50"><Clock className="text-orange-600"/></div></div>
             <h4 className="text-gray-500 text-sm font-medium">Pending Actions</h4>
             <h2 className="text-3xl font-bold text-gray-800 mt-1">{pendingActions}</h2>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800">Recent Documents</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">Document Name</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {docs.map((doc) => {
                  const status = getStatus(doc);
                  return (
                    <tr key={doc._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-medium text-gray-800">{doc.originalName}</td>
                      <td className="px-6 py-4 text-gray-600">{doc.docType}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => navigate(`/summary/${doc._id}`, { state: { doc } })}
                          className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};
 
export default Dashboard;