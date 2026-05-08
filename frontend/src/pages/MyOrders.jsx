import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import Loader from '../components/Loader';
import { Package, ChevronRight, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await API.get('/orders/my-orders');
        setOrders(data.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80';
    if (imagePath.startsWith('http')) return imagePath;
    const backendUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001';
    return `${backendUrl}/${imagePath}`;
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader /></div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white">
          <Package className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">My Orders</h1>
          <p className="text-gray-500">Track and manage your recent purchases</p>
        </div>
      </div>

      <div className="space-y-6">
        {orders && orders.length > 0 ? (
          orders.map((order) => (
            <div key={order._id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-gray-50">
                  <div className="flex flex-wrap gap-4 md:gap-8">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Order ID</p>
                      <p className="font-bold text-gray-900">#{order._id.slice(-8).toUpperCase()}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Placed On</p>
                      <p className="font-medium text-gray-700">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Amount</p>
                      <p className="font-bold text-primary-600">₹{order.totalPrice}</p>
                    </div>
                  </div>
                  <div className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 ${getStatusStyles(order.orderStatus)}`}>
                    {getStatusIcon(order.orderStatus)}
                    {order.orderStatus}
                  </div>
                </div>

                <div className="space-y-4">
                  {(order.items || []).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={getImageUrl(item.image)} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow">
                        <p className="font-bold text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.qty} × ₹{item.price}</p>
                      </div>
                      <Link to={`/products/${item.product?._id || item.product}`} className="text-primary-600 hover:bg-primary-50 p-2 rounded-lg transition-colors">
                        <ChevronRight className="w-5 h-5" />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-50 px-8 py-4 flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  Ordered from <span className="font-bold text-gray-900">{order.shop?.name || 'Local Shop'}</span>
                </p>
                <button className="text-sm font-bold text-primary-600 hover:underline">Download Invoice</button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-900">No orders yet</h3>
            <p className="text-gray-500 mt-2 mb-6">Start shopping to see your orders here!</p>
            <Link to="/" className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-700 transition-all">
              Explore Shops
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

const getStatusStyles = (status) => {
  switch (status) {
    case 'Placed': return 'bg-blue-50 text-blue-600';
    case 'Confirmed': return 'bg-indigo-50 text-indigo-600';
    case 'Delivered': return 'bg-green-50 text-green-600';
    case 'Cancelled': return 'bg-red-50 text-red-600';
    default: return 'bg-gray-50 text-gray-600';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'Placed': return <Clock className="w-4 h-4" />;
    case 'Confirmed': return <CheckCircle className="w-4 h-4" />;
    case 'Delivered': return <Truck className="w-4 h-4" />;
    case 'Cancelled': return <XCircle className="w-4 h-4" />;
    default: return null;
  }
};

export default MyOrders;
