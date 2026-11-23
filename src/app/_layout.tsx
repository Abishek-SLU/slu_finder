import { DarkTheme, Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { ActivityIndicator, View } from "react-native";
import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { RegistrationProvider } from "@/context/registration-context";
import { AuthProvider, useAuth } from "@/context/auth-context";
import { colors } from "@/theme/colors";

void SplashScreen.preventAutoHideAsync();

function Navigation() {
  const { token, loading } = useAuth();
  if (loading) {
    return <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: "center" }}><ActivityIndicator color={colors.accent} accessibilityLabel="Loading session" /></View>;
  }
  return (
    <>
      <AnimatedSplashOverlay />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={!token} redirectTo="/student-home">
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
          <Stack.Screen name="verify-otp" />
        </Stack.Protected>
        <Stack.Protected guard={!!token} redirectTo="/login">
          <Stack.Screen name="student-home" />
          <Stack.Screen name="explore" />
          <Stack.Screen name="edit-profile" />
          <Stack.Screen name="select-interests" />
        </Stack.Protected>
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider value={DarkTheme}>
      <AuthProvider>
        <RegistrationProvider><Navigation /></RegistrationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
