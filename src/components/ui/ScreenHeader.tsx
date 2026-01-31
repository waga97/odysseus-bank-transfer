/**
 * Odysseus Bank - Screen Header Component
 * Reusable header with back button and centered title
 */

import React from 'react';
import type { ViewStyle } from 'react-native';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from './Text';
import { Icon } from './Icon';
import { colors } from '@theme/colors';
import { spacing } from '@theme/spacing';
import { borderRadius } from '@theme/borderRadius';
import { componentSizes } from '@theme/componentSizes';

interface ScreenHeaderProps {
  /** Header title text */
  title: string;
  /** Back button handler - if not provided, back button is hidden */
  onBack?: () => void;
  /** Optional element on the right side (e.g., settings icon) */
  rightElement?: React.ReactNode;
  /** Custom container style */
  style?: ViewStyle;
}

export function ScreenHeader({
  title,
  onBack,
  rightElement,
  style,
}: ScreenHeaderProps) {
  return (
    <View style={[styles.header, style]}>
      {onBack ? (
        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backButtonPressed,
          ]}
          onPress={onBack}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Icon name="arrow-left" size={24} color={colors.text.primary} />
        </Pressable>
      ) : (
        <View style={styles.spacer} />
      )}

      <Text variant="titleMedium" color="primary" style={styles.title}>
        {title}
      </Text>

      {rightElement ?? <View style={styles.spacer} />}
    </View>
  );
}

const { backButton: buttonSize } = componentSizes.header;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  backButton: {
    width: buttonSize,
    height: buttonSize,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonPressed: {
    backgroundColor: colors.background.tertiary,
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
  spacer: {
    width: buttonSize,
  },
});
