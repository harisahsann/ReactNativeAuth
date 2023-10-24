import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from '@react-navigation/native';
import Spinner from "react-native-loading-spinner-overlay";

const ProfileScreen = ({ navigation, route }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const users = await AsyncStorage.getItem("users");
        if (users) {
          const usersArray = JSON.parse(users);
          const user = usersArray.find((user) => user.email === email && user.password === password);
          if (user && user.isDarkMode !== undefined) {
            setIsDarkMode(user.isDarkMode);
          }
        }
      } catch (error) {
        console.error("Error Fetching User: ", error)
      }
    }
    fetchUser();
  }, [email, password]);
  useFocusEffect(
    React.useCallback(() => {
      const checkUserLoginStatus = async () => {
        try {
          const users = await AsyncStorage.getItem("users");
          if (users) {
            const usersArray = JSON.parse(users);
            const loggedInUser = usersArray.find((user) => user.isLoggedIn === true);
            if (loggedInUser) {
              setEmail(loggedInUser.email);
              setUsername(loggedInUser.username);
              setPassword(loggedInUser.password);
            }
            const userIndex = usersArray.findIndex((user) => user.email === email && user.password === password);
            if (userIndex !== -1) {
              usersArray[userIndex] = {
                ...usersArray[userIndex],
                currentScreen: "Profile",
              }
              await AsyncStorage.setItem("users", JSON.stringify(usersArray));
            }
          }
        } catch (error) {
          console.error("Error Checking User Login Status: ", error);
        } finally {
          setLoading(false);
        }
      }
      checkUserLoginStatus();
    }, [email, password])
  );
  const toggleDarkMode = async () => {
    isDarkMode ? setIsDarkMode(false) : setIsDarkMode(true);
    try {
      const users = await AsyncStorage.getItem("users");
      if (users) {
        const usersArray = JSON.parse(users);
        const user = usersArray.find((user) => user.email === email && user.password === password);
        if (user) {
          const userIndex = usersArray.findIndex((user) => user.email === email && user.password === password);
          if (userIndex !== -1) {
            usersArray[userIndex] = {
              ...usersArray[userIndex],
              currentScreen: "Profile",
              isDarkMode: isDarkMode ? false : true,
            }
            await AsyncStorage.setItem("users", JSON.stringify(usersArray)).then(() => {
              Alert.alert("Theme Changed", `App Theme Changed To ${isDarkMode ? "Light" : "Dark"}`);
            }).catch((error) => {
              console.error("Error Updating AsyncStorage: ", error);
            })
          }
        } else {
          Alert.alert("Theme Change Failed", "Theme Changing Failed. Please Try Again.");
        }
      } else {
        Alert.alert("Theme Change Failed", "Theme Changing Failed. Please Try Again.");
      }
    } catch (error) {
      console.error("Error Changing Theme: ", error);
    }
  }

  const handleLogout = async () => {
    try {
      const users = await AsyncStorage.getItem("users");
      if (users) {
        const usersArray = JSON.parse(users);
        const user = usersArray.find((user) => user.email === email && user.password === password);
        if (user) {
          const userIndex = usersArray.findIndex((user) => user.email === email && user.password === password);
          if (userIndex !== -1) {
            usersArray[userIndex] = {
              ...usersArray[userIndex],
              currentScreen: "Sign Up",
              isLoggedIn: false,
            }
            await AsyncStorage.setItem("users", JSON.stringify(usersArray)).then(() => {
              Alert.alert("Logged Out", "You Have Been Successfully Logged Out.");
              navigation.navigate("Sign Up");
            }).catch((error) => {
              console.error("Error Updating AsyncStorage: ", error);
            })
          }
        }
      }
    } catch (error) {
      console.error("Error Fetching User: ", error)
    }
  }

  return (
    <View style={{ backgroundColor: isDarkMode ? "#121212" : "#F5F5F5", flex: 1, padding: 20, }}>
      {loading ? (
        <View style={styles.container}>
        <Spinner
        visible={loading}
        textContent={"Loading..."}
        textStyle={styles.spinnerText}
      />
      </View>
      ) : (
        <View>
          <View style={styles.header}>
            <Text style={{ color: isDarkMode ? "#F5F5F5" : "#121212", fontSize: 24, fontWeight: "bold", }}>{username}</Text>
            <View style={styles.modeContainer}>
              <TouchableOpacity onPress={toggleDarkMode}>
                <Ionicons name={isDarkMode ? "sunny-outline" : "moon-outline"} size={24} color={isDarkMode ? "white" : "black"} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleLogout}>
                <Ionicons name={"log-out-outline"} size={24} color={isDarkMode ? "white" : "black"} style={{ marginLeft: 15 }} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modeContainer: {
    alignItems: "center",
    flexDirection: "row",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  spinnerText: {
    fontSize: 16,
    color: "white",
  },
});

export default ProfileScreen;
