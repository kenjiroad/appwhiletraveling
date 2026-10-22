import * as Notifications from 'expo-notifications';

import { EXERCISE_LABELS } from '@/lib/exercises';
import { dayKey, isTodayCompleted, type Settings } from '@/lib/storage';

// V1 rings through notifications: one at the alarm time, then a reminder every minute
// until the challenge is done. iOS keeps at most 64 pending notifications, so we plan
// a few days ahead and re-plan every time the app opens.
// TODO: switch to AlarmKit (iOS 26) so the alarm rings like the system clock, even in silent mode.
const DAYS_AHEAD = 5;
const REMINDERS_PER_DAY = 10;

export async function requestNotificationPermissionAsync() {
  const { granted } = await Notifications.requestPermissionsAsync();
  return granted;
}

export async function scheduleAlarms(settings: Settings) {
  await Notifications.cancelAllScheduledNotificationsAsync();
  if (!settings.enabled) return;

  const now = new Date();
  const skipToday = isTodayCompleted();
  const label = EXERCISE_LABELS[settings.exercise];

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

/** Called once the challenge is done: today's remaining reminders go away. */
export async function cancelTodayReminders() {
  const today = dayKey();
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    scheduled
      .filter((n) => n.identifier.startsWith(`alarm-${today}-`))
      .map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier))
  );
}
