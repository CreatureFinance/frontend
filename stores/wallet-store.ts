import { ImmerStateCreator } from "./index";

type WalletState = {
  walletName: string;
  walletAddress: string;
  isConnecting: boolean;
};

type WalletActions = {
  setWalletName: (name: string) => void;
  setWalletAddress: (address: string) => void;
  setIsConnecting: (bool: boolean) => void;
};

export interface WalletStore {
  wallet: WalletState & WalletActions;
}

const defaultInitState: WalletState = {
  walletName: "",
  walletAddress: "",
  isConnecting: false,
};

export const createWalletStore: ImmerStateCreator<WalletStore> = (set) => ({
  wallet: {
    ...defaultInitState,
    setWalletAddress: (address: string) => {
      set((state) => {
        state.wallet.walletAddress = address;
      });
    },
    setWalletName: (name: string) => {
      set((state) => {
        state.wallet.walletName = name;
      });
    },
    setIsConnecting: (bool: boolean) => {
      set((state) => {
        state.wallet.isConnecting = bool;
      });
    },
  },
});
