import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, Share, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
  ZoomIn,
} from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Mascot } from '@/components/mascot';
import { ProgressRing } from '@/components/progress-ring';
import { Body, Eyebrow, GhostButton, Glass, PrimaryButton, ProgressBar, Serif } from '@/components/ui';
import { cancelTodayReminders } from '@/lib/alarm';
import { EXERCISE_LABELS } from '@/lib/exercises';
import { MASCOT_LEVELS, MASCOT_POSES } from '@/lib/mascot';
import { getXp, rankFor, XP_PER_COMPLETED_DAY, type Rank } from '@/lib/progress';
import { DEFAULT_SETTINGS, getSettings, getStreak, isTodayCompleted, recordSession } from '@/lib/storage';
import { colors, fonts, gradients } from '@/lib/theme';
import { isRepCounterAvailable, RepCounterView } from '../../modules/rep-counter';

type Result = { xpGained: number; streak: number; rankUp: Rank | null };

function encouragement(remaining: number) {
  if (remaining <= 0) return 'Le soleil est levé.';
  if (remaining === 1) return 'La dernière.';
  if (remaining <= 3) return `Plus que ${remaining}.`;
  if (remaining <= 6) return 'Tu y es presque.';
  return 'Respire. Descends. Pousse.';
}

/** Counts up to `value` over ~1 s, so the XP reward is something you watch happen. */
function CountUp({ value, style }: { value: number; style: object }) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => {
      const t = Math.min(1, (Date.now() - start) / 1000);
      setShown(Math.round(value * (1 - Math.pow(1 - t, 3))));
      if (t >= 1) clearInterval(id);
    }, 30);
    return () => clearInterval(id);
  }, [value]);
  return <Serif style={style}>+{shown} XP</Serif>;
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
  const progress = count / settings.reps;

  // Signature "l'aube": the sky warms up and the sun rises with every rep.
  const dawn = useSharedValue(0);
  const pop = useSharedValue(1);
  useEffect(() => {
    dawn.value = withTiming(progress, { duration: 700, easing: Easing.out(Easing.cubic) });
    if (count > 0) pop.value = withSequence(withTiming(1.18, { duration: 90 }), withSpring(1, { damping: 9, stiffness: 220 }));
  }, [count, progress, dawn, pop]);

  const dawnStyle = useAnimatedStyle(() => ({ opacity: dawn.value }));
  const sunStyle = useAnimatedStyle(() => ({ transform: [{ translateY: (1 - dawn.value) * 260 }], opacity: 0.25 + dawn.value * 0.75 }));
  const popStyle = useAnimatedStyle(() => ({ transform: [{ scale: pop.value }] }));

  const finish = (reps: number) => {
    const firstWinToday = !isTodayCompleted();
    const before = rankFor(getXp()).rank;
    recordSession(reps, true);
    cancelTodayReminders();
    const after = rankFor(getXp()).rank;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(
      () =>
        setResult({
          xpGained: reps + (firstWinToday ? XP_PER_COMPLETED_DAY : 0),
          streak: getStreak(),
          rankUp: after.name !== before.name ? after : null,
        }),
      700
    );
  };

  const onRep = (newCount: number) => {
    if (countRef.current >= settings.reps) return;
    countRef.current = newCount;
    setCount(newCount);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    if (newCount >= settings.reps) finish(newCount);
  };

  if (result) {
    const { rank, next, progress: rankProgress, xpToNext, index } = rankFor(getXp());
    return (
      <View style={styles.screen}>
        <LinearGradient colors={gradients.dawn} style={StyleSheet.absoluteFill} />
        <SafeAreaView style={styles.result}>
          <View style={styles.resultTop}>
            <Animated.View entering={ZoomIn.springify().damping(12)}>
              <Mascot
                source={result.rankUp ? MASCOT_LEVELS[index] : MASCOT_POSES.victory}
                size={210}
                idle={result.rankUp ? 'float' : 'bounce'}
              />
            </Animated.View>
            <Animated.View entering={FadeInUp.delay(200).duration(600)} style={{ alignItems: 'center' }}>
              <Eyebrow style={{ color: 'rgba(255,255,255,0.8)' }}>
                {result.rankUp ? 'Évolution' : `Série de ${result.streak} jour${result.streak > 1 ? 's' : ''}`}
              </Eyebrow>
              <Serif style={styles.resultTitle}>{result.rankUp ? `Niveau ${index + 1}` : 'Réveillé.'}</Serif>
              <CountUp value={result.xpGained} style={styles.xp} />
            </Animated.View>
          </View>

          <Animated.View entering={FadeInDown.delay(500).duration(600)}>
            <Glass style={{ gap: 12 }}>
              {result.rankUp ? (
                <>
                  <Serif style={{ fontSize: 34, lineHeight: 38 }}>Tu deviens {result.rankUp.name}.</Serif>
                  <Body style={{ color: 'rgba(255,255,255,0.85)' }}>{result.rankUp.tagline}</Body>
                </>
              ) : (
                <>
                  <View style={styles.rowBetween}>
                    <Text style={styles.rankLabel}>{rank.name}</Text>
                    <Text style={styles.rankMuted}>{next ? `${next.name} dans ${xpToNext} XP` : 'Rang max'}</Text>
                  </View>
                  <ProgressBar progress={rankProgress} />
                </>
              )}
            </Glass>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(700).duration(600)} style={{ gap: 12 }}>
            <GhostButton
              label="Partager ma série"
              onPress={() =>
                Share.share({
                  message: `${result.streak} jour${result.streak > 1 ? 's' : ''} d’affilée à faire ${settings.reps} ${label.plural} au réveil sur Debout. Niveau ${index + 1} · ${rank.name}. Tu tiens combien ?`,
                })
              }
            />
            <PrimaryButton label="Commencer ma journée" onPress={() => router.back()} />
          </Animated.View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <LinearGradient colors={gradients.night} style={StyleSheet.absoluteFill} />
      <Animated.View style={[StyleSheet.absoluteFill, dawnStyle]} pointerEvents="none">
        <LinearGradient colors={gradients.dawn} style={StyleSheet.absoluteFill} />
      </Animated.View>
      <Animated.View style={[styles.sun, sunStyle]} pointerEvents="none">
        <LinearGradient colors={['#FFE2A8', '#FF8A4C']} style={StyleSheet.absoluteFill} />
      </Animated.View>

      {RepCounterView ? (
        <RepCounterView
          style={[StyleSheet.absoluteFill, { opacity: 0.55 }]}
          exercise={settings.exercise}
          active
          onRep={(e) => onRep(e.nativeEvent.count)}
          onBodyVisibilityChange={(e) => setBodyVisible(e.nativeEvent.visible)}
        />
      ) : (
        <Pressable style={StyleSheet.absoluteFill} onPress={() => onRep(countRef.current + 1)} />
      )}

      <View style={styles.center} pointerEvents="none">
        <ProgressRing progress={progress} size={290} stroke={8}>
          <Animated.View style={[{ alignItems: 'center' }, popStyle]}>
            <Serif style={styles.count}>{count}</Serif>
            <Text style={styles.target}>
              sur {settings.reps} {label.plural}
            </Text>
          </Animated.View>
        </ProgressRing>
        <Animated.Text key={encouragement(settings.reps - count)} entering={FadeIn.duration(400)} style={styles.encouragement}>
          {encouragement(settings.reps - count)}
        </Animated.Text>
      </View>

      <View style={[styles.coach, { bottom: insets.bottom + 56 }]} pointerEvents="none">
        <Mascot source={settings.exercise === 'squat' ? MASCOT_POSES.squat : MASCOT_POSES.pushup} size={120} idle="none" hopKey={count} />
      </View>

      <Text style={[styles.hint, { bottom: insets.bottom + 28 }]} pointerEvents="none">
        {!isRepCounterAvailable
          ? `Mode démo · touche l’écran à chaque ${label.singular}`
          : bodyVisible
            ? `L’IA compte tes ${label.plural}`
            : label.tip}
      </Text>

      <Pressable style={[styles.quitButton, { top: insets.top + 14 }]} onPress={() => router.back()} hitSlop={12}>
        <Text style={styles.quit}>Abandonner</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.night },
  sun: { position: 'absolute', alignSelf: 'center', bottom: -170, width: 340, height: 340, borderRadius: 170, overflow: 'hidden' },
  center: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center', gap: 28, paddingBottom: 60 },
  count: { fontSize: 150, lineHeight: 160, letterSpacing: -2 },
  target: { color: colors.textMuted, fontFamily: fonts.medium, fontSize: 17, marginTop: -8 },
  encouragement: { color: colors.text, fontFamily: fonts.serif, fontSize: 30 },
  hint: { position: 'absolute', left: 24, right: 24, textAlign: 'center', color: colors.textMuted, fontFamily: fonts.medium, fontSize: 14 },
  quitButton: { position: 'absolute', right: 22 },
  coach: { position: 'absolute', left: 14 },
  quit: { color: colors.textMuted, fontFamily: fonts.medium, fontSize: 15 },
  result: { flex: 1, padding: 24, justifyContent: 'space-between' },
  resultTop: { alignItems: 'center', gap: 4, marginTop: 20 },
  resultTitle: { fontSize: 64, lineHeight: 70, color: '#FFFFFF' },
  xp: { fontSize: 44, lineHeight: 50, color: '#FFF4E0' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between' },
  rankLabel: { color: colors.text, fontFamily: fonts.semibold, fontSize: 16 },
  rankMuted: { color: 'rgba(255,255,255,0.75)', fontFamily: fonts.medium, fontSize: 15 },
});
