import { ImmerStateCreator } from "./index";

type WalletState = {
  walletName: string;
  walletAddress: string;
  isConnecting: boolean;
  connectingId: string;
};

type WalletActions = {
  setWalletName: (name: string) => void;
  setWalletAddress: (address: string) => void;
  setConnectingId: (id: string) => void;
  setIsConnecting: (bool: boolean) => void;
};

export interface WalletStore {
  wallet: WalletState & WalletActions;
}

const defaultInitState: WalletState = {
  walletName: "",
  walletAddress: "",
  connectingId: "",
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
    setConnectingId: (id: string) => {
      set((state) => {
        state.wallet.connectingId = id;
      });
    },
    setIsConnecting: (bool: boolean) => {
      set((state) => {
        state.wallet.isConnecting = bool;
      });
    },
  },
});
