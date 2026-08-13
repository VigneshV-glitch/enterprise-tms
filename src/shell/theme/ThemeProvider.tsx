import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'dark' | 'light' | 'system';

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
}>({
  theme: 'dark',
  setTheme: () => null,
});

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, defaultTheme = 'dark' }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('app-theme') as Theme) || defaultTheme;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    let timeoutId: number;

    const applyTheme = () => {
      // Trigger smooth transitions on theme switch
      root.classList.add('theme-transitioning');

      root.classList.remove('light', 'dark');
      if (theme === 'system') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.classList.add(isDark ? 'dark' : 'light');
      } else {
        root.classList.add(theme);
      }

      // Clear existing transition timeout if any
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
      // Remove class once the 200ms CSS transition is complete
      timeoutId = window.setTimeout(() => {
        root.classList.remove('theme-transitioning');
      }, 250);
    };

    applyTheme();
    localStorage.setItem('app-theme', theme);

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme();
      mediaQuery.addEventListener('change', handleChange);
      return () => {
        if (timeoutId) window.clearTimeout(timeoutId);
        mediaQuery.removeEventListener('change', handleChange);
      };
    }

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
