
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

// Define a type for the user object
interface User {
    userId: string;
    username: string;
    share_link_id: string; // Corrected to match backend snake_case
    customName?: string;
    profilePictureUrl?: string;
    createdAt: string;
    isAdmin: boolean;
}

// Define a type for the authentication response
interface AuthResponse {
    token: string;
    user: User;
}

const authService = {
    async register(username: string, password: string): Promise<AuthResponse> {
        try {
            const response = await api.post<AuthResponse>('/auth/register', { username, password });
            return response.data;
        } catch (error: unknown) { 
            console.error('Registration error:', error);
            if (isAxiosError(error) && error.response) { 
                throw new Error(error.response.data.message || 'Registration failed');
            } else if (error instanceof Error) {
                throw new Error(error.message || 'Registration failed');
            } else {
                throw new Error(String(error) || 'Registration failed'); 
            }
        }
    },

    async login(username: string, password: string): Promise<User> {
        try {
            const response = await api.post<AuthResponse>('/auth/login', { username, password });
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
            return response.data.user;
        } catch (error: unknown) { 
            console.error('Login error:', error);
            if (isAxiosError(error) && error.response) { 
                throw new Error(error.response.data.message || 'Login failed');
            } else if (error instanceof Error) {
                throw new Error(error.message || 'Login failed');
            } else {
                throw new Error(String(error) || 'Login failed'); 
            }
        }
    },

    // Admin Login (re-uses existing login endpoint, but might need different JWT handling later)
    async adminLogin(username: string, password: string): Promise<AuthResponse> {
        try {
            const response = await api.post<AuthResponse>('/auth/login', { username, password });
            // For admin login, we might want to store a separate admin token or check is_admin flag
            if (response.data.token) {
                localStorage.setItem('adminToken', response.data.token); // Store as adminToken
            }
            return response.data; // Return the full response including user and token
        } catch (error: unknown) {
            console.error('Admin Login error:', error);
            if (isAxiosError(error) && error.response) {
                throw new Error(error.response.data.message || 'Admin login failed');
            } else if (error instanceof Error) {
                throw new Error(error.message || 'Admin login failed');
            } else {
                throw new Error(String(error) || 'Admin login failed');
            }
        }
    },

    logout(): void {
        localStorage.removeItem('token');
    },

    getToken(): string | null {
        return localStorage.getItem('token');
    },

    isLoggedIn(): boolean {
        return !!localStorage.getItem('token');
    },

    async getCurrentUser(): Promise<User | null> {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.log('No token found, cannot get current user');
                return null;
            }
            const response = await api.get<User>('/auth/me'); // Corrected endpoint to /auth/me
            return response.data;
        } catch (error: unknown) { 
            console.error('Error fetching current user:', error);
            localStorage.removeItem('token');
            if (isAxiosError(error) && error.response && error.response.status === 401) { 
                console.log('Unauthorized error on getCurrentUser. Token cleared.');
            } else if (error instanceof Error) {
                console.error('Non-Axios error on getCurrentUser:', error.message);
            }
            return null;
        }
    },
};

export default authService; 