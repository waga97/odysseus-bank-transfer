/**
 * Odysseus Bank - Balance Card
 * Displays total balance with hide/show toggle
 */

import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, Icon } from '@components/ui';
import { colors } from '@theme/colors';
import { spacing } from '@theme/spacing';
import { useBalance } from '@stores/accountStore';

export function BalanceCard() {
  const balance = useBalance();
  const [isHidden, setIsHidden] = useState(false);

  const toggleVisibility = useCallback(() => {
    setIsHidden((prev) => !prev);
  }, []);

  const formatBalance = (
    amount: number
  ): { whole: string; decimal: string } => {
    const formatted = amount.toLocaleString('en-MY', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    const [whole, decimal] = formatted.split('.');
    return { whole: whole ?? '0', decimal: decimal ?? '00' };
  };

  const { whole, decimal } = formatBalance(balance);

  return (
    <View style={styles.container}>
      {/* Label with visibility toggle */}
      <View style={styles.labelRow}>
        <Text variant="labelMedium" color="tertiary">
          Total Balance
        </Text>
        <Pressable onPress={toggleVisibility} hitSlop={8}>
          <Icon
            name={isHidden ? 'eye-off' : 'eye'}
            size={18}
            color={colors.text.tertiary}
          />
        </Pressable>
      </View>

      {/* Balance Amount */}
      <View style={styles.balanceRow}>
        <Text variant="displayMedium" color="primary">
          {isHidden ? '••••••' : `RM ${whole}`}
        </Text>
        {!isHidden && (
          <Text variant="headlineMedium" color="tertiary">
            .{decimal}
          </Text>
        )}
      </View>

      {/* Trend Indicator */}
      <View style={styles.trendContainer}>
        <Icon name="trending-up" size={14} color={colors.semantic.success} />
        <Text variant="labelSmall" color={colors.semantic.success}>
          +2.4% this month
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing[6],
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: spacing[1],
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    marginTop: spacing[2],
    backgroundColor: colors.semantic.successBackground,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: 100,
  },
});

export default BalanceCard;
