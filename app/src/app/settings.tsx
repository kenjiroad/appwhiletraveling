import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Switch, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Aurora } from '@/components/aurora';
import { ChoiceRow } from '@/components/choice-row';
import { TimeStepper } from '@/components/time-stepper';
import { Eyebrow, Glass, Label, PrimaryButton, Serif } from '@/components/ui';
import { scheduleAlarms } from '@/lib/alarm';
import { REP_OPTIONS } from '@/lib/exercises';
import { DEFAULT_SETTINGS, getSettings, saveSettings, type Settings } from '@/lib/storage';
import { colors } from '@/lib/theme';

export default function SettingsScreen() {
  const [settings, setSettings] = useState<Settings>(() => getSettings() ?? DEFAULT_SETTINGS);

  const update = (patch: Partial<Settings>) => {
    const next = { ...settings, ...patch };
    setSettings(next);
    saveSettings(next);
    scheduleAlarms(next);
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
