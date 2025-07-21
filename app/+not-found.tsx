import { router, Stack } from "expo-router";
import React from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <SafeAreaView style={styles.container}>
        <Text>页面不存在</Text>
        <TouchableOpacity onPress={() => router.navigate("/(tabs)/hall")}>
          <Text style={styles.linkText}>去首页</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    flexDirection: "row",
    gap: 6,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    color: "dodgerblue",
  },
});
