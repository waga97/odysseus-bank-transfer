import { palette, colors, type Colors } from './colors';
import {
  fontFamily,
  fontSize,
  lineHeight,
  letterSpacing,
  typography,
  type TypographyVariantKey,
} from './typography';
import { spacing, semanticSpacing, type SpacingKey } from './spacing';
import {
  borderRadius,
  componentRadius,
  type BorderRadiusKey,
} from './borderRadius';
import {
  shadows,
  coloredShadows,
  componentShadows,
  type ShadowKey,
} from './shadows';
import { componentSizes, type ComponentSizes } from './componentSizes';

/**
 * Complete theme object
 */
export const theme = {
  colors: {
    palette,
    ...colors,
  },
  typography: {
    fontFamily,
    fontSize,
    lineHeight,
    letterSpacing,
    variants: typography,
  },
  spacing: {
    ...spacing,
    semantic: semanticSpacing,
  },
  borderRadius: {
    ...borderRadius,
    component: componentRadius,
  },
  shadows: {
    ...shadows,
    colored: coloredShadows,
    component: componentShadows,
  },
  componentSizes,
} as const;

/**
 * Theme type for TypeScript
 */
export type Theme = typeof theme;

/**
 * Re-export individual modules for direct imports
 */
export {
  // Colors
  palette,
  colors,
  type Colors,
  // Typography
  fontFamily,
  fontSize,
  lineHeight,
  letterSpacing,
  typography,
  type TypographyVariantKey,
  // Spacing
  spacing,
  semanticSpacing,
  type SpacingKey,
  // Border Radius
  borderRadius,
  componentRadius,
  type BorderRadiusKey,
  // Shadows
  shadows,
  coloredShadows,
  componentShadows,
  type ShadowKey,
  // Component Sizes
  componentSizes,
  type ComponentSizes,
};

export default theme;
