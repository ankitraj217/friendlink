// src/conrexts/toste.jsx
import { createContext, useState, useContext } from 'react';

export const ToastContext = createContext();

export default function ToastContextProvider({ children }) {
    const [toast, setToast] = useState({
        message: '',
        type: '', // 'success', 'error', 'warning', 'info', etc.
    });

    const isToastVisible = Boolean(toast.message);

    const showToast = (message, type) => {
        setToast({ message, type });

        // Clear the toast after 3 seconds
        setTimeout(() => {
            setToast({ message: '', type: '' });
        }, 3000);
    };

    const contextValue = {
        toast,
        isToastVisible,
        showToast
    };
    return (
        <ToastContext.Provider value={contextValue}>
            {children}
        </ToastContext.Provider>
    )
}

export function useToastContext() {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToastContext must be used within a ToastProvider');
    return context;
}