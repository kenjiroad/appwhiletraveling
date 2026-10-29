import { Redirect, router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Aurora } from '@/components/aurora';
import { Mascot } from '@/components/mascot';
import { Body, Eyebrow, GhostButton, Glass, Label, Pill, PrimaryButton, Serif } from '@/components/ui';
import { WeekDots } from '@/components/week-dots';
import { scheduleAlarms } from '@/lib/alarm';
import { EXERCISE_LABELS, formatTime } from '@/lib/exercises';
import { MASCOT_LEVELS } from '@/lib/mascot';
import { getXp, rankFor } from '@/lib/progress';
import { canSayGoodnight, sayGoodnight, type GoodnightResult } from '@/lib/sleep';
import { getJokerCount, getSettings, getStreak, isTodayCompleted } from '@/lib/storage';
import { colors, fonts } from '@/lib/theme';

function load() {
  const settings = getSettings();
  return {
    settings,
    streak: getStreak(),
    jokers: getJokerCount(),
    doneToday: isTodayCompleted(),
    xp: getXp(),
    bedtime: canSayGoodnight(settings),
  };
}

export default function AlarmScreen() {
  const [data, setData] = useState(load);
  const [hop, setHop] = useState(0);
  const [goodnight, setGoodnight] = useState<GoodnightResult | null>(null);

  useFocusEffect(
    useCallback(() => {
      const next = load();
      setData(next);
      // Re-plan on every visit so the notification window keeps rolling forward.
      if (next.settings) scheduleAlarms(next.settings);
    }, [])
  );

  const { settings, streak, jokers, doneToday, xp, bedtime } = data;
  if (!settings) return <Redirect href="/onboarding" />;

  const onGoodnight = () => {
    setGoodnight(sayGoodnight(settings));
    setHop((h) => h + 1);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const { rank, index } = rankFor(xp);
  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <View style={styles.screen}>
      <Aurora warmth={doneToday ? 0.8 : 0.3} />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
          <Eyebrow>{today}</Eyebrow>
          <Pressable onPress={() => router.navigate('/profile')}>
            <Pill>
              Niv. {index + 1} · {rank.name}
            </Pill>
          </Pressable>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(120).duration(600)} style={styles.hero}>
          <Mascot source={MASCOT_LEVELS[index]} size={118} hopKey={hop} onPress={() => setHop((h) => h + 1)} />
          <Eyebrow>{settings.enabled ? 'Prochain réveil' : 'Réveil en pause'}</Eyebrow>
          <Serif style={styles.time}>{formatTime(settings.hour, settings.minute)}</Serif>
          <Body style={{ textAlign: 'center' }}>
            {settings.reps} {EXERCISE_LABELS[settings.exercise].plural} pour l’arrêter
          </Body>
          <Pressable onPress={() => router.push('/settings')} style={styles.settingsLink} hitSlop={8}>
            <Label style={styles.settingsText}>Réglages</Label>
          </Pressable>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(240).duration(600)}>
          <Glass style={{ gap: 16 }}>
            <View style={styles.weekHeader}>
              <Eyebrow>Cette semaine</Eyebrow>
              <Label>
                <Serif style={styles.streak}>{streak}</Serif> jour{streak > 1 ? 's' : ''} de suite
                {jokers > 0 ? ` · 🛡 ${jokers} joker${jokers > 1 ? 's' : ''}` : ''}
              </Label>
            </View>
            <WeekDots />
          </Glass>
        </Animated.View>

        <View style={{ flex: 1 }} />

        <Animated.View entering={FadeInDown.delay(360).duration(600)} style={styles.cta}>
          {bedtime &&
            (goodnight ? (
              <Body style={styles.done}>
                {goodnight === 'started'
                  ? 'Bonne nuit 🌙 Ta marmotte veille sur ton écran verrouillé.'
                  : goodnight === 'disabled'
                    ? 'Active les « Activités en direct » de Debout dans Réglages pour voir ta marmotte la nuit.'
                    : 'La marmotte de nuit s’affiche dans l’app installée sur ton iPhone.'}
              </Body>
            ) : (
              <GhostButton label="Bonne nuit 🌙" onPress={onGoodnight} />
            ))}
          <PrimaryButton
            label={doneToday ? 'Refaire une série bonus' : 'Lancer le défi'}
            breathing={!doneToday}
            onPress={() => router.push('/challenge')}
          />
          {doneToday && <Body style={styles.done}>Matin gagné. Le soleil est levé ☀︎</Body>}
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.night },
  safe: { flex: 1, paddingHorizontal: 22 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  hero: { alignItems: 'center', marginTop: 4, marginBottom: 16 },
  time: { fontSize: 92, lineHeight: 100 },
  settingsLink: { marginTop: 14, borderBottomWidth: 1, borderBottomColor: colors.textFaint },
  settingsText: { fontSize: 14, color: colors.textMuted },
  weekHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  streak: { fontSize: 26, lineHeight: 28, color: colors.gold },
  cta: { marginBottom: 110, gap: 12 },
  done: { textAlign: 'center', fontFamily: fonts.medium },
});
