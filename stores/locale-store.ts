import { ImmerStateCreator } from "./index";

type LocaleState = {
  isLocalePending: boolean;
  localeCode: string;
};

type LocaleActions = {
  setLocaleCode: (code: string) => void;
  setLocalePending: (bool: boolean) => void;
};

export interface LocaleStore {
  locale: LocaleState & LocaleActions;
}

const defaultInitState: LocaleState = {
  isLocalePending: false,
  localeCode: "",
};

export const createLocaleStore: ImmerStateCreator<LocaleStore> = (set) => ({
  locale: {
    ...defaultInitState,
    setLocaleCode: (code: string) => {
      set((state) => {
        state.locale.localeCode = code;
      });
    },
    setLocalePending: (bool: boolean) => {
      set((state) => {
        state.locale.isLocalePending = bool;
      });
    },
  },
});
