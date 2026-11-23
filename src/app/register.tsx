import { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { router } from "expo-router";

import { AppButton, AppInput } from "../components/AppUI";
import AuthShell from "../components/AuthShell";
import { colors } from "../theme/colors";

import { useRegistration } from "@/context/registration-context";
import { sendOtp } from "@/services/authService";

function showMessage(title: string, message: string) {
  if (Platform.OS === "web") {
    window.alert(`${title}\n${message}`);
  } else {
    Alert.alert(title, message);
  }
}

export default function RegisterScreen() {
  const { pendingRegistration, setPendingRegistration } = useRegistration();

  const [name, setName] = useState(pendingRegistration?.fullName || "");

  const [username, setUsername] = useState(pendingRegistration?.userName || "");

  const [email, setEmail] = useState(pendingRegistration?.email || "");

  const [password, setPassword] = useState(pendingRegistration?.password || "");

  const [confirmPassword, setConfirmPassword] = useState(
    pendingRegistration?.password || "",
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
      showMessage("Error", "Username must be 3 to 30 characters");
      return;
    }

    if (password.length < 8) {
      showMessage("Error", "Password must be at least 8 characters");
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
        error instanceof Error ? error.message : "Unable to send OTP",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Join the community"
      title="Create account."
      description="Your campus journey starts here. Sign up with your SLU email to find your people."
    >
      <AppInput
        label="Full Name"
        placeholder="Enter your full name"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        autoComplete="name"
        editable={!loading}
      />

      <AppInput
        label="Username"
        placeholder="Choose a username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        autoComplete="username"
        editable={!loading}
      />

      <AppInput
        label="SLU Email"
        placeholder="yourname@slu.edu"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        editable={!loading}
      />

      <View style={styles.emailHint}>
        <Text style={styles.hintIcon}>✦</Text>

        <Text style={styles.hintText}>
          Only Saint Louis University email addresses (@slu.edu) are accepted.
        </Text>
      </View>

      <AppInput
        label="Password"
        placeholder="Create a password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="new-password"
        editable={!loading}
      />

      <Text style={styles.passwordHint}>Use at least 8 characters.</Text>

      <AppInput
        label="Confirm Password"
        placeholder="Re-enter your password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        autoComplete="new-password"
        editable={!loading}
        onSubmitEditing={() => {
          if (!loading) {
            void handleRegister();
          }
        }}
      />

      <View style={styles.buttonWrap}>
        <AppButton
          title="Create Account →"
          variant="accent"
          onPress={handleRegister}
          loading={loading}
        />
      </View>

      <Text style={styles.verificationNote}>
        We&apos;ll send a 4-digit verification code to your SLU email before creating
        your account.
      </Text>

      <View style={styles.separator}>
        <View style={styles.line} />
        <Text style={styles.orText}>ALREADY A MEMBER?</Text>
        <View style={styles.line} />
      </View>

      <Pressable
        onPress={() => router.replace("/login")}
        disabled={loading}
        style={styles.loginLinkButton}
      >
        <Text style={styles.loginText}>
          Already have an account?{" "}
          <Text style={styles.loginLink}>Log in →</Text>
        </Text>
      </Pressable>
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  emailHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 13,
    marginTop: -4,
    marginBottom: 18,
  },

  hintIcon: {
    color: colors.accent,
    fontSize: 17,
    fontWeight: "800",
  },

  hintText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 19,
  },

  passwordHint: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: -10,
    marginBottom: 16,
  },

  buttonWrap: {
    marginTop: 12,
  },

  verificationNote: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 18,
  },

  separator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 30,
    marginBottom: 18,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },

  orText: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
  },

  loginLinkButton: {
    alignItems: "center",
    paddingVertical: 12,
  },

  loginText: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: "center",
  },

  loginLink: {
    color: colors.accent,
    fontWeight: "800",
  },
});
