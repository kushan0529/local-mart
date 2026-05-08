import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import Loader from '../../components/Loader';
import { LayoutDashboard, Package, ShoppingBag, Settings, TrendingUp, DollarSign, Clock, CheckCircle, Store, Edit, Plus, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const OwnerDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });
  const [shop, setShop] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [ordersRes, productsRes, shopRes] = await Promise.all([
          API.get('/orders/owner/orders'),
          API.get('/products/shop/my-shop'),
          API.get('/shops/owner/my-shop')
        ]);

        const orders = ordersRes.data.data;
        const products = productsRes.data.data;
        setShop(shopRes.data.data);

        const totalRevenue = orders.reduce((acc, order) => order.paymentStatus === 'Paid' ? acc + order.totalPrice : acc, 0);
        const pendingOrders = orders.filter(order => order.orderStatus === 'Placed' || order.orderStatus === 'Confirmed').length;

        setStats({
          totalOrders: orders.length,
          totalProducts: products.length,
          totalRevenue,
          pendingOrders
        });
        setRecentOrders(orders.slice(0, 5));
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-gray-900 flex items-center gap-3">
            <LayoutDashboard className="text-primary-600 w-10 h-10" />
            Shop Dashboard
          </h1>
          <p className="text-gray-500 mt-1 font-medium">Hello, {shop?.name || 'Partner'}! Here's what's happening today.</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link to="/owner/shop/edit" className="bg-white text-gray-700 px-6 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm border border-gray-200">
            <Settings className="w-5 h-5 text-gray-400" />
            Edit Shop
          </Link>
          <Link to="/owner/products/add" className="bg-primary-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-primary-700 transition-all flex items-center gap-2 shadow-xl shadow-primary-100 transform active:scale-95">
            <Plus className="w-6 h-6" />
            Add New Product
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <StatCard title="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} icon={<DollarSign className="text-green-600" />} color="bg-green-50" />
        <StatCard title="Total Orders" value={stats.totalOrders} icon={<ShoppingBag className="text-blue-600" />} color="bg-blue-50" onClick={() => navigate('/owner/orders')} />
        <StatCard title="Total Products" value={stats.totalProducts} icon={<Package className="text-purple-600" />} color="bg-purple-50" />
        <StatCard title="Pending Orders" value={stats.pendingOrders} icon={<Clock className="text-orange-600" />} color="bg-orange-50" onClick={() => navigate('/owner/orders')} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-gray-900">Recent Orders</h2>
            <Link to="/owner/orders" className="text-primary-600 font-black text-sm hover:underline tracking-widest uppercase flex items-center gap-2">
              View All Orders <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Order ID</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Customer</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50/50 transition-colors group cursor-pointer" onClick={() => navigate('/owner/orders')}>
                    <td className="px-8 py-5 font-bold text-gray-900 group-hover:text-primary-600 transition-colors">#{order._id.slice(-6).toUpperCase()}</td>
                    <td className="px-8 py-5 text-gray-600 font-medium">{order.user?.name}</td>
                    <td className="px-8 py-5">
                      <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right font-black text-gray-900">₹{order.totalPrice.toLocaleString()}</td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-8 py-20 text-center text-gray-400 font-bold italic">No orders received yet. Start promoting your shop!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Shop Performance & Tools */}
        <div className="space-y-8">
          <h2 className="text-2xl font-black text-gray-900">Store Health</h2>
          <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-gray-200/50 border border-gray-100 space-y-10">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Order Completion</p>
                <span className="text-primary-600 font-black">85%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden shadow-inner">
                <div className="bg-gradient-to-r from-primary-400 to-primary-600 h-full rounded-full transition-all duration-1000" style={{ width: '85%' }}></div>
              </div>
              <p className="text-xs font-bold text-gray-400 italic">Target: 95% completion for Top Seller badge.</p>
            </div>

            <div className="pt-8 border-t border-gray-50 space-y-6">
              <h3 className="font-black text-gray-900 text-lg">Management Tools</h3>
              <div className="grid grid-cols-2 gap-4">
                <Link to="/owner/orders" className="p-6 bg-gray-50 rounded-[1.5rem] text-center hover:bg-primary-50 transition-all border border-transparent hover:border-primary-100 group">
                  <ShoppingBag className="w-8 h-8 mx-auto mb-3 text-primary-600 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">Orders</span>
                </Link>
                <Link to="/owner/products" className="p-6 bg-gray-50 rounded-[1.5rem] text-center hover:bg-primary-50 transition-all border border-transparent hover:border-primary-100 group">
                  <Package className="w-8 h-8 mx-auto mb-3 text-primary-600 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">Products</span>
                </Link>
                <Link to="/owner/shop/edit" className="p-6 bg-gray-50 rounded-[1.5rem] text-center hover:bg-primary-50 transition-all border border-transparent hover:border-primary-100 group col-span-2">
                  <Store className="w-8 h-8 mx-auto mb-3 text-primary-600 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">Storefront Settings</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color, onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 flex items-center gap-6 group hover:-translate-y-1 transition-all ${onClick ? 'cursor-pointer hover:border-primary-200' : ''}`}
  >
    <div className={`w-16 h-16 ${color} rounded-[1.5rem] flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{title}</p>
      <p className="text-3xl font-black text-gray-900">{value}</p>
    </div>
  </div>
);

const getStatusColor = (status) => {
  switch (status) {
    case 'Placed': return 'bg-blue-50 text-blue-600';
    case 'Confirmed': return 'bg-indigo-50 text-indigo-600';
    case 'Delivered': return 'bg-green-50 text-green-600';
    case 'Cancelled': return 'bg-red-50 text-red-600';
    default: return 'bg-gray-50 text-gray-600';
  }
};

export default OwnerDashboard;
