/**
 * Ryt Bank - Card Component
 * Container component with elevation and variants
 */

import React from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  type ViewProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { colors } from '@theme/colors';
import { componentRadius } from '@theme/borderRadius';
import { componentShadows } from '@theme/shadows';
import { spacing } from '@theme/spacing';

type CardVariant = 'default' | 'elevated' | 'outlined' | 'hero';

interface CardProps extends Omit<ViewProps, 'style'> {
  variant?: CardVariant;
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  padding?: keyof typeof spacing | number;
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

export function Card({
  variant = 'default',
  padding = 4,
  onPress,
  disabled = false,
  style,
  children,
  ...rest
}: CardProps) {
  const paddingValue =
    typeof padding === 'number' && padding in spacing
      ? spacing[padding as keyof typeof spacing]
      : typeof padding === 'number'
        ? padding
        : spacing[padding];

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: colors.surface.elevated,
          ...componentShadows.cardElevated,
        };
      case 'outlined':
        return {
          backgroundColor: colors.surface.primary,
          borderWidth: 1,
          borderColor: colors.border.primary,
        };
      case 'hero':
        return {
          backgroundColor: colors.surface.primary,
          borderRadius: componentRadius.cardHero,
          ...componentShadows.card,
        };
      case 'default':
      default:
        return {
          backgroundColor: colors.surface.primary,
          ...componentShadows.card,
        };
    }
  };

  const getBorderRadius = () => {
    if (variant === 'hero') {
      return componentRadius.cardHero;
    }
    return componentRadius.card;
  };

  const cardContent = (
    <View
      style={[
        styles.base,
        { padding: paddingValue, borderRadius: getBorderRadius() },
        getVariantStyles(),
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={({ pressed }) => [
          pressed && styles.pressed,
          disabled && styles.disabled,
        ]}
      >
        {cardContent}
      </Pressable>
    );
  }

  return cardContent;
}

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  disabled: {
    opacity: 0.6,
  },
});

export default Card;
