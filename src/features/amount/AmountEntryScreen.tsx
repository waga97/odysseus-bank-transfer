/**
 * Odysseus Bank - Amount Entry Screen
 * Enter transfer amount with numpad
 */

import React, { useCallback, useState, useMemo } from 'react';
import { View, StyleSheet, Pressable, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Text,
  Avatar,
  Icon,
  Input,
  Button,
  TransferLimitWarnings,
  ScreenHeader,
} from '@components/ui';
import { colors, palette } from '@theme/colors';
import { spacing } from '@theme/spacing';
import { borderRadius } from '@theme/borderRadius';
import type { RootStackScreenProps } from '@navigation/types';
import { useAccountStore } from '@stores/accountStore';
import { useTransferStore } from '@stores/transferStore';
import { formatInputDisplay } from '@utils/currency';
import { lightHaptic } from '@utils/haptics';
import {
  validateTransfer,
  getFirstErrorMessage,
} from '@utils/validateTransfer';

type Props = RootStackScreenProps<'AmountEntry'>;

// Quick amount buttons
const QUICK_AMOUNTS = [50, 100, 200, 500];

export function AmountEntryScreen({ navigation, route }: Props) {
  const { recipient } = route.params;
  const insets = useSafeAreaInsets();

  const { transferLimits: limits, defaultAccount } = useAccountStore();
  const { setAmount: setStoreAmount, setNote: setStoreNote } =
    useTransferStore();

  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [showNote, setShowNote] = useState(false);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // Parse amount to number
  const numericAmount = useMemo(() => {
    const parsed = parseFloat(amount);
    return isNaN(parsed) ? 0 : parsed;
  }, [amount]);

  // Validation - uses shared validation function (DRY)
  const validation = useMemo(() => {
    if (!limits || numericAmount <= 0) {
      return { valid: false, message: null };
    }

    const result = validateTransfer({
      amount: numericAmount,
      balance: defaultAccount?.balance ?? 0,
      limits,
    });

    return {
      valid: result.isValid,
      message: getFirstErrorMessage(result),
    };
  }, [numericAmount, defaultAccount, limits]);

  // Handle numpad press
  const handleNumpadPress = useCallback(
    (key: string) => {
      void lightHaptic();

      if (key === 'backspace') {
        setAmount((prev) => prev.slice(0, -1));
        return;
      }

      if (key === '.') {
        // Only allow one decimal point
        if (amount.includes('.')) {
          return;
        }
        // Don't start with decimal
        if (amount === '') {
          setAmount('0.');
          return;
        }
      }

      // Limit decimal places to 2
      const parts = amount.split('.');
      if (parts.length === 2 && (parts[1]?.length ?? 0) >= 2) {
        return;
      }

      // Max amount length
      if (amount.length >= 10) {
        return;
      }

      setAmount((prev) => prev + key);
    },
    [amount]
  );

  // Handle quick amount
  const handleQuickAmount = useCallback((value: number) => {
    void lightHaptic();
    setAmount(value.toString());
  }, []);

  // Handle continue
  const handleContinue = useCallback(() => {
    if (!validation.valid) {
      return;
    }

    setStoreAmount(numericAmount);
    setStoreNote(note);

    navigation.navigate('TransferReview', {
      recipient,
      amount: numericAmount,
      note: note || undefined,
    });
  }, [
    validation,
    numericAmount,
    note,
    navigation,
    recipient,
    setStoreAmount,
    setStoreNote,
  ]);

  // Format display amount with thousand separators
  const displayAmount = useMemo(() => {
    return formatInputDisplay(amount);
  }, [amount]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />

      <ScreenHeader title="Enter Amount" onBack={handleBack} />

      {/* Recipient Info */}
      <View style={styles.recipientCard}>
        <Avatar name={recipient.name} size="medium" />
        <View style={styles.recipientInfo}>
          <Text variant="titleSmall" color="primary">
            {recipient.name}
          </Text>
          <Text variant="caption" color="tertiary">
            {recipient.bankName} •{' '}
            {recipient.accountNumber
              ? `•••• ${recipient.accountNumber.slice(-4)}`
              : recipient.phoneNumber}
          </Text>
        </View>
      </View>

      {/* Amount Display */}
      <View style={styles.amountSection}>
        <View style={styles.amountContainer}>
          <Text style={styles.currencySymbol}>RM</Text>
          <Text style={styles.amountText}>{displayAmount}</Text>
        </View>

        {/* Limit Warnings */}
        {numericAmount > 0 && limits && (
          <View style={styles.limitWarnings}>
            <TransferLimitWarnings
              amount={numericAmount}
              dailyLimit={limits.daily.limit}
              dailyRemaining={limits.daily.remaining}
              monthlyLimit={limits.monthly.limit}
              monthlyRemaining={limits.monthly.remaining}
              perTransactionLimit={limits.perTransaction}
            />
          </View>
        )}

        {validation.message && (
          <Text variant="bodySmall" color={colors.status.error} align="center">
            {validation.message}
          </Text>
        )}

        {/* Quick Amounts */}
        <View style={styles.quickAmounts}>
          {QUICK_AMOUNTS.map((value) => {
            const isActive = numericAmount === value;
            return (
              <Pressable
                key={value}
                style={({ pressed }) => [
                  styles.quickAmountButton,
                  isActive && styles.quickAmountButtonActive,
                  pressed && styles.quickAmountButtonPressed,
                ]}
                onPress={() => handleQuickAmount(value)}
              >
                <Text
                  variant="labelMedium"
                  color={isActive ? 'inverse' : 'primary'}
                >
                  RM {value}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Note Section */}
      {showNote ? (
        <View style={styles.noteSection}>
          <Input
            placeholder="Add a note (optional)"
            value={note}
            onChangeText={setNote}
            maxLength={100}
            containerStyle={styles.noteInput}
          />
        </View>
      ) : (
        <Pressable
          style={styles.addNoteButton}
          onPress={() => setShowNote(true)}
        >
          <Icon name="edit-2" size={16} color={colors.interactive.primary} />
          <Text variant="labelMedium" color={colors.interactive.primary}>
            Add note
          </Text>
        </Pressable>
      )}

      {/* Numpad */}
      <View style={styles.numpad}>
        {[
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '7',
          '8',
          '9',
          '.',
          '0',
          'backspace',
        ].map((key) => (
          <Pressable
            key={key}
            style={({ pressed }) => [
              styles.numpadKey,
              pressed && styles.numpadKeyPressed,
            ]}
            onPress={() => handleNumpadPress(key)}
          >
            {key === 'backspace' ? (
              <Icon name="delete" size={24} color={colors.text.primary} />
            ) : (
              <Text style={styles.numpadKeyText}>{key}</Text>
            )}
          </Pressable>
        ))}
      </View>

      {/* Continue Button */}
      <View
        style={[styles.bottomContainer, { paddingBottom: insets.bottom + 16 }]}
      >
        <Button
          variant="primary"
          size="large"
          fullWidth
          onPress={handleContinue}
          disabled={!validation.valid}
        >
          Continue
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  recipientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    marginHorizontal: spacing[4],
    padding: spacing[3],
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.xl,
  },
  recipientInfo: {
    flex: 1,
    gap: 2,
  },
  amountSection: {
    alignItems: 'center',
    paddingVertical: spacing[4],
    gap: spacing[3],
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    minHeight: 60,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  amountText: {
    fontSize: 48,
    fontWeight: '600',
    color: colors.text.primary,
    lineHeight: 56,
  },
  quickAmounts: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  quickAmountButton: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  quickAmountButtonActive: {
    backgroundColor: palette.primary.main,
    borderColor: palette.primary.main,
  },
  quickAmountButtonPressed: {
    backgroundColor: colors.background.tertiary,
  },
  limitWarnings: {
    width: '100%',
    paddingHorizontal: spacing[4],
  },
  noteSection: {
    paddingHorizontal: spacing[4],
    marginBottom: spacing[2],
  },
  noteInput: {
    // Uses standardized Input component styling
  },
  addNoteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    paddingVertical: spacing[2],
  },
  numpad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing[4],
    justifyContent: 'center',
  },
  numpadKey: {
    width: '33.33%',
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numpadKeyPressed: {
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.xl,
  },
  numpadKeyText: {
    fontSize: 28,
    fontWeight: '500',
    color: colors.text.primary,
    lineHeight: 34,
  },
  bottomContainer: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[2],
  },
});

export default AmountEntryScreen;
