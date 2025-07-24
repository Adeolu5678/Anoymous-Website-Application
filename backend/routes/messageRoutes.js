const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middleware/authMiddleware');
const uploadMiddleware = require('../middleware/uploadMiddleware');

// Public route - anyone can send a message
router.post('/send/:share_link_id', uploadMiddleware, messageController.sendMessage);

// Protected routes - require authentication
router.get('/', authMiddleware, messageController.getMessages);
router.put('/:message_id/read', authMiddleware, messageController.markMessageAsRead);

module.exports = router; 