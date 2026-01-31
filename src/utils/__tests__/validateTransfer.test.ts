/* eslint-disable @typescript-eslint/no-unsafe-call */
/**
 * Transfer Validation Tests
 * Testing the single source of truth for validation logic
 */

import {
  validateTransfer,
  getFirstErrorMessage,
  type TransferLimits,
} from '../validateTransfer';

// Default test limits matching appConfig
const createLimits = (overrides?: Partial<TransferLimits>): TransferLimits => ({
  daily: { limit: 10000, used: 2000, remaining: 8000 },
  monthly: { limit: 20000, used: 15000, remaining: 5000 },
  perTransaction: 6000,
  ...overrides,
});

const defaultBalance = 50000;

describe('validateTransfer', () => {
  describe('valid transfers', () => {
    it('passes for amount within all limits', () => {
      const result = validateTransfer({
        amount: 1000,
        balance: defaultBalance,
        limits: createLimits(),
      });

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('returns invalid for zero amount without errors', () => {
      const result = validateTransfer({
        amount: 0,
        balance: defaultBalance,
        limits: createLimits(),
      });

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('balance validation', () => {
    it('fails when amount exceeds balance', () => {
      const result = validateTransfer({
        amount: 1000,
        balance: 500,
        limits: createLimits(),
      });

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'amount',
          message: expect.stringContaining('Insufficient funds'),
        })
      );
    });

    it('passes at exact balance', () => {
      const result = validateTransfer({
        amount: 1000,
        balance: 1000,
        limits: createLimits(),
      });

      expect(result.isValid).toBe(true);
    });
  });

  describe('per-transaction limit', () => {
    it('fails when amount exceeds per-transaction limit', () => {
      const result = validateTransfer({
        amount: 7000,
        balance: defaultBalance,
        limits: createLimits({ perTransaction: 6000 }),
      });

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          message: expect.stringContaining('per-transaction limit'),
        })
      );
    });

    it('passes at exact per-transaction limit', () => {
      const limits = createLimits({
        perTransaction: 5000,
        monthly: { limit: 20000, used: 0, remaining: 20000 },
      });
      const result = validateTransfer({
        amount: 5000,
        balance: defaultBalance,
        limits,
      });

      expect(result.isValid).toBe(true);
    });
  });

  describe('daily limit', () => {
    it('fails when amount exceeds remaining daily limit', () => {
      const limits = createLimits({
        daily: { limit: 10000, used: 9000, remaining: 1000 },
      });
      const result = validateTransfer({
        amount: 2000,
        balance: defaultBalance,
        limits,
      });

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          message: expect.stringContaining('daily limit'),
        })
      );
    });

    it('passes at exact remaining daily limit', () => {
      const limits = createLimits({
        daily: { limit: 10000, used: 8000, remaining: 2000 },
        monthly: { limit: 50000, used: 0, remaining: 50000 },
      });
      const result = validateTransfer({
        amount: 2000,
        balance: defaultBalance,
        limits,
      });

      expect(result.isValid).toBe(true);
    });
  });

  describe('monthly limit', () => {
    it('fails when amount exceeds remaining monthly limit', () => {
      const limits = createLimits({
        monthly: { limit: 20000, used: 19000, remaining: 1000 },
      });
      const result = validateTransfer({
        amount: 2000,
        balance: defaultBalance,
        limits,
      });

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          message: expect.stringContaining('monthly limit'),
        })
      );
    });

    it('passes at exact remaining monthly limit', () => {
      const limits = createLimits({
        monthly: { limit: 20000, used: 18000, remaining: 2000 },
      });
      const result = validateTransfer({
        amount: 2000,
        balance: defaultBalance,
        limits,
      });

      expect(result.isValid).toBe(true);
    });
  });

  describe('warnings', () => {
    it('warns when approaching daily limit (80%)', () => {
      // Daily limit 10000, used 0, remaining 10000
      // Transfer 8500 = 85% used after transfer
      // Per-transaction limit set higher to allow this amount
      const limits = createLimits({
        daily: { limit: 10000, used: 0, remaining: 10000 },
        monthly: { limit: 50000, used: 0, remaining: 50000 },
        perTransaction: 10000,
      });
      const result = validateTransfer({
        amount: 8500,
        balance: defaultBalance,
        limits,
      });

      expect(result.isValid).toBe(true);
      expect(result.warnings).toContainEqual(
        expect.objectContaining({
          type: 'daily_limit_warning',
        })
      );
    });

    it('warns when approaching monthly limit (80%)', () => {
      // Monthly limit 20000, used 15000 (75%), transfer 1500 = 82.5%
      const limits = createLimits({
        monthly: { limit: 20000, used: 15000, remaining: 5000 },
      });
      const result = validateTransfer({
        amount: 1500,
        balance: defaultBalance,
        limits,
      });

      expect(result.isValid).toBe(true);
      expect(result.warnings).toContainEqual(
        expect.objectContaining({
          type: 'monthly_limit_warning',
        })
      );
    });

    it('no warning when below 80% threshold', () => {
      const limits = createLimits({
        daily: { limit: 10000, used: 0, remaining: 10000 },
        monthly: { limit: 50000, used: 0, remaining: 50000 },
      });
      const result = validateTransfer({
        amount: 1000,
        balance: defaultBalance,
        limits,
      });

      expect(result.warnings).toHaveLength(0);
    });

    it('no warnings when transfer is invalid', () => {
      const result = validateTransfer({
        amount: 100000,
        balance: 500,
        limits: createLimits(),
      });

      expect(result.isValid).toBe(false);
      expect(result.warnings).toHaveLength(0);
    });
  });

  describe('multiple errors', () => {
    it('accumulates multiple errors', () => {
      const limits = createLimits({
        daily: { limit: 1000, used: 900, remaining: 100 },
        monthly: { limit: 1000, used: 950, remaining: 50 },
        perTransaction: 50,
      });
      const result = validateTransfer({
        amount: 500,
        balance: 100,
        limits,
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });
});

describe('getFirstErrorMessage', () => {
  it('returns first error message', () => {
    const result = validateTransfer({
      amount: 1000,
      balance: 500,
      limits: createLimits(),
    });

    const message = getFirstErrorMessage(result);
    expect(message).toContain('Insufficient funds');
  });

  it('returns null when no errors', () => {
    const result = validateTransfer({
      amount: 100,
      balance: 50000,
      limits: createLimits(),
    });

    const message = getFirstErrorMessage(result);
    expect(message).toBeNull();
  });
});
