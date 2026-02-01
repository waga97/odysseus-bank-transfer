/**
 * Ryt Bank - Settings Screen
 * User preferences, limits view, and biometric settings
 */

import React, { useCallback } from 'react';
import { View, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, Icon, Card, Divider, ScreenHeader } from '@components/ui';
import { BottomNav } from '@features/home/components';
import { colors, palette } from '@theme/colors';
import { spacing } from '@theme/spacing';
import { borderRadius } from '@theme/borderRadius';
import { formatCurrency } from '@utils/currency';
import { useAccountStore } from '@stores/accountStore';
import { useUser } from '@stores/authStore';
import { appConfig } from '@config/app';
import type { RootStackScreenProps } from '@navigation/types';

type Props = RootStackScreenProps<'Settings'>;

export function SettingsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { transferLimits } = useAccountStore();
  const user = useUser();

  const handleTabPress = useCallback(
    (tab: 'home' | 'transfer' | 'analytics' | 'settings') => {
      if (tab === 'home') {
        navigation.navigate('Home');
      } else if (tab === 'transfer') {
        navigation.navigate('TransferHub');
      } else if (tab === 'analytics') {
        navigation.navigate('TransferHistory');
      }
      // settings tab - already here
    },
    [navigation]
  );

  const dailyUsedPercentage = transferLimits
    ? Math.round((transferLimits.daily.used / transferLimits.daily.limit) * 100)
    : 0;

  const monthlyUsedPercentage = transferLimits
    ? Math.round(
        (transferLimits.monthly.used / transferLimits.monthly.limit) * 100
      )
    : 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />

      <ScreenHeader title="Settings" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <Card style={styles.profileCard}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileInitials}>
              {user?.name
                ?.split(' ')
                .map((n: string) => n[0])
                .join('')
                .slice(0, 2) ?? 'U'}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {user?.name ?? appConfig.mockUser.name}
            </Text>
            <Text style={styles.profileEmail}>
              {user?.email ?? appConfig.mockUser.email}
            </Text>
          </View>
          <Icon name="chevron-right" size={20} color={colors.text.tertiary} />
        </Card>

        {/* Transfer Limits */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transfer Limits</Text>
          <Card style={styles.limitsCard}>
            {/* Daily Limit */}
            <View style={styles.limitItem}>
              <View style={styles.limitHeader}>
                <Text style={styles.limitLabel}>Daily Limit</Text>
                <Text style={styles.limitValue}>
                  {formatCurrency(transferLimits?.daily.used ?? 0)} /{' '}
                  {formatCurrency(transferLimits?.daily.limit ?? 0)}
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${dailyUsedPercentage}%` },
                    dailyUsedPercentage > 80 && styles.progressWarning,
                  ]}
                />
              </View>
              <Text style={styles.limitRemaining}>
                {formatCurrency(transferLimits?.daily.remaining ?? 0)} remaining
                today
              </Text>
            </View>

            <Divider style={styles.limitDivider} />

            {/* Monthly Limit */}
            <View style={styles.limitItem}>
              <View style={styles.limitHeader}>
                <Text style={styles.limitLabel}>Monthly Limit</Text>
                <Text style={styles.limitValue}>
                  {formatCurrency(transferLimits?.monthly.used ?? 0)} /{' '}
                  {formatCurrency(transferLimits?.monthly.limit ?? 0)}
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${monthlyUsedPercentage}%` },
                    monthlyUsedPercentage > 80 && styles.progressWarning,
                  ]}
                />
              </View>
              <Text style={styles.limitRemaining}>
                {formatCurrency(transferLimits?.monthly.remaining ?? 0)}{' '}
                remaining this month
              </Text>
            </View>

            <Divider style={styles.limitDivider} />

            {/* Per Transaction */}
            <View style={styles.limitItem}>
              <View style={styles.limitHeader}>
                <Text style={styles.limitLabel}>Per Transaction</Text>
                <Text style={styles.limitValue}>
                  {formatCurrency(transferLimits?.perTransaction ?? 0)}
                </Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Version */}
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>

      <BottomNav activeTab="settings" onTabPress={handleTabPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing[4],
    paddingBottom: spacing[8],
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
    gap: spacing[3],
  },
  profileAvatar: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
    backgroundColor: palette.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitials: {
    fontSize: 20,
    fontWeight: '700',
    color: palette.primary.contrast,
  },
  profileInfo: {
    flex: 1,
    gap: 2,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.text.tertiary,
  },
  section: {
    marginTop: spacing[6],
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.tertiary,
    marginBottom: spacing[3],
    marginLeft: spacing[1],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  limitsCard: {
    padding: spacing[4],
  },
  limitItem: {
    gap: spacing[2],
  },
  limitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  limitLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
  },
  limitValue: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: palette.accent.main,
    borderRadius: borderRadius.full,
  },
  progressWarning: {
    backgroundColor: palette.warning.main,
  },
  limitRemaining: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  limitDivider: {
    marginVertical: spacing[4],
  },
  versionText: {
    fontSize: 12,
    color: colors.text.tertiary,
    textAlign: 'center',
    marginTop: spacing[6],
  },
});

export default SettingsScreen;
