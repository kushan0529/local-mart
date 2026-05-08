import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Shop from '../models/Shop.js';

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }
      
      next();
    } catch (error) {
      console.error('Auth token error:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Not authorized as an admin' });
  }
};

const isOwner = async (req, res, next) => {
  if (req.user && req.user.role === 'owner') {
    try {
      const shop = await Shop.findOne({ owner: req.user._id });
      if (shop && shop.isApproved) {
        req.shop = shop;
        next();
      } else if (shop && !shop.isApproved) {
        res.status(403).json({ success: false, message: 'Owner account pending approval' });
      } else {
        res.status(403).json({ success: false, message: 'Shop details not found' });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error checking shop status' });
    }
  } else {
    res.status(403).json({ success: false, message: 'Not authorized as an owner' });
  }
};

const isUser = (req, res, next) => {
  if (req.user && req.user.role === 'user') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Not authorized as a user' });
  }
};

export { protect, isAdmin, isOwner, isUser };
