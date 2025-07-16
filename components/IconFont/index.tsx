import React from "react";
import { StyleSheet, Text } from "react-native";

interface Props {
  name: string;
  size?: number;
  color?: string;
}

const IconFont = ({ name, size = 20, color = "#333" }: Props) => {
  return <Text style={[styles.icon, { fontSize: size, color }]}>{name}</Text>;
};

const styles = StyleSheet.create({
  icon: {
    fontFamily: "iconfont", // 必须和 loadAsync 的 key 一致
  },
});

export default IconFont;
