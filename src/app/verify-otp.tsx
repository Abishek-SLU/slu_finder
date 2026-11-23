import { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { router } from "expo-router";

import { AppButton } from "../components/AppUI";
import AuthShell from "../components/AuthShell";
import { colors } from "../theme/colors";

import { registerUser, sendOtp, verifyOtp } from "@/services/authService";

import { useRegistration } from "@/context/registration-context";

function showMessage(title: string, message: string) {
  if (Platform.OS === "web") {
    window.alert(`${title}\n${message}`);
  } else {
    Alert.alert(title, message);
  }
}

export default function VerifyOtpScreen() {
  const { pendingRegistration, clearRegistration } = useRegistration();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const email = pendingRegistration?.email || "";

  async function handleVerify() {
    if (!pendingRegistration) {
      showMessage(
        "Error",
        "Registration details are missing. Please register again.",
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

      showMessage("Success", "Account created successfully. Please login.");

      router.replace("/login");
    } catch (error) {
      showMessage(
        "Registration Error",
        error instanceof Error
          ? error.message
          : "Unable to complete registration",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (!email) {
      showMessage("Error", "Email address is missing. Return to registration.");
      return;
    }

    setLoading(true);

    try {
      await sendOtp(email);
      setOtp("");

      showMessage("Success", "A new verification code has been sent.");
    } catch (error) {
      showMessage(
        "Error",
        error instanceof Error ? error.message : "Unable to resend OTP",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Almost there"
      title="Verify email."
      description="Enter the 4-digit verification code sent to your SLU email address."
    >
      <View style={styles.emailBox}>
        <View style={styles.emailIcon}>
          <Text style={styles.emailIconText}>@</Text>
        </View>

        <View style={styles.emailDetails}>
          <Text style={styles.emailLabel}>VERIFICATION CODE SENT TO</Text>

          <Text style={styles.emailText}>{email || "Email unavailable"}</Text>
        </View>
      </View>

      <Text style={styles.label}>4-Digit Verification Code</Text>

      <TextInput
        style={styles.otpInput}
        placeholder="0000"
        placeholderTextColor={colors.textMuted}
        keyboardType="number-pad"
        maxLength={4}
        value={otp}
        onChangeText={(value) => setOtp(value.replace(/\D/g, ""))}
        textAlign="center"
        autoComplete="one-time-code"
        autoCapitalize="none"
        editable={!loading}
        accessibilityLabel="4-digit verification code"
        onSubmitEditing={() => {
          if (!loading) {
            void handleVerify();
          }
        }}
      />

      <Text style={styles.helpText}>
        Check your inbox for the verification code.
      </Text>

      <View style={styles.buttonWrap}>
        <AppButton
          title="Verify & Create Account →"
          variant="accent"
          onPress={handleVerify}
          loading={loading}
          disabled={!pendingRegistration || otp.length !== 4}
        />
      </View>

      <View style={styles.resendRow}>
        <Text style={styles.resendText}>Didn&apos;t receive the code?</Text>

        <Pressable onPress={handleResend} disabled={loading || !email}>
          <Text
            style={[
              styles.resendLink,
              (loading || !email) && styles.disabledLink,
            ]}
          >
            Resend OTP →
          </Text>
        </Pressable>
      </View>

      <View style={styles.divider} />

      <Pressable
        onPress={() => router.replace("/register")}
        disabled={loading}
        style={styles.backButton}
      >
        <Text style={styles.backText}>← Back to Registration</Text>
      </Pressable>

      <View style={styles.securityNote}>
        <Text style={styles.securityIcon}>✦</Text>

        <Text style={styles.securityText}>
          Email verification helps keep the SLU Finder community secure.
        </Text>
      </View>
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  emailBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 16,
    marginBottom: 28,
    gap: 14,
  },

  emailIcon: {
    backgroundColor: colors.primary,
    width: 45,
    height: 45,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  emailIconText: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "900",
  },

  emailDetails: {
    flex: 1,
    minWidth: 0,
  },

  emailLabel: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 6,
  },

  emailText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
  },

  label: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 12,
  },

  otpInput: {
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    color: colors.text,
    minHeight: 72,
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: 12,
    paddingHorizontal: 16,
  },

  helpText: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 12,
    lineHeight: 19,
  },

  buttonWrap: {
    marginTop: 24,
  },

  resendRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 26,
  },

  resendText: {
    color: colors.textSecondary,
    fontSize: 13,
  },

  resendLink: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: "800",
  },

  disabledLink: {
    opacity: 0.4,
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 28,
  },

  backButton: {
    alignItems: "center",
    paddingVertical: 10,
  },

  backText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "600",
  },

  securityNote: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    marginTop: 32,
  },

  securityIcon: {
    color: colors.accent,
    fontSize: 20,
    fontWeight: "900",
  },

  securityText: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 19,
    flex: 1,
  },
});
