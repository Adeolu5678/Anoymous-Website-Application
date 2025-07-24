const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const adminAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userResult = await pool.query('SELECT is_admin FROM users WHERE user_id = $1', [decoded.userId]);

    if (userResult.rows.length === 0 || !userResult.rows[0].is_admin) {
      throw new Error('Not authorized as an admin.');
    }

    req.user = decoded.userId;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate as an admin.' });
  }
};

module.exports = adminAuthMiddleware; 