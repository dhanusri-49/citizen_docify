import React, { useState, useContext } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { AuthContext } from '../context/AuthContext';
import { UploadCloud, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';

const Upload = () => {
  const { logout } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please select a file');

    const formData = new FormData();
    formData.append('document', file);

    setLoading(true);
    try {
      const res = await API.post('/docs/upload', formData);
      setLoading(false);
      navigate(`/summary/${res.data._id}`, { state: { doc: res.data } });
    } catch (err) {
      console.error(err);
      setLoading(false);
      const serverMessage = err.response?.data?.message || err.message || "Unknown Error";
      alert(`UPLOAD FAILED: ${serverMessage}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar logout={handleLogout} />

      <main className="ml-64 flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Upload Document</h1>
        <p className="text-gray-500 mb-8">Upload a government form (PDF/Image) to let AI simplify it for you.</p>

        <div className="max-w-3xl bg-white rounded-xl shadow-sm border border-gray-200 p-10 text-center">
            
            <form onSubmit={handleUpload} className="space-y-6">
                <div className="border-2 border-dashed border-blue-200 bg-blue-50 rounded-2xl p-10 transition hover:border-blue-400 hover:bg-blue-100 flex flex-col items-center justify-center cursor-pointer relative">
                    <input 
                        type="file" 
                        accept=".pdf,.png,.jpg,.jpeg" 
                        onChange={(e) => setFile(e.target.files[0])} 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                        <UploadCloud className="text-blue-600" size={32} />
                    </div>
                    {file ? (
                        <div className="flex items-center gap-2 text-green-700 font-medium">
                            <CheckCircle2 size={20} />
                            {file.name}
                        </div>
                    ) : (
                        <>
                            <p className="text-lg font-semibold text-gray-700">Click to upload or drag and drop</p>
                            <p className="text-sm text-gray-500 mt-1">PDF, PNG, JPG (Max 10MB)</p>
                        </>
                    )}
                </div>

                <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-lg flex gap-3 text-left">
                    <AlertCircle className="text-yellow-600 shrink-0" size={20} />
                    <p className="text-sm text-yellow-800">
                        <strong>Privacy Note:</strong> Your documents are processed securely. Do not upload sensitive financial passwords.
                    </p>
                </div>

                <button 
                    disabled={loading || !file}
                    className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition ${
                        loading || !file 
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                    }`}
                >
                    {loading ? (
                        /* 👇 UPDATED TEXT HERE */
                        <>Analysing... <span className="animate-pulse">⏳</span></>
                    ) : (
                        <><FileText size={20} /> Analyze & Simplify</>
                    )}
                </button>
            </form>

        </div>
      </main>
    </div>
  );
};

export default Upload;