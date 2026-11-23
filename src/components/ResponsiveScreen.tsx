import StaggerEntrance from "./StaggerEntrance";
import SmoothScrollView from "./SmoothScrollView";
import { ReactNode } from "react";
import {
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";

import { colors } from "../theme/colors";
import WatermarkBackground from "./WatermarkBackground";

type Props = {
  children: ReactNode;
  stagger?: boolean;
  variant?: "wide" | "form";
};

export default function ResponsiveScreen({
  children,
  variant = "wide",
  stagger = true,
}: Props) {
  const Content = stagger ? StaggerEntrance : View;
  const { width } = useWindowDimensions();

  const isDesktop = width >= 900;
  const maxWidth = variant === "form" ? 680 : 1440;

  return (
    <View style={styles.root}>
      <WatermarkBackground />

      <SmoothScrollView
        style={styles.screen}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Content
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
        </Content>
      </SmoothScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.background,
  },

  screen: {
    flex: 1,
    width: "100%",
    backgroundColor: "transparent",
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
