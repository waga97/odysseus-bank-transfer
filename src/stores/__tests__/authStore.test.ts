/**
 * Auth Store Tests
 * Testing user authentication state
 */

import { useAuthStore } from '../authStore';
import type { User, BiometricStatus } from '@types';

// Mock user for testing
const mockUser: User = {
  id: 'user-001',
  name: 'Test User',
  email: 'test@example.com',
  phone: '+60123456789',
};

// Reset store before each test
beforeEach(() => {
  useAuthStore.setState({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    biometricStatus: null,
    preferredBiometricType: null,
  });
});

describe('authStore user management', () => {
  it('starts with no user and unauthenticated', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('setUser authenticates and sets user', () => {
    const { setUser } = useAuthStore.getState();

    setUser(mockUser);

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
    expect(state.isLoading).toBe(false);
  });

  it('clearUser removes user and deauthenticates', () => {
    const { setUser, clearUser } = useAuthStore.getState();

    setUser(mockUser);
    clearUser();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(false);
  });
});

describe('authStore biometric status', () => {
  it('sets biometric status and preferred type', () => {
    const { setBiometricStatus } = useAuthStore.getState();

    const status: BiometricStatus = {
      isAvailable: true,
      isEnrolled: true,
      supportedTypes: ['faceid', 'fingerprint'],
      preferredType: 'faceid',
    };

    setBiometricStatus(status);

    const state = useAuthStore.getState();
    expect(state.biometricStatus).toEqual(status);
    expect(state.preferredBiometricType).toBe('faceid');
  });

  it('falls back to first supported type when no preferred type', () => {
    const { setBiometricStatus } = useAuthStore.getState();

    const status: BiometricStatus = {
      isAvailable: true,
      isEnrolled: true,
      supportedTypes: ['fingerprint'],
    };

    setBiometricStatus(status);

    const state = useAuthStore.getState();
    expect(state.preferredBiometricType).toBe('fingerprint');
  });

  it('setPreferredBiometricType updates preferred type', () => {
    const { setPreferredBiometricType } = useAuthStore.getState();

    setPreferredBiometricType('fingerprint');

    const state = useAuthStore.getState();
    expect(state.preferredBiometricType).toBe('fingerprint');
  });
});

describe('authStore loading state', () => {
  it('setLoading updates loading state', () => {
    const { setLoading } = useAuthStore.getState();

    expect(useAuthStore.getState().isLoading).toBe(true);

    setLoading(false);
    expect(useAuthStore.getState().isLoading).toBe(false);

    setLoading(true);
    expect(useAuthStore.getState().isLoading).toBe(true);
  });
});
