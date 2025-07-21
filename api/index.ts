import { newApi } from "./newApi";

import { KEY_TOKEN } from "@/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

const api = newApi({
  // baseURL: "https://valet.hezebin.com/api",
  baseURL: "http://localhost:8080",
  onRequest: async (request) => {
    const token = await AsyncStorage.getItem(KEY_TOKEN);
    request.headers.token = token;
    return request;
  },
  onError: (res) => {
    if (res.status === 401) {
      AsyncStorage.removeItem(KEY_TOKEN);
    } else {
      if (res.message) {
        console.error("onError:", res.message);
        Alert.alert(res.message);
      }
    }
    return res;
  },
  onAbnormal: (err, code, message) => {
    console.error("onAbnormal:", err, code, message);
    Alert.alert(message);
    return err;
  },
});

export default api;
