/**
 * Odysseus Bank - Color Palette
 * Design tokens extracted from mockup design language
 */

export const palette = {
  // Brand colors
  primary: {
    main: '#300a14',
    light: '#4a1a2a',
    dark: '#1a0508',
    contrast: '#ffffff',
  },

  // Neutrals - Light mode
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },

  // Semantic colors
  success: {
    main: '#10b981',
    light: '#d1fae5',
    dark: '#059669',
  },
  warning: {
    main: '#f59e0b',
    light: '#fef3c7',
    dark: '#d97706',
  },
  error: {
    main: '#ef4444',
    light: '#fee2e2',
    dark: '#dc2626',
  },
  info: {
    main: '#3b82f6',
    light: '#dbeafe',
    dark: '#2563eb',
  },

  // Base
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
} as const;

export const lightColors = {
  // Backgrounds
  background: {
    primary: '#f5f7f8',
    secondary: '#ffffff',
    tertiary: '#f1f5f9',
  },

  // Surfaces (cards, modals, etc.)
  surface: {
    primary: '#ffffff',
    secondary: '#f8fafc',
    elevated: '#ffffff',
  },

  // Text
  text: {
    primary: '#0d171c',
    secondary: '#475569',
    tertiary: '#94a3b8',
    inverse: '#ffffff',
    disabled: '#cbd5e1',
  },

  // Borders
  border: {
    primary: '#e2e8f0',
    secondary: '#f1f5f9',
    focus: palette.primary.main,
  },

  // Interactive
  interactive: {
    primary: palette.primary.main,
    primaryHover: palette.primary.light,
    primaryPressed: palette.primary.dark,
    secondary: '#f1f5f9',
    secondaryHover: '#e2e8f0',
    disabled: '#e2e8f0',
  },

  // Semantic
  semantic: {
    success: palette.success.main,
    successBackground: palette.success.light,
    warning: palette.warning.main,
    warningBackground: palette.warning.light,
    error: palette.error.main,
    errorBackground: palette.error.light,
    info: palette.info.main,
    infoBackground: palette.info.light,
  },

  // Shadows (for iOS)
  shadow: {
    color: '#000000',
    opacity: 0.08,
  },
} as const;

export const darkColors = {
  // Backgrounds
  background: {
    primary: '#101c22',
    secondary: '#182830',
    tertiary: '#1a2c36',
  },

  // Surfaces
  surface: {
    primary: '#1a2c36',
    secondary: '#182830',
    elevated: '#223a47',
  },

  // Text
  text: {
    primary: '#ffffff',
    secondary: '#94a3b8',
    tertiary: '#64748b',
    inverse: '#0d171c',
    disabled: '#475569',
  },

  // Borders
  border: {
    primary: '#334155',
    secondary: '#1e293b',
    focus: palette.primary.light,
  },

  // Interactive
  interactive: {
    primary: palette.primary.main,
    primaryHover: palette.primary.light,
    primaryPressed: palette.primary.dark,
    secondary: '#1e293b',
    secondaryHover: '#334155',
    disabled: '#334155',
  },

  // Semantic
  semantic: {
    success: palette.success.main,
    successBackground: '#064e3b',
    warning: palette.warning.main,
    warningBackground: '#78350f',
    error: palette.error.main,
    errorBackground: '#7f1d1d',
    info: palette.info.main,
    infoBackground: '#1e3a8a',
  },

  // Shadows
  shadow: {
    color: '#000000',
    opacity: 0.3,
  },
} as const;

export type ColorScheme = typeof lightColors;
