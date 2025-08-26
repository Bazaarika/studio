
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type ThemeName = "purple" | "rose" | "ocean" | "mint";

interface Theme {
  name: ThemeName;
  label: string;
  colors: {
    background: string;
    primary: string;
    accent: string;
    secondary: string;
    card: string;
  };
}

export const themes: Theme[] = [
  { name: 'purple', label: 'Purple', colors: { background: '255 100% 97%', primary: '285 87% 53%', accent: '322 87% 53%', secondary: '255 100% 94%', card: '255 100% 100%' } },
  { name: 'rose', label: 'Rose', colors: { background: '350 100% 99%', primary: '350 89% 60%', accent: '350 89% 60%', secondary: '350 100% 97%', card: '0 0% 100%' } },
  { name: 'ocean', label: 'Ocean', colors: { background: '210 40% 98%', primary: '221 83% 53%', accent: '221 83% 53%', secondary: '210 40% 96.1%', card: '0 0% 100%' } },
  { name: 'mint', label: 'Mint', colors: { background: '160 60% 97%', primary: '168 76% 42%', accent: '168 76% 42%', secondary: '160 60% 94%', card: '0 0% 100%' } },
];

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (themeName: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>(() => {
    if (typeof window === 'undefined') {
      return 'purple';
    }
    return (localStorage.getItem('theme') as ThemeName) || 'purple';
  });

  useEffect(() => {
    const selectedTheme = themes.find(t => t.name === theme);
    if (selectedTheme) {
      const root = window.document.documentElement;
      root.style.setProperty('--background', selectedTheme.colors.background);
      root.style.setProperty('--primary', selectedTheme.colors.primary);
      root.style.setProperty('--accent', selectedTheme.colors.accent);
      root.style.setProperty('--secondary', selectedTheme.colors.secondary);
      root.style.setProperty('--card', selectedTheme.colors.card);

      // Update the theme-color meta tag
      const themeColorMeta = document.querySelector('meta[name="theme-color"]');
      if (themeColorMeta) {
        themeColorMeta.setAttribute('content', `hsl(${selectedTheme.colors.primary})`);
      }
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
