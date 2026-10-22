import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Share, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { cancelTodayReminders } from '@/lib/alarm';
import { EXERCISE_LABELS } from '@/lib/exercises';
import { DEFAULT_SETTINGS, getSettings, getStreak, markTodayCompleted } from '@/lib/storage';
import { colors, radius } from '@/lib/theme';
import { isRepCounterAvailable, RepCounterView } from '../../modules/rep-counter';

export default function ChallengeScreen() {
  const [settings] = useState(() => getSettings() ?? DEFAULT_SETTINGS);
  const [count, setCount] = useState(0);
  const [bodyVisible, setBodyVisible] = useState(false);
  const [streak, setStreak] = useState<number | null>(null);

  const label = EXERCISE_LABELS[settings.exercise];
  const done = streak !== null;

  const onRep = (newCount: number) => {
    if (done) return;
    setCount(newCount);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    if (newCount >= settings.reps) {
      markTodayCompleted();
      cancelTodayReminders();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setStreak(getStreak());
    }
  };

  if (done) {
    return (
      <SafeAreaView style={[styles.screen, styles.center]}>
        <Text style={styles.bigEmoji}>🔥</Text>
        <Text style={styles.title}>Réveillé !</Text>
        <Text style={styles.subtitle}>
          {settings.reps} {label.plural} faites.{'\n'}Série : {streak} jour{streak > 1 ? 's' : ''} d’affilée.
        </Text>
        <Pressable
          style={styles.secondaryButton}
          onPress={() =>
            Share.share({
              message: `${streak} jour${streak > 1 ? 's' : ''} d’affilée à faire ${settings.reps} ${label.plural} au réveil avec Debout ⏰💪`,
            })
          }>
          <Text style={styles.secondaryButtonText}>Partager ma série</Text>
        </Pressable>
        <Pressable style={styles.primaryButton} onPress={() => router.back()}>
          <Text style={styles.primaryButtonText}>Commencer ma journée</Text>
        </Pressable>
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
        <Pressable style={[StyleSheet.absoluteFill, styles.demo]} onPress={() => onRep(count + 1)}>
          <Text style={styles.demoText}>Mode démo (Expo Go){'\n'}Tape l’écran à chaque {label.singular}</Text>
        </Pressable>
      )}

      <SafeAreaView style={styles.overlay} pointerEvents="box-none">
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Text style={styles.quit}>Quitter</Text>
          </Pressable>
        </View>

        <View style={styles.counter} pointerEvents="none">
          <Text style={styles.count}>{count}</Text>
          <Text style={styles.target}>
            / {settings.reps} {label.plural}
          </Text>
        </View>

        {isRepCounterAvailable && !bodyVisible && (
          <View style={styles.hint} pointerEvents="none">
            <Text style={styles.hintText}>Mets-toi dans le cadre 👀{'\n'}{label.tip}</Text>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  center: { justifyContent: 'center', alignItems: 'center', padding: 24 },
  overlay: { flex: 1, justifyContent: 'space-between' },
  topBar: { flexDirection: 'row', justifyContent: 'flex-end', padding: 20 },
  quit: { color: colors.textMuted, fontSize: 15 },
  counter: { alignItems: 'center' },
  count: {
    color: colors.text,
    fontSize: 140,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowRadius: 12,
  },
  target: { color: colors.text, fontSize: 22, fontWeight: '700', textShadowColor: 'rgba(0,0,0,0.6)', textShadowRadius: 8 },
  hint: { margin: 20, padding: 16, borderRadius: radius.md, backgroundColor: 'rgba(0,0,0,0.65)' },
  hintText: { color: colors.text, fontSize: 16, textAlign: 'center', lineHeight: 23 },
  demo: { justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 140, backgroundColor: colors.card },
  demoText: { color: colors.textMuted, fontSize: 16, textAlign: 'center' },
  bigEmoji: { fontSize: 72, marginBottom: 12 },
  title: { color: colors.text, fontSize: 36, fontWeight: '800', marginBottom: 8 },
  subtitle: { color: colors.textMuted, fontSize: 18, lineHeight: 26, textAlign: 'center', marginBottom: 32 },
  primaryButton: { backgroundColor: colors.accent, paddingVertical: 18, alignSelf: 'stretch', borderRadius: radius.md, alignItems: 'center' },
  primaryButtonText: { color: colors.text, fontSize: 18, fontWeight: '700' },
  secondaryButton: {
    borderColor: colors.accent,
    borderWidth: 2,
    paddingVertical: 16,
    alignSelf: 'stretch',
    borderRadius: radius.md,
    alignItems: 'center',
    marginBottom: 12,
  },
  secondaryButtonText: { color: colors.text, fontSize: 17, fontWeight: '700' },
});
