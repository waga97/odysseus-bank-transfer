# Odysseus Bank

Payment Transfer Module with Biometric Authentication for the Odysseus Bank mobile app.

## Overview

This module handles the complete P2P money transfer flow, including recipient selection, amount entry, transfer limits validation, biometric authentication (with PIN fallback), and transaction processing. Built with React Native + Expo, targeting both iOS and Android.

## Tech Stack

- **React Native 0.81** + **Expo 54** (managed workflow with dev client)
- **TypeScript** with strict mode enabled
- **React Navigation 6** - native stack for performant transitions
- **Zustand** - lightweight state management
- **expo-local-authentication** - Face ID / Touch ID / Fingerprint
- **expo-contacts** - DuitNow contact-based transfers
- **Jest** + React Native Testing Library for unit tests

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

### Development Build (Recommended)

Biometrics require a dev build - they wont work in Expo Go due to permission limitations.

**iOS:**

```bash
npx expo prebuild
cd ios && pod install && cd ..
npx expo run:ios --device
```

**Android:**

```bash
npx expo prebuild
npx expo run:android --device
```

Then start the dev server:

```bash
npx expo start --dev-client
```

### Quick Start (Expo Go)

For UI development without biometrics:

```bash
npx expo start
```

Note: Biometric auth will fail in Expo Go. The app will automatically fall back to PIN entry (default: `123456`).

## Project Structure

```
src/
├── components/ui/       # Reusable UI components (Button, Text, Avatar, etc.)
├── features/            # Feature-based screen modules
│   ├── home/            # Dashboard with balance, quick actions
│   ├── transfer/        # Transfer hub (recipient selection)
│   ├── bank-selection/  # Bank picker for inter-bank transfers
│   ├── recipient/       # Manual account entry
│   ├── contacts/        # DuitNow contact picker
│   ├── amount/          # Amount entry with limit validation
│   ├── review/          # Transfer confirmation
│   ├── biometric/       # Auth screen (biometric + PIN fallback)
│   ├── processing/      # Transaction processing animation
│   ├── success/         # Success screen with receipt sharing
│   ├── error/           # Error handling and retry
│   ├── history/         # Transaction history list
│   └── settings/        # App settings and limits display
├── navigation/          # React Navigation config
├── stores/              # Zustand stores (auth, account, transfer)
├── services/
│   ├── api/             # API client setup (ready for real backend)
│   └── mocks/           # Mock API with realistic delays
├── hooks/               # Custom React hooks
├── utils/               # Helper functions (currency, validation, etc.)
├── theme/               # Design tokens (colors, typography, spacing)
├── types/               # TypeScript interfaces and types
└── config/              # App configuration and feature flags
```

## Architecture Decisions

### Feature-Based Structure

Each feature is self-contained with its own screen components. Shared UI lives in `components/ui/`. This keeps features isolated and makes it easy to find related code.

### Mock-First Development

The app runs entirely on mock data via `services/mocks/`. The mock API simulates network delays and can return different account states for testing. To swap to a real backend, just update the imports in the stores.

### Transfer Validation

All transfer validation logic lives in `utils/validateTransfer.ts` - single source of truth used by both the mock API and UI. This prevents validation drift between frontend and backend.

Validation checks:

- Sufficient balance (hard block)
- Per-transaction limit (hard block)
- Daily limit remaining (hard block, with 80% warning)
- Monthly limit remaining (hard block, with 80% warning)

### Biometric Auth Flow

The BiometricAuthScreen handles multiple auth scenarios:

1. Primary biometric (Face ID / Touch ID / Fingerprint)
2. Fallback to 6-digit PIN after biometric failure
3. Retry mechanisms with attempt counting
4. Device biometric not available gracefully falls back to PIN

The PIN is configurable in `src/config/app.ts` (default: `123456`).

### State Management

Using Zustand for its simplicity. Three stores:

- `authStore` - biometric enrollment status
- `accountStore` - balance, accounts, transfer limits
- `transferStore` - current transfer in progress

Stores are intentionally simple - no complex selectors or middleware.

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

- Transfer validation logic
- Currency formatting
- Mock API behavior

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

App settings are in `src/config/app.ts`:

```typescript
{
  loadingDelay: 800,        // Simulated API delay (ms)
  pinCode: '123456',        // Fallback PIN
  transferLimits: {
    daily: { limit: 10000, used: 2000 },
    monthly: { limit: 20000, used: 15000 },
    perTransaction: 6000,
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

**Low balance:** Change `mockBalances.current` in config

**Near daily limit:** Set `transferLimits.daily.used` close to `limit`

**Biometric failure:** Use simulator with no Face ID enrolled, or deny permission

**Offline mode:** Toggle airplane mode - the app shows an offline banner

## Known Limitations

- TransactionDetails screen is a placeholder (not implemented yet)
- No real API integration - mock only
- No push notifications
- Receipt sharing uses native share sheet, no custom templates
- Tests exclude type-checking (tsconfig excludes test dirs)

## Troubleshooting

**Biometrics not working in Expo Go:**
This is expected. Use `npx expo run:ios` or `npx expo run:android` with a dev client.

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

Last updated: Feb 1, 2026
Author : Arshad
