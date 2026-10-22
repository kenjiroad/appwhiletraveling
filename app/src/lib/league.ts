import { getWeekReps } from '@/lib/storage';
import { ensureUserId, isSupabaseConfigured, supabase } from '@/lib/supabase';
import { syncNow } from '@/lib/sync';

export type LeaguePlayer = { name: string; level: number; weekReps: number; isMe: boolean };

export const LEAGUE = { name: 'Ligue Bronze', promoteTop: 3 };

// Without a Supabase project (no app/.env), the league is filled with clearly labelled demo players
// so the screen can be designed and tested. Their totals grow through the week like real ones would.
export const IS_DEMO_LEAGUE = !isSupabaseConfigured;

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

/** Instant, local version of the league: demo players, or just you until the real ranking loads. */
export function getLeague(myName: string, myLevel: number): LeaguePlayer[] {
  const me: LeaguePlayer = { name: myName, level: myLevel, weekReps: getWeekReps(), isMe: true };
  if (!IS_DEMO_LEAGUE) return [me];

  const dayOfWeek = ((new Date().getDay() + 6) % 7) + 1;
  const players: LeaguePlayer[] = DEMO_PLAYERS.map((p) => ({
    name: p.name,
    level: p.level,
    weekReps: p.dailyReps * dayOfWeek,
    isMe: false,
  }));
  players.push(me);
  return players.sort((a, b) => b.weekReps - a.weekReps);
}

type LeagueRow = { name: string; level: number; week_reps: number; is_me: boolean };

/** The real weekly ranking from Supabase, or null in demo mode or when offline. */
export async function fetchLeague(): Promise<LeaguePlayer[] | null> {
  if (!supabase) return null;
  try {
    if (!(await ensureUserId())) return null;
    await syncNow();
    const { data, error } = await supabase.rpc('weekly_league');
    if (error || !data) return null;
    return (data as LeagueRow[]).map((row) => ({
      name: row.name,
      level: row.level,
      weekReps: Number(row.week_reps),
      isMe: row.is_me,
    }));
  } catch {
    return null;
  }
}
