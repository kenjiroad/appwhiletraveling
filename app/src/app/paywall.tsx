import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Body, PrimaryButton, Title } from '@/components/ui';
import { PLANS, purchase, restore, type Plan } from '@/lib/purchases';
import { colors, fonts, radius } from '@/lib/theme';

const BENEFITS = [
  ['⏰', 'Le réveil qui ne pardonne pas, tous les matins'],
  ['🤖', 'Pompes et squats comptés par l’IA'],
  ['🧬', 'Fais évoluer ton perso jusqu’à 👑 Légende'],
  ['🏆', 'Ligues hebdo contre tes potes'],
];

export default function PaywallScreen() {
  const [selected, setSelected] = useState<Plan['id']>('yearly');

  const buy = async () => {
    if (await purchase(selected)) router.back();
  };

  return (
    <SafeAreaView style={styles.screen}>
      <Pressable onPress={() => router.back()} hitSlop={12} style={styles.close}>
        <Text style={styles.closeText}>✕</Text>
      </Pressable>

      <Text style={styles.emoji}>🐓⚡</Text>
      <Title style={{ fontSize: 40, lineHeight: 42 }}>Debout{'\n'}Pro</Title>
      <View style={styles.benefits}>
        {BENEFITS.map(([emoji, text]) => (
          <View key={text} style={styles.benefit}>
            <Text style={styles.benefitEmoji}>{emoji}</Text>
            <Body style={{ flex: 1, color: colors.text }}>{text}</Body>
          </View>
        ))}
      </View>

      <View style={{ flex: 1 }} />

      {PLANS.map((plan) => {
        const isSelected = selected === plan.id;
        return (
          <Pressable
            key={plan.id}
            onPress={() => setSelected(plan.id)}
            style={[styles.plan, isSelected && styles.planSelected]}>
            {plan.id === 'yearly' && <Text style={styles.ribbon}>−69 %</Text>}
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

      <PrimaryButton label={selected === 'yearly' ? 'Essayer 3 jours gratuits' : 'Continuer'} onPress={buy} />
      <Pressable onPress={restore} style={styles.restore}>
        <Text style={styles.restoreText}>Restaurer mes achats · Annulable à tout moment</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background, padding: 24 },
  close: { alignSelf: 'flex-end' },
  closeText: { color: colors.textMuted, fontSize: 22 },
  emoji: { fontSize: 54, marginBottom: 6 },
  benefits: { gap: 12, marginTop: 18 },
  benefit: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  benefitEmoji: { fontSize: 24 },
  plan: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 2,
    borderRadius: radius.lg,
    padding: 18,
    marginBottom: 12,
  },
  planSelected: { borderColor: colors.lime, backgroundColor: colors.surfaceHigh },
  ribbon: {
    position: 'absolute',
    top: -12,
    right: 18,
    backgroundColor: colors.pink,
    color: colors.text,
    fontFamily: fonts.black,
    fontSize: 13,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  planTitle: { color: colors.text, fontFamily: fonts.black, fontSize: 18 },
  planDetail: { color: colors.textMuted, fontFamily: fonts.regular, fontSize: 14, marginTop: 2 },
  planPrice: { color: colors.text, fontFamily: fonts.black, fontSize: 18, marginLeft: 12, flexShrink: 0 },
  restore: { paddingVertical: 14, alignItems: 'center' },
  restoreText: { color: colors.textMuted, fontFamily: fonts.regular, fontSize: 13 },
});
