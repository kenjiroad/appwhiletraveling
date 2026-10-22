import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';

import { colors, fonts, gradients, radius } from '@/lib/theme';

type TextProps = { children: ReactNode; style?: StyleProp<TextStyle>; numberOfLines?: number };

export function Title({ children, style }: TextProps) {
  return <Text style={[styles.title, style]}>{children}</Text>;
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

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function GradientCard({
  children,
  colors: gradientColors = gradients.hero,
  style,
}: {
  children: ReactNode;
  colors?: readonly [string, string];
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <LinearGradient colors={gradientColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.gradientCard, style]}>
      {children}
    </LinearGradient>
  );
}

export function PrimaryButton({ label, onPress, style }: { label: string; onPress: () => void; style?: StyleProp<ViewStyle> }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.primary, pressed && styles.pressed, style]}>
      <Text style={styles.primaryText}>{label}</Text>
    </Pressable>
  );
}

export function GhostButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.ghost, pressed && styles.pressed]}>
      <Text style={styles.ghostText}>{label}</Text>
    </Pressable>
  );
}

export function ProgressBar({ progress, colors: barColors = gradients.lime, height = 12 }: {
  progress: number;
  colors?: readonly [string, string];
  height?: number;
}) {
  const clamped = Math.max(0, Math.min(1, progress));
  return (
    <View style={[styles.track, { height, borderRadius: height }]}>
      <LinearGradient
        colors={barColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ width: `${Math.max(clamped * 100, 4)}%`, height, borderRadius: height }}
      />
    </View>
  );
}

export function Chip({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.chip, style]}>
      <Text style={styles.chipText}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.text, fontFamily: fonts.black, fontSize: 34, lineHeight: 38, letterSpacing: -0.8 },
  label: { color: colors.text, fontFamily: fonts.bold, fontSize: 17 },
  body: { color: colors.textMuted, fontFamily: fonts.regular, fontSize: 16, lineHeight: 23 },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: 18,
  },
  gradientCard: { borderRadius: radius.lg, padding: 20, overflow: 'hidden' },
  primary: {
    backgroundColor: colors.lime,
    borderRadius: radius.pill,
    paddingVertical: 19,
    alignItems: 'center',
    shadowColor: colors.lime,
    shadowOpacity: 0.45,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
  },
  primaryText: { color: colors.onLime, fontFamily: fonts.black, fontSize: 19, letterSpacing: -0.2 },
  ghost: {
    borderRadius: radius.pill,
    paddingVertical: 17,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  ghostText: { color: colors.text, fontFamily: fonts.bold, fontSize: 17 },
  pressed: { transform: [{ scale: 0.97 }], opacity: 0.9 },
  track: { backgroundColor: colors.surfaceHigh, overflow: 'hidden' },
  chip: {
    backgroundColor: colors.surfaceHigh,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  chipText: { color: colors.text, fontFamily: fonts.bold, fontSize: 14 },
});
