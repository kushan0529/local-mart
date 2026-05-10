import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import useGeolocation from '../hooks/useGeolocation';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import {
  MapPin, Search, ShoppingBag, ArrowRight, Star,
  PlusSquare, Smartphone, Coffee, Dog, Home as HomeIcon,
  Utensils, Milk, PenTool, Wrench, Heart, Zap, Gift, Tag
} from 'lucide-react';

const Home = () => {
  const { user } = useAuth();
  const { location, error: geoError, refresh: refreshGeo, loading: geoLoading } = useGeolocation();
  const [nearbyShops, setNearbyShops] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Redirect owners/admins immediately
  useEffect(() => {
    if (user?.role === 'owner') {
      navigate('/owner/dashboard', { replace: true });
    } else if (user?.role === 'admin') {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productRes = await API.get('/products?limit=16');
        setTrendingProducts(productRes.data.docs || productRes.data.data || []);

        try {
          const catRes = await API.get('/shops/categories');
          setCategories(catRes.data.data || []);
        } catch (catErr) {
          console.warn('Could not fetch categories:', catErr);
        }

        if (location && location.lat && location.lng) {
          const shopRes = await API.get(`/shops/nearby?lat=${location.lat}&lng=${location.lng}&radius=500`);
          if (shopRes.data.data.length > 0) {
            setNearbyShops(shopRes.data.data);
          } else {
            // Fallback to all approved shops if none nearby
            const allShopsRes = await API.get('/shops');
            setNearbyShops(allShopsRes.data.data || []);
          }
        }
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [location]);

  // Dynamic icon mapping
  const iconMap = {
    'PlusSquare': <PlusSquare className="w-8 h-8" />,
    'Pharmacy': <PlusSquare className="w-8 h-8" />,
    'Smartphone': <Smartphone className="w-8 h-8" />,
    'Electronics': <Smartphone className="w-8 h-8" />,
    'Coffee': <Coffee className="w-8 h-8" />,
    'Bakery': <Coffee className="w-8 h-8" />,
    'Dog': <Dog className="w-8 h-8" />,
    'Pet Care': <Dog className="w-8 h-8" />,
    'Home': <HomeIcon className="w-8 h-8" />,
    'Home Decor': <HomeIcon className="w-8 h-8" />,
    'Utensils': <Utensils className="w-8 h-8" />,
    'Meat & Fish': <Utensils className="w-8 h-8" />,
    'Milk': <Milk className="w-8 h-8" />,
    'Dairy': <Milk className="w-8 h-8" />,
    'PenTool': <PenTool className="w-8 h-8" />,
    'Stationery': <PenTool className="w-8 h-8" />,
    'Wrench': <Wrench className="w-8 h-8" />,
    'Hardware': <Wrench className="w-8 h-8" />,
    'Heart': <Heart className="w-8 h-8" />,
    'Zap': <Zap className="w-8 h-8" />,
    'Gift': <Gift className="w-8 h-8" />,
    'Fashion': <ShoppingBag className="w-8 h-8" />,
    'Grocery': <ShoppingBag className="w-8 h-8" />,
  };

  const getCategoryIcon = (cat) => {
    return iconMap[cat.icon] || iconMap[cat.name] || <Tag className="w-8 h-8" />;
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader /></div>;

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden bg-gray-900">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
            className="w-full h-full object-cover opacity-40 scale-105"
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/60 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl space-y-8">
            <div className="space-y-4">
              <span className="inline-block px-4 py-1 rounded-full bg-primary-600/20 text-primary-400 text-sm font-bold tracking-widest uppercase border border-primary-600/30">
                Local Fast Delivery
              </span>
              <h1 className="text-5xl md:text-7xl font-black text-white leading-tight">
                Your Neighborhood <span className="text-primary-500">LocalMart</span>
              </h1>
              <p className="text-xl text-gray-300 font-medium leading-relaxed">
                Experience the convenience of shopping from your favorite local stores with lightning-fast delivery to your doorstep.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-grow relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-primary-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search for groceries, essentials, or shops..."
                  className="w-full pl-12 pr-4 py-5 bg-white rounded-2xl text-gray-900 font-medium shadow-2xl focus:outline-none focus:ring-4 focus:ring-primary-500/20 transition-all"
                />
              </div>
              <button className="bg-primary-600 hover:bg-primary-700 text-white px-10 py-5 rounded-2xl font-bold transition-all shadow-xl shadow-primary-600/20 active:scale-95 flex items-center justify-center gap-2">
                Find Shops <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-4xl font-black text-gray-900">Explore Categories</h2>
            <p className="text-gray-500 mt-2 font-medium">Find exactly what you're looking for in your area</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {categories.map((cat) => (
            <Link key={cat._id} to={`/category/${cat._id}`} className="group p-8 bg-white rounded-[2.5rem] border border-gray-50 shadow-xl shadow-gray-200/40 hover:shadow-primary-100 hover:-translate-y-2 transition-all text-center">
              <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-600 group-hover:scale-110 transition-all duration-300">
                <div className="text-primary-600 group-hover:text-white transition-colors">
                  {getCategoryIcon(cat)}
                </div>
              </div>
              <span className="font-black text-gray-900 text-sm uppercase tracking-widest">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Nearby Shops */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-primary-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl shadow-primary-200">
              <MapPin className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-4xl font-black text-gray-900">Nearby Shops</h2>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-gray-500 font-medium">Direct from your community</p>
                <button
                  onClick={refreshGeo}
                  className="text-[10px] font-black text-primary-600 uppercase tracking-widest bg-primary-50 px-2 py-0.5 rounded-lg hover:bg-primary-100 transition-colors"
                >
                  {geoLoading ? 'Updating...' : 'Update Location'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {location && nearbyShops.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {nearbyShops.map((shop) => (
              <Link key={shop._id} to={`/shops/${shop._id}`} className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-50 shadow-xl shadow-gray-200/40 hover:shadow-2xl hover:shadow-primary-100 transition-all">
                <div className="h-64 relative overflow-hidden">
                  <img src={shop.banner || 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={shop.name} />
                  <div className="absolute top-6 left-6 bg-white/95 backdrop-blur px-4 py-2 rounded-2xl text-[10px] font-black text-gray-900 shadow-xl uppercase tracking-widest">
                    {shop.distance ? `${(shop.distance / 1000).toFixed(1)} km away` : 'Nearby'}
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-2xl font-black text-gray-900 group-hover:text-primary-600 transition-colors">{shop.name}</h3>
                    <div className="flex items-center gap-1.5 text-yellow-500 bg-yellow-50 px-3 py-1 rounded-full">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-black text-gray-900">{shop.rating?.toFixed(1) || '4.5'}</span>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm font-bold mb-6 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary-400" /> {shop.address?.city}
                  </p>
                  <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                    <span className="px-4 py-1.5 bg-gray-50 text-gray-500 rounded-xl text-[10px] font-black uppercase tracking-widest">{shop.category?.name || 'Store'}</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${shop.isOpen ? 'text-green-600' : 'text-red-500'}`}>
                      {shop.isOpen ? 'Open Now' : 'Closed'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white p-20 rounded-[3rem] border-4 border-dashed border-gray-100 text-center">
            <MapPin className="w-20 h-20 text-gray-200 mx-auto mb-6" />
            <h3 className="text-3xl font-black text-gray-900">{geoError ? 'Location Access Denied' : 'Searching for shops...'}</h3>
            <p className="text-gray-400 mt-4 text-lg font-medium mb-8">{geoError ? 'Please enable location to see nearby stores.' : 'We are looking for shops in your neighborhood.'}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={refreshGeo}
                className="px-8 py-4 bg-primary-600 text-white rounded-2xl font-bold shadow-xl shadow-primary-600/20 hover:bg-primary-700 transition-all active:scale-95 flex items-center gap-2"
              >
                <MapPin className="w-5 h-5" /> {geoLoading ? 'Accessing GPS...' : 'Enable Real GPS'}
              </button>
              <button
                onClick={() => {
                  const demoLocation = { lat: 12.9716, lng: 77.5946 };
                  API.get(`/shops/nearby?lat=${demoLocation.lat}&lng=${demoLocation.lng}&radius=50`)
                    .then(res => setNearbyShops(res.data.data || []))
                    .catch(err => console.error(err));
                }}
                className="px-8 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all active:scale-95"
              >
                Use Demo Location (Bangalore)
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Trending Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-4xl font-black text-gray-900">Trending Now</h2>
            <p className="text-gray-500 mt-2 font-medium">Top picks from local stores</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {trendingProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
