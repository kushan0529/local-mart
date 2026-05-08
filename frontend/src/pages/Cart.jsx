import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck } from 'lucide-react';
import Loader from '../components/Loader';

const Cart = () => {
  const { cart, updateQty, removeFromCart, loading } = useCart();
  const navigate = useNavigate();

  const subtotal = cart?.items?.reduce((acc, item) => acc + (item.price * item.qty), 0) || 0;
  const deliveryFee = subtotal > 500 ? 0 : 40;
  const total = subtotal + deliveryFee;

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80';
    if (imagePath.startsWith('http')) return imagePath;
    const backendUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001';
    return `${backendUrl}/${imagePath}`;
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader /></div>;

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag className="w-12 h-12 text-primary-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Your cart is empty</h2>
        <p className="text-gray-500 max-w-md mx-auto">Looks like you haven't added anything to your cart yet. Explore nearby shops to find amazing products!</p>
        <Link to="/" className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-700 transition-all">
          Start Shopping <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {cart.items.map((item) => (
            <div key={item.product?._id || Math.random()} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex gap-6 items-center">
              <img 
                src={getImageUrl(item.product?.images?.[0])} 
                className="w-24 h-24 rounded-2xl object-cover flex-shrink-0"
                alt={item.product?.name || 'Product'}
              />
              <div className="flex-grow">
                <Link to={`/products/${item.product?._id}`} className="text-lg font-bold text-gray-900 hover:text-primary-600 transition-colors">
                  {item.product?.name || 'Unknown Product'}
                </Link>
                <p className="text-sm text-gray-500 mb-2">{item.shop?.name || 'Shop'}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button 
                      onClick={() => updateQty(item.product?._id, item.qty - 1)}
                      className="p-1.5 hover:bg-gray-50 text-gray-500"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 font-bold text-sm">{item.qty}</span>
                    <button 
                      onClick={() => updateQty(item.product?._id, item.qty + 1)}
                      className="p-1.5 hover:bg-gray-50 text-gray-500"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="font-bold text-gray-900">₹{item.price * item.qty}</span>
                </div>
              </div>
              <button 
                onClick={() => removeFromCart(item.product?._id)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
            
            <div className="space-y-4 pt-4 border-t border-gray-50">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span className="flex items-center gap-2">
                  Delivery Fee <Truck className="w-4 h-4" />
                </span>
                <span className={`font-bold ${deliveryFee === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </span>
              </div>
              {deliveryFee > 0 && (
                <p className="text-[10px] text-gray-500 italic">Add ₹{500 - subtotal} more for free delivery</p>
              )}
              <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-extrabold text-primary-600">₹{total}</span>
              </div>
            </div>

            <button 
              onClick={() => navigate('/checkout')}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-xl font-bold transition-all transform active:scale-95 shadow-lg shadow-primary-100"
            >
              Proceed to Checkout
            </button>
            
            <Link to="/" className="block text-center text-sm font-bold text-primary-600 hover:text-primary-700">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
