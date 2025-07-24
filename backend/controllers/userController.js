
const userModel = require('../models/userModel');

const userController = {
    // Get a user's public profile by share link ID
    async getUserProfile(req, res) {
        try {
            const { share_link_id } = req.params;
            const user = await userModel.findUserByShareLink(share_link_id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            // Only return public-safe information
            res.json({
                username: user.username,
                custom_name: user.custom_name,
                profile_picture_url: user.profile_picture_url,
                share_link_id: user.share_link_id // Include share_link_id for display
            });
        } catch (error) {
            console.error('Error getting user profile:', error);
            res.status(500).json({ message: 'Error retrieving user profile' });
        }
    },

    // Get the authenticated user's own profile (protected route)
    async getAuthenticatedUserProfile(req, res) {
        try {
            // userId is attached by authMiddleware
            const user = await userModel.findUserById(req.userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            // Return all relevant user details for the authenticated user
            res.json({
                userId: user.user_id,
                username: user.username,
                shareLinkId: user.share_link_id,
                customName: user.custom_name,
                profilePictureUrl: user.profile_picture_url,
                createdAt: user.created_at,
                isAdmin: user.is_admin
            });
        } catch (error) {
            console.error('Error getting authenticated user profile:', error);
            res.status(500).json({ message: 'Error retrieving authenticated user profile' });
        }
    }
};

module.exports = userController; 