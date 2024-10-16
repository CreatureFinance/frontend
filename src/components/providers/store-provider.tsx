"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { type StoreApi } from "zustand";
import { useStoreWithEqualityFn } from "zustand/traditional";

import { type RootStore, createRootStore } from "@/stores";

export const RootStoreContext = createContext<StoreApi<RootStore> | null>(null);

export interface RootStoreProviderProps {
  children: ReactNode;
}

export const RootStoreProvider = ({ children }: RootStoreProviderProps) => {
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

export const useStore = <T,>(
  selector: (store: RootStore) => T,
  equalityFn?: (left: T, right: T) => boolean,
): T => {
  const rootStoreContext = useContext(RootStoreContext);

  if (!rootStoreContext) {
    throw new Error(`useRootStore must be used within RootStoreProvider`);
  }

  return useStoreWithEqualityFn(rootStoreContext, selector, equalityFn);
};
