import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const colors = theme === 'light' ? {
    background: '#ffffff',
    backgroundAlt: '#f3f4f6',
    text: '#111827',
    textSecondary: '#6b7280',
    cardBg: '#f9fafb',
    border: '#e5e7eb',
    hover: '#f3f4f6',
    navbar: '#ffffff',                          
    navbarScrolled: '#f9fafb',                  
    shadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  } : {
    background: '#111827',
    backgroundAlt: '#0f172a',
    text: '#f9fafb',
    textSecondary: '#d1d5db',
    cardBg: '#1f2937',
    border: '#374151',
    hover: '#374151',
    navbar: '#1f2937',                         
    navbarScrolled: '#374151',                 
    shadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}