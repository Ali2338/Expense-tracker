import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    // Target the absolute HTML root element directly
    const html = document.documentElement;
    
    if (isDark) {
      html.classList.add('dark');
      html.style.backgroundColor = '#020617'; // Forces light mode windows to shift black instantly
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      html.style.backgroundColor = '#f8fafc'; // Forces dark mode windows to shift white instantly
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);