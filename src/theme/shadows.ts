/**
 * Odysseus Bank - Shadow System
 * Cross-platform shadow definitions
 */

import { Platform, ViewStyle } from 'react-native';

type ShadowStyle = Pick<
  ViewStyle,
  'shadowColor' | 'shadowOffset' | 'shadowOpacity' | 'shadowRadius' | 'elevation'
>;

/**
 * Creates cross-platform shadow styles
 * iOS uses shadow* properties, Android uses elevation
 */
const createShadow = (
  offsetY: number,
  blur: number,
  opacity: number,
  elevation: number,
  color = '#000000'
): ShadowStyle => ({
  shadowColor: color,
  shadowOffset: { width: 0, height: offsetY },
  shadowOpacity: Platform.OS === 'ios' ? opacity : 0,
  shadowRadius: blur,
  elevation: Platform.OS === 'android' ? elevation : 0,
});

export const shadows = {
  none: createShadow(0, 0, 0, 0),

  // Subtle shadows for cards, inputs
  sm: createShadow(1, 2, 0.05, 1),

  // Default shadow for floating elements
  md: createShadow(2, 4, 0.08, 3),

  // Prominent shadow for modals, dropdowns
  lg: createShadow(4, 8, 0.1, 6),

  // Heavy shadow for bottom sheets, alerts
  xl: createShadow(8, 16, 0.12, 12),

  // Extra heavy for critical overlays
  '2xl': createShadow(12, 24, 0.15, 16),
} as const;

/**
 * Colored shadows for emphasis (e.g., primary button glow)
 */
export const coloredShadows = {
  primary: createShadow(4, 12, 0.25, 8, '#300a14'),
  success: createShadow(4, 12, 0.25, 8, '#10b981'),
  error: createShadow(4, 12, 0.25, 8, '#ef4444'),
  warning: createShadow(4, 12, 0.25, 8, '#f59e0b'),
} as const;

/**
 * Component-specific shadows
 */
export const componentShadows = {
  card: shadows.sm,
  cardElevated: shadows.md,
  button: shadows.sm,
  buttonPrimary: coloredShadows.primary,
  input: shadows.none,
  inputFocused: shadows.sm,
  modal: shadows.xl,
  bottomSheet: shadows['2xl'],
  dropdown: shadows.lg,
  toast: shadows.lg,
  fab: shadows.lg,
} as const;

export type ShadowKey = keyof typeof shadows;
export type ComponentShadowKey = keyof typeof componentShadows;
