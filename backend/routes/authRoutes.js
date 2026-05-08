import express from 'express';
import {
  registerUser,
  registerOwner,
  loginUser,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/register-owner', registerOwner);
router.post('/login', loginUser);
router.get('/me', protect, getUserProfile);
router.put('/update-profile', protect, updateUserProfile);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

export default router;
