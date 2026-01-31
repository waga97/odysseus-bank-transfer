/**
 * Odysseus Bank - Biometric Authentication Screen
 * Face ID / Fingerprint / PIN fallback for transaction authorization
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  StatusBar,
  Animated,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as LocalAuthentication from 'expo-local-authentication';
import {
  Text,
  Icon,
  Button,
  ScreenHeader,
  PinKeypad,
  PinDots,
} from '@components/ui';
import { colors, palette } from '@theme/colors';
import { spacing } from '@theme/spacing';
import { borderRadius } from '@theme/borderRadius';
import type { RootStackScreenProps } from '@navigation/types';
import { formatCurrency } from '@utils/currency';
import { appConfig } from '@config/app';
import { lightHaptic, errorHaptic, successHaptic } from '@utils/haptics';
import { useAuthStore } from '@stores/authStore';
import { useShakeAnimation } from '@hooks/useShakeAnimation';
import { usePulseAnimation } from '@hooks/usePulseAnimation';

type Props = RootStackScreenProps<'BiometricAuth'>;

type AuthState = 'idle' | 'authenticating' | 'success' | 'failed' | 'cancelled';
type BiometricType = 'faceid' | 'fingerprint' | 'none';

export function BiometricAuthScreen({ navigation, route }: Props) {
  const { recipient, amount, note } = route.params;
  const insets = useSafeAreaInsets();

  // Check if biometric is enabled in settings
  const biometricAuthEnabled = useAuthStore(
    (state) => state.biometricAuthEnabled
  );

  const [authState, setAuthState] = useState<AuthState>('idle');
  const [biometricType, setBiometricType] = useState<BiometricType>('none');
  const [showPinFallback, setShowPinFallback] = useState(!biometricAuthEnabled);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);

  // Animation hooks
  const { shakeAnim, shake } = useShakeAnimation();
  const pulseAnim = usePulseAnimation({
    active: authState === 'authenticating',
  });

  // Check biometric availability on mount
  useEffect(() => {
    void checkBiometricType();
  }, []);

  // Start authentication automatically
  useEffect(() => {
    if (biometricType !== 'none' && authState === 'idle') {
      void authenticate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [biometricType]);

  const checkBiometricType = async () => {
    // If biometric is disabled in settings, use PIN
    if (!biometricAuthEnabled) {
      setBiometricType('none');
      setShowPinFallback(true);
      return;
    }

    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      if (!compatible) {
        setBiometricType('none');
        setShowPinFallback(true);
        return;
      }

      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (!enrolled) {
        setBiometricType('none');
        setShowPinFallback(true);
        return;
      }

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
        setBiometricType('none');
        setShowPinFallback(true);
      }
    } catch {
      setBiometricType('none');
      setShowPinFallback(true);
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
      setShowPinFallback(true);
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

  const handlePinDigit = useCallback(
    (digit: string) => {
      if (pinError) {
        setPinError(false);
      }

      if (pin.length < 6) {
        void lightHaptic();
        const newPin = pin + digit;
        setPin(newPin);

        if (newPin.length === 6) {
          setTimeout(() => {
            if (newPin === appConfig.pinCode) {
              void successHaptic();
              setAuthState('success');
              setTimeout(navigateToProcessing, 500);
            } else {
              void errorHaptic();
              setPinError(true);
              shake();
              setTimeout(() => setPin(''), 300);
            }
          }, 300);
        }
      }
    },
    [pin, pinError, shake, navigateToProcessing]
  );

  const handlePinDelete = useCallback(() => {
    setPin((prev) => prev.slice(0, -1));
  }, []);

  const handleUseBiometric = useCallback(() => {
    setShowPinFallback(false);
    setPin('');
    void authenticate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getBiometricIcon = () =>
    biometricType === 'faceid' ? 'eye' : 'shield';

  const getBiometricLabel = () => {
    if (biometricType === 'faceid') {
      return Platform.OS === 'ios' ? 'Face ID' : 'Face Recognition';
    }
    return Platform.OS === 'ios' ? 'Touch ID' : 'Fingerprint';
  };

  const getStatusMessage = () => {
    switch (authState) {
      case 'authenticating':
        return `Verifying ${getBiometricLabel()}...`;
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

  // PIN Input UI
  if (showPinFallback) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar barStyle="dark-content" />
        <ScreenHeader title="Enter PIN" onBack={handleBack} />

        <View style={styles.pinContent}>
          {/* Amount Display */}
          <View style={styles.amountContainer}>
            <Text style={styles.labelText}>Authorize transfer of</Text>
            <Text style={styles.pinAmountText}>{formattedAmount}</Text>
            <Text style={styles.labelText}>to {recipient.name}</Text>
          </View>

          {/* PIN Dots */}
          <View style={styles.pinDotsWrapper}>
            <PinDots
              filledCount={pin.length}
              error={pinError}
              shakeAnimation={shakeAnim}
            />
          </View>

          {/* Error Message */}
          {pinError && (
            <Text style={styles.pinErrorText}>
              Incorrect PIN. Please try again.
            </Text>
          )}

          {/* Use Biometric Option - only show if enabled in settings */}
          {biometricAuthEnabled && biometricType !== 'none' && (
            <Pressable
              style={styles.useBiometricButton}
              onPress={handleUseBiometric}
            >
              <Icon
                name={getBiometricIcon()}
                size={20}
                color={palette.accent.main}
              />
              <Text style={styles.biometricButtonText}>
                Use {getBiometricLabel()} instead
              </Text>
            </Pressable>
          )}

          {/* PIN Keypad */}
          <View style={styles.keypadWrapper}>
            <PinKeypad
              onDigitPress={handlePinDigit}
              onDeletePress={handlePinDelete}
            />
          </View>
        </View>
      </View>
    );
  }

  // Biometric Auth UI
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
        {authState === 'failed' && (
          <Button
            variant="secondary"
            size="medium"
            onPress={handleRetry}
            style={styles.retryButton}
          >
            Try Again
          </Button>
        )}

        {/* Use PIN Option */}
        <Pressable
          style={styles.usePinButton}
          onPress={() => setShowPinFallback(true)}
        >
          <Text style={styles.usePinText}>Use PIN instead</Text>
        </Pressable>
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
  usePinButton: {
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
  },
  usePinText: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.accent.main,
  },
  bottomContainer: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
  },
  // PIN styles
  pinContent: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: spacing[6],
    paddingTop: spacing[8],
  },
  pinAmountText: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text.primary,
    lineHeight: 40,
    marginVertical: spacing[1],
  },
  pinDotsWrapper: {
    marginTop: spacing[8],
    marginBottom: spacing[4],
  },
  pinErrorText: {
    fontSize: 14,
    color: palette.error.main,
    marginTop: spacing[2],
    textAlign: 'center',
  },
  useBiometricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    paddingVertical: spacing[3],
    marginBottom: spacing[4],
  },
  biometricButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.accent.main,
  },
  keypadWrapper: {
    marginTop: 'auto',
    marginBottom: spacing[4],
    alignItems: 'center',
  },
});

export default BiometricAuthScreen;
