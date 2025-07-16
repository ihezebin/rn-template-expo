import { create } from "zustand";

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
  setAppName: (appName: string) => void;
}

export const KEY_TOKEN = "token";
export const KEY_APP_NAME = "app_name";

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
    setAppName: (appName: string) => set((prev) => ({ ...prev, appName })),
  };

  (async () => {
    try {
      const [token, appName] = await Promise.all([
        Platform.select({
          web: Promise.resolve(localStorage.getItem(KEY_TOKEN)),
          default: AsyncStorage.getItem(KEY_TOKEN),
        }),
        Platform.select({
          web: Promise.resolve(localStorage.getItem(KEY_APP_NAME)),
          default: AsyncStorage.getItem(KEY_APP_NAME),
        }),
      ]);

      set((prev) => ({
        ...prev,
        token: token,
        appName: appName || "",
        authLoading: false,
      }));
    } catch (e) {
      set((prev) => ({ ...prev, authLoading: false }));
    }
  })();

  return initialState;
});

export const unsubscribeStore = useStore.subscribe((state: IStore) => {
  if (state.token) {
    AsyncStorage.setItem(KEY_TOKEN, state.token);
  } else {
    AsyncStorage.removeItem(KEY_TOKEN);
  }

  if (state.appName) {
    AsyncStorage.setItem(KEY_APP_NAME, state.appName);
  } else {
    AsyncStorage.removeItem(KEY_APP_NAME);
  }
});
