// src/contexts/auth.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { useServerContext } from './server';

export const AuthContext = createContext(null);

const emptyUser = {
    id: '',
    name: '',
    email: '',
    avatar: '',
    joined: '',
};

export default function AuthContextProvider({ children }) {
    const { api } = useServerContext();

    const [isAuth, setIsAuth] = useState(false);
    const [authUser, setAuthUser] = useState(emptyUser);
    const [authToken, setAuthToken] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    // Restore session on page refresh / manual URL access
    useEffect(() => {
        const token = localStorage.getItem('AuthToken');

        if (!token) {
            setAuthLoading(false);
            return;
        }

        restoreSession(token);
    }, []);

    // Verify session with backend
    const restoreSession = async (token) => {
        try {
            setAuthLoading(true);

            const { data } = await api.get('/api/auth/session');

            setAuthUser(data.user);
            setAuthToken(token);
            setIsAuth(true);
        } catch (err) {
            authLogOut();
        } finally {
            setAuthLoading(false);
        }
    };

    // Save user after login/register
    const saveAuthUser = (user) => {
        setAuthUser(user);
        localStorage.setItem('AuthUser', JSON.stringify(user));
        setIsAuth(true);
    };

    // Save token after login/register
    const saveAuthToken = (token) => {
        setAuthToken(token);
        localStorage.setItem('AuthToken', token);
    };

    // Logout user
    const authLogOut = () => {
        setIsAuth(false);
        setAuthUser(emptyUser);
        setAuthToken(null);

        localStorage.removeItem('AuthUser');
        localStorage.removeItem('AuthToken');
    };

    return (
        <AuthContext.Provider
            value={{
                authUser,
                authToken,
                isAuth,
                authLoading,
                saveAuthUser,
                saveAuthToken,
                authLogOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within AuthContextProvider');
    }
    return context;
}
