/**
 * Odysseus Bank - Badge Component
 * Small status indicator or notification count
 */

import React from 'react';
import { View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { colors, palette } from '@theme/colors';
import { borderRadius } from '@theme/borderRadius';
import { spacing } from '@theme/spacing';
import Text from './Text';

type BadgeVariant = 'primary' | 'success' | 'warning' | 'error' | 'info';

interface BadgeProps {
  label?: string | number;
  variant?: BadgeVariant;
  dot?: boolean;
  style?: StyleProp<ViewStyle>;
}

const variantColors = {
  primary: palette.primary.main,
  success: colors.semantic.success,
  warning: colors.semantic.warning,
  error: colors.semantic.error,
  info: colors.semantic.info,
} as const;

export function Badge({
  label,
  variant = 'primary',
  dot = false,
  style,
}: BadgeProps) {
  const backgroundColor = variantColors[variant];

  if (dot) {
    return (
      <View style={[styles.dot, { backgroundColor }, style]} />
    );
  }

  const displayLabel = typeof label === 'number' && label > 99 ? '99+' : label;

  return (
    <View style={[styles.badge, { backgroundColor }, style]}>
      <Text variant="caption" color={palette.primary.contrast}>
        {displayLabel}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing[1.5],
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: borderRadius.full,
  },
});

export default Badge;
