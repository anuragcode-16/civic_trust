'use client';

import { createContext, useState, useEffect, useContext, ReactNode } from 'react';

type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Initialize with a default value
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Only run this in the browser
    setMounted(true);
    
    // Initialize theme from localStorage on component mount
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
      
      setIsDarkMode(isDark);
      
      // Apply the theme to document
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  const toggleTheme = () => {
    if (typeof window === 'undefined') return;
    
    setIsDarkMode(prev => {
      const newTheme = !prev;
      
      // Save to localStorage and update document classes
      if (newTheme) {
        localStorage.setItem('theme', 'dark');
        document.documentElement.classList.add('dark');
      } else {
        localStorage.setItem('theme', 'light');
        document.documentElement.classList.remove('dark');
      }
      
      return newTheme;
    });
  };

  // Render a placeholder while waiting for component to mount
  if (!mounted) {
    // Return a placeholder with the same structure but no theme functionality
    return (
      <ThemeContext.Provider value={{ isDarkMode: false, toggleTheme: () => {} }}>
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 