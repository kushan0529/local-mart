import User from '../models/User.js';
import Shop from '../models/Shop.js';
import Category from '../models/Category.js';
import generateToken from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';
import crypto from 'crypto';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password, phone, role, address, coordinates } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    phone,
    role: role || 'user',
    address,
    location: {
      type: 'Point',
      coordinates: coordinates || [0, 0],
    },
  });

  if (user) {
    res.status(201).json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
};

// @desc    Register shop owner
// @route   POST /api/auth/register-owner
// @access  Public
const registerOwner = async (req, res) => {
  const { name, email, password, phone, shopName, shopDescription, shopAddress, shopCoordinates, shopCategory } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    phone,
    role: 'owner',
    address: shopAddress,
    location: {
      type: 'Point',
      coordinates: shopCoordinates || [0, 0],
    },
  });

  if (user) {
    // Try to find category ID if a name was provided
    let categoryId = shopCategory;
    if (shopCategory && shopCategory.length < 20) { // Likely a name, not an ObjectId
      const category = await Category.findOne({ name: new RegExp(`^${shopCategory}$`, 'i') });
      if (category) {
        categoryId = category._id;
      }
    }

    // Create shop application
    await Shop.create({
      owner: user._id,
      name: shopName,
      description: shopDescription,
      address: shopAddress,
      location: {
        type: 'Point',
        coordinates: shopCoordinates || [0, 0],
      },
      category: categoryId,
      email,
      phone,
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful. Waiting for admin approval.',
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        location: user.location,
        avatar: user.avatar,
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/update-profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      // Basic fields
      user.name = req.body.name || user.name;
      user.phone = req.body.phone || user.phone;
      
      // Address update - ensuring it remains an object
      if (req.body.address && typeof req.body.address === 'object') {
        user.address = {
          street: req.body.address.street || user.address?.street,
          city: req.body.address.city || user.address?.city,
          state: req.body.address.state || user.address?.state,
          pincode: req.body.address.pincode || user.address?.pincode,
        };
      }

      // Location update - must be [longitude, latitude]
      if (req.body.coordinates && Array.isArray(req.body.coordinates)) {
        user.location = {
          type: 'Point',
          coordinates: [
            parseFloat(req.body.coordinates[0]),
            parseFloat(req.body.coordinates[1])
          ],
        };
      }
      
      if (req.body.avatar) {
        user.avatar = req.body.avatar;
      }

      // Only update password if provided and not empty
      if (req.body.password && req.body.password.trim() !== '') {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        success: true,
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        address: updatedUser.address,
        avatar: updatedUser.avatar,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('Update profile error details:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during profile update',
      error: error.message 
    });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    res.status(404);
    throw new Error('User not found with that email');
  }

  // Get reset token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  user.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 mins

  await user.save();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message,
    });

    res.status(200).json({ success: true, data: 'Email sent' });
  } catch (err) {
    console.error(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(500);
    throw new Error('Email could not be sent');
  }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:token
// @access  Public
const resetPassword = async (req, res) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid token');
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    token: generateToken(user._id),
  });
};

export {
  registerUser,
  registerOwner,
  loginUser,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
  resetPassword,
};
