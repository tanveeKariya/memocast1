import express from 'express';
import { auth } from '../middleware/auth.js';
import {
  demoLogin,
  googleLogin,
  linkedinLogin,
  linkedinPost,
  twitterPost,
  instagramPost,
  register,
  login,
  getMe,
  updateProfile,
  updatePreferences,
  changePassword,
  exportData,
  deleteAccount,
  getStorageStats
} from '../controllers/authController.js';

const router = express.Router();

// Authentication routes
router.post('/demo-login', demoLogin);
router.post('/google-login', googleLogin);
router.post('/linkedin-login', linkedinLogin);
router.post('/register', register);
router.post('/login', login);

// Social media posting routes
router.post('/linkedin-post', auth, linkedinPost);
router.post('/twitter-post', auth, twitterPost);
router.post('/instagram-post', auth, instagramPost);

// User management routes
router.get('/me', auth, getMe);
router.put('/profile', auth, updateProfile);
router.put('/preferences', auth, updatePreferences);
router.put('/password', auth, changePassword);
router.get('/export', auth, exportData);
router.delete('/account', auth, deleteAccount);
router.get('/storage-stats', auth, getStorageStats);

export default router;