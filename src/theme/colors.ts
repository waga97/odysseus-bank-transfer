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

  // Neutrals
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

export const colors = {
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
    subtle: '#f1f5f9',
    focus: palette.primary.main,
    transparent: 'transparent',
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

  // Status (alias for semantic - easier to use)
  status: {
    success: palette.success.main,
    successBg: palette.success.light,
    warning: palette.warning.main,
    warningBg: palette.warning.light,
    error: palette.error.main,
    errorBg: palette.error.light,
    info: palette.info.main,
    infoBg: palette.info.light,
  },

  // Primary colors (for direct access)
  primary: {
    50: '#fdf2f4',
    100: '#fce4e9',
    600: palette.primary.main,
    700: palette.primary.dark,
  },

  // Shadows (for iOS)
  shadow: {
    color: '#000000',
    opacity: 0.08,
  },
} as const;

export type Colors = typeof colors;
