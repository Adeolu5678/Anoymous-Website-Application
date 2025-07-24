import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import messageService from '../api/messageService';

const MessageSendPage: React.FC = () => {
  const { shareLinkId } = useParams<{ shareLinkId: string }>();
  const [textContent, setTextContent] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    } else {
      setImageFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setIsSending(true);

    if (!shareLinkId) {
      setError('Share link ID is missing.');
      setIsSending(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('textContent', textContent);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      await messageService.sendMessage(shareLinkId, formData);

      setMessage('Message sent successfully!');
      setTextContent('');
      setImageFile(null);
    } catch (err: any) {
      setError(err.message || 'Failed to send message.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Send Anonymous Message</h1>
        <p className="text-center text-gray-600 mb-4">To: {shareLinkId ? `User with link: ${shareLinkId}` : 'Unknown User'}</p>

        {message && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">{message}</div>}
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="textContent" className="block text-sm font-medium text-gray-700">Message Text</label>
            <textarea
              id="textContent"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-y"
              rows={4}
              placeholder="Type your anonymous message here..."
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              required={!imageFile} // Require text if no image
            ></textarea>
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image (Optional)</label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              onChange={handleFileChange}
            />
            {imageFile && <p className="mt-2 text-sm text-gray-500">Selected: {imageFile.name}</p>}
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isSending || (!textContent && !imageFile)}
          >
            {isSending ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessageSendPage; 