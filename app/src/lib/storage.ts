import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import type { Exercise } from '../../modules/rep-counter';

export type Settings = {
  hour: number;
  minute: number;
  enabled: boolean;
  exercise: Exercise;
  reps: number;
  name?: string;
};

// SecureStore has no web implementation; the browser preview keeps data in localStorage.
const store =
  Platform.OS === 'web'
    ? {
        getItem: (key: string) => globalThis.localStorage?.getItem(key) ?? null,
        setItem: (key: string, value: string) => globalThis.localStorage?.setItem(key, value),
      }
    : { getItem: SecureStore.getItem, setItem: SecureStore.setItem };

const SETTINGS_KEY = 'settings';
const HISTORY_KEY = 'history';
const PENDING_SYNC_KEY = 'pending-sync';

export type DayRecord = { reps: number; done: boolean };

export const DEFAULT_SETTINGS: Settings = { hour: 7, minute: 0, enabled: true, exercise: 'pushup', reps: 15 };

function readJson<T>(key: string, fallback: T): T {
  const raw = store.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function getSettings(): Settings | null {
  return readJson<Settings | null>(SETTINGS_KEY, null);
}

export function saveSettings(settings: Settings) {
  store.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function dayKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getHistory(): Record<string, DayRecord> {
  return readJson<Record<string, DayRecord>>(HISTORY_KEY, {});
}

/** Adds a finished session to today's total; `done` marks the daily challenge as completed. */
export function recordSession(reps: number, done: boolean) {
  const history = getHistory();
  const today = history[dayKey()] ?? { reps: 0, done: false };
  history[dayKey()] = { reps: today.reps + reps, done: today.done || done };
  store.setItem(HISTORY_KEY, JSON.stringify(history));
  markDayPending(dayKey());
}

/** Days whose totals still have to be sent to the server (kept until a sync succeeds). */
export function getPendingDays(): string[] {
  return readJson<string[]>(PENDING_SYNC_KEY, []);
}

function markDayPending(day: string) {
  const pending = getPendingDays();
  if (!pending.includes(day)) store.setItem(PENDING_SYNC_KEY, JSON.stringify([...pending, day]));
}

export function clearPendingDays(synced: string[]) {
  store.setItem(PENDING_SYNC_KEY, JSON.stringify(getPendingDays().filter((d) => !synced.includes(d))));
}

export function isTodayCompleted() {
  return getHistory()[dayKey()]?.done ?? false;
}

/** Consecutive completed days ending today (or yesterday, if today isn't done yet). */
export function getStreak() {
  const history = getHistory();
  const cursor = new Date();
  if (!history[dayKey(cursor)]?.done) cursor.setDate(cursor.getDate() - 1);

  let streak = 0;
  while (history[dayKey(cursor)]?.done) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function getBestStreak() {
  const history = getHistory();
  const days = Object.keys(history)
    .filter((d) => history[d].done)
    .sort();
  let best = 0;
  let current = 0;
  let previous: Date | null = null;
  for (const day of days) {
    const date = new Date(`${day}T12:00:00`);
    const consecutive = previous && Math.round((date.getTime() - previous.getTime()) / 86_400_000) === 1;
    current = consecutive ? current + 1 : 1;
    best = Math.max(best, current);
    previous = date;
  }
  return best;
}

export function getTotals() {
  const records = Object.values(getHistory());
  return {
    reps: records.reduce((sum, r) => sum + r.reps, 0),
    completedDays: records.filter((r) => r.done).length,
  };
}

/** Reps since Monday of the current week. */
export function getWeekReps() {
  const history = getHistory();
  const cursor = new Date();
  const daysSinceMonday = (cursor.getDay() + 6) % 7;
  let total = 0;
  for (let i = 0; i <= daysSinceMonday; i++) {
    total += history[dayKey(cursor)]?.reps ?? 0;
    cursor.setDate(cursor.getDate() - 1);
  }
  return total;
}
