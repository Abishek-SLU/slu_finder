import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";

import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "react-native";

import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { RegistrationProvider } from "@/context/registration-context";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <RegistrationProvider>
        <AnimatedSplashOverlay />

        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />

          <Stack.Screen name="login" options={{ headerShown: false }} />

          <Stack.Screen name="register" options={{ headerShown: false }} />

          <Stack.Screen name="verify-otp" options={{ headerShown: false }} />

          <Stack.Screen name="student-home" options={{ headerShown: false }} />

          <Stack.Screen name="explore" options={{ headerShown: false }} />
          <Stack.Screen name="edit-profile" options={{ headerShown: false }} />

          <Stack.Screen
            name="select-interests"
            options={{ headerShown: false }}
          />
        </Stack>
      </RegistrationProvider>
    </ThemeProvider>
  );
}
