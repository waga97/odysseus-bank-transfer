import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, StatusBar, Animated, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as LocalAuthentication from 'expo-local-authentication';
import { Text, Icon, Button, ScreenHeader } from '@components/ui';
import { colors, palette } from '@theme/colors';
import { spacing } from '@theme/spacing';
import { borderRadius } from '@theme/borderRadius';
import type { RootStackScreenProps } from '@navigation/types';
import { formatCurrency } from '@utils/currency';
import { useShakeAnimation } from '@hooks/useShakeAnimation';
import { usePulseAnimation } from '@hooks/usePulseAnimation';

type Props = RootStackScreenProps<'BiometricAuth'>;

type AuthState = 'idle' | 'authenticating' | 'success' | 'failed' | 'cancelled';
type BiometricType = 'faceid' | 'fingerprint' | 'passcode';

export function BiometricAuthScreen({ navigation, route }: Props) {
  const { recipient, amount, note } = route.params;
  const insets = useSafeAreaInsets();

  const [authState, setAuthState] = useState<AuthState>('idle');
  const [biometricType, setBiometricType] = useState<BiometricType>('passcode');

  // Animation hooks
  const { shakeAnim, shake } = useShakeAnimation();
  const pulseAnim = usePulseAnimation({
    active: authState === 'authenticating',
  });

  // Check biometric type on mount
  useEffect(() => {
    void checkBiometricType();
  }, []);

  // Start authentication automatically when biometric type is determined
  useEffect(() => {
    if (authState === 'idle') {
      void authenticate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [biometricType]);

  const checkBiometricType = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();

      if (compatible && enrolled) {
        const types =
          await LocalAuthentication.supportedAuthenticationTypesAsync();
        if (
          types.includes(
            LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
          )
        ) {
          setBiometricType('faceid');
        } else if (
          types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)
        ) {
          setBiometricType('fingerprint');
        } else {
          setBiometricType('passcode');
        }
      } else {
        setBiometricType('passcode');
      }
    } catch {
      setBiometricType('passcode');
    }
  };

  const navigateToProcessing = useCallback(() => {
    navigation.replace('TransferProcessing', {
      transferId: `txn-${Date.now()}`,
      recipient,
      amount,
      note,
    });
  }, [navigation, recipient, amount, note]);

  const authenticate = async () => {
    setAuthState('authenticating');

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: `Authorize transfer of ${formatCurrency(amount)}`,
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
        fallbackLabel: 'Use Passcode',
      });

      if (result.success) {
        setAuthState('success');
        setTimeout(navigateToProcessing, 500);
      } else if (result.error === 'user_cancel') {
        setAuthState('cancelled');
      } else {
        setAuthState('failed');
        shake();
      }
    } catch {
      setAuthState('failed');
      shake();
    }
  };

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleRetry = useCallback(() => {
    setAuthState('idle');
    void authenticate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getBiometricIcon = () => {
    switch (biometricType) {
      case 'faceid':
        return 'eye';
      case 'fingerprint':
        return 'shield';
      default:
        return 'lock';
    }
  };

  const getBiometricLabel = () => {
    switch (biometricType) {
      case 'faceid':
        return Platform.OS === 'ios' ? 'Face ID' : 'Face Recognition';
      case 'fingerprint':
        return Platform.OS === 'ios' ? 'Touch ID' : 'Fingerprint';
      default:
        return 'Passcode';
    }
  };

  const getStatusMessage = () => {
    switch (authState) {
      case 'authenticating':
        return `Verifying with ${getBiometricLabel()}...`;
      case 'success':
        return 'Verified!';
      case 'failed':
        return 'Verification failed. Please try again.';
      case 'cancelled':
        return 'Authentication cancelled';
      default:
        return `Use ${getBiometricLabel()} to authorize`;
    }
  };

  const formattedAmount = formatCurrency(amount);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />
      <ScreenHeader title="Authorize Transfer" onBack={handleBack} />

      <View style={styles.content}>
        {/* Amount Display */}
        <View style={styles.amountContainer}>
          <Text style={styles.labelText}>You are sending</Text>
          <Text style={styles.amountText}>{formattedAmount}</Text>
          <Text style={styles.labelText}>to {recipient.name}</Text>
        </View>

        {/* Biometric Icon */}
        <Animated.View
          style={[
            styles.biometricIconContainer,
            { transform: [{ scale: pulseAnim }, { translateX: shakeAnim }] },
            authState === 'success' && styles.biometricIconSuccess,
            authState === 'failed' && styles.biometricIconFailed,
          ]}
        >
          <Icon
            name={authState === 'success' ? 'check' : getBiometricIcon()}
            size={48}
            color={
              authState === 'success'
                ? palette.success.main
                : authState === 'failed'
                  ? palette.error.main
                  : palette.accent.main
            }
          />
        </Animated.View>

        {/* Status Message */}
        <Text
          style={[
            styles.statusText,
            authState === 'failed' && styles.statusTextError,
          ]}
        >
          {getStatusMessage()}
        </Text>

        {/* Retry Button */}
        {(authState === 'failed' || authState === 'cancelled') && (
          <Button
            variant="secondary"
            size="medium"
            onPress={handleRetry}
            style={styles.retryButton}
          >
            Try Again
          </Button>
        )}
      </View>

      {/* Cancel Button */}
      <View
        style={[styles.bottomContainer, { paddingBottom: insets.bottom + 16 }]}
      >
        <Button variant="ghost" size="large" fullWidth onPress={handleBack}>
          Cancel
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
    gap: spacing[6],
  },
  amountContainer: {
    alignItems: 'center',
    gap: spacing[1],
  },
  labelText: {
    fontSize: 14,
    color: colors.text.tertiary,
  },
  amountText: {
    fontSize: 40,
    fontWeight: '700',
    color: colors.text.primary,
    lineHeight: 48,
    marginVertical: spacing[2],
  },
  biometricIconContainer: {
    width: 120,
    height: 120,
    borderRadius: borderRadius.full,
    backgroundColor: colors.accent.bg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: palette.accent.main,
  },
  biometricIconSuccess: {
    backgroundColor: palette.success.light,
    borderColor: palette.success.main,
  },
  biometricIconFailed: {
    backgroundColor: palette.error.light,
    borderColor: palette.error.main,
  },
  statusText: {
    fontSize: 15,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  statusTextError: {
    color: palette.error.main,
  },
  retryButton: {
    marginTop: spacing[2],
  },
  bottomContainer: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
  },
});

export default BiometricAuthScreen;
