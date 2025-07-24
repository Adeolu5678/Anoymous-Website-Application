const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

// Public route to get a user's public profile by share link ID
router.get('/:share_link_id/profile', userController.getUserProfile);

// Protected route to get the authenticated user's own profile
router.get('/me', authMiddleware, userController.getAuthenticatedUserProfile);

module.exports = router; 