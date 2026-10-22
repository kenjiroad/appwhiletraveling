import { Redirect, router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ChoiceRow } from '@/components/choice-row';
import { TimeStepper } from '@/components/time-stepper';
import { scheduleAlarms } from '@/lib/alarm';
import { EXERCISE_LABELS, REP_OPTIONS } from '@/lib/exercises';
import { getSettings, getStreak, isTodayCompleted, saveSettings, type Settings } from '@/lib/storage';
import { colors, radius } from '@/lib/theme';

export default function HomeScreen() {
  const [settings, setSettings] = useState(getSettings);
  const [streak, setStreak] = useState(getStreak);
  const [doneToday, setDoneToday] = useState(isTodayCompleted);

  useFocusEffect(
    useCallback(() => {
      setStreak(getStreak());
      setDoneToday(isTodayCompleted());
      // Re-plan on every visit so the notification window keeps rolling forward.
      const current = getSettings();
      if (current) scheduleAlarms(current);
    }, [])
  );

  if (!settings) return <Redirect href="/onboarding" />;

  const update = (patch: Partial<Settings>) => {
    const next = { ...settings, ...patch };
    setSettings(next);
    saveSettings(next);
    scheduleAlarms(next);
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Debout</Text>
          <View style={styles.streak}>
            <Text style={styles.streakText}>🔥 {streak}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Réveil</Text>
            <Switch
              value={settings.enabled}
              onValueChange={(enabled) => update({ enabled })}
              trackColor={{ true: colors.accent }}
            />
          </View>
          <TimeStepper hour={settings.hour} minute={settings.minute} onChange={(hour, minute) => update({ hour, minute })} />
          <Text style={styles.status}>
            {doneToday ? '✅ Défi du jour réussi' : 'Le réveil s’arrête quand ton défi est fait.'}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Ton défi</Text>
        <ChoiceRow
          value={settings.exercise}
          onChange={(exercise) => update({ exercise })}
          options={[
            { value: 'pushup', label: `${EXERCISE_LABELS.pushup.emoji} Pompes` },
            { value: 'squat', label: `${EXERCISE_LABELS.squat.emoji} Squats` },
          ]}
        />
        <View style={{ height: 10 }} />
        <ChoiceRow
          value={settings.reps}
          onChange={(reps) => update({ reps })}
          options={REP_OPTIONS.map((n) => ({ value: n, label: String(n) }))}
        />

        <Pressable style={styles.primaryButton} onPress={() => router.push('/challenge')}>
          <Text style={styles.primaryButtonText}>Tester le défi maintenant</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  title: { color: colors.text, fontSize: 34, fontWeight: '800' },
  streak: { backgroundColor: colors.card, borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 8 },
  streakText: { color: colors.text, fontSize: 18, fontWeight: '800' },
  card: {
    backgroundColor: colors.card,
    borderColor: colors.cardBorder,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: 20,
    gap: 16,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { color: colors.text, fontSize: 20, fontWeight: '700' },
  status: { color: colors.textMuted, fontSize: 15, textAlign: 'center' },
  sectionTitle: { color: colors.text, fontSize: 20, fontWeight: '700', marginTop: 12 },
  primaryButton: {
    backgroundColor: colors.accent,
    paddingVertical: 18,
    borderRadius: radius.md,
    alignItems: 'center',
    marginTop: 20,
  },
  primaryButtonText: { color: colors.text, fontSize: 18, fontWeight: '700' },
});
