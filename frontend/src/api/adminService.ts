import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api';

const adminService = {
  getAllUsers: async (token: string) => {
    try {
      const response = await axios.get(`${API_URL}/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.error || 'Failed to fetch users';
    }
  },
  getMessagesForUser: async (token: string, userId: string) => {
    try {
      const response = await axios.get(`${API_URL}/admin/users/${userId}/messages`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.error || 'Failed to fetch messages for user';
    }
  },
};

export default adminService; 