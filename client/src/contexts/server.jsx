// src/contexts/server.jsx
import { createContext, useContext, useMemo } from 'react';
import axios from 'axios';

const ServerContext = createContext(null);

export default function ServerContextProvider({ children }) {
    const serverUrl = import.meta.env.VITE_SERVER_URL;

    if (!serverUrl) {
        console.error('❌ VITE_SERVER_URL is not defined');
        return null;
    }

    const api = useMemo(() => {
        const instance = axios.create({
            baseURL: serverUrl,
            withCredentials: true,
            timeout: 15000,
        });

        // Attach token automatically
        instance.interceptors.request.use((config) => {
            const token = localStorage.getItem('AuthToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });

        return instance;
    }, [serverUrl]);

    return (
        <ServerContext.Provider value={{ api, serverUrl }}>
            {children}
        </ServerContext.Provider>
    );
}

export function useServerContext() {
    const context = useContext(ServerContext);
    if (!context) {
        throw new Error('useServerContext must be used within ServerContextProvider');
    }
    return context;
}
