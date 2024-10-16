import { ImmerStateCreator } from "../index";

type WalletState = {
  walletName: string;
  walletAddress: string;
};

type WalletActions = {
  setWalletName: (name: string) => void;
  setWalletAddress: (address: string) => void;
};

export interface WalletStore {
  wallet: WalletState & WalletActions;
}

const defaultInitState: WalletState = {
  walletName: "",
  walletAddress: "",
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
  },
});
