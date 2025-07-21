import { useStore } from "@/store";
import { Button, Icon, Input, Text } from "@ui-kitten/components";
import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const LoginScreen = () => {
  const { appName } = useStore();
  useEffect(() => {}, []);

  const [secureTextEntry, setSecureTextEntry] = React.useState(true);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loginType, setLoginType] = useState<"pwd" | "captcha">("pwd");
  const [captcha, setCaptcha] = useState("");

  const renderPwdShowIcon = (props: any): React.ReactElement => (
    <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)}>
      <Icon
        {...props}
        style={{ ...props.style, ...styles.icon }}
        name={secureTextEntry ? "eye-off" : "eye"}
      />
    </TouchableOpacity>
  );

  const renderPwdIcon = (props: any): React.ReactElement => (
    <Icon {...props} style={{ ...props.style, ...styles.icon }} name="lock" />
  );

  const renderPhoneIcon = (props: any): React.ReactElement => (
    <Icon
      {...props}
      style={{ ...props.style, ...styles.icon }}
      name="smartphone-outline"
    />
  );

  const renderCaptchaIcon = (props: any): React.ReactElement => (
    <Icon
      {...props}
      style={{ ...props.style, ...styles.icon }}
      name="shield-outline"
    />
  );

  const handleLogin = () => {
    console.log("handleLogin");
  };

  const handleBecomeDriver = () => {};

  const handleForgetPwd = () => {};

  const [captchaInterval, setCaptchaInterval] = useState<number>(0);
  const handleGenCaptcha = () => {
    console.log("handleGenCaptcha");
    setCaptchaInterval(60);
    const interval = setInterval(() => {
      setCaptchaInterval((prev) => {
        if (prev === 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  };

  const renderGenCaptchaBtn = (props: any): React.ReactElement => (
    <TouchableOpacity onPress={handleGenCaptcha} disabled={captchaInterval > 0}>
      <Text style={styles.genCaptcha}>
        {captchaInterval > 0 ? `${captchaInterval}s` : "获取验证码"}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require("../../assets/images/login-bg.png")}
      resizeMode="cover"
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.login}>
          <View>
            <Text style={styles.title}>{appName || ""}司机登录</Text>
          </View>
          <Input
            style={styles.input}
            placeholder="请输入手机号"
            value={phone}
            onChangeText={setPhone}
            accessoryLeft={renderPhoneIcon}
          />
          {loginType === "pwd" && (
            <View style={styles.pwdWrapper}>
              <Input
                style={styles.input}
                value={password}
                placeholder="请输入密码"
                accessoryLeft={renderPwdIcon}
                accessoryRight={renderPwdShowIcon}
                secureTextEntry={secureTextEntry}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={handleForgetPwd}>
                <Text style={styles.forgetPwdBtn}>忘记密码?</Text>
              </TouchableOpacity>
            </View>
          )}
          {loginType === "captcha" && (
            <Input
              style={styles.input}
              value={captcha}
              placeholder="请输入验证码"
              accessoryLeft={renderCaptchaIcon}
              accessoryRight={renderGenCaptchaBtn}
              onChangeText={setCaptcha}
            />
          )}
          <Button onPress={handleLogin} style={styles.loginBtn}>
            登 录
          </Button>
          <View style={styles.extraWrapper}>
            <TouchableOpacity onPress={handleBecomeDriver}>
              <Text style={styles.becomeDriverBtn}>成为司机</Text>
            </TouchableOpacity>
            {loginType === "pwd" && (
              <TouchableOpacity onPress={() => setLoginType("captcha")}>
                <Text style={styles.loginTypeSwitchBtn}>验证码登录</Text>
              </TouchableOpacity>
            )}
            {loginType === "captcha" && (
              <TouchableOpacity onPress={() => setLoginType("pwd")}>
                <Text style={styles.loginTypeSwitchBtn}>密码登录</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  login: {
    flex: 1,
    width: "100%",
    padding: "8%",
  },
  title: {
    fontSize: 20,
    // fontWeight: "bold",
    marginTop: 100,
    marginBottom: 16,
  },
  input: {
    fontSize: 12,
    width: "100%",
    marginTop: 10,
  },
  pwdWrapper: {
    display: "flex",
    alignItems: "flex-end",
    gap: 10,
  },
  forgetPwdBtn: {
    fontSize: 14,
    color: "#666",
    padding: 10,
    marginRight: -10,
  },
  becomeDriverBtn: {
    fontSize: 14,
    color: "#666",
    padding: 10,
    marginLeft: -10,
  },
  loginTypeSwitchBtn: {
    fontSize: 14,
    color: "dodgerblue",
    padding: 10,
    marginRight: -10,
  },
  extraWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  genCaptcha: {
    fontSize: 14,
    color: "dodgerblue",
  },
  loginBtn: {
    marginTop: 10,
    marginBottom: 10,
  },
  icon: {
    width: 18,
    height: 18,
  },
});
