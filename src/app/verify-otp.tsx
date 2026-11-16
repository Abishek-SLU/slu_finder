
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  Platform,
  ActivityIndicator,
} from "react-native";

import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  sendOtp,
  verifyOtp,
  registerUser,
} from "@/services/authService";

import { useRegistration } from "@/context/registration-context";

function showMessage(title: string, message: string) {
  if (Platform.OS === "web") {
    window.alert(`${title}\n${message}`);
  } else {
    Alert.alert(title, message);
  }
}

export default function VerifyOtpScreen() {
  const { pendingRegistration, clearRegistration } =
    useRegistration();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const email = pendingRegistration?.email || "";

  async function handleVerify() {
    if (!pendingRegistration) {
      showMessage(
        "Error",
        "Registration details are missing. Please register again."
      );
      return;
    }

    if (!/^\d{4}$/.test(otp)) {
      showMessage("Error", "Enter a valid 4-digit OTP");
      return;
    }

    setLoading(true);

    try {
      await verifyOtp(email, otp);

      await registerUser(pendingRegistration);

      clearRegistration();

      showMessage(
        "Success",
        "Account created successfully. Please login."
      );

      router.replace("/login");
    } catch (error) {
      showMessage(
        "Registration Error",
        error instanceof Error
          ? error.message
          : "Unable to complete registration"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (!email) {
      showMessage(
        "Error",
        "Email address is missing. Return to registration."
      );
      return;
    }

    setLoading(true);

    try {
      await sendOtp(email);
      setOtp("");

      showMessage(
        "Success",
        "A new verification code has been sent."
      );
    } catch (error) {
      showMessage(
        "Error",
        error instanceof Error
          ? error.message
          : "Unable to resend OTP"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.logo}>SLU Finder</Text>

        <Text style={styles.title}>Verify Your Email</Text>

        <Text style={styles.subtitle}>
          Enter the 4-digit verification code sent to your SLU email.
        </Text>

        <Text style={styles.email}>{email}</Text>

        <Text style={styles.label}>Verification Code</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter 4-digit code"
          keyboardType="number-pad"
          maxLength={4}
          value={otp}
          onChangeText={setOtp}
          textAlign="center"
          autoComplete="one-time-code"
        />

        <Pressable
          style={[
            styles.button,
            loading && styles.disabledButton,
          ]}
          onPress={handleVerify}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>
              Verify & Create Account
            </Text>
          )}
        </Pressable>

        <Pressable
          onPress={handleResend}
          disabled={loading}
        >
          <Text style={styles.link}>Resend OTP</Text>
        </Pressable>

        <Pressable
          onPress={() => router.replace("/register")}
          disabled={loading}
        >
          <Text style={styles.backLink}>
            Back to Registration
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
    textAlign: "center",
    marginBottom: 30,
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
    marginBottom: 12,
  },
  email: {
    fontSize: 14,
    fontWeight: "600",
    color: "#003DA5",
    marginBottom: 24,
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
    fontSize: 22,
    letterSpacing: 2,
  },
  button: {
    backgroundColor: "#003DA5",
    padding: 17,
    borderRadius: 10,
    alignItems: "center",
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
  backLink: {
    color: "#64748B",
    textAlign: "center",
    marginTop: 20,
  },
});
