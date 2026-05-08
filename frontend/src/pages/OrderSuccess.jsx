import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle, ShoppingBag, ArrowRight, Package } from 'lucide-react';

const OrderSuccess = () => {
  const { id } = useParams();

  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-8">
      <div className="relative">
        <div className="absolute inset-0 bg-green-50 rounded-full scale-150 blur-3xl opacity-50"></div>
        <div className="relative w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle className="w-12 h-12 text-green-600 animate-bounce" />
        </div>
      </div>

      <div className="space-y-4">
        <h1 className="text-4xl font-extrabold text-gray-900">Order Placed Successfully!</h1>
        <p className="text-gray-500 text-lg max-w-md mx-auto">
          Thank you for shopping with LocalMart. Your order <span className="font-bold text-gray-900">#{id.slice(-8).toUpperCase()}</span> has been placed and is being processed by the shop.
        </p>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-center justify-center">
        <div className="flex items-center gap-4 text-left">
          <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
            <Package className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">Track Order</p>
            <p className="text-xs text-gray-500">Live updates on your delivery</p>
          </div>
        </div>
        <div className="h-px w-full md:w-12 md:h-12 bg-gray-100"></div>
        <Link to="/my-orders" className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-all flex items-center gap-2">
          View My Orders <ArrowRight className="w-5 h-5" />
        </Link>
      </div>

      <Link to="/" className="inline-block text-primary-600 font-bold hover:underline">
        Continue Shopping
      </Link>
    </div>
  );
};

export default OrderSuccess;
