/**
 * Ryt Bank - Spacing System
 * Consistent spacing scale based on 4px base unit
 */

// Base unit for spacing calculations
const BASE_UNIT = 4;

/**
 * Spacing scale following 4px grid
 * Usage: spacing[4] = 16px
 */
export const spacing = {
  0: 0,
  0.5: BASE_UNIT * 0.5, // 2
  1: BASE_UNIT * 1, // 4
  1.5: BASE_UNIT * 1.5, // 6
  2: BASE_UNIT * 2, // 8
  2.5: BASE_UNIT * 2.5, // 10
  3: BASE_UNIT * 3, // 12
  3.5: BASE_UNIT * 3.5, // 14
  4: BASE_UNIT * 4, // 16
  5: BASE_UNIT * 5, // 20
  6: BASE_UNIT * 6, // 24
  7: BASE_UNIT * 7, // 28
  8: BASE_UNIT * 8, // 32
  9: BASE_UNIT * 9, // 36
  10: BASE_UNIT * 10, // 40
  11: BASE_UNIT * 11, // 44
  12: BASE_UNIT * 12, // 48
  14: BASE_UNIT * 14, // 56
  16: BASE_UNIT * 16, // 64
  20: BASE_UNIT * 20, // 80
  24: BASE_UNIT * 24, // 96
  28: BASE_UNIT * 28, // 112
  32: BASE_UNIT * 32, // 128
} as const;

/**
 * Semantic spacing aliases for common use cases
 */
export const semanticSpacing = {
  // Screen padding
  screenHorizontal: spacing[4], // 16
  screenVertical: spacing[6], // 24
  screenTop: spacing[4], // 16
  screenBottom: spacing[8], // 32

  // Component spacing
  componentGap: spacing[4], // 16
  sectionGap: spacing[6], // 24

  // Card padding
  cardPadding: spacing[4], // 16
  cardPaddingLarge: spacing[6], // 24

  // List items
  listItemPadding: spacing[4], // 16
  listItemGap: spacing[3], // 12

  // Inline spacing (between icon and text, etc.)
  inlineXs: spacing[1], // 4
  inlineSm: spacing[2], // 8
  inlineMd: spacing[3], // 12
  inlineLg: spacing[4], // 16

  // Form elements
  inputPaddingHorizontal: spacing[4], // 16
  inputPaddingVertical: spacing[3], // 12
  formGap: spacing[4], // 16

  // Button padding
  buttonPaddingHorizontal: spacing[6], // 24
  buttonPaddingVertical: spacing[4], // 16
} as const;

export type SpacingKey = keyof typeof spacing;
export type SemanticSpacingKey = keyof typeof semanticSpacing;
