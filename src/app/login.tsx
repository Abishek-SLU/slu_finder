
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

import AuthShell from "../components/AuthShell";
import { AppButton, AppInput } from "../components/AppUI";
import { colors } from "../theme/colors";

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
        throw new Error(
          "Login token missing from server response"
        );
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
    <AuthShell
      eyebrow="Welcome back"
      title="Log in."
      description="Sign in to connect with your SLU community."
    >
      <AppInput
        label="Username or SLU Email"
        placeholder="Enter your username or email"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        autoComplete="username"
        editable={!loading}
      />

      <AppInput
        label="Password"
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="current-password"
        editable={!loading}
        onSubmitEditing={() => {
          if (!loading) {
            void handleLogin();
          }
        }}
      />

      <View style={styles.loginButton}>
        <AppButton
          title="Log In →"
          variant="accent"
          onPress={handleLogin}
          loading={loading}
        />
      </View>

      <View style={styles.separator}>
        <View style={styles.line} />
        <Text style={styles.orText}>NEW TO SLU FINDER?</Text>
        <View style={styles.line} />
      </View>

      <Pressable
        onPress={() => router.push("/register")}
        disabled={loading}
        style={styles.registerButton}
      >
        <Text style={styles.registerText}>
          Don't have an account?{" "}
          <Text style={styles.registerLink}>
            Create one →
          </Text>
        </Text>
      </Pressable>

      <Text style={styles.bottomMessage}>
        Connect with students, discover interests,
        and find your people.
      </Text>
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  loginButton: {
    marginTop: 12,
  },
  separator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 28,
    marginBottom: 20,
  },
  line: {
    height: 1,
    flex: 1,
    backgroundColor: colors.border,
  },
  orText: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
  },
  registerButton: {
    paddingVertical: 12,
    alignItems: "center",
  },
  registerText: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: "center",
  },
  registerLink: {
    color: colors.accent,
    fontWeight: "800",
  },
  bottomMessage: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 25,
  },
});
