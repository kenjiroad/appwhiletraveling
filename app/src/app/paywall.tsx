import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PLANS, purchase, restore, type Plan } from '@/lib/purchases';
import { colors, radius } from '@/lib/theme';

const BENEFITS = ['Swipes illimités', 'Tous tes mois et toutes tes années', 'Libère des Go en quelques minutes'];

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

      <Text style={styles.emoji}>🧹✨</Text>
      <Text style={styles.title}>Ménage Pro</Text>
      {BENEFITS.map((b) => (
        <Text key={b} style={styles.benefit}>
          ✓ {b}
        </Text>
      ))}

      <View style={{ flex: 1 }} />

      {PLANS.map((plan) => (
        <Pressable
          key={plan.id}
          onPress={() => setSelected(plan.id)}
          style={[styles.plan, selected === plan.id && styles.planSelected]}>
          <View>
            <Text style={styles.planTitle}>{plan.title}</Text>
            <Text style={styles.planDetail}>{plan.detail}</Text>
          </View>
          <Text style={styles.planPrice}>{plan.price}</Text>
        </Pressable>
      ))}

      <Pressable style={styles.cta} onPress={buy}>
        <Text style={styles.ctaText}>{selected === 'weekly' ? 'Essayer gratuitement' : 'Continuer'}</Text>
      </Pressable>
      <Pressable onPress={restore} style={styles.restore}>
        <Text style={styles.restoreText}>Restaurer mes achats · Annulable à tout moment</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background, padding: 24 },
  close: { alignSelf: 'flex-end' },
  closeText: { color: colors.textMuted, fontSize: 20 },
  emoji: { fontSize: 56, marginTop: 12 },
  title: { color: colors.text, fontSize: 34, fontWeight: '800', marginVertical: 16 },
  benefit: { color: colors.text, fontSize: 18, marginBottom: 10 },
  plan: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.cardBorder,
    borderWidth: 2,
    borderRadius: radius.md,
    padding: 18,
    marginBottom: 12,
  },
  planSelected: { borderColor: colors.accent },
  planTitle: { color: colors.text, fontSize: 17, fontWeight: '700' },
  planDetail: { color: colors.textMuted, fontSize: 14, marginTop: 2 },
  planPrice: { color: colors.text, fontSize: 17, fontWeight: '700' },
  cta: { backgroundColor: colors.accent, borderRadius: radius.md, paddingVertical: 18, alignItems: 'center', marginTop: 4 },
  ctaText: { color: colors.text, fontSize: 18, fontWeight: '700' },
  restore: { paddingVertical: 14, alignItems: 'center' },
  restoreText: { color: colors.textMuted, fontSize: 13 },
});
