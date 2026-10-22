import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import type { Exercise } from '../../modules/rep-counter';

export type Settings = {
  hour: number;
  minute: number;
  enabled: boolean;
  exercise: Exercise;
  reps: number;
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
const HISTORY_KEY = 'completed_days';

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

function getCompletedDays(): string[] {
  return readJson<string[]>(HISTORY_KEY, []);
}

export function markTodayCompleted() {
  const days = new Set(getCompletedDays());
  days.add(dayKey());
  // Keep the last year only; the streak never needs more.
  store.setItem(HISTORY_KEY, JSON.stringify([...days].sort().slice(-366)));
}

export function isTodayCompleted() {
  return getCompletedDays().includes(dayKey());
}

/** Consecutive completed days ending today (or yesterday, if today isn't done yet). */
export function getStreak() {
  const days = new Set(getCompletedDays());
  const cursor = new Date();
  if (!days.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);

  let streak = 0;
  while (days.has(dayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
