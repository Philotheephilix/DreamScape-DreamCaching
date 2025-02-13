import { create } from 'zustand';

interface WalletState {
  walletAddress: string | null;
  setWalletAddress: (address: string) => void;
  clearWalletAddress: () => void;
}

const useWalletStore = create<WalletState>((set) => ({
  walletAddress: null,
  setWalletAddress: (address) => set({ walletAddress: address }),
  clearWalletAddress: () => set({ walletAddress: null }),
}));

export default useWalletStore;