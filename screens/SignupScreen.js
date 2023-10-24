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

const SignupScreen = ({navigation}) => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const handleSignup = async () => {
        try {
            const user = {
                email: email,
                username: username,
                password: password,
                currentScreen: "Log In",
                isLoggedIn: false,
                isDarkMode: false,
            }
            const existingUsers = await AsyncStorage.getItem("users");
            const usersArray = existingUsers ? JSON.parse(existingUsers) : [];
            const userExists = usersArray.some((existingUser) => existingUser.email === email);
            if (userExists) {
                Alert.alert("User Exists", "User With This Email Already Exists. Please Use A Different Email.")
            } else {
                usersArray.push(user);
                await AsyncStorage.setItem("users", JSON.stringify(usersArray));
                Alert.alert("Signup Successful", "You Have Successfully Signed Up!")
                navigation.navigate("Log In");
            }
        } catch (error) {
            console.error("Error Signing Up: ", error);
        }
    }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name="person-add"
          size={32}
          color="black"
          style={styles.headerIcon}
        />
        <Text style={styles.headerText}>Sign Up</Text>
      </View>
      <View style={styles.inputContainer}>
        <Ionicons name="mail" size={24} color="black" style={styles.icon} />
        <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} />
      </View>
      <View style={styles.inputContainer}>
        <Ionicons name="person" size={24} color="black" style={styles.icon} />
        <TextInput placeholder="Username" style={styles.input} value={username} onChangeText={setUsername} />
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
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Ionicons name="arrow-forward" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate("Log In")}>
        <Text style={styles.loginButtonText}>Already Have An Account? Log In</Text>
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
  loginButton: {
    marginTop: 10,
    alignItems: "center",
  },
  loginButtonText: {
    color: "blue",
    textDecorationLine: "underline",
  }
});

export default SignupScreen;