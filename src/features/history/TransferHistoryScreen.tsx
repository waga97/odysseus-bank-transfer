import React, { useCallback, useState, useMemo, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, Icon, Avatar, ScreenHeader, Toast } from '@components/ui';
import { BottomNav } from '@features/home/components';
import { colors, palette } from '@theme/colors';
import { spacing } from '@theme/spacing';
import { borderRadius } from '@theme/borderRadius';
import { fontSize } from '@theme/typography';
import { formatCurrency } from '@utils/currency';
import type { RootStackScreenProps } from '@navigation/types';
import type { Transaction } from '@types';
import { SkeletonTransactionCard } from '@components/ui';
import { mockApi } from '@services/mocks';
import { useAccountStore } from '@stores/accountStore';

type Props = RootStackScreenProps<'TransferHistory'>;

const PAGE_SIZE = 5;

// Group transactions by date
interface TransactionGroup {
  title: string;
  data: Transaction[];
}

function groupTransactionsByDate(
  transactions: Transaction[]
): TransactionGroup[] {
  const groups: Record<string, Transaction[]> = {};
  const now = new Date();
  const today = now.toDateString();
  const yesterday = new Date(now.getTime() - 86400000).toDateString();

  transactions.forEach((txn) => {
    const date = new Date(txn.createdAt);
    const dateStr = date.toDateString();

    let groupKey: string;
    if (dateStr === today) {
      groupKey = 'Today';
    } else if (dateStr === yesterday) {
      groupKey = 'Yesterday';
    } else {
      groupKey = date.toLocaleDateString('en-MY', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }

    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey]?.push(txn);
  });

  return Object.entries(groups).map(([title, data]) => ({ title, data }));
}

function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString('en-MY', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function TransferHistoryScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [apiTransactions, setApiTransactions] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Toast state for error handling
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleTabPress = useCallback(
    (tab: 'home' | 'transfer' | 'analytics' | 'settings') => {
      if (tab === 'home') {
        navigation.navigate('Home');
      } else if (tab === 'transfer') {
        navigation.navigate('TransferHub');
      } else if (tab === 'settings') {
        navigation.navigate('Settings');
      }
      // analytics tab - already here (history)
    },
    [navigation]
  );

  // Get transactions from store (includes newly completed transfers)
  const storeTransactions = useAccountStore((state) => state.transactions);

  // Merge store transactions with API transactions, removing duplicates
  // Store transactions appear first (newest), then paginated API transactions
  const transactions = useMemo(() => {
    const storeIds = new Set(storeTransactions.map((t) => t.id));
    const uniqueApiTransactions = apiTransactions.filter(
      (t) => !storeIds.has(t.id)
    );
    return [...storeTransactions, ...uniqueApiTransactions];
  }, [storeTransactions, apiTransactions]);

  // Initial load - fetch first page
  useEffect(() => {
    let isMounted = true;

    mockApi
      .getTransactions({ limit: PAGE_SIZE, page: 1 })
      .then((response) => {
        if (isMounted) {
          setApiTransactions(response.items);
          setHasMore(response.hasMore);
          setIsLoading(false);
        }
      })
      .catch(() => {
        // Show error toast
        if (isMounted) {
          setToastMessage('Failed to load transactions. Pull down to retry.');
          setToastVisible(true);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const groupedTransactions = useMemo(
    () => groupTransactionsByDate(transactions),
    [transactions]
  );

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setCurrentPage(1);
    mockApi
      .getTransactions({ limit: PAGE_SIZE, page: 1 })
      .then((response) => {
        setApiTransactions(response.items);
        setHasMore(response.hasMore);
      })
      .catch(() => {
        setToastMessage('Failed to refresh. Please try again.');
        setToastVisible(true);
      })
      .finally(() => {
        setRefreshing(false);
      });
  }, []);

  const handleLoadMore = useCallback(() => {
    if (loadingMore || !hasMore) {
      return;
    }
    setLoadingMore(true);
    const nextPage = currentPage + 1;

    mockApi
      .getTransactions({ limit: PAGE_SIZE, page: nextPage })
      .then((response) => {
        setApiTransactions((prev) => [...prev, ...response.items]);
        setCurrentPage(nextPage);
        setHasMore(response.hasMore);
      })
      .catch(() => {
        setToastMessage('Failed to load more transactions.');
        setToastVisible(true);
      })
      .finally(() => {
        setLoadingMore(false);
      });
  }, [loadingMore, hasMore, currentPage]);

  const renderTransactionItem = useCallback(
    ({ item }: { item: Transaction }) => {
      const isCompleted = item.status === 'completed';
      const isFailed = item.status === 'failed';

      return (
        <View style={styles.transactionCard}>
          <Avatar name={item.recipient.name} size="medium" />

          <View style={styles.transactionInfo}>
            <Text style={styles.recipientName} numberOfLines={1}>
              {item.recipient.name}
            </Text>
            <Text style={styles.transactionMeta} numberOfLines={1}>
              {item.recipient.bankName} {'\u2022'} {formatTime(item.createdAt)}
            </Text>
            {item.note ? (
              <Text style={styles.transactionNote} numberOfLines={1}>
                {item.note}
              </Text>
            ) : null}
          </View>

          <View style={styles.transactionAmount}>
            <Text
              style={[styles.amountText, isFailed && styles.amountTextFailed]}
            >
              -{formatCurrency(item.amount)}
            </Text>
            <View
              style={[
                styles.statusBadge,
                isCompleted && styles.statusBadgeSuccess,
                isFailed && styles.statusBadgeFailed,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  isCompleted && styles.statusTextSuccess,
                  isFailed && styles.statusTextFailed,
                ]}
              >
                {item.status}
              </Text>
            </View>
          </View>
        </View>
      );
    },
    []
  );

  const renderSectionHeader = useCallback(
    ({ section }: { section: TransactionGroup }) => (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{section.title}</Text>
      </View>
    ),
    []
  );

  const renderFooter = useCallback(() => {
    if (!loadingMore) {
      return null;
    }
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color={palette.accent.main} />
      </View>
    );
  }, [loadingMore]);

  const renderEmpty = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconContainer}>
          <Icon name="inbox" size={48} color={colors.text.tertiary} />
        </View>
        <Text style={styles.emptyTitle}>No transactions yet</Text>
        <Text style={styles.emptySubtitle}>
          Your transfer history will appear here
        </Text>
      </View>
    ),
    []
  );

  // Render skeleton loading state
  const renderSkeleton = useCallback(
    () => (
      <View style={styles.skeletonContainer}>
        {[1, 2, 3, 4, 5].map((i) => (
          <SkeletonTransactionCard key={i} />
        ))}
      </View>
    ),
    []
  );

  // Flatten grouped data for FlatList with section headers
  const flatData = useMemo(() => {
    const result: Array<Transaction | { type: 'header'; title: string }> = [];
    groupedTransactions.forEach((group) => {
      result.push({ type: 'header', title: group.title });
      result.push(...group.data);
    });
    return result;
  }, [groupedTransactions]);

  const renderItem = useCallback(
    ({ item }: { item: Transaction | { type: 'header'; title: string } }) => {
      if ('type' in item && item.type === 'header') {
        return renderSectionHeader({
          section: { title: item.title, data: [] },
        });
      }
      return renderTransactionItem({ item });
    },
    [renderSectionHeader, renderTransactionItem]
  );

  const keyExtractor = useCallback(
    (item: Transaction | { type: 'header'; title: string }, _index: number) => {
      if ('type' in item && item.type === 'header') {
        return `header-${item.title}`;
      }
      return item.id;
    },
    []
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />

      {/* Error Toast */}
      <Toast
        visible={toastVisible}
        message={toastMessage}
        type="error"
        onDismiss={() => setToastVisible(false)}
      />

      <ScreenHeader title="Transfer History" />

      <View style={styles.content}>
        {/* Transaction List or Skeleton */}
        {isLoading ? (
          renderSkeleton()
        ) : (
          <FlatList
            data={flatData}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor={palette.accent.main}
                colors={[palette.accent.main]}
              />
            }
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.3}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={renderEmpty}
            // Virtualization hints for better performance with large lists
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={5}
            removeClippedSubviews={true}
          />
        )}
      </View>

      <BottomNav activeTab="analytics" onTabPress={handleTabPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[6],
  },
  sectionHeader: {
    paddingVertical: spacing[3],
    paddingTop: spacing[4],
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
    backgroundColor: palette.primary.contrast,
    borderRadius: borderRadius.xl,
    marginBottom: spacing[3],
    gap: spacing[3],
  },
  transactionInfo: {
    flex: 1,
    gap: 2,
  },
  recipientName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
  },
  transactionMeta: {
    fontSize: 13,
    color: colors.text.tertiary,
  },
  transactionNote: {
    fontSize: 12,
    color: colors.text.secondary,
    fontStyle: 'italic',
    marginTop: 2,
  },
  transactionAmount: {
    alignItems: 'flex-end',
    gap: spacing[1],
  },
  amountText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
  },
  amountTextFailed: {
    color: colors.text.tertiary,
    textDecorationLine: 'line-through',
  },
  statusBadge: {
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.tertiary,
  },
  statusBadgeSuccess: {
    backgroundColor: colors.status.successBg,
  },
  statusBadgeFailed: {
    backgroundColor: colors.status.errorBg,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.text.tertiary,
    textTransform: 'capitalize',
  },
  statusTextSuccess: {
    color: colors.status.success,
  },
  statusTextFailed: {
    color: colors.status.error,
  },
  loadingFooter: {
    paddingVertical: spacing[4],
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[16],
    gap: spacing[3],
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[2],
  },
  emptyTitle: {
    fontSize: fontSize.sectionTitle,
    fontWeight: '600',
    color: colors.text.primary,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  skeletonContainer: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[4],
  },
});

export default TransferHistoryScreen;
