
import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { router } from "expo-router";

import ResponsiveScreen from "../components/ResponsiveScreen";
import {
  AppButton,
  AppCard,
  SectionTitle,
} from "../components/AppUI";

import { colors } from "../theme/colors";

type Feature = {
  icon: string;
  title: string;
  description: string;
  status: string;
};

const features: Feature[] = [
  {
    icon: "👥",
    title: "Find Students",
    description:
      "Discover students around SLU and connect with people who share your interests.",
    status: "COMING SOON",
  },
  {
    icon: "🎯",
    title: "Interest Matching",
    description:
      "Find students who enjoy the same hobbies, activities, and subjects as you.",
    status: "COMING SOON",
  },
  {
    icon: "🎉",
    title: "Campus Events",
    description:
      "Explore student activities, events, and opportunities around campus.",
    status: "COMING SOON",
  },
  {
    icon: "💬",
    title: "Student Connections",
    description:
      "Build new friendships and stay connected with your SLU community.",
    status: "COMING SOON",
  },
];

export default function ExploreScreen() {
  const { width } = useWindowDimensions();

  const desktop = width >= 900;

  return (
    <ResponsiveScreen>
      {/* Navigation */}
      <View style={styles.navbar}>
        <Pressable
          onPress={() => router.replace("/student-home")}
        >
          <Text style={styles.logo}>
            SLU <Text style={styles.logoAccent}>Finder.</Text>
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.replace("/student-home")}
          style={styles.backButton}
        >
          <Text style={styles.backText}>
            ← Dashboard
          </Text>
        </Pressable>
      </View>

      {/* Header */}
      <View style={styles.header}>
        <SectionTitle
          eyebrow="EXPLORE SLU"
          title="Discover your community."
          subtitle="Find new opportunities, explore shared interests, and make your campus experience more connected."
        />
      </View>

      {/* Hero */}
      <View
        style={[
          styles.hero,
          {
            flexDirection: desktop ? "row" : "column",
          },
        ]}
      >
        <View style={styles.heroContent}>
          <Text style={styles.heroEyebrow}>
            CAMPUS CONNECTIONS
          </Text>

          <Text
            style={[
              styles.heroTitle,
              { fontSize: desktop ? 43 : 33 },
            ]}
          >
            Your people are{"\n"}
            <Text style={styles.accent}>
              out there.
            </Text>
          </Text>

          <Text style={styles.heroDescription}>
            SLU Finder is designed to help you meet students,
            share interests, and feel more connected to your
            university community.
          </Text>

          <View style={styles.heroAction}>
            <AppButton
              title="Choose Your Interests →"
              variant="accent"
              onPress={() => router.push("/select-interests")}
            />
          </View>
        </View>

        <View style={styles.heroVisual}>
          <Text style={styles.visualIcon}>✦</Text>

          <Text style={styles.visualTitle}>
            Meet.{"\n"}
            Discover.{"\n"}
            Belong.
          </Text>

          <View style={styles.statusPill}>
            <View style={styles.statusDot} />

            <Text style={styles.statusText}>
              MORE FEATURES ON THE WAY
            </Text>
          </View>
        </View>
      </View>

      {/* Features */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionEyebrow}>
          WHAT'S NEXT
        </Text>

        <Text style={styles.sectionTitle}>
          Explore more possibilities.
        </Text>

        <Text style={styles.sectionDescription}>
          We're building more ways for SLU students to
          connect with each other.
        </Text>
      </View>

      <View style={styles.featureGrid}>
        {features.map((feature) => (
          <View
            key={feature.title}
            style={[
              styles.featureItem,
              {
                width: desktop ? "48%" : "100%",
              },
            ]}
          >
            <AppCard>
              <View style={styles.featureTop}>
                <View style={styles.featureIconBox}>
                  <Text style={styles.featureIcon}>
                    {feature.icon}
                  </Text>
                </View>

                <View style={styles.featureBadge}>
                  <Text style={styles.featureBadgeText}>
                    {feature.status}
                  </Text>
                </View>
              </View>

              <Text style={styles.featureTitle}>
                {feature.title}
              </Text>

              <Text style={styles.featureDescription}>
                {feature.description}
              </Text>
            </AppCard>
          </View>
        ))}
      </View>

      {/* Interests CTA */}
      <View style={styles.bottomCard}>
        <View
          style={[
            styles.bottomContent,
            {
              flexDirection: desktop ? "row" : "column",
            },
          ]}
        >
          <View style={styles.bottomText}>
            <Text style={styles.bottomEyebrow}>
              START HERE
            </Text>

            <Text style={styles.bottomTitle}>
              Show the world what you're into.
            </Text>

            <Text style={styles.bottomDescription}>
              Add your favorite interests to your student
              profile and get ready to discover your community.
            </Text>
          </View>

          <View style={styles.bottomAction}>
            <AppButton
              title="Manage My Interests →"
              variant="accent"
              onPress={() => router.push("/select-interests")}
            />
          </View>
        </View>
      </View>

      {/* Footer */}
      <Text style={styles.footer}>
        SLU FINDER / BUILT FOR SAINT LOUIS UNIVERSITY
      </Text>
    </ResponsiveScreen>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  logo: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "900",
  },

  logoAccent: {
    color: colors.accent,
  },

  backButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },

  backText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "700",
  },

  header: {
    marginTop: 48,
    marginBottom: 15,
  },

  hero: {
    width: "100%",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    overflow: "hidden",
    marginTop: 20,
  },

  heroContent: {
    flex: 1.2,
    minWidth: 0,
    padding: 32,
    justifyContent: "center",
  },

  heroEyebrow: {
    color: colors.accent,
    fontSize: 11,
    letterSpacing: 2,
    fontWeight: "800",
    marginBottom: 18,
  },

  heroTitle: {
    color: colors.text,
    fontWeight: "900",
    lineHeight: 52,
  },

  accent: {
    color: colors.accent,
  },

  heroDescription: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 25,
    marginTop: 20,
    maxWidth: 500,
  },

  heroAction: {
    marginTop: 30,
    maxWidth: 280,
  },

  heroVisual: {
    flex: 1,
    minWidth: 0,
    backgroundColor: colors.primary,
    padding: 35,
    minHeight: 350,
    justifyContent: "space-between",
  },

  visualIcon: {
    color: colors.accent,
    fontSize: 40,
  },

  visualTitle: {
    color: colors.text,
    fontSize: 38,
    lineHeight: 48,
    fontWeight: "900",
  },

  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#FFFFFF40",
    borderRadius: 100,
    paddingHorizontal: 15,
    paddingVertical: 11,
    gap: 8,
  },

  statusDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },

  statusText: {
    color: colors.text,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },

  sectionHeader: {
    marginTop: 70,
    marginBottom: 25,
  },

  sectionEyebrow: {
    color: colors.accent,
    fontSize: 11,
    letterSpacing: 2,
    fontWeight: "800",
    marginBottom: 12,
  },

  sectionTitle: {
    color: colors.text,
    fontSize: 30,
    fontWeight: "900",
  },

  sectionDescription: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 24,
    marginTop: 12,
  },

  featureGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 18,
  },

  featureItem: {
    minWidth: 0,
  },

  featureTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginBottom: 26,
  },

  featureIconBox: {
    width: 54,
    height: 54,
    borderRadius: 15,
    backgroundColor: colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },

  featureIcon: {
    fontSize: 26,
  },

  featureBadge: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  featureBadgeText: {
    color: colors.accent,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
  },

  featureTitle: {
    color: colors.text,
    fontSize: 21,
    fontWeight: "800",
    marginBottom: 12,
  },

  featureDescription: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 23,
  },

  bottomCard: {
    marginTop: 65,
    backgroundColor: colors.primary,
    borderRadius: 24,
    padding: 32,
  },

  bottomContent: {
    justifyContent: "space-between",
    alignItems: "center",
    gap: 28,
  },

  bottomText: {
    flex: 1,
    minWidth: 0,
    width: "100%",
  },

  bottomEyebrow: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 12,
  },

  bottomTitle: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "900",
    lineHeight: 36,
  },

  bottomDescription: {
    color: "#DCE7FF",
    fontSize: 14,
    lineHeight: 23,
    marginTop: 12,
  },

  bottomAction: {
    width: "100%",
    maxWidth: 270,
  },

  footer: {
    color: colors.textMuted,
    fontSize: 10,
    letterSpacing: 1.5,
    textAlign: "center",
    marginTop: 65,
    marginBottom: 25,
  },
});
