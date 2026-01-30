/**
 * Odysseus Bank - Icon Component
 * Wrapper for Material Icons with consistent sizing
 */

import React from 'react';
import { Text, StyleSheet, type TextStyle, type StyleProp } from 'react-native';
import { colors } from '@theme/colors';

type IconSize = 'small' | 'medium' | 'large' | 'xlarge';

interface IconProps {
  name: string;
  size?: IconSize;
  color?: string;
  style?: StyleProp<TextStyle>;
}

const sizeMap = {
  small: 18,
  medium: 24,
  large: 28,
  xlarge: 32,
} as const;

/**
 * Note: This uses a Text component as placeholder.
 * In production, replace with @expo/vector-icons or react-native-vector-icons
 *
 * Usage: <Icon name="send" size="medium" color={colors.text.primary} />
 */
export function Icon({
  name,
  size = 'medium',
  color = colors.text.primary,
  style,
}: IconProps) {
  const fontSize = sizeMap[size];

  return (
    <Text
      style={[
        styles.icon,
        { fontSize, color },
        style,
      ]}
    >
      {getIconChar(name)}
    </Text>
  );
}

/**
 * Map icon names to unicode characters or emoji placeholders
 * In production, this would use actual icon font
 */
function getIconChar(name: string): string {
  const iconMap: Record<string, string> = {
    // Navigation
    'arrow_back': '←',
    'arrow_forward': '→',
    'close': '✕',
    'more_vert': '⋮',
    'menu': '☰',

    // Actions
    'send': '↗',
    'add': '+',
    'remove': '−',
    'check': '✓',
    'search': '⌕',
    'edit': '✎',
    'delete': '🗑',
    'share': '↑',
    'copy': '⧉',

    // Finance
    'account_balance_wallet': '💳',
    'payments': '💸',
    'savings': '🏦',
    'trending_up': '↑',
    'trending_down': '↓',

    // Status
    'error': '⚠',
    'warning': '⚠',
    'info': 'ℹ',
    'success': '✓',
    'notifications': '🔔',

    // Biometric
    'fingerprint': '👆',
    'face': '👤',

    // Misc
    'visibility': '👁',
    'visibility_off': '◌',
    'home': '⌂',
    'settings': '⚙',
    'person': '👤',
    'contacts': '📇',
    'history': '⏱',
    'qr_code': '⊞',
    'star': '★',
    'star_outline': '☆',
  };

  return iconMap[name] ?? '•';
}

const styles = StyleSheet.create({
  icon: {
    fontWeight: '400',
  },
});

export default Icon;
