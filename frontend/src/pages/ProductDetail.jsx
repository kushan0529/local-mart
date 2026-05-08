import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';
import Loader from '../components/Loader';
import { ShoppingCart, Star, ShieldCheck, Truck, RefreshCcw, Minus, Plus, Bookmark, Tag, Briefcase } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await API.get(`/products/${id}`);
        setProduct(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product._id, qty);
    toast.success(`${product.name} added to cart!`);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';
    if (imagePath.startsWith('http')) return imagePath;
    const backendUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001';
    return `${backendUrl}/${imagePath}`;
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader /></div>;
  if (!product) return <div className="text-center py-20 font-bold text-2xl">Product not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Image Gallery */}
        <div className="space-y-6">
          <div className="aspect-square rounded-[3rem] overflow-hidden bg-white border border-gray-100 shadow-2xl">
            <img 
              src={getImageUrl(product.images?.[activeImage])} 
              className="w-full h-full object-contain p-8 hover:scale-110 transition-transform duration-700"
              alt={product.name}
            />
          </div>
          {product.images && product.images.length > 0 && (
            <div className="grid grid-cols-5 gap-4">
              {product.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`aspect-square rounded-2xl overflow-hidden border-4 transition-all shadow-sm ${activeImage === idx ? 'border-primary-600 scale-105' : 'border-white hover:border-gray-200'}`}
                >
                  <img src={getImageUrl(img)} className="w-full h-full object-cover" alt={`Thumbnail ${idx}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-10">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Link to={`/shops/${product.shop?._id}`} className="px-4 py-1.5 bg-primary-50 text-primary-600 rounded-full font-black text-xs uppercase tracking-widest hover:bg-primary-100 transition-colors">
                {product.shop?.name}
              </Link>
              {product.brand && (
                <span className="flex items-center gap-1.5 text-gray-400 font-bold text-xs uppercase tracking-widest">
                  <Briefcase className="w-3.5 h-3.5" />
                  {product.brand}
                </span>
              )}
            </div>
            
            <h1 className="text-5xl font-black text-gray-900 leading-tight">{product.name}</h1>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1.5 bg-yellow-50 text-yellow-700 px-4 py-1.5 rounded-full text-sm font-black">
                <Star className="w-4 h-4 fill-current" />
                <span>{product.rating?.toFixed(1) || '4.5'}</span>
                <span className="text-yellow-200 mx-1">|</span>
                <span className="font-bold">{product.numReviews || 0} Reviews</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className={`text-sm font-black uppercase tracking-widest ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Sold Out'}
                </span>
              </div>
            </div>

            <div className="flex items-baseline gap-4 pt-4">
              <span className="text-5xl font-black text-gray-900 tracking-tighter">₹{(product.discountPrice || product.price).toLocaleString()}</span>
              {product.discountPrice && (
                <span className="text-2xl text-gray-400 line-through font-medium">₹{product.price.toLocaleString()}</span>
              )}
              <span className="text-gray-400 font-bold ml-2">per {product.unit || 'unit'}</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">Product Story</h3>
            <p className="text-gray-600 leading-relaxed text-xl font-medium">
              {product.description || 'No description available for this product.'}
            </p>
          </div>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">Key Features</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, idx) => (
                  <span key={idx} className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-xs font-black uppercase tracking-widest">
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-8 pt-8 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="flex items-center bg-gray-50 rounded-2xl p-1 border border-gray-100">
                <button 
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-14 h-14 flex items-center justify-center bg-white rounded-xl shadow-sm text-gray-400 hover:text-primary-600 transition-colors"
                >
                  <Minus className="w-6 h-6" />
                </button>
                <span className="px-8 font-black text-2xl text-gray-900">{qty}</span>
                <button 
                  onClick={() => setQty(qty + 1)}
                  className="w-14 h-14 flex items-center justify-center bg-white rounded-xl shadow-sm text-gray-400 hover:text-primary-600 transition-colors"
                >
                  <Plus className="w-6 h-6" />
                </button>
              </div>
              
              <button 
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-grow w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white px-12 py-5 rounded-2xl font-black transition-all transform active:scale-95 flex items-center justify-center gap-4 shadow-2xl shadow-primary-200 disabled:opacity-50 text-lg"
              >
                <ShoppingCart className="w-7 h-7" />
                Add to Cart
              </button>
            </div>

            {/* Quick Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
              <div className="flex items-center gap-4 p-4 bg-primary-50/50 rounded-2xl border border-primary-100/50">
                <Truck className="w-6 h-6 text-primary-600" />
                <div>
                  <p className="text-xs font-black text-gray-900 uppercase">Fast Delivery</p>
                  <p className="text-[10px] font-bold text-primary-600">60 Mins</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-primary-50/50 rounded-2xl border border-primary-100/50">
                <RefreshCcw className="w-6 h-6 text-primary-600" />
                <div>
                  <p className="text-xs font-black text-gray-900 uppercase">Returns</p>
                  <p className="text-[10px] font-bold text-primary-600">7 Days</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-primary-50/50 rounded-2xl border border-primary-100/50">
                <ShieldCheck className="w-6 h-6 text-primary-600" />
                <div>
                  <p className="text-xs font-black text-gray-900 uppercase">Verified</p>
                  <p className="text-[10px] font-bold text-primary-600">LocalMart</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
