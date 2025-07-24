const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const userModel = {
    // Create a new user
    async createUser(username, hashedPassword, shareLinkId) {
        const query = `
            INSERT INTO users (username, hashed_password, share_link_id)
            VALUES ($1, $2, $3)
            RETURNING user_id, username, share_link_id, created_at
        `;
        const values = [username, hashedPassword, shareLinkId];
        const result = await db.query(query, values);
        return result.rows[0];
    },

    // Find user by username
    async findUserByUsername(username) {
        const query = 'SELECT * FROM users WHERE username = $1';
        const result = await db.query(query, [username]);
        return result.rows[0];
    },

    // Find user by user ID
    async findUserById(userId) {
        const query = 'SELECT user_id, username, share_link_id, custom_name, profile_picture_url, created_at, is_admin FROM users WHERE user_id = $1';
        const result = await db.query(query, [userId]);
        return result.rows[0];
    },

    // Find user by share link ID
    async findUserByShareLink(shareLinkId) {
        const query = 'SELECT user_id, username, custom_name, profile_picture_url, share_link_id FROM users WHERE share_link_id = $1';
        const result = await db.query(query, [shareLinkId]);
        return result.rows[0];
    },

    // Update user profile
    async updateUserProfile(userId, customName, profilePictureUrl) {
        const query = `
            UPDATE users 
            SET custom_name = $2, profile_picture_url = $3
            WHERE user_id = $1
            RETURNING user_id, username, custom_name, profile_picture_url
        `;
        const result = await db.query(query, [userId, customName, profilePictureUrl]);
        return result.rows[0];
    },

    // Admin: Get all users
    async getAllUsers() {
        const query = 'SELECT user_id, username, share_link_id, created_at, custom_name, profile_picture_url FROM users';
        const result = await db.query(query);
        return result.rows;
    },

    // Admin: Delete a user
    async deleteUser(userId) {
        const query = 'DELETE FROM users WHERE user_id = $1 RETURNING user_id';
        const result = await db.query(query, [userId]);
        return result.rows.length > 0;
    }
};

module.exports = userModel; 