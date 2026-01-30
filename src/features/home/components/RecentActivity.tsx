/**
 * Odysseus Bank - Recent Activity
 * List of recent transactions
 */

import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, Card, Icon } from '@components/ui';
import { colors } from '@theme/colors';
import { spacing } from '@theme/spacing';
import { borderRadius } from '@theme/borderRadius';
import { useTransactions } from '@stores/accountStore';
import type { Transaction } from '@types';

interface RecentActivityProps {
  onSeeAllPress?: () => void;
  onTransactionPress?: (transaction: Transaction) => void;
}

// Map transaction types to icons and colors
const transactionTypeConfig: Record<
  string,
  { iconName: string; bgColor: string; iconColor: string }
> = {
  transfer: {
    iconName: 'send',
    bgColor: '#dbeafe',
    iconColor: '#2563eb',
  },
  payment: {
    iconName: 'shopping-bag',
    bgColor: '#fef3c7',
    iconColor: '#d97706',
  },
  topup: {
    iconName: 'plus',
    bgColor: '#d1fae5',
    iconColor: '#059669',
  },
  withdrawal: {
    iconName: 'arrow-down',
    bgColor: '#fee2e2',
    iconColor: '#dc2626',
  },
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return `Today, ${date.toLocaleTimeString('en-MY', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })}`;
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return date.toLocaleDateString('en-MY', { weekday: 'long' });
  } else {
    return date.toLocaleDateString('en-MY', {
      month: 'short',
      day: 'numeric',
    });
  }
}

function formatAmount(amount: number, currency: string): string {
  return `${currency} ${amount.toLocaleString('en-MY', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function RecentActivity({
  onSeeAllPress,
  onTransactionPress,
}: RecentActivityProps) {
  const transactions = useTransactions();
  const recentTransactions = transactions.slice(0, 3);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text variant="headlineSmall" color="primary">
          Recent Activity
        </Text>
        <Pressable onPress={onSeeAllPress}>
          <Text variant="labelMedium" color={colors.interactive.primary}>
            See All
          </Text>
        </Pressable>
      </View>

      {/* Transaction List */}
      <View style={styles.list}>
        {recentTransactions.length === 0 ? (
          <Card variant="default" style={styles.emptyState}>
            <Text variant="bodyMedium" color="tertiary" align="center">
              No recent transactions
            </Text>
          </Card>
        ) : (
          recentTransactions.map((transaction) => {
            const config =
              transactionTypeConfig[transaction.type] ??
              transactionTypeConfig.transfer;

            return (
              <Pressable
                key={transaction.id}
                onPress={() => onTransactionPress?.(transaction)}
              >
                <Card variant="default" style={styles.transactionCard}>
                  <View style={styles.transactionContent}>
                    {/* Icon */}
                    <View
                      style={[
                        styles.iconContainer,
                        { backgroundColor: config.bgColor },
                      ]}
                    >
                      <Icon
                        name={config.iconName}
                        size={20}
                        color={config.iconColor}
                      />
                    </View>

                    {/* Details */}
                    <View style={styles.details}>
                      <Text variant="titleSmall" color="primary">
                        {transaction.recipient.name}
                      </Text>
                      <Text variant="caption" color="tertiary">
                        {formatDate(transaction.createdAt)}
                      </Text>
                    </View>

                    {/* Amount */}
                    <Text variant="titleSmall" color="primary">
                      -{formatAmount(transaction.amount, transaction.currency)}
                    </Text>
                  </View>
                </Card>
              </Pressable>
            );
          })
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[4],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  list: {
    gap: spacing[3],
  },
  transactionCard: {
    padding: spacing[4],
  },
  transactionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  details: {
    flex: 1,
  },
  emptyState: {
    padding: spacing[8],
    alignItems: 'center',
  },
});

export default RecentActivity;
