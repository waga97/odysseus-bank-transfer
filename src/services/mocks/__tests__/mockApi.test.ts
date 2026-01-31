/* eslint-disable @typescript-eslint/no-unsafe-call */
/**
 * Mock API Tests
 * Testing API behavior (delegates to shared validateTransfer for validation logic)
 */

import { mockApi } from '../mockApi';
import { mockTransferLimits, mockAccounts } from '../data';

// Mock Math.random to avoid flaky tests from 5% network failure
const mockMathRandom = jest.spyOn(Math, 'random').mockReturnValue(0.5);

// Reset state before each test
beforeEach(() => {
  mockApi.reset();
  mockMathRandom.mockReturnValue(0.5);
});

afterAll(() => {
  mockMathRandom.mockRestore();
});

describe('mockApi.validateTransfer', () => {
  const validRequest = {
    amount: 100,
    recipientAccountNumber: '1234567890',
    fromAccountId: 'acc-001',
  };

  it('returns validation result from shared validator', async () => {
    const result = await mockApi.validateTransfer(validRequest);

    expect(result).toHaveProperty('isValid');
    expect(result).toHaveProperty('errors');
    expect(result).toHaveProperty('warnings');
  });

  it('passes for valid amount', async () => {
    const result = await mockApi.validateTransfer(validRequest);

    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('fails when amount exceeds balance', async () => {
    const result = await mockApi.validateTransfer({
      ...validRequest,
      amount: mockAccounts[0].balance + 1000,
    });

    expect(result.isValid).toBe(false);
    expect(result.errors[0].message).toContain('Insufficient funds');
  });

  it('fails when amount exceeds monthly remaining', async () => {
    const result = await mockApi.validateTransfer({
      ...validRequest,
      amount: mockTransferLimits.monthly.remaining + 100,
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.some((e) => e.message.includes('monthly'))).toBe(true);
  });
});

describe('mockApi.executeTransfer', () => {
  const validRequest = {
    amount: 500,
    recipientAccountNumber: '1234567890',
    fromAccountId: 'acc-001',
    recipientName: 'John Doe',
    bankName: 'Maybank',
  };

  it('executes valid transfer and returns transaction', async () => {
    const result = await mockApi.executeTransfer(validRequest);

    expect(result).toMatchObject({
      type: 'transfer',
      status: 'completed',
      amount: 500,
      recipient: expect.objectContaining({
        name: 'John Doe',
      }),
    });
    expect(result.id).toBeDefined();
    expect(result.reference).toBeDefined();
  });

  it('deducts from balance after transfer', async () => {
    const initialBalance = mockAccounts[0].balance;
    await mockApi.executeTransfer(validRequest);

    const accounts = await mockApi.getAccounts();
    expect(accounts[0].balance).toBe(initialBalance - 500);
  });

  it('updates daily used after transfer', async () => {
    const initialLimits = await mockApi.getLimits();
    await mockApi.executeTransfer(validRequest);

    const newLimits = await mockApi.getLimits();
    expect(newLimits.daily.used).toBe(initialLimits.daily.used + 500);
    expect(newLimits.daily.remaining).toBe(initialLimits.daily.remaining - 500);
  });

  it('throws INSUFFICIENT_FUNDS when balance too low', async () => {
    await expect(
      mockApi.executeTransfer({
        ...validRequest,
        amount: mockAccounts[0].balance + 10000,
      })
    ).rejects.toThrow('INSUFFICIENT_FUNDS');
  });

  it('throws DAILY_LIMIT_EXCEEDED when over daily limit', async () => {
    const dailyRemaining =
      mockTransferLimits.daily.limit - mockTransferLimits.daily.used;

    await expect(
      mockApi.executeTransfer({
        ...validRequest,
        amount: dailyRemaining + 100,
      })
    ).rejects.toThrow('DAILY_LIMIT_EXCEEDED');
  });

  it('adds transaction to history', async () => {
    const newTx = await mockApi.executeTransfer(validRequest);

    const { items } = await mockApi.getTransactions({ limit: 1 });
    expect(items[0].id).toBe(newTx.id);
  });
});

describe('mockApi.reset', () => {
  it('restores initial state', async () => {
    await mockApi.executeTransfer({
      amount: 1000,
      recipientAccountNumber: '1234567890',
      fromAccountId: 'acc-001',
    });

    mockApi.reset();

    const accounts = await mockApi.getAccounts();
    expect(accounts[0].balance).toBe(mockAccounts[0].balance);

    const limits = await mockApi.getLimits();
    expect(limits.daily.used).toBe(mockTransferLimits.daily.used);
  });
});
