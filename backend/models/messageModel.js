const db = require('../config/db');

const messageModel = {
    // Create a new message
    async createMessage(recipientUserId, textContent, imageUrl, senderDeviceModel) {
        const query = `
            INSERT INTO messages (recipient_user_id, text_content, image_url, sender_device_model)
            VALUES ($1, $2, $3, $4)
            RETURNING message_id, created_at
        `;
        const values = [recipientUserId, textContent, imageUrl, senderDeviceModel];
        const result = await db.query(query, values);
        return result.rows[0];
    },

    // Get all messages for a user
    async getMessagesByUserId(userId) {
        const query = `
            SELECT message_id, text_content, image_url, sender_device_model, is_read, created_at
            FROM messages
            WHERE recipient_user_id = $1
            ORDER BY created_at DESC
        `;
        const result = await db.query(query, [userId]);
        return result.rows;
    },

    // Mark a message as read
    async markMessageAsRead(messageId, userId) {
        const query = `
            UPDATE messages
            SET is_read = true
            WHERE message_id = $1 AND recipient_user_id = $2
            RETURNING message_id
        `;
        const result = await db.query(query, [messageId, userId]);
        return result.rows[0];
    },

    // Admin: Get all messages
    async getAllMessages() {
        const query = `
            SELECT message_id, recipient_user_id, text_content, image_url, sender_device_model, is_read, created_at
            FROM messages
            ORDER BY created_at DESC
        `;
        const result = await db.query(query);
        return result.rows;
    },

    // Admin: Delete a message
    async deleteMessage(messageId) {
        const query = 'DELETE FROM messages WHERE message_id = $1 RETURNING message_id';
        const result = await db.query(query, [messageId]);
        return result.rows.length > 0;
    }
};

module.exports = messageModel; 