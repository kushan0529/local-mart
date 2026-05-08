import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { User, Mail, Phone, MapPin, Save, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      pincode: user?.address?.pincode || '',
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    if (e.target.name.startsWith('address.')) {
      const field = e.target.name.split('.')[1];
      setFormData({
        ...formData,
        address: { ...formData.address, [field]: e.target.value }
      });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await API.put('/auth/update-profile', formData);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-primary-600 h-32 relative">
          <div className="absolute -bottom-12 left-12 w-24 h-24 bg-white rounded-2xl shadow-lg border-4 border-white flex items-center justify-center text-primary-600">
            <User className="w-12 h-12" />
          </div>
        </div>
        
        <div className="pt-16 px-12 pb-12">
          <div className="mb-10">
            <h1 className="text-3xl font-extrabold text-gray-900">{user?.name}</h1>
            <p className="text-gray-500 font-medium capitalize">{user?.role} Account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Basic Information</h2>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                  <div className="relative">
                    <input name="name" type="text" value={formData.name} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all" />
                    <User className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                  <div className="relative">
                    <input name="email" type="email" value={formData.email} disabled className="w-full pl-10 pr-4 py-3 border border-gray-100 bg-gray-50 rounded-xl text-gray-500 cursor-not-allowed" />
                    <Mail className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
                  <div className="relative">
                    <input name="phone" type="text" value={formData.phone} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all" />
                    <Phone className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Default Address</h2>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Street</label>
                  <div className="relative">
                    <input name="address.street" type="text" value={formData.address.street} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all" />
                    <MapPin className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">City</label>
                    <input name="address.city" type="text" value={formData.address.city} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">State</label>
                    <input name="address.state" type="text" value={formData.address.state} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Pincode</label>
                  <input name="address.pincode" type="text" value={formData.address.pincode} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all" />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex justify-end">
              <button type="submit" disabled={isSubmitting} className="bg-primary-600 hover:bg-primary-700 text-white px-10 py-4 rounded-xl font-bold transition-all transform active:scale-95 flex items-center gap-2 shadow-lg shadow-primary-100">
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
