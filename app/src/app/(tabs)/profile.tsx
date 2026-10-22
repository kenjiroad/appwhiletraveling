import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Aurora } from '@/components/aurora';
import { SunBadge } from '@/components/sun-badge';
import { Body, Eyebrow, Glass, Label, ProgressBar, Serif } from '@/components/ui';
import { getXp, RANKS, rankFor } from '@/lib/progress';
import { getBestStreak, getTotals } from '@/lib/storage';
import { colors, fonts } from '@/lib/theme';

function load() {
  return { xp: getXp(), totals: getTotals(), bestStreak: getBestStreak() };
}

export default function EvolutionScreen() {
  const [data, setData] = useState(load);
  useFocusEffect(useCallback(() => setData(load()), []));

  const { rank, next, progress, xpToNext, index } = rankFor(data.xp);

  return (
    <View style={styles.screen}>
      <Aurora warmth={0.2 + (index / (RANKS.length - 1)) * 0.7} />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Eyebrow>Ton évolution</Eyebrow>

          <View style={styles.hero}>
            <Animated.View entering={ZoomIn.springify().damping(13)}>
              <SunBadge level={index} size={190} />
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(150).duration(600)} style={{ alignItems: 'center' }}>
              <Eyebrow>Niveau {index + 1}</Eyebrow>
              <Serif style={styles.rankName}>{rank.name}</Serif>
              <Body>{rank.tagline}</Body>
            </Animated.View>
          </View>

          <Animated.View entering={FadeInDown.delay(250).duration(600)}>
            <Glass style={{ gap: 12 }}>
              <View style={styles.rowBetween}>
                <Label>
                  <Serif style={styles.inlineNumber}>{data.xp}</Serif> XP
                </Label>
                <Body>{next ? `${next.name} à ${next.minXp}` : 'Rang max'}</Body>
              </View>
              <ProgressBar progress={progress} height={10} />
              <Body style={{ fontSize: 14 }}>
                {next ? `Plus que ${xpToNext} XP. ` : ''}1 répétition = 1 XP · matin gagné = +25 XP
              </Body>
            </Glass>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(350).duration(600)} style={styles.stats}>
            <Stat value={data.totals.reps} label="répétitions" />
            <Stat value={data.bestStreak} label="meilleure série" />
            <Stat value={data.totals.completedDays} label="matins gagnés" />
          </Animated.View>

          <Eyebrow style={{ marginTop: 6 }}>Les 8 niveaux</Eyebrow>
          <Glass style={{ padding: 10 }}>
            {RANKS.map((r, i) => {
              const unlocked = i <= index;
              const current = i === index;
              return (
                <View key={r.name} style={[styles.ladderRow, current && styles.ladderCurrent]}>
                  <View style={{ opacity: unlocked ? 1 : 0.3 }}>
                    <SunBadge level={i} size={44} animated={false} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Serif style={[styles.ladderName, !unlocked && { color: colors.textFaint }]}>{r.name}</Serif>
                    <Text style={styles.ladderXp}>
                      Niv. {i + 1} · {r.minXp} XP
                    </Text>
                  </View>
                  {current && <Text style={styles.badge}>Toi</Text>}
                </View>
              );
            })}
          </Glass>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <Glass style={styles.stat}>
      <Serif style={styles.statValue}>{value}</Serif>
      <Body style={{ fontSize: 13, textAlign: 'center' }}>{label}</Body>
    </Glass>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.night },
  content: { padding: 22, gap: 16, paddingBottom: 130 },
  hero: { alignItems: 'center', gap: 6 },
  rankName: { fontSize: 60, lineHeight: 66 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  inlineNumber: { fontSize: 28, lineHeight: 30, color: colors.gold },
  stats: { flexDirection: 'row', gap: 10 },
  stat: { flex: 1, alignItems: 'center', paddingVertical: 16, paddingHorizontal: 6 },
  statValue: { fontSize: 36, lineHeight: 40 },
  ladderRow: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 8, borderRadius: 18 },
  ladderCurrent: { backgroundColor: 'rgba(255,196,107,0.12)', borderWidth: 1, borderColor: 'rgba(255,196,107,0.45)' },
  ladderName: { fontSize: 24, lineHeight: 28 },
  ladderXp: { color: colors.textMuted, fontFamily: fonts.regular, fontSize: 13 },
  badge: {
    color: colors.onSun,
    backgroundColor: colors.gold,
    fontFamily: fonts.bold,
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: 'hidden',
  },
});
