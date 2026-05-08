import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RegisterOwner from './pages/RegisterOwner';
import ShopDetail from './pages/ShopDetail';
import ProductDetail from './pages/ProductDetail';
import CategoryShops from './pages/CategoryShops';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import MyOrders from './pages/MyOrders';
import Profile from './pages/Profile';
import OwnerDashboard from './pages/owner/OwnerDashboard';
import AddProduct from './pages/owner/AddProduct';
import EditShop from './pages/owner/EditShop';
import OwnerOrders from './pages/owner/OwnerOrders';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCategories from './pages/admin/AdminCategories';

const NotFound = () => <div className="h-[60vh] flex items-center justify-center text-2xl font-bold">404 - Page Not Found</div>;

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/register-owner" element={<RegisterOwner />} />
                <Route path="/shops/:id" element={<ShopDetail />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/category/:id" element={<CategoryShops />} />
                
                {/* Protected User Routes */}
                <Route element={<ProtectedRoute roles={['user', 'owner', 'admin']} />}>
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order-success/:id" element={<OrderSuccess />} />
                  <Route path="/my-orders" element={<MyOrders />} />
                  <Route path="/profile" element={<Profile />} />
                </Route>

                {/* Protected Owner Routes */}
                <Route element={<ProtectedRoute roles={['owner']} />}>
                  <Route path="/owner/dashboard" element={<OwnerDashboard />} />
                  <Route path="/owner/products/add" element={<AddProduct />} />
                  <Route path="/owner/shop/edit" element={<EditShop />} />
                  <Route path="/owner/orders" element={<OwnerOrders />} />
                </Route>

                {/* Protected Admin Routes */}
                <Route element={<ProtectedRoute roles={['admin']} />}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/categories" element={<AdminCategories />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
          <ToastContainer position="bottom-right" autoClose={3000} />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
