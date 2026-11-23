import { useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { ViewProps } from "react-native";
import Animated, { cancelAnimation, Easing, ReduceMotion, useAnimatedStyle, useSharedValue, withTiming, withDelay } from "react-native-reanimated";

export type EntranceDirection = "top" | "bottom" | "left" | "right";

/** A small directional fade on navigation, without remounting forms or their state. */
export default function PageEntrance({ style, children, delay = 0, direction = "bottom", ...props }: ViewProps & { delay?: number; direction?: EntranceDirection }) {
  const progress = useSharedValue(1);
  useFocusEffect(useCallback(() => {
    progress.set(0);
    progress.set(withDelay(delay, withTiming(1, {
      duration: 750,
      easing: Easing.out(Easing.cubic),
      reduceMotion: ReduceMotion.System,
    }), ReduceMotion.System));
    return () => { cancelAnimation(progress); progress.set(1); };
  }, [progress, delay]));
  const motion = useAnimatedStyle(() => ({
    opacity: progress.get(),
    transform: [
      { translateX: (1 - progress.get()) * (direction === "left" ? -24 : direction === "right" ? 24 : 0) },
      { translateY: (1 - progress.get()) * (direction === "top" ? -16 : direction === "bottom" ? 16 : 0) },
    ],
  }));
  return <Animated.View {...props} style={[style, motion]}>{children}</Animated.View>;
}
