import React, { createContext, useState, useEffect, useContext } from 'react';

type ThemeContextType = {
    isDarkMode: boolean;
    toggleTheme: () => void;
    theme: any;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem("appTheme");
        if (savedTheme === "dark") {
            setIsDarkMode(true);
        }
    }, []);

    const toggleTheme = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        localStorage.setItem("appTheme", newMode ? "dark" : "light");
    };

    const theme = {
        bg: isDarkMode ? '#0F172A' : '#f8fafc',
        nav: isDarkMode ? '#1E293B' : '#1E3A8A',
        text: isDarkMode ? '#ffffff' : '#1E3A8A',
        subText: isDarkMode ? '#94A3B8' : '#64748b',
        card: isDarkMode ? '#1E293B' : '#ffffff',
        accentBox: isDarkMode ? '#1E293B' : '#1E3A8A',
        border: isDarkMode ? '#334155' : '#e2e8f0',
        badgeBg: isDarkMode ? 'rgba(249,115,22,0.1)' : 'rgba(30,58,138,0.1)',
        badgeText: isDarkMode ? '#F97316' : '#1E3A8A',
        btnGray: isDarkMode ? '#334155' : 'rgba(255,255,255,0.1)',
        inputBg: isDarkMode ? '#1E293B' : '#f1f5f9',
    };

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("useTheme error");
    return context;
}