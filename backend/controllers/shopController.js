import mongoose from 'mongoose';
import Shop from '../models/Shop.js';
import User from '../models/User.js';
import Category from '../models/Category.js';

// @desc    Get all approved shops
// @route   GET /api/shops
// @access  Public
const getShops = async (req, res) => {
  const { category } = req.query;
  const query = { isApproved: true };

  if (category) {
    query.category = category;
  }

  const shops = await Shop.find(query).populate('category owner', 'name email avatar');
  res.json({ success: true, count: shops.length, data: shops });
};

// @desc    Get shops sorted by distance
// @route   GET /api/shops/nearby
// @access  Public
const getNearbyShops = async (req, res) => {
  const { lat, lng, radius = 10, category } = req.query;

  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);

  if (isNaN(latitude) || isNaN(longitude)) {
    return res.status(200).json({ 
      success: true, 
      count: 0, 
      data: [], 
      message: 'Invalid or missing coordinates' 
    });
  }

  try {
    const pipeline = [
      {
        $geoNear: {
          near: { type: 'Point', coordinates: [longitude, latitude] },
          distanceField: 'distance',
          maxDistance: radius * 1000, // convert km to meters
          spherical: true,
          query: { isApproved: true }
        }
      }
    ];

    if (category) {
      pipeline[0].$geoNear.query.category = new mongoose.Types.ObjectId(category);
    }

    const shops = await Shop.aggregate(pipeline);
    
    // Populate after aggregation
    const populatedShops = await Shop.populate(shops, { path: 'category owner', select: 'name email avatar' });

    res.json({ success: true, count: populatedShops.length, data: populatedShops });
  } catch (err) {
    console.error('Nearby shops aggregation error:', err);
    res.status(500).json({ success: false, message: 'Error searching for nearby shops' });
  }
};

// @desc    Get all unique categories
// @route   GET /api/shops/categories
// @access  Public
const getCategories = async (req, res) => {
  const categoryIds = await Shop.distinct('category', { isApproved: true });
  const categories = await Category.find({ _id: { $in: categoryIds } });
  
  if (categories.length === 0) {
    const allCategories = await Category.find();
    return res.json({ success: true, count: allCategories.length, data: allCategories });
  }

  res.json({ success: true, count: categories.length, data: categories });
};

// @desc    Get single shop details
// @route   GET /api/shops/:id
// @access  Public
const getShopById = async (req, res) => {
  const shop = await Shop.findById(req.params.id).populate('category owner', 'name email avatar phone');

  if (shop) {
    res.json({ success: true, data: shop });
  } else {
    res.status(404);
    throw new Error('Shop not found');
  }
};

// @desc    Create shop
// @route   POST /api/shops
// @access  Private/Owner
const createShop = async (req, res) => {
  req.body.owner = req.user.id;

  const shopExists = await Shop.findOne({ owner: req.user.id });

  if (shopExists) {
    res.status(400);
    throw new Error('User already has a shop');
  }

  const shop = await Shop.create(req.body);

  res.status(201).json({ success: true, data: shop });
};

// @desc    Update shop info
// @route   PUT /api/shops/:id
// @access  Private/Owner
const updateShop = async (req, res) => {
  let shop = await Shop.findById(req.params.id);

  if (!shop) {
    res.status(404);
    throw new Error('Shop not found');
  }

  // Make sure user is shop owner
  if (shop.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized to update this shop');
  }

  shop = await Shop.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json({ success: true, data: shop });
};

// @desc    Delete shop
// @route   DELETE /api/shops/:id
// @access  Private/Owner/Admin
const deleteShop = async (req, res) => {
  const shop = await Shop.findById(req.params.id);

  if (!shop) {
    res.status(404);
    throw new Error('Shop not found');
  }

  // Make sure user is shop owner
  if (shop.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized to delete this shop');
  }

  await shop.deleteOne();

  res.json({ success: true, data: {} });
};

// @desc    Get owner's own shop
// @route   GET /api/shops/owner/my-shop
// @access  Private/Owner
const getMyShop = async (req, res) => {
  const shop = await Shop.findOne({ owner: req.user.id }).populate('category');

  if (shop) {
    res.json({ success: true, data: shop });
  } else {
    res.status(404);
    throw new Error('Shop not found');
  }
};

export {
  getShops,
  getNearbyShops,
  getCategories,
  getShopById,
  createShop,
  updateShop,
  deleteShop,
  getMyShop,
};
