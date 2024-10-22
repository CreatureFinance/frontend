import { createStore, StateCreator } from "zustand/vanilla";
import { immer } from "zustand/middleware/immer";
import { devtools } from "zustand/middleware";
import { createWalletStore, WalletStore } from "./WalletStore";

type RootState = {};

type RootActions = {};

export type RootStore = RootState & RootActions & WalletStore;

export const defaultInitState: RootState = {};

// 創建主 store
export const createRootStore = (initState: RootState = defaultInitState) => {
  return createStore<RootStore>()(
    devtools(
      immer((...args) => ({
        ...initState,
        ...createWalletStore(...args),
      })),
      {
        name: "root_store",
      },
    ),
  );
};

export type ImmerStateCreator<T extends Partial<RootStore>> = StateCreator<
  RootStore,
  [["zustand/immer", never], never],
  [],
  T
>;
