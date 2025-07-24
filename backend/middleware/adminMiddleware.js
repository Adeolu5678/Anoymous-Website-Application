const jwt = require('jsonwebtoken');

const adminMiddleware = (req, res, next) => {
    // Get token from header
    const token = req.header('Authorization');

    // Check if no token
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    try {
        // Expected format: Bearer TOKEN
        const tokenValue = token.split(' ')[1];
        const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET);

        // Attach user ID
        req.userId = decoded.userId;

        // *** THIS IS THE NEW LOG STATEMENT WE NEED TO SEE ***
        console.log('AdminMiddleware: Decoded token username:', decoded.username); 

        // For demonstration, let's assume user with username 'admin' is an admin.
        // In a real app, you would verify a role from the database or user object.
        if (decoded.username !== 'admin') { 
            return res.status(403).json({ message: 'Access denied, not an admin' });
        }

        next();
    } catch (err) {
        console.error('AdminMiddleware: Token verification error:', err.message); // Added error log
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = adminMiddleware;