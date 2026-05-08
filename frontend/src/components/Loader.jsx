import React from 'react';

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-100 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="text-gray-500 font-medium animate-pulse">Loading LocalMart...</p>
    </div>
  );
};

export default Loader;
