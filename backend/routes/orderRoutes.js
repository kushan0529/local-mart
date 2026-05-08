import express from 'express';
import {
  placeOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getOwnerOrders,
  updateOrderStatus,
  getAllOrders,
} from '../controllers/orderController.js';
import { protect, isAdmin, isOwner, isUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, isUser, placeOrder);
router.get('/my-orders', protect, isUser, getMyOrders);
router.get('/owner/orders', protect, isOwner, getOwnerOrders);
router.put('/owner/:id/status', protect, isOwner, updateOrderStatus);
router.get('/admin/all', protect, isAdmin, getAllOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/cancel', protect, isUser, cancelOrder);

export default router;
