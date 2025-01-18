import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { getUserById, updateEmployee } from "../services/api";
import { verifyToken } from "../services/verifyToken";
import { hashPassword } from "../services/passwordUtils";

const ProfilePage = () => {
  const [employee, setEmployee] = useState({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [userId,setUserId]=useState(0);

  useEffect(() => {
    const fetchUserId = async () => {
      const token = await AsyncStorage.getItem("token");
      const decodedToken = await verifyToken(token);
      console.log("Decoded token:", decodedToken);
      setUserId(decodedToken.user_id);
    };
  
    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchEmployee = async () => {
      if (!userId) return;
      try {
        const user = await getUserById(userId);
        if (!user) return;
        if (user) {
          setEmployee(user);
          setName(user.name);
          setEmail(user.email);
          setPhone(user.phone);
          setPassword('');
          console.log(user)
          if (user.gender === 'Male') {
            setProfilePhoto(require("../assets/icon1.png"));
          } else if (user.gender === 'Female') {
            setProfilePhoto(require("../assets/icon2.png"));
          } else {
            setProfilePhoto(require("../assets/comlogo.png")); 
          }
        } else {
          console.error("Employee not found in employee.json");
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };

    fetchEmployee();
  }, [userId]);

  const handleSave = async () => {
    try {
      console.log(password);
      let updatedEmployee = {
        name,
        email,
        phone,
        // profilePhoto: profilePhoto.uri || profilePhoto,
      };
      if (password && password !== employee.password) {
        updatedEmployee = { ...updatedEmployee, password: password };
        await updateEmployee(employee.id, updatedEmployee);
      }
      else{
        await updateEmployee(employee.id, updatedEmployee);
      }
      setEmployee(updatedEmployee);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
    }
};


  // const pickImage = async () => {
  //   let result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: [ImagePicker.MediaType.IMAGE],
  //     allowsEditing: true,
  //     aspect: [4, 3],
  //     quality: 1,
  //   });

  //   if (!result.canceled) {
  //     setProfilePhoto({ uri: result.assets[0].uri });
  //   }
  // };

  // if (!employee) {
  //   return null;
  // }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <TouchableOpacity
          // onPress={pickImage}
          style={styles.imageContainer}
        >
          <Image source={profilePhoto} style={styles.profilePhoto} />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name || ""}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email || ""}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone"
          value={phone || ""}
          onChangeText={setPhone}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={!passwordVisible}
            value={password||''}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setPasswordVisible(!passwordVisible)} // Toggle password visibility
          >
            <Ionicons
              name={passwordVisible ? "eye-off" : "eye"}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    marginTop: 20,
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#6200ee",
    marginBottom: 15,
  },
  input: {
    height: 45,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  eyeIcon: {
    position: "absolute",
    right: 15,
    top: 10,
  },
  saveButton: {
    backgroundColor: "#6200ee",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 15,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ProfilePage;
