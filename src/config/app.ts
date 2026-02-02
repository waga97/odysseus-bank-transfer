export const appConfig = {
  /**
   * Simulated loading delay in milliseconds
   * Set to 0 for instant loading (production)
   * Set to 500-2000 for testing loading states
   */
  loadingDelay: 800,

  /**
   * Mock user data - change these to test different scenarios
   */
  mockUser: {
    name: 'Marcus Aurelius',
    email: 'marcus.aurelius@email.com',
    phone: '+60123456789',
  },

  /**
   * Mock account balances - round numbers for easy testing
   */
  mockBalances: {
    current: 10000,
    savings: 5000,
    investment: 15000,
  },

  /**
   * Transfer limits - round numbers for easy testing
   *
   * Test scenarios:
   * - Transfer 5001 → fails (per-transaction limit)
   * - Transfer 5000 x2 → second fails (daily limit: 10000)
   * - Transfer 10001 → fails (balance + daily limit)
   */
  transferLimits: {
    daily: {
      limit: 10000,
      used: 0,
    },
    monthly: {
      limit: 50000,
      used: 0,
    },
    perTransaction: 5000,
  },

  /**
   * API configuration
   */
  api: {
    baseUrl: 'https://api.odysseusbank.com',
    timeout: 30000,
  },

  /**
   * Mock API settings for testing
   */
  mockApi: {
    /**
     * Simulated network failure rate (0.0 to 1.0)
     * Set to 0 for no failures, 1.0 for 100% failure rate
     */
    networkFailureRate: 0.1,

    /**
     * Simulated transfer execution delay in milliseconds
     * Longer than normal API delay to simulate bank processing
     */
    transferDelay: 1500,
  },

  /**
   * Validation settings
   */
  validation: {
    /**
     * Warning threshold for approaching limits (0.0 to 1.0)
     * Shows warning when usage reaches this percentage of limit
     * Default: 0.8 (80%)
     */
    limitWarningThreshold: 0.8,
  },

  /**
   * Feature flags
   */
  features: {
    enableHaptics: true,
    enableBiometrics: true,
  },
} as const;

export type AppConfig = typeof appConfig;
