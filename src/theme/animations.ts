/**
 * Odysseus Bank - Animation Tokens
 * Consistent timing and easing for smooth animations
 */

/**
 * Duration tokens in milliseconds
 */
export const duration = {
  instant: 0,
  fast: 150,
  normal: 250,
  slow: 350,
  slower: 500,
  slowest: 700,
} as const;

/**
 * Easing functions for React Native Animated
 * These match common CSS easing curves
 */
export const easing = {
  // Linear - constant speed
  linear: [0, 0, 1, 1] as const,

  // Ease - slight acceleration then deceleration
  ease: [0.25, 0.1, 0.25, 1] as const,

  // Ease In - starts slow, accelerates
  easeIn: [0.42, 0, 1, 1] as const,
  easeInQuad: [0.55, 0.085, 0.68, 0.53] as const,
  easeInCubic: [0.55, 0.055, 0.675, 0.19] as const,

  // Ease Out - starts fast, decelerates (most common for UI)
  easeOut: [0, 0, 0.58, 1] as const,
  easeOutQuad: [0.25, 0.46, 0.45, 0.94] as const,
  easeOutCubic: [0.215, 0.61, 0.355, 1] as const,

  // Ease In Out - slow start and end
  easeInOut: [0.42, 0, 0.58, 1] as const,
  easeInOutQuad: [0.455, 0.03, 0.515, 0.955] as const,
  easeInOutCubic: [0.645, 0.045, 0.355, 1] as const,

  // Spring-like bounce
  overshoot: [0.34, 1.56, 0.64, 1] as const,

  // Decelerate (Material Design standard)
  decelerate: [0, 0, 0.2, 1] as const,

  // Accelerate
  accelerate: [0.4, 0, 1, 1] as const,

  // Standard (Material Design)
  standard: [0.4, 0, 0.2, 1] as const,
} as const;

/**
 * Pre-configured animation configs for common use cases
 */
export const animationConfig = {
  // Button press feedback
  buttonPress: {
    duration: duration.fast,
    scale: 0.97,
  },

  // Page transitions
  pageTransition: {
    duration: duration.normal,
    easing: easing.easeInOutCubic,
  },

  // Modal/bottom sheet
  modalEntry: {
    duration: duration.slow,
    easing: easing.easeOutCubic,
  },
  modalExit: {
    duration: duration.normal,
    easing: easing.easeInCubic,
  },

  // Fade animations
  fadeIn: {
    duration: duration.normal,
    easing: easing.easeOut,
  },
  fadeOut: {
    duration: duration.fast,
    easing: easing.easeIn,
  },

  // Skeleton loader pulse
  skeletonPulse: {
    duration: duration.slowest,
  },

  // Success checkmark
  successAnimation: {
    duration: duration.slow,
    easing: easing.overshoot,
  },

  // Error shake
  errorShake: {
    duration: duration.fast,
    iterations: 3,
  },

  // List item stagger delay
  listStagger: {
    delay: 50,
    duration: duration.normal,
  },
} as const;

export type DurationKey = keyof typeof duration;
export type EasingKey = keyof typeof easing;
