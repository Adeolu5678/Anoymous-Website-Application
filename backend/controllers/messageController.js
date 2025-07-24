const messageModel = require('../models/messageModel');
const userModel = require('../models/userModel');

const messageController = {
    // Send a message to a user by their share link
    async sendMessage(req, res) {
        try {
            const { share_link_id } = req.params;
            const { textContent } = req.body;
            const senderDeviceModel = req.headers['user-agent'] || null;

            console.log('Received request:', {
                share_link_id,
                text_content: textContent ? 'present' : 'not present',
                file: req.file ? 'present' : 'not present'
            });

            // Find recipient user
            const recipient = await userModel.findUserByShareLink(share_link_id);
            if (!recipient) {
                return res.status(404).json({ message: 'Recipient not found' });
            }

            // Get image URL if an image was uploaded
            const imageUrl = req.file ? `http://localhost:${process.env.PORT || 5000}${req.file.url}` : null;

            // Validate that either text or image is provided
            if (!textContent && !imageUrl) {
                return res.status(400).json({ 
                    message: 'Message must contain either text or an image' 
                });
            }

            const message = await messageModel.createMessage(
                recipient.user_id,
                textContent,
                imageUrl,
                senderDeviceModel
            );

            res.status(201).json({
                message: 'Message sent successfully',
                messageId: message.message_id,
                imageUrl: imageUrl
            });
        } catch (error) {
            console.error('Send message error:', error);
            res.status(500).json({ 
                message: 'Error sending message',
                details: error.message 
            });
        }
    },

    // Get all messages for authenticated user
    async getMessages(req, res) {
        try {
            const messages = await messageModel.getMessagesByUserId(req.userId);
            // Add full URL to image paths
            messages.forEach(message => {
                if (message.image_url && !message.image_url.startsWith('http')) {
                    message.image_url = `http://localhost:${process.env.PORT || 5000}${message.image_url}`;
                }
            });
            res.json({ messages });
        } catch (error) {
            console.error('Get messages error:', error);
            res.status(500).json({ 
                message: 'Error retrieving messages',
                details: error.message 
            });
        }
    },

    // Mark a message as read
    async markMessageAsRead(req, res) {
        try {
            const { message_id } = req.params;
            const result = await messageModel.markMessageAsRead(message_id, req.userId);
            
            if (!result) {
                return res.status(404).json({ message: 'Message not found' });
            }

            res.json({ message: 'Message marked as read' });
        } catch (error) {
            console.error('Mark as read error:', error);
            res.status(500).json({ 
                message: 'Error marking message as read',
                details: error.message 
            });
        }
    }
};

module.exports = messageController; 