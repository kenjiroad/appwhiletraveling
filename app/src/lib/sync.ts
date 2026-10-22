import { getXp, rankFor } from '@/lib/progress';
import { clearPendingDays, getHistory, getPendingDays, getSettings } from '@/lib/storage';
import { ensureUserId, supabase } from '@/lib/supabase';

let running: Promise<void> | null = null;

/**
 * Sends the profile (name, level) and every day not yet synced to Supabase.
 * Fire-and-forget: never throws, and days that fail stay pending for the next call
 * (app start, end of a challenge, settings change).
 */
export function syncNow(): Promise<void> {
  if (!supabase) return Promise.resolve();
  running ??= (async () => {
    try {
      const userId = await ensureUserId();
      if (!userId) return;

      const name = getSettings()?.name?.trim().slice(0, 40) || 'Anonyme';
      const level = rankFor(getXp()).index + 1;
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({ id: userId, name, level, updated_at: new Date().toISOString() });
      if (profileError) return;

      const days = getPendingDays();
      if (days.length === 0) return;
      const history = getHistory();
      const rows = days
        .filter((day) => history[day])
        .map((day) => ({ user_id: userId, day, reps: history[day].reps, done: history[day].done }));
      const { error } = await supabase.from('sessions').upsert(rows);
      if (!error) clearPendingDays(days);
    } catch {
      // Offline or server error: the pending days are retried next time.
    } finally {
      running = null;
    }
  })();
  return running;
}
