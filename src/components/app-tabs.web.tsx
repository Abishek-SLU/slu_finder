import {
  TabList,
  Tabs,
  TabSlot,
  TabTrigger,
  type TabTriggerSlotProps,
} from "expo-router/ui";
import type { ComponentProps } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";

type TabButtonProps = Omit<TabTriggerSlotProps, "ref"> & {
  ref?: ComponentProps<typeof Pressable>["ref"];
};

export default function AppTabs() {
  return (
    <Tabs style={styles.root}>
      <ThemedView type="backgroundElement" style={styles.header}>
        <View style={styles.headerContent}>
          <ThemedText style={styles.brand}>SLU Finder</ThemedText>

          <TabList style={styles.navigation}>
            <TabTrigger name="home" href="/" asChild>
              <TabButton>Home</TabButton>
            </TabTrigger>
          </TabList>
        </View>
      </ThemedView>

      <TabSlot style={styles.page} />
    </Tabs>
  );
}

function TabButton({ children, isFocused, ...props }: TabButtonProps) {
  return (
    <Pressable
      {...props}
      style={({ pressed }) => [styles.tabButton, pressed && styles.pressed]}
    >
      <ThemedText
        type="smallBold"
        themeColor={isFocused ? "accent" : "textSecondary"}
      >
        {children}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    minHeight: 0,
  },
  header: {
    width: "100%",
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  headerContent: {
    width: "100%",
    maxWidth: 1120,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  brand: {
    fontSize: 22,
    lineHeight: 30,
    fontWeight: "700",
  },
  navigation: {
    flexDirection: "row",
    alignItems: "center",
  },
  tabButton: {
    minHeight: 44,
    justifyContent: "center",
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  pressed: {
    opacity: 0.7,
  },
  page: {
    flex: 1,
    minHeight: 0,
  },
});
