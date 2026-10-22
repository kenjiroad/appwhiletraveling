import { getWeekReps } from '@/lib/storage';

export type LeaguePlayer = { name: string; emoji: string; weekReps: number; isMe: boolean };

export const LEAGUE = { name: 'Ligue Bronze', emoji: '🥉', promoteTop: 3 };

// Until accounts exist (Supabase), the league is filled with clearly labelled demo players
// so the screen can be designed and tested. Their totals grow through the week like real ones would.
export const IS_DEMO_LEAGUE = true;

const DEMO_PLAYERS: { name: string; emoji: string; dailyReps: number }[] = [
  { name: 'Inès', emoji: '🦁', dailyReps: 42 },
  { name: 'Yanis', emoji: '🐂', dailyReps: 35 },
  { name: 'Léa', emoji: '🐓', dailyReps: 28 },
  { name: 'Hugo', emoji: '🐓', dailyReps: 22 },
  { name: 'Sarah', emoji: '🐣', dailyReps: 18 },
  { name: 'Nolan', emoji: '🐣', dailyReps: 14 },
  { name: 'Chloé', emoji: '🐌', dailyReps: 9 },
  { name: 'Mehdi', emoji: '😴', dailyReps: 4 },
];

export function getLeague(myName: string, myEmoji: string): LeaguePlayer[] {
  const dayOfWeek = ((new Date().getDay() + 6) % 7) + 1;
  const players: LeaguePlayer[] = DEMO_PLAYERS.map((p) => ({
    name: p.name,
    emoji: p.emoji,
    weekReps: p.dailyReps * dayOfWeek,
    isMe: false,
  }));
  players.push({ name: myName, emoji: myEmoji, weekReps: getWeekReps(), isMe: true });
  return players.sort((a, b) => b.weekReps - a.weekReps);
}
