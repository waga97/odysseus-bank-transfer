/**
 * Account Store Tests
 * Testing limit update actions
 */

import { useAccountStore } from '../accountStore';

const mockLimits = {
  daily: { limit: 10000, used: 2000, remaining: 8000 },
  monthly: { limit: 50000, used: 15000, remaining: 35000 },
  perTransaction: 5000,
};

// Reset store before each test
beforeEach(() => {
  useAccountStore.setState({
    accounts: [],
    defaultAccount: null,
    recipients: [],
    recentRecipients: [],
    favoriteRecipients: [],
    transactions: [],
    transferLimits: mockLimits,
    banks: [],
    isLoading: false,
    error: null,
    isBalanceHidden: false,
  });
});

describe('accountStore updateDailyUsed', () => {
  it('increments daily used by amount', () => {
    const { updateDailyUsed } = useAccountStore.getState();

    updateDailyUsed(500);

    const state = useAccountStore.getState();
    expect(state.transferLimits?.daily.used).toBe(2500);
    expect(state.transferLimits?.daily.remaining).toBe(7500);
  });

  it('does not affect monthly limits', () => {
    const { updateDailyUsed } = useAccountStore.getState();

    updateDailyUsed(500);

    const state = useAccountStore.getState();
    expect(state.transferLimits?.monthly.used).toBe(15000);
    expect(state.transferLimits?.monthly.remaining).toBe(35000);
  });
});

describe('accountStore updateMonthlyUsed', () => {
  it('increments monthly used by amount', () => {
    const { updateMonthlyUsed } = useAccountStore.getState();

    updateMonthlyUsed(1000);

    const state = useAccountStore.getState();
    expect(state.transferLimits?.monthly.used).toBe(16000);
    expect(state.transferLimits?.monthly.remaining).toBe(34000);
  });

  it('does not affect daily limits', () => {
    const { updateMonthlyUsed } = useAccountStore.getState();

    updateMonthlyUsed(1000);

    const state = useAccountStore.getState();
    expect(state.transferLimits?.daily.used).toBe(2000);
    expect(state.transferLimits?.daily.remaining).toBe(8000);
  });
});

describe('accountStore updateLimitsUsed', () => {
  it('increments both daily and monthly used by amount', () => {
    const { updateLimitsUsed } = useAccountStore.getState();

    updateLimitsUsed(500);

    const state = useAccountStore.getState();
    expect(state.transferLimits?.daily.used).toBe(2500);
    expect(state.transferLimits?.daily.remaining).toBe(7500);
    expect(state.transferLimits?.monthly.used).toBe(15500);
    expect(state.transferLimits?.monthly.remaining).toBe(34500);
  });

  it('accumulates across multiple calls', () => {
    const { updateLimitsUsed } = useAccountStore.getState();

    updateLimitsUsed(100);
    updateLimitsUsed(200);
    updateLimitsUsed(300);

    const state = useAccountStore.getState();
    expect(state.transferLimits?.daily.used).toBe(2600);
    expect(state.transferLimits?.monthly.used).toBe(15600);
  });

  it('returns unchanged state if transferLimits is null', () => {
    useAccountStore.setState({ transferLimits: null });

    const { updateLimitsUsed } = useAccountStore.getState();
    updateLimitsUsed(500);

    const state = useAccountStore.getState();
    expect(state.transferLimits).toBeNull();
  });
});
