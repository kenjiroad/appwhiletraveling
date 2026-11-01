import { AppState, Platform } from 'react-native';

import { EXERCISE_LABELS } from '@/lib/exercises';
import { isTodayHandled, type Settings } from '@/lib/storage';
import { ensureUserId, isSupabaseConfigured, supabase } from '@/lib/supabase';

import {
  addSleepActivityTokenListener,
  endSleepActivity,
  isSleepActivitySupported,
  refreshSleepActivity,
  startSleepActivity,
} from '../../modules/debout-alarm';

/** The next time the alarm will ring: today if it's still ahead and not done yet, otherwise tomorrow. */
export function nextAlarmDate(settings: Settings, now = new Date()) {
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), settings.hour, settings.minute);
  if (date <= now || isTodayHandled()) date.setDate(date.getDate() + 1);
  return date;
}

/** "Bonne nuit" makes sense from 12 h to 1 h before the alarm. */
export function canSayGoodnight(settings: Settings | null, now = new Date()) {
  if (!settings?.enabled) return false;
  const hours = (nextAlarmDate(settings, now).getTime() - now.getTime()) / 3_600_000;
  return hours > 1 && hours <= 12;
}

export type GoodnightResult = 'started' | 'disabled' | 'unsupported';

/**
 * Puts the sleeping marmot and the countdown to the alarm on the lock screen. With Supabase set up,
 * the server then moves the marmot along the night every few minutes (see `supabase/functions/sleep-tick`).
 */
export function sayGoodnight(settings: Settings): GoodnightResult {
  if (Platform.OS === 'web' || !isSleepActivitySupported) return 'unsupported';
  const label = EXERCISE_LABELS[settings.exercise];
  const alarm = nextAlarmDate(settings);
  try {
    const started = startSleepActivity(alarm, `${settings.reps} ${label.plural}`, isSupabaseConfigured);
    if (started) pendingNight = { bedtime: new Date(), alarm };
    return started ? 'started' : 'disabled';
  } catch {
    return 'disabled';
  }
}

/** Removes the lock screen activity, once the morning is won (or excused). */
export function endGoodnight() {
  endSleepActivity();
  void forgetNight();
}

// --- Server side: the marmot that moves during the night ----------------------------------

let pendingNight: { bedtime: Date; alarm: Date } | null = null;

/** iOS hands a push token for the activity: the server needs it (and the night's times) to move the marmot. */
async function rememberNight(token: string) {
  if (!supabase || !pendingNight) return;
  const userId = await ensureUserId();
  if (!userId) return;
  await supabase.from('sleep_activities').upsert({
    user_id: userId,
    push_token: token,
    bedtime_at: pendingNight.bedtime.toISOString(),
    alarm_at: pendingNight.alarm.toISOString(),
  });
}

async function forgetNight() {
  pendingNight = null;
  if (!supabase) return;
  const userId = await ensureUserId();
  if (userId) await supabase.from('sleep_activities').delete().eq('user_id', userId);
}

/** Called once at launch: listens for push tokens, and moves the marmot when the app opens at night. */
export function startSleepActivitySync() {
  if (Platform.OS === 'web') return () => {};
  const subscription = addSleepActivityTokenListener((token) => void rememberNight(token).catch(() => {}));
  refreshSleepActivity();
  const appState = AppState.addEventListener('change', (state) => {
    if (state === 'active') refreshSleepActivity();
  });
  return () => {
    subscription?.remove();
    appState.remove();
  };
}
