/**
 * Odysseus Bank - Typography System
 * Using Manrope font family as per mockup design
 */

import type { TextStyle } from 'react-native';
import { Platform } from 'react-native';

// Font family configuration
export const fontFamily = {
  regular: Platform.select({
    ios: 'Manrope-Regular',
    android: 'Manrope-Regular',
    default: 'Manrope',
  }),
  medium: Platform.select({
    ios: 'Manrope-Medium',
    android: 'Manrope-Medium',
    default: 'Manrope',
  }),
  semiBold: Platform.select({
    ios: 'Manrope-SemiBold',
    android: 'Manrope-SemiBold',
    default: 'Manrope',
  }),
  bold: Platform.select({
    ios: 'Manrope-Bold',
    android: 'Manrope-Bold',
    default: 'Manrope',
  }),
  extraBold: Platform.select({
    ios: 'Manrope-ExtraBold',
    android: 'Manrope-ExtraBold',
    default: 'Manrope',
  }),
} as const;

// Font sizes - following a type scale
export const fontSize = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  // Semantic aliases
  sectionTitle: 18,
} as const;

// Line heights
export const lineHeight = {
  tight: 1.1,
  snug: 1.25,
  normal: 1.4,
  relaxed: 1.5,
  loose: 1.75,
} as const;

// Letter spacing
export const letterSpacing = {
  tighter: -0.5,
  tight: -0.25,
  normal: 0,
  wide: 0.25,
  wider: 0.5,
  widest: 1,
} as const;

// Pre-defined text styles
type TypographyVariant = {
  fontSize: number;
  lineHeight: number;
  fontFamily: string;
  fontWeight: TextStyle['fontWeight'];
  letterSpacing?: number;
};

export const typography: Record<string, TypographyVariant> = {
  // Display - Large headlines
  displayLarge: {
    fontSize: fontSize['4xl'],
    lineHeight: fontSize['4xl'] * lineHeight.tight,
    fontFamily: fontFamily.extraBold,
    fontWeight: '800',
    letterSpacing: letterSpacing.tight,
  },
  displayMedium: {
    fontSize: fontSize['3xl'],
    lineHeight: fontSize['3xl'] * lineHeight.tight,
    fontFamily: fontFamily.extraBold,
    fontWeight: '800',
    letterSpacing: letterSpacing.tight,
  },
  displaySmall: {
    fontSize: fontSize['2xl'],
    lineHeight: fontSize['2xl'] * lineHeight.tight,
    fontFamily: fontFamily.bold,
    fontWeight: '700',
    letterSpacing: letterSpacing.tight,
  },

  // Headlines
  headlineLarge: {
    fontSize: fontSize.xl,
    lineHeight: fontSize.xl * lineHeight.snug,
    fontFamily: fontFamily.bold,
    fontWeight: '700',
  },
  headlineMedium: {
    fontSize: fontSize.lg,
    lineHeight: fontSize.lg * lineHeight.snug,
    fontFamily: fontFamily.bold,
    fontWeight: '700',
  },
  headlineSmall: {
    fontSize: fontSize.md,
    lineHeight: fontSize.md * lineHeight.snug,
    fontFamily: fontFamily.semiBold,
    fontWeight: '600',
  },

  // Title
  titleLarge: {
    fontSize: fontSize.lg,
    lineHeight: fontSize.lg * lineHeight.normal,
    fontFamily: fontFamily.semiBold,
    fontWeight: '600',
  },
  titleMedium: {
    fontSize: fontSize.base,
    lineHeight: fontSize.base * lineHeight.normal,
    fontFamily: fontFamily.semiBold,
    fontWeight: '600',
  },
  titleSmall: {
    fontSize: fontSize.sm,
    lineHeight: fontSize.sm * lineHeight.normal,
    fontFamily: fontFamily.semiBold,
    fontWeight: '600',
  },

  // Body
  bodyLarge: {
    fontSize: fontSize.md,
    lineHeight: fontSize.md * lineHeight.relaxed,
    fontFamily: fontFamily.regular,
    fontWeight: '400',
  },
  bodyMedium: {
    fontSize: fontSize.base,
    lineHeight: fontSize.base * lineHeight.relaxed,
    fontFamily: fontFamily.regular,
    fontWeight: '400',
  },
  bodySmall: {
    fontSize: fontSize.sm,
    lineHeight: fontSize.sm * lineHeight.relaxed,
    fontFamily: fontFamily.regular,
    fontWeight: '400',
  },

  // Labels
  labelLarge: {
    fontSize: fontSize.base,
    lineHeight: fontSize.base * lineHeight.normal,
    fontFamily: fontFamily.medium,
    fontWeight: '500',
  },
  labelMedium: {
    fontSize: fontSize.sm,
    lineHeight: fontSize.sm * lineHeight.normal,
    fontFamily: fontFamily.medium,
    fontWeight: '500',
  },
  labelSmall: {
    fontSize: fontSize.xs,
    lineHeight: fontSize.xs * lineHeight.normal,
    fontFamily: fontFamily.medium,
    fontWeight: '500',
    letterSpacing: letterSpacing.wide,
  },

  // Caption
  caption: {
    fontSize: fontSize.xs,
    lineHeight: fontSize.xs * lineHeight.normal,
    fontFamily: fontFamily.regular,
    fontWeight: '400',
  },

  // Button text
  buttonLarge: {
    fontSize: fontSize.md,
    lineHeight: fontSize.md * lineHeight.tight,
    fontFamily: fontFamily.bold,
    fontWeight: '700',
  },
  buttonMedium: {
    fontSize: fontSize.base,
    lineHeight: fontSize.base * lineHeight.tight,
    fontFamily: fontFamily.bold,
    fontWeight: '700',
  },
  buttonSmall: {
    fontSize: fontSize.sm,
    lineHeight: fontSize.sm * lineHeight.tight,
    fontFamily: fontFamily.semiBold,
    fontWeight: '600',
  },

  // Numeric - for amounts, balances
  numericLarge: {
    fontSize: fontSize['3xl'],
    lineHeight: fontSize['3xl'] * lineHeight.tight,
    fontFamily: fontFamily.extraBold,
    fontWeight: '800',
    letterSpacing: letterSpacing.tight,
  },
  numericMedium: {
    fontSize: fontSize.xl,
    lineHeight: fontSize.xl * lineHeight.tight,
    fontFamily: fontFamily.bold,
    fontWeight: '700',
  },
  numericSmall: {
    fontSize: fontSize.lg,
    lineHeight: fontSize.lg * lineHeight.tight,
    fontFamily: fontFamily.semiBold,
    fontWeight: '600',
  },
} as const;

export type TypographyVariantKey = keyof typeof typography;
