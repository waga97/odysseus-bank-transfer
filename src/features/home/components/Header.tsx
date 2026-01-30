/**
 * Odysseus Bank - Home Header
 * App logo, notifications, and profile avatar
 */

import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, Avatar, Badge, Icon } from '@components/ui';
import { colors, palette } from '@theme/colors';
import { spacing } from '@theme/spacing';
import { useUser } from '@stores/authStore';

interface HeaderProps {
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
}

export function Header({ onNotificationPress, onProfilePress }: HeaderProps) {
  const insets = useSafeAreaInsets();
  const user = useUser();

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing[2] }]}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <View style={styles.logoIcon}>
          <Icon name="globe" size={28} color={palette.primary.main} />
        </View>
        <Text variant="headlineSmall" color="primary">
          Odysseus
        </Text>
      </View>

      {/* Right Actions */}
      <View style={styles.actions}>
        {/* Notifications */}
        <Pressable
          style={styles.notificationButton}
          onPress={onNotificationPress}
        >
          <Icon name="bell" size={24} color={colors.text.primary} />
          <View style={styles.notificationBadge}>
            <Badge dot variant="error" />
          </View>
        </Pressable>

        {/* Profile Avatar */}
        <Pressable onPress={onProfilePress}>
          <Avatar
            name={user?.name ?? 'User'}
            source={user?.avatar ? { uri: user.avatar } : null}
            size="medium"
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[4],
    backgroundColor: colors.background.secondary,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  logoIcon: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
  },
  notificationButton: {
    position: 'relative',
    padding: spacing[1],
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
});

export default Header;
