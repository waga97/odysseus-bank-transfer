/**
 * Odysseus Bank - Quick Actions
 * Grid of primary action buttons (Scan, Add, Receive, Transfer)
 */

import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from '@components/ui';
import { colors, palette } from '@theme/colors';
import { spacing } from '@theme/spacing';
import { borderRadius } from '@theme/borderRadius';
import { componentShadows } from '@theme/shadows';

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  isPrimary?: boolean;
  onPress: () => void;
}

interface QuickActionsProps {
  onScanPress?: () => void;
  onAddMoneyPress?: () => void;
  onReceivePress?: () => void;
  onTransferPress?: () => void;
}

export function QuickActions({
  onScanPress,
  onAddMoneyPress,
  onReceivePress,
  onTransferPress,
}: QuickActionsProps) {
  const actions: QuickAction[] = [
    {
      id: 'scan',
      label: 'Scan',
      icon: '⊞',
      onPress: onScanPress ?? (() => {}),
    },
    {
      id: 'add',
      label: 'Add Money',
      icon: '+',
      isPrimary: true,
      onPress: onAddMoneyPress ?? (() => {}),
    },
    {
      id: 'receive',
      label: 'Receive',
      icon: '↙',
      onPress: onReceivePress ?? (() => {}),
    },
    {
      id: 'transfer',
      label: 'Transfer',
      icon: '↗',
      onPress: onTransferPress ?? (() => {}),
    },
  ];

  return (
    <View style={styles.container}>
      {actions.map((action) => (
        <Pressable
          key={action.id}
          style={styles.actionButton}
          onPress={action.onPress}
        >
          <View
            style={[
              styles.iconContainer,
              action.isPrimary && styles.iconContainerPrimary,
              action.isPrimary && componentShadows.buttonPrimary,
            ]}
          >
            <Text
              style={[
                styles.icon,
                action.isPrimary && styles.iconPrimary,
              ]}
            >
              {action.icon}
            </Text>
          </View>
          <Text variant="labelSmall" color="secondary">
            {action.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
  },
  actionButton: {
    alignItems: 'center',
    gap: spacing[2],
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  iconContainerPrimary: {
    backgroundColor: palette.primary.main,
    borderColor: palette.primary.main,
  },
  icon: {
    fontSize: 24,
    color: palette.primary.main,
  },
  iconPrimary: {
    color: palette.primary.contrast,
  },
});

export default QuickActions;
