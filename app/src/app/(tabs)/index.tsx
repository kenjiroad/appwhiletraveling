import { Redirect, router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ChoiceRow } from '@/components/choice-row';
import { TimeStepper } from '@/components/time-stepper';
import { Body, Card, Chip, GradientCard, Label, PrimaryButton, ProgressBar, Title } from '@/components/ui';
import { scheduleAlarms } from '@/lib/alarm';
import { EXERCISE_LABELS, REP_OPTIONS } from '@/lib/exercises';
import { getXp, rankFor } from '@/lib/progress';
import { getSettings, getStreak, isTodayCompleted, saveSettings, type Settings } from '@/lib/storage';
import { colors, fonts } from '@/lib/theme';

export default function AlarmScreen() {
  const [settings, setSettings] = useState(getSettings);
  const [streak, setStreak] = useState(getStreak);
  const [doneToday, setDoneToday] = useState(isTodayCompleted);
  const [xp, setXp] = useState(getXp);

  useFocusEffect(
    useCallback(() => {
      setStreak(getStreak());
      setDoneToday(isTodayCompleted());
      setXp(getXp());
      // Re-plan on every visit so the notification window keeps rolling forward.
      const current = getSettings();
      if (current) scheduleAlarms(current);
    }, [])
  );

  if (!settings) return <Redirect href="/onboarding" />;

  const { rank, next, progress, xpToNext } = rankFor(xp);

  const update = (patch: Partial<Settings>) => {
    const nextSettings = { ...settings, ...patch };
    setSettings(nextSettings);
    saveSettings(nextSettings);
    scheduleAlarms(nextSettings);
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Body>Salut {settings.name ?? 'toi'} 👋</Body>
            <Title>Debout.</Title>
          </View>
          <Chip style={{ borderColor: rank.color, borderWidth: 2 }}>
            {rank.emoji} {rank.name}
          </Chip>
        </View>

        <GradientCard>
          <View style={styles.heroTop}>
            <Text style={styles.overline}>PROCHAIN RÉVEIL</Text>
            <Switch
              value={settings.enabled}
              onValueChange={(enabled) => update({ enabled })}
              trackColor={{ true: colors.lime, false: 'rgba(255,255,255,0.25)' }}
              thumbColor={colors.background}
            />
          </View>
          <TimeStepper hour={settings.hour} minute={settings.minute} onChange={(hour, minute) => update({ hour, minute })} />
          <Text style={styles.heroHint}>
            {settings.enabled
              ? `Pour l’arrêter : ${settings.reps} ${EXERCISE_LABELS[settings.exercise].plural}. Pas de pitié.`
              : 'Réveil en pause.'}
          </Text>
        </GradientCard>

        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Text style={styles.statEmoji}>🔥</Text>
            <Text style={styles.statValue}>{streak}</Text>
            <Body>jour{streak > 1 ? 's' : ''} de suite</Body>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statEmoji}>⚡</Text>
            <Text style={styles.statValue}>{xp}</Text>
            <Body>XP</Body>
          </Card>
        </View>

        <Card style={{ gap: 10 }}>
          <View style={styles.rowBetween}>
            <Label>
              {rank.emoji} {rank.name}
            </Label>
            <Body>{next ? `${next.emoji} ${next.name}` : 'Rang max'}</Body>
          </View>
          <ProgressBar progress={progress} />
          <Body>{next ? `Plus que ${xpToNext} XP pour évoluer.` : 'Tu es une légende. Respect.'}</Body>
        </Card>

        <Label style={styles.section}>Ton défi</Label>
        <ChoiceRow
          value={settings.exercise}
          onChange={(exercise) => update({ exercise })}
          options={[
            { value: 'pushup', label: '💪 Pompes' },
            { value: 'squat', label: '🦵 Squats' },
          ]}
        />
        <ChoiceRow
          value={settings.reps}
          onChange={(reps) => update({ reps })}
          options={REP_OPTIONS.map((n) => ({ value: n, label: String(n) }))}
        />

        {doneToday ? (
          <Card style={styles.doneCard}>
            <Label style={{ color: colors.lime }}>✅ Défi du jour validé</Label>
            <Body>Tu peux en refaire pour gagner de l’XP en plus.</Body>
          </Card>
        ) : null}
        <PrimaryButton
          label={doneToday ? '⚡ Bonus : refaire une série' : '⚡ Lancer le défi'}
          onPress={() => router.push('/challenge')}
          style={{ marginTop: 6 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 14, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  overline: { color: 'rgba(255,255,255,0.85)', fontFamily: fonts.black, fontSize: 13, letterSpacing: 1.5 },
  heroHint: { color: 'rgba(255,255,255,0.9)', fontFamily: fonts.semibold, fontSize: 15, textAlign: 'center', marginTop: 14 },
  statsRow: { flexDirection: 'row', gap: 12 },
  statCard: { flex: 1, gap: 2 },
  statEmoji: { fontSize: 26 },
  statValue: { color: colors.text, fontFamily: fonts.black, fontSize: 34 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  section: { fontSize: 20, marginTop: 8 },
  doneCard: { borderColor: colors.lime, gap: 4 },
});
