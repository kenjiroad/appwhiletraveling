import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { EXERCISE_LABELS } from '@/lib/exercises';
import { DEFAULT_SETTINGS, dayKey, getWakeCheck, isTodayHandled, type Settings } from '@/lib/storage';

import {
  cancelAlarmKitBetween,
  cancelAllAlarmKit,
  getAlarmKitAuthorizationState,
  getAlarmKitScheduledCount,
  isAlarmKitAuthorized,
  requestAlarmKitAuthorizationAsync,
  scheduleAlarmKitAsync,
} from '../../modules/debout-alarm';

// On iOS 26+ the alarm rings through AlarmKit, like the Clock app (full screen, even in
// silent mode). "Arrêter" only buys 2 minutes: the next alarm of the series rings until the
// challenge is done. Elsewhere it falls back to notifications: one at the alarm time, then a
// reminder every minute. iOS keeps at most 64 pending notifications, so we plan a few days
// ahead and re-plan every time the app opens.
const DAYS_AHEAD = 5;
const REMINDERS_PER_DAY = 10;
const ALARMKIT_DAYS_AHEAD = 3;
const ALARMKIT_RINGS_PER_DAY = 6;
const ALARMKIT_MINUTES_BETWEEN_RINGS = 2;

/** How long after the alarm time opening the app sends you straight to the challenge. */
const ALARM_WINDOW_MINUTES = 60;

// Local notifications don't exist on web; the browser preview just skips the alarm.
const supported = Platform.OS !== 'web';

/** Asks for the AlarmKit permission if it was never asked (e.g. onboarding done on an older build). */
export async function ensureAlarmPermissionAsync() {
  if (getAlarmKitAuthorizationState() !== 'notDetermined') return false;
  return requestAlarmKitAuthorizationAsync();
}

export async function requestAlarmPermissionAsync() {
  if (!supported) return false;
  const alarmKit = await requestAlarmKitAuthorizationAsync();
  const { granted } = await Notifications.requestPermissionsAsync();
  return alarmKit || granted;
}

/** The alarm times of the next `days` days, today's skipped once the challenge is done. */
function upcomingDates(settings: Settings, days: number, perDay: number, minutesBetween: number) {
  const now = new Date();
  const skipToday = isTodayHandled();
  const dates: Date[] = [];
  for (let day = 0; day < days; day++) {
    if (day === 0 && skipToday) continue;
    for (let i = 0; i < perDay; i++) {
      const date = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + day,
        settings.hour,
        settings.minute + i * minutesBetween
      );
      if (date > now) dates.push(date);
    }
  }
  return dates;
}

export type AlarmStatus = {
  /** How the alarm will ring: like the Clock app (AlarmKit), as notifications, or not at all. */
  mode: 'alarmkit' | 'notifications' | 'off';
  /** Rings planned in advance. */
  planned: number;
  /** Why AlarmKit isn't used, when it should be. */
  problem?: string;
  /** What fixes it: ask for the permission, or open the iPhone settings. */
  fix?: 'request' | 'settings';
};

let lastProblem: string | undefined;

/** Shown in the settings, to understand why an alarm didn't ring. */
export async function getAlarmStatus(settings: Settings | null): Promise<AlarmStatus> {
  if (!supported || !settings?.enabled) return { mode: 'off', planned: 0 };
  const state = getAlarmKitAuthorizationState();
  if (state === 'authorized' && !lastProblem) {
    const planned = getAlarmKitScheduledCount();
    return planned > 0
      ? { mode: 'alarmkit', planned }
      : { mode: 'off', planned: 0, problem: 'Réveil iOS autorisé, mais aucune sonnerie programmée. Touche « Tester ».' };
  }
  const planned = (await Notifications.getAllScheduledNotificationsAsync()).filter((n) => n.identifier !== 'bedtime').length;
  const mode = planned > 0 ? 'notifications' : 'off';
  if (lastProblem) return { mode, planned, problem: lastProblem };
  if (state === 'notDetermined')
    return { mode, planned, problem: 'Le réveil iOS n’a pas encore été autorisé.', fix: 'request' };
  if (state === 'denied')
    return { mode, planned, problem: 'Le réveil iOS est refusé : Réglages → Debout → Alarmes.', fix: 'settings' };
  return { mode, planned, problem: 'Réveil iOS indisponible : il faut iOS 26 et la dernière version de l’app.' };
}

type Ring = { date: Date; title: string };

/** Every ring to plan: the alarms, the optional test, and the "Toujours debout ?" follow-up. */
function rings(settings: Settings, days: number, perDay: number, minutesBetween: number, testDate?: Date): Ring[] {
  const label = EXERCISE_LABELS[settings.exercise];
  const list: Ring[] = settings.enabled
    ? upcomingDates(settings, days, perDay, minutesBetween).map((date) => ({
        date,
        title: `Debout ! ${settings.reps} ${label.plural}`,
      }))
    : [];
  const wakeCheck = getWakeCheck();
  if (wakeCheck) list.push({ date: wakeCheck, title: 'Toujours debout ? 👀' });
  if (testDate) list.push({ date: testDate, title: `Debout ! ${settings.reps} ${label.plural}` });
  return list.sort((a, b) => a.date.getTime() - b.date.getTime());
}

/** Bedtime = alarm time minus the sleep goal (8 h by default). */
export function bedtimeFor(settings: Settings) {
  const total = settings.hour * 60 + settings.minute - (settings.sleepGoalMinutes ?? DEFAULT_SETTINGS.sleepGoalMinutes!);
  const minutes = ((total % 1440) + 1440) % 1440;
  return { hour: Math.floor(minutes / 60), minute: minutes % 60 };
}

/**
 * Plans the next alarms. `testDate` adds one extra ring (the "test in 1 minute" button).
 * If AlarmKit fails for any reason, notifications take over so the alarm still goes off.
 */
export async function scheduleAlarms(settings: Settings, testDate?: Date) {
  if (!supported) return;
  await Notifications.cancelAllScheduledNotificationsAsync();
  cancelAllAlarmKit();
  await scheduleBedtimeReminder(settings);

  const label = EXERCISE_LABELS[settings.exercise];

  if (isAlarmKitAuthorized()) {
    const planned = rings(settings, ALARMKIT_DAYS_AHEAD, ALARMKIT_RINGS_PER_DAY, ALARMKIT_MINUTES_BETWEEN_RINGS, testDate);
    if (planned.length === 0) return;
    try {
      await scheduleAlarmKitAsync(planned);
      lastProblem = undefined;
      return;
    } catch (error) {
      lastProblem = `Réveil iOS en erreur : ${error instanceof Error ? error.message : String(error)}`;
    }
  }

  for (const [i, ring] of rings(settings, DAYS_AHEAD, REMINDERS_PER_DAY, 1, testDate).entries()) {
    const first = ring.date.getHours() === settings.hour && ring.date.getMinutes() === settings.minute;
    await Notifications.scheduleNotificationAsync({
      identifier: `alarm-${dayKey(ring.date)}-${i}`,
      content: {
        title: first || ring.date === testDate ? '⏰ Debout !' : ring.title.startsWith('Toujours') ? ring.title : 'Toujours au lit ? 👀',
        body: `${settings.reps} ${label.plural} pour arrêter le réveil.`,
        sound: true,
        interruptionLevel: 'timeSensitive',
        data: { url: '/challenge' },
      },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: ring.date },
    });
  }
}

/** Every evening at bedtime: "C'est l'heure de dormir". Tapping it says good night to the marmot. */
async function scheduleBedtimeReminder(settings: Settings) {
  if (!settings.enabled || settings.bedtimeReminder === false) return;
  const { hour, minute } = bedtimeFor(settings);
  const goal = (settings.sleepGoalMinutes ?? DEFAULT_SETTINGS.sleepGoalMinutes!) / 60;
  await Notifications.scheduleNotificationAsync({
    identifier: 'bedtime',
    content: {
      title: 'C’est l’heure de dormir 🌙',
      body: `Pour tes ${String(goal).replace('.', ',')} h de sommeil avant ${String(settings.hour).padStart(2, '0')}:${String(settings.minute).padStart(2, '0')}. Touche pour dire bonne nuit à ta marmotte.`,
      sound: true,
      data: { action: 'goodnight' },
    },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour, minute },
  });
}

/** Removes every planned alarm, e.g. when the subscription has ended. */
export async function cancelAlarms() {
  if (!supported) return;
  await Notifications.cancelAllScheduledNotificationsAsync();
  cancelAllAlarmKit();
}

/** True from the alarm time until an hour later, as long as today's challenge isn't done. */
export function isAlarmDue(settings: Settings | null, now = new Date()) {
  if (!settings?.enabled || isTodayHandled()) return false;
  const alarm = new Date(now.getFullYear(), now.getMonth(), now.getDate(), settings.hour, settings.minute);
  const minutesSince = (now.getTime() - alarm.getTime()) / 60_000;
  return minutesSince >= 0 && minutesSince < ALARM_WINDOW_MINUTES;
}

/** Called once the challenge is done: today's remaining reminders go away. */
export async function cancelTodayReminders() {
  if (!supported) return;
  const now = new Date();
  cancelAlarmKitBetween(now, new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1));
  const today = dayKey();
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    scheduled
      .filter((n) => n.identifier.startsWith(`alarm-${today}-`))
      .map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier))
  );
}
