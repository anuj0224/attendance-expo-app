import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoginPage from "./screens/LoginPage";
import Layout from "./screens/Layout";
import OfflinePage from "./screens/OfflinePage";
import Toast from "react-native-toast-message";
import ForgotPasswordPage from "./screens/ForgotPasswordPage";
import {verifyToken}  from "./services/verifyToken";

const Stack = createStackNavigator();

export default function App() {
  const [isConnected, setIsConnected] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem("token");
      const user = await verifyToken(token);
      console.log(user);
      setIsLoggedIn(!!user);
    };
    checkLoginStatus();
  }, []);

  const handleRetry = () => {
    NetInfo.fetch().then((state) => {
      setIsConnected(state.isConnected);
    });
  };

  if (isLoggedIn === null) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={
          isConnected ? (isLoggedIn ? "Layout" : "Login") : "Offline"
        }
      >
        {isConnected ? (
          <>
            <Stack.Screen
              name="Login"
              component={LoginPage}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Layout"
              component={Layout}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPasswordPage}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          <Stack.Screen name="Offline">
            {(props) => <OfflinePage {...props} onRetry={handleRetry} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
      <Toast />
    </NavigationContainer>
  );
}
