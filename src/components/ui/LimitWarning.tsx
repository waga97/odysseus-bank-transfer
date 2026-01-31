/**
 * Odysseus Bank - Transfer Limit Warning
 * Displays warning when transfer amount approaches or exceeds limits
 * Uses shared threshold from validateTransfer for consistency
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from './Text';
import { Icon } from './Icon';
import { colors, palette } from '@theme/colors';
import { spacing } from '@theme/spacing';
import { borderRadius } from '@theme/borderRadius';
import { formatCurrency } from '@utils/currency';
import { shouldWarnForLimit, exceedsLimit } from '@utils/validateTransfer';

type WarningLevel = 'info' | 'warning' | 'error';

interface LimitWarningProps {
  type: 'daily' | 'monthly' | 'perTransaction';
  amount: number;
  limit: number;
  remaining?: number;
  used?: number;
}

function getRemainingLabel(type: LimitWarningProps['type']): string {
  switch (type) {
    case 'daily':
      return 'remaining today';
    case 'monthly':
      return 'remaining this month';
    default:
      return 'remaining';
  }
}

function getLimitLabel(type: LimitWarningProps['type']): string {
  switch (type) {
    case 'daily':
      return 'Daily limit';
    case 'monthly':
      return 'Monthly limit';
    case 'perTransaction':
      return 'Transaction limit';
    default:
      return 'Limit';
  }
}

/**
 * Determine warning level using shared validation logic
 */
function getWarningLevel(
  amount: number,
  limit: number,
  remaining?: number,
  used?: number
): WarningLevel {
  const effectiveRemaining = remaining ?? limit;
  const effectiveUsed = used ?? limit - effectiveRemaining;

  // Check if exceeds limit
  if (exceedsLimit(amount, effectiveRemaining)) {
    return 'error';
  }

  // Check if approaching limit using shared threshold
  if (shouldWarnForLimit(amount, effectiveUsed, limit)) {
    return 'warning';
  }

  return 'info';
}

function getWarningColors(level: WarningLevel) {
  switch (level) {
    case 'error':
      return {
        background: palette.error.light,
        border: palette.error.main,
        text: palette.error.dark,
        icon: palette.error.main,
      };
    case 'warning':
      return {
        background: palette.warning.light,
        border: palette.warning.main,
        text: palette.warning.dark,
        icon: palette.warning.main,
      };
    default:
      return {
        background: colors.surface.secondary,
        border: colors.border.primary,
        text: colors.text.secondary,
        icon: colors.text.tertiary,
      };
  }
}

export function LimitWarning({
  type,
  amount,
  limit,
  remaining,
  used,
}: LimitWarningProps) {
  const level = getWarningLevel(amount, limit, remaining, used);
  const warningColors = getWarningColors(level);
  const effectiveRemaining = remaining ?? limit;
  const exceeds = amount > effectiveRemaining;

  const getMessage = () => {
    if (exceeds) {
      return `Exceeds ${getLimitLabel(type).toLowerCase()} by ${formatCurrency(amount - effectiveRemaining)}`;
    }
    if (level === 'warning') {
      return `${formatCurrency(effectiveRemaining - amount)} ${getRemainingLabel(type)}`;
    }
    return `${formatCurrency(effectiveRemaining)} ${getRemainingLabel(type)}`;
  };

  // Don't show info level for per-transaction limits (no remaining concept)
  if (level === 'info' && type !== 'perTransaction') {
    return null;
  }

  // For per-transaction, only show if exceeds
  if (type === 'perTransaction' && !exceeds) {
    return null;
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: warningColors.background,
          borderColor: warningColors.border,
        },
      ]}
    >
      <Icon
        name={level === 'error' ? 'alert-circle' : 'alert-triangle'}
        size={18}
        color={warningColors.icon}
      />
      <View style={styles.content}>
        <Text style={[styles.title, { color: warningColors.text }]}>
          {exceeds ? 'Limit exceeded' : 'Approaching limit'}
        </Text>
        <Text style={[styles.message, { color: warningColors.text }]}>
          {getMessage()}
        </Text>
      </View>
    </View>
  );
}

/**
 * Component to show all applicable limit warnings for a transfer amount
 */
interface TransferLimitWarningsProps {
  amount: number;
  dailyLimit: number;
  dailyRemaining: number;
  dailyUsed: number;
  monthlyLimit: number;
  monthlyRemaining: number;
  monthlyUsed: number;
  perTransactionLimit: number;
}

export function TransferLimitWarnings({
  amount,
  dailyLimit,
  dailyRemaining,
  dailyUsed,
  monthlyLimit,
  monthlyRemaining,
  monthlyUsed,
  perTransactionLimit,
}: TransferLimitWarningsProps) {
  if (amount <= 0) {
    return null;
  }

  return (
    <View style={styles.warningsContainer}>
      <LimitWarning
        type="perTransaction"
        amount={amount}
        limit={perTransactionLimit}
      />
      <LimitWarning
        type="daily"
        amount={amount}
        limit={dailyLimit}
        remaining={dailyRemaining}
        used={dailyUsed}
      />
      <LimitWarning
        type="monthly"
        amount={amount}
        limit={monthlyLimit}
        remaining={monthlyRemaining}
        used={monthlyUsed}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[3],
    padding: spacing[3],
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  content: {
    flex: 1,
    gap: spacing[1],
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
  },
  message: {
    fontSize: 13,
  },
  warningsContainer: {
    gap: spacing[2],
  },
});

export default LimitWarning;
