const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const authUtils = {
    // Hash password
    async hashPassword(password) {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    },

    // Compare password with hash
    async comparePassword(password, hash) {
        return await bcrypt.compare(password, hash);
    },

    // Generate a unique share link ID
    generateShareLinkId() {
        return uuidv4();
    },

    // Generate JWT token - now includes username in payload
    generateToken(userId, username) { // Added username parameter
        return jwt.sign(
            { userId, username }, // Include username in the payload
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
    },

    // Verify JWT token
    verifyToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return null;
        }
    }
};

module.exports = authUtils; 