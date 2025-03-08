import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
    id: string;
    email: string;
    name: string;
}

interface AuthResponse {
    user: User;
    token: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    login: (token: string) => Promise<void>;
    logout: () => Promise<void>;
    skipLogin: () => void;
    isSkipped: boolean;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    user: null,
    login: async () => {},
    logout: async () => {},
    skipLogin: () => {},
    isSkipped: false,
    loading: true
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSkipped, setIsSkipped] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            handleLogin(token);
        } else {
            setLoading(false);
        }
    }, []);

    const handleLogin = async (token: string) => {
        try {
            localStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            const { data } = await axios.get<AuthResponse>('http://localhost:5000/api/auth/profile');
            setUser(data.user);
            setIsAuthenticated(true);
            setIsSkipped(false);
        } catch (error) {
            console.error('Auth error:', error);
            await handleLogout();
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
        setIsAuthenticated(false);
        setIsSkipped(false);
        setLoading(false);
    };

    const skipLogin = () => {
        setIsSkipped(true);
        setLoading(false);
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            user,
            login: handleLogin,
            logout: handleLogout,
            skipLogin,
            isSkipped,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
};
