import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import Loader from '../../components/Loader';
import { ShoppingBag, Clock, CheckCircle, Truck, XCircle, ChevronRight, User, MapPin, Phone, Package, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const OwnerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await API.get('/orders/owner/orders');
      setOrders(data.data);
    } catch (err) {
      console.error('Error fetching owner orders:', err);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await API.put(`/orders/owner/${orderId}/status`, { status });
      toast.success(`Order status updated to ${status}`);
      fetchOrders(); // Refresh list
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Placed': return 'bg-blue-100 text-blue-700';
      case 'Confirmed': return 'bg-indigo-100 text-indigo-700';
      case 'Packed': return 'bg-purple-100 text-purple-700';
      case 'Shipped': return 'bg-yellow-100 text-yellow-700';
      case 'Delivered': return 'bg-green-100 text-green-700';
      case 'Cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-4 mb-10">
        <button onClick={() => navigate('/owner/dashboard')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Order Management</h1>
          <p className="text-gray-500 font-medium">Accept and ship orders for your shop</p>
        </div>
      </div>

      <div className="space-y-8">
        {orders && orders.length > 0 ? (
          orders.map((order) => (
            <div key={order._id} className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
              <div className="p-8 md:p-10">
                {/* Order Header */}
                <div className="flex flex-col lg:flex-row justify-between gap-8 mb-10 pb-8 border-b border-gray-100">
                  <div className="flex flex-wrap gap-10">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Order ID</p>
                      <p className="text-lg font-black text-gray-900">#{order._id.slice(-8).toUpperCase()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Customer</p>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary-50 rounded-full flex items-center justify-center text-primary-600">
                          <User className="w-4 h-4" />
                        </div>
                        <p className="font-bold text-gray-900">{order.user?.name || 'Customer'}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Amount</p>
                      <p className="text-lg font-black text-primary-600">₹{order.totalPrice.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Status</p>
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusBadge(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {order.orderStatus === 'Placed' && (
                      <button 
                        onClick={() => updateStatus(order._id, 'Confirmed')}
                        className="bg-primary-600 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-primary-700 transition-all shadow-lg shadow-primary-100"
                      >
                        Accept Order
                      </button>
                    )}
                    {order.orderStatus === 'Confirmed' && (
                      <button 
                        onClick={() => updateStatus(order._id, 'Packed')}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                      >
                        Mark as Packed
                      </button>
                    )}
                    {order.orderStatus === 'Packed' && (
                      <button 
                        onClick={() => updateStatus(order._id, 'Shipped')}
                        className="bg-yellow-500 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-yellow-600 transition-all shadow-lg shadow-yellow-100"
                      >
                        Ship Order
                      </button>
                    )}
                    {order.orderStatus === 'Shipped' && (
                      <button 
                        onClick={() => updateStatus(order._id, 'Delivered')}
                        className="bg-green-600 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-green-700 transition-all shadow-lg shadow-green-100"
                      >
                        Mark Delivered
                      </button>
                    )}
                    {['Placed', 'Confirmed'].includes(order.orderStatus) && (
                      <button 
                        onClick={() => updateStatus(order._id, 'Cancelled')}
                        className="bg-white text-red-600 border border-red-100 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-50 transition-all"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {/* Items */}
                  <div className="space-y-6">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                      <Package className="w-4 h-4" /> Order Items
                    </h3>
                    <div className="space-y-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                          <div className="w-16 h-16 bg-white rounded-xl overflow-hidden flex-shrink-0 shadow-sm border border-gray-100">
                            <img 
                              src={item.image || 'https://via.placeholder.com/100'} 
                              className="w-full h-full object-cover" 
                              alt={item.name} 
                            />
                          </div>
                          <div className="flex-grow">
                            <p className="font-bold text-gray-900">{item.name}</p>
                            <p className="text-xs text-gray-500 font-medium">Qty: {item.qty} × ₹{item.price}</p>
                          </div>
                          <p className="font-black text-gray-900">₹{item.price * item.qty}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="space-y-6">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> Shipping Address
                    </h3>
                    <div className="bg-primary-50/50 p-8 rounded-3xl border border-primary-100/50 space-y-4">
                      <div className="flex items-start gap-4">
                        <MapPin className="w-5 h-5 text-primary-600 mt-1" />
                        <div>
                          <p className="font-bold text-gray-900 text-lg leading-tight">{order.shippingAddress?.street}</p>
                          <p className="text-gray-600 font-medium">{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
                          <p className="text-primary-600 font-black tracking-widest mt-1">{order.shippingAddress?.pincode}</p>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-primary-100/50 flex items-center gap-4">
                        <Phone className="w-5 h-5 text-primary-600" />
                        <p className="font-bold text-gray-900">{order.user?.phone || 'No phone provided'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-32 bg-white rounded-[3rem] border-4 border-dashed border-gray-100">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-gray-300" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-500 font-medium max-w-sm mx-auto">Once customers start buying from your shop, their orders will appear here for you to manage.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerOrders;
