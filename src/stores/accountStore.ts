import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import type {
  Account,
  Recipient,
  Transaction,
  TransferLimits,
  Bank,
} from '@types';

interface AccountState {
  // State
  accounts: Account[];
  defaultAccount: Account | null;
  recipients: Recipient[];
  transactions: Transaction[];
  transferLimits: TransferLimits | null;
  banks: Bank[];
  isLoading: boolean;
  error: string | null;
  isBalanceHidden: boolean;

  // Account Actions
  setAccounts: (accounts: Account[]) => void;
  setDefaultAccount: (account: Account) => void;
  updateBalance: (accountId: string, newBalance: number) => void;

  // Recipient Actions
  setRecipients: (recipients: Recipient[]) => void;
  addRecipient: (recipient: Recipient) => void;
  updateRecipient: (id: string, updates: Partial<Recipient>) => void;

  // Transaction Actions
  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransactionStatus: (id: string, status: Transaction['status']) => void;

  // Limits Actions
  setTransferLimits: (limits: TransferLimits) => void;
  updateDailyUsed: (amount: number) => void;
  updateMonthlyUsed: (amount: number) => void;
  updateLimitsUsed: (amount: number) => void;

  // Bank Actions
  setBanks: (banks: Bank[]) => void;

  // Utility Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;

  // Balance Visibility
  toggleBalanceVisibility: () => void;
  setBalanceHidden: (hidden: boolean) => void;
}

const initialState = {
  accounts: [],
  defaultAccount: null,
  recipients: [],
  transactions: [],
  transferLimits: null,
  banks: [],
  isLoading: false,
  error: null,
  isBalanceHidden: false,
};

export const useAccountStore = create<AccountState>((set) => ({
  ...initialState,

  // Account Actions
  setAccounts: (accounts) => {
    const defaultAccount =
      accounts.find((a) => a.isDefault) ?? accounts[0] ?? null;
    set({ accounts, defaultAccount });
  },

  setDefaultAccount: (account) => set({ defaultAccount: account }),

  updateBalance: (accountId, newBalance) =>
    set((state) => ({
      accounts: state.accounts.map((a) =>
        a.id === accountId ? { ...a, balance: newBalance } : a
      ),
      defaultAccount:
        state.defaultAccount?.id === accountId
          ? { ...state.defaultAccount, balance: newBalance }
          : state.defaultAccount,
    })),

  // Recipient Actions
  setRecipients: (recipients) => set({ recipients }),

  addRecipient: (recipient) =>
    set((state) => ({
      recipients: [recipient, ...state.recipients],
    })),

  updateRecipient: (id, updates) =>
    set((state) => ({
      recipients: state.recipients.map((r) =>
        r.id === id ? { ...r, ...updates } : r
      ),
    })),

  // Transaction Actions
  setTransactions: (transactions) => set({ transactions }),

  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [transaction, ...state.transactions],
    })),

  updateTransactionStatus: (id, status) =>
    set((state) => ({
      transactions: state.transactions.map((t) =>
        t.id === id ? { ...t, status } : t
      ),
    })),

  // Limits Actions
  setTransferLimits: (limits) => set({ transferLimits: limits }),

  updateDailyUsed: (amount) =>
    set((state) => {
      if (!state.transferLimits) {
        return state;
      }
      const newUsed = state.transferLimits.daily.used + amount;
      return {
        transferLimits: {
          ...state.transferLimits,
          daily: {
            ...state.transferLimits.daily,
            used: newUsed,
            remaining: state.transferLimits.daily.limit - newUsed,
          },
        },
      };
    }),

  updateMonthlyUsed: (amount) =>
    set((state) => {
      if (!state.transferLimits) {
        return state;
      }
      const newUsed = state.transferLimits.monthly.used + amount;
      return {
        transferLimits: {
          ...state.transferLimits,
          monthly: {
            ...state.transferLimits.monthly,
            used: newUsed,
            remaining: state.transferLimits.monthly.limit - newUsed,
          },
        },
      };
    }),

  // Combined update for both daily and monthly - use this for transfers
  updateLimitsUsed: (amount) =>
    set((state) => {
      if (!state.transferLimits) {
        return state;
      }
      const newDailyUsed = state.transferLimits.daily.used + amount;
      const newMonthlyUsed = state.transferLimits.monthly.used + amount;
      return {
        transferLimits: {
          ...state.transferLimits,
          daily: {
            ...state.transferLimits.daily,
            used: newDailyUsed,
            remaining: state.transferLimits.daily.limit - newDailyUsed,
          },
          monthly: {
            ...state.transferLimits.monthly,
            used: newMonthlyUsed,
            remaining: state.transferLimits.monthly.limit - newMonthlyUsed,
          },
        },
      };
    }),

  // Bank Actions
  setBanks: (banks) => set({ banks }),

  // Utility Actions
  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  reset: () => set(initialState),

  // Balance Visibility
  toggleBalanceVisibility: () =>
    set((state) => ({ isBalanceHidden: !state.isBalanceHidden })),

  setBalanceHidden: (hidden) => set({ isBalanceHidden: hidden }),
}));

export const useDefaultAccount = () =>
  useAccountStore((state) => state.defaultAccount);
export const useAccounts = () => useAccountStore((state) => state.accounts);
export const useBalance = () =>
  useAccountStore((state) => state.defaultAccount?.balance ?? 0);
export const useRecipients = () => useAccountStore((state) => state.recipients);

// Derived from transaction history - no need to manually sync lastTransferDate
export const useRecentRecipients = () =>
  useAccountStore((state) => {
    const seen = new Set<string>();
    const recentRecipients: Recipient[] = [];

    // Transactions are already sorted by date (newest first from addTransaction)
    for (const tx of state.transactions) {
      // Only include completed outgoing transfers
      if (tx.type !== 'transfer' || tx.status !== 'completed') {
        continue;
      }

      const recipientId = tx.recipient.id;
      if (seen.has(recipientId)) {
        continue;
      }
      seen.add(recipientId);

      // Build recipient from transaction data
      recentRecipients.push({
        id: recipientId,
        name: tx.recipient.name,
        accountNumber: tx.recipient.accountNumber,
        phoneNumber: tx.recipient.phoneNumber,
        bankName: tx.recipient.bankName,
      });

      if (recentRecipients.length >= 10) {
        break;
      }
    }

    return recentRecipients;
  });

export const useTransactions = () =>
  useAccountStore((state) => state.transactions);
export const useTransferLimits = () =>
  useAccountStore((state) => state.transferLimits);
export const useBanks = () => useAccountStore((state) => state.banks);
export const useBalanceVisibility = () =>
  useAccountStore(
    useShallow((state) => ({
      isHidden: state.isBalanceHidden,
      toggle: state.toggleBalanceVisibility,
    }))
  );

export const useAccountActions = () =>
  useAccountStore(
    useShallow((state) => ({
      setAccounts: state.setAccounts,
      setRecipients: state.setRecipients,
      setTransactions: state.setTransactions,
      setTransferLimits: state.setTransferLimits,
      setBanks: state.setBanks,
      setLoading: state.setLoading,
      updateBalance: state.updateBalance,
      updateLimitsUsed: state.updateLimitsUsed,
      addTransaction: state.addTransaction,
    }))
  );
