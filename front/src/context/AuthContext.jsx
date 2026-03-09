import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { authApi } from '../api/auth';
import { tokenStorage } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user,    setUser]    = useState(null);
    const [loading, setLoading] = useState(true); // true before checking existing token

    // if there is an existing token, get user profile
    useEffect(() => {
        const init = async () => {
            if (tokenStorage.getAccess()) {
                try {
                    const { data } = await authApi.getUserProfile();
                    setUser(data);
                } catch {
                    tokenStorage.clear();
                }
            }
            setLoading(false);
        };
        init();
    }, []);

    // Listen to global event sent by interceptor
    useEffect(() => {
        const handleLogout = () => setUser(null);
        window.addEventListener('auth:logout', handleLogout);
        return () => window.removeEventListener('auth:logout', handleLogout);
    }, []);

    const login = useCallback(async (username, password) => {
        await authApi.login(username, password);
        const { data } = await authApi.getUserProfile();
        setUser(data);
    }, []);

    const register = useCallback(async (username, password, confirmPassword) => {
        await authApi.register(username, password, confirmPassword);
    }, []);

    const logout = useCallback(() => {
        authApi.logout();
        setUser(null);
    }, []);

    const updateUser = useCallback(async (username, password, confirmPassword) => {
        const data = await authApi.updateUser(username, password, confirmPassword);
        setUser(data);
    }, []);

    const deleteUser = useCallback(async (username) => {
        await authApi.deleteUser(username);
        authApi.logout();
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, register, updateUser, deleteUser, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
    return ctx;
};