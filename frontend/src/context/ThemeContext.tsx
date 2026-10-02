'use client';
import { createContext, useContext, useEffect, useState } from 'react';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
  resetTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const DEFAULT_ACCENT = '#4F46E5'; // Indigo/Blue default

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('system');
  const [accentColor, setAccentColor] = useState<string>(DEFAULT_ACCENT);
  const [mounted, setMounted] = useState(false);

  // Initial load
  useEffect(() => {
    const savedMode = localStorage.getItem('theme-mode') as ThemeMode;
    const savedAccent = localStorage.getItem('theme-accent');
    if (savedMode) setMode(savedMode);
    if (savedAccent) setAccentColor(savedAccent);
    setMounted(true);
  }, []);

  // Handle Mode changes
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem('theme-mode', mode);

    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (mode === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(mode);
    }
  }, [mode, mounted]);

  // Handle Accent Color changes
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem('theme-accent', accentColor);
    
    // Convert hex to rgb for opacity support if needed, but modern CSS variables can just use the hex directly for most things.
    // We will set --primary and --accent to the chosen color.
    const root = window.document.documentElement;
    root.style.setProperty('--primary', accentColor);
    root.style.setProperty('--accent', accentColor); // Simplifying by setting both to the same accent
  }, [accentColor, mounted]);

  // Listen to system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (mode === 'system') {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(mediaQuery.matches ? 'dark' : 'light');
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mode]);

  const resetTheme = () => {
    setMode('system');
    setAccentColor(DEFAULT_ACCENT);
  };

  return (
    <ThemeContext.Provider value={{ mode, setMode, accentColor, setAccentColor, resetTheme }}>
      {!mounted ? <div style={{ visibility: 'hidden' }}>{children}</div> : children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
