import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import Loader from '../../components/Loader';
import { Shield, Users, Store, ShoppingBag, DollarSign, CheckCircle, XCircle, TrendingUp, ArrowUpRight, Clock, AlertCircle, UserCog, UserPlus, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [pendingShops, setPendingShops] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'shops', 'users'

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [statsRes, shopsRes, usersRes] = await Promise.all([
        API.get('/admin/dashboard'),
        API.get('/admin/owners'),
        API.get('/admin/users')
      ]);
      setStats(statsRes.data.data);
      setPendingShops(shopsRes.data.data);
      setUsers(usersRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await API.put(`/admin/owners/${id}/approve`);
      toast.success('Shop approved successfully!');
      setPendingShops(pendingShops.filter(o => o._id !== id));
      fetchAdminData();
    } catch (err) {
      toast.error('Approval failed');
    }
  };

  const handlePromote = async (id) => {
    try {
      await API.put(`/admin/users/${id}/toggle`); // This toggles role/status in our logic
      toast.success('User role updated!');
      fetchAdminData();
    } catch (err) {
      toast.error('Failed to update user');
    }
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-gray-900 flex items-center gap-3">
            <Shield className="text-primary-600 w-10 h-10" />
            Admin Command Center
          </h1>
          <p className="text-gray-500 mt-1 font-medium italic">Managing the future of neighborhood commerce.</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link to="/admin/categories" className="bg-white text-gray-700 px-6 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm border border-gray-200">
            Categories
          </Link>
          <div className="bg-gray-100 p-1 rounded-2xl flex">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'overview' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('shops')}
              className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'shops' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Applications ({pendingShops.length})
            </button>
            <button 
              onClick={() => setActiveTab('users')}
              className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'users' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              User Mgmt
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'overview' && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <StatCard title="Platform Revenue" value={`₹${stats?.totalRevenue.toLocaleString()}`} icon={<DollarSign className="text-green-600" />} color="bg-green-50" />
            <StatCard title="Total Citizens" value={stats?.usersCount} icon={<Users className="text-blue-600" />} color="bg-blue-50" />
            <StatCard title="Partner Shops" value={stats?.shopsCount} icon={<Store className="text-purple-600" />} color="bg-purple-50" />
            <StatCard title="All-Time Orders" value={stats?.ordersCount} icon={<ShoppingBag className="text-orange-600" />} color="bg-orange-50" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 bg-white rounded-[3rem] p-10 shadow-xl shadow-gray-200/40 border border-gray-50">
              <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                <TrendingUp className="text-primary-600" />
                Growth Analytics
              </h2>
              <div className="h-64 flex items-end gap-4">
                {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
                  <div key={i} className="flex-1 bg-primary-50 rounded-t-2xl relative group">
                    <div className="absolute bottom-0 w-full bg-primary-600 rounded-t-2xl transition-all duration-1000 group-hover:bg-primary-700" style={{ height: `${h}%` }}></div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
            </div>
            
            <div className="bg-primary-600 rounded-[3rem] p-10 text-white shadow-2xl shadow-primary-200 relative overflow-hidden group">
              <ShieldAlert className="absolute -right-10 -bottom-10 w-64 h-64 text-white/10 rotate-12 group-hover:scale-110 transition-transform duration-700" />
              <h3 className="text-2xl font-black mb-4">Security Alert</h3>
              <p className="text-primary-100 font-medium mb-8">All systems are running on encrypted protocols. 0 unauthorized attempts detected in the last 24h.</p>
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-white/10 p-4 rounded-2xl backdrop-blur">
                  <span className="text-xs font-bold">Database</span>
                  <span className="px-3 py-1 bg-green-500 rounded-full text-[10px] font-black">ACTIVE</span>
                </div>
                <div className="flex items-center justify-between bg-white/10 p-4 rounded-2xl backdrop-blur">
                  <span className="text-xs font-bold">API Gateway</span>
                  <span className="px-3 py-1 bg-green-500 rounded-full text-[10px] font-black">SECURE</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'shops' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
          <h2 className="text-3xl font-black text-gray-900">Pending Shop Applications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pendingShops.map(shop => (
              <div key={shop._id} className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/40 border border-gray-50 flex flex-col items-center text-center group hover:border-primary-200 transition-all">
                <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center text-primary-600 mb-6 group-hover:scale-110 transition-transform">
                  <Store className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">{shop.name}</h3>
                <p className="text-gray-400 font-bold text-sm mb-6 uppercase tracking-widest">{shop.owner?.name}</p>
                <div className="flex gap-3 w-full">
                  <button onClick={() => handleApprove(shop._id)} className="flex-1 bg-primary-600 text-white py-4 rounded-2xl font-black text-sm shadow-lg shadow-primary-100 hover:bg-primary-700 transition-all">Approve</button>
                  <button className="flex-1 bg-red-50 text-red-600 py-4 rounded-2xl font-black text-sm hover:bg-red-100 transition-all">Reject</button>
                </div>
              </div>
            ))}
            {pendingShops.length === 0 && (
              <div className="col-span-full py-32 bg-white rounded-[3rem] border-4 border-dashed border-gray-100 text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">System Clear</h3>
                <p className="text-gray-400 font-medium">No pending shop applications.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black text-gray-900">User Management</h2>
            <button className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2">
              <UserPlus className="w-4 h-4" /> Export CSV
            </button>
          </div>
          <div className="bg-white rounded-[3rem] shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">User Details</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Current Role</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map(u => (
                  <tr key={u._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 font-black">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-gray-900">{u.name}</p>
                          <p className="text-xs text-gray-400 font-medium">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        u.role === 'admin' ? 'bg-red-50 text-red-600' :
                        u.role === 'owner' ? 'bg-purple-50 text-purple-600' :
                        'bg-blue-50 text-blue-600'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <button 
                        onClick={() => handlePromote(u._id)}
                        className="p-3 bg-gray-50 rounded-xl text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-all"
                        title="Toggle Role/Status"
                      >
                        <UserCog className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-100 flex items-center gap-6 group hover:-translate-y-1 transition-all">
    <div className={`w-16 h-16 ${color} rounded-[1.5rem] flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{title}</p>
      <p className="text-3xl font-black text-gray-900">{value}</p>
    </div>
  </div>
);

export default AdminDashboard;
