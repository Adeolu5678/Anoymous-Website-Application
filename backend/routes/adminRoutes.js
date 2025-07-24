const express = require('express');
const adminController = require('../controllers/adminController');
const adminAuthMiddleware = require('../middleware/adminAuthMiddleware');

const router = express.Router();

// Protect all admin routes with adminAuthMiddleware
router.use(adminAuthMiddleware);

router.get('/users', adminController.getAllUsers);
router.get('/users/:userId/messages', adminController.getMessagesForUser);

module.exports = router;