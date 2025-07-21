import api from "@/api";
import { useStore } from "@/store";
import { router } from "expo-router";
import { useEffect, useState } from "react";

export const useAuthentication = () => {
  const {
    authLoading,
    setAuthLoading,
    user,
    setUser,
    token,
    setToken,
    clearUser,
    clearToken,
    initialized,
  } = useStore();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !initialized || !authLoading) {
      return;
    }

    if (!token && !user) {
      console.log("redirect to login page");
      router.replace("/(auth)/login");
      setAuthLoading(false);
      return;
    }

    if (token && !user) {
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
          console.error(error);
          clearUser();
          clearToken();
        })
        .finally(() => {
          setAuthLoading(false);
        });
    }
  }, [authLoading, user, token, initialized, mounted]);
};
