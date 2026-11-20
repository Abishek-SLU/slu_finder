import React, { ReactNode } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";

import { colors } from "../theme/colors";

type Props = {
  children: ReactNode;
  variant?: "wide" | "form";
};

export default function ResponsiveScreen({
  children,
  variant = "wide",
}: Props) {
  const { width } = useWindowDimensions();

  const isDesktop = width >= 900;

  const maxWidth = variant === "form" ? 680 : 1440;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <View
        style={[
          styles.content,
          {
            maxWidth,
            paddingHorizontal: isDesktop ? 48 : 20,
            paddingVertical: isDesktop ? 48 : 24,
          },
        ]}
      >
        {children}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.background,
  },

  scrollContent: {
    flexGrow: 1,
    width: "100%",
    alignItems: "center",
  },

  content: {
    width: "100%",
    alignSelf: "center",
  },
});