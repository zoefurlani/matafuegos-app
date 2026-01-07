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
    // MODO CLARO
    background: '#ffffff',                      // Fondo BLANCO PURO
    text: '#111827',
    textSecondary: '#6b7280',
    cardBg: '#f9fafb',
    border: '#e5e7eb',
    hover: '#f3f4f6',
    navbar: 'rgba(235, 236, 238, 0.95)',       // Navbar GRIS MUY CLARITO
    navbarScrolled: 'rgba(249, 250, 251, 0.98)',
    shadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  } : {
    // MODO OSCURO
    background: '#111827',                      // Fondo NEGRO/OSCURO
    text: '#f9fafb',
    textSecondary: '#d1d5db',
    cardBg: '#1f2937',
    border: '#374151',
    hover: '#374151',
    navbar: 'rgba(52, 59, 68, 0.95)',          // Navbar GRIS CLARO
    navbarScrolled: 'rgba(75, 85, 99, 0.98)',
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