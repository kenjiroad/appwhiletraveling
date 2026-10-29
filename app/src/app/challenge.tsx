import * as Haptics from 'expo-haptics';
import { useKeepAwake } from 'expo-keep-awake';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useRef, useState, type ComponentRef } from 'react';
import { Alert, Pressable, Share, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';
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
import { captureRef } from 'react-native-view-shot';

import { Mascot } from '@/components/mascot';
import { ProgressRing } from '@/components/progress-ring';
import { ShareCard } from '@/components/share-card';
import { Body, Eyebrow, GhostButton, Glass, PrimaryButton, ProgressBar, Serif } from '@/components/ui';
import { scheduleAlarms } from '@/lib/alarm';
import { EXERCISE_LABELS } from '@/lib/exercises';
import { MASCOT_LEVELS, MASCOT_POSES } from '@/lib/mascot';
import { getXp, rankFor, XP_PER_COMPLETED_DAY, type Rank } from '@/lib/progress';
import { endGoodnight } from '@/lib/sleep';
import {
  DEFAULT_SETTINGS,
  excuseToday,
  getJokerCount,
  getSettings,
  getStreak,
  isTodayCompleted,
  recordSession,
  setWakeCheck,
} from '@/lib/storage';
import { syncNow } from '@/lib/sync';
import { colors, fonts, gradients } from '@/lib/theme';
import { isRepCounterAvailable, RepCounterView } from '../../modules/rep-counter';

type Result = { xpGained: number; streak: number; rankUp: Rank | null; time: string };

/** "Toujours debout ?": one more ring this long after the challenge. */
const WAKE_CHECK_MINUTES = 5;

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
  // Nobody touches the screen during push-ups: without this, the iPhone dims and locks mid-set.
  useKeepAwake();
  const insets = useSafeAreaInsets();
  const [settings] = useState(() => getSettings() ?? DEFAULT_SETTINGS);
  const [count, setCount] = useState(0);
  // Taps in demo mode can arrive faster than re-renders, so the latest count lives in a ref.
  const countRef = useRef(0);
  const [bodyVisible, setBodyVisible] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [sharing, setSharing] = useState(false);
  const cardRef = useRef<ComponentRef<typeof View>>(null);

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
    syncNow();
    // Today's remaining rings go away; "Toujours debout ?" comes back in 5 minutes if it's on.
    if (settings.wakeCheck !== false) setWakeCheck(new Date(Date.now() + WAKE_CHECK_MINUTES * 60_000));
    scheduleAlarms(settings);
    endGoodnight();
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const after = rankFor(getXp()).rank;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(
      () =>
        setResult({
          xpGained: reps + (firstWinToday ? XP_PER_COMPLETED_DAY : 0),
          streak: getStreak(),
          rankUp: after.name !== before.name ? after : null,
          time,
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

  /** Sick or injured: stops today's alarm without winning the day. A joker keeps the streak, if there's one. */
  const excuse = () => {
    const jokers = getJokerCount();
    Alert.alert(
      'Pas de défi aujourd’hui ?',
      `Malade ou blessé, ça arrive. Le réveil s’arrête pour aujourd’hui, sans XP. ${
        jokers > 0 ? 'Un joker protège ta série.' : 'Tu n’as plus de joker : ta série repart à zéro.'
      }`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Arrêter le réveil',
          style: 'destructive',
          onPress: () => {
            excuseToday();
            scheduleAlarms(settings);
            endGoodnight();
            router.back();
          },
        },
      ]
    );
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
            <GhostButton label="Partager ma story" onPress={() => setSharing(true)} />
            <PrimaryButton label="Commencer ma journée" onPress={() => router.back()} />
          </Animated.View>
        </SafeAreaView>

        {sharing && (
          <Animated.View entering={FadeIn.duration(250)} style={styles.shareOverlay}>
            <ShareCard
              ref={cardRef}
              time={result.time}
              reps={settings.reps}
              exercisePlural={label.plural}
              streak={result.streak}
              levelLabel={`Niveau ${index + 1} · ${rank.name}`}
              mascot={(result.rankUp ? MASCOT_LEVELS[index] : MASCOT_POSES.victory) as ImageSourcePropType}
            />
            <View style={styles.shareActions}>
              <PrimaryButton
                label="Partager"
                onPress={async () => {
                  const message = `${result.streak} jour${result.streak > 1 ? 's' : ''} d’affilée à faire ${settings.reps} ${label.plural} au réveil sur Debout. Tu tiens combien ?`;
                  try {
                    const url = await captureRef(cardRef, { format: 'png', quality: 1 });
                    await Share.share({ url, message });
                  } catch {
                    // No image capture (browser preview): share the text alone.
                    await Share.share({ message });
                  }
                }}
              />
              <Pressable onPress={() => setSharing(false)} hitSlop={12}>
                <Text style={styles.shareClose}>Fermer</Text>
              </Pressable>
            </View>
          </Animated.View>
        )}
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
      <Pressable style={[styles.excuseButton, { top: insets.top + 14 }]} onPress={excuse} hitSlop={12}>
        <Text style={styles.quit}>Malade ou blessé ?</Text>
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
  excuseButton: { position: 'absolute', left: 22 },
  shareOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(10,11,26,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    padding: 24,
  },
  shareActions: { alignSelf: 'stretch', gap: 16 },
  shareClose: { color: colors.textMuted, fontFamily: fonts.medium, fontSize: 15, textAlign: 'center' },
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
