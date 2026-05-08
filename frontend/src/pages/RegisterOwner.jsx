import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { ShoppingCart, Mail, Lock, User as UserIcon, Phone, Store, MapPin, Loader2, Layers, EyeOff, Eye } from 'lucide-react';
import { toast } from 'react-toastify';

const RegisterOwner = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    shopName: '',
    shopCategory: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingCats, setLoadingCats] = useState(true);

  const { registerOwner } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await API.get('/shops/categories');
        setCategories(data.data || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setLoadingCats(false);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    if (!formData.shopCategory) {
      return toast.error('Please select a shop category');
    }

    setIsSubmitting(true);
    try {
      const ownerData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        shopName: formData.shopName,
        shopCategory: formData.shopCategory,
        shopDescription: `Welcome to ${formData.shopName}! We are proud to serve our community with the best local products.`,
        shopAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        }
      };
      await registerOwner(ownerData);
      toast.success('Shop application submitted! Awaiting admin approval.');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-3xl font-extrabold text-primary-600 mb-2">
            <ShoppingCart className="w-10 h-10" />
            <span>LocalMart Business</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">Grow your business with us</h2>
          <p className="mt-2 text-sm text-gray-600 font-medium">Register as a shop owner and reach thousands of local customers</p>
        </div>

        <form className="mt-8 space-y-8" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Personal Details */}
            <div className="space-y-6">
              <h3 className="text-xl font-black text-gray-900 border-b-2 border-primary-50 pb-3 flex items-center gap-2">
                <UserIcon className="w-6 h-6 text-primary-600" />
                Personal Details
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Full Name</label>
                  <input name="name" type="text" required value={formData.name} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500 transition-all font-bold" placeholder="Your Name" />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Email Address</label>
                  <input name="email" type="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500 transition-all font-bold" placeholder="email@example.com" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Password</label>
                    <input name="password" type="password" required value={formData.password} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500 transition-all font-bold" />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Confirm</label>
                    <input name="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500 transition-all font-bold" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Phone Number</label>
                  <input name="phone" type="text" required value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500 transition-all font-bold" placeholder="+91 00000 00000" />
                </div>
              </div>
            </div>

            {/* Shop Details */}
            <div className="space-y-6">
              <h3 className="text-xl font-black text-gray-900 border-b-2 border-primary-50 pb-3 flex items-center gap-2">
                <Store className="w-6 h-6 text-primary-600" />
                Shop Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Shop Name</label>
                  <input name="shopName" type="text" required value={formData.shopName} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500 transition-all font-bold" placeholder="Name of your store" />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Shop Category</label>
                  <div className="relative">
                    <select name="shopCategory" required value={formData.shopCategory} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500 transition-all font-bold appearance-none">
                      <option value="">{loadingCats ? 'Loading...' : 'Select Category'}</option>
                      {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                    <Layers className="absolute right-4 top-3.5 text-gray-400 w-5 h-5 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Shop Address (Street)</label>
                  <input name="street" type="text" required value={formData.street} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500 transition-all font-bold" placeholder="123 Market Lane" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">City</label>
                    <input name="city" type="text" required value={formData.city} onChange={handleChange} className="w-full px-3 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500 transition-all font-bold text-sm" />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">State</label>
                    <input name="state" type="text" required value={formData.state} onChange={handleChange} className="w-full px-3 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500 transition-all font-bold text-sm" />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Pincode</label>
                    <input name="pincode" type="text" required value={formData.pincode} onChange={handleChange} className="w-full px-3 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500 transition-all font-bold text-sm" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-xs text-gray-400 font-medium max-w-lg italic">By registering, you agree to LocalMart's Terms of Service. Your shop will be visible to customers once an administrator approves your application.</p>
            <button type="submit" disabled={isSubmitting || loadingCats} className="w-full md:w-auto bg-primary-600 hover:bg-primary-700 text-white px-12 py-5 rounded-2xl font-black transition-all transform active:scale-95 flex items-center justify-center gap-2 shadow-2xl shadow-primary-200 text-lg">
              {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Register Shop'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterOwner;
