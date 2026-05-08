import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Clock } from 'lucide-react';

const ShopCard = ({ shop }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 flex flex-col h-full">
      <Link to={`/shops/${shop._id}`} className="relative block h-40 overflow-hidden">
        <img
          src={shop.banner || 'https://via.placeholder.com/600x300?text=Shop+Banner'}
          alt={shop.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-3 left-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg border-2 border-white overflow-hidden bg-white shadow-lg">
            <img 
              src={shop.logo || 'https://via.placeholder.com/100x100?text=Logo'} 
              alt={shop.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-white">
            <h3 className="font-bold text-lg leading-tight line-clamp-1">{shop.name}</h3>
            <div className="flex items-center gap-1 text-[10px]">
              <span className="bg-primary-500/80 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">
                {shop.category?.name || 'Local Shop'}
              </span>
            </div>
          </div>
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-2 py-0.5 rounded-full text-xs font-bold">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{shop.rating.toFixed(1)}</span>
            <span className="text-green-300">|</span>
            <span className="font-normal">{shop.numReviews} reviews</span>
          </div>
          <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${shop.isOpen ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'}`}>
            {shop.isOpen ? 'OPEN NOW' : 'CLOSED'}
          </div>
        </div>

        <p className="text-gray-500 text-sm mb-4 line-clamp-2">
          {shop.description}
        </p>

        <div className="mt-auto space-y-2 pt-2 border-t border-gray-50">
          <div className="flex items-center gap-2 text-gray-400 text-xs">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="line-clamp-1">{shop.address?.city}, {shop.address?.state}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-xs">
            <Clock className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{shop.openTime} - {shop.closeTime}</span>
          </div>
        </div>

        <Link 
          to={`/shops/${shop._id}`}
          className="mt-4 w-full py-2 bg-gray-50 hover:bg-primary-600 hover:text-white text-gray-700 text-sm font-bold rounded-lg text-center transition-all duration-200"
        >
          View Shop
        </Link>
      </div>
    </div>
  );
};

export default ShopCard;
