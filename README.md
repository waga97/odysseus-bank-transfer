# Odysseus Bank

Payment Transfer Module with Biometric Authentication for the Odysseus Bank mobile app.

## Overview

This module handles the complete P2P money transfer flow, including recipient selection, amount entry, transfer limits validation, biometric authentication, and transaction processing. Built with React Native + Expo, targeting both iOS and Android.

## Tech Stack

- **React Native 0.81** + **Expo 54** - (managed workflow)
- **TypeScript**
- **React Navigation 6**
- **Zustand** - (state management)
- **expo-local-authentication** - (Face ID / Touch ID / Fingerprint)
- **expo-contacts** - (Contact picker)
- **Jest** - (+ React Native Testing Library for unit tests)

## Prerequisites

- Node.js 18+
- Xcode 15+ (iOS development)
- Android Studio (Android development)
- CocoaPods (iOS native dependencies)
- Physical device recommended for biometric testing

## Getting Started

### Install dependencies

```bash
npm install
```

### Run the app

```bash
npx expo start
```

Scan the QR code with Expo Go (iOS/Android) or press `i` for iOS simulator / `a` for Android emulator.

### Native Build (Optional)

For testing with iOS Simulator biometrics or if you need custom native modules:

```bash
npx expo prebuild
npx expo run:ios --device    # iOS
npx expo run:android --device # Android
```

## Project Structure

```
src/
├── components/ui/       # Reusable UI components (Button, Input, Avatar, etc.)
├── features/            # Feature-based screen modules
│   ├── home/            # Dashboard with balance, quick actions
│   ├── transfer/        # Transfer hub (recipient selection)
│   ├── bank-selection/  # Bank picker for inter-bank transfers
│   ├── recipient/       # Manual account entry
│   ├── contacts/        # DuitNow contact picker
│   ├── amount/          # Amount entry with limit validation
│   ├── review/          # Transfer confirmation
│   ├── biometric/       # Auth screen (biometric with device passcode fallback)
│   ├── processing/      # Transaction processing with retry logic
│   ├── success/         # Success screen with receipt sharing
│   ├── error/           # Error handling with user-friendly messages
│   ├── history/         # Paginated transaction history
│   └── settings/        # App settings and limits display
├── navigation/          # React Navigation config
├── stores/              # Zustand stores (auth, account, transfer)
├── services/
│   ├── api/             # API client setup (ready for real backend)
│   └── mocks/           # Mock API with configurable delays and failures
├── hooks/               # Custom React hooks (network status, animations)
├── utils/               # Helper functions (currency, validation, retry)
├── theme/               # Design tokens (colors, typography, spacing)
├── types/               # TypeScript interfaces and types
└── config/              # Centralized app configuration
```

## Architecture Decisions

### Feature-Based Structure

Each feature is self-contained with its own screen components. Shared UI lives in `components/ui/`. This keeps features isolated and makes it easy to find related code.

### Single Source of Truth for Configuration

All configurable values live in `src/config/app.ts`. This includes mock data, transfer limits, API delays, validation thresholds, and feature flags. The mock API and validation logic pull from this config, ensuring consistency across the app.

### Mock-First Development

The app runs entirely on mock data via `services/mocks/`. The mock API simulates network delays, random failures, and can return different account states for testing. To swap to a real backend, update the imports in the API endpoints.

### Transfer Validation

All transfer validation logic lives in `utils/validateTransfer.ts` - single source of truth used by both the mock API and UI. This prevents validation drift between frontend and backend.

Validation checks:

- Sufficient balance (hard block)
- Per-transaction limit (hard block)
- Daily limit remaining (hard block, with configurable warning threshold)
- Monthly limit remaining (hard block, with configurable warning threshold)

### Error Handling

Errors are mapped to user-friendly messages in the error screen. The app includes:

- Automatic retry with exponential backoff for transient network failures
- Specific error screens for each error type (insufficient funds, daily/monthly limits, network error, invalid account)
- Network error handling with retry logic

### Biometric Auth Flow

The BiometricAuthScreen uses the device's native authentication via `expo-local-authentication`:

1. Primary biometric (Face ID / Touch ID / Fingerprint)
2. Automatic fallback to device passcode handled by the OS
3. Retry option if authentication is cancelled
4. Graceful handling when biometrics are not available

The authentication flow leverages `LocalAuthentication.authenticateAsync()` with `disableDeviceFallback: false`, allowing the OS to handle the complete fallback chain (Face ID → Touch ID → Device Passcode) natively.

### State Management

Using Zustand for its simplicity. Three stores:

- `authStore` - user auth state, biometric preferences
- `accountStore` - accounts, recipients, transactions, transfer limits
- `transferStore` - current transfer in progress

Optimized with:

- Computed selectors for derived state (recent recipients)
- Shallow equality comparisons to prevent unnecessary re-renders
- Memoized action selectors

### Performance Optimizations

- `React.memo` on frequently rendered components (Button)
- `useMemo` for filtered/computed arrays
- Paginated transaction history (5 per page)
- FlatList with proper virtualization settings
- Skeleton loading states instead of spinners

### Accessibility

Interactive components include:

- `accessibilityRole` for semantic meaning
- `accessibilityLabel` for screen readers
- `accessibilityState` for disabled/loading states
- `accessibilityHint` for additional context

### Design Token System

All visual constants are centralized:

- `theme/colors.ts` - semantic color palette
- `theme/typography.ts` - font sizes and weights
- `theme/spacing.ts` - consistent spacing scale
- `theme/componentSizes.ts` - icon sizes, touch targets, etc.

This makes global design changes easy and keeps the UI consistent.

## Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

Tests cover:

- Transfer validation logic (25+ test cases)
- Currency formatting
- Mock API behavior (limits, transactions, error scenarios)
- Store state management (auth, accounts)
- Retry utility with exponential backoff

### Manual Testing

For manual testing flows including happy paths, error scenarios, and how to trigger each error type, see **[TESTCASES.md](./TESTCASES.md)**.

The test cases document includes:

- Step-by-step flows for all transfer scenarios
- How to trigger each error type (insufficient funds, limits, network errors)
- Test account numbers for specific behaviors
- Configuration tips for testing different states

## Linting & Formatting

```bash
# Lint check
npm run lint

# Auto-fix lint issues
npm run lint:fix

# Format code
npm run format

# Type check
npm run type-check
```

Pre-commit hooks run lint and prettier automatically via husky + lint-staged.

## Configuration

All app settings are centralized in `src/config/app.ts`:

```typescript
{
  loadingDelay: 800,                    // Simulated API delay (ms)

  mockBalances: {
    current: 73566.75,                  // Default account balance
    savings: 10000.0,
  },

  transferLimits: {
    daily: { limit: 10000, used: 2000 },
    monthly: { limit: 20000, used: 15000 },
    perTransaction: 6000,
  },

  mockApi: {
    networkFailureRate: 0.05,           // 5% chance of network error
    transferDelay: 1500,                // Transfer processing time (ms)
  },

  validation: {
    limitWarningThreshold: 0.8,         // Warn at 80% of limit
  },

  features: {
    enableHaptics: true,
    enableBiometrics: true,
    enableOfflineMode: true,
  },
}
```

Changing these values affects the whole app - no rebuild needed for config tweaks.

## Simulating Different Scenarios

| Scenario          | How to Trigger                                                |
| ----------------- | ------------------------------------------------------------- |
| Low balance       | Change `mockBalances.current` in config                       |
| Near daily limit  | Set `transferLimits.daily.used` close to `limit`              |
| Biometric failure | Use simulator with no Face ID enrolled, or cancel auth prompt |
| Network error     | Set `mockApi.networkFailureRate` to `1.0` for 100% failure    |
| Invalid account   | Use account number `111122223333`                             |

See [TESTCASES.md](./TESTCASES.md) for complete testing guide.

## Known Limitations

- No real API integration - mock only
- No push notifications
- Receipt sharing uses native share sheet
- Tests exclude type-checking (tsconfig excludes test dirs)

## Troubleshooting

**iOS Simulator biometrics:**
Go to Features > Face ID > Enrolled, then Features > Face ID > Matching Face when prompted.

**Android Emulator fingerprint:**
Use Extended Controls > Fingerprint > Touch Sensor.

**Pod install fails:**
Delete `ios/Pods` and `ios/Podfile.lock`, then run `pod install` again.

## Scripts Reference

| Command              | Description                    |
| -------------------- | ------------------------------ |
| `npm start`          | Start Expo dev server          |
| `npm run ios`        | Run on iOS device/simulator    |
| `npm run android`    | Run on Android device/emulator |
| `npm test`           | Run Jest tests                 |
| `npm run lint`       | ESLint check                   |
| `npm run type-check` | TypeScript check               |
| `npm run format`     | Prettier format                |

---

Last updated: Feb 2, 2026
Author : Arshad
