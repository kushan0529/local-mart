import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product._id, 1);
    toast.success(`${product.name} added to cart!`);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80';
    if (imagePath.startsWith('http')) return imagePath;
    const backendUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001';
    return `${backendUrl}/${imagePath}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 h-full flex flex-col">
      <Link to={`/products/${product._id}`} className="relative block h-48 overflow-hidden">
        <img
          src={getImageUrl(product.images?.[0])}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {product.discountPrice && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
          </div>
        )}
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <Link to={`/products/${product._id}`} className="block">
          <h3 className="text-gray-900 font-semibold mb-1 group-hover:text-primary-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-gray-500 text-xs mb-2 line-clamp-2 min-h-[32px]">
          {product.description}
        </p>

        <div className="flex items-center gap-1 mb-3">
          <div className="flex items-center text-yellow-400">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="text-gray-700 text-xs font-bold ml-1">{product.rating?.toFixed(1) || '4.5'}</span>
          </div>
          <span className="text-gray-400 text-[10px]">({product.numReviews || 0})</span>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-900">₹{product.discountPrice || product.price}</span>
              {product.discountPrice && (
                <span className="text-gray-400 text-sm line-through">₹{product.price}</span>
              )}
            </div>
            <span className="text-[10px] text-gray-500">{product.unit || 'per unit'}</span>
          </div>

          <button
            onClick={handleAddToCart}
            className="bg-primary-600 text-white p-2.5 rounded-xl hover:bg-primary-700 transition-colors shadow-sm hover:shadow-lg active:scale-95 duration-200"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
