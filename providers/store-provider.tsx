"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { type StoreApi, useStore as useZustandStore } from "zustand";

import { type RootStore, createRootStore } from "@/stores";

export const RootStoreContext = createContext<StoreApi<RootStore> | null>(null);

export interface RootStoreProviderProps {
  children: ReactNode;
}

export const ZustandProvider = ({ children }: RootStoreProviderProps) => {
  const storeRef = useRef<StoreApi<RootStore>>();
  if (!storeRef.current) {
    storeRef.current = createRootStore();
  }

  return (
    <RootStoreContext.Provider value={storeRef.current}>
      {children}
    </RootStoreContext.Provider>
  );
};

export function useStore<T>(selector: (store: RootStore) => T): T {
  const rootStoreContext = useContext(RootStoreContext);

  if (!rootStoreContext) {
    throw new Error(`useStore must be used within ZustandProvider`);
  }

  return useZustandStore(rootStoreContext, selector);
}
