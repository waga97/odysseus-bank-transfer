/**
 * Ryt Bank - Mock API
 * Simple fetch mock for React Native (no MSW dependency)
 */

import {
  mockUser,
  mockAccounts,
  mockRecipients,
  mockTransactions,
  mockTransferLimits,
  mockBanks,
  generateReferenceId,
  generateTransactionId,
} from './data';
import type { Transaction, TransferRequest } from '@types';
import { appConfig } from '@config/app';
import { validateTransfer } from '@utils/validateTransfer';

// In-memory state for mutations
let currentBalance = mockAccounts[0]?.balance ?? 0;
let dailyUsed = mockTransferLimits.daily.used;
let monthlyUsed = mockTransferLimits.monthly.used;
const transactions = [...mockTransactions];

// Simulate network delay using centralized config
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const apiDelay = () => delay(appConfig.loadingDelay);

/**
 * Build current transfer limits state - single source of truth
 * Used by both validateTransfer and executeTransfer
 */
const buildCurrentLimits = () => ({
  daily: {
    limit: mockTransferLimits.daily.limit,
    used: dailyUsed,
    remaining: mockTransferLimits.daily.limit - dailyUsed,
  },
  monthly: {
    limit: mockTransferLimits.monthly.limit,
    used: monthlyUsed,
    remaining: mockTransferLimits.monthly.limit - monthlyUsed,
  },
  perTransaction: mockTransferLimits.perTransaction,
});

/**
 * Mock API functions
 */
export const mockApi = {
  // User
  async getUser() {
    await apiDelay();
    return mockUser;
  },

  // Accounts
  async getAccounts() {
    await apiDelay();
    return mockAccounts.map((acc, index) =>
      index === 0 ? { ...acc, balance: currentBalance } : acc
    );
  },

  // Limits
  async getLimits() {
    await apiDelay();
    return buildCurrentLimits();
  },

  // Recipients
  async getRecipients() {
    await apiDelay();
    return mockRecipients;
  },

  async lookupRecipient(params: {
    accountNumber?: string;
    phoneNumber?: string;
  }) {
    await apiDelay();

    // Simulate not found
    if (
      params.accountNumber === '0000000000' ||
      params.phoneNumber === '+60100000000'
    ) {
      throw new Error('RECIPIENT_NOT_FOUND');
    }

    return {
      id: `rec-new-${Date.now()}`,
      name: 'New Recipient',
      accountNumber: params.accountNumber,
      phoneNumber: params.phoneNumber,
      bankName: 'Maybank',
    };
  },

  // Banks
  async getBanks() {
    await apiDelay();
    return mockBanks;
  },

  // Transfer validation - uses shared validation function (DRY)
  async validateTransfer(request: TransferRequest) {
    await apiDelay();
    return validateTransfer({
      amount: request.amount,
      balance: currentBalance,
      limits: buildCurrentLimits(),
    });
  },

  // Execute transfer
  async executeTransfer(
    request: TransferRequest & { recipientName?: string; bankName?: string }
  ): Promise<Transaction> {
    await delay(appConfig.mockApi.transferDelay);

    // Test account number for invalid account error
    // 111122223333 = invalid account (can't trigger naturally)
    if (request.recipientAccountNumber === '111122223333') {
      throw new Error('INVALID_ACCOUNT');
    }

    // Simulate random network failure based on config
    if (Math.random() < appConfig.mockApi.networkFailureRate) {
      throw new Error('NETWORK_ERROR');
    }

    // Use shared validation function to ensure consistency with UI validation
    const validation = validateTransfer({
      amount: request.amount,
      balance: currentBalance,
      limits: buildCurrentLimits(),
    });

    if (!validation.isValid) {
      // Map validation errors to specific error codes
      // Check all errors to find the most relevant one (priority order)
      const errorMessages = validation.errors.map((e) => e.message);
      const allMessages = errorMessages.join(' ');

      if (allMessages.includes('Insufficient funds')) {
        throw new Error('INSUFFICIENT_FUNDS');
      }
      if (allMessages.includes('daily')) {
        throw new Error('DAILY_LIMIT_EXCEEDED');
      }
      if (allMessages.includes('monthly')) {
        throw new Error('MONTHLY_LIMIT_EXCEEDED');
      }
      if (allMessages.includes('per-transaction')) {
        throw new Error('PER_TRANSACTION_LIMIT_EXCEEDED');
      }
      // amount <= 0 returns isValid: false with empty errors
      throw new Error('INVALID_AMOUNT');
    }

    // Execute transfer
    currentBalance -= request.amount;
    dailyUsed += request.amount;
    monthlyUsed += request.amount;

    const newTransaction: Transaction = {
      id: generateTransactionId(),
      type: 'transfer',
      status: 'completed',
      amount: request.amount,
      currency: 'RM',
      recipient: {
        id: request.recipientId ?? `rec-${Date.now()}`,
        name: request.recipientName ?? 'Unknown Recipient',
        accountNumber: request.recipientAccountNumber,
        phoneNumber: request.recipientPhoneNumber,
        bankName: request.bankName,
      },
      sender: {
        id: mockUser.id,
        name: mockUser.name,
        accountNumber: mockAccounts[0]?.accountNumber ?? '',
      },
      note: request.note,
      reference: generateReferenceId(),
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };

    transactions.unshift(newTransaction);
    return newTransaction;
  },

  // Transactions
  async getTransactions(params?: { limit?: number; page?: number }) {
    await apiDelay();
    const limit = params?.limit ?? 20;
    const page = params?.page ?? 1;
    const start = (page - 1) * limit;
    const end = start + limit;
    const items = transactions.slice(start, end);

    return {
      items,
      total: transactions.length,
      page,
      pageSize: limit,
      hasMore: end < transactions.length,
    };
  },

  async getTransaction(id: string) {
    await apiDelay();
    const transaction = transactions.find((t) => t.id === id);
    if (!transaction) {
      throw new Error('NOT_FOUND');
    }
    return transaction;
  },

  // Reset state (for testing)
  reset() {
    currentBalance = mockAccounts[0]?.balance ?? 0;
    dailyUsed = mockTransferLimits.daily.used;
    monthlyUsed = mockTransferLimits.monthly.used;
    transactions.length = 0;
    transactions.push(...mockTransactions);
  },
};

export default mockApi;
