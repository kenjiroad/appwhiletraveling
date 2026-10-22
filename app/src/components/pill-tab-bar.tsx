import { BlurView } from 'expo-blur';
import { router, usePathname } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fonts, radius } from '@/lib/theme';

const TABS = [
  { href: '/', label: 'Réveil' },
  { href: '/league', label: 'Ligue' },
  { href: '/profile', label: 'Évolution' },
] as const;

/** Floating dark-glass pill navigation. */
export function PillTabBar() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { bottom: insets.bottom + 12 }]} pointerEvents="box-none">
      <View style={styles.bar}>
        <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
        {TABS.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Pressable key={tab.href} onPress={() => router.navigate(tab.href)} style={styles.item}>
              {active && <Animated.View layout={LinearTransition.springify()} style={styles.activeBg} />}
              <Text style={[styles.label, active && styles.labelActive]}>{tab.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  bar: {
    flexDirection: 'row',
    padding: 6,
    borderRadius: radius.pill,
    overflow: 'hidden',
    backgroundColor: 'rgba(14,13,32,0.72)',
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  item: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  activeBg: { ...StyleSheet.absoluteFill, borderRadius: radius.pill, backgroundColor: colors.text },
  label: { color: colors.textMuted, fontFamily: fonts.semibold, fontSize: 15 },
  labelActive: { color: colors.night },
});
