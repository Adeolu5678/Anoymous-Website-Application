-- Create UUID extension if it doesn't exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop tables if they exist
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE users (
    user_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    share_link_id VARCHAR(255) NOT NULL UNIQUE,
    profile_picture_url VARCHAR(1024),
    custom_name VARCHAR(255),
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create messages table
CREATE TABLE messages (
    message_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    recipient_user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    text_content TEXT,
    image_url VARCHAR(1024),
    sender_device_model VARCHAR(255),
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_messages_recipient ON messages(recipient_user_id);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_share_link ON users(share_link_id); 