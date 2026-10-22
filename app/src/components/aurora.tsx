import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

import { colors, gradients } from '@/lib/theme';

type GlowProps = { color: string; size: number; top: number; left: number; drift: number; duration: number; opacity: number };

function Glow({ color, size, top, left, drift, duration, opacity }: GlowProps) {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withRepeat(withTiming(1, { duration, easing: Easing.inOut(Easing.sin) }), -1, true);
  }, [t, duration]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: (t.value - 0.5) * drift }, { translateY: (0.5 - t.value) * drift * 0.6 }, { scale: 0.9 + t.value * 0.2 }],
  }));

  const id = `glow-${color.replace('#', '')}`;
  return (
    <Animated.View style={[{ position: 'absolute', top, left, width: size, height: size, opacity }, style]} pointerEvents="none">
      <Svg width={size} height={size}>
        <Defs>
          <RadialGradient id={id} cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={color} stopOpacity={0.9} />
            <Stop offset="100%" stopColor={color} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx={size / 2} cy={size / 2} r={size / 2} fill={`url(#${id})`} />
      </Svg>
    </Animated.View>
  );
}

/** Night sky with slow drifting dawn lights. `warmth` (0–1) brings the sunrise glow up. */
export function Aurora({ warmth = 0.35 }: { warmth?: number }) {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient colors={gradients.night} style={StyleSheet.absoluteFill} />
      <Glow color={colors.violet} size={420} top={-140} left={-160} drift={60} duration={9000} opacity={0.55} />
      <Glow color={colors.rose} size={380} top={380} left={140} drift={70} duration={11000} opacity={0.25 + warmth * 0.4} />
      <Glow color={colors.sun} size={460} top={560} left={-180} drift={50} duration={13000} opacity={0.15 + warmth * 0.5} />
    </View>
  );
}
