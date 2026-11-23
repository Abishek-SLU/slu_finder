import { Image, StyleSheet, View, useWindowDimensions } from "react-native";

export default function WatermarkBackground() {
  const { width, height } = useWindowDimensions();

  const logoSize = Math.min(width * 0.85, height * 0.8, 750);

  return (
    <View pointerEvents="none" style={styles.container}>
      <Image
        source={require("../../assets/images/slu-billiken-rgb.png")}
        style={[
          styles.logo,
          {
            width: logoSize,
            height: logoSize,
          },
        ]}
        resizeMode="contain"
        accessibilityIgnoresInvertColors
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  logo: {
    opacity: 0.07,
  },
});
