import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import adminService from '../../api/adminService';
import { useAuth } from '../../contexts/AuthContext'; // Corrected import to use useAuth hook

interface Message {
  message_id: string;
  text_content: string | null;
  image_url: string | null;
  sender_device_model: string | null;
  is_read: boolean;
  created_at: string;
}

const AdminUserMessagesPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { token } = useAuth(); // Using useAuth hook to get token

  useEffect(() => {
    const fetchMessages = async () => {
      if (!token) {
        setError('Authentication token not found. Please log in as admin.');
        setLoading(false);
        navigate('/admin/login');
        return;
      }
      if (!userId) {
        setError('User ID is missing.');
        setLoading(false);
        return;
      }
      try {
        const fetchedMessages = await adminService.getMessagesForUser(token, userId);
        setMessages(fetchedMessages);
      } catch (err: any) {
        setError(err || 'Failed to fetch messages.');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [token, userId, navigate]);

  if (loading) {
    return <div className="text-center mt-8">Loading messages...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Messages for User: {userId}</h2>
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="mb-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
        >
          &larr; Back to Admin Dashboard
        </button>
        {messages.length === 0 ? (
          <p className="text-center">No messages found for this user.</p>
        ) : (
          <ul className="space-y-4">
            {messages.map((message) => (
              <li key={message.message_id} className="p-4 bg-gray-50 rounded-md shadow-sm">
                <p><strong>Content:</strong> {message.text_content}</p>
                {message.image_url && (
                  <img src={message.image_url} alt="Message attachment" className="max-w-full h-auto mt-2 rounded-md" />
                )}
                <p className="text-sm text-gray-600"><strong>Sender Device:</strong> {message.sender_device_model || 'N/A'}</p>
                <p className="text-sm text-gray-600"><strong>Read:</strong> {message.is_read ? 'Yes' : 'No'}</p>
                <p className="text-sm text-gray-600"><strong>Received:</strong> {new Date(message.created_at).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminUserMessagesPage; 