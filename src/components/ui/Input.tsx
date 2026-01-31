/**
 * Odysseus Bank - Input Component
 * Text input with label, error state, and icons
 */

import React, { useState, forwardRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  type TextInputProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { colors } from '@theme/colors';
import { typography } from '@theme/typography';
import { componentRadius } from '@theme/borderRadius';
import { spacing } from '@theme/spacing';
import Text from './Text';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  disabled?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<ViewStyle>;
}

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      disabled = false,
      containerStyle,
      inputStyle,
      onFocus,
      onBlur,
      ...rest
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = (
      e: Parameters<NonNullable<TextInputProps['onFocus']>>[0]
    ) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (
      e: Parameters<NonNullable<TextInputProps['onBlur']>>[0]
    ) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const getBorderColor = () => {
      if (error) {
        return colors.semantic.error;
      }
      if (isFocused) {
        return colors.border.focus;
      }
      return colors.border.primary;
    };

    const getBackgroundColor = () => {
      if (disabled) {
        return colors.background.tertiary;
      }
      return colors.surface.primary;
    };

    return (
      <View style={[styles.container, containerStyle]}>
        {label && (
          <Text variant="labelMedium" color="secondary" style={styles.label}>
            {label}
          </Text>
        )}

        <View
          style={[
            styles.inputContainer,
            {
              borderColor: getBorderColor(),
              backgroundColor: getBackgroundColor(),
            },
            isFocused && styles.inputContainerFocused,
            error && styles.inputContainerError,
          ]}
        >
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

          <TextInput
            ref={ref}
            style={[
              styles.input,
              leftIcon && styles.inputWithLeftIcon,
              rightIcon && styles.inputWithRightIcon,
              disabled && styles.inputDisabled,
              inputStyle,
            ]}
            placeholderTextColor={colors.text.tertiary}
            editable={!disabled}
            onFocus={handleFocus}
            onBlur={handleBlur}
            keyboardAppearance="light"
            {...rest}
          />

          {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
        </View>

        {(error || hint) && (
          <Text
            variant="caption"
            color={error ? colors.semantic.error : 'tertiary'}
            style={styles.helperText}
          >
            {error || hint}
          </Text>
        )}
      </View>
    );
  }
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    marginBottom: spacing[1.5],
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: componentRadius.input,
    minHeight: 52,
  },
  inputContainerFocused: {
    borderWidth: 2,
  },
  inputContainerError: {
    borderWidth: 2,
  },
  input: {
    flex: 1,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  inputWithLeftIcon: {
    paddingLeft: spacing[2],
  },
  inputWithRightIcon: {
    paddingRight: spacing[2],
  },
  inputDisabled: {
    color: colors.text.disabled,
  },
  leftIcon: {
    paddingLeft: spacing[4],
  },
  rightIcon: {
    paddingRight: spacing[4],
  },
  helperText: {
    marginTop: spacing[1],
  },
});

export default Input;
