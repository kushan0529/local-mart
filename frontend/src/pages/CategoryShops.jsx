import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';
import Loader from '../components/Loader';
import { MapPin, Star, ChevronLeft, ShoppingBag } from 'lucide-react';

const CategoryShops = () => {
  const { id } = useParams();
  const [shops, setShops] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const res = await API.get(`/shops?category=${id}`);
        setShops(res.data.data);
        
        // Find category name if shops exist
        if (res.data.data.length > 0) {
          setCategoryName(res.data.data[0].category.name);
        } else {
          // If no shops, we might want to fetch category name separately
          // For now, let's just set it to 'Category'
          setCategoryName('Shops');
        }
      } catch (err) {
        console.error('Error fetching shops:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchShops();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-4 mb-12">
        <Link to="/" className="p-3 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all text-gray-600 hover:text-primary-600">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-4xl font-black text-gray-900">{categoryName}</h1>
          <p className="text-gray-500 mt-1">Discover the best {categoryName.toLowerCase()} stores near you</p>
        </div>
      </div>

      {shops.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {shops.map((shop) => (
            <Link key={shop._id} to={`/shops/${shop._id}`} className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all">
              <div className="h-56 relative overflow-hidden">
                <img 
                  src={shop.images?.[0] || shop.banner || 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80'} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  alt={shop.name} 
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-black text-gray-900 shadow-sm">
                  {shop.isOpen ? 'Open Now' : 'Closed'}
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{shop.name}</h3>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-bold text-gray-900">{shop.rating || '4.5'}</span>
                  </div>
                </div>
                <p className="text-gray-500 text-sm mb-4 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {shop.address?.city}, {shop.address?.street}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-primary-50 text-primary-600 rounded-lg text-xs font-bold">{categoryName}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white p-20 rounded-[3rem] border-2 border-dashed border-gray-200 text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-2xl font-black text-gray-900">No shops found in this category</h3>
          <p className="text-gray-500 mt-2 max-w-md mx-auto">We couldn't find any stores in this category yet. Check back soon or explore other categories!</p>
          <Link to="/" className="mt-8 inline-block bg-primary-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-100">
            Go Back Home
          </Link>
        </div>
      )}
    </div>
  );
};

export default CategoryShops;
