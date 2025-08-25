
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type ThemeName = "gold" | "rose" | "ocean" | "mint";

interface Theme {
  name: ThemeName;
  label: string;
  colors: {
    background: string;
    primary: string;
    accent: string;
  };
}

export const themes: Theme[] = [
  { name: 'gold', label: 'Gold', colors: { background: '0 0% 100%', primary: '48 96% 53%', accent: '48 96% 53%' } },
  { name: 'rose', label: 'Rose', colors: { background: '350 100% 99%', primary: '350 89% 60%', accent: '350 89% 60%' } },
  { name: 'ocean', label: 'Ocean', colors: { background: '210 40% 98%', primary: '221 83% 53%', accent: '221 83% 53%' } },
  { name: 'mint', label: 'Mint', colors: { background: '160 60% 97%', primary: '168 76% 42%', accent: '168 76% 42%' } },
];

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (themeName: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>(() => {
    if (typeof window === 'undefined') {
      return 'gold';
    }
    return (localStorage.getItem('theme') as ThemeName) || 'gold';
  });

  useEffect(() => {
    const selectedTheme = themes.find(t => t.name === theme);
    if (selectedTheme) {
      const root = window.document.documentElement;
      root.style.setProperty('--background', selectedTheme.colors.background);
      root.style.setProperty('--primary', selectedTheme.colors.primary);
      root.style.setProperty('--accent', selectedTheme.colors.accent);
    }
  }, [theme]);

  const setTheme = (themeName: ThemeName) => {
    localStorage.setItem('theme', themeName);
    setThemeState(themeName);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
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
