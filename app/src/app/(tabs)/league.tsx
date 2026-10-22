import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Body, Card, GhostButton, Label, Title } from '@/components/ui';
import { getLeague, IS_DEMO_LEAGUE, LEAGUE, type LeaguePlayer } from '@/lib/league';
import { getXp, rankFor } from '@/lib/progress';
import { getSettings } from '@/lib/storage';
import { colors, fonts, gradients, radius } from '@/lib/theme';

function loadPlayers() {
  const { rank } = rankFor(getXp());
  return getLeague(getSettings()?.name ?? 'Toi', rank.emoji);
}

export default function LeagueScreen() {
  const [players, setPlayers] = useState(loadPlayers);
  useFocusEffect(useCallback(() => setPlayers(loadPlayers()), []));

  const podium = [players[1], players[0], players[2]].filter(Boolean);
  const daysLeft = 7 - ((new Date().getDay() + 6) % 7) - 1;

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Title>
          {LEAGUE.name} {LEAGUE.emoji}
        </Title>
        <Body>
          {daysLeft > 0 ? `Fin dans ${daysLeft} jour${daysLeft > 1 ? 's' : ''}` : 'Dernier jour !'} · le top {LEAGUE.promoteTop}{' '}
          monte en Ligue Argent 🥈
        </Body>

        <View style={styles.podium}>
          {podium.map((p) => {
            const place = players.indexOf(p) + 1;
            return <PodiumColumn key={p.name} player={p} place={place} />;
          })}
        </View>

        <Card style={{ padding: 8 }}>
          {players.map((p, i) => (
            <View key={p.name}>
              {i === LEAGUE.promoteTop && (
                <View style={styles.zone}>
                  <View style={styles.zoneLine} />
                  <Text style={styles.zoneText}>ZONE DE PROMOTION ↑</Text>
                  <View style={styles.zoneLine} />
                </View>
              )}
              <View style={[styles.row, p.isMe && styles.meRow]}>
                <Text style={styles.place}>{i + 1}</Text>
                <Text style={styles.rowEmoji}>{p.emoji}</Text>
                <Label style={{ flex: 1, color: p.isMe ? colors.onLime : colors.text }} numberOfLines={1}>
                  {p.name}
                  {p.isMe ? ' (toi)' : ''}
                </Label>
                <Text style={[styles.reps, p.isMe && { color: colors.onLime }]}>{p.weekReps}</Text>
              </View>
            </View>
          ))}
        </Card>

        <GhostButton
          label="👊 Défier un pote"
          onPress={() =>
            Share.share({ message: 'Je te défie sur Debout : celui qui fait le plus de pompes au réveil cette semaine gagne. ⏰💪' })
          }
        />
        {IS_DEMO_LEAGUE && (
          <Body style={styles.demo}>Aperçu avec des joueurs fictifs. La vraie ligue arrive avec les comptes.</Body>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const PODIUM_HEIGHTS = [0, 120, 90, 70];

function PodiumColumn({ player, place }: { player: LeaguePlayer; place: number }) {
  return (
    <View style={styles.podiumColumn}>
      <Text style={styles.podiumEmoji}>{player.emoji}</Text>
      <Label numberOfLines={1} style={{ fontSize: 15, color: player.isMe ? colors.lime : colors.text }}>
        {player.isMe ? 'Toi' : player.name}
      </Label>
      <Text style={styles.podiumReps}>{player.weekReps}</Text>
      <LinearGradient
        colors={place === 1 ? gradients.lime : place === 2 ? gradients.hero : gradients.fire}
        style={[styles.podiumBlock, { height: PODIUM_HEIGHTS[place] }]}>
        <Text style={styles.podiumPlace}>{place}</Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 14, paddingBottom: 40 },
  podium: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 10, marginTop: 10 },
  podiumColumn: { flex: 1, alignItems: 'center', gap: 2 },
  podiumEmoji: { fontSize: 40 },
  podiumReps: { color: colors.textMuted, fontFamily: fonts.bold, fontSize: 13, marginBottom: 6 },
  podiumBlock: { alignSelf: 'stretch', borderTopLeftRadius: radius.md, borderTopRightRadius: radius.md, alignItems: 'center', paddingTop: 8 },
  podiumPlace: { color: colors.onLime, fontFamily: fonts.black, fontSize: 30 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, paddingHorizontal: 12, borderRadius: radius.md },
  meRow: { backgroundColor: colors.lime },
  place: { color: colors.textMuted, fontFamily: fonts.black, fontSize: 16, width: 22 },
  rowEmoji: { fontSize: 22 },
  reps: { color: colors.text, fontFamily: fonts.black, fontSize: 17 },
  zone: { flexDirection: 'row', alignItems: 'center', gap: 8, marginVertical: 6, paddingHorizontal: 8 },
  zoneLine: { flex: 1, height: 1, backgroundColor: colors.lime, opacity: 0.4 },
  zoneText: { color: colors.lime, fontFamily: fonts.black, fontSize: 11, letterSpacing: 1 },
  demo: { fontSize: 13, textAlign: 'center' },
});
