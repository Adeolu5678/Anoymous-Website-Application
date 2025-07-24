const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware'); // Import auth middleware
const { body } = require('express-validator'); // Import body from express-validator

// POST /api/auth/register - Register a new user
router.post(
    '/register',
    [
        body('username').isLength({ min: 3 }).trim().escape().withMessage('Username must be at least 3 characters long.'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
    ],
    authController.registerUser
);

// POST /api/auth/login - User login
router.post(
    '/login',
    [
        body('username').trim().escape().notEmpty().withMessage('Username is required.'),
        body('password').notEmpty().withMessage('Password is required.'),
    ],
    authController.loginUser
);

// GET /api/auth/me - Get logged-in user's profile (protected)
router.get('/me', authMiddleware, authController.getMe); // Add this route

module.exports = router; 