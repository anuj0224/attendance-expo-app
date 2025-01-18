import React, { useState } from "react";
import {
  TextInput,
  Button,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import PropTypes from "prop-types";
import Logo from "../components/Logo";
import { Ionicons } from "@expo/vector-icons";
import { loginUser } from "../services/api";

const LoginPage = ({ navigation }) => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!userId || !password) {
      Toast.show({
        type: "error",
        text1: "Error!",
        text2: "Please enter both user ID and password.",
      });
      return;
    }
    try {
      setIsLoading(true);
      const response = await loginUser(userId, password);

      if (response && response.token) {
        await AsyncStorage.setItem("token", response.token);
        Toast.show({
          type: "success",
          text1: "Login Successful!",
          text2: "Welcome to the Attendance App",
        });
        navigation.replace("Layout");
      } else {
        throw new Error("Invalid user ID or password.");
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Login Failed!",
        text2: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity>
        <Logo />
      </TouchableOpacity>
      <View style={styles.loginBox}>
        <Text style={styles.heading}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="User ID"
          value={userId}
          onChangeText={setUserId}
          keyboardType="default"
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, styles.passwordInput]}
            placeholder="Password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? "eye" : "eye-off"}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.submitButton} onPress={handleLogin}>
          <Text style={styles.submitButtonText}>
            {isLoading ? "Logging In..." : "Login"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.forgotPassword}
          onPress={() => navigation.navigate("ForgotPassword")}
        >
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
      <Toast />
    </View>
  );
};

LoginPage.propTypes = {
  navigation: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    justifyContent: "center",
    padding: 20,
  },
  loginBox: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    width: "100%",
    maxWidth: 350,
    alignSelf: "center",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: "#333",
  },
  input: {
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  submitButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 15,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  passwordContainer: {
    position: "relative",
  },
  passwordInput: {
    paddingRight: 35, // Make space for the eye icon
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: 12,
  },
  forgotPassword: {
    marginTop: 10,
    alignItems: "center",
  },
  forgotPasswordText: {
    color: "#007BFF",
    fontSize: 16,
    textDecorationLine: "underline",
  },
});

export default LoginPage;
