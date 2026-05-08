import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, User, LogOut, Menu, X, Store, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const cartCount = cart.items.reduce((acc, item) => acc + item.qty, 0);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 text-2xl font-black text-primary-600 tracking-tight">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white">
                <ShoppingCart className="w-6 h-6" />
              </div>
              <span className="hidden sm:block">LocalMart</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-600 font-bold hover:text-primary-600 transition-colors">Home</Link>
            
            {user ? (
              <div className="flex items-center gap-6">
                {/* Role-based Dashboard Link */}
                {user.role === 'owner' && (
                  <Link to="/owner/dashboard" className="flex items-center gap-2 bg-primary-50 text-primary-600 px-4 py-2 rounded-xl font-bold hover:bg-primary-100 transition-all">
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link to="/admin/dashboard" className="flex items-center gap-2 bg-primary-50 text-primary-600 px-4 py-2 rounded-xl font-bold hover:bg-primary-100 transition-all">
                    <LayoutDashboard className="w-4 h-4" />
                    Admin Panel
                  </Link>
                )}

                <Link to="/cart" className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors">
                  <ShoppingCart className="w-6 h-6" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                      {cartCount}
                    </span>
                  )}
                </Link>

                <div className="group relative">
                  <button className="flex items-center gap-2 text-gray-700 font-bold hover:text-primary-600 transition-colors">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5" />
                    </div>
                    <span className="max-w-[100px] truncate">{user.name}</span>
                  </button>
                  
                  <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-2xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform translate-y-2 group-hover:translate-y-0">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-medium">My Profile</Link>
                    <Link to="/my-orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-medium">My Orders</Link>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-bold flex items-center gap-2">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-gray-600 font-bold hover:text-primary-600 px-4 py-2 transition-colors">Sign In</Link>
                <Link to="/register" className="bg-primary-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary-700 shadow-lg shadow-primary-100 transition-all active:scale-95">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-4">
            {user && (
              <Link to="/cart" className="relative p-2 text-gray-600">
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-gray-600">
              {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 pb-6 animate-in slide-in-from-top duration-300">
          <div className="px-4 pt-4 space-y-2">
            {user ? (
              <>
                <div className="p-4 bg-gray-50 rounded-2xl mb-4">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Logged in as</p>
                  <p className="text-lg font-bold text-gray-900">{user.name}</p>
                  <p className="text-sm text-primary-600 font-medium capitalize">{user.role}</p>
                </div>
                {user.role === 'owner' && (
                  <Link to="/owner/dashboard" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-primary-600 bg-primary-50 rounded-xl font-bold">Dashboard</Link>
                )}
                <Link to="/" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-gray-700 font-bold">Home</Link>
                <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-gray-700 font-bold">My Profile</Link>
                <Link to="/my-orders" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-gray-700 font-bold">My Orders</Link>
                <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-red-600 font-bold flex items-center gap-2">
                  <LogOut className="w-5 h-5" /> Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-center py-4 text-gray-700 font-bold border border-gray-100 rounded-2xl">Sign In</Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)} className="text-center py-4 bg-primary-600 text-white font-bold rounded-2xl">Create Account</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
