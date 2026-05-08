import express from 'express';
import {
  getProducts,
  getNearbyProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getShopProducts,
} from '../controllers/productController.js';
import { protect, isOwner } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/nearby', getNearbyProducts);
router.get('/shop/:shopId', protect, getShopProducts);
router.get('/:id', getProductById);

router.post('/', protect, isOwner, upload.array('images', 5), createProduct);
router.put('/:id', protect, isOwner, upload.array('images', 5), updateProduct);
router.delete('/:id', protect, deleteProduct);

export default router;
