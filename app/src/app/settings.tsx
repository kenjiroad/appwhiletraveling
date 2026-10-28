import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Switch, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Aurora } from '@/components/aurora';
import { ChoiceRow } from '@/components/choice-row';
import { TimeStepper } from '@/components/time-stepper';
import { Body, Eyebrow, GhostButton, Glass, Label, PrimaryButton, Serif } from '@/components/ui';
import { getAlarmStatus, scheduleAlarms, type AlarmStatus } from '@/lib/alarm';
import { REP_OPTIONS } from '@/lib/exercises';
import { DEFAULT_SETTINGS, getSettings, saveSettings, type Settings } from '@/lib/storage';
import { colors } from '@/lib/theme';

export default function SettingsScreen() {
  const [settings, setSettings] = useState<Settings>(() => getSettings() ?? DEFAULT_SETTINGS);
  const [status, setStatus] = useState<AlarmStatus | null>(null);
  const [testPlanned, setTestPlanned] = useState(false);
  const scheduleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const refreshStatus = (next: Settings) => getAlarmStatus(next).then(setStatus);

  useEffect(() => {
    refreshStatus(settings);
    return () => {
      if (scheduleTimer.current) clearTimeout(scheduleTimer.current);
    };
    // Only on open: later refreshes follow each re-plan.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = (patch: Partial<Settings>) => {
    const next = { ...settings, ...patch };
    setSettings(next);
    saveSettings(next);
    // The time wheel fires on every tick: re-plan the alarms once it stops.
    if (scheduleTimer.current) clearTimeout(scheduleTimer.current);
    scheduleTimer.current = setTimeout(async () => {
      await scheduleAlarms(next);
      refreshStatus(next);
    }, 600);
  };

  const testAlarm = async () => {
    await scheduleAlarms(settings, new Date(Date.now() + 60_000));
    setTestPlanned(true);
    refreshStatus(settings);
  };

  return (
    <View style={styles.screen}>
      <Aurora warmth={0.2} />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content}>
          <Serif>Réglages</Serif>

          <Glass style={{ gap: 18 }}>
            <View style={styles.row}>
              <Label>Réveil activé</Label>
              <Switch
                value={settings.enabled}
                onValueChange={(enabled) => update({ enabled })}
                trackColor={{ true: colors.sun, false: 'rgba(255,255,255,0.2)' }}
              />
            </View>
            <TimeStepper hour={settings.hour} minute={settings.minute} onChange={(hour, minute) => update({ hour, minute })} />
          </Glass>

          <Eyebrow>Le défi</Eyebrow>
          <ChoiceRow
            value={settings.exercise}
            onChange={(exercise) => update({ exercise })}
            options={[
              { value: 'pushup', label: 'Pompes' },
              { value: 'squat', label: 'Squats' },
            ]}
          />
          <ChoiceRow
            value={settings.reps}
            onChange={(reps) => update({ reps })}
            options={REP_OPTIONS.map((n) => ({ value: n, label: String(n) }))}
          />

          <Eyebrow>Vérifier le réveil</Eyebrow>
          <Glass style={{ gap: 10 }}>
            <Label>
              {status?.mode === 'alarmkit'
                ? 'Réveil iOS ✓ (sonne même en silencieux)'
                : status?.mode === 'notifications'
                  ? 'Notifications seulement ⚠︎'
                  : 'Aucun réveil programmé'}
            </Label>
            <Body>{status ? `${status.planned} sonnerie${status.planned > 1 ? 's' : ''} programmée${status.planned > 1 ? 's' : ''}.` : '…'}</Body>
            {status?.problem && <Body style={{ color: colors.gold }}>{status.problem}</Body>}
            {status?.mode === 'notifications' && (
              <Body>En mode notifications, le mode silencieux coupe le son.</Body>
            )}
            <GhostButton
              label={testPlanned ? 'Test prévu dans 1 minute : verrouille ton téléphone' : 'Tester le réveil dans 1 minute'}
              onPress={testAlarm}
            />
          </Glass>

          <PrimaryButton label="Terminé" onPress={() => router.back()} style={{ marginTop: 20 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.night },
  content: { padding: 22, gap: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
