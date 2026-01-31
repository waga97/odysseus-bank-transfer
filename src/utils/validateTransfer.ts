/**
 * Odysseus Bank - Transfer Validation
 * Single source of truth for transfer validation logic
 * Used by both frontend (instant UX) and backend (final check)
 */

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
 * Pure function to validate a transfer amount
 * No side effects, easily testable
 */
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

    // Warn at 80% of daily limit
    if (newDailyUsed >= limits.daily.limit * 0.8) {
      warnings.push({
        type: 'daily_limit_warning',
        message: "You're approaching your daily transfer limit.",
      });
    }

    // Warn at 80% of monthly limit
    if (newMonthlyUsed >= limits.monthly.limit * 0.8) {
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

/**
 * Get the first error message (for simple display)
 */
export function getFirstErrorMessage(result: ValidationResult): string | null {
  return result.errors[0]?.message ?? null;
}
