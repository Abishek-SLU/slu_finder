
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";

import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { loginUser } from "@/services/authService";
import { saveToken } from "@/services/authSession";

function showMessage(title: string, message: string) {
  if (Platform.OS === "web") {
    window.alert(`${title}\n${message}`);
  } else {
    Alert.alert(title, message);
  }
}

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!username.trim() || !password) {
      showMessage(
        "Error",
        "Please enter username and password"
      );
      return;
    }

    setLoading(true);

    try {
      const result = await loginUser(
        username.trim(),
        password
      );

      if (!result.jwt) {
        throw new Error("Login token missing from server response");
      }

      await saveToken(result.jwt);

      router.replace("/student-home");
    } catch (error) {
      showMessage(
        "Login Failed",
        error instanceof Error
          ? error.message
          : "Unable to login"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.logo}>SLU Finder</Text>

        <Text style={styles.title}>Welcome Back!</Text>

        <Text style={styles.subtitle}>
          Sign in to connect with SLU students
        </Text>

        <Text style={styles.label}>
          Username or SLU Email
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter username or email"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoComplete="username"
        />

        <Text style={styles.label}>Password</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Pressable
          style={[
            styles.button,
            loading && styles.disabledButton,
          ]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </Pressable>

        <Pressable
          onPress={() => router.push("/register")}
          disabled={loading}
        >
          <Text style={styles.register}>
            Don't have an account? Sign Up
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    padding: 24,
  },
  form: {
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
  },
  logo: {
    fontSize: 23,
    fontWeight: "bold",
    color: "#003DA5",
    marginBottom: 30,
    textAlign: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#14233B",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: "#64748B",
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#003DA5",
    padding: 17,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  register: {
    color: "#003DA5",
    textAlign: "center",
    marginTop: 25,
    fontWeight: "600",
  },
});
