import express from 'express';
import {
  getShops,
  getNearbyShops,
  getCategories,
  getShopById,
  createShop,
  updateShop,
  deleteShop,
  getMyShop,
} from '../controllers/shopController.js';
import { protect, isOwner } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getShops);
router.get('/nearby', getNearbyShops);
router.get('/categories', getCategories);
router.get('/owner/my-shop', protect, isOwner, getMyShop);
router.get('/:id', getShopById);
router.post('/', protect, createShop);
router.put('/:id', protect, updateShop);
router.delete('/:id', protect, deleteShop);

export default router;
