import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Aurora } from '@/components/aurora';
import { Mascot } from '@/components/mascot';
import { Body, Eyebrow, PrimaryButton, Serif } from '@/components/ui';
import { MASCOT_LEVELS } from '@/lib/mascot';
import { loadPlans, PLANS, purchase, requiresSubscription, restore, useProStatus, type Plan } from '@/lib/purchases';
import { colors, fonts, radius } from '@/lib/theme';

const BENEFITS = [
  'Le réveil qui ne pardonne pas, tous les matins',
  'Pompes et squats comptés par l’IA',
  'Huit niveaux, de la Marmotte à la Légende',
  'Ligues de la semaine contre tes potes',
];

export default function PaywallScreen() {
  const [selected, setSelected] = useState<Plan['id']>('yearly');
  const [plans, setPlans] = useState(PLANS);
  const [busy, setBusy] = useState(false);
  // With the hard paywall there is no "later": the app opens once the trial has started.
  const pro = useProStatus();
  const canClose = !requiresSubscription || pro === true;

  const close = () => (router.canGoBack() ? router.back() : router.replace('/'));

  // Swaps in the App Store prices, in the buyer's currency, once they load.
  useEffect(() => {
    loadPlans().then(setPlans);
  }, []);

  const buy = async () => {
    if (busy) return;
    setBusy(true);
    try {
      if (await purchase(selected)) close();
    } catch (error) {
      Alert.alert('Achat impossible', error instanceof Error ? error.message : 'Réessaie dans un instant.');
    } finally {
      setBusy(false);
    }
  };

  const restorePurchases = async () => {
    try {
      if (await restore()) close();
      else Alert.alert('Aucun abonnement trouvé', 'Aucun achat à restaurer sur ce compte Apple.');
    } catch {
      Alert.alert('Restauration impossible', 'Réessaie dans un instant.');
    }
  };

  return (
    <View style={styles.screen}>
      <Aurora warmth={0.7} />
      <SafeAreaView style={styles.safe}>
        {canClose ? (
          <Pressable onPress={close} hitSlop={12} style={styles.close}>
            <Text style={styles.closeText}>Plus tard</Text>
          </Pressable>
        ) : (
          <View style={styles.closePlaceholder} />
        )}

        <Animated.View entering={FadeInDown.duration(500)}>
          <Mascot source={MASCOT_LEVELS[7]} size={150} idle="float" />
          <Eyebrow>Debout Pro</Eyebrow>
          <Serif style={{ fontSize: 52, lineHeight: 56 }}>Chaque matin,{'\n'}tu gagnes.</Serif>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(150).duration(500)} style={styles.benefits}>
          {BENEFITS.map((text) => (
            <View key={text} style={styles.benefit}>
              <View style={styles.bullet} />
              <Body style={{ flex: 1, color: colors.text }}>{text}</Body>
            </View>
          ))}
        </Animated.View>

        <View style={{ flex: 1 }} />

        <Animated.View entering={FadeInDown.delay(300).duration(500)}>
          {plans.map((plan) => {
            const isSelected = selected === plan.id;
            return (
              <Pressable key={plan.id} onPress={() => setSelected(plan.id)} style={[styles.plan, isSelected && styles.planSelected]}>
                {plan.id === 'yearly' && <Text style={styles.ribbon}>−69 %</Text>}
                <View style={[styles.radio, isSelected && styles.radioOn]} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.planTitle}>{plan.title}</Text>
                  <Text style={styles.planDetail}>{plan.detail}</Text>
                </View>
                <Text style={styles.planPrice} numberOfLines={1}>
                  {plan.price}
                </Text>
              </Pressable>
            );
          })}

          <PrimaryButton label={selected === 'yearly' ? 'Essayer 3 jours gratuits' : 'Continuer'} breathing onPress={buy} />
          <Pressable onPress={restorePurchases} style={styles.restore}>
            <Text style={styles.restoreText}>Restaurer mes achats · Annulable à tout moment</Text>
          </Pressable>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.night },
  safe: { flex: 1, padding: 24 },
  close: { alignSelf: 'flex-end' },
  closePlaceholder: { height: 18 },
  closeText: { color: colors.textMuted, fontFamily: fonts.medium, fontSize: 15 },
  benefits: { gap: 12, marginTop: 20 },
  benefit: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  bullet: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.gold },
  plan: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.glass,
    borderColor: colors.glassBorder,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: 18,
    marginBottom: 12,
  },
  planSelected: { borderColor: colors.gold, backgroundColor: 'rgba(255,196,107,0.1)' },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.textFaint },
  radioOn: { borderColor: colors.gold, backgroundColor: colors.gold },
  ribbon: {
    position: 'absolute',
    top: -11,
    right: 18,
    backgroundColor: colors.rose,
    color: '#FFFFFF',
    fontFamily: fonts.bold,
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  planTitle: { color: colors.text, fontFamily: fonts.semibold, fontSize: 17 },
  planDetail: { color: colors.textMuted, fontFamily: fonts.regular, fontSize: 14, marginTop: 2 },
  planPrice: { color: colors.text, fontFamily: fonts.serif, fontSize: 24, marginLeft: 8, flexShrink: 0 },
  restore: { paddingVertical: 14, alignItems: 'center' },
  restoreText: { color: colors.textMuted, fontFamily: fonts.regular, fontSize: 13 },
});
