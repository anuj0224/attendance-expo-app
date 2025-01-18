import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Logo from "../components/Logo";
import Toast from "react-native-toast-message";
import Geolocation from "react-native-geolocation-service";

const AttendancePage = ({ navigation }) => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [timer, setTimer] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [totalWorkingHours, setTotalWorkingHours] = useState(0);

const requestLocationPermission = async () => {
  try {
    if (Platform.OS === "android") {
      const { PermissionsAndroid } = require("react-native");
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      // For web or iOS, you can return true or handle permissions differently
      return true;
    }
  } catch (err) {
    Alert.alert("Permission Error", err.message);
    return false;
  }
};


  const getLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "Location Permission Denied",
        text2: "Please allow location access to check in.",
      });
      return null;
    }

    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          resolve(position.coords);
        },
        (error) => {
          console.error(error);
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    });
  };

  useEffect(() => {
    const loadState = async () => {
      try {
        const storedCheckedIn = await AsyncStorage.getItem("isCheckedIn");
        const storedStartTime = await AsyncStorage.getItem("startTime");
        const storedTimer = await AsyncStorage.getItem("timer");
        const storedTotalWorkingHours = await AsyncStorage.getItem("totalWorkingHours");
        if (storedCheckedIn === "true") {
          setIsCheckedIn(true);
          if (storedStartTime) {
            setStartTime(parseInt(storedStartTime, 10));
          }
        }

        if (storedTimer) {
          setTimer(parseInt(storedTimer, 10));
        }

        if (storedTotalWorkingHours) {
          setTotalWorkingHours(parseInt(storedTotalWorkingHours, 10));
        }
      } catch (error) {
        console.error("Failed to load state", error);
      }
    };

    loadState();
  }, []);

  useEffect(() => {
    let interval;

    if (isCheckedIn && startTime) {
      interval = setInterval(() => {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        setTimer(elapsedTime);
      }, 1000);
    }
    const saveState = async () => {
      try {
        await AsyncStorage.setItem("isCheckedIn", isCheckedIn.toString());

        if (isCheckedIn && startTime !== null) {
          await AsyncStorage.setItem("startTime", startTime.toString());
        } else {
          await AsyncStorage.removeItem("startTime");
        }

        await AsyncStorage.setItem("timer", timer.toString());
        await AsyncStorage.setItem("totalWorkingHours", totalWorkingHours.toString());
      } catch (error) {
        console.error("Failed to save state", error);
      }
    };

    saveState();

    return () => {
      clearInterval(interval);
    };
  }, [isCheckedIn, timer, startTime, totalWorkingHours]);

  const formatTime = (seconds) => {
    const hours = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const sec = String(seconds % 60).padStart(2, "0");
    return `${hours}:${minutes}:${sec}`;
  };

  const handleCheckIn = async () => {
    const coords = await getLocation();
    if (!coords) return;

    const currentTime = Date.now();
    setStartTime(currentTime);
    setIsCheckedIn(true);
    setTimer(0);
    Toast.show({
      type: "success",
      position: "Top",
      text1: "Checked In!",
      text2: "You are now marked as checked in.",
    });
  };

  const handleCheckOut = async () => {
    const coords = await getLocation();
    const currentTime = Date.now();
    const workedHoursInSeconds = Math.floor((currentTime - startTime) / 1000);
    const totalHoursWorked = totalWorkingHours + workedHoursInSeconds / 3600;
    setTotalWorkingHours(totalHoursWorked);
    setIsCheckedIn(false);
    Toast.show({
      type: "success",
      position: "Top",
      text1: "Checked Out!",
      text2: "You have successfully checked out.",
    });
  };

  return (
    <View style={styles.container}>
      <Logo />
      <Text style={styles.heading}>Attendance</Text>

      {/* Check In Button */}
      {!isCheckedIn ? (
        <View>
        <TouchableOpacity style={styles.Button} onPress={() => handleCheckIn()}>
          <Text style={styles.buttonText}>Check In</Text>
        </TouchableOpacity>
      </View>
      ) : (
        <Text style={styles.timerText} onPress={handleCheckOut}>{formatTime(timer)}</Text>
      )}

      {/* Check Out Button */}
      {isCheckedIn && (
        <TouchableOpacity style={styles.Button} onPress={handleCheckOut}>
          <Text style={styles.buttonText}>Check Out</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  Button: {
    width: 200,
    height: 50,
    backgroundColor: "#6200ee",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  timerText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#6200ee",
    marginVertical: 20,
  },
});

export default AttendancePage;
