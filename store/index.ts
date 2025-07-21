import { create } from "zustand";

import { KEY_APP_NAME, KEY_TOKEN } from "@/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { Order } from "../types/order";
import { TermOfService } from "../types/termOfService";
import { User } from "../types/user";

interface IStore {
  user?: User;
  setUser: (user: User) => void;
  clearUser: () => void;
  tabKey?: string;
  setTabKey: (tabKey?: string) => void;
  token: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
  authLoading: boolean;
  setAuthLoading: (authLoading: boolean) => void;
  currentOrder?: Order;
  setCurrentOrder: (currentOrder: Order) => void;
  clearCurrentOrder: () => void;
  termOfService?: TermOfService;
  setTermOfService: (termOfService: TermOfService) => void;
  appName: string;
  setAppName: (appName?: string) => void;
  initialized: boolean;
  initStore: () => Promise<void>;
}

console.log(Platform.OS);

const getItem = async (key: string) => {
  return await Platform.select({
    web: Promise.resolve(window?.localStorage?.getItem(key)),
    default: AsyncStorage.getItem(key),
  });
};

const setItem = async (key: string, value: string) => {
  await Platform.select({
    web: Promise.resolve(window?.localStorage?.setItem(key, value)),
    default: AsyncStorage.setItem(key, value),
  });
};

const removeItem = async (key: string) => {
  await Platform.select({
    web: Promise.resolve(window?.localStorage?.removeItem(key)),
    default: AsyncStorage.removeItem(key),
  });
};

export const useStore = create<IStore>((set) => {
  const initialState: IStore = {
    setUser: (user) => set((prev) => ({ ...prev, user })),
    clearUser: () => set((prev) => ({ ...prev, user: undefined })),
    setTabKey: (tabKey) => set((prev) => ({ ...prev, tabKey })),
    token: "",
    setToken: (token) => set((prev) => ({ ...prev, token })),
    clearToken: () => set((prev) => ({ ...prev, token: null })),
    authLoading: true,
    setAuthLoading: (authLoading) => set((prev) => ({ ...prev, authLoading })),
    setCurrentOrder: (currentOrder: Order) =>
      set((prev) => ({ ...prev, currentOrder })),
    clearCurrentOrder: () =>
      set((prev) => ({ ...prev, currentOrder: undefined })),
    setTermOfService: (termOfService: TermOfService) =>
      set((prev) => ({ ...prev, termOfService })),
    appName: "",
    setAppName: (appName?: string) => set((prev) => ({ ...prev, appName })),
    initialized: false,
    initStore: async () => {
      try {
        const [token, appName] = await Promise.all([
          getItem(KEY_TOKEN),
          getItem(KEY_APP_NAME),
        ]);
        set((prev) => ({
          ...prev,
          token: token,
          appName: appName || "",
          initialized: true,
        }));
      } catch (e) {
        console.error(e);
        set((prev) => ({ ...prev, initialized: true }));
      }
    },
  };

  return initialState;
});

export const unsubscribeStore = useStore.subscribe(async (state: IStore) => {
  if (state.token) {
    setItem(KEY_TOKEN, state.token);
  } else {
    removeItem(KEY_TOKEN);
  }

  if (state.appName) {
    setItem(KEY_APP_NAME, state.appName);
  } else {
    removeItem(KEY_APP_NAME);
  }
});
