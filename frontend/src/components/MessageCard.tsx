import React from 'react';
import { formatToWAT } from '../utils/dateUtils';

interface MessageCardProps {
  message: {
    message_id: string;
    text_content: string | null;
    image_url: string | null;
    created_at: string;
    sender_device_model: string | null;
  };
}

const MessageCard: React.FC<MessageCardProps> = ({ message }) => {
  return (
    <div className="message-card border p-4 mb-4 rounded-lg shadow-md bg-white relative overflow-hidden">
      {message.text_content && (
        <p className="text-gray-800 text-lg mb-2">{message.text_content}</p>
      )}
      {message.image_url && (
        <div className="image-container mb-2">
          <img src={message.image_url} alt="Message attachment" className="max-w-full h-auto rounded" />
        </div>
      )}
      <div className="message-footer text-sm text-gray-500 flex justify-between items-center">
        <span>Received: {formatToWAT(message.created_at)}</span>
        {message.sender_device_model && (
          <span className="text-xs text-gray-400">From: {message.sender_device_model}</span>
        )}
      </div>
    </div>
  );
};

export default MessageCard; 