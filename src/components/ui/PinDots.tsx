/**
 * Odysseus Bank - PIN Dots Component
 * Visual indicator for PIN entry progress
 */

import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors, palette } from '@theme/colors';
import { spacing } from '@theme/spacing';
import { borderRadius } from '@theme/borderRadius';

interface PinDotsProps {
  /** Total number of dots */
  length?: number;
  /** Number of filled dots */
  filledCount: number;
  /** Show error state */
  error?: boolean;
  /** Animated shake value (optional) */
  shakeAnimation?: Animated.Value;
}

export function PinDots({
  length = 6,
  filledCount,
  error = false,
  shakeAnimation,
}: PinDotsProps) {
  const dots = Array.from({ length }, (_, index) => {
    const isFilled = filledCount > index;
    return (
      <View
        key={index}
        style={[
          styles.dot,
          isFilled && styles.dotFilled,
          error && styles.dotError,
        ]}
      />
    );
  });

  if (shakeAnimation) {
    return (
      <Animated.View
        style={[
          styles.container,
          { transform: [{ translateX: shakeAnimation }] },
        ]}
      >
        {dots}
      </Animated.View>
    );
  }

  return <View style={styles.container}>{dots}</View>;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing[4],
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    borderColor: colors.border.primary,
    backgroundColor: colors.background.primary,
  },
  dotFilled: {
    backgroundColor: palette.accent.main,
    borderColor: palette.accent.main,
  },
  dotError: {
    borderColor: palette.error.main,
    backgroundColor: palette.error.light,
  },
});
