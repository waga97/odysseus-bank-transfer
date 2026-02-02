import { appConfig } from '@config/app';

export interface TransferLimits {
  daily: {
    limit: number;
    used: number;
    remaining: number;
  };
  monthly: {
    limit: number;
    used: number;
    remaining: number;
  };
  perTransaction: number;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationWarning {
  type: 'daily_limit_warning' | 'monthly_limit_warning';
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidateTransferParams {
  amount: number;
  balance: number;
  limits: TransferLimits;
}

/**
 * Warning threshold - pulled from centralized config
 * Warn when usage will reach this percentage of the limit
 */
export const WARNING_THRESHOLD = appConfig.validation.limitWarningThreshold;

// Used by both frontend (instant UX) and mock API (final validation)
export function validateTransfer({
  amount,
  balance,
  limits,
}: ValidateTransferParams): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Skip validation for zero/negative amounts
  if (amount <= 0) {
    return { isValid: false, errors: [], warnings: [] };
  }

  // Check balance
  if (amount > balance) {
    errors.push({
      field: 'amount',
      message: `Insufficient funds. Available: RM ${balance.toFixed(2)}`,
    });
  }

  // Check per-transaction limit
  if (amount > limits.perTransaction) {
    errors.push({
      field: 'amount',
      message: `Exceeds per-transaction limit of RM ${limits.perTransaction.toFixed(2)}`,
    });
  }

  // Check daily limit
  if (amount > limits.daily.remaining) {
    errors.push({
      field: 'amount',
      message: `Exceeds daily limit. Remaining: RM ${limits.daily.remaining.toFixed(2)}`,
    });
  }

  // Check monthly limit
  if (amount > limits.monthly.remaining) {
    errors.push({
      field: 'amount',
      message: `Exceeds monthly limit. Remaining: RM ${limits.monthly.remaining.toFixed(2)}`,
    });
  }

  // Warnings (only if no errors)
  if (errors.length === 0) {
    const newDailyUsed = limits.daily.used + amount;
    const newMonthlyUsed = limits.monthly.used + amount;

    // Warn when approaching daily limit
    if (newDailyUsed >= limits.daily.limit * WARNING_THRESHOLD) {
      warnings.push({
        type: 'daily_limit_warning',
        message: "You're approaching your daily transfer limit.",
      });
    }

    // Warn when approaching monthly limit
    if (newMonthlyUsed >= limits.monthly.limit * WARNING_THRESHOLD) {
      warnings.push({
        type: 'monthly_limit_warning',
        message: "You're approaching your monthly transfer limit.",
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

export function getFirstErrorMessage(result: ValidationResult): string | null {
  return result.errors[0]?.message ?? null;
}

/**
 * Checks if a transfer amount would trigger a warning for a cumulative limit.
 * Used by UI components (like LimitWarning) to show consistent warnings.
 */
export function shouldWarnForLimit(
  amount: number,
  used: number,
  limit: number
): boolean {
  if (amount <= 0) {
    return false;
  }
  const newUsed = used + amount;
  return newUsed >= limit * WARNING_THRESHOLD;
}

// Simple check if an amount exceeds the remaining limit.
export function exceedsLimit(amount: number, remaining: number): boolean {
  return amount > remaining;
}
