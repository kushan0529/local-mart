import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import mongoose from 'mongoose';

// @desc    Place order
// @route   POST /api/orders
// @access  Private/User
const placeOrder = async (req, res) => {
  try {
    console.log('PLACE ORDER REQUEST BODY:', JSON.stringify(req.body, null, 2));
    const { cartItems, shippingAddress, paymentMethod, totalPrice, deliveryCharge, discount, shopId } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items' });
    }

    if (!shopId) {
      return res.status(400).json({ success: false, message: 'Shop ID is required' });
    }

    // Deep fetch product details for each item to ensure validation passes
    const orderItems = await Promise.all(cartItems.map(async (item) => {
      const productId = item.product?._id || item.product;
      const product = await Product.findById(productId);
      
      if (!product) {
        throw new Error(`Product not found: ${productId}`);
      }

      return {
        product: product._id,
        name: product.name,
        image: product.images?.[0] || '',
        price: product.discountPrice || product.price,
        qty: item.qty
      };
    }));

    const order = new Order({
      user: req.user._id,
      shop: shopId,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      deliveryCharge,
      discount,
    });

    const createdOrder = await order.save();

    // Clear user cart
    await Cart.findOneAndUpdate({ user: req.user._id }, { $set: { items: [] } });

    res.status(201).json({ success: true, data: createdOrder });
  } catch (error) {
    console.error('PLACE ORDER ERROR:', error);
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Get logged-in user's orders
// @route   GET /api/orders/my-orders
// @access  Private/User
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('shop', 'name').sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single order detail
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user shop', 'name email');

    if (order) {
      // Check if user is authorized to see this order
      if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'owner') {
        return res.status(401).json({ success: false, message: 'Not authorized' });
      }
      res.json({ success: true, data: order });
    } else {
      res.status(404).json({ success: false, message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private/User
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      if (order.user.toString() !== req.user.id.toString()) {
        return res.status(401).json({ success: false, message: 'Not authorized' });
      }

      if (order.orderStatus !== 'Placed') {
        return res.status(400).json({ success: false, message: 'Order cannot be cancelled at this stage' });
      }

      order.orderStatus = 'Cancelled';
      const updatedOrder = await order.save();
      res.json({ success: true, data: updatedOrder });
    } else {
      res.status(404).json({ success: false, message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders for owner's shop
// @route   GET /api/orders/owner/orders
// @access  Private/Owner
const getOwnerOrders = async (req, res) => {
  try {
    if (!req.shop) {
      return res.status(404).json({ success: false, message: 'Shop not found' });
    }
    const orders = await Order.find({ shop: req.shop._id }).populate('user', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/owner/:id/status
// @access  Private/Owner
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      if (order.shop.toString() !== req.shop._id.toString()) {
        return res.status(401).json({ success: false, message: 'Not authorized' });
      }

      order.orderStatus = req.body.status || order.orderStatus;
      if (req.body.status === 'Delivered') {
        order.deliveredAt = Date.now();
        order.paymentStatus = 'Paid'; // Assume paid on delivery for COD
      }

      const updatedOrder = await order.save();
      res.json({ success: true, data: updatedOrder });
    } else {
      res.status(404).json({ success: false, message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/orders/admin/all
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user shop', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  placeOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getOwnerOrders,
  updateOrderStatus,
  getAllOrders,
};
