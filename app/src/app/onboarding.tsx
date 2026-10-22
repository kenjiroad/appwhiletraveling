import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ChoiceRow } from '@/components/choice-row';
import { TimeStepper } from '@/components/time-stepper';
import { requestNotificationPermissionAsync, scheduleAlarms } from '@/lib/alarm';
import { EXERCISE_LABELS, REP_OPTIONS } from '@/lib/exercises';
import { DEFAULT_SETTINGS, saveSettings, type Settings } from '@/lib/storage';
import { colors, radius } from '@/lib/theme';
import { requestCameraPermissionAsync } from '../../modules/rep-counter';

type Step = 'pitch' | 'challenge' | 'time' | 'permissions';

export default function OnboardingScreen() {
  const [step, setStep] = useState<Step>('pitch');
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  const finish = async () => {
    await requestNotificationPermissionAsync();
    await requestCameraPermissionAsync();
    saveSettings(settings);
    await scheduleAlarms(settings);
    router.replace('/');
    router.push('/paywall');
  };

  return (
    <SafeAreaView style={styles.screen}>
      {step === 'pitch' && (
        <View style={styles.body}>
          <Text style={styles.emoji}>⏰💪</Text>
          <Text style={styles.title}>Le réveil qui ne s’arrête que quand tu bouges.</Text>
          <Text style={styles.subtitle}>
            Pas de bouton « répéter ». Pour couper l’alarme, tu fais tes pompes ou tes squats devant la caméra. L’IA
            compte. Tu es réveillé.
          </Text>
        </View>
      )}

      {step === 'challenge' && (
        <View style={styles.body}>
          <Text style={styles.title}>Ton défi du matin</Text>
          <ChoiceRow
            value={settings.exercise}
            onChange={(exercise) => setSettings({ ...settings, exercise })}
            options={[
              { value: 'pushup', label: `${EXERCISE_LABELS.pushup.emoji} Pompes` },
              { value: 'squat', label: `${EXERCISE_LABELS.squat.emoji} Squats` },
            ]}
          />
          <Text style={styles.label}>Combien ?</Text>
          <ChoiceRow
            value={settings.reps}
            onChange={(reps) => setSettings({ ...settings, reps })}
            options={REP_OPTIONS.map((n) => ({ value: n, label: String(n) }))}
          />
        </View>
      )}

      {step === 'time' && (
        <View style={styles.body}>
          <Text style={styles.title}>Tu te lèves à quelle heure ?</Text>
          <TimeStepper
            hour={settings.hour}
            minute={settings.minute}
            onChange={(hour, minute) => setSettings({ ...settings, hour, minute })}
          />
        </View>
      )}

      {step === 'permissions' && (
        <View style={styles.body}>
          <Text style={styles.title}>Deux autorisations</Text>
          <Text style={styles.subtitle}>
            🔔 Les notifications, pour te réveiller.{'\n\n'}📷 La caméra, pour compter tes{' '}
            {EXERCISE_LABELS[settings.exercise].plural}. Tout est analysé sur ton téléphone : aucune image n’est
            envoyée ni enregistrée.
          </Text>
        </View>
      )}

      <Pressable
        style={styles.primaryButton}
        onPress={() => {
          if (step === 'pitch') setStep('challenge');
          else if (step === 'challenge') setStep('time');
          else if (step === 'time') setStep('permissions');
          else finish();
        }}>
        <Text style={styles.primaryButtonText}>{step === 'permissions' ? 'Autoriser et commencer' : 'Continuer'}</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background, padding: 24 },
  body: { flex: 1, justifyContent: 'center', gap: 20 },
  emoji: { fontSize: 64 },
  title: { color: colors.text, fontSize: 32, fontWeight: '800', lineHeight: 38 },
  subtitle: { color: colors.textMuted, fontSize: 18, lineHeight: 26 },
  label: { color: colors.text, fontSize: 18, fontWeight: '700', marginTop: 8 },
  primaryButton: { backgroundColor: colors.accent, paddingVertical: 18, borderRadius: radius.md, alignItems: 'center' },
  primaryButtonText: { color: colors.text, fontSize: 18, fontWeight: '700' },
});
