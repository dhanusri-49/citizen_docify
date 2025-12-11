import React, { useState } from 'react';
import API from '../services/api';

const Eligibility = () => {
  const [formData, setFormData] = useState({
    docType: 'Aadhar Card',
    age: '',
    nationality: 'Indian',
    income: '',
    category: 'General'
  });
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/docs/check-eligibility', formData);
      setResult(res.data);
    } catch (err) {
      alert("Error checking eligibility");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-4">Check Eligibility</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Document Selection */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Select Document</label>
          <select 
            name="docType" 
            value={formData.docType} 
            onChange={handleChange}
            className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-500 bg-gray-50"
          >
            <option>Aadhar Card</option>
            <option>PAN Card</option>
            <option>Voter ID</option>
            <option>Driving License</option>
            <option>Ration Card</option>
            <option>Student Scholarship</option>
            <option>Income Certificate</option>
            <option>Caste Certificate</option>
            <option>Birth Certificate</option>
            <option>Death Certificate</option>
            <option>Income Tax Filing</option>
            <option>Passport</option>
            <option>EWS Certificate</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Age */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Age</label>
            <input 
              type="number" 
              name="age" 
              value={formData.age} 
              onChange={handleChange}
              className="w-full border p-3 rounded focus:ring-blue-500" 
              placeholder="e.g. 24" 
              required
            />
          </div>

          {/* Nationality */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Nationality</label>
            <select 
              name="nationality" 
              value={formData.nationality} 
              onChange={handleChange}
              className="w-full border p-3 rounded bg-white"
            >
              <option value="Indian">Indian</option>
              <option value="Foreigner">Foreigner</option>
              <option value="NRI">NRI</option>
            </select>
          </div>

          {/* Income */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Annual Family Income (₹)</label>
            <input 
              type="number" 
              name="income" 
              value={formData.income} 
              onChange={handleChange}
              className="w-full border p-3 rounded focus:ring-blue-500" 
              placeholder="e.g. 150000" 
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Social Category</label>
            <select 
              name="category" 
              value={formData.category} 
              onChange={handleChange}
              className="w-full border p-3 rounded bg-white"
            >
              <option value="General">General</option>
              <option value="OBC">OBC</option>
              <option value="SC">SC</option>
              <option value="ST">ST</option>
              <option value="EWS">EWS</option>
            </select>
          </div>
        </div>

        <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition shadow-md">
          Check Eligibility Status
        </button>
      </form>

      {/* Results Section */}
      {result && (
        <div className={`mt-8 p-6 rounded-lg border-l-8 shadow-sm ${result.eligible ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
          <div className="flex items-center mb-3">
            <span className={`text-3xl mr-3 ${result.eligible ? 'text-green-600' : 'text-red-600'}`}>
              {result.eligible ? '✅' : '❌'}
            </span>
            <h3 className={`text-2xl font-bold ${result.eligible ? 'text-green-800' : 'text-red-800'}`}>
              {result.eligible ? 'You are Eligible!' : 'Not Eligible'}
            </h3>
          </div>
          
          <ul className="space-y-2 mt-2">
            {result.reasons.map((r, idx) => (
              <li key={idx} className="flex items-start text-gray-800 text-lg">
                <span className="mr-2 mt-1">•</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Eligibility;