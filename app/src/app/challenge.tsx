import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, Share, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Body, GhostButton, GradientCard, PrimaryButton, ProgressBar } from '@/components/ui';
import { cancelTodayReminders } from '@/lib/alarm';
import { EXERCISE_LABELS } from '@/lib/exercises';
import { getXp, rankFor, XP_PER_COMPLETED_DAY, type Rank } from '@/lib/progress';
import { DEFAULT_SETTINGS, getSettings, getStreak, isTodayCompleted, recordSession } from '@/lib/storage';
import { colors, fonts, gradients } from '@/lib/theme';
import { isRepCounterAvailable, RepCounterView } from '../../modules/rep-counter';

type Result = { xpGained: number; streak: number; rankUp: Rank | null };

function encouragement(remaining: number) {
  if (remaining <= 0) return 'C’est gagné 🔥';
  if (remaining === 1) return 'LA DERNIÈRE !';
  if (remaining <= 3) return `Plus que ${remaining} !`;
  if (remaining <= 6) return 'Tu y es presque 💪';
  return 'Allez, on se réveille !';
}

export default function ChallengeScreen() {
  const insets = useSafeAreaInsets();
  const [settings] = useState(() => getSettings() ?? DEFAULT_SETTINGS);
  const [count, setCount] = useState(0);
  // Taps in demo mode can arrive faster than re-renders, so the latest count lives in a ref.
  const countRef = useRef(0);
  const [bodyVisible, setBodyVisible] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const label = EXERCISE_LABELS[settings.exercise];
  const remaining = settings.reps - count;

  const finish = (reps: number) => {
    const firstWinToday = !isTodayCompleted();
    const before = rankFor(getXp()).rank;
    recordSession(reps, true);
    cancelTodayReminders();
    const after = rankFor(getXp()).rank;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setResult({
      xpGained: reps + (firstWinToday ? XP_PER_COMPLETED_DAY : 0),
      streak: getStreak(),
      rankUp: after.name !== before.name ? after : null,
    });
  };

  const onRep = (newCount: number) => {
    if (result) return;
    countRef.current = newCount;
    setCount(newCount);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    if (newCount >= settings.reps) finish(newCount);
  };

  if (result) {
    const { rank, next, progress, xpToNext } = rankFor(getXp());
    return (
      <SafeAreaView style={[styles.screen, styles.result]}>
        <View style={styles.resultTop}>
          <Text style={styles.bigEmoji}>{result.rankUp ? result.rankUp.emoji : '🔥'}</Text>
          <Text style={styles.resultTitle}>{result.rankUp ? 'ÉVOLUTION !' : 'RÉVEILLÉ !'}</Text>
          <Text style={styles.xp}>+{result.xpGained} XP</Text>
          <Body style={{ textAlign: 'center' }}>
            {settings.reps} {label.plural} · série de {result.streak} jour{result.streak > 1 ? 's' : ''} 🔥
          </Body>
        </View>

        {result.rankUp ? (
          <GradientCard style={{ alignItems: 'center', gap: 4 }}>
            <Text style={styles.rankUpTitle}>Tu es maintenant {result.rankUp.name}</Text>
            <Text style={styles.rankUpTag}>{result.rankUp.tagline}</Text>
          </GradientCard>
        ) : (
          <View style={{ gap: 8 }}>
            <View style={styles.rowBetween}>
              <Text style={styles.rankLabel}>
                {rank.emoji} {rank.name}
              </Text>
              <Text style={styles.rankLabelMuted}>{next ? `${next.emoji} dans ${xpToNext} XP` : 'Rang max'}</Text>
            </View>
            <ProgressBar progress={progress} height={14} />
          </View>
        )}

        <View style={{ gap: 12 }}>
          <GhostButton
            label="📸 Partager ma série"
            onPress={() =>
              Share.share({
                message: `${result.streak} jour${result.streak > 1 ? 's' : ''} d’affilée à faire ${settings.reps} ${label.plural} au réveil sur Debout. Rang : ${rank.emoji} ${rank.name}. Tu tiens combien ? ⏰💪`,
              })
            }
          />
          <PrimaryButton label="Commencer ma journée" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.screen}>
      {RepCounterView ? (
        <RepCounterView
          style={StyleSheet.absoluteFill}
          exercise={settings.exercise}
          active
          onRep={(e) => onRep(e.nativeEvent.count)}
          onBodyVisibilityChange={(e) => setBodyVisible(e.nativeEvent.visible)}
        />
      ) : (
        <Pressable style={StyleSheet.absoluteFill} onPress={() => onRep(countRef.current + 1)}>
          <LinearGradient colors={gradients.night} style={StyleSheet.absoluteFill} />
        </Pressable>
      )}

      <View style={styles.counter} pointerEvents="none">
        <Text style={styles.count}>{count}</Text>
        <Text style={styles.target}>
          sur {settings.reps} {label.plural}
        </Text>
      </View>

      <LinearGradient
        colors={['transparent', 'rgba(13,10,30,0.95)']}
        style={[styles.bottomShade, { paddingBottom: insets.bottom + 24 }]}
        pointerEvents="none">
        <Text style={styles.encouragement}>{encouragement(remaining)}</Text>
        <ProgressBar progress={count / settings.reps} height={16} />
        <Text style={styles.hint}>
          {!isRepCounterAvailable
            ? `Mode démo : tape l’écran à chaque ${label.singular}`
            : bodyVisible
              ? `L’IA compte tes ${label.plural} 👀`
              : `Mets-toi dans le cadre. ${label.tip}`}
        </Text>
      </LinearGradient>

      <Pressable style={[styles.quitButton, { top: insets.top + 12 }]} onPress={() => router.back()} hitSlop={12}>
        <Text style={styles.quit}>Abandonner</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  quitButton: { position: 'absolute', right: 20 },
  quit: { color: colors.textMuted, fontFamily: fonts.semibold, fontSize: 15 },
  counter: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center', paddingBottom: 80 },
  count: {
    color: colors.lime,
    fontFamily: fonts.black,
    fontSize: 200,
    lineHeight: 210,
    letterSpacing: -8,
    fontVariant: ['tabular-nums'],
    textShadowColor: 'rgba(200,255,46,0.45)',
    textShadowRadius: 30,
  },
  target: { color: colors.text, fontFamily: fonts.bold, fontSize: 22 },
  bottomShade: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 24, paddingTop: 60, gap: 14 },
  encouragement: { color: colors.text, fontFamily: fonts.black, fontSize: 30, textAlign: 'center' },
  hint: { color: colors.textMuted, fontFamily: fonts.semibold, fontSize: 14, textAlign: 'center' },
  result: { padding: 24, justifyContent: 'space-between' },
  resultTop: { alignItems: 'center', gap: 6, marginTop: 30 },
  bigEmoji: { fontSize: 96 },
  resultTitle: { color: colors.text, fontFamily: fonts.black, fontSize: 44, letterSpacing: -1 },
  xp: {
    color: colors.lime,
    fontFamily: fonts.black,
    fontSize: 56,
    textShadowColor: 'rgba(200,255,46,0.45)',
    textShadowRadius: 24,
  },
  rankUpTitle: { color: colors.text, fontFamily: fonts.black, fontSize: 24, textAlign: 'center' },
  rankUpTag: { color: 'rgba(255,255,255,0.9)', fontFamily: fonts.semibold, fontSize: 16 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between' },
  rankLabel: { color: colors.text, fontFamily: fonts.bold, fontSize: 16 },
  rankLabelMuted: { color: colors.textMuted, fontFamily: fonts.semibold, fontSize: 15 },
});
