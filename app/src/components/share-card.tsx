import { LinearGradient } from 'expo-linear-gradient';
import type { ComponentRef, Ref } from 'react';
import { Image, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';

import { colors, fonts, gradients } from '@/lib/theme';

type Props = {
  /** When the challenge was won, e.g. "06:58". */
  time: string;
  reps: number;
  exercisePlural: string;
  streak: number;
  levelLabel: string;
  mascot: ImageSourcePropType;
  ref?: Ref<ComponentRef<typeof View>>;
};

/**
 * Story-format (9:16) image shared after the morning challenge. Rendered on screen as a preview,
 * then captured as a PNG: every share is a little ad for Debout.
 */
export function ShareCard({ time, reps, exercisePlural, streak, levelLabel, mascot, ref }: Props) {
  const date = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  return (
    <View ref={ref} collapsable={false} style={styles.card}>
      <LinearGradient colors={gradients.dawn} style={StyleSheet.absoluteFill} />
      <View style={styles.sun} />

      <View style={styles.top}>
        <Text style={styles.brand}>DEBOUT</Text>
        <Text style={styles.date}>{date}</Text>
      </View>

      <Image source={mascot} style={styles.mascot} resizeMode="contain" />

      <View style={styles.middle}>
        <Text style={styles.label}>Debout à</Text>
        <Text style={styles.time}>{time}</Text>
        <Text style={styles.stats}>
          {reps} {exercisePlural} · 🔥 {streak} jour{streak > 1 ? 's' : ''}
        </Text>
      </View>

      <View style={styles.bottom}>
        <Text style={styles.level}>{levelLabel}</Text>
        <Text style={styles.tagline}>Le réveil qui ne s’arrête que quand tu bouges.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 270,
    aspectRatio: 9 / 16,
    borderRadius: 22,
    overflow: 'hidden',
    padding: 20,
    justifyContent: 'space-between',
    backgroundColor: colors.night,
  },
  sun: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: -120,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255,226,168,0.35)',
  },
  top: { alignItems: 'center', gap: 2 },
  brand: { color: '#FFFFFF', fontFamily: fonts.bold, fontSize: 13, letterSpacing: 4 },
  date: { color: 'rgba(255,255,255,0.8)', fontFamily: fonts.medium, fontSize: 12 },
  mascot: { width: 150, height: 150, alignSelf: 'center' },
  middle: { alignItems: 'center' },
  label: { color: 'rgba(255,255,255,0.85)', fontFamily: fonts.medium, fontSize: 14 },
  time: { color: '#FFFFFF', fontFamily: fonts.serif, fontSize: 76, lineHeight: 82, letterSpacing: -1 },
  stats: { color: '#FFF4E0', fontFamily: fonts.semibold, fontSize: 16 },
  bottom: { alignItems: 'center', gap: 4 },
  level: { color: '#FFFFFF', fontFamily: fonts.semibold, fontSize: 14 },
  tagline: { color: 'rgba(255,255,255,0.8)', fontFamily: fonts.regular, fontSize: 11, textAlign: 'center' },
});
