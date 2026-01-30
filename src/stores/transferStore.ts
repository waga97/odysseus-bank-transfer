/**
 * Odysseus Bank - Transfer Store
 * Manages the current transfer flow state
 */

import { create } from 'zustand';
import type { Recipient, Bank } from '@types';

interface TransferFlowState {
  // Current transfer data
  selectedRecipient: Recipient | null;
  selectedBank: Bank | null;
  amount: number;
  note: string;

  // New recipient input (for manual entry)
  newRecipientName: string;
  newRecipientAccountNumber: string;
  newRecipientPhoneNumber: string;

  // Flow state
  transferMethod: 'recent' | 'bank' | 'duitnow' | null;
  currentStep:
    | 'recipient'
    | 'bank'
    | 'details'
    | 'amount'
    | 'review'
    | 'processing'
    | 'complete';

  // Actions
  setSelectedRecipient: (recipient: Recipient | null) => void;
  setSelectedBank: (bank: Bank | null) => void;
  setAmount: (amount: number) => void;
  setNote: (note: string) => void;
  setNewRecipientName: (name: string) => void;
  setNewRecipientAccountNumber: (accountNumber: string) => void;
  setNewRecipientPhoneNumber: (phoneNumber: string) => void;
  setTransferMethod: (method: TransferFlowState['transferMethod']) => void;
  setCurrentStep: (step: TransferFlowState['currentStep']) => void;
  reset: () => void;
}

const initialState = {
  selectedRecipient: null,
  selectedBank: null,
  amount: 0,
  note: '',
  newRecipientName: '',
  newRecipientAccountNumber: '',
  newRecipientPhoneNumber: '',
  transferMethod: null,
  currentStep: 'recipient' as const,
};

export const useTransferStore = create<TransferFlowState>((set) => ({
  ...initialState,

  setSelectedRecipient: (recipient) => set({ selectedRecipient: recipient }),

  setSelectedBank: (bank) => set({ selectedBank: bank }),

  setAmount: (amount) => set({ amount }),

  setNote: (note) => set({ note }),

  setNewRecipientName: (name) => set({ newRecipientName: name }),

  setNewRecipientAccountNumber: (accountNumber) =>
    set({ newRecipientAccountNumber: accountNumber }),

  setNewRecipientPhoneNumber: (phoneNumber) =>
    set({ newRecipientPhoneNumber: phoneNumber }),

  setTransferMethod: (method) => set({ transferMethod: method }),

  setCurrentStep: (step) => set({ currentStep: step }),

  reset: () => set(initialState),
}));

/**
 * Selector hooks
 */
export const useSelectedRecipient = () =>
  useTransferStore((state) => state.selectedRecipient);
export const useSelectedBank = () =>
  useTransferStore((state) => state.selectedBank);
export const useTransferAmount = () =>
  useTransferStore((state) => state.amount);
export const useTransferNote = () => useTransferStore((state) => state.note);
export const useTransferMethod = () =>
  useTransferStore((state) => state.transferMethod);
export const useCurrentTransferStep = () =>
  useTransferStore((state) => state.currentStep);
