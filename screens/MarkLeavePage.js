import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Pressable,
  TextInput,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { Picker } from "@react-native-picker/picker";
import Logo from "../components/Logo";
import { getHolidays, getLeaveTypes } from "../services/api";
import Toast from "react-native-toast-message";

const MarkLeavePage = () => {
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [reason, setReason] = useState("");
  const [leaveType, setLeaveType] = useState(null);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchLeaveTypes = async () => {
      try {
        const leaves = await getLeaveTypes();
        const holidaysData = await getHolidays();
        setLeaveTypes(leaves);
        setHolidays(holidaysData); // Store holidays
        setLeaveType(leaves[0]?.id || null); // Set default leave type
      } catch (error) {
        Alert.alert("Error", "Failed to load leave types.");
      }
    };

    fetchLeaveTypes();
  }, []);

  // Helper function to check if a date is a holiday
  const isHoliday = (date) => {
    return holidays.some((holiday) => holiday.date === date);
  };

  const generateMarkedDates = () => {
    let markedDates = {};

    if (selectedStartDate && selectedEndDate) {
      const startDate = new Date(selectedStartDate);
      const endDate = new Date(selectedEndDate);

      while (startDate <= endDate) {
        const dateString = startDate.toISOString().split("T")[0];

        // Mark the date as a leave day (lightgreen)
        markedDates[dateString] = {
          selected: true,
          color: "lightgreen",
          textColor: "#000",
        };

        startDate.setDate(startDate.getDate() + 1);
      }
    }

    // Mark the holidays on the calendar
    holidays.forEach((holiday) => {
      markedDates[holiday.date] = {
        marked: true,
        dotColor: "red",
        activeOpacity: 0,
      };
    });

    return markedDates;
  };

  const handleSubmit = () => {
    if (!selectedStartDate || !reason) {
      Toast.show({
        type: "error",
        text1: "Error!",
        text2: "Please fill all fields.",
      });
      return;
    }

    const leavePeriod = selectedEndDate
      ? `${selectedStartDate} to ${selectedEndDate}`
      : selectedStartDate;

    Toast.show({
      type: "success",
      text1: "Success",
      text2: `Leave marked for ${leavePeriod} with reason: ${reason} and type ID: ${leaveType}`,
    });

    setSelectedStartDate(null);
    setSelectedEndDate(null);
    setReason("");
    setLeaveType(leaveTypes[0]?.id || null);
  };

  const handleDateChange = (day) => {
    const selectedDate = day.dateString;

    if (isHoliday(selectedDate)) {
      Toast.show({
        type: "error",
        text1: "Holiday Alert!",
        text2: `The selected date ${selectedDate} is a holiday.`,
      });
      return;
    }

    if (selectedDate === selectedStartDate) {
      setSelectedStartDate(null);
      setSelectedEndDate(null);
    } else if (selectedDate === selectedEndDate) {
      setSelectedEndDate(null);
    } else if (!selectedStartDate) {
      setSelectedStartDate(selectedDate);
    } else if (!selectedEndDate && selectedDate >= selectedStartDate) {
      setSelectedEndDate(selectedDate);
    } else if (selectedDate < selectedStartDate) {
      setSelectedStartDate(selectedDate);
      setSelectedEndDate(null);
    }
  };

  const formatDate = (start, end) => {
    if (start && end) {
      return `${start} to ${end}`;
    }
    return start || "";
  };

  return (
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Logo />
        </View>
        <Pressable
      onPress={() => {
        setShowCalendar(false);
      }}
    >
        <Text style={styles.header}>Mark Leave</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowCalendar(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.inputText}>
            {formatDate(selectedStartDate, selectedEndDate) ||
              "Select Leave Dates"}
          </Text>
        </TouchableOpacity>

        {showCalendar && (
          <View style={styles.calendarContainer}>
            <Calendar
              minDate={today}
              onDayPress={handleDateChange}
              markedDates={generateMarkedDates()}
              markingType="period"
            />
          </View>
        )}

        <TextInput
          style={styles.input}
          placeholder="Enter Reason"
          placeholderTextColor="#aaa"
          value={reason}
          onChangeText={setReason}
        />

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={leaveType || ""}
            onValueChange={(itemValue) => setLeaveType(itemValue)}
            style={styles.picker}
          >
            {leaveTypes.map((type) => (
              <Picker.Item key={type.id} label={type.name} value={type.id} />
            ))}
          </Picker>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
        </Pressable>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
    justifyContent: "center",
  },
  logoContainer: {  
    alignItems: "center",
    marginTop: 0,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#6200ee",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  inputText: {
    fontSize: 16,
    color: "#333",
  },
  pickerContainer: {
    marginBottom: 10,
  },
  pickerLabel: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  picker: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  calendarContainer: {
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    elevation: 2,
    shadowOpacity: 0.1,
  },
  button: {
    backgroundColor: "#6200ee",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default MarkLeavePage;
