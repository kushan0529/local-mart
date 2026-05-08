import Product from '../models/Product.js';
import Shop from '../models/Shop.js';
import mongoose from 'mongoose';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  const { search, category, page = 1, limit = 12 } = req.query;

  const query = { isActive: true };

  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }

  if (category) {
    query.category = category;
  }

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    populate: 'category shop',
    sort: { createdAt: -1 },
  };

  const products = await Product.paginate(query, options);
  res.json({ success: true, ...products });
};

// @desc    Get products from nearby shops
// @route   GET /api/products/nearby
// @access  Public
const getNearbyProducts = async (req, res) => {
  const { lat, lng, radius = 10, search, category, page = 1, limit = 12 } = req.query;

  if (!lat || !lng) {
    res.status(400);
    throw new Error('Please provide latitude and longitude');
  }

  // First find nearby shops
  const nearbyShops = await Shop.find({
    isApproved: true,
    location: {
      $near: {
        $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
        $maxDistance: radius * 1000,
      },
    },
  }).select('_id');

  const shopIds = nearbyShops.map((shop) => shop._id);

  const query = {
    isActive: true,
    shop: { $in: shopIds },
  };

  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }

  if (category) {
    query.category = category;
  }

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    populate: 'category shop',
  };

  const products = await Product.paginate(query, options);
  res.json({ success: true, ...products });
};

// @desc    Get single product detail
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category shop');

  if (product) {
    res.json({ success: true, data: product });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private/Owner
const createProduct = async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.user.id });

    if (!shop || !shop.isApproved) {
      return res.status(403).json({ success: false, message: 'Shop not found or not approved.' });
    }

    const productData = { ...req.body };
    
    // Sanitization
    if (!productData.category || productData.category === '') delete productData.category;
    if (!productData.discountPrice || productData.discountPrice === '') delete productData.discountPrice;
    
    productData.shop = shop._id;
    productData.owner = req.user.id;

    if (req.files && req.files.length > 0) {
      productData.images = req.files.map((file) => file.path || file.secure_url);
    }

    const tagsData = req.body.tags || req.body['tags[]'];
    if (tagsData) {
      productData.tags = typeof tagsData === 'string' ? tagsData.split(',').map(t => t.trim()) : tagsData;
    }

    const product = await Product.create(productData);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    console.error('CREATE ERROR:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Owner
const updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const updateData = { ...req.body };
    
    if (updateData.category === '') delete updateData.category;
    if (updateData.discountPrice === '') delete updateData.discountPrice;

    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map((file) => file.path || file.secure_url);
    }

    const tagsData = req.body.tags || req.body['tags[]'];
    if (tagsData) {
      updateData.tags = typeof tagsData === 'string' ? tagsData.split(',').map(t => t.trim()) : tagsData;
    }

    product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Owner/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    await product.deleteOne();
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get all products for a specific shop
// @route   GET /api/products/shop/:shopId
// @access  Public
const getShopProducts = async (req, res) => {
  try {
    let shopId = req.params.shopId;
    
    // Handle special keyword 'my-shop'
    if (shopId === 'my-shop' && req.user) {
      const shop = await Shop.findOne({ owner: req.user._id });
      if (!shop) return res.status(404).json({ success: false, message: 'Shop not found' });
      shopId = shop._id;
    }

    // Ensure shopId is a valid ObjectId before querying
    if (!mongoose.Types.ObjectId.isValid(shopId)) {
      return res.status(400).json({ success: false, message: 'Invalid Shop ID' });
    }

    const products = await Product.find({ shop: shopId, isActive: true }).populate('category');
    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  getProducts,
  getNearbyProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getShopProducts,
};
