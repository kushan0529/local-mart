import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import { Store, MapPin, Phone, Mail, Clock, FileText, Upload, Save, X, Loader2, Info } from 'lucide-react';
import { toast } from 'react-toastify';

const EditShop = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    ownerBio: '',
    phone: '',
    email: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
    },
    openTime: '09:00 AM',
    closeTime: '09:00 PM',
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const { data } = await API.get('/shops/owner/my-shop');
        const shop = data.data;
        setFormData({
          name: shop.name || '',
          description: shop.description || '',
          ownerBio: shop.ownerBio || '',
          phone: shop.phone || '',
          email: shop.email || '',
          address: shop.address || { street: '', city: '', state: '', pincode: '' },
          openTime: shop.openTime || '09:00 AM',
          closeTime: shop.closeTime || '09:00 PM',
        });
      } catch (err) {
        toast.error('Failed to load shop details');
        navigate('/owner/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchShop();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: { ...formData[parent], [child]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { data } = await API.get('/shops/owner/my-shop');
      const shopId = data.data._id;
      
      await API.put(`/shops/${shopId}`, formData);
      toast.success('Shop details updated successfully!');
      navigate('/owner/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update shop');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary-600" /></div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-10 py-12 flex items-center gap-6 text-white">
          <div className="w-16 h-16 bg-white/10 backdrop-blur rounded-[1.5rem] flex items-center justify-center">
            <Store className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black">Edit Storefront</h1>
            <p className="text-gray-400 font-medium">Update your shop info and personal story</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-12">
          {/* Basic Store Info */}
          <section className="space-y-8">
            <h2 className="text-xl font-black text-gray-900 flex items-center gap-3">
              <Info className="w-5 h-5 text-primary-600" />
              General Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-[0.2em]">Store Name</label>
                <div className="relative">
                  <input name="name" type="text" required value={formData.name} onChange={handleChange} className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-primary-500/20 transition-all font-bold" />
                  <Store className="absolute left-4 top-4.5 text-gray-300 w-5 h-5" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-[0.2em]">Phone</label>
                  <div className="relative">
                    <input name="phone" type="text" value={formData.phone} onChange={handleChange} className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-primary-500/20 transition-all font-bold" />
                    <Phone className="absolute left-4 top-4.5 text-gray-300 w-5 h-5" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-[0.2em]">Email</label>
                  <div className="relative">
                    <input name="email" type="email" value={formData.email} onChange={handleChange} className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-primary-500/20 transition-all font-bold" />
                    <Mail className="absolute left-4 top-4.5 text-gray-300 w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-[0.2em]">Shop Description</label>
              <textarea name="description" rows="3" value={formData.description} onChange={handleChange} className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-primary-500/20 transition-all font-medium text-gray-600" placeholder="Tell customers what makes your shop special..."></textarea>
            </div>
          </section>

          {/* Owner Story */}
          <section className="space-y-8 pt-8 border-t border-gray-50">
            <h2 className="text-xl font-black text-gray-900 flex items-center gap-3">
              <FileText className="w-5 h-5 text-primary-600" />
              Owner's Story
            </h2>
            <div>
              <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-[0.2em]">About the Owner (Bio)</label>
              <textarea name="ownerBio" rows="5" value={formData.ownerBio} onChange={handleChange} className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-primary-500/20 transition-all font-medium text-gray-600 italic" placeholder="Share your journey with the community..."></textarea>
              <p className="mt-2 text-xs text-gray-400 font-medium">This will be displayed in the 'Meet the Owner' section of your shop page.</p>
            </div>
          </section>

          {/* Location & Hours */}
          <section className="space-y-8 pt-8 border-t border-gray-50">
            <h2 className="text-xl font-black text-gray-900 flex items-center gap-3">
              <MapPin className="w-5 h-5 text-primary-600" />
              Location & Timing
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-[0.2em]">Street Address</label>
                  <input name="address.street" type="text" value={formData.address.street} onChange={handleChange} className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-primary-500/20 transition-all font-bold" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input name="address.city" type="text" placeholder="City" value={formData.address.city} onChange={handleChange} className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-primary-500/20 transition-all font-bold" />
                  <input name="address.pincode" type="text" placeholder="Pincode" value={formData.address.pincode} onChange={handleChange} className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-primary-500/20 transition-all font-bold" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-[0.2em]">Opens At</label>
                  <div className="relative">
                    <input name="openTime" type="text" value={formData.openTime} onChange={handleChange} className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-primary-500/20 transition-all font-bold" />
                    <Clock className="absolute left-4 top-4.5 text-gray-300 w-5 h-5" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-[0.2em]">Closes At</label>
                  <div className="relative">
                    <input name="closeTime" type="text" value={formData.closeTime} onChange={handleChange} className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-primary-500/20 transition-all font-bold" />
                    <Clock className="absolute left-4 top-4.5 text-gray-300 w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="pt-10 border-t border-gray-100 flex items-center justify-between">
            <button type="button" onClick={() => navigate('/owner/dashboard')} className="px-8 py-4 text-gray-400 font-black hover:text-red-500 transition-colors uppercase tracking-widest text-sm">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="bg-primary-600 hover:bg-primary-700 text-white px-12 py-5 rounded-2xl font-black transition-all transform active:scale-95 flex items-center gap-3 shadow-2xl shadow-primary-200 text-lg">
              {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditShop;
