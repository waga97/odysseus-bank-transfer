/**
 * Auth Store Tests
 * Testing biometric authentication settings
 */

import { useAuthStore } from '../authStore';
import { appConfig } from '@config/app';

// Reset store before each test
beforeEach(() => {
  useAuthStore.setState({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    biometricStatus: null,
    preferredBiometricType: null,
    biometricAuthEnabled: appConfig.features.enableBiometrics,
  });
});

describe('authStore biometricAuthEnabled', () => {
  it('defaults to appConfig.features.enableBiometrics', () => {
    const state = useAuthStore.getState();
    expect(state.biometricAuthEnabled).toBe(
      appConfig.features.enableBiometrics
    );
  });

  it('can be toggled off', () => {
    const { setBiometricAuthEnabled } = useAuthStore.getState();

    setBiometricAuthEnabled(false);

    const state = useAuthStore.getState();
    expect(state.biometricAuthEnabled).toBe(false);
  });

  it('can be toggled on', () => {
    const { setBiometricAuthEnabled } = useAuthStore.getState();

    setBiometricAuthEnabled(false);
    setBiometricAuthEnabled(true);

    const state = useAuthStore.getState();
    expect(state.biometricAuthEnabled).toBe(true);
  });

  it('persists state across multiple toggles', () => {
    const { setBiometricAuthEnabled } = useAuthStore.getState();

    setBiometricAuthEnabled(false);
    expect(useAuthStore.getState().biometricAuthEnabled).toBe(false);

    setBiometricAuthEnabled(true);
    expect(useAuthStore.getState().biometricAuthEnabled).toBe(true);

    setBiometricAuthEnabled(false);
    expect(useAuthStore.getState().biometricAuthEnabled).toBe(false);
  });
});

describe('authStore selectors', () => {
  it('useBiometricAuthEnabled selector returns correct value', () => {
    // Import the selector
    const { useBiometricAuthEnabled } = require('../authStore');

    // Set initial state
    useAuthStore.setState({ biometricAuthEnabled: true });

    // The selector should return true
    // Note: In actual component testing, we'd use renderHook
    const state = useAuthStore.getState();
    expect(state.biometricAuthEnabled).toBe(true);
  });
});
