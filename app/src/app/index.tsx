import * as MediaLibrary from 'expo-media-library/legacy';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { formatStorage, getMonthsWithPhotos, type Month } from '@/lib/photos';
import { colors, radius } from '@/lib/theme';
import { getDeletedTotal } from '@/lib/usage';

export default function HomeScreen() {
  const [permission, requestPermission] = MediaLibrary.usePermissions({ granularPermissions: ['photo'] });
  const [months, setMonths] = useState<Month[] | null>(null);
  const [deletedTotal, setDeletedTotal] = useState(0);

  const granted = permission?.granted ?? false;

  useFocusEffect(
    useCallback(() => {
      setDeletedTotal(getDeletedTotal());
      if (granted) getMonthsWithPhotos().then(setMonths);
    }, [granted])
  );

  if (!permission) return <View style={styles.screen} />;

  if (!granted) {
    return (
      <SafeAreaView style={[styles.screen, styles.onboarding]}>
        <Text style={styles.emoji}>🧹</Text>
        <Text style={styles.title}>Ton iPhone est plein ?</Text>
        <Text style={styles.subtitle}>
          Swipe tes photos comme sur Tinder.{'\n'}À gauche : supprimer. À droite : garder.{'\n'}
          Libère des Go en quelques minutes.
        </Text>
        <Pressable style={styles.primaryButton} onPress={requestPermission}>
          <Text style={styles.primaryButtonText}>Commencer le ménage</Text>
        </Pressable>
        <Text style={styles.hint}>Tes photos restent sur ton téléphone. Rien n’est envoyé.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <FlatList
        data={months ?? []}
        keyExtractor={(m) => m.key}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>Ménage</Text>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{formatStorage(deletedTotal)}</Text>
              <Text style={styles.statLabel}>
                libérés · {deletedTotal} photo{deletedTotal > 1 ? 's' : ''} supprimée{deletedTotal > 1 ? 's' : ''}
              </Text>
            </View>
            <Text style={styles.sectionTitle}>Choisis un mois à trier</Text>
            {!months && <ActivityIndicator color={colors.text} style={{ marginTop: 24 }} />}
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            style={styles.monthRow}
            onPress={() =>
              router.push({
                pathname: '/swipe',
                params: { start: item.start, end: item.end, label: item.label },
              })
            }>
            <Text style={styles.monthLabel}>{item.label}</Text>
            <Text style={styles.monthCount}>{item.count} photos ›</Text>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  onboarding: { justifyContent: 'center', alignItems: 'center', padding: 28 },
  emoji: { fontSize: 72, marginBottom: 16 },
  title: { color: colors.text, fontSize: 34, fontWeight: '800', marginBottom: 12 },
  subtitle: { color: colors.textMuted, fontSize: 17, lineHeight: 25, textAlign: 'center', marginBottom: 32 },
  primaryButton: {
    backgroundColor: colors.accent,
    paddingVertical: 18,
    alignSelf: 'stretch',
    borderRadius: radius.md,
    alignItems: 'center',
  },
  primaryButtonText: { color: colors.text, fontSize: 18, fontWeight: '700' },
  hint: { color: colors.textMuted, fontSize: 13, marginTop: 16 },
  list: { padding: 20, gap: 10 },
  statCard: {
    backgroundColor: colors.card,
    borderColor: colors.cardBorder,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: 20,
    marginBottom: 24,
  },
  statValue: { color: colors.keep, fontSize: 40, fontWeight: '800' },
  statLabel: { color: colors.textMuted, fontSize: 15, marginTop: 4 },
  sectionTitle: { color: colors.text, fontSize: 20, fontWeight: '700', marginBottom: 6 },
  monthRow: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  monthLabel: { color: colors.text, fontSize: 17, fontWeight: '600' },
  monthCount: { color: colors.textMuted, fontSize: 16 },
});
