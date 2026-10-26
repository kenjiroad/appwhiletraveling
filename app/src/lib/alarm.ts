import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { EXERCISE_LABELS } from '@/lib/exercises';
import { dayKey, isTodayCompleted, type Settings } from '@/lib/storage';

import {
  cancelAlarmKitBetween,
  cancelAllAlarmKit,
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

export async function requestAlarmPermissionAsync() {
  if (!supported) return false;
  const alarmKit = await requestAlarmKitAuthorizationAsync();
  const { granted } = await Notifications.requestPermissionsAsync();
  return alarmKit || granted;
}

/** The alarm times of the next `days` days, today's skipped once the challenge is done. */
function upcomingDates(settings: Settings, days: number, perDay: number, minutesBetween: number) {
  const now = new Date();
  const skipToday = isTodayCompleted();
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

export async function scheduleAlarms(settings: Settings) {
  if (!supported) return;
  await Notifications.cancelAllScheduledNotificationsAsync();
  cancelAllAlarmKit();
  if (!settings.enabled) return;

  const label = EXERCISE_LABELS[settings.exercise];

  if (isAlarmKitAuthorized()) {
    const dates = upcomingDates(settings, ALARMKIT_DAYS_AHEAD, ALARMKIT_RINGS_PER_DAY, ALARMKIT_MINUTES_BETWEEN_RINGS);
    await scheduleAlarmKitAsync(dates, `Debout ! ${settings.reps} ${label.plural}`);
    return;
  }

  const now = new Date();
  const skipToday = isTodayCompleted();

  for (let day = 0; day < DAYS_AHEAD; day++) {
    if (day === 0 && skipToday) continue;

    for (let i = 0; i < REMINDERS_PER_DAY; i++) {
      const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + day, settings.hour, settings.minute + i);
      if (date <= now) continue;

      await Notifications.scheduleNotificationAsync({
        identifier: `alarm-${dayKey(date)}-${i}`,
        content: {
          title: i === 0 ? '⏰ Debout !' : 'Toujours au lit ? 👀',
          body: `${settings.reps} ${label.plural} pour arrêter le réveil.`,
          sound: true,
          interruptionLevel: 'timeSensitive',
          data: { url: '/challenge' },
        },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date },
      });
    }
  }
}

/** Removes every planned alarm, e.g. when the subscription has ended. */
export async function cancelAlarms() {
  if (!supported) return;
  await Notifications.cancelAllScheduledNotificationsAsync();
  cancelAllAlarmKit();
}

/** True from the alarm time until an hour later, as long as today's challenge isn't done. */
export function isAlarmDue(settings: Settings | null, now = new Date()) {
  if (!settings?.enabled || isTodayCompleted()) return false;
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
