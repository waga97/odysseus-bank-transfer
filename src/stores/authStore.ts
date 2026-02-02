import { create } from 'zustand';
import type { User, BiometricStatus, BiometricType } from '@types';

interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  biometricStatus: BiometricStatus | null;
  preferredBiometricType: BiometricType | null;

  // Actions
  setUser: (user: User) => void;
  clearUser: () => void;
  setBiometricStatus: (status: BiometricStatus) => void;
  setPreferredBiometricType: (type: BiometricType) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  isLoading: true,
  biometricStatus: null,
  preferredBiometricType: null,

  // Actions
  setUser: (user) =>
    set({
      user,
      isAuthenticated: true,
      isLoading: false,
    }),

  clearUser: () =>
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    }),

  setBiometricStatus: (status) =>
    set({
      biometricStatus: status,
      preferredBiometricType:
        status.preferredType ?? status.supportedTypes[0] ?? null,
    }),

  setPreferredBiometricType: (type) =>
    set({
      preferredBiometricType: type,
    }),

  setLoading: (loading) =>
    set({
      isLoading: loading,
    }),
}));

export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () =>
  useAuthStore((state) => state.isAuthenticated);
export const useBiometricStatus = () =>
  useAuthStore((state) => state.biometricStatus);
export const usePreferredBiometricType = () =>
  useAuthStore((state) => state.preferredBiometricType);
