/**
 * Odysseus Bank - Border Radius System
 * Consistent rounded corners as per mockup design
 */

export const borderRadius = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
} as const;

/**
 * Semantic border radius for specific components
 */
export const componentRadius = {
  // Buttons
  buttonSmall: borderRadius.lg, // 16
  buttonMedium: borderRadius.xl, // 20
  buttonLarge: borderRadius.full, // pill shape
  buttonIcon: borderRadius.full, // circular

  // Inputs
  input: borderRadius.lg, // 16
  inputLarge: borderRadius.xl, // 20

  // Cards
  card: borderRadius.xl, // 20
  cardLarge: borderRadius['2xl'], // 24
  cardHero: borderRadius['3xl'], // 32

  // Chips/Tags
  chip: borderRadius.full, // pill shape
  tag: borderRadius.md, // 12

  // Avatars
  avatarSmall: borderRadius.full,
  avatarMedium: borderRadius.full,
  avatarLarge: borderRadius.full,

  // Modals/Bottom sheets
  modal: borderRadius['2xl'], // 24
  bottomSheet: borderRadius['3xl'], // 32 (top corners only)

  // Progress indicators
  progressBar: borderRadius.full,

  // Images
  thumbnail: borderRadius.md, // 12
  image: borderRadius.lg, // 16
} as const;

export type BorderRadiusKey = keyof typeof borderRadius;
export type ComponentRadiusKey = keyof typeof componentRadius;
