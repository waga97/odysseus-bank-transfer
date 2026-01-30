/**
 * Odysseus Bank - Theme Context
 * Provides theme values and dark/light mode switching
 */

import React, {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from 'react';
import { useColorScheme } from 'react-native';
import { lightColors, darkColors, type ColorScheme } from './colors';
import theme from './index';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  mode: ThemeMode;
  isDark: boolean;
  colors: ColorScheme;
  theme: typeof theme;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  mode?: ThemeMode;
}

export function ThemeProvider({
  children,
  mode = 'system',
}: ThemeProviderProps) {
  const systemColorScheme = useColorScheme();

  const value = useMemo(() => {
    const isDark =
      mode === 'system'
        ? systemColorScheme === 'dark'
        : mode === 'dark';

    return {
      mode,
      isDark,
      colors: isDark ? darkColors : lightColors,
      theme,
    };
  }, [mode, systemColorScheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to access theme values
 * @throws Error if used outside ThemeProvider
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}

/**
 * Hook to access only colors (convenience)
 */
export function useColors(): ColorScheme {
  const { colors } = useTheme();
  return colors;
}

/**
 * Hook to check if dark mode is active
 */
export function useIsDarkMode(): boolean {
  const { isDark } = useTheme();
  return isDark;
}
