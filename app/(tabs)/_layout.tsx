import IconFont from "@/components/IconFont";
import { Tabs } from "expo-router";
import React, { useEffect } from "react";
import { Platform } from "react-native";

export default function TabLayout() {
  useEffect(() => {
    console.log("tabs");
  }, []);
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "dodgerblue",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="hall"
        options={{
          title: "接单",
          tabBarIcon: ({ color }) => <IconFont name="&#xe607;" />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "订单",
          tabBarIcon: ({ color }) => <IconFont name="&#xf50a;" />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "我的",
          tabBarIcon: ({ color }) => <IconFont name="&#xe603;" />,
        }}
      />
    </Tabs>
  );
}
