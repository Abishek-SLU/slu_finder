import StaggerEntrance from "./StaggerEntrance";
import SmoothScrollView from "./SmoothScrollView";
import { ReactNode } from "react";
import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import { colors } from "../theme/colors";
import WatermarkBackground from "./WatermarkBackground";

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export default function AuthShell({
  eyebrow,
  title,
  description,
  children,
}: Props) {
  const { width } = useWindowDimensions();
  const desktop = width >= 950;

  return (
    <View style={styles.root}>
      {/* Transparent SLU logo behind the content */}
      <WatermarkBackground />

      <SmoothScrollView
        style={styles.screen}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={[
            styles.layout,
            {
              flexDirection: desktop ? "row" : "column",
            },
          ]}
        >
          {/* Left side: Login, Register, or OTP form */}
          <View style={styles.formSide}>
            <Text style={styles.brand}>SLU Finder.</Text>

            <View style={styles.formContent}>
              <StaggerEntrance directions={["bottom"]}>
              <Text style={styles.eyebrow}>{eyebrow.toUpperCase()}</Text>

              <Text style={styles.title}>{title}</Text>

              <Text style={styles.description}>{description}</Text>
              </StaggerEntrance>

              <StaggerEntrance directions={["bottom"]} delay={180} style={styles.form}>{children}</StaggerEntrance>
            </View>

            <Text style={styles.footer}>
              SLU FINDER / SAINT LOUIS UNIVERSITY
            </Text>
          </View>

          {/* Right side: Desktop branding */}
          {desktop && (
            <StaggerEntrance directions={["bottom"]} delay={100} style={styles.visualSide}>
              <View style={styles.visualTop}>
                <View style={styles.dot} />

                <Text style={styles.visualTag}>YOUR CAMPUS COMMUNITY</Text>
              </View>

              <View style={styles.visualMiddle}>
                <Text style={styles.visualTitle}>
                  Good things{"\n"}
                  happen when{"\n"}
                  <Text style={styles.lime}>we connect.</Text>
                </Text>

                <Text style={styles.visualDescription}>
                  Find students who share your interests, discover new
                  connections, and make the most of your university experience.
                </Text>
              </View>

              <View style={styles.visualBottom}>
                <Text style={styles.visualBottomText}>
                  Meet. Discover. Belong.
                </Text>

                <Text style={styles.visualCaption}>
                  ONE CAMPUS. ENDLESS CONNECTIONS.
                </Text>
              </View>
            </StaggerEntrance>
          )}
        </View>
      </SmoothScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // Main background
  root: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.background,
  },

  // Transparent so watermark remains visible
  screen: {
    flex: 1,
    width: "100%",
    backgroundColor: "transparent",
  },

  scrollContent: {
    flexGrow: 1,
    width: "100%",
  },

  layout: {
    width: "100%",
    flexGrow: 1,
    minHeight: 700,
  },

  // Authentication form section
  formSide: {
    flex: 1,
    minWidth: 0,
    paddingHorizontal: 32,
    paddingVertical: 36,
    justifyContent: "space-between",
    backgroundColor: "transparent",
  },

  brand: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "900",
  },

  formContent: {
    width: "100%",
    maxWidth: 440,
    alignSelf: "center",
    marginVertical: 55,
  },

  eyebrow: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 20,
  },

  title: {
    color: colors.text,
    fontSize: 44,
    fontWeight: "900",
    lineHeight: 52,
  },

  description: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 24,
    marginTop: 15,
  },

  form: {
    marginTop: 36,
    gap: 8,
  },

  footer: {
    color: colors.textMuted,
    fontSize: 10,
    letterSpacing: 1,
  },

  // Cobalt Blue section on desktop
  visualSide: {
    flex: 1,
    minWidth: 0,
    padding: 55,
    justifyContent: "space-between",

    // Slight transparency allows watermark to show
    backgroundColor: "rgba(21, 88, 201, 0.90)",
  },

  visualTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  dot: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: colors.accent,
  },

  visualTag: {
    color: colors.text,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2,
  },

  visualMiddle: {
    width: "100%",
  },

  visualTitle: {
    color: colors.text,
    fontSize: 54,
    lineHeight: 65,
    fontWeight: "900",
  },

  lime: {
    color: colors.accent,
  },

  visualDescription: {
    color: "#E3EBFF",
    fontSize: 16,
    lineHeight: 27,
    marginTop: 26,
    maxWidth: 430,
  },

  visualBottom: {
    borderTopWidth: 1,
    borderTopColor: "#FFFFFF50",
    paddingTop: 28,
  },

  visualBottomText: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "700",
  },

  visualCaption: {
    color: "#DDE8FF",
    fontSize: 11,
    letterSpacing: 2,
    marginTop: 12,
  },
});
