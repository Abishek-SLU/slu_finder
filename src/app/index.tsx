import { router } from "expo-router";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BottomTabInset } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Platform } from "react-native";

const interests = ["Music", "Gaming", "Hiking"];

export default function HomeScreen() {
  const theme = useTheme();
  const { width, fontScale } = useWindowDimensions();
  const isWide = width >= 960 && fontScale <= 1.3;

  return (
    <ThemedView style={styles.screen}>
      <SafeAreaView style={styles.screen}>
        <ScrollView
          contentContainerStyle={[styles.content, isWide && styles.contentWide]}
        >
          <View style={[styles.layout, isWide && styles.layoutWide]}>
            <View style={[styles.hero, isWide && styles.heroWide]}>
              <ThemedText
                themeColor="accent"
                type="smallBold"
                style={styles.eyebrow}
              >
                YOUR CAMPUS. YOUR COMMUNITY.
              </ThemedText>

              <ThemedText
                accessibilityRole="header"
                type="title"
                style={[styles.heading, isWide && styles.headingWide]}
              >
                Find your{"\n"}people.
              </ThemedText>

              <ThemedText themeColor="textSecondary" style={styles.description}>
                Meet SLU students who share your interests. Turn a shared hobby
                into a new connection.
              </ThemedText>

              <View style={styles.interests}>
                {interests.map((interest) => (
                  <ThemedView
                    key={interest}
                    type="backgroundSelected"
                    style={styles.chip}
                  >
                    <ThemedText type="small">{interest}</ThemedText>
                  </ThemedView>
                ))}
              </View>

              <Pressable
                accessibilityRole="button"
                onPress={() => router.push("/login")}
                style={({ pressed }) => [
                  styles.button,
                  { backgroundColor: theme.primary },
                  isWide && styles.buttonWide,
                  pressed && styles.pressed,
                ]}
              >
                <ThemedText themeColor="onPrimary" style={styles.buttonText}>
                  Get started
                </ThemedText>
              </Pressable>
            </View>

            <ThemedView
              type="backgroundElement"
              style={[
                styles.preview,
                { borderColor: theme.border },
                isWide && styles.previewWide,
              ]}
            >
              <ThemedText
                themeColor="textSecondary"
                type="smallBold"
                style={styles.eyebrow}
              >
                A LOOK INSIDE
              </ThemedText>

              <ThemedText style={styles.previewHeading}>
                It starts with{"\n"}something in common.
              </ThemedText>

              <ThemedView type="backgroundSelected" style={styles.example}>
                <ThemedText themeColor="accent" type="smallBold">
                  SHARED INTERESTS
                </ThemedText>

                <ThemedText style={styles.exampleTitle}>
                  A trail. A playlist.{"\n"}A conversation.
                </ThemedText>

                <ThemedText themeColor="textSecondary">
                  Discover connections through the things you enjoy.
                </ThemedText>
              </ThemedView>

              <View style={styles.steps}>
                <Feature
                  number="01"
                  title="Discover"
                  description="Find students with shared interests."
                />
                <Feature
                  number="02"
                  title="Connect"
                  description="Send a request to introduce yourself."
                />
                <Feature
                  number="03"
                  title="Chat"
                  description="Start talking when you both agree."
                />
              </View>

              <ThemedText themeColor="textSecondary" type="small">
                Preview of the experience we’re building.
              </ThemedText>
            </ThemedView>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

type FeatureProps = {
  number: string;
  title: string;
  description: string;
};

function Feature({ number, title, description }: FeatureProps) {
  return (
    <View style={styles.feature}>
      <ThemedText themeColor="accent" type="smallBold">
        {number}
      </ThemedText>

      <View style={styles.featureText}>
        <ThemedText type="smallBold">{title}</ThemedText>
        <ThemedText themeColor="textSecondary" type="small">
          {description}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: Platform.OS === "web" ? 40 : BottomTabInset + 24,
  },
  contentWide: {
    justifyContent: "center",
    paddingVertical: 64,
    paddingHorizontal: 40,
  },
  layout: {
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
    gap: 40,
  },
  layoutWide: {
    maxWidth: 1120,
    flexDirection: "row",
    alignItems: "center",
    gap: 64,
  },
  hero: {
    gap: 24,
  },
  heroWide: {
    flex: 1,
    minWidth: 0,
  },
  eyebrow: {
    letterSpacing: 1.5,
  },
  heading: {
    fontSize: 48,
    lineHeight: 54,
    fontWeight: "700",
  },
  headingWide: {
    fontSize: 72,
    lineHeight: 78,
  },
  description: {
    fontSize: 18,
    lineHeight: 28,
    maxWidth: 460,
  },
  interests: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  button: {
    minHeight: 56,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingVertical: 16,
    marginTop: 8,
  },
  buttonWide: {
    alignSelf: "flex-start",
    minWidth: 200,
  },
  buttonText: {
    fontWeight: "700",
  },
  pressed: {
    opacity: 0.8,
  },
  preview: {
    borderWidth: 1,
    borderRadius: 28,
    padding: 24,
    gap: 24,
  },
  previewWide: {
    flex: 1,
    minWidth: 0,
    padding: 32,
  },
  previewHeading: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "700",
  },
  example: {
    borderRadius: 18,
    padding: 24,
    gap: 16,
  },
  exampleTitle: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "600",
  },
  steps: {
    gap: 20,
  },
  feature: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
  },
  featureText: {
    flex: 1,
    gap: 4,
  },
});
