/**
 * Odysseus Bank - Bottom Navigation
 * Floating bottom tab bar
 */

import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '@components/ui';
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
  iconName: string;
  isCenter?: boolean;
}

const navItems: NavItem[] = [
  { id: 'home', iconName: 'home' },
  { id: 'cards', iconName: 'credit-card' },
  { id: 'transfer', iconName: 'repeat', isCenter: true },
  { id: 'analytics', iconName: 'bar-chart-2' },
  { id: 'settings', iconName: 'settings' },
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
                <Icon
                  name={item.iconName}
                  size={24}
                  color={palette.primary.contrast}
                />
              </Pressable>
            );
          }

          return (
            <Pressable
              key={item.id}
              style={styles.tabButton}
              onPress={() => onTabPress?.(item.id)}
            >
              <Icon
                name={item.iconName}
                size={24}
                color={isActive ? palette.primary.main : colors.text.tertiary}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: spacing[4],
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 380,
    backgroundColor: colors.surface.primary,
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
});

export default BottomNav;
