/**
 * Odysseus Bank - Home Screen
 * Main dashboard with balance, quick actions, and recent activity
 */

import React, { useEffect, useCallback } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@navigation/types';
import { colors } from '@theme/colors';
import { spacing } from '@theme/spacing';
import { useAuthStore } from '@stores/authStore';
import { useAccountStore } from '@stores/accountStore';
import {
  userApi,
  accountApi,
  recipientApi,
  transactionApi,
  bankApi,
} from '@services/api';
import {
  Header,
  BalanceCard,
  QuickActions,
  PromoBanner,
  RecentActivity,
  BottomNav,
} from './components';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const setUser = useAuthStore((state) => state.setUser);
  const {
    setAccounts,
    setRecipients,
    setTransactions,
    setTransferLimits,
    setBanks,
    isLoading,
    setLoading,
  } = useAccountStore();

  // Load initial data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [user, accounts, recipients, limits, transactions, banks] =
        await Promise.all([
          userApi.getProfile(),
          accountApi.getAccounts(),
          recipientApi.getRecipients(),
          userApi.getLimits(),
          transactionApi.getTransactions({ limit: 10 }),
          bankApi.getBanks(),
        ]);

      // Update stores
      setUser(user);
      setAccounts(accounts);
      setRecipients(recipients);
      setTransferLimits(limits);
      setTransactions(transactions.items);
      setBanks(banks);
    } catch (error) {
      // Handle error silently for now
      // In production, show error toast
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  }, [
    setUser,
    setAccounts,
    setRecipients,
    setTransferLimits,
    setTransactions,
    setBanks,
    setLoading,
  ]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  // Navigation handlers
  const handleTransferPress = useCallback(() => {
    navigation.navigate('TransferHub');
  }, [navigation]);

  const handleSeeAllTransactions = useCallback(() => {
    navigation.navigate('TransferHistory');
  }, [navigation]);

  const handleSettingsPress = useCallback(() => {
    navigation.navigate('Settings');
  }, [navigation]);

  const handleTabPress = useCallback(
    (tab: string) => {
      switch (tab) {
        case 'transfer':
          navigation.navigate('TransferHub');
          break;
        case 'settings':
          navigation.navigate('Settings');
          break;
        case 'analytics':
          navigation.navigate('TransferHistory');
          break;
        default:
          break;
      }
    },
    [navigation]
  );

  return (
    <View style={styles.container}>
      <Header onProfilePress={handleSettingsPress} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={loadData}
            tintColor={colors.interactive.primary}
          />
        }
      >
        {/* Balance Display */}
        <BalanceCard />

        {/* Quick Actions */}
        <QuickActions onTransferPress={handleTransferPress} />

        {/* Promo Banner */}
        <View style={styles.bannerSection}>
          <PromoBanner onPress={handleTransferPress} />
        </View>

        {/* Recent Activity */}
        <RecentActivity onSeeAllPress={handleSeeAllTransactions} />

        {/* Bottom Spacing for Nav */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNav activeTab="home" onTabPress={handleTabPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing[4],
  },
  bannerSection: {
    marginTop: spacing[6],
  },
  bottomSpacer: {
    height: 120,
  },
});

export default HomeScreen;
