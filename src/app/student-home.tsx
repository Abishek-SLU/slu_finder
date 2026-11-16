
import { useEffect, useState } from "react";

import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  getToken,
  clearToken,
} from "@/services/authSession";

import { getUserDetails } from "@/services/authService";

export default function StudentHomeScreen() {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("Student");

  useEffect(() => {
    let active = true;

    async function loadUser() {
      try {
        const token = await getToken();

        if (!token) {
          router.replace("/login");
          return;
        }

        const result: any = await getUserDetails(token);

        if (active) {
          setName(
            result.loginObj?.fullName ||
            result.loginObj?.userName ||
            "Student"
          );
        }
      } catch {
        await clearToken();
        router.replace("/login");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadUser();

    return () => {
      active = false;
    };
  }, []);

  async function handleLogout() {
    await clearToken();
    router.replace("/login");
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#003DA5" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.logo}>SLU Finder</Text>

        <Text style={styles.title}>
          Welcome, {name}!
        </Text>

        <Text style={styles.subtitle}>
          You are successfully logged in.
        </Text>

        <Text style={styles.description}>
          Your SLU Finder student dashboard
          is coming next.
        </Text>

        <Pressable
          style={styles.button}
          onPress={handleLogout}
        >
          <Text style={styles.buttonText}>
            Logout
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
  card: {
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#003DA5",
    marginBottom: 30,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#14233B",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 17,
    color: "#64748B",
    marginBottom: 20,
  },
  description: {
    fontSize: 15,
    color: "#334155",
    marginBottom: 35,
  },
  button: {
    backgroundColor: "#003DA5",
    padding: 17,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
