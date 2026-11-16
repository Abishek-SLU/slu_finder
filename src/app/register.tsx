
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { sendOtp } from "@/services/authService";
import { useRegistration } from "@/context/registration-context";

function showMessage(title: string, message: string) {
  if (Platform.OS === "web") {
    window.alert(`${title}\n${message}`);
  } else {
    Alert.alert(title, message);
  }
}

export default function RegisterScreen() {
  const { pendingRegistration, setPendingRegistration } =
    useRegistration();

  const [name, setName] = useState(
    pendingRegistration?.fullName || ""
  );

  const [username, setUsername] = useState(
    pendingRegistration?.userName || ""
  );

  const [email, setEmail] = useState(
    pendingRegistration?.email || ""
  );

  const [password, setPassword] = useState(
    pendingRegistration?.password || ""
  );

  const [confirmPassword, setConfirmPassword] = useState(
    pendingRegistration?.password || ""
  );

  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (
      !name.trim() ||
      !username.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      showMessage("Error", "Please fill all fields");
      return;
    }

    const studentEmail = email.trim().toLowerCase();

    if (!/^[A-Za-z0-9._%+-]+@slu\.edu$/.test(studentEmail)) {
      showMessage("Error", "Please enter your SLU email");
      return;
    }

    if (!/^[A-Za-z0-9._]{3,30}$/.test(username.trim())) {
      showMessage(
        "Error",
        "Username must be 3 to 30 characters"
      );
      return;
    }

    if (password.length < 8) {
      showMessage(
        "Error",
        "Password must be at least 8 characters"
      );
      return;
    }

    if (password !== confirmPassword) {
      showMessage("Error", "Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await sendOtp(studentEmail);

      setPendingRegistration({
        fullName: name.trim(),
        userName: username.trim(),
        email: studentEmail,
        password,
      });

      router.push("/verify-otp");
    } catch (error) {
      showMessage(
        "Registration Error",
        error instanceof Error
          ? error.message
          : "Unable to send OTP"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.form}>
          <Text style={styles.logo}>SLU Finder</Text>

          <Text style={styles.title}>Create Account</Text>

          <Text style={styles.subtitle}>
            Join the SLU student community
          </Text>

          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter full name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Choose a username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />

          <Text style={styles.label}>SLU Email</Text>
          <TextInput
            style={styles.input}
            placeholder="yourname@slu.edu"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Create password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="new-password"
          />

          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirm password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <Pressable
            style={[
              styles.button,
              loading && styles.disabledButton,
            ]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>
                Create Account
              </Text>
            )}
          </Pressable>

          <Pressable
            onPress={() => router.replace("/login")}
            disabled={loading}
          >
            <Text style={styles.link}>
              Already have an account? Login
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flexGrow: 1,
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
    textAlign: "center",
    marginBottom: 25,
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
    marginBottom: 25,
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
    marginBottom: 16,
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
  link: {
    color: "#003DA5",
    textAlign: "center",
    marginTop: 25,
    fontWeight: "600",
  },
});
