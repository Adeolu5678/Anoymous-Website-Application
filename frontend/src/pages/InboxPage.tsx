import React, { useEffect, useState } from 'react';
import messageService from '../api/messageService';
import CascadingStack from '../components/CascadingStack'; // Import CascadingStack
import authService from '../api/authService'; // Import authService directly to get token

interface Message {
  message_id: string;
  recipient_user_id: string;
  text_content: string | null;
  image_url: string | null;
  sender_device_model: string | null;
  is_read: boolean;
  created_at: string;
}

const InboxPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const token = authService.getToken(); // Get token directly from authService

  useEffect(() => {
    const fetchMessages = async () => {
      if (!token) {
        setError('Authentication token missing. Please log in.');
        setLoading(false);
        return;
      }
      try {
        const fetchedMessages = await messageService.getMessages(token); // Pass token to getMessages
        // Sort messages: unread first, then by date (newest first)
        const sortedMessages = fetchedMessages.sort((a: Message, b: Message) => {
          if (a.is_read === b.is_read) {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          }
          return a.is_read ? 1 : -1; // Unread messages come before read messages
        });
        setMessages(sortedMessages);
      } catch (err: any) {
        setError(err.message);
      }
      finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [token]); // Depend on token

  const handleMessageRead = async (messageId: string) => {
    try {
      if (token) {
        await messageService.markMessageAsRead(token, messageId); // Pass token
        setMessages(prevMessages =>
          prevMessages.map(msg =>
            msg.message_id === messageId ? { ...msg, is_read: true } : msg
          )
        );
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  if (loading) {
    return <div className="text-center mt-8">Loading messages...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="inbox-page-container relative min-h-screen flex flex-col items-center justify-center p-4">
      {/* Warmwind OS inspired blurred background */}
      <div className="warmwind-background-blur"></div>

      <h1 className="text-3xl font-bold mb-8 text-gray-800 z-10">Your Inbox</h1>

      {messages.length === 0 ? (
        <p className="text-lg text-gray-600 z-10">No messages yet.</p>
      ) : (
        <div className="relative w-full max-w-md h-96 z-10">
          <CascadingStack messages={messages} onMessageRead={handleMessageRead} />
        </div>
      )}
    </div>
  );
};

export default InboxPage;