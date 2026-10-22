import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Body, Card, Label, ProgressBar, Title } from '@/components/ui';
import { getXp, RANKS, rankFor } from '@/lib/progress';
import { getBestStreak, getTotals } from '@/lib/storage';
import { colors, fonts, radius } from '@/lib/theme';

function load() {
  return { xp: getXp(), totals: getTotals(), bestStreak: getBestStreak() };
}

export default function EvolutionScreen() {
  const [data, setData] = useState(load);
  useFocusEffect(useCallback(() => setData(load()), []));

  const { rank, next, progress, xpToNext, index } = rankFor(data.xp);

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Title>Ton évolution</Title>

        <View style={styles.hero}>
          <LinearGradient colors={[rank.color, colors.background]} style={styles.avatarRing}>
            <View style={styles.avatar}>
              <Text style={styles.avatarEmoji}>{rank.emoji}</Text>
            </View>
          </LinearGradient>
          <Text style={[styles.rankName, { color: rank.color }]}>{rank.name}</Text>
          <Body>{rank.tagline}</Body>
        </View>

        <Card style={{ gap: 10 }}>
          <View style={styles.rowBetween}>
            <Label>{data.xp} XP</Label>
            <Body>{next ? `${next.emoji} ${next.name} à ${next.minXp}` : 'Rang max'}</Body>
          </View>
          <ProgressBar progress={progress} height={14} />
          <Body>{next ? `Plus que ${xpToNext} XP.` : 'Tout est débloqué.'} 1 pompe = 1 XP · matin réussi = +25 XP</Body>
        </Card>

        <View style={styles.stats}>
          <Stat value={data.totals.reps} label="répétitions" />
          <Stat value={data.bestStreak} label="meilleure série" />
          <Stat value={data.totals.completedDays} label="matins gagnés" />
        </View>

        <Label style={{ fontSize: 20, marginTop: 6 }}>Les rangs</Label>
        <Card style={{ padding: 8 }}>
          {RANKS.map((r, i) => {
            const unlocked = i <= index;
            const current = i === index;
            return (
              <View key={r.name} style={[styles.ladderRow, current && { borderColor: r.color, borderWidth: 2 }]}>
                <Text style={[styles.ladderEmoji, !unlocked && { opacity: 0.25 }]}>{unlocked ? r.emoji : '🔒'}</Text>
                <View style={{ flex: 1 }}>
                  <Label style={{ color: unlocked ? colors.text : colors.textMuted }}>{r.name}</Label>
                  <Body style={{ fontSize: 13 }}>{r.minXp} XP</Body>
                </View>
                {current && <Text style={[styles.badge, { backgroundColor: r.color }]}>TOI</Text>}
              </View>
            );
          })}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <Card style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Body style={{ fontSize: 13, textAlign: 'center' }}>{label}</Body>
    </Card>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 14, paddingBottom: 40 },
  hero: { alignItems: 'center', gap: 4, marginVertical: 6 },
  avatarRing: { width: 156, height: 156, borderRadius: 78, padding: 5 },
  avatar: { flex: 1, borderRadius: 78, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  avatarEmoji: { fontSize: 80 },
  rankName: { fontFamily: fonts.black, fontSize: 36, marginTop: 8 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  stats: { flexDirection: 'row', gap: 10 },
  stat: { flex: 1, alignItems: 'center', paddingVertical: 14, paddingHorizontal: 6 },
  statValue: { color: colors.text, fontFamily: fonts.black, fontSize: 28 },
  ladderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 10,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  ladderEmoji: { fontSize: 30, width: 40, textAlign: 'center' },
  badge: {
    color: colors.onLime,
    fontFamily: fonts.black,
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
});
