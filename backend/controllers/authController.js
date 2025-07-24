const userModel = require('../models/userModel');
const authUtils = require('../utils/authUtils');
const { body, validationResult } = require('express-validator'); // Import express-validator

const authController = {
    // Register new user
    async registerUser(req, res) {
        try {
            // Validate and sanitize input
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { username, password } = req.body;

            // Check if username already exists
            const existingUser = await userModel.findUserByUsername(username);
            if (existingUser) {
                return res.status(400).json({ 
                    message: 'Username already exists' 
                });
            }

            // Hash password and generate share link ID
            const hashedPassword = await authUtils.hashPassword(password);
            const shareLinkId = authUtils.generateShareLinkId();

            // Create user
            const newUser = await userModel.createUser(
                username,
                hashedPassword,
                shareLinkId
            );

            res.status(201).json({
                message: 'User registered successfully',
                user: {
                    username: newUser.username,
                    share_link_id: newUser.share_link_id
                }
            });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ 
                message: 'Error registering user' 
            });
        }
    },

    // Login user
    async loginUser(req, res) {
        try {
            // Validate and sanitize input
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { username, password } = req.body;

            // Find user
            const user = await userModel.findUserByUsername(username);
            if (!user) {
                return res.status(401).json({ 
                    message: 'Invalid credentials' 
                });
            }

            // Verify password
            const isValidPassword = await authUtils.comparePassword(
                password,
                user.hashed_password
            );

            if (!isValidPassword) {
                return res.status(401).json({ 
                    message: 'Invalid credentials' 
                });
            }

            // Generate token - now passes username as well
            const token = authUtils.generateToken(user.user_id, user.username); // Pass user.username

            res.json({
                message: 'Login successful',
                token,
                user: {
                    username: user.username,
                    share_link_id: user.share_link_id
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ 
                message: 'Error logging in' 
            });
        }
    },

    // Get logged-in user's profile
    async getMe(req, res) {
        try {
            const userId = req.user; // User ID populated by authMiddleware
            const user = await userModel.findUserById(userId); // Assuming findUserById exists or create one

            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }

            // Return public-safe user data
            res.status(200).json({
                user_id: user.user_id,
                username: user.username,
                share_link_id: user.share_link_id,
                profile_picture_url: user.profile_picture_url,
                custom_name: user.custom_name,
                is_admin: user.is_admin,
            });
        } catch (error) {
            console.error('Get me error:', error);
            res.status(500).json({ message: 'Error fetching user data.' });
        }
    },
};

module.exports = authController; 