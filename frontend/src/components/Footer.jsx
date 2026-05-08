import React from 'react';
import { ShoppingCart, Mail, Phone } from 'lucide-react';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white text-2xl font-bold">
              <ShoppingCart className="w-8 h-8 text-primary-500" />
              <span>LocalMart</span>
            </div>
            <p className="text-sm leading-relaxed">
              Connecting you with the best local shops in your neighborhood. Fast delivery, trusted owners, and a wide variety of products.
            </p>
            <div className="flex gap-4">
              <FaFacebook className="w-5 h-5 cursor-pointer hover:text-primary-500 transition-colors" />
              <FaTwitter className="w-5 h-5 cursor-pointer hover:text-primary-500 transition-colors" />
              <FaInstagram className="w-5 h-5 cursor-pointer hover:text-primary-500 transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/shops" className="hover:text-primary-500 transition-colors">Find Shops</a></li>
              <li><a href="/products" className="hover:text-primary-500 transition-colors">Browse Products</a></li>
              <li><a href="/register-owner" className="hover:text-primary-500 transition-colors">Sell on LocalMart</a></li>
              <li><a href="/about" className="hover:text-primary-500 transition-colors">About Us</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Customer Support</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/faq" className="hover:text-primary-500 transition-colors">FAQs</a></li>
              <li><a href="/terms" className="hover:text-primary-500 transition-colors">Terms & Conditions</a></li>
              <li><a href="/privacy" className="hover:text-primary-500 transition-colors">Privacy Policy</a></li>
              <li><a href="/contact" className="hover:text-primary-500 transition-colors">Contact Support</a></li>
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Contact Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary-500 flex-shrink-0" />
                <span>support@localmart.com</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary-500 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} LocalMart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
