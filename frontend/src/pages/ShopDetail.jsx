import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { MapPin, Phone, Mail, Clock, Star, Info, ShoppingCart, User, Award, ShieldCheck } from 'lucide-react';

const ShopDetail = () => {
  const { id } = useParams();
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShopDetails = async () => {
      try {
        const [shopRes, productsRes] = await Promise.all([
          API.get(`/shops/${id}`),
          API.get(`/products/shop/${id}`)
        ]);
        setShop(shopRes.data.data);
        setProducts(productsRes.data.data);
      } catch (err) {
        console.error('Error fetching shop details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchShopDetails();
  }, [id]);

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader /></div>;
  if (!shop) return <div className="text-center py-20 font-bold text-2xl">Shop not found</div>;

  const defaultBanner = 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1200&q=80';
  const defaultLogo = 'https://images.unsplash.com/photo-1534723452862-4c874e90d66d?auto=format&fit=crop&w=300&q=80';

  return (
    <div className="pb-20 bg-gray-50/50">
      {/* Banner */}
      <div className="relative h-64 md:h-96 w-full overflow-hidden">
        <img 
          src={shop.banner || defaultBanner} 
          className="w-full h-full object-cover"
          alt={shop.name}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
      </div>

      {/* Shop Info Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 flex flex-col md:flex-row gap-10 items-start border border-gray-100">
          <div className="w-40 h-40 rounded-3xl border-8 border-white shadow-2xl overflow-hidden flex-shrink-0 bg-white">
            <img src={shop.logo || defaultLogo} className="w-full h-full object-cover" alt="Logo" />
          </div>
          
          <div className="flex-grow space-y-6 w-full">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">{shop.name}</h1>
                  <ShieldCheck className="w-8 h-8 text-blue-500 fill-blue-50" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-4 py-1 bg-primary-50 text-primary-600 rounded-full text-sm font-black uppercase tracking-wider">
                    {shop.category?.name || 'Local Store'}
                  </span>
                  <div className="flex items-center gap-1 text-yellow-500 bg-yellow-50 px-3 py-1 rounded-full text-sm font-bold">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{shop.rating?.toFixed(1) || '4.5'}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button className="flex-grow lg:flex-grow-0 bg-primary-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-primary-100 hover:bg-primary-700 transition-all active:scale-95">
                  Contact Store
                </button>
              </div>
            </div>

            <p className="text-gray-500 text-lg leading-relaxed max-w-4xl font-medium">
              {shop.description || 'Welcome to our local store! We pride ourselves on quality service and community engagement.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-primary-600">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black text-gray-400">Location</p>
                  <p className="text-sm font-bold text-gray-700 truncate">{shop.address?.city}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-primary-600">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black text-gray-400">Hours</p>
                  <p className="text-sm font-bold text-gray-700">{shop.openTime} - {shop.closeTime}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-primary-600">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black text-gray-400">Phone</p>
                  <p className="text-sm font-bold text-gray-700">{shop.phone || 'Contact via Mail'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <div className={`w-3 h-3 rounded-full ${shop.isOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black text-gray-400">Status</p>
                  <p className={`text-sm font-black ${shop.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                    {shop.isOpen ? 'Open Now' : 'Closed'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left: Products */}
        <div className="lg:col-span-2 space-y-10">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black text-gray-900">Store Products</h2>
            <div className="px-4 py-2 bg-white rounded-xl border border-gray-200 text-sm font-bold text-gray-500 shadow-sm">
              {products.length} Items
            </div>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {products.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-[2rem] border-4 border-dashed border-gray-100">
              <ShoppingCart className="w-20 h-20 mx-auto text-gray-200 mb-4" />
              <p className="text-gray-400 text-xl font-bold">No products listed yet.</p>
            </div>
          )}
        </div>

        {/* Right: About Owner */}
        <div className="space-y-8">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100 sticky top-24">
            <div className="flex items-center gap-3 mb-8">
              <Award className="w-8 h-8 text-primary-600" />
              <h2 className="text-2xl font-black text-gray-900">Meet the Owner</h2>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 text-3xl font-black overflow-hidden shadow-inner">
                {shop.owner?.avatar ? (
                  <img src={shop.owner.avatar} className="w-full h-full object-cover" alt="Owner" />
                ) : (
                  <User className="w-10 h-10" />
                )}
              </div>
              <div>
                <p className="text-lg font-black text-gray-900">{shop.owner?.name || 'Local Vendor'}</p>
                <p className="text-primary-600 font-bold text-sm">Community Partner</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-2xl p-6 italic text-gray-600 leading-relaxed font-medium relative">
                <span className="absolute -top-4 -left-2 text-6xl text-primary-100 font-serif leading-none">“</span>
                {shop.ownerBio || `We are committed to providing the best local experience for our community in ${shop.address?.city}. Our passion is quality and customer satisfaction.`}
                <span className="absolute -bottom-10 -right-2 text-6xl text-primary-100 font-serif leading-none">”</span>
              </div>

              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-3 text-gray-500">
                  <Mail className="w-5 h-5 text-primary-400" />
                  <span className="font-bold text-sm">{shop.owner?.email || 'private-contact@localmart.com'}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-500">
                  <MapPin className="w-5 h-5 text-primary-400" />
                  <span className="font-bold text-sm">Store located in {shop.address?.city}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopDetail;
