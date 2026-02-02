export const componentSizes = {
  // Header elements
  header: {
    height: 56,
    backButton: 40,
  },

  // Icon containers
  icon: {
    small: 24,
    medium: 40,
    large: 80,
    xlarge: 100,
  },

  // Touch targets (minimum 44pt for accessibility)
  touchTarget: {
    minimum: 44,
    standard: 48,
  },

  // Avatar sizes
  avatar: {
    small: 32,
    medium: 48,
    large: 64,
  },
} as const;

export type ComponentSizes = typeof componentSizes;
