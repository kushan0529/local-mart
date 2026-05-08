import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log('Login attempt started for:', email);
    try {
      const data = await login(email, password);
      console.log('Login successful. User data received:', data);
      console.log('User role:', data.role);
      
      toast.success('Welcome back!');
      
      // Smart redirect
      if (data.role === 'owner') {
        console.log('Redirecting to owner dashboard...');
        navigate('/owner/dashboard', { replace: true });
      } else if (data.role === 'admin') {
        console.log('Redirecting to admin dashboard...');
        navigate('/admin/dashboard', { replace: true });
      } else {
        const from = location.state?.from?.pathname || '/';
        console.log('Redirecting to:', from);
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error('Login error:', err);
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-3xl font-extrabold text-primary-600 mb-2">
            <ShoppingCart className="w-10 h-10" />
            <span>LocalMart</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link to="/register" className="font-bold text-primary-600 hover:text-primary-500">
              create a new account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="name@example.com"
                />
                <Mail className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-bold text-gray-700">Password</label>
                <Link to="/forgot-password" size="sm" className="text-sm font-bold text-primary-600 hover:text-primary-500">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
                <Lock className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all active:scale-[0.98] disabled:opacity-70"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
            </button>
          </div>
        </form>

        <div className="pt-6 border-t border-gray-100 mt-6">
          <p className="text-center text-sm text-gray-500 font-medium">
            Are you a shop owner?{' '}
            <Link to="/register-owner" className="text-primary-600 font-bold hover:text-primary-500">
              Register your shop here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
