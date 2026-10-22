import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ChoiceRow } from '@/components/choice-row';
import { TimeStepper } from '@/components/time-stepper';
import { Body, GradientCard, PrimaryButton, Title } from '@/components/ui';
import { requestNotificationPermissionAsync, scheduleAlarms } from '@/lib/alarm';
import { EXERCISE_LABELS, REP_OPTIONS } from '@/lib/exercises';
import { RANKS } from '@/lib/progress';
import { DEFAULT_SETTINGS, saveSettings, type Settings } from '@/lib/storage';
import { colors, fonts, radius } from '@/lib/theme';
import { requestCameraPermissionAsync } from '../../modules/rep-counter';

const STEPS = ['pitch', 'name', 'challenge', 'time', 'permissions'] as const;
type Step = (typeof STEPS)[number];

export default function OnboardingScreen() {
  const [step, setStep] = useState<Step>('pitch');
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const stepIndex = STEPS.indexOf(step);

  const finish = async () => {
    await requestNotificationPermissionAsync();
    await requestCameraPermissionAsync();
    saveSettings(settings);
    await scheduleAlarms(settings);
    router.replace('/');
    router.push('/paywall');
  };

  const next = () => (stepIndex < STEPS.length - 1 ? setStep(STEPS[stepIndex + 1]) : finish());

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.dots}>
        {STEPS.map((s, i) => (
          <View key={s} style={[styles.dot, i <= stepIndex && styles.dotActive]} />
        ))}
      </View>

      <KeyboardAvoidingView style={styles.body} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {step === 'pitch' && (
          <>
            <Text style={styles.heroEmoji}>😴 → 🐓</Text>
            <Text style={styles.giant}>Fini la{'\n'}marmotte.</Text>
            <Body style={styles.lead}>
              Le réveil sonne. Pour l’arrêter, tu fais tes pompes devant la caméra. L’IA compte. Pas de bouton
              « répéter ».
            </Body>
          </>
        )}

        {step === 'name' && (
          <>
            <Title>Comment on t’appelle ?</Title>
            <Body>C’est le nom que tes potes verront dans la ligue.</Body>
            <TextInput
              value={settings.name ?? ''}
              onChangeText={(name) => setSettings({ ...settings, name })}
              placeholder="Ton pseudo"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
              autoFocus
              maxLength={16}
            />
          </>
        )}

        {step === 'challenge' && (
          <>
            <Title>Ton défi du matin</Title>
            <ChoiceRow
              value={settings.exercise}
              onChange={(exercise) => setSettings({ ...settings, exercise })}
              options={[
                { value: 'pushup', label: '💪 Pompes' },
                { value: 'squat', label: '🦵 Squats' },
              ]}
            />
            <Body>Combien ?</Body>
            <ChoiceRow
              value={settings.reps}
              onChange={(reps) => setSettings({ ...settings, reps })}
              options={REP_OPTIONS.map((n) => ({ value: n, label: String(n) }))}
            />
            <Body>
              Chaque {EXERCISE_LABELS[settings.exercise].singular} = 1 XP. Fais évoluer ton perso :{' '}
              {RANKS.map((r) => r.emoji).join(' ')}
            </Body>
          </>
        )}

        {step === 'time' && (
          <>
            <Title>Debout à quelle heure ?</Title>
            <GradientCard style={{ paddingVertical: 28 }}>
              <TimeStepper
                hour={settings.hour}
                minute={settings.minute}
                onChange={(hour, minute) => setSettings({ ...settings, hour, minute })}
              />
            </GradientCard>
          </>
        )}

        {step === 'permissions' && (
          <>
            <Title>Deux autorisations</Title>
            <View style={styles.permission}>
              <Text style={styles.permissionEmoji}>🔔</Text>
              <Body style={{ flex: 1 }}>Les notifications, pour te réveiller (et te relancer si tu traînes).</Body>
            </View>
            <View style={styles.permission}>
              <Text style={styles.permissionEmoji}>📷</Text>
              <Body style={{ flex: 1 }}>
                La caméra, pour compter tes {EXERCISE_LABELS[settings.exercise].plural}. Tout reste sur ton téléphone :
                aucune image n’est envoyée.
              </Body>
            </View>
          </>
        )}
      </KeyboardAvoidingView>

      <PrimaryButton
        label={step === 'pitch' ? 'C’est parti' : step === 'permissions' ? 'Autoriser et commencer' : 'Continuer'}
        onPress={next}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background, padding: 24 },
  dots: { flexDirection: 'row', gap: 6 },
  dot: { flex: 1, height: 6, borderRadius: 3, backgroundColor: colors.surfaceHigh },
  dotActive: { backgroundColor: colors.lime },
  body: { flex: 1, justifyContent: 'center', gap: 18 },
  heroEmoji: { fontSize: 56 },
  giant: { color: colors.text, fontFamily: fonts.black, fontSize: 60, lineHeight: 60, letterSpacing: -2 },
  lead: { fontSize: 18, lineHeight: 26 },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.lime,
    borderWidth: 2,
    borderRadius: radius.md,
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: 24,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  permission: { flexDirection: 'row', gap: 14, alignItems: 'center' },
  permissionEmoji: { fontSize: 36 },
});
