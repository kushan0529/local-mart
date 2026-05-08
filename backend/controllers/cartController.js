import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// Helper to get populated cart
const getPopulatedCart = async (userId) => {
  return await Cart.findOne({ user: userId }).populate({
    path: 'items.product',
    select: 'name images price discountPrice brand unit stock'
  }).populate('items.shop', 'name');
};

// @desc    Get current user's cart
// @route   GET /api/cart
// @access  Private/User
const getCart = async (req, res) => {
  let cart = await getPopulatedCart(req.user.id);

  if (!cart) {
    cart = await Cart.create({ user: req.user.id, items: [] });
  }

  res.json({ success: true, data: cart });
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private/User
const addToCart = async (req, res) => {
  const { productId, qty } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  let cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    cart = await Cart.create({
      user: req.user.id,
      items: [{ product: productId, shop: product.shop, qty, price: product.discountPrice || product.price }],
    });
  } else {
    const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);

    if (itemIndex > -1) {
      cart.items[itemIndex].qty += qty;
      cart.items[itemIndex].price = product.discountPrice || product.price; // Update to latest price
    } else {
      cart.items.push({ product: productId, shop: product.shop, qty, price: product.discountPrice || product.price });
    }
    await cart.save();
  }

  const updatedCart = await getPopulatedCart(req.user.id);
  res.json({ success: true, data: updatedCart });
};

// @desc    Update item qty
// @route   PUT /api/cart/update
// @access  Private/User
const updateCartItem = async (req, res) => {
  const { productId, qty } = req.body;

  const cart = await Cart.findOne({ user: req.user.id });

  if (cart) {
    const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);

    if (itemIndex > -1) {
      if (qty <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].qty = qty;
      }
      await cart.save();
      
      const updatedCart = await getPopulatedCart(req.user.id);
      res.json({ success: true, data: updatedCart });
    } else {
      res.status(404);
      throw new Error('Item not found in cart');
    }
  } else {
    res.status(404);
    throw new Error('Cart not found');
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:productId
// @access  Private/User
const removeCartItem = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id });

  if (cart) {
    cart.items = cart.items.filter((item) => item.product.toString() !== req.params.productId);
    await cart.save();
    
    const updatedCart = await getPopulatedCart(req.user.id);
    res.json({ success: true, data: updatedCart });
  } else {
    res.status(404);
    throw new Error('Cart not found');
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart/clear
// @access  Private/User
const clearCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id });

  if (cart) {
    cart.items = [];
    await cart.save();
    res.json({ success: true, data: cart });
  } else {
    res.status(404);
    throw new Error('Cart not found');
  }
};

export { getCart, addToCart, updateCartItem, removeCartItem, clearCart };
