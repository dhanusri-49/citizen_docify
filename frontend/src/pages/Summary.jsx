import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import API from '../services/api';

const Summary = () => {
  const { state } = useLocation();
  const { id } = useParams();
  const [doc, setDoc] = useState(state?.doc || null);
  const [translation, setTranslation] = useState('');
  const [translating, setTranslating] = useState(false);

  useEffect(() => {
    if (!doc) {
      API.get('/docs/my-documents').then(res => {
        const found = res.data.find(d => d._id === id);
        if (found) setDoc(found);
      });
    }
  }, [id, doc]);

  const handleTranslate = async (lang) => {
    if (lang === 'en') {
      setTranslation('');
      return;
    }
    setTranslating(true);
    try {
      const res = await API.post(`/docs/translate/${doc._id}`, { language: lang });
      setTranslation(res.data.translated);
      setTranslating(false);
    } catch (err) {
      setTranslating(false);
      alert('Translation failed');
    }
  };

  if (!doc) return <div className="p-10 text-center">Loading Document...</div>;

  return (
    <div className="container mx-auto mt-10 p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* Main Content */}
      <div className="md:col-span-2 bg-white p-6 shadow rounded">
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h1 className="text-2xl font-bold text-gray-800">{doc.docType}</h1>
          
          {/* 👇 UPDATED DROPDOWN WITH TELUGU */}
          <select 
            onChange={(e) => handleTranslate(e.target.value)} 
            className="border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="en">English (Original)</option>
            <option value="Telugu">Telugu (తెలుగు)</option> {/* 👈 Added Here */}
            <option value="Hindi">Hindi</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
          </select>
        </div>

        <div className="prose max-w-none">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Simplified Summary</h3>
          {translating ? (
            <div className="animate-pulse flex space-x-4">
               <div className="flex-1 space-y-4 py-1">
                 <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                 <div className="space-y-2">
                   <div className="h-4 bg-gray-200 rounded"></div>
                   <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                 </div>
                 <p className="text-blue-500 text-sm mt-2">Translating to your language...</p>
               </div>
            </div>
          ) : (
            <div className="bg-blue-50 p-4 rounded-lg text-gray-800 leading-relaxed whitespace-pre-line">
              {translation || doc.summary}
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <div className="bg-white p-6 shadow rounded border-l-4 border-green-500">
          <h3 className="font-bold text-lg mb-4">Checklist</h3>
          <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
            {doc.requiredAttachments && doc.requiredAttachments.length > 0 ? (
              doc.requiredAttachments.map((item, index) => (
                <li key={index}>{item}</li>
              ))
            ) : (
              <li>No attachments detected.</li>
            )}
          </ul>
        </div>

        <div className="bg-white p-6 shadow rounded">
          <h3 className="font-bold text-gray-700 mb-2">Details</h3>
          <p className="text-sm"><strong>Version:</strong> {doc.version}</p>
          <p className="text-sm"><strong>File:</strong> {doc.originalName}</p>
        </div>
      </div>

    </div>
  );
};

export default Summary;