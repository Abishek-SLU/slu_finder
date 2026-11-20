import { ReactNode } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    useWindowDimensions,
} from "react-native";

import { colors } from "../theme/colors";

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
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <View
        style={[styles.layout, { flexDirection: desktop ? "row" : "column" }]}
      >
        <View style={styles.formSide}>
          <Text style={styles.brand}>SLU Finder.</Text>

          <View style={styles.formContent}>
            <Text style={styles.eyebrow}>{eyebrow.toUpperCase()}</Text>

            <Text style={styles.title}>{title}</Text>

            <Text style={styles.description}>{description}</Text>

            <View style={styles.form}>{children}</View>
          </View>

          <Text style={styles.footer}>SLU FINDER / SAINT LOUIS UNIVERSITY</Text>
        </View>

        {desktop && (
          <View style={styles.visualSide}>
            <View style={styles.visualTop}>
              <View style={styles.dot} />
              <Text style={styles.visualTag}>YOUR CAMPUS COMMUNITY</Text>
            </View>

            <Text style={styles.visualTitle}>
              Good things{"\n"}
              happen when{"\n"}
              <Text style={styles.lime}>we connect.</Text>
            </Text>

            <View style={styles.visualBottom}>
              <Text style={styles.visualBottomText}>
                Meet. Discover. Belong.
              </Text>

              <Text style={styles.visualCaption}>
                ONE CAMPUS. ENDLESS CONNECTIONS.
              </Text>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    width: "100%",
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
  formSide: {
    flex: 1,
    paddingHorizontal: 32,
    paddingVertical: 36,
    justifyContent: "space-between",
    minWidth: 0,
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
  visualSide: {
    flex: 1,
    backgroundColor: colors.primary,
    minWidth: 0,
    padding: 55,
    justifyContent: "space-between",
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
  visualTitle: {
    color: colors.text,
    fontSize: 54,
    lineHeight: 65,
    fontWeight: "900",
  },
  lime: {
    color: colors.accent,
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
