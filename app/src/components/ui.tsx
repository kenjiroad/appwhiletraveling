import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { colors, fonts, gradients, radius } from '@/lib/theme';

type TextProps = { children: ReactNode; style?: StyleProp<TextStyle>; numberOfLines?: number };

/** Big italic serif: hours, counters, rank names, headlines. */
export function Serif({ children, style, numberOfLines }: TextProps) {
  return (
    <Text style={[styles.serif, style]} numberOfLines={numberOfLines}>
      {children}
    </Text>
  );
}

export function Eyebrow({ children, style }: TextProps) {
  return <Text style={[styles.eyebrow, style]}>{children}</Text>;
}

export function Label({ children, style, numberOfLines }: TextProps) {
  return (
    <Text style={[styles.label, style]} numberOfLines={numberOfLines}>
      {children}
    </Text>
  );
}

export function Body({ children, style }: TextProps) {
  return <Text style={[styles.body, style]}>{children}</Text>;
}

export function Glass({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.glass, style]}>
      <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
      {children}
    </View>
  );
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function usePressScale() {
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return {
    style,
    onPressIn: () => scale.set(withSpring(0.95, { damping: 15, stiffness: 300 })),
    onPressOut: () => scale.set(withSpring(1, { damping: 12, stiffness: 200 })),
  };
}

/** Sunrise pill. `breathing` adds a slow pulsing glow to draw the eye to the one action that matters. */
export function PrimaryButton({
  label,
  onPress,
  breathing = false,
  style,
}: {
  label: string;
  onPress: () => void;
  breathing?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const press = usePressScale();
  const glow = useSharedValue(0);
  useEffect(() => {
    if (breathing) glow.value = withRepeat(withTiming(1, { duration: 1600, easing: Easing.inOut(Easing.sin) }), -1, true);
  }, [breathing, glow]);
  // A soft sun-coloured shadow that breathes; no extra shape, so nothing shows behind the pill.
  const glowStyle = useAnimatedStyle(() => ({
    shadowOpacity: 0.25 + glow.value * 0.45,
    shadowRadius: 14 + glow.value * 14,
  }));

  return (
    <AnimatedPressable onPress={onPress} onPressIn={press.onPressIn} onPressOut={press.onPressOut} style={[press.style, style]}>
      <Animated.View style={[styles.primaryShadow, glowStyle]}>
        <LinearGradient colors={gradients.sun} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.primary}>
          <Text style={styles.primaryText}>{label}</Text>
        </LinearGradient>
      </Animated.View>
    </AnimatedPressable>
  );
}

export function GhostButton({ label, onPress }: { label: string; onPress: () => void }) {
  const press = usePressScale();
  return (
    <AnimatedPressable onPress={onPress} onPressIn={press.onPressIn} onPressOut={press.onPressOut} style={[styles.ghost, press.style]}>
      <Text style={styles.ghostText}>{label}</Text>
    </AnimatedPressable>
  );
}

export function ProgressBar({ progress, height = 8 }: { progress: number; height?: number }) {
  const width = useSharedValue(0);
  useEffect(() => {
    width.value = withTiming(Math.max(0.03, Math.min(1, progress)), { duration: 900, easing: Easing.out(Easing.cubic) });
  }, [progress, width]);
  const fill = useAnimatedStyle(() => ({ width: `${width.value * 100}%` }));

  return (
    <View style={[styles.track, { height, borderRadius: height }]}>
      <Animated.View style={[{ height, borderRadius: height, overflow: 'hidden' }, fill]}>
        <LinearGradient colors={gradients.bar} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
      </Animated.View>
    </View>
  );
}

export function Pill({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return (
    <Glass style={[styles.pill, style]}>
      <Text style={styles.pillText}>{children}</Text>
    </Glass>
  );
}

const styles = StyleSheet.create({
  serif: { color: colors.text, fontFamily: fonts.serif, fontSize: 44, lineHeight: 50, letterSpacing: -0.5 },
  eyebrow: { color: colors.textMuted, fontFamily: fonts.semibold, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase' },
  label: { color: colors.text, fontFamily: fonts.semibold, fontSize: 17 },
  body: { color: colors.textMuted, fontFamily: fonts.regular, fontSize: 16, lineHeight: 23 },
  glass: {
    backgroundColor: colors.glass,
    borderColor: colors.glassBorder,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: 20,
    overflow: 'hidden',
  },
  primaryShadow: {
    borderRadius: radius.pill,
    shadowColor: colors.sun,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  primary: { borderRadius: radius.pill, paddingVertical: 20, alignItems: 'center' },
  primaryText: { color: colors.onSun, fontFamily: fonts.bold, fontSize: 18, letterSpacing: 0.2 },
  ghost: {
    borderRadius: radius.pill,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.glassBorder,
    backgroundColor: colors.glass,
  },
  ghostText: { color: colors.text, fontFamily: fonts.semibold, fontSize: 17 },
  track: { backgroundColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' },
  pill: { borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 8, alignSelf: 'flex-start' },
  pillText: { color: colors.text, fontFamily: fonts.semibold, fontSize: 14 },
});
