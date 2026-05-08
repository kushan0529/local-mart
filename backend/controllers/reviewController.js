import Review from '../models/Review.js';
import Product from '../models/Product.js';
import Shop from '../models/Shop.js';
import Order from '../models/Order.js';

// @desc    Add product review
// @route   POST /api/reviews/product/:productId
// @access  Private/User
const addProductReview = async (req, res) => {
  const { rating, comment } = req.body;
  const productId = req.params.productId;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Check if user has already reviewed
  const alreadyReviewed = await Review.findOne({ user: req.user._id, product: productId });
  if (alreadyReviewed) {
    res.status(400);
    throw new Error('Product already reviewed');
  }

  // Optional: Check if user has ordered the product
  const hasOrdered = await Order.findOne({
    user: req.user._id,
    'items.product': productId,
    orderStatus: 'Delivered'
  });

  if (!hasOrdered) {
    res.status(400);
    throw new Error('You can only review products you have purchased and received');
  }

  const review = await Review.create({
    user: req.user._id,
    product: productId,
    shop: product.shop,
    rating: Number(rating),
    comment
  });

  // Update product rating
  const reviews = await Review.find({ product: productId });
  product.numReviews = reviews.length;
  product.rating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
  await product.save();

  // Update shop rating
  const shop = await Shop.findById(product.shop);
  const shopReviews = await Review.find({ shop: product.shop });
  shop.numReviews = shopReviews.length;
  shop.rating = shopReviews.reduce((acc, item) => item.rating + acc, 0) / shopReviews.length;
  await shop.save();

  res.status(201).json({ success: true, data: review });
};

// @desc    Get reviews for product
// @route   GET /api/reviews/product/:productId
// @access  Public
const getProductReviews = async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId }).populate('user', 'name avatar');
  res.json({ success: true, data: reviews });
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
const deleteReview = async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (review) {
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      res.status(401);
      throw new Error('Not authorized to delete this review');
    }
    await review.deleteOne();
    res.json({ success: true, data: {} });
  } else {
    res.status(404);
    throw new Error('Review not found');
  }
};

export { addProductReview, getProductReviews, deleteReview };
