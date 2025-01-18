import React, { useState, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, StyleSheet, View, Text } from "react-native";
import PropTypes from "prop-types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProfilePage from "../screens/ProfilePage";
import HomePage from "../screens/HomePage";
import PolicyPage from "../screens/PolicyPage";
import AttendancePage from "../screens/AttendancePage";
import LeaveRequestPage from "../screens/LeaveRequestPage";
import MarkLeavePage from "../screens/MarkLeavePage";
import { getUserById } from "../services/api";
import { verifyToken } from "../services/verifyToken";

// TabBarIcon component
const TabBarIcon = ({ route, focused, color, size, unreadCount }) => {
  let iconName;

  switch (route.name) {
    case "Home":
      iconName = focused ? "home" : "home-outline";
      break;
    case "HR Policy":
      iconName = focused ? "book" : "book-outline";
      break;
    case "Profile":
      iconName = focused ? "person-circle" : "person-circle-outline";
      break;
    case "Attendance":
      iconName = focused ? "time" : "time-outline";
      break;
    case "Leave Request":
      iconName = focused ? "paper-plane" : "paper-plane-outline";
      break;
    case "Mark Leave":
      iconName = focused ? "checkmark-circle" : "checkmark-circle-outline";
      break;
    default:
      iconName = "home";
  }

  return (
    <View>
      <Ionicons name={iconName} size={size} color={color} />
      {route.name === "Leave Request" && unreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{unreadCount}</Text>
        </View>
      )}
    </View>
  );
};

const CustomTabBarButton = ({ children, onPress }) => (
  <TouchableOpacity style={styles.customButton} onPress={onPress}>
    {children}
  </TouchableOpacity>
);

const Tab = createBottomTabNavigator();

const CustomBottomTabs = () => {
  const [unreadCount, setUnreadCount] = useState(3);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const fetchUserType = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const decodedToken = await verifyToken(token);
        console.log("Decoded token:", decodedToken);
        const user = await getUserById(decodedToken.user_id);
        setUserType(parseInt(user.user_type, 10));
      } catch (error) {
        console.error("Error fetching user_type:", error);
      }
    };

    fetchUserType();
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: (props) => (
          <TabBarIcon route={route} unreadCount={unreadCount} {...props} />
        ),
        tabBarButton: (props) => <CustomTabBarButton {...props} />,
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: styles.tabBarStyle,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomePage}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Attendance"
        component={AttendancePage}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Mark Leave"
        component={MarkLeavePage}
        options={{ headerShown: false }}
      />
      {userType === 1 && ( 
        <Tab.Screen
          name="Leave Request"
          component={LeaveRequestPage}
          options={{ headerShown: false }}
        />
      )}
      <Tab.Screen
        name="HR Policy"
        component={PolicyPage}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfilePage}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

TabBarIcon.propTypes = {
  route: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
  focused: PropTypes.bool.isRequired,
  color: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  unreadCount: PropTypes.number,
};

CustomTabBarButton.propTypes = {
  children: PropTypes.node.isRequired,
  onPress: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  screen: {
    justifyContent: "center",
    alignItems: "center",
  },
  customButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabBarStyle: {
    backgroundColor: "white",
    borderRadius: 30,
    marginHorizontal: 20,
    height: 60,
    position: "absolute",
    left: 0,
    bottom: 20,
    right: 0,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  badge: {
    position: "absolute",
    right: -6,
    top: -3,
    backgroundColor: "red",
    borderRadius: 6,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
});

export default CustomBottomTabs;
