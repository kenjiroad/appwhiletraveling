import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import type { Asset } from 'expo-media-library/legacy';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, Share, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SwipeCard, type SwipeCardHandle, type SwipeDirection } from '@/components/swipe-card';
import { deletePhotos, formatStorage, getPhotosInRange } from '@/lib/photos';
import { isPro } from '@/lib/purchases';
import { colors, radius } from '@/lib/theme';
import { FREE_DAILY_SWIPES, addDeleted, getSwipesToday, recordSwipe } from '@/lib/usage';

type Phase = 'swiping' | 'review' | 'done';

const isLimitReached = () => !isPro() && getSwipesToday() >= FREE_DAILY_SWIPES;

export default function SwipeScreen() {
  const params = useLocalSearchParams<{ start: string; end: string; label: string }>();
  const [photos, setPhotos] = useState<Asset[] | null>(null);
  const [index, setIndex] = useState(0);
  const [toRemove, setToRemove] = useState<string[]>([]);
  const [history, setHistory] = useState<SwipeDirection[]>([]);
  const [phase, setPhase] = useState<Phase>('swiping');
  const [deletedCount, setDeletedCount] = useState(0);
  const [limitReached, setLimitReached] = useState(false);
  const cardRef = useRef<SwipeCardHandle>(null);

  useEffect(() => {
    getPhotosInRange(Number(params.start), Number(params.end)).then(setPhotos);
  }, [params.start, params.end]);

  // Re-checked on focus too, so coming back from the paywall unlocks the deck.
  useFocusEffect(
    useCallback(() => {
      setLimitReached(isLimitReached());
    }, [])
  );

  const onSwiped = useCallback(
    (direction: SwipeDirection) => {
      if (!photos) return;
      const photo = photos[index];
      Haptics.impactAsync(
        direction === 'remove' ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light
      );
      recordSwipe();
      setLimitReached(isLimitReached());
      if (direction === 'remove') setToRemove((ids) => [...ids, photo.id]);
      setHistory((h) => [...h, direction]);
      const next = index + 1;
      setIndex(next);
      if (next >= photos.length) setPhase('review');
    },
    [photos, index]
  );

  const undo = () => {
    if (index === 0) return;
    const last = history[history.length - 1];
    if (last === 'remove') setToRemove((ids) => ids.slice(0, -1));
    setHistory((h) => h.slice(0, -1));
    setIndex(index - 1);
  };

  const confirmDelete = async () => {
    if (toRemove.length === 0) {
      setPhase('done');
      return;
    }
    const ok = await deletePhotos(toRemove);
    if (!ok) return;
    addDeleted(toRemove.length);
    setDeletedCount(toRemove.length);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setPhase('done');
  };

  const share = () =>
    Share.share({
      message: `J'ai libéré ${formatStorage(deletedCount)} sur mon iPhone en swipant mes photos avec Ménage 🧹`,
    });

  if (!photos) {
    return (
      <View style={[styles.screen, styles.center]}>
        <ActivityIndicator color={colors.text} />
      </View>
    );
  }

  if (phase === 'done') {
    return (
      <SafeAreaView style={[styles.screen, styles.center, styles.padded]}>
        <Text style={styles.bigEmoji}>🎉</Text>
        <Text style={styles.title}>{formatStorage(deletedCount)} libérés</Text>
        <Text style={styles.subtitle}>
          {deletedCount} photo{deletedCount > 1 ? 's' : ''} supprimée{deletedCount > 1 ? 's' : ''} en{' '}
          {params.label?.toLowerCase()}.{'\n'}Elles restent 30 jours dans « Supprimés récemment ».
        </Text>
        {deletedCount > 0 && (
          <Pressable style={styles.secondaryButton} onPress={share}>
            <Text style={styles.secondaryButtonText}>Partager mon score</Text>
          </Pressable>
        )}
        <Pressable style={styles.primaryButton} onPress={() => router.back()}>
          <Text style={styles.primaryButtonText}>Trier un autre mois</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (phase === 'review') {
    return (
      <SafeAreaView style={[styles.screen, styles.padded]}>
        <Text style={styles.title}>{toRemove.length} à supprimer</Text>
        <Text style={styles.subtitle}>≈ {formatStorage(toRemove.length)} à libérer</Text>
        <View style={styles.grid}>
          {toRemove.slice(0, 24).map((id) => {
            const photo = photos.find((p) => p.id === id);
            return photo ? <Image key={id} source={{ uri: photo.uri }} style={styles.thumb} /> : null;
          })}
        </View>
        <View style={{ flex: 1 }} />
        <Pressable style={[styles.primaryButton, { backgroundColor: colors.remove }]} onPress={confirmDelete}>
          <Text style={styles.primaryButtonText}>
            {toRemove.length > 0 ? `Supprimer ${toRemove.length} photos` : 'Terminer'}
          </Text>
        </Pressable>
        <Pressable style={styles.linkButton} onPress={() => setPhase('swiping')}>
          <Text style={styles.linkText}>Continuer à trier</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const current = photos[index];
  const next = photos[index + 1];

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text style={styles.headerAction}>✕</Text>
        </Pressable>
        <Text style={styles.headerTitle}>
          {params.label} · {Math.min(index + 1, photos.length)}/{photos.length}
        </Text>
        <Pressable onPress={() => setPhase('review')} hitSlop={12}>
          <Text style={[styles.headerAction, { color: colors.remove }]}>🗑 {toRemove.length}</Text>
        </Pressable>
      </View>

      <View style={styles.deck}>
        {limitReached ? (
          <View style={[styles.limitCard, styles.center]}>
            <Text style={styles.bigEmoji}>⏳</Text>
            <Text style={styles.title}>Limite du jour atteinte</Text>
            <Text style={styles.subtitle}>
              {FREE_DAILY_SWIPES} photos triées aujourd’hui.{'\n'}Passe en illimité pour finir ton ménage.
            </Text>
            <Pressable style={styles.primaryButton} onPress={() => router.push('/paywall')}>
              <Text style={styles.primaryButtonText}>Débloquer l’illimité</Text>
            </Pressable>
            <Pressable style={styles.linkButton} onPress={() => setPhase('review')}>
              <Text style={styles.linkText}>Supprimer ma sélection ({toRemove.length})</Text>
            </Pressable>
          </View>
        ) : (
          <>
            {next && <Image source={{ uri: next.uri }} style={styles.nextCard} contentFit="cover" />}
            {current && <SwipeCard key={current.id} ref={cardRef} uri={current.uri} onSwiped={onSwiped} />}
          </>
        )}
      </View>

      {!limitReached && (
        <View style={styles.controls}>
          <Pressable style={[styles.roundButton, { borderColor: colors.remove }]} onPress={() => cardRef.current?.swipe('remove')}>
            <Text style={[styles.roundIcon, { color: colors.remove }]}>✕</Text>
          </Pressable>
          <Pressable style={[styles.roundButton, styles.smallRound]} onPress={undo}>
            <Text style={styles.undoIcon}>↺</Text>
          </Pressable>
          <Pressable style={[styles.roundButton, { borderColor: colors.keep }]} onPress={() => cardRef.current?.swipe('keep')}>
            <Text style={[styles.roundIcon, { color: colors.keep }]}>♥</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  center: { justifyContent: 'center', alignItems: 'center' },
  padded: { padding: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12 },
  headerTitle: { color: colors.text, fontSize: 16, fontWeight: '600' },
  headerAction: { color: colors.text, fontSize: 18, fontWeight: '700' },
  deck: { flex: 1, marginHorizontal: 16, marginVertical: 8 },
  nextCard: { ...StyleSheet.absoluteFill, borderRadius: radius.lg, transform: [{ scale: 0.95 }], opacity: 0.6 },
  limitCard: { flex: 1, backgroundColor: colors.card, borderRadius: radius.lg, padding: 24 },
  controls: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 28, paddingVertical: 18 },
  roundButton: { width: 72, height: 72, borderRadius: 36, borderWidth: 2, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.card },
  smallRound: { width: 52, height: 52, borderColor: colors.cardBorder },
  roundIcon: { fontSize: 30, fontWeight: '800' },
  undoIcon: { color: colors.textMuted, fontSize: 24 },
  bigEmoji: { fontSize: 64, marginBottom: 12 },
  title: { color: colors.text, fontSize: 30, fontWeight: '800', marginBottom: 8, textAlign: 'center' },
  subtitle: { color: colors.textMuted, fontSize: 16, lineHeight: 23, textAlign: 'center', marginBottom: 24 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  thumb: { width: '23.5%', aspectRatio: 1, borderRadius: 6 },
  primaryButton: { backgroundColor: colors.accent, paddingVertical: 18, alignSelf: 'stretch', borderRadius: radius.md, alignItems: 'center' },
  primaryButtonText: { color: colors.text, fontSize: 18, fontWeight: '700' },
  secondaryButton: { borderColor: colors.accent, borderWidth: 2, paddingVertical: 16, alignSelf: 'stretch', borderRadius: radius.md, alignItems: 'center', marginBottom: 12 },
  secondaryButtonText: { color: colors.text, fontSize: 17, fontWeight: '700' },
  linkButton: { paddingVertical: 14, alignItems: 'center' },
  linkText: { color: colors.textMuted, fontSize: 15 },
});
