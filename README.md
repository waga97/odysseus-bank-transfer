# Odysseus Bank

Payment transfer module with biometric auth for Odysseus Bank mobile app.

## Overview

Handles the full P2P transfer flow - pick recipient, enter amount, validate limits, authenticate with biometrics, process the transaction. Built with React Native + Expo for iOS and Android.

## Demo

[![Demo Video](https://img.youtube.com/vi/YcKS5emzYGw/maxresdefault.jpg)](https://www.youtube.com/watch?v=YcKS5emzYGw)

## Table of Contents

- [Demo](#demo)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Architecture Decisions](#architecture-decisions)
- [Testing](#testing)
- [Linting & Formatting](#linting--formatting)
- [Configuration](#configuration)
- [Simulating Different Scenarios](#simulating-different-scenarios)
- [Challenges & Retrospective](#challenges--retrospective)
- [Known Limitations](#known-limitations)
- [Troubleshooting](#troubleshooting)
- [Scripts Reference](#scripts-reference)

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

### Native Build (Recommended)

For testing with iOS Simulator biometrics or if you need custom native modules:

```bash
npx expo prebuild
npx expo run:ios --device    # iOS
npx expo run:android --device # Android
```

## Project Structure

```
src/
├── components/ui/       # Shared UI (Button, Input, Avatar, etc)
├── features/            # Screen modules by feature
│   ├── home/            # Dashboard, balance, quick actions
│   ├── transfer/        # Transfer hub, recipient selection
│   ├── bank-selection/  # Bank picker
│   ├── recipient/       # Manual account entry
│   ├── contacts/        # DuitNow contact picker
│   ├── amount/          # Amount entry + limit validation
│   ├── review/          # Confirm screen
│   ├── biometric/       # Auth screen
│   ├── processing/      # Processing with retry
│   ├── success/         # Success + receipt sharing
│   ├── error/           # Error handling
│   ├── history/         # Transaction history
│   └── settings/        # Settings + limits display
├── navigation/          # React Navigation setup
├── stores/              # Zustand stores
├── services/
│   ├── api/             # API client (ready for real backend)
│   └── mocks/           # Mock API with delays and failures
├── hooks/               # Custom hooks
├── utils/               # Helpers (currency, validation, retry)
├── theme/               # Design tokens
├── types/               # TypeScript types
└── config/              # App config
```

## Architecture Decisions

### Feature-Based Structure

Each feature is self-contained with its own screen components. Shared UI lives in `components/ui/`. This keeps features isolated and makes it easy to find related code.

### Config as Single Source of Truth

Everything configurable lives in `src/config/app.ts` - mock data, limits, delays, feature flags. Both the mock API and validation logic read from here so they stay in sync.

### Mock-First Development

App runs on mock data via `services/mocks/`. Simulates network delays, random failures, different account states. To swap to real backend later, just update the API imports.

### Transfer Validation

All validation is in `utils/validateTransfer.ts`. Used by both UI (immediate feedback) and mock API (server-side check). Keeps them from drifting apart.

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

### Biometric Flow

Uses `expo-local-authentication`:

1. Try biometric first (Face ID / Touch ID / Fingerprint)
2. OS handles fallback to device passcode
3. Can retry if cancelled
4. Works gracefully when biometrics unavailable

### State Management

Zustand with 3 stores:

- `authStore` - login state, biometric prefs
- `accountStore` - accounts, recipients, transactions, limits
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

- Transfer validation (25+ cases)
- Currency formatting
- Mock API behavior
- Store state
- Retry logic

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

## Challenges & Retrospective

### Challenges

**Navigation after errors** - When transfer fails during processing, user needs to go back and retry. But ProcessingScreen uses `replace()` to get to error screen, which breaks the back stack. Had to use `reset()` to rebuild a clean nav stack.

**Keeping validation DRY** - Validation needed to work in both UI (immediate feedback) and mock API (server-side). Ended up extracting everything to `utils/validateTransfer.ts` so both use the same logic.

**Recent recipients** - First tried storing as separate list but it kept getting out of sync with transaction history. Refactored to just derive it from transactions in the selector. Way simpler.

### What went well

- Config-driven testing made it easy to test different scenarios
- Error recovery UX with exponential backoff works nicely
- First time using expo-local-authentication, was easier than expected
- Unit tests on validateTransfer caught edge cases early

### What I'd do differently

- Maybe group utils closer to the features that use them instead of flat folder
- Spent too much time on UI polish, should've done E2E testing instead

### If I had more time

- E2E tests with Detox or Maestro
- Proper HTTP status codes for real API
- Offline queue with background sync
- Transfer templates / scheduled transfers
- Favourite recipients
- PDF receipts

## Known Limitations

- No real API integration - mock only
- No push notifications
- Receipt sharing uses native share sheet
- Tests exclude type-checking (tsconfig excludes test dirs)

## Troubleshooting

**iOS Simulator biometrics:**
Features > Face ID > Enrolled, then Features > Face ID > Matching Face when prompted.

**Android Emulator fingerprint:**
Extended Controls > Fingerprint > Touch Sensor.

**Pod install fails:**
Delete `ios/Pods` and `ios/Podfile.lock`, run `pod install` again.

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
