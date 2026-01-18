// src/contexts/theme.jsx
import { createContext, useState, useEffect, useContext } from 'react';

export const ThemeContext = createContext();

export default function ThemeContextProvider({ children }) {
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        const saved = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initial = saved || (prefersDark ? 'dark' : 'light');
        setTheme(initial);
        document.documentElement.classList.add(initial);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(newTheme);
        localStorage.setItem('theme', newTheme);
        setTheme(newTheme);
    };

    const contextValue = {
        theme,
        toggleTheme
    };
    return (
        <ThemeContext.Provider value={contextValue}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useThemeContext() {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useThemeContext must be used within a ThemeProvider');
    return context;
}