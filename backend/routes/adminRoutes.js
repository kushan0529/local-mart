import express from 'express';
import {
  getDashboardStats,
  getOwners,
  approveOwner,
  rejectOwner,
  getAllUsers,
  toggleUserStatus,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/adminController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(isAdmin);

router.get('/dashboard', getDashboardStats);
router.get('/owners', getOwners);
router.put('/owners/:id/approve', approveOwner);
router.put('/owners/:id/reject', rejectOwner);
router.get('/users', getAllUsers);
router.put('/users/:id/toggle', toggleUserStatus);
router.get('/categories', getCategories);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

export default router;
