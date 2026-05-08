import User from '../models/User.js';
import Shop from '../models/Shop.js';
import Order from '../models/Order.js';
import Category from '../models/Category.js';

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  const usersCount = await User.countDocuments({ role: 'user' });
  const ownersCount = await User.countDocuments({ role: 'owner' });
  const shopsCount = await Shop.countDocuments({});
  const ordersCount = await Order.countDocuments({});
  
  const revenue = await Order.aggregate([
    { $match: { paymentStatus: 'Paid' } },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } }
  ]);

  res.json({
    success: true,
    data: {
      usersCount,
      ownersCount,
      shopsCount,
      ordersCount,
      totalRevenue: revenue.length > 0 ? revenue[0].total : 0
    }
  });
};

// @desc    Get all shop owner applications
// @route   GET /api/admin/owners
// @access  Private/Admin
const getOwners = async (req, res) => {
  const owners = await Shop.find({ isApproved: false }).populate('owner', 'name email phone');
  res.json({ success: true, data: owners });
};

// @desc    Approve shop owner
// @route   PUT /api/admin/owners/:id/approve
// @access  Private/Admin
const approveOwner = async (req, res) => {
  const shop = await Shop.findById(req.params.id);

  if (shop) {
    shop.isApproved = true;
    await shop.save();
    res.json({ success: true, message: 'Shop approved successfully' });
  } else {
    res.status(404);
    throw new Error('Shop not found');
  }
};

// @desc    Reject shop owner
// @route   PUT /api/admin/owners/:id/reject
// @access  Private/Admin
const rejectOwner = async (req, res) => {
  const shop = await Shop.findById(req.params.id);

  if (shop) {
    shop.isApproved = false;
    await shop.save();
    res.json({ success: true, message: 'Shop rejected successfully' });
  } else {
    res.status(404);
    throw new Error('Shop not found');
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  const users = await User.find({});
  res.json({ success: true, data: users });
};

// @desc    Toggle user status
// @route   PUT /api/admin/users/:id/toggle
// @access  Private/Admin
const toggleUserStatus = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}` });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};

// @desc    Get all categories
// @route   GET /api/admin/categories
// @access  Private/Admin
const getCategories = async (req, res) => {
  const categories = await Category.find({});
  res.json({ success: true, data: categories });
};

// @desc    Create category
// @route   POST /api/admin/categories
// @access  Private/Admin
const createCategory = async (req, res) => {
  try {
    const { name, icon, image, description } = req.body;
    console.log('Creating category:', { name, icon, description });

    const categoryExists = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });

    if (categoryExists) {
      console.log('Category already exists:', name);
      res.status(400);
      throw new Error(`Category "${name}" already exists`);
    }

    const category = await Category.create({ name, icon, image, description });
    console.log('Category created:', category._id);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    console.error('Create Category Error:', error.message);
    throw error;
  }
};

// @desc    Update category
// @route   PUT /api/admin/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (category) {
    res.json({ success: true, data: category });
  } else {
    res.status(404);
    throw new Error('Category not found');
  }
};

// @desc    Delete category
// @route   DELETE /api/admin/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (category) {
    await category.deleteOne();
    res.json({ success: true, data: {} });
  } else {
    res.status(404);
    throw new Error('Category not found');
  }
};

export {
  getDashboardStats,
  getOwners,
  approveOwner,
  rejectOwner,
  getAllUsers,
  toggleUserStatus,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
};
