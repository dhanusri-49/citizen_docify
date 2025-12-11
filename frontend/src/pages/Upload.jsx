import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
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
      alert('Upload failed: ' + (err.response?.data?.message || 'Please try again'));
    }
  };

  const handleDrag = function(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = function(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Upload Government Document</h2>
      <form onSubmit={handleUpload}>
        <div 
          className={`border-2 border-dashed border-gray-300 p-10 text-center ${dragActive ? 'border-blue-500 bg-blue-50' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input 
            type="file" 
            accept=".pdf,.png,.jpg" 
            onChange={(e) => setFile(e.target.files[0])} 
            className="mb-4"
          />
          <p className="text-sm text-gray-500 mb-6">Supported formats: PDF, PNG, JPG (Max 5MB)</p>
          <button 
            type="submit"
            disabled={loading}
            className={`bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 ${loading ? 'bg-gray-400 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Analyzing with Gemini AI...' : 'Upload & Simplify'}
          </button>
        </div>
        
        {file && (
          <div className="mt-4 p-4 bg-gray-50 rounded">
            <p className="text-sm"><strong>Selected file:</strong> {file.name}</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default Upload;