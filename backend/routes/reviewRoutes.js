import express from 'express';
import {
  addProductReview,
  getProductReviews,
  deleteReview,
} from '../controllers/reviewController.js';
import { protect, isUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/product/:productId', getProductReviews);
router.post('/product/:productId', protect, isUser, addProductReview);
router.delete('/:id', protect, deleteReview);

export default router;
