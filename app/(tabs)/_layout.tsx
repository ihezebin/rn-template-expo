import { useStore } from "@/store";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, Text } from "react-native";

export default function TabLayout() {
  const { authLoading } = useStore();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "大厅",
          tabBarIcon: ({ color }) => <Text>大厅</Text>,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "订单",
          tabBarIcon: ({ color }) => <Text>订单</Text>,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "我的",
          tabBarIcon: ({ color }) => <Text>我的</Text>,
        }}
      />
    </Tabs>
  );
}
