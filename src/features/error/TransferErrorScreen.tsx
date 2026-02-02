import React, { useMemo, useEffect } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, Icon, Button } from '@components/ui';
import { colors, palette } from '@theme/colors';
import { spacing } from '@theme/spacing';
import { borderRadius } from '@theme/borderRadius';
import { componentSizes } from '@theme/componentSizes';
import { errorHaptic } from '@utils/haptics';
import type { RootStackScreenProps } from '@navigation/types';

type Props = RootStackScreenProps<'TransferError'>;

type ErrorConfig = {
  icon: string;
  iconColor: string;
  iconBgColor: string;
  title: string;
  message: string;
  primaryAction: string;
  secondaryAction?: string;
  showContactSupport?: boolean;
};

const ERROR_CONFIGS: Record<string, ErrorConfig> = {
  insufficient_funds: {
    icon: 'credit-card',
    iconColor: colors.status.error,
    iconBgColor: colors.status.errorBg,
    title: 'Insufficient Funds',
    message:
      'Your account balance is too low to complete this transfer. Please add funds or try a smaller amount.',
    primaryAction: 'Try Different Amount',
    secondaryAction: 'Add Funds',
  },
  network_error: {
    icon: 'wifi-off',
    iconColor: colors.status.warning,
    iconBgColor: colors.status.warningBg,
    title: 'Connection Error',
    message:
      "We couldn't connect to our servers. Please check your internet connection and try again.",
    primaryAction: 'Try Again',
    showContactSupport: true,
  },
  daily_limit: {
    icon: 'alert-triangle',
    iconColor: colors.status.warning,
    iconBgColor: colors.status.warningBg,
    title: 'Daily Limit Reached',
    message:
      "You've reached your daily transfer limit. Your limit will reset at midnight, or you can request a temporary increase.",
    primaryAction: 'Request Limit Increase',
    secondaryAction: 'Set Reminder',
  },
  monthly_limit: {
    icon: 'calendar',
    iconColor: colors.status.warning,
    iconBgColor: colors.status.warningBg,
    title: 'Monthly Limit Reached',
    message:
      "You've reached your monthly transfer limit. Your limit will reset at the start of next month, or you can request a temporary increase.",
    primaryAction: 'Request Limit Increase',
    secondaryAction: 'Set Reminder',
  },
  per_transaction_limit: {
    icon: 'alert-triangle',
    iconColor: colors.status.warning,
    iconBgColor: colors.status.warningBg,
    title: 'Amount Too Large',
    message:
      'This amount exceeds your per-transaction limit. Please enter a smaller amount or contact support to increase your limit.',
    primaryAction: 'Try Different Amount',
    showContactSupport: true,
  },
  invalid_amount: {
    icon: 'x-circle',
    iconColor: colors.status.error,
    iconBgColor: colors.status.errorBg,
    title: 'Invalid Amount',
    message: 'Please enter a valid transfer amount greater than zero.',
    primaryAction: 'Try Again',
  },
  recipient_not_found: {
    icon: 'user',
    iconColor: colors.status.error,
    iconBgColor: colors.status.errorBg,
    title: 'Recipient Not Found',
    message:
      "We couldn't verify the recipient's account details. Please double-check the information and try again.",
    primaryAction: 'Edit Recipient',
    showContactSupport: true,
  },
  duplicate_transfer: {
    icon: 'alert-circle',
    iconColor: colors.status.warning,
    iconBgColor: colors.status.warningBg,
    title: 'Duplicate Transfer',
    message:
      'A similar transfer was made recently. To prevent accidental duplicates, please wait a few minutes before trying again.',
    primaryAction: 'View Recent Transfers',
    secondaryAction: 'Continue Anyway',
  },
  generic: {
    icon: 'x-circle',
    iconColor: colors.status.error,
    iconBgColor: colors.status.errorBg,
    title: 'Transfer Failed',
    message:
      'Something went wrong while processing your transfer. Please try again later.',
    primaryAction: 'Try Again',
    showContactSupport: true,
  },
};

export function TransferErrorScreen({ navigation, route }: Props) {
  const { errorType, errorMessage, transferContext } = route.params;
  const insets = useSafeAreaInsets();

  // Trigger error haptic on mount
  useEffect(() => {
    void errorHaptic();
  }, []);

  const config = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return ERROR_CONFIGS[errorType] ?? ERROR_CONFIGS.generic!;
  }, [errorType]);

  // We use reset() instead of goBack() because ProcessingScreen used replace() to get here,
  // so the nav stack is broken. Reset rebuilds a clean stack for proper back navigation.
  const navigateToAmountEntry = () => {
    if (transferContext?.recipient) {
      navigation.reset({
        index: 2,
        routes: [
          { name: 'Home' },
          { name: 'TransferHub' },
          {
            name: 'AmountEntry',
            params: { recipient: transferContext.recipient },
          },
        ],
      });
    } else {
      navigation.reset({
        index: 1,
        routes: [{ name: 'Home' }, { name: 'TransferHub' }],
      });
    }
  };

  const navigateToReview = () => {
    if (transferContext?.recipient && transferContext.amount) {
      navigation.reset({
        index: 3,
        routes: [
          { name: 'Home' },
          { name: 'TransferHub' },
          {
            name: 'AmountEntry',
            params: { recipient: transferContext.recipient },
          },
          {
            name: 'TransferReview',
            params: {
              recipient: transferContext.recipient,
              amount: transferContext.amount,
              note: transferContext.note,
            },
          },
        ],
      });
    } else {
      navigation.reset({
        index: 1,
        routes: [{ name: 'Home' }, { name: 'TransferHub' }],
      });
    }
  };

  const navigateToTransferHub = () => {
    navigation.reset({
      index: 1,
      routes: [{ name: 'Home' }, { name: 'TransferHub' }],
    });
  };

  const handlePrimaryAction = () => {
    switch (errorType) {
      case 'insufficient_funds':
      case 'per_transaction_limit':
      case 'invalid_amount':
        // Amount-related error - let user try different amount
        navigateToAmountEntry();
        break;
      case 'network_error':
      case 'generic':
        // Transient error - let user retry the same transfer
        navigateToReview();
        break;
      case 'daily_limit':
      case 'monthly_limit':
        // Limit reached - go to settings to view/request increase
        navigation.reset({
          index: 1,
          routes: [{ name: 'Home' }, { name: 'Settings' }],
        });
        break;
      case 'recipient_not_found':
        // Recipient error - let user select different recipient
        navigateToTransferHub();
        break;
      case 'duplicate_transfer':
        // Duplicate - show history so user can verify
        navigation.reset({
          index: 1,
          routes: [{ name: 'Home' }, { name: 'TransferHistory' }],
        });
        break;
      default:
        navigateToTransferHub();
    }
  };

  const handleSecondaryAction = () => {
    switch (errorType) {
      case 'insufficient_funds':
        // Show add funds flow (for demo, go home)
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
        break;
      case 'daily_limit':
      case 'monthly_limit':
        // Set reminder (for demo, go home)
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
        break;
      case 'duplicate_transfer':
        // Continue anyway - retry the transfer
        navigateToReview();
        break;
      default:
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
    }
  };

  const handleContactSupport = () => {
    // For demo, just go home
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  const handleGoHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.content}>
        {/* Error Icon */}
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: config.iconBgColor },
          ]}
        >
          <Icon name={config.icon} size={48} color={config.iconColor} />
        </View>

        {/* Error Title */}
        <Text variant="headlineSmall" color="primary" align="center">
          {config.title}
        </Text>

        {/* Error Message */}
        <Text
          variant="bodyMedium"
          color="secondary"
          align="center"
          style={styles.message}
        >
          {errorMessage ?? config.message}
        </Text>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <Button
            variant="primary"
            size="large"
            fullWidth
            onPress={handlePrimaryAction}
          >
            {config.primaryAction}
          </Button>

          {config.secondaryAction && (
            <Button
              variant="secondary"
              size="large"
              fullWidth
              onPress={handleSecondaryAction}
            >
              {config.secondaryAction}
            </Button>
          )}
        </View>

        {/* Contact Support */}
        {config.showContactSupport && (
          <Button
            variant="ghost"
            size="medium"
            onPress={handleContactSupport}
            leftIcon={
              <Icon
                name="message-circle"
                size={18}
                color={palette.primary.main}
              />
            }
          >
            Contact Support
          </Button>
        )}
      </View>

      {/* Bottom Button */}
      <View
        style={[styles.bottomContainer, { paddingBottom: insets.bottom + 16 }]}
      >
        <Button variant="ghost" size="large" fullWidth onPress={handleGoHome}>
          Back to Home
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
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[6],
    gap: spacing[4],
  },
  iconContainer: {
    width: componentSizes.icon.xlarge,
    height: componentSizes.icon.xlarge,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[2],
  },
  message: {
    maxWidth: 300,
    lineHeight: 22,
  },
  actionsContainer: {
    width: '100%',
    gap: spacing[3],
    marginTop: spacing[4],
  },
  bottomContainer: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
  },
});

export default TransferErrorScreen;
