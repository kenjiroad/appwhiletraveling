import { getWeekReps } from '@/lib/storage';

export type LeaguePlayer = { name: string; level: number; weekReps: number; isMe: boolean };

export const LEAGUE = { name: 'Ligue Bronze', promoteTop: 3 };

// Until accounts exist (Supabase), the league is filled with clearly labelled demo players
// so the screen can be designed and tested. Their totals grow through the week like real ones would.
export const IS_DEMO_LEAGUE = true;

const DEMO_PLAYERS: { name: string; level: number; dailyReps: number }[] = [
  { name: 'Inès', level: 6, dailyReps: 42 },
  { name: 'Yanis', level: 5, dailyReps: 35 },
  { name: 'Léa', level: 4, dailyReps: 28 },
  { name: 'Hugo', level: 4, dailyReps: 22 },
  { name: 'Sarah', level: 3, dailyReps: 18 },
  { name: 'Nolan', level: 3, dailyReps: 14 },
  { name: 'Chloé', level: 2, dailyReps: 9 },
  { name: 'Mehdi', level: 1, dailyReps: 4 },
];

export function getLeague(myName: string, myLevel: number): LeaguePlayer[] {
  const dayOfWeek = ((new Date().getDay() + 6) % 7) + 1;
  const players: LeaguePlayer[] = DEMO_PLAYERS.map((p) => ({
    name: p.name,
    level: p.level,
    weekReps: p.dailyReps * dayOfWeek,
    isMe: false,
  }));
  players.push({ name: myName, level: myLevel, weekReps: getWeekReps(), isMe: true });
  return players.sort((a, b) => b.weekReps - a.weekReps);
}
