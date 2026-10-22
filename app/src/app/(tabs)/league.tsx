import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Aurora } from '@/components/aurora';
import { Body, Eyebrow, GhostButton, Glass, Label, Serif } from '@/components/ui';
import { getLeague, IS_DEMO_LEAGUE, LEAGUE, type LeaguePlayer } from '@/lib/league';
import { getXp, rankFor } from '@/lib/progress';
import { getSettings } from '@/lib/storage';
import { colors, fonts, gradients, radius } from '@/lib/theme';

function loadPlayers() {
  return getLeague(getSettings()?.name || 'Toi', rankFor(getXp()).index + 1);
}

function Avatar({ player, size = 40 }: { player: LeaguePlayer; size?: number }) {
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }, player.isMe && styles.avatarMe]}>
      <Text style={[styles.avatarText, { fontSize: size * 0.42 }, player.isMe && { color: colors.onSun }]}>
        {player.name.charAt(0).toUpperCase()}
      </Text>
    </View>
  );
}

export default function LeagueScreen() {
  const [players, setPlayers] = useState(loadPlayers);
  useFocusEffect(useCallback(() => setPlayers(loadPlayers()), []));

  const top = players.slice(0, 3);
  const podiumOrder = [top[1], top[0], top[2]].filter(Boolean);
  const daysLeft = 6 - ((new Date().getDay() + 6) % 7);

  return (
    <View style={styles.screen}>
      <Aurora warmth={0.25} />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.duration(500)}>
            <Eyebrow>{daysLeft > 0 ? `Fin dans ${daysLeft} jour${daysLeft > 1 ? 's' : ''}` : 'Dernier jour'}</Eyebrow>
            <Serif>{LEAGUE.name}</Serif>
            <Body>Le top {LEAGUE.promoteTop} monte en Ligue Argent.</Body>
          </Animated.View>

          <View style={styles.podium}>
            {podiumOrder.map((p, i) => {
              const place = players.indexOf(p) + 1;
              const height = place === 1 ? 128 : place === 2 ? 96 : 72;
              return (
                <Animated.View key={p.name} entering={FadeInUp.delay(150 + i * 120).springify().damping(14)} style={styles.podiumColumn}>
                  <Avatar player={p} size={place === 1 ? 58 : 48} />
                  <Label numberOfLines={1} style={{ fontSize: 15, marginTop: 6 }}>
                    {p.isMe ? 'Toi' : p.name}
                  </Label>
                  <Text style={styles.podiumReps}>{p.weekReps} reps</Text>
                  <View style={[styles.podiumBlock, { height }]}>
                    {place === 1 && <LinearGradient colors={gradients.sun} style={StyleSheet.absoluteFill} />}
                    <Serif style={[styles.podiumPlace, place === 1 && { color: colors.onSun }]}>{place}</Serif>
                  </View>
                </Animated.View>
              );
            })}
          </View>

          <Animated.View entering={FadeInDown.delay(400).duration(600)}>
            <Glass style={{ padding: 8 }}>
              {players.map((p, i) => (
                <View key={p.name}>
                  {i === LEAGUE.promoteTop && (
                    <View style={styles.zone}>
                      <View style={styles.zoneLine} />
                      <Text style={styles.zoneText}>Zone de promotion</Text>
                      <View style={styles.zoneLine} />
                    </View>
                  )}
                  <View style={[styles.row, p.isMe && styles.meRow]}>
                    <Text style={styles.place}>{i + 1}</Text>
                    <Avatar player={p} size={34} />
                    <View style={{ flex: 1 }}>
                      <Label numberOfLines={1}>{p.isMe ? `${p.name} (toi)` : p.name}</Label>
                      <Text style={styles.level}>Niv. {p.level}</Text>
                    </View>
                    <Serif style={styles.reps}>{p.weekReps}</Serif>
                  </View>
                </View>
              ))}
            </Glass>
          </Animated.View>

          <GhostButton
            label="Défier un pote"
            onPress={() =>
              Share.share({ message: 'Je te défie sur Debout : celui qui fait le plus de pompes au réveil cette semaine gagne.' })
            }
          />
          {IS_DEMO_LEAGUE && <Body style={styles.demo}>Aperçu avec des joueurs fictifs. La vraie ligue arrive avec les comptes.</Body>}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.night },
  content: { padding: 22, gap: 18, paddingBottom: 130 },
  podium: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, marginTop: 8 },
  podiumColumn: { flex: 1, alignItems: 'center' },
  podiumReps: { color: colors.textMuted, fontFamily: fonts.medium, fontSize: 13, marginBottom: 8 },
  podiumBlock: {
    alignSelf: 'stretch',
    borderTopLeftRadius: radius.md,
    borderTopRightRadius: radius.md,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    alignItems: 'center',
    paddingTop: 6,
    overflow: 'hidden',
  },
  podiumPlace: { fontSize: 40, lineHeight: 46 },
  avatar: { backgroundColor: colors.nightHigh, borderWidth: 1, borderColor: colors.glassBorder, alignItems: 'center', justifyContent: 'center' },
  avatarMe: { backgroundColor: colors.gold, borderColor: colors.gold },
  avatarText: { color: colors.text, fontFamily: fonts.serif },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, paddingHorizontal: 12, borderRadius: radius.md },
  meRow: { backgroundColor: 'rgba(255,196,107,0.14)', borderWidth: 1, borderColor: 'rgba(255,196,107,0.5)' },
  place: { color: colors.textFaint, fontFamily: fonts.semibold, fontSize: 14, width: 18 },
  level: { color: colors.textMuted, fontFamily: fonts.regular, fontSize: 13 },
  reps: { fontSize: 26, lineHeight: 30 },
  zone: { flexDirection: 'row', alignItems: 'center', gap: 8, marginVertical: 6, paddingHorizontal: 8 },
  zoneLine: { flex: 1, height: 1, backgroundColor: colors.gold, opacity: 0.35 },
  zoneText: { color: colors.gold, fontFamily: fonts.semibold, fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase' },
  demo: { fontSize: 13, textAlign: 'center' },
});
