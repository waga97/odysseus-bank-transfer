/**
 * Ryt Bank - Toast Component
 * Animated toast notification for success/error messages
 */

import React, { useEffect, useRef, useCallback } from 'react';
import { StyleSheet, Animated, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from './Text';
import { Icon } from './Icon';
import { colors, palette } from '@theme/colors';
import { spacing } from '@theme/spacing';
import { borderRadius } from '@theme/borderRadius';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  visible: boolean;
  message: string;
  type?: ToastType;
  duration?: number;
  onDismiss: () => void;
}

const TOAST_CONFIG: Record<
  ToastType,
  { icon: string; bgColor: string; iconColor: string }
> = {
  success: {
    icon: 'check-circle',
    bgColor: colors.status.successBg,
    iconColor: colors.status.success,
  },
  error: {
    icon: 'x-circle',
    bgColor: colors.status.errorBg,
    iconColor: colors.status.error,
  },
  warning: {
    icon: 'alert-triangle',
    bgColor: colors.status.warningBg,
    iconColor: colors.status.warning,
  },
  info: {
    icon: 'info',
    bgColor: palette.accent.light + '30',
    iconColor: palette.accent.main,
  },
};

export function Toast({
  visible,
  message,
  type = 'error',
  duration = 3000,
  onDismiss,
}: ToastProps) {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const config = TOAST_CONFIG[type];

  const handleDismiss = useCallback(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss();
    });
  }, [translateY, opacity, onDismiss]);

  useEffect(() => {
    if (visible) {
      // Slide in
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          friction: 8,
          tension: 80,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto dismiss
      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [visible, duration, translateY, opacity, handleDismiss]);

  if (!visible) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          top: insets.top + spacing[2],
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <Pressable
        style={[styles.toast, { backgroundColor: config.bgColor }]}
        onPress={handleDismiss}
      >
        <Icon name={config.icon} size={20} color={config.iconColor} />
        <Text style={styles.message} numberOfLines={2}>
          {message}
        </Text>
        <Icon name="x" size={18} color={colors.text.tertiary} />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: spacing[4],
    right: spacing[4],
    zIndex: 9999,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[3],
    borderRadius: borderRadius.lg,
    gap: spacing[3],
    shadowColor: colors.shadow.color,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
  },
});

export default Toast;
