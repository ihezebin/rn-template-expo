import api from "@/api";
import { useStore } from "@/store";
import { Redirect, router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, SafeAreaView, StyleSheet } from "react-native";

const Index = () => {
  const {
    user,
    setUser,
    clearUser,
    setToken,
    clearToken,
    token,
    setAuthLoading,
    authLoading,
    initialized,
  } = useStore();

  const { setAppName } = useStore();
  useEffect(() => {
    api
      .get("/setting/app_name")
      .then(({ data, code }) => {
        if (code === 0) {
          setAppName(data.app_name_setting.app_name);
        } else {
          setAppName();
        }
      })
      .catch(() => {
        setAppName();
      });
  }, []);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !authLoading) {
      return;
    }
    if (!token || !user) {
      console.log("redirect to login page");
      setAuthLoading(false);
      router.replace("/(auth)/login");
      return;
    }

    if (token && user) {
      setAuthLoading(false);
      return;
    }

    api
      .get("/user/info")
      .then(({ data, code, message }) => {
        if (code === 0) {
          setUser(data.user);
          setToken(data.token); // 刷新 token
        } else {
          console.error(message);
          clearUser();
          clearToken();
        }
      })
      .catch((error) => {
        clearUser();
        clearToken();
      })
      .finally(() => {
        setAuthLoading(false);
      });
  }, [token, user, authLoading, mounted]);

  return !initialized || authLoading ? (
    <SafeAreaView style={styles.loading}>
      <ActivityIndicator size="large" />
    </SafeAreaView>
  ) : (
    <Redirect href="/(tabs)/hall" />
  );
};

export default Index;

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
