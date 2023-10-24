import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = ({navigation}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const handleLogin = async () => {
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
                            isLoggedIn: true,
                        }
                        await AsyncStorage.setItem("users", JSON.stringify(usersArray)).then(() => {
                            Alert.alert("Login Successful", "Welcome Back, " + user.username);
                            navigation.navigate("Profile", {
                                email: user.email,
                                username: user.username,
                                password: user.password,
                            })
                        }).catch((error) => {
                            console.error("Error Updating AsyncStorage: ", error);
                        })
                    }
                } else {
                    Alert.alert("Login Failed", "Invalid Email Or Password. Please Try Again.");
                }
            } else {
                Alert.alert("Login Failed", "No Registered Users Found.");
            }
        } catch (error) {
            console.error("Error Logging In: ", error);
        }
    }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name="person"
          size={32}
          color="black"
          style={styles.headerIcon}
        />
        <Text style={styles.headerText}>Log In</Text>
      </View>
      <View style={styles.inputContainer}>
        <Ionicons name="mail" size={24} color="black" style={styles.icon} />
        <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} />
      </View>
      <View style={styles.inputContainer}>
        <Ionicons
          name="lock-closed"
          size={24}
          color="black"
          style={styles.icon}
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Ionicons name="arrow-forward" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  header: {
    marginBottom: 20,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  headerIcon: {
    marginRight: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    borderColor: "gray",
    alignItems: "center",
    flexDirection: "row",
  },
  icon: {
    marginLeft: 10,
    marginRight: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
  },
  button: {
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    backgroundColor: "skyblue",
  },
});

export default LoginScreen;