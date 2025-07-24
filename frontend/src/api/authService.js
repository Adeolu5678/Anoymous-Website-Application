import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const authService = {
    // Register a new user
    async register(username, password) {
        const response = await axios.post(`${API_URL}/auth/register`, {
            username,
            password
        });
        return response.data;
    },

    // Login user
    async login(username, password) {
        const response = await axios.post(`${API_URL}/auth/login`, {
            username,
            password
        });
        
        // Save JWT token if login successful
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        
        return response.data;
    },

    // Logout user
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    // Get current user
    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    // Get JWT token
    getToken() {
        return localStorage.getItem('token');
    },

    // Check if user is logged in
    isLoggedIn() {
        return !!this.getToken();
    }
};

export default authService; 