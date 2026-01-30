/**
 * Odysseus Bank - IconButton Component
 * Circular button for icons (back, menu, etc.)
 */

import React from 'react';
import {
  Pressable,
  StyleSheet,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { colors } from '@theme/colors';
import { borderRadius } from '@theme/borderRadius';
import { spacing } from '@theme/spacing';

type IconButtonVariant = 'default' | 'filled' | 'outlined';
type IconButtonSize = 'small' | 'medium' | 'large';

interface IconButtonProps extends Omit<PressableProps, 'style'> {
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

const sizeMap = {
  small: 32,
  medium: 40,
  large: 48,
} as const;

export function IconButton({
  variant = 'default',
  size = 'medium',
  disabled = false,
  style,
  children,
  ...rest
}: IconButtonProps) {
  const dimension = sizeMap[size];

  const getBackgroundColor = (pressed: boolean) => {
    if (disabled) {
      return 'transparent';
    }

    switch (variant) {
      case 'filled':
        return pressed
          ? colors.interactive.secondaryHover
          : colors.interactive.secondary;
      case 'outlined':
        return pressed ? colors.interactive.secondary : 'transparent';
      case 'default':
      default:
        return pressed ? colors.interactive.secondary : 'transparent';
    }
  };

  const getBorderStyle = () => {
    if (variant === 'outlined') {
      return {
        borderWidth: 1,
        borderColor: colors.border.primary,
      };
    }
    return {};
  };

  return (
    <Pressable
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        {
          width: dimension,
          height: dimension,
          backgroundColor: getBackgroundColor(pressed),
        },
        getBorderStyle(),
        disabled && styles.disabled,
        style,
      ]}
      {...rest}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.full,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default IconButton;
