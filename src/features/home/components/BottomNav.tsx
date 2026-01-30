/**
 * Odysseus Bank - Bottom Navigation
 * Floating bottom tab bar
 */

import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@components/ui';
import { colors, palette } from '@theme/colors';
import { spacing } from '@theme/spacing';
import { borderRadius } from '@theme/borderRadius';
import { componentShadows } from '@theme/shadows';

type TabId = 'home' | 'cards' | 'transfer' | 'analytics' | 'settings';

interface BottomNavProps {
  activeTab?: TabId;
  onTabPress?: (tab: TabId) => void;
}

interface NavItem {
  id: TabId;
  icon: string;
  isCenter?: boolean;
}

const navItems: NavItem[] = [
  { id: 'home', icon: '⌂' },
  { id: 'cards', icon: '💳' },
  { id: 'transfer', icon: '⇄', isCenter: true },
  { id: 'analytics', icon: '📊' },
  { id: 'settings', icon: '⚙' },
];

export function BottomNav({ activeTab = 'home', onTabPress }: BottomNavProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: Math.max(insets.bottom, spacing[6]) },
      ]}
    >
      <View style={styles.navBar}>
        {navItems.map((item) => {
          const isActive = activeTab === item.id;

          if (item.isCenter) {
            return (
              <Pressable
                key={item.id}
                style={[styles.centerButton, componentShadows.buttonPrimary]}
                onPress={() => onTabPress?.(item.id)}
              >
                <Text style={styles.centerIcon}>{item.icon}</Text>
              </Pressable>
            );
          }

          return (
            <Pressable
              key={item.id}
              style={styles.tabButton}
              onPress={() => onTabPress?.(item.id)}
            >
              <Text
                style={[
                  styles.tabIcon,
                  isActive && styles.tabIconActive,
                ]}
              >
                {item.icon}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: spacing[4],
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 380,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border.primary,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    ...componentShadows.cardElevated,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[2],
  },
  tabIcon: {
    fontSize: 24,
    color: colors.text.tertiary,
  },
  tabIconActive: {
    color: palette.primary.main,
  },
  centerButton: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
    backgroundColor: palette.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -spacing[8],
    borderWidth: 4,
    borderColor: colors.surface.primary,
  },
  centerIcon: {
    fontSize: 24,
    color: palette.primary.contrast,
  },
});

export default BottomNav;
