import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Spinner from "react-native-loading-spinner-overlay";

import SignupScreen from "./screens/SignupScreen";
import LoginScreen from "./screens/LoginScreen";
import ProfileScreen from "./screens/ProfileScreen";
import { useEffect, useState } from "react";

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState("Sign Up")
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const checkUserLoginStatus = async () => {
        try {
            const users = await AsyncStorage.getItem("users");
            if (users) {
                const usersArray = JSON.parse(users);
                const loggedInUser = usersArray.find((user) => user.isLoggedIn === true);
                if (loggedInUser) {
                    setInitialRoute(loggedInUser.currentScreen);
                }
            }
        } catch (error) {
            console.error("Error Checking User Login Status: ", error)
        } finally {
          setLoading(false);
        }
    }
    checkUserLoginStatus();
  }, [])
  if (loading) {
    return (
      <View style={styles.container}>
        <Spinner
        visible={loading}
        textContent={"Loading..."}
        textStyle={styles.spinnerText}
      />
      </View>
    )
  }
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen name="Sign Up" component={SignupScreen} />
        <Stack.Screen name="Log In" component={LoginScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
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