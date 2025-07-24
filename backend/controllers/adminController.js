const pool = require('../config/db');

const getAllUsers = async (req, res) => {
  try {
    const users = await pool.query('SELECT user_id, username, share_link_id, profile_picture_url, custom_name, is_admin FROM users');
    res.status(200).json(users.rows);
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

const getMessagesForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const messages = await pool.query(
      'SELECT message_id, text_content, image_url, sender_device_model, is_read, created_at FROM messages WHERE recipient_user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.status(200).json(messages.rows);
  } catch (error) {
    console.error('Error fetching messages for user:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = {
  getAllUsers,
  getMessagesForUser,
}; 