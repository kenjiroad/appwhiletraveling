import { Platform } from 'react-native';

import { EXERCISE_LABELS } from '@/lib/exercises';
import { isTodayHandled, type Settings } from '@/lib/storage';

import { endSleepActivity, isSleepActivitySupported, startSleepActivity } from '../../modules/debout-alarm';

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

/** Puts the sleeping marmot and the countdown to the alarm on the lock screen. */
export function sayGoodnight(settings: Settings): GoodnightResult {
  if (Platform.OS === 'web' || !isSleepActivitySupported) return 'unsupported';
  const label = EXERCISE_LABELS[settings.exercise];
  try {
    return startSleepActivity(nextAlarmDate(settings), `${settings.reps} ${label.plural}`) ? 'started' : 'disabled';
  } catch {
    return 'disabled';
  }
}

/** Removes the lock screen activity, once the morning is won (or excused). */
export function endGoodnight() {
  endSleepActivity();
}
