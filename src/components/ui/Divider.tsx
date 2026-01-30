/**
 * Odysseus Bank - Divider Component
 * Horizontal or vertical separator line
 */

import React from 'react';
import { View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { colors } from '@theme/colors';
import { spacing } from '@theme/spacing';

interface DividerProps {
  direction?: 'horizontal' | 'vertical';
  spacing?: keyof typeof spacing;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export function Divider({
  direction = 'horizontal',
  spacing: spacingKey = 0,
  color = colors.border.primary,
  style,
}: DividerProps) {
  const spacingValue = spacing[spacingKey];

  return (
    <View
      style={[
        direction === 'horizontal' ? styles.horizontal : styles.vertical,
        { backgroundColor: color },
        direction === 'horizontal'
          ? { marginVertical: spacingValue }
          : { marginHorizontal: spacingValue },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  horizontal: {
    height: 1,
    width: '100%',
  },
  vertical: {
    width: 1,
    height: '100%',
  },
});

export default Divider;
