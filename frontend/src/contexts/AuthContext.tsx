import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../api/authService';

interface User {
    userId: string; // Corrected to userId to match backend and authService types
    username: string;
    share_link_id: string; // Corrected to match backend snake_case
    customName?: string;
    profilePictureUrl?: string;
    createdAt: string;
    isAdmin: boolean;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (username: string, password: string) => Promise<void>;
    register: (username: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const currentUser = await authService.getCurrentUser(); // Await the promise here
                console.log('AuthContext - Fetched currentUser:', currentUser); // ADDED LOG
                setUser(currentUser);
            } catch (error) {
                console.error("AuthContext - Failed to load user from token:", error); // MODIFIED LOG
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    const login = async (username: string, password: string) => {
        const response = await authService.login(username, password);
        setUser(response); // Corrected: response is already the User object
    };

    const register = async (username: string, password: string) => {
        const response = await authService.register(username, password);
        // Auto login after registration if desired, or just set the user
        setUser(response.user); // The register service returns an AuthResponse which has a 'user' property
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const value = {
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext; 