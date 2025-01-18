import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import employeeData from "../assets/employee.json";

const HomePage = () => {
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([
    {
      type: "Sick Leave",
      remaining: 5,
    },
    {
      type: "Casual Leave",
      remaining: 10,
    },
  ]);
  
  const [birthdays, setBirthdays] = useState([]);
  const [onLeave, setOnLeave] = useState([]);

  useEffect(() => {
    // Fetch attendance data
    // const fetchAttendance = async () => {
    //   try {
    //     const response = await fetch("https://api.example.com/attendance");
    //     const data = await response.json();
    //     setAttendance(data);
    //     await AsyncStorage.setItem("attendance", JSON.stringify(data));
    //   } catch (error) {
    //     console.error("Error fetching attendance data:", error);
    //     const storedAttendance = await AsyncStorage.getItem("attendance");
    //     if (storedAttendance) {
    //       setAttendance(JSON.parse(storedAttendance));
    //     }
    //   }
    // };

    // // Fetch leave data
    // const fetchLeaves = async () => {
    //   try {
    //     const response = await fetch("https://api.example.com/leaves");
    //     const data = await response.json();
    //     setLeaves(data);
    //     await AsyncStorage.setItem("leaves", JSON.stringify(data));
    //   } catch (error) {
    //     console.error("Error fetching leave data:", error);
    //     const storedLeaves = await AsyncStorage.getItem("leaves");
    //     if (storedLeaves) {
    //       setLeaves(JSON.parse(storedLeaves));
    //     }
    //   }
    // };

    // Fetch birthdays and on leave data
    const fetchEmployeeData = () => {
      const today = new Date();
      const currentDate = today.getDate();
      const currentMonth = today.getMonth() + 1;

      const birthdays = employeeData.employees.filter((emp) => {
        if (!emp.birthday) return false;
        const [year, month, day] = emp.birthday.split("-").map(Number);
        return day === currentDate && month === currentMonth;
      });

      const onLeave = employeeData.employees.filter((emp) => {
        const leaveStartDate = new Date(emp.leaveStartDate);
        const leaveEndDate = new Date(emp.leaveEndDate);
        return leaveStartDate <= new Date() && leaveEndDate >= new Date();
      });

      setBirthdays(birthdays);
      setOnLeave(onLeave);
    };
    // fetchAttendance();
    // fetchLeaves();
    fetchEmployeeData();
  }, []);

  const currentMonthRange = `${new Date().toLocaleString("default", {
    month: "long",
  })} ${new Date().getFullYear()}`;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Current Month Attendance</Text>
        <Text style={styles.cardSubtitle}>{currentMonthRange}</Text>
        <Text style={styles.cardContent}>
          {attendance.length} days attended
        </Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Leaves Remaining</Text>
        {leaves.map((leave, index) => (
          <Text key={index} style={styles.cardContent}>
            {leave.type}: {leave.remaining}
          </Text>
        ))}
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today's Birthdays</Text>
        {birthdays.length > 0 ? (
          birthdays.map((emp, index) => (
            <Text key={index} style={styles.cardContent}>
              {emp.name}
            </Text>
          ))
        ) : (
          <Text style={styles.cardContent}>No birthdays today</Text>
        )}
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Colleagues on Leave</Text>
        {onLeave.length > 0 ? (
          onLeave.map((emp, index) => (
            <Text key={index} style={styles.cardContent}>
              {emp.name}
            </Text>
          ))
        ) : (
          <Text style={styles.cardContent}>No colleagues on leave</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#888",
    marginBottom: 10,
  },
  cardContent: {
    fontSize: 16,
    color: "#333",
  },
});

export default HomePage;
