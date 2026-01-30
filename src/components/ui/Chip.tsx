/**
 * Odysseus Bank - Chip Component
 * Small interactive element for selections, filters, quick amounts
 */

import React from 'react';
import {
  Pressable,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { colors, palette } from '@theme/colors';
import { componentRadius } from '@theme/borderRadius';
import { spacing } from '@theme/spacing';
import { componentShadows } from '@theme/shadows';
import Text from './Text';

interface ChipProps {
  label: string;
  selected?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function Chip({
  label,
  selected = false,
  disabled = false,
  onPress,
  style,
}: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        selected && styles.selected,
        disabled && styles.disabled,
        pressed && !selected && styles.pressed,
        selected && componentShadows.buttonPrimary,
        style,
      ]}
    >
      <Text
        variant="labelMedium"
        color={selected ? palette.primary.contrast : colors.text.primary}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing[2.5],
    paddingHorizontal: spacing[5],
    borderRadius: componentRadius.chip,
    backgroundColor: colors.interactive.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border.transparent,
  },
  selected: {
    backgroundColor: palette.primary.main,
  },
  disabled: {
    backgroundColor: colors.interactive.disabled,
    opacity: 0.6,
  },
  pressed: {
    backgroundColor: colors.interactive.secondaryHover,
    borderColor: colors.border.primary,
  },
});

export default Chip;
