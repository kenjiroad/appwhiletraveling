import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, TextInput, View } from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Aurora } from '@/components/aurora';
import { ChoiceRow } from '@/components/choice-row';
import { Mascot } from '@/components/mascot';
import { TimeStepper } from '@/components/time-stepper';
import { Body, Eyebrow, Glass, Label, PrimaryButton, Serif } from '@/components/ui';
import { requestAlarmPermissionAsync, scheduleAlarms } from '@/lib/alarm';
import { requiresSubscription } from '@/lib/purchases';
import { EXERCISE_LABELS, REP_OPTIONS } from '@/lib/exercises';
import { MASCOT_POSES } from '@/lib/mascot';
import { DEFAULT_SETTINGS, saveSettings, type Settings } from '@/lib/storage';
import { syncNow } from '@/lib/sync';
import { colors, fonts, radius } from '@/lib/theme';
import { requestCameraPermissionAsync } from '../../modules/rep-counter';

const STEPS = ['pitch', 'name', 'challenge', 'time', 'permissions'] as const;
type Step = (typeof STEPS)[number];

export default function OnboardingScreen() {
  const [step, setStep] = useState<Step>('pitch');
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const stepIndex = STEPS.indexOf(step);

  const finish = async () => {
    await requestAlarmPermissionAsync();
    await requestCameraPermissionAsync();
    saveSettings(settings);
    syncNow();
    if (!requiresSubscription) {
      await scheduleAlarms(settings);
      router.replace('/');
      router.push('/paywall');
    } else {
      // Hard paywall: the alarms are planned by the home screen once the trial has started.
      router.replace('/paywall');
    }
  };

  const next = () => (stepIndex < STEPS.length - 1 ? setStep(STEPS[stepIndex + 1]) : finish());
  const enter = (i: number) => FadeInDown.delay(80 + i * 90).duration(550);

  return (
    <View style={styles.screen}>
      <Aurora warmth={stepIndex / (STEPS.length - 1)} />
      <SafeAreaView style={styles.safe}>
        <View style={styles.dots}>
          {STEPS.map((s, i) => (
            <View key={s} style={[styles.dot, i <= stepIndex && styles.dotActive]} />
          ))}
        </View>

        <KeyboardAvoidingView style={styles.body} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <Animated.View key={step} exiting={FadeOutUp.duration(200)} style={{ gap: 18 }}>
            {step === 'pitch' && (
              <>
                <Animated.View entering={enter(0)}>
                  <Mascot source={MASCOT_POSES.sleep} size={190} />
                </Animated.View>
                <Animated.View entering={enter(1)}>
                  <Serif style={styles.giant}>Fini la{'\n'}marmotte.</Serif>
                </Animated.View>
                <Animated.View entering={enter(2)}>
                  <Body style={styles.lead}>
                    Ton réveil ne s’arrête que quand tu bouges. Quelques pompes devant la caméra, l’IA compte, et le
                    soleil se lève.
                  </Body>
                </Animated.View>
              </>
            )}

            {step === 'name' && (
              <>
                <Animated.View entering={enter(0)}>
                  <Eyebrow>Ton pseudo</Eyebrow>
                  <Serif>Comment on t’appelle ?</Serif>
                </Animated.View>
                <Animated.View entering={enter(1)}>
                  <TextInput
                    value={settings.name ?? ''}
                    onChangeText={(name) => setSettings({ ...settings, name })}
                    placeholder="Ton pseudo"
                    placeholderTextColor={colors.textFaint}
                    style={styles.input}
                    autoFocus
                    maxLength={16}
                  />
                </Animated.View>
                <Animated.View entering={enter(2)}>
                  <Body>C’est le nom que tes potes verront dans la ligue.</Body>
                </Animated.View>
              </>
            )}

            {step === 'challenge' && (
              <>
                <Animated.View entering={enter(0)}>
                  <Eyebrow>Le défi du matin</Eyebrow>
                  <Serif>Qu’est-ce qui te réveille ?</Serif>
                </Animated.View>
                <Animated.View entering={enter(1)} style={{ gap: 10 }}>
                  <ChoiceRow
                    value={settings.exercise}
                    onChange={(exercise) => setSettings({ ...settings, exercise })}
                    options={[
                      { value: 'pushup', label: 'Pompes' },
                      { value: 'squat', label: 'Squats' },
                    ]}
                  />
                  <ChoiceRow
                    value={settings.reps}
                    onChange={(reps) => setSettings({ ...settings, reps })}
                    options={REP_OPTIONS.map((n) => ({ value: n, label: String(n) }))}
                  />
                </Animated.View>
                <Animated.View entering={enter(2)}>
                  <Body>
                    Chaque {EXERCISE_LABELS[settings.exercise].singular} te rapporte de l’XP. Huit niveaux, de la Marmotte à
                    la Légende.
                  </Body>
                </Animated.View>
              </>
            )}

            {step === 'time' && (
              <>
                <Animated.View entering={enter(0)}>
                  <Eyebrow>Ton réveil</Eyebrow>
                  <Serif>Debout à quelle heure ?</Serif>
                </Animated.View>
                <Animated.View entering={enter(1)}>
                  <Glass style={{ paddingVertical: 28 }}>
                    <TimeStepper
                      hour={settings.hour}
                      minute={settings.minute}
                      size={96}
                      onChange={(hour, minute) => setSettings({ ...settings, hour, minute })}
                    />
                  </Glass>
                </Animated.View>
              </>
            )}

            {step === 'permissions' && (
              <>
                <Animated.View entering={enter(0)}>
                  <Eyebrow>Dernière étape</Eyebrow>
                  <Serif>Deux autorisations.</Serif>
                </Animated.View>
                <Animated.View entering={enter(1)}>
                  <Glass style={{ gap: 6 }}>
                    <Label>Réveil et notifications</Label>
                    <Body>Pour sonner comme un vrai réveil, même en silencieux, et te relancer si tu traînes.</Body>
                  </Glass>
                </Animated.View>
                <Animated.View entering={enter(2)}>
                  <Glass style={{ gap: 6 }}>
                    <Label>Caméra</Label>
                    <Body>
                      Pour compter tes {EXERCISE_LABELS[settings.exercise].plural}. Tout reste sur ton téléphone : aucune
                      image n’est envoyée.
                    </Body>
                  </Glass>
                </Animated.View>
              </>
            )}
          </Animated.View>
        </KeyboardAvoidingView>

        <PrimaryButton
          label={step === 'pitch' ? 'Commencer' : step === 'permissions' ? 'Autoriser et continuer' : 'Continuer'}
          breathing={step === 'pitch'}
          onPress={next}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.night },
  safe: { flex: 1, padding: 24 },
  dots: { flexDirection: 'row', gap: 6 },
  dot: { flex: 1, height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.12)' },
  dotActive: { backgroundColor: colors.gold },
  body: { flex: 1, justifyContent: 'center' },
  giant: { fontSize: 76, lineHeight: 76, letterSpacing: -1.5 },
  lead: { fontSize: 18, lineHeight: 27 },
  input: {
    backgroundColor: colors.glass,
    borderColor: colors.glassBorder,
    borderWidth: 1,
    borderRadius: radius.pill,
    color: colors.text,
    fontFamily: fonts.medium,
    fontSize: 22,
    paddingHorizontal: 24,
    paddingVertical: 18,
  },
});
