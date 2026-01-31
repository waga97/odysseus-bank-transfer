/**
 * Odysseus Bank - PIN Keypad Component
 * Reusable numeric keypad for PIN entry
 */

import React, { useCallback } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from './Text';
import { Icon } from './Icon';
import { colors } from '@theme/colors';
import { spacing } from '@theme/spacing';
import { borderRadius } from '@theme/borderRadius';
import { componentSizes } from '@theme/componentSizes';

interface PinKeypadProps {
  /** Called when a digit is pressed */
  onDigitPress: (digit: string) => void;
  /** Called when delete is pressed */
  onDeletePress: () => void;
  /** Disable all keys */
  disabled?: boolean;
}

const KEYPAD_ROWS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['', '0', 'delete'],
] as const;

export function PinKeypad({
  onDigitPress,
  onDeletePress,
  disabled = false,
}: PinKeypadProps) {
  const handlePress = useCallback(
    (key: string) => {
      if (disabled) {
        return;
      }
      if (key === 'delete') {
        onDeletePress();
      } else if (key !== '') {
        onDigitPress(key);
      }
    },
    [disabled, onDigitPress, onDeletePress]
  );

  return (
    <View style={styles.keypad}>
      {KEYPAD_ROWS.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((key) => {
            if (key === '') {
              return <View key="empty" style={styles.key} />;
            }

            const isDelete = key === 'delete';

            return (
              <Pressable
                key={key}
                style={({ pressed }) => [
                  styles.key,
                  pressed && !disabled && styles.keyPressed,
                  disabled && styles.keyDisabled,
                ]}
                onPress={() => handlePress(key)}
                disabled={disabled}
              >
                {isDelete ? (
                  <Icon
                    name="delete"
                    size={24}
                    color={
                      disabled ? colors.text.tertiary : colors.text.primary
                    }
                  />
                ) : (
                  <Text
                    style={[styles.keyText, disabled && styles.keyTextDisabled]}
                  >
                    {key}
                  </Text>
                )}
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const { icon } = componentSizes;

const styles = StyleSheet.create({
  keypad: {
    width: '100%',
    maxWidth: 300,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing[3],
  },
  key: {
    width: icon.large,
    height: icon.large,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface.secondary,
  },
  keyPressed: {
    backgroundColor: colors.background.tertiary,
  },
  keyDisabled: {
    opacity: 0.5,
  },
  keyText: {
    fontSize: 28,
    fontWeight: '500',
    color: colors.text.primary,
    lineHeight: 34,
  },
  keyTextDisabled: {
    color: colors.text.tertiary,
  },
});
