import StaggerEntrance from "../components/StaggerEntrance";
import PageEntrance from "../components/PageEntrance";
import { router } from "expo-router";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";

import { AppButton, AppCard } from "../components/AppUI";
import ResponsiveScreen from "../components/ResponsiveScreen";
import { colors } from "../theme/colors";

export default function LandingScreen() {
  const { width } = useWindowDimensions();
  const desktop = width >= 900;

  return (
    <ResponsiveScreen stagger={false}>
      <PageEntrance direction="bottom" style={styles.nav}>
        <View style={styles.logoRow}>
          <View style={styles.logoMark}>
            <Text style={styles.logoMarkText}>S</Text>
          </View>

          <Text style={styles.brand}>SLU Finder</Text>
        </View>

        <Text style={styles.navLabel}>BUILT FOR SLU STUDENTS</Text>
      </PageEntrance>

      <View
        style={[styles.hero, { flexDirection: desktop ? "row" : "column" }]}
      >
        <StaggerEntrance directions={["bottom"]} style={styles.heroContent}>
          <Text style={styles.eyebrow}>YOUR CAMPUS. YOUR COMMUNITY.</Text>

          <Text style={[styles.heroTitle, { fontSize: desktop ? 68 : 44 }]}>
            Find your{"\n"}
            <Text style={styles.accent}>people.</Text>
          </Text>

          <Text style={styles.description}>
            Meet students who share your interests, discover campus connections,
            and make your university experience better.
          </Text>

          <View style={styles.action}>
            <AppButton
              title="Get Started  →"
              variant="accent"
              onPress={() => router.replace("/login")}
            />
          </View>

          <Text style={styles.smallText}>
            Made for the Saint Louis University community.
          </Text>
        </StaggerEntrance>

        <StaggerEntrance directions={["bottom"]} style={styles.heroVisual}>
          <View style={styles.visualHeader}>
            <View style={styles.statusDot} />
            <Text style={styles.visualHeaderText}>YOUR COMMUNITY</Text>
          </View>

          <Text style={styles.visualTitle}>Better together.</Text>

          <View style={styles.visualCard}>
            <Text style={styles.visualEmoji}>🎓</Text>
            <View style={styles.visualText}>
              <Text style={styles.visualName}>SLU Students</Text>
              <Text style={styles.visualSub}>Connect across campus</Text>
            </View>
          </View>

          <View style={styles.visualCard}>
            <Text style={styles.visualEmoji}>🎮</Text>
            <View style={styles.visualText}>
              <Text style={styles.visualName}>Shared Interests</Text>
              <Text style={styles.visualSub}>Find people like you</Text>
            </View>
          </View>

          <View style={styles.visualCard}>
            <Text style={styles.visualEmoji}>✨</Text>
            <View style={styles.visualText}>
              <Text style={styles.visualName}>New Connections</Text>
              <Text style={styles.visualSub}>Start your campus journey</Text>
            </View>
          </View>
        </StaggerEntrance>
      </View>

      <StaggerEntrance directions={["bottom"]}
        style={[styles.features, { flexDirection: desktop ? "row" : "column" }]}
      >
        <View style={styles.feature}>
          <AppCard>
            <Text style={styles.featureIcon}>01 /</Text>
            <Text style={styles.featureTitle}>Create your profile</Text>
            <Text style={styles.featureDesc}>
              Introduce yourself to your campus community.
            </Text>
          </AppCard>
        </View>

        <View style={styles.feature}>
          <AppCard>
            <Text style={styles.featureIcon}>02 /</Text>
            <Text style={styles.featureTitle}>Choose interests</Text>
            <Text style={styles.featureDesc}>
              Share the things you enjoy and care about.
            </Text>
          </AppCard>
        </View>

        <View style={styles.feature}>
          <AppCard>
            <Text style={styles.featureIcon}>03 /</Text>
            <Text style={styles.featureTitle}>Discover community</Text>
            <Text style={styles.featureDesc}>
              Build meaningful connections at SLU.
            </Text>
          </AppCard>
        </View>
      </StaggerEntrance>
    </ResponsiveScreen>
  );
}

const styles = StyleSheet.create({
  nav: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    paddingBottom: 28,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logoMark: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  logoMarkText: {
    fontSize: 24,
    fontWeight: "900",
    color: colors.background,
  },
  brand: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "800",
  },
  navLabel: {
    color: colors.textMuted,
    fontSize: 11,
    letterSpacing: 1.5,
  },
  hero: {
    alignItems: "center",
    gap: 48,
    paddingTop: 70,
    paddingBottom: 90,
    width: "100%",
  },
  heroContent: {
    flex: 1,
    width: "100%",
  },
  eyebrow: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 24,
  },
  heroTitle: {
    color: colors.text,
    fontWeight: "900",
    lineHeight: 76,
  },
  accent: {
    color: colors.accent,
  },
  description: {
    fontSize: 17,
    lineHeight: 29,
    color: colors.textSecondary,
    marginTop: 20,
    maxWidth: 510,
  },
  action: {
    marginTop: 35,
    maxWidth: 240,
  },
  smallText: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 20,
  },
  heroVisual: {
    flex: 1,
    width: "100%",
    maxWidth: 560,
    backgroundColor: colors.primary,
    borderRadius: 28,
    padding: 28,
    gap: 16,
  },
  visualHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  statusDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.accent,
  },
  visualHeaderText: {
    color: colors.text,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2,
  },
  visualTitle: {
    fontSize: 34,
    fontWeight: "900",
    color: colors.text,
    marginTop: 10,
    marginBottom: 10,
  },
  visualCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF18",
    borderWidth: 1,
    borderColor: "#FFFFFF25",
    borderRadius: 15,
    padding: 18,
    gap: 15,
  },
  visualEmoji: {
    fontSize: 30,
  },
  visualText: {
    flex: 1,
  },
  visualName: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "700",
  },
  visualSub: {
    color: "#D4E2FF",
    fontSize: 13,
    marginTop: 4,
  },
  features: {
    width: "100%",
    gap: 18,
  },
  feature: {
    flex: 1,
    minWidth: 0,
  },
  featureIcon: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 18,
  },
  featureTitle: {
    color: colors.text,
    fontSize: 19,
    fontWeight: "700",
    marginBottom: 10,
  },
  featureDesc: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 22,
  },
});
