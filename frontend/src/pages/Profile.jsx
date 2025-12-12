import React, { useState, useEffect, useContext } from 'react';
import API from '../services/api';
import Sidebar from '../components/Sidebar';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  User, Mail, Phone, Calendar, MapPin, 
  CreditCard, Award, Camera, Save, Edit2 
} from 'lucide-react';

const Profile = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dob: '',
    mobile: '',
    aadhaar: '',
    pan: '',
    district: '',
    state: '',
    pincode: '',
    category: 'General'
  });

  // Fetch User Data on Load
  useEffect(() => {
    API.get('/auth/profile')
      .then(res => {
        setFormData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create local preview URL
      const objectUrl = URL.createObjectURL(file);
      setPhotoPreview(objectUrl);
    }
  };

  const handleSave = async () => {
    try {
      await API.put('/auth/profile', formData);
      setIsEditing(false);
      alert("✅ Profile Updated Successfully!");
    } catch (err) {
      alert("❌ Failed to update profile.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) return <div className="p-10 text-center">Loading Profile...</div>;

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar logout={handleLogout} />

      <main className="ml-64 flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
            <button 
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold transition shadow-sm ${
                isEditing 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isEditing ? <><Save size={18}/> Save Changes</> : <><Edit2 size={18}/> Edit Profile</>}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Left Column: Photo & Basic Info */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit text-center">
              <div className="relative inline-block mb-4">
                <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-gray-100 mx-auto bg-gray-200 shadow-inner">
                  {photoPreview || formData.photo ? (
                    <img 
                      src={photoPreview || formData.photo} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-full h-full p-8 text-gray-400" />
                  )}
                </div>
                {isEditing && (
                  <label className="absolute bottom-1 right-1 bg-blue-600 text-white p-2.5 rounded-full cursor-pointer hover:bg-blue-700 shadow-lg transition transform hover:scale-105">
                    <Camera size={18} />
                    <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                  </label>
                )}
              </div>
              
              <h2 className="text-xl font-bold text-gray-800">{formData.name}</h2>
              <p className="text-sm text-gray-500 mb-6">{formData.email}</p>
              
              <div className="text-left mt-6 space-y-4 border-t pt-6">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Mail size={18} className="text-blue-500" /> 
                  <span className="truncate">{formData.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Phone size={18} className="text-green-500" /> 
                  {isEditing ? (
                    <input 
                      name="mobile" value={formData.mobile} onChange={handleChange}
                      className="border border-gray-300 rounded px-2 py-1 w-full focus:ring-2 focus:ring-blue-500 outline-none" 
                      placeholder="Mobile Number"
                    />
                  ) : (
                    <span className={!formData.mobile ? "text-gray-400 italic" : ""}>
                      {formData.mobile || "Add Mobile Number"}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Calendar size={18} className="text-purple-500" /> 
                  {isEditing ? (
                    <input 
                      type="date" name="dob" value={formData.dob} onChange={handleChange}
                      className="border border-gray-300 rounded px-2 py-1 w-full focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  ) : (
                    <span className={!formData.dob ? "text-gray-400 italic" : ""}>
                       {formData.dob || "Add Date of Birth"}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Detailed Forms */}
            <div className="md:col-span-2 space-y-6">
              
              {/* Identity Section */}
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-4">
                  <CreditCard className="text-blue-600" size={20} /> Identity Documents
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Aadhaar Number</label>
                    <input 
                      name="aadhaar" 
                      value={formData.aadhaar} 
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-50 transition"
                      placeholder="XXXX-XXXX-XXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">PAN Number</label>
                    <input 
                      name="pan" 
                      value={formData.pan} 
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-50 transition"
                      placeholder="ABCDE1234F"
                    />
                  </div>
                </div>
              </div>

              {/* Address Section */}
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-4">
                  <MapPin className="text-red-500" size={20} /> Address Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">State</label>
                    <input 
                      name="state" 
                      value={formData.state} 
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full border border-gray-300 rounded-lg p-3 disabled:bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">District</label>
                    <input 
                      name="district" 
                      value={formData.district} 
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full border border-gray-300 rounded-lg p-3 disabled:bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Pincode</label>
                    <input 
                      name="pincode" 
                      value={formData.pincode} 
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full border border-gray-300 rounded-lg p-3 disabled:bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Category Section */}
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-4">
                  <Award className="text-yellow-500" size={20} /> Category Information
                </h3>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Social Category</label>
                  <select 
                    name="category"
                    value={formData.category} 
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg p-3 bg-white disabled:bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="General">General</option>
                    <option value="OBC">OBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                    <option value="EWS">EWS</option>
                  </select>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;