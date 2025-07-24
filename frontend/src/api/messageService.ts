
import api from './api';
import axios from 'axios'; 

// Custom type guard for Axios errors (more robust and self-contained)
// This avoids directly referencing import("axios").AxiosError in the return type
function isAxiosError(error: unknown): error is { response?: { data: any; status: number; }; } & Error {
    return (
        typeof error === 'object' &&
        error !== null &&
        (error as any).isAxiosError === true && // Check the runtime property set by Axios
        (error as any).response !== undefined // Axios errors typically have a response property
    );
}

// Define a type for message sending and retrieval
interface Message {
    message_id: string;
    recipient_user_id: string;
    text_content: string | null;
    image_url: string | null;
    sender_device_model: string | null;
    is_read: boolean;
    created_at: string;
}

interface RecipientProfile {
    username: string;
    custom_name: string | null;
    profile_picture_url: string | null;
    share_link_id: string;
}

const messageService = {
    async getRecipientProfile(shareLinkId: string): Promise<RecipientProfile> {
        try {
            const response = await api.get<RecipientProfile>(`/users/${shareLinkId}/profile`);
            return response.data;
        } catch (error: unknown) {
            console.error('Error fetching recipient profile:', error);
            if (isAxiosError(error) && error.response) { 
                throw new Error(error.response.data.message || 'Failed to fetch recipient profile');
            } else if (error instanceof Error) {
                throw new Error(error.message || 'Failed to fetch recipient profile');
            } else {
                throw new Error(String(error) || 'Failed to fetch recipient profile');
            }
        }
    },

    async sendMessage(shareLinkId: string, formData: FormData): Promise<{ message: string; messageId: string; imageUrl: string | null }> {
        try {
            const response = await api.post<{ message: string; messageId: string; imageUrl: string | null }>(`/messages/send/${shareLinkId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error: unknown) {
            console.error('Error sending message:', error);
            if (isAxiosError(error) && error.response) { 
                throw new Error(error.response.data.message || 'Failed to send message');
            } else if (error instanceof Error) {
                throw new Error(error.message || 'Failed to send message');
            } else {
                throw new Error(String(error) || 'Failed to send message');
            }
        }
    },

    async getMessages(token: string): Promise<Message[]> {
        try {
            const response = await api.get<{ messages: Message[] }>('/messages', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data.messages;
        } catch (error: unknown) {
            console.error('Error fetching messages:', error);
            if (isAxiosError(error) && error.response) { 
                throw new Error(error.response.data.message || 'Failed to fetch messages');
            } else if (error instanceof Error) {
                throw new Error(error.message || 'Failed to fetch messages');
            } else {
                throw new Error(String(error) || 'Failed to fetch messages');
            }
        }
    },

    async markMessageAsRead(token: string, messageId: string): Promise<{ message: string }> {
        try {
            const response = await api.put<{ message: string }>(`/messages/${messageId}/read`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error: unknown) {
            console.error(`Error marking message ${messageId} as read:`, error);
            if (isAxiosError(error) && error.response) {
                throw new Error(error.response.data.message || 'Failed to mark message as read');
            } else if (error instanceof Error) {
                throw new Error(error.message || 'Failed to mark message as read');
            } else {
                throw new Error(String(error) || 'Failed to mark message as read');
            }
        }
    },
};

export default messageService;