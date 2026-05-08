import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { CreditCard, Truck, MapPin, CheckCircle, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
    paymentMethod: 'COD',
  });

  const subtotal = cart?.items?.reduce((acc, item) => acc + (item.price * item.qty), 0) || 0;
  const deliveryFee = subtotal > 500 ? 0 : 40;
  const total = subtotal + deliveryFee;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80';
    if (imagePath.startsWith('http')) return imagePath;
    const backendUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001';
    return `${backendUrl}/${imagePath}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cart?.items || cart.items.length === 0) {
      return toast.error('Your cart is empty');
    }

    setIsSubmitting(true);

    try {
      // Find the first available shopId
      const shopId = cart.items[0].product?.shop || cart.items[0].shop?._id || cart.items[0].shop;

      if (!shopId) {
        throw new Error('Shop information missing for items');
      }

      const orderData = {
        cartItems: cart.items.map(item => ({
          product: item.product?._id,
          name: item.product?.name,
          image: item.product?.images?.[0] || '',
          price: item.price,
          qty: item.qty
        })),
        shippingAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
        paymentMethod: formData.paymentMethod,
        totalPrice: total,
        deliveryCharge: deliveryFee,
        shopId: shopId,
      };

      const { data } = await API.post('/orders', orderData);
      toast.success('Order placed successfully!');
      clearCart();
      navigate(`/order-success/${data.data._id}`);
    } catch (err) {
      console.error('Checkout Error:', err);
      toast.error(err.response?.data?.message || err.message || 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <button onClick={() => navigate('/')} className="bg-primary-600 text-white px-6 py-2 rounded-lg">Go Shopping</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-4 mb-10">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Shipping Info */}
        <div className="space-y-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">1</div>
            <h2 className="text-2xl font-bold text-gray-900">Shipping Details</h2>
          </div>
          
          <form id="checkout-form" onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Street Address</label>
                <div className="relative">
                  <input
                    name="street"
                    type="text"
                    required
                    value={formData.street}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all"
                    placeholder="House No, Building, Street"
                  />
                  <MapPin className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">City</label>
                  <input
                    name="city"
                    type="text"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">State</label>
                  <input
                    name="state"
                    type="text"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Pincode</label>
                <input
                  name="pincode"
                  type="text"
                  required
                  value={formData.pincode}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all"
                  placeholder="000000"
                />
              </div>
            </div>

            <div className="pt-8 flex items-center gap-3 border-t border-gray-100 mb-2">
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">2</div>
              <h2 className="text-2xl font-bold text-gray-900">Payment Method</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <label className={`relative flex items-center gap-3 p-4 border rounded-2xl cursor-pointer transition-all ${formData.paymentMethod === 'COD' ? 'border-primary-600 bg-primary-50 ring-2 ring-primary-500' : 'border-gray-200'}`}>
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="COD" 
                  checked={formData.paymentMethod === 'COD'}
                  onChange={handleChange}
                  className="hidden" 
                />
                <Truck className={`w-6 h-6 ${formData.paymentMethod === 'COD' ? 'text-primary-600' : 'text-gray-400'}`} />
                <span className={`font-bold ${formData.paymentMethod === 'COD' ? 'text-primary-900' : 'text-gray-600'}`}>Cash on Delivery</span>
                {formData.paymentMethod === 'COD' && <CheckCircle className="absolute top-2 right-2 w-4 h-4 text-primary-600" />}
              </label>

              <label className={`relative flex items-center gap-3 p-4 border rounded-2xl cursor-pointer transition-all ${formData.paymentMethod === 'Online' ? 'border-primary-600 bg-primary-50 ring-2 ring-primary-500' : 'border-gray-200'}`}>
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="Online" 
                  checked={formData.paymentMethod === 'Online'}
                  onChange={handleChange}
                  className="hidden" 
                />
                <CreditCard className={`w-6 h-6 ${formData.paymentMethod === 'Online' ? 'text-primary-600' : 'text-gray-400'}`} />
                <span className={`font-bold ${formData.paymentMethod === 'Online' ? 'text-primary-900' : 'text-gray-600'}`}>Online Payment</span>
                {formData.paymentMethod === 'Online' && <CheckCircle className="absolute top-2 right-2 w-4 h-4 text-primary-600" />}
              </label>
            </div>
          </form>
        </div>

        {/* Order Review */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900">Review Your Order</h2>
            
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {cart.items.map((item) => (
                <div key={item.product?._id || Math.random()} className="flex gap-4 items-center">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                    <img src={getImageUrl(item.product?.images?.[0])} className="w-full h-full object-cover" alt={item.product?.name || 'Product'} />
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm font-bold text-gray-900 line-clamp-1">{item.product?.name || 'Unknown Product'}</p>
                    <p className="text-xs text-gray-500">Qty: {item.qty} × ₹{item.price}</p>
                  </div>
                  <span className="font-bold text-sm">₹{item.price * item.qty}</span>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-50">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span className={`font-bold ${deliveryFee === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </span>
              </div>
              <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total Amount</span>
                <span className="text-2xl font-extrabold text-primary-600">₹{total}</span>
              </div>
            </div>

            <button 
              type="submit"
              form="checkout-form"
              disabled={isSubmitting}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-xl font-bold transition-all transform active:scale-95 shadow-lg shadow-primary-100 flex items-center justify-center gap-2"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Place Your Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
